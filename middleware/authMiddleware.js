const passport = require("passport");
const User = require("../models/User.js");

const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (!user || error) {
      return res.status(401).json({
        status: "401 Unauthorized",
        code: 401,
        message: "Not authorized",
      });
    }
    try {
      const authHeader = req.header("Authorization");

      // Sprawdź, czy nagłówek Authorization istnieje i jest poprawnie sformatowany
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          status: "401 Unauthorized",
          code: 401,
          message: "Token is missing or invalid format",
        });
      }

      const token = authHeader.replace("Bearer ", "");

      // Sprawdź, czy token jest zgodny z tokenem użytkownika w bazie danych
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

      // Przypisz użytkownika do req
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
