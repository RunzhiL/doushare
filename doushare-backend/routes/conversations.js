const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");

// Create a new conversation
router.post("/", async (req, res) => {
  try {
    const { item_id, borrower_id, owner_id } = req.body;
    const convo = await Conversation.create({ item_id, borrower_id, owner_id });
    res.status(201).json(convo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all conversations (optionally with filters)
router.get("/", async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate("item_id")
      .populate("borrower_id", "fullName email")
      .populate("owner_id", "fullName email");
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get conversations for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({
      $or: [{ borrower_id: userId }, { owner_id: userId }],
    }).populate("item_id");
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
