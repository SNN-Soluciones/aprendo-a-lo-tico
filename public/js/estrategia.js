// ♟️ Lógica de «Estrategia contra el jaguar» (sin pantalla, para poder probarla sola con node).
//
//   🥭 Mangos (Nim): hay mangos en una o varias filas; en cada turno se quitan mangos de UNA fila.
//      Según la variante, el que se lleva el último mango gana… o pierde.
//   🔴 Cuatro en línea: 7 columnas × 6 filas, las fichas caen; gana quien junte cuatro en fila
//      (de lado, de arriba abajo o en diagonal).
//
// El jaguar tiene niveles: desde jugar al azar hasta jugar perfecto (mangos) o pensar varias jugadas
// adelante (cuatro en línea). La escalera 🪜 de la página va subiendo esos niveles de a poquito.

const elegir = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const entre = ([a, b], rnd) => a + Math.floor(rnd() * (b - a + 1));

// ======================= 🥭 MANGOS (Nim) =======================
// Una posición: { filas: [n, …], max, ultimaGana }
//   max: cuántos mangos se pueden quitar por turno (0 = todos los que quiera, de una sola fila)
//   ultimaGana: true = el que se lleva el último mango gana · false = el que se lleva el último pierde

/**
 * 🪜 Escalones de los mangos. filas: rango de mangos de cada fila · p: qué tan seguido el jaguar
 * hace la jugada perfecta (0 = siempre al azar, 1 = nunca se equivoca).
 * El niño siempre empieza en una posición donde, si juega bien, gana (ver partidaNim).
 */
export const ESCALONES_NIM = [
  { nombre: "7 mangos, quitá 1 o 2", filas: [[6, 7]], max: 2, ultimaGana: true, p: 0 },        //  1. una fila cortita; el jaguar juega al azar
  { nombre: "8 mangos, quitá 1 o 2", filas: [[7, 9]], max: 2, ultimaGana: true, p: 0.3 },      //  2. el jaguar a veces piensa
  { nombre: "Hasta 3 por turno", filas: [[9, 11]], max: 3, ultimaGana: true, p: 0.3 },         //  3. ahora se pueden quitar 1, 2 o 3
  { nombre: "Más mangos", filas: [[11, 13]], max: 3, ultimaGana: true, p: 0.55 },              //  4.
  { nombre: "El jaguar piensa más", filas: [[13, 15]], max: 3, ultimaGana: true, p: 0.8 },     //  5.
  { nombre: "Jaguar perfecto", filas: [[14, 17]], max: 3, ultimaGana: true, p: 1 },            //  6. hay que saber el truco de la tabla del 4
  { nombre: "Al revés: el último pierde", filas: [[9, 12]], max: 3, ultimaGana: false, p: 0.5 },//  7. ahora el que se lleva el último PIERDE
  { nombre: "Al revés, perfecto", filas: [[12, 15]], max: 3, ultimaGana: false, p: 1 },        //  8.
  { nombre: "Dos filas", filas: [[2, 4], [3, 5]], max: 0, ultimaGana: true, p: 0.5 },          //  9. de una fila, cuantos quiera
  { nombre: "Dos filas, más difícil", filas: [[3, 6], [4, 7]], max: 0, ultimaGana: true, p: 0.85 }, // 10. el truco del espejo
  { nombre: "Tres filas", filas: [[1, 3], [2, 4], [4, 6]], max: 0, ultimaGana: true, p: 0.7 },  // 11.
  { nombre: "Tres filas, perfecto", filas: [[2, 4], [3, 5], [4, 6]], max: 0, ultimaGana: true, p: 1 }, // 12. jaguar perfecto
];

export const vacia = pos => pos.filas.every(n => n === 0);
/** Todas las jugadas posibles: [{ fila, cuantos }] */
export function movidas(pos) {
  const r = [];
  pos.filas.forEach((n, fila) => {
    const tope = pos.max ? Math.min(pos.max, n) : n;
    for (let cuantos = 1; cuantos <= tope; cuantos++) r.push({ fila, cuantos });
  });
  return r;
}
export const aplicar = (pos, m) => ({ ...pos, filas: pos.filas.map((n, i) => (i === m.fila ? n - m.cuantos : n)) });

