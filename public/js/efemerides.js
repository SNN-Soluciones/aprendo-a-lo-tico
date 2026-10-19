// 📅 Contenido de «Efemérides» (usa el motor js/quiz.js). Fechas patrias y celebraciones de Costa Rica.
import { barajar } from "./quiz.js";

// f: fecha · e: dibujo · n: qué se celebra · porque: explicación corta · año y hecho: lo que pasó, para «¿En qué año?»
export const FECHAS = [
  { id: "independencia", año: 1821, hecho: "Costa Rica y Centroamérica se independizaron de España", f: "15 de setiembre", e: "🇨🇷", n: "Día de la Independencia", porque: "En 1821 Costa Rica y Centroamérica se independizaron de España." },
  { id: "faroles", f: "14 de setiembre", e: "🏮", n: "Llegada de la antorcha y desfile de faroles", porque: "La víspera de la Independencia llega la antorcha a Cartago y en la noche salen los faroles." },
  { id: "anexion", año: 1824, hecho: "el Partido de Nicoya decidió unirse a Costa Rica", f: "25 de julio", e: "🤠", n: "Anexión del Partido de Nicoya", porque: "En 1824 Nicoya decidió unirse a Costa Rica. Hoy es la provincia de Guanacaste." },
  { id: "juan", año: 1856, hecho: "fue la Batalla de Rivas, donde peleó Juan Santamaría", f: "11 de abril", e: "🔥", n: "Día de Juan Santamaría", porque: "Se recuerda la Batalla de Rivas de 1856 y al héroe Juan Santamaría." },
  { id: "santarosa", año: 1856, hecho: "fue la Batalla de Santa Rosa", f: "20 de marzo", e: "⚔️", n: "Batalla de Santa Rosa", porque: "En 1856 Costa Rica defendió su territorio en la hacienda Santa Rosa, en Guanacaste." },
  { id: "ejercito", año: 1948, hecho: "Costa Rica eliminó su ejército", f: "1 de diciembre", e: "🕊️", n: "Abolición del ejército", porque: "En 1948 Costa Rica eliminó su ejército y decidió invertir en educación y salud." },
  { id: "culturas", f: "12 de octubre", e: "🌎", n: "Día de las Culturas", porque: "Se celebra la mezcla de culturas indígenas, europeas, africanas y asiáticas que formaron el país." },
  { id: "afro", f: "31 de agosto", e: "✊🏾", n: "Día de la Persona Negra y la Cultura Afrocostarricense", porque: "Se celebra el aporte de las personas afrodescendientes a Costa Rica." },
  { id: "madre", f: "15 de agosto", e: "💐", n: "Día de la Madre", porque: "Se celebra a las mamás y a las personas que nos cuidan como mamás." },
  { id: "nino", f: "9 de setiembre", e: "🧒", n: "Día del Niño y la Niña", porque: "Se celebran los derechos de los niños y las niñas." },
  { id: "trabajador", f: "1 de mayo", e: "🛠️", n: "Día de las Personas Trabajadoras", porque: "Se reconoce el esfuerzo de todas las personas que trabajan." },
  { id: "democracia", año: 1889, hecho: "el pueblo salió a defender su voto", f: "7 de noviembre", e: "🗳️", n: "Día de la Democracia Costarricense", porque: "En 1889 el pueblo defendió su voto: es un símbolo de la democracia del país." },
  { id: "tierra", f: "22 de abril", e: "🌍", n: "Día de la Tierra", porque: "Se recuerda que hay que cuidar el planeta." },
  { id: "ambiente", f: "5 de junio", e: "🌳", n: "Día del Medio Ambiente", porque: "Se promueve cuidar la naturaleza: los bosques, el agua y los animales." },
  { id: "virgen", f: "2 de agosto", e: "⛪", n: "Día de la Virgen de los Ángeles", porque: "Mucha gente camina en romería hasta la Basílica de los Ángeles, en Cartago." },
];

// Hojita de calendario con la fecha de verdad (el emoji 📅 trae otra fecha dibujada)
const cal = (f, chico = false) => { const [dia, mes] = f.split(" de "); return `<span class="calendario${chico ? " chico" : ""}"><small>${mes}</small><b>${dia}</b></span>`; };

const N = 8;
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
export const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];
const mes = x => x.f.split(" de ")[1];
/** Día del año (para ordenar): mes y día. */
const orden = x => MESES.indexOf(mes(x)) * 100 + Number(x.f.split(" de ")[0]);
const otras = (x, lista, rnd, n) => barajar([x, ...barajar(lista.filter(y => y !== x), rnd).slice(0, n - 1)], rnd);

