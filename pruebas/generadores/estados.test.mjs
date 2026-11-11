import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, JUEGO, pregunta, inicio, revisarPregunta, revisarEstados } from "../../public/js/estados.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

test("Estados de la materia: cada escalón pide lo que dice, con la correcta entre opciones distintas", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const problemas = revisarEstados(VUELTAS, rnd);
  // Assert
  assert.deepEqual(problemas, [], `semilla ${SEMILLA}`);
});

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`estados de la materia, ${etiqueta(i, escalon)}: pregunta() da preguntas que pasan la revisión`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS / 4, () => pregunta(i, rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

noVacio(JUEGO.modos, "JUEGO.modos").forEach((modo, i) => {
  test(`estados de la materia, modo a mano «${modo.id}»: cada pregunta de la ronda pasa la revisión`, () => {
    // Arrange
    const semilla = SEMILLA + 100 + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(30, () => modo.preguntas(rnd), ronda => ronda.flatMap(revisarPregunta));
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarPregunta de estados de la materia detecta una correcta que no está entre las opciones", () => {
  // Arrange
  const buena = pregunta(0, azar(SEMILLA));
  const mala = { ...buena, correcta: "ninguna" };
  // Act
  const problemas = revisarPregunta(mala);
  // Assert
  assert.deepEqual(revisarPregunta(buena), []);
  assert.ok(problemas.some(p => p.startsWith("la correcta no está")), problemas.join("; "));
});

test("inicio de estados de la materia siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicio(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
