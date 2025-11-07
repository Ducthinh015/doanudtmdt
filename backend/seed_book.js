require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/books");
const books = require("./data/book.js");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Book.deleteMany();
    await Book.insertMany(books);
    console.log("✅ 10 books seeded!");
  })
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
  });
