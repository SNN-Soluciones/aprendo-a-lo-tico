// 🦥 Lógica de "Llevá al perezoso" (sin nada de pantalla, para poder probarla sola).
//
// Cada nivel es un mapa de texto:
//   S = perezoso (salida)   H = hoja (hay que comérselas todas)
//   # = árbol (no se puede pasar)   ~ = río (tampoco: el perezoso no nada… bueno, casi)
//   . = camino libre

// id: para guardar el progreso. En los niveles 🐞 (depurar) el camino ya viene armado con una flecha equivocada.
export const NIVELES = [
  { id: "derecho", mapa: [".....", "S..H.", "....."] },                    // 3 pasos: derecho
  { id: "arriba", mapa: ["..H..", ".....", ".....", "..S.."] },           // 3: para arriba
  { id: "vuelta", mapa: ["S....", ".....", "....H"] },                    // 6: con vuelta
  { id: "arregla-1", depurar: true, mapa: [".....", "S...H", "....."],     // 🐞 una flecha para abajo que sobra
    inicial: ["derecha", "derecha", "abajo", "derecha"] },
  { id: "arbol", mapa: [".....", "S.#.H", "....."] },                     // 6: rodear un árbol
  { id: "dos-hojas", mapa: ["S.H..", ".....", "..H.."] },                 // 4: dos hojas
  { id: "laberinto", mapa: ["S#H", ".#.", "..."] },                       // 6: laberinto chiquito
  { id: "arregla-2", depurar: true, mapa: [".....", "S.#.H", "....."],     // 🐞 la última flecha va al revés
    inicial: ["arriba", "derecha", "derecha", "derecha", "derecha", "arriba"] },
  { id: "rio", mapa: ["S.~..", "..~..", "..~.H", "....."] },              // 8: rodear el río
  { id: "rio-arboles", mapa: ["S..~.", "#.~~.", "..~H.", "....#"] },      // 7: río y árboles
  { id: "tres-hojas", mapa: [".H...", "S.#.H", "...H."] },                // 8: tres hojas
  { id: "arregla-3", depurar: true, mapa: ["S.H", "...", "H.H"],          // 🐞 le falta la última flecha
    inicial: ["derecha", "derecha", "abajo", "abajo", "izquierda"] },
  { id: "zigzag", mapa: ["S#...", ".#.#.", "...#H"] },                   // 10: zigzag entre árboles
  { id: "gran-reto", mapa: ["S.#H.", "..#..", "H....", ".~~~.", "....H"] },  // 12: el gran reto
  { id: "bosque", mapa: ["S.#...", ".##.#.", "...#H.", ".#....", "H..#.H"] }, // 13: el bosque, 3 hojas
  { id: "cuatro-hojas", mapa: ["H...H", ".....", "..S..", ".....", "H...H"] }, // 16: 4 hojas en las esquinas
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

// ---------- 🎲 Niveles al azar ----------
/**
 * Arma un mapa nuevo que se puede resolver: el camino más corto queda entre `pasos[0]` y `pasos[1]`
 * (así no es ni muy fácil ni más largo que las 20 flechas que caben).
 */
export function nivelAlAzar(rnd = Math.random, { pasos = [5, 14] } = {}) {
  const r = n => Math.floor(rnd() * n);
  for (let intento = 0; intento < 500; intento++) {
    const ancho = 4 + r(3), alto = 3 + r(3);             // de 4×3 a 6×5
    const g = Array.from({ length: alto }, () => Array(ancho).fill("."));
    const libres = [];
    for (let y = 0; y < alto; y++) for (let x = 0; x < ancho; x++) libres.push([x, y]);
    const sacar = () => libres.splice(r(libres.length), 1)[0];
    const [sx, sy] = sacar(); g[sy][sx] = "S";
    const hojas = 1 + r(3);
    for (let i = 0; i < hojas; i++) { const [x, y] = sacar(); g[y][x] = "H"; }
    // Árboles sueltos y, a veces, un pedazo de río en línea
    const arboles = Math.floor(ancho * alto * (0.12 + rnd() * 0.12));
    for (let i = 0; i < arboles && libres.length > 2; i++) { const [x, y] = sacar(); g[y][x] = "#"; }
    if (rnd() < 0.5) {
      const vertical = rnd() < 0.5, largo = 2 + r(2);
      let [x, y] = libres[r(libres.length)];
      for (let i = 0; i < largo; i++) {
        if (x >= ancho || y >= alto || g[y][x] !== ".") break;
        g[y][x] = "~"; vertical ? y++ : x++;
      }
    }
    const nivel = { id: "azar", azar: true, mapa: g.map(f => f.join("")) };
    const m = minimo(leer(nivel));
    if (m >= pasos[0] && m <= pasos[1]) return nivel;
  }
  return { ...NIVELES[NIVELES.length - 1], id: "azar", azar: true };
}
