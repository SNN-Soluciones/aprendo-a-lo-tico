import { test } from "node:test";
import assert from "node:assert/strict";
import { NIVELES, leer, ejecutar, minimo, caminoCorto, pista, nivelAlAzar } from "../../public/js/perezoso.js";
import { azar, SEMILLA, problemasDe, noVacio } from "./_azar.mjs";

// Lo que dicen los comentarios de NIVELES en perezoso.js: flechas del camino más corto
const MINIMOS = { derecho: 3, arriba: 3, vuelta: 6, arbol: 6, "dos-hojas": 4, laberinto: 6, rio: 8, "rio-arboles": 7,
  "tres-hojas": 8, zigzag: 10, "gran-reto": 12, bosque: 13, "cuatro-hojas": 16 };

/** Pasos del camino más corto por búsqueda a lo ancho, sin usar el código del juego (Infinity si no se puede). */
function minimoAparte(mapa) {
  const alto = mapa.length, ancho = mapa[0].length;
  let salida = null;
  const hojas = [];
  mapa.forEach((f, y) => [...f].forEach((c, x) => { if (c === "S") salida = [x, y]; if (c === "H") hojas.push(`${x},${y}`); }));
  const libre = (x, y) => x >= 0 && y >= 0 && x < ancho && y < alto && !"#~".includes(mapa[y][x]);
  const todas = (1 << hojas.length) - 1;
  const vistos = new Set([`${salida},0`]);
  let frente = [[...salida, 0]];
  for (let pasos = 0; frente.length; pasos++) {
    const sig = [];
    for (const [x, y, m] of frente) {
      if (m === todas) return pasos;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (!libre(nx, ny)) continue;
        const h = hojas.indexOf(`${nx},${ny}`), nm = h < 0 ? m : m | (1 << h);
        if (!vistos.has(`${nx},${ny},${nm}`)) { vistos.add(`${nx},${ny},${nm}`); sig.push([nx, ny, nm]); }
      }
    }
    frente = sig;
  }
  return Infinity;
}

noVacio(NIVELES, "NIVELES").forEach((nivel, i) => {
  test(`«Llevá al perezoso», nivel ${i + 1} «${nivel.id}»: caminoCorto existe, gana y tiene el mínimo de flechas`, () => {
    // Arrange
    const juego = leer(nivel);
    // Act
    const camino = caminoCorto(juego);
    // Assert
    assert.ok(camino, "no hay camino");
    assert.equal(ejecutar(juego, camino).resultado, "gano");
    assert.equal(camino.length, minimo(juego));
    assert.equal(minimo(juego), minimoAparte(nivel.mapa));
    if (MINIMOS[nivel.id] !== undefined) assert.equal(minimo(juego), MINIMOS[nivel.id], "no calza con el comentario del nivel");
  });
});

test("los niveles del perezoso tienen ids únicos y, en los 🐞, el programa que viene puesto no gana", () => {
  // Act
  const ids = NIVELES.map(n => n.id);
  const ganan = NIVELES.filter(n => n.depurar && ejecutar(leer(n), n.inicial).resultado === "gano").map(n => n.id);
  // Assert
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(ganan, []);
});

test("en los niveles 🐞 del perezoso, siguiendo el 💡 desde el programa con error se llega a ganar con el mínimo de flechas", () => {
  // Arrange
  const mal = [];
  // Act
  for (const nivel of NIVELES.filter(n => n.depurar)) {
    const juego = leer(nivel);
    let programa = [...nivel.inicial], p;
    for (let k = 0; k < 60 && (p = pista(juego, programa)).accion !== "listo"; k++) programa = p.programa;
    const r = ejecutar(juego, programa);
    if (r.resultado !== "gano" || programa.length !== minimo(juego)) mal.push(`${nivel.id}: ${r.resultado} con ${programa.length} flechas`);
  }
  // Assert
  assert.deepEqual(mal, []);
});

test("el 💡 del perezoso quita las flechas desde la primera que se sale del camino más corto", () => {
  // Arrange: en «derecho» la salida mira a la derecha; «arriba» al principio se sale del camino corto
  const juego = leer(NIVELES.find(n => n.id === "derecho"));
  // Act
  const p = pista(juego, ["arriba", "derecha"]);
  // Assert
  assert.equal(p.accion, "quita");
  assert.deepEqual(p.programa, []);
});

test("los niveles al azar del perezoso se pueden resolver, caminoCorto gana y el mínimo queda entre 5 y 14 flechas", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const problemas = problemasDe(150, () => nivelAlAzar(rnd), nivel => {
    const juego = leer(nivel), camino = caminoCorto(juego), m = minimo(juego), mapa = nivel.mapa.join("/");
    if (!camino) return [`sin camino: ${mapa}`];
    const mal = [];
    if (ejecutar(juego, camino).resultado !== "gano") mal.push(`caminoCorto no gana: ${mapa}`);
    if (camino.length !== m || m !== minimoAparte(nivel.mapa)) mal.push(`el mínimo no calza: ${mapa}`);
    if (m < 5 || m > 14) mal.push(`mínimo de ${m}: ${mapa}`);
    if (nivel.mapa.join("").split("S").length !== 2) mal.push(`no hay un solo perezoso: ${mapa}`);
    return mal;
  });
  // Assert
  assert.deepEqual(problemas, [], `semilla ${SEMILLA}`);
});

test("nivelAlAzar del perezoso respeta otro rango de pasos que se le pida", () => {
  // Arrange
  const rnd = azar(SEMILLA + 1);
  // Act
  const minimos = Array.from({ length: 40 }, () => minimo(leer(nivelAlAzar(rnd, { pasos: [3, 6] }))));
  // Assert
  assert.deepEqual(minimos.filter(m => m < 3 || m > 6), []);
});
