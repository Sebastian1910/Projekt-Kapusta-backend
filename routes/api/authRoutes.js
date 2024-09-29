const express = require("express");
const dotenv = require("dotenv");
const authMiddleware = require("../../middleware/authMiddleware.js");
const {
  register,
  login,
  logout,
  refresh,
} = require("../../controllers/authController.js");

dotenv.config();
const router = express.Router();

router.post("/register", register); // Trasa dla rejestracji
router.post("/login", login); // Trasa dla logowania
router.post("/refresh", refresh); // Trasa do odświeżania tokenu
router.post("/logout", authMiddleware, logout); // Trasa dla wylogowania

module.exports = router;
