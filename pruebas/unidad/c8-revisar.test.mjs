// ✅ La corrección de la convocatoria de 8°: nada que esté bien se marca mal, y nada a medias pasa por bueno.
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizar, leerNumero, mismoNumero, leerExpresion, mismaExpresion, calificar, puntosDe, nota } from "../../public/js/c8/revisar.js";

test("normalizar quita espacios, el signo final y las mayúsculas, pero no las tildes", () => {
  assert.equal(normalizar("  Árbol.  "), "árbol");
  assert.equal(normalizar("I  can’t   swim!"), "i can't swim");
  assert.equal(normalizar("¿Qué?"), "qué");
  assert.equal(normalizar("can - ción"), "can-ción");
  assert.notEqual(normalizar("arbol"), normalizar("árbol"));
  assert.equal(normalizar("Árbol", { tildes: false }), "arbol");
  assert.equal(normalizar("Na", { may: true }), "Na");
});

test("leerNumero entiende enteros, decimales con coma o punto, fracciones y «x =»", () => {
  assert.deepEqual(leerNumero("12"), { n: 12, d: 1 });
  assert.deepEqual(leerNumero("-2,5"), { n: -5, d: 2 });
  assert.deepEqual(leerNumero("x = -7/2"), { n: -7, d: 2 });
  assert.deepEqual(leerNumero("6/4"), { n: 3, d: 2 });
  assert.deepEqual(leerNumero(0.25), { n: 1, d: 4 });
  assert.equal(leerNumero("doce"), null);
  assert.equal(leerNumero("3/0"), null);
  assert.equal(leerNumero(""), null);
});

test("mismoNumero compara el valor, no cómo se escribió", () => {
  assert.ok(mismoNumero("2,5", "5/2"));
  assert.ok(mismoNumero("x=3", 3));
  assert.ok(!mismoNumero("3", "-3"));
  assert.ok(!mismoNumero("", 0));
});

test("leerExpresion junta términos semejantes y avisa si no está simplificada", () => {
  const a = leerExpresion("6x^3 - 4x^2");
  assert.ok(a.simplificada);
  assert.deepEqual(a.terminos.get("x3"), { n: 6, d: 1 });
  assert.deepEqual(a.terminos.get("x2"), { n: -4, d: 1 });
  assert.equal(leerExpresion("3x + 2x").simplificada, false);
  assert.equal(leerExpresion("x·x").simplificada, false);
  assert.equal(leerExpresion("2^3x").simplificada, false);
  assert.ok(leerExpresion("a²b - ab²").simplificada);
  assert.ok(leerExpresion("1/2x + 5").simplificada);
  assert.deepEqual(leerExpresion("2³·2⁴").terminos.get(""), { n: 128, d: 1 });
  assert.equal(leerExpresion("(x+1)"), null);
  assert.equal(leerExpresion("3x +"), null);
  assert.equal(leerExpresion("x--2"), null);
  assert.equal(leerExpresion(""), null);
});

test("mismaExpresion acepta otro orden y otra forma de escribir, pero no sin simplificar", () => {
  assert.ok(mismaExpresion("-4x^2 + 6x^3", "6x^3 - 4x^2").ok);
  assert.ok(mismaExpresion("6x³−4x²", "6x^3 - 4x^2").ok);
  assert.ok(mismaExpresion("ba", "ab").ok);
  assert.ok(mismaExpresion("y^2x", "xy^2").ok);
  assert.ok(mismaExpresion("x^-2", "x^-2").ok);
  assert.ok(!mismaExpresion("6x^3 + 4x^2", "6x^3 - 4x^2").ok);
  const sinJuntar = mismaExpresion("x^2 + 2x + 3x", "x^2 + 5x");
  assert.equal(sinJuntar.ok, false);
  assert.match(sinJuntar.motivo, /simplificada/);
  assert.ok(!mismaExpresion("x^2", "x^3").ok);
});

