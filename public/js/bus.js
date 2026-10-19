// 🚌 Lógica de «¿A qué hora llega el bus?» (tiempo transcurrido). Sin pantalla: se puede probar con node.
// Las horas se guardan como minutos desde la medianoche (7:15 → 435). Todo va de 5 en 5 minutos,
// como los horarios de los buses. Las preguntas usan el motor js/quiz.js.
import { barajar } from "./quiz.js";

// ---------- Rutas (duraciones creíbles de un bus, en minutos: [mínimo, máximo]) ----------
export const RUTAS = [
  // Cortas: menos de una hora
  { de: "Cartago", a: "San José", d: [40, 60] },
  { de: "Heredia", a: "San José", d: [25, 45] },
  { de: "Alajuela", a: "San José", d: [30, 50] },
  { de: "Desamparados", a: "San José", d: [20, 35] },
  { de: "Escazú", a: "San José", d: [20, 35] },
  { de: "Tres Ríos", a: "San José", d: [20, 35] },
  { de: "Paraíso", a: "Cartago", d: [15, 25] },
  { de: "Santo Domingo", a: "Heredia", d: [15, 25] },
  { de: "Grecia", a: "Alajuela", d: [35, 50] },
  { de: "Liberia", a: "Playas del Coco", d: [35, 50] },
  { de: "Puntarenas", a: "Esparza", d: [25, 35] },
  // Medianas: de una a dos horas
  { de: "Turrialba", a: "Cartago", d: [70, 90] },
  { de: "San Ramón", a: "San José", d: [70, 90] },
  { de: "Liberia", a: "Nicoya", d: [70, 90] },
  { de: "Limón", a: "Cahuita", d: [55, 70] },
  // Largas: dos horas o más
  { de: "San José", a: "Puntarenas", d: [135, 155] },
  { de: "San José", a: "Limón", d: [165, 190] },
  { de: "San José", a: "Ciudad Quesada", d: [150, 180] },
  { de: "San José", a: "San Isidro de El General", d: [170, 200] },
  { de: "San José", a: "Quepos", d: [190, 220] },
  { de: "San José", a: "La Fortuna", d: [240, 270] },
  { de: "San José", a: "Nicoya", d: [240, 280] },
  { de: "San José", a: "Liberia", d: [260, 290] },
  { de: "San José", a: "Puerto Viejo de Talamanca", d: [250, 280] },
];
const cortas = RUTAS.filter(r => r.d[1] <= 60);
const medianas = RUTAS.filter(r => r.d[0] >= 55 && r.d[1] <= 90);
const largas = RUTAS.filter(r => r.d[0] >= 135);

// ---------- Horas: texto, palabras y dibujo ----------
const dos = n => String(n).padStart(2, "0");
const h12 = t => { const h = Math.floor(t / 60) % 12; return h === 0 ? 12 : h; };
/** 435 → "7:15"; con ampm: "7:15 a. m." (12:00 a 12:59 es p. m.: el mediodía) */
export const hora = (t, ampm = false) => `${h12(t)}:${dos(t % 60)}${ampm ? (t < 720 ? " a. m." : " p. m.") : ""}`;
/** Con artículo: «la 1:05 p. m.», «las 7:05 a. m.» */
export const lasHora = (t, ampm = false) => `${h12(t) === 1 ? "la" : "las"} ${hora(t, ampm)}`;
/** Para botones y recuadros: la hora grande y «a. m.» o «p. m.» chiquito debajo */
const horaHtml = (t, ampm = false) => `${hora(t)}${ampm ? `<small>${t < 720 ? "a. m." : "p. m."}</small>` : ""}`;

const N = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce",
  "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro",
  "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const DEC = { 3: "treinta", 4: "cuarenta", 5: "cincuenta", 6: "sesenta", 7: "setenta", 8: "ochenta", 9: "noventa" };
/** Número en palabras (hasta 999), para que la voz lo diga bien. */
export function enPalabras(n) {
  if (n < 30) return N[n];
  if (n < 100) return DEC[Math.floor(n / 10)] + (n % 10 ? " y " + N[n % 10] : "");
  if (n === 100) return "cien";
  const c = Math.floor(n / 100), r = n % 100;
  const cien = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"][c];
  return r ? `${cien} ${enPalabras(r)}` : c === 1 ? "cien" : cien;
}
const HORAS = ["", "la una", "las dos", "las tres", "las cuatro", "las cinco", "las seis", "las siete", "las ocho", "las nueve", "las diez", "las once", "las doce"];
/** Cómo se dice la hora a lo tico: «las siete y cuarto», «un cuarto para las ocho», «las doce del mediodía». */
export function horaDicha(t, ampm = false) {
  const h = h12(t), m = t % 60;
  const sig = h12(t + 15);
  let s;
  if (m === 0) s = `${HORAS[h]} en punto`;
  else if (m === 15) s = `${HORAS[h]} y cuarto`;
  else if (m === 30) s = `${HORAS[h]} y media`;
  else if (m === 45) s = `un cuarto para ${HORAS[sig]}`;
  else s = `${HORAS[h]} y ${enPalabras(m)}`;
  if (ampm) s += t < 720 ? (t < 360 ? " de la madrugada" : " de la mañana") : t < 780 ? " del mediodía" : t < 1080 ? " de la tarde" : " de la noche";
  return s;
}
/** 95 → "1 h 35 min" */
export const dur = d => [Math.floor(d / 60) ? `${Math.floor(d / 60)} h` : "", d % 60 ? `${d % 60} min` : ""].filter(Boolean).join(" ") || "0 min";
/** 95 → "una hora y treinta y cinco minutos" */
export function durDicha(d) {
  const h = Math.floor(d / 60), m = d % 60;
  const hs = h ? (h === 1 ? "una hora" : `${enPalabras(h)} horas`) : "";
  const ms = m ? `${enPalabras(m)} minutos` : "";
  return [hs, ms].filter(Boolean).join(" y ") || "cero minutos";
}

