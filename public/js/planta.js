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

// 🌱 El ciclo de vida de una planta, en orden
export const ETAPAS = [
  { id: "semilla", e: "🌰", t: "Una semilla en la tierra" },
  { id: "brota", e: "🌱", t: "Le sale una raíz y un tallito" },
  { id: "crece", e: "🪴", t: "Crece y le salen más hojas" },
  { id: "flores", e: "🌸", t: "Le salen flores" },
  { id: "fruto", e: "🍅", t: "La flor se vuelve fruto" },
  { id: "semillas", e: "🌰🌰", t: "Adentro del fruto hay semillas nuevas" },
];

// ¿Qué necesita una planta para vivir? (y cosas que no necesita)
export const NECESITA = [
  { id: "agua", e: "💧", n: "Agua" }, { id: "sol", e: "☀️", n: "Luz del sol" },
  { id: "aire", e: "🌬️", n: "Aire" }, { id: "tierra", e: "🟫", n: "Tierra" },
];
export const NO_NECESITA = [
  { id: "dulces", e: "🍬", n: "Dulces" }, { id: "musica", e: "🎵", n: "Música" }, { id: "zapatos", e: "👟", n: "Zapatos" },
  { id: "tele", e: "📺", n: "Televisión" }, { id: "juguetes", e: "🧸", n: "Juguetes" }, { id: "oscuridad", e: "🌑", n: "Oscuridad siempre" },
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

/**
 * Preguntas de una ronda: en «donde» y «sirve» son las 6 partes; en «comemos», 8 comidas variadas.
 * Cada pregunta trae `tipo` (el modo) y, si se escoge entre botones, `ops`: los ids de las opciones.
 */
export function ronda(modo, rnd = Math.random) {
  if (modo === "donde") return barajar(PARTES, rnd).map(p => ({ tipo: "donde", parte: p.id }));
  if (modo === "sirve") return barajar(PARTES, rnd).map(p => ({ tipo: "sirve", parte: p.id, ops: opciones(p.id, rnd) }));
  if (modo === "comemos") {
    // Una comida de cada parte y el resto al azar, para que no salgan puros frutos
    const una = PARTES.map(p => barajar(COMIDAS.filter(c => c.parte === p.id), rnd)[0]);
    const resto = barajar(COMIDAS.filter(c => !una.includes(c)), rnd).slice(0, 8 - una.length);
    return barajar([...una, ...resto], rnd).map(c => ({ tipo: "comemos", ...c, ops: PARTES.map(p => p.id) }));
  }
  return [];
}

// ---------- 🪜 De a poquito: una pregunta a la vez ----------
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const FACILES = ["flor", "hoja", "raiz"];
function comemos(n, rnd) {
  // Primero se escoge la parte (para que no salgan puros frutos) y después una comida de esa parte
  const parte = azar(PARTES, rnd).id, c = azar(COMIDAS.filter(x => x.parte === parte), rnd);
  return { tipo: "comemos", ...c, ops: n >= PARTES.length ? PARTES.map(p => p.id) : opciones(c.parte, rnd, n) };
}
function necesita(rnd) {
  const bien = azar(NECESITA, rnd);
  return { tipo: "necesita", bien: bien.id, ops: barajar([bien, ...barajar(NO_NECESITA, rnd).slice(0, 2)], rnd).map(x => x.id) };
}
function ciclo(rnd) {
  const i = Math.floor(rnd() * (ETAPAS.length - 1)), sig = ETAPAS[i + 1];
  // Después del fruto no se ofrece «una semilla en la tierra»: en el ciclo también podría venir después
  const otras = barajar(ETAPAS.filter((_, k) => k !== i && k !== i + 1 && !(k === 0 && i === ETAPAS.length - 2)), rnd).slice(0, 2);
  return { tipo: "ciclo", etapa: ETAPAS[i].id, bien: sig.id, ops: barajar([sig, ...otras], rnd).map(x => x.id) };
}
export const ESCALONES = [
  { nombre: "👆 ¿Dónde está? (fácil)", gen: rnd => ({ tipo: "donde", parte: azar(FACILES, rnd) }) },
  { nombre: "👆 ¿Dónde está? (todas)", gen: rnd => ({ tipo: "donde", parte: azar(PARTES, rnd).id }) },
  { nombre: "💧 ¿Qué necesita?", gen: necesita },
  { nombre: "🥕 ¿Qué parte comemos? (2)", gen: rnd => comemos(2, rnd) },
  { nombre: "🤔 ¿Para qué sirve?", gen: rnd => { const p = azar(PARTES, rnd).id; return { tipo: "sirve", parte: p, ops: opciones(p, rnd) }; } },
  { nombre: "🥕 ¿Qué parte comemos? (3)", gen: rnd => comemos(3, rnd) },
  { nombre: "🌱 ¿Qué pasa después?", gen: ciclo },
  { nombre: "🥕 ¿Qué parte comemos? (todas)", gen: rnd => comemos(6, rnd) },
  { nombre: "🎲 Todo revuelto", gen: rnd => azar([r => ({ tipo: "donde", parte: azar(PARTES, r).id }), r => ESCALONES[4].gen(r), r => comemos(6, r), ciclo], rnd)(rnd) },
];
export const inicio = edad => (edad === null || edad <= 6 ? 0 : edad === 7 ? 2 : edad === 8 ? 4 : 5);

/** La respuesta correcta de una pregunta (id de la parte, de la etapa o de lo que necesita). */
export const correcta = q => q.bien || q.parte;
/** Un texto que identifica la pregunta (para no repetir la misma dos veces seguidas). */
const firma = q => `${q.tipo}:${q.parte || q.n || q.etapa || q.bien}`;
let ultima = "";
export function pregunta(i, rnd = Math.random) {
  let q;
  for (let k = 0; k < 20; k++) { q = ESCALONES[i].gen(rnd); if (firma(q) !== ultima) break; }
  ultima = firma(q);
  return q;
}

/** Opciones (la correcta y n - 1 partes más, por defecto 3 en total). */
export function opciones(correcta, rnd = Math.random, n = 3) {
  const otras = barajar(PARTES.filter(p => p.id !== correcta), rnd).slice(0, n - 1).map(p => p.id);
  return barajar([correcta, ...otras], rnd);
}

export function estrellasDe(puntos, total) {
  const p = puntos / total;
  return p >= 0.9 ? 3 : p >= 0.7 ? 2 : p >= 0.5 ? 1 : 0;
}

// ---------- Revisar (para las pruebas con node) ----------
export function revisarPlanta(n = 500, rnd = Math.random) {
  const e = new Set();
  const cuantas = [0, 0, 3, 2, 3, 3, 3, 6];
  ESCALONES.forEach((esc, i) => {
    for (let k = 0; k < n; k++) {
      const q = esc.gen(rnd);
      if (!["donde", "sirve", "comemos", "necesita", "ciclo"].includes(q.tipo)) e.add(`escalón ${i + 1}: tipo raro`);
      if (q.tipo === "donde" && !parte(q.parte)) e.add(`escalón ${i + 1}: parte rara`);
      if (i === 0 && !FACILES.includes(q.parte)) e.add("escalón 1: no es fácil");
      if (q.ops) {
        if (new Set(q.ops).size !== q.ops.length || q.ops.filter(x => x === correcta(q)).length !== 1) e.add(`escalón ${i + 1}: opciones mal ${JSON.stringify(q)}`);
        if (cuantas[i] && q.ops.length !== cuantas[i]) e.add(`escalón ${i + 1}: ${q.ops.length} opciones`);
        if (q.tipo === "necesita" && q.ops.filter(x => NECESITA.some(y => y.id === x)).length !== 1) e.add("necesita: dos que sí");
        if (q.tipo === "ciclo" && ETAPAS.findIndex(x => x.id === q.bien) !== ETAPAS.findIndex(x => x.id === q.etapa) + 1) e.add("ciclo: no es la que sigue");
        if (q.tipo === "ciclo" && q.ops.includes(q.etapa)) e.add("ciclo: sale la misma etapa");
        if (q.tipo === "ciclo" && q.etapa === "fruto" && q.ops.includes("semilla")) e.add("ciclo: después del fruto sale la semilla en la tierra");
      } else if (q.tipo !== "donde") e.add(`escalón ${i + 1}: sin opciones`);
    }
  });
  // Cada parte tiene al menos una comida
  PARTES.forEach(p => { if (!COMIDAS.some(c => c.parte === p.id)) e.add(`sin comida: ${p.id}`); });
  return [...e];
}
