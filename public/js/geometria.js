// 📐 Lógica de «Geometría» (sin pantalla, para poder probarla con node). También dibuja las figuras en SVG.
//
// Una ronda:
//   { escalon, tipo: "tocar" | "opciones" | "escribir" | "pintar", texto, voz,
//     dib?, dibMarcado?        el dibujo grande { W, H, cuerpo } y cómo queda al explicar (con marcas)
//     svg?, svgMarcado?        lo mismo, ya armado (lo pone ronda())
//     items?: [{ v, svg }]     tocar: dibujitos para escoger
//     opciones?: [{ v, t }]    opciones: textos para escoger
//     sufijo?                  escribir: lo que va después del número («°», «cm», «caras»…)
//     cuadricula?              pintar: { W, H, dir, pos, dados, falta } (completar la otra mitad)
//     respuesta, pista, explica, confusiones?: [{ v, msg }], datos }
//   texto, pista, explica y msg llevan **negritas**: marcado() los pasa a HTML y aVoz() a palabras para la voz.
//   datos: lo necesario para revisar que el dibujo cumpla lo que se pregunta (revisarRonda).

// ---------- Números al azar ----------
export const entero = (a, b, rnd = Math.random) => a + Math.floor(rnd() * (b - a + 1));
export const azar = (arr, rnd = Math.random) => arr[Math.floor(rnd() * arr.length)];
export function barajar(arr, rnd = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
/** Un múltiplo de p entre a y b. */
const paso = (a, b, p, rnd) => a + p * entero(0, Math.floor((b - a) / p), rnd);
const RAD = Math.PI / 180;
const f1 = n => Math.round(n * 10) / 10;

// ---------- Textos ----------
const escapar = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
/** «**negrita**» → <b>negrita</b>; todo lo demás se escapa. */
export const marcado = t => String(t).split("**").map((p, i) => (i % 2 ? `<b>${escapar(p)}</b>` : escapar(p))).join("");
/** Para la voz: sin asteriscos y con los símbolos en palabras. */
export const aVoz = t => String(t).split("**").join("")
  .replace(/(\d+)\s?°/g, (_, n) => `${n} ${n === "1" ? "grado" : "grados"}`)
  .replace(/(\d+)\s?cm\b/g, "$1 centímetros")
  .replace(/×/g, " por ").replace(/÷/g, " entre ").replace(/−/g, " menos ").replace(/\+/g, " más ").replace(/=/g, " es igual a ")
  .replace(/\s+/g, " ").trim();
const may = t => t.charAt(0).toUpperCase() + t.slice(1);
/** Para el texto de la pregunta, que puede traer HTML nuestro (<small>, <span class="big">): solo pasa **…** a <b>. */
export const htmlDe = t => String(t).split("**").map((p, i) => (i % 2 ? `<b>${p}</b>` : p)).join("");
/** «a, b o c» */
const oLista = arr => arr.length < 2 ? arr.join("") : `${arr.slice(0, -1).join(", ")} o ${arr[arr.length - 1]}`;
/** «el cubo» → «Este es el cubo» · «la esfera» → «Esta es la esfera» */
const esteEs = art => (art === "la" ? "Esta es" : "Este es");
const al = art => (art === "la" ? "a la" : "al");

// ---------- Colores y piezas de SVG ----------
const TINTA = "#1F3A5F", ROJO = "#E8574A", AZUL = "#2F7FD1", NARANJA = "#E07B00", GRIS = "#7F93AA", VERDE = "#2FA85A";
const RELLENOS = ["#FFD166", "#8FD16F", "#A9D2FF", "#F7A8C4", "#C3A6F2", "#FFB27A"];
/** t > 0 aclara (hacia blanco) · t < 0 oscurece */
function mezclar(hex, t) {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255];
  return "#" + c.map(v => Math.round(t >= 0 ? v + (255 - v) * t : v * (1 + t)).toString(16).padStart(2, "0")).join("");
}
/** El <svg>. En el examen (donde no está el CSS del juego) lleva un ancho fijo. */
export const lienzo = (W, H, cuerpo, ancho) =>
  `<svg class="dib" viewBox="0 0 ${W} ${H}"${ancho ? ` width="${ancho}" height="${f1(ancho * H / W)}" style="display:block;margin:6px auto;max-width:100%;height:auto"` : ""} aria-hidden="true" focusable="false">${cuerpo}</svg>`;
const etiqueta = (x, y, t, { size = 12, color = TINTA } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="${color}" stroke="#fff" stroke-width="3.5" stroke-linejoin="round" paint-order="stroke">${t}</text>`;
const seg = (a, b, color = TINTA, ancho = 3, extra = "") =>
  `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${color}" stroke-width="${ancho}" stroke-linecap="round"${extra}/>`;
const punto = (p, r = 3.5, color = TINTA) => `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${r}" fill="${color}"/>`;
const lista = pts => pts.map(([x, y]) => `${f1(x)},${f1(y)}`).join(" ");
const PUNTEADO = ` stroke-dasharray="5 4"`;

// ---------- Geometría ----------
const rotar = (pts, g) => { const c = Math.cos(g * RAD), s = Math.sin(g * RAD); return pts.map(([x, y]) => [x * c - y * s, x * s + y * c]); };
export const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const centro = pts => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
const unitario = (a, b) => { const d = dist(a, b) || 1; return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]; };
const mas = (p, u, k) => [p[0] + u[0] * k, p[1] + u[1] * k];
/** Ángulo (0° a 180°) en el vértice v, entre los puntos a y b. */
export function anguloEn(v, a, b) {
  const u = [a[0] - v[0], a[1] - v[1]], w = [b[0] - v[0], b[1] - v[1]];
  const c = (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w));
  return Math.acos(Math.max(-1, Math.min(1, c))) / RAD;
}
/** Escala (igual en x y en y) y centra los puntos en una caja de W × H, con un margen. */
function encajar(pts, W, H, pad, padY = pad) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min((W - 2 * pad) / Math.max(x1 - x0, 1e-9), (H - 2 * padY) / Math.max(y1 - y0, 1e-9));
  const tx = W / 2 - k * (x0 + x1) / 2, ty = H / 2 - k * (y0 + y1) / 2;
  return { ap: ([x, y]) => [tx + k * x, ty + k * y], k };
}
/** Solo centra (sin cambiar el tamaño). */
function centrar(pts, W, H) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const tx = W / 2 - (Math.min(...xs) + Math.max(...xs)) / 2, ty = H / 2 - (Math.min(...ys) + Math.max(...ys)) / 2;
  return ([x, y]) => [x + tx, y + ty];
}
/** Hacia dónde apunta un ángulo de g grados (contra el reloj, como en el cuaderno: la y de la pantalla va hacia abajo). */
const hacia = g => [Math.cos(g * RAD), -Math.sin(g * RAD)];
/** Marca de ángulo recto en el vértice v, entre las direcciones u y w. */
const cuadrito = (v, u, w, s = 10, color = TINTA) =>
  `<polyline points="${lista([mas(v, u, s), mas(mas(v, u, s), w, s), mas(v, w, s)])}" fill="none" stroke="${color}" stroke-width="2"/>`;
/** ¿Es convexo y sin cruzarse? */
function convexo(P) {
  let signo = 0;
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], c = P[(i + 2) % P.length];
    const z = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    if (Math.abs(z) < 1e-9) return false;
    if (signo && Math.sign(z) !== signo) return false;
    signo = Math.sign(z);
  }
  return true;
}

// =================================================================
// 🔷 Figuras planas
// =================================================================
export const FIG = {
  circulo: ["el", "círculo"], ovalo: ["el", "óvalo"], triangulo: ["el", "triángulo"], cuadrado: ["el", "cuadrado"],
  rectangulo: ["el", "rectángulo"], rombo: ["el", "rombo"], pentagono: ["el", "pentágono"], hexagono: ["el", "hexágono"],
};
const LADOS = { triangulo: 3, cuadrado: 4, rectangulo: 4, rombo: 4, pentagono: 5, hexagono: 6 };
const BASICAS = ["circulo", "triangulo", "cuadrado", "rectangulo"], OTRAS = ["rombo", "pentagono", "hexagono", "ovalo"];
const PARECIDAS = { circulo: ["ovalo"], ovalo: ["circulo"], cuadrado: ["rombo", "rectangulo"], rombo: ["cuadrado"], rectangulo: ["cuadrado"], pentagono: ["hexagono"], hexagono: ["pentagono"], triangulo: [] };
const COMO_ES = {
  circulo: "es redondo, sin esquinas, e igual de ancho por todo lado",
  ovalo: "es redondo y sin esquinas, pero estirado, como un huevo",
  triangulo: "tiene **3 lados** y 3 esquinas",
  cuadrado: "tiene **4 lados iguales** y 4 esquinas rectas",
  rectangulo: "tiene 4 lados y 4 esquinas rectas: **dos lados largos y dos cortos**",
  rombo: "tiene **4 lados iguales**, pero está inclinado: sus esquinas no son rectas",
  pentagono: "tiene **5 lados** y 5 esquinas",
  hexagono: "tiene **6 lados** y 6 esquinas, como las celdas de un panal",
};
const regular = (n, giro) => Array.from({ length: n }, (_, i) => [Math.cos((giro + 360 * i / n) * RAD), Math.sin((giro + 360 * i / n) * RAD)]);

/** Una figura plana con tamaño, giro y color al azar (para que no se aprendan el dibujo). */
export function figuraPlana(forma, rnd = Math.random) {
  const color = azar(RELLENOS, rnd);
  switch (forma) {
    case "circulo": return { forma, color, elipse: { rx: 1, ry: 1, giro: 0 } };
    case "ovalo": return { forma, color, elipse: { rx: 1, ry: 1 / (1.5 + rnd() * 0.3), giro: entero(-30, 30, rnd) } };
    case "triangulo": { // tres puntos de un círculo, bien separados: ningún ángulo queda muy chiquito
      let a;
      do a = [0, 1, 2].map(() => rnd() * 360).sort((x, y) => x - y); while (Math.min(a[1] - a[0], a[2] - a[1], 360 - a[2] + a[0]) < 80);
      return { forma, color, pts: a.map(t => [Math.cos(t * RAD), Math.sin(t * RAD)]) };
    }
    case "cuadrado": return { forma, color, pts: rotar([[-1, -1], [1, -1], [1, 1], [-1, 1]], entero(-15, 15, rnd)) };
    case "rectangulo": { const w = 1.55 + rnd() * 0.5; return { forma, color, pts: rotar([[-w, -1], [w, -1], [w, 1], [-w, 1]], entero(-15, 15, rnd)) }; }
    case "rombo": { const h = 0.72 + rnd() * 0.16; return { forma, color, pts: rotar([[0, -1.3], [h, 0], [0, 1.3], [-h, 0]], entero(-12, 12, rnd)) }; }
    case "pentagono": return { forma, color, pts: regular(5, rnd() * 360) };
    case "hexagono": return { forma, color, pts: regular(6, rnd() * 360) };
  }
  throw new Error("forma desconocida: " + forma);
}

/** ¿Qué figura es, midiendo el dibujo? (para revisar) */
export function formaDe(fig) {
  if (fig.elipse) return Math.abs(fig.elipse.rx - fig.elipse.ry) < 1e-9 ? "circulo" : fig.elipse.rx / fig.elipse.ry > 1.3 ? "ovalo" : "?";
  const P = fig.pts;
  if (!convexo(P)) return "?";
  const L = P.map((p, i) => dist(p, P[(i + 1) % P.length])), A = P.map((p, i) => anguloEn(p, P[(i + P.length - 1) % P.length], P[(i + 1) % P.length]));
  const iguales = L.every(l => Math.abs(l - L[0]) < 1e-6), rectos = A.every(a => Math.abs(a - 90) < 0.01);
  if (P.length === 3) return Math.min(...A) >= 35 ? "triangulo" : "?";
  if (P.length === 4) {
    if (rectos) return iguales ? "cuadrado" : Math.max(...L) / Math.min(...L) >= 1.4 ? "rectangulo" : "?";
    return iguales && A.every(a => Math.abs(a - 90) > 15) ? "rombo" : "?";
  }
  if (iguales && A.every(a => Math.abs(a - A[0]) < 1e-6)) return P.length === 5 ? "pentagono" : P.length === 6 ? "hexagono" : "?";
  return "?";
}

