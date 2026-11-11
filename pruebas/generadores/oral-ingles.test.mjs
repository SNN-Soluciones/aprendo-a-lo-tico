import { test } from "node:test";
import assert from "node:assert/strict";
import { TEMAS, cfg, pregunta, entrevista, dijoBien, escribioBien, revisarOral } from "../../public/js/oral-ingles.js";
import { azar, SEMILLA, problemasDe } from "./_azar.mjs";

const VUELTAS = 60;

test("prueba oral de inglés: cada generador, en los 3 niveles, tiene una sola respuesta correcta y opciones distintas", () => {
  // Arrange: revisarOral usa su propia semilla fija, así que se repite igual
  // Act
  const problemas = revisarOral(200);
  // Assert
  assert.deepEqual(problemas, []);
});

/** Lo mínimo que tiene que cumplir una pregunta de cada modo. */
function revisarSegunModo(modo, q) {
  const mal = [];
  if (q.tipo !== modo) mal.push(`es de tipo ${q.tipo}`);
  if (!q.respuesta?.en || !q.explica) mal.push("falta la respuesta o la explicación");
  if (modo === "oir" && q.opciones.filter(o => o.id === q.correcta).length !== 1) mal.push("la correcta no está una sola vez");
  if (modo === "hablar" && !dijoBien(q.respuesta.en, q.claves)) mal.push(`no acepta su propia respuesta: ${q.respuesta.en}`);
  if (modo === "escribir" && !escribioBien(q.respuesta.en, q.respuesta.en)) mal.push(`no acepta lo bien escrito: ${q.respuesta.en}`);
  return mal;
}

for (const modo of ["oir", "hablar", "escribir"]) {
  for (const nivel of [1, 2, 3]) {
    test(`inglés oral, modo «${modo}» en el nivel ${nivel}: pregunta() da preguntas de ese modo, para cada tema y para «todo»`, () => {
      // Arrange
      const semilla = SEMILLA + nivel, rnd = azar(semilla);
      const temas = [...TEMAS.map(t => t.id), "todo"];
      // Act
      const problemas = temas.flatMap(tema =>
        problemasDe(VUELTAS, () => pregunta(modo, tema, rnd, nivel), q => revisarSegunModo(modo, q)).map(p => `${tema}: ${p}`));
      // Assert
      assert.deepEqual(problemas, [], `semilla ${semilla}`);
    });
  }
}

[1, 2, 3].forEach(nivel => {
  test(`la entrevista de inglés del nivel ${nivel} trae preguntas para hablar, sin respuestas repetidas, que se aceptan con sus claves`, () => {
    // Arrange
    const semilla = SEMILLA + nivel, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(40, () => entrevista(rnd, nivel), e => [
      ...(new Set(e.map(x => x.respuesta.en)).size === e.length ? [] : ["respuesta repetida"]),
      ...e.flatMap(q => revisarSegunModo("hablar", q)),
    ]);
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("dijoBien acepta la respuesta con sus palabras clave (también con número o alias) y no acepta otra", () => {
  // Act / Assert
  assert.equal(dijoBien("there are 3 chairs", ["three", "chairs"]), true);
  assert.equal(dijoBien("She is my mom", ["mother"]), true);
  assert.equal(dijoBien("it is big", ["small"]), false);
});

test("escribioBien no se fija en mayúsculas ni espacios, pero sí en letras de más", () => {
  // Act / Assert
  assert.equal(escribioBien("  Kitchen ", "kitchen"), true);
  assert.equal(escribioBien("kitchenx", "kitchen"), false);
});

test("cfg deja el nivel entre 1 y 3 aunque venga fuera de rango o como texto", () => {
  // Act / Assert
  assert.equal(cfg(0).nivel, 1);
  assert.equal(cfg(9).nivel, 3);
  assert.equal(cfg("2").nivel, 2);
  assert.equal(cfg(undefined).nivel, 1);
});
