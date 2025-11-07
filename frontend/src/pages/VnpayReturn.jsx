import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

const VnpayReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("Đang xử lý thanh toán...");
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
  };

  useEffect(() => {
    const run = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const payload = {};
        for (const [k, v] of searchParams.entries()) {
          payload[k] = v;
        }

        // Verify with backend
        const verifyRes = await axios.post(`${API_BASE}/api/v1/vnpay/verify`, payload, { headers });

        if (verifyRes.data?.success) {
          setStatus("Thanh toán thành công. Đang tạo đơn hàng...");

          // fetch cart
          const cartRes = await axios.get(`${API_BASE}/api/v1/get-user-cart`, { headers });
          const cart = cartRes.data?.data || [];

          if (cart.length === 0) {
            setStatus("Giỏ hàng trống sau thanh toán. Vui lòng kiểm tra lịch sử đơn hàng.");
            navigate("/profile/orderHistory");
            return;
          }

          // place order
          const orderRes = await axios.post(
            `${API_BASE}/api/v1/place-order`,
            { order: cart },
            { headers }
          );

          if (orderRes.data?.status === "Success") {
            setStatus("Đặt hàng thành công!");
            navigate("/profile/orderHistory");
          } else {
            setStatus("Thanh toán thành công nhưng tạo đơn hàng thất bại.");
          }
        } else {
          setStatus("Thanh toán thất bại hoặc bị hủy.");
        }
      } catch (e) {
        console.error(e);
        setStatus("Có lỗi xảy ra khi xử lý thanh toán.");
      }
    };

    run();
  }, [location.search]);

  return (
    <div className="h-screen bg-gradient-to-b from-[#0a192f] to-white text-white overflow-hidden">
      <Navbar />
      <div className="h-screen overflow-y-auto p-8 custom-scrollbar flex items-center justify-center">
        <h1 className="text-2xl font-semibold">{status}</h1>
      </div>
    </div>
  );
};

export default VnpayReturn;
