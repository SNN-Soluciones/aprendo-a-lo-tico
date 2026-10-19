// 🐝 Contenido de «Ortografía» (usa el motor js/quiz.js).
// Cada palabra: w (bien escrita), i (dónde está la letra que falta), l (la letra; "" = no lleva h), e (dibujo).
// No se usan palabras que cambian de significado con otra letra (ola/hola, echo/hecho, tubo/tuvo…).
import { barajar } from "./quiz.js";

const BV = [
  ["vaca", 0, "v", "🐄"], ["burro", 0, "b", "🫏"], ["ventana", 0, "v", "🪟"], ["bicicleta", 0, "b", "🚲"], ["invierno", 2, "v", "🌧️"],
  ["cambio", 3, "b", "🔄"], ["hombre", 3, "b", "👨"], ["escribir", 5, "b", "✍️"], ["cantaba", 5, "b", "🎤"], ["volcán", 0, "v", "🌋"],
  ["bosque", 0, "b", "🌳"], ["nube", 2, "b", "☁️"], ["vaso", 0, "v", "🥛"], ["árbol", 2, "b", "🌳"], ["llave", 3, "v", "🔑"],
  ["lluvia", 3, "v", "🌧️"], ["tambor", 3, "b", "🥁"], ["sombrero", 3, "b", "🤠"], ["abeja", 1, "b", "🐝"], ["avión", 1, "v", "✈️"],
  ["uva", 1, "v", "🍇"], ["bandera", 0, "b", "🚩"], ["vela", 0, "v", "🕯️"], ["enviar", 2, "v", "📨"], ["jugaba", 4, "b", "⚽"],
  ["caballo", 2, "b", "🐴"], ["lobo", 2, "b", "🐺"], ["nieve", 3, "v", "❄️"], ["subir", 2, "b", "🧗"], ["bailaba", 5, "b", "💃"],
  ["nombre", 3, "b", "📛"], ["hambre", 3, "b", "😋"], ["bombillo", 3, "b", "💡"], ["invitar", 2, "v", "💌"], ["envase", 2, "v", "🫙"],
  ["recibir", 4, "b", "🎁"], ["saltaba", 5, "b", "🤸"], ["nadaba", 4, "b", "🏊"],
];
const SCZ = [
  ["casa", 2, "s", "🏠"], ["cielo", 0, "c", "🌤️"], ["zapato", 0, "z", "👟"], ["taza", 2, "z", "☕"], ["lápiz", 4, "z", "✏️"],
  ["lápices", 4, "c", "✏️✏️"], ["cereza", 4, "z", "🍒"], ["cocina", 2, "c", "🍳"], ["mesa", 2, "s", "🍽️"], ["zanahoria", 0, "z", "🥕"],
  ["pez", 2, "z", "🐟"], ["peces", 2, "c", "🐟🐟"], ["dulce", 3, "c", "🍬"], ["feliz", 4, "z", "😄"], ["felices", 4, "c", "😄😄"],
  ["cerdo", 0, "c", "🐷"], ["sopa", 0, "s", "🍲"], ["azul", 1, "z", "🔵"], ["cinco", 0, "c", "5️⃣"], ["silla", 0, "s", "🪑"],
  ["cebolla", 0, "c", "🧅"], ["lazo", 2, "z", "🎀"], ["zorro", 0, "z", "🦊"], ["cisne", 0, "c", "🦢"], ["sol", 0, "s", "☀️"],
  ["luz", 2, "z", "💡"], ["luces", 2, "c", "💡💡"], ["nuez", 3, "z", "🌰"], ["nueces", 3, "c", "🌰🌰"],
];
const H = [
  ["huevo", 0, "h", "🥚"], ["hormiga", 0, "h", "🐜"], ["helado", 0, "h", "🍦"], ["hoja", 0, "h", "🍃"], ["hielo", 0, "h", "🧊"],
  ["huerta", 0, "h", "🥬"], ["hueso", 0, "h", "🦴"], ["almohada", 4, "h", "🛏️"], ["zanahoria", 4, "h", "🥕"], ["búho", 2, "h", "🦉"],
  ["hamaca", 0, "h", "🏝️"], ["hospital", 0, "h", "🏥"], ["hermano", 0, "h", "👦"], ["humo", 0, "h", "💨"],
  ["huella", 0, "h", "🐾"],
  ["oso", 0, "", "🐻"], ["ojo", 0, "", "👁️"], ["uva", 0, "", "🍇"], ["isla", 0, "", "🏝️"], ["abeja", 0, "", "🐝"],
  ["árbol", 0, "", "🌳"], ["elefante", 0, "", "🐘"], ["estrella", 0, "", "⭐"], ["avión", 0, "", "✈️"], ["ardilla", 0, "", "🐿️"],
];

const palabra = ([w, i, l, e], grupo) => ({ w, i, l, e, grupo });

