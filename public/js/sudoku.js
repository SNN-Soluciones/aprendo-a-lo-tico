// 🐸 Lógica del "Sudoku de ranitas" (sin pantalla, para poder probarla sola).
// Tableros de 4 × 4 (cuadros de 2 × 2) y 6 × 6 (cuadros de 2 filas × 3 columnas).
// Las casillas guardan un número de 1 a N (cada número es una rana); 0 = vacía.

export const RANAS = [
  { id: "calzonuda", n: "rana calzonuda", corto: "calzonuda", dato: "Tiene ojos rojos: los abre de golpe para asustar a quien se la quiere comer." },
  { id: "fresa", n: "rana fresa", corto: "fresa", dato: "Le dicen «blue jeans» porque es roja con las patas azules. Sus colores avisan: ¡soy venenosa!" },
  { id: "verdinegra", n: "rana verdinegra", corto: "verdinegra", dato: "Es verde con manchas negras. El papá carga a los renacuajos en la espalda hasta el agua." },
  { id: "vidrio", n: "rana de vidrio", corto: "de vidrio", dato: "Tiene la piel de la panza transparente: ¡se le puede ver el corazón!" },
  { id: "arlequin", n: "rana arlequín", corto: "arlequín", dato: "Es amarilla con manchas negras. Está en peligro de extinción: quedan muy poquitas." },
  { id: "dorado", n: "sapito dorado", corto: "sapito dorado", dato: "Vivía solo en Monteverde y desapareció. Por eso hay que cuidar los bosques y el agua." },
];

export const MODOS = [
  { id: "4-facil", nombre: "4 × 4 fácil", n: 4, vacias: 6, grados: "1° a 3°" },
  { id: "4-reto", nombre: "4 × 4 reto", n: 4, vacias: 10, grados: "2° a 4°" },
  { id: "6-facil", nombre: "6 × 6 fácil", n: 6, vacias: 14, grados: "3° a 5°" },
  { id: "6-medio", nombre: "6 × 6 medio", n: 6, vacias: 20, grados: "4° a 6°" },
  { id: "6-dificil", nombre: "6 × 6 difícil", n: 6, vacias: 24, grados: "5° a 6°" },
];

/** Alto y ancho de cada cuadro. */
export const caja = n => n === 4 ? { h: 2, w: 2 } : { h: 2, w: 3 };

/** Generador de números al azar con semilla (para poder repetir un tablero en las pruebas). */
export function azar(semilla = Date.now()) {
  let s = semilla >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/** Números que caben en (f, c) sin repetirse en la fila, columna ni cuadro. */
export function candidatos(t, n, f, c) {
  const { h, w } = caja(n), usados = new Set();
  for (let i = 0; i < n; i++) { usados.add(t[f][i]); usados.add(t[i][c]); }
  const f0 = f - f % h, c0 = c - c % w;
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) usados.add(t[f0 + i][c0 + j]);
  return Array.from({ length: n }, (_, i) => i + 1).filter(v => !usados.has(v));
}

/** Cuenta soluciones (se detiene al llegar a `hasta`). */
export function contarSoluciones(t, n, hasta = 2) {
  const g = t.map(r => [...r]);
  let total = 0;
  (function paso() {
    if (total >= hasta) return;
    let mejor = null;
    for (let f = 0; f < n; f++) for (let c = 0; c < n; c++) if (!g[f][c]) {
      const cs = candidatos(g, n, f, c);
      if (!mejor || cs.length < mejor.cs.length) mejor = { f, c, cs };
    }
    if (!mejor) { total++; return; }
    for (const v of mejor.cs) { g[mejor.f][mejor.c] = v; paso(); g[mejor.f][mejor.c] = 0; if (total >= hasta) return; }
  })();
  return total;
}

/** Tablero lleno al azar. */
function lleno(n, rnd) {
  const t = Array.from({ length: n }, () => Array(n).fill(0));
  (function llenar(k) {
    if (k === n * n) return true;
    const f = Math.floor(k / n), c = k % n;
    for (const v of barajar(candidatos(t, n, f, c), rnd)) { t[f][c] = v; if (llenar(k + 1)) return true; }
    t[f][c] = 0; return false;
  })(0);
  return t;
}