/** Reloj de agujas en SVG (aguja roja = horas, azul = minutos, como en «Aprendo la hora»). */
export function reloj(t, tam = 128) {
  const h = (t / 60) % 12, m = t % 60;
  const nums = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1, a = n * Math.PI / 6;
    return `<text x="${(60 + 41 * Math.sin(a)).toFixed(1)}" y="${(60 - 41 * Math.cos(a) + 4.5).toFixed(1)}">${n}</text>`;
  }).join("");
  const rayas = Array.from({ length: 60 }, (_, i) => {
    const a = i * Math.PI / 30, r1 = i % 5 ? 52 : 49;
    return `<line x1="${(60 + r1 * Math.sin(a)).toFixed(1)}" y1="${(60 - r1 * Math.cos(a)).toFixed(1)}" x2="${(60 + 55 * Math.sin(a)).toFixed(1)}" y2="${(60 - 55 * Math.cos(a)).toFixed(1)}" stroke-width="${i % 5 ? 1 : 2.2}"/>`;
  }).join("");
  return `<svg class="reloj" viewBox="0 0 120 120" width="${tam}" height="${tam}" aria-hidden="true">
    <circle cx="60" cy="60" r="58" fill="#1F3A5F"/><circle cx="60" cy="60" r="55" fill="#fff"/>
    <g stroke="#1F3A5F">${rayas}</g><g class="nums">${nums}</g>
    <line x1="60" y1="60" x2="60" y2="32" stroke="#D9443A" stroke-width="6" stroke-linecap="round" transform="rotate(${h * 30} 60 60)"/>
    <line x1="60" y1="60" x2="60" y2="16" stroke="#2F7FD1" stroke-width="3.5" stroke-linecap="round" transform="rotate(${m * 6} 60 60)"/>
    <circle cx="60" cy="60" r="4" fill="#1F3A5F"/></svg>`;
}

// ---------- Línea de tiempo: los saltos para explicar ----------
/** Saltos de `desde` hasta `desde + d`: primero las horas enteras, después los minutos hasta la hora en punto y el resto. */
export function saltos(desde, d) {
  const out = [];
  let t = desde, falta = d;
  const h = Math.floor(falta / 60);
  if (h) { t += h * 60; falta -= h * 60; out.push({ mas: `${h} h`, t }); }
  const alPunto = (60 - t % 60) % 60;
  if (falta && alPunto && falta > alPunto) { t += alPunto; falta -= alPunto; out.push({ mas: `${alPunto} min`, t }); }
  if (falta) { t += falta; out.push({ mas: `${falta} min`, t }); }
  return out;
}
/** Saltos para medir cuánto dura de `a` a `b`: hasta la hora en punto, horas enteras y lo que sobra. */
export function saltosDuracion(a, b) {
  const out = [];
  let t = a;
  const alPunto = (60 - t % 60) % 60;
  if (alPunto && t + alPunto <= b) { t += alPunto; out.push({ mas: `${alPunto} min`, t, m: alPunto }); }
  const h = Math.floor((b - t) / 60);
  if (h) { t += h * 60; out.push({ mas: `${h} h`, t, m: h * 60 }); }
  if (b > t) { out.push({ mas: `${b - t} min`, t: b, m: b - t }); t = b; }
  return out;
}
// Las etiquetas van en data-t (se dibujan con CSS) para que la voz no las lea como un enredo de números.
export const linea = (desde, pasos, ampm = false) =>
  `<span class="linea"><span class="hl" data-t="${hora(desde, ampm)}"></span>${pasos.map((p, i) =>
    `<span class="sl" data-t="+${p.mas}"></span><span class="hl${i === pasos.length - 1 ? " fin" : ""}" data-t="${hora(p.t, ampm)}"></span>`).join("")}</span>`;

// «2 h» → «2 horas», «15 min» → «15 minutos» (para las explicaciones, que también se leen en voz alta)
const palabras = mas => mas.replace(/^1 h$/, "1 hora").replace(/ h$/, " horas").replace(/ min$/, " minutos");

// ---------- Ayudas del generador ----------
const entre = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
const de5 = (a, b, rnd) => 5 * entre(Math.ceil(a / 5), Math.floor(b / 5), rnd);
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const ruta = r => `<span class="ruta">🚌 ${r.de} <span aria-hidden="true">➜</span> ${r.a}</span>`;
const may = s => s[0].toUpperCase() + s.slice(1);

