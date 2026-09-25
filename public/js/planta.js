// 🌱 Contenido y lógica de «Partes de la planta» (sin pantalla, para poder probarla sola).

export const PARTES = [
  { id: "raiz", nombre: "raíz", el: "la raíz", emoji: "🟫",
    sirve: "Sujeta la planta a la tierra y chupa el agua y los alimentos del suelo." },
  { id: "tallo", nombre: "tallo", el: "el tallo", emoji: "🟩",
    sirve: "Sostiene la planta y lleva el agua desde la raíz hasta las hojas." },
  { id: "hoja", nombre: "hoja", el: "la hoja", emoji: "🍃",
    sirve: "Fabrica el alimento de la planta con la luz del sol, el agua y el aire." },
  { id: "flor", nombre: "flor", el: "la flor", emoji: "🌸",
    sirve: "Atrae a las abejas, las mariposas y los colibríes. De la flor nace el fruto." },
  { id: "fruto", nombre: "fruto", el: "el fruto", emoji: "🍒",
    sirve: "Guarda y protege las semillas. ¡Muchos frutos nos los comemos!" },
  { id: "semilla", nombre: "semilla", el: "la semilla", emoji: "🌰",
    sirve: "Si la sembrás y le das agua, de ella nace una planta nueva." },
];
export const parte = id => PARTES.find(p => p.id === id);

// ¿Qué parte de la planta nos comemos?
export const COMIDAS = [
  { n: "la zanahoria", e: "🥕", parte: "raiz", dato: "La zanahoria es una raíz gruesa que guarda alimento para la planta." },
  { n: "el camote", e: "🍠", parte: "raiz", dato: "El camote crece bajo la tierra: es una raíz llena de alimento. La yuca también es raíz." },
  { n: "la lechuga", e: "🥬", parte: "hoja", dato: "De la lechuga nos comemos las hojas." },
  { n: "el culantro", e: "🌿", parte: "hoja", dato: "Al gallo pinto le echamos hojas de culantro." },
  { n: "el brócoli", e: "🥦", parte: "flor", dato: "¡El brócoli son muchas florecitas que todavía no se han abierto!" },
  { n: "el mango", e: "🥭", parte: "fruto", dato: "El mango es un fruto: adentro tiene una semilla grande." },
  { n: "el tomate", e: "🍅", parte: "fruto", dato: "El tomate es un fruto porque tiene semillas adentro." },
  { n: "el chile dulce", e: "🫑", parte: "fruto", dato: "El chile dulce es un fruto: por dentro tiene muchas semillas." },
  { n: "el aguacate", e: "🥑", parte: "fruto", dato: "El aguacate es un fruto con una semilla enorme." },
  { n: "los frijoles", e: "🫘", parte: "semilla", dato: "Los frijoles son semillas: si los sembrás, nace una mata de frijol." },
  { n: "el arroz", e: "🍚", parte: "semilla", dato: "Cada grano de arroz es una semilla." },
  { n: "el maíz", e: "🌽", parte: "semilla", dato: "Los granos del elote son semillas de maíz." },
  { n: "el café", e: "☕", parte: "semilla", dato: "¡El grano de café es la semilla que está dentro del fruto rojo del cafeto!" },
  { n: "el chocolate", e: "🍫", parte: "semilla", dato: "El chocolate se hace con las semillas del cacao." },
  { n: "la papa", e: "🥔", parte: "tallo", dato: "¡Sorpresa! La papa no es raíz: es un tallo que crece bajo la tierra y guarda alimento." },
  { n: "la caña de azúcar", e: "🎋", parte: "tallo", dato: "El azúcar sale del jugo del tallo de la caña." },
];

export const MODOS = [
  { id: "explorar", nombre: "🔎 Explorar", preguntas: 0 },
  { id: "donde", nombre: "👆 ¿Dónde está?", preguntas: 6 },
  { id: "sirve", nombre: "🤔 ¿Para qué sirve?", preguntas: 6 },
  { id: "comemos", nombre: "🥕 ¿Qué parte comemos?", preguntas: 8 },
];

function barajar(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Preguntas de una ronda: en «donde» y «sirve» son las 6 partes; en «comemos», 8 comidas variadas. */
export function ronda(modo, rnd = Math.random) {
  if (modo === "donde" || modo === "sirve") return barajar(PARTES, rnd).map(p => ({ parte: p.id }));
  if (modo === "comemos") {
    // Una comida de cada parte y el resto al azar, para que no salgan puros frutos
    const una = PARTES.map(p => barajar(COMIDAS.filter(c => c.parte === p.id), rnd)[0]);
    const resto = barajar(COMIDAS.filter(c => !una.includes(c)), rnd).slice(0, 8 - una.length);
    return barajar([...una, ...resto], rnd);
  }
  return [];
}

/** Tres opciones (la correcta y dos más) para «¿Para qué sirve?». */
export function opciones(correcta, rnd = Math.random) {
  const otras = barajar(PARTES.filter(p => p.id !== correcta), rnd).slice(0, 2).map(p => p.id);
  return barajar([correcta, ...otras], rnd);
}

export function estrellasDe(puntos, total) {
  const p = puntos / total;
  return p >= 0.9 ? 3 : p >= 0.7 ? 2 : p >= 0.5 ? 1 : 0;
}
