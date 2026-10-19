// ✍️ Trazos de cada letra y número, en el orden y la dirección en que se enseñan en primer grado
// (letra script). La pizarra dibuja la letra punteada a partir de estos trazos, y con ellos salen
// el puntito de inicio, los números de cada trazo, la tolerancia y la demostración del dedito 👆.
//
// Coordenadas normalizadas de 0 a 1 (x a la derecha, y hacia abajo):
//   mayúsculas y números van de y = 0,1 (arriba) a y = 0,9 (renglón);
//   minúsculas: el cuerpo va de 0,45 a 0,9, lo que sube (l, t, d) llega a 0,1 y la p baja hasta 1.
// Cada carácter es una lista de trazos (se levanta el lápiz entre uno y otro); cada trazo, una lista de
// pedazos que se siguen sin levantar el lápiz.

export const RENGLON = 0.9;

// Pedazos de un trazo. Ángulos en grados, como se ven en pantalla (y hacia abajo):
// 0 = derecha, 90 = abajo, -90 = arriba. Si a1 < a0, el arco gira en contra del reloj.
const linea = (x1, y1, x2, y2) => ({ t: "l", a: [x1, y1], b: [x2, y2] });
const arco = (cx, cy, rx, ry, a0, a1) => ({ t: "a", cx, cy, rx, ry, a0, a1 });
const curva = (x0, y0, cx, cy, x1, y1) => ({ t: "q", a: [x0, y0], c: [cx, cy], b: [x1, y1] });
const punto = (x, y) => ({ t: "p", a: [x, y] });

const rad = g => (g * Math.PI) / 180;
const enArco = (s, g) => [s.cx + s.rx * Math.cos(rad(g)), s.cy + s.ry * Math.sin(rad(g))];

