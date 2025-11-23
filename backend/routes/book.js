const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticationToken, authorizeAdmin } = require("./userAuth");
const Book = require("../models/books");

//add book - admin
router.post("/add-book", authenticationToken, authorizeAdmin, async (req, res) => {
  try {
    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });

    await book.save();
    res.status(200).json({ message: "Thêm sách thành công" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// related books by author or language
router.get("/books/related", async (req, res) => {
  try {
    const { bookId } = req.query;
    if (!bookId) return res.status(400).json({ message: "Thiếu bookId" });
    const current = await Book.findById(bookId);
    if (!current) return res.status(404).json({ message: "Không tìm thấy sách" });
    const query = {
      _id: { $ne: current._id },
      $or: [{ author: current.author }, { language: current.language }],
    };
    const books = await Book.find(query).limit(6);
    return res.json({ status: "Success", data: books });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
//update book
router.put("/update-book", authenticationToken, authorizeAdmin, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });
    res.status(200).json({ message: "Cập nhật sách thành công" }); // ✅ Response added
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//delete book
router.delete("/delete-book", authenticationToken, authorizeAdmin, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndDelete(bookid);
    return res.status(200).json({ message: "Xóa sách thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

//get all books
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// search books by query (title/author/desc)
router.get("/books/search", async (req, res) => {
  try {
    const q = (req.query.query || "").trim();
    if (!q) {
      return res.json({ status: "Thành công", data: [] });
    }
    const regex = new RegExp(q, "i");
    const books = await Book.find({
      $or: [{ title: regex }, { author: regex }, { desc: regex }],
    })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ status: "Thành công", data: books });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

//get recent added books limit 4
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

//get a book by id
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    return res.json({
      status: "Success",
      data: book,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
