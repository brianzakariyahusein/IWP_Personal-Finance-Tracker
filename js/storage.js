const STORAGE_KEY = "transactions";

function getTransactions() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function addTransaction(transaction) {
  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
}

// Dummy Data
function seedDummyData() {
  if (getTransactions().length === 0) {
    const Dummy = [
      {
        id: 1,
        title: "Gaji",
        amount: 5000000,
        type: "income",
      },
      {
        id: 2,
        title: "Beli Kopi",
        amount: 20000,
        type: "expense",
      },
    ];
    saveTransactions(dummy);
  }
}