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

const BUDGET_KEY = "budgets";
function getBudgets() {
  const data = localStorage.getItem(BUDGET_KEY);
  return data ? JSON.parse(data) : [];
}

function saveBudgets(budgets) {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
}

function addBudget(budget) {
  const budgets = getBudgets();
  budgets.push(budget);
  saveBudgets(budgets);
}

function seedBudget() {
  if (getBudgets().length === 0) {
    saveBudgets([
      { category: "Food", limit: 1000000 },
      { category: "Transport", limit: 500000 },
    ]);
  }
}

const GOALS_KEY = "goals";

function getGoals() {
  const data = localStorage.getItem(GOALS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveGoals(goals) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

function addGoal(goal) {
  const goals = getGoals();
  goals.push(goal);
  saveGoals(goals);
}

function seedGoals() {
  if (getGoals().length === 0) {
    saveGoals([
      { name: "Laptop", target: 10000000, saved: 2000000 },
      { name: "Liburan", target: 5000000, saved: 1000000 },
    ]);
  }
}
