import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!email) {
      setMessage({ type: "error", text: "Vui lòng nhập email" });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/v1/forgot-password`, { email });
      setMessage({ type: "success", text: res.data?.message || "Vui lòng kiểm tra email của bạn" });
      if (res.data?.resetLink) {
        setMessage((prev) => ({
          type: prev?.type || "success",
          text: `${res.data.message}. Link thử nghiệm: ${res.data.resetLink}`,
        }));
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || "Đã xảy ra lỗi" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] via-black to-black text-white">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold mb-6">Quên mật khẩu</h1>
        <p className="opacity-80 mb-6">
          Nhập email đã đăng ký. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu. Trong môi trường thử nghiệm,
          link đặt lại sẽ xuất hiện trực tiếp trên màn hình.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-white text-black font-semibold rounded hover:bg-white/80 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi hướng dẫn"}
          </button>
        </form>
        {message && (
          <div
            className={`mt-4 p-3 rounded ${
              message.type === "error" ? "bg-red-500/20 border border-red-400" : "bg-green-500/20 border border-green-400"
            }`}
          >
            {message.text}
          </div>
        )}
        <div className="mt-6 text-sm">
          <Link to="/login" className="text-blue-300 hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
