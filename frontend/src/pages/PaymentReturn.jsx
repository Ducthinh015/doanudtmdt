import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

const PaymentReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Đang xác minh thanh toán...");
  const [details, setDetails] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";

  useEffect(() => {
    const verify = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const payload = {};
        for (const [k, v] of params.entries()) {
          payload[k] = v;
        }
        if (!payload.vnp_SecureHash) {
          setStatus("Thiếu tham số chữ ký. Không thể xác minh.");
          return;
        }
        const res = await axios.post(`${API_BASE}/api/v1/vnpay/verify`, payload);
        setDetails(res.data);
        if (res.data?.success) {
          setStatus("Thanh toán hợp lệ. Đang đưa bạn về lịch sử đơn hàng...");
          setTimeout(() => navigate("/profile/orderHistory"), 2000);
        } else {
          setStatus("Thanh toán không thành công hoặc chữ ký sai.");
        }
      } catch (error) {
        console.error(error);
        setStatus("Không thể xác minh thanh toán");
      }
    };
    verify();
  }, [location.search, API_BASE, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] via-black to-black text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold mb-4">Kết quả thanh toán</h1>
        <p className="mb-6">{status}</p>
        {details && (
          <div className="bg-white/10 p-4 rounded border border-white/20">
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(details, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReturn;
