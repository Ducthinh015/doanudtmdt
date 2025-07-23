import { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import Navbar from "../components/Navbar/Navbar";
const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]); // initial as empty array
  const [total, setTotal] = useState(0);

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          "http://localhost:1000/api/v1/get-user-cart",
          { headers }
        );
        setCart(res.data.data);
      } catch (error) {
        console.error("Failed to fetch cart data", error);
      }
    };
    fetch();
  }, [cart]);

  //to del item
  const deleteItem = async (bookid) => {
    const res = await axios.put(
      `http://localhost:1000/api/v1/remove-book-from-cart/${bookid}`,
      {},
      { headers }
    );
    alert(res.data.message);
  };

  //to update cart total
  useEffect(() => {
    if (cart && cart.length > 0) {
      let total = 0;
      cart.map((items) => {
        total += items.price;
      });
      setTotal(total);
    }
  }, [cart]);

  //when order is placed
  const PlaceOrder = async () => {
    try {
      const res = await axios.post(
        `http://localhost:1000/api/v1/place-order`,
        { order: cart },
        { headers }
      );
      console.log(res.data);
      alert(res.data.message);
      navigate("/profile/orderHistory");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="h-screen bg-cover text-white overflow-y-scroll"
      style={{ backgroundImage: `url(/images/cart-bg.jpg)` }}
    >
      <Navbar />
      <div className=" h-screen w-full p-8">
        {!cart && (
          <div className="w-full h-[100%] flex items-center justify-center">
            <Loader />
          </div>
        )}

        {cart && cart.length === 0 && (
          <div className="h-screen bg-transparent">
            <div className="h-full flex items-center justify-center flex-col">
              <h1 className="text-5xl lg:text-6xl font-semibold text-white opacity-30">
                Cart is empty
              </h1>
              {/* <img
        className="lg:h-[50vh]"
        src="/empty-cart.png"
        alt="Empty cart image"
      /> */}
            </div>
          </div>
        )}

        {cart && cart.length > 0 && (
          <>
            <h1 className="text-5xl uppercase font-semibold text-white mb-8 flex items-center justify-center">
              Your cart
            </h1>
            {cart.map((items, i) => (
              <div
                className="w-full  border bg-white/30 backdrop-blur-sm my-4 rounded flex flex-col md:flex-row p-4 bg-darkbrown justify-between items-center"
                key={i}
              >
                <img
                  src={items.url}
                  alt={items.title}
                  className="h-[20vh] md:h-[10vh] object-cover"
                />
                <div className="w-full md:w-auto md:ml-6 mt-4 md:mt-0">
                  <h1 className="text-2xl text-white font-semibold text-start">
                    {items.title}
                  </h1>
                  <p className="text-normal text-white mt-2">
                    {items.desc?.slice(0, 100) ?? "No description available"}...
                  </p>
                </div>

                <div className="flex flex-col items-end mt-4 md:mt-0">
                  <h2 className="text-white font-semibold text-lg mb-2">
                    ₹{items.price}
                  </h2>
                  <button
                    onClick={() => deleteItem(items._id)}
                    className="bg-transparent text-white px-3 py-1 rounded"
                  >
                    <RemoveShoppingCartIcon />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {cart && cart.length > 0 && (
          <div className="mt-4 w-full flex items-center justify-end">
            <div className="p-4 bg-transparent rounded">
              <h1 className="text-3xl text-white font-semibold">
                Total amount
              </h1>
              <div className="mt-3 flex items-center justify-between text-xl text-white font-semibold">
                <h2>{cart.length} books</h2>
                <h2>{total} </h2>
              </div>
              <div className="w-[100%] mt-3">
                <button
                  onClick={PlaceOrder}
                  className="bg-transparent border text-white px-4 py-2 flex justify-center w-full font-semibold hover:text-beige"
                >
                  Place your order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
