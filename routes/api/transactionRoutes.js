const express = require("express");
const {
  postIncome,
  getIncome,
  postExpense,
  getExpense,
  deleteTransaction,
  summary,
  getTransactions,
} = require("../../controllers/transactionController.js");
const authMiddleware = require("../../middleware/authMiddleware.js");

const router = express.Router();

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

router.get("/transaction", authMiddleware, getTransactions);
router.get("/transaction/income", authMiddleware, getIncome);
router.get("/transaction/expense", authMiddleware, getExpense);
router.delete("/transaction/:id", authMiddleware, deleteTransaction);
router.get("/summary", authMiddleware, summary);

module.exports = router;
