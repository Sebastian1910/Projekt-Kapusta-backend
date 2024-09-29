const passport = require("passport");
const User = require("../models/User.js");

const authMiddleware = (req, res, next) => {
  console.log("Authorization Header:", req.header("Authorization")); // Dodaj to, żeby zobaczyć nagłówek

  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (!user || error) {
      return res.status(401).json({
        status: "401 Unauthorized",
        code: 401,
        message: "Not authorized",
      });
    }

    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      console.log("Token:", token); // Dodaj to, żeby sprawdzić token
      const isUser = await User.findOne({
        _id: user._id,
        token: token,
      });

      if (!isUser) {
        return res.status(401).json({
          status: "401 Unauthorized",
          code: 401,
          message: "Token is not valid",
        });
      }

      req.user = isUser;
      next();
    } catch (error) {
      res.status(500).json({
        status: "500 Internal Server Error",
        code: 500,
        message: "Server error",
      });
    }
  })(req, res, next);
};

module.exports = authMiddleware;