const memoNim = new Map();
/** ¿Gana el que tiene el turno, si juega perfecto? (se calcula probando todo, con memoria) */
export function ganadora(pos) {
  // Si no quedan mangos, el anterior se llevó el último: si «el último gana», el que sigue ya perdió
  if (vacia(pos)) return !pos.ultimaGana;
  const clave = `${[...pos.filas].sort((a, b) => a - b).join(",")}|${pos.max}|${pos.ultimaGana}`;
  if (memoNim.has(clave)) return memoNim.get(clave);
  const v = movidas(pos).some(m => !ganadora(aplicar(pos, m)));
  memoNim.set(clave, v);
  return v;
}
/** Jugadas que dejan al otro en una posición perdedora (vacío si no hay). */
export const buenas = pos => movidas(pos).filter(m => !ganadora(aplicar(pos, m)));

/** Jugada del jaguar: con probabilidad p juega perfecto; si no, al azar. */
export function jugadaNim(pos, p, rnd = Math.random) {
  const b = buenas(pos);
  if (b.length && rnd() < p) return elegir(b, rnd);
  return elegir(movidas(pos), rnd);
}

/** Posición inicial de un escalón: siempre ganadora para el que empieza (el niño). */
export function partidaNim(i, rnd = Math.random) {
  const e = ESCALONES_NIM[i];
  for (let k = 0; k < 300; k++) {
    const pos = { filas: e.filas.map(r => entre(r, rnd)), max: e.max, ultimaGana: e.ultimaGana };
    if (ganadora(pos)) return pos;
  }
  // No debería pasar: una fila de 7 con quitar 1 o 2 siempre es ganadora
  return { filas: [7], max: 2, ultimaGana: true };
}

/** Partida para 2 jugadores (cualquier posición; empieza quien toque). */
export function partidaDos(i, rnd = Math.random) {
  const e = ESCALONES_NIM[i];
  return { filas: e.filas.map(r => entre(r, rnd)), max: e.max, ultimaGana: e.ultimaGana };
}

// ---------- Palabras para la voz ----------
const NUM = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece",
  "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte"];
/** «un mango», «dos mangos», «veintiún mangos»… */
export const mangos = n => (n === 1 ? "un mango" : n === 21 ? "veintiún mangos" : `${NUM[n] ?? n} mangos`);

/** Explicación de la variante, para la instrucción. */
export function reglaNim(pos) {
  const cuantos = pos.max ? `podés quitar ${pos.max === 2 ? "uno o dos" : "uno, dos o tres"}` : "podés quitar los que quieras, pero de una sola fila";
  const fin = pos.ultimaGana ? "El que se lleva el último mango, gana." : "¡Ojo! El que se lleva el último mango, pierde.";
  return `En cada turno ${cuantos}. ${fin}`;
}

/**
 * 💡 Pista: una buena jugada para el que tiene el turno y por qué.
 * @returns {{ movida: {fila, cuantos}, texto: string, segura: boolean }}
 */
