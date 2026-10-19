// 📏 Lógica de «Medidas en la feria» (sin pantalla, se prueba con node).
// Longitud, masa (peso), capacidad, tiempo y temperatura, de 2° a 6°: comparar con dibujos, medir con la regla,
// estimar, escoger la unidad, convertir (enteros, fracciones y decimales) y resolver problemas de la feria y la casa.
//
// Para que no haya errores de coma flotante, cada cantidad se arma con un entero en la unidad pequeña
// (gramos, mililitros, centímetros…) y la grande se calcula al final, solo para mostrarla.
//
// Una pregunta es:
//   { tipo: "opciones" | "escribir", html, dibujo?, voz?, pista, explica }
//   opciones: { opciones: [{ id, html, aria? }], correcta, cols? }
//   escribir: { respuesta (número), sufijo?, casi?(valor) }
//   dibujo: SVG que se muestra debajo de la pregunta (no se lee en voz alta)
//   voz: lo que se dice (si no, se lee el html con paraVoz)
import { igual } from "./quiz.js";

// ---------- Números ----------
const NBSP = "\u00a0";
/** Número con coma decimal y espacio de miles: 1500 → «1 500», 2.5 → «2,5», 0.75 → «0,75». */
export function num(x) {
  const [e, d] = String(Math.abs(x)).split(".");
  let ent = "";
  for (let i = 0; i < e.length; i++) ent += (i && (e.length - i) % 3 === 0 && e.length > 3 ? NBSP : "") + e[i];
  return (x < 0 ? "−" : "") + ent + (d ? "," + d : "");
}

// Unidades: a = abreviatura (si tiene), s y p = singular y plural, f = femenina
export const U = {
  mm: { a: "mm", s: "milímetro", p: "milímetros" }, cm: { a: "cm", s: "centímetro", p: "centímetros" },
  m: { a: "m", s: "metro", p: "metros" }, km: { a: "km", s: "kilómetro", p: "kilómetros" },
  g: { a: "g", s: "gramo", p: "gramos" }, kg: { a: "kg", s: "kilo", p: "kilos" },
  ml: { a: "ml", s: "mililitro", p: "mililitros" }, L: { a: "L", s: "litro", p: "litros" },
  h: { a: "h", s: "hora", p: "horas", f: true }, min: { a: "min", s: "minuto", p: "minutos" }, s: { a: "s", s: "segundo", p: "segundos" },
  dia: { s: "día", p: "días" }, semana: { s: "semana", p: "semanas", f: true }, mes: { s: "mes", p: "meses" }, anio: { s: "año", p: "años" },
  C: { a: "°C", s: "grado", p: "grados" },
};
/** Cantidad con su unidad, sin que se parta en dos renglones: «1 500 g», «3 semanas». */
export const cant = (x, u) => `${num(x)}${NBSP}${U[u].a || (x === 1 ? U[u].s : U[u].p)}`;
const FRAC = { "½": 1 / 2, "¼": 1 / 4, "¾": 3 / 4 };
const fracU = (f, u) => `${f}${NBSP}${U[u].a || U[u].s}`;

// ---------- Voz ----------
/** Quita las etiquetas HTML (cada una cuenta como un espacio). Sin expresiones regulares. */
export function sinEtiquetas(t) {
  let s = "", dentro = false;
  for (const c of String(t)) {
    if (c === "<") { dentro = true; s += " "; }
    else if (c === ">") dentro = false;
    else if (!dentro) s += c;
  }
  return s;
}

const UNO = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce",
  "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro",
  "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const DIEZ = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const CIEN = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];
function menosDeMil(n) {
  const c = Math.floor(n / 100), r = n % 100;
  if (c === 1 && !r) return "cien";
  const dec = r < 30 ? UNO[r] : DIEZ[Math.floor(r / 10)] + (r % 10 ? ` y ${UNO[r % 10]}` : "");
  return [CIEN[c], dec].filter(Boolean).join(" ");
}
/** Entero en palabras: 21 → «veintiuno», 1 501 → «mil quinientos uno». */
export function enPalabras(n) {
  if (n === 0) return "cero";
  const miles = Math.floor(n / 1000), r = n % 1000;
  const m = miles === 0 ? "" : miles === 1 ? "mil" : `${antesDe(miles, false)} mil`;
  return [m, r ? menosDeMil(r) : ""].filter(Boolean).join(" ");
}
/** Antes de un sustantivo: «un kilo», «veintiún kilos», «una hora», «treinta y una horas». */
export function antesDe(n, fem) {
  return enPalabras(n).replace(/(veinti)?uno$/, (_, v) => (v ? (fem ? "veintiuna" : "veintiún") : (fem ? "una" : "un")));
}
/** El número como se dice antes de una palabra: con letras solo si termina en 1 (para «veintiún»); si no, en cifras. */
const numVoz = (n, fem) => (n % 10 === 1 && n % 100 !== 11 ? antesDe(n, fem) : String(n));

// Palabras que vienen después de un número, con su género (para «una semana», «veintiún días»)
const GENERO = {
  día: 0, días: 0, mes: 0, meses: 0, año: 0, años: 0, vaso: 0, vasos: 0, pedazo: 0, pedazos: 0, mango: 0, mangos: 0, minuto: 0, minutos: 0,
  semana: 1, semanas: 1, rayita: 1, rayitas: 1, botella: 1, botellas: 1, bolsa: 1, bolsas: 1, vuelta: 1, vueltas: 1, hora: 1, horas: 1, taza: 1, tazas: 1,
};
const POR_ABREV = Object.fromEntries(Object.values(U).filter(u => u.a).map(u => [u.a, u]));
const MEDIO = { kg: 1, L: 1, m: 1, km: 1, h: 1, cm: 1 };

/** Texto para la voz: sin etiquetas ni emojis, con las unidades dichas con palabras («2,5 L» → «2 litros y medio»). */
export function paraVoz(html) {
  // «1 500» (con espacio de miles) → «1500», para que se lea «mil quinientos»
  let t = sinEtiquetas(html).replace(/(\d)[\u00a0\u202f](?=\d{3}(?!\d))/g, "$1").replace(/[\u00a0\u202f\u2009]/g, " ");
  // ½ kg → medio kilo · ¼ h → un cuarto de hora · ¾ L → tres cuartos de litro
  t = t.replace(/([½¼¾])\s?(kg|L|h|m|km|año|día)(?![\wáéíóúñ])/g, (_, f, u) => {
    const uni = POR_ABREV[u] || { s: u, f: false };
    return f === "½" ? `${uni.f ? "media" : "medio"} ${uni.s}` : `${f === "¼" ? "un cuarto" : "tres cuartos"} de ${uni.s}`;
  });
  // 1 500 g → 1500 gramos · 1 kg → un kilo · 21 kg → veintiún kilos · 1,5 h → una hora y media
  t = t.replace(/(\d{1,3}(?: \d{3})+|\d+)(?:,(\d+))?\s?(mm|cm|km|kg|ml|min|°C|m|g|L|h|s)(?![\wáéíóúñ])/g, (_, e, d, u) => {
    const uni = POR_ABREV[u], n = Number(e.replace(/ /g, ""));
    if (d === "5" && MEDIO[u]) return `${n === 0 ? "" : `${numVoz(n, uni.f)} ${n === 1 ? uni.s : uni.p} y `}${uni.f ? "media" : "medio"}${n === 0 ? " " + uni.s : ""}`;
    if (d) return `${n},${d} ${uni.p}`;
    return `${numVoz(n, uni.f)} ${n === 1 ? uni.s : uni.p}`;
  });
  // 1 semana → una semana · 21 días → veintiún días
  t = t.replace(/(\d{1,3}(?: \d{3})+|\d+)(?!,\d)\s([a-záéíóúñ]+)/g, (todo, e, w) => {
    const n = Number(e.replace(/ /g, ""));
    return w in GENERO && n % 10 === 1 && n % 100 !== 11 ? `${antesDe(n, GENERO[w] === 1)} ${w}` : `${String(n)} ${w}`;
  });
  return t
    .replace(/\s?\((mm|cm|m|km|g|kg|ml|L)\)/g, "") // «kilómetros (km)»: la abreviatura no se lee
    .replace(/(horas?) (\d+ minutos)/g, "$1 y $2")      // «una hora 50 minutos» → «una hora y 50 minutos»
    .replace(/\s=\s/g, " son ").replace(/×/g, " por ").replace(/÷/g, " entre ").replace(/\s[−-]\s/g, " menos ").replace(/\s\+\s/g, " más ")
    .replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, "")
    .replace(/\s+/g, " ").replace(/\s([.,:;?!])/g, "$1").trim();
}

// ---------- Azar ----------
const entre = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const may = t => t.charAt(0).toUpperCase() + t.slice(1);
/** Opciones de texto: la correcta y las malas, en desorden. */
const opcionesDe = (correcta, malas, rnd) => barajar([correcta, ...malas], rnd).map(x => ({ id: x === correcta ? "ok" : x, html: x }));

