import { test } from "node:test";
import assert from "node:assert/strict";
import { TEXTOS, prepararPreguntas, explicacion, revisarCuentos } from "../../public/js/cuentos.js";
import { azar, SEMILLA } from "./_azar.mjs";

test("todos los cuentos están bien armados: ids únicos, citas que están en el texto y opciones que no se adivinan por el largo", () => {
  // Act
  const problemas = revisarCuentos();
  // Assert
  assert.deepEqual(problemas, []);
});

test("prepararPreguntas baraja las opciones sin perder la correcta y revuelve los pasos de ordenar", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  const mal = [];
  // Act
  for (const texto of TEXTOS) {
    for (const q of prepararPreguntas(texto, rnd)) {
      const donde = `«${texto.id}» (${q.t})`;
      if (q.t === "secuencia") {
        if ([...q.pasos].sort().join("|") !== [...q.orden].sort().join("|")) mal.push(`${donde}: los pasos no son los mismos`);
        if (q.pasos.join("|") === q.orden.join("|")) mal.push(`${donde}: los pasos quedaron en orden`);
      } else {
        // Las de opciones traen cita o explicación (las de ordenar no la necesitan)
        if (!q.opciones.includes(q.ok)) mal.push(`${donde}: falta la correcta`);
        if (q.opciones.length !== q.no.length + 1) mal.push(`${donde}: opciones de más o de menos`);
        if (!explicacion(texto, q).trim()) mal.push(`${donde}: sin explicación`);
      }
    }
  }
  // Assert
  assert.deepEqual(mal, [], `semilla ${SEMILLA}`);
});

test("prepararPreguntas deja al final las preguntas de idea principal, propósito, tipo y enseñanza", () => {
  // Arrange
  const rnd = azar(SEMILLA + 1);
  const alFinal = q => ["idea", "proposito", "tipo", "ensenanza"].includes(q.t);
  // Act
  const desordenados = TEXTOS.filter(texto => {
    const qs = prepararPreguntas(texto, rnd);
    const primera = qs.findIndex(alFinal);
    return primera >= 0 && qs.slice(primera).some(q => !alFinal(q));
  }).map(t => t.id);
  // Assert
  assert.deepEqual(desordenados, []);
});
