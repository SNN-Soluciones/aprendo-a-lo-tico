import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, MODOS, ronda, inicio, revisarDatos, revisarRonda } from "../../public/js/emociones.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

test("los datos de emociones están completos: cada emoción tiene situaciones y las parecidas existen", () => {
  // Act
  const problemas = revisarDatos();
  // Assert
  assert.deepEqual(problemas, []);
});

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`emociones, ${etiqueta(i, escalon)}: cada ronda tiene una sola respuesta, entre las opciones, y concuerda con niño o niña`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    let clave = "";
    // Act
    const problemas = problemasDe(VUELTAS, () => {
      const r = ronda(i, rnd, clave);
      clave = r.clave;
      return r;
    }, revisarRonda);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarRonda de emociones detecta una respuesta que no está entre las opciones", () => {
  // Arrange
  const buena = ronda(0, azar(SEMILLA));
  const mala = { ...buena, opciones: buena.opciones.filter(o => o.id !== buena.meta) };
  // Act
  const problemas = revisarRonda(mala);
  // Assert
  assert.deepEqual(revisarRonda(buena), []);
  assert.ok(problemas.includes("la respuesta no está entre las opciones"), problemas.join("; "));
});

test("los modos de emociones apuntan a escalones que existen y el inicio también", () => {
  // Act
  const malos = Object.entries(MODOS).flatMap(([id, es]) => es.filter(e => !ESCALONES[e]).map(e => `${id}: ${e}`));
  const fuera = EDADES.filter(edad => !ESCALONES[inicio(edad)]);
  // Assert
  assert.deepEqual(malos, []);
  assert.deepEqual(fuera, []);
});
