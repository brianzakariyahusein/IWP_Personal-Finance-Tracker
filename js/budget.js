document.addEventListener("DOMContentLoaded", () => {
    renderBudgets();

    document.getElementById("addBudgetBtn").addEventListener("click", () => {
        const category = document.getElementById("category").value;
        const limit = parseInt(document.getElementById("limit").value);

        if (!category || !limit) return;

        addBudget({ category, limit });
        renderBudgets();
    });
});

function renderBudgets() {
    const budgets = getBudgets();
    const transactions = getTransactions();

    const container = document.getElementById("budgetList");
    container.innerHTML = "";

    budgets.forEach(budget => {
        const spent = transactions
            .filter(t => t.type === "expense" && t.title.toLowerCase().includes(budget.category.toLowerCase()))
            .reduce((sum, t) => sum + t.amount, 0);

        const percent = Math.min((spent / budget.limit) * 100, 100);

        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <h4>${budget.category}</h4>
            <p>${formatRupiah(spent)} / ${formatRupiah(budget.limit)}</p>
            <div class="progress">
                <div class="progress-bar" style="width:${percent}%"></div>
            </div>
        `;

        container.appendChild(div);
    });
}