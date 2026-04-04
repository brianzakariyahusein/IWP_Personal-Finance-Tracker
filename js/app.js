// APP.JS — FinTrack Personal Finance Tracker
//
// File ini mengatur semua logika tampilan website.
// Data diambil langsung dari data.js (array statis).
// Tidak ada localStorage, tidak ada simpan/hapus data.
//
// Urutan isi file ini:
//   1. NAVIGASI      — pindah antar section
//   2. HELPER        — fungsi bantu (format angka, pagination)
//   3. DASHBOARD     — tampilkan summary cards + 3 widget
//   4. TRANSACTIONS  — tampilkan tabel transaksi + filter
//   5. GOALS         — tampilkan kartu saving goals
//   6. BUDGET        — tampilkan kartu budget
//   7. MODAL         — buka/tutup modal (tampilan saja)
//   8. INIT          — jalankan pertama kali saat halaman dibuka

// 1. NAVIGASI
// Mengatur perpindahan antar section saat nav-item diklik.
// Cara kerja:
//   - Semua section disembunyikan (hapus class 'active')
//   - Section yang dipilih ditampilkan (tambah class 'active')
//   - Judul topbar diubah sesuai section
//   - Fungsi render section yang sesuai dipanggil

var navItems = document.querySelectorAll(".nav-item[data-section]");
var sections = document.querySelectorAll(".section");
var pageTitle = document.getElementById("pageTitle");

function navigateTo(sectionName) {
  // Sembunyikan semua section dan nonaktifkan semua nav
  navItems.forEach(function (item) {
    item.classList.remove("active");
  });
  sections.forEach(function (sec) {
    sec.classList.remove("active");
  });

  // Aktifkan nav dan section yang sesuai
  var activeNav = document.querySelector(
    '.nav-item[data-section="' + sectionName + '"]',
  );
  if (activeNav) activeNav.classList.add("active");

  var activeSection = document.getElementById("section-" + sectionName);
  if (activeSection) activeSection.classList.add("active");

  // Update judul topbar
  pageTitle.textContent =
    sectionName.charAt(0).toUpperCase() + sectionName.slice(1);

  // Render konten section yang dipilih
  if (sectionName === "dashboard") renderDashboard();
  if (sectionName === "transactions") renderTransactions();
  if (sectionName === "goals") renderGoals();
  if (sectionName === "budget") renderBudget();
}

// Event listener untuk setiap nav-item di sidebar
navItems.forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    navigateTo(item.getAttribute("data-section"));
  });
});

// Event listener untuk link "See all →" di dashboard
var seeAllLinks = document.querySelectorAll(".see-all[data-section]");
seeAllLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    navigateTo(link.getAttribute("data-section"));
  });
});

// 2. HELPER
// Fungsi bantu yang dipakai berulang di banyak tempat.

// Format angka ke Rupiah — contoh: 1500 → "Rp 1,500.00"
function formatCurrency(amount) {
  return "Rp " + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Potong array sesuai halaman — contoh: paginate([1..10], 2, 5) → [6..10]
function paginate(data, page, perPage) {
  var start = (page - 1) * perPage;
  return data.slice(start, start + perPage);
}

// Buat tombol pagination ← 1 2 3 → di dalam container
function renderPagination(
  containerId,
  totalItems,
  currentPage,
  perPage,
  onPageChange,
) {
  var totalPages = Math.ceil(totalItems / perPage);
  var container = document.getElementById(containerId);
  container.innerHTML = "";

  if (totalPages <= 1) return; // tidak perlu pagination kalau cuma 1 halaman

  // Tombol ← kembali
  var prevBtn = document.createElement("button");
  prevBtn.textContent = "←";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", function () {
    onPageChange(currentPage - 1);
  });
  container.appendChild(prevBtn);

  // Tombol nomor halaman — pakai IIFE agar nilai i tidak berubah di closure
  for (var i = 1; i <= totalPages; i++) {
    (function (pageNum) {
      var btn = document.createElement("button");
      btn.textContent = pageNum;
      if (pageNum === currentPage) btn.classList.add("active-page");
      btn.addEventListener("click", function () {
        onPageChange(pageNum);
      });
      container.appendChild(btn);
    })(i);
  }

  // Tombol → maju
  var nextBtn = document.createElement("button");
  nextBtn.textContent = "→";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", function () {
    onPageChange(currentPage + 1);
  });
  container.appendChild(nextBtn);
}

// 3. DASHBOARD
// Menampilkan ringkasan keuangan di halaman utama.

var dashPage = { transactions: 1, goals: 1, budget: 1 };
var DASH_PER_PAGE = 5;

// Hitung total income dari array transactions
function getTotalIncome() {
  var total = 0;
  transactions.forEach(function (t) {
    if (t.type === "income") total += t.amount;
  });
  return total;
}

