// Ayudas para las pruebas de los generadores (node:test, sin dependencias).
//
// Lo principal es el azar con semilla: la misma semilla da siempre la misma lista de números,
// así un fallo se puede repetir. Uso: const rnd = azar(42); rnd() // como Math.random()
import { test } from "node:test";
import assert from "node:assert/strict";

/** PRNG mulberry32: devuelve una función que da números en [0, 1), como Math.random. */
export function azar(semilla = 1) {
  if (!Number.isInteger(semilla)) throw new TypeError(`la semilla tiene que ser un entero (vino ${semilla})`);
  let a = semilla >>> 0;
  return function rnd() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Semilla de la suite. Para probar con otra: SEMILLA=123 node --test pruebas/generadores/*.test.mjs */
const desdeEntorno = Number(process.env.SEMILLA);
export const SEMILLA = process.env.SEMILLA !== undefined && Number.isInteger(desdeEntorno) ? desdeEntorno : 20261111;

/** Edades con las que se prueban las funciones de «escalón para empezar» (null = no la dijo). */
export const EDADES = [null, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/** «escalón 3 (Sumar minutos)» para los nombres de las pruebas. */
export const etiqueta = (i, e) => `escalón ${i + 1}${e?.nombre ? ` (${e.nombre})` : ""}`;

/**
 * Genera `vueltas` cosas y junta lo que revisar() encuentre, sin repetidos y con un tope para que
 * un fallo no llene la pantalla. Cada problema dice en qué vuelta salió por primera vez.
 *   generar(k) → la cosa de la vuelta k · revisar(cosa) → lista de problemas (vacía = bien)
 */
export function problemasDe(vueltas, generar, revisar, tope = 15) {
  const vistos = new Map();
  for (let k = 0; k < vueltas && vistos.size < tope; k++) {
    for (const m of revisar(generar(k))) if (!vistos.has(m)) vistos.set(m, k);
  }
  return [...vistos].map(([m, k]) => `${m} (vuelta ${k})`);
}

/**
 * Corre fn() con Math.random cambiado por un azar con semilla, para las funciones que no reciben
 * rnd y usan Math.random por dentro. Siempre deja Math.random como estaba.
 */
export function conMathRandom(semilla, fn) {
  const original = Math.random;
  Math.random = azar(semilla);
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

/**
 * La lista de la que salen los tests, pero antes un test que exige que no esté vacía:
 * si un cambio la deja en [], el forEach no crearía ningún test y todo saldría en verde sin probar nada.
 */
export function noVacio(lista, nombre) {
  test(`${nombre} trae algo para probar`, () => assert.ok(Array.isArray(lista) && lista.length > 0, `${nombre} está vacío`));
  return lista ?? [];
}
