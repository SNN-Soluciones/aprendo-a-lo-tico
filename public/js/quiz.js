// ❓ Motor compartido para los juegos de preguntas con opciones.
// Cada juego solo da su contenido: modos, y para cada modo una función que arma las preguntas.
// Se encarga de pintar, revisar, explicar (con voz), llevar las estrellas y el resumen.
//
// La página necesita (además de lo de prepa.js): #modos, #avance, #tarjeta, #opciones, #explica, #sigBtn, #resumen, #juego
//
// Una pregunta es:
//   { html, voz, opciones: [{ id, html, voz? }], correcta: id, explica, cols? }
//   html: lo que se ve en la tarjeta · voz: lo que se lee (🔊 lo repite) · explica: se muestra y se lee al contestar
import { elogio, sonido, LENTO } from "./voz.js";
import { decir, instruccion, feedback, alEmpezar } from "./prepa.js";

const $ = id => document.getElementById(id);

export function barajar(arr, rnd = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export const estrellasDe = (bien, total) => { const p = bien / total; return p >= 0.9 ? 3 : p >= 0.7 ? 2 : p >= 0.5 ? 1 : 0; };

/**
 * @param {object} op
 * @param {string} op.clave            dónde se guardan las estrellas
 * @param {Array}  op.modos            [{ id, nombre, instr, preguntas: () => [pregunta] }]
 * @param {object} [op.textos]         { fin3, fin2, fin1, fin0 } mensajes del resumen
 * @param {Function} [op.leerOpcion]   cómo se lee una opción al elegirla (por ejemplo, en inglés)
 */
export function montarQuiz({ clave, modos, textos = {}, leerOpcion }) {
  let mejores = {};
  try { mejores = JSON.parse(localStorage.getItem(clave)) || {}; } catch (_) {}
  const guardar = () => { try { localStorage.setItem(clave, JSON.stringify(mejores)); } catch (_) {} };

  let modo = modos[0], preguntas = [], k = 0, bien = 0, resultados = [], listo = false;
  const q = () => preguntas[k];

  function pintarModos() {
    $("modos").innerHTML = modos.map(m => {
      const n = mejores[m.id] || 0;
      return `<button data-modo="${m.id}" aria-pressed="${m === modo}">${m.nombre}${n ? ` <span class="est">${"⭐".repeat(n)}</span>` : ""}</button>`;
    }).join("");
    $("stars").textContent = "⭐ " + Object.values(mejores).reduce((a, b) => a + b, 0);
  }
  function pintarAvance() {
    $("avance").innerHTML = preguntas.map((_, i) =>
      `<span class="${i < resultados.length ? (resultados[i] ? "ya-bien" : "ya-mal") : ""} ${i === k && $("resumen").hidden ? "ahora" : ""}"></span>`).join("");
  }

  function mostrar() {
    listo = false;
    const p = q();
    $("juego").hidden = false; $("resumen").hidden = true;
    $("explica").hidden = true; $("sigBtn").hidden = true; feedback("");
    $("tarjeta").innerHTML = p.html;
    $("opciones").style.gridTemplateColumns = `repeat(${p.cols || Math.min(p.opciones.length, 3)}, 1fr)`;
    $("opciones").innerHTML = p.opciones.map(o => `<button data-id="${o.id}">${o.html}</button>`).join("");
    pintarAvance();
    instruccion(modo.instr, p.voz);
  }

  $("opciones").addEventListener("click", e => {
    const b = e.target.closest("[data-id]");
    if (!b || listo) return;
    listo = true;
    const p = q(), ok = b.dataset.id === String(p.correcta);
    $("opciones").querySelectorAll("button").forEach(x => { x.disabled = true; if (x.dataset.id === String(p.correcta)) x.classList.add("right"); });
    if (!ok) b.classList.add("wrong");
    bien += ok ? 1 : 0; resultados.push(ok);
    pintarAvance();
    feedback(ok ? "ok" : "bad", ok ? "🎉" : "🤔", ok ? elogio() : "¡Casi!");
    $("explica").hidden = false; $("explica").innerHTML = p.explica;
    const texto = p.explica.replace(/<[^>]+>/g, "");
    const opcion = p.opciones.find(o => o.id === b.dataset.id);
    if (leerOpcion && ok) leerOpcion(opcion).then(() => decir(texto, { cola: true }));
    else decir(`${ok ? elogio() : ""} ${texto}`);
    $("sigBtn").hidden = false;
    $("sigBtn").textContent = k + 1 < preguntas.length ? "Siguiente ➡️" : "Ver resultado 🏁";
  });

  $("sigBtn").addEventListener("click", () => {
    sonido("tap"); k++;
    if (k < preguntas.length) mostrar(); else terminar();
  });

  function empezar(m = modo) {
    modo = m; preguntas = m.preguntas(); k = 0; bien = 0; resultados = [];
    pintarModos(); mostrar();
  }

  function terminar() {
    const n = estrellasDe(bien, preguntas.length);
    if (n > (mejores[modo.id] || 0)) { mejores[modo.id] = n; guardar(); }
    const sig = modos[modos.indexOf(modo) + 1];
    $("juego").hidden = true; $("explica").hidden = true; $("sigBtn").hidden = true; feedback("");
    const msg = [textos.fin0 || "¡Seguí practicando! Cada ronda se aprende algo.", textos.fin1 || "¡Bien! Con práctica te va a salir mejor.",
      textos.fin2 || "¡Muy bien! Ya casi.", textos.fin3 || "¡Excelente! Te lo sabés todo."][n];
    $("resumen").hidden = false;
    $("resumen").innerHTML = `<div class="grande" aria-label="${n} estrellas">${"⭐".repeat(n) + "☆".repeat(3 - n)}</div>
      <p>${bien} de ${preguntas.length} bien</p><p>${msg}</p>
      <div class="botones"><button id="otraBtn">🔄 Otra ronda</button>${sig && n >= 2 ? `<button class="sig" id="sigModoBtn">${sig.nombre} ➡️</button>` : ""}</div>`;
    pintarModos(); pintarAvance();
    instruccion("<b>¡Terminaste!</b>", msg);
    if (n) sonido("ok");
    $("otraBtn").addEventListener("click", () => { sonido("tap"); empezar(); });
    $("sigModoBtn")?.addEventListener("click", () => { sonido("tap"); empezar(sig); });
  }

  $("modos").addEventListener("click", e => {
    const b = e.target.closest("[data-modo]");
    if (!b) return;
    sonido("tap"); empezar(modos.find(m => m.id === b.dataset.modo));
  });

  const repetir = lento => decir($("resumen").hidden ? q().voz : "Tocá otra ronda o elegí otro modo arriba.", lento ? { rate: LENTO } : undefined);
  alEmpezar(() => empezar(), repetir);
  pintarModos();

  if (new URLSearchParams(location.search).has("prueba")) window.__quiz = { get q() { return q(); }, get modo() { return modo.id; } };
}
