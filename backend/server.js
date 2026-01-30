const express = require("express");
const cors = require("cors");
const User = require("./models/User");
const Review = require("./models/review");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
require("dotenv").config();
const aiRoutes = require("./routes/ai");
const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resume");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.send("career.ai backend is running");
});

// ================= REVIEWS APIs =================

// ADD REVIEW
app.post("/api/reviews", protect, async (req, res) => {
  try {
    const { rating, message } = req.body;

    const review = await Review.create({
      name: req.user.name,
      userId: req.user._id,
      rating,
      message,
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET REVIEWS
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(6);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// DELETE REVIEW
app.delete("/api/reviews/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await review.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ================= PAYMENT (FAKE) APIs =================

// FAKE PAYMENT - MARK USER AS PREMIUM
app.post("/api/payment/fake-pay", protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isPremium: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CHECK PREMIUM STATUS
app.get("/api/payment/status", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ isPremium: user.isPremium });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ================= TEST =================
app.get("/api/private", protect, (req, res) => {
  res.json({
    message: "you are authorized",
    user: req.user,
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
