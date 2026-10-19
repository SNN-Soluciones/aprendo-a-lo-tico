// 📝 Temas para «Preparate para el examen». Cada tema: para qué grados es y cómo arma una pregunta al azar.
// Una pregunta es:
//   { texto, tipo: "opcion" | "numero", opciones?: [texto], correcta: texto, explica, voz? }
// En las de "numero" el niño escribe la respuesta; en las de "opcion", la elige.
// `g` es el grado (1 a 6): la dificultad crece con el grado. `nombre` se usa en los problemas.
import { ESTADOS, COSAS, CAMBIOS, SITUACIONES } from "./estados.js";
import { ECOS, SERES, LUGARES } from "./ecosistemas.js";
import { CABECERAS } from "./generador-datos.js";
import { PARTES as PLANTA, COMIDAS } from "./planta.js";
import { SIMBOLOS, titulo as tituloSimbolo } from "./simbolos.js";
import { PARTES as ESCUDO } from "./escudo.js";
import { FECHAS } from "./efemerides.js";
import { TEMAS as VOCAB } from "./memory-en.js";
import { TODAS as ORTO, regla } from "./ortografia.js";
import { SIGNOS, signoDe, sinSignos } from "./oraciones.js";
import { frases, fraseSigno, fraseMayus } from "./generador-frases.js";
import { ANIMALES } from "./detective.js";
// Juegos del MEP para 2° a 6°: de ahí salen los temas nuevos (datos y preguntas que sirven en papel)
import { igual } from "./quiz.js";
import { RUTAS, hora, dur, DIAS } from "./bus.js";
import { TEMAS as ENCUESTAS, CONFITES } from "./graficos.js";
import { CLASES, ronda as rondaPalabras } from "./palabras.js";
import { PALABRAS as ACENTOS, TIPOS as TIPOS_ACENTO, porQueTilde, porQueTipo, porQueSilabas, marcada, quitarTildes } from "./acentos.js";
import { TEXTOS, prepararPreguntas, explicacion as explicacionCuento } from "./cuentos.js";
import { PARTES, SISTEMAS, ORGANICOS, RECORRIDOS, sentidoUso, habitoSiNo, habitoCual, concepto } from "./cuerpo.js";
import { pregunta as preguntaCadena } from "./cadenas.js";
import { HECHOS, MODOS as MODOS_HISTORIA, preguntaDeModo } from "./historia.js";
// Lote 4: juegos que traen su propia pregunta de examen
import { preguntaExamen as preguntaPlata } from "./plata.js";
import { preguntaExamen as preguntaMedidas } from "./medidas.js";
import { preguntaExamen as preguntaComunidad } from "./comunidad.js";
import { preguntaExamen as preguntaGeometria } from "./geometria.js";

// ---------- Ayudas ----------
const ent = (a, b, r) => a + Math.floor(r() * (b - a + 1));
const elegir = (arr, r) => arr[Math.floor(r() * arr.length)];
function barajar(arr, r) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const miles = n => n.toLocaleString("es-CR");
/** Opciones: la correcta y otras distintas (sin repetir), en desorden. */
function opciones(correcta, otras, r, n = 3) {
  const unicas = [...new Set(otras.map(String))].filter(o => o !== String(correcta));
  return barajar([String(correcta), ...barajar(unicas, r).slice(0, n - 1)], r);
}
const num = (texto, correcta, explica) => ({ texto, tipo: "numero", correcta: String(correcta), explica });
const opc = (texto, correcta, otras, explica, r, n) => ({ texto, tipo: "opcion", opciones: opciones(correcta, otras, r, n), correcta: String(correcta), explica });
const cercanos = (n, r, d = [1, 2, 10]) => d.flatMap(x => [n + x, n - x]).filter(x => x >= 0);
const quien = (nombre, r) => nombre || elegir(["Sofía", "Mateo", "Valeria", "Diego", "Camila"], r);

// Tamaño de los números según el grado
const tope = g => [0, 20, 100, 1000, 10000, 100000, 1000000][g];

// ================= TEMAS QUE VIENEN DE LOS JUEGOS DE 2° A 6° =================
// En papel no hay nada que tocar: los dibujos se cuentan con palabras y las preguntas de los juegos
// se pasan a { texto, tipo, opciones, correcta, explica }.

