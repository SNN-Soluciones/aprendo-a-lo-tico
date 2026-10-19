// 🌦️ Lógica de «My day in English» (sin pantalla, para poder probarla sola con node).
// Days, months, the weather, what to wear, telling the time and daily routines.
//
// Una pregunta:
//   { tipo: "opciones" | "ordenar" | "escribir", instr, html, voz, explica, explicaVoz, ... }
//   voz y explicaVoz son listas de partes [texto, "es" | "en"]: se dicen una tras otra con la voz de cada idioma.
//   opciones: [{ id, html, voz, porque? }] · correcta: id · cols
//   ordenar:  items [{ id, html, rango }] · orden: ids en orden · arriba / abajo: lo que dice cada punta
//   escribir: respuesta (texto que se muestra si falla) · clase: "palabra" | "hora" · pista
// Siempre hay UNA sola respuesta correcta (revisarPregunta lo comprueba).

const es = t => [t, "es"];
const en = t => [t, "en"];

// ---------- Datos ----------
export const DIAS = [
  { en: "Monday", es: "lunes" }, { en: "Tuesday", es: "martes" }, { en: "Wednesday", es: "miércoles" },
  { en: "Thursday", es: "jueves" }, { en: "Friday", es: "viernes" }, { en: "Saturday", es: "sábado" }, { en: "Sunday", es: "domingo" },
];
export const MESES = [
  { en: "January", es: "enero" }, { en: "February", es: "febrero" }, { en: "March", es: "marzo" }, { en: "April", es: "abril" },
  { en: "May", es: "mayo" }, { en: "June", es: "junio" }, { en: "July", es: "julio" }, { en: "August", es: "agosto" },
  { en: "September", es: "setiembre" }, { en: "October", es: "octubre" }, { en: "November", es: "noviembre" }, { en: "December", es: "diciembre" },
];
// En el Valle Central: la época seca va de diciembre a abril y la lluviosa de mayo a noviembre (setiembre y octubre llueve más).
// Solo se preguntan meses sin duda: secos enero a marzo; lluviosos junio, setiembre, octubre y noviembre.
export const SECOS = [0, 1, 2];
export const LLUVIOSOS = [5, 8, 9, 10];

// es: cómo se dice en español (como parte de una oración)
export const CLIMA = [
  { id: "sunny", e: "☀️", en: "sunny", es: "está soleado" },
  { id: "rainy", e: "🌧️", en: "rainy", es: "está lloviendo" },
  { id: "cloudy", e: "☁️", en: "cloudy", es: "está nublado" },
  { id: "windy", e: "🌬️", en: "windy", es: "hace viento" },
  { id: "stormy", e: "⛈️", en: "stormy", es: "hay tormenta" },
  { id: "hot", e: "🥵", en: "hot", es: "hace calor" },
  { id: "cold", e: "🥶", en: "cold", es: "hace frío" },
];
// Dibujos que se parecen: no van juntos en los primeros escalones
const PARECIDOS = [["rainy", "stormy"], ["cloudy", "rainy"], ["cloudy", "stormy"], ["sunny", "hot"], ["windy", "cold"]];
// Combinaciones que pueden pasar el mismo día (para «It's … and …»)
const JUNTOS = [["sunny", "hot"], ["rainy", "cold"], ["cloudy", "cold"], ["windy", "cold"], ["cloudy", "windy"], ["rainy", "windy"], ["sunny", "windy"]];

// para: con qué clima se usa · tal: con qué clima podría servir también (no sale como opción mala ahí:
// en Costa Rica la sombrilla también se usa para el sol). En «What do you need?» solo puede servir una opción.
export const ROPA = [
  { id: "umbrella", e: "☂️", en: "an umbrella", palabra: "umbrella", es: "una sombrilla", para: ["rainy", "stormy"], tal: ["sunny", "hot"] },
  { id: "boots", e: "👢", en: "boots", palabra: "boots", es: "botas", para: ["rainy", "stormy", "cold"] },
  { id: "jacket", e: "🧥", en: "a jacket", palabra: "jacket", es: "un abrigo", para: ["rainy", "cold", "windy"] },
  { id: "scarf", e: "🧣", en: "a scarf", palabra: "scarf", es: "una bufanda", para: ["cold", "windy"], tal: ["rainy"] },
  { id: "gloves", e: "🧤", en: "gloves", palabra: "gloves", es: "guantes", para: ["cold"], tal: ["rainy", "windy"] },
  { id: "shorts", e: "🩳", en: "shorts", palabra: "shorts", es: "una pantaloneta", para: ["sunny", "hot"] },
  { id: "tshirt", e: "👕", en: "a T-shirt", palabra: "T-shirt", es: "una camiseta", para: ["sunny", "hot"] },
  { id: "cap", e: "🧢", en: "a cap", palabra: "cap", es: "una gorra", para: ["sunny", "hot"] },
  { id: "sunglasses", e: "🕶️", en: "sunglasses", palabra: "sunglasses", es: "anteojos de sol", para: ["sunny", "hot"] },
  { id: "sandals", e: "🩴", en: "sandals", palabra: "sandals", es: "chancletas", para: ["sunny", "hot"] },
];
// Climas por los que se pregunta «What do you need?» (los demás no dejan una sola respuesta clara)
const CLIMA_ROPA = ["rainy", "cold", "sunny", "hot"];
const ES_CLIMA_CUANDO = { rainy: "cuando llueve", cold: "cuando hace frío", sunny: "cuando hace sol", hot: "cuando hace calor" };

