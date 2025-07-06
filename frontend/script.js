// Copy of Finance Tracker's script.js for frontend templates
// Place your JS here or copy from ../script.js
const form = document.getElementById('transaction-form');
const table = document.getElementById('transaction-table');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const amountInput = document.getElementById('amount');

const API_BASE = 'http://localhost:3000'; // atau ganti ke 'http://backend:3000' jika di dalam container

function formatCurrency(number) {
  return 'Rp' + Number(number).toLocaleString('id-ID');
}

async function fetchTransactions() {
  try {
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
    return { balance: 0, income: 0, expense: 0 };
  }
}

async function render() {
  const transactions = await fetchTransactions();
  const summary = await fetchSummary();

  // Update summary
  balanceEl.textContent = formatCurrency(summary.balance);
  incomeEl.textContent = formatCurrency(summary.income);
  expenseEl.textContent = formatCurrency(summary.expense);

  // Render table
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

amountInput.addEventListener('input', function(e) {
  // Ambil hanya digit angka
  let value = this.value.replace(/\D/g, '');
  if (value) {
    // Format dengan titik setiap 3 digit
    this.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  } else {
    this.value = '';
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const description = document.getElementById('description').value.trim();
  // Ambil value amount, hilangkan titik sebelum di-parse
  const amount = parseFloat(document.getElementById('amount').value.replace(/\./g, ''));
  const type = document.getElementById('type').value;

  if (!description || isNaN(amount) || !type) {
    alert('Semua field wajib diisi dengan benar.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount, type })
    });

    if (!res.ok) throw new Error('Gagal kirim');

    form.reset();
    await render(); // 🔁 Refresh data
  } catch (err) {
    console.error('Error saat submit:', err);
    alert('Terjadi kesalahan saat mengirim data');
  }
});

render(); // 🚀 Initial render
