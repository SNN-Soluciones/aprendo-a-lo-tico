// 💾 El progreso de la convocatoria de 8°: no se pierde nada, no se cambia el estado anterior y las puertas
// (práctica y simulacro) se abren solo cuando corresponde.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as P from "../../public/js/c8/progreso.js";

const tema = { id: "t1", cuaderno: [{ tipo: "copiar", x: "a" }, { tipo: "buscar", x: "b" }] };

test("marcar tareas guarda la hora y no cambia el progreso anterior", () => {
  const antes = P.progresoVacio();
  const uno = P.marcarTarea(antes, "t1", 0, true, "2026-11-23T20:00:00Z");
  assert.deepEqual(antes.tareas, {});
  assert.equal(uno.tareas.t1[0], "2026-11-23T20:00:00Z");
  assert.equal(P.materiaLista(uno, tema), false);
  const dos = P.marcarTarea(uno, "t1", 1, true);
  assert.equal(P.materiaLista(dos, tema), true);
  assert.equal(P.materiaLista(P.marcarTarea(dos, "t1", 0, false), tema), false);
});

test("entregar una práctica deja lo fallado pendiente de corregir en el cuaderno", () => {
  let p = P.guardarHoja(P.progresoVacio(), "t1", { perms: {}, respuestas: {} });
  p = P.entregarPractica(p, "t1", { intento: { fecha: "x", pts: 6, total: 10, nota: 60 }, falladas: ["2", "5"], respuestas: { 2: "a" }, entregada: "x" });
  assert.equal(p.hojas.t1, undefined);
  assert.equal(P.mejorNota(p, "t1"), 60);
  assert.deepEqual(P.faltaCorregir(p, "t1"), ["2", "5"]);
  p = P.marcarCorregida(p, "t1", "2", true);
  assert.deepEqual(P.faltaCorregir(p, "t1"), ["5"]);
  p = P.marcarCorregida(p, "t1", "5", true);
  assert.deepEqual(P.faltaCorregir(p, "t1"), []);
});

test("el simulacro se abre con 70 o más en cada práctica, o si un adulto lo abre", () => {
  const temas = [{ id: "a" }, { id: "b" }];
  const con = notas => ({ ...P.progresoVacio(), practicas: Object.fromEntries(Object.entries(notas).map(([k, n]) => [k, [{ nota: n }]])) });
  assert.equal(P.simulacroAbierto(con({ a: 90 }), temas), false);
  assert.equal(P.simulacroAbierto(con({ a: 90, b: 69 }), temas), false);
  assert.equal(P.simulacroAbierto(con({ a: 90, b: 70 }), temas), true);
  assert.equal(P.simulacroAbierto({ ...con({}), desbloqueo: "x" }, temas), true);
});

test("terminar un simulacro lo guarda con su resultado y suelta el reloj", () => {
  let p = P.empezarSimulacro(P.progresoVacio(), { idx: 1, inicio: "i", perms: {}, respuestas: {} });
  p = P.terminarSimulacro(p, { fin: "f", nota: 55, pendientes: 2 });
  assert.equal(p.simEnCurso, null);
  assert.equal(p.simulacros[0].idx, 1);
  assert.equal(p.simulacros[0].nota, 55);
  p = P.marcarGuiaSimulacro(p, 0, "3.1", [true, false], { nota: 60, pendientes: 1 });
  assert.deepEqual(p.simulacros[0].marcas["3.1"], [true, false]);
  assert.equal(p.simulacros[0].nota, 60);
});

test("cambiar anota en el registro solo cuando hay texto", () => {
  const e = P.cambiar(P.vacio(), "ciencias", p => P.marcarTarea(p, "t1", 0, true), "Marcó algo", "2026-11-23T20:00:00Z");
  assert.equal(e.registro.length, 1);
  assert.equal(e.registro[0].m, "ciencias");
  assert.equal(P.cambiar(e, "ciencias", p => p).registro.length, 1);
});

test("cuánto falta, en días de Costa Rica", () => {
  const ahora = new Date("2026-11-23T20:00:00-06:00");
  assert.equal(P.diasQueFaltan("2026-12-03T07:00:00-06:00", ahora), 10);
  assert.equal(P.cuantoFalta("2026-11-24T07:00:00-06:00", ahora), "Es mañana");
  assert.equal(P.cuantoFalta("2026-11-23T23:30:00-06:00", ahora), "Es hoy");
  assert.equal(P.cuantoFalta("2026-11-20T07:00:00-06:00", ahora), "Ya pasó");
  assert.equal(P.cuantoFalta(null, ahora), "Fecha por confirmar");
  // A las 11 p. m. en Costa Rica ya es otro día en UTC: igual cuenta el día de aquí
  assert.equal(P.diasQueFaltan("2026-11-24T07:00:00-06:00", new Date("2026-11-23T23:00:00-06:00")), 1);
});

test("leer siempre devuelve un estado completo, aunque no haya almacenamiento", () => {
  const e = P.leer();
  assert.equal(e.v, 1);
  assert.ok(e.materias && Array.isArray(e.registro));
});

test("un simulacro no se entrega dos veces ni se revive desde otra pestaña", () => {
  const hoja = { idx: 0, inicio: "i1", perms: {}, respuestas: {} };
  let p = P.terminarSimulacro(P.empezarSimulacro(P.progresoVacio(), hoja), { nota: 50 });
  assert.equal(P.terminarSimulacro(p, { nota: 60 }).simulacros.length, 1);
  assert.equal(P.guardarSimulacro(p, { ...hoja, respuestas: { a: 1 } }).simEnCurso, null);
  p = P.empezarSimulacro(p, { ...hoja, inicio: "i2" });
  assert.equal(P.guardarSimulacro(p, { ...hoja, respuestas: { a: 1 } }).simEnCurso.inicio, "i2", "otra hoja vieja no pisa la nueva");
  assert.deepEqual(P.guardarSimulacro(p, { ...hoja, inicio: "i2", respuestas: { a: 1 } }).simEnCurso.respuestas, { a: 1 });
});
