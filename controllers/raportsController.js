const Transaction = require("../models/transaction");
const {
  incomeCategorie,
  expenseCategorie,
} = require("../config/categories.js");

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
    const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
    const userId = decodedToken._id;
    return userId;
  } catch (e) {
    console.log(e);
  }
};

// Funkcja agregująca dane raportów z bazy
const getReportsFromDatabase = async (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Ostatni dzień miesiąca

  try {
    // Pobieramy transakcje w danym miesiącu
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate },
    });

    // Suma wydatków
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, trans) => acc + trans.amount, 0);

    // Suma dochodów
    const incomes = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, trans) => acc + trans.amount, 0);

    return { year, month, expenses, incomes };
  } catch (error) {
    console.log("Error fetching reports from database:", error);
    throw error;
  }
};

// Funkcja fetchReports
const fetchReports = async (req, res, next) => {
  const { year, month } = req.query;

  try {
    // Pobierz dane raportów z bazy danych
    const reports = await getReportsFromDatabase(year, month);

    // Jeśli brak raportów, zwróć 404
    if (!reports) {
      return res.status(404).json({ message: "Reports not found" });
    }

    // Zwracamy dane raportów
    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error in fetchReports:", error);
    next(error);
  }
};

module.exports = {
  incomeCategories,
  expenseCategories,
  periodData,
  getUserFromHeaders,
  fetchReports,
};