// momento: orden en el día, solo para lo que va igual en todas las casas (null = depende: hay escuelas de tarde
// y comedores escolares con desayuno, así que «go to school» y «do my homework» no se ordenan)
// horas: a qué horas puede ser, para los horarios (en minutos desde la medianoche, de media en media hora)
export const RUTINAS = [
  { id: "wake", e: "⏰", en: "wake up", yo: "I wake up", es: "me despierto", momento: 1, horas: [330, 360, 390] },
  { id: "teeth", e: "🪥", en: "brush my teeth", yo: "I brush my teeth", es: "me lavo los dientes", momento: null },
  { id: "shower", e: "🚿", en: "take a shower", yo: "I take a shower", es: "me baño", momento: null },
  { id: "dressed", e: "👔", en: "get dressed", yo: "I get dressed", es: "me visto", momento: null },
  { id: "breakfast", e: "🥣", en: "eat breakfast", yo: "I eat breakfast", es: "desayuno", momento: 2, horas: [360, 390, 420] },
  { id: "school", e: "🏫", en: "go to school", yo: "I go to school", es: "voy a la escuela", momento: null, horas: [390, 420, 450] },
  { id: "lunch", e: "🍽️", en: "have lunch", yo: "I have lunch", es: "almuerzo", momento: 3, horas: [690, 720, 750, 780] },
  { id: "homework", e: "📝", en: "do my homework", yo: "I do my homework", es: "hago la tarea", momento: null, horas: [840, 870, 900, 930] },
  { id: "play", e: "⚽", en: "play with my friends", yo: "I play with my friends", es: "juego con mis amigos", momento: null },
  { id: "dinner", e: "🍲", en: "eat dinner", yo: "I eat dinner", es: "ceno", momento: 4, horas: [1080, 1110, 1140] },
  { id: "bed", e: "🛏️", en: "go to bed", yo: "I go to bed", es: "me acuesto", momento: 5, horas: [1200, 1230, 1260] },
];

// ---------- Ayudas ----------
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const entre = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
function barajar(arr, rnd) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const may = t => t.charAt(0).toUpperCase() + t.slice(1);
const clima = id => CLIMA.find(c => c.id === id);
const parecidos = (a, b) => PARECIDOS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
/** La correcta y otras n-1 al azar, sin repetir. */
const conOtras = (correcta, otras, n, rnd) => barajar([correcta, ...barajar(otras.filter(x => x !== correcta), rnd).slice(0, n - 1)], rnd);

