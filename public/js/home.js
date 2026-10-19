import { MATERIAS, GRADOS, JUEGOS } from "./catalog.js";
import { retoDelDia, hecho } from "./reto-dia.js";
import { AVATARES, EDADES, LECTURA, perfiles, perfilActivo, usarPerfil, guardarPerfil, borrarPerfil, gradosParaEdad, juegosPara } from "./perfil.js";
import { hablar, sonido } from "./voz.js";

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

// ---------- 👧 ¿Quién juega? ----------
// Se pregunta la edad y si ya lee; con eso se sugieren los juegos y cada juego sabe por dónde empezar.
const escapar = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const nombreDe = p => escapar(p.nombre) || `${p.edad} años`;
let editando = null; // perfil que se está creando o cambiando: { id?, edad, lee, avatar, nombre }
const OMITIDO = "alt-perfil-omitido"; // tocaron «Ahora no»: se invita con un botón chiquito en vez del formulario
const omitido = () => { try { return !!localStorage.getItem(OMITIDO); } catch (_) { return false; } };

function pintarQuien() {
  const lista = perfiles(), activo = perfilActivo();
  if (!lista.length && !editando) {
    if (omitido()) {
      document.body.classList.remove("con-perfil");
      $("#quien").innerHTML = `<button class="quien-invita" data-accion="nuevo">👋 ¿Quién va a jugar? <b>Decinos su edad</b> y te mostramos sus juegos</button>`;
      return;
    }
    editando = { edad: null, lee: null, avatar: AVATARES[0], nombre: "" };
  }
  document.body.classList.toggle("con-perfil", !!activo && !editando);
  if (editando) return pintarEditor(!lista.length);
  const lee = LECTURA.find(l => l.id === activo?.lee);
  $("#quien").innerHTML = `<div class="perfiles" role="group" aria-label="¿Quién juega?">${lista.map(p =>
    `<button class="perfil" data-p="${p.id}" aria-pressed="${p.id === activo?.id}"><span class="av" aria-hidden="true">${p.avatar}</span><span class="pn">${nombreDe(p)}</span></button>`).join("")}
    <button class="perfil otro" data-accion="nuevo"><span class="av" aria-hidden="true">➕</span><span class="pn">Otro</span></button></div>
    ${activo ? `<p class="perfil-info">${activo.edad} años · ${lee.emoji} ${lee.nombre} <button class="mini" data-accion="editar">✏️ Cambiar</button></p>` : ""}`;
}

function pintarEditor(primeraVez) {
  const e = editando;
  $("#quien").innerHTML = `<form class="editor" id="editor" novalidate>
    <h2>${primeraVez ? "👋 ¿Quién va a jugar?" : e.id ? "✏️ Cambiar datos" : "➕ Otro niño o niña"}</h2>
    ${primeraVez ? `<p class="editor-intro">Contanos la edad y si ya lee, y te mostramos los juegos que le tocan. Los juegos suben de nivel de a poquito, según cómo le vaya.</p>` : ""}
    <p class="paso">1. ¿Cuántos años tiene?</p>
    <div class="edades">${EDADES.map(n => `<button type="button" data-edad="${n}" aria-pressed="${n === e.edad}">${n}${n === EDADES[EDADES.length - 1] ? "+" : ""}</button>`).join("")}</div>
    <p class="paso">2. ¿Ya sabe leer?</p>
    <div class="lectura">${LECTURA.map(l => `<button type="button" data-lee="${l.id}" aria-pressed="${l.id === e.lee}"><span aria-hidden="true">${l.emoji}</span> ${l.nombre}</button>`).join("")}</div>
    <p class="paso">3. Su animalito y su nombre <small>(opcional)</small></p>
    <div class="avatares">${AVATARES.map(a => `<button type="button" data-avatar="${a}" aria-pressed="${a === e.avatar}" aria-label="Animalito ${a}">${a}</button>`).join("")}</div>
    <input class="nombre" name="nombre" maxlength="20" autocomplete="off" placeholder="Nombre o apodo" value="${escapar(e.nombre || "")}">
    <p class="privado">🔒 Se guarda solo en este dispositivo. No se envía a ningún lado.</p>
    <p class="editor-falta" id="editorFalta" hidden>Escogé la edad y si ya lee 👆</p>
    <div class="editor-botones">
      <button type="submit" class="btn">✅ Listo</button>
      <button type="button" class="btn secundario" data-accion="${primeraVez ? "omitir" : "cancelar"}">${primeraVez ? "Ahora no" : "Cancelar"}</button>
      ${e.id ? `<button type="button" class="btn secundario" data-accion="borrar">🗑️ Borrar</button>` : ""}
    </div>
  </form>`;
}

