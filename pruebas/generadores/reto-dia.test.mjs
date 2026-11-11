import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { RETOS_DIA, hoy, azarCon, retoDelDia, desdeUrl, marcarHecho, hecho } from "../../public/js/reto-dia.js";

const PUBLIC = fileURLToPath(new URL("../../public/", import.meta.url));

/** Corre fn con un objeto puesto como global (location, localStorage…) y después lo quita. */
function conGlobal(nombre, valor, fn) {
  const antes = Object.getOwnPropertyDescriptor(globalThis, nombre);
  Object.defineProperty(globalThis, nombre, { value: valor, configurable: true, writable: true });
  try {
    return fn();
  } finally {
    if (antes) Object.defineProperty(globalThis, nombre, antes);
    else delete globalThis[nombre];
  }
}

/** Fechas seguidas a partir de una, como "AAAA-MM-DD". */
const diasDesde = (inicio, n) => Array.from({ length: n }, (_, k) => new Date(Date.UTC(...inicio, 1 + k)).toISOString().slice(0, 10));

test("la misma fecha da siempre el mismo reto del día", () => {
  // Act
  const a = retoDelDia("2026-11-11"), b = retoDelDia("2026-11-11");
  // Assert
  assert.deepEqual(a, b);
  assert.equal(a.fecha, "2026-11-11");
  assert.equal(a.url, `${a.juego}?dia=2026-11-11&reto=${a.param}`);
});

test("en días seguidos el reto va rotando y pasa por todos los retos", () => {
  // Arrange
  const fechas = diasDesde([2026, 10], RETOS_DIA.length);
  // Act
  const juegos = fechas.map(f => { const r = retoDelDia(f); return `${r.juego}?${r.param}`; });
  // Assert
  assert.equal(new Set(juegos).size, RETOS_DIA.length);
});

test("el reto del día no se repite seguido en un año entero (cambia de mes y de año sin saltos)", () => {
  // Arrange
  const fechas = diasDesde([2026, 0], 366);
  // Act
  const seguidos = fechas.slice(1).filter((f, k) => retoDelDia(f).titulo === retoDelDia(fechas[k]).titulo);
  // Assert
  assert.deepEqual(seguidos, []);
});

test("cada juego de los retos del día existe como archivo en public/", () => {
  // Act
  const faltan = RETOS_DIA.filter(r => !existsSync(PUBLIC + r.juego)).map(r => r.juego);
  // Assert
  assert.deepEqual(faltan, []);
});

test("azarCon da la misma lista de números con el mismo texto, distinta con otro texto, y siempre en [0, 1)", () => {
  // Act
  const lista = texto => { const r = azarCon(texto); return Array.from({ length: 50 }, r); };
  const a = lista("aprendo-a-lo-tico 2026-11-11 azar"), b = lista("aprendo-a-lo-tico 2026-11-11 azar"), c = lista("aprendo-a-lo-tico 2026-11-12 azar");
  // Assert
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
  assert.ok(a.every(x => x >= 0 && x < 1));
});

test("hoy escribe la fecha local como AAAA-MM-DD, con ceros", () => {
  // Act / Assert
  assert.equal(hoy(new Date(2026, 8, 5)), "2026-09-05");
  assert.equal(hoy(new Date(2026, 11, 31, 23, 59)), "2026-12-31");
});

test("desdeUrl da la fecha, el reto y un azar repetible cuando el juego se abre como reto del día", () => {
  // Arrange
  const location = { search: "?dia=2026-11-11&reto=azar" };
  // Act
  const a = conGlobal("location", location, desdeUrl), b = conGlobal("location", location, desdeUrl);
  // Assert
  assert.equal(a.fecha, "2026-11-11");
  assert.equal(a.reto, "azar");
  assert.deepEqual(Array.from({ length: 10 }, a.rnd), Array.from({ length: 10 }, b.rnd));
});

test("desdeUrl da null si no hay fecha o viene mal escrita", () => {
  // Act / Assert
  assert.equal(conGlobal("location", { search: "" }, desdeUrl), null);
  assert.equal(conGlobal("location", { search: "?dia=11-11-2026" }, desdeUrl), null);
});

test("marcarHecho y hecho guardan el día resuelto, y sin localStorage hecho da false sin reventar", () => {
  // Arrange
  const guardado = new Map();
  const almacen = { getItem: k => (guardado.has(k) ? guardado.get(k) : null), setItem: (k, v) => guardado.set(k, String(v)) };
  // Act
  const conAlmacen = conGlobal("localStorage", almacen, () => { marcarHecho("2026-11-11"); return [hecho("2026-11-11"), hecho("2026-11-12")]; });
  const sinAlmacen = conGlobal("localStorage", undefined, () => hecho("2026-11-11"));
  // Assert
  assert.deepEqual(conAlmacen, [true, false]);
  assert.equal(sinAlmacen, false);
});
