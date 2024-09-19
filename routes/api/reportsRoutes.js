const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware.js");
const { getPeriodData } = require("../../controllers/transactionController.js");
const jwt = require("jsonwebtoken");
const Transaction = require("../../models/Transaction.js");
const User = require("../../models/user.js");
const {
  incomeCategorie,
  expenseCategorie,
} = require("../../config/categories.js");
const { route } = require("./transactionRoutes.js");
require("dotenv").config();

const router = express.Router();

router.get(
  "/transaction/income-categories",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(400).json({ message: "No auth" });
      }
      const [_bearer, token] = authorization.split(" ");
      const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
      if (!decodedToken) {
        return res.status(400).json({ message: "Wrong token" });
      }
      const user = await User.findById(decodedToken._id);
      if (!user) {
        return res.status(400).json({ message: "Wrong user" });
      }
      return res.status(200).json(incomeCategorie);
    } catch (e) {
      next(e);
    }
  }
);

router.get("/transaction/expense-categories", async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(400).json({ message: "No auth" });
    }
    const [_bearer, token] = authorization.split(" ");
    const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(400).json({ message: "Wrong token" });
    }
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(400).json({ message: "Wrong user" });
    }
    return res.status(200).json(expenseCategorie);
  } catch (e) {
    next(e);
  }
});

router.get("/transaction/period-data", async (req, res, next) => {
  const { startDate, endDate } = req.query;
  try {
    const { transactions, balance } = await getPeriodData(startDate, endDate);
    return res.status(200).json({ transactions, balance });
  } catch (e) {
    next(e);
  }
});

router.get("/transaction/byMouths", authMiddleware, async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(400).json({ message: "No auth" });
    }
    const [_bearer, token] = authorization.split(" ");
    const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(400).json({ message: "Wrong token" });
    }
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(400).json({ message: "Wrong user" });
    }
    const thisYear = new Date().getFullYear();
    const trans = await Transaction.find({ userId: decodedToken._id });
    return res.status(200).json();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
