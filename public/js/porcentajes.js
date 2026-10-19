// 🏷️ Lógica de «Ofertas en la feria: decimales y porcentajes» (sin pantalla, se prueba con node).
//
// Cada escalón tiene un generador que arma una pregunta al azar. Para que no haya errores de redondeo,
// los decimales se manejan en centésimas (150 = 1,5) y los colones en números enteros.
//
// Una pregunta es:
//   { tipo: "opciones" | "escribir" | "pintar" | "ordenar", html, figura?, pista, explica, casi? }
//   opciones: { opciones: [{ id, html }], correcta }
//   escribir: { respuesta, como: "decimal" | "colones" | "porcentaje", antes?, despues? }  (decimal: en centésimas)
//   pintar:   { partes: 10 | 100, meta }  (cuántas partes hay que pintar)
//   ordenar:  { items: [{ id, html, valor }] }  (se tocan de menor a mayor)
//   figura:   { partes, pintadas }  tira (10) o cuadrícula (100) que solo se mira
//   pista:    se dice después del primer error, sin dar la respuesta · explica: al final, con la respuesta
//   casi(valor): para respuestas escritas, un mensaje si el error es «casi» (por ejemplo, la coma corrida)

// ---------- Números ----------
/** Centésimas → texto con coma decimal y sin ceros de más: 150 → "1,5", 125 → "1,25", 200 → "2". */
export function dec(c) {
  const ent = Math.floor(c / 100), resto = c % 100;
  if (!resto) return String(ent);
  return `${ent},${String(resto).padStart(2, "0").replace(/0$/, "")}`;
}
/** Centésimas → siempre con dos decimales: 150 → "1,50". */
export const dec2 = c => `${Math.floor(c / 100)},${String(c % 100).padStart(2, "0")}`;
/** Colones con espacio de miles (que no se parte en dos líneas): 12000 → "₡12 000". */
export const colones = v => "₡" + String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/** Lo que escribió el niño → número (o NaN). Acepta coma o punto decimal, ₡, % y espacios. */
export function leer(texto, como) {
  const t = String(texto).trim();
  if (como === "colones") {
    const d = t.replace(/[^\d]/g, "");
    return d ? Number(d) : NaN;
  }
  const s = t.replace(/[\s%₡]/g, "").replace(/[a-záéíóú]+$/i, "").replace(",", ".");
  if (!/^\d*\.?\d+$/.test(s) && !/^\d+\.$/.test(s)) return NaN;
  const x = Number(s);
  return como === "decimal" ? Math.round(x * 10000) / 100 : x; // decimal: en centésimas
}

/** ¿Está bien lo que escribió? */
export const bienEscrito = (p, texto) => { const v = leer(texto, p.como); return !Number.isNaN(v) && Math.abs(v - p.respuesta) < 1e-6; };

/** Texto para la voz: colones, porcentajes y signos dichos con palabras; sin etiquetas ni emojis. */
export function paraVoz(html) {
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/₡\s?(\d{1,3}(?:[\s ]\d{3})*)/g, (_, n) => `${n.replace(/[\s ]/g, "")} colones`)
    .replace(/(\d)\s?%/g, "$1 por ciento")
    .replace(/÷/g, " entre ").replace(/×/g, " por ").replace(/\s[−-]\s/g, " menos ").replace(/\s\+\s/g, " más ")
    .replace(/\s=\s/g, " es igual a ").replace(/\s<\s/g, " es menor que ").replace(/\s>\s/g, " es mayor que ")
    .replace(/\p{Extended_Pictographic}|️|‍/gu, "")
    .replace(/[\s ]+/g, " ").trim();
}

// ---------- Azar ----------
const entre = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const may = t => t.charAt(0).toUpperCase() + t.slice(1);
// «unas tenis cuestan», «una gorra cuesta»
const plural = cosa => /^un[ao]s /.test(cosa);
const verbo = (cosa, sing, pl) => (plural(cosa) ? pl : sing);

