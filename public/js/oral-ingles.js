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
// Siempre hay UNA sola respuesta correcta (revisarOral lo comprueba).

const es = t => [t, "es"];
const en = t => [t, "en"];

// ---------- 👨‍👩‍👧 Family ----------
// g: "he" | "she" (cómo se dice en la respuesta)
export const FAMILIA = [
  { id: "father", en: "father", es: "papá", e: "👨", g: "he" },
  { id: "mother", en: "mother", es: "mamá", e: "👩", g: "she" },
  { id: "sister", en: "sister", es: "hermana", e: "👧", g: "she" },
  { id: "brother", en: "brother", es: "hermano", e: "👦", g: "he" },
  { id: "grandfather", en: "grandfather", es: "abuelo", e: "👴", g: "he" },
  { id: "grandmother", en: "grandmother", es: "abuela", e: "👵", g: "she" },
  { id: "uncle", en: "uncle", es: "tío", e: "🧔", g: "he" },
  { id: "aunt", en: "aunt", es: "tía", e: "👩‍🦰", g: "she" },
  { id: "cousin", en: "cousin", es: "primo", e: "🧒", g: "he" },
  { id: "cousins", en: "cousins", es: "primos", e: "👫", g: "they" },
];

// ---------- 🏠 Parts of the house ----------
export const CUARTOS = [
  { id: "kitchen", en: "kitchen", es: "cocina", e: "🍳" },
  { id: "bedroom", en: "bedroom", es: "dormitorio", e: "🛌" },
  { id: "bathroom", en: "bathroom", es: "baño", e: "🛁" },
  { id: "living-room", en: "living room", es: "sala", e: "🛋️" },
  { id: "dining-room", en: "dining room", es: "comedor", e: "🍽️" },
  { id: "laundry-room", en: "laundry room", es: "cuarto de pilas", e: "🧺" },
  { id: "garage", en: "garage", es: "garaje", svg: "garage" },
];

// ---------- 🛋️ House objects ----------
// pl: plural · cuarto: dónde suele estar (para «There is a … in the …»)
export const OBJETOS = [
  { id: "sofa", en: "sofa", pl: "sofas", es: "sofá", e: "🛋️", cuarto: "living-room" },
  { id: "television", en: "television", pl: "televisions", es: "televisor", e: "📺", cuarto: "living-room" },
  { id: "table", en: "table", pl: "tables", es: "mesa", svg: "table", cuarto: "dining-room" },
  { id: "chair", en: "chair", pl: "chairs", es: "silla", e: "🪑", cuarto: "dining-room" },
  { id: "bed", en: "bed", pl: "beds", es: "cama", e: "🛏️", cuarto: "bedroom" },
  { id: "dresser", en: "dresser", pl: "dressers", es: "cómoda", svg: "dresser", cuarto: "bedroom" },
  { id: "toilet", en: "toilet", pl: "toilets", es: "inodoro", e: "🚽", cuarto: "bathroom" },
  { id: "mirror", en: "mirror", pl: "mirrors", es: "espejo", e: "🪞", cuarto: "bathroom" },
  { id: "window", en: "window", pl: "windows", es: "ventana", e: "🪟", cuarto: "living-room" },
  { id: "stove", en: "stove", pl: "stoves", es: "cocina (estufa)", svg: "stove", cuarto: "kitchen" },
  { id: "refrigerator", en: "refrigerator", pl: "refrigerators", es: "refrigeradora", svg: "fridge", cuarto: "kitchen" },
  { id: "car", en: "car", pl: "cars", es: "carro", e: "🚗", cuarto: "garage" },
  { id: "washing-machine", en: "washing machine", pl: "washing machines", es: "lavadora", svg: "washer", cuarto: "laundry-room" },
];

