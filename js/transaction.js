document.addEventListener("DOMContentLoaded", () => {
    renderTransactions();

    document.getElementById("addBtn").addEventListener("click", () => {
        const title = document.getElementById("title").value;
        const amount = parseInt(document.getElementById("amount").value);
        const type = document.getElementById("type").value;

        if (!title || !amount) return;

        const newTransaction = {
            id: Date.now(),
            title,
            amount,
            type
        };

        addTransaction(newTransaction);
        renderTransactions();
    });
});

function renderTransactions() {
    const list = document.getElementById("transactionList");
    const transactions = getTransactions();

    list.innerHTML = "";

    transactions.forEach(trx => {
        const div = document.createElement("div");
        div.classList.add("transaction");

        div.innerHTML = `
            <span>${trx.title}</span>
            <span class="${trx.type}">
                ${trx.type === "income" ? "+" : "-"} Rp ${trx.amount}
            </span>
        `;

        list.appendChild(div);
    });
}