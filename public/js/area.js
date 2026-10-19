// 📐 Lógica de «Perímetro y área en la finca» (sin pantalla, para poder probarla con node).
//
//   perímetro = el borde: lo que mide la cerca alrededor (en m o cm)
//   área      = lo de adentro: cuántos cuadritos de 1 m × 1 m caben (en m² o cm²)
//
// Figuras:
//   { tipo: "celdas", celdas: [[x, y]…], w, h, ele? }   cuadritos en una cuadrícula de w × h (ele: la L, para partirla)
//   { tipo: "dos", a: [[x, y]…], b: [[x, y]…], w, h }   dos corrales para comparar (verde y azul)
//   { tipo: "rect", largo, ancho }                        rectángulo con medidas (sin cuadrícula)
//   { tipo: "ele", W, H, cw, ch, cuadricula? }            rectángulo de W × H sin la esquina de arriba a la derecha (cw × ch)
//   { tipo: "tri", base, altura, cuadricula? }            triángulo (en cuadrícula es rectángulo: la mitad de base × altura)
//   { tipo: "pared", largo, alto, puerta: { w, h } }      pared con una puerta que no se pinta
//
// Una ronda: { escalon, tipo: "opciones" | "escribir" | "pintar" | "comparar", pide, fig, unidad, texto, voz,
//              respuesta, opciones?, prefijo?, sufijo?, confusiones: [{ v, msg }], pista, explica, marcar }

export const PRECIO_ALAMBRE = 850;

// ---------- Números al azar ----------
export const entero = (a, b, rnd = Math.random) => a + Math.floor(rnd() * (b - a + 1));
export const azar = (arr, rnd = Math.random) => arr[Math.floor(rnd() * arr.length)];
export function barajar(arr, rnd = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
/** ₡1 500 (espacio de miles) */
export const colones = n => "₡" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const miles = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const UNIDADES = {
  m: { l: "m", a: "m²", vl: "metros", va: "metros cuadrados", va1: "metro cuadrado" },
  cm: { l: "cm", a: "cm²", vl: "centímetros", va: "centímetros cuadrados", va1: "centímetro cuadrado" },
};

// ---------- Cuadritos ----------
export const rectCeldas = (x, y, w, h) => Array.from({ length: w * h }, (_, i) => [x + (i % w), y + Math.floor(i / w)]);
/** Una L: rectángulo de W × H sin la esquina de arriba a la derecha (cw × ch). */
export const eleCeldas = (x, y, W, H, cw, ch) => rectCeldas(x, y, W, H).filter(([cx, cy]) => !(cx >= x + W - cw && cy < y + ch));
const clave = ([x, y]) => `${x},${y}`;

/** Perímetro de un grupo de cuadritos: los lados que no tocan otro cuadrito del grupo. */
export function perimetroCeldas(celdas) {
  const s = new Set(celdas.map(clave));
  let p = 0;
  for (const [x, y] of celdas) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!s.has(`${x + dx},${y + dy}`)) p++;
  return p;
}

/** ¿Están todos juntos? (cada cuadrito toca a otro por un lado, no solo por la esquina) */
export function conexa(celdas) {
  if (!celdas.length) return false;
  const s = new Set(celdas.map(clave)), vistos = new Set([clave(celdas[0])]), cola = [celdas[0]];
  while (cola.length) {
    const [x, y] = cola.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const k = `${x + dx},${y + dy}`;
      if (s.has(k) && !vistos.has(k)) { vistos.add(k); cola.push([x + dx, y + dy]); }
    }
  }
  return vistos.size === s.size;
}

/**
 * Los lados del borde, en orden alrededor de la figura (para numerarlos al explicar el perímetro).
 * Cada lado: { x1, y1, x2, y2, nx, ny } (nx, ny apunta hacia afuera).
 */
export function bordes(celdas) {
  const s = new Set(celdas.map(clave)), lados = [];
  for (const [x, y] of celdas) {
    if (!s.has(`${x},${y - 1}`)) lados.push({ x1: x, y1: y, x2: x + 1, y2: y });
    if (!s.has(`${x + 1},${y}`)) lados.push({ x1: x + 1, y1: y, x2: x + 1, y2: y + 1 });
    if (!s.has(`${x},${y + 1}`)) lados.push({ x1: x + 1, y1: y + 1, x2: x, y2: y + 1 });
    if (!s.has(`${x - 1},${y}`)) lados.push({ x1: x, y1: y + 1, x2: x, y2: y });
  }
  // Encadenar: cada lado empieza donde termina el anterior (si hay huecos, sigue con otra vuelta)
  const desde = new Map();
  for (const l of lados) { const k = `${l.x1},${l.y1}`; if (!desde.has(k)) desde.set(k, []); desde.get(k).push(l); }
  const orden = [], usados = new Set();
  for (const ini of lados) {
    if (usados.has(ini)) continue;
    let l = ini;
    while (l && !usados.has(l)) {
      usados.add(l); orden.push(l);
      l = (desde.get(`${l.x2},${l.y2}`) || []).find(o => !usados.has(o));
    }
  }
  return orden.map(l => ({ ...l, nx: l.y2 - l.y1, ny: -(l.x2 - l.x1) }));
}