/** La regla que ayuda con esta palabra (o una frase para aprenderla de memoria). */
export function regla(p) {
  const { w, l, grupo } = p;
  if (grupo === "bv") {
    if (/mb/.test(w)) return "Antes de <b>b</b> siempre va <b>m</b>: mb (cambio, hombre, tambor).";
    if (/nv/.test(w)) return "Después de <b>n</b> va <b>v</b>: nv (invierno, enviar).";
    if (/bir$/.test(w)) return "Los verbos que terminan en <b>-bir</b> van con b (escribir, subir).";
    if (/aba$/.test(w)) return "Las palabras que terminan en <b>-aba</b> (cantaba, jugaba, bailaba) van con b.";
    return "En español la b y la v suenan igual: hay que aprendérsela de memoria. ¡Leer mucho ayuda!";
  }
  if (grupo === "scz") {
    if (/ces$/.test(w)) return `Si en singular termina en <b>z</b> (${w.slice(0, -3)}z), en plural cambia a <b>ces</b>.`;
    if (l === "z" && /z$/.test(w)) return "Al final de la palabra suena igual, pero esta se escribe con <b>z</b>. En plural cambia a <b>ces</b>.";
    if (l === "c") return "La <b>c</b> suena como s antes de <b>e</b> y de <b>i</b> (ce, ci).";
    return "En Costa Rica la s, la c y la z suenan igual: hay que aprendérsela de memoria.";
  }
  if (!l) return "No lleva h.";
  if (/^hue/.test(w)) return "Las palabras que empiezan con <b>hue-</b> llevan h (huevo, hueso, huerta).";
  return "Lleva <b>h</b> aunque no suena: la h es muda.";
}

const OPC = {
  bv: [{ id: "b", html: "<b>b</b>" }, { id: "v", html: "<b>v</b>" }],
  scz: [{ id: "s", html: "<b>s</b>" }, { id: "c", html: "<b>c</b>" }, { id: "z", html: "<b>z</b>" }],
  h: [{ id: "h", html: "<b>h</b>Con h" }, { id: "sin", html: "<b>—</b>Sin h" }],
};

function pregunta(p) {
  const antes = p.w.slice(0, p.i), despues = p.w.slice(p.i + p.l.length);
  return {
    html: `<span class="grande">${p.e}</span><span style="font-size:2.2rem;letter-spacing:2px">${antes}<span class="hueco">?</span>${despues}</span>`,
    voz: `${p.w}. ¿Qué letra falta?`,
    opciones: OPC[p.grupo], correcta: p.l || "sin",
    explica: `Se escribe <b>${p.w}</b>. ${regla(p)}`,
  };
}

const N = 10;
const ronda = (lista, rnd) => barajar(lista, rnd).slice(0, N).map(pregunta);
const TODAS = { bv: BV.map(x => palabra(x, "bv")), scz: SCZ.map(x => palabra(x, "scz")), h: H.map(x => palabra(x, "h")) };

/** Qué regla ayuda con la palabra: mb, nv, bir, aba, ces, zfinal, c, hue, h, sin o memoria. */
export function reglaDe({ w, l, grupo }) {
  if (grupo === "bv") return /mb/.test(w) ? "mb" : /nv/.test(w) ? "nv" : /bir$/.test(w) ? "bir" : /aba$/.test(w) ? "aba" : "memoria";
  if (grupo === "scz") return /ces$/.test(w) ? "ces" : l === "z" && /z$/.test(w) ? "zfinal" : l === "c" ? "c" : "memoria";
  return !l ? "sin" : /^hue/.test(w) ? "hue" : "h";
}

// ---------- 🪜 De a poquito: primero las palabras que siguen una regla (con la pista), después todas ----------
const conRegla = (lista, reglas) => lista.filter(p => reglas.includes(reglaDe(p)));
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
// Primero se escoge la letra que va (b o v, con h o sin h…) y después una palabra: así no conviene tocar siempre la misma
const de = lista => {
  const letras = [...new Set(lista.map(p => p.l || "sin"))];
  return rnd => { const l = azar(letras, rnd); return pregunta(azar(lista.filter(p => (p.l || "sin") === l), rnd)); };
};
const mezcla = [de(TODAS.bv), de(TODAS.scz), de(TODAS.h)];
export const ESCALONES = [
  { nombre: "🥚 ¿Con H? hue-", instr: "¿Lleva <b>h</b>? 💡 <small>hue- lleva h</small>", gen: de(conRegla(TODAS.h, ["hue", "sin"])) },
  { nombre: "🐄 mb y nv", instr: "¿<b>b</b> o <b>v</b>? 💡 <small>mb · nv</small>", gen: de(conRegla(TODAS.bv, ["mb", "nv"])) },
  { nombre: "🐄 -aba, -bir y nv", instr: "¿<b>b</b> o <b>v</b>? 💡 <small>-aba · -bir · nv</small>", gen: de(conRegla(TODAS.bv, ["aba", "bir", "nv"])) },
  { nombre: "🦊 z y -ces", instr: "¿<b>s</b>, <b>c</b> o <b>z</b>? 💡 <small>luz → luces</small>", gen: de(conRegla(TODAS.scz, ["ces", "zfinal"])) },
  { nombre: "🐄 B o V: todas", instr: "¿Va con <b>b</b> o con <b>v</b>?", gen: de(TODAS.bv) },
  { nombre: "🥚 ¿Con H? todas", instr: "¿Lleva <b>h</b> o no?", gen: de(TODAS.h) },
  { nombre: "🦊 S, C o Z: todas", instr: "¿Va con <b>s</b>, <b>c</b> o <b>z</b>?", gen: de(TODAS.scz) },
  { nombre: "🐝 Mezcla", instr: "¿Qué <b>letra</b> falta?", gen: rnd => azar(mezcla, rnd)(rnd) },
];
export const inicio = edad => (edad === null || edad <= 8 ? 0 : edad === 9 ? 1 : edad === 10 ? 3 : edad === 11 ? 4 : 5);

