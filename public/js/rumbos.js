// 🧭 Lógica de «Direcciones a lo tico» (sin pantalla, para poder probarla sola con node).
//
// Un pueblo en cuadrícula con el norte arriba: cada cuadrito es una cuadra de 100 metros.
// Arriba = norte, abajo = sur, derecha = este, izquierda = oeste.
// Cada pregunta trae lo que se dibuja (`vista`), cómo se contesta (`responder`) y la `respuesta`;
// `revisarPregunta()` vuelve a calcular la respuesta por otro camino para asegurar que hay UNA sola.

const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const entre = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
const cap = t => t.charAt(0).toUpperCase() + t.slice(1);

// ---------- Puntos cardinales ----------
export const DIRS = {
  N: { n: "norte", dx: 0, dy: -1, ang: 0, lado: "arriba" },
  NE: { n: "noreste", dx: 1, dy: -1, ang: 45, lado: "arriba a la derecha" },
  E: { n: "este", dx: 1, dy: 0, ang: 90, lado: "a la derecha" },
  SE: { n: "sureste", dx: 1, dy: 1, ang: 135, lado: "abajo a la derecha" },
  S: { n: "sur", dx: 0, dy: 1, ang: 180, lado: "abajo" },
  SO: { n: "suroeste", dx: -1, dy: 1, ang: 225, lado: "abajo a la izquierda" },
  O: { n: "oeste", dx: -1, dy: 0, ang: 270, lado: "a la izquierda" },
  NO: { n: "noroeste", dx: -1, dy: -1, ang: 315, lado: "arriba a la izquierda" },
};
export const PRINCIPALES = ["N", "E", "S", "O"];
export const OCHO = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
/** Rumbo (de los 8) de un desplazamiento en el mapa. */
export const dirDe = (dx, dy) => OCHO.find(k => DIRS[k].dx === Math.sign(dx) && DIRS[k].dy === Math.sign(dy));
/** ¿Están pegados en la rosa (45° de diferencia)? */
export const vecinas = (a, b) => { const d = Math.abs(DIRS[a].ang - DIRS[b].ang) % 360; return d === 45 || d === 315; };

export const PISTA = {
  N: "El norte casi siempre se dibuja arriba, con la letra N.",
  S: "El sur está al lado contrario del norte: abajo.",
  E: "Con el norte arriba, el este queda a la derecha.",
  O: "Con el norte arriba, el oeste queda a la izquierda. Se escribe con O.",
  NE: "El noreste está entre el norte y el este: arriba a la derecha.",
  NO: "El noroeste está entre el norte y el oeste: arriba a la izquierda.",
  SE: "El sureste está entre el sur y el este: abajo a la derecha.",
  SO: "El suroeste está entre el sur y el oeste: abajo a la izquierda.",
};
export const TRUCO = "Truco: dando la vuelta como las agujas del reloj, «Nunca Escribas Sin Ortografía»: norte, este, sur y oeste.";

// ---------- El pueblo ----------
// corto: lo que se escribe debajo del dibujo en el mapa
export const LUGARES = [
  { id: "iglesia", e: "⛪", n: "iglesia", art: "la", corto: "iglesia" },
  { id: "escuela", e: "🏫", n: "escuela", art: "la", corto: "escuela" },
  { id: "pulperia", e: "🏪", n: "pulpería", art: "la", corto: "pulpería" },
  { id: "banco", e: "🏦", n: "Banco", art: "el", corto: "Banco" },
  { id: "ebais", e: "🏥", n: "EBAIS", art: "el", corto: "EBAIS" },
  { id: "plaza", e: "⚽", n: "plaza", art: "la", corto: "plaza" },
  { id: "parque", e: "⛲", n: "parque", art: "el", corto: "parque" },
  { id: "parada", e: "🚏", n: "parada del bus", art: "la", corto: "parada" },
  { id: "mango", e: "🥭", n: "palo de mango", art: "el", corto: "mango" },
  { id: "soda", e: "🍲", n: "soda", art: "la", corto: "soda" },
  { id: "farmacia", e: "💊", n: "farmacia", art: "la", corto: "farmacia" },
  { id: "bomba", e: "⛽", n: "bomba", art: "la", corto: "bomba" },
  { id: "correo", e: "📮", n: "correo", art: "el", corto: "correo" },
  { id: "bomberos", e: "🚒", n: "estación de bomberos", art: "la", corto: "bomberos" },
  { id: "panaderia", e: "🥖", n: "panadería", art: "la", corto: "panadería" },
  { id: "biblioteca", e: "📚", n: "biblioteca", art: "la", corto: "biblioteca" },
];
export const lugar = id => LUGARES.find(l => l.id === id);
export const nom = l => `${l.art} ${l.n}`;                                     // la iglesia · el Banco
export const del = l => (l.art === "el" ? `del ${l.n}` : `de ${l.art} ${l.n}`); // del Banco · de la iglesia
export const al = l => (l.art === "el" ? `al ${l.n}` : `a ${l.art} ${l.n}`);    // al Banco · a la iglesia
export const LETRAS = "ABCDEFGH";
export const coord = (x, y) => `${LETRAS[x]}${y + 1}`;
const metros = k => `${k * 100} metros`;
const cuadras = k => `${k} ${k === 1 ? "cuadra" : "cuadras"}`;
const PERSONAS = ["Una turista", "Tu prima", "Don Carlos", "Doña Rosa", "Un compañero nuevo", "La maestra"];

