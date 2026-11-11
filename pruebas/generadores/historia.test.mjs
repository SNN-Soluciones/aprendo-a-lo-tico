import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, MODOS, preguntaDeModo, inicioPorEdad, revisarPregunta } from "../../public/js/historia.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`historia, ${etiqueta(i, escalon)}: cada pregunta trae la correcta, opciones distintas y líneas del tiempo sin empates`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => escalon.gen(rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

noVacio(MODOS, "MODOS").forEach((modo, i) => {
  test(`historia, modo a mano «${modo.id}»: las preguntas pasan la revisión`, () => {
    // Arrange
    const semilla = SEMILLA + 100 + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS / 2, () => preguntaDeModo(modo, rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarPregunta de historia detecta una correcta que no está entre las opciones", () => {
  // Arrange: «Fechas patrias» es de opciones
  const buena = ESCALONES[2].gen(azar(SEMILLA));
  const mala = { ...buena, correcta: "ninguna" };
  // Act
  const problemas = revisarPregunta(mala);
  // Assert
  assert.equal(buena.tipo, "opciones");
  assert.deepEqual(revisarPregunta(buena), []);
  assert.ok(problemas.includes("la correcta no está"), problemas.join("; "));
});

test("inicioPorEdad de historia siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicioPorEdad(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
