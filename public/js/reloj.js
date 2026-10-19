// 🕒 Lógica de «Aprendo la hora» (sin pantalla, para poder probarla sola): la hora dicha a lo tico
// y la escalera 🪜, que va de las horas en punto a los minutos exactos y a. m. / p. m.

const N = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
  "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte",
  "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete",
  "veintiocho", "veintinueve", "treinta"];
const HORAS = ["", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce"];
const DECENAS = { 3: "treinta", 4: "cuarenta", 5: "cincuenta" };
const numero = n => n <= 30 ? N[n] : (n % 10 === 0 ? DECENAS[Math.floor(n / 10)] : DECENAS[Math.floor(n / 10)] + " y " + N[n % 10]);
const artHora = h => h === 1 ? "Es la una" : "Son las " + HORAS[h];

/** La hora en palabras, a lo tico: «Son las tres y cuarto», «Un cuarto para las cuatro». */
export function enPalabras(h, m) {
  if (m === 0) return artHora(h) + " en punto";
  if (m === 15) return artHora(h) + " y cuarto";
  if (m === 30) return artHora(h) + " y media";
  if (m === 45) {
    const next = h === 12 ? 1 : h + 1;
    return "Un cuarto para " + (next === 1 ? "la una" : "las " + HORAS[next]);
  }
  return artHora(h) + " y " + numero(m);
}

/** Para pedir que ponga la hora: «a las tres y media», «a la una en punto», «a un cuarto para las cuatro». */
export function aLaHora(h, m) {
  const p = enPalabras(h, m);
  if (p.startsWith("Es la ")) return "a la " + p.slice(6);
  if (p.startsWith("Son las ")) return "a las " + p.slice(8);
  return "a un c" + p.slice(4); // «Un cuarto para…»
}

export const dosCifras = m => String(m).padStart(2, "0");

// a. m. o p. m.: lo que hace un niño a esa hora (la misma hora del reloj puede ser de mañana o de noche)
export const MOMENTOS = [
  { e: "🐓", txt: "Canta el gallo", h: 5, m: 0, ampm: "am" },
  { e: "🌅", txt: "Me levanto", h: 6, m: 0, ampm: "am" },
  { e: "🥣", txt: "Desayuno", h: 6, m: 30, ampm: "am" },
  { e: "🏫", txt: "Entro a la escuela", h: 7, m: 0, ampm: "am" },
  { e: "🍎", txt: "Salgo a recreo", h: 9, m: 30, ampm: "am" },
  { e: "🍚", txt: "Almuerzo", h: 12, m: 30, ampm: "pm" },
  { e: "📚", txt: "Hago la tarea", h: 2, m: 0, ampm: "pm" },
  { e: "☕", txt: "Tomo cafecito con pan", h: 3, m: 30, ampm: "pm" },
  { e: "⚽", txt: "Juego bola con mis amigos", h: 4, m: 0, ampm: "pm" },
  { e: "🛁", txt: "Me baño", h: 6, m: 0, ampm: "pm" },
  { e: "🍲", txt: "Ceno con mi familia", h: 7, m: 0, ampm: "pm" },
  { e: "🌙", txt: "Me voy a dormir", h: 8, m: 30, ampm: "pm" },
  { e: "😴", txt: "Estoy bien dormido", h: 2, m: 0, ampm: "am" },
];
export const AMPM = {
  am: { corto: "a. m.", voz: "a eme", cuando: "de la medianoche al mediodía: la madrugada y la mañana" },
  pm: { corto: "p. m.", voz: "pe eme", cuando: "del mediodía a la medianoche: la tarde y la noche" },
};

const CINCO = Array.from({ length: 12 }, (_, i) => i * 5);
const EXACTOS = Array.from({ length: 60 }, (_, i) => i).filter(m => m % 5);
// tipo: "leer" (dice la hora que marca el reloj) · "poner" (mueve las agujas) · "ampm" · "mezcla"
// minutos: de dónde sale el minuto (los repetidos salen más: así lo nuevo del escalón sale más seguido)
// paso: de a cuántos minutos se mueven las agujas al ponerlas
export const ESCALONES = [
  { nombre: "En punto", tipo: "leer", minutos: [0] },
  { nombre: "Poné la hora en punto", tipo: "poner", minutos: [0], paso: 5 },
  { nombre: "Y media", tipo: "leer", minutos: [30, 30, 0] },
  { nombre: "Poné y media", tipo: "poner", minutos: [30, 30, 0], paso: 5 },
  { nombre: "Y cuarto y un cuarto para", tipo: "leer", minutos: [15, 45, 15, 45, 30] },
  { nombre: "Poné los cuartos", tipo: "poner", minutos: [15, 45, 15, 45, 30], paso: 5 },
  { nombre: "De 5 en 5", tipo: "leer", minutos: CINCO },
  { nombre: "Poné de 5 en 5", tipo: "poner", minutos: CINCO, paso: 5 },
  { nombre: "El minuto exacto", tipo: "leer", minutos: [...EXACTOS, ...CINCO.slice(1, 4)] },
  { nombre: "Poné el minuto exacto", tipo: "poner", minutos: [...EXACTOS, ...CINCO.slice(1, 4)], paso: 1 },
  { nombre: "¿a. m. o p. m.?", tipo: "ampm" },
  { nombre: "De todo un poco", tipo: "mezcla", minutos: Array.from({ length: 60 }, (_, i) => i), paso: 1 },
];

/** Escalón para empezar según la edad: en 1.° se ven las en punto y media; en 2.°, cuartos y de 5 en 5; en 3.°, el resto. */
export function inicioReloj(edad) {
  if (edad === null || edad <= 6) return 0;
  if (edad === 7) return 2;
  if (edad === 8) return 4;
  if (edad === 9) return 6;
  return 8;
}

const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

/**
 * Un reto del escalón: { tipo: "leer" | "poner", h, m, paso } o { tipo: "ampm", h, m, momento }.
 * No repite la hora del anterior. En «poner», `desde` es dónde arrancan las agujas (lejos de la respuesta).
 */
export function retoEscalon(i, anterior = null, rnd = Math.random) {
  const e = ESCALONES[i];
  let r = null;
  for (let k = 0; k < 40; k++) {
    const tipo = e.tipo === "mezcla" ? azar(["leer", "poner", "ampm"], rnd) : e.tipo;
    if (tipo === "ampm") {
      const momento = azar(MOMENTOS, rnd);
      r = { tipo, h: momento.h, m: momento.m, momento };
    } else {
      const h = 1 + Math.floor(rnd() * 12), m = azar(e.minutos, rnd);
      r = { tipo, h, m };
      if (tipo === "poner") {
        r.paso = e.paso;
        // Las agujas arrancan en otra hora en punto, por lo menos dos horas lejos
        const meta = (h % 12) * 60 + m;
        r.desde = (meta + 60 * (2 + Math.floor(rnd() * 8))) % 720;
        r.desde -= r.desde % 60;
      }
    }
    if (!anterior || anterior.h !== r.h || anterior.m !== r.m || anterior.tipo !== r.tipo) return r;
  }
  return r;
}

/** Minutos en 12 horas (0 a 719) de una hora h:m, para comparar con las agujas. */
export const totalDe = (h, m) => (h % 12) * 60 + m;

/** Revisa la escalera y las palabras. Devuelve [] si todo está bien. */
export function revisarReloj(rondas = 3000, rnd = Math.random) {
  const errores = [];
  ESCALONES.forEach((e, i) => {
    let anterior = null;
    const vistas = new Set();
    for (let k = 0; k < rondas; k++) {
      const r = retoEscalon(i, anterior, rnd);
      const id = `escalón ${i + 1} ${JSON.stringify(r)}`;
      vistas.add(`${r.tipo}${r.h}:${r.m}`);
      if (!(r.h >= 1 && r.h <= 12 && r.m >= 0 && r.m <= 59)) errores.push(`${id}: hora imposible`);
      if (e.tipo !== "mezcla" && r.tipo !== e.tipo) errores.push(`${id}: tipo equivocado`);
      if (r.tipo !== "ampm" && e.minutos && !e.minutos.includes(r.m)) errores.push(`${id}: minuto fuera del escalón`);
      if (r.tipo === "poner") {
        if (r.paso !== e.paso || r.m % r.paso) errores.push(`${id}: no se puede poner con pasos de ${r.paso}`);
        const d = Math.abs(r.desde - totalDe(r.h, r.m)), dist = Math.min(d, 720 - d);
        if (r.desde % 60 || dist < 60) errores.push(`${id}: las agujas arrancan muy cerca (${r.desde})`);
      }
      if (anterior && anterior.tipo === r.tipo && anterior.h === r.h && anterior.m === r.m && vistas.size > 1) errores.push(`${id}: repite`);
      anterior = r;
      if (errores.length > 20) return;
    }
    if (vistas.size < 4) errores.push(`escalón ${i + 1}: muy pocos retos distintos`);
  });
  // Palabras: todas las horas y minutos, sin huecos ni números sueltos
  for (let h = 1; h <= 12; h++) for (let m = 0; m < 60; m++) {
    const p = enPalabras(h, m), a = aLaHora(h, m);
    if (/undefined|\d|  /.test(p + a)) errores.push(`${h}:${m}: «${p}» / «${a}»`);
    if (!/^a (la|las|un cuarto para) /.test(a)) errores.push(`${h}:${m}: «${a}»`);
  }
  const casos = [[1, 0, "Es la una en punto"], [3, 15, "Son las tres y cuarto"], [12, 45, "Un cuarto para la una"], [7, 21, "Son las siete y veintiuno"],
    [9, 38, "Son las nueve y treinta y ocho"], [6, 30, "Son las seis y media"]];
  for (const [h, m, t] of casos) if (enPalabras(h, m) !== t) errores.push(`${h}:${m}: «${enPalabras(h, m)}» y no «${t}»`);
  if (aLaHora(3, 45) !== "a un cuarto para las cuatro" || aLaHora(1, 30) !== "a la una y media") errores.push(`aLaHora: «${aLaHora(3, 45)}», «${aLaHora(1, 30)}»`);
  // Cada momento: a. m. antes del mediodía, p. m. después (12:30 es p. m.)
  for (const x of MOMENTOS) {
    const h24 = x.ampm === "am" ? x.h % 12 : (x.h % 12) + 12;
    if (h24 < 0 || h24 > 23) errores.push(`${x.txt}: hora rara`);
  }
  return errores;
}