/**
 * Un pueblo al azar. celdas[y][x]: id de un lugar, "casa" o null (lote vacío).
 * @param {{cols:number, rows:number, lugares:number}} cfg
 */
export function armarMapa({ cols, rows, lugares }, rnd = Math.random) {
  const celdas = Array.from({ length: rows }, () => Array(cols).fill(null));
  const todas = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) todas.push([x, y]);
  const libres = barajar(todas, rnd);
  barajar(LUGARES, rnd).slice(0, lugares).forEach((l, i) => { const [x, y] = libres[i]; celdas[y][x] = l.id; });
  libres.slice(lugares).forEach(([x, y]) => { if (rnd() < 0.45) celdas[y][x] = "casa"; });
  return { cols, rows, celdas };
}
export const dentro = (m, x, y) => x >= 0 && y >= 0 && x < m.cols && y < m.rows;
/** El lugar (con nombre) que hay en una celda, o null. */
export const lugarEn = (m, x, y) => (dentro(m, x, y) && m.celdas[y][x] && m.celdas[y][x] !== "casa" ? lugar(m.celdas[y][x]) : null);
export function posDe(m, id) {
  for (let y = 0; y < m.rows; y++) for (let x = 0; x < m.cols; x++) if (m.celdas[y][x] === id) return [x, y];
  return null;
}
const nombrados = m => LUGARES.filter(l => posDe(m, l.id));
const clave = ([x, y]) => `${x},${y}`;
const leerClave = k => k.split(",").map(Number);

// Tramos de una dirección a lo tico: [{ d: "E", k: 2 }, …] → texto «200 metros al este y 100 al sur»
function tramosTxt(tramos, corto = false) {
  const t = tramos.map((p, i) => `${corto ? `${p.k * 100} m` : i === 0 ? metros(p.k) : p.k * 100} al ${DIRS[p.d].n}`);
  return t.length === 1 ? t[0] : `${t.slice(0, -1).join(", ")} y ${t[t.length - 1]}`;
}
const sumar = (pos, tramos) => tramos.reduce(([x, y], p) => [x + DIRS[p.d].dx * p.k, y + DIRS[p.d].dy * p.k], pos);
const caminoDe = (pos, tramos) => { const pts = [pos]; tramos.forEach(p => pts.push(sumar(pts[pts.length - 1], [p]))); return pts; };
/** Tramos en L de A a B: primero en un eje y después en el otro. */
function enL(a, b, primeroX) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const tx = dx ? [{ d: dx > 0 ? "E" : "O", k: Math.abs(dx) }] : [], ty = dy ? [{ d: dy > 0 ? "S" : "N", k: Math.abs(dy) }] : [];
  return primeroX ? [...tx, ...ty] : [...ty, ...tx];
}

// ---------- Preguntas de cada escalón ----------
function rosa4(rnd) {
  const d = azar(["E", "O", "S", "E", "O", "S", "N"], rnd);
  return {
    texto: `Tocá el <b>${DIRS[d].n}</b> en la rosa de los vientos.`, voz: `Tocá el ${DIRS[d].n} en la rosa de los vientos.`,
    vista: { rosa: { puntas: 4, etiquetas: ["N"] } }, responder: "rosa", respuesta: d,
    explica: `${PISTA[d]} ${TRUCO}`,
  };
}

function rosa8(rnd) {
  const d = azar(["NE", "NO", "SE", "SO", "NE", "NO", "SE", "SO", "N", "S", "E", "O"], rnd);
  return {
    texto: `Tocá el <b>${DIRS[d].n}</b> en la rosa de los vientos.`, voz: `Tocá el ${DIRS[d].n}.`,
    vista: { rosa: { puntas: 8, etiquetas: PRINCIPALES } }, responder: "rosa", respuesta: d,
    explica: `${PISTA[d]} Los puntos intermedios juntan el nombre de los dos que tienen al lado: norte + este = noreste.`,
  };
}