// ---------- 🐴 Animals ----------
// size: big | small · color: como se dice · hex: para el círculo de color · hab: dónde vive (a/the + lugar)
export const ANIMALES = [
  { id: "horse", en: "horse", pl: "horses", es: "caballo", e: "🐴", size: "big", color: "brown", hex: ["#8B5A2B"], hab: "stable", habEs: "establo" },
  { id: "cow", en: "cow", pl: "cows", es: "vaca", e: "🐄", size: "big", color: "white and black", hex: ["#FFFFFF", "#222222"], hab: "barn", habEs: "granero" },
  { id: "pig", en: "pig", pl: "pigs", es: "cerdo", e: "🐷", size: "big", color: "pink", hex: ["#F7A8C4"], hab: "pigsty", habEs: "chiquero" },
  { id: "sheep", en: "sheep", pl: "sheep", es: "oveja", e: "🐑", size: "big", color: "white", hex: ["#FFFFFF"], hab: "barn", habEs: "granero" },
  { id: "chicken", en: "chicken", pl: "chickens", es: "gallina", e: "🐔", size: "small", color: "white", hex: ["#FFFFFF"], hab: "coop", habEs: "gallinero" },
  { id: "chick", en: "chick", pl: "chicks", es: "pollito", e: "🐥", size: "small", color: "yellow", hex: ["#FFD93D"], hab: "coop", habEs: "gallinero" },
  { id: "duck", en: "duck", pl: "ducks", es: "pato", e: "🦆", size: "small", color: "green", hex: ["#3CB44B"], hab: "pond", habEs: "estanque" },
  { id: "rabbit", en: "rabbit", pl: "rabbits", es: "conejo", e: "🐰", size: "small", color: "white", hex: ["#FFFFFF"], hab: "hutch", habEs: "conejera" },
  { id: "dog", en: "dog", pl: "dogs", es: "perro", e: "🐶", size: "big", color: "brown", hex: ["#8B5A2B"], hab: "doghouse", habEs: "casita de perro" },
  { id: "cat", en: "cat", pl: "cats", es: "gato", e: "🐱", size: "small", color: "orange", hex: ["#F58231"], hab: "house", habEs: "casa" },
  { id: "frog", en: "frog", pl: "frogs", es: "rana", e: "🐸", size: "small", color: "green", hex: ["#3CB44B"], hab: "pond", habEs: "estanque" },
  { id: "fish", en: "fish", pl: "fish", es: "pez", e: "🐟", size: "small", color: "blue", hex: ["#4363D8"], hab: "water", habEs: "agua", the: true },
  { id: "bird", en: "bird", pl: "birds", es: "pájaro", e: "🐦", size: "small", color: "blue", hex: ["#4363D8"], hab: "nest", habEs: "nido" },
  { id: "bee", en: "bee", pl: "bees", es: "abeja", e: "🐝", size: "small", color: "yellow and black", hex: ["#FFD93D", "#222222"], hab: "hive", habEs: "colmena" },
  { id: "turtle", en: "turtle", pl: "turtles", es: "tortuga", e: "🐢", size: "small", color: "green", hex: ["#3CB44B"], hab: "pond", habEs: "estanque" },
];
export const HABITATS = [...new Set(ANIMALES.map(a => a.hab))].map(h => {
  const a = ANIMALES.find(x => x.hab === h);
  return { id: h, en: h, es: a.habEs, the: !!a.the };
});
export const COLORES = [...new Set(ANIMALES.map(a => a.color))].map(c => ({ id: c, en: c, hex: ANIMALES.find(a => a.color === c).hex }));
const COLOR_ES = { brown: "café", "white and black": "blanco y negro", pink: "rosado", white: "blanco", yellow: "amarillo", green: "verde", orange: "anaranjado", blue: "azul", "yellow and black": "amarillo y negro" };

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

