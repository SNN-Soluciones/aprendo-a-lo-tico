// 🎤 Contenido y preguntas de «My oral exam» (sin pantalla, para poder probarlo solo con node).
// Sigue el temario de la prueba oral y de comprensión auditiva de inglés (II periodo, 1.er ciclo):
//   1. Family members: Who is he? Who is she?
//   2. Parts of the house y house objects: Where is he/she? What is this? What are these? There is… / There are…
//   3. Animals: What animal is this? Is it big or small? What color is it? Where does the horse live? Where do cows live?
//
// Una pregunta:
//   { tipo: "oir" | "hablar", tema, instr, voz, html, respuesta: { en, es }, claves, opciones?, correcta?, explica }
//   voz es una lista de partes [texto, "es" | "en"]: se dicen una tras otra con la voz de cada idioma.
//   "oir":    la voz dice algo en inglés y el niño toca el dibujo (opciones, correcta).
//   "hablar": se ve un dibujo, la voz pregunta en inglés y el niño contesta en voz alta (respuesta modelo, claves para el 🎤).
//   "escribir": se ve un dibujo (y a veces se oye la palabra) y el niño la escribe en inglés (respuesta).
// Niveles (NIVELES y cfg): 🌱 1 con ayuditas · 🔥 2 más dibujos, parecidos y sin nombre · 🚀 3 como el examen, con preguntas
// combinadas, dos toques en orden y tiempo para contestar.
// Siempre hay UNA sola respuesta correcta (revisarOral lo comprueba).

const es = t => [t, "es"];
const en = t => [t, "en"];

// ---------- 👨‍👩‍👧 Family ----------
// g: "he" | "she" (cómo se dice en la respuesta)
export const FAMILIA = [
  { id: "father", en: "father", pron: "fáder", es: "papá", e: "👨", g: "he" },
  { id: "mother", en: "mother", pron: "máder", es: "mamá", e: "👩", g: "she" },
  { id: "sister", en: "sister", pron: "síster", es: "hermana", e: "👧", g: "she" },
  { id: "brother", en: "brother", pron: "bráder", es: "hermano", e: "👦", g: "he" },
  { id: "grandfather", en: "grandfather", pron: "gránd-fader", es: "abuelo", e: "👴", g: "he" },
  { id: "grandmother", en: "grandmother", pron: "gránd-mader", es: "abuela", e: "👵", g: "she" },
  { id: "uncle", en: "uncle", pron: "ánkol", es: "tío", e: "🧔", g: "he" },
  { id: "aunt", en: "aunt", pron: "ant", es: "tía", e: "👩‍🦰", g: "she" },
  { id: "cousin", en: "cousin", pron: "cásin", es: "primo", e: "🧒", g: "he" },
  { id: "cousins", en: "cousins", pron: "cásins", es: "primos", e: "👫", g: "they" },
];

// ---------- 🏠 Parts of the house ----------
export const CUARTOS = [
  { id: "kitchen", en: "kitchen", pron: "kíchen", es: "cocina", e: "🍳" },
  { id: "bedroom", en: "bedroom", pron: "béd-rum", es: "dormitorio", e: "🛌" },
  { id: "bathroom", en: "bathroom", pron: "báz-rum", es: "baño", e: "🛁" },
  { id: "living-room", en: "living room", pron: "líving rum", es: "sala", e: "🛋️" },
  { id: "dining-room", en: "dining room", pron: "dáining rum", es: "comedor", e: "🍽️" },
  { id: "laundry-room", en: "laundry room", pron: "lóndri rum", es: "cuarto de pilas", e: "🧺" },
  { id: "garage", en: "garage", pron: "garásh", es: "garaje", svg: "garage" },
];

// ---------- 🛋️ House objects ----------
// pl: plural · cuarto: dónde suele estar (para «There is a … in the …»)
export const OBJETOS = [
  { id: "sofa", en: "sofa", pron: "sóufa", pl: "sofas", es: "sofá", e: "🛋️", cuarto: "living-room" },
  { id: "television", en: "television", pron: "télevishon", pl: "televisions", es: "televisor", e: "📺", cuarto: "living-room" },
  { id: "table", en: "table", pron: "téibol", pl: "tables", es: "mesa", svg: "table", cuarto: "dining-room" },
  { id: "chair", en: "chair", pron: "cher", pl: "chairs", es: "silla", e: "🪑", cuarto: "dining-room" },
  { id: "bed", en: "bed", pron: "bed", pl: "beds", es: "cama", e: "🛏️", cuarto: "bedroom" },
  { id: "dresser", en: "dresser", pron: "dréser", pl: "dressers", es: "cómoda", svg: "dresser", cuarto: "bedroom" },
  { id: "toilet", en: "toilet", pron: "tóilet", pl: "toilets", es: "inodoro", e: "🚽", cuarto: "bathroom" },
  { id: "mirror", en: "mirror", pron: "míror", pl: "mirrors", es: "espejo", e: "🪞", cuarto: "bathroom" },
  { id: "window", en: "window", pron: "uíndou", pl: "windows", es: "ventana", e: "🪟", cuarto: "living-room" },
  { id: "stove", en: "stove", pron: "stóuv", pl: "stoves", es: "cocina (estufa)", svg: "stove", cuarto: "kitchen" },
  { id: "refrigerator", en: "refrigerator", pron: "refríyereitor", pl: "refrigerators", es: "refrigeradora", svg: "fridge", cuarto: "kitchen" },
  { id: "car", en: "car", pron: "car", pl: "cars", es: "carro", e: "🚗", cuarto: "garage" },
  { id: "washing-machine", en: "washing machine", pron: "uáshing mashín", pl: "washing machines", es: "lavadora", svg: "washer", cuarto: "laundry-room" },
];

