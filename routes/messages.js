//routes/messages.js

const express = require("express");
const router = express.Router();
const {
  getMessages,
  sendMessage,
} = require("../controllers/messageController");

const { authMiddlewareHTTP } = require("../middleware/authMiddleware");

router.get("/", authMiddlewareHTTP, getMessages);
router.post("/", authMiddlewareHTTP, sendMessage);

module.exports = router;
