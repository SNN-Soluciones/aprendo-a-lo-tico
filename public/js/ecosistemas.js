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
// Opciones: la correcta y otras que de verdad no son
const opciones = (item, rnd) => barajar([item.eco, ...barajar(Object.keys(ECOS).filter(k => k !== item.eco && !(item.tambien || []).includes(k)), rnd).slice(0, 2)], rnd)
  .map(id => ({ id, html: `<b>${ECOS[id].e}</b>${ECOS[id].n}` }));

export const JUEGO = {
  clave: "ecosistemas",
  textos: { fin3: "¡Excelente! Conocés los ecosistemas de Costa Rica." },
  modos: [
    { id: "vive", nombre: "🦜 ¿Dónde vive?", instr: "¿En qué <b>ecosistema</b> vive?",
      preguntas: (rnd = Math.random) => barajar(SERES, rnd).slice(0, N).map(s => ({
        html: `<span class="grande">${s.e}</span>${s.n}`, voz: `${s.n}: ¿en qué ecosistema vive?`,
        opciones: opciones(s, rnd), correcta: s.eco,
        explica: `${ECOS[s.eco].e} <b>${ECOS[s.eco].n}</b>. ${s.dato}`,
      })) },
    { id: "como", nombre: "🔎 ¿Cómo es?", instr: "¿Qué <b>ecosistema</b> es?",
      preguntas: (rnd = Math.random) => barajar(Object.entries(ECOS), rnd).map(([id, x]) => ({
        html: `«${x.como[0].toUpperCase() + x.como.slice(1)}.»`, voz: `¿Qué ecosistema es? ${x.como}.`,
        opciones: opciones({ eco: id }, rnd), correcta: id,
        explica: `${x.e} Es el <b>${x.n.toLowerCase()}</b>: ${x.como}.`,
      })) },
    { id: "donde", nombre: "🗺️ ¿Dónde queda?", instr: "¿Qué <b>ecosistema</b> hay en este lugar?",
      preguntas: (rnd = Math.random) => barajar(LUGARES, rnd).slice(0, N).map(l => ({
        html: `<span class="grande">📍</span>${l.n[0].toUpperCase() + l.n.slice(1)}`, voz: `¿Qué ecosistema hay en ${l.n}?`,
        opciones: opciones(l, rnd), correcta: l.eco,
        explica: `📍 En ${l.n} hay <b>${ECOS[l.eco].n.toLowerCase()}</b>: ${ECOS[l.eco].como}.`,
      })) },
  ],
};
