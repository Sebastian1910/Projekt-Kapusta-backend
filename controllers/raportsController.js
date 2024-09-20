const Transaction = require("../models/Transaction");

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
module.exports = { getPeriodData };
