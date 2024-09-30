const Transaction = require("../models/Transaction");
const {
  incomeCategorie,
  expenseCategorie,
} = require("../config/categories.js");

const getPeriodData = async (startDate, endDate) => {
  try {
    const transactions = await Transaction.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    const balance = transactions.reduce(
      (acc, trans) =>
        trans.type === "income" ? acc + trans.amount : acc - trans.amount,
      0
    );
    return { transactions, balance };
  } catch (e) {
    console.log(e);
  }
};

const fetchReports = async (req, res, next) => {
  const { year, month } = req.query;
  try {
    const reports = await getReportsFromDatabase(year, month);
    if (!reports) {
      return res.status(404).json({ message: "Reports not found" });
    }
    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error in fetchReports:", error);
    next(error);
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

module.exports = {
  incomeCategories,
  expenseCategories,
  periodData,
  fetchReports,
};
