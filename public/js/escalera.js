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
// - 🏆 Cada vez que sube a un escalón más alto que nunca, el niño (si hay perfil) gana un sticker para su álbum (js/album.js).
//
// El HTML del juego necesita un <div class="escalera" id="escalera"></div> (en la barra de arriba).
import { perfilActivo } from "./perfil.js";
import { hablar, sonido } from "./voz.js";
import { ganarSticker, conArticulo, dibujo, albumDe, TOTAL } from "./album.js";

export const META = 4;

// Estilos del sticker nuevo (van aquí para que sirvan en todos los juegos sin tocar su CSS)
const CSS_STICKER = `
.subio .sticker-nuevo {
  position: absolute; left: 50%; top: calc(22% + clamp(5rem, 22vw, 6rem)); transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 18px 6px;
  background: #FFFFFF; border: 4px solid #1F3A5F; border-radius: 24px; box-shadow: 0 5px 0 #1F3A5F;
  animation: sticker-nuevo 2.6s ease-in-out forwards;
}
.subio .sticker-nuevo .stk-emoji { font-size: 4.4rem; line-height: 1.05; }
.subio .sticker-nuevo .stk-svg svg { width: 5.2rem; height: 5.2rem; display: block; }
.subio .sticker-nuevo b { font-size: 1.15rem; color: #1F3A5F; white-space: nowrap; }
/* Aparece en el centro y después vuela chiquitito hacia arriba (a su álbum), para no tapar la ronda siguiente */
@keyframes sticker-nuevo {
  0%, 10% { transform: translateX(-50%) scale(.2) rotate(-20deg); opacity: 0; }
  22% { transform: translateX(-50%) scale(1.15) rotate(6deg); opacity: 1; }
  30%, 62% { transform: translateX(-50%) scale(1) rotate(0); opacity: 1; }
  100% { transform: translateX(-50%) translate(36vw, -34vh) scale(.25); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .subio .cartel, .subio .sticker-nuevo { animation: none !important; }
  .subio i { display: none; }
}`;
function estilos() {
  if (document.getElementById("estilo-sticker")) return;
  const st = document.createElement("style");
  st.id = "estilo-sticker";
  st.textContent = CSS_STICKER;
  document.head.appendChild(st);
}

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
  // max: el escalón más alto al que ha llegado; el sticker solo se gana al pasarlo (bajar y volver a subir no da otro)
  e.max = Math.max(e.n, Number(guardado?.max) || 0);
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

  function celebrar(premio) {
    sonido("sube");
    hablar("¡Subiste un escalón!", { cola: true });
    // 🏆 Un sticker nuevo para su álbum si llegó más alto que nunca (sin perfil, o con el álbum lleno, no hay)
    const id = perfilActivo()?.id, s = premio ? ganarSticker(id) : null;
    if (s) {
      hablar(`¡Ganaste un sticker: ${conArticulo(s)}!`, { cola: true });
      if (albumDe(id).length === TOTAL) hablar("¡Completaste todo el álbum!", { cola: true });
    }
    estilos();
    document.querySelector(".subio")?.remove();
    const d = document.createElement("div");
    d.className = "subio";
    d.setAttribute("aria-hidden", "true");
    d.innerHTML = `<span class="cartel">🪜 ¡Subiste!</span>${s ? `<span class="sticker-nuevo">${dibujo(s)}<b>¡Sticker nuevo!</b></span>` : ""}${
      Array.from({ length: 14 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 5) * 0.12}s">${["⭐", "🎉", "🍃", "✨"][i % 4]}</i>`).join("")}`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), s ? 2800 : 2600);
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
      let paso = null, premio = false;
      if (fallos === 0 && !ayuda) {
        e.duros = 0;
        e.hojas += e.nuevo ? 2 : 1;
        if (e.hojas >= meta) {
          e.hojas = 0;
          if (e.n < escalones - 1) { e.n++; paso = "sube"; premio = e.n > e.max; e.max = Math.max(e.max, e.n); }
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
      escribir(juego, { ...e, de: escalones }); // «de»: cuántos escalones tiene, para el progreso en el inicio
      pintar();
      if (paso === "sube") celebrar(premio);
      return paso;
    },
  };
}