/**
 * Arma un sudoku con UNA sola solución que se puede resolver razonando (sin adivinar).
 * Devuelve { tablero, solucion }.
 */
export function generar(n, vacias, semilla = Date.now()) {
  let intento;
  for (let k = 0; k < 30; k++) {
    intento = generarUno(n, vacias, semilla + k * 104729);
    if (seResuelveRazonando(intento.tablero, n, intento.solucion)) return intento;
  }
  return intento;
}

/** ¿Se llena solo con pistas de razonamiento (sin «revelar»)? */
export function seResuelveRazonando(tablero, n, solucion) {
  const t = tablero.map(r => [...r]);
  for (let p; (p = pista(t, n, solucion)); ) { if (p.porque === "revelar") return false; t[p.f][p.c] = p.v; }
  return true;
}

function generarUno(n, vacias, semilla) {
  const rnd = azar(semilla);
  const solucion = lleno(n, rnd);
  const tablero = solucion.map(r => [...r]);
  let quitadas = 0;
  for (const k of barajar([...Array(n * n).keys()], rnd)) {
    if (quitadas >= vacias) break;
    const f = Math.floor(k / n), c = k % n, v = tablero[f][c];
    tablero[f][c] = 0;
    if (contarSoluciones(tablero, n) === 1) quitadas++; else tablero[f][c] = v;
  }
  return { tablero, solucion };
}

/** Casillas que chocan (misma rana repetida en fila, columna o cuadro). */
export function choques(t, n) {
  const { h, w } = caja(n), malas = new Set();
  const revisar = celdas => {
    const vistos = {};
    celdas.forEach(([f, c]) => { const v = t[f][c]; if (v) (vistos[v] ||= []).push(`${f},${c}`); });
    Object.values(vistos).forEach(l => { if (l.length > 1) l.forEach(k => malas.add(k)); });
  };
  for (let i = 0; i < n; i++) {
    revisar([...Array(n).keys()].map(j => [i, j]));
    revisar([...Array(n).keys()].map(j => [j, i]));
  }
  for (let f0 = 0; f0 < n; f0 += h) for (let c0 = 0; c0 < n; c0 += w) {
    const cs = []; for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) cs.push([f0 + i, c0 + j]); revisar(cs);
  }
  return malas;
}

/**
 * Pista que explica el razonamiento, como lo haría un detective:
 *   1) una casilla donde solo cabe una rana, o
 *   2) una rana que en una fila, columna o cuadro solo cabe en un lugar.
 * Devuelve { f, c, v, porque } o null si el tablero está lleno.
 */
export function pista(t, n, solucion) {
  const { h, w } = caja(n);
  const vacias = [];
  for (let f = 0; f < n; f++) for (let c = 0; c < n; c++) if (!t[f][c]) vacias.push([f, c]);
  if (!vacias.length) return null;
  for (const [f, c] of vacias) {
    const cs = candidatos(t, n, f, c);
    if (cs.length === 1 && cs[0] === solucion[f][c]) return { f, c, v: cs[0], porque: "sola" };
  }
  const unidades = [];
  for (let i = 0; i < n; i++) {
    unidades.push({ tipo: "fila", celdas: [...Array(n).keys()].map(j => [i, j]) });
    unidades.push({ tipo: "columna", celdas: [...Array(n).keys()].map(j => [j, i]) });
  }
  for (let f0 = 0; f0 < n; f0 += h) for (let c0 = 0; c0 < n; c0 += w) {
    const cs = []; for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) cs.push([f0 + i, c0 + j]);
    unidades.push({ tipo: "cuadro", celdas: cs });
  }
  for (const u of unidades) for (let v = 1; v <= n; v++) {
    if (u.celdas.some(([f, c]) => t[f][c] === v)) continue;
    const donde = u.celdas.filter(([f, c]) => !t[f][c] && candidatos(t, n, f, c).includes(v));
    if (donde.length === 1 && solucion[donde[0][0]][donde[0][1]] === v) return { f: donde[0][0], c: donde[0][1], v, porque: u.tipo };
  }
  const [f, c] = vacias[0];
  return { f, c, v: solucion[f][c], porque: "revelar" };
}
