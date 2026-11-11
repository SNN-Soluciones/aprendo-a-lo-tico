import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, ronda, inicioPorEdad, revisarRonda, revisarGeometria } from "../../public/js/geometria.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 300;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`geometría, ${etiqueta(i, escalon)}: cada ronda dibuja lo que pregunta y trae la respuesta una sola vez`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => ronda(i, rnd), revisarRonda);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("la revisión completa de geometría (rondas de cada escalón y examen de 1° a 6°) no encuentra problemas", () => {
  // Arrange: revisarGeometria recibe la semilla; trae 2000 rondas por defecto y con 400 dura menos de 1 s
  // Act
  const problemas = revisarGeometria(400, SEMILLA);
  // Assert
  assert.deepEqual(problemas, [], `semilla ${SEMILLA}`);
});

test("revisarRonda de geometría detecta una respuesta que no está entre las opciones", () => {
  // Arrange: la primera ronda de opciones de «Más figuras»
  const rnd = azar(SEMILLA);
  let buena = ronda(1, rnd);
  for (let k = 0; k < 50 && buena.tipo !== "opciones"; k++) buena = ronda(1, rnd);
  const mala = { ...buena, respuesta: "dodecaedro" };
  // Act
  const problemas = revisarRonda(mala);
  // Assert
  assert.equal(buena.tipo, "opciones");
  assert.deepEqual(revisarRonda(buena), []);
  assert.ok(problemas.includes("la respuesta no está en las opciones"), problemas.join("; "));
});

test("inicioPorEdad de geometría siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicioPorEdad(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
