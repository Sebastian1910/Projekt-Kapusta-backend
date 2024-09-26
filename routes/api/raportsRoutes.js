const express = require("express");
const { fetchReports } = require("../../controllers/raportsController");
const authMiddleware = require("../../middleware/authMiddleware.js");
const mongoose = require("mongoose");
const {
  periodData,
  incomeCategories,
  expenseCategories,
  getUserFromHeaders,
} = require("../../controllers/raportsController.js");
const Transaction = require("../../models/transaction.js");
const { validationResult } = require("express-validator");

const router = express.Router();

// Trasy dla kategorii
router.get("/reports", authMiddleware, fetchReports);
router.get("/income-categories", authMiddleware, incomeCategories);
router.get("/expense-categories", authMiddleware, expenseCategories);
router.get("/period-data", authMiddleware, periodData);

// Trasa do miesięcznego podsumowania wydatków
router.get(
  "/expenses/monthly-summary",
  authMiddleware,
  async (req, res, next) => {
    try {
      const currentYear = new Date().getFullYear();

      const expenses = await Transaction.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(req.user._id),
            type: "expense",
            date: {
              $gte: new Date(`${currentYear}-01-01`),
              $lte: new Date(`${currentYear}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$date" },
            total: { $sum: "$amount" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const monthlyExpenses = Array(12).fill(0);
      expenses.forEach((expense) => {
        monthlyExpenses[expense._id - 1] = expense.total;
      });

      res.status(200).json({
        year: currentYear,
        expenses: monthlyExpenses,
      });
    } catch (error) {
      console.error("Error fetching monthly expenses summary:", error);
      next(error);
    }
  }
);

// Trasa do miesięcznego podsumowania dochodów
router.get(
  "/incomes/monthly-summary",
  authMiddleware,
  async (req, res, next) => {
    try {
      const currentYear = new Date().getFullYear();

      const incomes = await Transaction.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(req.user._id),
            type: "income",
            date: {
              $gte: new Date(`${currentYear}-01-01`),
              $lte: new Date(`${currentYear}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$date" },
            total: { $sum: "$amount" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const monthlyIncomes = Array(12).fill(0);
      incomes.forEach((inc) => {
        monthlyIncomes[inc._id - 1] = inc.total;
      });

      res.status(200).json({
        year: currentYear,
        incomes: monthlyIncomes,
      });
    } catch (error) {
      console.error("Error fetching monthly incomes summary:", error);
      next(error);
    }
  }
);

// Trasa do podsumowania według roku i miesiąca
router.get("/summary/:year/:month", authMiddleware, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { year, month } = req.params;

  const numericYear = parseInt(year, 10);
  const numericMonth = parseInt(month, 10);

  try {
    const startDate = new Date(
      `${numericYear}-${String(numericMonth).padStart(2, "0")}-01`
    );
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const expenses = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          type: "expense",
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const incomes = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          type: "income",
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      year: numericYear,
      month: numericMonth,
      expenses,
      incomes,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    next(error);
  }
});

module.exports = router;
