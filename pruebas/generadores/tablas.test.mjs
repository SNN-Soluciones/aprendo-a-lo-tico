import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, preguntasTabla, preguntaMezcla, preguntasFilas, inicioTablas, respuestaDe, sumaRepetida, revisarTablas } from "../../public/js/tablas.js";
import { azar, SEMILLA, EDADES } from "./_azar.mjs";

test("tablas en la feria: cada escalón da preguntas del tipo y la tabla que dice, con la cuenta bien y sin repetir las últimas", () => {
  // Arrange: el revisor trae 3000 rondas por escalón y dura poco, así que se dejan
  const rnd = azar(SEMILLA);
  // Act
  const problemas = revisarTablas(3000, rnd);
  // Assert
  assert.deepEqual(problemas, [], `semilla ${SEMILLA}`);
});

test("preguntasTabla trae las 10 multiplicaciones de la tabla, cada una una vez", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const qs = preguntasTabla(7, rnd);
  // Assert
  assert.deepEqual(qs.map(q => q.b).sort((x, y) => x - y), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.ok(qs.every(q => q.a === 7 && q.r === 7 * q.b));
});

test("preguntaMezcla nunca repite seguida la misma multiplicación", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  let anterior = null;
  const repetidas = [];
  // Act
  for (let k = 0; k < 500; k++) {
    const q = preguntaMezcla([3, 4], anterior, rnd);
    if (anterior && q.a === anterior.a && q.b === anterior.b) repetidas.push(`${q.a} × ${q.b}`);
    if (q.a * q.b !== q.r) repetidas.push(`cuenta mal: ${q.a} × ${q.b} = ${q.r}`);
    anterior = q;
  }
  // Assert
  assert.deepEqual(repetidas, []);
});

test("preguntasFilas da productos chiquitos que se pueden contar (hasta 5 × 6), sin repetir", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const qs = preguntasFilas(rnd, 8);
  // Assert
  assert.equal(qs.length, 8);
  assert.equal(new Set(qs.map(q => `${q.a}x${q.b}`)).size, 8);
  assert.ok(qs.every(q => q.a >= 2 && q.a <= 5 && q.b >= 2 && q.b <= 6 && q.r === q.a * q.b));
});

test("respuestaDe pide el producto en «producto» y el factor que falta en «falta» y «division»", () => {
  // Act / Assert
  assert.equal(respuestaDe({ tipo: "producto", a: 3, b: 4, r: 12 }), 12);
  assert.equal(respuestaDe({ tipo: "falta", a: 3, b: 4, r: 12 }), 4);
  assert.equal(respuestaDe({ tipo: "division", a: 3, b: 4, r: 12 }), 4);
  assert.equal(sumaRepetida(3, 4), "4 + 4 + 4");
});

test("inicioTablas siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicioTablas(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