const DEF = {
  // Mayúsculas: la A baja por cada lado desde la punta y después la rayita, de izquierda a derecha
  A: [[linea(0.5, 0.1, 0.15, 0.9)], [linea(0.5, 0.1, 0.85, 0.9)], [linea(0.29, 0.6, 0.71, 0.6)]],
  E: [[linea(0.28, 0.1, 0.28, 0.9)], [linea(0.28, 0.1, 0.74, 0.1)], [linea(0.28, 0.5, 0.66, 0.5)], [linea(0.28, 0.9, 0.74, 0.9)]],
  I: [[linea(0.5, 0.1, 0.5, 0.9)]],
  O: [[arco(0.5, 0.5, 0.34, 0.4, -90, -450)]],                                              // desde arriba, en contra del reloj
  U: [[linea(0.2, 0.1, 0.2, 0.58), arco(0.5, 0.58, 0.3, 0.32, 180, 0), linea(0.8, 0.58, 0.8, 0.1)]],
  // Minúsculas
  a: [[arco(0.46, 0.675, 0.22, 0.225, -30, -390)], [linea(0.68, 0.45, 0.68, 0.9)]],      // la bolita desde arriba a la derecha, y el palito
  e: [[linea(0.25, 0.675, 0.71, 0.675), arco(0.48, 0.675, 0.23, 0.225, 0, -320)]],       // la rayita y la vuelta en contra del reloj
  i: [[linea(0.5, 0.45, 0.5, 0.9)], [punto(0.5, 0.28)]],                                  // primero el palito, después el punto
  o: [[arco(0.5, 0.675, 0.22, 0.225, -90, -450)]],
  u: [[linea(0.28, 0.45, 0.28, 0.72), arco(0.48, 0.72, 0.2, 0.18, 180, 0), linea(0.68, 0.72, 0.68, 0.45)], [linea(0.68, 0.45, 0.68, 0.9)]],
  // Números
  0: [[arco(0.5, 0.5, 0.3, 0.4, -90, -450)]],
  1: [[linea(0.32, 0.3, 0.56, 0.1), linea(0.56, 0.1, 0.56, 0.9)]],                       // la banderita y baja
  2: [[arco(0.5, 0.33, 0.25, 0.23, -160, 30), linea(0.7165, 0.445, 0.24, 0.9), linea(0.24, 0.9, 0.78, 0.9)]],
  3: [[arco(0.5, 0.3, 0.24, 0.2, -150, 90), arco(0.5, 0.7, 0.27, 0.2, -90, 150)]],      // dos barriguitas
  4: [[linea(0.58, 0.1, 0.18, 0.64), linea(0.18, 0.64, 0.84, 0.64)], [linea(0.66, 0.1, 0.66, 0.9)]],
  5: [[linea(0.3, 0.1, 0.3, 0.49), arco(0.49, 0.66, 0.27, 0.24, -135, 150)], [linea(0.3, 0.1, 0.76, 0.1)]], // baja, barriguita y el sombrero
  6: [[curva(0.7, 0.12, 0.28, 0.22, 0.25, 0.66), arco(0.5, 0.66, 0.25, 0.24, 180, -180)]],
  7: [[linea(0.22, 0.1, 0.78, 0.1), linea(0.78, 0.1, 0.4, 0.9)]],
  8: [[arco(0.5, 0.3, 0.2, 0.2, -90, -270), arco(0.5, 0.7, 0.24, 0.2, -90, 270), arco(0.5, 0.3, 0.2, 0.2, 90, -90)]],
  9: [[arco(0.48, 0.32, 0.24, 0.22, 0, -360), linea(0.72, 0.32, 0.68, 0.9)]],
  // Consonantes
  // la m y la n: baja, sube por el mismo camino y hace los puentes, sin levantar el lápiz
  m: [[linea(0.15, 0.45, 0.15, 0.9), linea(0.15, 0.9, 0.15, 0.6), arco(0.315, 0.6, 0.165, 0.14, 180, 360),
    linea(0.48, 0.6, 0.48, 0.9), linea(0.48, 0.9, 0.48, 0.6), arco(0.645, 0.6, 0.165, 0.14, 180, 360), linea(0.81, 0.6, 0.81, 0.9)]],
  n: [[linea(0.25, 0.45, 0.25, 0.9), linea(0.25, 0.9, 0.25, 0.62), arco(0.47, 0.62, 0.22, 0.16, 180, 360), linea(0.69, 0.62, 0.69, 0.9)]],
  p: [[linea(0.28, 0.45, 0.28, 1)], [arco(0.5, 0.675, 0.22, 0.225, -150, 150)]],         // el palito largo y la barriguita
  s: [[arco(0.5, 0.565, 0.18, 0.115, -25, -270), arco(0.5, 0.79, 0.2, 0.11, -90, 155)]],
  l: [[linea(0.5, 0.1, 0.5, 0.9)]],
  t: [[linea(0.45, 0.15, 0.45, 0.8), arco(0.57, 0.8, 0.12, 0.1, 180, 60)], [linea(0.25, 0.45, 0.7, 0.45)]], // el palo y después la cruz
  d: [[arco(0.44, 0.675, 0.22, 0.225, -30, -390)], [linea(0.66, 0.1, 0.66, 0.9)]],
  // El resto de las minúsculas. Las de palito alto bajan primero el palito y después la barriguita o el puente
  b: [[linea(0.28, 0.1, 0.28, 0.9)], [arco(0.5, 0.675, 0.22, 0.225, -150, 150)]],         // la b: palito y barriguita (al revés de la d)
  c: [[arco(0.52, 0.675, 0.22, 0.225, -40, -320)]],                                       // desde arriba a la derecha, en contra del reloj
  f: [[arco(0.56, 0.23, 0.14, 0.12, -30, -180), linea(0.42, 0.23, 0.42, 0.9)], [linea(0.24, 0.45, 0.64, 0.45)]], // el bastón y la cruz
  g: [[arco(0.46, 0.675, 0.22, 0.225, -30, -390)], [linea(0.68, 0.45, 0.68, 0.93), arco(0.53, 0.93, 0.15, 0.07, 0, 180)]], // bolita y colita
  h: [[linea(0.28, 0.1, 0.28, 0.9), linea(0.28, 0.9, 0.28, 0.62), arco(0.5, 0.62, 0.22, 0.16, 180, 360), linea(0.72, 0.62, 0.72, 0.9)]],
  j: [[linea(0.58, 0.45, 0.58, 0.93), arco(0.43, 0.93, 0.15, 0.07, 0, 180)], [punto(0.58, 0.28)]], // la colita y al final el punto
  k: [[linea(0.3, 0.1, 0.3, 0.9)], [linea(0.7, 0.45, 0.3, 0.7), linea(0.3, 0.7, 0.72, 0.9)]],
  ñ: [[linea(0.25, 0.45, 0.25, 0.9), linea(0.25, 0.9, 0.25, 0.62), arco(0.47, 0.62, 0.22, 0.16, 180, 360), linea(0.69, 0.62, 0.69, 0.9)],
    [curva(0.27, 0.36, 0.37, 0.24, 0.47, 0.31), curva(0.47, 0.31, 0.57, 0.38, 0.67, 0.26)]],                  // la n y la virgulilla
  q: [[arco(0.46, 0.675, 0.22, 0.225, -30, -390)], [linea(0.68, 0.45, 0.68, 1)]],
  r: [[linea(0.32, 0.45, 0.32, 0.9), linea(0.32, 0.9, 0.32, 0.62), arco(0.5, 0.62, 0.18, 0.14, 180, 300)]],
  v: [[linea(0.2, 0.45, 0.5, 0.9), linea(0.5, 0.9, 0.8, 0.45)]],
  w: [[linea(0.12, 0.45, 0.3, 0.9), linea(0.3, 0.9, 0.5, 0.6), linea(0.5, 0.6, 0.7, 0.9), linea(0.7, 0.9, 0.88, 0.45)]],
  x: [[linea(0.25, 0.45, 0.75, 0.9)], [linea(0.75, 0.45, 0.25, 0.9)]],
  y: [[linea(0.22, 0.45, 0.5, 0.75)], [linea(0.78, 0.45, 0.36, 1)]],
  z: [[linea(0.24, 0.45, 0.76, 0.45), linea(0.76, 0.45, 0.24, 0.9), linea(0.24, 0.9, 0.78, 0.9)]],
  // Mayúsculas de las consonantes (todos los trazos empiezan arriba)
  B: [[linea(0.28, 0.1, 0.28, 0.9)], [linea(0.28, 0.1, 0.5, 0.1), arco(0.5, 0.295, 0.2, 0.195, -90, 90), linea(0.5, 0.49, 0.28, 0.49)],
    [linea(0.28, 0.49, 0.53, 0.49), arco(0.53, 0.695, 0.22, 0.205, -90, 90), linea(0.53, 0.9, 0.28, 0.9)]],
  C: [[arco(0.54, 0.5, 0.34, 0.4, -40, -320)]],
  D: [[linea(0.28, 0.1, 0.28, 0.9)], [linea(0.28, 0.1, 0.42, 0.1), arco(0.42, 0.5, 0.36, 0.4, -90, 90), linea(0.42, 0.9, 0.28, 0.9)]],
  F: [[linea(0.3, 0.1, 0.3, 0.9)], [linea(0.3, 0.1, 0.76, 0.1)], [linea(0.3, 0.5, 0.66, 0.5)]],
  G: [[arco(0.52, 0.5, 0.34, 0.4, -40, -360), linea(0.86, 0.5, 0.6, 0.5)]],
  H: [[linea(0.24, 0.1, 0.24, 0.9)], [linea(0.76, 0.1, 0.76, 0.9)], [linea(0.24, 0.5, 0.76, 0.5)]],
  J: [[linea(0.62, 0.1, 0.62, 0.68), arco(0.44, 0.68, 0.18, 0.22, 0, 180)]],
  K: [[linea(0.28, 0.1, 0.28, 0.9)], [linea(0.76, 0.1, 0.28, 0.55), linea(0.28, 0.55, 0.78, 0.9)]],
  L: [[linea(0.3, 0.1, 0.3, 0.9), linea(0.3, 0.9, 0.76, 0.9)]],
  M: [[linea(0.16, 0.1, 0.16, 0.9)], [linea(0.16, 0.1, 0.5, 0.62), linea(0.5, 0.62, 0.84, 0.1), linea(0.84, 0.1, 0.84, 0.9)]],
  N: [[linea(0.22, 0.1, 0.22, 0.9)], [linea(0.22, 0.1, 0.78, 0.9)], [linea(0.78, 0.1, 0.78, 0.9)]],
  P: [[linea(0.3, 0.1, 0.3, 0.9)], [linea(0.3, 0.1, 0.52, 0.1), arco(0.52, 0.31, 0.22, 0.21, -90, 90), linea(0.52, 0.52, 0.3, 0.52)]],
  Q: [[arco(0.5, 0.5, 0.34, 0.4, -90, -450)], [linea(0.58, 0.7, 0.84, 0.95)]],
  R: [[linea(0.3, 0.1, 0.3, 0.9)], [linea(0.3, 0.1, 0.52, 0.1), arco(0.52, 0.31, 0.22, 0.21, -90, 90), linea(0.52, 0.52, 0.3, 0.52), linea(0.3, 0.52, 0.78, 0.9)]],
  S: [[arco(0.5, 0.3, 0.25, 0.2, -25, -270), arco(0.5, 0.7, 0.28, 0.2, -90, 155)]],
  T: [[linea(0.2, 0.1, 0.8, 0.1)], [linea(0.5, 0.1, 0.5, 0.9)]],                            // el techo y después el palo
  V: [[linea(0.16, 0.1, 0.5, 0.9), linea(0.5, 0.9, 0.84, 0.1)]],
  W: [[linea(0.08, 0.1, 0.28, 0.9), linea(0.28, 0.9, 0.5, 0.35), linea(0.5, 0.35, 0.72, 0.9), linea(0.72, 0.9, 0.92, 0.1)]],
  X: [[linea(0.2, 0.1, 0.8, 0.9)], [linea(0.8, 0.1, 0.2, 0.9)]],
  Y: [[linea(0.18, 0.1, 0.5, 0.5)], [linea(0.82, 0.1, 0.5, 0.5), linea(0.5, 0.5, 0.5, 0.9)]],
  Z: [[linea(0.2, 0.1, 0.8, 0.1), linea(0.8, 0.1, 0.2, 0.9), linea(0.2, 0.9, 0.8, 0.9)]],
};

