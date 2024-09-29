const passport = require("passport");
const User = require("../models/User.js");

const authMiddleware = (req, res, next) => {
  console.log("Authorization Header:", req.header("Authorization")); // Sprawdź, czy nagłówek jest prawidłowy

  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (error) {
      console.error("Authentication error:", error);
    }
    if (!user) {
      console.error("User not found or invalid token");
      return res.status(401).json({
        status: "401 Unauthorized",
        code: 401,
        message: "Not authorized",
      });
    }

    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      console.log("Token:", token); // Sprawdź, czy token jest prawidłowo wyciągnięty

      const isUser = await User.findOne({ _id: user._id, token: token });

      if (!token) {
        return res.status(401).json({ message: "Missing or invalid token" });
      }

      if (!isUser) {
        console.error("Token is not valid for user");
        return res.status(401).json({
          status: "401 Unauthorized",
          code: 401,
          message: "Token is not valid",
        });
      }

      req.user = isUser;
      next();
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({
        status: "500 Internal Server Error",
        code: 500,
        message: "Server error",
      });
    }
  })(req, res, next);
};

module.exports = authMiddleware;