// Hitung total expense dari array transactions
function getTotalExpense() {
  var total = 0;
  transactions.forEach(function (t) {
    if (t.type === "expense") total += t.amount;
  });
  return total;
}

// Hitung total yang sudah ditabung dari semua goals
function getTotalSavings() {
  var total = 0;
  goals.forEach(function (g) {
    total += g.saved;
  });
  return total;
}

// Fungsi utama dashboard
function renderDashboard() {
  var income = getTotalIncome();
  var expense = getTotalExpense();

  // Isi angka di 4 summary cards
  document.getElementById("totalBalance").textContent = formatCurrency(
    income - expense,
  );
  document.getElementById("totalIncome").textContent = formatCurrency(income);
  document.getElementById("totalExpense").textContent = formatCurrency(expense);
  document.getElementById("totalSavings").textContent =
    formatCurrency(getTotalSavings());

  renderDashboardTransactions();
  renderDashboardGoals();
  renderDashboardBudget();
}

// Widget recent transactions
function renderDashboardTransactions() {
  var tbody = document.getElementById("recentTransactionsList");
  tbody.innerHTML = "";

  var paged = paginate(transactions, dashPage.transactions, DASH_PER_PAGE);

  paged.forEach(function (t) {
    var amountClass = t.type === "income" ? "amount-income" : "amount-expense";
    var amountSign = t.type === "income" ? "+" : "-";
    var statusClass =
      t.status === "successful" ? "status-successful" : "status-cancelled";

    var row = document.createElement("tr");
    row.innerHTML =
      "<td>" +
      t.date +
      "</td>" +
      "<td>" +
      t.name +
      "</td>" +
      '<td class="' +
      amountClass +
      '">' +
      amountSign +
      formatCurrency(t.amount) +
      "</td>" +
      "<td>" +
      t.category +
      "</td>" +
      '<td><span class="status-badge ' +
      statusClass +
      '">' +
      t.status +
      "</span></td>";
    tbody.appendChild(row);
  });

  renderPagination(
    "paginationTransactions",
    transactions.length,
    dashPage.transactions,
    DASH_PER_PAGE,
    function (page) {
      dashPage.transactions = page;
      renderDashboardTransactions();
    },
  );
}

// Widget saving goals
function renderDashboardGoals() {
  var container = document.getElementById("goalsList");
  container.innerHTML = "";

  var paged = paginate(goals, dashPage.goals, DASH_PER_PAGE);

  paged.forEach(function (g) {
    var percent = g.target
      ? Math.min(Math.round((g.saved / g.target) * 100), 100)
      : 0;
    var item = document.createElement("div");
    item.classList.add("goal-item");
    item.innerHTML =
      '<div class="goal-info">' +
      '<span class="goal-name">' +
      g.name +
      "</span>" +
      '<span class="goal-amount">' +
      formatCurrency(g.saved) +
      " / " +
      formatCurrency(g.target) +
      "</span>" +
      "</div>" +
      '<div class="progress-bar"><div class="progress-fill" style="width:' +
      percent +
      '%"></div></div>' +
      '<p class="goal-percent">' +
      percent +
      "% completed</p>";
    container.appendChild(item);
  });

  renderPagination(
    "paginationGoals",
    goals.length,
    dashPage.goals,
    DASH_PER_PAGE,
    function (page) {
      dashPage.goals = page;
      renderDashboardGoals();
    },
  );
}

// Widget budget
function renderDashboardBudget() {
  var container = document.getElementById("dashboardBudgetList");
  container.innerHTML = "";

  var paged = paginate(budgets, dashPage.budget, DASH_PER_PAGE);

  paged.forEach(function (b) {
    var percent = b.limit
      ? Math.min(Math.round((b.spent / b.limit) * 100), 100)
      : 0;
    var isOver = percent >= 80;
    var item = document.createElement("div");
    item.classList.add("goal-item");
    item.innerHTML =
      '<div class="goal-info">' +
      '<span class="goal-name">' +
      b.icon +
      " " +
      b.category +
      "</span>" +
      '<span class="goal-amount">' +
      formatCurrency(b.spent) +
      " / " +
      formatCurrency(b.limit) +
      "</span>" +
      "</div>" +
      '<div class="progress-bar"><div class="progress-fill" style="width:' +
      percent +
      "%; background-color:" +
      (isOver ? "var(--danger)" : "var(--primary)") +
      '"></div></div>' +
      '<div style="display:flex; justify-content:space-between; margin-top:4px;">' +
      '<span class="goal-percent">' +
      percent +
      "% spent</span>" +
      '<span class="status-badge ' +
      (isOver ? "badge-warning" : "badge-success") +
      '">' +
      (isOver ? "need attention" : "on track") +
      "</span>" +
      "</div>";
    container.appendChild(item);
  });

  renderPagination(
    "paginationBudget",
    budgets.length,
    dashPage.budget,
    DASH_PER_PAGE,
    function (page) {
      dashPage.budget = page;
      renderDashboardBudget();
    },
  );
}