// ---------- Dibujos (SVG) ----------
const COLORES = [["rojo", "#E8574A"], ["azul", "#2F7FD1"], ["verde", "#2FA85A"], ["morado", "#8E5BD9"], ["anaranjado", "#F29A1F"]];

/** Un lápiz acostado de x0 a x1 (en pixeles), con la goma a la izquierda y la punta a la derecha. */
function lapiz(x0, x1, y, color, alto = 16) {
  const punta = Math.min(16, (x1 - x0) * 0.3), goma = Math.min(9, (x1 - x0) * 0.15), m = y + alto / 2;
  return `<rect x="${x0}" y="${y}" width="${goma}" height="${alto}" rx="3" fill="#F49AC1"/>`
    + `<rect x="${x0 + goma}" y="${y}" width="${x1 - punta - x0 - goma}" height="${alto}" fill="${color}"/>`
    + `<rect x="${x0 + goma}" y="${y + alto * 0.35}" width="${x1 - punta - x0 - goma}" height="${alto * 0.3}" fill="#fff" opacity=".25"/>`
    + `<path d="M${x1 - punta} ${y} L${x1} ${m} L${x1 - punta} ${y + alto} Z" fill="#F3D7A6"/>`
    + `<path d="M${x1 - punta * 0.35} ${m - alto * 0.18} L${x1} ${m} L${x1 - punta * 0.35} ${m + alto * 0.18} Z" fill="#3A3A3A"/>`;
}
/** Una cinta (de tela) de x0 a x1. */
const cinta = (x0, x1, y, color, alto = 14) =>
  `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${alto}" rx="2" fill="${color}"/>`
  + `<line x1="${x0 + 2}" y1="${y + alto / 2}" x2="${x1 - 2}" y2="${y + alto / 2}" stroke="#fff" stroke-width="2" stroke-dasharray="5 4" opacity=".7"/>`;
const COSAS_REGLA = [
  { n: "el lápiz", dib: (a, b, y) => lapiz(a, b, y, "#FFC83D") },
  { n: "la crayola", dib: (a, b, y) => lapiz(a, b, y, "#2FA85A") },
  { n: "la cinta", dib: (a, b, y) => cinta(a, b, y + 1, "#E8574A") },
  { n: "la pajilla", dib: (a, b, y) => `<rect x="${a}" y="${y + 4}" width="${b - a}" height="8" rx="4" fill="#8E5BD9"/>` },
];

/**
 * Regla en centímetros con algo encima.
 * @param {number} desde, hasta  qué parte de la regla se ve (en cm)
 * @param {number} a, b          dónde empieza y termina la cosa (en cm; con mm, puede tener decimales)
 * @param {boolean} mm           regla grande con las rayitas de los milímetros
 */
export function regla({ desde = 0, hasta, a, b, cosa, mm = false, guias = true }) {
  const porCm = mm ? 50 : 20, mar = 14, W = (hasta - desde) * porCm + 2 * mar;
  const x = v => +(mar + (v - desde) * porCm).toFixed(2);
  let rayas = "";
  const paso = mm ? 0.1 : 0.5;
  for (let k = 0; k <= Math.round((hasta - desde) / paso); k++) {
    const v = +(desde + k * paso).toFixed(1), entero = Math.abs(v - Math.round(v)) < 1e-9, medio = Math.abs(v * 2 - Math.round(v * 2)) < 1e-9;
    const largo = entero ? 15 : medio ? 10 : 6;
    rayas += `<line x1="${x(v)}" y1="44" x2="${x(v)}" y2="${44 + largo}" stroke="#1F3A5F" stroke-width="${entero ? 1.6 : 1}"/>`;
    if (entero) rayas += `<text x="${x(v)}" y="79" text-anchor="middle" font-size="${mm ? 15 : 11}" font-weight="700" fill="#1F3A5F">${Math.round(v)}</text>`;
  }
  const guia = guias ? [a, b].map(v => `<line x1="${x(v)}" y1="30" x2="${x(v)}" y2="46" stroke="#D9443A" stroke-width="1.5" stroke-dasharray="3 2"/>`).join("") : "";
  return `<svg class="regla" viewBox="0 0 ${W} 90" role="img" aria-label="Regla en centímetros con ${cosa.n} encima">`
    + `<rect x="2" y="42" width="${W - 4}" height="44" rx="6" fill="#FFF3C4" stroke="#C9A227" stroke-width="2"/>`
    + `${rayas}<text x="${W - 8}" y="62" text-anchor="end" font-size="10" fill="#8A6D00">cm</text>`
    + `${cosa.dib(x(a), x(b), 14)}${guia}</svg>`;
}

/** Vaso con agua (nivel de 0 a 1), para escoger el que tiene más o menos. */
export function vaso(nivel) {
  const arriba = 8, abajo = 74, alto = abajo - arriba;
  const izq = y => 10 + ((y - arriba) / alto) * 5, der = y => 50 - ((y - arriba) / alto) * 5;
  const yw = abajo - nivel * (alto - 2);
  const agua = nivel > 0 ? `<path d="M${izq(yw)} ${yw} L${der(yw)} ${yw} L45 ${abajo} L15 ${abajo} Z" fill="#7CC6F2"/>` : "";
  return `<svg class="vaso" viewBox="0 0 60 80" aria-hidden="true">${agua}<path d="M10 ${arriba} L15 ${abajo} L45 ${abajo} L50 ${arriba}" fill="none" stroke="#1F3A5F" stroke-width="3" stroke-linejoin="round"/></svg>`;
}

/** Balanza: se inclina hacia el lado que pesa más. */
export function balanza(izq, der, pesaIzq) {
  const ang = (pesaIzq ? -1 : 1) * 0.2, cx = 120, cy = 46, L = 84;
  const pI = [cx - L * Math.cos(ang), cy - L * Math.sin(ang)], pD = [cx + L * Math.cos(ang), cy + L * Math.sin(ang)];
  const plato = ([px, py], e) => `<line x1="${px}" y1="${py}" x2="${px - 22}" y2="${py + 34}" stroke="#1F3A5F" stroke-width="1.5"/>`
    + `<line x1="${px}" y1="${py}" x2="${px + 22}" y2="${py + 34}" stroke="#1F3A5F" stroke-width="1.5"/>`
    + `<path d="M${px - 28} ${py + 34} Q${px} ${py + 48} ${px + 28} ${py + 34} Z" fill="#9DB3C9" stroke="#1F3A5F" stroke-width="2"/>`
    + `<text x="${px}" y="${py + 30}" text-anchor="middle" font-size="30">${e}</text>`;
  return `<svg class="balanza" viewBox="0 0 240 150" role="img" aria-label="Balanza inclinada hacia la ${pesaIzq ? "izquierda" : "derecha"}">`
    + `<path d="M${cx} ${cy} L${cx - 26} 140 L${cx + 26} 140 Z" fill="#C9D6E3" stroke="#1F3A5F" stroke-width="2"/>`
    + `<line x1="${pI[0]}" y1="${pI[1]}" x2="${pD[0]}" y2="${pD[1]}" stroke="#1F3A5F" stroke-width="5" stroke-linecap="round"/>`
    + `<circle cx="${cx}" cy="${cy}" r="6" fill="#FFC83D" stroke="#1F3A5F" stroke-width="2"/>${plato(pI, izq)}${plato(pD, der)}</svg>`;
}

/** Termómetro de 0 a 50 °C: cada rayita son 2 °C. */
export function termometro(v) {
  const y = t => 236 - t * 4.2;
  let rayas = "";
  for (let t = 0; t <= 50; t += 2) {
    const diez = t % 10 === 0;
    rayas += `<line x1="70" y1="${y(t)}" x2="${diez ? 86 : 79}" y2="${y(t)}" stroke="#1F3A5F" stroke-width="${diez ? 1.8 : 1}"/>`;
    if (diez) rayas += `<text x="90" y="${y(t) + 5}" font-size="14" font-weight="700" fill="#1F3A5F">${t}</text>`;
  }
  return `<svg class="termometro" viewBox="0 0 130 280" role="img" aria-label="Termómetro">`
    + `<rect x="48" y="12" width="22" height="236" rx="11" fill="#fff" stroke="#1F3A5F" stroke-width="3"/>`
    + `<rect x="54" y="${y(v)}" width="10" height="${250 - y(v)}" fill="#D9443A"/>`
    + `<circle cx="59" cy="256" r="17" fill="#D9443A" stroke="#1F3A5F" stroke-width="3"/>`
    + `${rayas}<text x="22" y="40" font-size="14" font-weight="800" fill="#1F3A5F">°C</text></svg>`;
}

