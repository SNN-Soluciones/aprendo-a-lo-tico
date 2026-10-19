// 🧩 Lógica de «¿Qué sigue?» (sin pantalla, para poder probarla sola con node).
// Un patrón es una unidad que se repite («AB» → 🔴🔵🔴🔵…). Cada ronda muestra parte de la tira
// con uno o dos huecos ❓ y unas opciones para tocar. Siempre hay UNA sola respuesta correcta.

// Colores: se dibujan como bolitas (no dependen de emojis nuevos)
export const COLORES = [
  { id: "rojo", n: "rojo", art: "el", c: "#E53935" },
  { id: "azul", n: "azul", art: "el", c: "#1E6FD9" },
  { id: "amarillo", n: "amarillo", art: "el", c: "#FFD600" },
  { id: "verde", n: "verde", art: "el", c: "#2FA85A" },
  { id: "morado", n: "morado", art: "el", c: "#8E5BD9" },
  { id: "anaranjado", n: "anaranjado", art: "el", c: "#F57C00" },
];
export const DIBUJOS = [
  { id: "banano", e: "🍌", n: "banano", art: "el" },
  { id: "mango", e: "🥭", n: "mango", art: "el" },
  { id: "tortuga", e: "🐢", n: "tortuga", art: "la" },
  { id: "estrella", e: "⭐", n: "estrella", art: "la" },
  { id: "rana", e: "🐸", n: "rana", art: "la" },
  { id: "flor", e: "🌸", n: "flor", art: "la" },
  { id: "fresa", e: "🍓", n: "fresa", art: "la" },
  { id: "pez", e: "🐟", n: "pez", art: "el" },
  { id: "mariposa", e: "🦋", n: "mariposa", art: "la" },
  { id: "bola", e: "⚽", n: "bola", art: "la" },
  { id: "pollito", e: "🐥", n: "pollito", art: "el" },
  { id: "sandia", e: "🍉", n: "sandía", art: "la" },
];

// 🪜 Escalones finos, de lo más fácil a lo más difícil.
// patrones: unidades posibles · tipo: "color" | "dibujo" | "mezcla" · ops: cuántas opciones
// modo: "sigue" (¿qué sigue?), "falta" (hueco en el medio) o "dos" (los dos que siguen)
export const ESCALONES = [
  { patrones: ["AB"], tipo: "color", ops: 2, modo: "sigue" },                          // 1. 🔴🔵🔴🔵❓ entre 2
  { patrones: ["AB"], tipo: "color", ops: 3, modo: "sigue" },                          // 2. lo mismo, entre 3
  { patrones: ["AB"], tipo: "dibujo", ops: 3, modo: "sigue" },                         // 3. 🍌🥭🍌🥭❓
  { patrones: ["AAB"], tipo: "mezcla", ops: 3, modo: "sigue" },                        // 4. 🔴🔴🔵🔴🔴🔵❓
  { patrones: ["ABB"], tipo: "mezcla", ops: 3, modo: "sigue" },                        // 5. 🐢🐸🐸🐢🐸🐸❓
  { patrones: ["ABC"], tipo: "mezcla", ops: 3, modo: "sigue" },                        // 6. tres distintos
  { patrones: ["AABB"], tipo: "mezcla", ops: 3, modo: "sigue" },                       // 7. de dos en dos
  { patrones: ["AB", "AAB", "ABB", "ABC", "AABB"], tipo: "mezcla", ops: 4, modo: "sigue" }, // 8. revueltos, entre 4
  { patrones: ["AB", "AAB", "ABB"], tipo: "mezcla", ops: 3, modo: "falta" },           // 9. ¿qué falta en el medio?
  { patrones: ["ABC", "AABB", "ABB"], tipo: "mezcla", ops: 4, modo: "falta" },         // 10. ¿qué falta?, más difícil
  { patrones: ["AB", "AAB", "ABC"], tipo: "mezcla", ops: 3, modo: "dos" },             // 11. completar los dos que siguen
  { patrones: ["AB", "AAB", "ABB", "ABC", "AABB"], tipo: "mezcla", ops: 4, modo: "dos" },   // 12. los dos que siguen, revueltos
];