// ---------- Medidas de cualquier figura ----------
export function area(f) {
  switch (f.tipo) {
    case "celdas": return f.celdas.length;
    case "rect": return f.largo * f.ancho;
    case "ele": return f.W * f.H - f.cw * f.ch;
    case "tri": return f.base * f.altura / 2;
    case "pared": return f.largo * f.alto - f.puerta.w * f.puerta.h;
    default: return null;
  }
}
export function perimetro(f) {
  switch (f.tipo) {
    case "celdas": return perimetroCeldas(f.celdas);
    case "rect": return 2 * (f.largo + f.ancho);
    case "ele": return 2 * (f.W + f.H); // ¡igual que el rectángulo completo!
    default: return null;
  }
}

// ---------- Opciones ----------
/** La respuesta, las confusiones típicas y números cercanos: 3 opciones distintas y positivas. */
function opcionesNum(resp, confusiones, rnd, n = 3) {
  const s = new Set([resp]);
  for (const c of confusiones) if (s.size < n && c.v > 0 && c.v !== resp) s.add(c.v);
  for (const d of barajar([-2, -1, 1, 2, 3, -3, 4], rnd)) if (s.size < n && resp + d > 0) s.add(resp + d);
  return barajar([...s], rnd);
}

// ---------- Lugares de la finca ----------
const CORRALES = [
  { e: "🐄", n: "el corral de las vacas" }, { e: "🐔", n: "el gallinero" }, { e: "🐷", n: "el chiquero" },
  { e: "🐴", n: "el potrero del caballo" }, { e: "🥬", n: "la huerta" }, { e: "🐐", n: "el corral de las cabras" },
];
const LUGARES = {
  m: [{ e: "🐴", n: "El potrero" }, { e: "🥬", n: "La huerta de la escuela" }, { e: "🏫", n: "El aula" },
    { e: "🐄", n: "El corral" }, { e: "🏡", n: "El terreno de la casa" }, { e: "🌽", n: "La milpa" }],
  cm: [{ e: "🖼️", n: "La foto" }, { e: "🃏", n: "La tarjeta" }, { e: "📒", n: "El dibujo del cuaderno" }, { e: "🏷️", n: "La etiqueta" }],
};
const may = t => t.charAt(0).toUpperCase() + t.slice(1);

// Mensajes de las confusiones de siempre
const esPerimetro = (P, u) => ({ v: P, msg: `Ese es el perímetro: los ${UNIDADES[u].vl} del borde. El área es lo de adentro.` });
const esArea = (A, u) => ({ v: A, msg: `Ese es el área: lo de adentro. El perímetro es solo el borde, la cerca.` });

// ---------- Rondas de cada tipo ----------
function contarArea(rnd, tipo, wmax, hmax) {
  let w, h;
  do { w = entero(2, wmax, rnd); h = entero(2, hmax, rnd); } while (w * h === 2 * (w + h));
  const c = azar(CORRALES, rnd), A = w * h, P = 2 * (w + h);
  const confusiones = [esPerimetro(P, "m")];
  return {
    tipo, pide: "area", unidad: "m", fig: { tipo: "celdas", celdas: rectCeldas(1, 1, w, h), w: w + 2, h: h + 2 },
    texto: `${c.e} ¿Cuántos <b>m²</b> tiene ${c.n}?<small>Cada cuadrito mide 1 m². Contá los de adentro.</small>`,
    voz: `¿Cuántos metros cuadrados tiene ${c.n}? Cada cuadrito mide un metro cuadrado: contá los de adentro.`,
    respuesta: A, sufijo: "m²", confusiones, opciones: tipo === "opciones" ? opcionesNum(A, confusiones, rnd) : undefined,
    pista: `Contá cuántos cuadritos hay en una fila y cuántas filas hay.`,
    explica: `Adentro hay ${h} filas de ${w} cuadritos: ${h} × ${w} = <b>${A} m²</b>. El área es lo de adentro.`,
    marcar: "area",
  };
}
function contarPerimetro(rnd, tipo, wmax, hmax) {
  let w, h;
  do { w = entero(2, wmax, rnd); h = entero(2, hmax, rnd); } while (w * h === 2 * (w + h));
  const c = azar(CORRALES, rnd), A = w * h, P = 2 * (w + h);
  const confusiones = [esArea(A, "m")];
  return {
    tipo, pide: "perimetro", unidad: "m", fig: { tipo: "celdas", celdas: rectCeldas(1, 1, w, h), w: w + 2, h: h + 2 },
    texto: `${c.e} ¿Cuántos <b>metros de cerca</b> necesita ${c.n}?<small>Cada lado de un cuadrito mide 1 m. Contá todo el borde.</small>`,
    voz: `¿Cuántos metros de cerca necesita ${c.n}? Cada lado de un cuadrito mide un metro. Contá todo el borde.`,
    respuesta: P, sufijo: "m", confusiones, opciones: tipo === "opciones" ? opcionesNum(P, confusiones, rnd) : undefined,
    pista: `Contá los lados de afuera, uno por uno, dando toda la vuelta.`,
    explica: `El borde mide ${w} + ${h} + ${w} + ${h} = <b>${P} m</b>. Eso es el perímetro: lo que mide la cerca.`,
    marcar: "perimetro",
  };
}

