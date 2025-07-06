

const express = require('express');
const cors = require('cors');
const path = require('path');
const hbs = require('hbs');

const session = require('express-session');
const app = express();
const PORT = 3000;

// Data logic now in MongoDB
const { User, Transaction } = require('./mongodb');


const templatePath = path.join(__dirname, '../frontend');
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'finance-tracker-secret',
  resave: false,
  saveUninitialized: false
}));
app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.urlencoded({ extended: false }));
// Serve static files for Finance Tracker (css, js)
app.use('/static', express.static(path.join(__dirname, '../frontend')));

// Middleware untuk cek login
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.render('login');
  }
  next();
}

// Login/Register routes

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/home');
  }
  res.render('login');
});


app.get('/signup', (req, res) => {
  res.render('signup');
});


app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [ { name }, { email } ] });
    if (existingUser) {
      return res.send(`
        <h2>Username or email already taken.</h2>
        <button onclick=\"window.history.back()\">Back</button>
      `);
    }
    const newUser = await User.create({ name, email, password });
    console.log('User created:', newUser);
    // Hapus semua transaksi lama user jika ada (reset akun)
    await Transaction.deleteMany({ username: name });
    req.session.user = newUser.name;
    res.redirect('/home');
  } catch (err) {
    console.error('Signup error:', err);
    res.send('An error occurred during registration.');
  }
});


app.post('/login', async (req, res) => {
  try {
    const loginInput = req.body.login;
    const password = req.body.password;
    const user = await User.findOne({ $or: [ { name: loginInput }, { email: loginInput } ] });
    if (user && user.password === password) {
      req.session.user = user.name;
      res.redirect('/home');
    } else {
      res.render('login', { loginError: 'Wrong username/email or password', loginValue: loginInput });
    }
  } catch {
    res.render('login', { loginError: 'Login error' });
  }
});


app.get('/home', requireLogin, (req, res) => {
  res.render('home', { username: req.session.user });
});



app.get('/transactions', requireLogin, async (req, res) => {
  try {
    const txs = await Transaction.find({ username: req.session.user });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});



app.post('/transactions', requireLogin, async (req, res) => {
  const { description, amount, type } = req.body;
  if (!description || !amount || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    await Transaction.create({
      username: req.session.user,
      description,
      amount: Number(amount),
      type,
      date: new Date().toISOString().split('T')[0]
    });
    res.status(201).json({ message: 'Transaction added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});



app.get('/summary', requireLogin, async (req, res) => {
  try {
    const txs = await Transaction.find({ username: req.session.user });
    let income = 0, expense = 0;
    txs.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else if (t.type === 'expense') expense += t.amount;
    });
    res.json({
      balance: income - expense,
      income,
      expense
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});
// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