// ´ La tilde es un trazo más, al final: una rayita de arriba a la derecha hacia abajo a la izquierda
const tilde = cx => linea(cx + 0.06, 0.24, cx - 0.05, 0.37);
const tildeMay = cx => linea(cx + 0.07, 0.03, cx - 0.06, 0.17);
// Las mayúsculas con tilde, virgulilla o diéresis se achican un poquito para que quepa la marca arriba
const ACHICA = 0.82;
const yAchicada = y => RENGLON - (RENGLON - y) * ACHICA;
function achicar(trazos) {
  return trazos.map(t => t.map(s => {
    if (s.t === "a") return { ...s, cy: yAchicada(s.cy), ry: s.ry * ACHICA };
    const r = { ...s, a: [s.a[0], yAchicada(s.a[1])] };
    if (s.b) r.b = [s.b[0], yAchicada(s.b[1])];
    if (s.c) r.c = [s.c[0], yAchicada(s.c[1])];
    return r;
  }));
}
Object.assign(DEF, {
  á: [...DEF.a, [tilde(0.52)]],
  é: [...DEF.e, [tilde(0.48)]],
  í: [DEF.i[0], [tilde(0.51)]],                                                           // la í lleva tilde en vez de punto
  ó: [...DEF.o, [tilde(0.51)]],
  ú: [...DEF.u, [tilde(0.49)]],
  ü: [...DEF.u, [punto(0.38, 0.3)], [punto(0.6, 0.3)]],                                   // pingüino, Güisel
  Á: [...achicar(DEF.A), [tildeMay(0.5)]],
  É: [...achicar(DEF.E), [tildeMay(0.5)]],
  Í: [...achicar(DEF.I), [tildeMay(0.51)]],
  Ó: [...achicar(DEF.O), [tildeMay(0.5)]],
  Ú: [...achicar(DEF.U), [tildeMay(0.5)]],
  Ü: [...achicar(DEF.U), [punto(0.38, 0.12)], [punto(0.62, 0.12)]],
  Ñ: [...achicar(DEF.N), [curva(0.3, 0.15, 0.4, 0.03, 0.5, 0.1), curva(0.5, 0.1, 0.6, 0.17, 0.7, 0.05)]],
});