/** Opciones: la correcta y distractores (sin repetir, válidos); `fmt` las convierte en texto. */
function opciones(correcta, malas, n, fmt, valida = () => true) {
  const ids = new Set([fmt(correcta)]), lista = [correcta];
  for (const x of malas) {
    if (lista.length >= n) break;
    if (!valida(x)) continue;
    const id = fmt(x);
    if (!ids.has(id)) { ids.add(id); lista.push(x); }
  }
  return lista;
}
const opsHora = (correcta, malas, n, ampm, rnd, desde = 300, hasta = 1380) => {
  const lista = opciones(correcta, malas, n, t => hora(t, ampm), t => t >= desde && t <= hasta);
  return { opciones: barajar(lista, rnd).map(t => ({ id: hora(t, ampm), html: `<b>${horaHtml(t, ampm)}</b>` })), correcta: hora(correcta, ampm), cols: n === 4 ? 2 : n };
};
const soloMin = d => `${d} min`;
const opsDur = (correcta, malas, n, rnd, fmt = dur) => {
  const lista = opciones(correcta, malas, n, fmt, d => d > 0);
  return { opciones: barajar(lista, rnd).map(d => ({ id: fmt(d), html: `<b>${fmt(d)}</b>` })), correcta: fmt(correcta), cols: n === 4 ? 2 : n };
};

// ---------- Tipos de pregunta ----------
// Cada una guarda `dato` con lo necesario para revisarla con revisarPregunta().

/** 🕒 ¿Qué hora marca el reloj? */
function leerReloj({ minutos, n }, rnd) {
  const t = entre(6, 11, rnd) * 60 + azar(minutos, rnd);
  const h = Math.floor(t / 60), m = t % 60;
  // Errores típicos: leer la hora siguiente (cuando la aguja roja ya pasó la mitad), confundir las agujas
  // o leer el número al que apunta la aguja azul («las 7 y 4» en vez de «las 7 y 20»).
  const malas = [azar([t + 60, t - 60], rnd), ...barajar([m ? h * 60 + m / 5 : t + 30, t + 30, t - 30, ((m / 5) % 12 || 12) * 60 + h % 12 * 5], rnd)];
  return {
    html: `${ruta(azar(RUTAS, rnd))}<span class="grande">${reloj(t)}</span>El bus sale a esta hora. ¿Qué hora marca el reloj?`,
    voz: "El bus sale a la hora que marca el reloj. ¿Qué hora es? La aguja roja dice la hora y la azul, los minutos.",
    ...opsHora(t, malas, n, false, rnd, 0, 1439),
    explica: `La aguja roja (la corta) está en el ${h} ${m >= 30 ? `y ya va hacia el ${h % 12 + 1}` : ""}, y la azul (la larga) está en el ${m ? m / 5 : 12}:
      ${m ? `${m / 5} × 5 = ${m} minutos` : "en punto"}. Son <b>${lasHora(t)}</b>.`,
    dato: { tipo: "reloj", t },
  };
}

/** ➕ ¿A qué hora llega? */
function llega({ rutas, cruzar, horasEnteras, n, ampm = false }, rnd) {
  for (let k = 0; k < 400; k++) {
    const r = azar(rutas, rnd);
    let d = horasEnteras ? 60 * azar([1, 2, 3, 4, 5].filter(h => h * 60 >= r.d[0] && h * 60 <= r.d[1]), rnd) : de5(r.d[0], r.d[1], rnd);
    if (!d) continue;
    const salida = de5(330, ampm ? 780 : 660, rnd);
    const llegada = salida + d;
    const cruza = Math.floor(llegada / 60) !== Math.floor(salida / 60) && llegada % 60 !== 0;
    if (cruzar !== undefined && cruza !== cruzar) continue;
    if (!ampm && llegada >= 720) continue; // sin a. m. ni p. m.: todo en la mañana
    if (ampm && !(salida < 720 && llegada >= 720) && rnd() < 0.7) continue; // casi siempre pasa el mediodía
    // Errores típicos: no llevar la hora (7:45 + 30 = 7:15), una hora de más o de menos, 10 minutos de diferencia
    const malas = [llegada - 60, llegada + 60, llegada + 10, llegada - 10, llegada - 5, llegada + 5];
    if (ampm) malas.unshift(llegada >= 720 ? llegada - 720 : llegada + 720);
    const p = saltos(salida, d);
    return {
      html: `${ruta(r)}<span class="horas"><span class="hito">Sale<b>${horaHtml(salida, ampm)}</b></span><span class="hito">Viaje<b>${dur(d)}</b></span><span class="hito pide">Llega<b>?</b></span></span>¿A qué hora llega a ${r.a}?`,
      voz: `El bus sale de ${r.de} a ${horaDicha(salida, ampm)} y el viaje dura ${durDicha(d)}. ¿A qué hora llega a ${r.a}?`,
      ...opsHora(llegada, malas, n, ampm, rnd),
      explica: `${linea(salida, p, ampm)}Sumamos de a saltos: ${p.map((x, i) => `${palabras(x.mas)}${i < p.length - 1 ? ` hasta ${lasHora(x.t, ampm)}` : p.length > 1 ? " más" : ""}`).join(", luego ")}.
        Llega a ${horaDicha(llegada, ampm)}: <b>${hora(llegada, ampm)}</b>.${ampm && salida < 720 && llegada >= 720 ? " Después de las 11:59 a. m. viene el mediodía, las 12:00 p. m." : ""}`,
      dato: { tipo: "llega", salida, d, ampm },
    };
  }
  throw new Error("llega: no se pudo armar");
}

