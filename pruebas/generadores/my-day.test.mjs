import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, MODOS, preguntaDeModo, inicioPorEdad, revisarPregunta } from "../../public/js/my-day.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 300;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`My day, ${etiqueta(i, escalon)}: cada pregunta tiene una sola opción que sirve y la voz bien armada en español e inglés`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => escalon.gen(rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

noVacio(MODOS, "MODOS").forEach((modo, i) => {
  test(`My day, modo a mano «${modo.id}»: las preguntas pasan la revisión`, () => {
    // Arrange
    const semilla = SEMILLA + 100 + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => preguntaDeModo(modo, rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarPregunta de My day detecta una correcta que no está entre las opciones", () => {
  // Arrange: el primer escalón es de opciones (Weather: escuchá y tocá)
  const buena = ESCALONES[0].gen(azar(SEMILLA));
  const mala = { ...buena, correcta: "snowy" };
  // Act
  const problemas = revisarPregunta(mala);
  // Assert
  assert.equal(buena.tipo, "opciones");
  assert.deepEqual(revisarPregunta(buena), []);
  assert.ok(problemas.includes("la correcta no está"), problemas.join("; "));
});

test("inicioPorEdad de My day siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicioPorEdad(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
