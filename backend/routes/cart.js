const express = require("express");
const router = express.Router();
const { authenticationToken } = require("./userAuth");
const Cart = require("../models/cart");
const Book = require("../models/books");

//put book to cart
router.put("/add-to-cart", authenticationToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    const userId = req.user?.authClaims?.id || req.headers.id;

    if (!bookid) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const bookExists = await Book.exists({ _id: bookid });
    if (!bookExists) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existing = await Cart.findOne({ user: userId, book: bookid });
    if (existing) {
      return res.status(200).json({ message: "Book is already in cart" });
    }

    await Cart.create({ user: userId, book: bookid });

    return res.status(200).json({ message: "Book added to cart" });
  } catch (error) {
    console.error("Error in /add-to-cart:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

//delete cart from cart
router.put(
  "/remove-book-from-cart/:bookid",
  authenticationToken,
  async (req, res) => {
    try {
      const { bookid } = req.params;
      const userId = req.user?.authClaims?.id || req.headers.id;

      const removed = await Cart.findOneAndDelete({ user: userId, book: bookid });
      if (!removed) {
        return res.status(404).json({ message: "Book not found in cart" });
      }

      return res.json({
        status: "Success",
        message: "Book removed from cart",
      });
    } catch (error) {
      console.error("Error removing book from cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//get cart of particular user
router.get("/get-user-cart", authenticationToken, async (req, res) => {
  try {
    const id = req.user?.authClaims?.id || req.headers.id;
    const cartDocs = await Cart.find({ user: id })
      .populate("book")
      .sort({ createdAt: -1 });

    const cart = cartDocs
      .filter((doc) => doc.book)
      .map((doc) => {
        const book = doc.book.toObject();
        return {
          ...book,
          cartItemId: doc._id,
          quantity: doc.quantity,
        };
      });

    return res.json({
      status: "Success",
      data: cart,
    });
  } catch (error) {
    console.error("Error fetching user cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
