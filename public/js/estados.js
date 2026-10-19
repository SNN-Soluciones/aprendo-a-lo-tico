// 🧊 Contenido de «Sólido, líquido o gaseoso» (usa el motor js/quiz.js).
import { barajar } from "./quiz.js";

export const ESTADOS = {
  solido: { html: "<b>🧊</b>Sólido", nombre: "sólido", explica: "Es <b>sólido</b>: tiene su propia forma y no se derrama." },
  liquido: { html: "<b>💧</b>Líquido", nombre: "líquido", explica: "Es <b>líquido</b>: toma la forma del recipiente y se puede derramar." },
  gas: { html: "<b>♨️</b>Gaseoso", nombre: "gaseoso", explica: "Es un <b>gas</b>: se esparce por todo el espacio y casi no se ve." },
};

// ¿En qué estado está? (e: emoji, n: nombre, f: 1 = fácil, para los primeros escalones · extra: algo más para aprender)
export const COSAS = [
  { e: "🧊", n: "el hielo", f: 1, s: "solido", extra: "Es agua congelada." },
  { e: "💧", n: "el agua del vaso", f: 1, s: "liquido" },
  { e: "♨️", n: "el vapor de la olla", f: 1, s: "gas", extra: "Es agua que se calentó tanto que se volvió gas." },
  { e: "🪨", n: "una piedra", f: 1, s: "solido" },
  { e: "🥛", n: "la leche", f: 1, s: "liquido" },
  { e: "🧃", n: "el jugo", f: 1, s: "liquido" },
  { e: "🎈", n: "el aire del globo", f: 1, s: "gas", extra: "El aire llena todo el globo por dentro." },
  { e: "✏️", n: "un lápiz", f: 1, s: "solido" },
  { e: "🍯", n: "la miel", s: "liquido", extra: "Es un líquido espeso: se derrama despacito." },
  { e: "🪵", n: "un pedazo de madera", f: 1, s: "solido" },
  { e: "☕", n: "el vapor que sale del café", f: 1, s: "gas" },
  { e: "🫧", n: "las burbujas del refresco", s: "gas", extra: "Adentro de cada burbuja hay un gas." },
  { e: "🏖️", n: "la arena", s: "solido", extra: "Parece que se derrama, pero cada granito es un sólido muy pequeño." },
  { e: "🍲", n: "el caldo de la sopa", f: 1, s: "liquido" },
  { e: "🔑", n: "una llave", f: 1, s: "solido" },
  { e: "🌬️", n: "el viento", s: "gas", extra: "El viento es aire en movimiento." },
  { e: "🫗", n: "el aceite", f: 1, s: "liquido" },
  { e: "🍦", n: "el helado del congelador", s: "solido", extra: "Si lo dejás al sol, se derrite y se vuelve líquido." },
];

export const CAMBIOS = {
  derrite: { html: "<b>🫠</b>Se derrite", nombre: "se derrite", de: "sólido a líquido", causa: "calor" },
  congela: { html: "<b>🥶</b>Se congela", nombre: "se congela", de: "líquido a sólido", causa: "frio" },
  evapora: { html: "<b>♨️</b>Se evapora", nombre: "se evapora", de: "líquido a gas", causa: "calor" },
  condensa: { html: "<b>💦</b>Se condensa", nombre: "se condensa", de: "gas a líquido", causa: "frio" },
};
// ¿Qué le pasó? (c: cambio)
export const SITUACIONES = [
  { e: "🧊☀️", t: "Un cubito de hielo al sol se vuelve agua.", c: "derrite" },
  { e: "💧❄️", t: "Metemos agua en el congelador y hacemos cubitos.", c: "congela" },
  { e: "🍲🔥", t: "El agua de la olla hierve y sale vapor.", c: "evapora" },
  { e: "🪞🚿", t: "Después de bañarnos, el espejo se llena de gotitas.", c: "condensa", extra: "El vapor de la ducha tocó el espejo frío y volvió a ser agua." },
  { e: "🍦☀️", t: "El helado se chorrea en la mano en un día caliente.", c: "derrite" },
  { e: "👕☀️", t: "La ropa mojada se seca en el tendedero.", c: "evapora", extra: "El agua de la ropa se va al aire como vapor." },
  { e: "🌧️☀️", t: "Después de la lluvia sale el sol y los charcos desaparecen.", c: "evapora" },
  { e: "🥤💧", t: "Un vaso con fresco bien frío se llena de gotitas por fuera.", c: "condensa", extra: "El vapor del aire toca el vaso frío y se vuelve gotitas." },
  { e: "🍫🔥", t: "El chocolate en la olla caliente se vuelve una crema.", c: "derrite" },
  { e: "🕯️", t: "La cera de la candela encendida se pone líquida.", c: "derrite" },
  { e: "🧈🍳", t: "La mantequilla en el sartén caliente se vuelve líquida.", c: "derrite" },
  { e: "☕🌫️", t: "Sale humito del café recién chorreado.", c: "evapora" },
  { e: "🌄", t: "En la mañana, el zacate amanece mojado de rocío.", c: "condensa", extra: "El vapor del aire se enfrió en la noche y se hizo gotitas." },
  { e: "🧊❄️", t: "Llenamos el molde de los cubitos con agua y al otro día hay hielo.", c: "congela" },
  { e: "🍓❄️", t: "Metemos jugo de fresa en el congelador y se vuelve una paleta dura.", c: "congela" },
  { e: "🏔️🥶", t: "En una noche muy fría en el cerro Chirripó, el agua de un charquito amanece hecha hielo.", c: "congela", extra: "En lo más alto del país, algunas noches hace tanto frío que el agua se congela." },
  { e: "🪟😮‍💨", t: "Echamos el aliento en el vidrio frío de la ventana y se empaña de gotitas.", c: "condensa", extra: "El aliento lleva vapor de agua: al tocar el vidrio frío vuelve a ser líquido." },
];

