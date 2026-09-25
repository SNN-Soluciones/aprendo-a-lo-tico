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
