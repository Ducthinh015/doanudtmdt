import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";
import CallMissedOutgoingIcon from "@mui/icons-material/CallMissedOutgoing";
import SeeUserData from "./SeeUserData";

const AllOrders = () => {
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
        const res = await axios.get(
          "https://bookcove.onrender.com/api/v1/get-all-orders",
          { headers }
        );
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
      `https://bookcove.onrender.com/api/v1/update-status/${id}`,
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
            All Orders
          </h1>

          {/* Scrollable table container */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[1000px] table border-collapse w-full text-white">
              {/* Header */}
              <div className="table-header-group bg-white/30 font-bold border rounded">
                <div className="table-row">
                  <div className="table-cell p-2 text-center">Sr.</div>
                  <div className="table-cell p-2">Books</div>
                  <div className="table-cell p-2">Description</div>
                  <div className="table-cell p-2">Price</div>
                  <div className="table-cell p-2">Status</div>
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
                        <span className="text-red-500">Book not available</span>
                      )}
                    </div>
                    <div className="table-cell p-2">
                      {items.book?.desc?.slice(0, 50) || "No description"}
                    </div>
                    <div className="table-cell p-2">
                      ₹{items.book?.price || "N/A"}
                    </div>
                    <div className="table-cell p-2">
                      <button
                        onClick={() => setOption(i)}
                        className="hover:scale-105 transition-all duration-300"
                      >
                        {items.status === "Order Placed" ? (
                          <div className="text-yellow-300">{items.status}</div>
                        ) : items.status === "Canceled" ? (
                          <div className="text-red-600">{items.status}</div>
                        ) : (
                          <div className="text-green-600">{items.status}</div>
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
                            "Order placed",
                            "Out for delivery",
                            "Delivered",
                            "Canceled",
                          ].map((status, i) => (
                            <option value={status} key={i}>
                              {status}
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