function pintarCorral(rnd, conPerimetro) {
  const c = azar(CORRALES, rnd);
  if (!conPerimetro) {
    const N = entero(4, 9, rnd);
    return {
      tipo: "pintar", pide: "pintar-area", unidad: "m", fig: { tipo: "celdas", celdas: [], w: 6, h: 5 },
      meta: { area: N }, ejemplo: Array.from({ length: N }, (_, i) => [1 + (i % 3), 1 + Math.floor(i / 3)]), // filas de 3
      texto: `${c.e} Pintá ${c.n} de <b>${N} m²</b>.<small>Tocá ${N} cuadritos, todos juntos.</small>`,
      voz: `Pintá ${c.n} de ${N} metros cuadrados. Tocá ${N} cuadritos, todos juntos.`,
      respuesta: N, confusiones: [], pista: `Cada cuadrito es un metro cuadrado: necesitás ${N} cuadritos pegados.`,
      explica: "", marcar: "perimetro",
    };
  }
  let w, h;
  do { w = entero(1, 5, rnd); h = entero(2, 4, rnd); } while (w * h < 4 || (w === 1 && h === 1));
  const A = w * h, P = 2 * (w + h);
  return {
    tipo: "pintar", pide: "pintar-ambos", unidad: "m", fig: { tipo: "celdas", celdas: [], w: 7, h: 6 },
    meta: { area: A, perimetro: P }, ejemplo: rectCeldas(1, 1, w, h),
    texto: `${c.e} Pintá ${c.n} de <b>${A} m²</b> que use <b>${P} m</b> de cerca.<small>Mirá abajo cuánto mide el tuyo mientras pintás.</small>`,
    voz: `Pintá ${c.n} de ${A} metros cuadrados que use ${P} metros de cerca.`,
    respuesta: A, confusiones: [], pista: `Probá con un rectángulo: ¿cuántas filas y cuántos cuadritos por fila dan ${A}?`,
    explica: "", marcar: "perimetro",
  };
}

function formulaArea(rnd) {
  const u = rnd() < 0.6 ? "m" : "cm", U = UNIDADES[u];
  let l, a;
  do { l = entero(4, 15, rnd); a = entero(2, 10, rnd); } while (a > l || l * a === 2 * (l + a));
  const lug = azar(LUGARES[u], rnd), A = l * a, P = 2 * (l + a);
  const confusiones = [esPerimetro(P, u), { v: l + a, msg: `Sumaste el largo y el ancho. Para el área se multiplican: largo × ancho.` }];
  return {
    tipo: "escribir", pide: "area", unidad: u, fig: { tipo: "rect", largo: l, ancho: a },
    texto: `${lug.e} ${lug.n} mide <b>${l} ${u}</b> de largo y <b>${a} ${u}</b> de ancho. ¿Cuál es su <b>área</b>?`,
    voz: `${lug.n} mide ${l} ${U.vl} de largo y ${a} ${U.vl} de ancho. ¿Cuál es su área?`,
    respuesta: A, sufijo: U.a, confusiones,
    pista: `El área de un rectángulo es largo × ancho: ${l} × ${a}.`,
    explica: `Área = largo × ancho = ${l} × ${a} = <b>${A} ${U.a}</b>. Son ${a} filas de ${l} cuadritos de 1 ${U.a}.`,
    marcar: "area",
  };
}
function formulaPerimetro(rnd) {
  const u = rnd() < 0.6 ? "m" : "cm", U = UNIDADES[u], lug = azar(LUGARES[u], rnd);
  if (rnd() < 0.3) {
    let s;
    do s = entero(3, 12, rnd); while (s === 4);
    const P = 4 * s;
    return {
      tipo: "escribir", pide: "perimetro", unidad: u, fig: { tipo: "rect", largo: s, ancho: s },
      texto: `${lug.e} ${lug.n} es un <b>cuadrado</b> de <b>${s} ${u}</b> de lado. ¿Cuál es su <b>perímetro</b>?`,
      voz: `${lug.n} es un cuadrado de ${s} ${U.vl} de lado. ¿Cuál es su perímetro?`,
      respuesta: P, sufijo: u, confusiones: [esArea(s * s, u), { v: 2 * s, msg: `Contaste solo dos lados. El cuadrado tiene cuatro lados iguales.` }],
      pista: `Un cuadrado tiene 4 lados iguales de ${s} ${u}.`,
      explica: `Un cuadrado tiene 4 lados iguales: ${s} + ${s} + ${s} + ${s} = 4 × ${s} = <b>${P} ${u}</b>.`,
      marcar: "perimetro",
    };
  }
  let l, a;
  do { l = entero(4, 15, rnd); a = entero(2, 10, rnd); } while (a >= l || l * a === 2 * (l + a));
  const P = 2 * (l + a);
  return {
    tipo: "escribir", pide: "perimetro", unidad: u, fig: { tipo: "rect", largo: l, ancho: a },
    texto: `${lug.e} ${lug.n} mide <b>${l} ${u}</b> de largo y <b>${a} ${u}</b> de ancho. ¿Cuál es su <b>perímetro</b>?`,
    voz: `${lug.n} mide ${l} ${U.vl} de largo y ${a} ${U.vl} de ancho. ¿Cuál es su perímetro?`,
    respuesta: P, sufijo: u,
    confusiones: [esArea(l * a, u), { v: l + a, msg: `Sumaste solo dos lados. El rectángulo tiene cuatro: dos largos y dos anchos.` }],
    pista: `Sumá los cuatro lados: dos de ${l} ${u} y dos de ${a} ${u}.`,
    explica: `Perímetro = ${l} + ${a} + ${l} + ${a} = 2 × (${l} + ${a}) = <b>${P} ${u}</b>.`,
    marcar: "perimetro",
  };
}

