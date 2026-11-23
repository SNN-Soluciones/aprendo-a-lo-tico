// 🧪 El contenido de la convocatoria de 8° está bien armado: cada pregunta se puede corregir, la respuesta correcta
// existe, cada tema trae materia, tareas de cuaderno y práctica, y hay dos simulacros distintos por materia.
// Para revisar solo una materia mientras se escribe:  C8=ciencias node --test pruebas/unidad/c8-contenido.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { MATERIAS_8 } from "../../public/js/c8/materias.js";
import { calificar, leerExpresion, leerNumero, puntosDe, seCorrigeSolo } from "../../public/js/c8/revisar.js";

const SOLO = process.env.C8;
const materias = MATERIAS_8.filter(m => !SOLO || m.id === SOLO);
const BLOQUES = new Set(["h", "p", "lista", "tabla", "ej", "ojo", "texto", "svg"]);
const TAREAS = new Set(["copiar", "resumir", "buscar", "escribir", "moverse", "decir"]);
const ITEMS = new Set(["lectura", "opcion", "vf", "completar", "numero", "expresion", "parejas", "ordenar", "abierta", "oral"]);
// Nada que identifique a una alumna, a sus profesoras ni al colegio: el sitio es público.
const PRIVADO = /\b(naza|samy|kathya|contreras|marlyn|uma[ñn]a|indira|adriana|kimberly|chaves carrillo|carrasco|pancha|guadalupe)\b/i;