/** ⏱️ ¿Cuánto duró el viaje? */
function duro({ rutas, cruzar, n, escribir = false }, rnd) {
  for (let k = 0; k < 400; k++) {
    const r = azar(rutas, rnd);
    const d = de5(r.d[0], r.d[1], rnd), salida = de5(330, 660, rnd), llegada = salida + d;
    if (llegada >= 720) continue;
    const cruza = Math.floor(llegada / 60) !== Math.floor(salida / 60) && llegada % 60 !== 0;
    if (cruzar !== undefined && cruza !== cruzar) continue;
    const p = saltosDuracion(salida, llegada);
    const suma = p.length > 1 ? `${p.map(x => x.mas).join(" + ")} = ${dur(d)}` : dur(d);
    // Error típico al pasar la hora: restar como si fueran números (8:15 − 7:40 → 815 − 740 = 75)
    const malas = [cruza ? d + 40 : d + 20, d + 10, d - 10, d + 5, d - 5, d + 60];
    return {
      html: `${ruta(r)}<span class="horas"><span class="hito">Sale<b>${horaHtml(salida)}</b></span><span class="hito">Llega<b>${horaHtml(llegada)}</b></span><span class="hito pide">Viaje<b>?</b></span></span>¿Cuánto duró el viaje?`,
      voz: `El bus salió de ${r.de} a ${horaDicha(salida)} y llegó a ${r.a} a ${horaDicha(llegada)}. ¿Cuánto duró el viaje?`,
      // En minutos («75 min»), así se nota el error de restar como números
      ...(escribir ? { escribir: { respuesta: String(d), numero: true, sufijo: "min", revisar: txt => Number(txt.replace(/[^\d]/g, "")) === d } } : opsDur(d, malas, n, rnd, soloMin)),
      explica: `${linea(salida, p)}Contamos los saltos: ${suma}${d >= 60 ? ` (${d} minutos)` : ""}.
        ${cruza ? "Ojo: no se puede restar como números, porque una hora tiene 60 minutos, no 100." : ""} El viaje duró <b>${dur(d)}</b>.`,
      dato: { tipo: "duro", salida, llegada, d, escribir },
    };
  }
  throw new Error("duro: no se pudo armar");
}

/** ⏪ ¿A qué hora salió? (restar) */
function salio({ rutas, n }, rnd) {
  for (let k = 0; k < 400; k++) {
    const r = azar(rutas, rnd);
    const d = de5(r.d[0], r.d[1], rnd), llegada = de5(420, 715, rnd), salida = llegada - d;
    if (salida < 300) continue;
    const p = saltos(salida, d);
    // Error típico: sumar en vez de restar
    const malas = [llegada + d, salida + 60, salida - 60, salida + 10, salida - 10, salida + 5];
    return {
      html: `${ruta(r)}<span class="horas"><span class="hito pide">Sale<b>?</b></span><span class="hito">Viaje<b>${dur(d)}</b></span><span class="hito">Llega<b>${horaHtml(llegada)}</b></span></span>¿A qué hora salió de ${r.de}?`,
      voz: `El bus llegó a ${r.a} a ${horaDicha(llegada)}. El viaje duró ${durDicha(d)}. ¿A qué hora salió de ${r.de}?`,
      ...opsHora(salida, malas, n, false, rnd, 240, 715),
      explica: `${linea(salida, p)}Hay que contar hacia atrás desde la llegada: ${hora(llegada)} menos ${dur(d)}. Salió a <b>${hora(salida)}</b>.
        Para revisar: ${hora(salida)} + ${dur(d)} = ${hora(llegada)}.`,
      dato: { tipo: "salio", llegada, d },
    };
  }
  throw new Error("salio: no se pudo armar");
}

/** ⏱️ Duración de un viaje largo, en horas y minutos */
function duroLargo({ n }, rnd) {
  for (let k = 0; k < 400; k++) {
    const r = azar(largas.concat(medianas), rnd);
    const d = de5(r.d[0], r.d[1], rnd), salida = de5(300, 840, rnd), llegada = salida + d;
    if (llegada > 1260 || d % 60 === 0) continue;
    const ampm = true;
    const p = saltosDuracion(salida, llegada);
    const malas = [d + 40, d - 60, d + 60, d + 10, d - 10, d + 20];
    return {
      html: `${ruta(r)}<span class="horas"><span class="hito">Sale<b>${horaHtml(salida, ampm)}</b></span><span class="hito">Llega<b>${horaHtml(llegada, ampm)}</b></span><span class="hito pide">Viaje<b>?</b></span></span>¿Cuánto duró el viaje?`,
      voz: `El bus salió de ${r.de} a ${horaDicha(salida, ampm)} y llegó a ${r.a} a ${horaDicha(llegada, ampm)}. ¿Cuánto duró el viaje?`,
      ...opsDur(d, malas, n, rnd),
      explica: `${linea(salida, p, ampm)}Contamos los saltos: ${p.map(x => x.mas).join(" + ")}. En total, <b>${dur(d)}</b>.`,
      dato: { tipo: "duroLargo", salida, llegada, d },
    };
  }
  throw new Error("duroLargo: no se pudo armar");
}

