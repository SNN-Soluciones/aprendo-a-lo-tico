// 🎯 Reto del día: el mismo reto para todos los niños ese día (se arma con la fecha como semilla).
// El inicio muestra cuál toca hoy; el juego lo abre con ?dia=AAAA-MM-DD.

/** Fecha de hoy en la hora del dispositivo, como "2026-09-25". */
export function hoy(d = new Date()) {
  const dos = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

/** Número al azar repetible a partir de un texto (la fecha): siempre da la misma secuencia. */
export function azarCon(texto) {
  let h = 2166136261;
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  let s = h >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32; };
}

// Retos posibles: se va rotando día a día
export const RETOS_DIA = [
  { juego: "juegos/jaguar.html", param: "dificil", emoji: "🐆", titulo: "Caso difícil del jaguar detective" },
  { juego: "juegos/perezoso.html", param: "azar", emoji: "🦥", titulo: "Camino nuevo del perezoso" },
  { juego: "juegos/repeti-decidi.html", param: "azar", emoji: "🔁", titulo: "Nivel sorpresa de Repetí y decidí" },
  { juego: "juegos/lapa.html", param: "azar", emoji: "🦜", titulo: "Dibujo sorpresa de la lapa" },
  { juego: "juegos/jaguar.html", param: "libreta", emoji: "📋", titulo: "Libreta del jaguar detective" },
];

/** El reto que toca un día. */
export function retoDelDia(fecha = hoy()) {
  const [a, m, d] = fecha.split("-").map(Number);
  const n = Math.floor(Date.UTC(a, m - 1, d) / 86400000);
  const r = RETOS_DIA[n % RETOS_DIA.length];
  return { ...r, fecha, url: `${r.juego}?dia=${fecha}&reto=${r.param}` };
}

/** En un juego: si se abrió como reto del día, devuelve { fecha, reto, rnd }; si no, null. */
export function desdeUrl() {
  const q = new URLSearchParams(location.search), fecha = q.get("dia");
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return null;
  return { fecha, reto: q.get("reto"), rnd: azarCon(`aprendo-a-lo-tico ${fecha} ${q.get("reto")}`) };
}

// Se guarda qué día se resolvió el reto, para mostrar ✅ en el inicio
export function marcarHecho(fecha) { try { localStorage.setItem("reto-dia-hecho", fecha); } catch (_) {} }
export function hecho(fecha = hoy()) { try { return localStorage.getItem("reto-dia-hecho") === fecha; } catch (_) { return false; } }
