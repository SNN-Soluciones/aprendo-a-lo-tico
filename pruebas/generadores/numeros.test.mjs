import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, MODOS, ronda, inicio, enPalabras, revisarRonda } from "../../public/js/numeros.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`números, ${etiqueta(i, escalon)}: cada ronda trae la correcta, números en rango y redondeos bien hechos`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => ronda(i, rnd), revisarRonda);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarRonda de números detecta una correcta que no está entre las opciones", () => {
  // Arrange: «Antes y después hasta 10» es de opciones
  const buena = ronda(0, azar(SEMILLA));
  const mala = { ...buena, correcta: "999" };
  // Act
  const problemas = revisarRonda(mala);
  // Assert
  assert.deepEqual(revisarRonda(buena), []);
  assert.ok(problemas.includes("falta la correcta"), problemas.join("; "));
});

test("enPalabras de números dice bien algunos números conocidos", () => {
  // Act / Assert
  assert.equal(enPalabras(1), "uno");
  assert.equal(enPalabras(16), "dieciséis");
  assert.equal(enPalabras(21), "veintiuno");
  assert.equal(enPalabras(100), "cien");
});

test("los modos de números apuntan a escalones que existen y el inicio también", () => {
  // Act
  const malos = MODOS.flatMap(m => m.escalones.filter(e => !ESCALONES[e]).map(e => `${m.id}: ${e}`));
  const fuera = EDADES.filter(edad => !ESCALONES[inicio(edad)]);
  // Assert
  assert.deepEqual(malos, []);
  assert.deepEqual(fuera, []);
});
