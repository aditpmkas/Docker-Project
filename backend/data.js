// backend/data.js
let transactions = [];

function addTransaction(description, amount, type) {
  const id = transactions.length + 1;
  transactions.push({
    id,
    description,
    amount: Number(amount),
    type, // 'income' or 'expense'
    date: new Date().toISOString().split('T')[0]
  });
}

function getSummary() {
  let income = 0;
  let expense = 0;
  for (let tx of transactions) {
    if (tx.type === 'income') income += tx.amount;
    else if (tx.type === 'expense') expense += tx.amount;
  }
  return {
    income,
    expense,
    balance: income - expense
  };
}

module.exports = { transactions, addTransaction, getSummary };