// Casillas como máximo en la tira (contando los huecos), para que quepa en un celular
export const MAX_CASILLAS = 8;

const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const entre = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

/**
 * Una ronda nueva para un escalón.
 * @returns {{ unidad: string, items: object[], secuencia: (object|null)[], huecos: number[],
 *             respuestas: object[], opciones: object[], modo: string, tipo: string }}
 *   secuencia: lo que se ve (null = hueco ❓) · respuestas: lo que va en cada hueco, en orden
 */
export function ronda(escalon, rnd = Math.random) {
  const unidad = azar(escalon.patrones, rnd);
  const tipo = escalon.tipo === "mezcla" ? (rnd() < 0.5 ? "color" : "dibujo") : escalon.tipo;
  const fuente = tipo === "color" ? COLORES : DIBUJOS;
  const letras = [...new Set(unidad)];
  const elegidos = barajar(fuente, rnd).slice(0, Math.max(letras.length, escalon.ops));
  const items = letras.map((_, i) => elegidos[i]);
  const de = i => items[letras.indexOf(unidad[i % unidad.length])];
  const u = unidad.length;

  let secuencia, huecos;
  if (escalon.modo === "falta") {
    // Tira completa con un hueco en el medio (ni el primero ni el último)
    const total = Math.min(3 * u, MAX_CASILLAS);
    const h = entre(1, total - 2, rnd);
    secuencia = Array.from({ length: total }, (_, i) => (i === h ? null : de(i)));
    huecos = [h];
  } else {
    const n = escalon.modo === "dos" ? 2 : 1;
    // Se ven al menos la unidad entera y dos más, para que se note que se repite
    const desde = Math.max(u + 2, Math.min(2 * u, MAX_CASILLAS - n - 1));
    const hasta = Math.max(desde, Math.min(3 * u - 1, MAX_CASILLAS - n));
    const vistos = entre(desde, hasta, rnd);
    secuencia = [...Array.from({ length: vistos }, (_, i) => de(i)), ...Array(n).fill(null)];
    huecos = Array.from({ length: n }, (_, i) => vistos + i);
  }
  const respuestas = huecos.map(de);
  // Opciones: los de la unidad y, si faltan, otros del mismo tipo (todos distintos)
  const opciones = barajar(elegidos.slice(0, escalon.ops), rnd);
  return { unidad, tipo, modo: escalon.modo, items, secuencia, huecos, respuestas, opciones };
}

/** Revisa una ronda. Devuelve una lista de problemas (vacía = bien). Para las pruebas. */
export function revisarRonda(r, escalon) {
  const mal = [];
  const ids = r.opciones.map(o => o.id);
  if (new Set(ids).size !== ids.length) mal.push("opciones repetidas");
  if (ids.length !== escalon.ops) mal.push(`hay ${ids.length} opciones (esperaba ${escalon.ops})`);
  if (r.secuencia.length > MAX_CASILLAS) mal.push(`tira de ${r.secuencia.length}`);
  r.respuestas.forEach(x => { if (!ids.includes(x.id)) mal.push(`falta la respuesta ${x.id} en las opciones`); });
  // La tira completa tiene que repetir la unidad
  const u = r.unidad.length, letras = [...new Set(r.unidad)];
  const completa = r.secuencia.map((x, i) => x || r.respuestas[r.huecos.indexOf(i)]);
  completa.forEach((x, i) => { if (x !== r.items[letras.indexOf(r.unidad[i % u])]) mal.push(`casilla ${i} no sigue el patrón`); });
  // Lo que se ve tiene que mostrar la unidad al menos una vez completa antes del primer hueco, o alrededor
  const vistos = r.secuencia.filter(Boolean).length;
  if (vistos < u + 2) mal.push("se ven muy pocos");
  return mal;
}
