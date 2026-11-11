import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { MATERIAS, GRADOS, JUEGOS } from "../../public/js/catalog.js";

const PUBLIC = fileURLToPath(new URL("../../public/", import.meta.url));
const LEER = ["no", "poco", "si"];

test("el catálogo tiene juegos y cada id de juego es único", () => {
  // Act
  const ids = JUEGOS.map(j => j.id);
  const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
  // Assert
  assert.ok(JUEGOS.length > 0);
  assert.deepEqual(repetidos, []);
});

test("la url de cada juego del catálogo existe como archivo en public/", () => {
  // Act
  const faltan = JUEGOS.filter(j => !j.url || !existsSync(PUBLIC + j.url.split(/[?#]/)[0])).map(j => `${j.id}: ${j.url}`);
  // Assert
  assert.deepEqual(faltan, []);
});

test("cada juego del catálogo es de una materia que existe en MATERIAS", () => {
  // Arrange
  const materias = new Set(MATERIAS.map(m => m.id));
  // Act
  const raros = JUEGOS.filter(j => !materias.has(j.materia)).map(j => `${j.id}: ${j.materia}`);
  // Assert
  assert.deepEqual(raros, []);
});

test("los grados de cada juego del catálogo son enteros entre 0 (prepa) y 6", () => {
  // Arrange
  const grados = new Set(GRADOS.map(g => g.id));
  // Act
  const raros = JUEGOS
    .filter(j => !Array.isArray(j.grados) || !j.grados.length || j.grados.some(g => !Number.isInteger(g) || g < 0 || g > 6 || !grados.has(g)))
    .map(j => `${j.id}: ${JSON.stringify(j.grados)}`);
  // Assert
  assert.deepEqual(raros, []);
});

test("«leer» de cada juego del catálogo es «no», «poco» o «si», o no viene", () => {
  // Act
  const raros = JUEGOS.filter(j => j.leer !== undefined && !LEER.includes(j.leer)).map(j => `${j.id}: ${j.leer}`);
  // Assert
  assert.deepEqual(raros, []);
});

test("la edad de cada juego del catálogo, cuando viene, es [desde, hasta] con desde ≤ hasta", () => {
  // Act
  const raras = JUEGOS
    .filter(j => j.edad !== undefined)
    .filter(j => !Array.isArray(j.edad) || j.edad.length !== 2 || !j.edad.every(Number.isInteger) || j.edad[0] > j.edad[1])
    .map(j => `${j.id}: ${JSON.stringify(j.edad)}`);
  // Assert
  assert.deepEqual(raras, []);
});

test("las materias y los grados del catálogo tienen ids únicos", () => {
  // Act / Assert
  assert.equal(new Set(MATERIAS.map(m => m.id)).size, MATERIAS.length);
  assert.deepEqual(GRADOS.map(g => g.id), [0, 1, 2, 3, 4, 5, 6]);
});
