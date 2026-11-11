import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, pregunta, revisarDatos, revisarPregunta } from "../../public/js/cadenas.js";
import { azar, SEMILLA, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

test("las cadenas y redes alimenticias calzan con lo que come cada animal", () => {
  // Act
  const problemas = revisarDatos();
  // Assert
  assert.deepEqual(problemas, []);
});

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`cadenas, ${etiqueta(i, escalon)}: cada pregunta trae la correcta una sola vez y las piezas completas`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => pregunta(i, rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarPregunta de cadenas detecta una correcta que no está entre las opciones", () => {
  // Arrange: el primer escalón es «¿herbívoro o carnívoro?», de opciones
  const buena = pregunta(0, azar(SEMILLA));
  const mala = { ...buena, correcta: "nadie" };
  // Act
  const problemas = revisarPregunta(mala);
  // Assert
  assert.equal(buena.tipo, "opciones");
  assert.deepEqual(revisarPregunta(buena), []);
  assert.ok(problemas.includes("la correcta no está una vez"), problemas.join("; "));
});
