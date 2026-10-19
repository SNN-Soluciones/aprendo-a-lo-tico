// 🌳 Contenido de «Ecosistemas de Costa Rica» (usa el motor js/quiz.js).
import { barajar } from "./quiz.js";

export const ECOS = {
  lluvioso: { e: "🌴", n: "Bosque lluvioso", como: "llueve casi todo el año, los árboles son altísimos y hay muchísima vida" },
  nuboso: { e: "🌫️", n: "Bosque nuboso", como: "está en las montañas, casi siempre hay neblina y los árboles están cubiertos de musgo y bromelias" },
  seco: { e: "🌵", n: "Bosque seco", como: "pasa muchos meses sin llover y en el verano muchos árboles botan las hojas" },
  manglar: { e: "🦀", n: "Manglar", como: "está donde el río se junta con el mar, y los mangles tienen raíces como zancos en el agua salada" },
  arrecife: { e: "🪸", n: "Arrecife de coral", como: "está bajo el mar, en agua tibia y clara, y lo forman animalitos llamados corales" },
  paramo: { e: "🏔️", n: "Páramo", como: "está en lo más alto de las montañas, hace frío y crecen plantas bajitas y arbustos" },
};

// ¿Dónde vive? · tambien: otros ecosistemas donde también vive (no se ponen como opción incorrecta)
export const SERES = [
  { e: "🦜", n: "El quetzal", eco: "nuboso", dato: "Vive en los bosques nubosos, como en San Gerardo de Dota y Monteverde." },
  { e: "🦌", n: "El venado cola blanca", eco: "seco", tambien: ["lluvioso", "nuboso"], dato: "Es muy común en el bosque seco de Guanacaste." },
  { e: "🌳", n: "El árbol de guanacaste", eco: "seco", dato: "Es típico del bosque seco: da mucha sombra en el verano caliente." },
  { e: "🦀", n: "El cangrejo de manglar", eco: "manglar", dato: "Vive entre las raíces de los mangles, en el lodo." },
  { e: "🐠", n: "El pez loro", eco: "arrecife", dato: "Come algas de los corales y con sus dientes hace arena." },
  { e: "🐢", n: "La tortuga carey", eco: "arrecife", dato: "Busca comida entre los corales, como en Cahuita." },
  { e: "🦈", n: "El tiburón punta blanca", eco: "arrecife", dato: "Nada entre los arrecifes de la Isla del Coco." },
  { e: "🐇", n: "El conejo del páramo", eco: "paramo", dato: "Vive en el frío de las partes más altas, como el Chirripó." },
  { e: "🌿", n: "El bambú del páramo (chusquea)", eco: "paramo", dato: "Es un bambú bajito que aguanta el frío de las montañas altas." },
  { e: "🦥", n: "El perezoso de dos dedos", eco: "lluvioso", tambien: ["nuboso", "manglar"], dato: "Vive en los árboles de los bosques húmedos, donde hay muchas hojas." },
  { e: "🦜", n: "La lapa verde", eco: "lluvioso", dato: "Vive en el bosque lluvioso de la zona norte y el Caribe; come semillas del almendro." },
  { e: "🐸", n: "La rana calzonuda", eco: "lluvioso", tambien: ["nuboso"], dato: "Necesita mucha humedad: vive en los bosques lluviosos." },
  { e: "🪴", n: "Las bromelias y el musgo", eco: "nuboso", tambien: ["lluvioso"], dato: "Crecen sobre los árboles, gracias a la neblina y la humedad." },
  { e: "🐒", n: "El mono congo", eco: "seco", tambien: ["lluvioso", "manglar", "nuboso"], dato: "Se oye rugir en el bosque seco de Guanacaste, y también vive en otros bosques." },
  { e: "🌱", n: "El mangle rojo", eco: "manglar", dato: "Aguanta el agua salada y tiene raíces como zancos." },
  { e: "🐊", n: "El cocodrilo", eco: "manglar", tambien: ["lluvioso"], dato: "Se esconde en los canales de agua de los manglares y en los ríos." },
];

// ¿Dónde queda? · lugares reales
export const LUGARES = [
  { n: "Monteverde", eco: "nuboso" }, { n: "San Gerardo de Dota", eco: "nuboso" },
  { n: "el Parque Nacional Santa Rosa, en Guanacaste", eco: "seco" }, { n: "Barra Honda, en Guanacaste", eco: "seco" },
  { n: "Tortuguero", eco: "lluvioso", tambien: ["manglar"] }, { n: "Corcovado, en la península de Osa", eco: "lluvioso", tambien: ["manglar"] },
  { n: "Térraba-Sierpe", eco: "manglar" }, { n: "Cahuita, en el Caribe", eco: "arrecife", tambien: ["lluvioso"] },
  { n: "la Isla del Coco", eco: "arrecife", tambien: ["lluvioso", "nuboso"] }, { n: "la cima del Chirripó", eco: "paramo" },
  { n: "el Cerro de la Muerte", eco: "paramo", tambien: ["nuboso"] },
];