test("calificar cada tipo de pregunta", () => {
  assert.ok(calificar({ t: "opcion", o: ["a", "b", "c"], r: 2 }, 2).ok);
  assert.ok(!calificar({ t: "opcion", o: ["a", "b", "c"], r: 2 }, 0).ok);
  assert.ok(calificar({ t: "vf", r: false }, false).ok);
  assert.ok(!calificar({ t: "vf", r: false }, undefined).ok);
  assert.ok(calificar({ t: "completar", r: ["can't", "cannot"] }, "Cannot.").ok);
  assert.ok(!calificar({ t: "completar", r: ["árbol"] }, "arbol").ok, "las tildes cuentan");
  assert.ok(calificar({ t: "completar", r: ["árbol"], tildes: false }, "arbol").ok);
  assert.ok(!calificar({ t: "completar", r: ["Na"], may: true }, "NA").ok, "las mayúsculas cuentan en los símbolos");
  assert.ok(!calificar({ t: "completar", r: ["x"] }, "   ").ok, "en blanco no vale");
  assert.ok(calificar({ t: "numero", r: "-3/2" }, "-1,5").ok);
  assert.ok(calificar({ t: "expresion", r: "x^2 + 5x" }, "5x + x^2").ok);
  const parejas = calificar({ t: "parejas", pares: [["Na", "sodio"], ["K", "potasio"], ["Fe", "hierro"]] }, ["sodio", "hierro", "hierro"]);
  assert.deepEqual([parejas.pts, parejas.total, parejas.ok], [2, 3, false]);
  assert.ok(calificar({ t: "ordenar", x: ["a", "b", "c"] }, [1, 2, 3]).ok);
  assert.ok(!calificar({ t: "ordenar", x: ["a", "b", "c"] }, [2, 1, 3]).ok);
  const abierta = calificar({ t: "abierta", guia: ["a", "b", "c"] }, [true, false, true]);
  assert.deepEqual([abierta.pts, abierta.total], [2, 3]);
  assert.equal(calificar({ t: "lectura", x: "texto" }).total, 0);
});

test("puntos y nota", () => {
  assert.equal(puntosDe({ t: "opcion", pts: 2 }), 2);
  assert.equal(puntosDe({ t: "parejas", pares: [[1, 2], [3, 4], [5, 6], [7, 8]] }), 4);
  assert.equal(puntosDe({ t: "oral", guia: ["a", "b", "c"] }), 3);
  assert.equal(nota(7, 10), 70);
  assert.equal(nota(2, 3), 67);
  assert.equal(nota(0, 0), 0);
});

test("respuestas raras nunca rompen la corrección ni congelan la página", () => {
  for (const rara of ["2^2000", "9^400", "2^-2000", "1^99999999999", "x^99999999", "9".repeat(400)]) {
    const t0 = Date.now();
    const res = calificar({ t: "expresion", r: "x^2" }, rara);
    assert.equal(res.ok, false, rara);
    assert.ok(Date.now() - t0 < 200, `${rara} tardó demasiado`);
  }
});

test("expresiones con divisor después de la letra y el cero", () => {
  assert.ok(mismaExpresion("x/2", "1/2x").ok);
  assert.ok(mismaExpresion("3x/4 - 1", "3/4x - 1").ok);
  assert.ok(mismaExpresion("0", "0").ok);
  assert.ok(!mismaExpresion("x^2 + 0", "x^2").ok);
  assert.ok(!mismaExpresion("0x + 2", "2").ok);
});

test("si se pide una potencia de un número, no vale el resultado ni el producto", () => {
  assert.ok(mismaExpresion("2^7", "2^7").ok);
  assert.ok(mismaExpresion("2⁷", "2^7").ok);
  assert.match(mismaExpresion("128", "2^7").motivo, /potencia/);
  assert.ok(!mismaExpresion("2^3*2^4", "2^7").ok);
  assert.ok(mismaExpresion("128", "128").ok);
});

test("leerNumero entiende los miles con punto o espacio, como en Costa Rica", () => {
  assert.ok(mismoNumero("153.750", 153750));
  assert.ok(mismoNumero("2 781 000", 2781000));
  assert.ok(mismoNumero("1.250,5", "2501/2"));
  assert.ok(mismoNumero("2.5", "5/2"), "un punto con menos de 3 cifras sigue siendo decimal");
});

test("leerNumero no confunde un número mixto ni la notación de JS", () => {
  assert.equal(leerNumero("1 1/2"), null);
  assert.deepEqual(leerNumero(1e-7), { n: 1, d: 10000000 });
});
