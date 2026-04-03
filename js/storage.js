// ===== LOCAL STORAGE HELPER =====
// File ini menangani semua operasi penyimpanan data ke browser

const STORAGE_KEYS = {
  transactions: "fintrack_transactions",
  goals: "fintrack_goals",
  budgets: "fintrack_budgets",
};

// Simpan data ke localStorage
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Ambil data dari localStorage
function getFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Hapus data dari localStorage
function removeFromStorage(key) {
  localStorage.removeItem(key);
}

// ===== INISIALISASI DATA =====
// Cek apakah data sudah ada di localStorage
// Kalau belum, isi dengan data dummy dari data.js

function initStorage() {
  // Cek transactions
  const storedTransactions = getFromStorage(STORAGE_KEYS.transactions);
  if (!storedTransactions) {
    saveToStorage(STORAGE_KEYS.transactions, transactions);
  }

  // Cek goals
  const storedGoals = getFromStorage(STORAGE_KEYS.goals);
  if (!storedGoals) {
    saveToStorage(STORAGE_KEYS.goals, goals);
  }

  // Cek budgets
  const storedBudgets = getFromStorage(STORAGE_KEYS.budgets);
  if (!storedBudgets) {
    saveToStorage(STORAGE_KEYS.budgets, budgets);
  }
}

// ===== FUNGSI SPESIFIK =====

function getTransactions() {
  return getFromStorage(STORAGE_KEYS.transactions) || transactions;
}

function saveTransactions(data) {
  saveToStorage(STORAGE_KEYS.transactions, data);
}

function getGoals() {
  return getFromStorage(STORAGE_KEYS.goals) || goals;
}

function saveGoals(data) {
  saveToStorage(STORAGE_KEYS.goals, data);
}

function getBudgets() {
  return getFromStorage(STORAGE_KEYS.budgets) || budgets;
}

function saveBudgets(data) {
  saveToStorage(STORAGE_KEYS.budgets, data);
}