/** 🔄 Minutos ↔ horas y minutos */
function convertir({ n }, rnd) {
  const d = de5(65, 240, rnd);
  const h = Math.floor(d / 60), m = d % 60;
  if (rnd() < 0.5 && m) {
    // 135 min = ? → opciones en horas y minutos
    // Error típico: pensar que una hora tiene 100 minutos (135 min → «1 h 35 min»)
    const cien = d % 100 < 60 ? Math.floor(d / 100) * 60 + d % 100 : d + 10;
    const malas = [cien, d - 60, d + 60, h * 60 + Math.min(55, m + 10), d - 10, d + 40];
    return {
      html: `<span class="grande">⏱️</span>Un viaje dura <b>${d} minutos</b>.<br>¿Cuántas horas y minutos son?`,
      voz: `Un viaje dura ${enPalabras(d)} minutos. ¿Cuántas horas y minutos son?`,
      ...opsDur(d, malas, n, rnd),
      explica: `Una hora tiene 60 minutos, no 100. ${d} = ${Array(h).fill("60").join(" + ")} + ${m}. Son <b>${dur(d)}</b>.`,
      dato: { tipo: "aHoras", d },
    };
  }
  return {
    html: `<span class="grande">⏱️</span>Un viaje dura <b>${dur(d)}</b>.<br>¿Cuántos minutos son en total?`,
    voz: `Un viaje dura ${durDicha(d)}. ¿Cuántos minutos son en total?`,
    escribir: { respuesta: String(d), numero: true, sufijo: "min", revisar: txt => Number(txt.replace(/[^\d]/g, "")) === d },
    explica: `Cada hora tiene 60 minutos: ${h} × 60 = ${h * 60}${m ? `, y ${h * 60} + ${m} = ${d}` : ""}. Son <b>${d} minutos</b>.`,
    dato: { tipo: "aMinutos", d },
  };
}

// 📋 Horarios: una tabla con las salidas de un día
function horarios({ n }, rnd) {
  for (let k = 0; k < 400; k++) {
    const r = azar(largas.concat(medianas), rnd);
    const d = de5(r.d[0], r.d[1], rnd);
    const cada = azar([60, 90, 120], rnd), primero = de5(300, 390, rnd);
    const salidas = Array.from({ length: 6 }, (_, i) => primero + i * cada).filter(t => t + d <= 1260);
    if (salidas.length < 4) continue;
    const tabla = `${ruta(r)}<span class="tabla"><span class="cab">Salidas</span>${salidas.map(t => `<span>${hora(t, true)}</span>`).join("")}</span>
      <small>El viaje dura ${dur(d)}.</small>`;
    const tipo = azar(["ultimo", "esperar", "llegaDe"], rnd);
    if (tipo === "ultimo") {
      // ¿Cuál es el último bus que llega a tiempo?
      const i = entre(1, salidas.length - 2, rnd);
      const limite = salidas[i] + d + de5(5, cada - 10, rnd);
      if (salidas[i + 1] + d <= limite) continue;
      const ops = opciones(salidas[i], [salidas[i + 1], salidas[i - 1], salidas[i + 2], salidas[i - 2]].filter(x => x !== undefined), n, t => hora(t, true));
      return {
        html: `${tabla}Tenés que estar en ${r.a} antes de <b>${lasHora(limite, true)}</b> ¿Cuál es el último bus que te sirve?`,
        voz: `Mirá la tabla de salidas. El viaje dura ${durDicha(d)}. Tenés que estar en ${r.a} antes de ${horaDicha(limite, true)}. ¿Cuál es el último bus que te sirve?`,
        opciones: barajar(ops, rnd).map(t => ({ id: hora(t, true), html: `<b>${horaHtml(t, true)}</b>` })), correcta: hora(salidas[i], true), cols: n === 4 ? 2 : n,
        explica: `El de ${lasHora(salidas[i], true)} llega a ${lasHora(salidas[i] + d, true)}: ¡a tiempo! El siguiente, el de ${lasHora(salidas[i + 1], true)},
          llegaría a ${lasHora(salidas[i + 1] + d, true)}: muy tarde. El último que sirve es el de <b>${lasHora(salidas[i], true)}</b>`,
        dato: { tipo: "ultimo", salidas, d, limite },
      };
    }
    if (tipo === "esperar") {
      // Llegás a la parada: ¿cuánto esperás el próximo bus?
      const i = entre(1, salidas.length - 1, rnd);
      const espera = de5(5, cada - 5, rnd), llego = salidas[i] - espera;
      const malas = [espera + 10, espera - 10, espera + 5, espera - 5, cada - espera, espera + 60];
      return {
        html: `${tabla}Llegás a la parada a <b>${lasHora(llego, true)}</b> ¿Cuánto tenés que esperar el próximo bus?`,
        voz: `Mirá la tabla de salidas. Llegás a la parada a ${horaDicha(llego, true)}. ¿Cuánto tenés que esperar el próximo bus?`,
        ...opsDur(espera, malas, n, rnd),
        explica: `${linea(llego, saltosDuracion(llego, salidas[i]), true)}El próximo sale a ${lasHora(salidas[i], true)} De ${hora(llego, true)} a ${hora(salidas[i], true)} hay <b>${dur(espera)}</b>.`,
        dato: { tipo: "esperar", salidas, llego, espera },
      };
    }
    const t = azar(salidas, rnd), llegada = t + d;
    const malas = [llegada - 60, llegada + 60, llegada + 10, llegada - 10, llegada >= 720 ? llegada - 720 : llegada + 720, llegada + 5];
    return {
      html: `${tabla}Si tomás el bus de <b>${lasHora(t, true)}</b>, ¿a qué hora llegás a ${r.a}?`,
      voz: `Mirá la tabla de salidas. El viaje dura ${durDicha(d)}. Si tomás el bus de ${horaDicha(t, true)}, ¿a qué hora llegás a ${r.a}?`,
      ...opsHora(llegada, malas, n, true, rnd),
      explica: `${linea(t, saltos(t, d), true)}${hora(t, true)} + ${dur(d)} = <b>${hora(llegada, true)}</b>.`,
      dato: { tipo: "llega", salida: t, d, ampm: true },
    };
  }
  throw new Error("horarios: no se pudo armar");
}

