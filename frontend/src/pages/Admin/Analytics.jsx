import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";

const Analytics = () => {
  const [summary, setSummary] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [userId, setUserId] = useState("");
  const [userRecos, setUserRecos] = useState([]);
  const [bookId, setBookId] = useState("");
  const [itemRecos, setItemRecos] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await axios.get(`${API_BASE}/api/v1/analytics/summary`);
        setSummary(s.data?.data || []);
        const p = await axios.get(`${API_BASE}/api/v1/analytics/top-copurchased`, { params: { limit: 20 } });
        setPairs(p.data?.data || []);
      } catch (e) {
        console.warn(e);
      }
    };
    load();
  }, []);

  const byDay = useMemo(() => {
    const map = {};
    summary.forEach((r) => {
      const day = r._id?.day;
      const type = r._id?.type;
      if (!map[day]) map[day] = { view: 0, add_to_cart: 0, favorite: 0, purchase: 0 };
      map[day][type] = r.count;
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [summary]);

  const fetchUserPreview = async () => {
    try {
      const r = await axios.get(`${API_BASE}/api/v1/analytics/user-reco-preview`, { params: { userId } });
      setUserRecos(r.data?.data || []);
    } catch (e) {}
  };

  const fetchItemPreview = async () => {
    try {
      const r = await axios.get(`${API_BASE}/api/v1/analytics/item-reco`, { params: { bookId } });
      setItemRecos(r.data?.data || []);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] via-black to-black text-white">
      <Navbar />
      <div className="px-4 md:px-12 py-8">
        <h1 className="text-3xl font-semibold mb-6">Phân tích & Gợi ý</h1>

        {/* Funnel by day */}
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">Funnel 14 ngày</h2>
          <div className="overflow-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-sm opacity-80">
                  <th className="p-2">Ngày</th>
                  <th className="p-2">Xem</th>
                  <th className="p-2">Thêm giỏ</th>
                  <th className="p-2">Yêu thích</th>
                  <th className="p-2">Mua</th>
                </tr>
              </thead>
              <tbody>
                {byDay.map(([day, v], i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="p-2">{day}</td>
                    <td className="p-2">{v.view || 0}</td>
                    <td className="p-2">{v.add_to_cart || 0}</td>
                    <td className="p-2">{v.favorite || 0}</td>
                    <td className="p-2">{v.purchase || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top co-purchased */}
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">Cặp sách hay mua cùng</h2>
          <div className="overflow-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-sm opacity-80">
                  <th className="p-2">Sách A</th>
                  <th className="p-2">Sách B</th>
                  <th className="p-2">Lượt đồng mua</th>
                  <th className="p-2">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((row, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="p-2">{row.a?.title}</td>
                    <td className="p-2">{row.b?.title}</td>
                    <td className="p-2">{row.count}</td>
                    <td className="p-2">{row.score?.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preview user */}
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">Xem gợi ý theo người dùng</h2>
          <div className="flex gap-2 mb-3">
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Nhập userId"
              className="bg-white/10 border border-white/20 rounded px-3 py-2 w-full max-w-md"
            />
            <button onClick={fetchUserPreview} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Xem</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {userRecos.map((b) => (
              <div key={b._id} className="bg-white/10 p-3 rounded">
                <img src={b.url} alt={b.title} className="w-full h-40 object-cover rounded" />
                <div className="mt-2 font-semibold">{b.title}</div>
                <div className="text-sm opacity-80">{b.author}</div>
                <div className="text-sm">{Number(b.price).toLocaleString('vi-VN')} ₫</div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview item */}
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">Xem gợi ý theo sách</h2>
          <div className="flex gap-2 mb-3">
            <input
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              placeholder="Nhập bookId"
              className="bg-white/10 border border-white/20 rounded px-3 py-2 w-full max-w-md"
            />
            <button onClick={fetchItemPreview} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Xem</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {itemRecos.map((b) => (
              <div key={b._id} className="bg-white/10 p-3 rounded">
                <img src={b.url} alt={b.title} className="w-full h-40 object-cover rounded" />
                <div className="mt-2 font-semibold">{b.title}</div>
                <div className="text-sm opacity-80">{b.author}</div>
                <div className="text-sm">{Number(b.price).toLocaleString('vi-VN')} ₫</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
