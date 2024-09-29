const express = require("express");
const {
  register,
  login,
  logout,
  refresh,
} = require("../../controllers/authController.js");
const authMiddleware = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", authMiddleware, logout);

module.exports = router;
