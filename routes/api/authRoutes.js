const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../../models/user.js");
const authMiddleware = require("../../middleware/authMiddleware.js");

dotenv.config();
const router = express.Router();

router.post("/auth/register", async (req, res, next) => {
  const { username, email, password } = req.body;

  console.log("Received data:", { username, email, password });

  if (!username || !email || !password) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing required fields",
    });
  }

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    return res.status(409).json({
      status: "409 Conflict",
      code: 409,
      message: "Email in use",
      data: "Conflict",
    });
  }

  try {
    const newUser = new User({
      username,
      email,
    });

    await newUser.setPassword(password);
    await newUser.save();

    return res.status(201).json({
      status: "201 Created",
      code: 201,
      message: "Registration successfull",
      user: {
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(
      `Błąd podczas rejestracji nowego użytkownika: ${error.message}`
    );
    next(error);
  }
});

router.post("/auth/login", async (req, res, _next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: "400 Bad Request",
      code: 400,
      message: "Error",
    });
  }
  const passwordIsCorrect = await user.validatePassword(password);
  if (passwordIsCorrect) {
    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1w" });

    user.token = token;
    await user.save();
    return res.status(200).json({
      status: "200 OK",
      code: 200,
      message: "Log in successfull",
      token: token,
      user: {
        email: user.email,
        _id: user._id,
      },
    });
  } else {
    return res.status(401).json({
      status: "401 Unauthorized",
      code: 401,
      message: "Email or password is wrong",
    });
  }
});

router.post("/auth/logout", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    user.token = null;
    await user.save();
    return res.status(200).json({
      status: "204 No Content - User is log out",
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    next(error);
  }
});

module.exports = router;
