import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, TEMAS, generar, inicio, revisarDatos, revisarPregunta } from "../../public/js/espacio.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 300;

test("los datos del espacio están bien: los planetas en orden, rocosos y gaseosos, y cada dato con dos malas", () => {
  // Act
  const problemas = revisarDatos();
  // Assert
  assert.deepEqual(problemas, []);
});

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`espacio, ${etiqueta(i, escalon)}: cada pregunta trae la correcta, lo tocable está en el dibujo y los planetas van en orden`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => generar(escalon.tipos, rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

noVacio(TEMAS, "TEMAS").forEach((tema, i) => {
  test(`espacio, tema a mano «${tema.id}»: las preguntas pasan la revisión`, () => {
    // Arrange
    const semilla = SEMILLA + 100 + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => generar(tema.tipos, rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarPregunta del espacio detecta una correcta que no está entre las opciones", () => {
  // Arrange: «Rocosos y gaseosos» es de opciones
  const buena = generar(ESCALONES[4].tipos, azar(SEMILLA));
  const mala = { ...buena, correcta: "pluton" };
  // Act
  const problemas = revisarPregunta(mala);
  // Assert
  assert.equal(buena.tipo, "opciones");
  assert.deepEqual(revisarPregunta(buena), []);
  assert.ok(problemas.includes("la correcta no está"), problemas.join("; "));
});

test("inicio del espacio siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicio(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
