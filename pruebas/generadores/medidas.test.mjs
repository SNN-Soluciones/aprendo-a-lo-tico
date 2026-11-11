import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, GRUPOS, pregunta, inicioPorEdad, revisarPregunta, revisarMedidas } from "../../public/js/medidas.js";
import { azar, SEMILLA, EDADES } from "./_azar.mjs";

// revisarMedidas trae 3000 preguntas por escalón (unos 1,6 s); 500 por escalón dura menos de 0,3 s
const VUELTAS = 500;

test("medidas: cada escalón da preguntas con la correcta, decimales con coma, la voz sin abreviaturas y el examen de 2° a 6° bien armado", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const problemas = revisarMedidas(VUELTAS, rnd);
  // Assert
  assert.deepEqual(problemas, [], `semilla ${SEMILLA}`);
});

test("revisarPregunta de medidas detecta una respuesta escrita que no se acepta", () => {
  // Arrange: la primera pregunta para escribir de algún escalón, con otra respuesta
  const rnd = azar(SEMILLA);
  let buena;
  for (let i = 0; !buena && i < ESCALONES.length; i++) {
    for (let k = 0; k < 20 && !buena; k++) { const p = pregunta(i, rnd); if (p.tipo === "escribir") buena = p; }
  }
  const mala = { ...buena, respuesta: -1 };
  // Act
  const problemas = revisarPregunta(mala);
  // Assert
  assert.ok(buena, "ningún escalón dio una pregunta para escribir");
  assert.deepEqual(revisarPregunta(buena), []);
  assert.ok(problemas.some(p => p.startsWith("respuesta rara")), problemas.join("; "));
});

test("los grupos de medidas apuntan a escalones que existen y el inicio también", () => {
  // Act
  const malos = GRUPOS.flatMap(g => g.escalones.filter(e => !ESCALONES[e]).map(e => `${g.id}: ${e}`));
  const fuera = EDADES.filter(edad => !ESCALONES[inicioPorEdad(edad)]);
  // Assert
  assert.deepEqual(malos, []);
  assert.deepEqual(fuera, []);
});
