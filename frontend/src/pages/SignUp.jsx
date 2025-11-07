  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [Values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const navigate = useNavigate();
  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    console.log("submit");
    try {
      if (
        Values.username === "" ||
        Values.email === "" ||
        Values.password === "" ||
        Values.address === ""
      ) {
        alert("Vui lòng điền đầy đủ thông tin");
      } else {
        const response = await axios.post(`${API_BASE}/api/v1/sign-up`, Values);
        console.log(response);
        alert(response.data?.message || "Đăng ký thành công");
        navigate("/LogIn");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-gray-100">
        <img
          src="/images/signup.visual.webp"
          alt="Hình minh hoạ đăng ký"
          className="object-cover h-full w-full"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Tạo tài khoản</h2>

          <form className="space-y-4" onSubmit={submit}>
            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700"
              >
                Tên đăng nhập
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                name="username"
                placeholder="Tên đăng nhập"
                required
                value={Values.username}
                onChange={change}
              />
            </div>
            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                name="email"
                placeholder="Email"
                value={Values.email}
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
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                name="password"
                placeholder="Mật khẩu"
                value={Values.password}
                onChange={change}
                required
              />
            </div>

            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700"
              >
                Địa chỉ
              </label>
              <textarea
                rows="5"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                name="address"
                placeholder="Địa chỉ"
                required
                value={Values.address}
                onChange={change}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#0a192f] text-white rounded-md hover:bg-white/95 hover:text-[#0a192f] hover:border transition"
            >
              Đăng ký
            </button>
          </form>

          <p className="text-sm text-gray-600">
            Đã có tài khoản?
            <Link to="/LogIn" className="text-darkbrown font-semibold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
