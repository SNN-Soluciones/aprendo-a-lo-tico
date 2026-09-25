// 🧊 Contenido de «Sólido, líquido o gaseoso» (usa el motor js/quiz.js).
import { barajar } from "./quiz.js";

const ESTADOS = {
  solido: { html: "<b>🧊</b>Sólido", nombre: "sólido", explica: "Es <b>sólido</b>: tiene su propia forma y no se derrama." },
  liquido: { html: "<b>💧</b>Líquido", nombre: "líquido", explica: "Es <b>líquido</b>: toma la forma del recipiente y se puede derramar." },
  gas: { html: "<b>♨️</b>Gaseoso", nombre: "gaseoso", explica: "Es un <b>gas</b>: se esparce por todo el espacio y casi no se ve." },
};

// ¿En qué estado está? (e: emoji, n: nombre, extra: algo más para aprender)
const COSAS = [
  { e: "🧊", n: "el hielo", s: "solido", extra: "Es agua congelada." },
  { e: "💧", n: "el agua del vaso", s: "liquido" },
  { e: "♨️", n: "el vapor de la olla", s: "gas", extra: "Es agua que se calentó tanto que se volvió gas." },
  { e: "🪨", n: "una piedra", s: "solido" },
  { e: "🥛", n: "la leche", s: "liquido" },
  { e: "🧃", n: "el jugo", s: "liquido" },
  { e: "🎈", n: "el aire del globo", s: "gas", extra: "El aire llena todo el globo por dentro." },
  { e: "✏️", n: "un lápiz", s: "solido" },
  { e: "🍯", n: "la miel", s: "liquido", extra: "Es un líquido espeso: se derrama despacito." },
  { e: "🪵", n: "un pedazo de madera", s: "solido" },
  { e: "☕", n: "el vapor que sale del café", s: "gas" },
  { e: "🫧", n: "las burbujas del refresco", s: "gas", extra: "Adentro de cada burbuja hay un gas." },
  { e: "🏖️", n: "la arena", s: "solido", extra: "Parece que se derrama, pero cada granito es un sólido muy pequeño." },
  { e: "🍲", n: "el caldo de la sopa", s: "liquido" },
  { e: "🔑", n: "una llave", s: "solido" },
  { e: "🌬️", n: "el viento", s: "gas", extra: "El viento es aire en movimiento." },
  { e: "🫗", n: "el aceite", s: "liquido" },
  { e: "🍦", n: "el helado del congelador", s: "solido", extra: "Si lo dejás al sol, se derrite y se vuelve líquido." },
];

const CAMBIOS = {
  derrite: { html: "<b>🫠</b>Se derrite", nombre: "se derrite", de: "sólido a líquido", causa: "calor" },
  congela: { html: "<b>🥶</b>Se congela", nombre: "se congela", de: "líquido a sólido", causa: "frio" },
  evapora: { html: "<b>♨️</b>Se evapora", nombre: "se evapora", de: "líquido a gas", causa: "calor" },
  condensa: { html: "<b>💦</b>Se condensa", nombre: "se condensa", de: "gas a líquido", causa: "frio" },
};
// ¿Qué le pasó? (c: cambio)
const SITUACIONES = [
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
];

const N = 8;

export const JUEGO = {
  clave: "estados",
  textos: { fin3: "¡Excelente! Sos un científico o científica." },
  modos: [
    { id: "estado", nombre: "🧊 ¿Cómo está?", instr: "¿Es <b>sólido</b>, <b>líquido</b> o <b>gaseoso</b>?",
      preguntas: (rnd = Math.random) => barajar(COSAS, rnd).slice(0, N).map(c => ({
        html: `<span class="grande">${c.e}</span>${c.n[0].toUpperCase() + c.n.slice(1)}`,
        voz: `${c.n}: ¿es sólido, líquido o gaseoso?`,
        opciones: Object.entries(ESTADOS).map(([id, s]) => ({ id, html: s.html })), correcta: c.s,
        explica: `${c.e} ${ESTADOS[c.s].explica}${c.extra ? ` ${c.extra}` : ""}`,
      })) },
    { id: "cambio", nombre: "🫠 ¿Qué le pasó?", instr: "¿Qué <b>le pasó</b>?",
      preguntas: (rnd = Math.random) => barajar(SITUACIONES, rnd).slice(0, N).map(s => ({
        html: `<span class="grande">${s.e}</span>${s.t}`, voz: `${s.t} ¿Qué le pasó?`, cols: 2,
        opciones: Object.entries(CAMBIOS).map(([id, c]) => ({ id, html: c.html })), correcta: s.c,
        explica: `<b>${CAMBIOS[s.c].nombre[0].toUpperCase() + CAMBIOS[s.c].nombre.slice(1)}</b>: pasa de ${CAMBIOS[s.c].de}.${s.extra ? ` ${s.extra}` : ""}`,
      })) },
    { id: "causa", nombre: "🔥 ¿Calor o frío?", instr: "¿Pasó por el <b>calor</b> o por el <b>frío</b>?",
      preguntas: (rnd = Math.random) => barajar(SITUACIONES, rnd).slice(0, N).map(s => ({
        html: `<span class="grande">${s.e}</span>${s.t}`, voz: `${s.t} ¿Pasó por el calor o por el frío?`, cols: 2,
        opciones: [{ id: "calor", html: "<b>🔥</b>Calor" }, { id: "frio", html: "<b>❄️</b>Frío" }], correcta: CAMBIOS[s.c].causa,
        explica: CAMBIOS[s.c].causa === "calor"
          ? `🔥 Con <b>calor</b> ${CAMBIOS[s.c].nombre}: pasa de ${CAMBIOS[s.c].de}.`
          : `❄️ Al <b>enfriarse</b> ${CAMBIOS[s.c].nombre}: pasa de ${CAMBIOS[s.c].de}.`,
      })) },
  ],
};
