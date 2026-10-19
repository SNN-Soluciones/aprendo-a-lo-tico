// 🪜 La escalera: cada juego sube de nivel de a poquito, según cómo le va al niño.
//
// - Cada escalón es un nivel chiquito (por ejemplo: contar hasta 3, hasta 4, hasta 5…), no un salto grande.
// - Se sube al juntar las hojitas 🍃 (META): cada ronda bien al primer intento suma una.
//   Mientras nunca se haya equivocado en ese juego suma dos, para llegar rápido a su nivel.
// - Una ronda con un solo error no suma ni resta.
// - Si una ronda le costó mucho (2 errores o más, o hubo que señalarle la respuesta, o con 2 opciones
//   tocó la equivocada: así adivinar al azar no lo sube) pierde una hojita,
//   y con dos rondas así seguidas baja un escalón, sin regaños: así no se frustra y lo deja.
// - Se guarda por perfil (js/perfil.js) y por juego. El escalón inicial depende de la edad.
//
// El HTML del juego necesita un <div class="escalera" id="escalera"></div> (en la barra de arriba).
import { perfilActivo } from "./perfil.js";
import { hablar, sonido } from "./voz.js";

export const META = 4;

function clave() { return `alt-escalera-${perfilActivo()?.id || "sin-perfil"}`; }
function leer() { try { return JSON.parse(localStorage.getItem(clave()) || "{}"); } catch (_) { return {}; } }
function escribir(juego, estado) {
  const todo = leer();
  todo[juego] = estado;
  try { localStorage.setItem(clave(), JSON.stringify(todo)); } catch (_) {}
}

/**
 * @param {string} juego          id del juego (el mismo del catálogo)
 * @param {object} op
 * @param {number} op.escalones   cuántos niveles tiene
 * @param {number} [op.meta]      hojitas para subir (por defecto 4; en juegos de rondas largas, menos)
 * @param {(edad: number|null) => number} [op.inicio] escalón para empezar según la edad
 * @param {string} [op.el]        id del elemento donde se dibuja
 */
export function escalera(juego, { escalones, meta = META, inicio = () => 0, el = "escalera" }) {
  const edad = perfilActivo()?.edad ?? null;
  const guardado = leer()[juego];
  const tope = n => Math.max(0, Math.min(escalones - 1, n));
  let e = guardado
    ? { n: tope(guardado.n), hojas: guardado.hojas || 0, duros: guardado.duros || 0, nuevo: guardado.nuevo !== false }
    : { n: tope(inicio(edad)), hojas: 0, duros: 0, nuevo: true };
  let activa = true, antes = e.hojas; // antes: hojitas que ya estaban, para que solo brinque la nueva
  const caja = () => document.getElementById(el);

  // Si las ⭐ vienen justo después, se agrupan con la escalera para que no se separen en pantallas angostas
  const c0 = caja(), st = c0?.nextElementSibling;
  if (st?.classList.contains("stars")) {
    const g = document.createElement("div");
    g.className = "marcador";
    c0.before(g); g.append(c0, st);
  }

  function pintar() {
    const c = caja();
    if (!c) return;
    c.hidden = !activa;
    c.setAttribute("aria-label", `Escalón ${e.n + 1} de ${escalones}. Hojitas: ${e.hojas} de ${meta}.`);
    c.innerHTML = `<span class="esc-num" aria-hidden="true">🪜<b>${e.n + 1}</b></span><span class="hojas" aria-hidden="true">${
      Array.from({ length: meta }, (_, i) => `<i class="${i < e.hojas ? "llena" : ""}${i >= antes && i < e.hojas ? " nueva" : ""}"></i>`).join("")}</span>`;
    antes = e.hojas;
  }

  function celebrar() {
    sonido("sube");
    hablar("¡Subiste un escalón!", { cola: true });
    document.querySelector(".subio")?.remove();
    const d = document.createElement("div");
    d.className = "subio";
    d.setAttribute("aria-hidden", "true");
    d.innerHTML = `<span class="cartel">🪜 ¡Subiste!</span>${
      Array.from({ length: 14 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 5) * 0.12}s">${["⭐", "🎉", "🍃", "✨"][i % 4]}</i>`).join("")}`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 2600);
  }

  pintar();
  return {
    get nivel() { return e.n; },
    get escalones() { return escalones; },
    /** Primer escalón del juego (sin perfil o para un niño que recién empieza). */
    get esNuevo() { return e.nuevo; },
    /** false = el papá escogió un nivel a mano: no se cuenta nada. */
    get activa() { return activa; },
    set activa(v) { activa = !!v; pintar(); },
    pintar,
    /**
     * Anota cómo le fue en una ronda.
     * @param {{fallos?: number, ayuda?: boolean, opciones?: number}} r
     *   ayuda: hubo que señalarle la respuesta · opciones: entre cuántas escogía (si se sabe)
     * @returns {"sube"|"baja"|null}
     */
    resultado({ fallos = 0, ayuda = false, opciones = 0 } = {}) {
      if (!activa) return null;
      let paso = null;
      if (fallos === 0 && !ayuda) {
        e.duros = 0;
        e.hojas += e.nuevo ? 2 : 1;
        if (e.hojas >= meta) {
          e.hojas = 0;
          if (e.n < escalones - 1) { e.n++; paso = "sube"; }
          else e.hojas = meta - 1; // ya está arriba: la barra queda casi llena
        }
      } else if (fallos >= 2 || ayuda || (opciones > 1 && fallos >= opciones - 1)) {
        e.nuevo = false;
        e.hojas = Math.max(0, e.hojas - 1);
        e.duros++;
        if (e.duros >= 2) {
          e.duros = 0; e.hojas = 0;
          if (e.n > 0) { e.n--; paso = "baja"; }
        }
      } else {
        e.nuevo = false;
      }
      escribir(juego, e);
      pintar();
      if (paso === "sube") celebrar();
      return paso;
    },
  };
}
