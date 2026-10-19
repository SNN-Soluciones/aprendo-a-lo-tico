// 🧱 Lógica de «Sumas con bloques» y «Restas con bloques» (sin pantalla, para poder probarla sola).
// La escalera 🪜 va de a poquito: primero se cuentan unos pocos bloques, después las decenas,
// luego llevar (o prestar) una vez, dos veces, con ceros… Al final de cada problema el niño
// dice cuánto dio, escogiendo entre tres respuestas.

export const digitos = (x, len) => Array.from({ length: len }, (_, p) => Math.floor(x / 10 ** p) % 10);
const ent = (lo, hi, rnd) => lo + Math.floor(rnd() * (hi - lo + 1));

/** En cuántas columnas se lleva (la columna suma 10 o más con lo que viene de la derecha). */
export function llevadas(a, b, n) {
  const da = digitos(a, n), db = digitos(b, n);
  let c = 0, veces = 0;
  for (let p = 0; p < n; p++) { const s = da[p] + db[p] + c; c = s >= 10 ? 1 : 0; veces += c; }
  return veces;
}

/** En cuántas columnas hay que prestar (pedirle a la columna de la izquierda). */
export function prestadas(a, b, n) {
  const da = digitos(a, n), db = digitos(b, n);
  let p0 = 0, veces = 0;
  for (let p = 0; p < n; p++) { const d = da[p] - p0 - db[p]; p0 = d < 0 ? 1 : 0; veces += p0; }
  return veces;
}

// Cada escalón: columnas (n), rangos de a y de b, y la condición que deben cumplir.
// `ej` es un ejemplo válido por si el azar no encuentra uno (no debería pasar).
export const ESCALONES_SUMA = [
  { n: 1, nombre: "Hasta 5", a: [1, 4], b: [1, 4], ok: (a, b) => a + b <= 5, ej: [3, 2] },
  { n: 1, nombre: "Hasta 9", a: [1, 8], b: [1, 8], ok: (a, b) => a + b >= 6 && a + b <= 9, ej: [5, 3] },
  { n: 2, nombre: "Hasta 20 sin llevar", a: [11, 18], b: [1, 8], ok: (a, b) => llevadas(a, b, 2) === 0, ej: [12, 5] },
  { n: 2, nombre: "Hasta 20 llevando", a: [2, 9], b: [2, 9], ok: (a, b) => a + b >= 11, ej: [8, 5] },
  { n: 2, nombre: "Decenas cerradas", a: [10, 80], b: [10, 80], ok: (a, b) => a % 10 === 0 && b % 10 === 0 && a + b <= 90, ej: [30, 40] },
  { n: 2, nombre: "Dos cifras sin llevar", a: [11, 88], b: [11, 88], ok: (a, b) => a % 10 && b % 10 && llevadas(a, b, 2) === 0, ej: [23, 45] },
  { n: 2, nombre: "Dos cifras + una, llevando", a: [11, 89], b: [2, 9], ok: (a, b) => llevadas(a, b, 2) === 1 && a + b <= 99, ej: [27, 6] },
  { n: 2, nombre: "Dos cifras llevando", a: [11, 79], b: [11, 79], ok: (a, b) => llevadas(a, b, 2) === 1 && a + b <= 99, ej: [38, 25] },
  { n: 3, nombre: "Tres cifras sin llevar", a: [101, 888], b: [101, 888], ok: (a, b) => llevadas(a, b, 3) === 0, ej: [234, 152] },
  { n: 3, nombre: "Tres cifras llevando una vez", a: [101, 889], b: [101, 889], ok: (a, b) => llevadas(a, b, 3) === 1 && a + b <= 999, ej: [256, 318] },
  { n: 3, nombre: "Tres cifras llevando dos veces", a: [101, 889], b: [11, 889], ok: (a, b) => llevadas(a, b, 3) === 2 && a + b <= 999, ej: [457, 186] },
  { n: 4, nombre: "Miles llevando", a: [1001, 8999], b: [101, 8999], ok: (a, b) => llevadas(a, b, 4) >= 1 && a + b <= 9999, ej: [2768, 1459] },
];