const N = 8;
const cap = t => t[0].toUpperCase() + t.slice(1);
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

// ---------- Preguntas ----------
/** ¿En qué estado está? `ids`: los estados que salen como opción. */
function preguntaEstado(c, ids = Object.keys(ESTADOS)) {
  const nombres = ids.map(id => ESTADOS[id].nombre);
  return {
    html: `<span class="grande">${c.e}</span>${cap(c.n)}`,
    voz: `${c.n}: ¿es ${nombres.slice(0, -1).join(", ")} o ${nombres[nombres.length - 1]}?`,
    opciones: ids.map(id => ({ id, html: ESTADOS[id].html })), correcta: c.s,
    explica: `${c.e} ${ESTADOS[c.s].explica}${c.extra ? ` ${c.extra}` : ""}`,
  };
}
/** ¿Qué le pasó? `ids`: los cambios que salen como opción. */
function preguntaCambio(s, ids = Object.keys(CAMBIOS)) {
  return {
    html: `<span class="grande">${s.e}</span>${s.t}`, voz: `${s.t} ¿Qué le pasó?`, cols: 2,
    opciones: ids.map(id => ({ id, html: CAMBIOS[id].html })), correcta: s.c,
    explica: `<b>${cap(CAMBIOS[s.c].nombre)}</b>: pasa de ${CAMBIOS[s.c].de}.${s.extra ? ` ${s.extra}` : ""}`,
  };
}
function preguntaCausa(s) {
  const c = CAMBIOS[s.c];
  return {
    html: `<span class="grande">${s.e}</span>${s.t}`, voz: `${s.t} ¿Pasó por el calor o por el frío?`, cols: 2,
    opciones: [{ id: "calor", html: "<b>🔥</b>Calor" }, { id: "frio", html: "<b>❄️</b>Frío" }], correcta: c.causa,
    explica: c.causa === "calor" ? `🔥 Con <b>calor</b> ${c.nombre}: pasa de ${c.de}.` : `❄️ Al <b>enfriarse</b> ${c.nombre}: pasa de ${c.de}.`,
  };
}
/** ¿De qué estado a qué estado pasó? */
function preguntaDeA(s, rnd) {
  const c = CAMBIOS[s.c];
  const opciones = Object.entries(CAMBIOS).map(([id, x]) => ({ id, html: `${x.de[0].toUpperCase()}${x.de.slice(1)}` }));
  if (rnd() < 0.5) return {
    html: `<span class="grande">${s.e}</span>${s.t}`, voz: `${s.t} ¿De qué estado a qué estado pasó?`, cols: 2,
    opciones, correcta: s.c,
    explica: `${cap(c.nombre)}: pasa de <b>${c.de}</b>.${s.extra ? ` ${s.extra}` : ""}`,
  };
  return {
    html: `Cuando algo <b>${c.nombre}</b>, pasa de…`, voz: `Cuando algo ${c.nombre}, ¿de qué estado a qué estado pasa?`, cols: 2,
    opciones, correcta: s.c,
    explica: `Cuando algo <b>${c.nombre}</b>, pasa de <b>${c.de}</b>.`,
  };
}

