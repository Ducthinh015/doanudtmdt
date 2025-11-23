const mongoose = require("mongoose");


const analyticsEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: false },
    sessionId: { type: String, required: true },
    type: { type: String, enum: ["view", "add_to_cart", "favorite", "purchase"], required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "book", required: false },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("analytics_event", analyticsEventSchema);