// ---------- La hora ----------
const NUM_EN = ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const MIN_EN = { 5: "five", 10: "ten", 20: "twenty", 25: "twenty-five" };
const HORA_ES = ["doce", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce"];
const MIN_ES = { 5: "cinco", 10: "diez", 20: "veinte", 25: "veinticinco" };
const sig = h => h % 12 + 1;

/** «half past three», «quarter to four», «ten past three»… (h de 1 a 12; m de 5 en 5) */
export function horaEn(h, m) {
  if (m === 0) return `${NUM_EN[h]} o'clock`;
  if (m === 15) return `quarter past ${NUM_EN[h]}`;
  if (m === 30) return `half past ${NUM_EN[h]}`;
  if (m === 45) return `quarter to ${NUM_EN[sig(h)]}`;
  return m < 30 ? `${MIN_EN[m]} past ${NUM_EN[h]}` : `${MIN_EN[60 - m]} to ${NUM_EN[sig(h)]}`;
}
/** Cómo se dice a lo tico: «las tres y media», «un cuarto para las cuatro», «veinte para las cuatro». */
export function horaEs(h, m) {
  const las = x => `${x === 1 ? "la" : "las"} ${HORA_ES[x]}`;
  if (m === 0) return las(h);
  if (m === 15) return `${las(h)} y cuarto`;
  if (m === 30) return `${las(h)} y media`;
  if (m === 45) return `un cuarto para ${las(sig(h))}`;
  return m < 30 ? `${las(h)} y ${MIN_ES[m]}` : `${MIN_ES[60 - m]} para ${las(sig(h))}`;
}
export const digital = (h, m) => `${h}:${String(m).padStart(2, "0")}`;

/** Reloj de agujas (SVG): la corta (roja) es la hora y la larga (azul) los minutos, como en reloj.html. */
export function reloj(h, m, tam = 150) {
  const c = 50, ang = g => (g - 90) * Math.PI / 180;
  const x = (g, r) => (c + r * Math.cos(ang(g))).toFixed(1), y = (g, r) => (c + r * Math.sin(ang(g))).toFixed(1);
  const nums = Array.from({ length: 12 }, (_, i) =>
    `<text x="${x((i + 1) * 30, 37)}" y="${y((i + 1) * 30, 37)}" dy="3.6" text-anchor="middle" font-size="10" font-weight="800" fill="#1F3A5F">${i + 1}</text>`).join("");
  const rayas = Array.from({ length: 60 }, (_, i) => { const g = i * 6, r2 = i % 5 ? 44 : 42;
    return `<line x1="${x(g, 46)}" y1="${y(g, 46)}" x2="${x(g, r2)}" y2="${y(g, r2)}" stroke="#1F3A5F" stroke-width="${i % 5 ? 0.6 : 1.4}"/>`; }).join("");
  const gH = (h % 12) * 30 + m / 2, gM = m * 6;
  return `<svg class="reloj" viewBox="0 0 100 100" width="${tam}" height="${tam}" role="img" aria-label="Un reloj">
    <circle cx="50" cy="50" r="48" fill="#fff" stroke="#1F3A5F" stroke-width="3"/>${rayas}${nums}
    <line x1="50" y1="50" x2="${x(gH, 24)}" y2="${y(gH, 24)}" stroke="#D9443A" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="${x(gM, 36)}" y2="${y(gM, 36)}" stroke="#1E6FD9" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="50" r="3" fill="#1F3A5F"/></svg>`;
}

/** Horas que se confunden con h:m (para las opciones malas). */
function horasParecidas(h, m, minutos) {
  const cand = [];
  for (const mm of minutos) if (mm !== m) cand.push([h, mm]);
  cand.push([sig(h), m]);
  cand.push([h === 1 ? 12 : h - 1, m]);
  if (m === 45) cand.push([sig(h), 15], [h, 15]);       // «quarter to four» no es 4:15 ni 3:15
  if (m === 15) cand.push([h, 45], [h === 1 ? 12 : h - 1, 45]);
  if (m > 30) cand.push([sig(h), 60 - m]);               // «twenty to four» no es 4:20
  if (m > 0 && m < 30) cand.push([h, 60 - m]);           // «ten past three» no es 3:50
  return cand.filter(([hh, mm]) => !(hh === h && mm === m));
}

// ---------- Generadores ----------
/** 👂 Escuchá el clima y tocá el dibujo. */
function escucharClima(n, rnd) {
  const x = azar(CLIMA, rnd);
  const otras = CLIMA.filter(c => c !== x && (n > 2 || !parecidos(c.id, x.id)));
  const ops = conOtras(x, otras, n, rnd);
  return {
    tipo: "opciones", tema: "clima", cols: n === 4 ? 2 : n,
    instr: "👂 Listen and tap!", html: `<span class="grande" aria-hidden="true">👂</span><small>Escuchá y tocá el dibujo</small>`,
    voz: [es("Escuchá y tocá:"), en(`It's ${x.en}.`)],
    opciones: ops.map(c => ({ id: c.id, html: `<b class="emo">${c.e}</b>`, voz: [en(`It's ${c.en}.`)],
      porque: { txt: `${c.e} It's ${c.en} = ${may(c.es)}.`, voz: [es("Ese es"), en(c.en), es(`: ${c.es}.`)] } })),
    correcta: x.id,
    explica: `${x.e} <b>It's ${x.en}.</b> = ${may(x.es)}.`, explicaVoz: [en(`It's ${x.en}.`), es(`${may(x.es)}.`)],
  };
}

/** 👂 Escuchá qué ropa y tocá el dibujo. */
function escucharRopa(n, rnd) {
  const x = azar(ROPA, rnd);
  const ops = conOtras(x, ROPA, n, rnd);
  return {
    tipo: "opciones", tema: "ropa", cols: n === 4 ? 2 : n,
    instr: "👂 Listen and tap!", html: `<span class="grande" aria-hidden="true">👂</span><small>Escuchá y tocá el dibujo</small>`,
    voz: [es("Escuchá y tocá:"), en(x.en)],
    opciones: ops.map(r => ({ id: r.id, html: `<b class="emo">${r.e}</b>`, voz: [en(r.en)],
      porque: { txt: `${r.e} ${may(r.en)} = ${r.es}.`, voz: [es("Ese es"), en(r.en), es(`: ${r.es}.`)] } })),
    correcta: x.id,
    explica: `${x.e} <b>${may(x.en)}</b> = ${x.es}.`, explicaVoz: [en(x.en), es(`${may(x.es)}.`)],
  };
}

/** 👂 Escuchá el día en inglés y tocá cómo se dice en español. */
function escucharDia(n, rnd) {
  const i = entre(0, 6, rnd);
  const ops = conOtras(i, [0, 1, 2, 3, 4, 5, 6], n, rnd);
  return {
    tipo: "opciones", tema: "dias", cols: 1,
    instr: "👂 ¿Qué día es?", html: `<span class="grande" aria-hidden="true">📅</span><small>Escuchá el día en inglés y tocá cómo se dice en español</small>`,
    voz: [es("Escuchá:"), en(DIAS[i].en), es("¿Qué día es?")],
    opciones: ops.map(k => ({ id: String(k), html: `<b>${may(DIAS[k].es)}</b>`, voz: [es(DIAS[k].es)],
      porque: { txt: `${may(DIAS[k].es)} es ${DIAS[k].en}.`, voz: [es(`${may(DIAS[k].es)} es`), en(DIAS[k].en)] } })),
    correcta: String(i),
    explica: `<b>${DIAS[i].en}</b> = ${DIAS[i].es}.`, explicaVoz: [en(DIAS[i].en), es(`es ${DIAS[i].es}.`)],
  };
}

/** 👂 Escuchá la rutina y tocá el dibujo. */
function escucharRutina(n, rnd) {
  const x = azar(RUTINAS, rnd);
  const ops = conOtras(x, RUTINAS, n, rnd);
  return {
    tipo: "opciones", tema: "rutina", cols: n === 4 ? 2 : n,
    instr: "👂 Listen and tap!", html: `<span class="grande" aria-hidden="true">👂</span><small>Escuchá y tocá el dibujo</small>`,
    voz: [es("Escuchá y tocá:"), en(`${x.yo}.`)],
    opciones: ops.map(r => ({ id: r.id, html: `<b class="emo">${r.e}</b>`, voz: [en(`${r.yo}.`)],
      porque: { txt: `${r.e} ${r.yo} = ${may(r.es)}.`, voz: [es("Ese es"), en(`${r.yo}.`), es(`${may(r.es)}.`)] } })),
    correcta: x.id,
    explica: `${x.e} <b>${x.yo}.</b> = ${may(x.es)}.`, explicaVoz: [en(`${x.yo}.`), es(`${may(x.es)}.`)],
  };
}

/** 📅 «Today is Monday. Tomorrow is…» (o «Yesterday was…»). */
function siguienteDia(n, rnd, ayer = false) {
  const hoy = entre(0, 6, rnd), d = ayer ? -1 : 1, x = (hoy + d + 7) % 7;
  const ops = conOtras(x, [(hoy + 7 - d) % 7, (hoy + 2 * d + 7) % 7, hoy, (hoy + 3) % 7], n, rnd);
  const pregunta = ayer ? "Yesterday was…" : "Tomorrow is…";
  return {
    tipo: "opciones", tema: "dias", cols: 1,
    instr: ayer ? "📅 ¿Qué día fue ayer?" : "📅 ¿Qué día es mañana?",
    html: `<span class="grande" aria-hidden="true">📅</span>Today is <b>${DIAS[hoy].en}</b>.<br>${pregunta}`,
    voz: [en(`Today is ${DIAS[hoy].en}.`), es(ayer ? "¿Qué día fue ayer?" : "¿Qué día es mañana?")],
    opciones: ops.map(k => ({ id: String(k), html: `<b>${DIAS[k].en}</b>`, voz: [en(DIAS[k].en)],
      porque: { txt: `${DIAS[k].en} es ${DIAS[k].es}. ${ayer ? "Ayer" : "Mañana"} es el día ${ayer ? "antes" : "después"} de ${DIAS[hoy].es}.`,
        voz: [en(DIAS[k].en), es(`es ${DIAS[k].es}. ${ayer ? "Ayer" : "Mañana"} es el día ${ayer ? "antes" : "después"} de ${DIAS[hoy].es}.`)] } })),
    correcta: String(x),
    explica: `Today is ${DIAS[hoy].en}, ${ayer ? `yesterday was <b>${DIAS[x].en}</b>` : `tomorrow is <b>${DIAS[x].en}</b>`}. (Hoy es ${DIAS[hoy].es}, ${ayer ? "ayer fue" : "mañana es"} ${DIAS[x].es}.)`,
    explicaVoz: [en(`Today is ${DIAS[hoy].en}. ${ayer ? "Yesterday was" : "Tomorrow is"} ${DIAS[x].en}.`)],
  };
}

/** 👂 Escuchá el mes y tocá cómo se dice en español. */
function escucharMes(n, rnd) {
  const i = entre(0, 11, rnd);
  const ops = conOtras(i, Array.from({ length: 12 }, (_, k) => k), n, rnd);
  return {
    tipo: "opciones", tema: "meses", cols: 2,
    instr: "👂 ¿Qué mes es?", html: `<span class="grande" aria-hidden="true">🗓️</span><small>Escuchá el mes en inglés y tocá cómo se dice en español</small>`,
    voz: [es("Escuchá:"), en(MESES[i].en), es("¿Qué mes es?")],
    opciones: ops.map(k => ({ id: String(k), html: `<b>${may(MESES[k].es)}</b>`, voz: [es(MESES[k].es)],
      porque: { txt: `${may(MESES[k].es)} es ${MESES[k].en}.`, voz: [es(`${may(MESES[k].es)} es`), en(MESES[k].en)] } })),
    correcta: String(i),
    explica: `<b>${MESES[i].en}</b> = ${MESES[i].es}.`, explicaVoz: [en(MESES[i].en), es(`es ${MESES[i].es}.`)],
  };
}

/** 🗓️ «What month comes after March?» */
function siguienteMes(n, rnd) {
  const i = entre(0, 10, rnd), x = i + 1;
  const ops = conOtras(x, [i, (x + 1) % 12, i > 0 ? i - 1 : 11, (x + 2) % 12], n, rnd);
  return {
    tipo: "opciones", tema: "meses", cols: 1,
    instr: "🗓️ ¿Qué mes sigue?", html: `<span class="grande" aria-hidden="true">🗓️</span>What month comes after <b>${MESES[i].en}</b>?`,
    voz: [en(`What month comes after ${MESES[i].en}?`), es("¿Qué mes viene después?")],
    opciones: ops.map(k => ({ id: String(k), html: `<b>${MESES[k].en}</b>`, voz: [en(MESES[k].en)],
      porque: { txt: `${MESES[k].en} es ${MESES[k].es}. Después de ${MESES[i].es} viene ${MESES[x].es}.`,
        voz: [en(MESES[k].en), es(`es ${MESES[k].es}. Después de ${MESES[i].es} viene ${MESES[x].es}.`)] } })),
    correcta: String(x),
    explica: `After ${MESES[i].en} comes <b>${MESES[x].en}</b>. (Después de ${MESES[i].es} viene ${MESES[x].es}.)`,
    explicaVoz: [en(`After ${MESES[i].en} comes ${MESES[x].en}.`)],
  };
}

/** 🇨🇷 ¿En qué mes llueve mucho (o casi no llueve) en el Valle Central? */
function epocaLluviosa(rnd) {
  const lluvia = rnd() < 0.5;
  const x = azar(lluvia ? LLUVIOSOS : SECOS, rnd);
  const ops = conOtras(x, lluvia ? SECOS : LLUVIOSOS, 3, rnd);
  const dato = "En el Valle Central, la época seca va de diciembre a abril y la lluviosa de mayo a noviembre; en setiembre y octubre es cuando más llueve.";
  return {
    tipo: "opciones", tema: "clima", cols: 1,
    instr: "🇨🇷 ¿Cuándo llueve?",
    html: `<span class="grande" aria-hidden="true">${lluvia ? "🌧️" : "☀️"}</span>${lluvia ? "It's rainy in…" : "It's sunny and dry in…"}<small>En el Valle Central de Costa Rica</small>`,
    voz: [es(lluvia ? "En el Valle Central de Costa Rica, ¿en qué mes llueve mucho?" : "En el Valle Central de Costa Rica, ¿en qué mes hace sol y casi no llueve?")],
    opciones: ops.map(k => ({ id: String(k), html: `<b>${MESES[k].en}</b>`, voz: [en(MESES[k].en)],
      porque: { txt: `${MESES[k].en} (${MESES[k].es}) es de la época ${SECOS.includes(k) ? "seca" : "lluviosa"}. ${dato}`,
        voz: [en(MESES[k].en), es(`es ${MESES[k].es}, de la época ${SECOS.includes(k) ? "seca" : "lluviosa"}.`)] } })),
    correcta: String(x),
    explica: `${lluvia ? "🌧️ It's rainy" : "☀️ It's sunny and dry"} in <b>${MESES[x].en}</b>. ${dato}`,
    explicaVoz: [en(`${lluvia ? "It's rainy" : "It's sunny and dry"} in ${MESES[x].en}.`), es(dato)],
  };
}

/** 🧥 «It's cold. What do you need?» */
function queNecesito(n, rnd) {
  const c = clima(azar(CLIMA_ROPA, rnd));
  const sirve = ROPA.filter(r => r.para.includes(c.id)), noSirve = ROPA.filter(r => !r.para.includes(c.id) && !(r.tal || []).includes(c.id));
  const x = azar(sirve, rnd);
  const ops = conOtras(x, noSirve, n, rnd);
  return {
    tipo: "opciones", tema: "ropa", cols: Math.min(n, 2),
    instr: "🧥 What do you need?", html: `<span class="grande" aria-hidden="true">${c.e}</span>It's <b>${c.en}</b>. What do you need?`,
    voz: [en(`It's ${c.en}. What do you need?`), es(`¿Qué necesitás ${ES_CLIMA_CUANDO[c.id]}?`)],
    opciones: ops.map(r => ({ id: r.id, html: `<b class="emo">${r.e}</b><small>${r.en}</small>`, voz: [en(r.en)],
      porque: { txt: `${r.e} ${may(r.en)} (${r.es}) no es para cuando it's ${c.en}.`, voz: [en(may(r.en)), es(`, ${r.es}, no es para ${ES_CLIMA_CUANDO[c.id]}.`)] } })),
    correcta: x.id,
    explica: `${c.e} It's ${c.en}: I need <b>${x.en}</b> ${x.e} (${x.es}).`,
    explicaVoz: [en(`It's ${c.en}. I need ${x.en}.`)],
  };
}

const MINUTOS = { enPunto: [0, 30], cuartos: [0, 15, 30, 45], cinco: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] };

