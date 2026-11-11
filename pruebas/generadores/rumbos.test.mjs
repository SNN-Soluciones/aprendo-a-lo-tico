import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, GRUPOS, pregunta, inicioPorEdad, revisarPregunta } from "../../public/js/rumbos.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 300;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`rumbos, ${etiqueta(i, escalon)}: la respuesta calza con el mapa calculada por otro camino`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => pregunta(i, rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarPregunta de rumbos detecta un rumbo que no está en la rosa de 4 puntas", () => {
  // Arrange: «La rosa de los vientos» se contesta tocando la rosa (N, S, E, O)
  const buena = pregunta(0, azar(SEMILLA));
  const mala = { ...buena, respuesta: "NE" };
  // Act
  const problemas = revisarPregunta(mala);
  // Assert
  assert.equal(buena.responder, "rosa");
  assert.deepEqual(revisarPregunta(buena), []);
  assert.ok(problemas.some(p => p.includes("no está en la rosa")), problemas.join("; "));
});

test("cada escalón de rumbos es de un grupo que existe y el inicio da un escalón que existe", () => {
  // Arrange
  const grupos = new Set(GRUPOS.map(g => g.id));
  // Act
  const sinGrupo = ESCALONES.filter(e => !grupos.has(e.grupo)).map(e => e.id);
  const fuera = EDADES.filter(edad => !ESCALONES[inicioPorEdad(edad)]);
  // Assert
  assert.deepEqual(sinGrupo, []);
  assert.deepEqual(fuera, []);
});