const lleno = x => typeof x === "string" && x.trim().length > 0;
const negritasBien = x => (x.match(/\*\*/g) || []).length % 2 === 0;
const svgSeguro = x => lleno(x) && /^\s*<svg[\s>]/.test(x) && !/<script|\son\w+\s*=|javascript:|<foreignObject|href\s*=\s*["']?https?:/i.test(x);

/** Todos los textos de un objeto, para buscar datos privados y negritas sin cerrar. */
const textos = o => typeof o === "string" ? [o] : Array.isArray(o) ? o.flatMap(textos) : o && typeof o === "object" ? Object.values(o).flatMap(textos) : [];

function revisarBloque(b, donde) {
  assert.ok(BLOQUES.has(b.t), `${donde}: bloque de tipo desconocido «${b.t}»`);
  if (b.t === "lista") assert.ok(Array.isArray(b.x) && b.x.length && b.x.every(lleno), `${donde}: lista vacía`);
  else if (b.t === "tabla") {
    assert.ok(Array.isArray(b.cab) && b.cab.length >= 2, `${donde}: tabla sin encabezado`);
    assert.ok(Array.isArray(b.filas) && b.filas.length, `${donde}: tabla sin filas`);
    b.filas.forEach((f, i) => assert.equal(f.length, b.cab.length, `${donde}: la fila ${i + 1} no tiene ${b.cab.length} celdas`));
  } else if (b.t === "svg") {
    assert.ok(svgSeguro(b.x), `${donde}: el svg tiene que empezar con <svg y no traer scripts, on…= ni enlaces`);
    assert.ok(lleno(b.alt), `${donde}: el svg necesita alt (qué muestra)`);
  } else assert.ok(lleno(b.x), `${donde}: bloque vacío`);
}

function revisarItem(it, donde) {
  assert.ok(ITEMS.has(it.t), `${donde}: item de tipo desconocido «${it.t}»`);
  if (it.fig !== undefined) assert.ok(svgSeguro(it.fig), `${donde}: fig tiene que ser un <svg> sin scripts`);
  if (it.t === "lectura") return assert.ok(lleno(it.x), `${donde}: lectura vacía`);
  assert.ok(lleno(it.p), `${donde}: falta la consigna (p)`);
  if (seCorrigeSolo(it)) assert.ok(lleno(it.e), `${donde}: falta la explicación (e) para después de entregar`);
  switch (it.t) {
    case "opcion":
      assert.ok(Array.isArray(it.o) && it.o.length >= 3 && it.o.length <= 5, `${donde}: de 3 a 5 opciones`);
      assert.ok(it.o.every(lleno), `${donde}: opción vacía`);
      assert.equal(new Set(it.o.map(o => o.trim().toLowerCase())).size, it.o.length, `${donde}: opciones repetidas`);
      assert.ok(Number.isInteger(it.r) && it.r >= 0 && it.r < it.o.length, `${donde}: r fuera de las opciones`);
      assert.ok(!it.o.some(o => /todas las anteriores|ninguna de las anteriores/i.test(o)), `${donde}: sin «todas/ninguna de las anteriores» (se barajan)`);
      break;
    case "vf": assert.equal(typeof it.r, "boolean", `${donde}: r tiene que ser true o false`); break;
    case "completar":
      assert.ok(/_{3,}/.test(it.p), `${donde}: la consigna necesita el espacio ___`);
      assert.ok(Array.isArray(it.r) && it.r.length && it.r.every(lleno), `${donde}: r = respuestas aceptadas`);
      assert.ok(calificar(it, it.r[0]).ok, `${donde}: la respuesta r[0] no se acepta a sí misma`);
      break;
    case "numero": assert.ok(leerNumero(it.r), `${donde}: r no es un número que se pueda leer`); break;
    case "expresion": {
      const e = leerExpresion(it.r);
      assert.ok(e, `${donde}: r no es una expresión que se pueda leer (sin paréntesis, potencias con ^)`);
      assert.ok(e.simplificada, `${donde}: r no está simplificada al máximo`);
      assert.ok(calificar(it, it.r).ok, `${donde}: r no se acepta a sí misma`);
      break;
    }
    case "parejas":
      assert.ok(Array.isArray(it.pares) && it.pares.length >= 3, `${donde}: al menos 3 pares`);
      assert.ok(it.pares.every(p => p.length === 2 && p.every(lleno)), `${donde}: cada par es [izq, der]`);
      assert.equal(new Set(it.pares.map(p => p[0])).size, it.pares.length, `${donde}: izquierdas repetidas`);
      break;
    case "ordenar":
      assert.ok(Array.isArray(it.x) && it.x.length >= 3 && it.x.every(lleno), `${donde}: al menos 3 frases para ordenar`);
      assert.equal(new Set(it.x).size, it.x.length, `${donde}: frases repetidas`);
      break;
    case "abierta":
    case "oral":
      assert.ok(Array.isArray(it.guia) && it.guia.length >= 2 && it.guia.every(lleno), `${donde}: la guía para corregir necesita 2 criterios o más`);
      assert.ok(lleno(it.modelo), `${donde}: falta la respuesta modelo`);
      if (it.t === "oral") assert.ok(Number.isInteger(it.seg) && it.seg >= 15 && it.seg <= 180, `${donde}: seg entre 15 y 180`);
      if (it.palabras) assert.ok(it.palabras.length === 2 && it.palabras[0] < it.palabras[1], `${donde}: palabras = [mín, máx]`);
      break;
  }
}

for (const m of materias) {
  test(`${m.emoji} ${m.nombre}: el contenido está completo y se puede corregir`, async () => {
    const { default: c } = await m.cargar();
    assert.ok(Number.isInteger(c.duracion) && c.duracion >= 30 && c.duracion <= 180, "duracion del simulacro en minutos");
    assert.ok(Array.isArray(c.temas) && c.temas.length >= 2, "al menos 2 temas");
    assert.equal(new Set(c.temas.map(t => t.id)).size, c.temas.length, "ids de temas repetidos");
    for (const t of c.temas) {
      const d = `${m.id}/${t.id}`;
      assert.ok(/^[a-z0-9-]+$/.test(t.id), `${d}: id con minúsculas, números y guiones`);
      assert.ok(lleno(t.titulo), `${d}: falta el título`);
      assert.ok(Array.isArray(t.indicadores) && t.indicadores.length && t.indicadores.every(lleno), `${d}: faltan los indicadores del temario`);
      assert.ok(Array.isArray(t.materia) && t.materia.length >= 4, `${d}: la materia necesita al menos 4 bloques`);
      t.materia.forEach((b, i) => revisarBloque(b, `${d} materia ${i + 1}`));
      assert.ok(Array.isArray(t.cuaderno) && t.cuaderno.length >= 4, `${d}: al menos 4 tareas de cuaderno`);
      t.cuaderno.forEach((k, i) => {
        assert.ok(TAREAS.has(k.tipo), `${d} tarea ${i + 1}: tipo desconocido «${k.tipo}»`);
        assert.ok(lleno(k.x), `${d} tarea ${i + 1}: vacía`);
      });
      const tipos = new Set(t.cuaderno.map(k => k.tipo));
      assert.ok(tipos.has("copiar") || tipos.has("resumir"), `${d}: falta una tarea de copiar o resumir`);
      assert.ok(tipos.has("buscar"), `${d}: falta una tarea de buscar en el cuaderno`);
      assert.ok(tipos.has("moverse") || tipos.has("decir"), `${d}: falta una tarea de moverse (o de decir en voz alta)`);
      assert.ok(Array.isArray(t.practica), `${d}: falta la práctica`);
      t.practica.forEach((it, i) => revisarItem(it, `${d} práctica ${i + 1}`));
      const solas = t.practica.filter(seCorrigeSolo).length, orales = t.practica.filter(i => i.t === "oral").length;
      assert.ok(solas + orales >= 12, `${d}: la práctica necesita al menos 12 preguntas (tiene ${solas + orales})`);
    }
    assert.ok(Array.isArray(c.simulacros) && c.simulacros.length >= 2, "al menos 2 simulacros");
    const consignas = new Set(c.temas.flatMap(t => t.practica.map(i => i.p).filter(Boolean)));
    c.simulacros.forEach((s, k) => {
      const d = `${m.id} simulacro ${k + 1}`;
      assert.ok(lleno(s.nombre), `${d}: falta el nombre`);
      assert.ok(Array.isArray(s.partes) && s.partes.length >= 2, `${d}: al menos 2 partes`);
      s.partes.forEach((p, j) => {
        assert.ok(lleno(p.titulo) && lleno(p.instrucciones), `${d} parte ${j + 1}: título e instrucciones`);
        assert.ok(Array.isArray(p.items) && p.items.length, `${d} parte ${j + 1}: sin preguntas`);
        p.items.forEach((it, i) => revisarItem(it, `${d} parte ${j + 1} item ${i + 1}`));
      });
      const items = s.partes.flatMap(p => p.items);
      const total = items.reduce((a, it) => a + puntosDe(it), 0);
      assert.ok(total >= 25, `${d}: vale ${total} puntos; tiene que valer al menos 25`);
      const copiadas = items.filter(it => it.p && it.t !== "oral" && consignas.has(it.p)).length;
      assert.ok(copiadas <= 2, `${d}: ${copiadas} preguntas son iguales a las de la práctica (el simulacro tiene que ser nuevo)`);
    });
    const [a, b] = c.simulacros.map(s => new Set(s.partes.flatMap(p => p.items.map(i => i.p || i.x))));
    assert.ok([...a].filter(x => b.has(x)).length <= 2, "los dos simulacros tienen que ser distintos");
    const todo = textos(c);
    const privado = todo.find(x => PRIVADO.test(x));
    assert.equal(privado, undefined, `dato privado en el contenido: «${privado?.slice(0, 80)}»`);
    const malas = todo.filter(x => !negritasBien(x));
    assert.deepEqual(malas.map(x => x.slice(0, 60)), [], "**negrita** sin cerrar");
  });
}
