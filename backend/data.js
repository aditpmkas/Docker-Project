// backend/data.js
// Per-user in-memory transaction store
const userTransactions = {}; // { username: [ {date, description, amount, type}, ... ] }

function addTransaction(username, description, amount, type) {
  if (!userTransactions[username]) userTransactions[username] = [];
  userTransactions[username].push({
    date: new Date().toISOString().split('T')[0],
    description,
    amount: Number(amount),
    type
  });
}

function getSummary(username) {
  const txs = userTransactions[username] || [];
  let income = 0, expense = 0;
  txs.forEach(t => {
    if (t.type === 'income') income += t.amount;
    else if (t.type === 'expense') expense += t.amount;
  });
  return {
    balance: income - expense,
    income,
    expense
  };
}

function getTransactions(username) {
  return userTransactions[username] || [];
}

module.exports = { addTransaction, getSummary, getTransactions };
