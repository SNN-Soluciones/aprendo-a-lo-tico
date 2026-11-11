import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, JUEGO, pregunta, inicio, revisarPregunta, revisarEfemerides } from "../../public/js/efemerides.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

test("Efemérides: fechas bien escritas y cada pregunta con la correcta una sola vez entre opciones distintas", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const problemas = revisarEfemerides(VUELTAS, rnd);
  // Assert
  assert.deepEqual(problemas, [], `semilla ${SEMILLA}`);
});

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`efemérides, ${etiqueta(i, escalon)}: pregunta() da preguntas que pasan la revisión`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS / 4, () => pregunta(i, rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

noVacio(JUEGO.modos, "JUEGO.modos").forEach((modo, i) => {
  test(`efemérides, modo a mano «${modo.id}»: cada pregunta de la ronda pasa la revisión`, () => {
    // Arrange
    const semilla = SEMILLA + 100 + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(30, () => modo.preguntas(rnd), ronda => ronda.flatMap(revisarPregunta));
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarPregunta de efemérides detecta una correcta que no está entre las opciones", () => {
  // Arrange
  const buena = pregunta(0, azar(SEMILLA));
  const mala = { ...buena, correcta: "ninguna" };
  // Act
  const problemas = revisarPregunta(mala);
  // Assert
  assert.deepEqual(revisarPregunta(buena), []);
  assert.ok(problemas.some(p => p.startsWith("la correcta no está")), problemas.join("; "));
});

test("inicio de efemérides siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicio(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
