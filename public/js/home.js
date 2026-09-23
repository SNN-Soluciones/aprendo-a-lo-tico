import { MATERIAS, GRADOS, JUEGOS } from "./catalog.js";

const $ = (s) => document.querySelector(s);
const KEY = "alt-filtros";
let filtro = { materia: "todas", grado: "todos" };
try { filtro = { ...filtro, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch (_) {}

function guardar() {
  try { localStorage.setItem(KEY, JSON.stringify(filtro)); } catch (_) {}
}

function chips(el, items, actual, onPick) {
  el.innerHTML = items
    .map((it) => `<button class="chip" data-id="${it.id}" aria-pressed="${String(it.id) === String(actual)}"
      ${it.color ? `style="--chip:${it.color}"` : ""}>${it.emoji ? it.emoji + " " : ""}${it.label}</button>`)
    .join("");
  el.onclick = (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    onPick(b.dataset.id);
  };
}

function render() {
  chips(
    $("#materias"),
    [{ id: "todas", label: "Todas" }, ...MATERIAS.map((m) => ({ id: m.id, label: m.nombre, emoji: m.emoji, color: m.color }))],
    filtro.materia,
    (id) => { filtro.materia = id; guardar(); render(); }
  );
  chips(
    $("#grados"),
    [{ id: "todos", label: "Todos" }, ...GRADOS.map((g) => ({ id: g.id, label: g.corto }))],
    filtro.grado,
    (id) => { filtro.grado = id; guardar(); render(); }
  );

  const lista = JUEGOS.filter(
    (j) =>
      (filtro.materia === "todas" || j.materia === filtro.materia) &&
      (filtro.grado === "todos" || j.grados.includes(Number(filtro.grado)))
  );

  const gradoTxt = (gs) => {
    const c = gs.map((g) => GRADOS.find((x) => x.id === g).corto);
    return c.length > 2 ? `${c[0]} a ${c[c.length - 1]}` : c.join(" y ");
  };

  let html = lista
    .map((j) => {
      const m = MATERIAS.find((x) => x.id === j.materia);
      return `<a class="game" href="${j.url}" style="--mat:${m.color}">
        <span class="game-emoji" aria-hidden="true">${j.emoji}</span>
        <span class="game-body">
          <span class="game-title">${j.titulo}</span>
          <span class="game-desc">${j.descripcion}</span>
          <span class="game-meta"><span class="tag">${m.emoji} ${m.nombre}</span><span class="tag">${gradoTxt(j.grados)}</span></span>
        </span>
      </a>`;
    })
    .join("");

  if (!lista.length) {
    const m = MATERIAS.find((x) => x.id === filtro.materia);
    html = `<div class="empty">
      <span class="empty-emoji">${m ? m.emoji : "🧩"}</span>
      <p><b>¡Estamos preparando juegos${m ? " de " + m.nombre : ""} para este grado!</b></p>
      <p>Mientras tanto, probá con otro grado o materia.</p>
    </div>`;
  }
  $("#juegos").innerHTML = html;
}

render();

if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