// 🌅 Orientarse con el sol. Brazo derecho hacia donde sale el sol: al frente el norte, atrás el sur, el izquierdo al oeste.
const CUERPO = "Si extendés el brazo derecho hacia donde sale el sol, ese brazo señala el este; el izquierdo, el oeste; al frente queda el norte y a la espalda, el sur.";
const SOL = [
  { e: "🌅", q: "¿Por dónde sale el sol en la mañana?", r: "E", x: "El sol sale por el este. Por eso al este también le dicen «oriente» o «levante»." },
  { e: "🌇", q: "¿Por dónde se pone el sol en la tarde?", r: "O", x: "El sol se pone (se oculta) por el oeste. Al oeste también le dicen «occidente» o «poniente»." },
  { e: "🙆", q: "Extendés el brazo derecho hacia donde sale el sol. ¿Qué punto cardinal queda al frente?", r: "N", x: CUERPO },
  { e: "🙆", q: "Extendés el brazo derecho hacia donde sale el sol. ¿Qué punto cardinal queda a tu espalda?", r: "S", x: CUERPO },
  { e: "🙆", q: "Extendés el brazo derecho hacia donde sale el sol. ¿Qué punto cardinal señala tu brazo izquierdo?", r: "O", x: CUERPO },
  { e: "🌄🧍", q: "En la mañana, ¿hacia dónde apunta tu sombra?", r: "O", x: "En la mañana el sol está por el este, y la sombra cae al lado contrario: hacia el oeste." },
  { e: "🌆🧍", q: "En la tarde, ¿hacia dónde apunta tu sombra?", r: "E", x: "En la tarde el sol está por el oeste, y la sombra cae al lado contrario: hacia el este." },
];
function sol(rnd) {
  const s = azar(SOL, rnd);
  return {
    texto: s.q, voz: s.q, vista: { sol: s.e }, responder: "opcion", respuesta: s.r,
    opciones: PRINCIPALES.map(d => ({ id: d, txt: cap(DIRS[d].n) })), explica: s.x,
  };
}

/** Prueba armar una pregunta de mapa hasta que salga (casi siempre a la primera). */
function conMapa(cfg, rnd, fn) {
  for (let i = 0; i < 400; i++) { const m = armarMapa(cfg, rnd); const q = fn(m); if (q) return q; }
  throw new Error("No se pudo armar la pregunta");
}

// ¿Qué hay 100 metros al norte de…? (justo la cuadra de al lado)
function vecino(cfg, rnd) {
  return conMapa(cfg, rnd, m => {
    const pares = [];
    for (const R of nombrados(m)) {
      const [x, y] = posDe(m, R.id);
      for (const d of PRINCIPALES) { const T = lugarEn(m, x + DIRS[d].dx, y + DIRS[d].dy); if (T) pares.push({ R, T, d }); }
    }
    if (!pares.length) return null;
    const { R, T, d } = azar(pares, rnd), pr = posDe(m, R.id), pt = posDe(m, T.id);
    return {
      texto: `¿Qué hay <b>100 metros al ${DIRS[d].n}</b> ${del(R)}?`, voz: `¿Qué hay 100 metros al ${DIRS[d].n} ${del(R)}? Tocalo en el mapa.`,
      vista: { mapa: m, ref: pr }, responder: "mapa", respuesta: clave(pt), datos: { ref: R.id, tramos: [{ d, k: 1 }] },
      explica: `Al ${DIRS[d].n} es ${DIRS[d].lado === "arriba" || DIRS[d].lado === "abajo" ? "hacia " : ""}${DIRS[d].lado} en el mapa. Una cuadra (100 metros) ${DIRS[d].lado} ${del(R)} está ${nom(T)}.`,
    };
  });
}

// ¿Hacia dónde queda…? Con 4 rumbos (en la misma fila o columna) o con 8.
function hacia(cfg, ocho, rnd) {
  return conMapa(cfg, rnd, m => {
    const ls = nombrados(m), pares = [];
    for (const R of ls) for (const T of ls) {
      if (R === T) continue;
      const [x1, y1] = posDe(m, R.id), [x2, y2] = posDe(m, T.id), dx = x2 - x1, dy = y2 - y1;
      const alineados = dx === 0 || dy === 0;
      if (!ocho && (!alineados || Math.abs(dx) + Math.abs(dy) > 3)) continue;
      pares.push({ R, T, dx, dy, alineados });
    }
    // Con 8 rumbos se prefieren los intermedios (noreste, suroeste…)
    const lista = ocho && rnd() < 0.75 ? pares.filter(p => !p.alineados) : pares;
    if (!lista.length) return null;
    const { R, T, dx, dy } = azar(lista, rnd), d = dirDe(dx, dy);
    let explica;
    if (dx === 0 || dy === 0) {
      const k = Math.abs(dx) + Math.abs(dy);
      explica = `${cap(nom(T))} está ${DIRS[d].lado} ${del(R)} en el mapa, así que queda al ${DIRS[d].n}: ${metros(k)} al ${DIRS[d].n}.`;
    } else {
      const v = dy < 0 ? "N" : "S", h = dx > 0 ? "E" : "O";
      explica = `${cap(nom(T))} está más ${DIRS[v].lado} y más ${DIRS[h].lado} que ${nom(R)}: entre el ${DIRS[v].n} y el ${DIRS[h].n}, o sea, al ${DIRS[d].n}.`;
    }
    return {
      texto: `¿Hacia dónde queda <b>${nom(T)}</b> desde ${nom(R)}? Tocá la rosa.`, voz: `¿Hacia dónde queda ${nom(T)} desde ${nom(R)}? Tocá el rumbo en la rosa de los vientos.`,
      vista: { mapa: m, ref: posDe(m, R.id), marcar: [posDe(m, T.id)], rosa: { puntas: ocho ? 8 : 4, etiquetas: PRINCIPALES } },
      responder: "rosa", respuesta: d, datos: { ref: R.id, dest: T.id }, explica,
    };
  });
}

