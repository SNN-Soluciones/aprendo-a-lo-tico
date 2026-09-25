// 🎲 Generador de datos (verdaderos y falsos) y opiniones para «¿Dato u opinión?».
// Los datos salen de listas que se pueden comprobar (provincias, cuentas, medidas, símbolos, animales),
// así que siempre se sabe si son ciertos. Las opiniones marcan con *asteriscos* las palabras que muestran la opinión.
import { ANIMALES } from "./detective.js";

const elegir = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const mayus = t => t[0].toLocaleUpperCase("es") + t.slice(1);
const otro = (arr, x, rnd) => { let y; do y = elegir(arr, rnd); while (y === x); return y; };

// ---------- Datos ----------
export const CABECERAS = [["San José", "San José"], ["Alajuela", "Alajuela"], ["Cartago", "Cartago"], ["Heredia", "Heredia"],
  ["Guanacaste", "Liberia"], ["Puntarenas", "Puntarenas"], ["Limón", "Limón"]];

const MEDIDAS = [
  { t: n => `Un día tiene ${n} horas.`, n: 24, mal: [12, 20, 30], como: "Se comprueba en el reloj: el día completo, con la noche, tiene 24 horas." },
  { t: n => `Una hora tiene ${n} minutos.`, n: 60, mal: [30, 100, 50], como: "Se comprueba en el reloj: la aguja larga da una vuelta en 60 minutos." },
  { t: n => `Un año tiene ${n} meses.`, n: 12, mal: [10, 7, 15], como: "Se comprueba en el calendario: de enero a diciembre hay 12 meses." },
  { t: n => `Una semana tiene ${n} días.`, n: 7, mal: [5, 10, 6], como: "Se comprueba en el calendario: de lunes a domingo." },
  { t: n => `Un metro tiene ${n} centímetros.`, n: 100, mal: [10, 50, 1000], como: "Se comprueba midiendo con una cinta métrica." },
  { t: n => `Un minuto tiene ${n} segundos.`, n: 60, mal: [100, 30, 10], como: "Se comprueba contando con un cronómetro." },
  { t: n => `Una docena son ${n} huevos.`, n: 12, mal: [10, 6, 20], como: "Se comprueba contando los huevos del cartón." },
];

// Símbolos: [qué es, lo verdadero, otros que NO son] (con artículo)
const SIMBOLOS = [
  ["El ave nacional de Costa Rica es", "el yigüirro", ["el tucán", "la lapa roja", "el colibrí"]],
  ["La flor nacional de Costa Rica es", "la guaria morada", ["la rosa", "el girasol", "la margarita"]],
  ["El árbol nacional de Costa Rica es", "el guanacaste", ["la ceiba", "el roble", "el almendro"]],
  ["El instrumento musical nacional es", "la marimba", ["la guitarra", "el tambor", "el violín"]],
  ["El símbolo nacional del trabajo es", "la carreta", ["el tractor", "el martillo", "la bicicleta"]],
  ["El símbolo de la fauna marina de Costa Rica es", "el manatí", ["el delfín", "el tiburón", "la ballena"]],
  ["El símbolo de la fauna silvestre de Costa Rica es", "el venado cola blanca", ["el jaguar", "el perezoso", "el mono congo"]],
  ["La moneda de Costa Rica es", "el colón", ["el dólar", "el peso", "el euro"]],
];

// Animales del jaguar detective: qué cubre su cuerpo y si vuela
const CUBIERTA = { pelo: "pelo", plumas: "plumas", escamas: "escamas", caparazon: "caparazón" };

