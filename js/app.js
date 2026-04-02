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
  if (sectionName === 'dashboard') {
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

// ===== DASHBOARD =====

// Fungsi hitung total income
function getTotalIncome() {
  let total = 0;
  transactions.forEach(function (t) {
    if (t.type === "income") {
      total += t.amount;
    }
  });
  return total;
}

// Fungsi hitung total expense
function getTotalExpense() {
  let total = 0;
  transactions.forEach(function (t) {
    if (t.type === "expense") {
      total += t.amount;
    }
  });
  return total;
}

// Fungsi hitung total savings dari goals
function getTotalSavings() {
  let total = 0;
  goals.forEach(function (g) {
    total += g.saved;
  });
  return total;
}

// Fungsi format angka jadi currency
function formatCurrency(amount) {
  return "$" + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Fungsi tampilkan data ke Dashboard
function renderDashboard() {
  // Hitung semua nilai
  const income = getTotalIncome();
  const expense = getTotalExpense();
  const balance = income - expense;
  const savings = getTotalSavings();

  // Isi summary cards
  document.getElementById("totalBalance").textContent = formatCurrency(balance);
  document.getElementById("totalIncome").textContent = formatCurrency(income);
  document.getElementById("totalExpense").textContent = formatCurrency(expense);
  document.getElementById("totalSavings").textContent = formatCurrency(savings);

  // ===== RECENT TRANSACTIONS =====
  const tbody = document.getElementById("recentTransactionsList");
  tbody.innerHTML = ""; // Kosongkan dulu

  // Ambil 5 transaksi terakhir saja
  const recent = transactions.slice(-5).reverse();

  recent.forEach(function (t) {
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

  // ===== SAVING GOALS =====
  const goalsList = document.getElementById("goalsList");
  goalsList.innerHTML = ""; // Kosongkan dulu

  goals.forEach(function (g) {
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

  // ===== DASHBOARD BUDGET =====
  const dashboardBudgetList = document.getElementById('dashboardBudgetList');
  dashboardBudgetList.innerHTML = '';

  budgets.forEach(function(b) {
    const percent = Math.round((b.spent / b.limit) * 100);
    const isOver = percent >= 80;
    const fillColor = isOver ? 'var(--danger)' : 'var(--primary)';
    const badgeClass = isOver ? 'badge-warning' : 'badge-success';
    const badgeText = isOver ? 'need attention' : 'on track';

    const budgetItem = document.createElement('div');
    budgetItem.classList.add('goal-item');
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
    dashboardBudgetList.appendChild(budgetItem);
  });
}

// ===== JALANKAN SAAT HALAMAN PERTAMA LOAD =====
renderDashboard();

// ===== UPDATE FUNGSI NAVIGASI =====
// Tambahkan ini di dalam fungsi navigateTo,
// tepat sebelum tanda kurung tutup terakhir '}'

// Cari baris ini di navigateTo :
// pageTitle.textContent = sectionName.charAt(0)...

// Tambahkan DI BAWAH baris itu:
// if (sectionName === 'dashboard') { renderDashboard(); }
