// ✖️ Lógica de «Tablas en la feria» (sin pantalla, para poder probarla sola).
// Multiplicar es juntar filas iguales: 3 × 4 son 3 filas de 4 mangos en el tramo.

export const FRUTAS = [
  { e: "🥭", n: "mangos", cuantas: "Cuántos" }, { e: "🍊", n: "naranjas", cuantas: "Cuántas" }, { e: "🍌", n: "bananos", cuantas: "Cuántos" },
  { e: "🍓", n: "fresas", cuantas: "Cuántas" }, { e: "🍍", n: "piñas", cuantas: "Cuántas" }, { e: "🥥", n: "pipas", cuantas: "Cuántas" },
];

const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/**
 * Preguntas de una tabla (las 10, en desorden): { a, b, r } con a × b = r.
 * `a` es la tabla: 3 × 1, 3 × 2 … 3 × 10.
 */
export function preguntasTabla(tabla, rnd = Math.random) {
  return barajar(Array.from({ length: 10 }, (_, i) => ({ a: tabla, b: i + 1, r: tabla * (i + 1) })), rnd);
}

/** Pregunta al azar de varias tablas, sin repetir la anterior. */
export function preguntaMezcla(tablas, anterior, rnd = Math.random) {
  for (let k = 0; k < 20; k++) {
    const a = tablas[Math.floor(rnd() * tablas.length)], b = 1 + Math.floor(rnd() * 10);
    if (!anterior || anterior.a !== a || anterior.b !== b) return { a, b, r: a * b };
  }
  return { a: tablas[0], b: 1, r: tablas[0] };
}

/** Preguntas para «Filas de mangos»: productos chiquitos que se pueden contar (hasta 5 × 6). */
export function preguntasFilas(rnd = Math.random, n = 8) {
  const todas = [];
  for (let a = 2; a <= 5; a++) for (let b = 2; b <= 6; b++) todas.push({ a, b, r: a * b });
  return barajar(todas, rnd).slice(0, n);
}

/** Suma repetida: 3 × 4 → "4 + 4 + 4" (a filas de b). */
export const sumaRepetida = (a, b) => Array(a).fill(b).join(" + ");

/** Contando de b en b: 3 × 4 → [4, 8, 12]. */
export const contarDeA = (a, b) => Array.from({ length: a }, (_, i) => b * (i + 1));

/**
 * Truco para cada tabla, para aprender a pensar y no solo memorizar.
 * Es una pista: lleva casi hasta el resultado, pero el último paso lo hace el niño.
 */
export function truco(a, b) {
  const casi = (paso, veces) => veces > 1 ? `Contá de ${paso} en ${paso}: ${contarDeA(veces - 1, paso).join(", ")}… ¿y ${paso} más?` : `Es una sola vez el ${paso}.`;
  if (b === 1) return `Por 1 queda igual: ${a} × 1 es ${a}.`;
  if (a === 1) return `La tabla del 1 es fácil: 1 × ${b} es ${b}.`;
  if (b === 10 || a === 10) return `Por 10 se le pone un cero al final del ${a === 10 ? b : a}.`;
  if (a === 2) return `Por 2 es el doble: ${b} + ${b}.`;
  if (a === 4) return `Por 4 es el doble del doble: ${b} × 2 = ${b * 2}, y ahora el doble de ${b * 2}.`;
  if (a === 9) return `Truco del 9: ${b} × 10 = ${b * 10}, y le quitás ${b}.`;
  if (b < a) return `Al revés da lo mismo: ${a} × ${b} = ${b} × ${a}. ${casi(a, b)}`;
  return casi(a, b);
}

/** Estrellas al terminar una tabla (10 preguntas) según los errores. */
export const estrellasTabla = errores => errores === 0 ? 3 : errores <= 2 ? 2 : errores <= 4 ? 1 : 0;

