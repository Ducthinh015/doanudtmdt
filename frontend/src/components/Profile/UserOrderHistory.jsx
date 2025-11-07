import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

const UserOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/v1/get-order-history`, { headers });
        setOrderHistory(res.data.data);
      } catch (err) {
        console.error("Error fetching order history:", err);
      }
    };
    fetch();
  }, []);

  return (
    <>
      {!orderHistory && (
        <div className="flex items-center justify-center h-[100%]">
          <Loader />
        </div>
      )}

      {orderHistory && orderHistory.length === 0 && (
        <div className="h-[88vh] p-4 text-white">
          <div className="h-[100%] flex flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold text-white mb-8 opacity-40">
              Chưa có đơn hàng
            </h1>
            <img src="" alt="img" />
          </div>
        </div>
      )}

      {orderHistory && orderHistory.length > 0 && (
        <div className="min-h-[70vh] p-0 md:p-4 text-white">
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-8">
            Lịch sử đơn hàng
          </h1>

          <div className="mt-4 bg-white/25 w-full rounded py-2 px-4 flex gap-2 font-bold flex-wrap">
            <div className="w-[3%] min-w-[30px]"><h1 className="text-center">STT</h1></div>
            <div className="w-[22%] min-w-[100px]"><h1>Sách</h1></div>
            <div className="w-[45%] min-w-[130px]"><h1>Mô tả</h1></div>
            <div className="w-[4%] min-w-[70px]"><h1>Giá</h1></div>
            <div className="w-[10%] min-w-[90px]"><h1>Trạng thái</h1></div>
            <div className="w-none md:w-[5%] hidden md:block min-w-[50px]"><h1>Hình thức</h1></div>
          </div>

          {orderHistory.map((items, i) => (
            <div
              className="bg-white/30 w-full border text-white rounded py-2 px-4 flex gap-4 flex-wrap hover:bg:beige"
              key={i}
            >
              <div className="w-[3%] min-w-[30px]">
                <h1 className="text-center">{i + 1}</h1>
              </div>

              <div className="w-[22%] min-w-[100px]">
                <Link
                  to={
                    items.book?._id
                      ? `/view-book-details/${items.book._id}`
                      : "#"
                  }
                  className="hover:text-blue"
                >
                  {items.book?.title || "Không xác định"}
                </Link>
              </div>

              <h1 className="w-[45%] min-w-[130px]">
                {items.book?.desc?.slice(0, 50) || "Không có mô tả"}...
              </h1>
              <h1 className="w-[4%] min-w-[70px]">
                {items.book?.price ? Number(items.book.price).toLocaleString("vi-VN") + " ₫" : "N/A"}
              </h1>

              <div className="w-[10%] min-w-[90px]">
                <h1 className="font-semibold text-green">
                  {items.status === "Order Placed" || items.status === "Order placed" || items.status === "order placed" ? (
                    <div className="text-yellow-50">Đã đặt hàng</div>
                  ) : items.status === "Out for delivery" ? (
                    <div className="text-blue-300">Đang giao</div>
                  ) : items.status === "Delivered" ? (
                    <div className="text-green-500">Đã giao</div>
                  ) : items.status === "Canceled" ? (
                    <div className="text-red-500">Đã hủy</div>
                  ) : (
                    items.status
                  )}
                </h1>
              </div>

              <div className="w-none md:w-[5%] hidden md:block min-w-[50px]">
                <h1 className="text-sm text-white">COD</h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UserOrderHistory;