// Dos corrales: mismo perímetro y distinta área, o al revés
const MISMO_P = [[[4, 1], [3, 2]], [[5, 1], [4, 2]], [[5, 1], [3, 3]], [[4, 2], [3, 3]], [[6, 1], [5, 2]], [[6, 1], [4, 3]], [[5, 2], [4, 3]], [[6, 2], [5, 3]], [[6, 2], [4, 4]], [[5, 3], [4, 4]]];
const MISMA_A = [[[4, 1], [2, 2]], [[6, 1], [3, 2]], [[6, 2], [4, 3]], [[4, 3], [6, 2]], [[6, 1], [2, 3]]];
function comparar(rnd) {
  const mismoP = rnd() < 0.6;
  let [ra, rb] = barajar(azar(mismoP ? MISMO_P : MISMA_A, rnd), rnd);
  // Que el alto vaya en vertical y quepan lado a lado
  const [wa, ha] = ra[1] > 4 ? [ra[1], ra[0]] : ra, [wb, hb] = rb[1] > 4 ? [rb[1], rb[0]] : rb;
  const a = rectCeldas(1, 1, wa, ha), b = rectCeldas(wa + 2, 1, wb, hb);
  const Aa = wa * ha, Ab = wb * hb, Pa = 2 * (wa + ha), Pb = 2 * (wb + hb);
  const pideArea = rnd() < 0.5;
  const va = pideArea ? Aa : Pa, vb = pideArea ? Ab : Pb;
  const respuesta = va === vb ? "igual" : va > vb ? "verde" : "azul";
  const medida = pideArea ? "más espacio adentro (más área)" : "más metros de cerca (más perímetro)";
  const det = `El verde mide ${wa} × ${ha}: ${Aa} m² y ${Pa} m de cerca. El azul mide ${wb} × ${hb}: ${Ab} m² y ${Pb} m de cerca.`;
  const moraleja = mismoP ? "Usan la misma cerca, ¡pero no tienen la misma área!" : "Tienen la misma área, ¡pero no usan la misma cerca!";
  return {
    tipo: "comparar", pide: "comparar", unidad: "m", fig: { tipo: "dos", a, b, w: wa + wb + 3, h: Math.max(ha, hb) + 2 },
    texto: `🐄 ¿Cuál corral tiene <b>${medida}</b>?<small>Cada cuadrito mide 1 m².</small>`,
    voz: `¿Cuál corral tiene ${medida}?`,
    respuesta, opciones: ["verde", "azul", "igual"], confusiones: [],
    pista: pideArea ? "Contá los cuadritos de cada uno." : "Contá el borde de cada uno.",
    explica: `${det} ${moraleja}`, marcar: pideArea ? "area" : "perimetro",
  };
}

function eleCuadricula(rnd) {
  let W, H, cw, ch, A, P;
  do {
    W = entero(3, 6, rnd); H = entero(3, 5, rnd); cw = entero(1, W - 2, rnd); ch = entero(1, H - 2, rnd);
    A = W * H - cw * ch; P = 2 * (W + H);
  } while (A === P);
  const fig = { tipo: "celdas", celdas: eleCeldas(1, 1, W, H, cw, ch), w: W + 2, h: H + 2, ele: { x: 1, y: 1, W, H, cw, ch } };
  const c = azar(CORRALES, rnd);
  if (rnd() < 0.55) {
    const a1 = (W - cw) * ch, a2 = W * (H - ch);
    return {
      tipo: "escribir", pide: "area", unidad: "m", fig,
      texto: `${c.e} ${may(c.n)} tiene forma de L. ¿Cuál es su <b>área</b>?<small>Cada cuadrito mide 1 m².</small>`,
      voz: `${may(c.n)} tiene forma de ele. ¿Cuál es su área?`,
      respuesta: A, sufijo: "m²", confusiones: [esPerimetro(P, "m"), { v: W * H, msg: `Ese sería el rectángulo completo, pero a la L le falta una esquina.` }],
      pista: `Partí la L en dos rectángulos y sumá sus áreas.`,
      explica: `Partimos la L en dos rectángulos: arriba ${W - cw} × ${ch} = ${a1} y abajo ${W} × ${H - ch} = ${a2}. ${a1} + ${a2} = <b>${A} m²</b>.`,
      marcar: "partes",
    };
  }
  return {
    tipo: "escribir", pide: "perimetro", unidad: "m", fig,
    texto: `${c.e} ${may(c.n)} tiene forma de L. ¿Cuántos <b>metros de cerca</b> necesita?<small>Cada lado de un cuadrito mide 1 m.</small>`,
    voz: `${may(c.n)} tiene forma de ele. ¿Cuántos metros de cerca necesita?`,
    respuesta: P, sufijo: "m", confusiones: [esArea(A, "m")],
    pista: `Contá los lados de afuera dando toda la vuelta: la L tiene 6 lados.`,
    explica: `Los 6 lados: ${W} + ${H} + ${W - cw} + ${ch} + ${cw} + ${H - ch} = <b>${P} m</b>. ¡Lo mismo que el rectángulo de ${W} × ${H}!`,
    marcar: "perimetro",
  };
}

