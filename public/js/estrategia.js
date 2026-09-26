// ♟️ Lógica de «Estrategia contra el jaguar» (sin pantalla, para poder probarla sola).
//   🥭 Los mangos: una fila, se quitan de 1 a 3; gana el que se lleva el último.
//   🧺 Canastas (Nim): varias canastas; se quita cualquier cantidad de UNA canasta; gana el que se lleva el último.
//   🔴 Cuatro en línea: tablero de 6 filas × 7 columnas; las fichas caen hasta abajo.

const elegir = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

// ================= 🥭 Los mangos =================
export const MAX_QUITAR = 3;

/** Jugadas posibles: cuántos mangos se pueden quitar. */
export const quitables = n => [1, 2, 3].filter(k => k <= n);

/**
 * Jugada del jaguar en los mangos.
 * El truco: dejarle al otro un múltiplo de 4 (4, 8, 12…). Así, quite lo que quite, el jaguar vuelve a completar 4.
 */
export function jaguarMangos(n, nivel, rnd = Math.random) {
  const ganadora = n % 4;
  if (nivel === "dificil" && ganadora) return ganadora;
  if (nivel === "medio" && ganadora && (n <= 8 || rnd() < 0.5)) return ganadora; // juega bien al final
  if (n <= 3) return n;                                                        // si puede llevarse el último, se lo lleva
  return elegir(quitables(n), rnd);
}
/** Consejo para el niño: { quitar, gana } — gana: false si ya no hay jugada ganadora (el jaguar tiene la ventaja). */
export function consejoMangos(n) {
  const k = n % 4;
  return k ? { quitar: k, gana: true } : { quitar: 1, gana: false };
}

// ================= 🧺 Canastas (Nim) =================
export const xor = pilas => pilas.reduce((a, b) => a ^ b, 0);
/** Jugadas: [canasta, cuántos quitar]. */
export const jugadasNim = pilas => pilas.flatMap((p, i) => Array.from({ length: p }, (_, k) => [i, k + 1]));
/** Una jugada que deja el «xor» en 0 (la posición perdedora para el otro), o null si no hay. */
export function ganadoraNim(pilas) {
  const x = xor(pilas);
  if (!x) return null;
  for (let i = 0; i < pilas.length; i++) {
    const objetivo = pilas[i] ^ x;
    if (objetivo < pilas[i]) return [i, pilas[i] - objetivo];
  }
  return null;
}
export function jaguarNim(pilas, nivel, rnd = Math.random) {
  const buena = ganadoraNim(pilas);
  const quedan = pilas.reduce((a, b) => a + b, 0);
  if (buena && (nivel === "dificil" || (nivel === "medio" && (quedan <= 6 || rnd() < 0.5)))) return buena;
  // Si queda una sola canasta, se la lleva toda
  const conMangos = pilas.map((p, i) => [p, i]).filter(([p]) => p > 0);
  if (conMangos.length === 1) return [conMangos[0][1], conMangos[0][0]];
  return elegir(jugadasNim(pilas), rnd);
}
/** Canastas para empezar: con 2 canastas, distintas (así el que empieza puede ganar); con 3, al azar. */
export function canastasIniciales(cuantas, rnd = Math.random) {
  for (;;) {
    const p = Array.from({ length: cuantas }, () => 1 + Math.floor(rnd() * (cuantas === 2 ? 7 : 6)));
    if (xor(p) !== 0) return p;
  }
}

// ================= 🔴 Cuatro en línea =================
export const FILAS = 6, COLS = 7;
export const vacio = () => Array.from({ length: FILAS }, () => Array(COLS).fill(0));
export const otro = j => 3 - j;                    // jugadores 1 y 2
export const libresC = t => [...Array(COLS).keys()].filter(c => !t[0][c]);

/** Fila donde cae la ficha en la columna c (o -1 si está llena). */
export function caeEn(t, c) {
  for (let f = FILAS - 1; f >= 0; f--) if (!t[f][c]) return f;
  return -1;
}
export function soltar(t, c, j) {
  const f = caeEn(t, c);
  if (f < 0) return null;
  const n = t.map(r => [...r]); n[f][c] = j;
  return { t: n, f };
}