// ---------- Preguntas ----------
const preguntaQue = (x, lista, rnd, n = 3) => ({
  html: `${cal(x.f)}${x.f}`, voz: `¿Qué se celebra el ${x.f}?`, cols: 1,
  opciones: otras(x, lista, rnd, n).map(y => ({ id: y.id, html: `${y.e} ${y.n}` })), correcta: x.id,
  explica: `${x.e} <b>${x.f}</b>: ${x.n}. ${x.porque}`,
});
const preguntaCuando = (x, lista, rnd, n = 3) => ({
  html: `<span class="grande">${x.e}</span>${x.n}`, voz: `${x.n}: ¿qué día se celebra?`, cols: n === 2 ? 2 : undefined,
  opciones: otras(x, lista, rnd, n).map(y => ({ id: y.id, html: `${cal(y.f, true)}${y.f}` })), correcta: x.id,
  explica: `${x.e} ${x.n}: <b>${x.f}</b>. ${x.porque}`,
});
const preguntaPorque = (x, rnd) => ({
  html: `<span class="grande">${x.e}</span>«${x.porque}»`, voz: `¿Qué fecha es? ${x.porque}`, cols: 1,
  opciones: otras(x, FECHAS, rnd, 3).map(y => ({ id: y.id, html: `${y.e} ${y.n} <small>${y.f}</small>` })), correcta: x.id,
  explica: `${x.e} <b>${x.n}</b>: ${x.f}.`,
});
function preguntaMes(x, rnd) {
  const m = mes(x), malos = barajar(MESES.filter(y => y !== m), rnd).slice(0, 2);
  return {
    html: `<span class="grande">${x.e}</span>${x.n}`, voz: `${x.n}: ¿en qué mes se celebra?`,
    opciones: barajar([m, ...malos], rnd).map(y => ({ id: y, html: `<b>📅</b>${y[0].toUpperCase() + y.slice(1)}` })), correcta: m,
    explica: `${x.e} ${x.n}: el <b>${x.f}</b>. ${x.porque}`,
  };
}
function preguntaPrimero(rnd) {
  const tres = barajar(FECHAS, rnd).slice(0, 3), x = tres.reduce((a, b) => (orden(b) < orden(a) ? b : a));
  return {
    html: `<span class="grande">⏳</span>¿Cuál se celebra <b>primero</b> en el año?`, voz: `¿Cuál se celebra primero en el año, empezando en enero? ${tres.map(y => `${y.n}, el ${y.f}`).join("; ")}.`, cols: 1,
    opciones: tres.map(y => ({ id: y.id, html: `${y.e} ${y.n} <small>${y.f}</small>` })), correcta: x.id,
    explica: `El año empieza en enero. De esas tres, primero viene <b>${x.n}</b>, el ${x.f}.`,
  };
}
function preguntaAnio(x, rnd) {
  const anios = [...new Set(FECHAS.filter(y => y.año && y.año !== x.año).map(y => y.año))];
  return {
    html: `<span class="grande">${x.e}</span>¿En qué año ${x.hecho}?`, voz: `¿En qué año ${x.hecho}?`,
    opciones: barajar([x.año, ...barajar(anios, rnd).slice(0, 2)], rnd).map(a => ({ id: String(a), html: `<b>🏛️</b>${a}` })), correcta: String(x.año),
    explica: `${x.e} En <b>${x.año}</b>. Se recuerda el ${x.f}: ${x.n}.`,
  };
}

// ---------- 🪜 De a poquito ----------
// Las más conocidas, para empezar
const PRINCIPALES = FECHAS.filter(x => ["independencia", "faroles", "anexion", "juan", "madre", "nino"].includes(x.id));
const CON_ANIO = FECHAS.filter(x => x.año);
export const ESCALONES = [
  { nombre: "🎉 ¿Qué se celebra? (2)", instr: "¿Qué se <b>celebra</b> ese día?", gen: rnd => preguntaQue(azar(PRINCIPALES, rnd), PRINCIPALES, rnd, 2) },
  { nombre: "🗓️ ¿Qué día es? (2)", instr: "¿Qué <b>día</b> se celebra?", gen: rnd => preguntaCuando(azar(PRINCIPALES, rnd), PRINCIPALES, rnd, 2) },
  { nombre: "🎉 ¿Qué se celebra? Todas", instr: "¿Qué se <b>celebra</b> ese día?", gen: rnd => preguntaQue(azar(FECHAS, rnd), FECHAS, rnd) },
  { nombre: "🗓️ ¿Qué día es? Todas", instr: "¿Qué <b>día</b> se celebra?", gen: rnd => preguntaCuando(azar(FECHAS, rnd), FECHAS, rnd) },
  { nombre: "📅 ¿En qué mes?", instr: "¿En qué <b>mes</b> se celebra?", gen: rnd => preguntaMes(azar(FECHAS, rnd), rnd) },
  { nombre: "💡 ¿Por qué?", instr: "¿Qué se <b>recuerda</b>?", gen: rnd => preguntaPorque(azar(FECHAS, rnd), rnd) },
  { nombre: "⏳ ¿Cuál va primero?", instr: "¿Cuál se celebra <b>primero</b>?", gen: preguntaPrimero },
  { nombre: "🏛️ ¿En qué año pasó?", instr: "¿En qué <b>año</b> pasó?", gen: rnd => preguntaAnio(azar(CON_ANIO, rnd), rnd) },
  { nombre: "🎲 Todo revuelto", instr: "¡De todo un poco!",
    gen: rnd => azar([
      r => preguntaQue(azar(FECHAS, r), FECHAS, r), r => preguntaCuando(azar(FECHAS, r), FECHAS, r), r => preguntaMes(azar(FECHAS, r), r),
      r => preguntaPorque(azar(FECHAS, r), r), preguntaPrimero, r => preguntaAnio(azar(CON_ANIO, r), r),
    ], rnd)(rnd) },
];
export const inicio = edad => (edad === null || edad <= 7 ? 0 : edad === 8 ? 2 : edad === 9 ? 3 : edad === 10 ? 4 : edad === 11 ? 5 : 6);

