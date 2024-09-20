const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware.js");
const Transaction = require("../../models/Transaction.js");

const {
  incomeCategorie,
  expenseCategorie,
} = require("../../config/categories.js");
require("dotenv").config();

const router = express.Router();

router.post("/transaction/income", authMiddleware, async (req, res, next) => {
  const { amount, category, description, date } = req.body;

  if (!amount || !category || !description || !date) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing required fields",
    });
  }

  try {
    const newIncome = new Transaction({
      userId: req.user._id,
      amount,
      category,
      description,
      date,
      type: "income",
    });
    await newIncome.save();

    return res.status(201).json({
      status: "201 Created",
      code: 201,
      message: "Transaction created successfully",
      transaction: newIncome,
    });
  } catch (error) {
    console.error(`Error creating transaction: ${error.message}`);
    next(error);
  }
});

router.get("/transaction/income", authMiddleware, async (req, res, next) => {
  try {
    const incomes = await Transaction.find({
      userId: req.user._id,
      type: "income",
    });

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

    return res.status(200).json({
      status: "200 OK",
      code: 200,
      totalIncome,
      transactions: incomes,
    });
  } catch (error) {
    console.error(`Error fetching income stats: ${error.message}`);
    next(error);
  }
});

router.post("/transaction/expense", authMiddleware, async (req, res, next) => {
  const { amount, category, description, date } = req.body;

  if (!amount || !category || !description || !date) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing required fields",
    });
  }

  try {
    const newExpense = new Transaction({
      userId: req.user._id,
      amount,
      category,
      description,
      date,
      type: "expense",
    });
    await newExpense.save();

    return res.status(201).json({
      status: "201 Created",
      code: 201,
      message: "Transaction created successfully",
      transaction: newExpense,
    });
  } catch (error) {
    console.error(`Error creating transaction: ${error.message}`);
    next(error);
  }
});

router.get("/transaction/expense", authMiddleware, async (req, res, next) => {
  try {
    const expenses = await Transaction.find({
      userId: req.user._id,
      type: "expense",
    }).lean();

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return res.status(200).json({
      status: "200 OK",
      code: 200,
      totalIncome: totalExpense,
      transactions: expenses,
    });
  } catch (error) {
    console.error(`Error fetching income stats: ${error.message}`);
    next(error);
  }
});

router.delete("/transaction/:id", authMiddleware, async (req, res, next) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        status: "404 Not Found",
        code: 404,
        message: "Transaction not found",
      });
    }
    await Transaction.findByIdAndDelete(id);

    return res.status(200).json({
      status: "200 OK",
      code: 200,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error(`Error deleting transaction: ${error.message}`);
    next(error);
  }
});

module.exports = router;