// 📅 Días y semanas
export const DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
/** 17 → "2 semanas y 3 días" */
export const semanas = x => `${Math.floor(x / 7)} ${Math.floor(x / 7) === 1 ? "semana" : "semanas"} y ${x % 7} ${x % 7 === 1 ? "día" : "días"}`;
function dias({ n }, rnd) {
  const tipo = azar(["semanasADias", "diasASemanas", "horasADias", "diaSemana"], rnd);
  if (tipo === "semanasADias") {
    const s = entre(1, 6, rnd), dd = entre(1, 6, rnd), total = s * 7 + dd;
    return {
      html: `<span class="grande">🚌</span>Una gira de la escuela dura <b>${s} ${s === 1 ? "semana" : "semanas"} y ${dd} ${dd === 1 ? "día" : "días"}</b>.<br>¿Cuántos días son?`,
      voz: `Una gira dura ${s === 1 ? "una semana" : `${enPalabras(s)} semanas`} y ${dd === 1 ? "un día" : `${enPalabras(dd)} días`}. ¿Cuántos días son?`,
      escribir: { respuesta: String(total), numero: true, sufijo: "días", revisar: txt => Number(txt.replace(/[^\d]/g, "")) === total },
      explica: `Una semana tiene 7 días: ${s} × 7 = ${s * 7}, y ${s * 7} + ${dd} = <b>${total} días</b>.`,
      dato: { tipo, total, s, dd },
    };
  }
  if (tipo === "diasASemanas") {
    const total = entre(9, 45, rnd), s = Math.floor(total / 7), dd = total % 7;
    if (!dd) return dias({ n }, rnd);
    const fmt = semanas;
    const malas = [total + 7, total - 7, s * 10 + dd > total ? total + 3 : total - 3, total + 1, total - 1, total + 2].filter(x => x % 7 && x > 7);
    const lista = opciones(total, malas, n, fmt);
    return {
      html: `<span class="grande">🏖️</span>Faltan <b>${total} días</b> para las vacaciones.<br>¿Cuántas semanas y días son?`,
      voz: `Faltan ${enPalabras(total)} días para las vacaciones. ¿Cuántas semanas y días son?`,
      opciones: barajar(lista, rnd).map(x => ({ id: fmt(x), html: `<b>${fmt(x)}</b>` })), correcta: fmt(total), cols: 2,
      explica: `Cada semana tiene 7 días: en ${total} caben ${s} semanas (${s} × 7 = ${s * 7}) y sobran ${total - s * 7}. Son <b>${fmt(total)}</b>.`,
      dato: { tipo, total },
    };
  }
  if (tipo === "horasADias") {
    const dd = entre(2, 5, rnd), extra = azar([0, 6, 12], rnd), horas = dd * 24 + extra;
    const fmt = x => `${Math.floor(x / 24)} ${Math.floor(x / 24) === 1 ? "día" : "días"}${x % 24 ? ` y ${x % 24} h` : ""}`;
    const malas = [horas + 24, horas - 24, horas + 6, horas - 6, horas + 12, horas - 12].filter(x => x >= 24);
    const lista = opciones(horas, malas, n, fmt);
    return {
      html: `<span class="grande">⏳</span>Un viaje en barco dura <b>${horas} horas</b>.<br>¿Cuántos días son?`,
      voz: `Un viaje en barco dura ${enPalabras(horas)} horas. ¿Cuántos días son?`,
      opciones: barajar(lista, rnd).map(x => ({ id: fmt(x), html: `<b>${fmt(x)}</b>` })), correcta: fmt(horas), cols: 2,
      explica: `Un día tiene 24 horas: ${dd} × 24 = ${dd * 24}${extra ? ` y sobran ${extra} horas` : ""}. Son <b>${fmt(horas)}</b>.`,
      dato: { tipo, horas },
    };
  }
  const hoy = entre(0, 6, rnd), mas = entre(3, 20, rnd), dia = (hoy + mas) % 7;
  const lista = opciones(dia, [(dia + 1) % 7, (dia + 6) % 7, (dia + 2) % 7, (dia + 5) % 7], n, x => DIAS[x]);
  return {
    html: `<span class="grande">🚌</span>Hoy es <b>${DIAS[hoy]}</b>. El bus de la gira sale dentro de <b>${mas} días</b>.<br>¿Qué día de la semana sale?`,
    voz: `Hoy es ${DIAS[hoy]}. El bus de la gira sale dentro de ${enPalabras(mas)} días. ¿Qué día de la semana sale?`,
    opciones: barajar(lista, rnd).map(x => ({ id: DIAS[x], html: `<b>${may(DIAS[x])}</b>` })), correcta: DIAS[dia], cols: 2,
    explica: `${mas >= 7 ? `Cada 7 días vuelve a ser ${DIAS[hoy]}: ${mas} = ${Math.floor(mas / 7)} × 7${mas % 7 ? ` + ${mas % 7}` : ""}. ` : ""}${mas % 7
      ? `Después del ${DIAS[hoy]} contamos ${mas % 7 === 1 ? "un día" : `${enPalabras(mas % 7)} días`}${mas >= 7 ? " más" : ""}: ${Array.from({ length: mas % 7 }, (_, i) => DIAS[(hoy + i + 1) % 7]).join(", ")}.`
      : `Cae otra vez ${DIAS[hoy]}.`} Sale el <b>${DIAS[dia]}</b>.`,
    dato: { tipo, hoy, mas },
  };
}

