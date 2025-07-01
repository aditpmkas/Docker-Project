// backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const { transactions, addTransaction, getSummary } = require('./data');

app.use(cors());
app.use(express.json());

app.get('/transactions', (req, res) => {
  res.json(transactions);
});

app.post('/transactions', (req, res) => {
  const { description, amount, type } = req.body;
  if (!description || !amount || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  addTransaction(description, amount, type);
  res.status(201).json({ message: 'Transaction added' });
});

app.get('/summary', (req, res) => {
  res.json(getSummary());
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