// ---------- Ayudas ----------
function barajar(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const articulo = w => (/^[aeiou]/i.test(w) ? "an" : "a");
const may = t => t.charAt(0).toUpperCase() + t.slice(1);
const NUM = ["", "one", "two", "three", "four"];
const NUM_ES = ["", "una", "dos", "tres", "cuatro"];
const pron = x => x.g;
const pronEs = x => (x.g === "he" ? "Él" : x.g === "she" ? "Ella" : "Ellos");
/** Personas sin plural, para «Where is he/she?» */
const PERSONAS = FAMILIA.filter(f => f.g !== "they");

/** Opciones para tocar: la correcta y otras distintas, en orden al azar. */
function opcionesDe(lista, correcta, n, rnd, pintar) {
  const otras = barajar(lista.filter(x => x.id !== correcta.id), rnd).slice(0, n - 1);
  return barajar([correcta, ...otras], rnd).map(x => ({ id: x.id, html: pintar(x), label: x.en }));
}
const tarjeta = (x, pie = x.es) => `${dibujo(x)}<small>${pie}</small>`;
const opcionDibujo = x => `${dibujo(x)}<small>${x.es}</small>`;
const opcionTexto = x => `<b>${x.en}</b><small>${x.es}</small>`;

// ---------- 👂 Escuchar y tocar ----------
// dificil: en vez de la palabra sola, se oye una oración completa como en el examen
export function oirFamilia(rnd = Math.random, dificil = false) {
  const f = azar(FAMILIA, rnd);
  const frase = f.g === "they" ? "They are my cousins." : `${may(f.g)} is my ${f.en}.`;
  const dicho = dificil ? frase : f.en;
  return {
    tipo: "oir", tema: "family",
    instr: "👂 Escuchá y tocá a esa persona",
    voz: [en(dicho)],
    opciones: opcionesDe(FAMILIA, f, 4, rnd, opcionDibujo),
    correcta: f.id,
    respuesta: { en: dicho, es: f.g === "they" ? "Ellos son mis primos." : `${pronEs(f)} es mi ${f.es}.` },
    claves: [f.en],
    explica: `<b>${f.en}</b> = ${f.es}`,
  };
}

export function oirCuarto(rnd = Math.random, dificil = false) {
  const c = azar(CUARTOS, rnd);
  const p = azar(PERSONAS, rnd);
  const frase = `${may(p.g)} is in the ${c.en}.`;
  const dicho = dificil ? frase : c.en;
  return {
    tipo: "oir", tema: "house",
    instr: "👂 Escuchá y tocá esa parte de la casa",
    voz: [en(dicho)],
    opciones: opcionesDe(CUARTOS, c, 4, rnd, opcionDibujo),
    correcta: c.id,
    respuesta: { en: dicho, es: dificil ? `${pronEs(p)} está en ${c.es === "cocina" || c.es === "sala" ? "la" : "el"} ${c.es}.` : c.es },
    claves: [c.en],
    explica: `<b>${c.en}</b> = ${c.es}`,
  };
}

export function oirObjeto(rnd = Math.random, dificil = false) {
  const o = azar(OBJETOS, rnd);
  const n = dificil && rnd() < 0.5 ? 2 + Math.floor(rnd() * 3) : 1;
  const dicho = !dificil ? o.en : n === 1 ? `There is ${articulo(o.en)} ${o.en}.` : `There are ${NUM[n]} ${o.pl}.`;
  const pintar = x => `${dibujo(x)}<small>${x.es}</small>`;
  return {
    tipo: "oir", tema: "house",
    instr: "👂 Escuchá y tocá esa cosa de la casa",
    voz: [en(dicho)],
    opciones: opcionesDe(OBJETOS, o, 4, rnd, pintar),
    correcta: o.id,
    respuesta: { en: dicho, es: n === 1 ? (dificil ? `Hay ${articulo(o.es) === "an" ? "una" : "un"} ${o.es}.` : o.es) : `Hay ${NUM_ES[n]} ${o.es}s.` },
    claves: [o.en],
    explica: `<b>${o.en}</b> = ${o.es}${n > 1 ? ` · <b>${o.pl}</b> = ${o.es}s` : ""}`,
  };
}

export function oirAnimal(rnd = Math.random, dificil = false) {
  const a = azar(ANIMALES, rnd);
  // En el modo difícil se oyen características, como en el examen («Escucha características de animales… y señala»)
  const vive = `It lives in ${a.the ? "the" : "a"} ${a.hab}.`;
  const partes = dificil ? [`It is ${a.size}.`, `It is ${a.color}.`, vive] : [a.en];
  // Que las pistas alcancen: ninguna otra opción puede tener el mismo tamaño, color y casa
  const otras = ANIMALES.filter(x => x.id !== a.id && !(x.size === a.size && x.color === a.color && x.hab === a.hab));
  return {
    tipo: "oir", tema: "animals",
    instr: dificil ? "👂 Escuchá las pistas y tocá el animal" : "👂 Escuchá y tocá el animal",
    voz: partes.map(en),
    opciones: opcionesDe(otras, a, 4, rnd, opcionDibujo),
    correcta: a.id,
    respuesta: { en: partes.join(" "), es: dificil ? `Es ${a.size === "big" ? "grande" : "pequeño"}. Es ${COLOR_ES[a.color]}. Vive en ${a.the ? "el" : "un"} ${a.habEs}.` : a.es },
    claves: [a.en],
    explica: `<b>${a.en}</b> = ${a.es}${dificil ? ` · <b>${a.size}</b> = ${a.size === "big" ? "grande" : "pequeño"} · <b>${a.color}</b> = ${COLOR_ES[a.color]} · <b>${a.hab}</b> = ${a.habEs}` : ""}`,
  };
}

// ---------- 🗣️ Mirar y contestar ----------
export function hablarFamilia(rnd = Math.random) {
  const f = azar(FAMILIA, rnd);
  const pregunta = f.g === "they" ? "Who are they?" : `Who is ${f.g}?`;
  const resp = f.g === "they" ? "They are my cousins." : `${may(f.g)} is my ${f.en}.`;
  return {
    tipo: "hablar", tema: "family",
    instr: pregunta,
    voz: [en(pregunta)],
    html: tarjeta(f),
    respuesta: { en: resp, es: f.g === "they" ? "Ellos son mis primos." : `${pronEs(f)} es mi ${f.es}.` },
    claves: [f.en],
    explica: `Si es hombre, <b>he</b>; si es mujer, <b>she</b>. <b>my</b> = mi.`,
  };
}

export function hablarDonde(rnd = Math.random) {
  const c = azar(CUARTOS, rnd);
  const p = azar(PERSONAS, rnd);
  const pregunta = `Where is ${p.g}?`;
  const resp = `${may(p.g)} is in the ${c.en}.`;
  return {
    tipo: "hablar", tema: "house",
    instr: pregunta,
    voz: [en(pregunta)],
    html: `<span class="escena">${dibujo(c)}<span class="quien">${p.e}</span></span><small>${p.es} · ${c.es}</small>`,
    respuesta: { en: resp, es: `${pronEs(p)} está en ${c.es === "cocina" || c.es === "sala" ? "la" : "el"} ${c.es}.` },
    claves: [c.en],
    explica: `<b>in the</b> = en el / en la. <b>${c.en}</b> = ${c.es}.`,
  };
}

export function hablarObjeto(rnd = Math.random) {
  const o = azar(OBJETOS, rnd);
  const n = rnd() < 0.45 ? 2 + Math.floor(rnd() * 3) : 1;
  const pregunta = n === 1 ? "What is this?" : "What are these?";
  const resp = n === 1 ? `It is ${articulo(o.en)} ${o.en}.` : `These are ${o.pl}.`;
  const extra = n === 1 ? `There is ${articulo(o.en)} ${o.en} in the ${CUARTOS.find(c => c.id === o.cuarto).en}.` : `There are ${NUM[n]} ${o.pl}.`;
  return {
    tipo: "hablar", tema: "house",
    instr: pregunta,
    voz: [en(pregunta)],
    html: `<span class="varios">${Array.from({ length: n }, () => dibujo(o)).join("")}</span><small>${n === 1 ? o.es : `${NUM_ES[n]} ${o.es}s`}</small>`,
    respuesta: { en: resp, es: n === 1 ? `Es ${articulo(o.es) === "an" ? "una" : "un"} ${o.es}.` : `Estas son ${o.es}s.` },
    tambien: { en: extra, es: n === 1 ? "También podés decir «Hay un/una …»" : `También: «Hay ${NUM_ES[n]} ${o.es}s»` },
    claves: [n === 1 ? o.en : o.pl],
    explica: n === 1 ? `Uno: <b>What is this?</b> → <b>It is a…</b> (o «This is a…»). <b>a</b> antes de consonante, <b>an</b> antes de vocal.` : `Varios: <b>What are these?</b> → <b>These are…</b> y la palabra con <b>-s</b>.`,
  };
}

export function hablarAnimal(rnd = Math.random, que = null) {
  const a = azar(ANIMALES, rnd);
  const tipo = que || azar(["nombre", "tamano", "color", "vive", "viven"], rnd);
  const casa = `${a.the ? "the" : "a"} ${a.hab}`;
  const circulo = `<span class="color" style="--c:${a.hex.length > 1 ? `linear-gradient(90deg, ${a.hex[0]} 50%, ${a.hex[1]} 50%)` : a.hex[0]}" aria-label="${a.color}"></span>`;
  const base = { tipo: "hablar", tema: "animals", html: `${dibujo(a)}<small>${a.es}</small>` };
  if (tipo === "nombre") return { ...base,
    instr: "What animal is this?", voz: [en("What animal is this?")],
    respuesta: { en: `It is ${articulo(a.en)} ${a.en}.`, es: `Es ${articulo(a.es) === "an" ? "una" : "un"} ${a.es}.` },
    claves: [a.en], explica: `<b>It is a…</b> (o «This is a…»). <b>${a.en}</b> = ${a.es}.` };
  if (tipo === "tamano") return { ...base,
    instr: "Is it big or small?", voz: [en("Is it big or small?")],
    respuesta: { en: `It is ${a.size}.`, es: `Es ${a.size === "big" ? "grande" : "pequeño"}.` },
    claves: [a.size], explica: `<b>big</b> = grande · <b>small</b> = pequeño.` };
  if (tipo === "color") return { ...base,
    html: `<span class="escena">${dibujo(a)}${circulo}</span><small>${a.es}</small>`,
    instr: "What color is it?", voz: [en("What color is it?")],
    respuesta: { en: `It is ${a.color}.`, es: `Es ${COLOR_ES[a.color]}.` },
    claves: a.color.split(" and "), explica: `<b>${a.color}</b> = ${COLOR_ES[a.color]}. Mirá el círculo de color.` };
  if (tipo === "vive") return { ...base,
    instr: `Where does the ${a.en} live?`, voz: [en(`Where does the ${a.en} live?`)],
    respuesta: { en: `The ${a.en} lives in ${casa}.`, es: `${may(a.es === "pez" || a.es === "pájaro" ? "El" : /a$/.test(a.es) ? "La" : "El")} ${a.es} vive en ${a.the ? "el" : "un"} ${a.habEs}.` },
    tambien: { en: `${may(a.pl)} live in ${casa}.`, es: "O en plural: «… live in …»" },
    claves: [a.hab], explica: `<b>${a.hab}</b> = ${a.habEs}. Con <b>the ${a.en}</b> (uno) se dice <b>lives</b>; con <b>${a.pl}</b> (varios) se dice <b>live</b>.` };
  return { ...base,
    html: `<span class="varios">${dibujo(a)}${dibujo(a)}</span><small>${a.es}s</small>`,
    instr: `Where do ${a.pl} live?`, voz: [en(`Where do ${a.pl} live?`)],
    respuesta: { en: `${may(a.pl)} live in ${casa}.`, es: `Los ${a.es}s viven en ${a.the ? "el" : "un"} ${a.habEs}.` },
    claves: [a.hab], explica: `<b>${a.hab}</b> = ${a.habEs}. Como son varios (<b>${a.pl}</b>), es <b>live</b> sin «s».` };
}

/** 🏠 ¿Dónde vive? Para tocar: el animal y cuatro casas en palabras. */
export function oirHabitat(rnd = Math.random) {
  const a = azar(ANIMALES, rnd);
  const h = HABITATS.find(x => x.id === a.hab);
  const pregunta = `Where does the ${a.en} live?`;
  return {
    tipo: "oir", tema: "animals",
    instr: pregunta,
    voz: [en(pregunta)],
    html: `${dibujo(a)}<small>${a.es}</small>`,
    opciones: opcionesDe(HABITATS, h, 4, rnd, opcionTexto),
    correcta: h.id,
    respuesta: { en: `The ${a.en} lives in ${a.the ? "the" : "a"} ${a.hab}.`, es: `Vive en ${a.the ? "el" : "un"} ${a.habEs}.` },
    claves: [a.hab],
    explica: `<b>${a.hab}</b> = ${a.habEs}`,
  };
}

// ---------- Por tema y por modo ----------
const GEN = {
  oir: {
    family: rnd => oirFamilia(rnd, rnd() < 0.5),
    house: rnd => (rnd() < 0.45 ? oirCuarto(rnd, rnd() < 0.5) : oirObjeto(rnd, rnd() < 0.5)),
    animals: rnd => (rnd() < 0.3 ? oirHabitat(rnd) : oirAnimal(rnd, rnd() < 0.5)),
  },
  hablar: {
    family: rnd => hablarFamilia(rnd),
    house: rnd => (rnd() < 0.4 ? hablarDonde(rnd) : hablarObjeto(rnd)),
    animals: rnd => hablarAnimal(rnd),
  },
};
/** Una pregunta del modo ("oir" | "hablar") y tema ("family" | "house" | "animals" | "todo"). */
export function pregunta(modo, tema, rnd = Math.random) {
  const t = tema === "todo" ? azar(TEMAS, rnd).id : tema;
  return GEN[modo][t](rnd);
}

/** 🎤 La entrevista: como el examen, en el orden del temario (familia, casa, animales). */
export function entrevista(rnd = Math.random) {
  const lista = [
    hablarFamilia(rnd), hablarFamilia(rnd), hablarFamilia(rnd),
    hablarDonde(rnd), hablarObjeto(rnd), hablarObjeto(rnd), hablarDonde(rnd),
    hablarAnimal(rnd, "nombre"), hablarAnimal(rnd, "tamano"), hablarAnimal(rnd, "color"), hablarAnimal(rnd, azar(["vive", "viven"], rnd)),
  ];
  // Sin preguntas repetidas en toda la entrevista
  for (let i = 1; i < lista.length; i++) {
    let v = 0;
    const repetida = () => lista.slice(0, i).some(x => x.respuesta.en === lista[i].respuesta.en);
    while (v++ < 20 && repetida()) lista[i] = GEN.hablar[lista[i].tema](rnd);
  }
  return lista;
}

/** ¿Lo que se oyó (micrófono) tiene la palabra clave? Acepta variantes cercanas. */
export function dijoBien(oido, claves) {
  const t = ` ${String(oido).toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim()} `;
  const ALIAS = { father: ["dad", "daddy"], mother: ["mom", "mum", "mommy"], grandfather: ["grandpa", "granddad"], grandmother: ["grandma", "granny"],
    television: ["tv"], refrigerator: ["fridge"], chicken: ["hen"], pigsty: ["pigpen", "pig pen"], coop: ["chicken coop", "henhouse"], water: ["sea", "river"] };
  // Vale en singular o plural («these are chair» también se entiende)
  const formas = k => [k, ...(ALIAS[k] || [])].flatMap(w => [w, w.replace(/s$/, ""), w + "s"]);
  return claves.every(k => formas(k).some(w => t.includes(` ${w} `)));
}

/** Para node: comprueba que cada generador tenga una sola respuesta correcta y opciones distintas. */
export function revisarOral(n = 300) {
  const errores = [];
  let s = 7;
  const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const gens = { oirFamilia, oirCuarto, oirObjeto, oirAnimal, oirHabitat, hablarFamilia, hablarDonde, hablarObjeto, hablarAnimal };
  for (const [nombre, g] of Object.entries(gens)) for (let i = 0; i < n; i++) {
    const q = g(rnd, i % 2 === 0);
    if (!q.voz?.length || !q.respuesta?.en || !q.claves?.length) errores.push(`${nombre}: falta voz, respuesta o claves`);
    if (q.tipo === "oir") {
      const ids = q.opciones.map(o => o.id);
      if (new Set(ids).size !== ids.length) errores.push(`${nombre}: opciones repetidas`);
      if (ids.filter(x => x === q.correcta).length !== 1) errores.push(`${nombre}: la correcta no está una sola vez`);
    } else if (!dijoBien(q.respuesta.en, q.claves)) errores.push(`${nombre}: la respuesta no contiene sus claves (${q.respuesta.en})`);
  }
  // Los animales del modo difícil: las pistas deben dejar una sola opción
  for (let i = 0; i < n; i++) {
    const q = oirAnimal(rnd, true);
    const a = ANIMALES.find(x => x.id === q.correcta);
    const iguales = q.opciones.filter(o => { const x = ANIMALES.find(y => y.id === o.id); return x.size === a.size && x.color === a.color && x.hab === a.hab; });
    if (iguales.length !== 1) errores.push("oirAnimal difícil: las pistas no alcanzan");
  }
  for (let i = 0; i < 50; i++) {
    const e = entrevista(rnd);
    if (e.length !== 11) errores.push("entrevista: no son 11 preguntas");
    if (new Set(e.map(x => x.respuesta.en)).size !== e.length) errores.push("entrevista: pregunta repetida");
  }
  return [...new Set(errores)];
}