/** HTML de un juego → texto: las etiquetas se saltan copiando letra por letra (sin regex); <br> y </div> son saltos de línea. */
function aTexto(html) {
  let s = "", dentro = false, tag = "";
  for (const c of String(html ?? "")) {
    if (dentro) {
      if (c === ">") { dentro = false; s += /^(br|\/div|\/p|\/li)\b/i.test(tag.trim()) ? "\n" : " "; }
      else tag += c;
    } else if (c === "<") { dentro = true; tag = ""; }
    else s += c;
  }
  return s.split("\n").map(l => l.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
}
const enUnaLinea = t => aTexto(t).replace(/\n/g, " ");
const conSaltos = t => aTexto(t).split("\n").join(" <br>");
// Las explicaciones de los juegos a veces traen dibujos (fichas de la cadena…): en el examen van como texto
const limpiaExplica = e => /class=|<div|<svg|<table/.test(e || "") ? conSaltos(e) : (e || "");

/** Pregunta con opciones de un juego ({ html|voz, opciones: [{ id, html }], correcta, explica|bien }) → pregunta de examen. */
function deJuego(q, r, texto) {
  if (!q || !Array.isArray(q.opciones) || q.correcta === undefined) return null;
  const ops = q.opciones.map(o => enUnaLinea(o.html));
  const i = q.opciones.findIndex(o => o.id === q.correcta);
  if (i < 0 || ops.some(o => !o) || new Set(ops).size !== ops.length) return null;
  return { texto: texto ?? conSaltos(q.html || q.instr || q.voz), tipo: "opcion", opciones: barajar(ops, r), correcta: ops[i],
    explica: limpiaExplica(q.explica || q.bien || q.opciones[i].por || "") };
}
/** Prueba un generador hasta que dé una pregunta que sirva en papel; si no, usa el plan B. */
function intentar(gen, planB, n = 30) {
  for (let k = 0; k < n; k++) { const q = gen(); if (q) return q; }
  return planB();
}

const cap = t => t.charAt(0).toUpperCase() + t.slice(1);

// ---------- 🍕 Fracciones (3° a 6°) ----------
const fr = (n, d) => `${n}/${d}`;
const mcd = (a, b) => (b ? mcd(b, a % b) : a);
/** Opciones de fracciones: se quitan las que valen lo mismo que la correcta (2/4 y 1/2) o no tienen sentido. */
function opcFr(texto, [n, d], malas, explica, r, cuantas = 4) {
  const otras = malas.filter(([a, b]) => a > 0 && b > 0 && a * d !== n * b).map(([a, b]) => fr(a, b));
  return opc(texto, fr(n, d), otras, explica, r, cuantas);
}
const sobranTxt = k => (k === 1 ? "sobra 1" : `sobran ${k}`);
const GRUPO_FR = [["mangos", "🥭"], ["naranjas", "🍊"], ["huevos", "🥚"], ["fresas", "🍓"], ["confites", "🍬"], ["lápices", "✏️"]];
function fracciones(r, g) {
  const tipo = elegir({ 3: ["pintada", "grupo", "comparar"], 4: ["pintada", "grupo", "equivalente", "sumar", "comparar"],
    5: ["equivalente", "sumar", "comparar2", "mixto", "grupo"], 6: ["simplificar", "sumar2", "comparar2", "mixto", "grupo"] }[g] || ["pintada"], r);
  if (tipo === "pintada") {
    const d = ent(2, g <= 3 ? 8 : 10, r), n = ent(1, d - 1, r);
    return opcFr(`¿Qué fracción está pintada de verde? ${"🟩".repeat(n)}${"⬜".repeat(d - n)}`, [n, d], [[d - n, d], [n, d + 1], [d, n], [n + 1, d], [n, d - n]],
      `Hay ${d} partes iguales y ${n} pintadas: ${fr(n, d)}. Abajo va el total de partes; arriba, las pintadas.`, r);
  }
  if (tipo === "grupo") {
    const d = g <= 3 ? elegir([2, 3, 4], r) : ent(2, g >= 5 ? 10 : 6, r), n = g <= 3 ? 1 : ent(1, d - 1, r), k = d * ent(2, g <= 3 ? 5 : 9, r);
    const [cosas, e] = elegir(GRUPO_FR, r), parte = k / d;
    return num(`${e} ¿Cuánto es ${fr(n, d)} de ${k} ${cosas}?`, parte * n,
      `${k} ÷ ${d} = ${parte}: eso es ${fr(1, d)}.${n > 1 ? ` Y ${parte} × ${n} = ${parte * n}.` : ""}`);
  }
  if (tipo === "comparar") {
    const d = ent(3, 10, r), a = ent(1, d - 1, r); let b; do b = ent(1, d - 1, r); while (b === a);
    return opc(`¿Cuál fracción es mayor: ${fr(a, d)} o ${fr(b, d)}?`, fr(Math.max(a, b), d), [fr(Math.min(a, b), d)],
      `Tienen el mismo denominador (${d} partes iguales): es mayor la que tiene más partes, ${fr(Math.max(a, b), d)}.`, r, 2);
  }
  if (tipo === "equivalente") {
    const d = elegir([2, 3, 4, 5], r), n = ent(1, d - 1, r), k = ent(2, g >= 5 ? 5 : 4, r);
    return r() < 0.5
      ? num(`¿Qué número falta? ${fr(n, d)} = ?/${d * k}`, n * k, `${d} × ${k} = ${d * k}, así que arriba también se multiplica por ${k}: ${n} × ${k} = ${n * k}. ${fr(n, d)} = ${fr(n * k, d * k)}.`)
      : num(`¿Qué número falta? ${fr(n * k, d * k)} = ?/${d}`, n, `${d * k} ÷ ${k} = ${d}, así que arriba también se divide entre ${k}: ${n * k} ÷ ${k} = ${n}. ${fr(n * k, d * k)} = ${fr(n, d)}.`);
  }
  if (tipo === "sumar") {
    const d = ent(4, 12, r), s = ent(2, d - 1, r), a = ent(1, s - 1, r), b = s - a;
    if (r() < 0.4) return opcFr(`${fr(s, d)} − ${fr(a, d)} = ?`, [b, d], [[s + a, d], [b, d * 2], [b + 1, d], [s, d]],
      `Con el mismo denominador se restan solo los de arriba: ${s} − ${a} = ${b}. El denominador sigue siendo ${d}: ${fr(b, d)}.`, r);
    return opcFr(`${fr(a, d)} + ${fr(b, d)} = ?`, [s, d], [[s, d * 2], [s - 1, d], [s + 1, d], [a * b, d]],
      `Con el mismo denominador se suman solo los de arriba: ${a} + ${b} = ${s}. El denominador sigue siendo ${d}: ${fr(s, d)}.`, r);
  }
  if (tipo === "comparar2") {
    let a, b, c, e, k = 0;
    do { b = ent(2, 9, r); e = ent(2, 9, r); a = ent(1, b - 1, r); c = ent(1, e - 1, r); } while ((b === e || a * e === c * b) && ++k < 60);
    if (b === e || a * e === c * b) { a = 2; b = 3; c = 3; e = 5; }
    const primeraMayor = a * e > c * b, mayor = primeraMayor ? fr(a, b) : fr(c, e);
    return opc(`¿Cuál fracción es mayor: ${fr(a, b)} o ${fr(c, e)}?`, mayor, [primeraMayor ? fr(c, e) : fr(a, b)],
      `Se pasan al mismo denominador (${b * e}): ${fr(a, b)} = ${fr(a * e, b * e)} y ${fr(c, e)} = ${fr(c * b, b * e)}. Es mayor ${mayor}.`, r, 2);
  }
  if (tipo === "mixto") {
    const d = ent(2, 8, r), e = ent(1, 3, r); let n; do n = ent(1, d - 1, r); while (mcd(n, d) !== 1);
    const imp = e * d + n, enteros = e === 1 ? "1 entero" : `${e} enteros`;
    return r() < 0.5
      ? opc(`¿Cómo se escribe ${fr(imp, d)} como número mixto?`, `${e} y ${fr(n, d)}`, [`${e + 1} y ${fr(n, d)}`, `${n} y ${fr(e, d)}`, `${e} y ${fr(d - n, d)}`, `${e} y ${fr(n, imp)}`],
        `${imp} ÷ ${d} = ${e} y ${sobranTxt(n)}: son ${enteros} y ${fr(n, d)}.`, r)
      : num(`¿Qué número falta? ${e} y ${fr(n, d)} = ?/${d}`, imp, `${e} × ${d} = ${e * d}, más ${n}: ${imp}. Entonces ${e} y ${fr(n, d)} = ${fr(imp, d)}.`);
  }
  if (tipo === "simplificar") {
    let n, d; do { d = ent(2, 9, r); n = ent(1, d - 1, r); } while (mcd(n, d) !== 1);
    const k = ent(2, 5, r);
    return opcFr(`¿Cómo queda ${fr(n * k, d * k)} simplificada al máximo?`, [n, d], [[n * k, d], [n, d * k], [n + 1, d], [n, d + 1]],
      `Se dividen arriba y abajo entre ${k}: ${n * k} ÷ ${k} = ${n} y ${d * k} ÷ ${k} = ${d}. Queda ${fr(n, d)}.`, r);
  }
  // sumar2: denominadores distintos, uno múltiplo del otro (½ + ¼)
  const b = elegir([2, 3, 4, 5], r), k = ent(2, 3, r), e = b * k, a = ent(1, b - 1, r), c = ent(1, e - 1, r);
  const arriba = a * k + c, m = mcd(arriba, e), res = [arriba / m, e / m];
  return opcFr(`${fr(a, b)} + ${fr(c, e)} = ?`, res, [[a + c, b + e], [a + c, e], [arriba + 1, e], [arriba, e * 2]],
    `Se pasa ${fr(a, b)} a ${e} partes: ${fr(a * k, e)}. Entonces ${fr(a * k, e)} + ${fr(c, e)} = ${fr(arriba, e)}${m > 1 ? `, que simplificada es ${fr(...res)}` : ""}.`, r);
}

// ---------- 🥭 División con residuo (3° y 4°) ----------
// [lo que se reparte, entre qué (plural), una de esas (con artículo)]
const REPARTOS = [["lápices", "mesas", "cada mesa"], ["mangos", "canastas", "cada canasta"], ["confites", "niños", "cada niño"],
  ["cuadernos", "grupos", "cada grupo"], ["naranjas", "bolsas", "cada bolsa"], ["galletas", "platos", "cada plato"]];
function divisionResiduo(r, g) {
  const d = ent(2, g <= 3 ? 5 : 9, r), q = ent(2, g <= 3 ? 9 : 12, r), resto = ent(1, d - 1, r), n = d * q + resto;
  const tipo = elegir(g <= 3 ? ["cociente", "residuo", "reparto"] : ["cociente", "residuo", "reparto", "uno-mas", "completos"], r);
  const cuenta = `${n} ÷ ${d} = ${q} y ${sobranTxt(resto)}. Comprobación: ${d} × ${q} + ${resto} = ${n}.`;
  if (tipo === "cociente") return num(`${n} ÷ ${d} = ? (escribí el cociente; puede sobrar algo)`, q, cuenta);
  if (tipo === "residuo") return num(`¿Cuál es el residuo de ${n} ÷ ${d}? (lo que sobra)`, resto, `${cuenta} El residuo es ${resto}.`);
  if (tipo === "reparto") {
    const [cosas, entre, cada] = elegir(REPARTOS, r);
    return num(`Se reparten ${n} ${cosas} entre ${d} ${entre}, en partes iguales. ¿Cuántos le tocan a ${cada}?`, q, `${cuenta} A ${cada} le tocan ${q}.`);
  }
  if (tipo === "uno-mas") return num(`Van ${n} personas al paseo y en cada carro caben ${d}. ¿Cuántos carros se necesitan para que vayan todas?`, q + 1,
    `${n} ÷ ${d} = ${q} y ${sobranTxt(resto)}: con ${q} carros ${resto === 1 ? "se queda 1 persona" : `se quedan ${resto} personas`} sin campo, así que hace falta uno más: ${q + 1} carros.`);
  return num(`Con ${n} huevos, ¿cuántas cajitas de ${d} huevos se llenan completas?`, q, `${cuenta} Se llenan ${q} cajitas y ${sobranTxt(resto)} huevos.`.replace("sobra 1 huevos", "sobra 1 huevo"));
}

// ---------- 🚌 Tiempo transcurrido (2° a 5°) ----------
const durTxt = m => [Math.floor(m / 60) ? `${Math.floor(m / 60)} ${m >= 120 ? "horas" : "hora"}` : "", m % 60 ? `${m % 60} minutos` : ""].filter(Boolean).join(" y ");
function tiempo(r, g) {
  const tipo = elegir({ 2: ["mas", "mas", "fijos"], 3: ["llega", "duro", "mas"], 4: ["llega", "duro", "aMin", "aHoras"], 5: ["ampm", "duro", "aHoras", "dias", "semana"] }[g] || ["mas"], r);
  if (tipo === "fijos") {
    const [t, c, e] = elegir([["¿Cuántos minutos tiene una hora?", 60, "Una hora tiene 60 minutos."], ["¿Cuántos minutos son media hora?", 30, "Media hora es la mitad de 60 minutos: 30 minutos."],
      ["¿Cuántos minutos son un cuarto de hora?", 15, "Un cuarto de hora es 60 ÷ 4 = 15 minutos."], ["¿Cuántas horas tiene un día?", 24, "Un día tiene 24 horas."]], r);
    return num(t, c, e);
  }
  if (tipo === "mas") {
    const t = (g <= 2 ? ent(12, 22, r) * 30 : ent(72, 132, r) * 5), m = elegir(g <= 2 ? [15, 30] : [10, 15, 20, 25, 30, 45], r);
    const fin = t + m, hh = Math.floor(t / 60), sinLlevar = `${hh > 12 ? hh - 12 : hh}:${String((t + m) % 60).padStart(2, "0")}`;
    return opc(`Son las ${hora(t)}. ¿Qué hora será dentro de ${m} minutos?`, hora(fin), [hora(fin + 5), hora(fin - 5), hora(fin + 60), sinLlevar, hora(t - m)],
      `${hora(t)} y ${m} minutos más: ${hora(fin)}.${(t % 60) + m >= 60 ? " Al pasar de 60 minutos se suma una hora." : ""}`, r);
  }
  if (tipo === "llega") {
    const ruta = elegir(RUTAS.filter(x => x.d[1] <= (g <= 3 ? 75 : 300)), r), d = ent(Math.ceil(ruta.d[0] / 5), Math.floor(ruta.d[1] / 5), r) * 5;
    const t = ent(66, Math.max(66, Math.floor((715 - d) / 5)), r) * 5, fin = t + d;
    return opc(`El bus sale de ${ruta.de} a las ${hora(t)} y el viaje dura ${durTxt(d)}. ¿A qué hora llega a ${ruta.a}?`, hora(fin),
      [hora(fin + 10), hora(fin - 10), hora(fin + 60), hora(fin - 60)], `${hora(t)} + ${dur(d)} = ${hora(fin)}.`, r);
  }
  if (tipo === "duro") {
    const d = g <= 3 ? ent(4, 11, r) * 5 : ent(14, 40, r) * 5, t = ent(66, Math.floor((715 - d) / 5), r) * 5;
    if (g <= 3) return num(`Un bus salió a las ${hora(t)} y llegó a las ${hora(t + d)}. ¿Cuántos minutos duró el viaje?`, d, `De ${hora(t)} a ${hora(t + d)} pasan ${d} minutos.`);
    return opc(`Un bus salió a las ${hora(t)} y llegó a las ${hora(t + d)}. ¿Cuánto duró el viaje?`, dur(d), [dur(d + 60), dur(d - 10), dur(d + 10), dur(Math.max(5, d - 60))],
      `De ${hora(t)} a ${hora(t + d)} pasan ${dur(d)}.`, r);
  }
  if (tipo === "aMin") { const h = ent(1, 3, r), m = ent(1, 11, r) * 5; return num(`¿Cuántos minutos son ${h} ${h === 1 ? "hora" : "horas"} y ${m} minutos?`, h * 60 + m, `${h} × 60 = ${h * 60}, y ${h * 60} + ${m} = ${h * 60 + m} minutos.`); }
  if (tipo === "aHoras") {
    const x = ent(13, 47, r) * 5, cien = x % 100 < 60 && x >= 100 ? dur(Math.floor(x / 100) * 60 + (x % 100)) : dur(x + 30);
    return opc(`¿Cuántas horas y minutos son ${x} minutos?`, dur(x), [dur(x + 60), cien, dur(x - 10), dur(x + 10)], `Una hora tiene 60 minutos: ${x} = ${Math.floor(x / 60)} × 60 + ${x % 60}, o sea ${dur(x)}.`, r);
  }
  if (tipo === "ampm") {
    const t = ent(108, 150, r) * 5, d = ent(12, 36, r) * 5, fin = t + d;
    return opc(`Un bus sale a las ${hora(t, true)} y el viaje dura ${dur(d)}. ¿A qué hora llega?`, hora(fin, true),
      [hora(fin, false) + (fin < 720 ? " p. m." : " a. m."), hora(fin + 60, true), hora(fin - 60, true), hora(fin + 30, true)],
      `${hora(t, true)} + ${dur(d)} = ${hora(fin, true)}. Después de las 12 del mediodía es p. m.`, r);
  }
  if (tipo === "dias") {
    const s = ent(1, 5, r), dd = ent(1, 6, r);
    return r() < 0.5
      ? num(`¿Cuántos días son ${s} ${s === 1 ? "semana" : "semanas"} y ${dd} ${dd === 1 ? "día" : "días"}?`, s * 7 + dd, `Una semana tiene 7 días: ${s} × 7 = ${s * 7}, y ${s * 7} + ${dd} = ${s * 7 + dd} días.`)
      : num(`¿Cuántas semanas completas hay en ${s * 7 + dd} días?`, s, `${s * 7 + dd} ÷ 7 = ${s} y ${sobranTxt(dd)} días: ${s} semanas completas.`.replace("sobra 1 días", "sobra 1 día"));
  }
  const hoy = ent(0, 6, r); let mas; do mas = ent(3, 20, r); while (mas % 7 === 0);
  const dia = DIAS[(hoy + mas) % 7];
  return opc(`Hoy es ${DIAS[hoy]}. ¿Qué día de la semana será dentro de ${mas} días?`, dia, DIAS.filter(x => x !== dia),
    `${mas >= 7 ? `Cada 7 días vuelve a ser ${DIAS[hoy]}; ` : ""}${mas} = ${Math.floor(mas / 7)} × 7 + ${mas % 7}: contamos ${mas % 7} ${mas % 7 === 1 ? "día" : "días"} después del ${DIAS[hoy]} y llegamos al ${dia}.`, r);
}

// ---------- 📐 Perímetro y área (3° a 6°) ----------
function perimetroArea(r, g) {
  const u = elegir(["m", "cm"], r);
  const tipo = elegir({ 3: ["pRect", "pCuad", "pTri"], 4: ["pRect", "aRect", "aCuad", "concepto"], 5: ["aL", "aTri", "aRect", "pRect"], 6: ["cerca", "ceramica", "pared", "aL", "aTri"] }[g] || ["pRect"], r);
  const a = ent(3, g >= 5 ? 20 : 12, r), b = ent(2, a - 1, r);
  if (tipo === "pRect") return num(`Un rectángulo mide ${a} ${u} de largo y ${b} ${u} de ancho. ¿Cuál es su perímetro (en ${u})?`, 2 * (a + b), `El perímetro es el borde: ${a} + ${b} + ${a} + ${b} = ${2 * (a + b)} ${u}.`);
  if (tipo === "pCuad") return num(`Un cuadrado mide ${a} ${u} de lado. ¿Cuál es su perímetro (en ${u})?`, 4 * a, `Tiene 4 lados iguales: 4 × ${a} = ${4 * a} ${u}.`);
  if (tipo === "pTri") { const c = ent(Math.abs(a - b) + 1, a + b - 1, r); return num(`Un triángulo tiene lados de ${a} ${u}, ${b} ${u} y ${c} ${u}. ¿Cuál es su perímetro (en ${u})?`, a + b + c, `Se suman los tres lados: ${a} + ${b} + ${c} = ${a + b + c} ${u}.`); }
  if (tipo === "aRect") return num(`Un rectángulo mide ${a} ${u} de largo y ${b} ${u} de ancho. ¿Cuál es su área (en ${u}²)?`, a * b, `Área = largo × ancho: ${a} × ${b} = ${a * b} ${u}².`);
  if (tipo === "aCuad") return num(`Un cuadrado mide ${b} ${u} de lado. ¿Cuál es su área (en ${u}²)?`, b * b, `Área = lado × lado: ${b} × ${b} = ${b * b} ${u}².`);
  if (tipo === "concepto") {
    const [t, c, m] = elegir([["¿Qué mide el perímetro de un terreno?", "El borde (lo que lleva la cerca)", "Todo lo de adentro (donde se siembra)"],
      ["¿Qué mide el área de un terreno?", "Todo lo de adentro (donde se siembra)", "El borde (lo que lleva la cerca)"]], r);
    return opc(t, c, [m, "La altura del terreno"], "El perímetro es el borde y se mide en metros; el área es lo de adentro y se mide en metros cuadrados (m²).", r);
  }
  if (tipo === "aL") {
    const c = ent(2, 9, r), d = ent(2, 9, r);
    return num(`Un terreno en forma de L se forma con dos rectángulos: uno de ${a} m × ${b} m y otro de ${c} m × ${d} m. ¿Cuál es el área del terreno (en m²)?`, a * b + c * d,
      `Se parte en dos rectángulos y se suman: ${a} × ${b} = ${a * b} y ${c} × ${d} = ${c * d}; ${a * b} + ${c * d} = ${a * b + c * d} m².`);
  }
  if (tipo === "aTri") {
    const base = ent(2, 12, r) * 2, h = ent(2, 12, r);
    return num(`Un triángulo tiene ${base} ${u} de base y ${h} ${u} de altura. ¿Cuál es su área (en ${u}²)?`, base * h / 2, `Área = base × altura ÷ 2: ${base} × ${h} = ${base * h}, y ${base * h} ÷ 2 = ${base * h / 2} ${u}².`);
  }
  if (tipo === "cerca") {
    const L = ent(10, 40, r), A = ent(5, L - 1, r), precio = elegir([650, 750, 850, 950], r), per = 2 * (L + A);
    return num(`Un potrero rectangular mide ${L} m de largo y ${A} m de ancho. El metro de alambre cuesta ₡${miles(precio)}. ¿Cuántos colones cuesta darle una vuelta de alambre?`, per * precio,
      `Primero el perímetro: ${L} + ${A} + ${L} + ${A} = ${per} m. Después: ${per} × ₡${miles(precio)} = ₡${miles(per * precio)}.`);
  }
  if (tipo === "ceramica") {
    const L = ent(3, 6, r), A = ent(2, L, r), precio = elegir([5000, 6000, 6500, 7500, 8000], r);
    return num(`El piso de una cocina mide ${L} m × ${A} m. La cerámica cuesta ₡${miles(precio)} el metro cuadrado. ¿Cuántos colones cuesta la cerámica para todo el piso?`, L * A * precio,
      `Primero el área: ${L} × ${A} = ${L * A} m². Después: ${L * A} × ₡${miles(precio)} = ₡${miles(L * A * precio)}.`);
  }
  const L = ent(4, 9, r), A = ent(3, 4, r), pa = 1, pb = 2;
  return num(`Una pared mide ${L} m de largo y ${A} m de alto, y tiene una puerta de ${pa} m × ${pb} m. ¿Cuántos metros cuadrados de pared hay que pintar?`, L * A - pa * pb,
    `La pared: ${L} × ${A} = ${L * A} m². La puerta: ${pa} × ${pb} = ${pa * pb} m². Se resta: ${L * A} − ${pa * pb} = ${L * A - pa * pb} m².`);
}

// ---------- 🔟 Decimales (4° a 6°) y 💯 porcentajes (5° y 6°) ----------
// Se calcula en centésimas (números enteros) para no tener errores de redondeo; se escribe con coma, como en Costa Rica.
const coma = c => { const x = Math.round(c), d = String(x % 100).padStart(2, "0").replace(/0+$/, ""); return d ? `${Math.floor(x / 100)},${d}` : `${Math.floor(x / 100)}`; };
const DECIMAS_TXT = ["", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
function decimales(r, g) {
  const tipo = elegir({ 4: ["escribir", "comparar", "sumar1"], 5: ["sumar2", "restar2", "comparar", "ordenar"], 6: ["por10", "medidas", "sumar2", "ordenar"] }[g] || ["escribir"], r);
  if (tipo === "escribir") {
    const e = ent(0, 3, r), n = ent(1, 9, r);
    const t = `${e ? `${e === 1 ? "un entero" : `${["", "", "dos", "tres"][e]} enteros`} y ` : ""}${DECIMAS_TXT[n]} ${n === 1 ? "décima" : "décimas"}`;
    return num(`¿Cómo se escribe con números «${t}»?`, coma(e * 100 + n * 10), `${t[0].toUpperCase() + t.slice(1)} se escribe ${coma(e * 100 + n * 10)}: las décimas van justo después de la coma.`);
  }
  if (tipo === "comparar") {
    const e = ent(0, 4, r), d1 = ent(1, 9, r); let c; do c = ent(1, 99, r); while (c % 10 === 0 || c === d1 * 10);
    const A = e * 100 + d1 * 10, B = e * 100 + c, mayor = r() < 0.5;
    const bien = mayor ? (A > B ? A : B) : (A < B ? A : B);
    return opc(`¿Cuál número es ${mayor ? "mayor" : "menor"}: ${coma(A)} o ${coma(B)}?`, coma(bien), [coma(bien === A ? B : A)],
      `Se comparan con la misma cantidad de cifras después de la coma: ${coma(A)} = ${e},${d1}0 y ${coma(B)} = ${e},${String(c).padStart(2, "0")}. El ${mayor ? "mayor" : "menor"} es ${coma(bien)}.`, r, 2);
  }
  const COSAS_DEC = [["kg de arroz", "kg de frijoles", "kilos"], ["litros de leche", "litros de jugo", "litros"], ["m de tela azul", "m de tela roja", "metros"]];
  if (tipo === "sumar1" || tipo === "sumar2") {
    const [x, y, u] = elegir(COSAS_DEC, r), paso = tipo === "sumar1" ? 10 : 5;
    const a = ent(2, 60, r) * paso, b = ent(2, 60, r) * paso;
    return num(`Compraste ${coma(a)} ${x} y ${coma(b)} ${y}. ¿Cuántos ${u} son en total?`, coma(a + b), `Se suman con las comas una debajo de la otra: ${coma(a)} + ${coma(b)} = ${coma(a + b)}.`);
  }
  if (tipo === "restar2") {
    const B = ent(5, 80, r) * 5, A = B + ent(5, 80, r) * 5;
    return num(`Tenías ${coma(A)} m de tela y usaste ${coma(B)} m. ¿Cuántos metros te quedan?`, coma(A - B), `Se restan con las comas una debajo de la otra: ${coma(A)} − ${coma(B)} = ${coma(A - B)}.`);
  }
  if (tipo === "ordenar") {
    const e = ent(0, 3, r), vals = new Set();
    while (vals.size < 3) vals.add(e * 100 + elegir([ent(1, 9, r) * 10, ent(1, 99, r)], r));
    const v = [...vals], bien = [...v].sort((a, b) => a - b).map(coma).join(" < ");
    const trampa = [...v].sort((a, b) => Number(coma(a).replace(",", "")) - Number(coma(b).replace(",", ""))).map(coma).join(" < ");
    const al = [...v].sort((a, b) => b - a).map(coma).join(" < ");
    return opc(`¿Cuál lista está ordenada de menor a mayor?`, bien, [trampa, al, [v[1], v[0], v[2]].map(coma).join(" < ")],
      `Se comparan las cifras después de la coma en el mismo lugar (décimas con décimas): ${bien}.`, r);
  }
  if (tipo === "por10") {
    let c; do c = ent(101, 999, r); while (c % 10 === 0);
    const [op, f] = elegir([["× 10", 10], ["× 100", 100], ["÷ 10", 0.1]], r), res = c * f;
    const txt = f === 0.1 ? String(Math.round(c) / 1000).replace(".", ",") : coma(res);
    return num(`${coma(c)} ${op} = ?`, txt, f === 0.1 ? "Al dividir entre 10, la coma se corre un lugar a la izquierda." : `Al multiplicar por ${f}, la coma se corre ${f === 10 ? "un lugar" : "dos lugares"} a la derecha.`);
  }
  const [t, c, e] = elegir([
    (() => { const x = ent(101, 299, r); return [`¿Cuántos centímetros son ${coma(x)} m?`, x, `1 m = 100 cm: ${coma(x)} × 100 = ${x} cm.`]; })(),
    (() => { const x = ent(11, 49, r) * 10; return [`¿Cuántos metros son ${x} cm?`, coma(x), `100 cm = 1 m: ${x} ÷ 100 = ${coma(x)} m.`]; })(),
    (() => { const x = ent(1, 19, r) * 5; return [`¿Cuántos gramos son ${coma(x)} kg?`, x * 10, `1 kg = 1000 g: ${coma(x)} × 1000 = ${x * 10} g.`]; })(),
  ], r);
  return num(t, c, e);
}
function porcentajes(r, g) {
  const tipo = elegir(g <= 5 ? ["de", "cuadricula", "fraccion"] : ["pagas", "rebajan", "iva", "oferta", "de"], r);
  if (tipo === "de") { const p = elegir([10, 20, 25, 50, 75], r), base = ent(2, 30, r) * 40; return num(`¿Cuánto es el ${p} % de ${miles(base)}?`, base * p / 100, `${p} % es ${p} de cada 100: ${miles(base)} × ${p} ÷ 100 = ${miles(base * p / 100)}.`); }
  if (tipo === "cuadricula") { const n = ent(1, 99, r); return num(`En una cuadrícula de 100 cuadritos se pintaron ${n}. ¿Qué porcentaje se pintó?`, n, `${n} de 100 es el ${n} %.`); }
  if (tipo === "fraccion") {
    const [p, f] = elegir([[50, "1/2"], [25, "1/4"], [75, "3/4"], [10, "1/10"], [20, "1/5"]], r);
    return opc(`¿Qué fracción es lo mismo que el ${p} %?`, f, ["1/2", "1/4", "3/4", "1/10", "1/5", `1/${p}`].filter(x => x !== f), `${p} % = ${p}/100, que simplificada es ${f}.`, r, 4);
  }
  const P = ent(4, 30, r) * 2000, p = elegir([10, 20, 25, 50], r), rebaja = P * p / 100;
  const cosa = elegir(["unos tenis", "una mochila", "una bicicleta", "un abanico", "una licuadora"], r);
  if (tipo === "pagas") return num(`${cosa[0].toUpperCase() + cosa.slice(1)} ${/^unos/.test(cosa) ? "cuestan" : "cuesta"} ₡${miles(P)} y tiene${/^unos/.test(cosa) ? "n" : ""} ${p} % de descuento. ¿Cuántos colones pagás?`, P - rebaja,
    `El descuento es ${p} % de ₡${miles(P)} = ₡${miles(rebaja)}. Se paga ₡${miles(P)} − ₡${miles(rebaja)} = ₡${miles(P - rebaja)}.`);
  if (tipo === "rebajan") return num(`${cosa[0].toUpperCase() + cosa.slice(1)} ${/^unos/.test(cosa) ? "cuestan" : "cuesta"} ₡${miles(P)} con ${p} % de descuento. ¿De cuántos colones es el descuento?`, rebaja,
    `${p} % de ₡${miles(P)}: ₡${miles(P)} × ${p} ÷ 100 = ₡${miles(rebaja)}.`);
  if (tipo === "iva") { const X = ent(2, 40, r) * 1000; return num(`Una herramienta cuesta ₡${miles(X)} sin impuesto. Con el IVA del 13 %, ¿cuántos colones se pagan en total?`, X * 113 / 100,
    `El IVA es 13 % de ₡${miles(X)} = ₡${miles(X * 13 / 100)}. Total: ₡${miles(X)} + ₡${miles(X * 13 / 100)} = ₡${miles(X * 113 / 100)}.`); }
  let P2, p2, k = 0; do { P2 = ent(4, 30, r) * 2000; p2 = elegir([10, 20, 25, 50], r); } while (P2 * (100 - p2) === P * (100 - p) && ++k < 50);
  const fA = P - rebaja, fB = P2 - P2 * p2 / 100, gana = fA < fB ? "En la tienda A" : "En la tienda B";
  return opc(`Tienda A: ₡${miles(P)} con ${p} % de descuento. Tienda B: ₡${miles(P2)} con ${p2} % de descuento. ¿En cuál se paga menos?`, gana, ["En la tienda A", "En la tienda B"].filter(x => x !== gana),
    `En la tienda A se paga ₡${miles(fA)} y en la tienda B, ₡${miles(fB)}. Se paga menos ${gana.replace("En", "en")}.`, r, 2);
}

// ---------- 📊 Gráficos y probabilidad (2° a 6°) ----------
const GRUPOS_ESC = ["segundo", "tercer", "cuarto", "quinto", "sexto"];
const SERIES_EX = [["Goles del equipo de la escuela en", "partidos", 0, 6], ["Mangos que vendió don Carlos en la feria en", "días", 10, 40],
  ["Libros que leyeron", "estudiantes", 1, 8], ["Puntos en la prueba de", "estudiantes", 60, 100]];
function distintos(n, a, b, r) { const s = new Set(); while (s.size < n) s.add(ent(a, b, r)); return [...s]; }
function graficosTema(r, g) {
  const tipo = elegir({ 2: ["mas", "cuantos"], 3: ["masQue", "total", "picto", "menos"], 4: ["masQue", "total", "picto", "bolsa", "seguro"],
    5: ["moda", "promedio", "bolsa", "picto"], 6: ["promedio", "rango", "probabilidad", "moda"] }[g] || ["mas"], r);
  if (["mas", "menos", "cuantos", "masQue", "total"].includes(tipo)) {
    const tema = elegir(ENCUESTAS, r), cats = barajar(tema.cats, r).slice(0, 4), v = distintos(cats.length, 1, g <= 2 ? 9 : 15, r);
    // Una fila por respuesta, como en la tabla del cuaderno
    const tabla = `En ${elegir(GRUPOS_ESC, r)} grado preguntaron «${tema.pregunta}». Respuestas: <br>${cats.map((c, i) => `${c.e} ${c.n}: <b>${v[i]}</b>`).join(" <br>")}.`;
    const i = ent(0, cats.length - 1, r);
    if (tipo === "cuantos") return num(`${tabla} <br>¿Cuántos contestaron «${cats[i].n}»?`, v[i], `En la tabla, «${cats[i].n}» tiene ${v[i]}.`);
    if (tipo === "total") return num(`${tabla} <br>¿Cuántos estudiantes contestaron en total?`, v.reduce((a, b) => a + b, 0), `Se suman todas: ${v.join(" + ")} = ${v.reduce((a, b) => a + b, 0)}.`);
    if (tipo === "masQue") {
      let j; do j = ent(0, cats.length - 1, r); while (j === i);
      const [x, y] = v[i] > v[j] ? [i, j] : [j, i];
      return num(`${tabla} <br>¿Cuántos más contestaron «${cats[x].n}» que «${cats[y].n}»?`, v[x] - v[y], `${v[x]} − ${v[y]} = ${v[x] - v[y]}.`);
    }
    const k = tipo === "mas" ? v.indexOf(Math.max(...v)) : v.indexOf(Math.min(...v));
    return opc(`${tabla} <br>¿Qué respuesta tuvo ${tipo === "mas" ? "más" : "menos"} votos?`, cats[k].n, cats.map(c => c.n), `«${cats[k].n}» tiene ${v[k]}, ${tipo === "mas" ? "más" : "menos"} que las demás.`, r, 4);
  }
  if (tipo === "picto") {
    const tema = elegir(ENCUESTAS, r), c = elegir(tema.cats, r), vale = g <= 3 ? 2 : elegir([2, 5, 10], r), k = ent(2, 6, r);
    return num(`En un pictograma, cada ${c.e} vale ${vale}. En la fila de «${c.n}» hay ${c.e.repeat(k)}. ¿Cuántos contestaron «${c.n}»?`, k * vale, `Hay ${k} dibujos y cada uno vale ${vale}: ${k} × ${vale} = ${k * vale}.`);
  }
  if (tipo === "bolsa" || tipo === "seguro" || tipo === "probabilidad") {
    const cols = barajar(CONFITES, r).slice(0, tipo === "probabilidad" ? 2 : ent(2, 3, r)), n = distintos(cols.length, 1, 9, r);
    const bolsa = `En una bolsa hay ${cols.map((c, i) => `${n[i]} ${n[i] === 1 ? `confite ${c.n}` : `confites ${c.p}`}`).join(", ").replace(/, ([^,]*)$/, " y $1")}.`;
    if (tipo === "bolsa") {
      const k = n.indexOf(Math.max(...n));
      return opc(`${bolsa} Si sacás uno sin ver, ¿de qué color es más probable que salga?`, cols[k].n, cols.map(c => c.n), `Hay más confites ${cols[k].p} (${n[k]}), así que es más probable sacar uno ${cols[k].n}.`, r, 4);
    }
    if (tipo === "seguro") {
      const otro = CONFITES.find(c => !cols.includes(c)), caso = elegir(["imposible", "posible"], r), c = caso === "imposible" ? otro : elegir(cols, r);
      return opc(`${bolsa} Si sacás uno sin ver, sacar un confite ${c.n} es…`, caso, ["seguro", "posible", "imposible"],
        caso === "imposible" ? `No hay confites ${c.p} en la bolsa: es imposible.` : `Hay confites ${c.p}, pero también de otros colores: es posible, pero no seguro.`, r, 3);
    }
    const tot = n[0] + n[1], f = [n[0], tot];
    return opcFr(`${bolsa} Si sacás uno sin ver, ¿cuál es la probabilidad de sacar un confite ${cols[0].n}?`, f, [[n[0], n[1]], [n[1], tot], [1, n[0]], [1, tot]],
      `Hay ${n[0]} ${cols[0].p} de ${tot} confites en total: ${fr(n[0], tot)}.`, r);
  }
  const [titulo, filas, a, b] = elegir(SERIES_EX, r), cant = ent(5, 7, r);
  if (tipo === "moda") {
    const m = ent(a, b, r), otros = distintos(cant - 2, a, b, r).filter(x => x !== m).slice(0, cant - 3);
    const v = barajar([m, m, m, ...otros], r);
    return num(`${titulo} ${v.length} ${filas}: ${v.join(", ")}. ¿Cuál es la moda?`, m, `La moda es el dato que más se repite: ${m} aparece ${v.filter(x => x === m).length} veces.`);
  }
  if (tipo === "rango") { const v = distintos(cant, a, b, r); return num(`${titulo} ${v.length} ${filas}: ${v.join(", ")}. ¿Cuál es el rango?`, Math.max(...v) - Math.min(...v), `El rango es el mayor menos el menor: ${Math.max(...v)} − ${Math.min(...v)} = ${Math.max(...v) - Math.min(...v)}.`); }
  const n = ent(3, 5, r), prom = ent(a + 1, b - 1, r); let v;
  do { v = Array.from({ length: n - 1 }, () => ent(a, b, r)); v.push(prom * n - v.reduce((x, y) => x + y, 0)); } while (v[n - 1] < a || v[n - 1] > b);
  return num(`${titulo} ${n} ${filas}: ${v.join(", ")}. ¿Cuál es el promedio?`, prom, `Se suman y se divide entre ${n}: ${v.join(" + ")} = ${prom * n}, y ${prom * n} ÷ ${n} = ${prom}.`);
}

// ---------- 📦 Clases de palabras y oraciones (2° a 6°) ----------
const oracionDe = toks => { const s = toks.map(t => t.t).join(" "); return s[0].toUpperCase() + s.slice(1); };
const unUna = c => (/ción$/.test(CLASES[c].n) ? "una" : "un");
// Canastas que no son una clase de palabra
const CANASTA = { definido: "un artículo definido", indefinido: "un artículo indefinido", tiempo: "un adverbio de tiempo", lugar: "un adverbio de lugar" };
const conClase = c => CANASTA[c] || (CLASES[c] ? `${unUna(c)} ${CLASES[c].n}` : null);
function dePalabras(x, r) {
  if (x.tipo === "canasta") {
    const ops = x.canastas.map(conClase);
    if (ops.some(o => !o)) return null;
    return { texto: `La palabra «${x.palabra}» es…`, tipo: "opcion", opciones: barajar(ops, r), correcta: conClase(x.correcta), explica: x.bien };
  }
  if (x.tipo === "elegir") {
    // Sin dibujo, la voz trae la pista («Fijate en el género y el número»)
    const pista = !x.html && /Fijate/.test(x.voz || "") ? ` ${x.voz.slice(x.voz.indexOf("Fijate"))}` : "";
    const hueco = (x.html || "").split('<span class="hueco">?</span>').join("___");
    return deJuego(x, r, `${x.instr}${hueco ? ` <br>${enUnaLinea(hueco)}` : pista}`);
  }
  const frase = `«${oracionDe(x.tokens)}.»`;
  if (x.tipo === "corte") {
    const pref = k => oracionDe(x.tokens.slice(0, k));
    const malas = [1, 2, 3, 4, 5].filter(k => k !== x.corte && k < x.tokens.length).map(pref);
    return opc(`¿Cuál es el sujeto de la oración ${frase}?`, pref(x.corte), malas, x.bien, r, 4);
  }
  if (x.tipo !== "tocar") return null;
  const i = elegir(x.correctas, r), bien = x.tokens[i].t, malos = x.tokens.filter((t, j) => !x.correctas.includes(j) && t.c !== x.objetivo && t.t.toLowerCase() !== bien.toLowerCase()).map(t => t.t);
  const clase = x.objetivo === "propio" ? "un sustantivo propio" : conClase(x.objetivo);
  if (malos.length < 2 || !clase) return null;
  const pide = x.escalon === 12 ? `¿Cuál es el núcleo del ${x.objetivo === "v" ? "predicado" : "sujeto"} en ${frase}?`
    : `¿Cuál palabra es ${clase} en ${frase}?`;
  return opc(pide, bien, malos, x.por[i], r, 4);
}
// Escalones de palabras.js para cada grado (los que dice el juego en cada escalón)
const PALABRAS_POR_GRADO = { 2: [0, 1, 2], 3: [2, 3, 4, 5], 4: [5, 6, 7, 8], 5: [8, 9, 10, 11], 6: [9, 10, 11, 12] };

// ---------- ✍️ Sílabas y tildes (2° a 6°) ----------
// Palabras que sin tilde también existen (papa, rio, numero…): no sirven para «¿cuál está bien escrita?»
const SIN_TILDE_VALE = new Set(["mama", "papa", "bebe", "numero", "medico", "pagina", "silaba", "maquina", "rio", "frio", "futbol", "beisbol",
  "dolar", "ordenes", "lagrima", "compas", "sabana", "esta", "este", "solo", "como", "practico", "publico", "termino", "limite", "calculo"]);
const CON_TILDE = { a: "á", e: "é", i: "í", o: "ó", u: "ú" };
/** Pone la tilde en la vocal fuerte de una sílaba (la a, e u o; si no hay, la última i o u). */
function ponerTilde(sil) {
  const s = [...sil], fuerte = s.findIndex(c => "aeo".includes(c.toLowerCase()));
  let i = fuerte; if (i < 0) for (let k = s.length - 1; k >= 0; k--) if ("iu".includes(s[k].toLowerCase())) { i = k; break; }
  if (i < 0) return null;
  const c = s[i].toLowerCase(); s[i] = s[i] === c ? CON_TILDE[c] : CON_TILDE[c].toUpperCase();
  return s.join("");
}
const TODAS_ACENTOS = new Set(ACENTOS.map(p => p.palabra.toLowerCase()));
function separaciones(p) {
  // Separaciones equivocadas: correr un corte una letra, o juntar dos sílabas
  const s = p.silabas, malas = new Set();
  for (let k = 0; k < s.length - 1; k++) {
    if (s[k].length > 1) malas.add([...s.slice(0, k), s[k].slice(0, -1), s[k].slice(-1) + s[k + 1], ...s.slice(k + 2)].join("-"));
    if (s[k + 1].length > 1) malas.add([...s.slice(0, k), s[k] + s[k + 1][0], s[k + 1].slice(1), ...s.slice(k + 2)].join("-"));
    malas.add([...s.slice(0, k), s[k] + s[k + 1], ...s.slice(k + 2)].join("-"));
  }
  malas.delete(s.join("-"));
  // Que se vean como separaciones de verdad: más de una parte y una vocal en cada parte
  return [...malas].filter(m => m.includes("-") && m.split("-").every(x => /[aeiouáéíóúü]/i.test(x)));
}
function tildes(r, g) {
  const tipo = elegir({ 2: ["separar"], 3: ["separar", "fuerte"], 4: ["fuerte", "tipo"], 5: ["tipo", "escrita", "porQue"], 6: ["tipo", "escrita", "porQue", "hiato"] }[g] || ["separar"], r);
  const comunes = ACENTOS.filter(p => !p.propio && p.tipo !== "sobresdrujula");
  if (tipo === "separar") {
    const p = elegir(comunes.filter(p => p.n >= 2 && p.n <= (g <= 2 ? 3 : 4) && separaciones(p).length >= 2), r);
    return opc(`¿Cómo se separa en sílabas la palabra «${p.palabra}»?`, p.silabas.join("-"), separaciones(p), porQueSilabas(p), r, 3);
  }
  if (tipo === "fuerte") {
    const p = elegir(comunes.filter(p => p.n >= 2 && new Set(p.silabas.map(x => x.toLowerCase())).size === p.n), r);
    return opc(`¿Qué sílaba suena más fuerte en «${p.palabra}»?`, p.silabas[p.tonica].toLowerCase(), p.silabas.map(x => x.toLowerCase()), `Se dice ${marcada(p)}: suena más fuerte «${p.silabas[p.tonica].toLowerCase()}».`, r, 4);
  }
  if (tipo === "tipo") {
    const pool = g >= 6 ? ACENTOS.filter(p => !p.propio) : comunes, p = elegir(pool, r);
    const tipos = TIPOS_ACENTO.filter(t => g >= 6 || t.id !== "sobresdrujula").map(t => t.nombre.toLowerCase()), bien = TIPOS_ACENTO.find(t => t.id === p.tipo).nombre.toLowerCase();
    return opc(`La palabra «${p.palabra}» es…`, bien, tipos, porQueTipo(p), r, tipos.length);
  }
  if (tipo === "escrita") {
    const p = elegir(comunes.filter(p => p.n >= 2 && (p.tilde ? !SIN_TILDE_VALE.has(quitarTildes(p.palabra).toLowerCase()) : true)), r);
    const sinT = quitarTildes(p.palabra), sil = quitarTildes(p.silabas.join("|")).split("|"), malas = [];
    if (p.tilde) malas.push(sinT);
    else { const t = ponerTilde(sil[p.tonica]); if (t) malas.push(sil.map((x, i) => (i === p.tonica ? t : x)).join("")); }
    for (let k = 0; k < sil.length; k++) {
      if (k === p.tonica || (!p.tilde)) continue;
      const t = ponerTilde(sil[k]); if (t) malas.push(sil.map((x, i) => (i === k ? t : x)).join(""));
    }
    const seguras = malas.filter(m => m !== p.palabra && !TODAS_ACENTOS.has(m.toLowerCase()));
    if (!seguras.length) return opc(`La palabra «${p.palabra}» es…`, TIPOS_ACENTO.find(t => t.id === p.tipo).nombre.toLowerCase(), TIPOS_ACENTO.slice(0, 3).map(t => t.nombre.toLowerCase()), porQueTipo(p), r, 3);
    return opc(`¿Cuál palabra está bien escrita?`, p.palabra, seguras, porQueTilde(p), r, 3);
  }
  if (tipo === "porQue") {
    const p = elegir(ACENTOS.filter(p => p.tilde && !p.propio && !p.hiato && p.tipo !== "sobresdrujula"), r);
    const REGLAS = { aguda: "Es aguda y termina en n, s o vocal", grave: "Es grave y no termina en n, s ni vocal", esdrujula: "Es esdrújula: todas las esdrújulas llevan tilde" };
    return opc(`¿Por qué la palabra «${p.palabra}» lleva tilde?`, REGLAS[p.tipo], [...Object.values(REGLAS), "Porque es una palabra larga"], porQueTilde(p), r, 4);
  }
  const h = elegir(ACENTOS.filter(p => p.hiato && p.tilde && !p.propio), r), otras = barajar(ACENTOS.filter(p => p.diptongo && !p.hiato && !p.propio), r).slice(0, 2).map(p => p.palabra);
  return opc(`¿En cuál palabra hay un hiato (dos vocales que se separan en sílabas distintas)?`, h.palabra, otras, `${h.palabra}: ${h.silabas.join("-")}. ${porQueTilde(h, { hiatos: true })}`, r, 3);
}

// ---------- 📖 Comprensión lectora (2° a 6°) ----------
// El texto va en `lectura` (examen.html lo pone una sola vez, arriba de sus preguntas) y cada pregunta dice de cuál texto es.
const LECTURA_POR_GRADO = { 2: [0, 1, 2], 3: [2, 3, 4], 4: [4, 5, 6], 5: [6, 7, 8], 6: [7, 8, 9] };
/** Todas las preguntas de un texto al azar del grado. */
function lecturas(r, g) {
  const t = elegir(TEXTOS.filter(x => (LECTURA_POR_GRADO[g] || [0]).includes(x.escalon)), r);
  const lect = `<b>${t.emoji} ${t.titulo}</b> <br>${t.parrafos.join(" <br>")}`, de = ` <small>(«${t.titulo}»)</small>`;
  return prepararPreguntas(t, r).map(q => ({ lectura: lect, ...(q.t === "secuencia"
    ? opc(`Según el texto, ¿qué pasó primero?${de}`, q.orden[0], q.orden.slice(1), `El orden es: ${q.orden.join(" → ")}.`, r, q.orden.length)
    : opc(`${q.q}${de}`, q.ok, q.no, explicacionCuento(t, q), r, q.no.length + 1)) }));
}
const lectura = (r, g) => elegir(lecturas(r, g), r);

// ---------- 🫀 El cuerpo humano (1° a 6°) ----------
const SENTIDOS = [["ver", "los ojos", "la vista"], ["oír", "los oídos", "el oído"], ["oler", "la nariz", "el olfato"], ["saborear", "la lengua", "el gusto"], ["sentir si algo está frío o caliente", "la piel", "el tacto"]];
const ORGANOS = [["bombea la sangre por todo el cuerpo", "el corazón"], ["nos permiten respirar", "los pulmones"], ["digiere la comida", "el estómago"], ["piensa y controla todo el cuerpo", "el cerebro"], ["sostienen el cuerpo y le dan forma", "los huesos"], ["nos permiten movernos", "los músculos"]];
function cuerpoBasico(r) {
  if (r() < 0.5) { const [acc, org, sentido] = elegir(SENTIDOS, r); return opc(`¿Con qué parte del cuerpo podemos ${acc}?`, org, SENTIDOS.map(x => x[1]), `Con ${org}: es el sentido de${sentido.startsWith("el ") ? "l " + sentido.slice(3) : " " + sentido}.`, r); }
  const [hace, org] = elegir(ORGANOS, r);
  return opc(`¿Qué ${org.startsWith("los ") ? "partes" : "parte"} del cuerpo ${hace}?`, org, ORGANOS.map(x => x[1]), `${cap(org)} ${hace}.`, r);
}
const ORGANOS_PARTES = Object.keys(PARTES).filter(id => PARTES[id].f);
const esPlural = n => /^(los|las) /.test(n);
function cuerpoTema(r, g) {
  const tipo = elegir(g <= 2 ? ["basico", "basico", "sentido", "habito"] : g <= 4 ? ["sirve", "concepto", "habito", "sentido"] : ["sistema", "recorrido", "concepto", "sirve"], r);
  if (tipo === "basico") return cuerpoBasico(r);
  if (tipo === "sentido") return intentar(() => deJuego(sentidoUso(r), r), () => cuerpoBasico(r));
  if (tipo === "habito") return intentar(() => deJuego(r() < 0.5 ? habitoSiNo(r) : habitoCual(r), r), () => cuerpoBasico(r));
  const sistemas = g <= 4 ? ["digestivo", "respiratorio", "circulatorio", "oseo"] : ORGANICOS;
  if (tipo === "concepto") return intentar(() => deJuego(concepto(elegir(sistemas, r), r), r), () => cuerpoBasico(r));
  if (tipo === "sirve") {
    const id = elegir(ORGANOS_PARTES.filter(x => sistemas.includes(PARTES[x].s)), r), p = PARTES[id];
    const otros = ORGANOS_PARTES.filter(x => PARTES[x].s !== p.s).map(x => cap(PARTES[x].f));
    return opc(`¿Qué ${esPlural(p.n) ? "hacen" : "hace"} ${p.n}?`, cap(p.f), otros, `${cap(p.n)} ${p.f}.`, r, 3);
  }
  if (tipo === "sistema") {
    const id = elegir(ORGANOS_PARTES, r), p = PARTES[id];
    return opc(`¿De qué sistema ${esPlural(p.n) ? "forman" : "forma"} parte ${p.n}?`, cap(SISTEMAS[p.s].n), ORGANICOS.map(s => cap(SISTEMAS[s].n)),
      `${cap(p.n)} ${esPlural(p.n) ? "son" : "es"} parte del ${SISTEMAS[p.s].n.replace(/^el /, "")}: ${p.f}.`, r, 4);
  }
  const rec = RECORRIDOS[elegir(Object.keys(RECORRIDOS), r)], i = ent(0, rec.pasos.length - 2, r);
  return opc(`En ${rec.titulo}, ¿qué sigue después de «${rec.pasos[i]}»?`, rec.pasos[i + 1], rec.pasos.filter((_, k) => k !== i && k !== i + 1), rec.bien, r, 3);
}
// ---------- 🔗 Cadenas alimenticias (2° a 6°) ----------
const CADENA_POR_GRADO = { 2: [0, 1], 3: [1, 2], 4: [2, 5, 8], 5: [5, 6, 8, 9], 6: [6, 8, 9] };
function cadenasTema(r, g) {
  return intentar(() => {
    const i = elegir(CADENA_POR_GRADO[g] || [0], r), q = preguntaCadena(i, r);
    // Con la cadena dibujada (6, 8) va el texto de la pantalla; si no, lo que lee la voz (que es la pregunta completa)
    const texto = [6, 8].includes(i) ? conSaltos(q.html).replace(/¿qué es (los|las) /, "¿qué son $1 ") : (q.voz || "").replace(/, ([\p{L}]+)\?$/u, " o $1?").replace(/^((Los|Las) [^:]+): ¿es /, "$1: ¿son ");
    return deJuego(q, r, texto);
  }, () => cadenasTema(r, 2));
}

// ---------- 🏛️ Historia de Costa Rica (2° a 6°) y Gobierno (5° y 6°) ----------
const MODO_H = Object.fromEntries(MODOS_HISTORIA.map(m => [m.id, m]));
const HISTORIA_POR_GRADO = { 2: ["personajes", "importa", "originarios"], 3: ["personajes", "importa", "originarios", "primero"],
  4: ["importa", "primero", "originarios", "personajes"], 5: ["primero", "siglos", "importa", "personajes"], 6: ["primero", "siglos", "importa", "originarios"] };
function deHistoria(q, r) {
  if (q.tipo === "escribir") return num(`${enUnaLinea(q.html)}. ¿En qué año fue?`, q.respuesta, limpiaExplica(q.explica));
  return q.tipo === "opciones" ? deJuego(q, r, q.voz) : null;
}
function primeroHistoria(r, g) {
  const con = HECHOS.filter(h => h.año), n = g <= 4 ? 2 : 3, sep = g <= 3 ? 40 : 15;
  let hs, k = 0;
  do hs = barajar(con, r).slice(0, n); while (++k < 80 && hs.some((a, i) => hs.some((b, j) => i !== j && Math.abs(a.año - b.año) < sep)));
  const ord = [...hs].sort((a, b) => a.año - b.año), verAño = g <= 3;
  return opc(`¿Qué pasó primero?`, verAño ? `${ord[0].t}: ${ord[0].año}` : ord[0].t, ord.slice(1).map(h => (verAño ? `${h.t}: ${h.año}` : h.t)),
    `En orden: ${ord.map(h => `${h.t} (${h.año})`).join(", ")}.`, r, n);
}
function historiaTema(r, g) {
  const m = elegir(HISTORIA_POR_GRADO[g] || HISTORIA_POR_GRADO[2], r);
  if (m === "primero") return primeroHistoria(r, g);
  return intentar(() => deHistoria(preguntaDeModo(MODO_H[m], r), r), () => primeroHistoria(r, g));
}
// (el modo «gobierno» de historia.js ya trae derechos y deberes)
const gobiernoTema = r => intentar(() => deHistoria(preguntaDeModo(MODO_H.gobierno, r), r), () => primeroHistoria(r, 6));

// ---------- 🧭 Puntos cardinales y direcciones (1° a 6°) ----------
const CARD = ["norte", "este", "sur", "oeste"], OCHO_N = ["norte", "noreste", "este", "sureste", "sur", "suroeste", "oeste", "noroeste"];
const opuesto = d => OCHO_N[(OCHO_N.indexOf(d) + 4) % 8];
const SITIOS = ["la iglesia", "la escuela", "la plaza", "la pulpería", "el EBAIS", "el parque", "la parada del bus", "la soda"];
const deSitio = s => s.replace(/^el /, "del ").replace(/^la /, "de la ");
function direcciones(r, g) {
  const tipo = elegir(g <= 2 ? ["sol", "atras", "mapa", "vuelta"] : g === 3 ? ["derecha", "vuelta", "desde"] : g === 4 ? ["intermedio", "desde", "caminar", "metros"] : ["hemisferio", "lineas", "intermedio", "caminar"], r);
  if (tipo === "sol") return elegir([
    () => opc("¿Por dónde sale el sol?", "Por el este", ["Por el oeste", "Por el norte", "Por el sur"], "El sol sale por el este (el oriente) y se oculta por el oeste.", r, 4),
    () => opc("¿Por dónde se oculta el sol?", "Por el oeste", ["Por el este", "Por el norte", "Por el sur"], "El sol se oculta por el oeste (el occidente).", r, 4),
    () => opc("¿Cuántos puntos cardinales hay?", "4", ["2", "3", "8"], "Los puntos cardinales son 4: norte, sur, este y oeste.", r, 4),
  ], r)();
  if (tipo === "mapa") {
    const [d, lado] = elegir([["sur", "Abajo"], ["este", "A la derecha"], ["oeste", "A la izquierda"]], r);
    return opc(`En un mapa, el norte está arriba. ¿Dónde está el ${d}?`, lado, ["Arriba", "Abajo", "A la derecha", "A la izquierda"],
      "En los mapas el norte va arriba, el sur abajo, el este a la derecha y el oeste a la izquierda.", r, 4);
  }
  if (tipo === "atras") { const d = elegir(CARD, r); return opc(`Si tenés el ${d} adelante, ¿qué punto cardinal tenés atrás?`, opuesto(d), CARD.filter(x => x !== d), `Lo contrario del ${d} es el ${opuesto(d)}.`, r, 3); }
  if (tipo === "derecha") {
    const d = elegir(CARD, r), lado = elegir(["derecha", "izquierda"], r), i = CARD.indexOf(d), res = CARD[(i + (lado === "derecha" ? 1 : 3)) % 4];
    return opc(`Si mirás hacia el ${d}, ¿qué punto cardinal te queda a la ${lado}?`, res, CARD.filter(x => x !== res), `Mirando al ${d}, a la derecha queda el ${CARD[(i + 1) % 4]} y a la izquierda el ${CARD[(i + 3) % 4]}.`, r, 4);
  }
  if (tipo === "vuelta") { const d = elegir(CARD, r); return opc(`Estás mirando hacia el ${d} y das media vuelta. ¿Hacia dónde quedás mirando?`, opuesto(d), CARD.filter(x => x !== opuesto(d)), `Media vuelta es girar hacia el lado contrario: del ${d} al ${opuesto(d)}.`, r, 4); }
  if (tipo === "desde") {
    const [a, b] = barajar(SITIOS, r), d = elegir(g <= 3 ? CARD : OCHO_N, r), m = ent(1, 4, r) * 100;
    return opc(`${cap(b)} queda ${m} metros al ${d} ${deSitio(a)}. Desde ${b}, ¿hacia dónde queda ${a}?`, `Al ${opuesto(d)}`, (g <= 3 ? CARD : OCHO_N).filter(x => x !== opuesto(d)).map(x => `Al ${x}`),
      `Si ${b} está al ${d} ${deSitio(a)}, para volver hay que ir al lado contrario: al ${opuesto(d)}.`, r, 4);
  }
  if (tipo === "intermedio") {
    const k = elegir([1, 3, 5, 7], r), d = OCHO_N[k];
    return r() < 0.5
      ? opc(`¿Qué punto está entre el ${OCHO_N[k - 1]} y el ${OCHO_N[(k + 1) % 8]}?`, d, OCHO_N.filter((_, i) => i % 2 === 1 && i !== k), `Entre el ${OCHO_N[k - 1]} y el ${OCHO_N[(k + 1) % 8]} está el ${d}.`, r, 4)
      : opc(`¿Qué punto es el contrario del ${d}?`, opuesto(d), OCHO_N.filter(x => x !== opuesto(d) && x !== d), `En la rosa de los vientos, el contrario del ${d} es el ${opuesto(d)}.`, r, 4);
  }
  if (tipo === "caminar") {
    const v = elegir(["norte", "sur"], r), h = elegir(["este", "oeste"], r), res = `${v === "norte" ? "nor" : "sur"}${h}`;
    const sitio = elegir(SITIOS, r);
    return opc(`Salís ${deSitio(sitio)} y caminás 100 metros al ${v} y después 100 metros al ${h}. ¿En qué dirección quedaste desde ${sitio}?`, `Al ${res}`,
      OCHO_N.filter(x => x !== res).map(x => `Al ${x}`), `Fuiste al ${v} y al ${h}: quedaste al ${res}.`, r, 4);
  }
  if (tipo === "metros") {
    const a = ent(1, 5, r) * 100, b = ent(1, 5, r) * 100, [d1, d2] = barajar(CARD, r);
    return num(`Para llegar a ${elegir(SITIOS, r)}, caminás ${a} metros al ${d1} y ${b} metros al ${d2}. ¿Cuántos metros caminás en total?`, a + b, `${a} + ${b} = ${a + b} metros.`);
  }
  if (tipo === "hemisferio") return elegir([
    () => opc("¿En qué hemisferio está Costa Rica: en el norte o en el sur?", "En el hemisferio norte", ["En el hemisferio sur", "Justo en el ecuador"], "Costa Rica está al norte del ecuador: en el hemisferio norte.", r, 3),
    () => opc("¿En qué hemisferio está Costa Rica: en el oriental (este) o en el occidental (oeste)?", "En el hemisferio occidental (oeste)", ["En el hemisferio oriental (este)", "Justo en el meridiano de Greenwich"], "Al oeste de Greenwich está el hemisferio occidental, donde queda toda América.", r, 3),
  ], r)();
  return elegir([
    () => opc("¿Cómo se llama la línea imaginaria que divide la Tierra en hemisferio norte y hemisferio sur?", "El ecuador", ["El meridiano de Greenwich", "El trópico de Cáncer"], "El ecuador divide la Tierra en hemisferio norte y hemisferio sur.", r, 3),
    () => opc("¿Qué meridiano divide la Tierra en hemisferio oriental y hemisferio occidental?", "El meridiano de Greenwich", ["El ecuador", "El trópico de Capricornio"], "El meridiano de Greenwich (el meridiano 0°) divide la Tierra en este y oeste.", r, 3),
    () => opc("La latitud dice qué tan lejos está un lugar…", "del ecuador (hacia el norte o hacia el sur)", ["del meridiano de Greenwich (hacia el este o el oeste)", "del mar"], "La latitud se mide desde el ecuador, hacia el norte o hacia el sur, con los paralelos.", r, 3),
    () => opc("La longitud dice qué tan lejos está un lugar…", "del meridiano de Greenwich (hacia el este o el oeste)", ["del ecuador (hacia el norte o hacia el sur)", "del polo norte"], "La longitud se mide desde el meridiano de Greenwich, hacia el este o el oeste, con los meridianos.", r, 3),
    () => opc("Los paralelos son líneas imaginarias que van…", "de este a oeste, paralelas al ecuador", ["de polo a polo", "en diagonal"], "Los paralelos dan la vuelta a la Tierra de este a oeste, paralelos al ecuador. Los meridianos van de polo a polo.", r, 3),
  ], r)();
}

// ================= MATEMÁTICAS =================
const MATE = [
  { id: "sumas", nombre: "Sumas", emoji: "➕", grados: [1, 2, 3, 4, 5, 6], pregunta: (r, g) => {
    const t = tope(g), a = ent(Math.floor(t / 10), Math.floor(t / 2), r), b = ent(1, Math.floor(t / 2) - 1, r);
    return num(`${miles(a)} + ${miles(b)} = ?`, a + b, `${miles(a)} + ${miles(b)} = ${miles(a + b)}. Sumá primero las unidades y llevá si pasa de 9.`);
  } },
  { id: "restas", nombre: "Restas", emoji: "➖", grados: [1, 2, 3, 4, 5, 6], pregunta: (r, g) => {
    const t = tope(g), a = ent(Math.floor(t / 4), t - 1, r), b = ent(1, a - 1, r);
    return num(`${miles(a)} − ${miles(b)} = ?`, a - b, `${miles(a)} − ${miles(b)} = ${miles(a - b)}. Para revisar: ${miles(a - b)} + ${miles(b)} = ${miles(a)}.`);
  } },
  { id: "multiplicacion", nombre: "Multiplicación", emoji: "✖️", grados: [2, 3, 4, 5, 6], pregunta: (r, g) => {
    const [a, b] = g <= 3 ? [ent(2, 10, r), ent(2, 10, r)] : g === 4 ? [ent(11, 99, r), ent(2, 9, r)] : [ent(12, 99, r), ent(11, 40, r)];
    return num(`${a} × ${b} = ?`, a * b, g <= 3 ? `${a} × ${b} = ${a * b}: son ${a} grupos de ${b}.` : `${a} × ${b} = ${miles(a * b)}.`);
  } },
  { id: "division", nombre: "División", emoji: "➗", grados: [3, 4, 5, 6], pregunta: (r, g) => {
    const b = ent(2, g <= 3 ? 10 : 9, r), c = g <= 3 ? ent(2, 10, r) : g === 4 ? ent(11, 99, r) : ent(100, 999, r), a = b * c;
    return num(`${miles(a)} ÷ ${b} = ?`, c, `${miles(a)} ÷ ${b} = ${miles(c)}, porque ${miles(c)} × ${b} = ${miles(a)}.`);
  } },
  { id: "problemas", nombre: "Problemas con plata", emoji: "🪙", grados: [1, 2, 3, 4, 5, 6], pregunta: (r, g, nombre) => {
    const n = quien(nombre, r);
    const cosas = [["un helado", 350], ["un pan", 200], ["una bolsa de mangos", 800], ["un cuaderno", 650], ["un lápiz", 150], ["un fresco", 400]];
    const [cosa, precioBase] = elegir(cosas, r), precio = precioBase * (g >= 4 ? ent(2, 5, r) : 1);
    const tipo = g <= 2 ? "vuelto" : elegir(["vuelto", "varios", "juntar"], r);
    if (tipo === "varios") { const k = ent(2, g >= 4 ? 9 : 5, r); return num(`${n} compra ${k} veces ${cosa} de ₡${miles(precio)}. ¿Cuánto paga en total?`, k * precio, `${k} × ₡${miles(precio)} = ₡${miles(k * precio)}.`); }
    if (tipo === "juntar") { const a = ent(2, 20, r) * 50, b = ent(2, 20, r) * 50; return num(`${n} tiene ₡${miles(a)} y su abuela le regala ₡${miles(b)}. ¿Cuánto tiene ahora?`, a + b, `₡${miles(a)} + ₡${miles(b)} = ₡${miles(a + b)}.`); }
    const billete = [1000, 2000, 5000, 10000].find(x => x > precio);
    return num(`${n} compra ${cosa} de ₡${miles(precio)} y paga con ₡${miles(billete)}. ¿Cuánto le dan de vuelto?`, billete - precio, `₡${miles(billete)} − ₡${miles(precio)} = ₡${miles(billete - precio)}.`);
  } },
  { id: "numeros", nombre: "Números y valor posicional", emoji: "🔢", grados: [1, 2, 3, 4], pregunta: (r, g) => {
    const t = tope(g), n = ent(Math.floor(t / 10) + 1, t - 1, r), tipo = elegir(["sucesor", "antecesor", "mayor", g >= 2 ? "decenas" : "sucesor"], r);
    if (tipo === "sucesor") return num(`¿Qué número va después del ${miles(n)}?`, n + 1, `Después del ${miles(n)} va el ${miles(n + 1)} (se le suma 1).`);
    if (tipo === "antecesor") return num(`¿Qué número va antes del ${miles(n)}?`, n - 1, `Antes del ${miles(n)} va el ${miles(n - 1)} (se le resta 1).`);
    if (tipo === "decenas") { const d = Math.floor(n / 10) % 10; return num(`¿Qué número está en el lugar de las decenas en ${miles(n)}?`, d, `En ${miles(n)}, las decenas son el ${d}: es la segunda cifra de derecha a izquierda.`); }
    const m = ent(Math.floor(t / 10) + 1, t - 1, r); if (m === n) return num(`¿Qué número va después del ${miles(n)}?`, n + 1, `Después del ${miles(n)} va el ${miles(n + 1)}.`);
    return opc(`¿Cuál número es mayor?`, Math.max(n, m), [Math.min(n, m)], `${miles(Math.max(n, m))} es mayor que ${miles(Math.min(n, m))}.`, r, 2);
  } },
  { id: "geometria", nombre: "Geometría", emoji: "📐", grados: [1, 2, 3, 4, 5, 6], pregunta: (r, g) => {
    const figuras = [["triángulo", 3], ["cuadrado", 4], ["rectángulo", 4], ["pentágono", 5], ["hexágono", 6], ["octágono", 8]];
    // En 1° y 2° solo hay pocas preguntas de lados: la mitad de las veces sale una con dibujo (js/geometria.js)
    if (g <= 2 && r() < 0.5) return preguntaGeometria(r, g);
    const tipo = g <= 2 ? "lados" : elegir(g >= 4 ? ["perimetro", "area", "angulo", "lados"] : ["perimetro", "lados", "figura"], r);
    if (tipo === "lados") { const [f, l] = elegir(figuras.slice(0, g <= 1 ? 3 : 6), r); return num(`¿Cuántos lados tiene un ${f}?`, l, `El ${f} tiene ${l} lados.`); }
    if (tipo === "figura") { const [f, l] = elegir(figuras.filter(x => x[0] !== "rectángulo"), r); return opc(`¿Qué figura tiene ${l} lados?`, f, figuras.filter(x => x[1] !== l).map(x => x[0]), `La figura con ${l} lados es el ${f}.`, r); }
    const a = ent(2, g >= 5 ? 25 : 12, r), b = ent(2, g >= 5 ? 25 : 12, r);
    if (tipo === "perimetro") return num(`Un rectángulo mide ${a} cm de largo y ${b} cm de ancho. ¿Cuál es su perímetro (en cm)?`, 2 * (a + b), `Perímetro = suma de todos los lados: ${a} + ${b} + ${a} + ${b} = ${2 * (a + b)} cm.`);
    if (tipo === "area") return num(`Un rectángulo mide ${a} cm de largo y ${b} cm de ancho. ¿Cuál es su área (en cm²)?`, a * b, `Área = largo × ancho: ${a} × ${b} = ${a * b} cm².`);
    const angulos = [["agudo", "mide menos de 90°", ent(10, 80, r)], ["recto", "mide exactamente 90°", 90], ["obtuso", "mide más de 90° y menos de 180°", ent(100, 170, r)]];
    const [nombre, def, grados] = elegir(angulos, r);
    return opc(`Un ángulo de ${grados}° es…`, nombre, angulos.map(x => x[0]), `Es ${nombre}: ${def}.`, r);
  } },
  { id: "fracciones", nombre: "Fracciones", emoji: "🍕", grados: [3, 4, 5, 6], pregunta: fracciones },
  { id: "division-residuo", nombre: "División con residuo", emoji: "🥭", grados: [3, 4], pregunta: divisionResiduo },
  { id: "hora", nombre: "La hora", emoji: "🕒", grados: [1, 2, 3], pregunta: (r) => {
    const h = ent(1, 12, r), media = r() < 0.5;
    const reloj = String.fromCodePoint((media ? 0x1F55C : 0x1F550) + h - 1);
    const bien = media ? `${h}:30` : `${h}:00`, otras = [`${h % 12 + 1}:00`, `${h}:${media ? "00" : "30"}`, `${(h + 10) % 12 + 1}:30`, `${h}:15`];
    return opc(`¿Qué hora marca el reloj? <span style="font-size:2.4rem">${reloj}</span>`, bien, otras, media ? `Son las ${h} y media (${h}:30): la aguja larga apunta al 6.` : `Son las ${h} en punto (${h}:00): la aguja larga apunta al 12.`, r);
  } },
  { id: "tiempo", nombre: "Tiempo transcurrido", emoji: "🚌", grados: [2, 3, 4, 5], pregunta: tiempo },
  { id: "area", nombre: "Perímetro y área", emoji: "🟩", grados: [3, 4, 5, 6], pregunta: perimetroArea },
  { id: "decimales", nombre: "Decimales", emoji: "🔟", grados: [4, 5, 6], pregunta: decimales },
  { id: "porcentajes", nombre: "Porcentajes", emoji: "💯", grados: [5, 6], pregunta: porcentajes },
  { id: "graficos", nombre: "Gráficos y probabilidad", emoji: "📊", grados: [2, 3, 4, 5, 6], pregunta: graficosTema },
  { id: "alcancia", nombre: "Monedas y billetes", emoji: "🐷", grados: [1, 2, 3, 4], pregunta: (r, g) => preguntaPlata(r, g) },
  { id: "medidas", nombre: "Medidas", emoji: "📏", grados: [2, 3, 4, 5, 6], pregunta: (r, g) => preguntaMedidas(r, g) },
  { id: "geometria-dibujos", nombre: "Figuras, ángulos y cuerpos", emoji: "🔺", grados: [1, 2, 3, 4, 5, 6], pregunta: (r, g) => preguntaGeometria(r, g) },
];

// ================= ESPAÑOL =================
const PALABRAS = {
  sustantivo: ["perro", "casa", "escuela", "mango", "maestra", "volcán", "río", "lápiz", "abuela", "pelota", "árbol", "mochila"],
  verbo: ["correr", "cantar", "come", "salta", "escribe", "jugar", "leer", "duerme", "nadar", "baila", "pinta", "camina"],
  adjetivo: ["grande", "bonito", "verde", "rápido", "alto", "feliz", "delicioso", "pequeña", "suave", "alegre", "frío", "lento"],
};
const QUE_ES = { sustantivo: "nombra personas, animales, cosas o lugares", verbo: "dice una acción (lo que se hace)", adjetivo: "dice cómo es algo (una cualidad)" };
const ANTONIMOS = [["grande", "pequeño"], ["alto", "bajo"], ["feliz", "triste"], ["rápido", "lento"], ["frío", "caliente"], ["día", "noche"], ["abrir", "cerrar"], ["subir", "bajar"], ["lleno", "vacío"], ["limpio", "sucio"]];
const SINONIMOS = [["bonito", "lindo"], ["contento", "feliz"], ["rápido", "veloz"], ["empezar", "comenzar"], ["carro", "auto"], ["hablar", "conversar"], ["mirar", "observar"], ["regalo", "obsequio"], ["enojado", "molesto"], ["casa", "hogar"]];
const SILABAS = [["sol", 1], ["pan", 1], ["mar", 1], ["casa", 2], ["mano", 2], ["perro", 2], ["mesa", 2], ["gato", 2], ["pelota", 3], ["zapato", 3], ["tortuga", 3], ["camisa", 3], ["mariposa", 4], ["bicicleta", 4], ["elefante", 4], ["pulpería", 4], ["hipopótamo", 5], ["refrigerador", 5]];

const ESPANOL = [
  { id: "ortografia-bv", nombre: "Ortografía: b y v", emoji: "🐄", grados: [2, 3, 4, 5, 6], pregunta: r => orto(ORTO.bv, r) },
  { id: "ortografia-scz", nombre: "Ortografía: s, c y z", emoji: "🦊", grados: [3, 4, 5, 6], pregunta: r => orto(ORTO.scz, r) },
  { id: "ortografia-h", nombre: "Ortografía: la h", emoji: "🥚", grados: [2, 3, 4, 5, 6], pregunta: r => orto(ORTO.h, r) },
  { id: "silabas", nombre: "Sílabas", emoji: "👏", grados: [1, 2, 3], pregunta: r => {
    const [w, n] = elegir(SILABAS, r);
    return num(`¿Cuántas sílabas tiene la palabra «${w}»? (Aplaudí cada sílaba)`, n, `«${w}» tiene ${n} ${n === 1 ? "sílaba" : "sílabas"}.`);
  } },
  { id: "clases", nombre: "Clases de palabras y oraciones", emoji: "🏷️", grados: [2, 3, 4, 5, 6], pregunta: (r, g) => intentar(
    () => dePalabras(rondaPalabras(elegir(PALABRAS_POR_GRADO[g] || PALABRAS_POR_GRADO[2], r), r), r),
    () => { const clase = elegir(Object.keys(PALABRAS), r), w = elegir(PALABRAS[clase], r);
      return opc(`La palabra «${w}» es un…`, clase, Object.keys(PALABRAS), `«${w}» es un ${clase}: ${QUE_ES[clase]}.`, r); }) },
  { id: "tildes", nombre: "Sílabas y tildes", emoji: "✍️", grados: [2, 3, 4, 5, 6], pregunta: tildes },
  { id: "lectura", nombre: "Comprensión lectora", emoji: "📖", grados: [2, 3, 4, 5, 6], pregunta: lectura, serie: lecturas },
  { id: "antonimos", nombre: "Sinónimos y antónimos", emoji: "↔️", grados: [2, 3, 4, 5, 6], pregunta: r => {
    const ant = r() < 0.5, lista = ant ? ANTONIMOS : SINONIMOS, [a, b] = elegir(lista, r), [w, bien] = r() < 0.5 ? [a, b] : [b, a];
    const otras = lista.filter(x => !x.includes(w)).flat();
    return opc(ant ? `¿Cuál es el antónimo (lo contrario) de «${w}»?` : `¿Cuál es un sinónimo (significa lo mismo) de «${w}»?`, bien, otras, `${ant ? "Lo contrario" : "Un sinónimo"} de «${w}» es «${bien}».`, r);
  } },
  { id: "signos", nombre: "Punto, pregunta o exclamación", emoji: "❓", grados: [1, 2, 3, 4], pregunta: r => {
    const t = r() < 0.5 ? elegir(SIGNOS, r) : fraseSigno(elegir(["pregunta", "exclamacion", "punto"], r), r), s = signoDe(t);
    const nombres = { punto: "Punto final ( . )", pregunta: "Signos de pregunta ( ¿? )", exclamacion: "Signos de exclamación ( ¡! )" };
    return opc(`¿Qué signos le faltan? «${sinSignos(t)}»`, nombres[s], Object.values(nombres), `Se escribe: «${t}».`, r);
  } },
  { id: "mayusculas", nombre: "Mayúsculas", emoji: "🔠", grados: [1, 2, 3, 4], pregunta: r => {
    const bien = fraseMayus(r), ws = bien.split(" ");
    const mal1 = ws.map((w, i) => (i > 0 && /^[A-ZÁÉÍÓÚÑ]/.test(w) ? w.toLocaleLowerCase("es") : w)).join(" ");
    const mal2 = ws[0].toLocaleLowerCase("es") + " " + ws.slice(1).join(" ");
    const mal3 = ws.map(w => w[0].toLocaleUpperCase("es") + w.slice(1)).join(" ");
    return opc(`¿Cuál oración está bien escrita?`, bien, [mal1, mal2, mal3], `«${bien}»: la primera palabra y los nombres de personas, mascotas y lugares van con mayúscula.`, r);
  } },
];
function orto(lista, r) {
  const p = elegir(lista, r), antes = p.w.slice(0, p.i), despues = p.w.slice(p.i + p.l.length);
  const ops = p.grupo === "bv" ? ["b", "v"] : p.grupo === "scz" ? ["s", "c", "z"] : ["con h", "sin h"];
  return opc(`${p.e} ¿Qué va en el espacio? <b style="font-size:1.6rem">${antes}__${despues}</b>`, p.grupo === "h" ? (p.l ? "con h" : "sin h") : p.l, ops,
    `Se escribe «${p.w}». ${regla(p).replace(/<[^>]+>/g, "")}`, r, ops.length);
}

// ================= CIENCIAS =================
const CUBRE = { pelo: "pelo", plumas: "plumas", escamas: "escamas", caparazon: "caparazón", piel: "piel lisa y húmeda" };

const CIENCIAS = [
  { id: "estados", nombre: "Estados de la materia", emoji: "🧊", grados: [1, 2, 3, 4], pregunta: r => {
    const c = elegir(COSAS, r);
    return opc(`${c.e} ${c.n[0].toUpperCase() + c.n.slice(1)} está en estado…`, ESTADOS[c.s].nombre, Object.values(ESTADOS).map(x => x.nombre), ESTADOS[c.s].explica.replace(/<[^>]+>/g, ""), r);
  } },
  { id: "cambios", nombre: "Cambios de estado", emoji: "🫠", grados: [2, 3, 4, 5, 6], pregunta: r => {
    const s = elegir(SITUACIONES, r), c = CAMBIOS[s.c];
    return opc(`${s.e} ${s.t} ¿Qué le pasó?`, c.nombre, Object.values(CAMBIOS).map(x => x.nombre), `${c.nombre[0].toUpperCase() + c.nombre.slice(1)}: pasa de ${c.de}.`, r, 4);
  } },
  { id: "planta", nombre: "Partes de la planta", emoji: "🌱", grados: [1, 2, 3], pregunta: r => {
    if (r() < 0.5) { const p = elegir(PLANTA, r); return opc(`¿Qué parte de la planta hace esto? «${p.sirve.replace(/ ¡.*$/, "")}»`, p.nombre, PLANTA.map(x => x.nombre), `${p.el[0].toUpperCase() + p.el.slice(1)}: ${p.sirve}`, r); }
    const c = elegir(COMIDAS, r), p = PLANTA.find(x => x.id === c.parte);
    return opc(`${c.e} ¿Qué parte de la planta es ${c.n}?`, p.nombre, PLANTA.map(x => x.nombre), c.dato, r);
  } },
  { id: "cuerpo", nombre: "El cuerpo humano", emoji: "🫀", grados: [1, 2, 3, 4, 5, 6], pregunta: cuerpoTema },
  { id: "animales", nombre: "Los animales", emoji: "🐸", grados: [1, 2, 3, 4], pregunta: r => {
    const ids = Object.keys(ANIMALES).filter(id => CUBRE[ANIMALES[id].cubierta]), a = ANIMALES[elegir(ids, r)];
    return opc(`${a.e} ¿Qué cubre el cuerpo ${a.art === "el" ? "del" : "de la"} ${a.n}?`, CUBRE[a.cubierta], Object.values(CUBRE), `${a.art[0].toUpperCase() + a.art.slice(1)} ${a.n} tiene ${CUBRE[a.cubierta]}.`, r);
  } },
  { id: "cadenas", nombre: "Cadenas alimenticias", emoji: "🔗", grados: [2, 3, 4, 5, 6], pregunta: cadenasTema },
  { id: "ecosistemas", nombre: "Ecosistemas de Costa Rica", emoji: "🌳", grados: [3, 4, 5, 6], pregunta: r => {
    const lugar = r() < 0.4, x = elegir(lugar ? LUGARES : SERES, r), malos = Object.keys(ECOS).filter(k => k !== x.eco && !(x.tambien || []).includes(k));
    return opc(lugar ? `¿Qué ecosistema hay en ${x.n}?` : `${x.e} ¿En qué ecosistema vive ${x.n.toLowerCase()}?`, ECOS[x.eco].n, malos.map(k => ECOS[k].n),
      `${ECOS[x.eco].n}: ${ECOS[x.eco].como}.`, r);
  } },
];

// ================= ESTUDIOS SOCIALES =================
const LIMITES = [["¿Con qué país limita Costa Rica al norte?", "Nicaragua", ["Panamá", "Honduras", "Colombia"]], ["¿Con qué país limita Costa Rica al sur?", "Panamá", ["Nicaragua", "Guatemala", "Venezuela"]],
  ["¿Qué mar baña la costa este de Costa Rica?", "el mar Caribe", ["el océano Pacífico", "el mar Mediterráneo"]], ["¿Qué océano está al oeste de Costa Rica?", "el océano Pacífico", ["el mar Caribe", "el océano Atlántico"]],
  ["¿Por dónde sale el sol?", "por el este", ["por el oeste", "por el norte", "por el sur"]], ["¿Por dónde se oculta el sol?", "por el oeste", ["por el este", "por el norte", "por el sur"]],
  ["¿Cuántas provincias tiene Costa Rica?", "7", ["5", "9", "10"]], ["¿Cuál es la capital de Costa Rica?", "San José", ["Cartago", "Alajuela", "Limón"]]];

const SOCIALES = [
  { id: "provincias", nombre: "Provincias y cabeceras", emoji: "🗺️", grados: [2, 3, 4], pregunta: r => {
    const [p, c] = elegir(CABECERAS, r);
    return opc(`¿Cuál es la cabecera de la provincia de ${p}?`, c, CABECERAS.map(x => x[1]), `La cabecera de ${p} es ${c}.`, r);
  } },
  { id: "limites", nombre: "Límites de Costa Rica", emoji: "🌊", grados: [1, 2, 3, 4, 5, 6], pregunta: r => {
    const [t, bien, malos] = elegir(LIMITES, r);
    return opc(t, bien, malos, `La respuesta es: ${bien}.`, r);
  } },
  { id: "simbolos", nombre: "Símbolos patrios", emoji: "🌸", grados: [1, 2, 3, 4], pregunta: r => {
    const s = elegir(SIMBOLOS, r);
    return opc(`¿De qué símbolo se trata? «${s.pista}»`, s.nombre, SIMBOLOS.map(x => x.nombre), `${tituloSimbolo(s)}. ${s.dato}`, r);
  } },
  { id: "escudo", nombre: "El escudo nacional", emoji: "🛡️", grados: [2, 3, 4, 5, 6], pregunta: r => {
    const p = elegir(ESCUDO, r);
    return opc(`En el escudo nacional, ¿qué ${/^(La|El) /.test(p.nombre) ? "significa" : "significan"} ${p.nombre.toLowerCase()}?`, p.significa, ESCUDO.map(x => x.significa), `${p.nombre}: ${p.significa}`, r);
  } },
  { id: "efemerides", nombre: "Efemérides", emoji: "📅", grados: [2, 3, 4, 5, 6], pregunta: r => {
    const f = elegir(FECHAS, r);
    return r() < 0.5
      ? opc(`¿Qué se celebra el ${f.f}?`, f.n, FECHAS.map(x => x.n), `${f.f}: ${f.n}. ${f.porque}`, r)
      : opc(`¿Qué día se celebra: ${f.n}?`, f.f, FECHAS.map(x => x.f), `${f.n}: ${f.f}. ${f.porque}`, r);
  } },
  { id: "historia", nombre: "Historia de Costa Rica", emoji: "🏛️", grados: [2, 3, 4, 5, 6], pregunta: historiaTema },
  { id: "gobierno", nombre: "Gobierno y ciudadanía", emoji: "⚖️", grados: [5, 6], pregunta: gobiernoTema },
  { id: "direcciones", nombre: "Puntos cardinales y direcciones", emoji: "🧭", grados: [1, 2, 3, 4, 5, 6], pregunta: direcciones },
  { id: "comunidad", nombre: "Mi comunidad", emoji: "🏘️", grados: [1, 2], pregunta: (r, g) => preguntaComunidad(r, g) },
];

// ================= INGLÉS =================
const NUMEROS_EN = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const DECENAS_EN = { 30: "thirty", 40: "forty", 50: "fifty", 60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety", 100: "one hundred" };
function vocab(temaId) {
  const t = VOCAB.find(x => x.id === temaId);
  return r => {
    const [e, en, es] = elegir(t.palabras, r), otras = t.palabras.filter(p => p[1] !== en);
    return r() < 0.5
      ? { ...opc(`${e} ¿Cómo se dice «${es}» en inglés?`, en, otras.map(p => p[1]), `«${es}» en inglés es «${en}».`, r), en: true }
      : opc(`${e} ¿Qué significa «${en}»?`, es, otras.map(p => p[2]), `«${en}» significa «${es}».`, r);
  };
}
const INGLES = [
  ...VOCAB.map(t => ({ id: `vocab-${t.id}`, nombre: t.nombre.replace(/^\S+ /, ""), emoji: t.nombre.split(" ")[0], grados: [1, 2, 3, 4, 5, 6], pregunta: vocab(t.id) })),
  { id: "numbers", nombre: "Numbers", emoji: "🔢", grados: [1, 2, 3, 4, 5, 6], pregunta: (r, g) => {
    const lista = g <= 2 ? NUMEROS_EN.slice(1, 13).map((w, i) => [i + 1, w]) : [...NUMEROS_EN.slice(1).map((w, i) => [i + 1, w]), ...Object.entries(DECENAS_EN).map(([n, w]) => [Number(n), w])];
    const [n, w] = elegir(lista, r);
    return { ...opc(`¿Cómo se escribe el número ${n} en inglés?`, w, lista.map(x => x[1]), `${n} en inglés es «${w}».`, r), en: true };
  } },
  { id: "frases", nombre: "Frases (traducir)", emoji: "💬", grados: [3, 4, 5, 6], pregunta: r => {
    const [f, ...otras] = frases(4, r, { tiempo: 0.2 });
    return opc(`¿Qué significa: «${f.en}»?`, f.es, otras.map(o => o.es), `«${f.en}» significa «${f.es}».`, r);
  } },
];

export const MATERIAS_EXAMEN = [
  { id: "mate", nombre: "Matemáticas", emoji: "🔢", color: "#2F7FD1", temas: MATE },
  { id: "espanol", nombre: "Español", emoji: "✏️", color: "#E8574A", temas: ESPANOL },
  { id: "ciencias", nombre: "Ciencias", emoji: "🌱", color: "#2FA85A", temas: CIENCIAS },
  { id: "sociales", nombre: "Estudios Sociales", emoji: "🗺️", color: "#F29A1F", temas: SOCIALES },
  { id: "ingles", nombre: "Inglés", emoji: "💬", color: "#8E5BD9", temas: INGLES },
];

/** Temas de una materia para un grado. */
export const temasPara = (materia, grado) => MATERIAS_EXAMEN.find(m => m.id === materia).temas.filter(t => t.grados.includes(grado));

/**
 * Arma el examen: `porTema` preguntas de cada tema, sin repetir preguntas dentro del mismo tema.
 * Si el tema tiene `serie` (la lectura), salen juntas varias preguntas sobre un mismo texto.
 * Devuelve [{ tema, preguntas: [...] }].
 */
export function armarExamen({ materia, grado, temas, porTema = 5, nombre = "" }, r = Math.random) {
  const m = MATERIAS_EXAMEN.find(x => x.id === materia);
  return temas.map(id => {
    const tema = m.temas.find(t => t.id === id), vistas = new Set(), preguntas = [];
    for (let k = 0; preguntas.length < porTema && k < porTema * 30; k++) {
      for (const q of tema.serie ? tema.serie(r, grado, nombre) : [tema.pregunta(r, grado, nombre)]) {
        // Con el texto y la respuesta: «¿Cuál oración está bien escrita?» se repite con otras oraciones
        const clave = `${q.texto}\n${q.correcta}`;
        if (preguntas.length >= porTema || vistas.has(clave)) continue;
        vistas.add(clave); preguntas.push({ ...q, tema: id });
      }
    }
    return { tema, preguntas };
  });
}

/**
 * ¿Está bien la respuesta? En las de número se aceptan puntos o espacios de miles («1.250» = «1250»),
 * la coma o el punto decimal («2,5» = «2.5») y el signo de colones.
 */
export function revisar(q, respuesta) {
  if (respuesta === undefined || respuesta === null || String(respuesta).trim() === "") return false;
  if (q.tipo === "numero") return igual(q.correcta, String(respuesta).replace(/₡/g, ""), true);
  return respuesta === q.correcta;
}

/** Nota de 0 a 100, como en la escuela. */
export const nota = (bien, total) => Math.round((bien / total) * 100);