/** ⏰ Se ve el reloj: ¿qué hora es? (opciones en inglés) */
function horaReloj(minutos, n, rnd) {
  const h = entre(1, 12, rnd), m = azar(minutos, rnd);
  const malas = barajar(horasParecidas(h, m, minutos), rnd);
  const vistas = new Set([horaEn(h, m)]), ops = [{ h, m }];
  for (const [hh, mm] of malas) { const t = horaEn(hh, mm); if (ops.length < n && !vistas.has(t)) { vistas.add(t); ops.push({ h: hh, m: mm }); } }
  const lista = barajar(ops, rnd);
  return {
    tipo: "opciones", tema: "hora", cols: 1, hora: { h, m },
    instr: "⏰ What time is it?", html: reloj(h, m),
    voz: [en("What time is it?"), es("¿Qué hora es?")],
    opciones: lista.map(o => ({ id: digital(o.h, o.m), html: `<b>It's ${horaEn(o.h, o.m)}.</b>`, voz: [en(`It's ${horaEn(o.h, o.m)}.`)],
      porque: { txt: `It's ${horaEn(o.h, o.m)} = ${horaEs(o.h, o.m)} (${digital(o.h, o.m)}). Fijate: la aguja corta (roja) es la hora y la larga (azul), los minutos.`,
        voz: [en(`It's ${horaEn(o.h, o.m)}`), es(`es decir, ${horaEs(o.h, o.m)}. Fijate en la aguja corta, la roja, que es la hora, y en la larga, la azul, que son los minutos.`)] } })),
    correcta: digital(h, m),
    explica: `${digital(h, m)}: <b>It's ${horaEn(h, m)}.</b> = ${may(horaEs(h, m))}.`,
    explicaVoz: [en(`It's ${horaEn(h, m)}.`), es(`${may(horaEs(h, m))}.`)],
  };
}