/** Los caracteres que usa el juego (para revisar que todos tengan trazos). */
export const CARACTERES = Array.from("AaEeIiOoUu0123456789mpsltnd" + "bcfghjkñqrvwxyz" + "áéíóúü" + "BCDFGHJKLMNÑPQRSTVWXYZ" + "ÁÉÍÓÚÜ");

/** ¿Hay trazos para este carácter? */
export const tieneTrazos = ch => Object.prototype.hasOwnProperty.call(DEF, ch);

const PASO = 0.008; // separación entre puntos de un trazo (en unidades de 0 a 1)

function muestrear(s) {
  if (s.t === "p") return [s.a];
  if (s.t === "l") {
    const n = Math.max(1, Math.ceil(Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]) / PASO));
    return Array.from({ length: n + 1 }, (_, i) => [s.a[0] + ((s.b[0] - s.a[0]) * i) / n, s.a[1] + ((s.b[1] - s.a[1]) * i) / n]);
  }
  if (s.t === "q") {
    const n = 60;
    return Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n, u = 1 - t;
      return [u * u * s.a[0] + 2 * u * t * s.c[0] + t * t * s.b[0], u * u * s.a[1] + 2 * u * t * s.c[1] + t * t * s.b[1]];
    });
  }
  const largo = (Math.abs(s.a1 - s.a0) / 360) * Math.PI * (s.rx + s.ry);
  const n = Math.max(8, Math.ceil(largo / PASO));
  return Array.from({ length: n + 1 }, (_, i) => enArco(s, s.a0 + ((s.a1 - s.a0) * i) / n));
}