export const ESCALONES_RESTA = [
  { n: 1, nombre: "Quitar hasta 5", a: [2, 5], b: [1, 4], ok: (a, b) => b < a, ej: [5, 2] },
  { n: 1, nombre: "Quitar hasta 9", a: [5, 9], b: [1, 8], ok: (a, b) => b < a, ej: [8, 3] },
  { n: 2, nombre: "Hasta 20 sin prestar", a: [11, 19], b: [1, 9], ok: (a, b) => prestadas(a, b, 2) === 0, ej: [17, 5] },
  { n: 2, nombre: "Hasta 20 prestando", a: [11, 18], b: [2, 9], ok: (a, b) => prestadas(a, b, 2) === 1, ej: [13, 5] },
  { n: 2, nombre: "Decenas cerradas", a: [20, 90], b: [10, 80], ok: (a, b) => a % 10 === 0 && b % 10 === 0 && b < a, ej: [70, 30] },
  { n: 2, nombre: "Dos cifras sin prestar", a: [21, 99], b: [11, 88], ok: (a, b) => b < a && b % 10 && prestadas(a, b, 2) === 0 && a - b >= 10, ej: [58, 23] },
  { n: 2, nombre: "Dos cifras − una, prestando", a: [21, 98], b: [2, 9], ok: (a, b) => prestadas(a, b, 2) === 1, ej: [42, 7] },
  { n: 2, nombre: "Dos cifras prestando", a: [31, 98], b: [11, 89], ok: (a, b) => b < a && prestadas(a, b, 2) === 1 && a - b >= 10, ej: [42, 17] },
  { n: 3, nombre: "Tres cifras sin prestar", a: [200, 999], b: [101, 899], ok: (a, b) => b < a && prestadas(a, b, 3) === 0 && a - b >= 100, ej: [586, 243] },
  { n: 3, nombre: "Tres cifras prestando una vez", a: [200, 999], b: [101, 899], ok: (a, b) => b < a && prestadas(a, b, 3) === 1 && a - b >= 100, ej: [352, 127] },
  { n: 3, nombre: "Tres cifras prestando dos veces", a: [200, 999], b: [11, 899], ok: (a, b) => b < a && prestadas(a, b, 3) === 2 && digitos(a, 3)[1] !== 0 && a - b >= 10, ej: [523, 168] },
  { n: 3, nombre: "Prestando con un cero", a: [201, 909], b: [11, 899], ok: (a, b) => b < a && digitos(a, 3)[1] === 0 && digitos(b, 3)[0] > digitos(a, 3)[0] && a - b >= 10, ej: [403, 128] },
  { n: 4, nombre: "Miles prestando", a: [2000, 9999], b: [101, 8999], ok: (a, b) => b < a && prestadas(a, b, 4) >= 1 && a - b >= 1000, ej: [4305, 1528] },
];

const escalonesDe = tipo => tipo === "suma" ? ESCALONES_SUMA : ESCALONES_RESTA;

/** Escalón para empezar según la edad (nunca más arriba de lo que se ve a esa edad). */
export function inicioBloques(tipo, edad) {
  if (edad === null || edad <= 6) return 0;
  if (edad === 7) return 2;
  if (edad === 8) return 4;
  if (edad === 9) return 7;
  return 8; // 10 años o más: tres cifras sin llevar (o sin prestar) y de ahí sube rápido
}

/** Un problema [a, b] del escalón, distinto del anterior. */
export function problema(tipo, escalon, anterior = null, rnd = Math.random) {
  const e = escalonesDe(tipo)[escalon];
  for (let t = 0; t < 5000; t++) {
    const a = ent(e.a[0], e.a[1], rnd), b = ent(e.b[0], e.b[1], rnd);
    if (!e.ok(a, b)) continue;
    if (anterior && anterior[0] === a && anterior[1] === b) continue;
    return [a, b];
  }
  return [...e.ej];
}

export const resultadoDe = (tipo, a, b) => tipo === "suma" ? a + b : a - b;

/**
 * Tres respuestas para «¿Cuánto da?»: la correcta y dos que salen de errores comunes
 * (sumar sin llevar, olvidar lo que se llevó, restar el pequeño del grande en cada columna, contar uno de más…).
 */
