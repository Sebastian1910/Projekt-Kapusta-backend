const express = require("express");
const dotenv = require("dotenv");
const authMiddleware = require("../../middleware/authMiddleware.js");
const {register, login, logout, refresh}  =require('../../controllers/authController.js');

dotenv.config();
const router = express.Router();

router.post("/auth/register", register)
router.post("/auth/login", login)
router.post('/refresh-token',authMiddleware, refresh)
router.post("/auth/logout", authMiddleware, logout)