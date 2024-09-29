import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const TransactionSchema = new Schema({
  userId: {
    type: _Schema.Types.ObjectId,
    ref: "User",
    required: [true, "UserId is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
});

const Transaction = model("Transaction", TransactionSchema);

export default Transaction;