function datoCuenta(rnd) {
  const tipo = elegir(["+", "-", "×"], rnd);
  let a, b, r;
  if (tipo === "+") { a = 2 + Math.floor(rnd() * 48); b = 2 + Math.floor(rnd() * 48); r = a + b; }
  else if (tipo === "-") { a = 10 + Math.floor(rnd() * 90); b = 1 + Math.floor(rnd() * (a - 1)); r = a - b; }
  else { a = 2 + Math.floor(rnd() * 9); b = 2 + Math.floor(rnd() * 9); r = a * b; }
  const cuenta = `${a} ${tipo === "-" ? "−" : tipo} ${b}`;
  const v = rnd() < 0.5;
  let mostrado = v ? r : r + elegir([-10, -2, -1, 1, 2, 10], rnd);
  if (mostrado < 0) mostrado = r + 1;
  return v
    ? { t: `${cuenta} = ${r}.`, v, como: "Se comprueba haciendo la cuenta." }
    : { t: `${cuenta} = ${mostrado}.`, v, real: `Haciendo la cuenta: ${cuenta} = ${r}.` };
}

function datoCabecera(rnd) {
  const [prov, cab] = elegir(CABECERAS, rnd);
  if (rnd() < 0.5) return { t: `La cabecera de ${prov} es ${cab}.`, v: true, como: "Se comprueba en un mapa de provincias y cabeceras." };
  const falsa = otro(CABECERAS.map(c => c[1]), cab, rnd);
  return { t: `La cabecera de ${prov} es ${falsa}.`, v: false, real: `La cabecera de ${prov} es ${cab}.${falsa !== "San José" ? ` ${falsa} es la cabecera de otra provincia.` : ""}` };
}

function datoMedida(rnd) {
  const m = elegir(MEDIDAS, rnd);
  if (rnd() < 0.5) return { t: m.t(m.n), v: true, como: m.como };
  return { t: m.t(elegir(m.mal, rnd)), v: false, real: m.t(m.n) };
}

function datoSimbolo(rnd) {
  const [frase, bien, malos] = elegir(SIMBOLOS, rnd);
  if (rnd() < 0.5) return { t: `${frase} ${bien}.`, v: true, como: "Se comprueba en un libro de símbolos nacionales." };
  return { t: `${frase} ${elegir(malos, rnd)}.`, v: false, real: `${frase} ${bien}.` };
}

function datoAnimal(rnd) {
  const ids = Object.keys(ANIMALES).filter(id => CUBIERTA[ANIMALES[id].cubierta]);
  const a = ANIMALES[elegir(ids, rnd)];
  const quien = mayus(`${a.art} ${a.n}`);
  if (rnd() < 0.5) {
    // ¿Qué le cubre el cuerpo?
    const bien = CUBIERTA[a.cubierta];
    if (rnd() < 0.5) return { t: `${quien} tiene ${bien}.`, v: true, como: "Se comprueba observándolo o en un libro de animales." };
    return { t: `${quien} tiene ${otro(Object.values(CUBIERTA), bien, rnd)}.`, v: false, real: `${quien} tiene ${bien}.` };
  }
  // ¿Puede volar?
  const dice = rnd() < 0.5;
  const t = `${quien} ${dice ? "puede volar" : "no puede volar"}.`;
  return dice === a.vuela
    ? { t, v: true, como: "Se comprueba observándolo o en un libro de animales." }
    : { t, v: false, real: `${quien} ${a.vuela ? "sí puede volar" : "no puede volar"}.` };
}

const GENERADORES = [datoCuenta, datoCabecera, datoMedida, datoSimbolo, datoAnimal];

/** Un dato al azar. `v`: true / false para pedir uno verdadero o falso (si no, cualquiera). */
export function dato(rnd = Math.random, v) {
  for (let k = 0; k < 40; k++) {
    const d = elegir(GENERADORES, rnd)(rnd);
    if (v === undefined || d.v === v) return { ...d, generado: true };
  }
  return { t: "Una semana tiene 7 días.", v: true, como: "Se comprueba en el calendario.", generado: true };
}

