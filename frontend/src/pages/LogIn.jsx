import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { authActions } from "../features/auth";
import { useDispatch } from "react-redux";

const Login = () => {
  const [Values, setValues] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";

  const submit = async (e) => {
    e.preventDefault();
    console.log("submit");
    try {
      if (Values.username === "" || Values.password === "") {
        alert("Vui lòng điền đầy đủ thông tin");
      } else {
        const response = await axios.post(`${API_BASE}/api/v1/sign-in`, Values);
        dispatch(authActions.login());
        dispatch(authActions.changeRole(response.data.role));

        localStorage.setItem("id", response.data.id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        navigate("/profile");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-gray-100">
        <img
          src="/images/signup.visual.webp"
          alt="Hình minh hoạ đăng nhập"
          className="object-cover h-full w-full"
        />
      </div>

      {/* Right Side - Login Form */}

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Chào mừng quay trở lại!</h2>

          <form className="space-y-4">
            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700"
              >
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                value={Values.username}
                onChange={change}
                required
              />
            </div>

            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                required
                value={Values.password}
                onChange={change}
              />
            </div>

            <button
              onClick={submit}
              type="submit"
              className="w-full py-2 px-4 bg-[#0a192f] text-white rounded-md hover:bg-white hover:text-[#0a192f] hover:border"
            >
              Đăng nhập
            </button>
          </form>

          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/signup"
              className=" text-[#0a192f] hover:border font-semibold"
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