// 🚶 De la iglesia, 200 metros al este y 100 al sur: ¿a dónde llegás?
function ir(cfg, nTramos, rnd) {
  return conMapa(cfg, rnd, m => {
    for (let intento = 0; intento < 60; intento++) {
      const R = azar(nombrados(m), rnd), pr = posDe(m, R.id);
      const primeroX = rnd() < 0.5, ejes = primeroX ? ["x", "y", "x"] : ["y", "x", "y"];
      const tramos = [];
      for (let i = 0; i < nTramos; i++) {
        const eje = ejes[i], k = i === 2 ? entre(1, 2, rnd) : entre(1, 3, rnd);
        // El tercer tramo sigue para el mismo lado que el primero (una dirección de verdad no se devuelve)
        tramos.push({ d: i === 2 ? tramos[0].d : eje === "x" ? azar(["E", "O"], rnd) : azar(["N", "S"], rnd), k });
      }
      const pts = caminoDe(pr, tramos);
      if (!pts.every(([x, y]) => dentro(m, x, y))) continue;
      const fin = pts[pts.length - 1], T = lugarEn(m, ...fin);
      if (!T || T === R) continue;
      return {
        texto: `${cap(del(R))}, <b>${tramosTxt(tramos)}</b>. ¿A dónde llegás?`,
        voz: `${cap(del(R))}, ${tramosTxt(tramos)}. ¿A dónde llegás? Tocalo en el mapa.`,
        vista: { mapa: m, ref: pr, camino: pts }, responder: "mapa", respuesta: clave(fin), datos: { ref: R.id, tramos },
        explica: `${cap(del(R))}: ${tramos.map(p => `${cuadras(p.k)} al ${DIRS[p.d].n} (${DIRS[p.d].lado})`).join(", ")}. Llegás ${al(T)}.`,
      };
    }
    return null;
  });
}

// 🗣️ Dar la dirección: ¿cuál de estas lleva al lugar?
function dar(cfg, rnd) {
  return conMapa(cfg, rnd, m => {
    const ls = nombrados(m), pares = [];
    for (const R of ls) for (const T of ls) {
      if (R === T) continue;
      const [x1, y1] = posDe(m, R.id), [x2, y2] = posDe(m, T.id);
      if (x1 !== x2 && y1 !== y2 && Math.abs(x2 - x1) <= 3 && Math.abs(y2 - y1) <= 3) pares.push({ R, T });
    }
    if (!pares.length) return null;
    const { R, T } = azar(pares, rnd), pr = posDe(m, R.id), pt = posDe(m, T.id);
    const bien = enL(pr, pt, rnd() < 0.5);
    const OPUESTO = { N: "S", S: "N", E: "O", O: "E" };
    const variantes = [
      [{ ...bien[0], d: OPUESTO[bien[0].d] }, bien[1]],
      [bien[0], { ...bien[1], d: OPUESTO[bien[1].d] }],
      [{ ...bien[0], d: OPUESTO[bien[0].d] }, { ...bien[1], d: OPUESTO[bien[1].d] }],
      [{ ...bien[0], k: bien[1].k }, { ...bien[1], k: bien[0].k }],
    ];
    const vec = ts => clave(sumar([0, 0], ts));
    const vistos = new Set([vec(bien)]), malas = [];
    for (const v of barajar(variantes, rnd)) if (!vistos.has(vec(v)) && malas.length < 3) { vistos.add(vec(v)); malas.push(v); }
    if (malas.length < 2) return null;
    const texto = ts => `${cap(del(R))}, ${tramosTxt(ts, true)}`;
    const opciones = barajar([bien, ...malas].map((ts, i) => ({ id: String(i), txt: texto(ts), tramos: ts })), rnd);
    const quien = azar(PERSONAS, rnd);
    return {
      texto: `${quien} quiere ir ${al(T)} ${T.e}. ¿Qué dirección le das?`, voz: `${quien} quiere ir ${al(T)}. ¿Qué dirección le das?`,
      vista: { mapa: m, ref: pr, marcar: [pt], camino: caminoDe(pr, bien) }, responder: "opcion", respuesta: "0", opciones,
      datos: { ref: R.id, dest: T.id },
      explica: `${cap(del(R))} hasta ${nom(T)}: ${bien.map(p => `${cuadras(p.k)} al ${DIRS[p.d].n} (${DIRS[p.d].lado})`).join(" y ")}. Cada cuadra son 100 metros.`,
    };
  });
}

