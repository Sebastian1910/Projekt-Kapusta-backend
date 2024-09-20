const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware.js");

const {
  periodData,
  incomeCategories,
  expenseCategories,
} = require("../../controllers/raportsController.js");

const router = express.Router();

router.get("/income-categories", authMiddleware, incomeCategories);
router.get("/expense-categories", authMiddleware, expenseCategories);
router.get("/period-data", authMiddleware, periodData);

//Komentarz Wojtka
// Work in progress

// router.get("/byMonths", authMiddleware, async (req, res, next) => {
//   try {
//     const thisYear = new Date().getFullYear();
//     const trans = await Transaction.find({ userId: decodedToken._id });
//     return res.status(200).json();
//   } catch (e) {
//     next(e);
//   }
// });

module.exports = router;
