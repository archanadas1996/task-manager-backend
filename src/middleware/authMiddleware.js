const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    console.log("AUTH MIDDLEWARE START");

    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", !!authHeader);

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Authorization format must be Bearer <token>",
      });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    console.log("TOKEN VERIFIED");
    console.log("USER:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticate;
