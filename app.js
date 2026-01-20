const app = document.getElementById("app");

let ideas = JSON.parse(localStorage.getItem("ideas")) || [];

function save() {
  localStorage.setItem("ideas", JSON.stringify(ideas));
}

function render() {
  app.innerHTML = `
    <h1>Funil de Ideias</h1>
    <button onclick="addIdea()">+ Nova ideia</button>
    <div id="canvas"></div>
  `;

  const canvas = document.getElementById("canvas");

  ideas.forEach(idea => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerText = idea.title;
    el.style.left = idea.x + "px";
    el.style.top = idea.y + "px";

    let offsetX, offsetY;

    el.addEventListener("touchstart", e => {
      const touch = e.touches[0];
      offsetX = touch.clientX - idea.x;
      offsetY = touch.clientY - idea.y;
    });

    el.addEventListener("touchmove", e => {
      e.preventDefault();
      const touch = e.touches[0];
      idea.x = touch.clientX - offsetX;
      idea.y = touch.clientY - offsetY;
      el.style.left = idea.x + "px";
      el.style.top = idea.y + "px";
    });

    el.addEventListener("touchend", save);

    canvas.appendChild(el);
  });
}

function addIdea() {
  const title = prompt("Nome da ideia:");
  if (!title) return;

  ideas.push({
    id: Date.now(),
    title,
    x: 20,
    y: 120
  });

  save();
  render();
}

render();
