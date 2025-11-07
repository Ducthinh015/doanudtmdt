import Home from "./pages/Home";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AllBooks from "./pages/AllBooks";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import AllOrders from "./pages/AllOrders";
import ViewBookDetails from "./components/ViewBookDetails/ViewBookDetails";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { authActions } from "./features/auth";
import { useDispatch } from "react-redux";
import Favorites from "./components/Profile/Favorites";
import UserOrderHistory from "./components/Profile/UserOrderHistory";
import Settings from "./components/Profile/Settings";
import AddBook from "./pages/AddBook";
import UpdateBook from "./pages/UpdateBook";
import VnpayReturn from "./pages/VnpayReturn";
import Chatbot from "./components/Chatbot/Chatbot";

function App() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  }, []);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />}>
          {role === "user" ? (
            <Route index element={<Favorites />} />
          ) : (
            <Route index element={<AllOrders />} />
          )}
          {role === "admin" && <Route path="add-book" element={<AddBook />} />}

          <Route path="/profile/orderHistory" element={<UserOrderHistory />} />
          <Route path="/profile/settings" element={<Settings />} />
        </Route>
        <Route path="/updateBook/:id" element={<UpdateBook />} />

        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/view-book-details/:id" element={<ViewBookDetails />} />
        <Route path="/vnpay-return" element={<VnpayReturn />} />
      </Routes>
      {role === "user" && (
        <div className="fixed bottom-4 right-4 z-50">
          <Chatbot />
        </div>
      )}
    </>
  );
}

export default App;