// ---------- 🪜 De a poquito ----------
const faciles = estados => COSAS.filter(c => c.f && estados.includes(c.s));
const de = cambios => SITUACIONES.filter(s => cambios.includes(s.c));
export const ESCALONES = [
  { nombre: "🧊 ¿Sólido o líquido?", instr: "¿Es <b>sólido</b> o <b>líquido</b>?",
    gen: rnd => preguntaEstado(azar(faciles(["solido", "liquido"]), rnd), ["solido", "liquido"]) },
  { nombre: "♨️ Sólido, líquido o gaseoso", instr: "¿Es <b>sólido</b>, <b>líquido</b> o <b>gaseoso</b>?",
    gen: rnd => preguntaEstado(azar(faciles(["solido", "liquido", "gas"]), rnd)) },
  { nombre: "🫧 Más cosas", instr: "¿Es <b>sólido</b>, <b>líquido</b> o <b>gaseoso</b>?", gen: rnd => preguntaEstado(azar(COSAS, rnd)) },
  { nombre: "🔥 ¿Calor o frío?", instr: "¿Pasó por el <b>calor</b> o por el <b>frío</b>?", gen: rnd => preguntaCausa(azar(SITUACIONES, rnd)) },
  { nombre: "🫠 ¿Se derrite o se congela?", instr: "¿Se <b>derrite</b> o se <b>congela</b>?",
    gen: rnd => preguntaCambio(azar(de(["derrite", "congela"]), rnd), ["derrite", "congela"]) },
  { nombre: "♨️ ¿Se evapora o se condensa?", instr: "¿Se <b>evapora</b> o se <b>condensa</b>?",
    gen: rnd => preguntaCambio(azar(de(["evapora", "condensa"]), rnd), ["evapora", "condensa"]) },
  { nombre: "🫠 ¿Qué le pasó?", instr: "¿Qué <b>le pasó</b>?", gen: rnd => preguntaCambio(azar(SITUACIONES, rnd)) },
  { nombre: "🔄 ¿De qué a qué?", instr: "¿De qué estado <b>a qué estado</b>?", gen: rnd => preguntaDeA(azar(SITUACIONES, rnd), rnd) },
  { nombre: "🎲 Todo revuelto", instr: "¡De todo un poco!",
    gen: rnd => azar([
      r => preguntaEstado(azar(COSAS, r)), r => preguntaCausa(azar(SITUACIONES, r)),
      r => preguntaCambio(azar(SITUACIONES, r)), r => preguntaDeA(azar(SITUACIONES, r), r),
    ], rnd)(rnd) },
];
export const inicio = edad => (edad === null || edad <= 6 ? 0 : edad === 7 ? 1 : edad === 8 ? 3 : edad === 9 ? 4 : 6);

let ultima = "";
/** Una pregunta del escalón i, que no sea la misma que la anterior. */
export function pregunta(i, rnd = Math.random) {
  let p;
  for (let k = 0; k < 20; k++) { p = ESCALONES[i].gen(rnd); if (p.voz !== ultima) break; }
  ultima = p.voz;
  return p;
}

export const JUEGO = {
  clave: "estados",
  textos: { fin3: "¡Excelente! Sos un científico o científica." },
  escalera: { id: "estados", escalones: ESCALONES.map((e, i) => ({ nombre: e.nombre, instr: e.instr, pregunta: () => pregunta(i) })), inicio },
  modos: [
    { id: "estado", nombre: "🧊 ¿Cómo está?", instr: "¿Es <b>sólido</b>, <b>líquido</b> o <b>gaseoso</b>?",
      preguntas: (rnd = Math.random) => barajar(COSAS, rnd).slice(0, N).map(c => preguntaEstado(c)) },
    { id: "cambio", nombre: "🫠 ¿Qué le pasó?", instr: "¿Qué <b>le pasó</b>?",
      preguntas: (rnd = Math.random) => barajar(SITUACIONES, rnd).slice(0, N).map(s => preguntaCambio(s)) },
    { id: "causa", nombre: "🔥 ¿Calor o frío?", instr: "¿Pasó por el <b>calor</b> o por el <b>frío</b>?",
      preguntas: (rnd = Math.random) => barajar(SITUACIONES, rnd).slice(0, N).map(preguntaCausa) },
  ],
};

// ---------- Revisar (para las pruebas con node) ----------
/** Revisa una pregunta: opciones distintas y la correcta está entre ellas. */
export function revisarPregunta(p) {
  const e = [];
  const ids = p.opciones.map(o => o.id), htmls = p.opciones.map(o => o.html);
  if (new Set(ids).size !== ids.length || new Set(htmls).size !== htmls.length) e.push(`opciones repetidas: ${p.voz}`);
  if (ids.filter(id => id === p.correcta).length !== 1) e.push(`la correcta no está: ${p.voz}`);
  if (!p.voz || !p.html || !p.explica) e.push(`falta texto: ${p.voz}`);
  if (/undefined|NaN/.test(p.html + p.voz + p.explica)) e.push(`texto roto: ${p.voz}`);
  return e;
}
/** Genera muchas preguntas de cada escalón y revisa que pidan lo que dice el escalón. */
export function revisarEstados(n = 500, rnd = Math.random) {
  const e = new Set();
  const opc = [2, 3, 3, 2, 2, 2, 4, 4];
  ESCALONES.forEach((esc, i) => {
    for (let k = 0; k < n; k++) {
      const p = esc.gen(rnd);
      revisarPregunta(p).forEach(x => e.add(`escalón ${i + 1}: ${x}`));
      if (i < opc.length && p.opciones.length !== opc[i]) e.add(`escalón ${i + 1}: ${p.opciones.length} opciones`);
      if (i < 2 && !COSAS.some(c => c.f && p.html.endsWith(cap(c.n)))) e.add(`escalón ${i + 1}: no es fácil: ${p.voz}`);
    }
  });
  if (de(["congela"]).length < 3 || de(["condensa"]).length < 3) e.add("pocas situaciones de congelar o condensar");
  return [...e];
}
