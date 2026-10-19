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

/** 👆 Señala una respuesta (brilla, brinca y aparece una manito) para ayudar sin decir «está mal». */
export function senalar(el) {
  if (!el) return;
  el.classList.remove("senal");
  void el.offsetWidth;
  el.classList.add("senal");
}

/**
 * 🤝 Ayuda sin pedirla, para el niño que se queda pegado y no sabe qué hacer:
 * si pasa un rato sin tocar nada (y sin que la voz esté hablando), se repite la instrucción;
 * si sigue sin tocar, se le señala la respuesta con `senalar()` (y `usada` queda en true, para la escalera).
 * Cualquier toque en la pantalla vuelve a empezar la cuenta.
 * @param {{senalar?: Function, repetir?: Function, espera?: number}} op
 */
export function ayudaSiSeQueda({ senalar: mostrar, repetir = () => repetirInstruccion(false), espera = 9000 } = {}) {
  let t = 0, etapa = 0, activa = false, usada = false;
  const hablando = () => { try { return speechSynthesis.speaking; } catch (_) { return false; } };
  const tick = () => {
    if (!activa) return;
    if (hablando()) { t = setTimeout(tick, 1500); return; }
    if (etapa === 0) { etapa = 1; repetir(); t = setTimeout(tick, espera); }
    else if (etapa === 1 && mostrar) { etapa = 2; usada = true; mostrar(); }
  };
  const armar = () => { clearTimeout(t); etapa = 0; if (activa) t = setTimeout(tick, espera); };
  document.addEventListener("pointerdown", armar, true);
  document.addEventListener("keydown", armar, true); // jugar con teclado también cuenta como tocar
  return {
    /** Al empezar cada ronda. */
    empezar() { activa = true; usada = false; armar(); },
    /** Cuando la ronda terminó (acertó). */
    parar() { activa = false; clearTimeout(t); },
    get usada() { return usada; },
  };
}

export const barajar = arr => arr.map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
export const azar = arr => arr[Math.floor(Math.random() * arr.length)];
