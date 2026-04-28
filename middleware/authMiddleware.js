const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const sessionToken = authHeader.split(" ")[1];

    req.user = jwt.verify(sessionToken, process.env.JWT_SEC_KEY);

    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};