// 🔢 Coordenadas de cuadrícula: letra (columna) y número (fila)
function cuadros(cfg, rnd) {
  return conMapa(cfg, rnd, m => {
    const T = azar(nombrados(m), rnd), [x, y] = posDe(m, T.id), c = coord(x, y);
    const comoSe = `Primero la letra de la columna (arriba) y después el número de la fila (al lado).`;
    if (rnd() < 0.5) {
      const cands = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1], [y, x]].filter(([a, b]) => dentro(m, a, b)).map(([a, b]) => coord(a, b));
      const malas = barajar([...new Set(cands)].filter(k => k !== c), rnd).slice(0, 3);
      if (malas.length < 2) return null;
      return {
        texto: `¿En qué cuadro está <b>${nom(T)}</b> ${T.e}?`, voz: `¿En qué cuadro está ${nom(T)}?`,
        vista: { mapa: m, coords: true, marcar: [[x, y]] }, responder: "opcion", respuesta: c,
        opciones: barajar([c, ...malas], rnd).map(k => ({ id: k, txt: k })), datos: { dest: T.id },
        explica: `${cap(nom(T))} está en la columna ${LETRAS[x]} y en la fila ${y + 1}: ${c}. ${comoSe}`,
      };
    }
    return {
      texto: `¿Qué hay en el cuadro <b>${c}</b>? Tocalo.`, voz: `¿Qué hay en el cuadro ${LETRAS[x]} ${y + 1}? Tocalo en el mapa.`,
      vista: { mapa: m, coords: true }, responder: "mapa", respuesta: clave([x, y]), datos: { coord: c },
      explica: `Bajá por la columna ${LETRAS[x]} hasta la fila ${y + 1}: ahí está ${nom(T)}. ${comoSe}`,
    };
  });
}

// 📏 Escala: cada cuadra mide 100 m. ¿Cuántos metros por las calles?
function escala(cfg, rnd) {
  return conMapa(cfg, rnd, m => {
    const ls = nombrados(m), pares = [];
    for (const R of ls) for (const T of ls) {
      if (R === T) continue;
      const [x1, y1] = posDe(m, R.id), [x2, y2] = posDe(m, T.id), n = Math.abs(x2 - x1) + Math.abs(y2 - y1);
      if (n >= 2 && n <= 7) pares.push({ R, T, alineados: x1 === x2 || y1 === y2 });
    }
    const lista = rnd() < 0.35 ? pares.filter(p => p.alineados) : pares.filter(p => !p.alineados);
    if (!lista.length) return null;
    const { R, T } = azar(lista, rnd), pr = posDe(m, R.id), pt = posDe(m, T.id);
    const tramos = enL(pr, pt, true), n = tramos.reduce((s, p) => s + p.k, 0);
    return {
      texto: `Cada cuadra mide <b>100 metros</b>. Caminando por las calles, ¿cuántos metros hay ${del(R)} ${R.e} ${al(T)} ${T.e}?`,
      voz: `Cada cuadra mide 100 metros. Caminando por las calles, sin cortar en diagonal, ¿cuántos metros hay ${del(R)} ${al(T)}?`,
      vista: { mapa: m, ref: pr, marcar: [pt], camino: caminoDe(pr, tramos) }, responder: "escribir", respuesta: n * 100, sufijo: "m",
      datos: { ref: R.id, dest: T.id },
      explica: `${tramos.map(p => `${cuadras(p.k)} al ${DIRS[p.d].n}`).join(" y ")}: ${n} cuadras × 100 m = ${n * 100} metros.`,
    };
  });
}

