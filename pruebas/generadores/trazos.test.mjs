import { test } from "node:test";
import assert from "node:assert/strict";
import { CARACTERES, trazosDe, revisarTrazos } from "../../public/js/trazos.js";

test("los trazos de las 76 letras, números y marcas caben en la caja, no brincan y van en el orden de escritura", () => {
  // Act
  const problemas = revisarTrazos();
  // Assert
  assert.equal(CARACTERES.length, 76);
  assert.deepEqual(problemas, []);
});

test("cada caracter de la lista tiene al menos un trazo con puntos", () => {
  // Act
  const vacios = CARACTERES.filter(ch => !trazosDe(ch).length || trazosDe(ch).some(t => !t.length));
  // Assert
  assert.deepEqual(vacios, []);
});

test("revisarTrazos avisa cuando un caracter no tiene trazos", () => {
  // Act
  const problemas = revisarTrazos(["☃"]);
  // Assert
  assert.ok(problemas.includes("«☃» no tiene trazos"), problemas.join("; "));
});