// ---------- 🐴 Animals ----------
// size: big | small · color: como se dice · hex: para el círculo de color · hab: dónde vive (a/the + lugar)
export const ANIMALES = [
  { id: "horse", en: "horse", pron: "jors", pl: "horses", es: "caballo", e: "🐴", size: "big", color: "brown", hex: ["#8B5A2B"], hab: "stable", habEs: "establo" },
  { id: "cow", en: "cow", pron: "cáu", pl: "cows", es: "vaca", e: "🐄", size: "big", color: "white and black", hex: ["#FFFFFF", "#222222"], hab: "barn", habEs: "granero" },
  { id: "pig", en: "pig", pron: "pig", pl: "pigs", es: "cerdo", e: "🐷", size: "big", color: "pink", hex: ["#F7A8C4"], hab: "pigsty", habEs: "chiquero" },
  { id: "sheep", en: "sheep", pron: "ship", pl: "sheep", es: "oveja", e: "🐑", size: "big", color: "white", hex: ["#FFFFFF"], hab: "barn", habEs: "granero" },
  { id: "chicken", en: "chicken", pron: "chíken", pl: "chickens", es: "gallina", e: "🐔", size: "small", color: "white", hex: ["#FFFFFF"], hab: "coop", habEs: "gallinero" },
  { id: "chick", en: "chick", pron: "chik", pl: "chicks", es: "pollito", e: "🐥", size: "small", color: "yellow", hex: ["#FFD93D"], hab: "coop", habEs: "gallinero" },
  { id: "duck", en: "duck", pron: "dak", pl: "ducks", es: "pato", e: "🦆", size: "small", color: "green", hex: ["#3CB44B"], hab: "pond", habEs: "estanque" },
  { id: "rabbit", en: "rabbit", pron: "rábit", pl: "rabbits", es: "conejo", e: "🐰", size: "small", color: "white", hex: ["#FFFFFF"], hab: "hutch", habEs: "conejera" },
  { id: "dog", en: "dog", pron: "dog", pl: "dogs", es: "perro", e: "🐶", size: "big", color: "brown", hex: ["#8B5A2B"], hab: "doghouse", habEs: "casita de perro" },
  { id: "cat", en: "cat", pron: "cat", pl: "cats", es: "gato", e: "🐱", size: "small", color: "orange", hex: ["#F58231"], hab: "house", habEs: "casa" },
  { id: "frog", en: "frog", pron: "frog", pl: "frogs", es: "rana", e: "🐸", size: "small", color: "green", hex: ["#3CB44B"], hab: "pond", habEs: "estanque" },
  { id: "fish", en: "fish", pron: "fish", pl: "fish", es: "pez", e: "🐟", size: "small", color: "blue", hex: ["#4363D8"], hab: "water", habEs: "agua", the: true },
  { id: "bird", en: "bird", pron: "berd", pl: "birds", es: "pájaro", e: "🐦", size: "small", color: "blue", hex: ["#4363D8"], hab: "nest", habEs: "nido" },
  { id: "bee", en: "bee", pron: "bi", pl: "bees", es: "abeja", e: "🐝", size: "small", color: "yellow and black", hex: ["#FFD93D", "#222222"], hab: "hive", habEs: "colmena" },
  { id: "turtle", en: "turtle", pron: "tértol", pl: "turtles", es: "tortuga", e: "🐢", size: "small", color: "green", hex: ["#3CB44B"], hab: "pond", habEs: "estanque" },
];
const HAB_PRON = { stable: "stéibol", barn: "barn", pigsty: "pígstai", coop: "cup", pond: "pond", hutch: "jach", doghouse: "dóg-jaus", house: "jáus", water: "uóter", nest: "nest", hive: "jáiv" };
export const HABITATS = [...new Set(ANIMALES.map(a => a.hab))].map(h => {
  const a = ANIMALES.find(x => x.hab === h);
  return { id: h, en: h, es: a.habEs, the: !!a.the, pron: HAB_PRON[h] };
});
const COLOR_ES = { brown: "café", "white and black": "blanco y negro", pink: "rosado", white: "blanco", yellow: "amarillo", green: "verde", orange: "anaranjado", blue: "azul", "yellow and black": "amarillo y negro" };
const COLOR_PRON = { brown: "bráun", white: "uáit", black: "blak", pink: "pink", yellow: "yélou", green: "grin", orange: "óranch", blue: "blu" };
/** Colores sueltos (sin «and»), para el vocabulario. */
export const COLORES = [...new Set(ANIMALES.flatMap(a => a.color.split(" and ")))].map(c => ({ id: c, en: c, es: COLOR_ES[c] || c, pron: COLOR_PRON[c], hex: [{ brown: "#8B5A2B", white: "#FFFFFF", black: "#222222", pink: "#F7A8C4", yellow: "#FFD93D", green: "#3CB44B", orange: "#F58231", blue: "#4363D8" }[c]] }));
/** Palabritas que arman las respuestas, para el vocabulario. */
export const PALABRITAS = [
  { en: "he", es: "él", pron: "ji" }, { en: "she", es: "ella", pron: "shi" }, { en: "they", es: "ellos", pron: "déi" }, { en: "it", es: "eso (animal o cosa)", pron: "it" },
  { en: "my", es: "mi", pron: "mái" }, { en: "your", es: "tu", pron: "yor" }, { en: "is", es: "es / está", pron: "is" }, { en: "are", es: "son / están", pron: "ar" },
  { en: "this", es: "esto", pron: "dis" }, { en: "these", es: "estos", pron: "diis" }, { en: "in the", es: "en el / en la", pron: "in da" },
  { en: "there is", es: "hay (uno)", pron: "der is" }, { en: "there are", es: "hay (varios)", pron: "der ar" }, { en: "big", es: "grande", pron: "big" }, { en: "small", es: "pequeño", pron: "smol" },
  { en: "lives in", es: "vive en", pron: "livs in" }, { en: "live in", es: "viven en", pron: "liv in" }, { en: "where", es: "dónde", pron: "uér" }, { en: "who", es: "quién", pron: "ju" },
  { en: "what", es: "qué", pron: "uát" }, { en: "how many", es: "cuántos", pron: "jáu méni" }, { en: "color", es: "color", pron: "cólor" },
  { en: "one", es: "uno", pron: "uán" }, { en: "two", es: "dos", pron: "tu" }, { en: "three", es: "tres", pron: "zri" }, { en: "four", es: "cuatro", pron: "for" }, { en: "five", es: "cinco", pron: "fáiv" },
];

export const TEMAS = [
  { id: "family", nombre: "👨‍👩‍👧 Family", es: "La familia" },
  { id: "house", nombre: "🏠 House", es: "La casa" },
  { id: "animals", nombre: "🐴 Animals", es: "Los animales" },
];