/** 👂 Se oye la hora en inglés: ¿cuál reloj digital es? */
function horaOida(minutos, n, rnd) {
  const q = horaReloj(minutos, n, rnd), { h, m } = q.hora;
  return {
    ...q,
    instr: "👂 ¿Qué hora dice?", html: `<span class="grande" aria-hidden="true">👂</span><small>Escuchá la hora en inglés y tocá el reloj</small>`,
    voz: [es("Escuchá:"), en(`It's ${horaEn(h, m)}.`), es("¿Qué hora es?")],
    cols: 2,
    opciones: q.opciones.map(o => ({ ...o, html: `<b class="dig">${o.id}</b>` })),
  };
}

/** 📖 Leé la oración en inglés y escogé qué quiere decir. */
function leerFrase(rnd) {
  if (rnd() < 0.5) {
    const [a, b] = azar(JUNTOS, rnd).map(clima);
    const otra = () => azar(CLIMA.filter(x => x !== a && x !== b), rnd);
    const frase = `It's ${a.en} and ${b.en}.`;
    const bien = `${may(a.es)} y ${b.es}.`;
    // Malas: cambiar uno de los dos climas (sin repetir la oración buena)
    const malas = new Set();
    for (let k = 0; k < 20 && malas.size < 2; k++) {
      const [x, y] = rnd() < 0.5 ? [otra(), b] : [a, otra()];
      if (x.id !== y.id) malas.add(`${may(x.es)} y ${y.es}.`);
    }
    malas.delete(bien);
    const ops = barajar([bien, ...malas].slice(0, 3), rnd);
    return {
      tipo: "opciones", tema: "clima", cols: 1,
      instr: "📖 ¿Qué quiere decir?", html: `<span class="grande" aria-hidden="true">${a.e}${b.e}</span><b>${frase}</b>`,
      voz: [en(frase), es("¿Qué quiere decir?")],
      opciones: ops.map((t, k) => ({ id: t === bien ? "bien" : `mal${k}`, html: t, voz: [es(t)],
        porque: { txt: `Fijate en las dos palabras: ${a.en} = ${a.es} y ${b.en} = ${b.es}.`, voz: [es("Fijate en las dos palabras:"), en(a.en), es(`es ${a.es}, y`), en(b.en), es(`es ${b.es}.`)] } })),
      correcta: "bien",
      explica: `<b>${frase}</b> = ${bien}`, explicaVoz: [en(frase), es(bien)],
    };
  }
  // «I wake up at six o'clock.»
  const r = azar(RUTINAS.filter(x => x.horas), rnd), t = azar(r.horas, rnd);
  const h = (Math.floor(t / 60) + 11) % 12 + 1, m = t % 60;
  const frase = `${r.yo} at ${horaEn(h, m)}.`, bien = `${may(r.es)} a ${horaEs(h, m)}.`;
  const otraR = azar(RUTINAS.filter(x => x !== r), rnd);
  const h2 = sig(h), m2 = m === 0 ? 30 : 0;
  const malas = [`${may(otraR.es)} a ${horaEs(h, m)}.`, `${may(r.es)} a ${horaEs(h2, m)}.`, `${may(r.es)} a ${horaEs(h, m2)}.`];
  const ops = barajar([bien, ...barajar(malas, rnd).slice(0, 2)], rnd);
  return {
    tipo: "opciones", tema: "rutina", cols: 1,
    instr: "📖 ¿Qué quiere decir?", html: `<span class="grande" aria-hidden="true">${r.e}</span><b>${frase}</b>`,
    voz: [en(frase), es("¿Qué quiere decir?")],
    opciones: ops.map((x, k) => ({ id: x === bien ? "bien" : `mal${k}`, html: x, voz: [es(x)],
      porque: { txt: `${r.yo} = ${r.es}, y ${horaEn(h, m)} = ${horaEs(h, m)}.`, voz: [en(r.yo), es(`es ${r.es}, y`), en(horaEn(h, m)), es(`es ${horaEs(h, m)}.`)] } })),
    correcta: "bien",
    explica: `<b>${frase}</b> = ${bien}`, explicaVoz: [en(frase), es(bien)],
  };
}

