//routes/auth.js

const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);

const authMiddleware = require("../middleware/authMiddleware");

router.get("/verify", authMiddleware, (req, res) => {
  const userId = req.user.userId;

  res.json({ user: req.user });
});

module.exports = router;