// 🌎 Paralelos, meridianos y hemisferios (5° y 6°). Datos seguros, sin números dudosos.
const GLOBO_TOQUE = [
  { q: "Tocá el <b>ecuador</b>.", v: "Tocá el ecuador.", r: ["ecuador"], x: "El ecuador es el paralelo más largo: da la vuelta a la Tierra por el medio y la parte en hemisferio norte y hemisferio sur." },
  { q: "Tocá el <b>meridiano de Greenwich</b>.", v: "Tocá el meridiano de Greenwich.", r: ["greenwich"], x: "El meridiano de Greenwich (0°) va de polo a polo y parte la Tierra en hemisferio oriental (este) y occidental (oeste)." },
  { q: "Tocá un <b>paralelo</b>.", v: "Tocá un paralelo.", r: ["paralelo", "ecuador"], x: "Los paralelos son líneas imaginarias que dan la vuelta a la Tierra, paralelas al ecuador. ¡El ecuador también es un paralelo!" },
  { q: "Tocá un <b>meridiano</b>.", v: "Tocá un meridiano.", r: ["meridiano", "greenwich"], x: "Los meridianos son líneas imaginarias que van de polo a polo. El de Greenwich también es un meridiano." },
  { q: "Tocá el <b>hemisferio norte</b>.", v: "Tocá el hemisferio norte.", r: ["hn"], zonas: "ns", x: "El hemisferio norte es la mitad de la Tierra que queda al norte del ecuador. ¡Ahí está Costa Rica!" },
  { q: "Tocá el <b>hemisferio sur</b>.", v: "Tocá el hemisferio sur.", r: ["hs"], zonas: "ns", x: "El hemisferio sur es la mitad de la Tierra que queda al sur del ecuador." },
  { q: "Tocá el <b>hemisferio occidental</b> (oeste).", v: "Tocá el hemisferio occidental, el del oeste.", r: ["ho"], zonas: "eo", x: "El hemisferio occidental es la mitad que queda al oeste del meridiano de Greenwich. Toda América, y Costa Rica, está ahí." },
  { q: "Tocá el <b>hemisferio oriental</b> (este).", v: "Tocá el hemisferio oriental, el del este.", r: ["he"], zonas: "eo", x: "El hemisferio oriental es la mitad que queda al este del meridiano de Greenwich." },
];
const GLOBO_PREGUNTA = [
  { q: "Las líneas imaginarias que dan la vuelta a la Tierra, paralelas al ecuador, se llaman…", r: "Paralelos", o: ["Meridianos", "Husos", "Fronteras"], x: "Se llaman paralelos. Sirven para medir la latitud." },
  { q: "Las líneas imaginarias que van del polo norte al polo sur se llaman…", r: "Meridianos", o: ["Paralelos", "Trópicos", "Ecuadores"], x: "Se llaman meridianos. Sirven para medir la longitud." },
  { q: "El ecuador divide la Tierra en…", r: "Hemisferio norte y sur", o: ["Hemisferio este y oeste", "Cinco continentes", "Día y noche"], x: "El ecuador parte la Tierra en el hemisferio norte y el hemisferio sur." },
  { q: "El meridiano de Greenwich divide la Tierra en…", r: "Hemisferio este y oeste", o: ["Hemisferio norte y sur", "Tierra y mar", "Polos"], x: "El meridiano de Greenwich parte la Tierra en el hemisferio oriental (este) y el occidental (oeste)." },
  { q: "La latitud se mide desde…", r: "El ecuador", o: ["El meridiano de Greenwich", "El polo sur", "San José"], x: "La latitud dice qué tan al norte o al sur del ecuador está un lugar." },
  { q: "La longitud se mide desde…", r: "El meridiano de Greenwich", o: ["El ecuador", "El polo norte", "El océano Pacífico"], x: "La longitud dice qué tan al este o al oeste del meridiano de Greenwich está un lugar." },
  { q: "¿Cuántos grados de latitud tiene el ecuador?", r: "0°", o: ["90°", "180°", "45°"], x: "El ecuador es el paralelo 0°: desde ahí se empieza a medir la latitud." },
  { q: "¿Qué latitud tiene el polo norte?", r: "90° norte", o: ["0°", "180° norte", "45° norte"], x: "Los polos están lo más lejos posible del ecuador: a 90° de latitud norte y sur." },
  { q: "Costa Rica está al norte del ecuador. Entonces su latitud es…", r: "Norte", o: ["Sur", "Este", "Oeste"], x: "Como Costa Rica está al norte del ecuador, su latitud es norte.", cr: true },
  { q: "Costa Rica está al oeste del meridiano de Greenwich. Entonces su longitud es…", r: "Oeste", o: ["Este", "Norte", "Sur"], x: "Como Costa Rica está al oeste del meridiano de Greenwich, su longitud es oeste.", cr: true },
  { q: "¿En qué hemisferios está Costa Rica?", r: "Norte y occidental", o: ["Sur y occidental", "Norte y oriental", "Sur y oriental"], x: "Costa Rica está al norte del ecuador (hemisferio norte) y al oeste de Greenwich (hemisferio occidental).", cr: true },
];
function globo(rnd) {
  if (rnd() < 0.5) {
    const g = azar(GLOBO_TOQUE, rnd);
    return { texto: g.q, voz: g.v, vista: { globo: { zonas: g.zonas || null } }, responder: "globo", respuesta: g.r, explica: g.x };
  }
  const g = azar(GLOBO_PREGUNTA, rnd);
  return {
    texto: g.q, voz: g.q, vista: { globo: { etiquetas: true, cr: !!g.cr } }, responder: "opcion", respuesta: "r",
    opciones: barajar([{ id: "r", txt: g.r }, ...g.o.map((t, i) => ({ id: `o${i}`, txt: t }))], rnd), explica: g.x,
  };
}

