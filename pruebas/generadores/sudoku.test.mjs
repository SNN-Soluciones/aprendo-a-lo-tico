import { test } from "node:test";
import assert from "node:assert/strict";
import { MODOS, generar, choques, pista, seResuelveRazonando, contarSoluciones } from "../../public/js/sudoku.js";
import { SEMILLA, noVacio } from "./_azar.mjs";

const TABLEROS_POR_MODO = 30;

/** Cuadros de 2 × 2 en el 4 × 4 y de 2 filas × 3 columnas en el 6 × 6 (lo mismo que dice el juego). */
const cuadro = n => (n === 4 ? { h: 2, w: 2 } : { h: 2, w: 3 });

/**
 * Cuenta soluciones por fuerza bruta, sin usar el código del juego (se detiene en `hasta`).
 * Recorre las casillas en orden y prueba cada rana que no choque.
 */
function solucionesPorFuerzaBruta(tablero, n, hasta = 2) {
  const t = tablero.map(f => [...f]);
  const { h, w } = cuadro(n);
  const cabe = (f, c, v) => {
    for (let k = 0; k < n; k++) if (t[f][k] === v || t[k][c] === v) return false;
    const f0 = f - (f % h), c0 = c - (c % w);
    for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) if (t[f0 + i][c0 + j] === v) return false;
    return true;
  };
  let total = 0;
  const llenar = k => {
    if (total >= hasta) return;
    if (k === n * n) { total++; return; }
    const f = Math.floor(k / n), c = k % n;
    if (t[f][c]) { llenar(k + 1); return; }
    for (let v = 1; v <= n; v++) if (cabe(f, c, v)) { t[f][c] = v; llenar(k + 1); t[f][c] = 0; }
  };
  llenar(0);
  return total;
}

/** ¿Cada fila, columna y cuadro tiene las ranas de 1 a n, una vez? */
function completoYSinChoques(t, n) {
  const llena = t.every(f => f.length === n && f.every(v => Number.isInteger(v) && v >= 1 && v <= n));
  return llena && choques(t, n).size === 0;
}

noVacio(MODOS, "MODOS").forEach((modo, m) => {
  test(`sudoku de ranitas «${modo.nombre}»: cada tablero tiene una sola solución (contada por fuerza bruta) y es la que guarda el juego`, () => {
    // Arrange
    const mal = [];
    // Act
    for (let k = 0; k < TABLEROS_POR_MODO; k++) {
      const semilla = SEMILLA + 100 * m + k;
      const { tablero, solucion } = generar(modo.n, modo.vacias, semilla);
      const donde = `semilla ${semilla}`;
      if (!completoYSinChoques(solucion, modo.n)) mal.push(`${donde}: la solución está incompleta o tiene choques`);
      if (tablero.some((f, i) => f.some((v, j) => v !== 0 && v !== solucion[i][j]))) mal.push(`${donde}: el tablero no calza con la solución`);
      if (choques(tablero, modo.n).size) mal.push(`${donde}: el tablero ya trae ranas repetidas`);
      const vacias = tablero.flat().filter(v => v === 0).length;
      if (vacias < 1 || vacias > modo.vacias) mal.push(`${donde}: ${vacias} casillas vacías (el modo pide hasta ${modo.vacias})`);
      const n = solucionesPorFuerzaBruta(tablero, modo.n);
      if (n !== 1) mal.push(`${donde}: tiene ${n === 2 ? "2 o más" : n} soluciones`);
      if (contarSoluciones(tablero, modo.n) !== n) mal.push(`${donde}: contarSoluciones no coincide con la fuerza bruta`);
    }
    // Assert
    assert.deepEqual(mal, []);
  });

  test(`sudoku de ranitas «${modo.nombre}»: cada tablero se resuelve razonando y las pistas llevan justo a la solución`, () => {
    // Arrange
    const mal = [];
    // Act
    for (let k = 0; k < TABLEROS_POR_MODO; k++) {
      const semilla = SEMILLA + 100 * m + k;
      const { tablero, solucion } = generar(modo.n, modo.vacias, semilla);
      if (!seResuelveRazonando(tablero, modo.n, solucion)) mal.push(`semilla ${semilla}: hace falta «revelar»`);
      let t = tablero.map(f => [...f]);
      for (let p, vueltas = 0; (p = pista(t, modo.n, solucion)) && vueltas < 40; vueltas++) {
        if (p.v !== solucion[p.f][p.c]) { mal.push(`semilla ${semilla}: la pista pone ${p.v} en (${p.f}, ${p.c})`); break; }
        t = t.map((f, i) => (i === p.f ? f.map((v, j) => (j === p.c ? p.v : v)) : f));
      }
      if (JSON.stringify(t) !== JSON.stringify(solucion)) mal.push(`semilla ${semilla}: siguiendo las pistas no se llega a la solución`);
    }
    // Assert
    assert.deepEqual(mal, []);
  });
});

test("con la misma semilla, el sudoku de ranitas da el mismo tablero", () => {
  // Act
  const a = generar(6, 20, SEMILLA), b = generar(6, 20, SEMILLA);
  // Assert
  assert.deepEqual(a, b);
});

test("choques marca las dos casillas de una rana repetida en la misma fila", () => {
  // Arrange
  const t = [[1, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  // Act
  const malas = choques(t, 4);
  // Assert
  assert.deepEqual([...malas].sort(), ["0,0", "0,3"]);
});
