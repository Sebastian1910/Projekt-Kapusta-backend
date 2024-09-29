const express = require("express");
const dotenv = require("dotenv");
const authMiddleware = require("../../middleware/authMiddleware.js");
const {
  postIncome,
  getIncome,
  postExpense,
  getExpense,
  deleteTransaction,
  summary,
  getTransactions,
} = require("../../controllers/transactionController.js");

dotenv.config();
const router = express.Router();

// Dodanie transakcji (dochód lub wydatek)
router.post("/transaction", authMiddleware, (req, res, next) => {
  const { type } = req.body;
  if (type === "income") {
    return postIncome(req, res, next);
  } else if (type === "expense") {
    return postExpense(req, res, next);
  } else {
    return res.status(400).json({ message: "Invalid transaction type" });
  }
});

// Pobranie wszystkich transakcji dla zalogowanego użytkownika
router.get("/transaction", authMiddleware, getTransactions);

// Pobranie dochodów
router.get("/transaction/income", authMiddleware, getIncome);

// Pobranie wydatków
router.get("/transaction/expense", authMiddleware, getExpense);

// Usunięcie transakcji
router.delete("/transaction/:id", authMiddleware, deleteTransaction);

// Podsumowanie transakcji
router.get("/summary", authMiddleware, summary);

module.exports = router;