// ---------- Contextos ----------
// Medidas reales para los decimales. f = femenino (para «la bolsa más pesada»)
const MEDIDAS = {
  kilos: { unidad: "kilos", cosas: [["arroz", "🍚"], ["frijoles", "🛍️"], ["papas", "🥔"], ["maíz", "🌽"], ["azúcar", "🛍️"]],
    mas: "pesa más", menos: "pesa menos", igual: "Pesan igual", recipiente: "bolsa", orden: ["de la más liviana a la más pesada", "liviana"] },
  litros: { unidad: "litros", cosas: [["leche", "🥛"], ["jugo de naranja", "🧃"], ["agua", "💧"]],
    mas: "tiene más", menos: "tiene menos", igual: "Tienen lo mismo", recipiente: "botella", orden: ["de la que tiene menos a la que tiene más", "que tiene menos"] },
  metros: { unidad: "metros", cosas: [["tela", "🧵"], ["cinta", "🎀"], ["mecate", "🪢"]],
    mas: "mide más", menos: "mide menos", igual: "Miden lo mismo", recipiente: "pedazo", orden: ["del más corto al más largo", "más corto"] },
};
const TIPOS_MEDIDA = Object.keys(MEDIDAS);

// Cosas para comprar con descuento: [nombre con artículo, emoji, precio mínimo, máximo] (en miles de colones)
const COSAS = [
  ["una camiseta", "👕", 6, 15], ["unas tenis", "👟", 20, 45], ["una mochila", "🎒", 12, 30], ["una bola de fútbol", "⚽", 8, 20],
  ["un pantalón", "👖", 10, 25], ["unos audífonos", "🎧", 8, 30], ["una bicicleta", "🚲", 80, 180], ["un juego de mesa", "🎲", 10, 25],
  ["una sombrilla", "☂️", 5, 12], ["una gorra", "🧢", 5, 12], ["un libro de cuentos", "📚", 6, 15], ["una guitarra", "🎸", 40, 90],
];
// Ferretería (IVA del 13 %): [nombre, emoji, precio mínimo, máximo] en cientos de colones
const FERRETERIA = [
  ["un martillo", "🔨", 35, 80], ["una caja de clavos", "📦", 8, 20], ["una brocha", "🖌️", 15, 40], ["un galón de pintura", "🪣", 120, 250],
  ["un serrucho", "🪚", 60, 120], ["una cinta métrica", "📏", 20, 50], ["un candado", "🔒", 25, 70], ["un bombillo", "💡", 10, 30],
];

// ---------- Figuras ----------
/** Explicación de una cantidad pintada en la cuadrícula de 100: columnas completas (décimas) y cuadritos sueltos. */
function enColumnas(n) {
  const col = Math.floor(n / 10), suel = n % 10;
  const partes = [];
  if (col) partes.push(`${col} ${col === 1 ? "columna completa" : "columnas completas"} (${col} ${col === 1 ? "décima" : "décimas"})`);
  if (suel) partes.push(`${suel} ${suel === 1 ? "cuadrito suelto" : "cuadritos sueltos"} (${suel} ${suel === 1 ? "centésima" : "centésimas"})`);
  return partes.join(" y ");
}

// ---------- Porcentajes: cómo se calcula cada uno, explicado ----------
/** Cuánto es p % de v, explicado paso a paso con el truco que corresponde. */
function comoSeCalcula(p, v, f = colones) {
  const r = v * p / 100;
  if (p === 50) return `50 % es la mitad: ${f(v)} ÷ 2 = ${f(r)}.`;
  if (p === 25) return `25 % es la cuarta parte: ${f(v)} ÷ 4 = ${f(r)}.`;
  if (p === 75) return `75 % son tres cuartas partes: ${f(v)} ÷ 4 = ${f(v / 4)}, y 3 × ${f(v / 4)} = ${f(r)}.`;
  if (p === 10) return `10 % es dividir entre 10: ${f(v)} ÷ 10 = ${f(r)}.`;
  return `Primero el 10 %: ${f(v)} ÷ 10 = ${f(v / 10)}. El ${p} % es ${p / 10} veces eso: ${p / 10} × ${f(v / 10)} = ${f(r)}.`;
}
const unidades = n => `${n}`;

