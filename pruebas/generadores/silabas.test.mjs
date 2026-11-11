import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, ronda, inicioPorEdad, revisarPalabras, revisarRonda } from "../../public/js/silabas.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

test("las palabras y oraciones de sílabas usan solo sílabas directas, letras que se enseñan y dibujos sin repetir", () => {
  // Act
  const problemas = revisarPalabras();
  // Assert
  assert.deepEqual(problemas, []);
});

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`sílabas, ${etiqueta(i, escalon)}: cada ronda trae la respuesta entre las opciones y sílabas del grupo del escalón`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    let antes = "";
    // Act
    const problemas = problemasDe(VUELTAS, () => {
      const r = ronda(i, rnd, antes);
      antes = r.clave;
      return r;
    }, revisarRonda);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("ronda de sílabas no repite seguido la misma meta cuando hay de dónde escoger", () => {
  // Arrange: «ma me mi mo mu» tiene cinco sílabas para escoger
  const i = 2, rnd = azar(SEMILLA);
  let antes = ronda(i, rnd).clave;
  const repetidas = [];
  // Act
  for (let k = 0; k < 300; k++) {
    const r = ronda(i, rnd, antes);
    if (r.clave === antes) repetidas.push(r.clave);
    antes = r.clave;
  }
  // Assert
  assert.deepEqual(repetidas, []);
});

test("revisarRonda de sílabas detecta una respuesta que no está entre las opciones", () => {
  // Arrange: «Las vocales»: oír y tocar
  const buena = ronda(0, azar(SEMILLA));
  const mala = { ...buena, opciones: buena.opciones.filter(o => o !== buena.meta) };
  // Act
  const problemas = revisarRonda(mala);
  // Assert
  assert.deepEqual(revisarRonda(buena), []);
  assert.ok(problemas.includes("la respuesta no está entre las opciones"), problemas.join("; "));
});

test("inicioPorEdad de sílabas siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicioPorEdad(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