/** 🏫 «What time do you go to school?» con un horario. */
function horario(rnd) {
  const r = azar(RUTINAS.filter(x => x.horas), rnd), t = azar(r.horas, rnd);
  const aHora = x => { const h = (Math.floor(x / 60) + 11) % 12 + 1; return { h, m: x % 60 }; };
  const { h, m } = aHora(t);
  const otras = [t - 60, t + 60, t + 30, t - 30].filter(x => x > 0 && x < 1440).map(aHora).filter(o => horaEn(o.h, o.m) !== horaEn(h, m));
  const ops = barajar([{ h, m }, ...barajar(otras, rnd).slice(0, 2)], rnd);
  const pregunta = `What time do you ${r.en}?`;
  return {
    tipo: "opciones", tema: "rutina", cols: 1,
    instr: "🏫 What time…?",
    html: `<span class="horario"><span aria-hidden="true">${r.e}</span> ${r.en} <b>${digital(h, m)}</b></span><b>${pregunta}</b>`,
    voz: [en(pregunta), es("Mirá el horario.")],
    opciones: ops.map(o => ({ id: digital(o.h, o.m), html: `I ${r.en} at ${horaEn(o.h, o.m)}.`, voz: [en(`I ${r.en} at ${horaEn(o.h, o.m)}.`)],
      porque: { txt: `En el horario dice ${digital(h, m)}: eso es ${horaEn(h, m)}, no ${horaEn(o.h, o.m)} (${digital(o.h, o.m)}).`,
        voz: [es(`En el horario dice ${horaEs(h, m)}, y eso es`), en(horaEn(h, m))] } })),
    correcta: digital(h, m),
    explica: `${r.e} <b>I ${r.en} at ${horaEn(h, m)}.</b> = ${may(r.es)} a ${horaEs(h, m)}.`,
    explicaVoz: [en(`I ${r.en} at ${horaEn(h, m)}.`), es(`${may(r.es)} a ${horaEs(h, m)}.`)],
  };
}

/** 🔢 Ordenar días, meses o la rutina del día. */
function ordenar(que, n, rnd) {
  if (que === "rutina") {
    const elegidas = barajar(RUTINAS.filter(r => r.momento), rnd).slice(0, n).sort((a, b) => a.momento - b.momento);
    return {
      tipo: "ordenar", tema: "rutina", arriba: "🌅 In the morning", abajo: "🌙 At night",
      instr: "🔢 Ordená tu día", html: `<b>My day</b><small>Tocá de lo primero que hacés en el día a lo último</small>`,
      voz: [es("Ordená tu día: tocá de lo primero que hacés a lo último.")],
      items: barajar(elegidas, rnd).map(r => ({ id: r.id, html: `<span class="e" aria-hidden="true">${r.e}</span>${r.yo}`, voz: [en(`${r.yo}.`)], rango: r.momento })),
      orden: elegidas.map(r => r.id),
      explica: elegidas.map(r => `${r.e} ${r.yo}`).join(" → "),
      explicaVoz: [en(elegidas.map(r => `${r.yo}.`).join(" "))],
    };
  }
  const lista = que === "dias" ? DIAS : MESES;
  const desde = entre(0, lista.length - n, rnd);
  const elegidos = lista.slice(desde, desde + n).map((x, k) => ({ ...x, i: desde + k }));
  return {
    tipo: "ordenar", tema: que, arriba: "⬆️ First", abajo: "⬇️ Last",
    instr: que === "dias" ? "🔢 Ordená los días" : "🔢 Ordená los meses",
    html: `<b>${que === "dias" ? "Days of the week" : "Months of the year"}</b><small>Tocá en orden, del primero al último</small>`,
    voz: [es(que === "dias" ? "Ordená los días de la semana, del primero al último." : "Ordená los meses, del primero al último.")],
    items: barajar(elegidos, rnd).map(x => ({ id: String(x.i), html: `<b>${x.en}</b>`, voz: [en(x.en)], rango: x.i })),
    orden: elegidos.map(x => String(x.i)),
    explica: elegidos.map(x => `${x.en} (${x.es})`).join(" → "),
    explicaVoz: [en(elegidos.map(x => x.en).join(", "))],
  };
}

/** ✍️ Escribir una palabra corta en inglés. */
function escribirPalabra(rnd) {
  const tipo = azar(["clima", "dia", "mes", "ropa"], rnd);
  if (tipo === "clima") {
    const c = azar(CLIMA, rnd);
    return {
      tipo: "escribir", clase: "palabra", tema: "clima", respuesta: c.en,
      instr: "✍️ Write the word", html: `<span class="grande" aria-hidden="true">${c.e}</span>It's <span class="hueco">?</span>.<small>${may(c.es)}</small>`,
      voz: [es(`Escribí en inglés: ${c.es}.`), en("It's...")],
      explica: `${c.e} <b>It's ${c.en}.</b>`, explicaVoz: [en(`It's ${c.en}.`)],
    };
  }
  if (tipo === "ropa") {
    const r = azar(ROPA.filter(x => !/[- ]/.test(x.palabra)), rnd);
    return {
      tipo: "escribir", clase: "palabra", tema: "ropa", respuesta: r.palabra,
      instr: "✍️ Write the word", html: `<span class="grande" aria-hidden="true">${r.e}</span><span class="hueco">?</span><small>${may(r.es)}</small>`,
      voz: [es(`Escribí en inglés: ${r.es}.`)],
      explica: `${r.e} <b>${r.palabra}</b> = ${r.es}.`, explicaVoz: [en(r.palabra), es(`es ${r.es}.`)],
    };
  }
  const lista = tipo === "dia" ? DIAS : MESES, i = entre(2, lista.length - 1, rnd);
  return {
    tipo: "escribir", clase: "palabra", tema: tipo === "dia" ? "dias" : "meses", respuesta: lista[i].en,
    instr: "✍️ Write the word",
    html: `<span class="grande" aria-hidden="true">${tipo === "dia" ? "📅" : "🗓️"}</span>${lista[i - 2].en}, ${lista[i - 1].en}, <span class="hueco">?</span><small>¿Qué ${tipo === "dia" ? "día" : "mes"} sigue?</small>`,
    voz: [en(`${lista[i - 2].en}, ${lista[i - 1].en}...`), es(`¿Qué ${tipo === "dia" ? "día" : "mes"} sigue? Escribilo en inglés.`)],
    explica: `${lista[i - 2].en}, ${lista[i - 1].en}, <b>${lista[i].en}</b> (${lista[i].es}).`, explicaVoz: [en(`${lista[i - 2].en}, ${lista[i - 1].en}, ${lista[i].en}.`)],
  };
}

