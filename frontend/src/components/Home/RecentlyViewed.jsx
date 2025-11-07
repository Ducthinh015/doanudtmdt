import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import { getSessionId } from "../../utils/session";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";

const RecentlyViewed = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const sessionId = getSessionId();
        const token = localStorage.getItem("token");
        const headers = token ? { authorization: `Bearer ${token}` } : {};
        // Try backend first
        const res = await axios.get(`${API_BASE}/api/v1/analytics/recently-viewed`, {
          params: { sessionId },
          headers,
        });
        if (res.data?.data?.length) {
          setBooks(res.data.data);
          return;
        }
      } catch (_) {}

      // Fallback: localStorage list of book ids
      try {
        const ids = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
        const limited = ids.slice(0, 8);
        const results = await Promise.all(
          limited.map((id) => axios.get(`${API_BASE}/api/v1/get-book-by-id/${id}`).then((r) => r.data.data).catch(() => null))
        );
        setBooks(results.filter(Boolean));
      } catch (_) {}
    };
    load();
  }, []);

  if (!books || books.length === 0) return null;

  return (
    <div className="px-4 md:px-12 py-8 bg-gradient-to-b from-black/20 to-transparent">
      <h3 className="text-2xl font-semibold mb-4 text-white">Đã xem gần đây</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {books.map((b, i) => (
          <BookCard key={i} data={b} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