// ---------- Escalones ----------
// grado: para el papá o la maestra · gen(rnd): arma una pregunta
export const ESCALONES = [
  { id: "tira-leer", nombre: "Décimas en la tira", grado: "4°", gen: rnd => { // 1. leer décimas en una tira de 10
    const n = entre(1, 9, rnd);
    return {
      tipo: "opciones", figura: { partes: 10, pintadas: n },
      html: "La tira está partida en 10 partes iguales. ¿Qué número decimal muestra la parte pintada?",
      opciones: barajar([{ id: "ok", html: dec(n * 10) }, { id: "entero", html: String(n) }, { id: "cent", html: dec(n) }], rnd), correcta: "ok",
      pista: "Cada parte de la tira es una décima: 0,1. Contá cuántas están pintadas.",
      explica: `Cada parte es una décima (0,1). Hay ${n} ${n === 1 ? "pintada" : "pintadas"}: ${dec(n * 10)}.`,
    };
  } },
  { id: "tira-pintar", nombre: "Pintá décimas", grado: "4°", gen: rnd => { // 2. pintar décimas en la tira
    const n = entre(1, 9, rnd);
    return {
      tipo: "pintar", partes: 10, meta: n,
      html: `Pintá <b>${dec(n * 10)}</b> de la tira.`,
      pista: `${dec(n * 10)} son ${n} ${n === 1 ? "décima" : "décimas"}: ${n} de las 10 partes.`,
      explica: `${dec(n * 10)} son ${n} ${n === 1 ? "décima" : "décimas"}: ${n} de las 10 partes de la tira.`,
    };
  } },
  { id: "cuadricula-leer", nombre: "Centésimas en la cuadrícula", grado: "4°", gen: rnd => { // 3. leer centésimas
    let n; do n = entre(1, 99, rnd); while (n % 10 === 0 && rnd() < 0.7);
    return {
      tipo: "escribir", como: "decimal", respuesta: n, figura: { partes: 100, pintadas: n },
      html: "La cuadrícula tiene 100 cuadritos: cada uno es una centésima (0,01). ¿Qué número decimal está pintado?",
      pista: "Cada columna completa es una décima (0,1) y cada cuadrito suelto, una centésima (0,01).",
      explica: `Hay ${enColumnas(n)}: ${dec(n)}. Son ${n} de 100 cuadritos.`,
      casi: v => (v === n * 100 ? "¡Casi! Te faltó la coma: es menos que una unidad, así que empieza con 0," : v === n * 10 || v * 10 === n ? "¡Casi! Revisá dónde va la coma: cada cuadrito es una centésima." : v === 100 - n ? "¡Casi! Ese es lo que NO está pintado." : null),
    };
  } },
  { id: "cuadricula-pintar", nombre: "Pintá centésimas", grado: "4°", gen: rnd => { // 4. pintar centésimas (a veces 0,6 = 60)
    const redondo = rnd() < 0.3;
    let n; do n = redondo ? entre(1, 9, rnd) * 10 : entre(1, 99, rnd); while (!redondo && n % 10 === 0);
    return {
      tipo: "pintar", partes: 100, meta: n,
      html: `Pintá <b>${dec(n)}</b> en la cuadrícula. <small>Tocá un cuadrito y se pinta hasta ahí.</small>`,
      pista: redondo ? `${dec(n)} = ${dec2(n)}: son ${n / 10} columnas completas.` : `${dec(n)}: ${enColumnas(n)}.`,
      explica: `${redondo ? `${dec(n)} = ${dec2(n)}, o sea, ` : `${dec(n)} son `}${n} centésimas: ${enColumnas(n)}.`,
      casi: v => (v * 10 === n ? `¡Casi! ${dec(n)} = ${dec2(n)}: son ${n} cuadritos, no ${v}.` : v === n * 10 || Math.abs(v - n) <= 2 ? "¡Casi! Contá otra vez las columnas y los cuadritos sueltos." : null),
    };
  } },
  { id: "comparar", nombre: "¿Cuál es mayor?", grado: "4°", gen: rnd => { // 5. comparar decimales con medidas (con trampas como 1,5 y 1,25)
    const tm = MEDIDAS[azar(TIPOS_MEDIDA, rnd)], [cosa, e] = azar(tm.cosas, rnd);
    const ent = entre(0, 3, rnd), d = entre(2, 9, rnd);
    const A = ent * 100 + d * 10;
    const r = rnd();
    let B, txtB;
    if (r < 0.15) { B = A; txtB = dec2(A); } // 1,5 y 1,50
    else if (r < 0.75) { B = ent * 100 + entre(1, d - 1, rnd) * 10 + entre(1, 9, rnd); txtB = dec(B); } // trampa: más cifras pero menor
    else { B = ent * 100 + entre(d, 9, rnd) * 10 + entre(1, 9, rnd); txtB = dec(B); } // más cifras y mayor
    const mas = rnd() < 0.5;
    const items = barajar([{ id: "a", v: A, t: dec(A) }, { id: "b", v: B, t: txtB }], rnd);
    const [x, y] = items;
    const correcta = A === B ? "igual" : (mas ? (x.v > y.v ? x.id : y.id) : (x.v < y.v ? x.id : y.id));
    const gana = items.find(i => i.id === correcta);
    const otro = items.find(i => i.id !== correcta);
    const [uno, otroR, varios] = tm.recipiente === "pedazo" ? ["uno", "otro", "pedazos"] : ["una", "otra", tm.recipiente + "s"];
    return {
      tipo: "opciones", cols: 3,
      html: `${e} Dos ${varios} de ${cosa}: ${uno} de <b>${x.t} ${tm.unidad}</b> y ${otroR} de <b>${y.t} ${tm.unidad}</b>.<br>¿Cuál ${mas ? tm.mas : tm.menos}?`,
      opciones: [...items.map(i => ({ id: i.id, html: `<b>${i.t}</b> ${tm.unidad}` })), { id: "igual", html: tm.igual }],
      correcta,
      pista: "Ojo: no gana el que tiene más cifras. Poné los dos con dos decimales y compará las centésimas.",
      explica: A === B
        ? `${dec(A)} = ${dec2(A)}: un cero al final no cambia el número. ¡${tm.igual}!`
        : `Con dos decimales: ${dec2(x.v)} y ${dec2(y.v)}. ${mas ? `${dec2(gana.v)} > ${dec2(otro.v)}` : `${dec2(gana.v)} < ${dec2(otro.v)}`}, así que ${tm.recipiente === "pedazo" ? "el" : "la"} de ${gana.t} ${tm.unidad} ${mas ? tm.mas : tm.menos}.`,
    };
  } },
  { id: "ordenar", nombre: "Ordená los decimales", grado: "4° y 5°", gen: rnd => { // 6. ordenar 4 decimales (mezcla de décimas y centésimas)
    const tm = MEDIDAS[azar(TIPOS_MEDIDA, rnd)], [cosa, e] = azar(tm.cosas, rnd);
    const ent = entre(0, 2, rnd);
    let vals;
    do {
      vals = new Set();
      while (vals.size < 4) {
        const v = (ent + (rnd() < 0.25 ? 1 : 0)) * 100 + (rnd() < 0.45 ? entre(1, 9, rnd) * 10 : entre(1, 99, rnd));
        if (v > 0) vals.add(v);
      }
      vals = [...vals];
      // que haya al menos una trampa: uno con una cifra decimal mayor que uno con dos
    } while (!vals.some(a => a % 10 === 0 && vals.some(b => b % 10 !== 0 && b < a && Math.floor(b / 100) === Math.floor(a / 100) && b % 100 > (a % 100) / 10)));
    const items = barajar(vals.map((v, i) => ({ id: `o${i}`, html: `${e} <b>${dec(v)}</b> <small>${tm.unidad}</small>`, valor: v })), rnd);
    const orden = [...vals].sort((a, b) => a - b);
    return {
      tipo: "ordenar", items,
      html: `Ordená ${tm.recipiente === "pedazo" ? `los pedazos de ${cosa}` : `las ${tm.recipiente}s de ${cosa}`} ${tm.orden[0]}. <small>Tocá uno por uno, en ese orden.</small>`,
      pista: "Escribí todos con dos decimales (0,5 = 0,50) y compará las centésimas.",
      explica: `Con dos decimales: ${orden.map(dec2).join(" < ")}. El orden es ${orden.map(dec).join(", ")}.`,
    };
  } },
  { id: "sumar-restar", nombre: "Sumá y restá decimales", grado: "4° y 5°", gen: rnd => { // 7. sumar y restar decimales con medidas
    const tm = MEDIDAS[azar(TIPOS_MEDIDA, rnd)];
    const suma = rnd() < 0.5;
    // uno con una cifra decimal y otro con dos (para practicar acomodar la coma)
    let a = entre(5, 30, rnd) * 10, b = entre(25, 250, rnd);
    if (b % 10 === 0) b += 5;
    if (!suma) { if (rnd() < 0.4) a = entre(2, 4, rnd) * 100; if (b >= a) b = a - entre(5, Math.max(6, Math.floor(a / 2)), rnd); if (b % 10 === 0) b -= 5; if (b <= 0) b = 25; }
    if (rnd() < 0.5) [a, b] = suma ? [b, a] : [a, b];
    const r = suma ? a + b : a - b;
    const [c1] = azar(tm.cosas, rnd), [c2] = azar(tm.cosas, rnd);
    const html = suma
      ? (tm.unidad === "kilos" ? `Compraste <b>${dec(a)} kilos</b> de ${c1} y <b>${dec(b)} kilos</b> de ${c2 === c1 ? "más" : c2}. ¿Cuántos kilos llevás en total?`
        : tm.unidad === "litros" ? `Para el refresco, Sofía echó <b>${dec(a)} litros</b> de ${c1} y <b>${dec(b)} litros</b> de ${c2 === c1 ? "más" : c2}. ¿Cuántos litros hay en total?`
        : `Mateo tiene <b>${dec(a)} metros</b> de ${c1} y compró <b>${dec(b)} metros</b> más. ¿Cuántos metros tiene ahora?`)
      : (tm.unidad === "kilos" ? `Había <b>${dec(a)} kilos</b> de ${c1} y se usaron <b>${dec(b)} kilos</b> para el almuerzo. ¿Cuántos kilos quedan?`
        : tm.unidad === "litros" ? `Había <b>${dec(a)} litros</b> de ${c1} y se usaron <b>${dec(b)} litros</b> para hacer arroz con leche. ¿Cuántos litros quedan?`
        : `Había <b>${dec(a)} metros</b> de ${c1} y se cortaron <b>${dec(b)} metros</b> para un trabajo de la escuela. ¿Cuántos metros quedan?`);
    return {
      tipo: "escribir", como: "decimal", respuesta: r, despues: tm.unidad,
      html,
      pista: "Acomodá las comas una debajo de la otra. Si a uno le falta una cifra, completalo con cero (0,5 = 0,50).",
      explica: `Con las comas en fila: ${dec2(a)} ${suma ? "+" : "−"} ${dec2(b)} = ${dec2(r)}. ${suma ? "En total" : "Quedan"} ${dec(r)} ${tm.unidad}.`,
      casi: v => (v === r * 100 ? "¡Casi! Te faltó la coma decimal." : v === r * 10 || v * 10 === r ? "¡Casi! Revisá dónde va la coma."
        : Math.abs(v - r) === 10 || Math.abs(v - r) === 100 ? `¡Casi! Revisá lo que se ${suma ? "lleva" : "presta"} entre centésimas, décimas y unidades.` : null),
    };
  } },
  { id: "porcentaje-cuadricula", nombre: "Porcentaje: de cada 100", grado: "5°", gen: rnd => { // 8. porcentaje en la cuadrícula
    const n = entre(1, 99, rnd);
    if (rnd() < 0.5) return {
      tipo: "escribir", como: "porcentaje", respuesta: n, despues: "%", figura: { partes: 100, pintadas: n },
      html: "Porcentaje quiere decir «de cada 100». ¿Qué porcentaje de la cuadrícula está pintado?",
      pista: "Contá cuántos de los 100 cuadritos están pintados: cada columna completa son 10.",
      explica: `Hay ${n} de 100 cuadritos pintados: ${n} %. Es lo mismo que ${dec(n)}.`,
      casi: v => (Math.abs(v * 100 - n) < 1e-6 ? `¡Casi! ${dec(n)} es lo mismo, pero como porcentaje se dice ${n} %.` : v === 100 - n ? "¡Casi! Ese es el porcentaje que NO está pintado." : null),
    };
    return {
      tipo: "pintar", partes: 100, meta: n,
      html: `Pintá el <b>${n} %</b> de la cuadrícula. <small>Tocá un cuadrito y se pinta hasta ahí.</small>`,
      pista: `${n} % son ${n} de cada 100 cuadritos: ${enColumnas(n).replace(/ \([^)]*\)/g, "")}.`,
      explica: `${n} % = ${n} de 100 = ${dec(n)}: ${enColumnas(n).replace(/ \([^)]*\)/g, "")}.`,
      casi: v => (Math.abs(v - n) <= 2 ? "¡Casi! Contá otra vez los cuadritos sueltos." : null),
    };
  } },
  { id: "porcentajes-faciles", nombre: "50 %, 25 % y 10 %", grado: "5°", gen: rnd => { // 9. la mitad, la cuarta parte y la décima parte
    const p = azar([50, 25, 10], rnd);
    if (rnd() < 0.5) {
      const v = entre(2, 40, rnd) * 1000;
      return {
        tipo: "escribir", como: "colones", respuesta: v * p / 100, antes: "₡",
        html: `¿Cuánto es el <b>${p} %</b> de <b>${colones(v)}</b>?`,
        pista: p === 50 ? "50 % es la mitad." : p === 25 ? "25 % es la cuarta parte: la mitad de la mitad." : "10 % es dividir entre 10.",
        explica: comoSeCalcula(p, v),
        casi: x => { const otro = [50, 25, 10].find(q => q !== p && x === v * q / 100); return otro ? `¡Casi! Eso es el ${otro} %. Te pregunté el ${p} %.` : null; },
      };
    }
    const [n, cosa] = azar([[entre(1, 20, rnd) * 20, "mangos de la cosecha"], [entre(1, 10, rnd) * 20, "estudiantes de la escuela"], [entre(1, 10, rnd) * 40, "naranjas de la finca"], [entre(1, 5, rnd) * 20, "gallinas de la granja"]], rnd);
    const r = n * p / 100;
    return {
      tipo: "escribir", como: "colones", respuesta: r,
      html: `¿Cuánto es el <b>${p} %</b> de los <b>${n}</b> ${cosa}?`,
      pista: p === 50 ? "50 % es la mitad." : p === 25 ? "25 % es la cuarta parte: la mitad de la mitad." : "10 % es dividir entre 10.",
      explica: comoSeCalcula(p, n, unidades),
      casi: x => { const otro = [50, 25, 10].find(q => q !== p && x === n * q / 100); return otro ? `¡Casi! Eso es el ${otro} %. Te pregunté el ${p} %.` : null; },
    };
  } },
  { id: "rebaja", nombre: "¿Cuánto rebajan?", grado: "5° y 6°", gen: rnd => { // 10. cuánto rebajan
    const [cosa, e, min, max] = azar(COSAS, rnd);
    const p = azar([10, 20, 25, 50], rnd), v = entre(min, max, rnd) * 1000, r = v * p / 100;
    return {
      tipo: "escribir", como: "colones", respuesta: r, antes: "₡",
      html: `${e} ${may(cosa)} ${verbo(cosa, "cuesta", "cuestan")} <b>${colones(v)}</b> y ${verbo(cosa, "tiene", "tienen")} <b>${p} %</b> de descuento. ¿Cuánto te rebajan?`,
      pista: p === 50 ? "50 % es la mitad del precio." : p === 25 ? "25 % es la cuarta parte del precio." : "Primero sacá el 10 %: el precio dividido entre 10.",
      explica: `Te rebajan ${colones(r)}. ${comoSeCalcula(p, v)}`,
      casi: x => (x === v - r ? "¡Casi! Eso es lo que pagás. Te pregunté cuánto te rebajan." : null),
    };
  } },
  { id: "pagar", nombre: "¿Cuánto pagás?", grado: "5° y 6°", gen: rnd => { // 11. precio final después del descuento
    const [cosa, e, min, max] = azar(COSAS, rnd);
    const p = azar([10, 20, 25, 30, 40, 50, 75], rnd), v = entre(min, max, rnd) * 1000, r = v * p / 100;
    return {
      tipo: "escribir", como: "colones", respuesta: v - r, antes: "₡",
      html: `${e} ${may(cosa)} de <b>${colones(v)}</b> ${verbo(cosa, "tiene", "tienen")} <b>${p} %</b> de descuento. ¿Cuánto pagás?`,
      pista: "Primero calculá cuánto te rebajan, y después restalo del precio.",
      explica: `${comoSeCalcula(p, v)} Pagás ${colones(v)} − ${colones(r)} = ${colones(v - r)}.`,
      casi: x => (x === r ? "¡Casi! Eso es lo que te rebajan. Ahora restalo del precio." : x === v + r ? "¡Casi! El descuento se resta, no se suma." : null),
    };
  } },
  { id: "oferta", nombre: "¿Qué oferta conviene?", grado: "6°", gen: rnd => { // 12. comparar dos ofertas
    const [cosa, e, min, max] = azar(COSAS, rnd);
    for (;;) {
      const vA = entre(min, max, rnd) * 1000, pA = azar([10, 20, 25, 30, 40, 50], rnd);
      const vB = Math.max(min * 1000, vA + entre(-4, 4, rnd) * 1000);
      const fija = rnd() < 0.3; // la tienda B rebaja una cantidad fija
      const pB = azar([10, 20, 25, 30, 40, 50], rnd), rebB = fija ? entre(1, Math.max(1, Math.floor(vB / 4000)), rnd) * 1000 : vB * pB / 100;
      const fA = vA - vA * pA / 100, fB = vB - rebB;
      if (Math.abs(fA - fB) < 200 || (vA === vB && !fija)) continue;
      const tB = fija ? `<b>${colones(vB)}</b>, con <b>${colones(rebB)}</b> de rebaja` : `<b>${colones(vB)}</b>, con <b>${pB} %</b> de descuento`;
      const gana = fA < fB ? "A" : "B";
      return {
        tipo: "opciones", cols: 2,
        html: `${e} ${may(cosa)} en dos tiendas:<br>🏪 <b>Tienda A</b>: <b>${colones(vA)}</b>, con <b>${pA} %</b> de descuento.<br>🏬 <b>Tienda B</b>: ${tB}.<br>¿Dónde conviene comprar?`,
        opciones: [{ id: "A", html: "🏪 Tienda A" }, { id: "B", html: "🏬 Tienda B" }], correcta: gana,
        pista: "Calculá cuánto pagarías en cada tienda y compará. El descuento más grande no siempre gana.",
        explica: `En la Tienda A pagás ${colones(vA)} − ${colones(vA * pA / 100)} = ${colones(fA)}. En la Tienda B pagás ${colones(vB)} − ${colones(rebB)} = ${colones(fB)}. Conviene la Tienda ${gana}: ahorrás ${colones(Math.abs(fA - fB))}.`,
      };
    }
  } },
  { id: "iva", nombre: "El IVA del 13 %", grado: "6°", gen: rnd => { // 13. factura con IVA
    const items = barajar(FERRETERIA, rnd).slice(0, entre(2, 3, rnd)).map(([n, e, a, b]) => ({ n, e, v: entre(a, b, rnd) * 100 }));
    const sub = items.reduce((s, x) => s + x.v, 0), iva = sub * 13 / 100, total = sub + iva;
    const pideTotal = rnd() < 0.5;
    const factura = `<table class="factura"><caption>🧾 Ferretería</caption>${items.map(x => `<tr><td>${x.e} ${may(x.n)}</td><td>${colones(x.v)}</td></tr>`).join("")}
      <tr class="sub"><td>Subtotal</td><td>${colones(sub)}</td></tr><tr><td>IVA (13 %)</td><td>${pideTotal ? colones(iva) : "<b>?</b>"}</td></tr>
      <tr class="sub"><td>Total</td><td><b>?</b></td></tr></table>`;
    return {
      tipo: "escribir", como: "colones", respuesta: pideTotal ? total : iva, antes: "₡",
      html: `${factura}${pideTotal ? "¿Cuánto hay que pagar en total?" : "¿Cuánto es el IVA del 13 %?"}`,
      pista: pideTotal ? "El total es el subtotal más el IVA." : "13 % = 10 % + 3 %. El 10 % es dividir entre 10; el 1 % es dividir entre 100.",
      explica: `13 % = 10 % + 3 %. El 10 % de ${colones(sub)} es ${colones(sub / 10)}; el 1 % es ${colones(sub / 100)}, así que el 3 % es ${colones(3 * sub / 100)}. IVA: ${colones(sub / 10)} + ${colones(3 * sub / 100)} = ${colones(iva)}.${pideTotal ? ` Total: ${colones(sub)} + ${colones(iva)} = ${colones(total)}.` : ""}`,
      casi: x => (pideTotal && x === iva ? "¡Casi! Ese es el IVA. Sumalo al subtotal." : !pideTotal && x === total ? "¡Casi! Ese es el total. El IVA es solo el 13 %." : !pideTotal && x === sub / 10 ? "¡Casi! Ese es el 10 %. Te falta sumarle el 3 %." : pideTotal && x === sub ? "¡Casi! Te falta sumar el IVA." : null),
    };
  } },
  { id: "que-porcentaje", nombre: "¿Qué porcentaje rebajaron?", grado: "6°", gen: rnd => { // 14. de la rebaja al porcentaje
    const [cosa, e, min, max] = azar(COSAS, rnd);
    const p = azar([10, 20, 25, 40, 50, 75], rnd), v = entre(min, max, rnd) * 1000, r = v * p / 100;
    const como = p === 50 ? `${colones(r)} es la mitad de ${colones(v)}: 50 %.`
      : p === 25 ? `${colones(v)} ÷ ${colones(r)} = 4: es la cuarta parte, 25 %.`
      : p === 75 ? `La cuarta parte de ${colones(v)} es ${colones(v / 4)}, y ${colones(r)} son 3 de esas: 75 %.`
      : p === 10 ? `${colones(v)} ÷ 10 = ${colones(r)}: la rebaja es la décima parte del precio, o sea, el 10 %.`
      : `El 10 % de ${colones(v)} es ${colones(v / 10)}, y ${colones(r)} son ${p / 10} veces eso: ${p} %.`;
    return {
      tipo: "escribir", como: "porcentaje", respuesta: p, despues: "%",
      html: `${e} ${may(cosa)} ${verbo(cosa, "costaba", "costaban")} <b>${colones(v)}</b> y te rebajaron <b>${colones(r)}</b>. ¿Qué porcentaje de descuento te hicieron?`,
      pista: "Buscá qué parte del precio es la rebaja: ¿la mitad? ¿la cuarta parte? ¿la décima parte? El 10 % es el precio entre 10.",
      explica: como,
      casi: x => (x === 100 - p ? "¡Casi! Ese es el porcentaje que pagás. Te pregunté el del descuento." : null),
    };
  } },
];