function trianguloCuadricula(rnd) {
  let b, h;
  do { b = entero(2, 8, rnd); h = entero(2, 6, rnd); } while ((b * h) % 2);
  const A = b * h / 2;
  return {
    tipo: "escribir", pide: "area", unidad: "m", fig: { tipo: "tri", base: b, altura: h, cuadricula: true },
    texto: `🌱 ¿Cuál es el <b>área</b> del jardín en forma de triángulo?<small>Cada cuadrito mide 1 m².</small>`,
    voz: `¿Cuál es el área del jardín en forma de triángulo? Cada cuadrito mide un metro cuadrado.`,
    respuesta: A, sufijo: "m²", confusiones: [{ v: b * h, msg: `Ese es el rectángulo completo. El triángulo es solo la mitad.` }],
    pista: `El triángulo es la mitad de un rectángulo de ${b} × ${h}.`,
    explica: `El triángulo es la mitad del rectángulo de ${b} × ${h} = ${b * h}. La mitad: ${b * h} ÷ 2 = <b>${A} m²</b>. Área = base × altura ÷ 2.`,
    marcar: "mitad",
  };
}

function compuestaMedidas(rnd) {
  const u = rnd() < 0.7 ? "m" : "cm", U = UNIDADES[u];
  if (rnd() < 0.55) {
    let W, H, cw, ch, A, P;
    do {
      W = entero(6, 16, rnd); H = entero(5, 12, rnd); cw = entero(2, W - 3, rnd); ch = entero(2, H - 3, rnd);
      A = W * H - cw * ch; P = 2 * (W + H);
    } while (A === P);
    const fig = { tipo: "ele", W, H, cw, ch };
    if (rnd() < 0.6) {
      const a1 = (W - cw) * ch, a2 = W * (H - ch);
      return {
        tipo: "escribir", pide: "area", unidad: u, fig,
        texto: `🏡 El terreno tiene forma de L. ¿Cuál es su <b>área</b>?`,
        voz: `El terreno tiene forma de ele. Mirá las medidas. ¿Cuál es su área?`,
        respuesta: A, sufijo: U.a, confusiones: [esPerimetro(P, u), { v: W * H, msg: `Ese sería el rectángulo completo, pero a la L le falta una esquina.` }],
        pista: `Partí la L en dos rectángulos con una línea y sumá sus áreas.`,
        explica: `Arriba: ${W - cw} × ${ch} = ${a1}. Abajo: ${W} × ${H - ch} = ${a2}. Total: ${a1} + ${a2} = <b>${A} ${U.a}</b>.`,
        marcar: "partes",
      };
    }
    return {
      tipo: "escribir", pide: "perimetro", unidad: u, fig,
      texto: `🏡 El terreno tiene forma de L. ¿Cuál es su <b>perímetro</b>?`,
      voz: `El terreno tiene forma de ele. Mirá las medidas. ¿Cuál es su perímetro?`,
      respuesta: P, sufijo: u, confusiones: [esArea(A, u)],
      pista: `Sumá los 6 lados de afuera.`,
      explica: `${W} + ${H} + ${W - cw} + ${ch} + ${cw} + ${H - ch} = <b>${P} ${u}</b>. ¡Igual que el rectángulo de ${W} × ${H}!`,
      marcar: "perimetro",
    };
  }
  let b, h;
  do { b = entero(4, 20, rnd); h = entero(3, 14, rnd); } while ((b * h) % 2);
  const A = b * h / 2;
  return {
    tipo: "escribir", pide: "area", unidad: u, fig: { tipo: "tri", base: b, altura: h },
    texto: `📐 El triángulo tiene <b>${b} ${u}</b> de base y <b>${h} ${u}</b> de altura. ¿Cuál es su <b>área</b>?`,
    voz: `El triángulo tiene ${b} ${U.vl} de base y ${h} ${U.vl} de altura. ¿Cuál es su área?`,
    respuesta: A, sufijo: U.a, confusiones: [{ v: b * h, msg: `Te faltó dividir entre 2: el triángulo es la mitad del rectángulo.` }],
    pista: `Área del triángulo = base × altura ÷ 2.`,
    explica: `Área = base × altura ÷ 2 = ${b} × ${h} ÷ 2 = ${b * h} ÷ 2 = <b>${A} ${U.a}</b>.`,
    marcar: "mitad",
  };
}

