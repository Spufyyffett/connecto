//routes/user.js

const express = require("express");
const router = express.Router();
const { findUser } = require("../controllers/userController");
const { authMiddlewareHTTP } = require("../middleware/authMiddleware");

router.get("/", authMiddlewareHTTP, findUser);

module.exports = router;
