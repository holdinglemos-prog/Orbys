const app = document.getElementById("app");

let ideas = JSON.parse(localStorage.getItem("ideas")) || [];

function render() {
  app.innerHTML = `
    <h1>Funil de Ideias</h1>
    <button onclick="addIdea()">+ Nova ideia</button>
    <ul>
      ${ideas.map(i => `<li>${i}</li>`).join("")}
    </ul>
  `;
}

function addIdea() {
  const idea = prompt("Digite sua ideia:");
  if (!idea) return;
  ideas.push(idea);
  localStorage.setItem("ideas", JSON.stringify(ideas));
  render();
}

render();