export function opcionesResultado(tipo, a, b, n, rnd = Math.random) {
  const r = resultadoDe(tipo, a, b);
  const da = digitos(a, n), db = digitos(b, n);
  const tipicos = [], otros = [];
  if (n === 1) otros.push(r + 1, r - 1, r + 2, r - 2);
  else if (tipo === "suma") {
    // «Sin llevar»: cada columna por aparte, como 38 + 25 → 513; y «olvidé lo que llevaba»: 38 + 25 → 53
    tipicos.push(Number(da.map((d, p) => d + db[p]).reverse().join("")));
    if (llevadas(a, b, n)) tipicos.push(r - 10 ** (digitos(a, n).findIndex((d, p) => d + db[p] >= 10) + 1));
    otros.push(r + 10, r - 10, r + 1, r - 1);
  } else {
    // «El pequeño del grande» en cada columna: 42 − 17 → 35
    tipicos.push(Number(da.map((d, p) => Math.abs(d - db[p])).reverse().join("")));
    otros.push(r + 10, r - 10, r + 1, r - 1);
  }
  const valida = x => Number.isInteger(x) && x >= 0 && x !== r && x < 10 ** (n + 1);
  // Siempre va un error típico (si lo hay) y la otra sale al azar de las demás
  const tip = tipicos.filter(valida);
  const elegidas = tip.length ? [tip.splice(Math.floor(rnd() * tip.length), 1)[0]] : [];
  const resto = [...new Set([...tip, ...otros])].filter(x => valida(x) && !elegidas.includes(x));
  while (elegidas.length < 2 && resto.length) {
    const i = Math.floor(rnd() * resto.length);
    const [x] = resto.splice(i, 1);
    if (!elegidas.includes(x)) elegidas.push(x);
  }
  const ops = [r, ...elegidas];
  for (let i = ops.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ops[i], ops[j]] = [ops[j], ops[i]]; }
  return ops;
}

/** Revisa que cada escalón genere lo que dice. Devuelve una lista de problemas (vacía = todo bien). */
export function revisarBloques(rondas = 3000, rnd = Math.random) {
  const errores = [];
  for (const tipo of ["suma", "resta"]) {
    const escs = escalonesDe(tipo);
    escs.forEach((e, i) => {
      const [ea, eb] = e.ej;
      if (!e.ok(ea, eb)) errores.push(`${tipo} ${i}: el ejemplo ${ea}, ${eb} no cumple`);
      let anterior = null;
      const vistos = new Set();
      for (let k = 0; k < rondas; k++) {
        const [a, b] = problema(tipo, i, anterior, rnd);
        const r = resultadoDe(tipo, a, b);
        const id = `${tipo} ${i} (${a}, ${b})`;
        vistos.add(`${a},${b}`);
        if (anterior && anterior[0] === a && anterior[1] === b && vistos.size > 1) errores.push(`${id}: repite el anterior`);
        if (!e.ok(a, b)) errores.push(`${id}: no cumple la condición`);
        if (a < 1 || b < 1) errores.push(`${id}: número menor que 1`);
        if (a >= 10 ** e.n || r >= 10 ** e.n) errores.push(`${id}: no cabe en ${e.n} columnas`);
        if (r < 1) errores.push(`${id}: el resultado es ${r}`);
        if (tipo === "resta" && b >= a) errores.push(`${id}: queda negativo o cero`);
        const ops = opcionesResultado(tipo, a, b, e.n, rnd);
        if (ops.length !== 3 || new Set(ops).size !== 3) errores.push(`${id}: opciones ${ops}`);
        if (!ops.includes(r)) errores.push(`${id}: falta la correcta en ${ops}`);
        if (ops.some(x => x < 0 || !Number.isInteger(x))) errores.push(`${id}: opción rara en ${ops}`);
        anterior = [a, b];
        if (errores.length > 20) return;
      }
      if (vistos.size < Math.min(4, rondas)) errores.push(`${tipo} ${i}: muy pocos problemas distintos (${vistos.size})`);
    });
    // Los escalones no bajan de columnas al subir
    escs.forEach((e, i) => { if (i && e.n < escs[i - 1].n) errores.push(`${tipo} ${i}: baja de ${escs[i - 1].n} a ${e.n} columnas`); });
  }
  // Errores típicos que deben salir
  const o = opcionesResultado("suma", 38, 25, 2, () => 0);
  if (!o.includes(513) || !o.includes(63)) errores.push(`38 + 25: se esperaba 513 entre ${o}`);
  const s = opcionesResultado("resta", 42, 17, 2, () => 0);
  if (!s.includes(35) || !s.includes(25)) errores.push(`42 − 17: se esperaba 35 entre ${s}`);
  return errores;
}
