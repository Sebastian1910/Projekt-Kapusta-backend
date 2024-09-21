const Transaction = require("../models/transaction");
const {
  incomeCategorie,
  expenseCategorie,
} = require("../config/categories.js");

// Expenses
const getFullCategory = async (category) => {
  try {
    const categories = await Transaction.find();
  } catch (e) {
    console.log(e);
  }
};
// Amount by date
const getPeriodData = async (startDate, endDate) => {
  try {
    const transactions = await Transaction.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    const balance = transactions.reduce((acc, trans) => {
      return trans.type === "income" ? acc + trans.amount : acc - trans.amount;
    }, 0);
    return { transactions, balance };
  } catch (e) {
    console.log(e);
  }
};

const incomeCategories = async (_req, res, next) => {
  try {
    return res.status(200).json(incomeCategorie);
  } catch (e) {
    next(e);
  }
};

const expenseCategories = async (_req, res, next) => {
  try {
    return res.status(200).json(expenseCategorie);
  } catch (e) {
    next(e);
  }
};

const periodData = async (req, res, next) => {
  const { startDate, endDate } = req.query;
  try {
    const { transactions, balance } = await getPeriodData(startDate, endDate);
    return res.status(200).json({ transactions, balance });
  } catch (e) {
    next(e);
  }
};

const getUserFromHeaders = async (authorization) => {
  try {
    const [, token] = authorization.split(" ");
    const decodedToken = await jwt.decode(token, process.env.JWT_SECRET);
    const userId = decodedToken._id;
    return userId;
  } catch (e) {
    console.log(e);
  }
};
module.exports = {
  incomeCategories,
  expenseCategories,
  periodData,
  getUserFromHeaders,
};
