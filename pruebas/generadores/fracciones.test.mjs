import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, ronda, inicioPorEdad, mcd, mcm, revisarRonda } from "../../public/js/fracciones.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`fracciones, ${etiqueta(i, escalon)}: cada ronda tiene una sola opción con el valor correcto y las cuentas dan exacto`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => ronda(i, rnd), revisarRonda);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarRonda de fracciones detecta una correcta que no está entre las opciones", () => {
  // Arrange: «¿Qué fracción está pintada?» es de opciones
  const buena = ronda(1, azar(SEMILLA));
  const mala = { ...buena, correcta: "9-9" };
  // Act
  const problemas = revisarRonda(mala);
  // Assert
  assert.deepEqual(revisarRonda(buena), []);
  assert.ok(problemas.includes("la correcta no está una vez"), problemas.join("; "));
});

test("mcd y mcm de fracciones dan lo que dice la tabla", () => {
  // Act / Assert
  assert.equal(mcd(12, 18), 6);
  assert.equal(mcd(7, 5), 1);
  assert.equal(mcm(4, 6), 12);
  assert.equal(mcm(3, 5), 15);
});

test("inicioPorEdad de fracciones siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicioPorEdad(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
