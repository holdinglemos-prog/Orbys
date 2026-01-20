// 1️⃣ Referência principal
const app = document.getElementById("app");

// 2️⃣ Estados
let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
let connections = JSON.parse(localStorage.getItem("connections")) || [];
let connectMode = false;
let firstSelected = null;

// 3️⃣ Salvar
function save() {
  localStorage.setItem("ideas", JSON.stringify(ideas));
  localStorage.setItem("connections", JSON.stringify(connections));
}

// 4️⃣ Criar nova ideia
function addIdea() {
  const title = prompt("Digite a ideia");
  if (!title) return;

  ideas.push({
    id: Date.now(),
    title,
    x: 40,
    y: 40
  });

  save();
  render();
}

// 5️⃣ Ativar modo conexão
function toggleConnect() {
  connectMode = !connectMode;
  firstSelected = null;

  document.querySelectorAll(".card").forEach(c => {
    c.style.outline = "none";
  });
}

// 6️⃣ Conectar ideias
function handleConnect(idea, el) {
  if (!connectMode) return;

  if (!firstSelected) {
    firstSelected = idea;
    el.style.outline = "2px solid #4da3ff";
  } else {
    if (firstSelected.id === idea.id) return;

    connections.push({
      from: firstSelected.id,
      to: idea.id
    });

    connectMode = false;
    firstSelected = null;

    document.querySelectorAll(".card").forEach(c => {
      c.style.outline = "none";
    });

    save();
    renderLines();
  }
}

// 7️⃣ Renderizar linhas
function renderLines() {
  const svg = document.getElementById("lines");
  if (!svg) return;

  svg.innerHTML = "";

  connections.forEach(c => {
    const a = ideas.find(i => i.id === c.from);
    const b = ideas.find(i => i.id === c.to);
    if (!a || !b) return;

    const line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    line.setAttribute("x1", a.x + 60);
    line.setAttribute("y1", a.y + 25);
    line.setAttribute("x2", b.x + 60);
    line.setAttribute("y2", b.y + 25);
    line.setAttribute("stroke", "#888");
    line.setAttribute("stroke-width", "2");

    svg.appendChild(line);
  });
}

// 8️⃣ Render principal
function render() {
  app.innerHTML = `
    <h1>Funil de Ideias</h1>
    <button onclick="addIdea()">+ Nova ideia</button>
    <button onclick="toggleConnect()">🔗 Conectar</button>
    <div id="canvas">
      <svg id="lines"></svg>
    </div>
  `;

  const canvas = document.getElementById("canvas");

  ideas.forEach(idea => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerText = idea.title;
    el.style.left = idea.x + "px";
    el.style.top = idea.y + "px";

    // Drag touch (mobile)
    let offsetX, offsetY;

    el.addEventListener("touchstart", e => {
      const t = e.touches[0];
      offsetX = t.clientX - idea.x;
      offsetY = t.clientY - idea.y;
    });

    el.addEventListener("touchmove", e => {
      e.preventDefault();
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();

      idea.x = t.clientX - rect.left - offsetX;
      idea.y = t.clientY - rect.top - offsetY;

      el.style.left = idea.x + "px";
      el.style.top = idea.y + "px";

      renderLines();
    });

    // Conexão
    el.addEventListener("click", () => handleConnect(idea, el));

    canvas.appendChild(el);
  });

  renderLines();
}

// 9️⃣ Inicializar
render();
