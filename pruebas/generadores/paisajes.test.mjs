import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, MANUAL, ronda, inicioPorEdad, revisarDatos, revisarRonda } from "../../public/js/paisajes.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

test("los datos de paisajes calzan con el mapa: cada lugar en su provincia, golfos en el mar y ríos en tierra", () => {
  // Act
  const problemas = revisarDatos();
  // Assert
  assert.deepEqual(problemas, []);
});

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`paisajes, ${etiqueta(i, escalon)}: cada ronda tiene una sola respuesta, opciones distintas y blancos separados`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => ronda(i, rnd), revisarRonda);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarRonda de paisajes detecta una ronda de tocar cuya meta no está entre los blancos", () => {
  // Arrange: «Volcanes famosos» es de tocar en el mapa
  const buena = ronda(0, azar(SEMILLA));
  const mala = { ...buena, blancos: buena.blancos.filter(b => b !== buena.meta) };
  // Act
  const problemas = revisarRonda(mala);
  // Assert
  assert.equal(buena.tipo, "tocar");
  assert.deepEqual(revisarRonda(buena), []);
  assert.ok(problemas.includes("la meta no está entre los blancos"), problemas.join("; "));
});

test("los botones a mano de paisajes apuntan a escalones que existen y el inicio también", () => {
  // Act
  const malos = Object.entries(MANUAL).flatMap(([id, es]) => es.filter(e => !ESCALONES[e]).map(e => `${id}: ${e}`));
  const fuera = EDADES.filter(edad => !ESCALONES[inicioPorEdad(edad)]);
  // Assert
  assert.deepEqual(malos, []);
  assert.deepEqual(fuera, []);
});