// ---------- Dibujos SVG para lo que no tiene emoji ----------
const SVG = (inner, fondo = "") => `<svg class="dib" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="#1F3A5F" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${fondo}${inner}</svg>`;
export const DIBUJOS = {
  table: SVG(`<rect x="5" y="20" width="54" height="9" rx="3" fill="#C98A4B"/><path d="M13 29v27M51 29v27M13 42h38" /><path d="M13 29v27M51 29v27" fill="none"/>`),
  dresser: SVG(`<rect x="10" y="8" width="44" height="46" rx="4" fill="#C98A4B"/><path d="M10 23h44M10 38h44"/><circle cx="32" cy="15.5" r="2.5" fill="#1F3A5F"/><circle cx="32" cy="30.5" r="2.5" fill="#1F3A5F"/><circle cx="32" cy="46" r="2.5" fill="#1F3A5F"/><path d="M15 54v4M49 54v4"/>`),
  stove: SVG(`<rect x="8" y="14" width="48" height="44" rx="4" fill="#E9EEF5"/><rect x="8" y="14" width="48" height="12" fill="#CBD5E1"/><circle cx="20" cy="20" r="4" fill="#1F3A5F"/><circle cx="44" cy="20" r="4" fill="#1F3A5F"/><circle cx="32" cy="20" r="2" fill="#D9443A"/><rect x="14" y="32" width="36" height="18" rx="3" fill="#1F3A5F"/><rect x="18" y="36" width="28" height="10" rx="2" fill="#FFC83D"/><path d="M12 8h40"/><path d="M16 8v6M48 8v6"/>`),
  fridge: SVG(`<rect x="14" y="4" width="36" height="56" rx="5" fill="#E9EEF5"/><path d="M14 24h36"/><path d="M44 10v9M44 30v14" stroke-width="4"/>`),
  washer: SVG(`<rect x="8" y="6" width="48" height="52" rx="5" fill="#E9EEF5"/><path d="M8 18h48"/><circle cx="16" cy="12" r="2" fill="#1F3A5F"/><circle cx="24" cy="12" r="2" fill="#1F3A5F"/><rect x="38" y="9" width="12" height="6" rx="2" fill="#FFC83D"/><circle cx="32" cy="38" r="14" fill="#9DD9F5"/><circle cx="32" cy="38" r="9" fill="#4AA3DF"/><path d="M25 38q7-6 14 0" stroke="#fff"/>`),
  garage: SVG(`<path d="M6 28 32 8l26 20v30H6z" fill="#F6D7A8"/><path d="M6 28 32 8l26 20"/><rect x="14" y="30" width="36" height="28" rx="2" fill="#9DB3C9"/><path d="M14 37h36M14 44h36M14 51h36"/><path d="M26 58v-9h12v9" fill="#2F7FD1"/><circle cx="29" cy="58" r="3" fill="#1F3A5F"/><circle cx="41" cy="58" r="3" fill="#1F3A5F"/>`),
};
/** El dibujo de una cosa: emoji o SVG. */
export const dibujo = x => x.svg ? DIBUJOS[x.svg] : `<span class="emo">${x.e}</span>`;

// ---------- 🪜 Niveles ----------
export const NIVELES = [
  { id: 1, nombre: "🌱 1", es: "Con ayuditas: 4 dibujos con su nombre, la pregunta escrita y pistas al escribir." },
  { id: 2, nombre: "🔥 2", es: "6 dibujos parecidos y sin nombre, oraciones completas y la pregunta solo se oye." },
  { id: 3, nombre: "🚀 3", es: "Como el examen: preguntas combinadas, dos toques en orden y 10 segundos para contestar." },
];
/** Qué cambia en cada nivel. */
export function cfg(nivel = 1) {
  const n = Math.min(3, Math.max(1, Number(nivel) || 1));
  return {
    nivel: n,
    opciones: n === 1 ? 4 : 6,   // cuántos dibujos para tocar
    pies: n === 1,               // nombre en español bajo los dibujos de la casa y los animales (la familia siempre lo lleva)
    oracion: n === 1 ? 0.5 : 1,  // probabilidad de oír la oración completa en vez de la palabra
    parecidos: n >= 2,           // los otros dibujos se parecen al correcto (mismo cuarto, mismo tamaño, mismo género…)
    verPregunta: n === 1,        // la pregunta escrita; si no, solo se oye
    secuencias: n >= 3,          // «Touch the cow. Then touch the horse.»
    tiempo: n >= 3 ? 10 : 0,     // segundos para contestar en «hablar» y en la entrevista
    pista: n === 1,              // al escribir: primera letra y cuántas letras
    dictado: n <= 2,             // al escribir: se oye la palabra (en el 3 solo se ve el dibujo)
  };
}