function problemaFinca(rnd) {
  const t = azar(["cerca", "huerta", "cancha", "ceramica"], rnd);
  if (t === "cerca") {
    const l = entero(10, 30, rnd), a = entero(6, Math.min(20, l), rnd), P = 2 * (l + a), costo = P * PRECIO_ALAMBRE;
    return {
      tipo: "escribir", pide: "costo-perimetro", precio: PRECIO_ALAMBRE, unidad: "m", fig: { tipo: "rect", largo: l, ancho: a },
      texto: `🐴 Don Chepe va a cercar su potrero de <b>${l} m</b> por <b>${a} m</b> con una vuelta de alambre. El metro cuesta <b>₡850</b>. ¿Cuánto paga?`,
      voz: `Don Chepe va a cercar su potrero de ${l} metros por ${a} metros con una vuelta de alambre. El metro cuesta 850 colones. ¿Cuánto paga?`,
      respuesta: costo, prefijo: "₡",
      confusiones: [{ v: P, msg: `Esos son los metros de alambre (el perímetro). Falta multiplicar por ₡850.` },
        { v: l * a * PRECIO_ALAMBRE, msg: `Usaste el área. La cerca va por el borde: primero el perímetro.` }],
      pista: `Primero el perímetro: 2 × (${l} + ${a}). Después multiplicá por 850.`,
      explica: `Perímetro: 2 × (${l} + ${a}) = ${P} m. Costo: ${P} × ₡850 = <b>${colones(costo)}</b>.`,
      marcar: "perimetro",
    };
  }
  if (t === "huerta") {
    let l, a;
    do { l = entero(3, 8, rnd); a = entero(2, Math.min(6, l), rnd); } while (l * a === 2 * (l + a));
    return {
      tipo: "escribir", pide: "area", unidad: "m", fig: { tipo: "rect", largo: l, ancho: a },
      texto: `🥬 La huerta de la escuela mide <b>${l} m</b> por <b>${a} m</b>. En cada metro cuadrado va una mata de lechuga. ¿Cuántas matas caben?`,
      voz: `La huerta de la escuela mide ${l} metros por ${a} metros. En cada metro cuadrado va una mata de lechuga. ¿Cuántas matas caben?`,
      respuesta: l * a, sufijo: "matas", confusiones: [esPerimetro(2 * (l + a), "m")],
      pista: `Una mata por cada metro cuadrado: calculá el área.`,
      explica: `Área = ${l} × ${a} = ${l * a} m², o sea <b>${l * a} matas</b>.`,
      marcar: "area",
    };
  }
  if (t === "cancha") {
    const l = entero(20, 45, rnd), a = entero(12, Math.min(30, l - 4), rnd), P = 2 * (l + a);
    return {
      tipo: "escribir", pide: "perimetro", unidad: "m", fig: { tipo: "rect", largo: l, ancho: a },
      texto: `⚽ Hay que marcar con cal el borde de la plaza de <b>${l} m</b> por <b>${a} m</b>. ¿Cuántos metros hay que marcar?`,
      voz: `Hay que marcar con cal el borde de la plaza de ${l} metros por ${a} metros. ¿Cuántos metros hay que marcar?`,
      respuesta: P, sufijo: "m", confusiones: [esArea(l * a, "m")],
      pista: `El borde es el perímetro: 2 × (${l} + ${a}).`,
      explica: `Perímetro = 2 × (${l} + ${a}) = <b>${P} m</b> de cal.`,
      marcar: "perimetro",
    };
  }
  let l, a;
  do { l = entero(3, 6, rnd); a = entero(2, Math.min(5, l), rnd); } while (l * a === 2 * (l + a));
  return {
    tipo: "escribir", pide: "area", unidad: "m", fig: { tipo: "rect", largo: l, ancho: a },
    texto: `🏠 La cocina de doña Rosa mide <b>${l} m</b> por <b>${a} m</b>. ¿Cuántos <b>m²</b> de cerámica necesita para el piso?`,
    voz: `La cocina de doña Rosa mide ${l} metros por ${a} metros. ¿Cuántos metros cuadrados de cerámica necesita para el piso?`,
    respuesta: l * a, sufijo: "m²", confusiones: [esPerimetro(2 * (l + a), "m")],
    pista: `El piso es lo de adentro: el área.`,
    explica: `Área = ${l} × ${a} = <b>${l * a} m²</b> de cerámica.`,
    marcar: "area",
  };
}

