// ❌⭕ Lógica del gato (tres en línea) contra el jaguar, sin pantalla para poder probarla sola.
// El tablero es un arreglo de 9 casillas: "X", "O" o null. Casillas:  0 1 2 / 3 4 5 / 6 7 8

export const LINEAS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
export const otro = s => (s === "X" ? "O" : "X");
export const libres = t => t.map((v, i) => (v ? -1 : i)).filter(i => i >= 0);

/** { quien: "X" | "O", linea } si alguien ganó; { quien: "empate" } si se llenó; null si sigue. */
export function resultado(t) {
  for (const l of LINEAS) if (t[l[0]] && t[l[0]] === t[l[1]] && t[l[0]] === t[l[2]]) return { quien: t[l[0]], linea: l };
  return libres(t).length ? null : { quien: "empate" };
}

/** Casilla donde `s` gana ya (o -1). */
export function paraGanar(t, s) {
  for (const l of LINEAS) {
    const vals = l.map(i => t[i]);
    if (vals.filter(v => v === s).length === 2 && vals.includes(null)) return l[vals.indexOf(null)];
  }
  return -1;
}

// Minimax: +10 si gana `yo`, −10 si pierde; se prefieren las victorias rápidas y las derrotas lentas.
// Se guardan las posiciones ya calculadas para que sea rápido también en celulares viejos.
const memo = new Map();
function valor(t, turno, yo, prof = 0) {
  const clave = t.map(v => v || "-").join("") + turno + yo + prof;
  if (memo.has(clave)) return memo.get(clave);
  const r = resultado(t);
  let v;
  if (r) v = r.quien === "empate" ? 0 : r.quien === yo ? 10 - prof : prof - 10;
  else {
    const vals = libres(t).map(i => { t[i] = turno; const x = valor(t, otro(turno), yo, prof + 1); t[i] = null; return x; });
    v = turno === yo ? Math.max(...vals) : Math.min(...vals);
  }
  memo.set(clave, v);
  return v;
}
/** Las mejores casillas para `s` (puede haber varias igual de buenas). */
export function mejores(t, s) {
  const g = [...t];
  const vals = libres(g).map(i => { g[i] = s; const v = valor(g, otro(s), s, 1); g[i] = null; return [i, v]; });
  const max = Math.max(...vals.map(v => v[1]));
  return vals.filter(v => v[1] === max).map(v => v[0]);
}

const elegir = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

/**
 * Jugada del jaguar.
 *   muyfacil: juega al azar y casi nunca aprovecha para ganar (para los chiquitos)
 *   facil:    a veces aprovecha para ganar, pero casi siempre juega al azar
 *   regular:  casi siempre gana si puede y muchas veces bloquea; si no, juega al azar
 *   medio:    gana si puede, bloquea si tiene que hacerlo, si no prefiere el centro y las esquinas
 *   astuto:   más o menos la mitad de las veces juega perfecto; las otras, como el medio
 *   dificil:  juega perfecto (nunca pierde)
 */
export const NIVELES_JAGUAR = ["muyfacil", "facil", "regular", "medio", "astuto", "dificil"];
export function jugadaJaguar(t, s, nivel, rnd = Math.random) {
  const lib = libres(t);
  if (nivel === "dificil" || (nivel === "astuto" && rnd() < 0.55)) return elegir(mejores(t, s), rnd);
  const gana = paraGanar(t, s), bloquea = paraGanar(t, otro(s));
  if (nivel === "muyfacil") {
    // Evita ganar: si todas las casillas le dan la victoria, no le queda otra
    const sinGanar = lib.filter(i => { const g = [...t]; g[i] = s; return !resultado(g)?.linea; });
    return elegir(sinGanar.length && rnd() < 0.9 ? sinGanar : lib, rnd);
  }
  if (nivel === "regular") {
    if (gana >= 0 && rnd() < 0.8) return gana;
    if (bloquea >= 0 && rnd() < 0.6) return bloquea;
    return elegir(lib, rnd);
  }
  if (nivel === "medio" || nivel === "astuto") {
    if (gana >= 0) return gana;
    if (bloquea >= 0) return bloquea;
    if (t[4] === null) return 4;
    const esquinas = [0, 2, 6, 8].filter(i => t[i] === null);
    return elegir(esquinas.length && rnd() < 0.7 ? esquinas : lib, rnd);
  }
  if (gana >= 0 && rnd() < 0.35) return gana;
  if (bloquea >= 0 && rnd() < 0.15) return bloquea;
  return elegir(lib, rnd);
}

/**
 * Consejo para el niño que juega con `s`, con la razón (para aprender a pensar):
 *   ganar · bloquear · doble (arma dos amenazas a la vez) · centro · esquina · mejor
 */
export function consejo(t, s) {
  const gana = paraGanar(t, s);
  if (gana >= 0) return { casilla: gana, tipo: "ganar" };
  const bloquea = paraGanar(t, otro(s));
  if (bloquea >= 0) return { casilla: bloquea, tipo: "bloquear" };
  const buenas = mejores(t, s);
  // ¿Alguna buena jugada deja dos formas de ganar a la vez? (el rival no puede tapar las dos)
  const doble = buenas.find(i => { const g = [...t]; g[i] = s; return LINEAS.filter(l => { const v = l.map(k => g[k]); return v.filter(x => x === s).length === 2 && v.includes(null); }).length >= 2; });
  if (doble !== undefined) return { casilla: doble, tipo: "doble" };
  if (buenas.includes(4)) return { casilla: 4, tipo: "centro" };
  const esquina = buenas.find(i => [0, 2, 6, 8].includes(i));
  if (esquina !== undefined) return { casilla: esquina, tipo: "esquina" };
  return { casilla: buenas[0], tipo: "mejor" };
}
