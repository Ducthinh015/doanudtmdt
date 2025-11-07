import axios from "axios";
import { getSessionId } from "./session";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";

export async function trackEvent(type, { bookId = null, meta = {} } = {}) {
  try {
    const sessionId = getSessionId();
    const token = localStorage.getItem("token");
    const headers = token ? { authorization: `Bearer ${token}` } : {};
    await axios.post(
      `${API_BASE}/api/v1/analytics/event`,
      { sessionId, type, bookId, meta },
      { headers }
    );

    // local fallback: keep a simple recent queue of bookIds
    if (bookId) {
      const key = "recentlyViewed";
      let arr = [];
      try {
        arr = JSON.parse(localStorage.getItem(key) || "[]");
      } catch (_) {}
      arr = [bookId, ...arr.filter((id) => id !== bookId)].slice(0, 12);
      localStorage.setItem(key, JSON.stringify(arr));
    }
  } catch (e) {
    // avoid breaking UX due to analytics error
    console.warn("trackEvent error", e?.message);
  }
}
