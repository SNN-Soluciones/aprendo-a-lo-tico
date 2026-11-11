import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, ronda, opcionesDe, revisarRonda } from "../../public/js/palabras.js";
import { azar, SEMILLA, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`clases de palabras, ${etiqueta(i, escalon)}: cada ronda tiene una sola respuesta y oraciones con un solo verbo`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => ronda(i, rnd), r => [
      ...revisarRonda(r),
      // Para la escalera: se puede escoger entre 2 o más cosas (0 cuando hay que tocar todas)
      ...((r.todos ? opcionesDe(r) === 0 : opcionesDe(r) >= 2) ? [] : [`opcionesDe da ${opcionesDe(r)} en una ronda ${r.tipo}`]),
    ]);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarRonda de clases de palabras detecta una canasta correcta que no está entre las canastas", () => {
  // Arrange: «Sustantivo o verbo» es de canastas
  const buena = ronda(0, azar(SEMILLA));
  const mala = { ...buena, canastas: buena.canastas.filter(c => c !== buena.correcta) };
  // Act
  const problemas = revisarRonda(mala);
  // Assert
  assert.equal(buena.tipo, "canasta");
  assert.deepEqual(revisarRonda(buena), []);
  assert.ok(problemas.includes("la correcta no está en las canastas"), problemas.join("; "));
});
