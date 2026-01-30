const express = require("express");
const Groq = require("groq-sdk");
const Chat = require("../models/chat");   // ✅ model
const protect = require("../middleware/authMiddleware"); // ✅ auth

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// ================= SEND MESSAGE + SAVE CHAT =================
router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful career assistant who gives clear guidance for students.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    // ✅ SAVE CHAT WITH USER ID
    const chat = await Chat.create({
      userId: req.user._id,
      message,
      reply,
    });

    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI server error" });
  }
});


// ================= GET ONLY LOGGED-IN USER CHATS =================
router.get("/chat", protect, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to load chats" });
  }
});

module.exports = router;
