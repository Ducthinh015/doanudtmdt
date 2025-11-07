const express = require("express");
const router = express.Router();
const AnalyticsEvent = require("../models/analyticsEvent");
const Book = require("../models/books");
const Order = require("../models/orders");
const User = require("../models/user");
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

// summary of events by day (last 14 days)
router.get("/summary", async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 14);
    const pipeline = [
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: "$type",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.day": 1 } },
    ];
    const rows = await AnalyticsEvent.aggregate(pipeline);
    res.json({ status: "Success", data: rows });
  } catch (e) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// top co-purchased pairs (simple aggregate over orders)
router.get("/top-copurchased", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    // Build per-order arrays (since current schema is one order per book, group by user+createdAt day window)
    const pipeline = [
      { $project: { user: 1, book: 1, ts: "$createdAt" } },
      {
        $group: {
          _id: { user: "$user", day: { $dateToString: { format: "%Y-%m-%d", date: "$ts" } } },
          books: { $addToSet: "$book" },
        },
      },
      { $project: { books: 1 } },
    ];
    const groups = await Order.aggregate(pipeline);
    const pairCount = new Map();
    const bookCount = new Map();
    for (const g of groups) {
      const arr = g.books.filter(Boolean).map((x) => String(x));
      // count singles
      const seenSingles = new Set();
      arr.forEach((b) => {
        if (!seenSingles.has(b)) bookCount.set(b, (bookCount.get(b) || 0) + 1);
        seenSingles.add(b);
      });
      // count pairs (unordered)
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const a = arr[i] < arr[j] ? `${arr[i]}__${arr[j]}` : `${arr[j]}__${arr[i]}`;
          pairCount.set(a, (pairCount.get(a) || 0) + 1);
        }
      }
    }
    // compute score
    const scored = [];
    for (const [k, c] of pairCount.entries()) {
      const [a, b] = k.split("__");
      const score = c / Math.sqrt((bookCount.get(a) || 1) * (bookCount.get(b) || 1));
      if (c >= 2) scored.push({ a, b, count: c, score });
    }
    scored.sort((x, y) => y.score - x.score);
    const top = scored.slice(0, limit);
    // populate books
    const ids = [...new Set(top.flatMap((t) => [t.a, t.b]))];
    const books = await Book.find({ _id: { $in: ids } });
    const bookMap = new Map(books.map((b) => [String(b._id), b]));
    const result = top.map((t) => ({
      a: bookMap.get(t.a),
      b: bookMap.get(t.b),
      count: t.count,
      score: t.score,
    }));
    res.json({ status: "Success", data: result });
  } catch (e) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// preview recommendations for a user (mix of co-purchase and content-based)
router.get("/user-reco-preview", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "Thiếu userId" });
    const recentOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("book");
    const seen = new Set(recentOrders.map((o) => String(o.book?._id)).filter(Boolean));
    const authors = [...new Set(recentOrders.map((o) => o.book?.author).filter(Boolean))];
    const langs = [...new Set(recentOrders.map((o) => o.book?.language).filter(Boolean))];
    const recos = await Book.find({
      _id: { $nin: [...seen] },
      $or: [{ author: { $in: authors } }, { language: { $in: langs } }],
    })
      .limit(12)
      .sort({ createdAt: -1 });
    res.json({ status: "Success", data: recos });
  } catch (e) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// preview recommendations for an item
router.get("/item-reco", async (req, res) => {
  try {
    const { bookId } = req.query;
    if (!bookId) return res.status(400).json({ message: "Thiếu bookId" });
    const b = await Book.findById(bookId);
    if (!b) return res.status(404).json({ message: "Không tìm thấy sách" });
    const candidates = await Book.find({ _id: { $ne: b._id }, $or: [{ author: b.author }, { language: b.language }] })
      .limit(12)
      .sort({ createdAt: -1 });
    res.json({ status: "Success", data: candidates });
  } catch (e) {
    res.status(500).json({ message: "Lỗi server" });
  }
});
