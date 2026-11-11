import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES_NIM, ganadora, pistaNim, aplicar, revisarEstrategia } from "../../public/js/estrategia.js";
import { azar, SEMILLA } from "./_azar.mjs";

// El revisor trae 300 vueltas por defecto (unos 2 s); con 120 dura menos de 1 s y prueba lo mismo
const VUELTAS = 120;

test("mangos y cuatro en línea: el jaguar perfecto nunca pierde ganando, la pista es segura y el jaguar gana y tapa cuando debe", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const problemas = revisarEstrategia(rnd, VUELTAS);
  // Assert
  assert.deepEqual(problemas, [], `semilla ${SEMILLA}`);
});

test("con una fila y «el último gana», se pierde justo cuando los mangos son múltiplo de (máximo + 1)", () => {
  // Arrange
  const mal = [];
  // Act
  for (const max of [2, 3]) for (let n = 1; n <= 20; n++) {
    const esperado = n % (max + 1) !== 0;
    if (ganadora({ filas: [n], max, ultimaGana: true }) !== esperado) mal.push(`${n} mangos, quitar hasta ${max}`);
  }
  // Assert
  assert.deepEqual(mal, []);
});

test("con una fila y «el último pierde», se pierde cuando quedan 1 más un múltiplo de (máximo + 1)", () => {
  // Arrange
  const mal = [];
  // Act
  for (const max of [2, 3]) for (let n = 1; n <= 20; n++) {
    const esperado = n % (max + 1) !== 1;
    if (ganadora({ filas: [n], max, ultimaGana: false }) !== esperado) mal.push(`${n} mangos, quitar hasta ${max}`);
  }
  // Assert
  assert.deepEqual(mal, []);
});

test("con dos filas y sin máximo, se pierde justo cuando las filas son iguales (el truco del espejo)", () => {
  // Arrange
  const mal = [];
  // Act
  for (let a = 0; a <= 8; a++) for (let b = 0; b <= 8; b++) {
    if (a + b === 0) continue;
    if (ganadora({ filas: [a, b], max: 0, ultimaGana: true }) !== (a !== b)) mal.push(`${a} y ${b}`);
  }
  // Assert
  assert.deepEqual(mal, []);
});

test("desde una posición ganadora de cada escalón, la pista de los mangos deja al otro en posición perdedora", () => {
  // Arrange
  const mal = [];
  // Act
  ESCALONES_NIM.forEach((e, i) => {
    const pos = { filas: e.filas.map(([a]) => a), max: e.max, ultimaGana: e.ultimaGana };
    if (!ganadora(pos)) return;
    const p = pistaNim(pos);
    if (!p.segura || ganadora(aplicar(pos, p.movida))) mal.push(`escalón ${i + 1}: ${pos.filas}`);
  });
  // Assert
  assert.deepEqual(mal, []);
});
