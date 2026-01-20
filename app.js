const canvas = document.getElementById("canvas");
const svg = document.getElementById("lines");

let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
let connections = JSON.parse(localStorage.getItem("connections")) || [];

let connectMode = false;
let firstSelected = null;

// salvar
function save() {
  localStorage.setItem("ideas", JSON.stringify(ideas));
  localStorage.setItem("connections", JSON.stringify(connections));
}

// criar ideia
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

// ativar conexão
function toggleConnect() {
  connectMode = !connectMode;
  firstSelected = null;

  document.querySelectorAll(".card")
    .forEach(c => c.style.outline = "none");
}

// render
function render() {
  canvas.querySelectorAll(".card").forEach(c => c.remove());
  renderLines();

  ideas.forEach(idea => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerText = idea.title;
    el.style.left = idea.x + "px";
    el.style.top = idea.y + "px";

    let offsetX = 0;
    let offsetY = 0;

    el.addEventListener("touchstart", e => {
      const t = e.touches[0];
      offsetX = t.clientX - idea.x;
      offsetY = t.clientY - idea.y;
    });

    el.addEventListener("touchmove", e => {
      e.preventDefault();
      const t = e.touches[0];

      idea.x = t.clientX - offsetX;
      idea.y = t.clientY - offsetY;

      // limites da tela
      idea.x = Math.max(0, Math.min(idea.x, window.innerWidth - el.offsetWidth));
      idea.y = Math.max(0, Math.min(idea.y, window.innerHeight - el.offsetHeight));

      el.style.left = idea.x + "px";
      el.style.top = idea.y + "px";

      renderLines();
    });

    el.addEventListener("click", () => handleConnect(idea, el));

    canvas.appendChild(el);
  });
}

// conectar ideias
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

    firstSelected = null;
    connectMode = false;

    document.querySelectorAll(".card")
      .forEach(c => c.style.outline = "none");

    save();
    renderLines();
  }
}

// desenhar linhas
function renderLines() {
  svg.innerHTML = "";

  connections.forEach(c => {
    const a = ideas.find(i => i.id === c.from);
    const b = ideas.find(i => i.id === c.to);
    if (!a || !b) return;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", a.x + 50);
    line.setAttribute("y1", a.y + 25);
    line.setAttribute("x2", b.x + 50);
    line.setAttribute("y2", b.y + 25);
    line.setAttribute("stroke", "#777");
    line.setAttribute("stroke-width", "2");

    svg.appendChild(line);
  });
}

// start
render();