let ultima = "";
/** Una pregunta del escalón i, que no sea la misma que la anterior. */
export function pregunta(i, rnd = Math.random) {
  let p;
  for (let k = 0; k < 20; k++) { p = ESCALONES[i].gen(rnd); if (p.voz !== ultima) break; }
  ultima = p.voz;
  return p;
}

export const JUEGO = {
  clave: "efemerides",
  textos: { fin3: "¡Excelente! Conocés muy bien las fechas de Costa Rica." },
  escalera: { id: "efemerides", escalones: ESCALONES.map((e, i) => ({ nombre: e.nombre, instr: e.instr, pregunta: () => pregunta(i) })), inicio },
  modos: [
    { id: "que", nombre: "🎉 ¿Qué se celebra?", instr: "¿Qué se <b>celebra</b> ese día?",
      preguntas: (rnd = Math.random) => barajar(FECHAS, rnd).slice(0, N).map(x => preguntaQue(x, FECHAS, rnd)) },
    { id: "cuando", nombre: "🗓️ ¿Qué día es?", instr: "¿Qué <b>día</b> se celebra?",
      preguntas: (rnd = Math.random) => barajar(FECHAS, rnd).slice(0, N).map(x => preguntaCuando(x, FECHAS, rnd)) },
    { id: "porque", nombre: "💡 ¿Por qué?", instr: "¿Qué se <b>recuerda</b>?",
      preguntas: (rnd = Math.random) => barajar(FECHAS, rnd).slice(0, N).map(x => preguntaPorque(x, rnd)) },
  ],
};

// ---------- Revisar (para las pruebas con node) ----------
export function revisarPregunta(p) {
  const e = [];
  const ids = p.opciones.map(o => o.id), htmls = p.opciones.map(o => o.html);
  if (new Set(ids).size !== ids.length || new Set(htmls).size !== htmls.length) e.push(`opciones repetidas: ${p.voz}`);
  if (ids.filter(id => id === p.correcta).length !== 1) e.push(`la correcta no está: ${p.voz}`);
  if (/undefined|NaN/.test(p.html + p.voz + p.explica)) e.push(`texto roto: ${p.voz}`);
  return e;
}
export function revisarEfemerides(n = 500, rnd = Math.random) {
  const e = new Set();
  const opc = [2, 2, 3, 3, 3, 3, 3, 3, 3];
  // Fechas y meses bien escritos, sin fechas repetidas (para «¿Cuál va primero?»)
  FECHAS.forEach(x => { if (!MESES.includes(mes(x)) || !(Number(x.f.split(" de ")[0]) >= 1)) e.add(`fecha mal escrita: ${x.f}`); });
  if (new Set(FECHAS.map(orden)).size !== FECHAS.length) e.add("hay dos fechas el mismo día");
  if (CON_ANIO.some(x => !x.porque.includes(String(x.año)))) e.add("el año no coincide con la explicación");
  ESCALONES.forEach((esc, i) => {
    for (let k = 0; k < n; k++) {
      const p = esc.gen(rnd);
      revisarPregunta(p).forEach(x => e.add(`escalón ${i + 1}: ${x}`));
      if (p.opciones.length !== opc[i]) e.add(`escalón ${i + 1}: ${p.opciones.length} opciones`);
      if (i < 2 && !PRINCIPALES.some(x => x.id === p.correcta)) e.add(`escalón ${i + 1}: no es de las principales`);
    }
  });
  // «¿Cuál va primero?»: la correcta es la de menor fecha
  for (let k = 0; k < n; k++) {
    const p = preguntaPrimero(rnd), xs = p.opciones.map(o => FECHAS.find(y => y.id === o.id));
    if (Math.min(...xs.map(orden)) !== orden(FECHAS.find(y => y.id === p.correcta))) e.add(`no es la primera: ${p.voz}`);
  }
  return [...e];
}
