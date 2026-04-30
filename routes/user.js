//routes/user.js

const express = require("express");
const router = express.Router();

const { findUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, findUser);

module.exports = router;
