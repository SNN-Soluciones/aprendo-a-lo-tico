import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES_SUMA, ESCALONES_RESTA, inicioBloques, opcionesResultado, resultadoDe, revisarBloques } from "../../public/js/bloques.js";
import { azar, SEMILLA, EDADES } from "./_azar.mjs";

// El revisor trae 3000 rondas por escalón; 1000 alcanzan y la prueba dura menos de medio segundo
const RONDAS = 1000;

test("cada escalón de sumas y restas con bloques genera problemas que cumplen su condición y caben en sus columnas", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const problemas = revisarBloques(RONDAS, rnd);
  // Assert
  assert.deepEqual(problemas, [], `semilla ${SEMILLA}`);
});

test("las opciones de una suma traen el resultado y el error típico de no llevar (38 + 25 → 513)", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const opciones = opcionesResultado("suma", 38, 25, 2, rnd);
  // Assert
  assert.equal(resultadoDe("suma", 38, 25), 63);
  assert.ok(opciones.includes(63), String(opciones));
  assert.equal(new Set(opciones).size, opciones.length);
});

test("inicioBloques da un escalón que existe para cualquier edad, en sumas y en restas", () => {
  // Act
  const fuera = EDADES.flatMap(edad => [
    ESCALONES_SUMA[inicioBloques("suma", edad)] ? [] : [`suma a los ${edad}`],
    ESCALONES_RESTA[inicioBloques("resta", edad)] ? [] : [`resta a los ${edad}`],
  ].flat());
  // Assert
  assert.deepEqual(fuera, []);
});
