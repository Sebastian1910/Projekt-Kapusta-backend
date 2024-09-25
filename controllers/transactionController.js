const Transaction = require("../models/transaction.js");
const { getMonthYear, monthNames } = require("../config/date.js");
const {
  incomeCategorie,
  expenseCategorie,
} = require("../config/categories.js");

const postIncome = async (req, res, next) => {
  const { amount, category, description, date } = req.body;

  if (!incomeCategorie.includes(category)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect income category",
    });
  }

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
};

const getIncome = async (req, res, next) => {
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
};

const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user._id,
    });

    return res.status(200).json({
      status: "200 OK",
      code: 200,
      transactions,
    });
  } catch (error) {
    console.error(`Error fetching transactions stats: ${error.message}`);
    next(error);
  }
};

const postExpense = async (req, res, next) => {
  const { amount, category, description, date } = req.body;

  if (!expenseCategorie.includes(category)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect expense category",
    });
  }

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
};

const getExpense = async (req, res, next) => {
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
};

const deleteTransaction = async (req, res, next) => {
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
};

const summary = async (req, res, next) => {
  const currentYear = new Date().getFullYear();
  const { type } = req.query;

  if (!type || !["income", "expense"].includes(type)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid or missing type parameter. Use 'income' or 'expense'.",
    });
  }

  try {
    const transactions = await Transaction.find({
      userId: req.user._id,
      type: type,
      date: {
        $gte: new Date(`${currentYear}-01-01`),
        $lt: new Date(`${currentYear + 1}-01-01`),
      },
    });

    const summary = {};

    transactions.forEach((transaction) => {
      const { month, year } = getMonthYear(transaction.date);
      const dateForm = `${month} ${year}`;

      if (!summary[dateForm]) {
        summary[dateForm] = {
          month: monthNames[month],
          year: year,
          amount: 0,
        };
      }
      summary[dateForm].amount += transaction.amount;
    });
    const summaryArray = Object.values(summary);

    return res.status(200).json({
      status: "200 OK",
      code: 200,
      summary: summaryArray,
    });
  } catch (error) {
    console.error(`Error generating summary: ${error.message}`);
    next(error);
  }
};

module.exports = {
  postIncome,
  getAllTransactions,
  getIncome,
  postExpense,
  getExpense,
  deleteTransaction,
  summary,
};
