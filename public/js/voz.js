// 🔊 Voz y sonidos compartidos para los juegos (sobre todo los de Prepa, que no leen).
// Usa la Web Speech API del dispositivo: no descarga nada y funciona sin internet
// si el teléfono tiene voces instaladas.

// Velocidad de la voz: normal y 🐢 despacio (el botón de la tortuga repite a esta velocidad).
// En iPhone, iPad y Safari (WebKit) las voces de Apple traducen la velocidad distinto:
// ahí 0.5 suena apenas 1.3 veces más lento, así que hace falta un número más bajo.
// Se puede medir en cada equipo con prueba-voz.html.
export const ES_APPLE = typeof navigator !== "undefined" && /Apple/.test(navigator.vendor || "");
export const VELOCIDAD = 1;
export const LENTO = ES_APPLE ? 0.25 : 0.5;

export const puedeHablar = typeof window !== "undefined" && "speechSynthesis" in window;

function buscarVoz(lang) {
  if (!puedeHablar) return null;
  const voces = speechSynthesis.getVoices();
  if (lang === "en") return voces.find(v => /^en[-_]US/i.test(v.lang)) || voces.find(v => /^en/i.test(v.lang)) || null;
  return voces.find(v => /^es[-_](CR|MX|US|419)/i.test(v.lang)) || voces.find(v => /^es/i.test(v.lang)) || null;
}

/**
 * Lee un texto en voz alta. Devuelve una promesa que se cumple cuando termina
 * (o enseguida si el dispositivo no puede hablar).
 * @param {string} texto
 * @param {{lang?: "es"|"en", rate?: number, cola?: boolean}} [op] cola: no cortar lo que se está diciendo
 */
export function hablar(texto, { lang = "es", rate = VELOCIDAD, cola = false } = {}) {
  if (!puedeHablar || !texto) return Promise.resolve();
  return new Promise(resolve => {
    try {
      if (!cola) speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texto);
      const voz = buscarVoz(lang);
      if (voz) u.voice = voz;
      u.lang = voz ? voz.lang : lang === "en" ? "en-US" : "es-MX";
      u.rate = rate;
      // Algunos navegadores no disparan onend: plan B por tiempo.
      const plazo = setTimeout(resolve, 1000 + texto.length * 80 / rate);
      u.onend = u.onerror = () => { clearTimeout(plazo); resolve(); };
      speechSynthesis.speak(u);
    } catch (_) { resolve(); }
  });
}

export function callar() {
  if (puedeHablar) try { speechSynthesis.cancel(); } catch (_) {}
}

// Algunas voces cargan tarde: pedirlas temprano ayuda a que la primera frase ya use la voz en español.
if (puedeHablar) try { speechSynthesis.getVoices(); } catch (_) {}

const ELOGIOS = ["¡Muy bien!", "¡Pura vida!", "¡Excelente!", "¡Qué tuanis!", "¡Lo lograste!", "¡Buenísimo!"];
export const elogio = () => ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)];

// 🎵 Sonidos cortos (sin archivos de audio): "ok" sube, "casi" queda igual, "mal" baja, "tap" es un clic suave.
let ctx = null;
export function sonido(tipo = "tap") {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    const notas = { ok: [523, 659, 784], casi: [523, 523], mal: [392, 262], tap: [880] }[tipo] || [880];
    const t0 = ctx.currentTime;
    notas.forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "triangle"; o.frequency.value = f;
      const t = t0 + i * 0.12, dur = tipo === "tap" ? 0.06 : 0.16;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.02);
    });
  } catch (_) {}
}

// Números en palabras (hasta 20), para contar en voz alta.
const NUM = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
  "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte"];
export const numeroEnPalabras = n => NUM[n] ?? String(n);
