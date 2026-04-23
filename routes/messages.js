//routes/messages.js

const express = require("express");
const router = express.Router();

const {
  getMessages,
  sendMessage,
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getMessages);
router.post("/", authMiddleware, sendMessage);

module.exports = router;
