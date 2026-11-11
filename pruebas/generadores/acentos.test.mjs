import { test } from "node:test";
import assert from "node:assert/strict";
import { PALABRAS, ESCALONES, ronda, revisarPalabras, revisarRonda } from "../../public/js/acentos.js";
import { azar, SEMILLA, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

test("las palabras de acentos están bien separadas, con la sílaba fuerte y la tilde que dicen las reglas", () => {
  // Arrange: la lista que trae el juego
  // Act
  const problemas = revisarPalabras();
  // Assert
  assert.deepEqual(problemas, []);
});

test("revisarPalabras avisa cuando una palabra viene repetida", () => {
  // Arrange
  const lista = [PALABRAS[0], { ...PALABRAS[0] }];
  // Act
  const problemas = revisarPalabras(lista);
  // Assert
  assert.ok(problemas.some(p => p.includes("repetida")), problemas.join("; "));
});

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`acentos, ${etiqueta(i, escalon)}: cada ronda trae una respuesta que calza con su palabra`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    let anterior = "";
    // Act
    const problemas = problemasDe(VUELTAS, () => {
      const r = ronda(escalon, rnd, anterior);
      anterior = r.p?.palabra ?? "";
      return r;
    }, revisarRonda);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarRonda de acentos detecta una respuesta que no está entre las opciones", () => {
  // Arrange: una ronda de «¿aguda, grave o esdrújula?» con la respuesta cambiada
  const clasificar = ESCALONES.find(e => e.tipo === "clasificar");
  const buena = ronda(clasificar, azar(SEMILLA));
  const mala = { ...buena, respuesta: "inventada" };
  // Act
  const problemas = revisarRonda(mala);
  // Assert
  assert.deepEqual(revisarRonda(buena), []);
  assert.ok(problemas.length > 0);
});