// Grupos para escoger a mano (papá o maestra): índices de ESCALONES
export const GRUPOS = [
  { id: "decimales", nombre: "🔢 Decimales", escalones: [0, 1, 2, 3, 4, 5, 6] },
  { id: "porcentajes", nombre: "💯 Porcentajes", escalones: [7, 8, 13] },
  { id: "ofertas", nombre: "🏷️ Ofertas e IVA", escalones: [9, 10, 11, 12] },
];

/** Escalón inicial según la edad: se empieza abajo y, al principio, se sube rápido. */
export const inicioPorEdad = edad => edad === null || edad <= 9 ? 0 : edad === 10 ? 2 : edad === 11 ? 4 : 6;

/** Una pregunta del escalón i. */
export function pregunta(i, rnd = Math.random) {
  const p = { escalon: ESCALONES[i].id, ...ESCALONES[i].gen(rnd) };
  // «¡Casi!» nunca para la respuesta correcta (con 50 %, lo que pagás y lo que rebajan dan lo mismo)
  if (p.casi) { const casi = p.casi, ok = p.tipo === "pintar" ? p.meta : p.respuesta; p.casi = v => (v === ok ? null : casi(v)); }
  return p;
}

/** Revisa una pregunta. Devuelve una lista de problemas (vacía = bien). Para las pruebas con node. */
export function revisarPregunta(p) {
  const mal = [];
  if (!p.html || !p.pista || !p.explica) mal.push("faltan textos");
  if (/undefined|NaN/.test(p.html + p.explica + p.pista)) mal.push("texto con undefined o NaN");
  if (p.tipo === "opciones") {
    const ids = p.opciones.map(o => o.id), htmls = p.opciones.map(o => o.html);
    if (new Set(ids).size !== ids.length || new Set(htmls).size !== htmls.length) mal.push("opciones repetidas");
    if (!ids.includes(p.correcta)) mal.push("la correcta no está");
  } else if (p.tipo === "escribir") {
    if (!Number.isFinite(p.respuesta) || p.respuesta <= 0) mal.push(`respuesta rara: ${p.respuesta}`);
    if (p.como !== "decimal" && !Number.isInteger(p.respuesta)) mal.push(`respuesta con decimales: ${p.respuesta}`);
    if (p.como === "decimal" && !Number.isInteger(p.respuesta)) mal.push("centésimas no enteras");
    // lo que se escribe bien tiene que darse por bueno (con coma, con punto y con ₡ o %)
    const txt = p.como === "decimal" ? dec(p.respuesta) : String(p.respuesta);
    if (!bienEscrito(p, txt)) mal.push(`no acepta ${txt}`);
    if (p.como === "decimal" && !bienEscrito(p, txt.replace(",", "."))) mal.push("no acepta el punto");
    if (p.como === "colones" && !bienEscrito(p, colones(p.respuesta))) mal.push("no acepta ₡ con espacios");
    if (p.casi && p.casi(p.respuesta)) mal.push("la respuesta correcta sale como «casi»");
  } else if (p.tipo === "pintar") {
    if (!(p.meta >= 1 && p.meta < p.partes)) mal.push(`meta rara: ${p.meta}`);
  } else if (p.tipo === "ordenar") {
    const v = p.items.map(i => i.valor);
    if (new Set(v).size !== v.length) mal.push("valores repetidos");
    if (v.some(x => x <= 0)) mal.push("valor cero o negativo");
  } else mal.push(`tipo raro: ${p.tipo}`);
  if (p.figura && !(p.figura.pintadas >= 1 && p.figura.pintadas < p.figura.partes)) mal.push("figura rara");
  return mal;
}
