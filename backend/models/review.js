const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  message: String,
  // ye user id isiliye bheji hmne kyuki hm chate h jisne review bnaya h sirf vhi delete kr paye review ko
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