// 🌐 Latitud y longitud en una cuadrícula (puntos de práctica, no lugares reales)
export const LATS = [30, 20, 10, 0, -10, -20, -30];
export const LONS = [-40, -30, -20, -10, 0, 10, 20, 30];
const gradoTxt = (v, pos, neg) => (v === 0 ? "0°" : `${Math.abs(v)}° ${v > 0 ? pos : neg}`);
export const coordTxt = (lat, lon) => `${gradoTxt(lat, "N", "S")}, ${gradoTxt(lon, "E", "O")}`;
const gradoVoz = (v, pos, neg) => (v === 0 ? "0 grados" : `${Math.abs(v)} grados ${v > 0 ? pos : neg}`);
export const coordVoz = (lat, lon) => `${gradoVoz(lat, "norte", "sur")} y ${gradoVoz(lon, "este", "oeste")}`;
const COMO_LEER = "Primero la latitud (norte o sur del ecuador) y después la longitud (este u oeste de Greenwich).";
function latlon(rnd) {
  const sitios = [];
  for (const lat of LATS) for (const lon of LONS) if (lat && lon) sitios.push({ lat, lon });
  const puntos = barajar(sitios, rnd).slice(0, 5).map((p, i) => ({ id: "ABCDE"[i], ...p }));
  const P = azar(puntos, rnd);
  if (rnd() < 0.5) {
    return {
      texto: `¿Qué punto está en <b>${coordTxt(P.lat, P.lon)}</b>? Tocalo.`, voz: `¿Qué punto está en ${coordVoz(P.lat, P.lon)}? Tocalo.`,
      vista: { malla: { puntos } }, responder: "malla", respuesta: P.id, datos: { lat: P.lat, lon: P.lon },
      explica: `Buscá la línea de ${gradoVoz(P.lat, "norte", "sur")} (desde el ecuador) y la de ${gradoVoz(P.lon, "este", "oeste")} (desde Greenwich): se cruzan en el punto ${P.id}. ${COMO_LEER}`,
    };
  }
  const malas = [[-P.lat, P.lon], [P.lat, -P.lon], [-P.lat, -P.lon]];
  if (Math.abs(P.lat) !== Math.abs(P.lon) && Math.abs(P.lon) <= 30) malas.push([Math.sign(P.lat) * Math.abs(P.lon), Math.sign(P.lon) * Math.abs(P.lat)]);
  const ops = barajar(malas, rnd).slice(0, 3).map(([a, b]) => coordTxt(a, b));
  return {
    texto: `¿Cuáles son las coordenadas del punto <b>${P.id}</b>?`, voz: `¿Cuáles son las coordenadas del punto ${P.id}?`,
    vista: { malla: { puntos, marcar: P.id } }, responder: "opcion", respuesta: coordTxt(P.lat, P.lon),
    opciones: barajar([coordTxt(P.lat, P.lon), ...ops], rnd).map(t => ({ id: t, txt: t })), datos: { lat: P.lat, lon: P.lon },
    explica: `El punto ${P.id} está en ${coordTxt(P.lat, P.lon)}: ${gradoVoz(P.lat, "al norte", "al sur")} del ecuador y ${gradoVoz(P.lon, "al este", "al oeste")} de Greenwich. ${COMO_LEER}`,
  };
}

// ---------- 🪜 Escalones: de la rosa de los vientos (1°) a latitud y longitud (5° y 6°) ----------
export const ESCALONES = [
  { id: "rosa4", nombre: "La rosa de los vientos", grupo: "rosa", pregunta: rosa4 },                                            //  1. N, S, E, O
  { id: "sol", nombre: "El sol y los puntos cardinales", grupo: "rosa", pregunta: sol },                                        //  2. sale por el este…
  { id: "vecino", nombre: "¿Qué hay 100 metros al…?", grupo: "mapa", pregunta: r => vecino({ cols: 4, rows: 4, lugares: 7 }, r) }, //  3. una cuadra al lado
  { id: "hacia4", nombre: "¿Hacia dónde queda?", grupo: "mapa", pregunta: r => hacia({ cols: 5, rows: 5, lugares: 8 }, false, r) }, //  4. misma fila o columna
  { id: "rosa8", nombre: "Puntos intermedios", grupo: "rosa", pregunta: rosa8 },                                                //  5. noreste, suroeste…
  { id: "hacia8", nombre: "¿Hacia dónde queda? (8 rumbos)", grupo: "mapa", pregunta: r => hacia({ cols: 5, rows: 5, lugares: 8 }, true, r) }, // 6
  { id: "ir2", nombre: "Direcciones a lo tico", grupo: "dir", pregunta: r => ir({ cols: 5, rows: 5, lugares: 9 }, 2, r) },     //  7. 200 al este y 100 al sur
  { id: "dar", nombre: "Dar la dirección", grupo: "dir", pregunta: r => dar({ cols: 5, rows: 5, lugares: 9 }, r) },             //  8. ¿cuál dirección lleva?
  { id: "ir3", nombre: "Direcciones largas", grupo: "dir", pregunta: r => ir({ cols: 6, rows: 6, lugares: 12 }, 3, r) },       //  9. tres tramos
  { id: "cuadros", nombre: "Coordenadas: letra y número", grupo: "cuadros", pregunta: r => cuadros({ cols: 6, rows: 6, lugares: 10 }, r) }, // 10. C4
  { id: "escala", nombre: "Escala: ¿cuántos metros?", grupo: "cuadros", pregunta: r => escala({ cols: 6, rows: 6, lugares: 10 }, r) },      // 11
  { id: "globo", nombre: "Paralelos y meridianos", grupo: "globo", pregunta: globo },                                          // 12
  { id: "latlon", nombre: "Latitud y longitud", grupo: "globo", pregunta: latlon },                                             // 13
];
export const GRUPOS = [
  { id: "rosa", emoji: "🧭", nombre: "Rosa de los vientos" },
  { id: "mapa", emoji: "🗺️", nombre: "El mapa del pueblo" },
  { id: "dir", emoji: "🚶", nombre: "Direcciones a lo tico" },
  { id: "cuadros", emoji: "🔢", nombre: "Coordenadas y escala" },
  { id: "globo", emoji: "🌎", nombre: "Paralelos y meridianos" },
];
/** Escalón para empezar según la edad: 7 años → 0 … 12 → 7 (sube rápido si le va bien). */
export const inicioPorEdad = edad => (edad === null || edad <= 7 ? 0 : edad === 8 ? 2 : edad === 9 ? 3 : edad === 10 ? 5 : edad === 11 ? 6 : 7);

