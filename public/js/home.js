import { MATERIAS, GRADOS, JUEGOS } from "./catalog.js";
import { retoDelDia, hecho } from "./reto-dia.js";

// 🏠 Inicio: menú principal con categorías (#), página de cada categoría (#c/<id>) y menú ☰.
const $ = (s) => document.querySelector(s);
const KEY = "alt-filtros";
let filtro = { grado: "todos" };
try { filtro = { ...filtro, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch (_) {}
const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify({ grado: filtro.grado })); } catch (_) {} };

const TODOS = { id: "todos", nombre: "Todos los juegos", emoji: "🎮", color: "#1F3A5F" };
const categoria = (id) => (id === "todos" ? TODOS : MATERIAS.find((m) => m.id === id));
const delGrado = (j) => filtro.grado === "todos" || j.grados.includes(Number(filtro.grado));
const juegosDe = (id) => JUEGOS.filter((j) => (id === "todos" || j.materia === id) && delGrado(j));

const gradoTxt = (gs) => {
  const c = gs.map((g) => GRADOS.find((x) => x.id === g).corto);
  return c.length > 2 ? `${c[0]} a ${c[c.length - 1]}` : c.join(" y ");
};

function chipsGrado(el) {
  const items = [{ id: "todos", label: "Todos" }, ...GRADOS.map((g) => ({ id: g.id, label: g.corto }))];
  el.innerHTML = items.map((it) => `<button class="chip" data-id="${it.id}" aria-pressed="${String(it.id) === String(filtro.grado)}">${it.label}</button>`).join("");
  el.onclick = (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    filtro.grado = b.dataset.id; guardar(); render();
  };
}

// ---------- Menú principal ----------
// 🎯 Reto del día: el mismo para todos hoy
function pintarRetoDia() {
  const r = retoDelDia(), listo = hecho(r.fecha);
  const a = $("#retoDia");
  a.href = r.url; a.hidden = false;
  a.classList.toggle("hecho", listo);
  a.innerHTML = `<span class="rd-emoji" aria-hidden="true">${r.emoji}</span>
    <span class="rd-texto"><small>🎯 Reto del día${listo ? " · ✅ ¡Resuelto!" : ""}</small><b>${r.titulo}</b></span>
    <span class="rd-ir" aria-hidden="true">${listo ? "🔁" : "▶️"}</span>`;
}

function pintarInicio() {
  pintarRetoDia();
  chipsGrado($("#grados"));
  const tarjetas = [...MATERIAS, TODOS].map((m) => {
    const n = juegosDe(m.id).length;
    return `<a class="categoria${n ? "" : " vacia"}" href="#c/${m.id}" style="--mat:${m.color}">
      <span class="cat-emoji" aria-hidden="true">${m.emoji}</span>
      <span class="cat-nombre">${m.nombre}</span>
      <span class="cat-cuenta">${n ? `${n} ${n === 1 ? "juego" : "juegos"}` : "Pronto"}</span>
    </a>`;
  });
  $("#categorias").innerHTML = tarjetas.join("");
}

// ---------- Juegos de una categoría ----------
function pintarCategoria(id) {
  const m = categoria(id);
  $("#catTitulo").innerHTML = `<span aria-hidden="true">${m.emoji}</span> ${m.nombre}`;
  $("#catTitulo").style.setProperty("--mat", m.color);
  chipsGrado($("#gradosCat"));
  const lista = juegosDe(id);
  let html = lista.map((j) => {
    const mj = MATERIAS.find((x) => x.id === j.materia);
    return `<a class="game" href="${j.url}" style="--mat:${mj.color}">
      <span class="game-emoji" aria-hidden="true">${j.emoji}</span>
      <span class="game-body">
        <span class="game-title">${j.titulo}</span>
        <span class="game-desc">${j.descripcion}</span>
        <span class="game-meta">${id === "todos" ? `<span class="tag">${mj.emoji} ${mj.nombre}</span>` : ""}<span class="tag">${gradoTxt(j.grados)}</span></span>
      </span>
    </a>`;
  }).join("");
  if (!lista.length) {
    html = `<div class="empty">
      <span class="empty-emoji">${m.emoji}</span>
      <p><b>¡Estamos preparando juegos de ${m.nombre} para este grado!</b></p>
      <p>Mientras tanto, probá con otro grado o <a href="#">otra categoría</a>.</p>
    </div>`;
  }
  $("#juegos").innerHTML = html;
}

// ---------- Menú ☰ ----------
function pintarMenu(actual) {
  $("#menuCategorias").innerHTML = [...MATERIAS, TODOS].map((m) =>
    `<a class="menu-item${m.id === actual ? " actual" : ""}" href="#c/${m.id}" style="--mat:${m.color}"><span aria-hidden="true">${m.emoji}</span> ${m.nombre}<span class="menu-cuenta">${juegosDe(m.id).length}</span></a>`).join("");
}
function abrirMenu(abrir) {
  $("#menu").hidden = !abrir; $("#velo").hidden = !abrir;
  $("#menuBtn").setAttribute("aria-expanded", abrir);
  document.body.classList.toggle("menu-abierto", abrir);
  if (abrir) $("#cerrarMenu").focus();
}
$("#menuBtn").addEventListener("click", () => abrirMenu(true));
$("#cerrarMenu").addEventListener("click", () => abrirMenu(false));
$("#velo").addEventListener("click", () => abrirMenu(false));
$("#menu").addEventListener("click", (e) => { if (e.target.closest("a")) abrirMenu(false); });
addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#menu").hidden) { abrirMenu(false); $("#menuBtn").focus(); } });

// ---------- Rutas: # = inicio, #c/<id> = categoría ----------
function render() {
  const m = location.hash.match(/^#c\/([\w-]+)/);
  const id = m && categoria(m[1]) ? m[1] : null;
  $("#vistaInicio").hidden = !!id;
  $("#vistaCategoria").hidden = !id;
  if (id) pintarCategoria(id); else pintarInicio();
  pintarMenu(id);
  document.title = id ? `${categoria(id).nombre} · Aprendo a lo Tico` : "Aprendo a lo Tico · Juegos para aprender";
}
let ultimaRuta = location.hash;
addEventListener("hashchange", () => {
  render();
  if (location.hash !== ultimaRuta) scrollTo({ top: 0 });
  ultimaRuta = location.hash;
});

// Compatibilidad: quien tenía guardada una materia en el filtro viejo entra directo a esa categoría
if (!location.hash) {
  try {
    const viejo = JSON.parse(localStorage.getItem(KEY) || "{}").materia;
    if (viejo && viejo !== "todas" && categoria(viejo)) history.replaceState(null, "", `#c/${viejo}`);
  } catch (_) {}
}
render();

if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