// ---------- Datos ----------
// ¿Cuánto será? [pregunta, emoji, correcta, malas] (las malas no son razonables)
const ESTIMAR_1 = [
  ["¿Cuánto mide un lápiz?", "✏️", "15 cm", ["15 m", "15 km"]],
  ["¿Cuánto mide de alto una puerta?", "🚪", "2 m", ["2 cm", "2 km"]],
  ["¿Cuánto mide de largo un bus?", "🚌", "12 m", ["12 cm", "12 km"]],
  ["¿Cuánto mide de largo un cuaderno?", "📓", "25 cm", ["25 m", "25 km"]],
  ["¿Cuánto mide de largo una cama?", "🛏️", "2 m", ["2 cm", "20 km"]],
  ["¿Cuánto mide un zapato de niño?", "👟", "18 cm", ["18 m", "18 km"]],
  ["¿Cuánto mide de largo una cancha de fútbol?", "⚽", "100 m", ["100 cm", "100 km"]],
  ["¿Cuánto mide un banano?", "🍌", "20 cm", ["20 m", "2 cm"]],
  ["¿Cuánto pesa una sandía?", "🍉", "4 kg", ["4 g", "400 kg"]],
  ["¿Cuánto pesa una manzana?", "🍎", "200 g", ["200 kg", "2 g"]],
  ["¿Cuánto pesa un huevo?", "🥚", "60 g", ["60 kg", "6 kg"]],
  ["¿Cuánto pesa un perro mediano?", "🐕", "15 kg", ["15 g", "150 kg"]],
  ["¿Cuánto pesa un bebé recién nacido?", "👶", "3 kg", ["3 g", "30 kg"]],
  ["¿Cuánto pesa una bolsa de arroz?", "🍚", "2 kg", ["2 g", "200 kg"]],
  ["¿Cuánto pesa un lápiz?", "✏️", "5 g", ["5 kg", "50 kg"]],
  ["¿Cuánto pesa una piña?", "🍍", "2 kg", ["2 g", "20 kg"]],
  ["¿Cuánto pesa un niño de 8 años?", "🧒", "25 kg", ["25 g", "250 kg"]],
];
const ESTIMAR_2 = [
  ["¿Cuánto le cabe a un vaso?", "🥛", "250 ml", ["250 L", "25 L"]],
  ["¿Cuánto le cabe a una botella grande de refresco?", "🍾", "2 L", ["2 ml", "200 L"]],
  ["¿Cuánto jarabe hay en una cucharadita?", "🥄", "5 ml", ["5 L", "500 L"]],
  ["¿Cuánta agua le cabe a un balde?", "🪣", "10 L", ["10 ml", "1 000 L"]],
  ["¿Cuánta agua le cabe al tanque de una casa?", "🏠", "1 000 L", ["1 000 ml", "10 ml"]],
  ["¿Cuánto café le cabe a una taza?", "☕", "200 ml", ["200 L", "20 L"]],
  ["¿Cuánta agua le cabe a una piscina?", "🏊", "50 000 L", ["50 L", "50 ml"]],
  ["¿Cuánto mide una hormiga?", "🐜", "5 mm", ["5 m", "5 km"]],
  ["¿Cuánto mide un grano de arroz?", "🍚", "6 mm", ["6 m", "6 km"]],
  ["¿Qué distancia hay de San José a Limón?", "🛣️", "160 km", ["160 m", "160 cm"]],
  ["¿Cuánto mide una maratón?", "🏃", "42 km", ["42 m", "42 cm"]],
  ["¿Cuánto mide de grueso una moneda?", "🪙", "2 mm", ["2 m", "2 km"]],
];
// ¿Qué unidad conviene? [qué, emoji, unidad]
const QUE_UNIDAD = [
  ["el grosor de una moneda", "🪙", "mm"], ["el largo de una hormiga", "🐜", "mm"], ["el grosor de un cuaderno", "📓", "mm"],
  ["el largo de un lápiz", "✏️", "cm"], ["el largo de tu mano", "✋", "cm"], ["el ancho de un cuaderno", "📒", "cm"],
  ["la altura de una puerta", "🚪", "m"], ["el largo de una cancha de fútbol", "⚽", "m"], ["la altura de un árbol", "🌳", "m"], ["el largo del aula", "🏫", "m"],
  ["la distancia de San José a Limón", "🛣️", "km"], ["la distancia de Liberia a San José", "🚌", "km"], ["el largo del río Tárcoles", "🏞️", "km"],
  ["lo que pesa un saco de cemento", "🧱", "kg"], ["lo que pesa una persona", "🧍", "kg"], ["lo que pesa una vaca", "🐄", "kg"],
  ["lo que pesa una hoja de papel", "📄", "g"], ["lo que pesa un confite", "🍬", "g"], ["lo que pesa una cucharada de azúcar", "🥄", "g"],
  ["el agua de una piscina", "🏊", "L"], ["la gasolina del tanque de un carro", "⛽", "L"], ["el agua de un balde", "🪣", "L"],
  ["una dosis de jarabe", "🧴", "ml"], ["una cucharadita de vainilla", "🥄", "ml"], ["las gotas para los ojos", "💧", "ml"],
];
const OTRAS_UNIDADES = { mm: ["m", "km"], cm: ["m", "km"], m: ["mm", "km"], km: ["cm", "mm"], g: ["kg", "L"], kg: ["g", "L"], L: ["ml", "kg"], ml: ["L", "g"] };
const POR_QUE = {
  mm: "es algo muy pequeñito, más pequeño que un centímetro",
  cm: "es algo que cabe en la mano o en la mesa",
  m: "es algo grande, como una puerta, un aula o una cancha",
  km: "es una distancia larga, de un pueblo a otro",
  g: "es algo muy liviano",
  kg: "es algo pesado",
  L: "es bastante líquido",
  ml: "es poquito líquido",
};
const PISTA_UNIDAD = {
  mm: "¿Es algo grande o pequeñito?", cm: "¿Es algo grande o pequeñito?", m: "¿Es algo grande o pequeñito?", km: "¿Es cerquita o lejos?",
  g: "¿Es algo pesado o liviano? Ojo: los litros son para lo que le cabe a algo, no para el peso.",
  kg: "¿Es algo pesado o liviano? Ojo: los litros son para lo que le cabe a algo, no para el peso.",
  L: "¿Es mucho o poquito líquido? Ojo: los gramos y los kilos son para el peso.",
  ml: "¿Es mucho o poquito líquido? Ojo: los gramos y los kilos son para el peso.",
};

// Balanza: [el que pesa más, el que pesa menos]
const PESOS = [
  [["la sandía", "🍉"], ["la fresa", "🍓"]], [["la piña", "🍍"], ["el limón", "🍋"]], [["el ladrillo", "🧱"], ["el globo", "🎈"]],
  [["el bulto", "🎒"], ["el lápiz", "✏️"]], [["la pipa", "🥥"], ["la uva", "🍇"]], [["la olla", "🍲"], ["la cuchara", "🥄"]],
  [["los libros", "📚"], ["la pluma", "🪶"]], [["el melón", "🍈"], ["la cereza", "🍒"]],
];