// ---------- Ayudas ----------
function barajar(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const articulo = w => (/^[aeiou]/i.test(w) ? "an" : "a");
const may = t => t.charAt(0).toUpperCase() + t.slice(1);
const NUM = ["", "one", "two", "three", "four", "five"];
const NUM_ES = ["", "una", "dos", "tres", "cuatro", "cinco"];
const pronEs = x => (x.g === "he" ? "Él" : x.g === "she" ? "Ella" : "Ellos");
const elLa = c => (c.es === "cocina" || c.es === "sala" ? "la" : "el");
/** Personas sin plural, para «Where is he/she?» */
const PERSONAS = FAMILIA.filter(f => f.g !== "they");
/** Animales que pueden estar dentro de la casa, para «Where is the cat?» */
const MASCOTAS = ANIMALES.filter(a => ["cat", "dog", "bird", "fish", "rabbit", "turtle"].includes(a.id));
/** Cuartos con dos o más objetos, para «What is in the kitchen?» */
const CUARTOS_LLENOS = CUARTOS.filter(c => OBJETOS.filter(o => o.cuarto === c.id).length >= 2);

/**
 * Opciones para tocar: la correcta y otras distintas, en orden al azar.
 * parecido(x): si se da (nivel 2+), la mitad de las otras se escogen entre las que se parecen a la correcta.
 */
function opcionesDe(lista, correcta, c, rnd, pintar, parecido = null) {
  const n = c.opciones;
  const resto = lista.filter(x => x.id !== correcta.id);
  let otras;
  if (c.parecidos && parecido) {
    const sim = barajar(resto.filter(parecido), rnd).slice(0, Math.ceil((n - 1) / 2));
    const dif = barajar(resto.filter(x => !sim.includes(x)), rnd);
    otras = [...sim, ...dif].slice(0, n - 1);
  } else otras = barajar(resto, rnd).slice(0, n - 1);
  return barajar([correcta, ...otras], rnd).map(x => ({ id: x.id, html: pintar(x), label: x.en }));
}
const tarjeta = (x, pie = true) => `${dibujo(x)}${pie ? `<small>${x.es}</small>` : ""}`;
const opcionDibujo = (pie = true) => x => tarjeta(x, pie);
const opcionTexto = x => `<b>${x.en}</b><small>${x.es}</small>`;
const circulo = a => `<span class="color" style="--c:${a.hex.length > 1 ? `linear-gradient(90deg, ${a.hex[0]} 50%, ${a.hex[1]} 50%)` : a.hex[0]}" aria-label="${a.color}"></span>`;

// ---------- 👂 Escuchar y tocar ----------
export function oirFamilia(rnd = Math.random, c = cfg(1)) {
  const f = azar(FAMILIA, rnd);
  const frase = f.g === "they" ? "They are my cousins." : `${may(f.g)} is my ${f.en}.`;
  const dicho = rnd() < c.oracion ? frase : f.en;
  return {
    tipo: "oir", tema: "family",
    instr: "👂 Escuchá y tocá a esa persona",
    voz: [en(dicho)],
    opciones: opcionesDe(FAMILIA, f, c, rnd, opcionDibujo(true), x => x.g === f.g),
    correcta: f.id,
    respuesta: { en: dicho, es: f.g === "they" ? "Ellos son mis primos." : `${pronEs(f)} es mi ${f.es}.` },
    claves: [f.en],
    explica: `<b>${f.en}</b> = ${f.es}`,
  };
}

export function oirCuarto(rnd = Math.random, c = cfg(1)) {
  const k = azar(CUARTOS, rnd);
  const p = azar(PERSONAS, rnd);
  const oracion = rnd() < c.oracion;
  const dicho = oracion ? `${may(p.g)} is in the ${k.en}.` : k.en;
  return {
    tipo: "oir", tema: "house",
    instr: "👂 Escuchá y tocá esa parte de la casa",
    voz: [en(dicho)],
    opciones: opcionesDe(CUARTOS, k, c, rnd, opcionDibujo(c.pies)),
    correcta: k.id,
    respuesta: { en: dicho, es: oracion ? `${pronEs(p)} está en ${elLa(k)} ${k.es}.` : k.es },
    claves: [k.en],
    explica: `<b>${k.en}</b> = ${k.es}`,
  };
}

export function oirObjeto(rnd = Math.random, c = cfg(1)) {
  const o = azar(OBJETOS, rnd);
  const oracion = rnd() < c.oracion;
  const n = oracion && rnd() < 0.5 ? 2 + Math.floor(rnd() * 3) : 1;
  const dicho = !oracion ? o.en : n === 1 ? `There is ${articulo(o.en)} ${o.en}.` : `There are ${NUM[n]} ${o.pl}.`;
  return {
    tipo: "oir", tema: "house",
    instr: "👂 Escuchá y tocá esa cosa de la casa",
    voz: [en(dicho)],
    opciones: opcionesDe(OBJETOS, o, c, rnd, opcionDibujo(c.pies), x => x.cuarto === o.cuarto),
    correcta: o.id,
    respuesta: { en: dicho, es: n === 1 ? (oracion ? `Hay ${articulo(o.es) === "an" ? "una" : "un"} ${o.es}.` : o.es) : `Hay ${NUM_ES[n]} ${o.es}s.` },
    claves: [o.en],
    explica: `<b>${o.en}</b> = ${o.es}${n > 1 ? ` · <b>${o.pl}</b> = ${o.es}s` : ""}`,
  };
}

export function oirAnimal(rnd = Math.random, c = cfg(1)) {
  const a = azar(ANIMALES, rnd);
  // Con la oración se oyen características, como en el examen («Escucha características de animales… y señala»)
  const pistas = rnd() < c.oracion;
  const vive = `It lives in ${a.the ? "the" : "a"} ${a.hab}.`;
  const partes = pistas ? [`It is ${a.size}.`, `It is ${a.color}.`, vive] : [a.en];
  // Que las pistas alcancen: ninguna otra opción puede tener el mismo tamaño, color y casa
  const otras = ANIMALES.filter(x => x.id !== a.id && !(x.size === a.size && x.color === a.color && x.hab === a.hab));
  return {
    tipo: "oir", tema: "animals",
    instr: pistas ? "👂 Escuchá las pistas y tocá el animal" : "👂 Escuchá y tocá el animal",
    voz: partes.map(en),
    opciones: opcionesDe(otras, a, c, rnd, opcionDibujo(c.pies), x => x.size === a.size || x.color === a.color || x.hab === a.hab),
    correcta: a.id,
    respuesta: { en: partes.join(" "), es: pistas ? `Es ${a.size === "big" ? "grande" : "pequeño"}. Es ${COLOR_ES[a.color]}. Vive en ${a.the ? "el" : "un"} ${a.habEs}.` : a.es },
    claves: [a.en],
    explica: `<b>${a.en}</b> = ${a.es}${pistas ? ` · <b>${a.size}</b> = ${a.size === "big" ? "grande" : "pequeño"} · <b>${a.color}</b> = ${COLOR_ES[a.color]} · <b>${a.hab}</b> = ${a.habEs}` : ""}`,
  };
}

/** 🏠 ¿Dónde vive? Para tocar: el animal y las casas en palabras. */
export function oirHabitat(rnd = Math.random, c = cfg(1)) {
  const a = azar(ANIMALES, rnd);
  const h = HABITATS.find(x => x.id === a.hab);
  const pregunta = `Where does the ${a.en} live?`;
  return {
    tipo: "oir", tema: "animals",
    instr: pregunta,
    voz: [en(pregunta)],
    html: tarjeta(a, c.pies),
    opciones: opcionesDe(HABITATS, h, { ...c, opciones: Math.min(c.opciones, HABITATS.length) }, rnd, opcionTexto),
    correcta: h.id,
    respuesta: { en: `The ${a.en} lives in ${a.the ? "the" : "a"} ${a.hab}.`, es: `Vive en ${a.the ? "el" : "un"} ${a.habEs}.` },
    claves: [a.hab],
    explica: `<b>${a.hab}</b> = ${a.habEs}`,
  };
}

/** 🚀 Dos toques en orden: «Touch the cow. Then touch the horse.» */
export function oirSecuencia(tema, rnd = Math.random, c = cfg(3)) {
  const lista = tema === "family" ? FAMILIA : tema === "house" ? OBJETOS : ANIMALES;
  const pies = tema === "family" || c.pies;
  const [a, b] = barajar(lista, rnd).slice(0, 2);
  const nom = x => (x.g === "they" ? `my ${x.en}` : tema === "family" ? `my ${x.en}` : `the ${x.en}`);
  const voz = [en(`Touch ${nom(a)}.`), en(`Then touch ${nom(b)}.`)];
  return {
    tipo: "oir", tema, secuencia: [a.id, b.id],
    instr: "👂 Escuchá y tocá los dos, en orden",
    voz,
    opciones: barajar([a, b, ...barajar(lista.filter(x => x !== a && x !== b), rnd).slice(0, c.opciones - 2)], rnd).map(x => ({ id: x.id, html: tarjeta(x, pies), label: x.en })),
    correcta: a.id,
    respuesta: { en: voz.map(v => v[0]).join(" "), es: `Tocá ${a.es === a.en ? a.es : a.es}. Después tocá ${b.es}.` },
    claves: [a.en, b.en],
    explica: `<b>Touch</b> = tocá · <b>then</b> = después · <b>${a.en}</b> = ${a.es} · <b>${b.en}</b> = ${b.es}`,
  };
}

// ---------- 🗣️ Mirar y contestar ----------
const oculta = (q, c) => ({ ...q, oculta: !c.verPregunta });

export function hablarFamilia(rnd = Math.random, c = cfg(1)) {
  const f = azar(FAMILIA, rnd);
  const pregunta = f.g === "they" ? "Who are they?" : `Who is ${f.g}?`;
  const resp = f.g === "they" ? "They are my cousins." : `${may(f.g)} is my ${f.en}.`;
  return oculta({
    tipo: "hablar", tema: "family",
    instr: pregunta,
    voz: [en(pregunta)],
    html: tarjeta(f),
    respuesta: { en: resp, es: f.g === "they" ? "Ellos son mis primos." : `${pronEs(f)} es mi ${f.es}.` },
    claves: [f.en],
    explica: `Si es hombre, <b>he</b>; si es mujer, <b>she</b>. <b>my</b> = mi.`,
  }, c);
}

export function hablarDonde(rnd = Math.random, c = cfg(1)) {
  const k = azar(CUARTOS, rnd);
  const p = azar(PERSONAS, rnd);
  const pregunta = `Where is ${p.g}?`;
  const resp = `${may(p.g)} is in the ${k.en}.`;
  return oculta({
    tipo: "hablar", tema: "house",
    instr: pregunta,
    voz: [en(pregunta)],
    html: `<span class="escena">${dibujo(k)}<span class="quien">${p.e}</span></span><small>${p.es}${c.pies ? ` · ${k.es}` : ""}</small>`,
    respuesta: { en: resp, es: `${pronEs(p)} está en ${elLa(k)} ${k.es}.` },
    claves: [k.en],
    explica: `<b>in the</b> = en el / en la. <b>${k.en}</b> = ${k.es}.`,
  }, c);
}

/** 🔥 «Where is your grandmother?» → «She is in the kitchen.» */
export function hablarFamiliaDonde(rnd = Math.random, c = cfg(2)) {
  const k = azar(CUARTOS, rnd);
  const p = azar(PERSONAS, rnd);
  const pregunta = `Where is your ${p.en}?`;
  const resp = `${may(p.g)} is in the ${k.en}.`;
  return oculta({
    tipo: "hablar", tema: "family",
    instr: pregunta,
    voz: [en(pregunta)],
    html: `<span class="escena">${dibujo(k)}<span class="quien">${p.e}</span></span><small>${p.es}${c.pies ? ` · ${k.es}` : ""}</small>`,
    respuesta: { en: resp, es: `${pronEs(p)} está en ${elLa(k)} ${k.es}.` },
    tambien: { en: `My ${p.en} is in the ${k.en}.`, es: "O con el nombre: «My … is in the …»" },
    claves: [k.en],
    explica: `<b>your</b> = tu · <b>${p.en}</b> = ${p.es} · <b>${k.en}</b> = ${k.es}. Como es ${p.g === "he" ? "hombre" : "mujer"}, se contesta con <b>${p.g}</b>.`,
  }, c);
}

export function hablarObjeto(rnd = Math.random, c = cfg(1)) {
  const o = azar(OBJETOS, rnd);
  const n = rnd() < 0.45 ? 2 + Math.floor(rnd() * 3) : 1;
  const pregunta = n === 1 ? "What is this?" : "What are these?";
  const resp = n === 1 ? `It is ${articulo(o.en)} ${o.en}.` : `These are ${o.pl}.`;
  const extra = n === 1 ? `There is ${articulo(o.en)} ${o.en} in the ${CUARTOS.find(k => k.id === o.cuarto).en}.` : `There are ${NUM[n]} ${o.pl}.`;
  return oculta({
    tipo: "hablar", tema: "house",
    instr: pregunta,
    voz: [en(pregunta)],
    html: `<span class="varios">${Array.from({ length: n }, () => dibujo(o)).join("")}</span>${c.pies ? `<small>${n === 1 ? o.es : `${NUM_ES[n]} ${o.es}s`}</small>` : ""}`,
    respuesta: { en: resp, es: n === 1 ? `Es ${articulo(o.es) === "an" ? "una" : "un"} ${o.es}.` : `Estas son ${o.es}s.` },
    tambien: { en: extra, es: n === 1 ? "También podés decir «Hay un/una …»" : `También: «Hay ${NUM_ES[n]} ${o.es}s»` },
    claves: [n === 1 ? o.en : o.pl],
    explica: n === 1 ? `Uno: <b>What is this?</b> → <b>It is a…</b> (o «This is a…»). <b>a</b> antes de consonante, <b>an</b> antes de vocal.` : `Varios: <b>What are these?</b> → <b>These are…</b> y la palabra con <b>-s</b>.`,
  }, c);
}

/** 🔥 «How many chairs are there?» → «There are three chairs.» */
export function hablarCuantos(rnd = Math.random, c = cfg(2)) {
  const o = azar(OBJETOS, rnd);
  const n = 2 + Math.floor(rnd() * 4);
  const pregunta = `How many ${o.pl} are there?`;
  return oculta({
    tipo: "hablar", tema: "house",
    instr: pregunta,
    voz: [en(pregunta)],
    html: `<span class="varios">${Array.from({ length: n }, () => dibujo(o)).join("")}</span>${c.pies ? `<small>${o.es}s</small>` : ""}`,
    respuesta: { en: `There are ${NUM[n]} ${o.pl}.`, es: `Hay ${NUM_ES[n]} ${o.es}s.` },
    claves: [NUM[n], o.pl],
    explica: `<b>How many…?</b> = ¿cuántos? Se contesta con <b>There are</b> + el número + la palabra con <b>-s</b>.`,
  }, c);
}

/** 🚀 «What is in the kitchen?» → «There is a stove and a refrigerator.» */
export function hablarQueHay(rnd = Math.random, c = cfg(3)) {
  const k = azar(CUARTOS_LLENOS, rnd);
  // Siempre en el mismo orden (el de la lista), para que la misma pregunta no salga dos veces «al revés»
  const [a, b] = OBJETOS.filter(o => o.cuarto === k.id).slice(0, 2);
  const pregunta = `What is in the ${k.en}?`;
  return oculta({
    tipo: "hablar", tema: "house",
    instr: pregunta,
    voz: [en(pregunta)],
    html: `<span class="escena">${dibujo(k)}</span><span class="varios">${dibujo(a)}${dibujo(b)}</span>${c.pies ? `<small>${k.es}: ${a.es} y ${b.es}</small>` : ""}`,
    respuesta: { en: `There is ${articulo(a.en)} ${a.en} and ${articulo(b.en)} ${b.en}.`, es: `Hay ${articulo(a.es) === "an" ? "una" : "un"} ${a.es} y ${articulo(b.es) === "an" ? "una" : "un"} ${b.es}.` },
    tambien: { en: `In the ${k.en} there is ${articulo(a.en)} ${a.en} and ${articulo(b.en)} ${b.en}.`, es: "También se puede empezar por el cuarto." },
    claves: [a.en, b.en],
    explica: `<b>What is in the…?</b> = ¿qué hay en…? Se contesta <b>There is a … and a …</b>. <b>${a.en}</b> = ${a.es} · <b>${b.en}</b> = ${b.es}.`,
  }, c);
}

export function hablarAnimal(rnd = Math.random, c = cfg(1), que = null) {
  const a = azar(ANIMALES, rnd);
  const tipo = que || azar(["nombre", "tamano", "color", "vive", "viven"], rnd);
  const casa = `${a.the ? "the" : "a"} ${a.hab}`;
  const base = { tipo: "hablar", tema: "animals", html: tarjeta(a, c.pies) };
  const q = tipo === "nombre" ? { ...base,
    instr: "What animal is this?", voz: [en("What animal is this?")],
    respuesta: { en: `It is ${articulo(a.en)} ${a.en}.`, es: `Es ${articulo(a.es) === "an" ? "una" : "un"} ${a.es}.` },
    claves: [a.en], explica: `<b>It is a…</b> (o «This is a…»). <b>${a.en}</b> = ${a.es}.` }
  : tipo === "tamano" ? { ...base,
    instr: "Is it big or small?", voz: [en("Is it big or small?")],
    respuesta: { en: `It is ${a.size}.`, es: `Es ${a.size === "big" ? "grande" : "pequeño"}.` },
    claves: [a.size], explica: `<b>big</b> = grande · <b>small</b> = pequeño.` }
  : tipo === "color" ? { ...base,
    html: `<span class="escena">${dibujo(a)}${circulo(a)}</span>${c.pies ? `<small>${a.es}</small>` : ""}`,
    instr: "What color is it?", voz: [en("What color is it?")],
    respuesta: { en: `It is ${a.color}.`, es: `Es ${COLOR_ES[a.color]}.` },
    claves: a.color.split(" and "), explica: `<b>${a.color}</b> = ${COLOR_ES[a.color]}. Mirá el círculo de color.` }
  : tipo === "vive" ? { ...base,
    instr: `Where does the ${a.en} live?`, voz: [en(`Where does the ${a.en} live?`)],
    respuesta: { en: `The ${a.en} lives in ${casa}.`, es: `${/a$/.test(a.es) && a.es !== "pez" ? "La" : "El"} ${a.es} vive en ${a.the ? "el" : "un"} ${a.habEs}.` },
    tambien: { en: `${may(a.pl)} live in ${casa}.`, es: "O en plural: «… live in …»" },
    claves: [a.hab], explica: `<b>${a.hab}</b> = ${a.habEs}. Con <b>the ${a.en}</b> (uno) se dice <b>lives</b>; con <b>${a.pl}</b> (varios) se dice <b>live</b>.` }
  : { ...base,
    html: `<span class="varios">${dibujo(a)}${dibujo(a)}</span>${c.pies ? `<small>${a.es}s</small>` : ""}`,
    instr: `Where do ${a.pl} live?`, voz: [en(`Where do ${a.pl} live?`)],
    respuesta: { en: `${may(a.pl)} live in ${casa}.`, es: `Los ${a.es}s viven en ${a.the ? "el" : "un"} ${a.habEs}.` },
    claves: [a.hab], explica: `<b>${a.hab}</b> = ${a.habEs}. Como son varios (<b>${a.pl}</b>), es <b>live</b> sin «s».` };
  return oculta(q, c);
}

/** 🚀 Dos cosas en una: «Is it big or small? What color is it?» → «It is big and brown.» */
export function hablarDescribe(rnd = Math.random, c = cfg(3)) {
  const a = azar(ANIMALES, rnd);
  return oculta({
    tipo: "hablar", tema: "animals",
    instr: "Is it big or small? What color is it?",
    voz: [en("Is it big or small?"), en("What color is it?")],
    html: `<span class="escena">${dibujo(a)}${circulo(a)}</span>${c.pies ? `<small>${a.es}</small>` : ""}`,
    respuesta: a.color.includes(" and ")
      ? { en: `It is ${a.size}. It is ${a.color}.`, es: `Es ${a.size === "big" ? "grande" : "pequeño"}. Es ${COLOR_ES[a.color]}.` }
      : { en: `It is ${a.size} and ${a.color}.`, es: `Es ${a.size === "big" ? "grande" : "pequeño"} y ${COLOR_ES[a.color]}.` },
    tambien: a.color.includes(" and ") ? null : { en: `It is ${a.size}. It is ${a.color}.`, es: "O en dos oraciones." },
    claves: [a.size, ...a.color.split(" and ")],
    explica: `Dos preguntas, una respuesta: <b>It is</b> + tamaño + <b>and</b> + color.`,
  }, c);
}

/** 🚀 Un animal dentro de la casa: «Where is the cat?» → «The cat is in the bedroom.» */
export function hablarAnimalDonde(rnd = Math.random, c = cfg(3)) {
  const a = azar(MASCOTAS, rnd);
  const k = azar(CUARTOS, rnd);
  const pregunta = `Where is the ${a.en}?`;
  return oculta({
    tipo: "hablar", tema: "animals",
    instr: pregunta,
    voz: [en(pregunta)],
    html: `<span class="escena">${dibujo(k)}<span class="quien">${a.e}</span></span>${c.pies ? `<small>${a.es} · ${k.es}</small>` : ""}`,
    respuesta: { en: `The ${a.en} is in the ${k.en}.`, es: `${/a$/.test(a.es) ? "La" : "El"} ${a.es} está en ${elLa(k)} ${k.es}.` },
    tambien: { en: `It is in the ${k.en}.`, es: "O más corto: «It is in the …»" },
    claves: [k.en],
    explica: `Para animales se usa <b>it</b>: <b>It is in the ${k.en}.</b> <b>${k.en}</b> = ${k.es}.`,
  }, c);
}

// ---------- ✍️ Escribir ----------
const LISTAS = { family: FAMILIA, house: [...CUARTOS, ...OBJETOS], animals: ANIMALES };
export function escribir(tema, rnd = Math.random, c = cfg(1)) {
  const x = azar(LISTAS[tema], rnd);
  const plural = c.nivel >= 3 && x.pl && rnd() < 0.35;
  const palabra = plural ? x.pl : x.en;
  const n = plural ? 2 + Math.floor(rnd() * 2) : 1;
  const pista = c.pista ? palabra.split(" ").map(w => w[0] + " _".repeat(w.length - 1)).join("  ") : "";
  return {
    tipo: "escribir", tema,
    instr: c.dictado ? "👂✍️ Escuchá y escribí la palabra en inglés" : "✍️ Escribí en inglés lo que ves",
    voz: c.dictado ? [en(palabra)] : [en(tema === "family" ? (plural ? "Who are they?" : "Who is this?") : plural ? "What are these?" : "What is this?"), es("Escribilo en inglés.")],
    html: `${n === 1 ? dibujo(x) : `<span class="varios">${Array.from({ length: n }, () => dibujo(x)).join("")}</span>`}${c.pies || tema === "family" ? `<small>${plural ? `${x.es}s` : x.es}</small>` : ""}${pista ? `<span class="pista">${pista}</span>` : ""}`,
    respuesta: { en: palabra, es: plural ? `${x.es}s` : x.es },
    claves: [palabra],
    largo: palabra.length,
    explica: `<b>${palabra}</b> = ${plural ? `${x.es}s` : x.es}${plural ? " (en plural, con <b>-s</b>)" : ""}`,
  };
}
/** Compara lo escrito con la respuesta (sin mayúsculas ni espacios de más). */
export const escribioBien = (texto, respuesta) => String(texto).toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim() === respuesta.toLowerCase();

// ---------- Por tema, modo y nivel ----------
const GEN = {
  oir: {
    family: (rnd, c) => (c.secuencias && rnd() < 0.3 ? oirSecuencia("family", rnd, c) : oirFamilia(rnd, c)),
    house: (rnd, c) => (c.secuencias && rnd() < 0.25 ? oirSecuencia("house", rnd, c) : rnd() < 0.45 ? oirCuarto(rnd, c) : oirObjeto(rnd, c)),
    animals: (rnd, c) => (c.secuencias && rnd() < 0.25 ? oirSecuencia("animals", rnd, c) : rnd() < 0.3 ? oirHabitat(rnd, c) : oirAnimal(rnd, c)),
  },
  hablar: {
    family: (rnd, c) => (c.nivel >= 2 && rnd() < 0.4 ? hablarFamiliaDonde(rnd, c) : hablarFamilia(rnd, c)),
    house: (rnd, c) => {
      const r = rnd();
      if (c.nivel >= 3 && r < 0.25) return hablarQueHay(rnd, c);
      if (c.nivel >= 2 && r < 0.45) return hablarCuantos(rnd, c);
      return r < 0.65 ? hablarDonde(rnd, c) : hablarObjeto(rnd, c);
    },
    animals: (rnd, c) => {
      const r = rnd();
      if (c.nivel >= 3 && r < 0.2) return hablarDescribe(rnd, c);
      if (c.nivel >= 3 && r < 0.35) return hablarAnimalDonde(rnd, c);
      return hablarAnimal(rnd, c);
    },
  },
  escribir: {
    family: (rnd, c) => escribir("family", rnd, c),
    house: (rnd, c) => escribir("house", rnd, c),
    animals: (rnd, c) => escribir("animals", rnd, c),
  },
};
/** Una pregunta del modo ("oir" | "hablar" | "escribir"), tema ("family" | "house" | "animals" | "todo") y nivel (1 a 3). */
export function pregunta(modo, tema, rnd = Math.random, nivel = 1) {
  const c = cfg(nivel);
  const t = tema === "todo" ? azar(TEMAS, rnd).id : tema;
  return GEN[modo][t](rnd, c);
}

/**
 * 🎤 La entrevista. Nivel 1: 11 preguntas en el orden del temario (familia, casa, animales).
 * Nivel 2: 13 preguntas revueltas. Nivel 3: 15 revueltas, con las combinadas y tiempo para contestar.
 */
export function entrevista(rnd = Math.random, nivel = 1) {
  const c = cfg(nivel);
  let lista;
  if (c.nivel === 1) {
    lista = [
      hablarFamilia(rnd, c), hablarFamilia(rnd, c), hablarFamilia(rnd, c),
      hablarDonde(rnd, c), hablarObjeto(rnd, c), hablarObjeto(rnd, c), hablarDonde(rnd, c),
      hablarAnimal(rnd, c, "nombre"), hablarAnimal(rnd, c, "tamano"), hablarAnimal(rnd, c, "color"), hablarAnimal(rnd, c, azar(["vive", "viven"], rnd)),
    ];
  } else {
    const temas = c.nivel === 2
      ? ["family", "family", "family", "family", "house", "house", "house", "house", "house", "animals", "animals", "animals", "animals"]
      : ["family", "family", "family", "family", "house", "house", "house", "house", "house", "house", "animals", "animals", "animals", "animals", "animals"];
    lista = barajar(temas, rnd).map(t => GEN.hablar[t](rnd, c));
  }
  // Sin preguntas repetidas en toda la entrevista: ni la misma respuesta, ni la misma pregunta cuando nombra algo
  // («Where is your uncle?» dos veces no; «What is this?» sí puede repetirse con otra cosa)
  const GENERICAS = /^(What is this|What are these|Who is he|Who is she|Who are they|Where is he|Where is she|What animal is this|Is it big or small|What color is it)/;
  const firma = q => (GENERICAS.test(q.instr) ? q.respuesta.en : q.instr);
  for (let i = 1; i < lista.length; i++) {
    let v = 0;
    const repetida = () => lista.slice(0, i).some(x => x.respuesta.en === lista[i].respuesta.en || firma(x) === firma(lista[i]));
    while (v++ < 30 && repetida()) lista[i] = GEN.hablar[lista[i].tema](rnd, c);
  }
  return lista;
}

/** ¿Lo que se oyó (micrófono) tiene las palabras clave? Acepta variantes cercanas y singular o plural. */
export function dijoBien(oido, claves) {
  const t = ` ${String(oido).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()} `;
  const ALIAS = { father: ["dad", "daddy"], mother: ["mom", "mum", "mommy"], grandfather: ["grandpa", "granddad"], grandmother: ["grandma", "granny"],
    television: ["tv"], refrigerator: ["fridge"], chicken: ["hen"], pigsty: ["pigpen", "pig pen"], coop: ["chicken coop", "henhouse"], water: ["sea", "river"],
    two: ["2"], three: ["3"], four: ["4"], five: ["5"] };
  const formas = k => [k, ...(ALIAS[k] || [])].flatMap(w => [w, w.replace(/s$/, ""), w + "s"]);
  return claves.every(k => formas(k).some(w => t.includes(` ${w} `)));
}

/** Para node: comprueba que cada generador, en cada nivel, tenga una sola respuesta correcta y opciones distintas. */
export function revisarOral(n = 200) {
  const errores = [];
  let s = 7;
  const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const gens = { oirFamilia, oirCuarto, oirObjeto, oirAnimal, oirHabitat, hablarFamilia, hablarDonde, hablarFamiliaDonde, hablarObjeto, hablarCuantos, hablarQueHay, hablarAnimal, hablarDescribe, hablarAnimalDonde };
  for (const nivel of [1, 2, 3]) {
    const c = cfg(nivel);
    const todos = { ...gens, ...Object.fromEntries(TEMAS.map(t => [`oirSecuencia-${t.id}`, (r, cc) => oirSecuencia(t.id, r, cc)])), ...Object.fromEntries(TEMAS.map(t => [`escribir-${t.id}`, (r, cc) => escribir(t.id, r, cc)])) };
    for (const [nombre, g] of Object.entries(todos)) for (let i = 0; i < n; i++) {
      const q = g(rnd, c);
      const donde = `${nombre} (nivel ${nivel})`;
      if (!q.voz?.length || !q.respuesta?.en || !q.claves?.length || !q.explica) errores.push(`${donde}: falta voz, respuesta, claves o explica`);
      if (q.tipo === "oir") {
        const ids = q.opciones.map(o => o.id);
        if (new Set(ids).size !== ids.length) errores.push(`${donde}: opciones repetidas`);
        if (ids.filter(x => x === q.correcta).length !== 1) errores.push(`${donde}: la correcta no está una sola vez`);
        if (q.secuencia && !q.secuencia.every(id => ids.includes(id))) errores.push(`${donde}: la secuencia no está entre las opciones`);
        const esperadas = nombre === "oirHabitat" ? Math.min(c.opciones, HABITATS.length) : c.opciones;
        if (ids.length !== esperadas) errores.push(`${donde}: ${ids.length} opciones, se esperaban ${esperadas}`);
      } else if (q.tipo === "hablar") {
        if (!dijoBien(q.respuesta.en, q.claves)) errores.push(`${donde}: la respuesta no contiene sus claves (${q.respuesta.en})`);
        if (!!q.oculta !== !c.verPregunta) errores.push(`${donde}: oculta mal puesta`);
      } else if (q.tipo === "escribir") {
        if (!escribioBien(q.respuesta.en, q.respuesta.en) || escribioBien(q.respuesta.en + "x", q.respuesta.en)) errores.push(`${donde}: escribioBien falla`);
      }
    }
    for (let i = 0; i < 30; i++) {
      const e = entrevista(rnd, nivel);
      const largo = [11, 13, 15][nivel - 1];
      if (e.length !== largo) errores.push(`entrevista nivel ${nivel}: no son ${largo} preguntas`);
      if (new Set(e.map(x => x.respuesta.en)).size !== e.length) errores.push(`entrevista nivel ${nivel}: respuesta repetida`);
      const especificas = e.map(x => x.instr).filter(t => !/^(What is this|What are these|Who is he|Who is she|Who are they|Where is he|Where is she|What animal is this|Is it big or small|What color is it)/.test(t));
      if (new Set(especificas).size !== especificas.length) errores.push(`entrevista nivel ${nivel}: pregunta repetida`);
      if (!e.every(x => x.tipo === "hablar")) errores.push(`entrevista nivel ${nivel}: hay preguntas que no son de hablar`);
    }
  }
  // Los animales con pistas: deben dejar una sola opción
  for (let i = 0; i < n; i++) {
    const q = oirAnimal(rnd, cfg(2));
    const a = ANIMALES.find(x => x.id === q.correcta);
    const iguales = q.opciones.filter(o => { const x = ANIMALES.find(y => y.id === o.id); return x.size === a.size && x.color === a.color && x.hab === a.hab; });
    if (iguales.length !== 1) errores.push("oirAnimal con pistas: las pistas no alcanzan");
  }
  if (!dijoBien("there are 3 chairs", ["three", "chairs"]) || dijoBien("it is big", ["small"])) errores.push("dijoBien falla");
  return [...new Set(errores)];
}