// 4. TRANSACTIONS
// Tabel semua transaksi dengan filter tipe & kategori.

var transPage = 1;
var TRANS_PER_PAGE = 8;

function renderTransactions() {
  var filterType = document.getElementById("filterType").value;
  var filterCategory = document.getElementById("filterCategory").value;

  // Salin array lalu filter
  var data = transactions.slice();
  if (filterType !== "all") {
    data = data.filter(function (t) {
      return t.type === filterType;
    });
  }
  if (filterCategory !== "all") {
    data = data.filter(function (t) {
      return t.category === filterCategory;
    });
  }

  populateCategoryFilter();

  var paged = paginate(data, transPage, TRANS_PER_PAGE);
  var tbody = document.getElementById("transactionTableBody");
  tbody.innerHTML = "";

  if (paged.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center;color:var(--text-gray);padding:24px;">No transactions found</td></tr>';
    return;
  }

  paged.forEach(function (t) {
    var amountClass = t.type === "income" ? "amount-income" : "amount-expense";
    var amountSign = t.type === "income" ? "+" : "-";
    var statusClass =
      t.status === "successful" ? "status-successful" : "status-cancelled";

    var row = document.createElement("tr");
    row.innerHTML =
      "<td>" +
      t.date +
      "</td>" +
      "<td>" +
      t.name +
      "</td>" +
      '<td class="' +
      amountClass +
      '">' +
      amountSign +
      formatCurrency(t.amount) +
      "</td>" +
      "<td>" +
      t.category +
      "</td>" +
      '<td><span class="status-badge ' +
      statusClass +
      '">' +
      t.status +
      "</span></td>";
    tbody.appendChild(row);
  });

  renderPagination(
    "paginationTransactionPage",
    data.length,
    transPage,
    TRANS_PER_PAGE,
    function (page) {
      transPage = page;
      renderTransactions();
    },
  );
}

// Isi dropdown kategori dari data transaksi
function populateCategoryFilter() {
  var select = document.getElementById("filterCategory");
  var current = select.value;

  var allCategories = [];
  transactions.forEach(function (t) {
    if (allCategories.indexOf(t.category) === -1)
      allCategories.push(t.category);
  });

  select.innerHTML = '<option value="all">All Categories</option>';
  allCategories.forEach(function (cat) {
    var opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    if (cat === current) opt.selected = true;
    select.appendChild(opt);
  });
}

// Re-render otomatis saat filter berubah
document.getElementById("filterType").addEventListener("change", function () {
  transPage = 1;
  renderTransactions();
});
document
  .getElementById("filterCategory")
  .addEventListener("change", function () {
    transPage = 1;
    renderTransactions();
  });

// 5. GOALS
// Grid kartu saving goals.

function renderGoals() {
  var grid = document.getElementById("goalsGrid");
  grid.innerHTML = "";

  goals.forEach(function (g) {
    var percent = g.target
      ? Math.min(Math.round((g.saved / g.target) * 100), 100)
      : 0;
    var card = document.createElement("div");
    card.classList.add("goal-card");
    card.innerHTML =
      '<div class="goal-card-header">' +
      '<span class="goal-card-title">' +
      g.name +
      "</span>" +
      '<span class="status-badge badge-success" style="font-size:11px;">' +
      g.status +
      "</span>" +
      "</div>" +
      '<div class="goal-info" style="margin-top:8px;">' +
      '<span class="goal-amount">' +
      formatCurrency(g.saved) +
      "</span>" +
      '<span class="goal-amount">of ' +
      formatCurrency(g.target) +
      "</span>" +
      "</div>" +
      '<div class="progress-bar" style="margin-top:10px;"><div class="progress-fill" style="width:' +
      percent +
      '%"></div></div>' +
      '<p class="goal-percent" style="margin-top:6px;">' +
      percent +
      "% completed</p>" +
      '<p class="goal-card-due">🗓 Due: ' +
      g.dueDate +
      "</p>";
    grid.appendChild(card);
  });
}

// 6. BUDGET
// Grid kartu budget per kategori.