// ---------- Generadores ----------
/** Comparar con dibujos: más largo o más corto, más o menos agua, lleno o vacío, la balanza. */
function comparar(rnd) {
  const tipo = azar(["largo", "largo", "vasos", "vasos", "balanza"], rnd);
  if (tipo === "largo") {
    const cols = barajar(COLORES, rnd).slice(0, 3);
    let largos;
    do largos = [entre(3, 13, rnd), entre(3, 13, rnd), entre(3, 13, rnd)];
    while (Math.min(Math.abs(largos[0] - largos[1]), Math.abs(largos[1] - largos[2]), Math.abs(largos[0] - largos[2])) < 2);
    const mas = rnd() < 0.5, meta = largos.indexOf(mas ? Math.max(...largos) : Math.min(...largos));
    const que = mas ? "más largo" : "más corto";
    return {
      tipo: "opciones", cols: 1,
      html: `¿Cuál lápiz es el <b>${que}</b>?`,
      opciones: cols.map(([n, c], i) => ({ id: n, aria: `lápiz ${n}`, html: `<svg class="lapices" viewBox="0 0 300 30" aria-hidden="true">${lapiz(6, 6 + largos[i] * 21, 7, c)}</svg>` })),
      correcta: cols[meta][0],
      pista: mas ? "Fijate cuál punta llega más lejos. Todos empiezan en el mismo lugar." : "Fijate cuál se queda más atrás. Todos empiezan en el mismo lugar.",
      explica: `El lápiz ${cols[meta][0]} es el ${que}: todos empiezan en el mismo lugar y su punta es la que ${mas ? "llega más lejos" : "se queda más atrás"}.`,
    };
  }
  if (tipo === "vasos") {
    const pide = azar(["mas", "menos", "lleno", "vacio"], rnd);
    let niveles;
    if (pide === "lleno") niveles = [1, ...barajar([0.25, 0.5, 0.75], rnd).slice(0, 2)];
    else if (pide === "vacio") niveles = [0, ...barajar([0.25, 0.5, 0.75], rnd).slice(0, 2)];
    else niveles = barajar([0.15, 0.35, 0.55, 0.75, 0.9], rnd).slice(0, 3);
    niveles = barajar(niveles, rnd);
    const meta = pide === "lleno" ? niveles.indexOf(1) : pide === "vacio" ? niveles.indexOf(0) : niveles.indexOf(pide === "mas" ? Math.max(...niveles) : Math.min(...niveles));
    const que = { mas: "tiene más agua", menos: "tiene menos agua", lleno: "está lleno", vacio: "está vacío" }[pide];
    const como = n => (n === 1 ? "lleno" : n === 0 ? "vacío" : n >= 0.75 ? "con mucha agua" : n <= 0.25 ? "con poquita agua" : "con agua por la mitad");
    return {
      tipo: "opciones", cols: 3,
      html: `¿Cuál vaso <b>${que}</b>?`,
      opciones: niveles.map((n, i) => ({ id: `v${i}`, aria: `vaso ${como(n)}`, html: vaso(n) })),
      correcta: `v${meta}`,
      pista: pide === "lleno" ? "Lleno es cuando el agua llega hasta arriba." : pide === "vacio" ? "Vacío es cuando no tiene nada de agua."
        : "Los vasos son del mismo tamaño: fijate hasta dónde llega el agua.",
      explica: pide === "lleno" ? "Ese vaso está lleno: el agua llega hasta arriba." : pide === "vacio" ? "Ese vaso está vacío: no tiene nada de agua."
        : `Ese vaso ${que}: los tres son del mismo tamaño y en ese el agua llega ${pide === "mas" ? "más arriba" : "menos arriba"}.`,
    };
  }
  const [pesado, liviano] = azar(PESOS, rnd), izq = rnd() < 0.5, pideMas = rnd() < 0.5;
  const [a, b] = izq ? [pesado, liviano] : [liviano, pesado];
  const meta = pideMas ? pesado : liviano;
  return {
    tipo: "opciones", cols: 2,
    html: `¿Qué <b>pesa ${pideMas ? "más" : "menos"}</b>?`,
    dibujo: balanza(a[1], b[1], izq),
    opciones: [a, b].map(([n, e]) => ({ id: n, aria: n, html: `<span class="emo-op">${e}</span>` })),
    correcta: meta[0],
    pista: "La balanza baja del lado que pesa más.",
    explica: `${may(pesado[0])} pesa más que ${liviano[0]}: por eso la balanza baja de su lado.${pideMas ? "" : ` Entonces ${liviano[0]} es lo que pesa menos.`}`,
  };
}

/** Medir con la regla. con0: la cosa empieza en el 0 · escribir: se escribe el número (si no, se escoge). */
function medir(rnd, { con0, escribir }) {
  const cosa = azar(COSAS_REGLA, rnd);
  const a = con0 ? 0 : entre(1, 6, rnd), largo = entre(con0 ? 2 : 3, (con0 ? 14 : 15) - a, rnd), b = a + largo;
  const hasta = Math.max(b + 1, con0 ? 10 : 12);
  const base = {
    html: `¿Cuánto mide <b>${cosa.n}</b>?`,
    dibujo: regla({ hasta: Math.min(hasta, 16), a, b, cosa }),
    pista: con0 ? `${may(cosa.n)} empieza en el 0. Fijate en qué número termina.` : `Ojo: ${cosa.n} no empieza en el 0, empieza en el ${a}. Contá los centímetros desde ahí.`,
    explica: con0 ? `${may(cosa.n)} empieza en el 0 y termina en el ${b}: mide ${cant(largo, "cm")}.`
      : `${may(cosa.n)} empieza en el ${a} y termina en el ${b}: ${b} − ${a} = ${largo}. Mide ${cant(largo, "cm")}.`,
  };
  if (!escribir) {
    const malas = [largo + 1, largo - 1 >= 1 ? largo - 1 : largo + 2].map(n => cant(n, "cm"));
    return { ...base, tipo: "opciones", cols: 3, opciones: opcionesDe(cant(largo, "cm"), malas, rnd), correcta: "ok" };
  }
  return {
    ...base, tipo: "escribir", respuesta: largo, sufijo: "cm",
    casi: v => (!con0 && v === b ? "¡Casi! Ese es el número donde termina."
      : Math.abs(v - largo) === 1 ? "¡Casi! Contá otra vez, centímetro por centímetro." : null),
  };
}

/** ¿Cuánto será? (estimar) */
function estimar(lista, rnd) {
  const [q, e, bien, malas] = azar(lista, rnd);
  const u = bien.slice(bien.lastIndexOf(" ") + 1);
  const nbsp = t => t.replace(/ /g, NBSP);
  return {
    tipo: "opciones", cols: 3,
    html: `<span class="big">${e}</span> ${q}`,
    opciones: opcionesDe(nbsp(bien), malas.map(nbsp), rnd), correcta: "ok",
    pista: "Pensá en el tamaño de verdad. Una de las tres es posible; las otras son demasiado grandes o demasiado pequeñas.",
    explica: `Más o menos <b>${nbsp(bien)}</b>. ${malas.map(nbsp).join(" o ")} no tiene sentido: para esto se usan los ${U[u].p}.`,
  };
}

/** ¿Qué unidad conviene? */
function unidad(rnd) {
  const [que, e, u] = azar(QUE_UNIDAD, rnd);
  const ops = barajar([u, ...OTRAS_UNIDADES[u]], rnd).map(x => ({ id: x, html: `<b>${U[x].a}</b> <small>(${U[x].p})</small>`, aria: U[x].p }));
  return {
    tipo: "opciones", cols: 3,
    html: `<span class="big">${e}</span> ¿Qué unidad conviene para medir <b>${que}</b>?`,
    opciones: ops, correcta: u,
    pista: PISTA_UNIDAD[u],
    explica: `Para ${que} conviene usar <b>${U[u].p}</b> (${U[u].a}): ${POR_QUE[u]}.`,
  };
}

/**
 * Convertir entre una unidad grande y una pequeña.
 * @param {string} g, c   unidad grande y pequeña (m y cm)
 * @param {number} f      cuántas pequeñas tiene una grande (100)
 * @param {number} s      la cantidad, en la unidad pequeña (entero)
 * @param {boolean} alReves  de la pequeña a la grande
 */
const cuantos = u => (U[u].f ? "Cuántas" : "Cuántos");
function convertir({ g, c, f, s, alReves }) {
  const grande = s / f, uno = `${cant(1, g)} = ${cant(f, c)}`;
  const otrosFactores = [10, 100, 1000, 60, 24, 12, 7].filter(x => x !== f);
  if (!alReves) {
    return {
      tipo: "escribir", respuesta: s, sufijo: U[c].a || U[c].p,
      html: `¿${cuantos(c)} <b>${U[c].p}</b> son <b>${cant(grande, g)}</b>?`,
      pista: `Acordate: ${uno}. Al pasar a una unidad más pequeña, el número se hace más grande: se multiplica.`,
      explica: `${uno}, entonces se multiplica por ${num(f)}: ${num(grande)} × ${num(f)} = ${num(s)}. ${cant(grande, g)} = <b>${cant(s, c)}</b>.`,
      casi: v => {
        const F = otrosFactores.find(x => Math.abs(v - grande * x) < 1e-9);
        if (F) return `¡Casi! ${cant(1, g)} tiene ${cant(f, c)}, no ${num(F)}.`;
        if (Math.abs(v - grande) < 1e-9) return `¡Casi! Te faltó convertir: hay que pasarlo a ${U[c].p}.`;
        if (Math.abs(v - grande / f) < 1e-9) return `¡Casi! Dividiste, pero aquí se multiplica: hay más ${U[c].p} que ${U[g].p}.`;
        return null;
      },
    };
  }
  return {
    tipo: "escribir", respuesta: grande, sufijo: U[g].a || U[g].p,
    html: `¿${cuantos(g)} <b>${U[g].p}</b> son <b>${cant(s, c)}</b>?`,
    pista: `Acordate: ${uno}. Al pasar a una unidad más grande, el número se hace más pequeño: se divide.`,
    explica: `${uno}, entonces se divide entre ${num(f)}: ${num(s)} ÷ ${num(f)} = ${num(grande)}. ${cant(s, c)} = <b>${cant(grande, g)}</b>.`,
    casi: v => {
      if (Math.abs(v - s * f) < 1e-9) return `¡Casi! Multiplicaste, pero aquí se divide: hay menos ${U[g].p} que ${U[c].p}.`;
      const F = otrosFactores.find(x => Math.abs(v - s / x) < 1e-9);
      if (F) return `¡Casi! ${cant(1, g)} tiene ${cant(f, c)}, no ${num(F)}.`;
      if (Math.abs(v - s) < 1e-9) return `¡Casi! Te faltó convertir: hay que pasarlo a ${U[g].p}.`;
      return null;
    },
  };
}
const PARES = {
  mcm: { g: "m", c: "cm", f: 100 }, kgg: { g: "kg", c: "g", f: 1000 }, lml: { g: "L", c: "ml", f: 1000 },
  hmin: { g: "h", c: "min", f: 60 }, mins: { g: "min", c: "s", f: 60 }, diah: { g: "dia", c: "h", f: 24 },
  semdia: { g: "semana", c: "dia", f: 7 }, aniomes: { g: "anio", c: "mes", f: 12 },
  cmmm: { g: "cm", c: "mm", f: 10 }, kmm: { g: "km", c: "m", f: 1000 },
};
const conv = (par, s, alReves) => convertir({ ...PARES[par], s, alReves });

