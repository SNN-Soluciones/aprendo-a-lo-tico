import { test } from "node:test";
import assert from "node:assert/strict";
import { MATERIAS_EXAMEN, temasPara, armarExamen, revisar, nota } from "../../public/js/examen-temas.js";
import { ESPANOL_2, CIENCIAS_2, SOCIALES_2, MATE_2, INGLES_2 } from "../../public/js/temario-2.js";
import { azar, SEMILLA, noVacio } from "./_azar.mjs";

const POR_GRADO = 30;
const TEMARIO_2 = { espanol: ESPANOL_2, ciencias: CIENCIAS_2, sociales: SOCIALES_2, mate: MATE_2, ingles: INGLES_2 };

/** Problemas de una pregunta de examen (vacía = bien). */
function revisarPreguntaExamen(q) {
  const mal = [];
  if (typeof q.texto !== "string" || !q.texto.trim()) mal.push("texto vacío");
  if (q.tipo !== "opcion" && q.tipo !== "numero") mal.push(`tipo «${q.tipo}»`);
  if (q.tipo === "opcion") {
    if (!Array.isArray(q.opciones) || !q.opciones.includes(q.correcta)) mal.push(`la correcta «${q.correcta}» no está entre ${JSON.stringify(q.opciones)}`);
    else if (new Set(q.opciones).size !== q.opciones.length) mal.push(`opciones repetidas: ${JSON.stringify(q.opciones)}`);
  }
  if (typeof q.explica !== "string" || !q.explica.trim()) mal.push("explicación vacía");
  if (!revisar(q, q.correcta)) mal.push(`revisar() no acepta la correcta «${q.correcta}»`);
  return mal;
}

test("examen-temas suma todos los temas del temario de 2° a su materia", () => {
  // Act
  const faltan = Object.entries(TEMARIO_2).flatMap(([materia, temas]) => {
    const enMateria = MATERIAS_EXAMEN.find(m => m.id === materia).temas;
    return temas.filter(t => !enMateria.includes(t)).map(t => `${materia}: ${t.id}`);
  });
  // Assert
  assert.deepEqual(faltan, []);
});

test("los temas del examen tienen ids únicos y grados entre 1° y 6°", () => {
  // Arrange
  const temas = MATERIAS_EXAMEN.flatMap(m => m.temas);
  // Act
  const ids = temas.map(t => t.id);
  const gradosRaros = temas.filter(t => !t.grados.length || t.grados.some(g => !Number.isInteger(g) || g < 1 || g > 6)).map(t => t.id);
  // Assert
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(gradosRaros, []);
});

noVacio(MATERIAS_EXAMEN, "MATERIAS_EXAMEN").forEach(materia => {
  materia.temas.forEach((tema, t) => {
    test(`examen de ${materia.nombre}, tema «${tema.id}» (${tema.grados.join("°, ")}°): ${POR_GRADO} preguntas por grado con texto, la correcta entre opciones distintas y que revisar() acepta`, () => {
      // Arrange
      const mal = [];
      // Act
      for (const g of tema.grados) {
        const semilla = SEMILLA + 1000 * t + g, rnd = azar(semilla);
        for (let k = 0; k < POR_GRADO; k++) {
          const q = tema.pregunta(rnd, g, "");
          for (const m of revisarPreguntaExamen(q)) mal.push(`${g}° (semilla ${semilla}, pregunta ${k + 1}): ${m} · ${String(q.texto).slice(0, 90)}`);
        }
      }
      // Assert
      assert.deepEqual(mal.slice(0, 10), []);
    });
  });
});

test("las cuentas del examen (sumas, restas, multiplicación y división) dan el resultado de la operación que está escrita", () => {
  // Arrange: se lee la operación del texto («1 250 + 37 = ?») y se calcula aparte
  const OPERACIONES = { sumas: ["+", (a, b) => a + b], restas: ["−", (a, b) => a - b], multiplicacion: ["×", (a, b) => a * b], division: ["÷", (a, b) => a / b] };
  const mate = MATERIAS_EXAMEN.find(m => m.id === "mate").temas;
  const numero = s => Number(s.replace(/\D/g, ""));
  const mal = [];
  // Act
  for (const [id, [signo, calcular]] of Object.entries(OPERACIONES)) {
    const tema = mate.find(t => t.id === id);
    for (const g of tema.grados) {
      const semilla = SEMILLA + g, rnd = azar(semilla);
      for (let k = 0; k < POR_GRADO; k++) {
        const q = tema.pregunta(rnd, g, "");
        const [izq, der] = q.texto.replace("= ?", "").split(signo);
        const esperado = calcular(numero(izq), numero(der));
        if (!Number.isInteger(esperado) || esperado <= 0 || String(esperado) !== q.correcta) mal.push(`${id} ${g}° (semilla ${semilla}): «${q.texto}» da ${esperado}, correcta ${q.correcta}`);
      }
    }
  }
  // Assert
  assert.deepEqual(mal.slice(0, 10), []);
});