// ---------- Opiniones ----------
// g: m / f / mp / fp · comida: se puede decir «rico» · animal: se puede decir «tierno»
const COSAS = [
  { t: "el gallo pinto", g: "m", comida: true }, { t: "la playa", g: "f" }, { t: "el fútbol", g: "m" },
  { t: "la lluvia", g: "f" }, { t: "el invierno", g: "m" }, { t: "la clase de mate", g: "f" },
  { t: "los perezosos", g: "mp", animal: true }, { t: "las películas de miedo", g: "fp" }, { t: "el helado de mora", g: "m", comida: true },
  { t: "la música de marimba", g: "f" }, { t: "los lunes", g: "mp" }, { t: "las vacaciones", g: "fp" },
  { t: "los tamales", g: "mp", comida: true }, { t: "las ranas", g: "fp", animal: true }, { t: "la sopa de verduras", g: "f", comida: true },
  { t: "el recreo", g: "m" }, { t: "los días de sol", g: "mp" },
];
const G = { m: 0, f: 1, mp: 2, fp: 3 };
const SER = { m: "es", f: "es", mp: "son", fp: "son" };
// para: con qué tipo de cosa tiene sentido (comida, animal u otra cosa)
const ADJ = [
  { f: ["divertido", "divertida", "divertidos", "divertidas"], para: ["animal", "cosa"] },
  { f: ["aburrido", "aburrida", "aburridos", "aburridas"], para: ["cosa"] },
  { f: ["bonito", "bonita", "bonitos", "bonitas"], para: ["animal", "cosa"] },
  { f: ["feo", "fea", "feos", "feas"], para: ["comida", "animal", "cosa"] },
  { f: ["rico", "rica", "ricos", "ricas"], para: ["comida"] },
  { f: ["delicioso", "deliciosa", "deliciosos", "deliciosas"], para: ["comida"] },
  { f: ["tierno", "tierna", "tiernos", "tiernas"], para: ["animal"] },
];
const ART = ["el", "la", "los", "las"];
const OJALA = ["*Ojalá* mañana no llueva.", "*Ojalá* vayamos a la playa en vacaciones.", "*Ojalá* hoy haya arroz con leche.",
  "*Ojalá* el recreo durara más.", "*Ojalá* nieve en el Chirripó.", "*Ojalá* ganemos el partido del sábado."];

/** Una opinión al azar, con las palabras pista entre *asteriscos*. */
export function opinion(rnd = Math.random) {
  if (rnd() < 0.12) return elegir(OJALA, rnd);
  const c = elegir(COSAS, rnd), i = G[c.g];
  const tipo = c.comida ? "comida" : c.animal ? "animal" : "cosa";
  const a = elegir(ADJ.filter(x => x.para.includes(tipo)), rnd);
  const adj = a.f[i], cosa = mayus(c.t);
  return elegir([
    () => `*Creo que* ${c.t} ${SER[c.g]} *${adj}*.`,
    () => `*Me parece que* ${c.t} ${SER[c.g]} *${adj}*.`,
    () => `*Para mí,* ${c.t} ${SER[c.g]} *${adj}*.`,
    () => `${cosa} ${SER[c.g]} *${ART[i]} más ${adj}* del mundo.`,
    () => `${cosa} ${SER[c.g]} *${adj}*.`,
  ], rnd)();
}

// ---------- Mensajes para el detector de noticias ----------
// Un mensaje sospechoso se arma con pedazos; cada pedazo trae sus señales de alerta.
const GRITOS = ["¡¡URGENTE!!", "ATENCIÓN:", "INCREÍBLE:", "¡¡ÚLTIMA HORA!!"];
const SIN_FUENTE = ["Dicen que", "Alguien me contó que", "Un amigo de un amigo vio que", "Me dijeron que"];
const NORMALES = ["mañana no hay clases en todo el país", "el agua del tubo está contaminada", "van a cerrar todas las pulperías",
  "mañana va a caer un aguacero enorme", "el recreo ahora va a durar cinco minutos"];
const IMPOSIBLES = ["un perezoso ganó una carrera de carros", "una iguana aprendió a hablar inglés", "cayó una lluvia de helado en Cartago",
  "si comés cinco mangos te volvés invisible", "un tucán manejó el bus de Heredia", "en el volcán Poás encontraron un dinosaurio vivo"];