// Fracciones de uso diario: [fracción, unidad grande, unidad pequeña, cuánto es en la pequeña]
const FRACCIONES = [
  ["½", "kg", "g", 500], ["¼", "kg", "g", 250], ["¾", "kg", "g", 750], ["½", "L", "ml", 500], ["¼", "L", "ml", 250], ["¾", "L", "ml", 750],
  ["½", "h", "min", 30], ["¼", "h", "min", 15], ["¾", "h", "min", 45], ["½", "m", "cm", 50], ["¼", "m", "cm", 25], ["¾", "m", "cm", 75],
  ["½", "anio", "mes", 6], ["½", "dia", "h", 12],
];
const COMO_FRACCION = {
  "½": (t, r) => `½ es la mitad: ${t} ÷ 2 = ${r}.`,
  "¼": (t, r) => `¼ es la cuarta parte: ${t} ÷ 4 = ${r}.`,
  "¾": (t, r, cuarto) => `¾ son tres cuartas partes: ${t} ÷ 4 = ${cuarto}, y 3 × ${cuarto} = ${r}.`,
};
function fracciones(rnd) {
  const [fr, g, c, s] = azar(FRACCIONES, rnd);
  const total = Math.round(s / FRAC[fr]), como = COMO_FRACCION[fr](num(total), num(s), num(total / 4));
  const grande = fracU(fr, g), uno = `${cant(1, g)} = ${cant(total, c)}`;
  const nombreC = U[c].p;
  if (rnd() < 0.6) {
    return {
      tipo: "escribir", respuesta: s, sufijo: U[c].a || U[c].p,
      html: `¿${cuantos(c)} <b>${nombreC}</b> son <b>${grande}</b>?`,
      pista: `${uno}. ${fr === "½" ? "La mitad" : fr === "¼" ? "La cuarta parte" : "Tres cuartas partes"} de eso, ¿cuánto es?`,
      explica: `${uno}. ${como} Entonces ${grande} = <b>${cant(s, c)}</b>.`,
      casi: v => (fr === "¾" && v === total / 4 ? "¡Casi! Eso es ¼. Te faltó multiplicar por 3." : v === total ? `¡Casi! Ese es ${cant(1, g)} completo.` : null),
    };
  }
  const otras = ["½", "¼", "¾"].filter(x => x !== fr).map(x => fracU(x, g));
  return {
    tipo: "opciones", cols: 3,
    html: `¿Cuánto es <b>${cant(s, c)}</b>?`,
    opciones: opcionesDe(grande, otras, rnd), correcta: "ok",
    pista: `${uno}. ¿${cant(s, c)} es la mitad, la cuarta parte o tres cuartas partes?`,
    explica: `${uno}. ${como} Entonces ${cant(s, c)} = <b>${grande}</b>.`,
  };
}

// Temperaturas de la vida diaria: [pregunta, emoji, correcta, malas, explicación]
const TEMPERATURAS = [
  ["¿A qué temperatura hierve el agua?", "🫖", 100, [37, 10], "El agua hierve a 100 °C."],
  ["¿Qué temperatura tiene el cuerpo de una persona sana?", "🧍", 37, [100, 5], "El cuerpo de una persona sana está a unos 37 °C."],
  ["¿A qué temperatura se congela el agua y se hace hielo?", "🧊", 0, [37, 80], "El agua se congela a 0 °C."],
  ["¿Qué temperatura puede hacer en un día caluroso en Guanacaste?", "☀️", 35, [5, 90], "En un día caluroso en Guanacaste puede hacer unos 35 °C."],
  ["Si tenés fiebre, ¿qué puede marcar el termómetro?", "🤒", 39, [20, 70], "Con fiebre, el cuerpo pasa de 38 °C: por ejemplo, 39 °C."],
  ["¿Qué temperatura tiene el agua fría de la refri?", "🧃", 5, [50, 95], "En la refri, el agua se pone fría: unos 5 °C."],
  ["¿Qué temperatura puede hacer en una tarde fresca en San José?", "🌥️", 20, [60, 95], "Una tarde fresca en San José puede estar a unos 20 °C."],
];
function temperatura(rnd) {
  const tipo = azar(["leer", "leer", "estimar", "cambio"], rnd);
  if (tipo === "leer") {
    const v = entre(1, 24, rnd) * 2;
    return {
      tipo: "escribir", respuesta: v, sufijo: "°C",
      html: "🌡️ ¿Qué temperatura marca el termómetro?",
      dibujo: termometro(v),
      pista: "Buscá el número de abajo más cercano y contá las rayitas que siguen: cada rayita vale 2 grados.",
      explica: `Marca <b>${cant(v, "C")}</b>: ${v % 10 ? `del ${Math.floor(v / 10) * 10} subimos ${(v % 10) / 2} ${(v % 10) / 2 === 1 ? "rayita" : "rayitas"} de 2 °C.` : `el rojo llega justo a la raya del ${v}.`}`,
      casi: x => (Math.abs(x - v) === 1 ? "¡Casi! Cada rayita vale 2 grados, no 1." : Math.abs(x - v) === 2 ? "¡Casi! Contá otra vez las rayitas." : null),
    };
  }
  if (tipo === "estimar") {
    const [q, e, bien, malas, por] = azar(TEMPERATURAS, rnd);
    return {
      tipo: "opciones", cols: 3,
      html: `<span class="big">${e}</span> ${q}`,
      opciones: opcionesDe(cant(bien, "C"), malas.map(m => cant(m, "C")), rnd), correcta: "ok",
      pista: "El agua hierve a 100 °C y se congela a 0 °C. Nuestro cuerpo está a unos 37 °C.",
      explica: por.replace(`${bien} °C`, `<b>${cant(bien, "C")}</b>`),
    };
  }
  const a = entre(14, 24, rnd), d = entre(3, 12, rnd), sube = rnd() < 0.6;
  const [ini, fin] = sube ? [a, a + d] : [a + d, a];
  return {
    tipo: "escribir", respuesta: d, sufijo: "°C",
    html: `🌡️ En la mañana el termómetro marcaba <b>${cant(ini, "C")}</b> y en la ${sube ? "tarde" : "noche"} marcaba <b>${cant(fin, "C")}</b>. ¿Cuántos grados ${sube ? "subió" : "bajó"}?`,
    pista: "Restá la temperatura más baja a la más alta.",
    explica: `${Math.max(ini, fin)} − ${Math.min(ini, fin)} = ${d}. ${sube ? "Subió" : "Bajó"} <b>${cant(d, "C")}</b>.`,
    casi: x => (x === fin ? "¡Casi! Esa es la temperatura de la " + (sube ? "tarde" : "noche") + ". Te pregunté cuánto cambió: restá." : null),
  };
}

/** mm y km: con la regla grande (milímetros) o convirtiendo. */
function mmKm(rnd) {
  const tipo = azar(["regla", "cmmm", "cmmm", "kmm", "kmm"], rnd);
  if (tipo === "regla") {
    const s = entre(12, 58, rnd), cosa = azar(COSAS_REGLA, rnd);
    return {
      tipo: "escribir", respuesta: s, sufijo: "mm",
      html: `¿Cuántos <b>milímetros</b> mide ${cosa.n}?`,
      dibujo: regla({ hasta: 6, a: 0, b: s / 10, cosa, mm: true }),
      pista: "Cada centímetro tiene 10 rayitas pequeñas: cada una es un milímetro. Contá los centímetros completos y después las rayitas que sobran.",
      explica: `Llega a ${Math.floor(s / 10)} cm y ${s % 10} ${s % 10 === 1 ? "rayita" : "rayitas"} más: ${Math.floor(s / 10)} × 10 + ${s % 10} = ${s}. Mide <b>${cant(s, "mm")}</b> (${cant(s / 10, "cm")}).`,
      casi: v => (v === s / 10 ? "¡Casi! Esa es la medida en centímetros. Te pregunté en milímetros." : Math.abs(v - s) === 1 ? "¡Casi! Contá otra vez las rayitas pequeñas." : v === Math.floor(s / 10) ? "Esos son los centímetros completos. Faltan las rayitas que sobran." : null),
    };
  }
  if (tipo === "cmmm") {
    const s = rnd() < 0.5 ? entre(1, 15, rnd) * 10 : entre(11, 99, rnd);
    return conv("cmmm", s, s % 10 !== 0 || rnd() < 0.5);
  }
  const s = rnd() < 0.5 ? entre(1, 9, rnd) * 1000 : entre(3, 95, rnd) * 100;
  return conv("kmm", s, s % 1000 !== 0 || rnd() < 0.5);
}