// ---------- 🪜 Escalones ----------
// De leer el reloj (2°) a horarios con a. m. y p. m. y días y semanas (5°).
export const ESCALONES = [
  { nombre: "🕐 El reloj: en punto y media", instr: "¿Qué <b>hora</b> marca el reloj?", gen: rnd => leerReloj({ minutos: [0, 30], n: 3 }, rnd) },               // 1
  { nombre: "🕒 El reloj: de 5 en 5", instr: "¿Qué <b>hora</b> marca el reloj?", gen: rnd => leerReloj({ minutos: [5, 10, 15, 20, 25, 35, 40, 45, 50, 55], n: 3 }, rnd) }, // 2
  { nombre: "➕ Sumar minutos", instr: "¿A qué hora <b>llega</b>?", gen: rnd => llega({ rutas: cortas, cruzar: false, n: 3 }, rnd) },                  // 3: sin pasar la hora
  { nombre: "➕ Sumar horas", instr: "¿A qué hora <b>llega</b>?", gen: rnd => llega({ rutas: RUTAS, horasEnteras: true, n: 3 }, rnd) },                 // 4: horas enteras
  { nombre: "➕ Pasar la hora en punto", instr: "¿A qué hora <b>llega</b>?", gen: rnd => llega({ rutas: cortas.concat(medianas), cruzar: true, n: 4 }, rnd) }, // 5
  { nombre: "⏱️ ¿Cuánto duró?", instr: "¿Cuánto <b>duró</b> el viaje?", gen: rnd => duro({ rutas: cortas, cruzar: false, n: 3 }, rnd) },              // 6: sin pasar la hora
  { nombre: "⏱️ ¿Cuánto duró? Pasando la hora", instr: "¿Cuánto <b>duró</b> el viaje?", gen: rnd => duro({ rutas: cortas, cruzar: true, n: 4 }, rnd) }, // 7
  { nombre: "✍️ ¿Cuánto duró? Escribilo", instr: "Escribí cuántos <b>minutos</b> duró", gen: rnd => duro({ rutas: cortas.concat(medianas), escribir: true }, rnd) }, // 8
  { nombre: "🔄 Horas y minutos", instr: "Horas y <b>minutos</b>", gen: rnd => convertir({ n: 4 }, rnd) },                                              // 9
  { nombre: "🛣️ Viajes largos", instr: "¿A qué hora <b>llega</b>?", gen: rnd => llega({ rutas: largas, n: 4 }, rnd) },                                 // 10
  { nombre: "⏪ ¿A qué hora salió?", instr: "¿A qué hora <b>salió</b>?", gen: rnd => salio({ rutas: RUTAS, n: 4 }, rnd) },                             // 11
  { nombre: "🌞 a. m. y p. m.", instr: "a. m. y p. m.", gen: rnd => rnd() < 0.6 ? llega({ rutas: medianas.concat(largas), ampm: true, n: 4 }, rnd) : duroLargo({ n: 4 }, rnd) }, // 12
  { nombre: "📋 Horarios", instr: "Mirá la <b>tabla</b> de salidas", gen: rnd => horarios({ n: 3 }, rnd) },                                          // 13
  { nombre: "🗓️ Días y semanas", instr: "<b>Días</b> y semanas", gen: rnd => dias({ n: 4 }, rnd) },                                                    // 14
];

