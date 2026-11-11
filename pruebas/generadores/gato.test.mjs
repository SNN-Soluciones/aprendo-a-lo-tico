import { test } from "node:test";
import assert from "node:assert/strict";
import { LINEAS, NIVELES_JAGUAR, otro, libres, resultado, paraGanar, mejores, jugadaJaguar, consejo } from "../../public/js/gato.js";
import { azar, SEMILLA } from "./_azar.mjs";

const VACIO = Array(9).fill(null);
const con = (t, i, s) => t.map((v, k) => (k === i ? s : v));

/**
 * Recorre TODAS las partidas posibles: el rival prueba cada casilla libre y el jugador `yo`
 * prueba cada una de las jugadas que `elegir(t)` le deja. Devuelve las partidas que `yo` pierde.
 */
function partidasPerdidas(yo, elegir) {
  const perdidas = [];
  const visitar = (t, turno, jugadas) => {
    const r = resultado(t);
    if (r) { if (r.quien === otro(yo)) perdidas.push(jugadas.join(" ")); return; }
    const opciones = turno === yo ? elegir(t) : libres(t);
    for (const i of opciones) visitar(con(t, i, turno), otro(turno), [...jugadas, `${turno}${i}`]);
  };
  visitar(VACIO, "X", []);
  return perdidas;
}

/** Todas las posiciones a las que se puede llegar jugando, con el turno que sigue. */
function posiciones() {
  const vistas = new Map();
  const visitar = (t, turno) => {
    const k = t.map(v => v || "-").join("") + turno;
    if (vistas.has(k)) return;
    vistas.set(k, { t, turno });
    if (resultado(t)) return;
    for (const i of libres(t)) visitar(con(t, i, turno), otro(turno));
  };
  visitar(VACIO, "X");
  return [...vistas.values()].filter(p => !resultado(p.t));
}

test("el jaguar «dificil» del gato juega perfecto: nunca pierde, empiece él o empiece el niño, con cualquiera de sus mejores jugadas", () => {
  // Act
  const comoX = partidasPerdidas("X", t => mejores(t, "X"));
  const comoO = partidasPerdidas("O", t => mejores(t, "O"));
  // Assert
  assert.deepEqual(comoX.slice(0, 5), []);
  assert.deepEqual(comoO.slice(0, 5), []);
});

test("siguiendo siempre el consejo del gato, el niño nunca pierde contra ninguna jugada del jaguar", () => {
  // Act
  const comoX = partidasPerdidas("X", t => [consejo(t, "X").casilla]);
  const comoO = partidasPerdidas("O", t => [consejo(t, "O").casilla]);
  // Assert
  assert.deepEqual(comoX.slice(0, 5), []);
  assert.deepEqual(comoO.slice(0, 5), []);
});

test("en cualquier posición del gato, cada nivel del jaguar juega en una casilla libre", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  const mal = [];
  // Act
  for (const { t, turno } of posiciones()) {
    for (const nivel of NIVELES_JAGUAR) {
      const i = jugadaJaguar(t, turno, nivel, rnd);
      if (!libres(t).includes(i)) mal.push(`${nivel} juega en ${i} con ${t.map(v => v || "-").join("")}`);
    }
  }
  // Assert
  assert.deepEqual(mal.slice(0, 5), [], `semilla ${SEMILLA}`);
});

test("el jaguar «medio» del gato gana si puede, si no tapa, y si no toma el centro", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  const mal = [];
  // Act
  for (const { t, turno } of posiciones()) {
    const i = jugadaJaguar(t, turno, "medio", rnd), gana = paraGanar(t, turno), tapa = paraGanar(t, otro(turno));
    const tablero = t.map(v => v || "-").join("");
    if (gana >= 0) { if (!resultado(con(t, i, turno))?.linea) mal.push(`no ganó pudiendo: ${tablero}`); }
    else if (tapa >= 0) { if (i !== tapa) mal.push(`no tapó: ${tablero}`); }
    else if (t[4] === null && i !== 4) mal.push(`no tomó el centro: ${tablero}`);
  }
  // Assert
  assert.deepEqual(mal.slice(0, 5), [], `semilla ${SEMILLA}`);
});

test("el consejo del gato dice «ganar» solo cuando esa casilla gana, y siempre señala una casilla libre", () => {
  // Arrange
  const mal = [];
  // Act
  for (const { t, turno } of posiciones()) {
    const c = consejo(t, turno), tablero = t.map(v => v || "-").join("");
    if (!libres(t).includes(c.casilla)) mal.push(`casilla ocupada: ${tablero}`);
    if ((c.tipo === "ganar") !== (paraGanar(t, turno) >= 0)) mal.push(`«ganar» mal puesto: ${tablero}`);
    if (c.tipo === "ganar" && resultado(con(t, c.casilla, turno))?.quien !== turno) mal.push(`«ganar» no gana: ${tablero}`);
  }
  // Assert
  assert.deepEqual(mal.slice(0, 5), []);
});

test("resultado del gato encuentra las 8 líneas y el empate", () => {
  // Act
  const sinDetectar = LINEAS.filter(l => resultado(VACIO.map((_, i) => (l.includes(i) ? "X" : null)))?.quien !== "X");
  const empate = resultado(["X", "O", "X", "X", "O", "O", "O", "X", "X"]);
  // Assert
  assert.deepEqual(sinDetectar, []);
  assert.deepEqual(empate, { quien: "empate" });
  assert.equal(resultado(VACIO), null);
});