const DIRS = [[0, 1], [1, 0], [1, 1], [1, -1]];
/** { quien, linea: [[f, c]…] } si alguien hizo cuatro; { quien: 0 } si se llenó; null si sigue. */
export function ganador(t) {
  for (let f = 0; f < FILAS; f++) for (let c = 0; c < COLS; c++) {
    const j = t[f][c];
    if (!j) continue;
    for (const [df, dc] of DIRS) {
      const linea = [0, 1, 2, 3].map(k => [f + df * k, c + dc * k]);
      if (linea.every(([a, b]) => a >= 0 && a < FILAS && b >= 0 && b < COLS && t[a][b] === j)) return { quien: j, linea };
    }
  }
  return libresC(t).length ? null : { quien: 0 };
}

// Puntaje de una posición para el jugador j: cuenta ventanas de 4 con fichas propias y sin fichas del otro
function puntaje(t, j) {
  let s = 0;
  const o = otro(j);
  for (let c = 0; c < FILAS; c++) if (t[c][3] === j) s += 3;          // el centro vale más
  for (let f = 0; f < FILAS; f++) for (let c = 0; c < COLS; c++) for (const [df, dc] of DIRS) {
    const fin = [f + df * 3, c + dc * 3];
    if (fin[0] < 0 || fin[0] >= FILAS || fin[1] < 0 || fin[1] >= COLS) continue;
    let mias = 0, suyas = 0;
    for (let k = 0; k < 4; k++) { const v = t[f + df * k][c + dc * k]; if (v === j) mias++; else if (v === o) suyas++; }
    if (mias && suyas) continue;
    if (mias === 3) s += 5; else if (mias === 2) s += 2;
    if (suyas === 3) s -= 4;
  }
  return s;
}
const ORDEN = [3, 2, 4, 1, 5, 0, 6]; // probar primero las columnas del centro

function negamax(t, j, prof, a, b) {
  const g = ganador(t);
  if (g) return g.quien === 0 ? 0 : -100000 - prof;   // el que acaba de jugar ganó
  if (prof === 0) return puntaje(t, j) - puntaje(t, otro(j));
  let mejor = -Infinity;
  for (const c of ORDEN) {
    const r = soltar(t, c, j);
    if (!r) continue;
    const v = -negamax(r.t, otro(j), prof - 1, -b, -a);
    if (v > mejor) mejor = v;
    if (v > a) a = v;
    if (a >= b) break;
  }
  return mejor;
}

/** Mejor columna para j buscando `prof` jugadas adelante (entre las igual de buenas, una al azar). */
export function mejorColumna(t, j, prof, rnd = Math.random) {
  let mejor = -Infinity, cols = [];
  for (const c of ORDEN) {
    const r = soltar(t, c, j);
    if (!r) continue;
    const v = -negamax(r.t, otro(j), prof - 1, -Infinity, Infinity);
    if (v > mejor) { mejor = v; cols = [c]; } else if (v === mejor) cols.push(c);
  }
  return elegir(cols, rnd);
}

/** Columna donde j gana ya (o -1). */
export function paraGanarC(t, j) {
  for (const c of libresC(t)) { const r = soltar(t, c, j); if (ganador(r.t)?.quien === j) return c; }
  return -1;
}

/**
 * Jugada del jaguar:
 *   facil:   a veces gana si puede; casi siempre juega al azar
 *   medio:   gana si puede, bloquea, y mira 2 jugadas adelante
 *   dificil: mira 6 jugadas adelante
 */
export function jaguarCuatro(t, j, nivel, rnd = Math.random) {
  const gana = paraGanarC(t, j);
  if (gana >= 0 && (nivel !== "facil" || rnd() < 0.5)) return gana;   // el fácil a veces no ve que puede ganar
  if (nivel === "facil") {
    const bloquea = paraGanarC(t, otro(j));
    if (bloquea >= 0 && rnd() < 0.3) return bloquea;
    return elegir(libresC(t), rnd);
  }
  const bloquea = paraGanarC(t, otro(j));
  if (bloquea >= 0) return bloquea;
  return mejorColumna(t, j, nivel === "medio" ? 2 : 6, rnd);
}

/** Consejo para el niño: { col, tipo: "ganar" | "bloquear" | "centro" | "mejor" } */
export function consejoCuatro(t, j) {
  const gana = paraGanarC(t, j);
  if (gana >= 0) return { col: gana, tipo: "ganar" };
  const bloquea = paraGanarC(t, otro(j));
  if (bloquea >= 0) return { col: bloquea, tipo: "bloquear" };
  const col = mejorColumna(t, j, 4, () => 0);
  if (col === 3 && t[FILAS - 1][3] === 0) return { col, tipo: "centro" };
  return { col, tipo: "mejor" };
}
