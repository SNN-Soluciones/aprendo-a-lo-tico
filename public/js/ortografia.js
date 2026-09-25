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
];
const SCZ = [
  ["casa", 2, "s", "🏠"], ["cielo", 0, "c", "🌤️"], ["zapato", 0, "z", "👟"], ["taza", 2, "z", "☕"], ["lápiz", 4, "z", "✏️"],
  ["lápices", 4, "c", "✏️✏️"], ["cereza", 4, "z", "🍒"], ["cocina", 2, "c", "🍳"], ["mesa", 2, "s", "🍽️"], ["zanahoria", 0, "z", "🥕"],
  ["pez", 2, "z", "🐟"], ["peces", 2, "c", "🐟🐟"], ["dulce", 3, "c", "🍬"], ["feliz", 4, "z", "😄"], ["felices", 4, "c", "😄😄"],
  ["cerdo", 0, "c", "🐷"], ["sopa", 0, "s", "🍲"], ["azul", 1, "z", "🔵"], ["cinco", 0, "c", "5️⃣"], ["silla", 0, "s", "🪑"],
  ["cebolla", 0, "c", "🧅"], ["lazo", 2, "z", "🎀"], ["zorro", 0, "z", "🦊"], ["cisne", 0, "c", "🦢"], ["sol", 0, "s", "☀️"],
];
const H = [
  ["huevo", 0, "h", "🥚"], ["hormiga", 0, "h", "🐜"], ["helado", 0, "h", "🍦"], ["hoja", 0, "h", "🍃"], ["hielo", 0, "h", "🧊"],
  ["huerta", 0, "h", "🥬"], ["hueso", 0, "h", "🦴"], ["almohada", 4, "h", "🛏️"], ["zanahoria", 4, "h", "🥕"], ["búho", 2, "h", "🦉"],
  ["hamaca", 0, "h", "🏝️"], ["hospital", 0, "h", "🏥"], ["hermano", 0, "h", "👦"], ["humo", 0, "h", "💨"],
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
    if (/ces$/.test(w)) return `Si en singular termina en <b>z</b> (${w === "lápices" ? "lápiz" : w === "peces" ? "pez" : "feliz"}), en plural cambia a <b>ces</b>.`;
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

export const JUEGO = {
  clave: "ortografia",
  textos: { fin3: "¡Excelente! Escribís sin faltas de ortografía." },
  modos: [
    { id: "bv", nombre: "🐄 B o V", instr: "¿Va con <b>b</b> o con <b>v</b>?", preguntas: (rnd = Math.random) => ronda(TODAS.bv, rnd) },
    { id: "scz", nombre: "🦊 S, C o Z", instr: "¿Va con <b>s</b>, <b>c</b> o <b>z</b>?", preguntas: (rnd = Math.random) => ronda(TODAS.scz, rnd) },
    { id: "h", nombre: "🥚 ¿Con H?", instr: "¿Lleva <b>h</b> o no?", preguntas: (rnd = Math.random) => ronda(TODAS.h, rnd) },
    { id: "mezcla", nombre: "🐝 Mezcla", instr: "¿Qué <b>letra</b> falta?", preguntas: (rnd = Math.random) => ronda([...TODAS.bv, ...TODAS.scz, ...TODAS.h], rnd) },
  ],
};

export { TODAS };
