import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email) {
      setMessage({ type: "error", text: "Link đặt lại không hợp lệ" });
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !email) return;

    if (!password || password.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu phải từ 6 ký tự" });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu nhập lại không khớp" });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/v1/reset-password`, {
        token,
        email,
        password,
      });
      setMessage({ type: "success", text: res.data?.message || "Đặt lại mật khẩu thành công" });
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Đặt lại thất bại" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] via-black to-black text-white">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold mb-6">Đặt lại mật khẩu</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Mật khẩu mới</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Nhập lại mật khẩu</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none"
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-white text-black font-semibold rounded hover:bg-white/80 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
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

export default ResetPassword;
