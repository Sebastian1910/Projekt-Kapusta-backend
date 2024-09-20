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

router.get("/income-categories", authMiddleware, async (req, res, next) => {
  try {
    return res.status(200).json(incomeCategorie);
  } catch (e) {
    next(e);
  }
});

router.get("/expense-categories", authMiddleware, async (req, res, next) => {
  try {
    return res.status(200).json(expenseCategorie);
  } catch (e) {
    next(e);
  }
});

router.get("/period-data", authMiddleware, async (req, res, next) => {
  const { startDate, endDate } = req.query;
  try {
    const { transactions, balance } = await getPeriodData(startDate, endDate);
    return res.status(200).json({ transactions, balance });
  } catch (e) {
    next(e);
  }
});
// Work in progress

// router.get("/byMonths", authMiddleware, async (req, res, next) => {
//   try {
//     const thisYear = new Date().getFullYear();
//     const trans = await Transaction.find({ userId: decodedToken._id });
//     return res.status(200).json();
//   } catch (e) {
//     next(e);
//   }
// });

module.exports = router;