const PRECIOS_CERAMICA = [5000, 6000, 7500, 8000, 9500];
function problemaDosPasos(rnd) {
  const t = azar(["ceramica", "pared", "terreno", "zacate"], rnd);
  if (t === "ceramica") {
    let l, a;
    do { l = entero(3, 6, rnd); a = entero(2, Math.min(5, l), rnd); } while (l * a === 2 * (l + a));
    const precio = azar(PRECIOS_CERAMICA, rnd), A = l * a, costo = A * precio;
    return {
      tipo: "escribir", pide: "costo-area", precio, unidad: "m", fig: { tipo: "rect", largo: l, ancho: a },
      texto: `🏠 La cerámica cuesta <b>${colones(precio)}</b> el m². ¿Cuánto cuesta ponerle piso a una cocina de <b>${l} m</b> por <b>${a} m</b>?`,
      voz: `La cerámica cuesta ${precio} colones el metro cuadrado. ¿Cuánto cuesta ponerle piso a una cocina de ${l} metros por ${a} metros?`,
      respuesta: costo, prefijo: "₡",
      confusiones: [{ v: A, msg: `Esos son los m² de piso. Falta multiplicar por el precio.` },
        { v: 2 * (l + a) * precio, msg: `Usaste el perímetro. El piso es lo de adentro: el área.` }],
      pista: `Primero el área: ${l} × ${a}. Después multiplicá por ${miles(precio)}.`,
      explica: `Área: ${l} × ${a} = ${A} m². Costo: ${A} × ${colones(precio)} = <b>${colones(costo)}</b>.`,
      marcar: "area",
    };
  }
  if (t === "pared") {
    const largo = entero(4, 8, rnd), alto = entero(2, 3, rnd), A = largo * alto - 2;
    return {
      tipo: "escribir", pide: "pared", unidad: "m", fig: { tipo: "pared", largo, alto, puerta: { w: 1, h: 2 } },
      texto: `🎨 Hay que pintar una pared de <b>${largo} m</b> de largo y <b>${alto} m</b> de alto. La puerta mide <b>1 m</b> por <b>2 m</b> y no se pinta. ¿Cuántos <b>m²</b> hay que pintar?`,
      voz: `Hay que pintar una pared de ${largo} metros de largo y ${alto} metros de alto. La puerta mide 1 metro por 2 metros y no se pinta. ¿Cuántos metros cuadrados hay que pintar?`,
      respuesta: A, sufijo: "m²", confusiones: [{ v: largo * alto, msg: `Esa es toda la pared. Falta quitar la puerta, que no se pinta.` }],
      pista: `Área de la pared menos el área de la puerta.`,
      explica: `Pared: ${largo} × ${alto} = ${largo * alto} m². Puerta: 1 × 2 = 2 m². Se pinta: ${largo * alto} − 2 = <b>${A} m²</b>.`,
      marcar: "area",
    };
  }
  if (t === "terreno") {
    const W = entero(10, 30, rnd), H = entero(8, 24, rnd), cw = entero(3, W - 4, rnd), ch = entero(3, H - 4, rnd);
    const P = 2 * (W + H), costo = P * PRECIO_ALAMBRE;
    return {
      tipo: "escribir", pide: "costo-perimetro", precio: PRECIO_ALAMBRE, unidad: "m", fig: { tipo: "ele", W, H, cw, ch },
      texto: `🐄 El terreno en forma de L se va a cercar con una vuelta de alambre a <b>₡850</b> el metro. ¿Cuánto cuesta?`,
      voz: `El terreno en forma de ele se va a cercar con una vuelta de alambre a 850 colones el metro. Mirá las medidas. ¿Cuánto cuesta?`,
      respuesta: costo, prefijo: "₡",
      confusiones: [{ v: P, msg: `Esos son los metros de alambre (el perímetro). Falta multiplicar por ₡850.` }],
      pista: `Sumá los 6 lados y multiplicá por 850.`,
      explica: `Perímetro: ${W} + ${H} + ${W - cw} + ${ch} + ${cw} + ${H - ch} = ${P} m. Costo: ${P} × ₡850 = <b>${colones(costo)}</b>.`,
      marcar: "perimetro",
    };
  }
  let b, h;
  do { b = entero(4, 16, rnd); h = entero(3, 12, rnd); } while ((b * h) % 2);
  return {
    tipo: "escribir", pide: "area", unidad: "m", fig: { tipo: "tri", base: b, altura: h },
    texto: `🌿 El jardín tiene forma de triángulo: <b>${b} m</b> de base y <b>${h} m</b> de altura. ¿Cuántos <b>m²</b> de zacate hacen falta para cubrirlo?`,
    voz: `El jardín tiene forma de triángulo: ${b} metros de base y ${h} metros de altura. ¿Cuántos metros cuadrados de zacate hacen falta?`,
    respuesta: b * h / 2, sufijo: "m²", confusiones: [{ v: b * h, msg: `Te faltó dividir entre 2: el triángulo es la mitad del rectángulo.` }],
    pista: `Área del triángulo = base × altura ÷ 2.`,
    explica: `Área = ${b} × ${h} ÷ 2 = ${b * h} ÷ 2 = <b>${b * h / 2} m²</b> de zacate.`,
    marcar: "mitad",
  };
}