test("las preguntas de examen que usan el nombre del niño siguen bien armadas con un nombre", () => {
  // Arrange
  const tema = MATERIAS_EXAMEN.find(m => m.id === "mate").temas.find(t => t.id === "problemas");
  const rnd = azar(SEMILLA);
  // Act
  const mal = tema.grados.flatMap(g => Array.from({ length: POR_GRADO }, () => revisarPreguntaExamen(tema.pregunta(rnd, g, "Valeria"))).flat());
  // Assert
  assert.deepEqual(mal, []);
});

test("la serie de comprensión lectora trae varias preguntas sobre un mismo texto, todas bien armadas", () => {
  // Arrange
  const lectura = MATERIAS_EXAMEN.flatMap(m => m.temas).find(t => t.serie);
  const rnd = azar(SEMILLA);
  const mal = [];
  // Act
  for (const g of lectura.grados) for (let k = 0; k < 10; k++) {
    const serie = lectura.serie(rnd, g, "");
    if (serie.length < 2) mal.push(`${g}°: solo ${serie.length} preguntas`);
    for (const q of serie) mal.push(...revisarPreguntaExamen(q));
  }
  // Assert
  assert.deepEqual(mal, []);
});

noVacio(MATERIAS_EXAMEN, "MATERIAS_EXAMEN").forEach(materia => {
  test(`armarExamen de ${materia.nombre} da 5 preguntas distintas por tema, en cada grado`, () => {
    // Arrange
    const rnd = azar(SEMILLA);
    const mal = [];
    // Act
    for (let g = 1; g <= 6; g++) {
      const temas = temasPara(materia.id, g).map(t => t.id);
      for (const { tema, preguntas } of armarExamen({ materia: materia.id, grado: g, temas, porTema: 5 }, rnd)) {
        if (preguntas.length !== 5) mal.push(`${g}° ${tema.id}: ${preguntas.length} preguntas`);
        if (new Set(preguntas.map(q => `${q.texto}\n${q.correcta}`)).size !== preguntas.length) mal.push(`${g}° ${tema.id}: preguntas repetidas`);
        if (preguntas.some(q => q.tema !== tema.id)) mal.push(`${g}° ${tema.id}: pregunta marcada con otro tema`);
      }
    }
    // Assert
    assert.deepEqual(mal, []);
  });
});

test("revisar() del examen no acepta una respuesta vacía ni una opción equivocada", () => {
  // Arrange
  const q = { tipo: "opcion", opciones: ["A", "B", "C"], correcta: "B", texto: "¿?", explica: "." };
  // Act / Assert
  assert.equal(revisar(q, "B"), true);
  assert.equal(revisar(q, "A"), false);
  assert.equal(revisar(q, ""), false);
  assert.equal(revisar(q, undefined), false);
});

test("revisar() del examen acepta los números con miles, coma decimal o signo de colones", () => {
  // Arrange
  const miles = { tipo: "numero", correcta: "1250" };
  const decimal = { tipo: "numero", correcta: "2.5" };
  // Act / Assert
  assert.equal(revisar(miles, "1.250"), true);
  assert.equal(revisar(miles, "₡1250"), true);
  assert.equal(revisar(miles, "1 250"), true);
  assert.equal(revisar(miles, "1251"), false);
  assert.equal(revisar(decimal, "2,5"), true);
});

test("nota del examen va de 0 a 100, redondeada", () => {
  // Act / Assert
  assert.equal(nota(0, 5), 0);
  assert.equal(nota(7, 10), 70);
  assert.equal(nota(2, 3), 67);
  assert.equal(nota(5, 5), 100);
});
