const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true }
);

cartSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema, "cart");
