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
const subir = { t: "lapiz", abajo: false }, bajar = { t: "lapiz", abajo: true };
const cuadrado = l => rep(4, av(l), der(90));

// Etapas: cada concepto se practica varias veces antes de pasar al siguiente.
export const ETAPAS = [
  { id: "mover", nombre: "Moverse", emoji: "🦜" },
  { id: "repetir", nombre: "Repetir", emoji: "🔁" },
  { id: "lapiz", nombre: "El lápiz", emoji: "✏️" },
  { id: "anidado", nombre: "Repetir adentro de repetir", emoji: "🪆" },
  { id: "retos", nombre: "Grandes retos", emoji: "🏆" },
];

// Cada reto:
//   id (para guardar el progreso), etapa, titulo, voz (lo que explica la lapa), inicio {x, y, r}
//   solucion: una forma de lograrlo (dibuja la meta y fija las 3 ⭐ por cantidad de bloques)
//   inicial:  bloques que ya vienen puestos (para dar un empujón)
//   pistas:   se muestran de una en una con el botón 💡
export const RETOS = [
  // 🦜 Moverse
  { id: "linea", etapa: "mover", titulo: "Una línea", inicio: { x: 200, y: 300, r: 0 },
    voz: "Arrastrá el bloque Avanzar debajo de Al tocar play. Cambiá el número para que la línea llegue justo al final.",
    solucion: [av(150)],
    pistas: ["El bloque Avanzar está en la pestaña Moverse.", "La línea mide 150 pasos. Tocá el número del bloque para cambiarlo."] },
  { id: "esquina", etapa: "mover", titulo: "Una esquina", inicio: { x: 120, y: 300, r: 0 },
    voz: "Para doblar, usá el bloque Girar. Una esquina recta es de 90 grados.",
    solucion: [av(150), der(90), av(150)],
    pistas: ["Primero avanzá, después girá, después avanzá otra vez.", "Avanzar 150, girar a la derecha 90, avanzar 150."] },
  { id: "izquierda", etapa: "mover", titulo: "Para el otro lado", inicio: { x: 280, y: 300, r: 0 },
    voz: "Esta vez la esquina dobla hacia el otro lado. Cambiá el giro a la izquierda.",
    solucion: [av(150), izq(90), av(150)],
    pistas: ["En el bloque Girar, tocá donde dice a la derecha para cambiarlo.", "Avanzar 150, girar a la izquierda 90, avanzar 150."] },
  { id: "tres-lados", etapa: "mover", titulo: "Tres lados", inicio: { x: 125, y: 300, r: 0 },
    voz: "Una figura con tres lados, como una puerta. Contá cuántas veces tiene que girar.",
    solucion: [av(100), der(90), av(150), der(90), av(100)],
    pistas: ["Gira dos veces, las dos a la derecha.", "Los lados de los costados miden 100 y el de arriba 150."] },

  // 🔁 Repetir
  { id: "cuadrado", etapa: "repetir", titulo: "El cuadrado", inicio: { x: 130, y: 280, r: 0 },
    voz: "Ya están los bloques de un lado del cuadrado. En vez de ponerlos cuatro veces, metelos adentro de un Repetir.",
    inicial: [av(140), der(90)],
    solucion: [cuadrado(140)],
    pistas: ["El bloque Repetir está en la pestaña Repetir.", "Arrastrá Avanzar y Girar adentro de la boca del Repetir.", "Repetir 4 veces: avanzar 140, girar a la derecha 90."] },
  { id: "rectangulo", etapa: "repetir", titulo: "El rectángulo", inicio: { x: 100, y: 260, r: 0 },
    voz: "Un rectángulo tiene dos lados largos y dos cortos. Pensá qué se repite y cuántas veces.",
    solucion: [rep(2, av(100), der(90), av(200), der(90))],
    pistas: ["Lo que se repite es: un lado corto y un lado largo.", "Repetir 2 veces: avanzar 100, girar 90, avanzar 200, girar 90."] },
  { id: "triangulo", etapa: "repetir", titulo: "El triángulo", inicio: { x: 120, y: 310, r: 30 },
    voz: "Un triángulo con los tres lados iguales. Ojo: la lapa tiene que girar 120 grados, no 60. ¡Probá y vas a ver por qué!",
    solucion: [rep(3, av(160), der(120))],
    pistas: ["Para cerrar cualquier figura, la lapa da una vuelta completa: 360 grados.", "360 dividido entre 3 lados da 120 grados en cada esquina.", "Repetir 3 veces: avanzar 160, girar a la derecha 120."] },
  { id: "escalera", etapa: "repetir", titulo: "La escalera", inicio: { x: 90, y: 330, r: 0 },
    voz: "Cada escalón es igual: sube, dobla, avanza y vuelve a doblar. ¡Repetilo!",
    solucion: [rep(4, av(50), der(90), av(50), izq(90))],
    pistas: ["Un escalón: avanzar, girar a la derecha, avanzar, girar a la izquierda.", "Son 4 escalones de 50 pasos."] },
  { id: "pentagono", etapa: "repetir", titulo: "El pentágono", inicio: { x: 115, y: 305, r: 0 },
    voz: "Cinco lados iguales. Usá el mismo truco del triángulo: 360 grados repartidos entre los lados.",
    solucion: [rep(5, av(110), der(72))],
    pistas: ["360 dividido entre 5 da 72.", "Repetir 5 veces: avanzar 110, girar a la derecha 72."] },
  { id: "hexagono", etapa: "repetir", titulo: "El hexágono", inicio: { x: 155, y: 280, r: 0 },
    voz: "Seis lados iguales, como un panal de abejas. ¿Cuántos grados gira en cada esquina?",
    solucion: [rep(6, av(90), der(60))],
    pistas: ["360 dividido entre 6.", "Repetir 6 veces: avanzar 90, girar a la derecha 60."] },
  { id: "octagono", etapa: "repetir", titulo: "El octágono", inicio: { x: 115, y: 285, r: 0 },
    voz: "¡Ocho lados, como una señal de alto! Ya sabés cómo sacar los grados.",
    solucion: [rep(8, av(70), der(45))],
    pistas: ["360 dividido entre 8.", "Repetir 8 veces: avanzar 70, girar a la derecha 45."] },
  { id: "estrella", etapa: "repetir", titulo: "La estrella", inicio: { x: 105, y: 240, r: 72 },
    voz: "Una estrella de cinco puntas se dibuja sin levantar el lápiz. El secreto: girar 144 grados cinco veces.",
    solucion: [rep(5, av(190), der(144))],
    pistas: ["La estrella da dos vueltas completas: 720 grados entre 5 puntas.", "Repetir 5 veces: avanzar 190, girar a la derecha 144."] },

  // ✏️ El lápiz
  { id: "punteada", etapa: "lapiz", titulo: "Línea punteada", inicio: { x: 80, y: 200, r: 90 },
    voz: "Para caminar sin dibujar, subí el lápiz. Hacé una línea punteada: dibujar, subir, avanzar, bajar… ¡y repetir!",
    solucion: [rep(6, av(20), subir, av(20), bajar)],
    pistas: ["El bloque de subir y bajar el lápiz está en la pestaña Lápiz.", "Un pedacito: avanzar 20 con el lápiz abajo, subir, avanzar 20, bajar.", "Repetir 6 veces ese pedacito."] },
  { id: "dos-cuadrados", etapa: "lapiz", titulo: "Dos cuadrados", inicio: { x: 60, y: 260, r: 0 },
    voz: "Dos cuadrados separados. Hacé el primero, subí el lápiz para moverte al lado, y hacé el segundo.",
    solucion: [cuadrado(80), subir, der(90), av(120), izq(90), bajar, cuadrado(80)],
    pistas: ["Cada cuadrado es: repetir 4 veces avanzar 80 y girar 90.", "Para pasar al segundo: subir el lápiz, girar a la derecha, avanzar 120, girar a la izquierda y bajar el lápiz."] },

  // 🪆 Repetir adentro de repetir
  { id: "tres-cuadrados", etapa: "anidado", titulo: "Tres cuadrados en fila", inicio: { x: 50, y: 250, r: 0 },
    voz: "¡Mirá! Ya está un cuadrado y cómo moverse al siguiente. Para hacer tres, meté todo eso adentro de otro Repetir.",
    inicial: [cuadrado(60), subir, der(90), av(110), izq(90), bajar],
    solucion: [rep(3, cuadrado(60), subir, der(90), av(110), izq(90), bajar)],
    pistas: ["Arrastrá un Repetir nuevo y poné todos los bloques adentro.", "El Repetir de afuera va 3 veces. El de adentro sigue siendo el del cuadrado."] },
  { id: "molino", etapa: "anidado", titulo: "El molino", inicio: { x: 200, y: 200, r: 0 },
    voz: "Cuatro cuadrados que dan vuelta, como un molino. Después de cada cuadrado, la lapa gira.",
    inicial: [cuadrado(80)],
    solucion: [rep(4, cuadrado(80), der(90))],
    pistas: ["Ya está el cuadrado. Metelo en un Repetir de 4 veces.", "Después del cuadrado, adentro del Repetir de afuera, poné girar a la derecha 90."] },
  { id: "flor-6", etapa: "anidado", titulo: "Flor de seis pétalos", inicio: { x: 200, y: 200, r: 0 },
    voz: "Igual que el molino, pero con seis cuadrados. ¿Cuánto tiene que girar entre uno y otro?",
    solucion: [rep(6, cuadrado(70), der(60))],
    pistas: ["360 entre 6 cuadrados.", "Repetir 6 veces: el cuadrado y girar a la derecha 60."] },
  { id: "triangulos", etapa: "anidado", titulo: "Rueda de triángulos", inicio: { x: 200, y: 200, r: 0 },
    voz: "Ahora con triángulos: seis triángulos alrededor del centro.",
    solucion: [rep(6, rep(3, av(80), der(120)), der(60))],
    pistas: ["El Repetir de adentro es el triángulo: 3 veces avanzar y girar 120.", "El de afuera va 6 veces y después de cada triángulo gira 60."] },
  { id: "flor", etapa: "anidado", titulo: "La flor", inicio: { x: 200, y: 200, r: 0 },
    voz: "Una flor hecha de doce cuadrados. Ya sabés cómo: un Repetir adentro de otro Repetir.",
    solucion: [rep(12, cuadrado(70), der(30))],
    pistas: ["360 entre 12 da 30.", "Repetir 12 veces: el cuadrado de 70 y girar a la derecha 30."] },
  { id: "panal", etapa: "anidado", titulo: "Rueda de hexágonos", inicio: { x: 200, y: 200, r: 0 },
    voz: "Seis hexágonos alrededor del centro. El de adentro es el hexágono de antes.",
    solucion: [rep(6, rep(6, av(45), der(60)), der(60))],
    pistas: ["Hexágono: repetir 6 veces avanzar 45 y girar 60.", "Repetí ese hexágono 6 veces, girando 60 entre cada uno."] },

  // 🏆 Grandes retos
  { id: "casita", etapa: "retos", titulo: "La casita", inicio: { x: 130, y: 330, r: 0 },
    voz: "Una casita: primero el cuadrado, y después el techo con dos líneas. El techo gira 30 grados y después 120.",
    solucion: [cuadrado(140), av(140), der(30), av(140), der(120), av(140)],
    pistas: ["Después del cuadrado, la lapa está abajo a la izquierda, mirando para arriba.", "Subí por la pared: avanzar 140. Después girar 30 y avanzar 140 para la primera parte del techo.", "Para la segunda parte del techo: girar 120 y avanzar 140."] },
  { id: "sol", etapa: "retos", titulo: "El sol", inicio: { x: 200, y: 200, r: 0 },
    voz: "Un sol con doce rayos. Cada rayo sale del centro y vuelve. Truco: se puede avanzar un número negativo para regresar.",
    solucion: [rep(12, av(120), av(-120), der(30))],
    pistas: ["Un rayo: avanzar 120 y avanzar menos 120 para volver al centro.", "Repetir 12 veces el rayo y girar 30."] },
  { id: "flor-triangulos", etapa: "retos", titulo: "Flor de triángulos", inicio: { x: 200, y: 200, r: 0 },
    voz: "Ocho triángulos dando vuelta. Pensá cuántos grados entre cada triángulo.",
    solucion: [rep(8, rep(3, av(100), der(120)), der(45))],
    pistas: ["El triángulo va adentro: 3 veces avanzar 100 y girar 120.", "360 entre 8 triángulos da 45."] },
  { id: "galaxia", etapa: "retos", titulo: "La galaxia", inicio: { x: 200, y: 200, r: 0 },
    voz: "¡El reto final! Muchas estrellas dando vuelta forman una galaxia. Doce estrellas, girando 30 grados.",
    solucion: [rep(12, rep(5, av(90), der(144)), der(30))],
    pistas: ["La estrella de adentro: 5 veces avanzar 90 y girar 144.", "Repetí la estrella 12 veces, girando 30 entre cada una."] },
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

// ---------- 🎲 Retos al azar ----------
// Figuras con tamaño al azar; se centran en el papel para que siempre quepan.
const FIGURAS = [
  r => { const n = [3, 5, 6, 8][r(4)], L = [0, 0, 0, 160, 0, 120, 100, 0, 70][n] + 10 * r(3);
    const nombre = { 3: "Un triángulo", 5: "Un pentágono", 6: "Un hexágono", 8: "Un octágono" }[n];
    return { titulo: nombre, solucion: [rep(n, av(L), der(360 / n))],
      voz: `${nombre} con todos los lados iguales. ¿Cuántos lados tiene? ¿Cuánto tiene que girar en cada esquina?`,
      pistas: [`Tiene ${n} lados: repetí ${n} veces.`, `Las vueltas de todas las esquinas suman 360 grados: 360 ÷ ${n} = ${360 / n}.`, `Repetir ${n} veces: avanzar ${L} y girar ${360 / n}.`] }; },
  r => { const L = 180 + 20 * r(4);
    return { titulo: "Una estrella", solucion: [rep(5, av(L), der(144))],
      voz: "¡Una estrella de cinco puntas! Se dibuja sin levantar el lápiz, con vueltas bien cerradas.",
      pistas: ["Tiene 5 puntas: repetí 5 veces.", "En cada punta gira 144 grados.", `Repetir 5 veces: avanzar ${L} y girar 144.`] }; },
  r => { const a = 80 + 20 * r(5), b = 60 + 20 * r(4);
    return { titulo: "Un rectángulo", solucion: [rep(2, av(a), der(90), av(b), der(90))],
      voz: "Un rectángulo: dos lados largos y dos cortos. ¿Qué parte se repite?",
      pistas: ["Un lado largo, una esquina, un lado corto, otra esquina… y se repite.", `Repetir 2 veces: avanzar ${a}, girar 90, avanzar ${b}, girar 90.`] }; },
  r => { const k = 3 + r(3), L = [0, 0, 0, 60, 50, 40][k];
    return { titulo: "Una escalera", solucion: [rep(k, av(L), der(90), av(L), izq(90))],
      voz: "Una escalera: cada escalón es igual. ¡Repetilo!",
      pistas: [`Un escalón: avanzar, girar a la derecha, avanzar, girar a la izquierda.`, `Son ${k} escalones de ${L} pasos.`] }; },
  r => { const k = [4, 6, 8][r(3)], L = 60 + 10 * r(3);
    return { titulo: "Una flor de cuadrados", solucion: [rep(k, cuadrado(L), der(360 / k))],
      voz: "¡Una flor hecha con cuadrados! Dibujá un cuadrado, girá un poquito y volvé a empezar.",
      pistas: ["Adentro de un Repetir, poné otro Repetir que dibuje un cuadrado.", `Son ${k} cuadrados: después de cada uno gira 360 ÷ ${k} = ${360 / k}.`, `Repetir ${k}: (repetir 4: avanzar ${L}, girar 90) y girar ${360 / k}.`] }; },
];

/** Un reto nuevo al azar, centrado en el papel. */
export function retoAlAzar(rnd = Math.random) {
  const r = n => Math.floor(rnd() * n);
  for (let k = 0; k < 50; k++) {
    const f = FIGURAS[r(FIGURAS.length)](r);
    // Se dibuja desde (0, 0) para medirla y después se centra
    const { rayas } = ejecutar(f.solucion, { x: 0, y: 0, r: 0 });
    const xs = rayas.flatMap(s => [s.x1, s.x2]), ys = rayas.flatMap(s => [s.y1, s.y2]);
    const ancho = Math.max(...xs) - Math.min(...xs), alto = Math.max(...ys) - Math.min(...ys);
    if (ancho > TAM - 50 || alto > TAM - 50) continue;
    const inicio = { x: Math.round(TAM / 2 - (Math.max(...xs) + Math.min(...xs)) / 2), y: Math.round(TAM / 2 - (Math.max(...ys) + Math.min(...ys)) / 2), r: 0 };
    const reto = { id: "azar", azar: true, etapa: "azar", titulo: f.titulo, voz: f.voz, inicio, solucion: f.solucion, pistas: f.pistas };
    reto.objetivo = contar(reto.solucion);
    return reto;
  }
  return { ...RETOS[4], id: "azar", azar: true };
}
