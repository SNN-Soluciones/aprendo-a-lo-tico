import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, ronda, revisarRonda, revisarMarimba } from "../../public/js/marimba.js";
import { azar, SEMILLA, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 300;

test("la revisión completa de la marimba (escalones, ritmos con toques de niño y canciones) no encuentra problemas", () => {
  // Arrange: revisarMarimba usa su propia semilla fija (2024), así que se repite igual
  // Act
  const problemas = revisarMarimba(400);
  // Assert
  assert.deepEqual(problemas, []);
});

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`marimba, ${etiqueta(i, escalon)} (${escalon.modo}): con otra semilla, cada ronda es del modo del escalón y pasa la revisión`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    let anterior = "";
    // Act
    const problemas = problemasDe(VUELTAS, () => {
      const r = ronda(i, rnd, anterior);
      anterior = r.clave;
      return r;
    }, revisarRonda);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarRonda de la marimba detecta una melodía con una nota de más que no está en las teclas", () => {
  // Arrange: el primer escalón es de «Simón dice»
  const buena = ronda(0, azar(SEMILLA));
  const mala = { ...buena, melodia: [...buena.melodia, 99] };
  // Act
  const problemas = revisarRonda(mala);
  // Assert
  assert.equal(buena.modo, "simon");
  assert.deepEqual(revisarRonda(buena), []);
  assert.ok(problemas.some(p => p.startsWith("nota fuera de las teclas")), problemas.join("; "));
  assert.ok(problemas.some(p => p.startsWith("melodía de")), problemas.join("; "));
});
