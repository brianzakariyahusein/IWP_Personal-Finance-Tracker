document.addEventListener("DOMContentLoaded", () => {
  renderGoals();

  document.getElementById("addGoalBtn").addEventListener("click", () => {
    const name = document.getElementById("goalName").value;
    const target = parseInt(document.getElementById("goalTarget").value);

    if (!name || !target) return;

    addGoal({ name, target, saved: 0 });
    renderGoals();
  });
});

function renderGoals() {
  const goals = getGoals();
  const container = document.getElementById("goalList");

  container.innerHTML = "";

  goals.forEach((goal) => {
    const percent = Math.min((goal.saved / goal.target) * 100, 100);

    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
            <h4>${goal.name}</h4>
            <p>${formatRupiah(goal.saved)} / ${formatRupiah(goal.target)}</p>
            <div class="progress">
                <div class="progress-bar" style="width:${percent}%"></div>
            </div>
        `;

    container.appendChild(div);
  });
}
