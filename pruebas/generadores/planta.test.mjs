import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, MODOS, PARTES, COMIDAS, ronda, inicio, correcta, revisarPlanta } from "../../public/js/planta.js";
import { azar, SEMILLA, EDADES, problemasDe } from "./_azar.mjs";

test("la planta: cada escalón pregunta lo que dice, con la correcta una sola vez y las opciones que corresponden", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const problemas = revisarPlanta(500, rnd);
  // Assert
  assert.deepEqual(problemas, [], `semilla ${SEMILLA}`);
});

MODOS.filter(m => m.preguntas > 0).forEach((modo, i) => {
  test(`la planta, modo «${modo.id}»: la ronda trae ${modo.preguntas} preguntas y la correcta está entre las opciones`, () => {
    // Arrange
    const semilla = SEMILLA + 100 + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(100, () => ronda(modo.id, rnd), qs => [
      ...(qs.length === modo.preguntas ? [] : [`${qs.length} preguntas`]),
      ...qs.filter(q => q.ops && !q.ops.includes(correcta(q))).map(q => `la correcta no está: ${JSON.stringify(q)}`),
      ...qs.filter(q => q.ops && new Set(q.ops).size !== q.ops.length).map(q => `opciones repetidas: ${q.ops}`),
    ]);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("en «¿Qué parte comemos?» de la planta sale una comida de cada parte de la planta", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const faltan = new Set();
  for (let k = 0; k < 100; k++) {
    const partes = new Set(ronda("comemos", rnd).map(q => q.parte));
    for (const p of PARTES) if (!partes.has(p.id)) faltan.add(p.id);
  }
  // Assert
  assert.deepEqual([...faltan], []);
  assert.ok(COMIDAS.every(c => PARTES.some(p => p.id === c.parte)));
});

test("inicio de la planta siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicio(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
