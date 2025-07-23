import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

const UserOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState(null);

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          "https://bookcove.onrender.com/api/v1/get-order-history",
          { headers }
        );
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
              No Order History
            </h1>
            <img src="" alt="img" />
          </div>
        </div>
      )}

      {orderHistory && orderHistory.length > 0 && (
        <div className="min-h-[70vh] p-0 md:p-4 text-white">
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-8">
            Your Order History
          </h1>

          <div className="mt-4 bg-white/25 w-full rounded py-2 px-4 flex gap-2 font-bold flex-wrap">
            <div className="w-[3%] min-w-[30px]">
              <h1 className="text-center">Sr.</h1>
            </div>
            <div className="w-[22%] min-w-[100px]">
              <h1>Books</h1>
            </div>
            <div className="w-[45%] min-w-[130px]">
              <h1>Description</h1>
            </div>
            <div className="w-[4%] min-w-[70px]">
              <h1>Price</h1>
            </div>
            <div className="w-[10%] min-w-[90px]">
              <h1>Status</h1>
            </div>
            <div className="w-none md:w-[5%] hidden md:block min-w-[50px]">
              <h1>Model</h1>
            </div>
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
                  {items.book?.title || "Unknown Book"}
                </Link>
              </div>

              <h1 className="w-[45%] min-w-[130px]">
                {items.book?.desc?.slice(0, 50) || "No description"}...
              </h1>
              <h1 className="w-[4%] min-w-[70px]">
                {items.book?.price || "N/A"}
              </h1>

              <div className="w-[10%] min-w-[90px]">
                <h1 className="font-semibold text-green">
                  {items.status === "order placed" ? (
                    <div className="text-yellow-50">{items.status}</div>
                  ) : items.status === "Canceled" ? (
                    <div className="text-red-500">{items.status}</div>
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
