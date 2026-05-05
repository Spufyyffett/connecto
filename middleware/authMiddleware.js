const jwt = require("jsonwebtoken");

exports.authMiddlewareHTTP = (req, res, next) => {
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

exports.authMiddlewareSocket = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      next(new Error("Token not valid or token not found. Please re-login"));
    }

    const valid = jwt.verify(token, process.env.JWT_SEC_KEY);

    if (valid) {
      socket.username = valid.sub;
    }
    next();
  } catch (error) {
    console.log(error);
    next(new Error("Something went wrong!"));
  }
};