/** Decimales: 1,5 L = 1 500 ml, 0,75 kg = 750 g, 3,5 m = 350 cm… */
function decimales(rnd) {
  const par = azar(["kgg", "lml", "mcm", "kgg", "lml"], rnd);
  let s;
  if (par === "mcm") do s = entre(21, 99, rnd) * 5; while (s % 100 === 0);
  else do s = azar([entre(1, 19, rnd) * 250, entre(1, 49, rnd) * 100, entre(1, 9, rnd) * 500], rnd); while (s % 1000 === 0);
  return conv(par, s, rnd() < 0.5);
}

/** ¿Qué es más? 1 200 g o 1 kg… */
function compararUnidades(rnd) {
  const par = azar(["kgg", "lml", "mcm", "kmm", "hmin", "semdia"], rnd), { g, c, f } = PARES[par];
  const tiempo = par === "hmin" || par === "semdia";
  const enteros = tiempo ? entre(1, 3, rnd) : null;
  const gS = tiempo ? enteros * f : azar([1, 2, 3, 1.5, 2.5, 0.5], rnd) * f; // la grande, en la unidad pequeña
  const rel = azar(["igual", "mas", "menos"], rnd);
  const delta = tiempo ? azar(par === "hmin" ? [10, 20, 30] : [1, 2, 3], rnd) : azar([0.1, 0.2, 0.3], rnd) * f;
  const cS = Math.round(rel === "igual" ? gS : rel === "mas" ? gS - delta : gS + delta);
  const A = cant(gS / f, g), B = cant(cS, c);
  const correcta = rel === "igual" ? "igual" : rel === "mas" ? "A" : "B";
  return {
    tipo: "opciones", cols: 3,
    html: `¿Qué es más: <b>${A}</b> o <b>${B}</b>?`,
    opciones: [{ id: "A", html: `<b>${A}</b>` }, { id: "B", html: `<b>${B}</b>` }, { id: "igual", html: "Son iguales" }],
    correcta,
    pista: `Pasalos a la misma unidad. Acordate: ${cant(1, g)} = ${cant(f, c)}.`,
    explica: `${A} = ${cant(gS, c)}. ${rel === "igual" ? `Entonces ${A} y ${B} <b>son iguales</b>.` : `${cant(Math.max(gS, cS), c)} es más que ${cant(Math.min(gS, cS), c)}, así que es más <b>${rel === "mas" ? A : B}</b>.`}`,
  };
}

/** Problemas de la casa y la feria. */
function problemaCasa(rnd) {
  const tipo = azar(["vasos", "receta", "tela", "botellas", "bolsas", "cinta", "leche", "mangos"], rnd);
  if (tipo === "vasos") {
    let T, v;
    do { T = azar([1000, 1500, 2000, 3000], rnd); v = azar([200, 250, 500], rnd); } while (T % v || T / v > 15 || (T / v) % 10 === 1);
    const fresco = azar(["fresco de cas", "fresco de mora", "agua dulce", "fresco de piña"], rnd);
    return {
      tipo: "escribir", respuesta: T / v, sufijo: "vasos",
      html: `🧃 Hay <b>${cant(T / 1000, "L")}</b> de ${fresco}. ¿Cuántos vasos de <b>${cant(v, "ml")}</b> se pueden llenar?`,
      pista: "Primero pasá los litros a mililitros: 1 L = 1 000 ml. Después dividí entre lo que le cabe a un vaso.",
      explica: `${cant(T / 1000, "L")} = ${cant(T, "ml")}. ${num(T)} ÷ ${v} = ${T / v}: se llenan <b>${T / v} vasos</b>.`,
      casi: x => (x === T / 1000 ? "¡Casi! Primero pasá los litros a mililitros." : null),
    };
  }
  if (tipo === "receta") {
    const B = azar([1, 2], rnd), r = azar([250, 300, 450, 600, 750], rnd);
    return {
      tipo: "escribir", respuesta: B * 1000 - r, sufijo: "g",
      html: `🍰 La receta del queque lleva <b>${cant(r, "g")}</b> de harina. Tenés una bolsa de <b>${cant(B, "kg")}</b>. ¿Cuántos gramos sobran?`,
      pista: "1 kg = 1 000 g. Pasá la bolsa a gramos y restá lo que lleva la receta.",
      explica: `${cant(B, "kg")} = ${cant(B * 1000, "g")}. ${num(B * 1000)} − ${r} = ${num(B * 1000 - r)}. Sobran <b>${cant(B * 1000 - r, "g")}</b>.`,
      casi: x => (x === B - r || x === r - B ? "¡Casi! Primero pasá los kilos a gramos." : null),
    };
  }
  if (tipo === "tela") {
    const M = entre(2, 5, rnd), u = entre(5, M * 10 - 3, rnd) * 10;
    return {
      tipo: "escribir", respuesta: M * 100 - u, sufijo: "cm",
      html: `🧵 Mamá compró <b>${cant(M, "m")}</b> de tela y usó <b>${cant(u, "cm")}</b> para un delantal. ¿Cuántos centímetros de tela le quedan?`,
      pista: "1 m = 100 cm. Pasá los metros a centímetros y restá.",
      explica: `${cant(M, "m")} = ${cant(M * 100, "cm")}. ${M * 100} − ${u} = ${M * 100 - u}. Le quedan <b>${cant(M * 100 - u, "cm")}</b>.`,
    };
  }
  if (tipo === "botellas") {
    const k = entre(2, 6, rnd), b = azar([1500, 2000, 500], rnd);
    return {
      tipo: "escribir", respuesta: (k * b) / 1000, sufijo: "L",
      html: `🍾 Para la fiesta compraron <b>${k} botellas</b> de <b>${cant(b / 1000, "L")}</b> de refresco. ¿Cuántos litros hay en total?`,
      pista: `Sumá ${k} veces ${cant(b / 1000, "L")}, o multiplicá.`,
      explica: `${k} × ${num(b / 1000)} = ${num((k * b) / 1000)}. Hay <b>${cant((k * b) / 1000, "L")}</b>.`,
      casi: x => (x === k * b ? "¡Casi! Esa cantidad es en mililitros. Te pregunté en litros." : null),
    };
  }
  if (tipo === "bolsas") {
    const T = entre(2, 9, rnd);
    return {
      tipo: "escribir", respuesta: 2 * T, sufijo: "bolsas",
      html: `🫘 Doña Rosa vende frijoles en bolsas de <b>½ kg</b>. Con <b>${cant(T, "kg")}</b>, ¿cuántas bolsas llena?`,
      pista: "En cada kilo caben dos bolsas de medio kilo.",
      explica: `Cada kilo alcanza para 2 bolsas de ½ kg: ${T} × 2 = ${2 * T}. Llena <b>${2 * T} bolsas</b>.`,
      casi: x => (x === T / 2 ? "¡Casi! Medio kilo es poquito: salen más bolsas que kilos." : null),
    };
  }
  if (tipo === "cinta") {
    let L, p;
    do { L = entre(1, 3, rnd); p = azar([20, 25, 50], rnd); } while ((L * 100 / p) % 10 === 1);
    return {
      tipo: "escribir", respuesta: (L * 100) / p, sufijo: "pedazos",
      html: `🎀 Una cinta de <b>${cant(L, "m")}</b> se corta en pedazos de <b>${cant(p, "cm")}</b>. ¿Cuántos pedazos salen?`,
      pista: "Pasá los metros a centímetros y dividí entre lo que mide cada pedazo.",
      explica: `${cant(L, "m")} = ${cant(L * 100, "cm")}. ${L * 100} ÷ ${p} = ${(L * 100) / p}. Salen <b>${(L * 100) / p} pedazos</b>.`,
    };
  }
  if (tipo === "leche") {
    const d = azar([4, 6, 8, 10, 12], rnd), v = 250;
    return {
      tipo: "escribir", respuesta: (d * v) / 1000, sufijo: "L",
      html: `🥛 Sofía se toma <b>${cant(v, "ml")}</b> de leche cada día. ¿Cuántos litros se toma en <b>${d} días</b>?`,
      pista: "Multiplicá y después pasá los mililitros a litros: 1 000 ml = 1 L.",
      explica: `${d} × ${v} = ${num(d * v)} ml, y ${cant(d * v, "ml")} = <b>${cant((d * v) / 1000, "L")}</b>.`,
      casi: x => (x === d * v ? "¡Casi! Esa cantidad es en mililitros. Pasala a litros." : null),
    };
  }
  const k = entre(2, 8, rnd), p = azar([250, 500, 200], rnd);
  return {
    tipo: "escribir", respuesta: (k * p) / 1000, sufijo: "kg",
    html: `🥭 Una bolsa tiene <b>${k} mangos</b> y cada uno pesa unos <b>${cant(p, "g")}</b>. ¿Cuántos kilos pesa la bolsa?`,
    pista: "Multiplicá y después pasá los gramos a kilos: 1 000 g = 1 kg.",
    explica: `${k} × ${p} = ${num(k * p)} g, y ${cant(k * p, "g")} = <b>${cant((k * p) / 1000, "kg")}</b>.`,
    casi: x => (x === k * p ? "¡Casi! Esa cantidad es en gramos. Pasala a kilos." : null),
  };
}

