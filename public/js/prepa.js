// 🧒 Piezas comunes de los juegos de Prepa: inicio, instrucción hablada, retroalimentación y estrellas.
// El HTML de cada juego debe tener: #start/#startBtn, #oir, #lento, #instr, #feedback, #stars y .levels [data-nivel].
import { hablar, sonido, LENTO } from "./voz.js";

const $ = id => document.getElementById(id);

/** Dice un texto y hace latir el botón 🔊 mientras habla. */
export async function decir(texto, op) {
  const btn = op?.rate === LENTO ? $("lento") : $("oir");
  if (btn) btn.classList.add("hablando");
  await hablar(texto, op);
  if (btn) btn.classList.remove("hablando");
}

/**
 * Muestra la instrucción (emoji/dibujo + texto corto para el adulto) y la dice.
 * @param {string} html   lo que se ve
 * @param {string} voz    lo que se dice (y se repite con 🔊)
 */
let ultimaInstr = "";
export function instruccion(html, voz, lento = false) {
  $("instr").innerHTML = html;
  ultimaInstr = voz;
  return decir(voz, lento ? { rate: LENTO } : undefined);
}
/** Repite la instrucción; con lento = true la dice a velocidad 🐢. */
export const repetirInstruccion = (lento = false) => decir(ultimaInstr, lento ? { rate: LENTO } : undefined);

/** kind: "ok" | "almost" | "bad" | "" */
export function feedback(kind, emo = "", texto = "") {
  const fb = $("feedback");
  fb.className = "wrap feedback " + (kind || "");
  fb.innerHTML = emo || texto ? `<span class="emo" aria-hidden="true">${emo}</span><span>${texto}</span>` : "";
  if (kind) { void fb.offsetWidth; fb.classList.add("pop"); }
  if (kind === "ok") sonido("ok");
  else if (kind === "almost") sonido("casi");
  else if (kind === "bad") sonido("mal");
}

/** Contador de estrellas guardado en el dispositivo. */
export function estrellas(clave) {
  let n = 0;
  try { n = Number(localStorage.getItem(clave)) || 0; } catch (_) {}
  const pintar = () => { $("stars").textContent = "⭐ " + n; };
  pintar();
  return {
    sumar() {
      n++;
      try { localStorage.setItem(clave, n); } catch (_) {}
      pintar();
    },
  };
}

/** Botones de nivel: llama a onCambio(valor) al tocar uno. */
export function niveles(onCambio) {
  const btns = document.querySelectorAll(".levels [data-nivel]");
  btns.forEach(b => b.addEventListener("click", () => {
    btns.forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
    onCambio(b.dataset.nivel);
  }));
}

/**
 * Pantalla de inicio: el audio en celulares necesita un toque antes de sonar.
 * @param {Function} fn        qué hacer al tocar ▶️
 * @param {Function} [repetir] qué hacen 🔊 y 🐢 (por defecto, repetir la instrucción).
 *                             Recibe `lento`: true cuando se tocó la tortuga.
 */
export function alEmpezar(fn, repetir = repetirInstruccion) {
  $("startBtn").addEventListener("click", () => {
    sonido("tap");
    $("start").hidden = true;
    fn();
  });
  const oir = $("oir");
  if (oir) oir.addEventListener("click", () => repetir(false));
  const lento = $("lento");
  if (lento) lento.addEventListener("click", () => repetir(true));
}

export const barajar = arr => arr.map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
export const azar = arr => arr[Math.floor(Math.random() * arr.length)];
