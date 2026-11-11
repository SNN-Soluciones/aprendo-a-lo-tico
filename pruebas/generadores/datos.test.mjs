import { test } from "node:test";
import assert from "node:assert/strict";
import { ETAPAS, NOTICIAS, ronda, respuesta, pistasDe, revisarSenales } from "../../public/js/datos.js";
import { azar, SEMILLA, noVacio } from "./_azar.mjs";

const VUELTAS = 150;
const SENALES = new Set(NOTICIAS.flatMap(n => n.senales));

test("revisarSenales da exacto cuando el niño marca justo las señales del mensaje, sin importar el orden", () => {
  // Act
  const r = revisarSenales(["fuente", "grita"], ["grita", "fuente"]);
  // Assert
  assert.deepEqual(r, { bien: ["fuente", "grita"], faltan: [], sobran: [], exacto: true });
});

test("revisarSenales separa las señales que faltan de las que sobran", () => {
  // Act
  const r = revisarSenales(["grita", "datos"], ["grita", "apura", "fuente"]);
  // Assert
  assert.deepEqual(r.bien, ["grita"]);
  assert.deepEqual(r.faltan, ["apura", "fuente"]);
  assert.deepEqual(r.sobran, ["datos"]);
  assert.equal(r.exacto, false);
});

test("revisarSenales de un mensaje confiable sin marcar nada es exacto", () => {
  // Act
  const r = revisarSenales([], []);
  // Assert
  assert.equal(r.exacto, true);
});

noVacio(ETAPAS, "ETAPAS").forEach((etapa, i) => {
  test(`dato u opinión, etapa «${etapa.nombre}»: cada ronda trae ${etapa.preguntas} preguntas distintas y con su respuesta`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    const mal = new Set();
    // Act
    for (let k = 0; k < VUELTAS; k++) {
      const r = ronda(etapa.id, rnd);
      if (r.length !== etapa.preguntas) mal.add(`${r.length} preguntas`);
      if (new Set(r.map(p => p.t)).size !== r.length) mal.add("preguntas repetidas en la ronda");
      for (const p of r) {
        if (!respuesta(p, etapa.id)) mal.add(`sin respuesta: ${p.t}`);
        if (p.tipo === "opinion" && !pistasDe(p.t).length) mal.add(`opinión sin palabra pista: ${p.t}`);
        if (p.tipo === "noticia" && p.ok !== (p.senales.length === 0)) mal.add(`señales que no calzan: ${p.t}`);
        if (p.tipo === "noticia" && p.senales.some(s => !SENALES.has(s))) mal.add(`señal desconocida: ${p.senales}`);
        if (p.tipo === "noticia" && !revisarSenales(p.senales, p.senales).exacto) mal.add(`sus propias señales no dan exacto: ${p.t}`);
      }
    }
    // Assert
    assert.deepEqual([...mal], [], `semilla ${semilla}`);
  });
});