// Modos a mano (para el papá o la maestra): rondas de 8 con escalones de un mismo tema
export const MODOS = [
  { id: "reloj", nombre: "🕒 Reloj", instr: "¿Qué <b>hora</b> marca el reloj?", escalones: [0, 1] },
  { id: "llega", nombre: "➕ Llega", instr: "¿A qué hora <b>llega</b>?", escalones: [2, 3, 4, 9] },
  { id: "duro", nombre: "⏱️ Duró", instr: "¿Cuánto <b>duró</b> el viaje?", escalones: [5, 6, 7] },
  { id: "salio", nombre: "⏪ Salió", instr: "¿A qué hora <b>salió</b>?", escalones: [10] },
  { id: "convertir", nombre: "🔄 h y min", instr: "Horas y <b>minutos</b>", escalones: [8] },
  { id: "ampm", nombre: "🌞 a. m./p. m.", instr: "a. m. y p. m.", escalones: [11] },
  { id: "horarios", nombre: "📋 Horarios", instr: "Mirá la <b>tabla</b> de salidas", escalones: [12] },
  { id: "dias", nombre: "🗓️ Días", instr: "<b>Días</b> y semanas", escalones: [13] },
];

/** Una pregunta de un escalón (sin repetir la misma pregunta seguida). */
let ultima = "";
export function pregunta(i, rnd = Math.random) {
  let p;
  for (let k = 0; k < 20; k++) { p = ESCALONES[i].gen(rnd); if (p.voz !== ultima) break; }
  ultima = p.voz;
  // Sin «p. m..»: el punto de la abreviatura cierra la oración
  p.html = p.html.replace(/ m\.(<\/b>)?\./g, " m.$1");
  p.explica = p.explica.replace(/ m\.(<\/b>)?\./g, " m.$1");
  return p;
}

/** Edad → escalón para empezar. */
export const inicio = edad => edad === null || edad <= 7 ? 0 : edad === 8 ? 2 : edad === 9 ? 4 : edad === 10 ? 6 : 8;

// ---------- Revisar (para las pruebas con node) ----------
/** Revisa una pregunta generada: la respuesta correcta está bien calculada, está entre las opciones y no hay repetidas. */
export function revisarPregunta(p) {
  const mal = [];
  const d = p.dato;
  let esperada;
  if (d.tipo === "reloj") esperada = hora(d.t);
  else if (d.tipo === "llega") esperada = hora(d.salida + d.d, d.ampm);
  else if (d.tipo === "duro") esperada = d.escribir ? String(d.llegada - d.salida) : soloMin(d.llegada - d.salida);
  else if (d.tipo === "salio") esperada = hora(d.llegada - d.d);
  else if (d.tipo === "duroLargo") esperada = dur(d.llegada - d.salida);
  else if (d.tipo === "aHoras") esperada = dur(d.d);
  else if (d.tipo === "aMinutos") esperada = String(d.d);
  else if (d.tipo === "ultimo") {
    const sirven = d.salidas.filter(t => t + d.d <= d.limite);
    esperada = hora(sirven[sirven.length - 1], true);
    if (sirven.length === d.salidas.length) mal.push("todos los buses sirven");
  } else if (d.tipo === "esperar") {
    const prox = d.salidas.find(t => t >= d.llego);
    esperada = dur(prox - d.llego);
  } else if (d.tipo === "semanasADias") esperada = String(d.s * 7 + d.dd);
  else if (d.tipo === "diasASemanas") esperada = semanas(d.total);
  else if (d.tipo === "horasADias") esperada = `${Math.floor(d.horas / 24)} ${Math.floor(d.horas / 24) === 1 ? "día" : "días"}${d.horas % 24 ? ` y ${d.horas % 24} h` : ""}`;
  else if (d.tipo === "diaSemana") esperada = DIAS[(d.hoy + d.mas) % 7];
  else mal.push("tipo desconocido " + d.tipo);

  if (p.escribir) {
    if (String(p.escribir.respuesta) !== esperada) mal.push(`respuesta ${p.escribir.respuesta} ≠ ${esperada}`);
    if (!p.escribir.revisar(esperada)) mal.push("revisar() no acepta la respuesta");
  } else {
    const ids = p.opciones.map(o => o.id);
    if (String(p.correcta) !== esperada) mal.push(`correcta ${p.correcta} ≠ ${esperada}`);
    if (!ids.includes(String(p.correcta))) mal.push("la correcta no está entre las opciones");
    if (new Set(ids).size !== ids.length) mal.push("opciones repetidas");
    if (ids.length < 3) mal.push(`solo ${ids.length} opciones`);
    if (ids.some(id => /-|NaN|undefined|:6\d|:[^0-5]/.test(id))) mal.push("opción rara: " + ids.join(" | "));
  }
  if (/NaN|undefined/.test(p.html + p.voz + p.explica)) mal.push("texto con NaN o undefined");
  return mal;
}