/** Vuelve a repartir los puntos a la misma distancia, para que el dedito avance parejo. */
function parejo(pts) {
  if (pts.length < 2) return pts;
  const out = [pts[0]];
  let falta = PASO;
  for (let i = 1; i < pts.length; i++) {
    let [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    let d = Math.hypot(x1 - x0, y1 - y0);
    while (d >= falta) {
      const k = falta / d;
      x0 += (x1 - x0) * k; y0 += (y1 - y0) * k;
      out.push([x0, y0]);
      d -= falta; falta = PASO;
    }
    falta -= d;
  }
  const u = pts[pts.length - 1], v = out[out.length - 1];
  if (Math.hypot(u[0] - v[0], u[1] - v[1]) > 1e-6) out.push(u);
  return out;
}

const cache = new Map();
/**
 * Los trazos de un carácter, en orden: [[ [x, y], … ], …] en coordenadas de 0 a 1.
 * Un trazo de un solo punto es un punto (como el de la i).
 */
export function trazosDe(ch) {
  if (!tieneTrazos(ch)) return [];
  if (!cache.has(ch)) {
    cache.set(ch, DEF[ch].map(pedazos => {
      const pts = [];
      pedazos.forEach(s => muestrear(s).forEach((p, i) => { if (!(i === 0 && pts.length)) pts.push(p); }));
      return pts.length === 1 ? pts : parejo(pts);
    }));
  }
  return cache.get(ch).map(t => t.map(p => [...p]));
}

/** Rectángulo que ocupa el carácter: { x0, y0, x1, y1 }. */
export function caja(ch) {
  const pts = trazosDe(ch).flat();
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

/** Revisa los datos (para node). Devuelve una lista de problemas (vacía = bien). */
export function revisarTrazos(chars = CARACTERES) {
  const mal = [];
  for (const ch of chars) {
    const ts = trazosDe(ch);
    if (!ts.length) { mal.push(`«${ch}» no tiene trazos`); continue; }
    ts.forEach((t, k) => {
      if (!t.length) mal.push(`«${ch}» trazo ${k + 1} vacío`);
      if (t.some(([x, y]) => !(x >= 0 && x <= 1 && y >= 0 && y <= 1))) mal.push(`«${ch}» trazo ${k + 1} se sale de 0 a 1`);
      // Los pedazos de un trazo tienen que empatar (si no, el dedito daría un brinco)
      for (let i = 1; i < t.length; i++) {
        if (Math.hypot(t[i][0] - t[i - 1][0], t[i][1] - t[i - 1][1]) > 0.03) { mal.push(`«${ch}» trazo ${k + 1} brinca en el punto ${i}`); break; }
      }
      if (t.length > 1) {
        let largo = 0;
        for (let i = 1; i < t.length; i++) largo += Math.hypot(t[i][0] - t[i - 1][0], t[i][1] - t[i - 1][1]);
        if (largo < 0.05) mal.push(`«${ch}» trazo ${k + 1} es muy cortito`);
      }
    });
    const c = caja(ch);
    if (c.y1 < RENGLON - 0.02) mal.push(`«${ch}» no llega al renglón`);
  }
  // Las de una sola vuelta empiezan arriba (la o, la O y el 0) y giran en contra del reloj
  for (const ch of ["o", "O", "0"]) {
    const [t] = trazosDe(ch), [x0, y0] = t[0], c = caja(ch);
    if (Math.abs(y0 - c.y0) > 0.01) mal.push(`«${ch}» no empieza arriba`);
    if (!(t[5][0] < x0)) mal.push(`«${ch}» no gira en contra del reloj`);
  }
  // La i empieza por el palito (no por el punto)
  const i = trazosDe("i");
  if (!(i[0].length > 1 && i[1].length === 1)) mal.push("la «i» tiene que empezar por el palito y terminar con el punto");
  // Las marcas de arriba (puntos, tildes, virgulilla, diéresis) van de últimas, y la letra empieza por arriba
  for (const ch of chars) {
    const ts = trazosDe(ch);
    if (!ts.length) continue;
    const ys = t => t.map(p => p[1]);
    // marca = un trazo que queda todo por encima del primero (el primero siempre es la letra)
    const marca = ts.map((t, k) => k > 0 && Math.max(...ys(t)) < Math.min(...ys(ts[0])) - 0.02);
    if (ts.length > 1 && Math.max(...ys(ts[0])) < Math.min(...ts.slice(1).flatMap(ys)) - 0.02) mal.push(`«${ch}» empieza por la marca de arriba`);
    const primera = marca.indexOf(true);
    if (primera >= 0 && marca.slice(primera).some(m => !m)) mal.push(`«${ch}»: la marca de arriba tiene que ir al final`);
    if (CON_MARCA.includes(ch) && primera < 0) mal.push(`«${ch}» no tiene su marca arriba`);
    if (!CON_MARCA.includes(ch) && primera >= 0) mal.push(`«${ch}» tiene una marca que no debería`);
    const cuerpo = ts.filter((_, k) => !marca[k]).flat(), y0 = Math.min(...cuerpo.map(p => p[1])), y1 = Math.max(...cuerpo.map(p => p[1]));
    if (ts[0][0][1] > y0 + (y1 - y0) * 0.6) mal.push(`«${ch}» empieza muy abajo`);
    // la tilde baja de derecha a izquierda
    if (TILDES.includes(ch)) {
      const t = ts[ts.length - 1], [a, b] = [t[0], t[t.length - 1]];
      if (!(a[1] < b[1] && a[0] > b[0])) mal.push(`«${ch}»: la tilde va de arriba a la derecha hacia abajo a la izquierda`);
    }
  }
  return mal;
}

const TILDES = "áéíóúÁÉÍÓÚ";
const CON_MARCA = TILDES + "ijüÜñÑ";
