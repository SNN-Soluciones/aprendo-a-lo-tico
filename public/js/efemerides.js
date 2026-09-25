// 📅 Contenido de «Efemérides» (usa el motor js/quiz.js). Fechas patrias y celebraciones de Costa Rica.
import { barajar } from "./quiz.js";

// f: fecha · e: dibujo · n: qué se celebra · porque: explicación corta
export const FECHAS = [
  { id: "independencia", f: "15 de setiembre", e: "🇨🇷", n: "Día de la Independencia", porque: "En 1821 Costa Rica y Centroamérica se independizaron de España." },
  { id: "faroles", f: "14 de setiembre", e: "🏮", n: "Llegada de la antorcha y desfile de faroles", porque: "La víspera de la Independencia llega la antorcha a Cartago y en la noche salen los faroles." },
  { id: "anexion", f: "25 de julio", e: "🤠", n: "Anexión del Partido de Nicoya", porque: "En 1824 Nicoya decidió unirse a Costa Rica. Hoy es la provincia de Guanacaste." },
  { id: "juan", f: "11 de abril", e: "🔥", n: "Día de Juan Santamaría", porque: "Se recuerda la Batalla de Rivas de 1856 y al héroe Juan Santamaría." },
  { id: "santarosa", f: "20 de marzo", e: "⚔️", n: "Batalla de Santa Rosa", porque: "En 1856 Costa Rica defendió su territorio en la hacienda Santa Rosa, en Guanacaste." },
  { id: "ejercito", f: "1 de diciembre", e: "🕊️", n: "Abolición del ejército", porque: "En 1948 Costa Rica eliminó su ejército y decidió invertir en educación y salud." },
  { id: "culturas", f: "12 de octubre", e: "🌎", n: "Día de las Culturas", porque: "Se celebra la mezcla de culturas indígenas, europeas, africanas y asiáticas que formaron el país." },
  { id: "afro", f: "31 de agosto", e: "✊🏾", n: "Día de la Persona Negra y la Cultura Afrocostarricense", porque: "Se celebra el aporte de las personas afrodescendientes a Costa Rica." },
  { id: "madre", f: "15 de agosto", e: "💐", n: "Día de la Madre", porque: "Se celebra a las mamás y a las personas que nos cuidan como mamás." },
  { id: "nino", f: "9 de setiembre", e: "🧒", n: "Día del Niño y la Niña", porque: "Se celebran los derechos de los niños y las niñas." },
  { id: "trabajador", f: "1 de mayo", e: "🛠️", n: "Día de las Personas Trabajadoras", porque: "Se reconoce el esfuerzo de todas las personas que trabajan." },
  { id: "democracia", f: "7 de noviembre", e: "🗳️", n: "Día de la Democracia Costarricense", porque: "En 1889 el pueblo defendió su voto: es un símbolo de la democracia del país." },
  { id: "tierra", f: "22 de abril", e: "🌍", n: "Día de la Tierra", porque: "Se recuerda que hay que cuidar el planeta." },
  { id: "ambiente", f: "5 de junio", e: "🌳", n: "Día del Medio Ambiente", porque: "Se promueve cuidar la naturaleza: los bosques, el agua y los animales." },
  { id: "virgen", f: "2 de agosto", e: "⛪", n: "Día de la Virgen de los Ángeles", porque: "Mucha gente camina en romería hasta la Basílica de los Ángeles, en Cartago." },
];

// Hojita de calendario con la fecha de verdad (el emoji 📅 trae otra fecha dibujada)
const cal = (f, chico = false) => { const [dia, mes] = f.split(" de "); return `<span class="calendario${chico ? " chico" : ""}"><small>${mes}</small><b>${dia}</b></span>`; };

const N = 8;
const tres = (x, rnd) => barajar([x, ...barajar(FECHAS.filter(y => y !== x), rnd).slice(0, 2)], rnd);

export const JUEGO = {
  clave: "efemerides",
  textos: { fin3: "¡Excelente! Conocés muy bien las fechas de Costa Rica." },
  modos: [
    { id: "que", nombre: "🎉 ¿Qué se celebra?", instr: "¿Qué se <b>celebra</b> ese día?",
      preguntas: (rnd = Math.random) => barajar(FECHAS, rnd).slice(0, N).map(x => ({
        html: `${cal(x.f)}${x.f}`, voz: `¿Qué se celebra el ${x.f}?`, cols: 1,
        opciones: tres(x, rnd).map(y => ({ id: y.id, html: `${y.e} ${y.n}` })), correcta: x.id,
        explica: `${x.e} <b>${x.f}</b>: ${x.n}. ${x.porque}`,
      })) },
    { id: "cuando", nombre: "🗓️ ¿Qué día es?", instr: "¿Qué <b>día</b> se celebra?",
      preguntas: (rnd = Math.random) => barajar(FECHAS, rnd).slice(0, N).map(x => ({
        html: `<span class="grande">${x.e}</span>${x.n}`, voz: `${x.n}: ¿qué día se celebra?`,
        opciones: tres(x, rnd).map(y => ({ id: y.id, html: `${cal(y.f, true)}${y.f}` })), correcta: x.id,
        explica: `${x.e} ${x.n}: <b>${x.f}</b>. ${x.porque}`,
      })) },
    { id: "porque", nombre: "💡 ¿Por qué?", instr: "¿Qué se <b>recuerda</b>?",
      preguntas: (rnd = Math.random) => barajar(FECHAS, rnd).slice(0, N).map(x => ({
        html: `<span class="grande">${x.e}</span>«${x.porque}»`, voz: `¿Qué fecha es? ${x.porque}`, cols: 1,
        opciones: tres(x, rnd).map(y => ({ id: y.id, html: `${y.e} ${y.n} <small>${y.f}</small>` })), correcta: x.id,
        explica: `${x.e} <b>${x.n}</b>: ${x.f}.`,
      })) },
  ],
};
