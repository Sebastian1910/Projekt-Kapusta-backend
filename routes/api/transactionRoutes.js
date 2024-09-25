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
  getAllTransactions,
} = require("../../controllers/transactionController.js");

dotenv.config();
const router = express.Router();

router.post("/transaction/all", authMiddleware, getAllTransactions);
router.post("/transaction/income", authMiddleware, postIncome);
router.get("/transaction/income", authMiddleware, getIncome);
router.post("/transaction/expense", authMiddleware, postExpense);
router.get("/transaction/expense", authMiddleware, getExpense);
router.delete("/transaction/:id", authMiddleware, deleteTransaction);
router.get("/transaction/summary", authMiddleware, summary);

module.exports = router;
