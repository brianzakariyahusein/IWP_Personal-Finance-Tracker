document.addEventListener("DOMContentLoaded", () => {
  renderTransactions();
});

function renderTransactions() {
  const transactions = getTransactions();

  let income = 0;
  let expense = 0;

  transactions.forEach((trx) => {
    if (trx.type === "income") {
      income += trx.amount;
    } else {
      expense += trx.amount;
    }
  });

  const balance = income - expense;

  //   Update UI
  document.getElementById("balance").innerText = formatRupiah(balance);
  document.getElementById("income").innerText = formatRupiah(income);
  document.getElementById("expense").innerText = formatRupiah(expense);

  renderRecent(transactions);
}

function renderRecent(transactions) {
  const container = document.getElementById("recentTransactions");

  container.innerHTML = "";

  const recent = transactions.slice(-5).reverse();

  recent.forEach((trx) => {
    const div = document.createElement("div");
    div.classList.add("transaction");

    div.innerHTML = `
        <span>${trx.title}</span>
        <span class="${trx.type}">
            ${trx.type === "income" ? "+" : "-"} ${formatRupiah(trx.amount)}
        </span>
    `;

    container.appendChild(div);
  });
}

function formatRupiah(number) {
    return "Rp " + number.toLocaleString("id-ID");
}