// ---------- 🪜 Escalera: de contar filas de fruta a dividir, de a una tabla ----------
// tipo: "filas" (se ven las filas en el tramo) · "producto" (a × b = ?) · "falta" (a × ? = r) · "division" (r ÷ a = ?)
// · "mezcla" (cualquiera de las tres últimas). En «producto», `a` es la tabla.
const TODAS = [2, 3, 4, 5, 6, 7, 8, 9, 10];
export const ESCALONES = [
  { nombre: "Filas chiquitas", tipo: "filas", filas: [2, 3], de: [2, 5] },
  { nombre: "Filas de fruta", tipo: "filas", filas: [2, 5], de: [2, 6] },
  { nombre: "Tabla del 2", tipo: "producto", tablas: [2] },
  { nombre: "Tabla del 10", tipo: "producto", tablas: [10] },
  { nombre: "Tabla del 5", tipo: "producto", tablas: [5] },
  { nombre: "Del 2, del 5 y del 10", tipo: "producto", tablas: [2, 5, 10] },
  { nombre: "Tabla del 3", tipo: "producto", tablas: [3] },
  { nombre: "Tabla del 4", tipo: "producto", tablas: [4] },
  { nombre: "Del 2 al 5 y del 10", tipo: "producto", tablas: [2, 3, 4, 5, 10] },
  { nombre: "Tabla del 6", tipo: "producto", tablas: [6] },
  { nombre: "Tabla del 7", tipo: "producto", tablas: [7] },
  { nombre: "Tabla del 8", tipo: "producto", tablas: [8] },
  { nombre: "Tabla del 9", tipo: "producto", tablas: [9] },
  { nombre: "Todas revueltas", tipo: "producto", tablas: TODAS },
  { nombre: "El número que falta", tipo: "falta", tablas: TODAS },
  { nombre: "Dividir", tipo: "division", tablas: TODAS },
  { nombre: "Multiplicar y dividir", tipo: "mezcla", tablas: TODAS },
];

/** Escalón para empezar según la edad (las tablas se empiezan en 2.° y se terminan en 3.°). */
export function inicioTablas(edad) {
  if (edad === null || edad <= 7) return 0;
  if (edad === 8) return 2;
  if (edad === 9) return 4;
  if (edad === 10) return 6;
  return 8;
}

const ent = (lo, hi, rnd) => lo + Math.floor(rnd() * (hi - lo + 1));
const igualPregunta = (x, y) => x.tipo === y.tipo && x.a === y.a && x.b === y.b;

/**
 * Pregunta de un escalón: { tipo, a, b, r } con a × b = r. No repite las de `recientes` si se puede
 * (en una sola tabla hay 10 preguntas: así salen todas antes de volver a una).
 */
export function preguntaEscalon(i, recientes = [], rnd = Math.random) {
  const e = ESCALONES[i];
  let q = null;
  for (let k = 0; k < 40; k++) {
    if (e.tipo === "filas") {
      const a = ent(e.filas[0], e.filas[1], rnd), b = ent(e.de[0], e.de[1], rnd);
      q = { tipo: "filas", a, b, r: a * b };
    } else {
      const tipo = e.tipo === "mezcla" ? ["producto", "falta", "division"][Math.floor(rnd() * 3)] : e.tipo;
      const a = e.tablas[Math.floor(rnd() * e.tablas.length)];
      // Por 1 es muy fácil para dividir o buscar el que falta: ahí va del 2 al 10
      const b = ent(tipo === "producto" ? 1 : 2, 10, rnd);
      q = { tipo, a, b, r: a * b };
    }
    if (!recientes.some(x => igualPregunta(x, q))) return q;
  }
  return q;
}

/** Lo que el niño tiene que escribir. */
export const respuestaDe = q => q.tipo === "falta" || q.tipo === "division" ? q.b : q.r;