function dibPlana(fig, W, H, pad, marcar) {
  if (fig.elipse) {
    const { rx, ry, giro } = fig.elipse;
    const muestra = rotar(Array.from({ length: 36 }, (_, i) => [rx * Math.cos(i * 10 * RAD), ry * Math.sin(i * 10 * RAD)]), giro);
    const { ap, k } = encajar(muestra, W, H, pad), [cx, cy] = ap([0, 0]);
    return `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx * k)}" ry="${f1(ry * k)}" transform="rotate(${giro} ${f1(cx)} ${f1(cy)})" fill="${fig.color}" stroke="${TINTA}" stroke-width="3"/>`;
  }
  const { ap } = encajar(fig.pts, W, H, pad), P = fig.pts.map(ap), c = centro(P);
  let s = `<polygon points="${lista(P)}" fill="${fig.color}" stroke="${TINTA}" stroke-width="3" stroke-linejoin="round"/>`;
  if (marcar === "lados") s += P.map((p, i) => seg(p, P[(i + 1) % P.length], NARANJA, 5)).join("") + P.map((p, i) => {
    const q = P[(i + 1) % P.length], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    return etiqueta(...mas(m, unitario(c, m), 13), i + 1, { color: NARANJA });
  }).join("");
  if (marcar === "vertices") s += P.map((p, i) => punto(p, 5, ROJO) + etiqueta(...mas(p, unitario(c, p), 14), i + 1, { color: ROJO })).join("");
  return s;
}

function tocarFigura(rnd, objetivos, pool) {
  const forma = azar(objetivos, rnd);
  const parecidas = barajar((PARECIDAS[forma] || []).filter(f => pool.includes(f)), rnd);
  const distractores = [...parecidas.slice(0, 1), ...barajar(pool.filter(f => f !== forma && f !== parecidas[0]), rnd)].slice(0, 3);
  const items = barajar([forma, ...distractores], rnd).map(v => { const fig = figuraPlana(v, rnd); return { v, fig, svg: lienzo(100, 100, dibPlana(fig, 100, 100, 12)) }; });
  const [art, nom] = FIG[forma];
  return {
    tipo: "tocar", items, respuesta: forma,
    texto: `Tocá ${art} **${nom}**`, voz: `Tocá ${art} ${nom}.`,
    pista: `${may(art)} ${nom} ${COMO_ES[forma]}.`,
    explica: `${esteEs(art)} ${art} **${nom}**: ${COMO_ES[forma]}.`,
    confusiones: distractores.map(v => ({ v, msg: `Ese es ${FIG[v][0]} ${FIG[v][1]}: ${COMO_ES[v]}.` })),
    datos: { tipo: "figura" },
  };
}

function nombrarFigura(rnd, objetivos, pool) {
  const forma = azar(objetivos, rnd), fig = figuraPlana(forma, rnd);
  const parecidas = barajar((PARECIDAS[forma] || []).filter(f => pool.includes(f)), rnd);
  const otras = [...parecidas, ...barajar(pool.filter(f => f !== forma && !parecidas.includes(f)), rnd)].slice(0, 2);
  const opciones = barajar([forma, ...otras], rnd).map(v => ({ v, t: may(FIG[v][1]) }));
  const [art, nom] = FIG[forma];
  return {
    tipo: "opciones", dib: { W: 200, H: 130, cuerpo: dibPlana(fig, 200, 130, 16) }, opciones, respuesta: forma,
    texto: "¿Cómo se llama esta figura?", voz: `¿Cómo se llama esta figura? ¿${oLista(opciones.map(o => FIG[o.v][1]))}?`,
    pista: `Fijate cuántos lados tiene y si tiene esquinas.`,
    explica: `${esteEs(art)} ${art} **${nom}**: ${COMO_ES[forma]}.`,
    confusiones: otras.map(v => ({ v, msg: `No es ${FIG[v][0]} ${FIG[v][1]}: ${FIG[v][0]} ${FIG[v][1]} ${COMO_ES[v]}.` })),
    datos: { tipo: "figura", fig },
  };
}

function ladosVertices(rnd) {
  const forma = azar(["triangulo", "cuadrado", "rectangulo", "rombo", "pentagono", "hexagono"], rnd), fig = figuraPlana(forma, rnd), n = LADOS[forma];
  const que = rnd() < 0.5 ? "lados" : "vertices", [art, nom] = FIG[forma];
  const otros = barajar([n - 1, n + 1, n + 2, n - 2].filter(x => x >= 3 && x <= 8), rnd).slice(0, 2);
  const opciones = barajar([n, ...otros], rnd).map(v => ({ v, t: String(v) }));
  const dib = m => ({ W: 200, H: 135, cuerpo: dibPlana(fig, 200, 135, 22, m) });
  return {
    tipo: "opciones", dib: dib(), dibMarcado: dib(que), opciones, respuesta: n,
    texto: que === "lados" ? `¿Cuántos **lados** tiene ${art} ${nom}?` : `¿Cuántos **vértices** (esquinas) tiene ${art} ${nom}?`,
    voz: que === "lados" ? `¿Cuántos lados tiene ${art} ${nom}?` : `¿Cuántos vértices tiene ${art} ${nom}? Los vértices son las esquinas.`,
    pista: que === "lados" ? "Los lados son las rayas rectas del borde. Contalos uno por uno, dando la vuelta." : "Los vértices son las esquinas, donde se juntan dos lados. Contalas una por una.",
    explica: que === "lados"
      ? `${may(art)} ${nom} tiene **${n} lados**: los lados son las rayas rectas del borde.`
      : `${may(art)} ${nom} tiene **${n} vértices**: los vértices son las esquinas, donde se juntan dos lados. ¡Tiene tantos vértices como lados!`,
    datos: { tipo: "lados", fig, que },
  };
}

// =================================================================
// ✏️ Líneas
// =================================================================
const LINEAS = {
  recta: "La línea **recta** va derecho, sin doblarse.",
  curva: "La línea **curva** se dobla suavecito, sin esquinas.",
  quebrada: "La línea **quebrada** está hecha de pedazos rectos, con esquinas.",
  cerrada: "La línea **cerrada** empieza y termina en el mismo lugar: no tiene puntas sueltas.",
  abierta: "La línea **abierta** tiene dos puntas sueltas: no se junta.",
};
const LINEA_ES = {
  recta: "va derecho, sin doblarse", curva: "se dobla suavecito, sin esquinas", quebrada: "está hecha de pedazos rectos, con esquinas",
  cerrada: "empieza y termina en el mismo lugar, sin puntas sueltas", abierta: "tiene dos puntas sueltas, no se junta",
};
const cumpleLinea = (pide, t) => (pide === "cerrada" ? t.startsWith("cerrada") : pide === "abierta" ? !t.startsWith("cerrada") : t === pide);