// ---------- 🪜 Escalones: de contar cuadritos a problemas de dos pasos ----------
export const ESCALONES = [
  { id: "contar-area", nombre: "Área: contar cuadritos", gen: rnd => contarArea(rnd, "opciones", 4, 3) },          //  1. corral chico, 3 opciones
  { id: "contar-perimetro", nombre: "Perímetro: contar el borde", gen: rnd => contarPerimetro(rnd, "opciones", 4, 3) }, //  2. el borde, 3 opciones
  { id: "pintar-area", nombre: "Pintá el corral", gen: rnd => pintarCorral(rnd, false) },                            //  3. pintar N m², todo junto
  { id: "escribir-area", nombre: "Área en la cuadrícula", gen: rnd => contarArea(rnd, "escribir", 7, 5) },          //  4. escribir el área
  { id: "escribir-perimetro", nombre: "Perímetro en la cuadrícula", gen: rnd => contarPerimetro(rnd, "escribir", 7, 5) }, // 5. escribir el perímetro
  { id: "formula-area", nombre: "Área: largo × ancho", gen: formulaArea },                                          //  6. sin cuadrícula, con medidas
  { id: "formula-perimetro", nombre: "Perímetro: sumar los lados", gen: formulaPerimetro },                         //  7. rectángulos y cuadrados
  { id: "comparar", nombre: "¿Cuál tiene más?", gen: comparar },                                                     //  8. misma cerca, distinta área
  { id: "ele", nombre: "Figuras en L", gen: eleCuadricula },                                                         //  9. partir en dos rectángulos
  { id: "finca", nombre: "Problemas de la finca", gen: problemaFinca },                                              // 10. potrero, huerta, plaza, cocina
  { id: "triangulo", nombre: "Triángulos", gen: trianguloCuadricula },                                               // 11. la mitad del rectángulo
  { id: "compuestas", nombre: "Figuras con medidas", gen: compuestaMedidas },                                        // 12. L y triángulos sin cuadrícula
  { id: "corral-ambos", nombre: "Corral con área y cerca", gen: rnd => pintarCorral(rnd, true) },                    // 13. área y perímetro a la vez
  { id: "dos-pasos", nombre: "Problemas de dos pasos", gen: problemaDosPasos },                                      // 14. cerámica, pared, terreno, zacate
];

/** Escalón para empezar según la edad (3.° grado ≈ 8 años). */
export const inicioPorEdad = edad => edad === null || edad <= 8 ? 0 : edad === 9 ? 2 : edad === 10 ? 4 : edad === 11 ? 5 : 7;

/** Una ronda de un escalón (índice). */
export const ronda = (i, rnd = Math.random) => ({ escalon: ESCALONES[i].id, ...ESCALONES[i].gen(rnd) });

/** ¿El corral que pintó el niño cumple? Devuelve { ok, area, perimetro, junto }. */
export function revisarPintado(celdas, meta) {
  const A = celdas.length, P = perimetroCeldas(celdas), junto = conexa(celdas);
  return { ok: junto && A === meta.area && (meta.perimetro === undefined || P === meta.perimetro), area: A, perimetro: P, junto };
}

/** Revisa que una ronda esté bien armada. Devuelve la lista de problemas (vacía = bien). */
export function revisarRonda(r) {
  const mal = [], f = r.fig;
  const esperado = {
    area: () => area(f), perimetro: () => perimetro(f), pared: () => area(f),
    "costo-perimetro": () => perimetro(f) * r.precio, "costo-area": () => area(f) * r.precio,
    "pintar-area": () => r.meta.area, "pintar-ambos": () => r.meta.area,
    comparar: () => {
      const m = r.marcar === "area" ? (c => c.length) : perimetroCeldas, va = m(f.a), vb = m(f.b);
      return va === vb ? "igual" : va > vb ? "verde" : "azul";
    },
  }[r.pide];
  if (!esperado) return [`pide desconocido: ${r.pide}`];
  if (esperado() !== r.respuesta) mal.push(`respuesta ${r.respuesta}, esperaba ${esperado()}`);
  if (typeof r.respuesta === "number" && (!Number.isInteger(r.respuesta) || r.respuesta <= 0)) mal.push(`respuesta rara: ${r.respuesta}`);
  for (const c of r.confusiones || []) if (c.v === r.respuesta) mal.push(`una confusión da la respuesta (${c.v})`);
  if (r.tipo === "opciones" || r.tipo === "comparar") {
    if (!r.opciones?.includes(r.respuesta)) mal.push("la respuesta no está en las opciones");
    if (new Set(r.opciones).size !== r.opciones.length) mal.push("opciones repetidas");
    if (r.opciones.length !== 3) mal.push(`${r.opciones.length} opciones`);
    if (r.opciones.some(o => typeof o === "number" && o <= 0)) mal.push("opción ≤ 0");
  }
  // Que la figura quepa en su cuadrícula
  const enTablero = cs => cs.every(([x, y]) => x >= 0 && y >= 0 && x < f.w && y < f.h);
  if (f.tipo === "celdas" && !enTablero(f.celdas)) mal.push("no cabe en la cuadrícula");
  if (f.tipo === "dos" && !(enTablero(f.a) && enTablero(f.b))) mal.push("los corrales no caben");
  if (f.tipo === "dos" && f.w > 15) mal.push(`cuadrícula muy ancha (${f.w})`);
  if (f.tipo === "celdas" && f.w > 9) mal.push(`cuadrícula muy ancha (${f.w})`);
  if (r.tipo === "pintar") {
    if (!r.ejemplo.every(([x, y]) => x >= 0 && y >= 0 && x < f.w && y < f.h)) mal.push("el ejemplo no cabe");
    if (!revisarPintado(r.ejemplo, r.meta).ok) mal.push("el ejemplo no cumple");
  }
  if (f.tipo === "celdas" && f.ele && !conexa(f.celdas)) mal.push("la L no está junta");
  return mal;
}