/** ✍️ Escuchar la hora en inglés y escribirla con números (3:45). */
function escribirHora(rnd) {
  const h = entre(1, 12, rnd), m = azar(MINUTOS.cinco, rnd);
  return {
    tipo: "escribir", clase: "hora", tema: "hora", respuesta: digital(h, m), hora: { h, m },
    instr: "✍️ Escribí la hora", html: `<span class="grande" aria-hidden="true">👂⏰</span><small>Escuchá y escribila con números, como 3:45</small>`,
    voz: [es("Escuchá y escribí la hora con números:"), en(`It's ${horaEn(h, m)}.`)],
    explica: `It's ${horaEn(h, m)} = <b>${digital(h, m)}</b> (${horaEs(h, m)}).`,
    explicaVoz: [en(`It's ${horaEn(h, m)}.`), es(`${may(horaEs(h, m))}.`)],
  };
}

/** ¿Lo que escribió vale? (sin mayúsculas ni espacios de más; la hora con : o ., o con coma: el teclado decimal del celular no tiene :) */
export function acepta(q, texto) {
  const t = String(texto).trim().toLowerCase().replace(/\s+/g, " ");
  if (q.clase === "hora") {
    const k = t.match(/^(\d{1,2})\s*[:.,h ]\s*(\d{2})$/);
    return !!k && Number(k[1]) === q.hora.h && Number(k[2]) === q.hora.m;
  }
  const limpio = t.replace(/^it'?s\s+/, "").replace(/^(a|an)\s+/, "").replace(/[.!]$/, "").trim();
  return limpio === q.respuesta.toLowerCase();
}
/** Pista para escribir: con qué letra empieza y cuántas tiene. */
export const pistaPalabra = q => `Empieza con «${q.respuesta[0]}» y tiene ${q.respuesta.length} letras.`;
/** Pista para escribir la hora: qué quiere decir la frase (sin dar la respuesta). */
export function pistaHora(q) {
  const { m } = q.hora;
  if (m === 0) return "O'clock quiere decir «en punto»: los minutos son 00.";
  if (m === 15) return "Quarter past quiere decir «y cuarto»: 15 minutos después de la hora que dice.";
  if (m === 30) return "Half past quiere decir «y media»: 30 minutos después de la hora que dice.";
  if (m === 45) return "Quarter to quiere decir «un cuarto para»: faltan 15 minutos para la hora que dice, así que es la hora anterior y 45.";
  return m < 30
    ? `Past quiere decir «y»: son ${m} minutos después de la hora que dice.`
    : `To quiere decir «para»: faltan ${60 - m} minutos para la hora que dice, así que es la hora anterior y ${m}.`;
}

// ---------- 🪜 Escalones: de escuchar y tocar a leer y escribir ----------
const algun = gens => rnd => azar(gens, rnd)(rnd);
export const ESCALONES = [
  { nombre: "Weather: escuchá y tocá", gen: r => escucharClima(2, r) },                                                //  1. 2 dibujos que no se parecen
  { nombre: "Weather y ropa", gen: algun([r => escucharClima(3, r), r => escucharRopa(3, r)]) },                       //  2. 3 dibujos
  { nombre: "Days of the week", gen: r => escucharDia(3, r) },                                                         //  3. oír el día y tocar en español
  { nombre: "My day: escuchá y tocá", gen: r => escucharRutina(3, r) },                                                //  4. rutinas con dibujo
  { nombre: "Tomorrow is…", gen: algun([r => siguienteDia(3, r), r => escucharDia(4, r)]) },                           //  5. ¿qué día es mañana?
  { nombre: "Months", gen: algun([r => escucharMes(4, r), r => siguienteMes(3, r)]) },                                 //  6. meses
  { nombre: "What do you need?", gen: algun([r => queNecesito(3, r), r => queNecesito(4, r), epocaLluviosa]) },        //  7. ropa según el clima y la época lluviosa
  { nombre: "Time: o'clock y half past", gen: r => horaReloj(MINUTOS.enPunto, 3, r) },                                  //  8. en punto y y media
  { nombre: "Ordená", gen: algun([r => ordenar("dias", 4, r), r => ordenar("rutina", 4, r), r => siguienteDia(3, r, true)]) }, //  9. ordenar y «yesterday was»
  { nombre: "Time: quarter past y quarter to", gen: algun([r => horaReloj(MINUTOS.cuartos, 4, r), r => horaOida(MINUTOS.cuartos, 4, r)]) }, // 10. cuartos
  { nombre: "Leé y escogé", gen: algun([leerFrase, horario]) },                                                         // 11. oraciones y horarios
  { nombre: "Escribí la palabra", gen: escribirPalabra },                                                               // 12. escribir palabras cortas
  { nombre: "Time: de 5 en 5", gen: algun([r => horaReloj(MINUTOS.cinco, 4, r), r => horaOida(MINUTOS.cinco, 4, r)]) },   // 13. ten past, twenty to…
  { nombre: "Escribí la hora y ordená", gen: algun([escribirHora, r => ordenar("meses", 4, r), r => ordenar("rutina", 5, r)]) }, // 14.
];
export const inicioPorEdad = edad => edad === null || edad <= 7 ? 0 : edad === 8 ? 2 : edad === 9 ? 4 : edad === 10 ? 5 : edad === 11 ? 7 : 8;

// Para el papá o la maestra: temas a mano
export const MODOS = [
  { id: "clima", nombre: "🌦️ Weather", gens: [r => escucharClima(4, r), r => queNecesito(4, r), epocaLluviosa, r => escucharRopa(4, r)] },
  { id: "dias", nombre: "📅 Days & months", gens: [r => escucharDia(4, r), r => siguienteDia(3, r), r => siguienteDia(3, r, true), r => escucharMes(4, r), r => siguienteMes(3, r), r => ordenar("dias", 4, r), r => ordenar("meses", 4, r)] },
  { id: "hora", nombre: "⏰ Time", gens: [r => horaReloj(MINUTOS.enPunto, 3, r), r => horaReloj(MINUTOS.cuartos, 4, r), r => horaOida(MINUTOS.cuartos, 4, r), r => horaReloj(MINUTOS.cinco, 4, r)] },
  { id: "rutina", nombre: "🏫 My day", gens: [r => escucharRutina(4, r), r => ordenar("rutina", 4, r), horario, leerFrase] },
  { id: "escribir", nombre: "✍️ Write", gens: [escribirPalabra, escribirHora] },
];
export const preguntaDeModo = (modo, rnd = Math.random) => azar(modo.gens, rnd)(rnd);

// ---------- Revisión (para las pruebas con node) ----------
const sinEtiquetas = t => { let s = "", dentro = false; for (const c of String(t)) { if (c === "<") dentro = true; else if (c === ">") dentro = false; else if (!dentro) s += c; } return s; };
const vozBien = v => Array.isArray(v) && v.length > 0 && v.every(p => Array.isArray(p) && typeof p[0] === "string" && p[0].trim() && (p[1] === "es" || p[1] === "en") && !/[<>]|undefined|NaN/.test(p[0]));

/** Problemas de una pregunta (vacía = bien). */
export function revisarPregunta(q) {
  const mal = [];
  const textos = [q.instr, q.html, q.explica, ...(q.opciones || []).flatMap(o => [o.html, o.porque?.txt]), ...(q.items || []).map(i => i.html)];
  if (textos.some(t => t !== undefined && /undefined|NaN|null/.test(String(t)))) mal.push("texto con undefined o NaN");
  if (!vozBien(q.voz)) mal.push("voz mal armada");
  if (!vozBien(q.explicaVoz)) mal.push("explicaVoz mal armada");
  if (q.tipo === "opciones") {
    const ids = q.opciones.map(o => o.id), vistas = q.opciones.map(o => sinEtiquetas(o.html));
    if (q.opciones.length < 2) mal.push("menos de 2 opciones");
    if (new Set(ids).size !== ids.length) mal.push("ids repetidos");
    if (new Set(vistas).size !== vistas.length) mal.push(`opciones que se ven iguales: ${vistas.join(" | ")}`);
    if (!ids.includes(q.correcta)) mal.push("la correcta no está");
    q.opciones.forEach(o => { if (!vozBien(o.voz)) mal.push(`voz de la opción ${o.id}`); if (o.id !== q.correcta && (!o.porque || !vozBien(o.porque.voz))) mal.push(`falta el porqué de ${o.id}`); });
    // Ropa: una sola opción sirve para el clima
    if (q.tema === "ropa" && /What do you need/.test(q.html)) {
      const c = CLIMA.find(x => q.html.includes(`<b>${x.en}</b>`));
      const sirven = q.opciones.filter(o => { const r = ROPA.find(x => x.id === o.id); return r.para.includes(c.id) || (r.tal || []).includes(c.id); });
      if (sirven.length !== 1 || sirven[0].id !== q.correcta) mal.push(`ropa: sirven ${sirven.map(o => o.id).join(", ")}`);
    }
    // Hora: la correcta es la de la pregunta y ninguna mala dice la misma hora
    if (q.hora) {
      const { h, m } = q.hora;
      if (q.correcta !== digital(h, m)) mal.push("la hora correcta no calza");
      const frases = q.opciones.map(o => horaEn(...o.id.split(":").map(Number)));
      if (new Set(frases).size !== frases.length) mal.push("dos opciones dicen la misma hora");
    }
    // Época lluviosa: la correcta es de la época que se pregunta y las malas de la otra
    if (/Valle Central/.test(q.html)) {
      const lluvia = /rainy/.test(q.html);
      q.opciones.forEach(o => { const k = Number(o.id), esDe = lluvia ? LLUVIOSOS.includes(k) : SECOS.includes(k); if ((o.id === q.correcta) !== esDe) mal.push(`mes ${o.id} mal clasificado`); });
    }
  } else if (q.tipo === "ordenar") {
    const ids = q.items.map(i => i.id);
    if (new Set(ids).size !== ids.length) mal.push("piezas repetidas");
    if ([...q.orden].sort().join() !== [...ids].sort().join()) mal.push("el orden no usa las mismas piezas");
    const rangos = q.orden.map(id => q.items.find(i => i.id === id).rango);
    if (rangos.some((r, k) => k > 0 && r <= rangos[k - 1])) mal.push("el orden no va de menor a mayor (o hay empates)");
    q.items.forEach(i => { if (!vozBien(i.voz)) mal.push(`voz de la pieza ${i.id}`); });
  } else if (q.tipo === "escribir") {
    if (!q.respuesta) mal.push("sin respuesta");
    else if (!acepta(q, q.respuesta)) mal.push(`no acepta su propia respuesta: ${q.respuesta}`);
    else if (q.clase === "palabra" && !acepta(q, q.respuesta.toUpperCase())) mal.push("no acepta mayúsculas");
    if (q.clase === "hora" && !acepta(q, `0${q.respuesta}`) && q.hora.h < 10) mal.push("no acepta 03:45");
    if (q.clase === "hora" && !acepta(q, q.respuesta.replace(":", ","))) mal.push("no acepta 3,45");
    if (q.clase === "hora" && acepta(q, digital(sig(q.hora.h), q.hora.m))) mal.push("acepta otra hora");
  } else mal.push(`tipo raro: ${q.tipo}`);
  return mal;
}
