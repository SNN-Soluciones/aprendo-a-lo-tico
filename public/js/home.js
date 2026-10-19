import { MATERIAS, GRADOS, JUEGOS } from "./catalog.js";
import { retoDelDia, hecho } from "./reto-dia.js";
import { AVATARES, EDADES, LECTURA, perfiles, perfilActivo, usarPerfil, guardarPerfil, borrarPerfil, gradosParaEdad, juegosPara, progresoDe, ponerEscalon, reiniciarJuego } from "./perfil.js";
import { hablar, sonido } from "./voz.js";
import { STICKERS, GRUPOS, TOTAL, albumDe, stickerDe, conArticulo, dibujo, cuantos } from "./album.js";

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
    ${activo ? `<p class="perfil-info">${activo.edad} años · ${lee.emoji} ${lee.nombre} <button class="mini" data-accion="editar">✏️ Cambiar</button></p>${botonAlbum(activo)}${pintarProgreso(activo)}` : ""}`;
}

// 📈 Para el papá o la maestra: en qué escalón va en cada juego que ya jugó.
// 👨‍👩‍👧 Con el modo papá (se entra contestando una multiplicación) se mueve el escalón a mano.
let progresoAbierto = false, otrosAbierto = false; // para que no se cierren al volver a dibujar
let papa = false, preguntaPapa = null;             // preguntaPapa: { a, b } mientras se pregunta
const conEscalera = JUEGOS.filter(j => j.escalera);

function pintarProgreso(p) {
  const prog = progresoDe(p.id);
  const filas = JUEGOS.filter(j => prog[j.id]).map(j => {
    const { n = 0, de } = prog[j.id], pct = de ? Math.round(((n + 1) / de) * 100) : 0;
    return `<li><a href="${j.url}"><span aria-hidden="true">${j.emoji}</span> ${j.titulo}</a>
      <span class="barra-prog" role="img" aria-label="Escalón ${n + 1}${de ? ` de ${de}` : ""}"><i style="width:${pct}%"></i></span>
      <small>🪜 ${n + 1}${de ? ` de ${de}` : ""}</small></li>`;
  });
  const cuerpo = papa ? pintarPapa(p, prog)
    : `${filas.length ? `<ul>${filas.join("")}</ul>` : `<p class="privado">Todavía no ha jugado ningún juego con 🪜.</p>`}
    <p class="privado">Cada juego sube de escalón cuando acierta seguido y baja si le cuesta. Si un escalón le queda difícil, tocá el nivel a mano en el juego, o movelo aquí con el modo papá.</p>
    ${preguntaPapa ? `<form class="papa-pregunta" data-form="papa" novalidate>
        <label>🔒 Solo para adultos: ¿cuánto es ${preguntaPapa.a} × ${preguntaPapa.b}?
          <input name="papa" inputmode="numeric" autocomplete="off" maxlength="4" class="nombre papa-resp"></label>
        <span class="papa-botones"><button class="mini" type="submit">Entrar</button><button class="mini" type="button" data-accion="papa-salir">Cancelar</button></span>
        <p class="editor-falta" id="papaFalta" hidden>Esa no es. Probá otra vez.</p>
      </form>`
      : `<p><button class="mini" data-accion="papa">👨‍👩‍👧 Modo papá: mover escalones</button></p>`}`;
  return `<details class="progreso"${progresoAbierto ? " open" : ""}><summary>📈 Cómo va ${p.nombre ? escapar(p.nombre) : "en cada juego"}</summary>${cuerpo}</details>`;
}

/** Cuántos escalones tiene un juego: lo que guardó el juego al jugarlo o, si el catálogo lo dice, `escalones`. */
const totalDe = (j, prog) => prog[j.id]?.de || j.escalones || null;

function filaPapa(j, prog) {
  const e = prog[j.id], total = totalDe(j, prog), t = escapar(j.titulo);
  const n = e ? Math.max(0, e.n || 0) : null;
  const menos = n !== null && n > 0, mas = !!total && (n === null || n < total - 1);
  return `<li><span class="pj"><span aria-hidden="true">${j.emoji}</span> ${t}</span>
    <span class="papa-ctrl">
      <button class="mini" data-esc="${j.id}" data-paso="-1" aria-label="Bajar un escalón en ${t}"${menos ? "" : " disabled"}>−</button>
      <span class="papa-n" data-valor="${j.id}" tabindex="-1">${n === null ? "Según su edad" : `🪜 ${n + 1}${total ? ` de ${total}` : ""}`}</span>
      <button class="mini" data-esc="${j.id}" data-paso="1" aria-label="${n === null ? `Escoger el escalón 1 en ${t}` : `Subir un escalón en ${t}`}"${mas ? "" : " disabled"}>+</button>
      <button class="mini" data-reiniciar="${j.id}" aria-label="Empezar de nuevo en ${t}" title="Empezar de nuevo"${e ? "" : " disabled"}>↺</button>
    </span>
    ${!e && !total ? `<small class="papa-nota">Cuando lo abra una vez, aquí lo podés mover.</small>` : ""}</li>`;
}

function pintarPapa(p, prog) {
  const jugados = conEscalera.filter(j => prog[j.id]), otros = conEscalera.filter(j => !prog[j.id]);
  return `<div class="papa">
    <p class="papa-cab"><b>👨‍👩‍👧 Modo papá</b> <button class="mini" data-accion="papa-salir">Salir</button></p>
    <p class="privado">Con − y + movés el escalón; empieza ese escalón sin hojitas. ↺ borra lo que lleva en ese juego: vuelve a empezar según su edad.</p>
    ${jugados.length ? `<ul class="papa-lista">${jugados.map(j => filaPapa(j, prog)).join("")}</ul>` : `<p class="privado">Todavía no ha jugado ningún juego con 🪜.</p>`}
    ${otros.length ? `<details class="papa-otros"${otrosAbierto ? " open" : ""}><summary>Juegos que todavía no ha jugado (${otros.length})</summary>
      <ul class="papa-lista">${otros.map(j => filaPapa(j, prog)).join("")}</ul></details>` : ""}
  </div>`;
}

// 🏆 Su álbum de stickers: gana uno cada vez que sube un escalón en un juego (js/album.js)
function botonAlbum(p) {
  const tengo = albumDe(p.id);
  const ultimos = tengo.slice(-3).reverse().map(stickerDe);
  return `<button class="album-btn" data-accion="album" aria-label="Mi álbum: ${tengo.length} de ${TOTAL} stickers">
    <span class="album-trofeo" aria-hidden="true">🏆</span>
    <span class="album-txt" aria-hidden="true"><b>Mi álbum</b><small>${tengo.length} de ${TOTAL} stickers</small></span>
    <span class="album-ultimos" aria-hidden="true">${ultimos.map(dibujo).join("")}</span>
  </button>`;
}

const mayuscula = t => t.charAt(0).toUpperCase() + t.slice(1);
function abrirAlbum() {
  const p = perfilActivo();
  if (!p) return;
  const tengo = albumDe(p.id), ya = new Set(tengo), nuevo = tengo[tengo.length - 1];
  const dlg = $("#album");
  dlg.innerHTML = `<div class="album-dentro">
    <div class="album-cab"><h2 id="albumTitulo"></h2><button class="cerrar" data-cerrar aria-label="Cerrar el álbum">✕</button></div>
    <p class="album-cuenta">${tengo.length} de ${TOTAL} stickers</p>
    <div class="album-ficha" id="albumFicha" aria-live="polite"></div>
    ${GRUPOS.map(g => `<h3><span aria-hidden="true">${g.emoji}</span> ${g.nombre}</h3><div class="album-grid">${STICKERS.filter(s => s.g === g.id).map(s => ya.has(s.id)
      ? `<button class="stk tiene${s.id === nuevo ? " nuevo" : ""}" data-stk="${s.id}" aria-label="${mayuscula(conArticulo(s))}">${dibujo(s)}<span class="stk-nombre" aria-hidden="true">${s.nombre}</span></button>`
      : `<button class="stk falta" data-stk="${s.id}" aria-label="Sticker que falta">${dibujo(s)}<span class="stk-q" aria-hidden="true">?</span></button>`).join("")}</div>`).join("")}
  </div>`;
  $("#albumTitulo").textContent = p.nombre ? `🏆 El álbum de ${p.nombre}` : "🏆 Tu álbum";
  const voz = !tengo.length ? "Todavía no tenés stickers. Subí un escalón en cualquier juego y ganás uno."
    : tengo.length === TOTAL ? "¡Completaste todo el álbum!"
    : `Tu álbum: tenés ${cuantos(tengo.length)} de ${TOTAL}. Tocá uno para oír qué es.`;
  $("#albumFicha").textContent = voz;
  if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  sonido("tap");
  hablar(voz);
}
function cerrarAlbum() {
  const dlg = $("#album");
  if (typeof dlg.close === "function" && dlg.open) dlg.close(); else dlg.removeAttribute("open");
}
$("#album").addEventListener("click", e => {
  const dlg = $("#album");
  if (e.target === dlg || e.target.closest("[data-cerrar]")) return cerrarAlbum(); // tocar afuera también cierra
  const b = e.target.closest("[data-stk]");
  if (!b) return;
  const s = stickerDe(b.dataset.stk), ficha = $("#albumFicha");
  sonido("tap");
  if (b.classList.contains("falta")) {
    ficha.textContent = "Todavía no lo tenés. ¡Subí un escalón en un juego para ganar otro sticker!";
    return hablar("Todavía no lo tenés. Subí un escalón en un juego para ganar otro sticker.");
  }
  ficha.innerHTML = `${dibujo(s)}<span><b></b><br><span></span></span>`;
  ficha.querySelector("b").textContent = mayuscula(conArticulo(s));
  ficha.querySelector("b + br + span").textContent = s.dato;
  hablar(`${mayuscula(conArticulo(s))}. ${s.dato}`);
});
$("#album").addEventListener("close", () => $(".album-btn")?.focus());

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
    papa = false; preguntaPapa = null;
    usarPerfil(b.dataset.p);
    const p = perfilActivo();
    filtro.grado = String(gradosParaEdad(p.edad)[0]); guardar();
    sonido("tap");
    hablar(`¡Hola${p.nombre ? `, ${p.nombre}` : ""}! ¿A qué querés jugar?`);
    return render();
  }
  if (b.dataset.esc) return moverEscalon(b.dataset.esc, Number(b.dataset.paso));
  if (b.dataset.reiniciar) {
    const j = JUEGOS.find(x => x.id === b.dataset.reiniciar);
    if (!confirm(`¿Borrar lo que lleva en «${j.titulo}»? Vuelve a empezar según su edad.`)) return;
    reiniciarJuego(perfilActivo().id, j.id);
    render();
    return $(`[data-esc="${j.id}"][data-paso="1"]`)?.focus();
  }
  const accion = b.dataset.accion;
  if (accion === "album") return abrirAlbum();
  if (accion === "papa") {
    preguntaPapa = { a: 12 + Math.floor(Math.random() * 8), b: 3 + Math.floor(Math.random() * 7) };
    progresoAbierto = true; render();
    return $(".papa-resp")?.focus();
  }
  if (accion === "papa-salir") { papa = false; preguntaPapa = null; render(); return $('[data-accion="papa"]')?.focus(); }
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
// Los <details> no avisan al padre cuando se abren: se escucha en la fase de captura
$("#quien").addEventListener("toggle", e => {
  if (e.target.classList?.contains("progreso")) progresoAbierto = e.target.open;
  if (e.target.classList?.contains("papa-otros")) otrosAbierto = e.target.open;
}, true);

function moverEscalon(id, paso) {
  const p = perfilActivo(), prog = progresoDe(p.id), j = JUEGOS.find(x => x.id === id);
  const e = prog[id], total = totalDe(j, prog);
  if (!total && paso > 0) return;
  ponerEscalon(p.id, id, e ? (e.n || 0) + paso : 0, total || undefined);
  sonido("tap");
  render();
  // El foco se queda en el mismo botón o, si ya llegó al tope, en el escalón (así otro Enter no lo devuelve)
  const mismo = $(`[data-esc="${id}"][data-paso="${paso}"]`);
  (mismo && !mismo.disabled ? mismo : $(`[data-valor="${id}"]`))?.focus();
}

$("#quien").addEventListener("submit", e => {
  e.preventDefault();
  if (e.target.dataset.form === "papa") {
    const r = e.target.elements.papa;
    if (preguntaPapa && Number(r.value.trim()) === preguntaPapa.a * preguntaPapa.b) {
      papa = true; preguntaPapa = null; render();
      return ($(".papa [data-esc]:not([disabled])") || $('[data-accion="papa-salir"]'))?.focus();
    }
    $("#papaFalta").hidden = false; r.value = ""; r.focus();
    return;
  }
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