let ultima = "";
/** Una pregunta del escalón i, que no sea la misma que la anterior. */
export function preguntaDe(i, rnd = Math.random) {
  let p;
  for (let k = 0; k < 20; k++) { p = ESCALONES[i].gen(rnd); if (p.voz !== ultima) break; }
  ultima = p.voz;
  return p;
}

export const JUEGO = {
  clave: "ortografia",
  textos: { fin3: "¡Excelente! Escribís sin faltas de ortografía." },
  escalera: { id: "ortografia", escalones: ESCALONES.map((e, i) => ({ nombre: e.nombre, instr: e.instr, pregunta: () => preguntaDe(i) })), inicio },
  modos: [
    { id: "bv", nombre: "🐄 B o V", instr: "¿Va con <b>b</b> o con <b>v</b>?", preguntas: (rnd = Math.random) => ronda(TODAS.bv, rnd) },
    { id: "scz", nombre: "🦊 S, C o Z", instr: "¿Va con <b>s</b>, <b>c</b> o <b>z</b>?", preguntas: (rnd = Math.random) => ronda(TODAS.scz, rnd) },
    { id: "h", nombre: "🥚 ¿Con H?", instr: "¿Lleva <b>h</b> o no?", preguntas: (rnd = Math.random) => ronda(TODAS.h, rnd) },
    { id: "mezcla", nombre: "🐝 Mezcla", instr: "¿Qué <b>letra</b> falta?", preguntas: (rnd = Math.random) => ronda([...TODAS.bv, ...TODAS.scz, ...TODAS.h], rnd) },
  ],
};

export { TODAS };

// ---------- Revisar (para las pruebas con node) ----------
/** Cada palabra: la letra que falta está donde dice, y hay pocas palabras de cada regla para que no se repitan tanto. */
export function revisarOrtografia(n = 500, rnd = Math.random) {
  const e = new Set();
  const todas = [...TODAS.bv, ...TODAS.scz, ...TODAS.h];
  todas.forEach(p => {
    if (p.l && p.w.slice(p.i, p.i + p.l.length) !== p.l) e.add(`la letra no está en su lugar: ${p.w}`);
    if (!p.l && p.grupo === "h" && p.w[0] === "h") e.add(`dice sin h pero empieza con h: ${p.w}`);
    if (!OPC[p.grupo].some(o => o.id === (p.l || "sin"))) e.add(`letra sin opción: ${p.w}`);
  });
  [...TODAS.bv, ...TODAS.scz].forEach(p => { if (new Set(todas.filter(x => x.grupo === p.grupo && x.w === p.w).map(x => x.i)).size > 1) e.add(`palabra repetida con otro hueco: ${p.w}`); });
  // Los plurales en -ces: el singular sale bien
  TODAS.scz.filter(p => reglaDe(p) === "ces").forEach(p => { if (!/ \(\S+z\)/.test(regla(p))) e.add(`singular raro: ${p.w}`); });
  const reglas = [["hue", "sin"], ["mb", "nv"], ["aba", "bir", "nv"], ["ces", "zfinal"]];
  ESCALONES.forEach((esc, i) => {
    for (let k = 0; k < n; k++) {
      const p = esc.gen(rnd);
      if (new Set(p.opciones.map(o => o.id)).size !== p.opciones.length || !p.opciones.some(o => o.id === p.correcta)) e.add(`escalón ${i + 1}: opciones mal: ${p.voz}`);
      if (i < reglas.length) {
        const w = p.voz.split(".")[0], x = todas.find(y => y.w === w && (y.l || "sin") === p.correcta);
        if (!x || !reglas[i].includes(reglaDe(x))) e.add(`escalón ${i + 1}: ${w} no sigue la regla`);
      }
    }
  });
  reglas.forEach((r, i) => { if (conRegla(todas, r).length < 6) e.add(`escalón ${i + 1}: menos de 6 palabras`); });
  // Cada letra sale más o menos la mitad de las veces (o un tercio en s, c, z)
  ESCALONES.forEach((esc, i) => {
    const cuenta = {};
    for (let k = 0; k < 3000; k++) { const c = esc.gen(rnd).correcta; cuenta[c] = (cuenta[c] || 0) + 1; }
    const v = Object.values(cuenta);
    if (i < 7 && Math.max(...v) > 3000 / v.length * 1.15) e.add(`escalón ${i + 1}: una letra sale demasiado ${JSON.stringify(cuenta)}`);
  });
  return [...e];
}