/** Una pregunta del escalón i. */
export function pregunta(i, rnd = Math.random) {
  const e = ESCALONES[i];
  return { escalon: e.id, ...e.pregunta(rnd) };
}

// ---------- Revisar: vuelve a calcular la respuesta por otro camino ----------
/** Devuelve una lista de problemas (vacía = bien). */
export function revisarPregunta(q) {
  const mal = [];
  if (!q.texto || !q.voz || !q.explica) mal.push("faltan textos");
  const m = q.vista.mapa;
  if (q.responder === "rosa") {
    const puntas = q.vista.rosa.puntas === 8 ? OCHO : PRINCIPALES;
    if (!puntas.includes(q.respuesta)) mal.push(`rumbo ${q.respuesta} no está en la rosa`);
    if (q.datos?.dest) {
      const [x1, y1] = posDe(m, q.datos.ref), [x2, y2] = posDe(m, q.datos.dest);
      if (dirDe(x2 - x1, y2 - y1) !== q.respuesta) mal.push("el rumbo no calza con el mapa");
      if (q.vista.rosa.puntas === 4 && x1 !== x2 && y1 !== y2) mal.push("con 4 rumbos tienen que estar alineados");
    }
  }
  if (q.responder === "mapa") {
    const [x, y] = leerClave(q.respuesta);
    if (!lugarEn(m, x, y)) mal.push("la respuesta no es un lugar");
    if (q.datos.tramos) {
      const pts = caminoDe(posDe(m, q.datos.ref), q.datos.tramos);
      if (!pts.every(([a, b]) => dentro(m, a, b))) mal.push("el camino se sale del mapa");
      if (clave(pts[pts.length - 1]) !== q.respuesta) mal.push("el camino no llega a la respuesta");
      if (q.datos.ref === lugarEn(m, x, y)?.id) mal.push("llega al mismo lugar de donde sale");
    }
    if (q.datos.coord && coord(x, y) !== q.datos.coord) mal.push("la coordenada no calza");
  }
  if (q.responder === "opcion") {
    const ids = q.opciones.map(o => o.id), txts = q.opciones.map(o => o.txt);
    if (new Set(ids).size !== ids.length || new Set(txts).size !== txts.length) mal.push("opciones repetidas");
    if (ids.filter(i => i === q.respuesta).length !== 1) mal.push("la respuesta no está una vez");
    if (q.opciones.length < 3) mal.push("muy pocas opciones");
    if (q.escalon === "dar") {
      const meta = clave([posDe(m, q.datos.dest)[0] - posDe(m, q.datos.ref)[0], posDe(m, q.datos.dest)[1] - posDe(m, q.datos.ref)[1]]);
      const llegan = q.opciones.filter(o => clave(sumar([0, 0], o.tramos)) === meta);
      if (llegan.length !== 1 || llegan[0].id !== q.respuesta) mal.push("más de una dirección llega");
    }
    if (q.escalon === "cuadros") {
      const [x, y] = posDe(m, q.datos.dest);
      if (coord(x, y) !== q.respuesta) mal.push("la coordenada no calza");
    }
    if (q.escalon === "latlon" && coordTxt(q.datos.lat, q.datos.lon) !== q.respuesta) mal.push("coordenadas mal");
  }
  if (q.responder === "escribir") {
    const [x1, y1] = posDe(m, q.datos.ref), [x2, y2] = posDe(m, q.datos.dest);
    if ((Math.abs(x2 - x1) + Math.abs(y2 - y1)) * 100 !== q.respuesta) mal.push("los metros no calzan");
  }
  if (q.responder === "malla") {
    const { puntos } = q.vista.malla;
    if (new Set(puntos.map(p => `${p.lat},${p.lon}`)).size !== puntos.length) mal.push("puntos repetidos");
    const en = puntos.filter(p => p.lat === q.datos.lat && p.lon === q.datos.lon);
    if (en.length !== 1 || en[0].id !== q.respuesta) mal.push("el punto no es único");
  }
  if (q.responder === "globo" && !q.respuesta.length) mal.push("sin respuesta");
  return mal;
}
