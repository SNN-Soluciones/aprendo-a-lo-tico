import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, generar, inicioPorEdad, revisarPregunta } from "../../public/js/graficos.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`gráficos, ${etiqueta(i, escalon)}: cada pregunta tiene una sola respuesta y el gráfico cabe en su eje`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => generar(i, rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarPregunta de gráficos detecta una correcta que no está entre las opciones", () => {
  // Arrange: el primer escalón es «Pictograma: ¿cuál tiene más?», de opciones
  const buena = generar(0, azar(SEMILLA));
  const mala = { ...buena, correcta: "99" };
  // Act
  const problemas = revisarPregunta(mala);
  // Assert
  assert.equal(buena.forma, "opciones");
  assert.deepEqual(revisarPregunta(buena), []);
  assert.ok(problemas.includes("la correcta no está en las opciones"), problemas.join("; "));
});

test("inicioPorEdad de gráficos siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicioPorEdad(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
