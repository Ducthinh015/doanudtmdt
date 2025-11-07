import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";
import CallMissedOutgoingIcon from "@mui/icons-material/CallMissedOutgoing";
import SeeUserData from "./SeeUserData";

const AllOrders = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";
  const [options, setOptions] = useState(-1);
  const [allOrders, setAllOrders] = useState();
  const [values, setValues] = useState({ status: "" });
  const [userDiv, setUserDiv] = useState("hidden");
  const [userDivData, setUserDivData] = useState();

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/v1/get-all-orders`, { headers });
        setAllOrders(res.data.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetch();
  }, []);

  const change = (e) => {
    const { value } = e.target;
    setValues({ status: value });
  };

  const submitChanges = async (i) => {
    const id = allOrders[i]._id;
    const res = await axios.put(
      `${API_BASE}/api/v1/update-status/${id}`,
      values,
      { headers }
    );
    alert(res.data.message);
  };

  const setOption = (i) => {
    setOptions(i);
  };

  return (
    <div className="overflow-x-hidden">
      {!allOrders && (
        <div className="flex items-center justify-center h-[100%]">
          <Loader />
        </div>
      )}

      {allOrders && allOrders.length > 0 && (
        <div className="min-h-screen p-4 text-white overflow-y-auto">
          <h1 className="text-3xl sm:text-2xl md:text-5xl font-semibold text-white mb-8">
            Tất cả đơn hàng
          </h1>

          {/* Scrollable table container */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[1000px] table border-collapse w-full text-white">
              {/* Header */}
              <div className="table-header-group bg-white/30 font-bold border rounded">
                <div className="table-row">
                  <div className="table-cell p-2 text-center">STT</div>
                  <div className="table-cell p-2">Sách</div>
                  <div className="table-cell p-2">Mô tả</div>
                  <div className="table-cell p-2">Giá</div>
                  <div className="table-cell p-2">Trạng thái</div>
                  <div className="table-cell p-2 text-center">
                    <PersonIcon />
                  </div>
                </div>
              </div>

              {/* Rows */}
              <div className="table-row-group">
                {allOrders.map((items, i) => (
                  <div
                    key={items._id}
                    className="table-row bg-white/20 hover:bg-white/30 text-white font-semibold border rounded"
                  >
                    <div className="table-cell p-2 text-center">{i + 1}</div>
                    <div className="table-cell p-2">
                      {items.book ? (
                        <Link
                          to={`/view-book-details/${items.book._id}`}
                          className="hover:text-blue-50"
                        >
                          {items.book.title}
                        </Link>
                      ) : (
                        <span className="text-red-500">Sách không khả dụng</span>
                      )}
                    </div>
                    <div className="table-cell p-2">
                      {items.book?.desc?.slice(0, 50) || "Không có mô tả"}
                    </div>
                    <div className="table-cell p-2">
                      {items.book?.price
                        ? `${Number(items.book.price).toLocaleString('vi-VN')} ₫`
                        : "N/A"}
                    </div>
                    <div className="table-cell p-2">
                      <button
                        onClick={() => setOption(i)}
                        className="hover:scale-105 transition-all duration-300"
                      >
                        {items.status === "Order Placed" ? (
                          <div className="text-yellow-300">Đã đặt hàng</div>
                        ) : items.status === "Canceled" ? (
                          <div className="text-red-600">Đã hủy</div>
                        ) : items.status === "Out for delivery" ? (
                          <div className="text-blue-300">Đang giao</div>
                        ) : items.status === "Delivered" ? (
                          <div className="text-green-600">Đã giao</div>
                        ) : (
                          <div className="text-white">{items.status}</div>
                        )}
                      </button>
                      <div
                        className={`${options === i ? "flex mt-1" : "hidden"}`}
                      >
                        <select
                          onChange={change}
                          name="status"
                          value={values.status}
                          className="bg-white/50 text-black border-none"
                        >
                          {[
                            { v: "Order placed", l: "Đã đặt hàng" },
                            { v: "Out for delivery", l: "Đang giao" },
                            { v: "Delivered", l: "Đã giao" },
                            { v: "Canceled", l: "Đã hủy" },
                          ].map((s, i) => (
                            <option value={s.v} key={i}>
                              {s.l}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            setOptions(-1);
                            submitChanges(i);
                          }}
                          className="text-green-50 mx-2 hover:text-blue-600"
                        >
                          <CheckIcon />
                        </button>
                      </div>
                    </div>
                    <div className="table-cell p-2 text-center">
                      <button
                        onClick={() => {
                          setUserDiv("fixed z-50");
                          setUserDivData(items.user);
                        }}
                        className="text-xl hover:text-black"
                      >
                        <CallMissedOutgoingIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {userDivData && (
            <SeeUserData
              userDivData={userDivData}
              userDiv={userDiv}
              setUserDiv={setUserDiv}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AllOrders;
