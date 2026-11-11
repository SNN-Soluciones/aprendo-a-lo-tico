import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, GRUPOS, pregunta, inicioPorEdad, bienEscrito, dec, revisarPregunta } from "../../public/js/porcentajes.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`decimales y porcentajes, ${etiqueta(i, escalon)}: cada pregunta trae la correcta y lo bien escrito se acepta con coma, punto o ₡`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => pregunta(i, rnd), revisarPregunta);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarPregunta de porcentajes detecta una correcta que no está entre las opciones", () => {
  // Arrange: «Décimas en la tira» es de opciones
  const buena = pregunta(0, azar(SEMILLA));
  const mala = { ...buena, correcta: "nada" };
  // Act
  const problemas = revisarPregunta(mala);
  // Assert
  assert.equal(buena.tipo, "opciones");
  assert.deepEqual(revisarPregunta(buena), []);
  assert.ok(problemas.includes("la correcta no está"), problemas.join("; "));
});

test("en las preguntas para escribir de porcentajes, una respuesta corrida en 1 no se da por buena", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  const mal = [];
  // Act
  ESCALONES.forEach((_, i) => {
    for (let k = 0; k < 40; k++) {
      const p = pregunta(i, rnd);
      if (p.tipo !== "escribir") continue;
      const otra = p.como === "decimal" ? dec(p.respuesta + 1) : String(p.respuesta + 1);
      if (bienEscrito(p, otra)) mal.push(`escalón ${i + 1}: acepta ${otra} en vez de ${p.respuesta}`);
    }
  });
  // Assert
  assert.deepEqual(mal, []);
});

test("los grupos de porcentajes apuntan a escalones que existen y el inicio también", () => {
  // Act
  const malos = GRUPOS.flatMap(g => g.escalones.filter(e => !ESCALONES[e]).map(e => `${g.id}: ${e}`));
  const fuera = EDADES.filter(edad => !ESCALONES[inicioPorEdad(edad)]);
  // Assert
  assert.deepEqual(malos, []);
  assert.deepEqual(fuera, []);
});
