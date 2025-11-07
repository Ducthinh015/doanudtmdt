const express = require("express");
const router = express.Router();
const AnalyticsEvent = require("../models/analyticsEvent");
const Book = require("../models/books");
const { authenticationToken } = require("./userAuth");

// Track analytics event (view, add_to_cart, favorite, purchase)
router.post("/event", async (req, res) => {
  try {
    const { sessionId, type, bookId, meta } = req.body;
    if (!sessionId || !type) {
      return res.status(400).json({ message: "Thiếu tham số bắt buộc" });
    }
    const userId = req.user?.authClaims?.id || null;
    const doc = await AnalyticsEvent.create({ userId, sessionId, type, bookId, meta });
    res.json({ status: "Success", data: doc });
  } catch (e) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Get recently viewed books for user or session
router.get("/recently-viewed", async (req, res) => {
  try {
    const { sessionId } = req.query;
    const userId = req.user?.authClaims?.id || null;
    const match = userId ? { userId, type: "view" } : { sessionId, type: "view" };

    const events = await AnalyticsEvent.find(match)
      .sort({ createdAt: -1 })
      .limit(20);

    const bookIds = [...new Set(events.map((e) => e.bookId).filter(Boolean))].slice(0, 12);
    const books = await Book.find({ _id: { $in: bookIds } });
    res.json({ status: "Success", data: books });
  } catch (e) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
