const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/logintest")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("failed to connect");
  });


const LogInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { collection: 'account' });


const TransactionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  description: String,
  amount: Number,
  type: String, // 'income' or 'expense'
  date: String
}, { collection: 'transactions' });

const User = mongoose.model("User", LogInSchema);
const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = { User, Transaction };