$("#quien").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.p) {
    usarPerfil(b.dataset.p);
    const p = perfilActivo();
    filtro.grado = String(gradosParaEdad(p.edad)[0]); guardar();
    sonido("tap");
    hablar(`¡Hola${p.nombre ? `, ${p.nombre}` : ""}! ¿A qué querés jugar?`);
    return render();
  }
  const accion = b.dataset.accion;
  if (accion === "nuevo") { editando = { edad: null, lee: null, avatar: AVATARES[perfiles().length % AVATARES.length], nombre: "" }; return render(); }
  if (accion === "editar") { editando = { ...perfilActivo() }; return render(); }
  if (accion === "cancelar") { editando = null; return render(); }
  if (accion === "omitir") { try { localStorage.setItem(OMITIDO, "1"); } catch (_) {} editando = null; return render(); }
  if (accion === "borrar") {
    if (!confirm(`¿Borrar a ${editando.nombre || "este perfil"} y su progreso en este dispositivo?`)) return;
    borrarPerfil(editando.id); editando = null; return render();
  }
  // Botones del editor: se marcan sin volver a dibujar (así no se borra lo que se escribió)
  for (const k of ["edad", "lee", "avatar"]) {
    if (b.dataset[k] === undefined) continue;
    editando[k] = k === "edad" ? Number(b.dataset[k]) : b.dataset[k];
    b.parentElement.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    sonido("tap");
  }
});
$("#quien").addEventListener("input", e => { if (e.target.name === "nombre") editando.nombre = e.target.value; });
$("#quien").addEventListener("submit", e => {
  e.preventDefault();
  if (!editando.edad || !editando.lee) { $("#editorFalta").hidden = false; return; }
  const p = guardarPerfil(editando);
  editando = null;
  filtro.grado = String(gradosParaEdad(p.edad)[0]); guardar();
  sonido("ok");
  hablar(`¡Listo${p.nombre ? `, ${p.nombre}` : ""}! Estos son tus juegos.`);
  render();
  $("#sugeridos").scrollIntoView({ behavior: "smooth", block: "start" });
});

// Juegos para el niño activo: tarjetas grandes con 🔊 para oír el nombre (para los que no leen)
const tarjetaGrande = j => {
  const mj = MATERIAS.find(x => x.id === j.materia);
  return `<div class="sug" style="--mat:${mj.color}">
    <a class="sug-link" href="${j.url}"><span class="sug-emoji" aria-hidden="true">${j.emoji}</span><span class="sug-titulo">${j.titulo}</span>
      <span class="sug-marcas">${j.escalera ? `<span title="Sube de nivel de a poquito">🪜</span>` : ""}</span></a>
    <button class="sug-oir" data-oir="${j.id}" aria-label="Escuchar: ${j.titulo}">🔊</button>
  </div>`;
};
// Si son muchos (los grandes tienen decenas), se agrupan por materia, cada grupo con los más justos a su edad primero
const agrupados = lista => lista.length <= 10 ? lista.map(tarjetaGrande).join("") : MATERIAS.map(m => {
  const de = lista.filter(j => j.materia === m.id);
  return de.length ? `<h3 class="sug-materia" style="--mat:${m.color}"><span aria-hidden="true">${m.emoji}</span> ${m.nombre}</h3>${de.map(tarjetaGrande).join("")}` : "";
}).join("");
function pintarSugeridos() {
  const p = perfilActivo();
  $("#sugeridos").hidden = !p || !!editando;
  if (!p || editando) return;
  const { juegos, conAyuda } = juegosPara(JUEGOS, p);
  $("#sugTitulo").innerHTML = `<span aria-hidden="true">${p.avatar}</span> Juegos para ${p.nombre ? escapar(p.nombre) : "vos"}`;
  $("#sugNota").textContent = p.lee === "no"
    ? "Para jugar escuchando y mirando, sin leer. 🔊 dice el nombre de cada juego. 🪜 = sube de nivel solito, de a poquito."
    : `${juegos.length > 10 ? "Por materia; en cada una, primero los que mejor le quedan a su edad." : "Los de más arriba le quedan mejor a su edad."} 🪜 = sube de nivel solito, de a poquito.`;
  $("#sugLista").innerHTML = agrupados(juegos) || `<p class="sug-nota">Todavía no hay juegos para esta edad. ¡Pronto!</p>`;
  $("#conAyuda").hidden = !conAyuda.length;
  $("#conAyudaTitulo").textContent = `📖 Con un adulto que le lea (${conAyuda.length})`;
  $("#conAyudaLista").innerHTML = agrupados(conAyuda);
}
$("#sugeridos").addEventListener("click", e => {
  const b = e.target.closest("[data-oir]");
  if (!b) return;
  const j = JUEGOS.find(x => x.id === b.dataset.oir);
  sonido("tap");
  hablar(`${j.titulo}. ${j.descripcion.replace(/[«»]/g, "")}`);
});

// ---------- Menú principal ----------
// 🎯 Reto del día: el mismo para todos hoy
function pintarRetoDia() {
  const r = retoDelDia(), listo = hecho(r.fecha);
  const a = $("#retoDia");
  // Los retos y el examen son para los que ya leen
  const p = perfilActivo(), chiquito = !!p && p.lee === "no";
  $("#examen").hidden = chiquito || (!!p && p.edad < 6);
  a.href = r.url; a.hidden = chiquito;
  a.classList.toggle("hecho", listo);
  a.innerHTML = `<span class="rd-emoji" aria-hidden="true">${r.emoji}</span>
    <span class="rd-texto"><small>🎯 Reto del día${listo ? " · ✅ ¡Resuelto!" : ""}</small><b>${r.titulo}</b></span>
    <span class="rd-ir" aria-hidden="true">${listo ? "🔁" : "▶️"}</span>`;
}

function pintarInicio() {
  pintarQuien();
  pintarSugeridos();
  pintarRetoDia();
  $("#tituloCategorias").textContent = perfilActivo() ? "Todos los juegos, por materia" : "¿Qué querés aprender hoy?";
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
