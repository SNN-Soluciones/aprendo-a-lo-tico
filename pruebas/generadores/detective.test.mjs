import { test } from "node:test";
import assert from "node:assert/strict";
import { CASOS, ETAPAS, DIFICULTADES, PASOS, revisarCaso, casoAlAzar, casoDelPaso, libretaAlAzar } from "../../public/js/detective.js";
import { azar, SEMILLA, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 80;
const enRango = (n, [a, b]) => n >= a && n <= b;

// El chequeo del README: CASOS.forEach(c => revisarCaso(c)) da [] cuando el caso está bien
noVacio(CASOS, "CASOS").forEach(caso => {
  test(`el caso «${caso.id}» del jaguar detective tiene una sola respuesta y ninguna pista sobra (salvo la trampa)`, () => {
    // Act
    const problemas = revisarCaso(caso);
    // Assert
    assert.deepEqual(problemas, []);
  });
});

test("los casos escritos a mano tienen ids únicos y una etapa que existe", () => {
  // Arrange
  const etapas = new Set(ETAPAS.map(e => e.id));
  // Act
  const ids = CASOS.map(c => c.id);
  const sinEtapa = CASOS.filter(c => !etapas.has(c.etapa)).map(c => c.id);
  // Assert
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(sinEtapa, []);
});

test("revisarCaso detecta un caso de sospechosos con el culpable equivocado", () => {
  // Arrange
  const bueno = CASOS.find(c => c.tipo === "sospechosos");
  const otro = bueno.sospechosos.find(id => id !== bueno.culpable);
  const malo = { ...bueno, culpable: otro };
  // Act
  const problemas = revisarCaso(malo);
  // Assert
  assert.ok(problemas.some(p => p.startsWith("quedan")), problemas.join("; "));
});

noVacio(DIFICULTADES, "DIFICULTADES").forEach((d, i) => {
  test(`los casos al azar «${d.nombre}» tienen una sola respuesta y los sospechosos y pistas de su dificultad`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => casoAlAzar(d.id, rnd), c => [
      ...revisarCaso(c),
      ...(enRango(c.sospechosos.length, d.sospechosos) ? [] : [`${c.sospechosos.length} sospechosos`]),
      ...(enRango(c.pistas.length, d.pistas) ? [] : [`${c.pistas.length} pistas`]),
      ...(d.no ? [] : c.pistas.filter(p => /^No /.test(p.txt)).map(p => `pista con NO en ${d.id}: ${p.txt}`)),
    ]);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

noVacio(PASOS, "PASOS").forEach((paso, i) => {
  test(`el paso ${i + 1} de la escalera del detective arma casos con una sola respuesta y del tamaño del paso`, () => {
    // Arrange
    const semilla = SEMILLA + 10 + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => casoDelPaso(i, rnd), c => [
      ...revisarCaso(c),
      ...(c.tipo === "sospechosos" && !enRango(c.sospechosos.length, paso.sospechosos) ? [`${c.sospechosos.length} sospechosos`] : []),
      ...(c.tipo === "sospechosos" && !enRango(c.pistas.length, paso.pistas) ? [`${c.pistas.length} pistas`] : []),
      ...(c.paso === i ? [] : [`dice que es del paso ${c.paso}`]),
    ]);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("las libretas al azar tienen una sola solución, al menos 2 pistas y ninguna de sobra", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const problemas = problemasDe(VUELTAS, () => libretaAlAzar(rnd), c => [
    ...revisarCaso(c),
    ...(c.pistas.length >= 2 ? [] : [`${c.pistas.length} pistas`]),
  ]);
  // Assert
  assert.deepEqual(problemas, [], `semilla ${SEMILLA}`);
});
