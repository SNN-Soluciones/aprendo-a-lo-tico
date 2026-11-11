import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, MAX_CASILLAS, ronda, revisarRonda } from "../../public/js/patrones.js";
import { azar, SEMILLA, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`patrones, escalón ${i + 1} (${escalon.patrones.join("/")}, ${escalon.modo}): la tira sigue la unidad, cabe en ${MAX_CASILLAS} casillas y las respuestas están entre las opciones`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => ronda(escalon, rnd), r => revisarRonda(r, escalon));
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarRonda de patrones detecta una respuesta que no sigue el patrón", () => {
  // Arrange: en AB (2 opciones) se cambia la respuesta por la otra opción
  const escalon = ESCALONES[0];
  const buena = ronda(escalon, azar(SEMILLA));
  const otra = buena.opciones.find(o => o.id !== buena.respuestas[0].id);
  const mala = { ...buena, respuestas: [otra] };
  // Act
  const problemas = revisarRonda(mala, escalon);
  // Assert
  assert.deepEqual(revisarRonda(buena, escalon), []);
  assert.ok(problemas.some(p => p.includes("no sigue el patrón")), problemas.join("; "));
});