const APURA = ["¡Compartilo ya con todos!", "¡Pasalo rápido antes de que lo borren!", "¡Reenvialo a 10 personas hoy mismo!"];
const PIDE = ["Para saber más, escribí la clave del banco de tu mamá.", "Mandá tu nombre, dirección y el PIN de la tarjeta.", "Para ganar el premio, enviá la contraseña de tu cuenta."];
const PREMIOS = ["¡Ganaste un celular gratis!", "¡Te ganaste una bicicleta nueva!", "¡Sos el ganador de un millón de colones!"];

// Confiables: cada fuente con cosas que de verdad le toca informar
const CONFIABLES = [
  ["El Instituto Meteorológico Nacional (IMN) informó que", ["esta semana va a llover por las tardes en el Valle Central", "en Guanacaste va a hacer mucho calor este fin de semana"], "el IMN, que estudia el clima"],
  ["La directora avisó en la reunión de padres que", ["el paseo de la escuela es el viernes", "el lunes hay reunión de padres a las 5 de la tarde"], "la directora de la escuela"],
  ["Según la Municipalidad,", ["el camión de la basura pasa los martes y los jueves", "el sábado van a arreglar los huecos de la calle"], "la Municipalidad, que se encarga de eso"],
  ["Según el Ministerio de Salud,", ["lavarse las manos con jabón ayuda a evitar enfermedades", "este mes hay vacunas gratis en la clínica"], "el Ministerio de Salud"],
  ["La maestra escribió en el cuaderno de comunicaciones que", ["el jueves hay que traer una caja de cartón", "la tarea de ciencias es para el lunes"], "la maestra, por el cuaderno de la escuela"],
];
const EXPLICA = { grita: "grita con mayúsculas o muchos signos", apura: "apura para que lo compartás sin pensar", fuente: "no dice quién lo informa",
  imposible: "cuenta algo imposible o demasiado bueno para ser cierto", datos: "pide claves o datos (¡nunca los des! avisale a un adulto)" };

/** Un mensaje para el detector: { t, ok, senales, porque }. `ok`: true / false para pedir confiable o sospechoso. */
export function noticia(rnd = Math.random, ok = rnd() < 0.35) {
  if (ok) {
    const [fuente, cosas, quien] = elegir(CONFIABLES, rnd);
    return { t: `${fuente} ${elegir(cosas, rnd)}.`, ok: true, senales: [],
      porque: `Dice quién lo informa (${quien}), no grita, no apura y es algo normal que se puede comprobar.`, generado: true };
  }
  for (let k = 0; k < 20; k++) {
    const senales = new Set(), partes = [];
    if (rnd() < 0.3) {
      // Premio falso que pide datos
      partes.push(elegir(PREMIOS, rnd), elegir(PIDE, rnd)); senales.add("imposible"); senales.add("datos");
    } else {
      if (rnd() < 0.5) { partes.push(elegir(GRITOS, rnd)); senales.add("grita"); }
      const imposible = rnd() < 0.5;
      const cosa = imposible ? elegir(IMPOSIBLES, rnd) : elegir(NORMALES, rnd);
      if (imposible) senales.add("imposible");
      // Sin fuente (lo normal en estos mensajes)
      partes.push(`${elegir(SIN_FUENTE, rnd)} ${cosa}.`); senales.add("fuente");
      if (rnd() < 0.6) { partes.push(elegir(APURA, rnd)); senales.add("apura"); }
      if (rnd() < 0.15) { partes.push(elegir(PIDE, rnd)); senales.add("datos"); }
    }
    if (senales.size < 2) continue;
    const lista = [...senales];
    const porque = mayus(lista.map(x => EXPLICA[x]).join(", ").replace(/, ([^,]*)$/, " y $1")) + ".";
    return { t: partes.join(" "), ok: false, senales: lista, porque, generado: true };
  }
  return noticia(rnd, true);
}
