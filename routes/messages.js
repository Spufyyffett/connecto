//routes/messages.js
const { authMiddlewareHTTP } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware");
const express = require("express");

const router = express.Router();
const {
  getMessages,
  sendMessage,
} = require("../controllers/messageController");

router.get("/", authMiddlewareHTTP, getMessages);
router.post("/", authMiddlewareHTTP, sendMessage);
router.post("/upload", authMiddlewareHTTP, upload.single("file"), sendMessage);

module.exports = router;