/** Problemas de tiempo y distancia. */
function problemaTiempo(rnd) {
  const tipo = azar(["pelicula", "pista", "escuela", "semanas", "pulperia", "tamales", "bus"], rnd);
  if (tipo === "pelicula") {
    const h = entre(1, 2, rnd), m = azar([15, 20, 30, 40, 45, 50], rnd);
    return {
      tipo: "escribir", respuesta: h * 60 + m, sufijo: "min",
      html: `🎬 Una película dura <b>${cant(h, "h")} ${cant(m, "min")}</b>. ¿Cuántos minutos dura en total?`,
      pista: "1 h = 60 min. Pasá las horas a minutos y sumale los minutos que sobran.",
      explica: `${cant(h, "h")} = ${cant(h * 60, "min")}, y ${h * 60} + ${m} = ${h * 60 + m}. Dura <b>${cant(h * 60 + m, "min")}</b>.`,
      casi: x => (x === h * 100 + m || x === h + m ? "¡Casi! Una hora tiene 60 minutos, no 100." : x === h * 60 ? "¡Casi! Te faltó sumar los minutos." : null),
    };
  }
  if (tipo === "pista") {
    const k = entre(2, 10, rnd);
    return {
      tipo: "escribir", respuesta: (k * 400) / 1000, sufijo: "km",
      html: `🏃 Una vuelta a la pista mide <b>${cant(400, "m")}</b>. Si das <b>${k} vueltas</b>, ¿cuántos kilómetros corrés?`,
      pista: "Multiplicá para saber los metros y después pasalos a kilómetros: 1 000 m = 1 km.",
      explica: `${k} × 400 = ${num(k * 400)} m, y ${cant(k * 400, "m")} = <b>${cant((k * 400) / 1000, "km")}</b>.`,
      casi: x => (x === k * 400 ? "¡Casi! Esa cantidad es en metros. Pasala a kilómetros." : null),
    };
  }
  if (tipo === "escuela") {
    const d = azar([350, 450, 500, 600, 750, 850], rnd), total = d * 2 * 5;
    return {
      tipo: "escribir", respuesta: total / 1000, sufijo: "km",
      html: `🏫 De la casa a la escuela hay <b>${cant(d, "m")}</b>. Si vas y volvés caminando de lunes a viernes, ¿cuántos kilómetros caminás en la semana?`,
      pista: "Cada día caminás dos veces ese camino (ida y vuelta), y son 5 días. Después pasá los metros a kilómetros.",
      explica: `Cada día: ${d} × 2 = ${num(d * 2)} m. En 5 días: ${num(d * 2)} × 5 = ${num(total)} m = <b>${cant(total / 1000, "km")}</b>.`,
      casi: x => (x === total ? "¡Casi! Esa cantidad es en metros. Pasala a kilómetros." : x === (d * 5) / 1000 ? "¡Casi! Acordate de que vas y volvés: son dos caminos por día." : null),
    };
  }
  if (tipo === "semanas") {
    const s = entre(1, 6, rnd), d = entre(1, 6, rnd);
    return {
      tipo: "escribir", respuesta: s * 7 + d, sufijo: "días",
      html: `🗓️ Faltan <b>${cant(s, "semana")} y ${cant(d, "dia")}</b> para las vacaciones. ¿Cuántos días faltan?`,
      pista: "Cada semana tiene 7 días. Multiplicá y sumá los días que sobran.",
      explica: `${s} × 7 = ${s * 7}, y ${s * 7} + ${d} = ${s * 7 + d}. Faltan <b>${s * 7 + d} días</b>.`,
      casi: x => (x === s + d ? "¡Casi! Primero pasá las semanas a días: cada una tiene 7." : x === s * 7 ? "¡Casi! Te faltó sumar los días que sobran." : null),
    };
  }
  if (tipo === "pulperia") {
    const h = azar([8, 10, 12], rnd), d = azar([5, 6, 7], rnd);
    return {
      tipo: "escribir", respuesta: h * d, sufijo: "horas",
      html: `🏪 La pulpería abre <b>${h} horas</b> cada día, <b>${d} días</b> a la semana. ¿Cuántas horas abre en la semana?`,
      pista: "Multiplicá las horas de un día por los días.",
      explica: `${h} × ${d} = ${h * d}. Abre <b>${h * d} horas</b> en la semana.`,
    };
  }
  if (tipo === "tamales") {
    const m = azar([90, 120, 150, 180, 210], rnd);
    return {
      tipo: "escribir", respuesta: m / 60, sufijo: "h",
      html: `🫔 Los tamales se cocinan durante <b>${cant(m, "min")}</b>. ¿Cuántas horas son?`,
      pista: "Cada hora tiene 60 minutos. Dividí entre 60 (media hora son 30 minutos).",
      explica: `${m} ÷ 60 = ${num(m / 60)}. Son <b>${cant(m / 60, "h")}</b>.`,
      casi: x => (x === m / 100 ? "¡Casi! Una hora tiene 60 minutos, no 100." : null),
    };
  }
  const v = azar([40, 50, 60], rnd), h = entre(2, 4, rnd);
  return {
    tipo: "escribir", respuesta: v * h, sufijo: "km",
    html: `🚌 Un bus avanza <b>${cant(v, "km")}</b> cada hora. ¿Cuántos kilómetros avanza en <b>${cant(h, "h")}</b>?`,
    pista: "Cada hora avanza lo mismo: multiplicá.",
    explica: `${v} × ${h} = ${v * h}. Avanza <b>${cant(v * h, "km")}</b>.`,
  };
}

// ---------- Escalones ----------
// grado: para el papá o la maestra · gen(rnd): arma una pregunta
export const ESCALONES = [
  { id: "comparar", nombre: "Más largo, más pesado, más lleno", grado: "2°", gen: comparar },
  { id: "regla", nombre: "Medir con la regla", grado: "2°", gen: rnd => medir(rnd, { con0: true, escribir: false }) },
  { id: "regla-escribir", nombre: "Medir y escribir", grado: "2°", gen: rnd => medir(rnd, { con0: true, escribir: true }) },
  { id: "estimar", nombre: "¿Cuánto será? cm, m, g, kg", grado: "2°", gen: rnd => estimar(ESTIMAR_1, rnd) },
  { id: "estimar-2", nombre: "¿Cuánto será? ml, L, mm, km", grado: "3°", gen: rnd => estimar(ESTIMAR_2, rnd) },
  { id: "unidad", nombre: "¿Qué unidad conviene?", grado: "3°", gen: unidad },
  { id: "regla-sin-0", nombre: "La regla sin empezar en 0", grado: "3°", gen: rnd => medir(rnd, { con0: false, escribir: true }) },
  { id: "m-cm", nombre: "Metros y centímetros", grado: "3°", gen: rnd => conv("mcm", entre(1, rnd() < 0.7 ? 9 : 20, rnd) * 100, rnd() < 0.4) },
  { id: "kg-l", nombre: "Kilos y gramos, litros y mililitros", grado: "3°", gen: rnd => conv(rnd() < 0.5 ? "kgg" : "lml", entre(1, 9, rnd) * 1000, rnd() < 0.4) },
  { id: "tiempo", nombre: "Horas, minutos, días y semanas", grado: "3°", gen: rnd => {
    const par = azar(["hmin", "hmin", "mins", "diah", "semdia", "aniomes"], rnd), f = PARES[par].f;
    return conv(par, entre(1, par === "diah" ? 3 : 5, rnd) * f, rnd() < 0.35);
  } },
  { id: "fracciones", nombre: "½ kg, ¼ h, ¾ L", grado: "4°", gen: fracciones },
  { id: "temperatura", nombre: "La temperatura", grado: "4°", gen: temperatura },
  { id: "mm-km", nombre: "Milímetros y kilómetros", grado: "4°", gen: mmKm },
  { id: "decimales", nombre: "Con decimales: 1,5 L = 1 500 ml", grado: "5°", gen: decimales },
  { id: "que-es-mas", nombre: "¿Qué es más?", grado: "5°", gen: compararUnidades },
  { id: "problemas-casa", nombre: "Problemas de la casa y la feria", grado: "5°", gen: problemaCasa },
  { id: "problemas-tiempo", nombre: "Problemas de tiempo y distancia", grado: "6°", gen: problemaTiempo },
];

