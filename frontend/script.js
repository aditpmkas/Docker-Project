const form = document.getElementById('transaction-form');
const table = document.getElementById('transaction-table');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');

// Gunakan nama service Docker Compose, bukan localhost
const API_BASE = 'http://backend:3000';

async function fetchTransactions() {
  try {kjg
    const res = await fetch(`${API_BASE}/transactions`);
    return await res.json();
  } catch (err) {
    console.error('Gagal fetch transaksi:', err);
    return [];
  }
}

async function fetchSummary() {
  try {
    const res = await fetch(`${API_BASE}/summary`);
    return await res.json();
  } catch (err) {
    console.error('Gagal fetch ringkasan:', err);
    return { income: 0, expense: 0, balance: 0 };
  }
}

function formatCurrency(number) {
  return 'Rp' + Number(number).toLocaleString('id-ID');
}

async function render() {
  const transactions = await fetchTransactions();
  const summary = await fetchSummary();

  // Update ringkasan
  balanceEl.textContent = formatCurrency(summary.balance);
  incomeEl.textContent = formatCurrency(summary.income);
  expenseEl.textContent = formatCurrency(summary.expense);

  // Render tabel transaksi
  table.innerHTML = '';
  transactions.forEach(tx => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${tx.date}</td>
      <td>${tx.description}</td>
      <td>${tx.type}</td>
      <td>${formatCurrency(tx.amount)}</td>
    `;
    table.appendChild(row);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const description = document.getElementById('description').value;
  const amount = document.getElementById('amount').value;
  const type = document.getElementById('type').value;

  try {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount, type })
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('Gagal menambahkan transaksi:', error);
      alert('Gagal menambahkan transaksi: ' + error.error);
      return;
    }

    form.reset();
    render();
  } catch (err) {
    console.error('Error saat submit:', err);
    alert('Terjadi kesalahan saat mengirim data');
  }
});

render();
