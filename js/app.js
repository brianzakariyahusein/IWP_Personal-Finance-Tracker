

// ===== NAVIGATION =====
// 1. Ambil semua nav-item dan semua section
const navItems = document.querySelectorAll(".nav-item[data-section]");
const sections = document.querySelectorAll(".section");
const pageTitle = document.getElementById("pageTitle");

// 2. Fungsi untuk pindah section
function navigateTo(sectionName) {
  // Hapus class 'active' dari semua nav-item
  navItems.forEach(function (item) {
    item.classList.remove("active");
  });

  // Hapus class 'active' dari semua section
  sections.forEach(function (sec) {
    sec.classList.remove("active");
  });

  // Tambah class 'active' ke nav-item yang diklik
  const activeNav = document.querySelector(
    '.nav-item[data-section="' + sectionName + '"]',
  );
  if (activeNav) {
    activeNav.classList.add("active");
  }

  // Tampilkan section yang sesuai
  const activeSection = document.getElementById("section-" + sectionName);
  if (activeSection) {
    activeSection.classList.add("active");
  }

  // Ganti judul halaman di topbar
  pageTitle.textContent =
    sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
  // Render section yang sesuai
  if (sectionName === "dashboard") {
    renderDashboard();
  }
}

// 3. Pasang event listener ke setiap nav-item
navItems.forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault(); // Cegah link berpindah halaman
    const sectionName = item.getAttribute("data-section");
    navigateTo(sectionName);
  });
});

// 4. Pasang event listener untuk link "See all"
const seeAllLinks = document.querySelectorAll(".see-all[data-section]");
seeAllLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const sectionName = link.getAttribute("data-section");
    navigateTo(sectionName);
  });
});

// ===== DASHBOARD =====
function getTotalIncome() {
  let total = 0;
  getTransactions().forEach(function(t) {
    if (t.type === 'income') total += t.amount;
  });
  return total;
}

function getTotalExpense() {
  let total = 0;
  getTransactions().forEach(function(t) {
    if (t.type === 'expense') total += t.amount;
  });
  return total;
}

function getTotalSavings() {
  let total = 0;
  getGoals().forEach(function(g) {
    total += g.saved;
  });
  return total;
}


// Fungsi format angka jadi currency
function formatCurrency(amount) {
  return "Rp " + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ===== PAGINATION HELPER =====
function paginate(data, page, perPage) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return data.slice(start, end);
}

function renderPagination(
  containerId,
  totalItems,
  currentPage,
  perPage,
  onPageChange,
) {
  const totalPages = Math.ceil(totalItems / perPage);
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (totalPages <= 1) return;

  // Tombol Prev
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "←";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", function () {
    onPageChange(currentPage - 1);
  });
  container.appendChild(prevBtn);

  // Nomor halaman
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    if (i === currentPage) pageBtn.classList.add("active-page");
    pageBtn.addEventListener("click", function () {
      onPageChange(i);
    });
    container.appendChild(pageBtn);
  }

  // Tombol Next
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "→";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", function () {
    onPageChange(currentPage + 1);
  });
  container.appendChild(nextBtn);
}

// Fungsi tampilkan data ke Dashboard

// ===== STATE PAGINATION DASHBOARD =====
let dashPage = { transactions: 1, goals: 1, budget: 1 };
const PER_PAGE = 5;

function renderDashboard() {
  // Hitung summary
  const income = getTotalIncome();
  const expense = getTotalExpense();
  const balance = income - expense;
  const savings = getTotalSavings();

  document.getElementById("totalBalance").textContent = formatCurrency(balance);
  document.getElementById("totalIncome").textContent = formatCurrency(income);
  document.getElementById("totalExpense").textContent = formatCurrency(expense);
  document.getElementById("totalSavings").textContent = formatCurrency(savings);

  // ===== RECENT TRANSACTIONS =====
  renderDashboardTransactions();

  // ===== SAVING GOALS =====
  renderDashboardGoals();

  // ===== BUDGET =====
  renderDashboardBudget();
}

// --- Render Transactions dengan Pagination ---
function renderDashboardTransactions() {
  const tbody = document.getElementById("recentTransactionsList");
  tbody.innerHTML = "";

  const data = getTransactions();
  const paged = paginate(data, dashPage.transactions, PER_PAGE);

  paged.forEach(function (t) {
    const amountClass =
      t.type === "income" ? "amount-income" : "amount-expense";
    const amountSign = t.type === "income" ? "+" : "-";
    const statusClass =
      t.status === "successful" ? "status-successful" : "status-cancelled";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.date}</td>
      <td>${t.name}</td>
      <td class="${amountClass}">${amountSign}${formatCurrency(t.amount)}</td>
      <td>${t.category}</td>
      <td><span class="status-badge ${statusClass}">${t.status}</span></td>
    `;
    tbody.appendChild(row);
  });

  renderPagination(
    "paginationTransactions",
    data.length,
    dashPage.transactions,
    PER_PAGE,
    function (page) {
      dashPage.transactions = page;
      renderDashboardTransactions();
    },
  );
}

// --- Render Goals dengan Pagination ---
function renderDashboardGoals() {
  const goalsList = document.getElementById("goalsList");
  goalsList.innerHTML = "";

  const data = getGoals();
  const paged = paginate(data, dashPage.goals, PER_PAGE);

  paged.forEach(function (g) {
    const percent = Math.round((g.saved / g.target) * 100);
    const goalItem = document.createElement("div");
    goalItem.classList.add("goal-item");
    goalItem.innerHTML = `
      <div class="goal-info">
        <span class="goal-name">${g.name}</span>
        <span class="goal-amount">${formatCurrency(g.saved)} / ${formatCurrency(g.target)}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>
      <p class="goal-percent">${percent}% completed</p>
    `;
    goalsList.appendChild(goalItem);
  });

  renderPagination(
    "paginationGoals",
    data.length,
    dashPage.goals,
    PER_PAGE,
    function (page) {
      dashPage.goals = page;
      renderDashboardGoals();
    },
  );
}

// --- Render Budget dengan Pagination ---
function renderDashboardBudget() {
  const budgetList = document.getElementById("dashboardBudgetList");
  budgetList.innerHTML = "";

  const data = getBudgets();
  const paged = paginate(data, dashPage.budget, PER_PAGE);
  
  paged.forEach(function (b) {
    const percent = Math.round((b.spent / b.limit) * 100);
    const isOver = percent >= 80;
    const fillColor = isOver ? "var(--danger)" : "var(--primary)";
    const badgeClass = isOver ? "badge-warning" : "badge-success";
    const badgeText = isOver ? "need attention" : "on track";

    const budgetItem = document.createElement("div");
    budgetItem.classList.add("goal-item");
    budgetItem.innerHTML = `
      <div class="goal-info">
        <span class="goal-name">${b.icon} ${b.category}</span>
        <span class="goal-amount">${formatCurrency(b.spent)} / ${formatCurrency(b.limit)}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percent}%; background-color: ${fillColor}"></div>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top:4px;">
        <span class="goal-percent">${percent}% spent</span>
        <span class="status-badge ${badgeClass}">${badgeText}</span>
      </div>
    `;
    budgetList.appendChild(budgetItem);
  });

  renderPagination(
    "paginationBudget",
    data.length,
    dashPage.budget,
    PER_PAGE,
    function (page) {
      dashPage.budget = page;
      renderDashboardBudget();
    },
  );
}

// ===== JALANKAN SAAT HALAMAN PERTAMA LOAD =====
renderDashboard();
initStorage();