const N = 8;
const cap = t => t[0].toUpperCase() + t.slice(1);
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
// Opciones: la correcta y otras que de verdad no son
const opciones = (item, rnd, n = 3) => barajar([item.eco, ...barajar(Object.keys(ECOS).filter(k => k !== item.eco && !(item.tambien || []).includes(k)), rnd).slice(0, n - 1)], rnd)
  .map(id => ({ id, html: `<b>${ECOS[id].e}</b>${ECOS[id].n}` }));

// ---------- Preguntas ----------
const preguntaVive = (s, rnd, n = 3) => ({
  html: `<span class="grande">${s.e}</span>${s.n}`, voz: `${s.n}: ¿en qué ecosistema vive?`,
  opciones: opciones(s, rnd, n), correcta: s.eco, cols: n === 4 ? 2 : undefined,
  explica: `${ECOS[s.eco].e} <b>${ECOS[s.eco].n}</b>. ${s.dato}`,
});
const preguntaComo = (id, rnd, n = 3) => {
  const x = ECOS[id];
  return {
    html: `«${cap(x.como)}.»`, voz: `¿Qué ecosistema es? ${x.como}.`,
    opciones: opciones({ eco: id }, rnd, n), correcta: id, cols: n === 4 ? 2 : undefined,
    explica: `${x.e} Es el <b>${x.n.toLowerCase()}</b>: ${x.como}.`,
  };
};
const preguntaDonde = (l, rnd, n = 3) => ({
  html: `<span class="grande">📍</span>${cap(l.n)}`, voz: `¿Qué ecosistema hay en ${l.n}?`,
  opciones: opciones(l, rnd, n), correcta: l.eco, cols: n === 4 ? 2 : undefined,
  explica: `📍 En ${l.n} hay <b>${ECOS[l.eco].n.toLowerCase()}</b>: ${ECOS[l.eco].como}.`,
});
/** Al revés: dado el ecosistema, ¿quién vive ahí? (las otras opciones no viven ahí) */
function preguntaQuien(rnd) {
  const s = azar(SERES, rnd), eco = ECOS[s.eco];
  const malos = barajar(SERES.filter(x => x.eco !== s.eco && !(x.tambien || []).includes(s.eco)), rnd).slice(0, 2);
  return {
    html: `<span class="grande">${eco.e}</span>${eco.n}`, voz: `¿Quién vive en el ${eco.n.toLowerCase()}?`, cols: 1,
    opciones: barajar([s, ...malos], rnd).map(x => ({ id: x.n, html: `${x.e} ${x.n}` })), correcta: s.n,
    explica: `${s.e} <b>${s.n}</b> vive en el ${eco.n.toLowerCase()}. ${s.dato}`,
  };
}

// ---------- 🪜 De a poquito ----------
// Los que viven en un solo ecosistema y son muy de ahí: para empezar
const TIPICOS = SERES.filter(s => !s.tambien);
// Solo los que tienen suficientes ecosistemas donde de verdad no viven (el mono congo vive en casi todos)
const conMalos = (lista, n) => lista.filter(x => Object.keys(ECOS).length - 1 - (x.tambien || []).length >= n - 1);
const vive = (lista, n) => rnd => preguntaVive(azar(conMalos(lista, n), rnd), rnd, n);
const como = n => rnd => preguntaComo(azar(Object.keys(ECOS), rnd), rnd, n);
export const ESCALONES = [
  { nombre: "🦜 ¿Dónde vive? (2)", instr: "¿En qué <b>ecosistema</b> vive?", gen: vive(TIPICOS, 2) },
  { nombre: "🔎 ¿Cómo es? (2)", instr: "¿Qué <b>ecosistema</b> es?", gen: como(2) },
  { nombre: "🦜 ¿Dónde vive? Más animales", instr: "¿En qué <b>ecosistema</b> vive?", gen: vive(SERES, 2) },
  { nombre: "🦜 ¿Dónde vive? (3)", instr: "¿En qué <b>ecosistema</b> vive?", gen: vive(SERES, 3) },
  { nombre: "🔎 ¿Cómo es? (3)", instr: "¿Qué <b>ecosistema</b> es?", gen: como(3) },
  { nombre: "🗺️ ¿Dónde queda?", instr: "¿Qué <b>ecosistema</b> hay en este lugar?", gen: rnd => preguntaDonde(azar(LUGARES, rnd), rnd) },
  { nombre: "🐾 ¿Quién vive aquí?", instr: "¿Quién <b>vive</b> en este ecosistema?", gen: preguntaQuien },
  { nombre: "🧩 Todo revuelto (4)", instr: "¡De todo un poco!",
    gen: rnd => azar([vive(SERES, 4), como(4), r => preguntaDonde(azar(conMalos(LUGARES, 4), r), r, 4), preguntaQuien], rnd)(rnd) },
];
export const inicio = edad => (edad === null || edad <= 8 ? 0 : edad === 9 ? 2 : edad === 10 ? 3 : edad === 11 ? 5 : 6);

