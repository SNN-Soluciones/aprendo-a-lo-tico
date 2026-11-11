import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, ronda, inicioPorEdad, revisarRonda, revisarLeo } from "../../public/js/leo.js";
import { azar, SEMILLA, EDADES } from "./_azar.mjs";

// revisarLeo trae 3000 rondas por escalón (unos 2 s); 400 alcanzan para pasar por todos los tipos
const VUELTAS = 400;

test("«Leo solito»: los datos y las rondas de cada escalón solo usan sílabas ya vistas y tienen una sola respuesta", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const problemas = revisarLeo(VUELTAS, rnd);
  // Assert
  assert.deepEqual(problemas, [], `semilla ${SEMILLA}`);
});

test("revisarRonda de «Leo solito» detecta una respuesta que no está entre las opciones", () => {
  // Arrange
  const buena = ronda(0, azar(SEMILLA));
  const mala = { ...buena, opciones: buena.opciones.filter(o => o.id !== buena.meta) };
  // Act
  const problemas = revisarRonda(mala);
  // Assert
  assert.deepEqual(revisarRonda(buena), []);
  assert.ok(problemas.includes("la respuesta no está entre las opciones"), problemas.join("; "));
});

test("inicioPorEdad de «Leo solito» siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicioPorEdad(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
