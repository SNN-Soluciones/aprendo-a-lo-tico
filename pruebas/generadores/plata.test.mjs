import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, MODOS, MONEDAS, ronda, inicio, preguntaExamen, minimas, contarArriba, revisarRonda, revisarPlata } from "../../public/js/plata.js";
import { azar, SEMILLA, EDADES, etiqueta, problemasDe, conMathRandom, noVacio } from "./_azar.mjs";

const VUELTAS = 400;

test("la revisión completa de la alcancía (cuentas, rondas de cada escalón y examen de 1° a 4°) no encuentra problemas", () => {
  // Arrange: revisarPlata no recibe rnd y usa Math.random por dentro; se cambia por uno con semilla
  // para que un fallo se pueda repetir. Trae 3000 vueltas por defecto (1,5 s); 400 alcanzan.
  // Act
  const problemas = conMathRandom(SEMILLA, () => revisarPlata(VUELTAS));
  // Assert
  assert.deepEqual(problemas, [], `Math.random con semilla ${SEMILLA}`);
});

noVacio(ESCALONES, "ESCALONES").forEach((escalon, i) => {
  test(`la alcancía, ${etiqueta(i, escalon)}: cada ronda tiene las cuentas bien, la correcta entre las opciones y la voz sin ₡`, () => {
    // Arrange
    const semilla = SEMILLA + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => ronda(i, rnd), q => revisarRonda(q, i));
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

[1, 2, 3, 4].forEach(g => {
  test(`las preguntas de examen de la alcancía de ${g}° traen la correcta entre opciones distintas y solo monedas que existen`, () => {
    // Arrange
    const semilla = SEMILLA + g, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(VUELTAS, () => preguntaExamen(rnd, g), q => {
      const mal = [];
      if (!q.texto || !q.explica || !q.correcta) mal.push("faltan campos");
      if (q.tipo === "opcion" && !q.opciones.includes(q.correcta)) mal.push(`la correcta no está: ${q.texto}`);
      if (q.tipo === "opcion" && new Set(q.opciones).size !== q.opciones.length) mal.push(`opciones repetidas: ${q.texto}`);
      if (q.tipo === "numero" && !(Number(q.correcta) > 0)) mal.push(`número raro: ${q.correcta}`);
      if (q.tipo === "opcion") for (const o of q.opciones) {
        if (/₡/.test(o) && o.split(" + ").some(x => !MONEDAS.includes(Number(x.slice(1))))) mal.push(`moneda que no existe: ${o}`);
      }
      return mal;
    });
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("minimas junta un monto con la menor cantidad de monedas (₡75 = ₡50 + ₡25)", () => {
  // Act / Assert
  assert.deepEqual(minimas(75, [50, 25, 10, 5]), [50, 25]);
  assert.deepEqual(minimas(40, [25, 10, 5]), [25, 10, 5]);
});

test("contarArriba cuenta el vuelto hacia arriba hasta lo que se pagó (de ₡650 a ₡1000: +50 y +300)", () => {
  // Act
  const pasos = contarArriba(650, 1000);
  // Assert
  assert.deepEqual(pasos.map(s => s.mas), [50, 300]);
  assert.equal(pasos[pasos.length - 1].hasta, 1000);
});

test("revisarRonda de la alcancía detecta un total que no es la suma de las piezas", () => {
  // Arrange: el primer escalón es de contar monedas
  const buena = ronda(0, azar(SEMILLA));
  const mala = { ...buena, total: buena.total + 5 };
  // Act
  const problemas = revisarRonda(mala, 0);
  // Assert
  assert.equal(buena.modo, "contar");
  assert.deepEqual(revisarRonda(buena, 0), []);
  assert.ok(problemas.includes("total mal"), problemas.join("; "));
});

test("los modos de la alcancía apuntan a escalones que existen y el inicio también", () => {
  // Act
  const malos = MODOS.flatMap(m => m.escalones.filter(e => !ESCALONES[e]).map(e => `${m.id}: ${e}`));
  const fuera = EDADES.filter(edad => !ESCALONES[inicio(edad)]);
  // Assert
  assert.deepEqual(malos, []);
  assert.deepEqual(fuera, []);
});
