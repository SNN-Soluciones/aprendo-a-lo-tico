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
};

/** Los caracteres que usa el juego (para revisar que todos tengan trazos). */
export const CARACTERES = "AaEeIiOoUu0123456789mpsltnd".split("");

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
  if (!DEF[ch]) return [];
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
  return mal;
}