/** Una línea en una caja de 100 × 100: { tipo, d } (d es el camino del SVG) */
function figLinea(tipo, rnd) {
  const giro = entero(0, 179, rnd), g = pts => rotar(pts.map(([x, y]) => [x - 50, y - 50]), giro).map(([x, y]) => [x + 50, y + 50]);
  const P = ([x, y]) => `${f1(x)} ${f1(y)}`;
  if (tipo === "recta") { const [a, b] = g([[15, 50], [85, 50]]); return { tipo, d: `M${P(a)} L${P(b)}` }; }
  if (tipo === "quebrada") {
    const n = entero(3, 4, rnd), s = rnd() < 0.5 ? 1 : -1;
    const pts = g(Array.from({ length: n + 1 }, (_, i) => [14 + 72 * i / n, 50 + (i % 2 ? 1 : -1) * s * entero(15, 22, rnd)]));
    return { tipo, d: "M" + pts.map(P).join(" L") };
  }
  if (tipo === "curva") {
    const ese = rnd() < 0.5, h = entero(28, 36, rnd) * (rnd() < 0.5 ? 1 : -1);
    const [a, c1, c2, b] = g([[16, 50], [38, 50 - h], [62, 50 + (ese ? h : -h)], [84, 50]]);
    return { tipo, d: `M${P(a)} C${P(c1)} ${P(c2)} ${P(b)}` };
  }
  // Cerradas: alrededor del centro, con radios distintos
  const n = tipo === "cerrada-curva" ? 6 : 5;
  const pts = Array.from({ length: n }, (_, i) => { const t = (360 * i / n + entero(-10, 10, rnd)) * RAD, r = entero(25, 36, rnd); return [50 + r * Math.cos(t), 50 + r * Math.sin(t)]; });
  if (tipo === "cerrada-quebrada") return { tipo, d: "M" + pts.map(P).join(" L") + " Z" };
  // Curva cerrada suave (Catmull-Rom pasado a curvas de Bézier)
  let d = `M${P(pts[0])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += ` C${P([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${P([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${P(p2)}`;
  }
  return { tipo, d: d + " Z" };
}
const dibLinea = l => `<path d="${l.d}" fill="none" stroke="${TINTA}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;

function lineas(rnd) {
  const pide = azar(["recta", "curva", "cerrada", "abierta"], rnd);
  const tipos = pide === "recta" ? ["recta", "curva", "quebrada"]
    : pide === "curva" ? ["curva", "recta", "quebrada"]
    : pide === "cerrada" ? [azar(["cerrada-curva", "cerrada-quebrada"], rnd), "curva", "quebrada"]
    : [azar(["curva", "quebrada"], rnd), "cerrada-curva", "cerrada-quebrada"];
  const items = barajar(tipos.map(t => ({ v: t, svg: lienzo(100, 100, dibLinea(figLinea(t, rnd))) })), rnd);
  const msg = t => { const k = pide === "cerrada" ? "abierta" : pide === "abierta" ? "cerrada" : t; return `Esa línea es **${k}**: ${LINEA_ES[k]}.`; };
  return {
    tipo: "tocar", items, respuesta: tipos[0],
    texto: `Tocá la línea **${pide}**`, voz: `Tocá la línea ${pide}.`,
    pista: LINEAS[pide], explica: LINEAS[pide],
    confusiones: tipos.slice(1).map(v => ({ v, msg: msg(v) })),
    datos: { tipo: "lineas", pide },
  };
}

// =================================================================
// 🧊 Cuerpos sólidos
// =================================================================
export const CUERPOS = { cubo: ["el", "cubo"], prisma: ["el", "prisma"], piramide: ["la", "pirámide"], cilindro: ["el", "cilindro"], cono: ["el", "cono"], esfera: ["la", "esfera"] };
const RUEDA = { cilindro: true, cono: true, esfera: true };
const COMO_CUERPO = {
  cubo: "tiene 6 caras planas, todas cuadrados iguales, como un dado",
  prisma: "tiene caras planas: dos bases iguales y rectángulos a los lados, como una caja",
  piramide: "tiene una base y caras en forma de triángulo que se juntan en una punta",
  cilindro: "tiene dos bases redondas y planas, y una parte curva, como una lata",
  cono: "tiene una base redonda y plana, y una punta, como el barquillo de un helado",
  esfera: "es toda redonda, sin partes planas, como una bola",
};
const PARECIDOS_C = { cubo: ["prisma"], prisma: ["cubo"], piramide: ["cono"], cono: ["piramide"], cilindro: ["prisma", "cono"], esfera: ["cilindro"] };
export const OBJETOS = [
  { e: "⚽", n: "una bola de fútbol", c: "esfera" }, { e: "🍊", n: "una naranja", c: "esfera" }, { e: "🏀", n: "una bola de básquet", c: "esfera" },
  { e: "🥫", n: "una lata", c: "cilindro" }, { e: "🥁", n: "un tambor", c: "cilindro" }, { e: "🕯️", n: "una candela", c: "cilindro" },
  { e: "🍦", n: "el barquillo de un helado", c: "cono" },
  { e: "🎲", n: "un dado", c: "cubo" }, { e: "🧊", n: "un cubito de hielo", c: "cubo" },
  { e: "📦", n: "una caja", c: "prisma" }, { e: "🧱", n: "un ladrillo", c: "prisma" },
];

// Vista: se ve un poquito desde arriba. 3D: x a la derecha, y hacia arriba, z hacia atrás.
const ALFA = 22 * RAD, CA = Math.cos(ALFA), SA = Math.sin(ALFA);
const proyectar = ([x, y, z]) => [x, -(y * CA + z * SA)];
const VISTA = [0, -SA, CA];
const LUZ = (() => { const l = [-0.5, 0.8, -0.35], n = Math.hypot(...l); return l.map(v => v / n); })();
const p3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const prom3 = vs => vs.reduce((s, v) => s.map((x, i) => x + v[i] / vs.length), [0, 0, 0]);
function normal(vs) { // método de Newell
  const n = [0, 0, 0];
  vs.forEach((a, i) => { const b = vs[(i + 1) % vs.length]; n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]); });
  const l = Math.hypot(...n) || 1;
  return n.map(v => v / l);
}
/** Un poliedro convexo: vértices, caras (con su normal hacia afuera y si se ven) y aristas (con sus dos caras). */
function poliedro(V, caras) {
  const c0 = prom3(V);
  const C = caras.map(idx => {
    const vs = idx.map(i => V[i]);
    let n = normal(vs);
    if (p3(n, prom3(vs).map((x, i) => x - c0[i])) < 0) n = n.map(x => -x);
    return { idx, n, visible: p3(n, VISTA) < 0 };
  });
  const A = new Map();
  C.forEach((c, k) => c.idx.forEach((a, i) => {
    const b = c.idx[(i + 1) % c.idx.length], key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!A.has(key)) A.set(key, { a: Math.min(a, b), b: Math.max(a, b), caras: [] });
    A.get(key).caras.push(k);
  }));
  return { V, caras: C, aristas: [...A.values()] };
}
function prisma(base, H) {
  const n = base.length, V = [...base.map(([x, z]) => [x, 0, z]), ...base.map(([x, z]) => [x, H, z])];
  return poliedro(V, [base.map((_, i) => i), base.map((_, i) => n + i), ...base.map((_, i) => [i, (i + 1) % n, n + (i + 1) % n, n + i])]);
}
function piramide(base, H) {
  const n = base.length, V = [...base.map(([x, z]) => [x, 0, z]), [0, H, 0]];
  return poliedro(V, [base.map((_, i) => i), ...base.map((_, i) => [i, (i + 1) % n, n])]);
}
const baseRegular = (n, R, giro) => Array.from({ length: n }, (_, i) => [R * Math.cos((giro + 360 * i / n) * RAD), R * Math.sin((giro + 360 * i / n) * RAD)]);
const baseRect = (a, b, giro) => rotar([[-a, -b], [a, -b], [a, b], [-a, b]], giro);

/** Un cuerpo con color y giro al azar. n: lados de la base (prismas y pirámides). */
export function figCuerpo(cuerpo, rnd = Math.random, n = 0) {
  const color = azar(RELLENOS, rnd);
  if (RUEDA[cuerpo]) return { cuerpo, color };
  for (let intento = 0; ; intento++) {
    const giro = entero(0, 359, rnd);
    const P = cuerpo === "cubo" ? prisma(baseRect(1, 1, giro), 2)
      : cuerpo === "prisma" ? (n && n !== 4 ? prisma(baseRegular(n, 1.15, giro), 1.9 + rnd() * 0.5) : prisma(baseRect(1.45, 0.8, giro), 1.3 + rnd() * 0.4))
      : piramide(n ? baseRegular(n, 1.2, giro) : baseRect(1.1, 1.1, giro), 2.3 + rnd() * 0.3);
    // Que ninguna cara quede de canto (se vería como una raya)
    if (intento < 60 && P.caras.some(c => Math.abs(p3(c.n, VISTA)) < 0.1)) continue;
    return { cuerpo, n: n || 4, color, P };
  }
}

function dibPoliedro(fig, W, H, pad, marcar) {
  const { P, color } = fig, pts = P.V.map(proyectar), { ap } = encajar(pts, W, H, pad), Q = pts.map(ap);
  let s = "";
  for (const c of P.caras) if (c.visible) s += `<polygon points="${lista(c.idx.map(i => Q[i]))}" fill="${mezclar(color, Math.max(-0.3, Math.min(0.55, 0.45 * p3(c.n, LUZ) - 0.05)))}"/>`;
  const vis = e => e.caras.some(k => P.caras[k].visible);
  const colorArista = marcar === "aristas" ? NARANJA : TINTA;
  for (const e of P.aristas) if (!vis(e)) s += seg(Q[e.a], Q[e.b], marcar === "aristas" ? NARANJA : GRIS, 1.8, PUNTEADO);
  for (const e of P.aristas) if (vis(e)) s += seg(Q[e.a], Q[e.b], colorArista, marcar === "aristas" ? 3.5 : 2.6);
  if (marcar === "vertices") s += Q.map(q => punto(q, 4.5, ROJO)).join("");
  return s;
}
function dibRedondo(fig, W, H, pad) {
  const { cuerpo, color } = fig, ry = SA;
  if (cuerpo === "esfera") {
    const { ap, k } = encajar([[-1, -1], [1, 1]], W, H, pad), [cx, cy] = ap([0, 0]);
    return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(k)}" fill="${color}" stroke="${TINTA}" stroke-width="2.6"/>`
      + `<path d="M${f1(cx - k)} ${f1(cy)} A${f1(k)} ${f1(k * ry)} 0 0 0 ${f1(cx + k)} ${f1(cy)}" fill="none" stroke="${TINTA}" stroke-width="1.6"/>`
      + `<path d="M${f1(cx + k)} ${f1(cy)} A${f1(k)} ${f1(k * ry)} 0 0 0 ${f1(cx - k)} ${f1(cy)}" fill="none" stroke="${GRIS}" stroke-width="1.4"${PUNTEADO}/>`
      + `<ellipse cx="${f1(cx - 0.38 * k)}" cy="${f1(cy - 0.45 * k)}" rx="${f1(0.22 * k)}" ry="${f1(0.13 * k)}" fill="#fff" opacity=".55" transform="rotate(-30 ${f1(cx - 0.38 * k)} ${f1(cy - 0.45 * k)})"/>`;
  }
  const h = (cuerpo === "cilindro" ? 2.1 : 2.5) * CA;
  const { ap, k } = encajar([[-1, ry], [1, cuerpo === "cilindro" ? -h - ry : -h]], W, H, pad);
  const [cx, cy] = ap([0, 0]), RX = k, RY = k * ry, top = ap([0, -h]);
  const A = (x1, y1, gr, x2, y2) => `M${f1(x1)} ${f1(y1)} A${f1(RX)} ${f1(RY)} 0 ${gr} 0 ${f1(x2)} ${f1(y2)}`;
  if (cuerpo === "cilindro") {
    return `<path d="M${f1(cx - RX)} ${f1(top[1])} L${f1(cx - RX)} ${f1(cy)} A${f1(RX)} ${f1(RY)} 0 0 0 ${f1(cx + RX)} ${f1(cy)} L${f1(cx + RX)} ${f1(top[1])} Z" fill="${color}"/>`
      + `<path d="${A(cx + RX, cy, 0, cx - RX, cy)}" fill="none" stroke="${GRIS}" stroke-width="1.6"${PUNTEADO}/>`
      + `<path d="${A(cx - RX, cy, 0, cx + RX, cy)}" fill="none" stroke="${TINTA}" stroke-width="2.6"/>`
      + seg([cx - RX, top[1]], [cx - RX, cy], TINTA, 2.6) + seg([cx + RX, top[1]], [cx + RX, cy], TINTA, 2.6)
      + `<ellipse cx="${f1(cx)}" cy="${f1(top[1])}" rx="${f1(RX)}" ry="${f1(RY)}" fill="${mezclar(color, 0.45)}" stroke="${TINTA}" stroke-width="2.6"/>`;
  }
  // Cono: las rayas de la punta tocan la base en los puntos de tangencia
  const yT = ry * ry / h, xT = Math.sqrt(1 - yT * yT / (ry * ry)), [lx, ly] = ap([-xT, -yT]), [rx2, ry2] = ap([xT, -yT]);
  return `<path d="M${f1(lx)} ${f1(ly)} A${f1(RX)} ${f1(RY)} 0 1 0 ${f1(rx2)} ${f1(ry2)} L${f1(top[0])} ${f1(top[1])} Z" fill="${color}"/>`
    + `<path d="${A(rx2, ry2, 0, lx, ly)}" fill="none" stroke="${GRIS}" stroke-width="1.6"${PUNTEADO}/>`
    + `<path d="${A(lx, ly, 1, rx2, ry2)}" fill="none" stroke="${TINTA}" stroke-width="2.6"/>`
    + seg(top, [lx, ly], TINTA, 2.6) + seg(top, [rx2, ry2], TINTA, 2.6);
}
const dibCuerpo = (fig, W, H, pad, marcar) => (fig.P ? dibPoliedro(fig, W, H, pad, marcar) : dibRedondo(fig, W, H, pad));

function cuerposSolidos(rnd) {
  const tipo = azar(["nombre", "nombre", "rueda", "objeto"], rnd);
  const item = v => ({ v, svg: lienzo(100, 100, dibCuerpo(figCuerpo(v, rnd), 100, 100, 12)) });
  if (tipo === "rueda") {
    const si = azar(Object.keys(RUEDA), rnd), no = barajar(["cubo", "prisma", "piramide"], rnd).slice(0, 2);
    return {
      tipo: "tocar", items: barajar([si, ...no].map(item), rnd), respuesta: si,
      texto: "Tocá el cuerpo que puede **rodar**", voz: "Tocá el cuerpo que puede rodar.",
      pista: "Los cuerpos que tienen una parte redonda pueden rodar. Los que solo tienen caras planas, no.",
      explica: `${esteEs(CUERPOS[si][0])} ${CUERPOS[si].join(" ")}: tiene una parte **redonda**, por eso rueda. La esfera, el cilindro y el cono ruedan; el cubo, el prisma y la pirámide tienen solo caras planas y no ruedan.`,
      confusiones: no.map(v => ({ v, msg: `${may(CUERPOS[v].join(" "))} tiene solo caras planas: no rueda.` })),
      datos: { tipo: "rueda" },
    };
  }
  if (tipo === "objeto") {
    const o = azar(OBJETOS, rnd), parecido = azar(PARECIDOS_C[o.c], rnd);
    const otros = [parecido, ...barajar(Object.keys(CUERPOS).filter(c => c !== o.c && c !== parecido), rnd)].slice(0, 2);
    const [art, nom] = CUERPOS[o.c];
    return {
      tipo: "tocar", items: barajar([o.c, ...otros].map(item), rnd), respuesta: o.c,
      texto: `<span class="big">${o.e}</span> ¿A qué cuerpo se parece **${o.n}**?`, voz: `¿A qué cuerpo se parece ${o.n}? Tocalo.`,
      pista: `Pensá en la forma de ${o.n}: ¿es toda redonda?, ¿tiene caras planas?, ¿tiene punta?`,
      explica: `${may(o.n)} se parece ${al(art)} **${nom}**: ${COMO_CUERPO[o.c]}.`,
      confusiones: otros.map(v => ({ v, msg: `${esteEs(CUERPOS[v][0])} ${CUERPOS[v].join(" ")}: ${COMO_CUERPO[v]}.` })),
      datos: { tipo: "objeto", objeto: o.c }, html: true,
    };
  }
  const c = azar(Object.keys(CUERPOS), rnd), parecido = azar(PARECIDOS_C[c], rnd);
  const otros = [parecido, ...barajar(Object.keys(CUERPOS).filter(x => x !== c && x !== parecido), rnd)].slice(0, 3);
  const [art, nom] = CUERPOS[c];
  return {
    tipo: "tocar", items: barajar([c, ...otros].map(item), rnd), respuesta: c,
    texto: `Tocá ${art} **${nom}**`, voz: `Tocá ${art} ${nom}.`,
    pista: `${may(art)} ${nom} ${COMO_CUERPO[c]}.`,
    explica: `${esteEs(art)} ${art} **${nom}**: ${COMO_CUERPO[c]}.`,
    confusiones: otros.map(v => ({ v, msg: `${esteEs(CUERPOS[v][0])} ${CUERPOS[v].join(" ")}: ${COMO_CUERPO[v]}.` })),
    datos: { tipo: "cuerpo" },
  };
}

// =================================================================
// 📏 Rectas paralelas, perpendiculares y oblicuas
// =================================================================
const RECTAS = {
  paralelas: "Las rectas **paralelas** nunca se juntan: van siempre a la misma distancia, como los rieles del tren.",
  perpendiculares: "Las rectas **perpendiculares** se cortan formando **ángulos rectos**, como la esquina de un cuaderno.",
  oblicuas: "Las rectas **oblicuas** se cortan, pero sin formar ángulos rectos: quedan inclinadas.",
};
function figRectas(rel, rnd) {
  const a = entero(0, 179, rnd);
  const b = rel === "paralelas" ? a : rel === "perpendiculares" ? a + 90 : a + (rnd() < 0.5 ? 1 : -1) * entero(30, 58, rnd);
  return { rel, a, b, j: [rnd() - 0.5, rnd() - 0.5] };
}
/** La recta p + t·u cortada por la caja [m, W − m] × [m, H − m]. */
function recortar(p, u, W, H, m) {
  let t0 = -1e9, t1 = 1e9;
  for (const [d, q, lo, hi] of [[u[0], p[0], m, W - m], [u[1], p[1], m, H - m]]) {
    if (Math.abs(d) < 1e-9) continue;
    let ta = (lo - q) / d, tb = (hi - q) / d;
    if (ta > tb) [ta, tb] = [tb, ta];
    t0 = Math.max(t0, ta); t1 = Math.min(t1, tb);
  }
  return [mas(p, u, t0), mas(p, u, t1)];
}
function puntosRectas(fig, W, H) {
  const c = [W / 2 + fig.j[0] * W * 0.12, H / 2 + fig.j[1] * H * 0.12];
  let p1 = c, p2 = c;
  if (fig.rel === "paralelas") { const n = hacia(fig.a + 90), sep = Math.min(W, H) * 0.32; p1 = mas(c, n, sep / 2); p2 = mas(c, n, -sep / 2); }
  return { c, L1: recortar(p1, hacia(fig.a), W, H, 7), L2: recortar(p2, hacia(fig.b), W, H, 7) };
}
function dibRectas(fig, W, H, marcar) {
  const { c, L1, L2 } = puntosRectas(fig, W, H);
  let s = seg(L1[0], L1[1], ROJO, 4) + seg(L2[0], L2[1], AZUL, 4);
  if (marcar && fig.rel === "perpendiculares") s += cuadrito(c, hacia(fig.a), hacia(fig.b), 12);
  return s;
}
function rectas(rnd) {
  if (rnd() < 0.5) {
    const pide = azar(["paralelas", "perpendiculares"], rnd), rels = ["paralelas", "perpendiculares", "oblicuas"];
    const items = barajar(rels.map(rel => { const fig = figRectas(rel, rnd); return { v: rel, fig, svg: lienzo(100, 100, dibRectas(fig, 100, 100)) }; }), rnd);
    return {
      tipo: "tocar", items, respuesta: pide,
      texto: `Tocá las rectas **${pide}**`, voz: `Tocá las rectas ${pide}.`,
      pista: RECTAS[pide], explica: RECTAS[pide],
      confusiones: rels.filter(r => r !== pide).map(v => ({ v, msg: `Esas son ${v}. ${RECTAS[v]}` })),
      datos: { tipo: "rectas", items },
    };
  }
  const rel = azar(["paralelas", "perpendiculares", "oblicuas"], rnd), fig = figRectas(rel, rnd);
  return {
    tipo: "opciones", dib: { W: 200, H: 130, cuerpo: dibRectas(fig, 200, 130) }, dibMarcado: { W: 200, H: 130, cuerpo: dibRectas(fig, 200, 130, true) },
    opciones: barajar(["paralelas", "perpendiculares", "oblicuas"], rnd).map(v => ({ v, t: may(v) })), respuesta: rel,
    texto: "¿Cómo son estas rectas?", voz: "¿Cómo son estas rectas? ¿Paralelas, perpendiculares u oblicuas?",
    pista: "¿Se cortan? Si se cortan, ¿forman una esquina como la de un cuaderno?",
    explica: `Son **${rel}**. ${RECTAS[rel]}`,
    datos: { tipo: "rectas", fig },
  };
}

// =================================================================
// 📐 Ángulos
// =================================================================
export const claseAngulo = g => (g < 90 ? "agudo" : g === 90 ? "recto" : g < 180 ? "obtuso" : "llano");
const ANG = {
  agudo: "mide **menos de 90°** (es más cerrado que la esquina de un cuaderno)",
  recto: "mide **90°**, como la esquina de un cuaderno (se marca con un cuadrito)",
  obtuso: "mide **más de 90°** y menos de 180° (es más abierto que la esquina de un cuaderno)",
  llano: "mide **180°** (sus dos lados forman una línea recta)",
};
const gradosDe = (clase, rnd, dificil) => ({ agudo: paso(dificil ? 15 : 20, dificil ? 75 : 65, 5, rnd), recto: 90, obtuso: paso(dificil ? 105 : 115, dificil ? 165 : 160, 5, rnd), llano: 180 })[clase];
/** Vértice y puntas de los dos lados (sin centrar). */
const puntosAngulo = (fig, L) => [[0, 0], mas([0, 0], hacia(fig.giro), L), mas([0, 0], hacia(fig.giro + fig.grados), L)];
function arco(V, u, w, r, g, color = "#FFE08A") {
  const a = mas(V, u, r), b = mas(V, w, r);
  return `<path d="M${f1(V[0])} ${f1(V[1])} L${f1(a[0])} ${f1(a[1])} A${r} ${r} 0 ${g > 180 ? 1 : 0} 0 ${f1(b[0])} ${f1(b[1])} Z" fill="${color}" stroke="${NARANJA}" stroke-width="1.6"/>`;
}
function dibAngulo(fig, W, H, L) {
  const ap = centrar(puntosAngulo(fig, L), W, H), [V, A, B] = puntosAngulo(fig, L).map(ap), u = hacia(fig.giro), w = hacia(fig.giro + fig.grados);
  return (fig.grados === 90 ? cuadrito(V, u, w, 13, NARANJA) : arco(V, u, w, Math.min(18, L * 0.35), fig.grados))
    + seg(V, A, TINTA, 4) + seg(V, B, TINTA, 4) + punto(V, 4);
}
function nombrarAngulo(rnd, clases, dificil) {
  const clase = azar(clases, rnd), fig = { grados: gradosDe(clase, rnd, dificil), giro: entero(0, 359, rnd) };
  return {
    tipo: "opciones", dib: { W: 200, H: 130, cuerpo: dibAngulo(fig, 200, 130, 58) },
    opciones: barajar(clases, rnd).map(v => ({ v, t: may(v) })), respuesta: clase,
    texto: "¿Qué clase de ángulo es?", voz: `¿Qué clase de ángulo es? ¿${oLista(clases)}?`,
    pista: "Compará el ángulo con la esquina de un cuaderno, que mide 90°.",
    explica: `Es un ángulo **${clase}**: ${ANG[clase]}.${clase === "agudo" || clase === "obtuso" ? ` Este mide ${fig.grados}°.` : ""}`,
    datos: { tipo: "angulo", fig },
  };
}
function tocarAngulo(rnd) {
  const clases = ["agudo", "recto", "obtuso", "llano"], pide = azar(clases, rnd);
  const items = barajar(clases.map(v => { const fig = { grados: gradosDe(v, rnd, true), giro: entero(0, 359, rnd) }; return { v, fig, svg: lienzo(100, 100, dibAngulo(fig, 100, 100, 38)) }; }), rnd);
  return {
    tipo: "tocar", items, respuesta: pide,
    texto: `Tocá el ángulo **${pide}**`, voz: `Tocá el ángulo ${pide}.`,
    pista: `El ángulo ${pide} ${ANG[pide]}.`,
    explica: `El ángulo **${pide}** ${ANG[pide]}.`,
    confusiones: clases.filter(c => c !== pide).map(v => ({ v, msg: `Ese es un ángulo ${v}: ${ANG[v]}.` })),
    datos: { tipo: "angulos", items },
  };
}

// ---------- El transportador ----------
function dibTransportador(fig, W = 220, H = 132, marcar) {
  const C = [W / 2, H - 14], R = 92, g = fig.grados;
  let s = `<path d="M${C[0] - R} ${C[1]} A${R} ${R} 0 0 1 ${C[0] + R} ${C[1]} Z" fill="#EAF4FF" stroke="${AZUL}" stroke-width="2"/>`;
  for (let t = 0; t <= 180; t += 10) {
    const u = hacia(t), largo = t % 30 === 0 ? 12 : 7;
    s += seg(mas(C, u, R), mas(C, u, R - largo), AZUL, t % 30 === 0 ? 2 : 1.3);
    if (t % 30 === 0) s += etiqueta(...mas(C, hacia(t === 0 ? 7 : t === 180 ? 173 : t), R - 21), t, { size: 10, color: AZUL });
  }
  s += arco(C, hacia(0), hacia(g), 22, g, marcar ? "#FFE08A" : "#FFF1C2");
  s += seg(C, mas(C, hacia(0), R + 10), TINTA, 3.5) + seg(C, mas(C, hacia(g), R + 10), ROJO, 3.5) + punto(C, 4);
  if (marcar) s += punto(mas(C, hacia(g), R), 6, ROJO);
  return s;
}
function transportador(rnd) {
  const g = paso(10, 170, 10, rnd), fig = { grados: g, giro: 0 };
  return {
    tipo: "escribir", dib: { W: 220, H: 132, cuerpo: dibTransportador(fig) }, dibMarcado: { W: 220, H: 132, cuerpo: dibTransportador(fig, 220, 132, true) },
    sufijo: "°", respuesta: g,
    texto: "¿Cuánto mide el ángulo?<small>Usá el transportador: las rayitas van de 10 en 10.</small>",
    voz: "¿Cuánto mide el ángulo? Usá el transportador: las rayitas van de diez en diez.",
    pista: "Empezá en el **0**, donde está el lado de abajo, y contá las rayitas de **10 en 10** hasta el lado rojo.",
    explica: `El lado rojo llega al **${g}**: el ángulo mide **${g}°**. Es un ángulo ${claseAngulo(g)}.`,
    confusiones: g !== 90 ? [{ v: 180 - g, msg: `Eso es lo que le falta para llegar a 180°. Contá desde el **0**, que está en el lado de abajo.` }] : [],
    datos: { tipo: "transportador", fig },
  };
}

// =================================================================
// 🦋 Simetría
// =================================================================
const clave = c => c.join(",");
/** ¿La figura queda igual del otro lado del eje? eje: { dir: "v" | "h", pos } (la raya va entre la columna pos − 1 y la pos). */
export function esSimetrica(celdas, eje) {
  const s = new Set(celdas.map(clave));
  return celdas.every(([x, y]) => s.has(clave(eje.dir === "v" ? [2 * eje.pos - 1 - x, y] : [x, 2 * eje.pos - 1 - y])));
}
const espejo = (celdas, eje) => celdas.map(([x, y]) => (eje.dir === "v" ? [2 * eje.pos - 1 - x, y] : [x, 2 * eje.pos - 1 - y]));
/** n cuadritos juntos en la mitad de la izquierda (w2 columnas), pegados al eje. */
function mitad(w2, h, n, rnd) {
  const ini = [w2 - 1, entero(0, h - 1, rnd)], s = new Set([clave(ini)]), cel = [ini];
  while (cel.length < n) {
    const [x, y] = azar(cel, rnd), [dx, dy] = azar([[1, 0], [-1, 0], [0, 1], [0, -1]], rnd), nx = x + dx, ny = y + dy;
    if (nx < 0 || nx >= w2 || ny < 0 || ny >= h || s.has(`${nx},${ny}`)) continue;
    s.add(`${nx},${ny}`); cel.push([nx, ny]);
  }
  return cel;
}
/** Una figura simétrica: { W, H, eje, celdas }. */
function figuraSimetrica(rnd) {
  const w2 = entero(3, 4, rnd), h = entero(5, 6, rnd), dir = rnd() < 0.6 ? "v" : "h";
  let cel = mitad(w2, h, entero(4, 8, rnd), rnd);
  cel = [...cel, ...cel.map(([x, y]) => [2 * w2 - 1 - x, y])];
  if (dir === "h") cel = cel.map(([x, y]) => [y, x]);
  return dir === "v" ? { W: 2 * w2, H: h, eje: { dir, pos: w2 }, celdas: cel } : { W: h, H: 2 * w2, eje: { dir, pos: w2 }, celdas: cel };
}
function dibCuadricula(f, eje, W, H, color = "#8FD16F") {
  const cs = Math.min((W - 22) / f.W, (H - 22) / f.H), ox = (W - cs * f.W) / 2, oy = (H - cs * f.H) / 2;
  let s = "";
  for (let y = 0; y < f.H; y++) for (let x = 0; x < f.W; x++) s += `<rect x="${f1(ox + x * cs)}" y="${f1(oy + y * cs)}" width="${f1(cs)}" height="${f1(cs)}" fill="#fff" stroke="#CBD6E2" stroke-width="1"/>`;
  s += f.celdas.map(([x, y]) => `<rect x="${f1(ox + x * cs)}" y="${f1(oy + y * cs)}" width="${f1(cs)}" height="${f1(cs)}" fill="${color}" stroke="#5E9E45" stroke-width="1"/>`).join("");
  if (eje) {
    const e = eje.dir === "v" ? [[ox + eje.pos * cs, oy - 8], [ox + eje.pos * cs, oy + f.H * cs + 8]] : [[ox - 8, oy + eje.pos * cs], [ox + f.W * cs + 8, oy + eje.pos * cs]];
    s += seg(e[0], e[1], ROJO, 3, ` stroke-dasharray="7 5"`);
  }
  return s;
}
const SIMETRIA = "Si se dobla por el **eje de simetría**, las dos mitades quedan **una encima de la otra**, como en un espejo.";
function eje(rnd) {
  const f = figuraSimetrica(rnd);
  if (rnd() < 0.45) {
    // ¿Dónde va el eje? El mismo dibujo con tres rayas; solo una sirve
    const malas = [];
    for (const e of barajar([{ dir: f.eje.dir, pos: f.eje.pos + 1 }, { dir: f.eje.dir, pos: f.eje.pos - 1 }, { dir: f.eje.dir === "v" ? "h" : "v", pos: (f.eje.dir === "v" ? f.H : f.W) / 2 }], rnd)) {
      if (Number.isInteger(e.pos) && !esSimetrica(f.celdas, e) && malas.length < 2) malas.push(e);
    }
    if (malas.length === 2) {
      const items = barajar([f.eje, ...malas].map((e, i) => ({ v: i ? `mal${i}` : "bien", eje: e, svg: lienzo(150, 110, dibCuadricula(f, e, 150, 110)) })), rnd);
      return {
        tipo: "tocar", grandes: true, items, respuesta: "bien",
        texto: "Tocá el dibujo donde la raya es un **eje de simetría**", voz: "Tocá el dibujo donde la raya roja es un eje de simetría: si doblás por ahí, las dos mitades quedan igualitas.",
        pista: SIMETRIA, explica: SIMETRIA,
        datos: { tipo: "eje-tocar", f },
      };
    }
  }
  // ¿La raya es un eje de simetría? Sí o no
  let celdas = f.celdas, e = f.eje, si = rnd() < 0.5;
  if (!si) {
    if (rnd() < 0.5) e = { ...f.eje, pos: f.eje.pos + (rnd() < 0.5 ? 1 : -1) };
    else { // se le quita un cuadrito a una mitad
      const lado = celdas.filter(([x, y]) => (f.eje.dir === "v" ? x >= f.eje.pos : y >= f.eje.pos));
      const quitar = azar(lado, rnd);
      celdas = celdas.filter(c => c !== quitar);
    }
    if (esSimetrica(celdas, e)) { celdas = f.celdas; e = f.eje; si = true; }
  }
  const g = { ...f, celdas };
  return {
    tipo: "opciones", dib: { W: 200, H: 135, cuerpo: dibCuadricula(g, e, 200, 135) },
    opciones: [{ v: "si", t: "Sí" }, { v: "no", t: "No" }], respuesta: si ? "si" : "no",
    texto: "¿La raya roja es un **eje de simetría**?", voz: "¿La raya roja es un eje de simetría? Si doblás por ahí, ¿las dos mitades quedan igualitas?",
    pista: "Fijate en cada cuadrito: ¿tiene su pareja al otro lado de la raya, a la misma distancia?",
    explica: si ? `**Sí**. ${SIMETRIA}` : `**No**: hay cuadritos que no tienen su pareja al otro lado de la raya. ${SIMETRIA}`,
    datos: { tipo: "eje", celdas, eje: e, W: f.W, H: f.H },
  };
}
function completar(rnd) {
  const w2 = entero(3, 4, rnd), h = entero(5, 6, rnd), dir = rnd() < 0.6 ? "v" : "h";
  let dados = mitad(w2, h, entero(4, 8, rnd), rnd);
  if (dir === "h") dados = dados.map(([x, y]) => [y, x]);
  const eje = { dir, pos: w2 }, W = dir === "v" ? 2 * w2 : h, H = dir === "v" ? h : 2 * w2;
  return {
    tipo: "pintar", cuadricula: { W, H, dir, pos: w2, dados, falta: espejo(dados, eje) }, respuesta: dados.length,
    texto: "Pintá la otra mitad para que la figura quede **simétrica**", voz: "Tocá los cuadritos de la otra mitad para que la figura quede igualita del otro lado de la raya, como en un espejo.",
    pista: "Cada cuadrito tiene su pareja al otro lado de la raya, **a la misma distancia**. Empezá por los que tocan la raya.",
    explica: "Cada cuadrito pintado tiene su pareja al otro lado del eje, **a la misma distancia**, como en un espejo.",
    datos: { tipo: "completar" },
  };
}

// =================================================================
// 🔺 Triángulos
// =================================================================
const TRI_LADOS = { equilatero: ["Equilátero", "tiene sus **3 lados iguales**"], isosceles: ["Isósceles", "tiene **2 lados iguales** y uno diferente"], escaleno: ["Escaleno", "tiene sus **3 lados diferentes**"] };
const TRI_ANG = { acutangulo: ["Acutángulo", "sus **3 ángulos son agudos** (miden menos de 90°)"], rectangulo: ["Rectángulo", "tiene **un ángulo recto** (de 90°)"], obtusangulo: ["Obtusángulo", "tiene **un ángulo obtuso** (de más de 90°)"] };
/** A, B, C a partir de los lados a = BC, b = CA, c = AB. */
function triDeLados(a, b, c) { const x = (b * b + c * c - a * a) / (2 * c); return [[0, 0], [c, 0], [x, -Math.sqrt(Math.max(0, b * b - x * x))]]; }
/** A, B, C a partir de los ángulos en A y en B (el lado AB mide 1). */
function triDeAngulos(A, B) { const b = Math.sin(B * RAD) / Math.sin((180 - A - B) * RAD); return [[0, 0], [1, 0], [b * Math.cos(A * RAD), -b * Math.sin(A * RAD)]]; }
const angulosTri = P => P.map((p, i) => anguloEn(p, P[(i + 2) % 3], P[(i + 1) % 3]));
export const claseLados = l => (l[0] === l[1] && l[1] === l[2] ? "equilatero" : l[0] === l[1] || l[1] === l[2] || l[0] === l[2] ? "isosceles" : "escaleno");
export const claseAngulos = a => (a.some(x => Math.abs(x - 90) < 0.01) ? "rectangulo" : a.some(x => x > 90) ? "obtusangulo" : "acutangulo");

function ladosTriangulo(clase, rnd) {
  for (;;) {
    let l;
    if (clase === "equilatero") { const a = entero(3, 9, rnd); l = [a, a, a]; }
    else if (clase === "isosceles") { const a = entero(4, 9, rnd), b = entero(3, 10, rnd); if (b === a || b > 2 * a - 2 || b < a * 0.5) continue; l = [a, a, b]; }
    else { l = [entero(3, 10, rnd), entero(3, 10, rnd), entero(3, 10, rnd)]; if (new Set(l).size < 3) continue; const [x, y, z] = [...l].sort((p, q) => p - q); if (z > x + y - 2) continue; }
    l = barajar(l, rnd);
    if (Math.min(...angulosTri(triDeLados(l[1], l[2], l[0]))) < 24) continue;
    return l; // l[i] = lado del vértice i al i + 1
  }
}
function angulosTriangulo(clase, rnd) {
  for (;;) {
    let t;
    if (clase === "rectangulo") { const a = paso(25, 65, 5, rnd); t = [90, a, 90 - a]; }
    else if (clase === "obtusangulo") { const o = paso(100, 135, 5, rnd), a = paso(20, 180 - o - 20, 5, rnd); t = [o, a, 180 - o - a]; }
    else { const a = paso(45, 80, 5, rnd), b = paso(45, 80, 5, rnd), c = 180 - a - b; if (c < 35 || c > 85) continue; t = [a, b, c]; }
    if (t.some(x => x < 20)) continue;
    return barajar(t, rnd); // t[i] = ángulo en el vértice i
  }
}
/** Los puntos del triángulo, girado. ladosDe / angulosDe: uno de los dos. */
function puntosTri({ lados, angulos, giro }) {
  const P = lados ? triDeLados(lados[1], lados[2], lados[0]) : triDeAngulos(angulos[0], angulos[1]);
  return rotar(P, giro);
}
function dibTriangulo(fig, W, H, { etiquetas, marcar } = {}) {
  const P0 = puntosTri(fig), { ap } = encajar(P0, W, H, etiquetas === "lados" ? 30 : 16, etiquetas === "lados" ? 20 : 14), P = P0.map(ap), c = centro(P);
  let s = `<polygon points="${lista(P)}" fill="${fig.color}" stroke="${TINTA}" stroke-width="3" stroke-linejoin="round"/>`;
  if (etiquetas === "lados") {
    P.forEach((p, i) => {
      const q = P[(i + 1) % 3], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      if (marcar) { // rayitas en los lados iguales
        const iguales = fig.lados.filter(l => l === fig.lados[i]).length;
        if (iguales > 1) { const u = unitario(p, q), n = [-u[1], u[0]]; s += seg(mas(m, n, -6), mas(m, n, 6), ROJO, 3); }
      }
      s += etiqueta(...mas(m, unitario(c, m), 15), `${fig.lados[i]} cm`, { size: 12 });
    });
  } else {
    const angs = fig.angulos;
    P.forEach((p, i) => {
      const a = P[(i + 2) % 3], b = P[(i + 1) % 3], u = unitario(p, b), w = unitario(p, a);
      const bis = unitario([0, 0], [u[0] + w[0], u[1] + w[1]]), g = angs[i], falta = fig.falta === i;
      if (g === 90 && !falta) s += cuadrito(p, u, w, 10);
      const d = Math.max(17, Math.min(36, 11 / Math.sin(g * RAD / 2)));
      s += etiqueta(...mas(p, bis, d), falta ? "?" : `${g}°`, { size: 11, color: falta ? NARANJA : TINTA });
    });
  }
  return s;
}
function triLados(rnd) {
  const clase = azar(Object.keys(TRI_LADOS), rnd), fig = { lados: ladosTriangulo(clase, rnd), giro: entero(0, 359, rnd), color: azar(RELLENOS, rnd) };
  const [nom, por] = TRI_LADOS[clase], l = fig.lados;
  const dib = marcar => ({ W: 200, H: 150, cuerpo: dibTriangulo(fig, 200, 150, { etiquetas: "lados", marcar }) });
  return {
    tipo: "opciones", dib: dib(false), dibMarcado: dib(true),
    opciones: barajar(Object.keys(TRI_LADOS), rnd).map(v => ({ v, t: TRI_LADOS[v][0] })), respuesta: clase,
    texto: "Según sus **lados**, ¿qué triángulo es?", voz: `Según sus lados, ¿qué triángulo es? Sus lados miden ${l[0]}, ${l[1]} y ${l[2]} centímetros.`,
    pista: "Mirá las medidas: ¿cuántos lados son iguales?",
    explica: `Sus lados miden ${l[0]} cm, ${l[1]} cm y ${l[2]} cm: es **${nom.toLowerCase()}** porque ${por}.`,
    datos: { tipo: "tri-lados", fig },
  };
}
function triAngulos(rnd) {
  const clase = azar(Object.keys(TRI_ANG), rnd), fig = { angulos: angulosTriangulo(clase, rnd), giro: entero(0, 359, rnd), color: azar(RELLENOS, rnd) };
  const [nom, por] = TRI_ANG[clase], a = fig.angulos;
  return {
    tipo: "opciones", dib: { W: 200, H: 140, cuerpo: dibTriangulo(fig, 200, 140) },
    opciones: barajar(Object.keys(TRI_ANG), rnd).map(v => ({ v, t: TRI_ANG[v][0] })), respuesta: clase,
    texto: "Según sus **ángulos**, ¿qué triángulo es?", voz: `Según sus ángulos, ¿qué triángulo es? Sus ángulos miden ${a[0]}, ${a[1]} y ${a[2]} grados.`,
    pista: "Buscá el ángulo más grande: ¿mide menos de 90°, justo 90° o más de 90°?",
    explica: `Sus ángulos miden ${a[0]}°, ${a[1]}° y ${a[2]}°: es **${nom.toLowerCase()}** porque ${por}.`,
    datos: { tipo: "tri-angulos", fig },
  };
}

// =================================================================
// ⬜ Cuadriláteros
// =================================================================
const CUAD = {
  cuadrado: ["Cuadrado", "tiene **4 lados iguales** y **4 ángulos rectos**"],
  rectangulo: ["Rectángulo", "tiene **4 ángulos rectos** y los lados de enfrente iguales: dos largos y dos cortos"],
  rombo: ["Rombo", "tiene **4 lados iguales**, pero sus ángulos **no son rectos**"],
  romboide: ["Romboide", "tiene los lados de enfrente **paralelos e iguales**, pero no tiene ángulos rectos ni 4 lados iguales"],
  trapecio: ["Trapecio", "tiene **solo un par de lados paralelos** (sus dos bases)"],
  trapezoide: ["Trapezoide", "**no tiene lados paralelos**"],
};
const CONFUNDE = { cuadrado: ["rombo", "rectangulo"], rectangulo: ["cuadrado", "romboide"], rombo: ["cuadrado", "romboide"], romboide: ["rombo", "rectangulo", "trapecio"], trapecio: ["trapezoide", "romboide"], trapezoide: ["trapecio", "romboide"] };
const paralelos = (P, i, j) => { const u = unitario(P[i], P[(i + 1) % 4]), v = unitario(P[j], P[(j + 1) % 4]); return Math.abs(u[0] * v[1] - u[1] * v[0]); };
/** ¿Qué cuadrilátero es, midiendo el dibujo? */
export function claseCuadrilatero(P) {
  const L = P.map((p, i) => dist(p, P[(i + 1) % 4])), A = P.map((p, i) => anguloEn(p, P[(i + 3) % 4], P[(i + 1) % 4]));
  const p1 = paralelos(P, 0, 2) < 0.005, p2 = paralelos(P, 1, 3) < 0.005;
  const iguales = L.every(l => Math.abs(l - L[0]) < 1e-6 * L[0]), rectos = A.every(a => Math.abs(a - 90) < 0.01);
  if (p1 && p2) return rectos ? (iguales ? "cuadrado" : "rectangulo") : iguales ? "rombo" : "romboide";
  return p1 || p2 ? "trapecio" : "trapezoide";
}
function puntosCuadrilatero(clase, rnd) {
  for (;;) {
    let P;
    if (clase === "cuadrado") P = [[0, 0], [1, 0], [1, 1], [0, 1]];
    else if (clase === "rectangulo") { const w = 1.5 + rnd() * 0.6; P = [[0, 0], [w, 0], [w, 1], [0, 1]]; }
    else if (clase === "rombo") {
      const t = entero(55, 70, rnd) * RAD;
      P = rnd() < 0.5 ? [[0, 0], [1, 0], [1 + Math.cos(t), -Math.sin(t)], [Math.cos(t), -Math.sin(t)]]
        : [[0, -Math.cos(t / 2)], [Math.sin(t / 2), 0], [0, Math.cos(t / 2)], [-Math.sin(t / 2), 0]];
    } else if (clase === "romboide") {
      const w = 1.7 + rnd() * 0.4, s = 0.95 + rnd() * 0.2, t = entero(55, 72, rnd) * RAD;
      P = [[0, 0], [w, 0], [w + s * Math.cos(t), -s * Math.sin(t)], [s * Math.cos(t), -s * Math.sin(t)]];
    } else if (clase === "trapecio") {
      const B = 2, b = 0.9 + rnd() * 0.5, h = 0.8 + rnd() * 0.3, o = azar([(B - b) / 2, 0, B - b, rnd() * (B - b)], rnd);
      P = [[0, 0], [B, 0], [o + b, -h], [o, -h]];
    } else {
      P = [0, 1, 2, 3].map(i => { const t = (90 * i + entero(-28, 28, rnd)) * RAD, r = 0.75 + rnd() * 0.5; return [r * Math.cos(t), r * Math.sin(t)]; });
    }
    P = rotar(P, entero(-12, 12, rnd));
    const A = P.map((p, i) => anguloEn(p, P[(i + 3) % 4], P[(i + 1) % 4]));
    if (!convexo(P) || Math.min(...A) < 35) continue;
    if (clase === "trapezoide" && (paralelos(P, 0, 2) < Math.sin(12 * RAD) || paralelos(P, 1, 3) < Math.sin(12 * RAD) || A.some(a => Math.abs(a - 90) < 8))) continue;
    if (clase === "trapecio" && A.some(a => Math.abs(a - 90) > 0.01 && Math.abs(a - 90) < 6)) continue; // casi rectos confunden
    if (claseCuadrilatero(P) !== clase) continue;
    return P;
  }
}
function dibCuadrilatero(fig, W, H) {
  const { ap } = encajar(fig.pts, W, H, 16), P = fig.pts.map(ap);
  let s = `<polygon points="${lista(P)}" fill="${fig.color}" stroke="${TINTA}" stroke-width="3" stroke-linejoin="round"/>`;
  // Marcas: ángulos rectos y rayitas en los lados iguales (una o dos, según el grupo)
  P.forEach((p, i) => {
    const a = P[(i + 3) % 4], b = P[(i + 1) % 4];
    if (Math.abs(anguloEn(p, a, b) - 90) < 0.01) s += cuadrito(p, unitario(p, b), unitario(p, a), 10);
  });
  const L = P.map((p, i) => dist(p, P[(i + 1) % 4])), grupos = [];
  L.forEach((l, i) => { const g = grupos.find(g => Math.abs(L[g[0]] - l) < 1e-6 * l); if (g) g.push(i); else grupos.push([i]); });
  grupos.filter(g => g.length > 1).forEach((g, k) => g.forEach(i => {
    const p = P[i], q = P[(i + 1) % 4], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], u = unitario(p, q), n = [-u[1], u[0]];
    for (let r = 0; r <= k; r++) { const c = mas(m, u, (r - k / 2) * 5); s += seg(mas(c, n, -6), mas(c, n, 6), ROJO, 2.6); }
  }));
  return s;
}
function cuadrilateros(rnd) {
  const clase = azar(Object.keys(CUAD), rnd), fig = { clase, pts: puntosCuadrilatero(clase, rnd), color: azar(RELLENOS, rnd) };
  const otros = barajar(CONFUNDE[clase], rnd).slice(0, 2);
  return {
    tipo: "opciones", dib: { W: 200, H: 135, cuerpo: dibCuadrilatero(fig, 200, 135) },
    opciones: barajar([clase, ...otros], rnd).map(v => ({ v, t: CUAD[v][0] })), respuesta: clase,
    texto: "¿Qué cuadrilátero es?<small>Las rayitas rojas marcan lados iguales y el cuadrito, un ángulo recto.</small>",
    voz: `¿Qué cuadrilátero es? ¿${oLista([clase, ...otros].map(v => CUAD[v][0].toLowerCase()))}? Las rayitas rojas marcan los lados iguales y el cuadrito, un ángulo recto.`,
    pista: "Fijate en tres cosas: ¿tiene ángulos rectos?, ¿cuántos lados iguales?, ¿cuántos pares de lados paralelos?",
    explica: `Es un **${CUAD[clase][0].toLowerCase()}**: ${CUAD[clase][1]}.`,
    confusiones: otros.map(v => ({ v, msg: `El ${CUAD[v][0].toLowerCase()} ${CUAD[v][1]}.` })),
    datos: { tipo: "cuadrilatero", fig },
  };
}

// =================================================================
// ⭕ La circunferencia
// =================================================================
const PARTES = {
  radio: "El **radio** va del **centro** hasta la orilla de la circunferencia.",
  diametro: "El **diámetro** cruza de orilla a orilla **pasando por el centro**: mide dos radios.",
  cuerda: "La **cuerda** une dos puntos de la orilla, pero **no pasa por el centro**.",
};
const NOM_PARTE = { radio: "Radio", diametro: "Diámetro", cuerda: "Cuerda" };
function puntosParte(fig, c, R) {
  const t = fig.t;
  if (fig.parte === "radio") return [c, mas(c, hacia(t), R)];
  if (fig.parte === "diametro") return [mas(c, hacia(t), R), mas(c, hacia(t + 180), R)];
  return [mas(c, hacia(t), R), mas(c, hacia(t + fig.dt), R)];
}
function dibCircunferencia(fig, W, H, { relleno = "#EAF4FF", sinCentro = false } = {}) {
  const c = [W / 2, H / 2], R = Math.min(W, H) * 0.4;
  let s = `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(R)}" fill="${relleno}" stroke="${TINTA}" stroke-width="3"/>`;
  if (fig.parte) { const [a, b] = puntosParte(fig, c, R); s += seg(a, b, ROJO, 4.5) + punto(a, 3.5, ROJO) + punto(b, 3.5, ROJO); }
  if (fig.medida) { // radio con su medida y el diámetro (o al revés) con «?»
    const [a, b] = [mas(c, hacia(fig.t), R), mas(c, hacia(fig.t + 180), R)], q = mas(c, hacia(fig.t + 90), R);
    if (fig.medida.da === "radio") {
      s += seg(c, q, ROJO, 4) + etiqueta(...mas(mas(c, hacia(fig.t + 90), R / 2), hacia(fig.t), 14), `${fig.medida.v} cm`, { size: 12, color: ROJO });
      s += seg(a, b, AZUL, 3, ` stroke-dasharray="6 5"`) + etiqueta(...mas(mas(c, hacia(fig.t), R * 0.55), hacia(fig.t - 90), 12), "?", { size: 14, color: AZUL });
    } else {
      s += seg(a, b, ROJO, 4) + etiqueta(...mas(mas(c, hacia(fig.t), R * 0.55), hacia(fig.t - 90), 13), `${fig.medida.v} cm`, { size: 12, color: ROJO });
      s += seg(c, q, AZUL, 3, ` stroke-dasharray="6 5"`) + etiqueta(...mas(mas(c, hacia(fig.t + 90), R / 2), hacia(fig.t + 180), 13), "?", { size: 14, color: AZUL });
    }
  }
  if (!sinCentro) s += punto(c, 3.5);
  return s;
}
function circunferencia(rnd) {
  const tipo = azar(["partes", "partes", "centro", "medida", "medida", "orilla"], rnd);
  if (tipo === "centro") {
    const items = barajar([0, 1, 2].map(i => {
      const R = 40, d = i ? R * (0.35 + rnd() * 0.25) : 0, u = hacia(entero(0, 359, rnd)), p = mas([50, 50], u, d);
      return { v: i ? `fuera${i}` : "centro", d: d / R, svg: lienzo(100, 100, `<circle cx="50" cy="50" r="${R}" fill="#EAF4FF" stroke="${TINTA}" stroke-width="3"/>` + punto(p, 5, ROJO)) };
    }), rnd);
    return {
      tipo: "tocar", items, respuesta: "centro",
      texto: "Tocá la circunferencia que tiene el punto rojo en el **centro**", voz: "Tocá la circunferencia que tiene el punto rojo justo en el centro.",
      pista: "El centro está justo en el medio: a la misma distancia de toda la orilla.",
      explica: "El **centro** está justo en el medio: queda **a la misma distancia** de todos los puntos de la orilla.",
      datos: { tipo: "centro", items },
    };
  }
  if (tipo === "orilla") {
    const pide = azar(["circunferencia", "circulo"], rnd), color = azar(RELLENOS, rnd);
    const items = barajar([
      { v: "circunferencia", svg: lienzo(100, 100, `<circle cx="50" cy="50" r="38" fill="none" stroke="${TINTA}" stroke-width="5"/>`) },
      { v: "circulo", svg: lienzo(100, 100, `<circle cx="50" cy="50" r="38" fill="${color}" stroke="${TINTA}" stroke-width="3"/>`) },
    ], rnd);
    return {
      tipo: "tocar", items, respuesta: pide,
      texto: `Tocá ${pide === "circulo" ? "el **círculo**" : "la **circunferencia**"}`, voz: `Tocá ${pide === "circulo" ? "el círculo" : "la circunferencia"}.`,
      pista: "Una es solo la orilla y la otra es todo lo de adentro.",
      explica: "La **circunferencia** es solo la línea de la orilla; el **círculo** es toda la parte de adentro, con su orilla.",
      datos: { tipo: "orilla" },
    };
  }
  if (tipo === "medida") {
    const da = rnd() < 0.55 ? "radio" : "diametro", v = da === "radio" ? entero(2, 15, rnd) : 2 * entero(2, 12, rnd), resp = da === "radio" ? 2 * v : v / 2;
    const fig = { t: entero(0, 359, rnd), medida: { da, v } };
    return {
      tipo: "escribir", dib: { W: 200, H: 140, cuerpo: dibCircunferencia(fig, 200, 140) }, sufijo: "cm", respuesta: resp,
      texto: da === "radio" ? `El **radio** mide ${v} cm. ¿Cuánto mide el **diámetro**?` : `El **diámetro** mide ${v} cm. ¿Cuánto mide el **radio**?`,
      voz: da === "radio" ? `El radio mide ${v} centímetros. ¿Cuánto mide el diámetro?` : `El diámetro mide ${v} centímetros. ¿Cuánto mide el radio?`,
      pista: "El diámetro mide **dos radios**: el doble.",
      explica: da === "radio" ? `El diámetro mide dos radios: 2 × ${v} = **${resp} cm**.` : `El radio es la mitad del diámetro: ${v} ÷ 2 = **${resp} cm**.`,
      confusiones: [{ v, msg: da === "radio" ? "Ese es el radio. El diámetro mide el **doble**." : "Ese es el diámetro. El radio mide la **mitad**." }],
      datos: { tipo: "medida", da, v },
    };
  }
  const parte = azar(Object.keys(PARTES), rnd), fig = { parte, t: entero(0, 359, rnd), dt: entero(60, 105, rnd) }; // la cuerda queda lejos del centro
  return {
    tipo: "opciones", dib: { W: 200, H: 140, cuerpo: dibCircunferencia(fig, 200, 140) },
    opciones: barajar(Object.keys(PARTES), rnd).map(v => ({ v, t: NOM_PARTE[v] })), respuesta: parte,
    texto: "¿Cómo se llama la **raya roja**?<small>El punto negro es el centro.</small>", voz: "¿Cómo se llama la raya roja? ¿Radio, diámetro o cuerda? El punto negro es el centro.",
    pista: "¿La raya sale del centro?, ¿pasa por el centro?, ¿o une dos puntos de la orilla sin pasar por el centro?",
    explica: PARTES[parte],
    datos: { tipo: "partes", fig },
  };
}

// =================================================================
// ➕ El ángulo que falta
// =================================================================
function dibRecta(fig, W, H, total) {
  // total 180: una recta con un rayo · total 90: un ángulo recto partido en dos
  const x = fig.x, base = total === 180 ? [[-75, 0], [75, 0]] : [[0, 0], [80, 0]], V = [0, 0];
  const pts = [...base, mas(V, hacia(x), 70), ...(total === 90 ? [mas(V, hacia(90), 80)] : [])];
  const ap = centrar(pts, W, H), P = pts.map(ap), v = ap(V);
  let s = arco(v, hacia(0), hacia(x), 24, x) + arco(v, hacia(x), hacia(total), 32, total - x, "#CFE6FF");
  s += seg(P[0], P[1], TINTA, 4) + seg(v, P[2], TINTA, 4) + (total === 90 ? seg(v, P[3], TINTA, 4) + cuadrito(v, hacia(0), hacia(90), 10, GRIS) : "") + punto(v, 4);
  s += etiqueta(...mas(v, hacia(x / 2), 42), `${x}°`, { size: 12 }) + etiqueta(...mas(v, hacia(x + (total - x) / 2), 50), "?", { size: 15, color: NARANJA });
  return s;
}
function falta(rnd) {
  const tipo = azar(["triangulo", "triangulo", "recta", "recto"], rnd);
  if (tipo === "triangulo") {
    let t;
    do t = [paso(20, 120, 5, rnd), paso(20, 120, 5, rnd)]; while (t[0] + t[1] > 160);
    const angulos = barajar([...t, 180 - t[0] - t[1]], rnd), i = entero(0, 2, rnd), resp = angulos[i], dados = angulos.filter((_, k) => k !== i);
    const fig = { angulos, falta: i, giro: entero(0, 359, rnd), color: azar(RELLENOS, rnd) };
    return {
      tipo: "escribir", dib: { W: 200, H: 140, cuerpo: dibTriangulo(fig, 200, 140) }, sufijo: "°", respuesta: resp,
      texto: "¿Cuánto mide el ángulo que falta?", voz: `Dos ángulos del triángulo miden ${dados[0]} y ${dados[1]} grados. ¿Cuánto mide el que falta?`,
      pista: "Los **3 ángulos** de un triángulo siempre suman **180°**.",
      explica: `Los ángulos de un triángulo suman **180°**: 180 − ${dados[0]} − ${dados[1]} = **${resp}°**.`,
      confusiones: [{ v: 360 - dados[0] - dados[1], msg: "Los ángulos de un triángulo suman **180°**, no 360°." }, { v: dados[0] + dados[1], msg: "Esa es la suma de los dos que ya están. Restale eso a 180°." }].filter(c => c.v !== resp),
      datos: { tipo: "falta-tri", angulos, falta: i },
    };
  }
  const total = tipo === "recta" ? 180 : 90, x = total === 180 ? azar([paso(20, 80, 5, rnd), paso(100, 160, 5, rnd)], rnd) : paso(15, 75, 5, rnd);
  const fig = { x }, resp = total - x;
  return {
    tipo: "escribir", dib: { W: 200, H: 120, cuerpo: dibRecta(fig, 200, 120, total) }, sufijo: "°", respuesta: resp,
    texto: "¿Cuánto mide el ángulo que falta?",
    voz: total === 180 ? `Un ángulo mide ${x} grados. Juntos forman una línea recta. ¿Cuánto mide el que falta?` : `Un ángulo mide ${x} grados. Juntos forman un ángulo recto. ¿Cuánto mide el que falta?`,
    pista: total === 180 ? "Los dos juntos forman un **ángulo llano**: una línea recta, que mide **180°**." : "Los dos juntos forman un **ángulo recto**, que mide **90°**.",
    explica: total === 180 ? `Juntos forman un ángulo llano, de **180°**: 180 − ${x} = **${resp}°**.` : `Juntos forman un ángulo recto, de **90°**: 90 − ${x} = **${resp}°**.`,
    confusiones: [{ v: x, msg: "Ese es el ángulo que ya está marcado. ¿Cuánto le falta?" }, total === 90 ? { v: 180 - x, msg: "Aquí los dos juntos forman un ángulo **recto** (90°), no una línea recta." } : { v: 90 - x, msg: "Aquí los dos juntos forman una **línea recta** (180°)." }].filter(c => c.v > 0 && c.v !== resp),
    datos: { tipo: "falta-recta", total, x },
  };
}

// =================================================================
// 🧊 Caras, aristas y vértices
// =================================================================
const BASE_N = { 3: ["triangular", "triángulos", "un triángulo"], 4: ["rectangular", "rectángulos", "un cuadrado"], 5: ["pentagonal", "pentágonos", "un pentágono"], 6: ["hexagonal", "hexágonos", "un hexágono"] };
export function nombreCuerpo(cuerpo, n) {
  if (cuerpo === "cubo") return "cubo";
  return cuerpo === "prisma" ? `prisma ${BASE_N[n][0]}` : `pirámide ${n === 4 ? "cuadrangular" : BASE_N[n][0]}`;
}
export function cuentas(cuerpo, n) {
  if (cuerpo === "cubo") return { caras: 6, aristas: 12, vertices: 8 };
  return cuerpo === "prisma" ? { caras: n + 2, aristas: 3 * n, vertices: 2 * n } : { caras: n + 1, aristas: 2 * n, vertices: n + 1 };
}
function porQue(cuerpo, n, que) {
  const k = cuentas(cuerpo, n)[que];
  if (cuerpo === "cubo") return { caras: `**6 caras**, todas cuadrados iguales`, aristas: `**12 aristas**: 4 abajo, 4 arriba y 4 que suben`, vertices: `**8 vértices**: 4 abajo y 4 arriba` }[que];
  if (cuerpo === "prisma") return { caras: `**${k} caras**: 2 bases (${BASE_N[n][1]}) y ${n} rectángulos a los lados`, aristas: `**${k} aristas**: ${n} en la base de abajo, ${n} en la de arriba y ${n} que suben`, vertices: `**${k} vértices**: ${n} abajo y ${n} arriba` }[que];
  return { caras: `**${k} caras**: 1 base (${BASE_N[n][2]}) y ${n} triángulos que suben a la punta`, aristas: `**${k} aristas**: ${n} en la base y ${n} que suben a la punta`, vertices: `**${k} vértices**: ${n} en la base y 1 en la punta` }[que];
}
const QUE = { caras: ["caras", "las partes planas", "las"], aristas: ["aristas", "las rayas donde se juntan dos caras", "las"], vertices: ["vértices", "las puntas", "los"] };
function carasAristas(rnd) {
  const cuerpo = azar(["cubo", "prisma", "prisma", "piramide", "piramide"], rnd), n = cuerpo === "cubo" ? 4 : entero(3, 6, rnd);
  const fig = figCuerpo(cuerpo, rnd, cuerpo === "cubo" ? 0 : n), que = azar(Object.keys(QUE), rnd), k = cuentas(cuerpo, n), nom = nombreCuerpo(cuerpo, n);
  const art = cuerpo === "piramide" ? "la" : "el";
  const confusiones = Object.keys(QUE).filter(q => q !== que && k[q] !== k[que]).map(q => ({ v: k[q], msg: `Ese número es de ${QUE[q][2]} **${QUE[q][0]}** (${QUE[q][1]}). Ahora contá ${QUE[que][2]} ${QUE[que][0]}: ${QUE[que][1]}.` }));
  const dib = m => ({ W: 200, H: 150, cuerpo: dibCuerpo(fig, 200, 150, 14, m) });
  return {
    tipo: "escribir", dib: dib(), dibMarcado: dib(que === "caras" ? undefined : que), sufijo: QUE[que][0], respuesta: k[que],
    texto: `¿Cuánt${que === "vertices" ? "os" : "as"} **${QUE[que][0]}** tiene ${art} ${nom}?`,
    voz: `¿Cuánt${que === "vertices" ? "os" : "as"} ${QUE[que][0]} tiene ${art} ${nom}? Las rayitas de puntos son las que quedan atrás.`,
    pista: "Las **caras** son las partes planas; las **aristas**, las rayas donde se juntan dos caras; los **vértices**, las puntas. Las rayitas de puntos son las de atrás.",
    explica: `${may(art)} ${nom} tiene ${porQue(cuerpo, n, que)}.`,
    confusiones,
    datos: { tipo: "caras", fig, que, cuerpo, n },
  };
}

// =================================================================
// 🪜 Escalones: de reconocer figuras a contar caras, aristas y vértices
// =================================================================
export const ESCALONES = [
  { id: "figuras", nombre: "Las figuras", gen: rnd => tocarFigura(rnd, BASICAS, BASICAS) },                                          //  1. círculo, triángulo, cuadrado y rectángulo
  { id: "mas-figuras", nombre: "Más figuras", gen: rnd => (rnd() < 0.65 ? tocarFigura(rnd, OTRAS, [...BASICAS, ...OTRAS]) : nombrarFigura(rnd, [...BASICAS, ...OTRAS], [...BASICAS, ...OTRAS])) }, // 2. rombo, pentágono, hexágono, óvalo
  { id: "lados", nombre: "Lados y vértices", gen: ladosVertices },                                                                    //  3. contar
  { id: "lineas", nombre: "Líneas", gen: lineas },                                                                                     //  4. rectas, curvas, abiertas, cerradas
  { id: "cuerpos", nombre: "Cuerpos sólidos", gen: cuerposSolidos },                                                                   //  5. cubo, prisma, pirámide, cilindro, cono, esfera
  { id: "rectas", nombre: "Paralelas y perpendiculares", gen: rectas },                                                                //  6. y oblicuas
  { id: "angulos", nombre: "Ángulos", gen: rnd => nombrarAngulo(rnd, ["agudo", "recto", "obtuso"], false) },                           //  7. agudo, recto, obtuso
  { id: "angulos-llano", nombre: "Ángulos y el llano", gen: rnd => (rnd() < 0.5 ? nombrarAngulo(rnd, ["agudo", "recto", "obtuso", "llano"], true) : tocarAngulo(rnd)) }, // 8. más cerca de 90°
  { id: "eje", nombre: "Simetría: el eje", gen: eje },                                                                                 //  9. ¿es eje?, ¿dónde va?
  { id: "completar", nombre: "Simetría: la otra mitad", gen: completar },                                                              // 10. pintar el espejo
  { id: "tri-lados", nombre: "Triángulos por sus lados", gen: triLados },                                                              // 11. equilátero, isósceles, escaleno
  { id: "tri-angulos", nombre: "Triángulos por sus ángulos", gen: triAngulos },                                                        // 12. acutángulo, rectángulo, obtusángulo
  { id: "cuadrilateros", nombre: "Cuadriláteros", gen: cuadrilateros },                                                                // 13. cuadrado … trapezoide
  { id: "circunferencia", nombre: "La circunferencia", gen: circunferencia },                                                          // 14. centro, radio, diámetro, cuerda
  { id: "transportador", nombre: "Medir con el transportador", gen: transportador },                                                   // 15. de 10 en 10
  { id: "falta", nombre: "El ángulo que falta", gen: falta },                                                                          // 16. 180° y 90°
  { id: "caras", nombre: "Caras, aristas y vértices", gen: carasAristas },                                                             // 17. prismas y pirámides
];

/** Escalón para empezar según la edad (1.° grado ≈ 6–7 años). */
export const inicioPorEdad = edad => (edad === null || edad <= 6 ? 0 : edad === 7 ? 2 : edad === 8 ? 4 : edad === 9 ? 5 : edad === 10 ? 8 : edad === 11 ? 10 : 12);

/** Una ronda de un escalón (índice), con los dibujos ya armados. */
export function ronda(i, rnd = Math.random) {
  const q = { escalon: ESCALONES[i].id, ...ESCALONES[i].gen(rnd) };
  if (q.dib) q.svg = lienzo(q.dib.W, q.dib.H, q.dib.cuerpo);
  if (q.dibMarcado) q.svgMarcado = lienzo(q.dibMarcado.W, q.dibMarcado.H, q.dibMarcado.cuerpo);
  return q;
}

// =================================================================
// 📝 Para el examen: preguntas que sirven en papel (con su dibujo)
// =================================================================
const EXAMEN = [
  { g: [1, 2], f: rnd => nombrarFigura(rnd, [...BASICAS, ...OTRAS], [...BASICAS, ...OTRAS]) },
  { g: [1, 2, 3], f: ladosVertices },
  { g: [2, 3, 4], f: rnd => nombrarCuerpo(rnd) },
  { g: [3, 4], f: rnd => { for (;;) { const q = rectas(rnd); if (q.tipo === "opciones") return q; } } },
  { g: [3, 4, 5], f: rnd => nombrarAngulo(rnd, ["agudo", "recto", "obtuso", "llano"], true) },
  { g: [4, 5, 6], f: triLados }, { g: [4, 5, 6], f: triAngulos }, { g: [4, 5, 6], f: cuadrilateros },
  { g: [5, 6], f: rnd => { for (;;) { const q = circunferencia(rnd); if (q.tipo !== "tocar") return q; } } },
  { g: [5, 6], f: falta },
  { g: [5, 6], f: rnd => { for (;;) { const q = eje(rnd); if (q.tipo === "opciones") return q; } } },
  { g: [6], f: carasAristas },
];
function nombrarCuerpo(rnd) {
  const c = azar(Object.keys(CUERPOS), rnd), fig = figCuerpo(c, rnd), parecido = azar(PARECIDOS_C[c], rnd);
  const otros = [parecido, ...barajar(Object.keys(CUERPOS).filter(x => x !== c && x !== parecido), rnd)].slice(0, 2);
  const [art, nom] = CUERPOS[c];
  return {
    tipo: "opciones", dib: { W: 200, H: 140, cuerpo: dibCuerpo(fig, 200, 140, 14) },
    opciones: barajar([c, ...otros], rnd).map(v => ({ v, t: may(CUERPOS[v][1]) })), respuesta: c,
    texto: "¿Cómo se llama este cuerpo?", voz: "¿Cómo se llama este cuerpo?",
    pista: "", explica: `${esteEs(art)} ${art} **${nom}**: ${COMO_CUERPO[c]}.`, datos: { tipo: "cuerpo" },
  };
}
/** Una pregunta de geometría para «Preparate para el examen» (grado 1 a 6). Usa solo `r` como azar. */
export function preguntaExamen(r, g) {
  const q = azar(EXAMEN.filter(e => e.g.includes(g)), r).f(r);
  // El texto con su dibujo; los «<small>» de ayuda del juego también sirven en papel
  const texto = `${htmlDe(q.texto)}${q.dib ? lienzo(q.dib.W, q.dib.H, q.dib.cuerpo, 190) : ""}`;
  const explica = marcado(q.explica);
  if (q.tipo === "escribir") return { texto: texto + (q.sufijo === "°" ? " <small>(en grados)</small>" : q.sufijo === "cm" ? " <small>(en cm)</small>" : ""), tipo: "numero", correcta: String(q.respuesta), explica };
  const correcta = q.opciones.find(o => String(o.v) === String(q.respuesta)).t;
  return { texto, tipo: "opcion", opciones: q.opciones.map(o => o.t), correcta, explica };
}

// =================================================================
// ✅ Revisión: que cada dibujo cumpla lo que se pregunta
// =================================================================
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const GRAMATICA = /\b(el|un|este|ese|del|al) (pirámide|esfera|circunferencia|cuerda|línea)\b|\b(la|una|esta|esa) (cubo|prisma|cilindro|cono|círculo|triángulo|cuadrado|rectángulo|rombo|pentágono|hexágono|óvalo|radio|diámetro|ángulo)\b|\b1 (lados|vértices|caras|aristas|grados|centímetros)\b|\b(undefined|NaN|null)\b|¿Cuántas \*\*vértices|¿Cuántos \*\*(caras|aristas)|\blos (\*\*)?(aristas|caras)\b|\blas (\*\*)?vértices\b|: [^:.]*: [^.]*: /i;

/** Revisa que una ronda esté bien armada. Devuelve la lista de problemas (vacía = bien). */
export function revisarRonda(q) {
  const mal = [], d = q.datos || {};
  for (const t of [q.texto, q.voz, q.pista, q.explica, ...(q.confusiones || []).map(c => c.msg)]) {
    if (t === undefined) continue;
    if (typeof t !== "string") { mal.push("texto que no es texto"); continue; }
    if (GRAMATICA.test(t)) mal.push(`gramática o dato raro: «${t}»`);
    if (t.split("**").length % 2 === 0) mal.push(`negrita sin cerrar: «${t}»`);
  }
  if (!q.texto || !q.voz || !q.explica) mal.push("falta texto, voz o explicación");
  if (/[*<>]/.test(q.voz)) mal.push(`la voz tiene marcas: «${q.voz}»`);
  for (const svg of [q.svg, q.svgMarcado, ...(q.items || []).map(i => i.svg)]) if (svg && /NaN|undefined|Infinity/.test(svg)) mal.push("dibujo con NaN");
  if (q.tipo === "tocar") {
    const vs = q.items.map(i => String(i.v));
    if (new Set(vs).size !== vs.length) mal.push("dibujos repetidos");
    if (vs.filter(v => v === String(q.respuesta)).length !== 1) mal.push("la respuesta no está una vez entre los dibujos");
    if (q.items.length < 2 || q.items.length > 4) mal.push(`${q.items.length} dibujos`);
  }
  if (q.tipo === "opciones") {
    const vs = q.opciones.map(o => String(o.v)), ts = q.opciones.map(o => o.t);
    if (new Set(vs).size !== vs.length || new Set(ts).size !== ts.length) mal.push("opciones repetidas");
    if (!vs.includes(String(q.respuesta))) mal.push("la respuesta no está en las opciones");
    if (q.opciones.length < 2 || q.opciones.length > 4) mal.push(`${q.opciones.length} opciones`);
  }
  if (q.tipo === "escribir") {
    if (!Number.isInteger(q.respuesta) || q.respuesta <= 0) mal.push(`respuesta rara: ${q.respuesta}`);
    for (const c of q.confusiones || []) if (c.v === q.respuesta) mal.push(`una confusión da la respuesta (${c.v})`);
  }
  switch (d.tipo) {
    case "figura":
      if (q.items) for (const it of q.items) { if (formaDe(it.fig) !== it.v) mal.push(`el dibujo de ${it.v} parece ${formaDe(it.fig)}`); }
      else if (formaDe(d.fig) !== q.respuesta) mal.push(`la figura ${q.respuesta} parece ${formaDe(d.fig)}`);
      break;
    case "lados": if (d.fig.pts.length !== q.respuesta || formaDe(d.fig) === "?") mal.push("lados mal contados"); break;
    case "lineas": if (q.items.filter(i => cumpleLinea(d.pide, i.v)).length !== 1) mal.push("más de una línea sirve"); break;
    case "rueda": if (q.items.filter(i => RUEDA[i.v]).length !== 1) mal.push("ruedan varios"); break;
    case "objeto": if (q.respuesta !== d.objeto) mal.push("objeto mal"); break;
    case "rectas": {
      const clase = f => { const dif = ((f.b - f.a) % 180 + 180) % 180; return dif === 0 ? "paralelas" : dif === 90 ? "perpendiculares" : dif >= 25 && dif <= 155 && Math.abs(dif - 90) >= 25 ? "oblicuas" : "?"; };
      const figs = d.items ? d.items.map(i => [i.v, i.fig]) : [[q.respuesta, d.fig]];
      for (const [v, f] of figs) {
        if (clase(f) !== v) mal.push(`las rectas ${v} parecen ${clase(f)}`);
        const W = d.items ? 100 : 200, H = d.items ? 100 : 130, { L1, L2 } = puntosRectas(f, W, H);
        if (dist(...L1) < Math.min(W, H) * 0.6 || dist(...L2) < Math.min(W, H) * 0.6) mal.push("recta muy corta");
      }
      break;
    }
    case "angulo": case "angulos": {
      const figs = d.items ? d.items.map(i => [i.v, i.fig]) : [[q.respuesta, d.fig]];
      for (const [v, f] of figs) {
        const [V, A, B] = puntosAngulo(f, 50), medido = anguloEn(V, A, B);
        if (Math.abs(medido - f.grados) > 0.01 || claseAngulo(f.grados) !== v) mal.push(`el ángulo ${v} mide ${f1(medido)}°`);
        if ((v === "agudo" && f.grados > 75) || (v === "obtuso" && f.grados < 105)) mal.push(`ángulo ${v} muy cerca de 90° (${f.grados}°)`);
      }
      break;
    }
    case "transportador": {
      const g = d.fig.grados;
      if (g % 10 || g < 10 || g > 170 || q.respuesta !== g) mal.push(`transportador raro: ${g}`);
      break;
    }
    case "eje": {
      if (esSimetrica(d.celdas, d.eje) !== (q.respuesta === "si")) mal.push("el eje no es lo que dice la respuesta");
      if (d.celdas.some(([x, y]) => x < 0 || y < 0 || x >= d.W || y >= d.H)) mal.push("cuadritos fuera de la cuadrícula");
      if (d.celdas.length < 6) mal.push("figura muy chiquita");
      break;
    }
    case "eje-tocar": {
      const buenos = q.items.filter(i => esSimetrica(d.f.celdas, i.eje));
      if (buenos.length !== 1 || buenos[0].v !== q.respuesta) mal.push("más de un eje sirve (o ninguno)");
      break;
    }
    case "completar": {
      const c = q.cuadricula, dentro = ([x, y]) => x >= 0 && y >= 0 && x < c.W && y < c.H;
      const mitad1 = ([x, y]) => (c.dir === "v" ? x < c.pos : y < c.pos);
      if (!c.dados.every(p => dentro(p) && mitad1(p)) || !c.falta.every(p => dentro(p) && !mitad1(p))) mal.push("cuadritos en la mitad equivocada");
      if (!esSimetrica([...c.dados, ...c.falta], { dir: c.dir, pos: c.pos })) mal.push("la solución no es simétrica");
      if (new Set(c.falta.map(clave)).size !== c.dados.length) mal.push("faltan repetidos");
      break;
    }
    case "tri-lados": {
      const P = puntosTri(d.fig), L = P.map((p, i) => dist(p, P[(i + 1) % 3]));
      if (L.some((l, i) => Math.abs(l / L[0] - d.fig.lados[i] / d.fig.lados[0]) > 1e-6)) mal.push("el dibujo no tiene las medidas que dice");
      if (claseLados(d.fig.lados) !== q.respuesta) mal.push("triángulo por lados mal clasificado");
      if (Math.min(...angulosTri(P)) < 24) mal.push("triángulo muy aplastado");
      break;
    }
    case "tri-angulos": case "falta-tri": {
      const A = angulosTri(puntosTri(d.fig || { angulos: d.angulos, giro: 0 }));
      const angs = (d.fig || d).angulos;
      if (A.some((a, i) => Math.abs(a - angs[i]) > 0.01)) mal.push("los ángulos dibujados no son los que dice");
      if (angs.reduce((s, a) => s + a, 0) !== 180) mal.push("los ángulos no suman 180°");
      if (d.tipo === "tri-angulos" && claseAngulos(angs) !== q.respuesta) mal.push("triángulo por ángulos mal clasificado");
      if (d.tipo === "falta-tri" && angs[d.falta] !== q.respuesta) mal.push("el ángulo que falta no cuadra");
      if (Math.min(...angs) < 20) mal.push("ángulo muy chiquito");
      break;
    }
    case "cuadrilatero": {
      if (claseCuadrilatero(d.fig.pts) !== q.respuesta) mal.push(`el ${q.respuesta} parece ${claseCuadrilatero(d.fig.pts)}`);
      if (!convexo(d.fig.pts)) mal.push("cuadrilátero que no es convexo");
      break;
    }
    case "partes": {
      const c = [0, 0], R = 1, [a, b] = puntosParte(d.fig, c, R), sobre = p => Math.abs(dist(p, c) - R) < 1e-9;
      const dCentro = Math.abs((b[0] - a[0]) * (a[1] - c[1]) - (a[0] - c[0]) * (b[1] - a[1])) / dist(a, b);
      const ok = q.respuesta === "radio" ? dist(a, c) < 1e-9 && sobre(b) : q.respuesta === "diametro" ? sobre(a) && sobre(b) && dCentro < 1e-9 : sobre(a) && sobre(b) && dCentro > 0.55;
      if (!ok) mal.push(`la raya no es un ${q.respuesta}`);
      break;
    }
    case "centro": if (q.items.filter(i => i.d < 0.2).length !== 1) mal.push("varios puntos en el centro"); break;
    case "medida": if ((d.da === "radio" ? 2 * d.v : d.v / 2) !== q.respuesta) mal.push("radio y diámetro no cuadran"); break;
    case "falta-recta": if (d.total - d.x !== q.respuesta || d.x === 90) mal.push("el ángulo que falta no cuadra"); break;
    case "caras": {
      const P = d.fig.P, k = cuentas(d.cuerpo, d.n), real = { caras: P.caras.length, aristas: P.aristas.length, vertices: P.V.length };
      if (real.caras + real.vertices - real.aristas !== 2) mal.push("no cumple Euler");
      if (Object.keys(k).some(x => k[x] !== real[x]) || q.respuesta !== real[d.que]) mal.push(`cuentas mal en ${d.cuerpo} ${d.n}`);
      if (P.aristas.some(e => e.caras.length !== 2)) mal.push("arista con más o menos de dos caras");
      if (!P.caras.some(c => c.visible)) mal.push("no se ve ninguna cara");
      break;
    }
  }
  return mal;
}

/** Corre muchas rondas de cada escalón y preguntas de examen de cada grado. Devuelve los problemas (vacío = todo bien). */
export function revisarGeometria(n = 2000, semilla = 7) {
  const rnd = mulberry32(semilla), mal = new Set();
  ESCALONES.forEach((e, i) => {
    for (let k = 0; k < n; k++) for (const m of revisarRonda(ronda(i, rnd))) mal.add(`${e.id}: ${m}`);
  });
  for (let g = 1; g <= 6; g++) for (let k = 0; k < n / 2; k++) {
    const q = preguntaExamen(rnd, g);
    if (!q.texto || !q.explica || /NaN|undefined/.test(q.texto + q.explica)) mal.add(`examen ${g}: texto raro`);
    if (q.tipo === "opcion" && (!q.opciones.includes(q.correcta) || new Set(q.opciones).size !== q.opciones.length)) mal.add(`examen ${g}: opciones mal`);
    if (q.tipo === "numero" && !/^\d+$/.test(q.correcta)) mal.add(`examen ${g}: respuesta rara ${q.correcta}`);
  }
  return [...mal].slice(0, 40);
}
