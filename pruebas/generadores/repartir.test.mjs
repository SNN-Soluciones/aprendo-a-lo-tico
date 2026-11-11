import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, MANUAL, ronda, sobran, revisarRonda } from "../../public/js/repartir.js";
import { azar, SEMILLA, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`repartir, ${etiqueta(i, escalon)}: cada ronda cumple n = d × q + r, con el residuo y las opciones que pide el escalón`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    let anterior = null;
    // Act
    const problemas = problemasDe(VUELTAS, () => {
      const x = ronda(escalon, rnd, anterior);
      anterior = x;
      return x;
    }, x => revisarRonda(x, escalon));
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("ronda de repartir no repite seguido el mismo total con el mismo divisor", () => {
  // Arrange
  const escalon = ESCALONES[ESCALONES.length - 1], rnd = azar(SEMILLA);
  let anterior = ronda(escalon, rnd);
  const repetidas = [];
  // Act
  for (let k = 0; k < 300; k++) {
    const x = ronda(escalon, rnd, anterior);
    if (x.n === anterior.n && x.d === anterior.d) repetidas.push(`${x.n} ÷ ${x.d}`);
    anterior = x;
  }
  // Assert
  assert.deepEqual(repetidas, []);
});

test("revisarRonda de repartir detecta un residuo que no cuadra con la división", () => {
  // Arrange
  const escalon = ESCALONES[0];
  const buena = ronda(escalon, azar(SEMILLA));
  const mala = { ...buena, r: buena.r + 1 };
  // Act
  const problemas = revisarRonda(mala, escalon);
  // Assert
  assert.deepEqual(revisarRonda(buena, escalon), []);
  assert.ok(problemas.some(p => p.includes("≠")), problemas.join("; "));
});

test("sobran dice «sobra 1» y «sobran 3»", () => {
  // Act / Assert
  assert.equal(sobran(1), "sobra 1");
  assert.equal(sobran(3), "sobran 3");
});

test("los botones a mano de repartir apuntan a escalones que existen", () => {
  // Act
  const malos = Object.entries(MANUAL).flatMap(([id, es]) => es.filter(e => !ESCALONES[e]).map(e => `${id}: ${e}`));
  // Assert
  assert.deepEqual(malos, []);
});