let ultima = "";
/** Una pregunta del escalón i, que no sea la misma que la anterior. */
export function pregunta(i, rnd = Math.random) {
  let p;
  for (let k = 0; k < 20; k++) { p = ESCALONES[i].gen(rnd); if (p.voz !== ultima) break; }
  ultima = p.voz;
  return p;
}

export const JUEGO = {
  clave: "ecosistemas",
  textos: { fin3: "¡Excelente! Conocés los ecosistemas de Costa Rica." },
  escalera: { id: "ecosistemas", escalones: ESCALONES.map((e, i) => ({ nombre: e.nombre, instr: e.instr, pregunta: () => pregunta(i) })), inicio },
  modos: [
    { id: "vive", nombre: "🦜 ¿Dónde vive?", instr: "¿En qué <b>ecosistema</b> vive?",
      preguntas: (rnd = Math.random) => barajar(SERES, rnd).slice(0, N).map(s => preguntaVive(s, rnd)) },
    { id: "como", nombre: "🔎 ¿Cómo es?", instr: "¿Qué <b>ecosistema</b> es?",
      preguntas: (rnd = Math.random) => barajar(Object.keys(ECOS), rnd).map(id => preguntaComo(id, rnd)) },
    { id: "donde", nombre: "🗺️ ¿Dónde queda?", instr: "¿Qué <b>ecosistema</b> hay en este lugar?",
      preguntas: (rnd = Math.random) => barajar(LUGARES, rnd).slice(0, N).map(l => preguntaDonde(l, rnd)) },
  ],
};

// ---------- Revisar (para las pruebas con node) ----------
/** Revisa una pregunta: opciones distintas, la correcta entre ellas y ninguna otra opción también correcta. */
export function revisarPregunta(p) {
  const e = [];
  const ids = p.opciones.map(o => o.id), htmls = p.opciones.map(o => o.html);
  if (new Set(ids).size !== ids.length || new Set(htmls).size !== htmls.length) e.push(`opciones repetidas: ${p.voz}`);
  if (ids.filter(id => id === p.correcta).length !== 1) e.push(`la correcta no está: ${p.voz}`);
  if (/undefined|NaN/.test(p.html + p.voz + p.explica)) e.push(`texto roto: ${p.voz}`);
  // Si la pregunta es de un ser o un lugar, ninguna opción mala puede ser otro ecosistema donde también está
  const x = [...SERES, ...LUGARES].find(y => p.voz.startsWith(`${y.n}:`) || p.voz === `¿Qué ecosistema hay en ${y.n}?`);
  if (x && ids.some(id => id !== p.correcta && (x.tambien || []).includes(id))) e.push(`otra opción también vale: ${p.voz}`);
  // En «¿Quién vive aquí?», ninguna opción mala vive en ese ecosistema
  const eco = Object.entries(ECOS).find(([, y]) => p.voz === `¿Quién vive en el ${y.n.toLowerCase()}?`);
  if (eco) ids.filter(id => id !== p.correcta).forEach(id => {
    const s = SERES.find(y => y.n === id);
    if (s.eco === eco[0] || (s.tambien || []).includes(eco[0])) e.push(`${id} también vive ahí: ${p.voz}`);
  });
  return e;
}
export function revisarEcosistemas(n = 500, rnd = Math.random) {
  const e = new Set();
  const opc = [2, 2, 2, 3, 3, 3, 3];
  ESCALONES.forEach((esc, i) => {
    for (let k = 0; k < n; k++) {
      const p = esc.gen(rnd);
      revisarPregunta(p).forEach(x => e.add(`escalón ${i + 1}: ${x}`));
      if (i < opc.length && p.opciones.length !== opc[i]) e.add(`escalón ${i + 1}: ${p.opciones.length} opciones`);
      if (i === 7 && p.opciones.length !== 4 && !p.voz.startsWith("¿Quién")) e.add(`escalón 8: ${p.opciones.length} opciones`);
    }
  });
  // Casi todos alcanzan para 4 opciones
  if (conMalos(SERES, 4).length < SERES.length - 2 || conMalos(LUGARES, 4).length < LUGARES.length - 1) e.add("pocos seres o lugares con 4 opciones");
  return [...e];
}
