// 🦜 Lógica de "La lapa que dibuja" (sin Blockly ni pantalla, para poder probarla sola).
//
// La lapa camina sobre un papel de 400 × 400 y deja una raya por donde pasa (como la tortuga de Logo).
// Rumbo en grados: 0 = arriba, 90 = derecha, 180 = abajo, 270 = izquierda. Girar a la derecha suma.
//
// Programa (lo arma el juego a partir de los bloques):
//   { t: "avanzar", n }   { t: "girar", dir: "der" | "izq", g }   { t: "color", c }
//   { t: "lapiz", abajo: true | false }   { t: "grosor", n }   { t: "repetir", n, cuerpo: [] }
// Cada bloque puede traer `id` (el del bloque de Blockly) para iluminarlo mientras corre.

export const TAM = 400;
export const MAX_PASOS = 5000;

export const COLORES = {
  rojo: "#E53935", azul: "#1E6FD9", amarillo: "#F2B800", verde: "#2FA85A",
  anaranjado: "#F57C00", morado: "#8E5BD9", rosado: "#EC6FA5", cafe: "#795548", negro: "#1F2A36",
};

const av = n => ({ t: "avanzar", n });
const der = g => ({ t: "girar", dir: "der", g });
const izq = g => ({ t: "girar", dir: "izq", g });
const rep = (n, ...cuerpo) => ({ t: "repetir", n, cuerpo });

// solucion: una forma de lograrlo (dibuja la meta y fija las 3 ⭐ por cantidad de bloques)
export const RETOS = [
  { titulo: "Una línea", inicio: { x: 200, y: 300, r: 0 },
    voz: "Arrastrá el bloque Avanzar debajo de Al tocar play. Cambiá el número para que la línea llegue justo al final.",
    solucion: [av(150)] },
  { titulo: "Una esquina", inicio: { x: 120, y: 300, r: 0 },
    voz: "Para doblar, usá el bloque Girar. Una esquina recta es de 90 grados.",
    solucion: [av(150), der(90), av(150)] },
  { titulo: "El cuadrado", inicio: { x: 130, y: 280, r: 0 },
    voz: "Un cuadrado tiene cuatro lados iguales. ¿Te animás a usar el bloque Repetir en vez de poner todo cuatro veces?",
    solucion: [rep(4, av(140), der(90))] },
  { titulo: "El rectángulo", inicio: { x: 100, y: 260, r: 0 },
    voz: "Un rectángulo tiene dos lados largos y dos cortos. Pensá qué se repite y cuántas veces.",
    solucion: [rep(2, av(100), der(90), av(200), der(90))] },
  { titulo: "El triángulo", inicio: { x: 120, y: 310, r: 30 },
    voz: "Un triángulo con los tres lados iguales. Ojo: la lapa tiene que girar 120 grados, no 60. ¡Probá y vas a ver por qué!",
    solucion: [rep(3, av(160), der(120))] },
  { titulo: "La escalera", inicio: { x: 90, y: 330, r: 0 },
    voz: "Cada escalón es igual: sube, dobla, avanza y vuelve a doblar. ¡Repetilo!",
    solucion: [rep(4, av(50), der(90), av(50), izq(90))] },
  { titulo: "El hexágono", inicio: { x: 155, y: 280, r: 0 },
    voz: "Seis lados iguales, como un panal de abejas. Si da toda la vuelta, ¿cuántos grados gira en cada esquina?",
    solucion: [rep(6, av(90), der(60))] },
  { titulo: "La casita", inicio: { x: 130, y: 330, r: 0 },
    voz: "Una casita: primero el cuadrado, y después el techo con dos líneas. El techo gira 30 grados y después 120.",
    solucion: [rep(4, av(140), der(90)), av(140), der(30), av(140), der(120), av(140)] },
  { titulo: "La estrella", inicio: { x: 105, y: 240, r: 72 },
    voz: "Una estrella de cinco puntas se dibuja sin levantar el lápiz. El secreto: girar 144 grados cinco veces.",
    solucion: [rep(5, av(190), der(144))] },
  { titulo: "La flor", inicio: { x: 200, y: 200, r: 0 },
    voz: "¡El gran reto! Una flor hecha de doce cuadrados. Poné un Repetir adentro de otro Repetir.",
    solucion: [rep(12, rep(4, av(70), der(90)), der(30))] },
];