export function pistaNim(pos) {
  const b = buenas(pos);
  if (!b.length) {
    // No hay jugada segura: quitar poquito de la fila más grande y esperar un error
    const fila = pos.filas.indexOf(Math.max(...pos.filas));
    return { movida: { fila, cuantos: 1 }, segura: false,
      texto: "Ahora no hay jugada segura. Quitá uno solo y esperá a que el jaguar se equivoque." };
  }
  const m = b[0], despues = aplicar(pos, m), quita = m.cuantos === 1 ? "uno" : NUM[m.cuantos];
  if (pos.filas.length === 1 && pos.max) {
    const g = pos.max + 1, quedan = despues.filas[0];
    if (pos.ultimaGana) {
      if (quedan === 0) return { movida: m, segura: true, texto: `¡Quitá ${quita} y te llevás el último mango!` };
      return { movida: m, segura: true, texto: `Quitá ${quita}: así le quedan ${quedan} al jaguar, y ${quedan} está en la tabla del ${g}.` };
    }
    if (quedan === 1) return { movida: m, segura: true, texto: `Quitá ${quita}: así le queda un solo mango al jaguar ¡y tiene que llevárselo!` };
    return { movida: m, segura: true, texto: `Quitá ${quita}: así le quedan ${quedan} al jaguar, que es uno más que la tabla del ${g}.` };
  }
  const vivas = despues.filas.filter(n => n > 0);
  if (vivas.length === 2 && vivas[0] === vivas[1])
    return { movida: m, segura: true, texto: `Quitá ${quita} de esa fila: quedan dos filas iguales. Después hacé lo mismo que el jaguar, pero en la otra fila: el truco del espejo.` };
  if (vivas.length === 3 && [...vivas].sort((a, b) => a - b).join() === "1,2,3")
    return { movida: m, segura: true, texto: `Quitá ${quita} de esa fila: quedan uno, dos y tres. ¡Esa es una trampa para el jaguar!` };
  return { movida: m, segura: true, texto: `Quitá ${quita} de la fila marcada: así el jaguar queda en problemas.` };
}

/**
 * Lo que se aprende al perder, de a poquito: cada derrota en la misma variante da una pista más.
 * @param {object} pos  la posición inicial (para saber la variante)
 * @param {number} veces cuántas veces ha perdido en esta variante (1, 2, 3…)
 */
export function leccionNim(pos, veces) {
  if (pos.filas.length === 1 && pos.max) {
    const g = pos.max + 1, tabla = [g, 2 * g, 3 * g].join(", ");
    const pasos = pos.ultimaGana
      ? [`Fijate: si al jaguar le quedan ${g} mangos en su turno, ya perdió. Se lleve los que se lleve, vos te llevás los últimos.`,
        `El truco: dejale siempre ${tabla}… mangos. ¡La tabla del ${g}!`,
        `En tu turno, contá cuántos quedan y quitá los que sobran para llegar a la tabla del ${g}.`]
      : [`Fijate: si al jaguar le queda un solo mango, tiene que llevárselo y pierde.`,
        `El truco: dejale ${[1, 1 + g, 1 + 2 * g].join(", ")}… mangos: uno más que la tabla del ${g}.`,
        `En tu turno, contá cuántos quedan y quitá los que sobran para dejarle uno más que la tabla del ${g}.`];
    return pasos[Math.min(veces, pasos.length) - 1];
  }
  const pasos = [
    "El truco del espejo: si quedan dos filas iguales, hacé lo mismo que el jaguar, pero en la otra fila.",
    pos.filas.length >= 3 ? "Otra trampa: si le dejás al jaguar una fila de uno, otra de dos y otra de tres, ¡pierde!" : "Tratá de dejarle al jaguar dos filas iguales.",
    "Si te equivocás, tocá 💡 y te muestro la jugada.",
  ];
  return pasos[Math.min(veces, pasos.length) - 1];
}

// ======================= 🔴 CUATRO EN LÍNEA =======================
export const COLS = 7, FILAS = 6;
export const NINO = "R", JAGUAR = "A"; // rojo para el niño, amarillo para el jaguar
export const otro = s => (s === "R" ? "A" : "R");
export const vacio = () => Array(COLS * FILAS).fill(null);
const ORDEN = [3, 2, 4, 1, 5, 0, 6]; // primero el centro: así el jaguar piensa más rápido

