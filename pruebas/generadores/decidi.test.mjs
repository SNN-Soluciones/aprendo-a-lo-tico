import { test } from "node:test";
import assert from "node:assert/strict";
import { NIVELES, ETAPAS, MAX_PASOS, leer, ejecutar, contar, nivelAlAzar } from "../../public/js/decidi.js";
import { azar, SEMILLA, problemasDe, noVacio } from "./_azar.mjs";

// ejecutar(...).resultado es "gano" | "choco" | "incompleto" | "cansado": el nivel se gana con "gano"
const GANA = "gano";

/** Todos los tipos de bloque de un programa, también los de adentro de repetir y si. */
const tiposDe = programa => programa.flatMap(b => [b.t, ...tiposDe(b.cuerpo || []), ...tiposDe(b.si || []), ...tiposDe(b.sino || [])]);

// El chequeo del README: NIVELES.forEach(n => ejecutar(leer(n), n.solucion).resultado)
noVacio(NIVELES, "NIVELES").forEach((nivel, i) => {
  test(`«Repetí y decidí», nivel ${i + 1} «${nivel.id}»: la solución de ejemplo se come todas las hojas`, () => {
    // Arrange
    const juego = leer(nivel);
    // Act
    const r = ejecutar(juego, nivel.solucion);
    // Assert
    assert.equal(r.resultado, GANA, `terminó en «${r.resultado}»${r.motivo ? ` (${r.motivo})` : ""}`);
    assert.equal(r.faltan, 0);
  });
});

test("los niveles de «Repetí y decidí» tienen ids únicos, una etapa que existe y un perezoso en el mapa", () => {
  // Arrange
  const etapas = new Set(ETAPAS.map(e => e.id));
  // Act
  const ids = NIVELES.map(n => n.id);
  const raros = NIVELES.filter(n => !etapas.has(n.etapa) || !leer(n).salida || !leer(n).hojas.length).map(n => n.id);
  // Assert
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(raros, []);
});

test("la solución de cada nivel solo usa bloques que ese nivel deja usar", () => {
  // Act
  const fuera = NIVELES.flatMap(n => tiposDe(n.solucion).filter(t => !n.bloques.includes(t)).map(t => `${n.id}: ${t}`));
  // Assert
  assert.deepEqual([...new Set(fuera)], []);
});

test("en los niveles 🐞 el programa que viene puesto no gana (trae el error para arreglar)", () => {
  // Arrange
  const depurar = NIVELES.filter(n => n.depurar);
  // Act
  const ganan = depurar.filter(n => ejecutar(leer(n), n.inicial).resultado === GANA).map(n => n.id);
  // Assert
  assert.ok(depurar.length > 0);
  assert.ok(depurar.every(n => Array.isArray(n.inicial) && n.inicial.length > 0));
  assert.deepEqual(ganan, []);
});

test("las 3 estrellas de cada nivel se alcanzan con su solución (objetivo ≥ bloques de la solución)", () => {
  // Act
  const caros = NIVELES.filter(n => n.objetivo < contar(n.solucion)).map(n => `${n.id}: ${n.objetivo} < ${contar(n.solucion)}`);
  // Assert
  assert.deepEqual(caros, []);
});

test("un programa sin fin («repetir hasta» que nunca come) termina «cansado» y no se cuelga", () => {
  // Arrange: girando para siempre en el primer nivel
  const juego = leer(NIVELES[0]);
  const programa = [{ t: "hasta", cuerpo: [{ t: "der" }] }];
  // Act
  const r = ejecutar(juego, programa);
  // Assert
  assert.equal(r.resultado, "cansado");
  assert.ok(r.pasos > MAX_PASOS);
});

test("avanzar contra un árbol choca y no gana", () => {
  // Arrange: en «Girá» el perezoso tiene un árbol abajo
  const nivel = NIVELES.find(n => n.id === "gira");
  const programa = [{ t: "der" }, { t: "avanzar" }];
  // Act
  const r = ejecutar(leer(nivel), programa);
  // Assert
  assert.equal(r.resultado, "choco");
});

test("los niveles al azar de «Repetí y decidí» se ganan con su solución, usan sus bloques y caben en la pantalla", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const problemas = problemasDe(200, () => nivelAlAzar(rnd), n => {
    const mal = [];
    const r = ejecutar(leer(n), n.solucion);
    if (r.resultado !== GANA) mal.push(`«${n.titulo}» termina en ${r.resultado}`);
    if (n.objetivo !== contar(n.solucion)) mal.push(`«${n.titulo}»: objetivo ${n.objetivo}`);
    if (tiposDe(n.solucion).some(t => !n.bloques.includes(t))) mal.push(`«${n.titulo}»: usa bloques que no deja`);
    if (n.mapa.length > 7 || n.mapa.some(f => f.length !== n.mapa[0].length || f.length > 10)) mal.push(`«${n.titulo}»: mapa de ${n.mapa[0].length} × ${n.mapa.length}`);
    return mal;
  });
  // Assert
  assert.deepEqual(problemas, [], `semilla ${SEMILLA}`);
});