/** Cuenta todos los bloques, también los de adentro. */
export function contar(lista) {
  return lista.reduce((s, b) => s + 1 + contar(b.cuerpo || []), 0);
}
RETOS.forEach(r => { r.objetivo ??= contar(r.solucion); });

/**
 * Corre el programa. Devuelve las rayas que quedaron y los eventos para animar.
 * resultado: "ok" | "largo" (se pasó de MAX_PASOS)
 */
export function ejecutar(programa, inicio) {
  let { x, y, r } = inicio;
  let color = COLORES.negro, grosor = 4, abajo = true, pasos = 0;
  const rayas = [], eventos = [];
  class Largo {}
  function correr(lista) {
    for (const b of lista) {
      if (++pasos > MAX_PASOS) throw new Largo();
      if (b.t === "avanzar") {
        const rad = r * Math.PI / 180;
        const nx = x + Math.sin(rad) * b.n, ny = y - Math.cos(rad) * b.n;
        const raya = abajo && b.n !== 0 ? { x1: x, y1: y, x2: nx, y2: ny, color, grosor } : null;
        if (raya) rayas.push(raya);
        eventos.push({ t: "mover", x1: x, y1: y, x2: nx, y2: ny, r, raya, id: b.id });
        x = nx; y = ny;
      } else if (b.t === "girar") {
        const r0 = r;
        r = ((r + (b.dir === "der" ? b.g : -b.g)) % 360 + 360) % 360;
        eventos.push({ t: "girar", x, y, r0, r, id: b.id });
      } else if (b.t === "color") { color = COLORES[b.c] || b.c; eventos.push({ t: "otro", id: b.id }); }
      else if (b.t === "grosor") { grosor = b.n; eventos.push({ t: "otro", id: b.id }); }
      else if (b.t === "lapiz") { abajo = b.abajo; eventos.push({ t: "otro", id: b.id }); }
      else if (b.t === "repetir") { eventos.push({ t: "otro", id: b.id }); for (let k = 0; k < b.n; k++) correr(b.cuerpo); }
    }
  }
  let resultado = "ok";
  try { correr(programa); } catch (e) { if (e instanceof Largo) resultado = "largo"; else throw e; }
  return { resultado, rayas, eventos, final: { x, y, r } };
}

// ---------- Comparar el dibujo con la meta ----------
function puntos(rayas, cada = 4) {
  const ps = [];
  for (const s of rayas) {
    const L = Math.hypot(s.x2 - s.x1, s.y2 - s.y1), k = Math.max(1, Math.ceil(L / cada));
    for (let i = 0; i <= k; i++) ps.push([s.x1 + (s.x2 - s.x1) * i / k, s.y1 + (s.y2 - s.y1) * i / k]);
  }
  return ps;
}
function distancia(p, s) {
  const dx = s.x2 - s.x1, dy = s.y2 - s.y1, L2 = dx * dx + dy * dy;
  const t = L2 ? Math.max(0, Math.min(1, ((p[0] - s.x1) * dx + (p[1] - s.y1) * dy) / L2)) : 0;
  return Math.hypot(p[0] - (s.x1 + t * dx), p[1] - (s.y1 + t * dy));
}
const cerca = (p, rayas, tol) => rayas.some(s => distancia(p, s) <= tol);

/**
 * Qué tanto se parece el dibujo a la meta (sin importar colores ni el orden en que se dibujó).
 * cobertura: parte de la meta que quedó dibujada · sobra: parte del dibujo que no es de la meta
 */
export function comparar(dibujo, meta, tol = 5) {
  const pm = puntos(meta), pd = puntos(dibujo);
  const cobertura = pm.length ? pm.filter(p => cerca(p, dibujo, tol)).length / pm.length : 0;
  const sobra = pd.length ? pd.filter(p => !cerca(p, meta, tol)).length / pd.length : 0;
  return { cobertura, sobra, igual: cobertura >= 0.97 && sobra <= 0.03 };
}