/** Pista (lleva casi hasta la respuesta; el último paso lo hace el niño). */
export function pistaDe(q) {
  if (q.tipo === "falta") return `Contá de ${q.a} en ${q.a} hasta llegar a ${q.r}: ${contarDeA(Math.min(3, q.b - 1), q.a).join(", ")}… ¿cuántos saltos son?`;
  if (q.tipo === "division") return `Pensá al revés: ¿${q.a} por cuánto da ${q.r}? Contá de ${q.a} en ${q.a} hasta ${q.r}.`;
  if (q.tipo === "filas") return `Contá de ${q.b} en ${q.b}, una fila a la vez: ${contarDeA(q.a, q.b).slice(0, -1).join(", ")}… ¿y la última fila?`;
  return truco(q.a, q.b);
}

/** Explicación cuando no le salió. */
export function explicaDe(q) {
  if (q.tipo === "falta") return `${q.a} × ${q.b} = ${q.r}: de ${q.a} en ${q.a} se llega a ${q.r} en ${q.b} saltos (${contarDeA(q.b, q.a).join(", ")}).`;
  if (q.tipo === "division") return `${q.r} ÷ ${q.a} = ${q.b}, porque ${q.a} × ${q.b} = ${q.r}.`;
  if (q.tipo === "filas") return `${q.a} × ${q.b} = ${q.r}. ${sumaRepetida(q.a, q.b)} = ${q.r}`;
  return `${q.a} × ${q.b} = ${q.r}. ${truco(q.a, q.b)}`;
}

/** Revisa los escalones: cada pregunta es del tipo y la tabla que dice, sin repetir. Devuelve [] si todo está bien. */
export function revisarTablas(rondas = 3000, rnd = Math.random) {
  const errores = [];
  ESCALONES.forEach((e, i) => {
    const recientes = [];
    const vistas = new Set();
    for (let k = 0; k < rondas; k++) {
      const q = preguntaEscalon(i, recientes, rnd);
      const id = `escalón ${i + 1} ${JSON.stringify(q)}`;
      vistas.add(`${q.tipo}${q.a}x${q.b}`);
      if (q.a * q.b !== q.r) errores.push(`${id}: la cuenta no da`);
      if (e.tipo === "filas") {
        if (q.tipo !== "filas" || q.a < e.filas[0] || q.a > e.filas[1] || q.b < e.de[0] || q.b > e.de[1]) errores.push(`${id}: fuera de rango`);
      } else {
        if (!e.tablas.includes(q.a)) errores.push(`${id}: no es de las tablas ${e.tablas}`);
        if (e.tipo !== "mezcla" && q.tipo !== e.tipo) errores.push(`${id}: tipo equivocado`);
        if (!["producto", "falta", "division"].includes(q.tipo)) errores.push(`${id}: tipo raro`);
        if (q.b < 1 || q.b > 10) errores.push(`${id}: b fuera de 1 a 10`);
        if (q.tipo !== "producto" && q.b < 2) errores.push(`${id}: por 1 en ${q.tipo}`);
      }
      const resp = respuestaDe(q);
      if (!Number.isInteger(resp) || resp < 1 || resp > 100) errores.push(`${id}: respuesta ${resp}`);
      if (recientes.some(x => igualPregunta(x, q))) errores.push(`${id}: repite una de las últimas`);
      for (const t of [pistaDe(q), explicaDe(q)]) if (!t || /undefined|NaN/.test(t)) errores.push(`${id}: texto raro «${t}»`);
      // La pista no dice la respuesta (salvo los trucos de ×1 y ×10, que son la regla misma)
      if (q.tipo === "falta" && new RegExp(`(^|\\D)${q.b} saltos`).test(pistaDe(q))) errores.push(`${id}: la pista dice la respuesta`);
      recientes.push(q); if (recientes.length > 3) recientes.shift();
      if (errores.length > 20) return;
    }
    if (vistas.size < 4) errores.push(`escalón ${i + 1}: muy pocas preguntas distintas`);
  });
  return errores;
}
