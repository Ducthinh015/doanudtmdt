const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authenticationToken } = require("./userAuth");

//put book to cart
router.put("/add-to-cart", authenticationToken, async (req, res) => {
  // console.log("headers from front: " + JSON.stringify(headers));

  try {
    const { bookid } = req.headers;
    const id = req.user?.authClaims?.id || req.headers.id;
    const userData = await User.findById(id).populate({
      path: "cart",
      model: "Book", // replace "Book" with your actual book model name if different
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookinCart = userData.cart
      .map((b) => (typeof b === "string" ? b : b._id?.toString()))
      .includes(bookid?.toString());
    if (bookinCart) {
      return res.status(200).json({ message: " Book is already in cart" });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    console.log("User cart after update:", userData.cart);

    return res.status(200).json({ message: "Book added to cart" });
  } catch (error) {
    console.error("Error in /add-book-to-cart:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//delete cart from cart
router.put(
  "/remove-book-from-cart/:bookid",
  authenticationToken,
  async (req, res) => {
    try {
      const { bookid } = req.params;
      const id = req.user?.authClaims?.id || req.headers.id;
      const userData = await User.findById(id);
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
      await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
      return res.json({
        status: "Success",
        message: "Book removed from cart",
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//get cart of particular user
router.get("/get-user-cart", authenticationToken, async (req, res) => {
  try {
    const id = req.user?.authClaims?.id || req.headers.id;
    const userData = await User.findById(id).populate("cart");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    const cart = userData.cart.reverse();
    return res.json({
      status: "Success",
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
