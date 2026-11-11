import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, MODOS, pregunta, inicio, revisarPregunta } from "../../public/js/bus.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

// Cada pregunta del bus arma relojes y horarios: 250 por escalón es menos de medio segundo en total
const VUELTAS = 250;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`bus, ${etiqueta(i, escalon)}: cada pregunta trae la respuesta bien calculada y entre las opciones`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => pregunta(i, rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarPregunta del bus detecta una correcta que no es la hora del reloj", () => {
  // Arrange: el primer escalón es de opciones (¿qué hora marca el reloj?)
  const buena = pregunta(0, azar(SEMILLA));
  const mala = { ...buena, correcta: "99:99" };
  // Act
  const problemas = revisarPregunta(mala);
  // Assert
  assert.deepEqual(revisarPregunta(buena), []);
  assert.ok(problemas.some(p => p.includes("no está entre las opciones")), problemas.join("; "));
});

test("los modos del bus apuntan a escalones que existen", () => {
  // Act
  const malos = MODOS.flatMap(m => m.escalones.filter(e => !ESCALONES[e]).map(e => `${m.id}: ${e}`));
  // Assert
  assert.deepEqual(malos, []);
});

test("inicio del bus siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicio(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