// Grupos para escoger a mano (papá o maestra): índices de ESCALONES
export const GRUPOS = [
  { id: "medir", nombre: "📏 Medir", escalones: [0, 1, 2, 6] },
  { id: "estimar", nombre: "🤔 Estimar", escalones: [3, 4, 5, 11] },
  { id: "convertir", nombre: "🔁 Convertir", escalones: [7, 8, 9, 10, 12, 13, 14] },
  { id: "problemas", nombre: "🧺 Problemas", escalones: [15, 16] },
];

/** Escalón inicial según la edad: se empieza abajo y, al principio, se sube rápido. */
export const inicioPorEdad = edad => (edad === null || edad <= 7 ? 0 : edad === 8 ? 3 : edad === 9 ? 6 : edad === 10 ? 9 : edad === 11 ? 11 : 13);

/** Una pregunta del escalón i. */
export function pregunta(i, rnd = Math.random) {
  const p = { escalon: ESCALONES[i].id, ...ESCALONES[i].gen(rnd) };
  // «¡Casi!» nunca para la respuesta correcta
  if (p.casi) { const casi = p.casi; p.casi = v => (Math.abs(v - p.respuesta) < 1e-9 ? null : casi(v)); }
  return p;
}

/** Lo que escribió el niño → número (o NaN). Acepta coma o punto decimal, espacios de miles y la unidad al final. */
export function leer(texto) {
  let t = String(texto).trim().replace(/\s+(?=\d{3}(?!\d))/g, "");
  // la unidad al final («250 ml», «3,5kg», «45 min»): se quita
  t = t.replace(/\s*(°\s?c|[a-záéíóúñ]+)\.?$/i, "").trim();
  if (!/^\d+(?:[.,]\d+)?$/.test(t)) return NaN;
  return Number(t.replace(",", "."));
}
/** ¿Está bien lo que escribió? Coma o punto decimal, y punto de miles («1.500»). */
export function bienEscrito(p, texto) {
  const v = leer(texto);
  if (Number.isNaN(v)) return false;
  const limpio = String(texto).trim().replace(/\s*(°\s?c|[a-záéíóúñ]+)\.?$/i, "");
  return Math.abs(v - p.respuesta) < 1e-9 || igual(String(p.respuesta), limpio, true);
}

// ---------- Revisión (para las pruebas con node) ----------
/** Revisa una pregunta. Devuelve una lista de problemas (vacía = bien). */
export function revisarPregunta(p) {
  const mal = [];
  if (!p.html || !p.pista || !p.explica) mal.push("faltan textos");
  const todo = p.html + p.explica + p.pista + (p.opciones || []).map(o => o.html).join("");
  if (/undefined|NaN|null|\[object/.test(todo)) mal.push("texto con undefined o NaN");
  if (/\d\.\d/.test(sinEtiquetas(p.html + p.explica + p.pista))) mal.push("decimal con punto en vez de coma");
  // la voz: unidades con palabras, sin «1 kilos» ni «21 días» sin apócope
  const voz = paraVoz(p.voz || p.html) + " " + paraVoz(p.explica) + " " + paraVoz(p.pista);
  if (/(^|[^\d,])1 (milímetros|centímetros|metros|kilómetros|gramos|kilos|mililitros|litros|horas|minutos|segundos|días|semanas|meses|años|grados)/.test(voz)) mal.push(`voz con «1 …s»: ${voz}`);
  if (/(^|[^\d,])(\d*[02-9]1|1) [a-záéíóúñ]/.test(voz.replace(/(^|[^\d,])\d*1 (y|de|son|por|entre|más|menos)(?![\wáéíóúñ])/g, ""))) mal.push(`voz sin apócope: ${voz}`);
  if (/(^|[^\wáéíóúñ])(mm|cm|km|kg|ml|min)(?![\wáéíóúñ])|\d\s?(m|g|L|h|s)(?![\wáéíóúñ])|°C/.test(voz)) mal.push(`voz con abreviatura: ${voz}`);
  if (/[<>]/.test(voz)) mal.push("voz con etiquetas");
  if (p.tipo === "opciones") {
    const ids = p.opciones.map(o => o.id), htmls = p.opciones.map(o => o.html);
    if (new Set(ids).size !== ids.length || new Set(htmls).size !== htmls.length) mal.push("opciones repetidas");
    if (!ids.includes(p.correcta)) mal.push("la correcta no está");
    if (p.opciones.length < 2) mal.push("pocas opciones");
  } else if (p.tipo === "escribir") {
    if (!Number.isFinite(p.respuesta) || p.respuesta <= 0) mal.push(`respuesta rara: ${p.respuesta}`);
    const decs = (String(p.respuesta).split(".")[1] || "").length;
    if (decs > 3) mal.push(`respuesta con muchos decimales: ${p.respuesta}`);
    const txt = num(p.respuesta);
    if (!bienEscrito(p, txt)) mal.push(`no acepta ${txt}`);
    if (!bienEscrito(p, txt.replace(",", "."))) mal.push(`no acepta el punto: ${txt}`);
    if (!bienEscrito(p, txt.replace(/\u00a0/g, ""))) mal.push(`no acepta sin espacio: ${txt}`);
    if (!bienEscrito(p, txt.replace(/\u00a0/g, " "))) mal.push(`no acepta con espacio: ${txt}`);
    if (p.sufijo && !bienEscrito(p, `${txt} ${p.sufijo}`)) mal.push(`no acepta con la unidad: ${txt} ${p.sufijo}`);
    if (bienEscrito(p, String(p.respuesta + 1))) mal.push("acepta una respuesta mala");
    if (p.casi && p.casi(p.respuesta)) mal.push("la respuesta correcta sale como «casi»");
  } else mal.push(`tipo raro: ${p.tipo}`);
  return mal;
}

/** Corre muchas preguntas de cada escalón y devuelve los problemas encontrados ([] = todo bien). */
export function revisarMedidas(n = 3000, rnd = Math.random) {
  const mal = [];
  ESCALONES.forEach((e, i) => {
    for (let k = 0; k < n; k++) {
      const p = pregunta(i, rnd);
      for (const m of revisarPregunta(p)) mal.push(`${e.id}: ${m} | ${sinEtiquetas(p.html)}`);
      if (mal.length > 40) return;
    }
  });
  // examen
  for (let g = 2; g <= 6; g++) for (let k = 0; k < n / 3; k++) {
    const q = preguntaExamen(rnd, g);
    if (!q.texto || !q.correcta || !q.explica) mal.push(`examen ${g}°: faltan textos`);
    if (q.tipo === "opcion" && (!q.opciones.includes(q.correcta) || new Set(q.opciones).size !== q.opciones.length)) mal.push(`examen ${g}°: opciones malas`);
    if (q.tipo === "numero" && !igual(q.correcta, q.correcta.replace(",", "."), true)) mal.push(`examen ${g}°: número raro ${q.correcta}`);
    if (/<svg/.test(q.texto)) mal.push(`examen ${g}°: con dibujo`);
  }
  return [...new Set(mal)];
}

// ---------- Examen ----------
// Escalones que sirven en papel (sin dibujos), por grado
const PARA_EXAMEN = { 2: [3, 7], 3: [3, 4, 5, 7, 8, 9], 4: [5, 8, 9, 10, 11, 12], 5: [10, 12, 13, 14, 15], 6: [13, 14, 15, 16] };
/**
 * Una pregunta para «Preparate para el examen» (formato de js/examen-temas.js).
 * @param {() => number} r  el azar del examen · @param {number} g  grado (2 a 6)
 */
export function preguntaExamen(r, g) {
  const lista = PARA_EXAMEN[Math.min(6, Math.max(2, g))];
  let p;
  do p = pregunta(lista[Math.floor(r() * lista.length)], r); while (p.dibujo);
  if (p.tipo === "opciones") {
    const texto = o => sinEtiquetas(o.html).replace(/\s+/g, " ").trim();
    return { texto: p.html, tipo: "opcion", opciones: p.opciones.map(texto), correcta: texto(p.opciones.find(o => o.id === p.correcta)), explica: p.explica };
  }
  const unidadTxt = p.sufijo in POR_ABREV ? ` <small>(en ${p.sufijo})</small>` : "";
  return { texto: p.html + unidadTxt, tipo: "numero", correcta: num(p.respuesta).replace(/\u00a0/g, ""), explica: p.explica };
}