function renderBudget() {
  var grid = document.getElementById("budgetGrid");
  grid.innerHTML = "";

  budgets.forEach(function (b) {
    var percent = b.limit
      ? Math.min(Math.round((b.spent / b.limit) * 100), 100)
      : 0;
    var isOver = percent >= 80;
    var card = document.createElement("div");
    card.classList.add("budget-card");
    card.innerHTML =
      '<div class="budget-card-header">' +
      '<span class="budget-card-title">' +
      b.icon +
      " " +
      b.category +
      "</span>" +
      "</div>" +
      '<div class="goal-info">' +
      '<span class="goal-amount">' +
      formatCurrency(b.spent) +
      " spent</span>" +
      '<span class="goal-amount">Limit: ' +
      formatCurrency(b.limit) +
      "</span>" +
      "</div>" +
      '<div class="progress-bar" style="margin-top:10px;"><div class="progress-fill" style="width:' +
      percent +
      "%; background-color:" +
      (isOver ? "var(--danger)" : "var(--primary)") +
      '"></div></div>' +
      '<div style="display:flex; justify-content:space-between; margin-top:8px;">' +
      '<span class="goal-percent">' +
      percent +
      "% used</span>" +
      '<span class="status-badge ' +
      (isOver ? "badge-warning" : "badge-success") +
      '">' +
      (isOver ? "⚠ Need attention" : "✓ On track") +
      "</span>" +
      "</div>";
    grid.appendChild(card);
  });
}

// 7. MODAL
// Buka/tutup modal saja — tombol Save tidak menyimpan data.

document.addEventListener("DOMContentLoaded", function () {
  // Transaction
  document
    .getElementById("btnAddTransaction")
    .addEventListener("click", function () {
      document.getElementById("modalTransaction").classList.add("open");
    });

  document
    .getElementById("closeModalTransaction")
    .addEventListener("click", function () {
      openConfirm("Close Form", "Discard this transaction?", function () {
        document.getElementById("modalTransaction").classList.remove("open");
      });
    });

  document
    .getElementById("cancelModalTransaction")
    .addEventListener("click", function () {
      openConfirm("Close Form", "Discard this transaction?", function () {
        document.getElementById("modalTransaction").classList.remove("open");
      });
    });

  document
    .getElementById("saveTransaction")
    .addEventListener("click", function () {
      openConfirm("Save Data", "Save this transaction?", function () {
        document.getElementById("modalTransaction").classList.remove("open");
      });
    });

  // Goal
  document.getElementById("btnAddGoal").addEventListener("click", function () {
    document.getElementById("modalGoal").classList.add("open");
  });

  document
    .getElementById("closeModalGoal")
    .addEventListener("click", function () {
      openConfirm("Close Form", "Discard this goal?", function () {
        document.getElementById("modalGoal").classList.remove("open");
      });
    });

  document
    .getElementById("cancelModalGoal")
    .addEventListener("click", function () {
      openConfirm("Close Form", "Discard this goal?", function () {
        document.getElementById("modalGoal").classList.remove("open");
      });
    });

  document.getElementById("saveGoal").addEventListener("click", function () {
    openConfirm("Save Data", "Save this goal?", function () {
      document.getElementById("modalGoal").classList.remove("open");
    });
  });

  // Budget
  document
    .getElementById("btnAddBudget")
    .addEventListener("click", function () {
      document.getElementById("modalBudget").classList.add("open");
    });

  document
    .getElementById("closeModalBudget")
    .addEventListener("click", function () {
      openConfirm("Close Form", "Discard this budget?", function () {
        document.getElementById("modalBudget").classList.remove("open");
      });
    });

  document
    .getElementById("cancelModalBudget")
    .addEventListener("click", function () {
      openConfirm("Close Form", "Discard this budget?", function () {
        document.getElementById("modalBudget").classList.remove("open");
      });
    });

  document.getElementById("saveBudget").addEventListener("click", function () {
    openConfirm("Save Data", "Save this budget?", function () {
      document.getElementById("modalBudget").classList.remove("open");
    });
  });
  // close when click out of the card
  window.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal-overlay")) {
      e.target.classList.remove("open");
    }
  });

  var confirmCallback = null;

  function openConfirm(title, message, callback) {
    document.getElementById("confirmTitle").textContent = title;
    document.getElementById("confirmMessage").textContent = message;

    confirmCallback = callback;
    document.getElementById("modalConfirm").classList.add("open");
  }

  // tombol cancel
  document
    .getElementById("confirmCancel")
    .addEventListener("click", function () {
      document.getElementById("modalConfirm").classList.remove("open");
    });

  // tombol yes
  document.getElementById("confirmOk").addEventListener("click", function () {
    if (confirmCallback) confirmCallback();
    document.getElementById("modalConfirm").classList.remove("open");
  });
});

// 8. INIT
// Jalankan renderDashboard() satu kali saat halaman pertama dibuka.

// renderDashboard();

document.addEventListener("DOMContentLoaded", function () {
  renderDashboard();
});
