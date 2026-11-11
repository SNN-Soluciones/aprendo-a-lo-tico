import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, MODOS, ronda, inicio, preguntaExamen, revisarDatos, revisarRonda, revisarComunidad } from "../../public/js/comunidad.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

test("los datos de la comunidad están completos: oficios, lugares, cosas y viñetas sin referencias rotas", () => {
  // Act
  const problemas = revisarDatos();
  // Assert
  assert.deepEqual(problemas, []);
});

test("la revisión completa de la comunidad (rondas de cada escalón y preguntas de examen) no encuentra problemas", () => {
  // Arrange: revisarComunidad usa su propia semilla fija, así que se repite igual
  // Act
  const problemas = revisarComunidad(200);
  // Assert
  assert.deepEqual(problemas, []);
});

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`comunidad, ${etiqueta(i, escalon)}: cada ronda tiene una sola respuesta, entre las opciones, y textos bien escritos`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    let clave = "";
    // Act
    const problemas = problemasDe(VUELTAS, () => {
      const r = ronda(i, rnd, clave);
      clave = r.clave;
      return r;
    }, revisarRonda);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

[1, 2].forEach(g => {
  test(`las preguntas de examen de la comunidad de ${g}° traen la correcta entre opciones distintas`, () => {
    // Arrange
    const semilla = SEMILLA + g, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(300, () => preguntaExamen(rnd, g), q => [
      ...(q.opciones.includes(q.correcta) ? [] : [`la correcta no está: ${q.texto}`]),
      ...(new Set(q.opciones).size === q.opciones.length ? [] : [`opciones repetidas: ${q.texto}`]),
      ...(q.texto && q.explica ? [] : ["falta texto o explicación"]),
    ]);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("revisarRonda de la comunidad detecta una respuesta que no está entre las opciones", () => {
  // Arrange: «¿Quién nos ayuda?» sin la opción que es la respuesta
  const buena = ronda(1, azar(SEMILLA));
  const mala = { ...buena, opciones: buena.opciones.filter(o => o.id !== buena.meta) };
  // Act
  const problemas = revisarRonda(mala);
  // Assert
  assert.deepEqual(revisarRonda(buena), []);
  assert.ok(problemas.some(p => p.includes("no está entre las opciones")), problemas.join("; "));
});

test("revisarRonda de la comunidad reporta (sin reventar) las rondas «¿Quién es?» y «¿Qué lugar es?» sin la respuesta entre las opciones", () => {
  // Arrange: un escalón de cada tipo que pregunta por un nombre o un lugar
  const buenas = ESCALONES.map((_, e) => ronda(e, azar(SEMILLA + e))).filter(r => r.tipo === "nombre" || r.tipo === "lugar");
  const tipos = new Set(buenas.map(r => r.tipo));
  for (const buena of buenas) {
    const mala = { ...buena, opciones: buena.opciones.filter(o => o.id !== buena.meta) };
    // Act
    const problemas = revisarRonda(mala);
    // Assert
    assert.ok(problemas.some(p => p.includes("no está entre las opciones")), `${buena.tipo}: ${problemas.join("; ")}`);
  }
  assert.deepEqual([...tipos].sort(), ["lugar", "nombre"]);
});

test("los modos de la comunidad apuntan a escalones que existen y el inicio también", () => {
  // Act
  const malos = Object.entries(MODOS).flatMap(([id, es]) => es.filter(e => !ESCALONES[e]).map(e => `${id}: ${e}`));
  const fuera = EDADES.filter(edad => !ESCALONES[inicio(edad)]);
  // Assert
  assert.deepEqual(malos, []);
  assert.deepEqual(fuera, []);
});