/** Las 69 formas de hacer cuatro en fila: horizontal, vertical y las dos diagonales. */
export const VENTANAS = (() => {
  const v = [];
  for (let f = 0; f < FILAS; f++) for (let c = 0; c < COLS; c++)
    for (const [df, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      const ff = f + 3 * df, cc = c + 3 * dc;
      if (ff < FILAS && cc >= 0 && cc < COLS) v.push([0, 1, 2, 3].map(k => (f + k * df) * COLS + (c + k * dc)));
    }
  return v;
})();
const VENTANAS_DE = Array.from({ length: COLS * FILAS }, (_, i) => VENTANAS.filter(w => w.includes(i)));

/** Casilla donde cae una ficha en la columna c (o -1 si está llena). */
export function caeEn(t, c) {
  for (let f = FILAS - 1; f >= 0; f--) if (!t[f * COLS + c]) return f * COLS + c;
  return -1;
}
export const columnasLibres = t => ORDEN.filter(c => !t[c]).sort((a, b) => a - b);
/** ¿La ficha en la casilla i hizo cuatro en fila? Devuelve la línea o null. */
export function cuatroCon(t, i) {
  const s = t[i];
  if (!s) return null;
  return VENTANAS_DE[i].find(w => w.every(k => t[k] === s)) || null;
}
/** { quien, linea } si alguien ganó; { quien: "empate" } si se llenó; null si sigue. */
export function ganador(t) {
  for (const w of VENTANAS) { const a = t[w[0]]; if (a && w.every(i => t[i] === a)) return { quien: a, linea: w }; }
  return t.slice(0, COLS).every(Boolean) ? { quien: "empate" } : null;
}
/** Columna donde `s` hace cuatro ya (o -1). */
export function ganaEn(t, s) {
  for (const c of ORDEN) {
    const i = caeEn(t, c);
    if (i < 0) continue;
    t[i] = s;
    const ok = !!cuatroCon(t, i);
    t[i] = null;
    if (ok) return c;
  }
  return -1;
}
/** ¿Jugar en la columna c le deja a `rival` ganar justo encima? («regalar» la jugada) */
export function regala(t, c, s) {
  const i = caeEn(t, c);
  if (i < 0 || i < COLS) return false;
  const arriba = i - COLS;
  t[i] = s; t[arriba] = otro(s);
  const malo = !!cuatroCon(t, arriba);
  t[i] = null; t[arriba] = null;
  return malo;
}

// Puntaje de una posición para `s` (para pensar varias jugadas): ventanas con 2 y 3 propias valen,
// las del rival restan, y el centro vale un poquito más.
function puntaje(t, s) {
  const r = otro(s);
  let p = 0;
  for (let f = 0; f < FILAS; f++) { const v = t[f * COLS + 3]; if (v === s) p += 3; else if (v === r) p -= 3; }
  for (const w of VENTANAS) {
    let mias = 0, suyas = 0;
    for (const i of w) { if (t[i] === s) mias++; else if (t[i] === r) suyas++; }
    if (mias && suyas) continue;
    if (mias === 3) p += 5; else if (mias === 2) p += 2;
    if (suyas === 3) p -= 4; else if (suyas === 2) p -= 2;
  }
  return p;
}
// Negamax con poda alfa-beta. `ultima` es la ficha que acaba de poner el rival.
function negamax(t, prof, alfa, beta, s, ultima) {
  if (cuatroCon(t, ultima)) return -(100000 + prof); // el rival ya ganó (mientras antes, peor)
  if (t.slice(0, COLS).every(Boolean)) return 0;
  if (prof === 0) return puntaje(t, s);
  let mejor = -Infinity;
  for (const c of ORDEN) {
    const i = caeEn(t, c);
    if (i < 0) continue;
    t[i] = s;
    const v = -negamax(t, prof - 1, -beta, -alfa, otro(s), i);
    t[i] = null;
    if (v > mejor) mejor = v;
    if (v > alfa) alfa = v;
    if (alfa >= beta) break;
  }
  return mejor;
}
/** Las columnas igual de buenas para `s`, pensando `prof` jugadas adelante. */
export function mejoresColumnas(t, s, prof) {
  const g = [...t];
  const vals = [];
  for (const c of ORDEN) {
    const i = caeEn(g, c);
    if (i < 0) continue;
    g[i] = s;
    vals.push([c, -negamax(g, prof - 1, -Infinity, Infinity, otro(s), i)]);
    g[i] = null;
  }
  const max = Math.max(...vals.map(v => v[1]));
  return vals.filter(v => v[1] === max).map(v => v[0]);
}

/** 🪜 Escalones del jaguar en cuatro en línea, de a poquito. */
export const ESCALONES_CUATRO = [
  { nombre: "Jaguar distraído", tipo: "azar" },          // 1. pone fichas al azar
  { nombre: "Gana si puede", tipo: "gana" },             // 2. si puede hacer cuatro, lo hace
  { nombre: "Gana y tapa", tipo: "tapa" },               // 3. además tapa tus tres en fila
  { nombre: "No regala", tipo: "cuida" },                // 4. además no juega debajo de donde vos ganarías, y busca el centro
  { nombre: "Piensa 2 jugadas", tipo: "piensa", prof: 2 },// 5.
  { nombre: "Piensa 4 jugadas", tipo: "piensa", prof: 4 },// 6.
  { nombre: "Piensa 6 jugadas", tipo: "piensa", prof: 6 },// 7. muy difícil de ganarle
];

/** Jugada del jaguar (`s`) en cuatro en línea, según el escalón. Devuelve la columna. */
export function jugadaCuatro(t, s, escalon, rnd = Math.random) {
  const e = ESCALONES_CUATRO[escalon] || ESCALONES_CUATRO[0];
  const libres = columnasLibres(t);
  if (e.tipo === "azar") return elegir(libres, rnd);
  const gana = ganaEn(t, s);
  if (gana >= 0) return gana;
  if (e.tipo === "gana") return elegir(libres, rnd);
  const tapa = ganaEn(t, otro(s));
  if (tapa >= 0) return tapa;
  if (e.tipo === "tapa") return elegir(libres, rnd);
  if (e.tipo === "cuida") {
    const seguras = libres.filter(c => !regala(t, c, s));
    const opciones = seguras.length ? seguras : libres;
    // Preferir el centro: cada columna pesa más mientras más cerca del centro esté
    const pesos = opciones.map(c => 4 - Math.abs(3 - c));
    let x = rnd() * pesos.reduce((a, b) => a + b, 0);
    for (let k = 0; k < opciones.length; k++) { x -= pesos[k]; if (x < 0) return opciones[k]; }
    return opciones[opciones.length - 1];
  }
  return elegir(mejoresColumnas(t, s, e.prof), rnd);
}

/**
 * 💡 Consejo para el niño que juega con `s`, con la razón (para aprender a pensar):
 *   ganar · tapar · noRegales (y cuál evitar) · centro · mejor
 */
export function consejoCuatro(t, s) {
  const gana = ganaEn(t, s);
  if (gana >= 0) return { columna: gana, tipo: "ganar" };
  const tapa = ganaEn(t, otro(s));
  if (tapa >= 0) return { columna: tapa, tipo: "tapar" };
  const libres = columnasLibres(t);
  const peligrosas = libres.filter(c => regala(t, c, s));
  const buenas = mejoresColumnas(t, s, 4).filter(c => !peligrosas.includes(c));
  const columna = buenas.length ? buenas[0] : libres[0];
  if (peligrosas.length) return { columna, tipo: "noRegales", evitar: peligrosas[0] };
  if (columna === 3) return { columna, tipo: "centro" };
  return { columna, tipo: "mejor" };
}

// ======================= ✅ Revisiones (para node) =======================
/**
 * Revisa la lógica. Devuelve una lista de problemas (vacía = bien).
 *   - Mangos: el jaguar perfecto nunca pierde si le toca en posición ganadora, en todas las variantes,
 *     contra un rival al azar; la pista siempre deja al otro en posición perdedora; las partidas
 *     de cada escalón empiezan ganadoras para el niño.
 *   - Cuatro en línea: se detecta cuatro en fila en las 4 direcciones; desde «gana» el jaguar gana
 *     cuando puede; desde «tapa» tapa tus tres en fila.
 */
export function revisarEstrategia(rnd = Math.random, vueltas = 300) {
  const mal = [];
  // --- Mangos ---
  ESCALONES_NIM.forEach((e, i) => {
    for (let k = 0; k < vueltas; k++) {
      const inicio = partidaNim(i, rnd);
      if (!ganadora(inicio)) { mal.push(`nim ${i + 1}: empieza perdedora`); break; }
      const p = pistaNim(inicio);
      if (!p.segura || ganadora(aplicar(inicio, p.movida))) { mal.push(`nim ${i + 1}: la pista no es buena`); break; }
      // El perfecto empieza en posición ganadora contra uno al azar: tiene que ganar siempre
      let pos = inicio, turno = "perfecto", ultimo = null;
      while (!vacia(pos)) {
        const m = turno === "perfecto" ? jugadaNim(pos, 1, rnd) : jugadaNim(pos, 0, rnd);
        if (m.cuantos < 1 || m.cuantos > (pos.max || pos.filas[m.fila]) || m.cuantos > pos.filas[m.fila]) { mal.push(`nim ${i + 1}: jugada inválida`); break; }
        pos = aplicar(pos, m); ultimo = turno;
        turno = turno === "perfecto" ? "azar" : "perfecto";
      }
      const gano = pos.ultimaGana ? ultimo : (ultimo === "perfecto" ? "azar" : "perfecto");
      if (gano !== "perfecto") { mal.push(`nim ${i + 1}: el perfecto perdió desde ${inicio.filas}`); break; }
    }
  });
  // --- Cuatro en línea: las 4 direcciones ---
  for (const w of VENTANAS) {
    const t = vacio();
    w.forEach(i => { t[i] = "R"; });
    const g = ganador(t);
    if (!g || g.quien !== "R") { mal.push(`cuatro: no detecta la línea ${w}`); break; }
  }
  const dirs = new Set(VENTANAS.map(w => w[1] - w[0]));
  if (![1, COLS, COLS + 1, COLS - 1].every(d => dirs.has(d))) mal.push("cuatro: faltan direcciones");
  // --- Cuatro en línea: gana y tapa en tableros al azar ---
  for (let k = 0; k < vueltas * 2; k++) {
    const t = vacio();
    let s = "R";
    const n = 4 + Math.floor(rnd() * 20);
    for (let j = 0; j < n; j++) {
      const c = elegir(columnasLibres(t), rnd), i = caeEn(t, c);
      t[i] = s;
      if (cuatroCon(t, i)) { t[i] = null; break; }
      s = otro(s);
    }
    if (ganador(t)) continue;
    const yo = "A", gana = ganaEn(t, yo), tapa = ganaEn(t, "R");
    for (let e = 1; e < ESCALONES_CUATRO.length; e++) {
      if (e === ESCALONES_CUATRO.length - 1 && k % 10) continue; // el de 6 jugadas es lento: se revisa de vez en cuando
      const c = jugadaCuatro([...t], yo, e, rnd);
      if (!columnasLibres(t).includes(c)) { mal.push(`cuatro ${e + 1}: columna llena`); continue; }
      if (gana >= 0) {
        const g = [...t]; g[caeEn(g, c)] = yo;
        if (!ganador(g) || ganador(g).quien !== yo) mal.push(`cuatro ${e + 1}: no ganó pudiendo`);
      } else if (tapa >= 0 && e >= 2) {
        // Con una sola amenaza, hay que taparla (si hay dos, ya no se puede)
        const amenazas = columnasLibres(t).filter(cc => { const g = [...t], i = caeEn(g, cc); g[i] = "R"; return !!cuatroCon(g, i); });
        if (amenazas.length === 1 && c !== tapa) mal.push(`cuatro ${e + 1}: no tapó el tres en fila`);
      }
    }
  }
  return [...new Set(mal)];
}
