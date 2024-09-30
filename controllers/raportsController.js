const Transaction = require("../models/Transaction");
const {
  incomeCategorie,
  expenseCategorie,
} = require("../config/categories.js");

// Funkcja do pobierania danych raportów z bazy danych
const getReportsFromDatabase = async (year, month) => {
  const startDate = new Date(year, month - 1, 1); // Pierwszy dzień miesiąca
  const endDate = new Date(year, month, 0); // Ostatni dzień miesiąca

  endDate.setHours(23, 59, 59, 999); // Ustawienie pełnych godzin na koniec dnia

  try {
    // Pobieranie transakcji w danym miesiącu
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate },
    });

    // Obliczanie sumy wydatków
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, trans) => acc + trans.amount, 0);

    // Obliczanie sumy dochodów
    const incomes = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, trans) => acc + trans.amount, 0);

    // Zwracanie raportów
    return { year, month, expenses, incomes };
  } catch (error) {
    console.error("Error fetching reports from database:", error);
    throw error;
  }
};

// Funkcja fetchReports do pobierania raportów
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
