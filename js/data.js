// File ini HANYA berisi data dummy (data contoh).
// Semua data di sini bersifat statis — tidak ada yang disimpan
// ke localStorage atau database manapun.
//
// Isi file ini:
//   1. transactions — daftar transaksi keuangan
//   2. goals        — daftar saving goals
//   3. budgets      — daftar budget per kategori

// 1. TRANSACTIONS
// Setiap transaksi punya properti:
//   id       : nomor unik
//   date     : tanggal transaksi (format YYYY-MM-DD)
//   name     : nama/deskripsi transaksi
//   amount   : jumlah uang (angka)
//   type     : 'income' (pemasukan) atau 'expense' (pengeluaran)
//   category : kategori transaksi
//   status   : 'successful' atau 'cancelled'
const transactions = [
  {
    id: 1,
    date: "2024-06-02",
    name: "Cashback rewards",
    amount: 25,
    type: "income",
    category: "Cashback",
    status: "successful",
  },
  {
    id: 2,
    date: "2024-06-05",
    name: "Refund from XYZ Store",
    amount: 75,
    type: "income",
    category: "Refund",
    status: "successful",
  },
  {
    id: 3,
    date: "2024-06-10",
    name: "Investment dividends",
    amount: 100,
    type: "income",
    category: "Investment",
    status: "successful",
  },
  {
    id: 4,
    date: "2024-06-12",
    name: "Freelance project payment",
    amount: 390,
    type: "income",
    category: "Salary",
    status: "successful",
  },
  {
    id: 5,
    date: "2024-06-15",
    name: "YouTube subscription",
    amount: 10,
    type: "expense",
    category: "Entertainment",
    status: "successful",
  },
  {
    id: 6,
    date: "2024-06-17",
    name: "Grocery shopping",
    amount: 150,
    type: "expense",
    category: "Food & Groceries",
    status: "successful",
  },
  {
    id: 7,
    date: "2024-06-19",
    name: "Electricity bill",
    amount: 80,
    type: "expense",
    category: "Bills & Utilities",
    status: "successful",
  },
  {
    id: 8,
    date: "2024-06-20",
    name: "Gym membership",
    amount: 50,
    type: "expense",
    category: "Health & Beauty",
    status: "successful",
  },
  {
    id: 9,
    date: "2024-06-22",
    name: "Online course",
    amount: 200,
    type: "expense",
    category: "Education",
    status: "cancelled",
  },
  {
    id: 10,
    date: "2024-06-25",
    name: "Paycheck from ABC Company",
    amount: 1500,
    type: "income",
    category: "Salary",
    status: "successful",
  },
];

// 2. GOALS
// Setiap goal punya properti:
//   id      : nomor unik
//   name    : nama goal
//   target  : jumlah uang yang ingin dicapai
//   saved   : jumlah uang yang sudah ditabung
//   dueDate : target tanggal selesai
//   status  : 'in-progress', 'finished', atau 'cancelled'
const goals = [
  {
    id: 1,
    name: "MacBook Pro",
    target: 1650,
    saved: 412,
    dueDate: "2024-10-07",
    status: "in-progress",
  },
  {
    id: 2,
    name: "New Car",
    target: 60000,
    saved: 25000,
    dueDate: "2025-09-25",
    status: "in-progress",
  },
  {
    id: 3,
    name: "Vacation",
    target: 3500,
    saved: 2500,
    dueDate: "2024-12-31",
    status: "in-progress",
  },
];

// 3. BUDGETS
// Setiap budget punya properti:
//   id       : nomor unik
//   category : nama kategori pengeluaran
//   limit    : batas maksimal pengeluaran bulan ini
//   spent    : jumlah yang sudah dikeluarkan bulan ini
//   icon     : emoji untuk tampilan visual
const budgets = [
  {
    id: 1,
    category: "Food & Groceries",
    limit: 650,
    spent: 487,
    icon: "🛒",
  },
  {
    id: 2,
    category: "Entertainment",
    limit: 200,
    spent: 10,
    icon: "🎮",
  },
  {
    id: 3,
    category: "Health & Beauty",
    limit: 500,
    spent: 235,
    icon: "💄",
  },
  {
    id: 4,
    category: "Education",
    limit: 400,
    spent: 200,
    icon: "📚",
  },
  {
    id: 5,
    category: "Bills & Utilities",
    limit: 300,
    spent: 80,
    icon: "⚡",
  },
];
