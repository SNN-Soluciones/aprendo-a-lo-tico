// 🦥 Lógica de "Llevá al perezoso" (sin nada de pantalla, para poder probarla sola).
//
// Cada nivel es un mapa de texto:
//   S = perezoso (salida)   H = hoja (hay que comérselas todas)
//   # = árbol (no se puede pasar)   ~ = río (tampoco: el perezoso no nada… bueno, casi)
//   . = camino libre

export const NIVELES = [
  { mapa: [".....", "S..H.", "....."] },                     // 3 pasos: derecho
  { mapa: ["..H..", ".....", ".....", "..S.."] },            // 3: para arriba
  { mapa: ["S....", ".....", "....H"] },                     // 6: con vuelta
  { mapa: [".....", "S.#.H", "....."] },                     // 6: rodear un árbol
  { mapa: ["S.H..", ".....", "..H.."] },                     // 4: dos hojas
  { mapa: ["S#H", ".#.", "..."] },                           // 6: laberinto chiquito
  { mapa: ["S.~..", "..~..", "..~.H", "....."] },            // 8: rodear el río
  { mapa: ["S..~.", "#.~~.", "..~H.", "....#"] },            // 7: río y árboles
  { mapa: [".H...", "S.#.H", "...H."] },                     // 8: tres hojas
  { mapa: ["S.#H.", "..#..", "H....", ".~~~.", "....H"] },   // 12: el gran reto
];

export const DIRS = {
  arriba: { dx: 0, dy: -1, e: "⬆️" },
  derecha: { dx: 1, dy: 0, e: "➡️" },
  abajo: { dx: 0, dy: 1, e: "⬇️" },
  izquierda: { dx: -1, dy: 0, e: "⬅️" },
};

/** Convierte el mapa de texto en datos. */
export function leer(nivel) {
  const filas = nivel.mapa;
  const alto = filas.length, ancho = filas[0].length;
  let salida = null;
  const hojas = [], celdas = [];
  filas.forEach((f, y) => [...f].forEach((c, x) => {
    if (c === "S") salida = { x, y };
    if (c === "H") hojas.push({ x, y });
    celdas.push({ x, y, tipo: c === "#" ? "arbol" : c === "~" ? "rio" : "libre" });
  }));
  return { ancho, alto, salida, hojas, celdas, tipo: (x, y) => celdas[y * ancho + x]?.tipo };
}

/**
 * Corre un programa y devuelve cada paso, para animarlo.
 * resultado: "gano" | "choco" | "incompleto"
 * choque: "arbol" | "rio" | "borde" (si chocó)
 */
export function ejecutar(juego, programa) {
  let { x, y } = juego.salida;
  const faltan = new Set(juego.hojas.map(h => `${h.x},${h.y}`));
  const pasos = [];
  for (let i = 0; i < programa.length; i++) {
    const d = DIRS[programa[i]];
    const nx = x + d.dx, ny = y + d.dy;
    const fuera = nx < 0 || ny < 0 || nx >= juego.ancho || ny >= juego.alto;
    const t = fuera ? "borde" : juego.tipo(nx, ny);
    if (t !== "libre") {
      pasos.push({ i, x, y, choque: t, comio: null });
      return { pasos, resultado: "choco", choque: t, x, y, faltan: faltan.size, i };
    }
    x = nx; y = ny;
    const k = `${x},${y}`;
    const comio = faltan.delete(k) ? k : null;
    pasos.push({ i, x, y, comio });
  }
  return { pasos, resultado: faltan.size === 0 ? "gano" : "incompleto", x, y, faltan: faltan.size };
}

/** Menor cantidad de pasos para comerse todas las hojas (búsqueda a lo ancho). */
export function minimo(juego) {
  const idx = new Map(juego.hojas.map((h, i) => [`${h.x},${h.y}`, i]));
  const meta = (1 << juego.hojas.length) - 1;
  const inicio = [juego.salida.x, juego.salida.y, 0];
  const visto = new Set([inicio.join()]);
  let frente = [inicio], pasos = 0;
  while (frente.length) {
    const sig = [];
    for (const [x, y, m] of frente) {
      if (m === meta) return pasos;
      for (const d of Object.values(DIRS)) {
        const nx = x + d.dx, ny = y + d.dy;
        if (nx < 0 || ny < 0 || nx >= juego.ancho || ny >= juego.alto || juego.tipo(nx, ny) !== "libre") continue;
        const h = idx.get(`${nx},${ny}`);
        const nm = h === undefined ? m : m | (1 << h);
        const k = `${nx},${ny},${nm}`;
        if (!visto.has(k)) { visto.add(k); sig.push([nx, ny, nm]); }
      }
    }
    frente = sig; pasos++;
  }
  return Infinity;
}
