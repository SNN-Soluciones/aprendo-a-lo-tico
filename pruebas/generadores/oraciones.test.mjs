import { test } from "node:test";
import assert from "node:assert/strict";
import { ETAPAS, ronda, revisarMayus, paraMayus, palabrasDe, fichas, esCorrecta, primerError, signoDe } from "../../public/js/oraciones.js";
import { azar, SEMILLA, noVacio } from "./_azar.mjs";

const VUELTAS = 150;
// Los días y los meses van con minúscula en español
const DIAS_Y_MESES = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "sábados", "domingos",
  "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];
const indicesConMayus = t => paraMayus(t).map((p, i) => (p.mayus ? i : -1)).filter(i => i >= 0);

test("revisarMayus da exacto cuando el niño marca justo la primera palabra y los nombres propios", () => {
  // Act
  const r = revisarMayus([3, 0], "María vive en Cartago.");
  // Assert
  assert.deepEqual(r, { correctas: [0, 3], faltan: [], sobran: [], exacto: true });
});

test("revisarMayus separa las mayúsculas que faltan de las que sobran", () => {
  // Act
  const r = revisarMayus([0, 1], "El volcán Poás está en Alajuela.");
  // Assert
  assert.deepEqual(r.correctas, [0, 2, 5]);
  assert.deepEqual(r.faltan, [2, 5]);
  assert.deepEqual(r.sobran, [1]);
  assert.equal(r.exacto, false);
});

test("en las rondas de mayúsculas, la primera palabra lleva mayúscula y los días y meses no", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  const mal = new Set();
  // Act
  for (let k = 0; k < VUELTAS; k++) {
    for (const { t } of ronda("mayus", rnd)) {
      const correctas = indicesConMayus(t);
      if (!revisarMayus(correctas, t).exacto) mal.add(`sus propias mayúsculas no dan exacto: ${t}`);
      if (!correctas.includes(0)) mal.add(`empieza sin mayúscula: ${t}`);
      palabrasDe(t).forEach((w, i) => {
        if (DIAS_Y_MESES.includes(w.toLowerCase().replace(/[.,]/g, "")) && correctas.includes(i)) mal.add(`día o mes con mayúscula: ${t}`);
      });
    }
  }
  // Assert
  assert.deepEqual([...mal], [], `semilla ${SEMILLA}`);
});

noVacio(ETAPAS, "ETAPAS").forEach((etapa, i) => {
  test(`oraciones, etapa «${etapa.nombre}»: cada ronda trae ${etapa.preguntas} oraciones`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const largos = new Set(Array.from({ length: VUELTAS }, () => ronda(etapa.id, rnd).length));
    // Assert
    assert.deepEqual([...largos], [etapa.preguntas], `semilla ${semilla}`);
  });
});

test("en las rondas de signos salen 3 con punto, 3 de pregunta y 2 de exclamación, con el signo de abrir que corresponde", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  const mal = new Set();
  // Act
  for (let k = 0; k < VUELTAS; k++) {
    const r = ronda("signos", rnd).map(o => o.t);
    const cuenta = tipo => r.filter(t => signoDe(t) === tipo).length;
    if (cuenta("punto") !== 3 || cuenta("pregunta") !== 3 || cuenta("exclamacion") !== 2) mal.add(`reparto ${cuenta("punto")}/${cuenta("pregunta")}/${cuenta("exclamacion")}`);
    for (const t of r) {
      if (signoDe(t) === "pregunta" && !t.includes("¿")) mal.add(`pregunta sin ¿: ${t}`);
      if (signoDe(t) === "exclamacion" && !t.includes("¡")) mal.add(`exclamación sin ¡: ${t}`);
    }
  }
  // Assert
  assert.deepEqual([...mal], [], `semilla ${SEMILLA}`);
});

test("las fichas de armar oraciones nunca vienen en el orden correcto y la oración bien armada se acepta", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  const mal = new Set();
  // Act
  for (let k = 0; k < VUELTAS; k++) {
    for (const o of [...ronda("cortas", rnd), ...ronda("largas", rnd)]) {
      const armada = palabrasDe(o.t);
      if (fichas(o.t, rnd).map(f => f.w).join(" ") === o.t) mal.add(`fichas en orden: ${o.t}`);
      if (!esCorrecta(armada, o)) mal.add(`no acepta la oración bien armada: ${o.t}`);
      if (primerError(armada, o) !== -1) mal.add(`primerError encuentra un error en la buena: ${o.t}`);
    }
  }
  // Assert
  assert.deepEqual([...mal], [], `semilla ${SEMILLA}`);
});
