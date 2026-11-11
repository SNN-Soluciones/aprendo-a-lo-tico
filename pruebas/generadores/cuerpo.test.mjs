import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, TEMAS, generar, inicio, revisarPregunta } from "../../public/js/cuerpo.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 300;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`cuerpo humano, ${etiqueta(i, escalon)}: cada pregunta trae la correcta, partes que están en el dibujo y el porqué de las malas`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => generar(escalon.tipos, rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

noVacio(TEMAS, "TEMAS").forEach((tema, i) => {
  test(`cuerpo humano, tema a mano «${tema.id}»: las preguntas pasan la revisión`, () => {
    // Arrange
    const semilla = SEMILLA + 100 + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => generar(tema.tipos, rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarPregunta del cuerpo detecta una correcta que no está entre las opciones", () => {
  // Arrange: «Los sentidos» es de opciones (¿con qué olemos?)
  const buena = generar(ESCALONES[1].tipos, azar(SEMILLA));
  const mala = { ...buena, correcta: "cola" };
  // Act
  const problemas = revisarPregunta(mala);
  // Assert
  assert.equal(buena.tipo, "opciones");
  assert.deepEqual(revisarPregunta(buena), []);
  assert.ok(problemas.includes("la correcta no está"), problemas.join("; "));
});

test("inicio del cuerpo humano siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicio(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
