import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, ronda, rectCeldas, inicioPorEdad, revisarPintado, revisarRonda } from "../../public/js/area.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`área y perímetro, ${etiqueta(i, escalon)}: cada ronda trae la respuesta bien calculada y cabe en su cuadrícula`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => ronda(i, rnd), revisarRonda);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarRonda de área detecta una respuesta mal calculada", () => {
  // Arrange: «Área en la cuadrícula» con la respuesta corrida en 1
  const i = ESCALONES.findIndex(e => e.id === "escribir-area");
  const buena = ronda(i, azar(SEMILLA));
  const mala = { ...buena, respuesta: buena.respuesta + 1 };
  // Act
  const problemas = revisarRonda(mala);
  // Assert
  assert.deepEqual(revisarRonda(buena), []);
  assert.ok(problemas.some(p => p.startsWith("respuesta")), problemas.join("; "));
});

test("revisarPintado acepta un corral de 3 × 2 cuando se piden 6 m² y 10 m de cerca", () => {
  // Arrange
  const celdas = rectCeldas(0, 0, 3, 2);
  // Act
  const r = revisarPintado(celdas, { area: 6, perimetro: 10 });
  // Assert
  assert.deepEqual(r, { ok: true, area: 6, perimetro: 10, junto: true });
});

test("revisarPintado no acepta el área correcta con otra cerca (una fila de 6 tiene 14 m de cerca)", () => {
  // Arrange
  const celdas = rectCeldas(0, 0, 6, 1);
  // Act
  const conCerca = revisarPintado(celdas, { area: 6, perimetro: 10 });
  const soloArea = revisarPintado(celdas, { area: 6 });
  // Assert
  assert.equal(conCerca.ok, false);
  assert.equal(conCerca.perimetro, 14);
  assert.equal(soloArea.ok, true);
});

test("revisarPintado no acepta cuadritos sueltos aunque sumen el área", () => {
  // Arrange
  const celdas = [[0, 0], [2, 0]];
  // Act
  const r = revisarPintado(celdas, { area: 2 });
  // Assert
  assert.equal(r.ok, false);
  assert.equal(r.junto, false);
});

test("inicioPorEdad de área siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicioPorEdad(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
