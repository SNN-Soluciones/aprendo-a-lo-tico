// 🎶 Lógica de «La marimba» (sin pantalla ni sonido, para poder probarla sola con node).
// El instrumento nacional, para jugar con el oído y la memoria, sin leer nada:
//   - Simón dice: la marimba toca una melodía y el niño la repite.
//   - ¿Más aguda o más grave?: dos notas; la segunda ¿sube como un pajarito o baja como un sapo?
//   - ¿Iguales o distintas?: dos melodías cortas.
//   - Ritmo: repetir en el tambor golpes cortos y largos.
// La escalera mezcla los cuatro, de lo más fácil a lo más difícil.

// ---------- Teclas (do a do, en do mayor) ----------
// Cada nota tiene siempre el mismo color, aunque en los primeros escalones salgan menos teclas.
// midi: 72 = do5 (las teclas de la marimba suenan bien en los parlantes del celular).
export const TECLAS = [
  { nota: "do", color: "#E53935", nombreColor: "roja", midi: 72 },
  { nota: "re", color: "#FB8C00", nombreColor: "anaranjada", midi: 74 },
  { nota: "mi", color: "#FDD835", nombreColor: "amarilla", midi: 76 },
  { nota: "fa", color: "#43A047", nombreColor: "verde", midi: 77 },
  { nota: "sol", color: "#00ACC1", nombreColor: "celeste", midi: 79 },
  { nota: "la", color: "#1E88E5", nombreColor: "azul", midi: 81 },
  { nota: "si", color: "#8E24AA", nombreColor: "morada", midi: 83 },
  { nota: "do", color: "#EC407A", nombreColor: "rosada", midi: 84 },
];
// Qué teclas salen: con 3, do-mi-sol (bien distintas al oído); con 5, la escala pentatónica (sin semitonos)
export const JUEGOS_DE_TECLAS = { 3: [0, 2, 4], 5: [0, 1, 2, 4, 5], 8: [0, 1, 2, 3, 4, 5, 6, 7] };

export const frecuencia = midi => 440 * 2 ** ((midi - 69) / 12);
/** Notas del modo «¿más aguda o más grave?»: de do4 a do7. */
export const RANGO_AGUDO = [60, 96];

// ---------- Escalones ----------
// brillo: "fuerte" (la tecla se ilumina), "tenue" (apenas), "primera" (solo la primera nota),
//         "nada" (solo oído: la melodía siempre empieza en la tecla roja y va por pasitos)
// salto: cuántos semitonos separan las dos notas (12 = una octava)
// cambio: en «¿iguales?», cómo cambia la segunda melodía: "grande" (una nota muy distinta),
//         "chico" (una nota vecina) u "orden" (dos notas cambian de lugar)
// golpes: cuántos golpes de tambor; dibujo: si se ve el espacio entre golpes
export const ESCALONES = [
  { modo: "simon", teclas: 3, largo: 1, brillo: "fuerte" },   //  1 una nota, tres teclas
  { modo: "agudo", salto: 24 },                               //  2 dos octavas: pajarito o sapo
  { modo: "simon", teclas: 3, largo: 2, brillo: "fuerte" },   //  3
  { modo: "igual", teclas: 5, largo: 2, cambio: "grande" },   //  4
  { modo: "simon", teclas: 5, largo: 2, brillo: "fuerte" },   //  5 cinco teclas
  { modo: "ritmo", golpes: 3, dibujo: true },                 //  6
  { modo: "agudo", salto: 12 },                               //  7 una octava
  { modo: "simon", teclas: 5, largo: 3, brillo: "fuerte" },   //  8
  { modo: "igual", teclas: 5, largo: 3, cambio: "grande" },   //  9
  { modo: "simon", teclas: 8, largo: 3, brillo: "fuerte" },   // 10 las ocho teclas
  { modo: "agudo", salto: 7 },                                // 11 una quinta
  { modo: "ritmo", golpes: 4, dibujo: true },                 // 12
  { modo: "simon", teclas: 8, largo: 4, brillo: "fuerte" },   // 13
  { modo: "igual", teclas: 8, largo: 4, cambio: "chico" },    // 14
  { modo: "simon", teclas: 8, largo: 4, brillo: "tenue" },    // 15 las teclas brillan menos
  { modo: "agudo", salto: 4 },                                // 16 una tercera
  { modo: "ritmo", golpes: 5, dibujo: false },                // 17 sin dibujo: solo oído
  { modo: "simon", teclas: 8, largo: 5, brillo: "tenue" },    // 18
  { modo: "igual", teclas: 8, largo: 5, cambio: "orden" },    // 19
  { modo: "agudo", salto: 2 },                                // 20 un tono
  { modo: "simon", teclas: 5, largo: 3, brillo: "primera" },  // 21 solo se ilumina la primera
  { modo: "simon", teclas: 8, largo: 4, brillo: "primera" },  // 22
  { modo: "agudo", salto: 1 },                                // 23 un semitono
  { modo: "simon", teclas: 8, largo: 4, brillo: "nada" },     // 24 solo oído
];
// Para el papá o la maestra: los escalones de cada modo
export const MODOS = {};
ESCALONES.forEach((e, i) => { (MODOS[e.modo] ||= []).push(i); });

/** Escalón para empezar según la edad (un niño de 5 empieza en el primero: con las hojitas dobles sube rápido). */
export const inicio = edad => edad === null || edad <= 5 ? 0 : edad === 6 ? 2 : edad === 7 ? 4 : edad === 8 ? 7 : edad === 9 ? 9 : edad === 10 ? 12 : 14;

// ---------- Canciones para tocar libre (melodías de dominio público, sin letra) ----------
// notas: [tecla, tiempos]
const n = (teclas, tiempos = {}) => teclas.map((t, k) => [t, tiempos[k] || 1]);
export const CANCIONES = [
  { id: "escala", nombre: "La escalera de notas", e: "🪜",
    notas: n([0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0], { 7: 2, 14: 2 }) },
  { id: "estrellita", nombre: "Estrellita", e: "⭐", // «Ah! vous dirai-je, maman», canción francesa del siglo XVIII
    notas: n([0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0, 4, 4, 3, 3, 2, 2, 1, 4, 4, 3, 3, 2, 2, 1, 0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0],
      { 6: 2, 13: 2, 20: 2, 27: 2, 34: 2, 41: 2 }) },
  { id: "corderito", nombre: "María tenía un corderito", e: "🐑", // canción infantil del siglo XIX
    notas: n([2, 1, 0, 1, 2, 2, 2, 1, 1, 1, 2, 4, 4, 2, 1, 0, 1, 2, 2, 2, 2, 1, 1, 2, 1, 0],
      { 6: 2, 9: 2, 12: 2, 25: 4 }) },
  { id: "alegria", nombre: "Himno a la alegría", e: "🎉", // Beethoven, Novena Sinfonía (1824)
    notas: n([2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 2, 1, 1, 2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 1, 0, 0],
      { 12: 1.5, 13: 0.5, 14: 2, 27: 1.5, 28: 0.5, 29: 2 }) },
];

// ---------- Rondas ----------
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const ent = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
const NUMEROS = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho"];
const ORDINALES = ["primera", "segunda", "tercera", "cuarta", "quinta", "sexta"];
export const ordinal = k => ORDINALES[k] || `número ${k + 1}`;

/** Una melodía de `largo` notas con las teclas `teclas` (sin repetir la misma nota dos veces seguidas). */
function melodia(teclas, largo, rnd, pasitos = false, empiezaEnDo = false) {
  let pos = empiezaEnDo ? 0 : ent(0, teclas.length - 1, rnd);
  const m = [teclas[pos]];
  while (m.length < largo) {
    let otra;
    if (pasitos) {
      // por pasitos: una o dos teclas para arriba o para abajo, sin salirse
      const saltos = [-2, -1, 1, 2].filter(s => pos + s >= 0 && pos + s < teclas.length);
      otra = pos + azar(saltos, rnd);
    } else {
      do { otra = ent(0, teclas.length - 1, rnd); } while (otra === pos);
    }
    pos = otra;
    m.push(teclas[pos]);
  }
  return m;
}

/** Golpes cortos (1) y largos (2) entre un golpe y el siguiente; con 3 golpes o más, siempre hay de los dos. */
function patron(golpes, rnd) {
  for (;;) {
    const p = Array.from({ length: golpes - 1 }, () => (rnd() < 0.5 ? 1 : 2));
    if (p.length < 2 || (p.includes(1) && p.includes(2))) return p;
  }
}
/** Cuántos ritmos distintos podían salir (para la escalera: con 3 golpes hay solo 2, adivinar no sube). */
export const ritmosPosibles = golpes => (golpes - 1 >= 2 ? 2 ** (golpes - 1) - 2 : 2);

/**
 * Una ronda nueva del escalón `i`. `evitar`: la clave de la ronda anterior, para no repetirla igualita.
 */
export function ronda(i, rnd = Math.random, evitar = "") {
  const e = ESCALONES[i];
  for (let intento = 0; ; intento++) {
    const r = armar(e, i, rnd);
    if (r.clave !== evitar || intento > 20) return r;
  }
}

function armar(e, i, rnd) {
  if (e.modo === "simon") {
    const teclas = JUEGOS_DE_TECLAS[e.teclas];
    const pasitos = e.brillo === "primera" || e.brillo === "nada";
    const m = melodia(teclas, e.largo, rnd, pasitos, e.brillo === "nada");
    return { modo: "simon", escalon: i, teclas, melodia: m, brillo: e.brillo, opciones: teclas.length, clave: m.join(",") };
  }
  if (e.modo === "agudo") {
    const base = ent(RANGO_AGUDO[0], RANGO_AGUDO[1] - e.salto, rnd);
    const sube = rnd() < 0.5;
    const notas = sube ? [base, base + e.salto] : [base + e.salto, base];
    return { modo: "agudo", escalon: i, notas, salto: e.salto, respuesta: sube ? "sube" : "baja", opciones: 2, clave: notas.join(",") };
  }
  if (e.modo === "igual") {
    const teclas = JUEGOS_DE_TECLAS[e.teclas];
    const m1 = melodia(teclas, e.largo, rnd);
    const igual = rnd() < 0.5;
    let m2 = [...m1], cambio = [];
    if (!igual) {
      if (e.cambio === "orden") {
        const k = ent(0, m1.length - 2, rnd); // m1 nunca repite seguidas: las dos notas son distintas
        [m2[k], m2[k + 1]] = [m2[k + 1], m2[k]];
        cambio = [k, k + 1];
      } else {
        // grande: la nota nueva queda a 5 semitonos o más · chico: es la tecla vecina (1 o 2 semitonos)
        const midi = t => TECLAS[t].midi;
        const posibles = [];
        m1.forEach((t, k) => teclas.forEach(u => {
          const d = Math.abs(midi(u) - midi(t));
          if (u !== t && (e.cambio === "grande" ? d >= 5 : d <= 2)) posibles.push([k, u]);
        }));
        const [k, u] = azar(posibles, rnd);
        m2[k] = u;
        cambio = [k];
      }
    }
    return { modo: "igual", escalon: i, teclas, melodias: [m1, m2], igual, cambio, tipoCambio: e.cambio,
      respuesta: igual ? "igual" : "distinto", opciones: 2, clave: m1.join(",") + (igual ? "=" : "≠") };
  }
  // ritmo
  const p = patron(e.golpes, rnd);
  return { modo: "ritmo", escalon: i, golpes: e.golpes, patron: p, dibujo: e.dibujo, opciones: ritmosPosibles(e.golpes), clave: p.join(",") };
}

/**
 * ¿Los toques del niño siguen el ritmo? `tiempos`: cuándo tocó cada golpe (en milisegundos).
 * No importa si lo toca más rápido o más lento: se compara la forma (qué espacios son cortos y cuáles largos).
 */
export function compararRitmo(patron, tiempos) {
  if (tiempos.length !== patron.length + 1) return false;
  const espacios = tiempos.slice(1).map((t, k) => t - tiempos[k]);
  if (espacios.some(x => !(x > 0))) return false;
  const unidad = espacios.reduce((a, b) => a + b, 0) / patron.reduce((a, b) => a + b, 0);
  return espacios.every((x, k) => (x / unidad >= 1.5 ? 2 : 1) === patron[k]);
}

// ---------- Textos (la voz dice todo: el niño no tiene que leer) ----------
export function instrHtml(r) {
  if (r.modo === "simon") return r.melodia.length === 1
    ? `<span class="big" aria-hidden="true">🎶</span> Tocá la misma tecla`
    : `<span class="big" aria-hidden="true">🎶</span> Repetí las <b>${r.melodia.length}</b> notas`;
  if (r.modo === "agudo") return `<span class="big" aria-hidden="true">🐦🐸</span> ¿Más aguda o más grave?`;
  if (r.modo === "igual") return `<span class="big" aria-hidden="true">👂</span> ¿Iguales o distintas?`;
  return `<span class="big" aria-hidden="true">🥁</span> Repetí el ritmo`;
}

/** Lo que dice la voz antes de que suene la marimba y lo que dice después (nunca encima de la música). */
export function vozDe(r) {
  if (r.modo === "simon") {
    const k = r.melodia.length;
    let antes;
    if (k === 1) antes = "Escuchá la marimba y tocá la misma tecla.";
    else if (r.brillo === "nada") antes = `Ahora sin lucecitas. La melodía empieza en la tecla roja y va por pasitos. Escuchá bien las ${NUMEROS[k]} notas.`;
    else if (r.brillo === "primera") antes = `Ahora solo se ilumina la primera tecla: las otras, con el oído. Escuchá las ${NUMEROS[k]} notas.`;
    else if (r.brillo === "tenue") antes = `Las teclas casi no brillan: escuchá bien las ${NUMEROS[k]} notas y tocalas en el mismo orden.`;
    else antes = `Escuchá las ${NUMEROS[k]} notas y tocalas en el mismo orden.`;
    return { antes, despues: "¡Tu turno!" };
  }
  if (r.modo === "agudo") return { antes: "Escuchá las dos notas.",
    despues: "¿La segunda es más aguda, finita como un pajarito, o más grave, gruesa como un sapo?" };
  if (r.modo === "igual") return { antes: "Escuchá las dos melodías.", despues: "¿Son iguales o distintas?" };
  return { antes: `Escuchá el tambor: son ${NUMEROS[r.golpes]} golpes, unos cortos y otros largos.`,
    despues: "¡Tu turno! Tocá el tambor igualito." };
}

/** Por qué era esa la respuesta (en «¿más aguda?» y «¿iguales?»). */
export function explica(r) {
  if (r.modo === "agudo") return r.respuesta === "sube"
    ? "La segunda era más aguda: subió, como un pajarito."
    : "La segunda era más grave: bajó, como un sapo.";
  if (r.modo === "igual") {
    if (r.igual) return "Eran iguales: las mismas notas, en el mismo orden.";
    if (r.tipoCambio === "orden") return `Eran distintas: la ${ordinal(r.cambio[0])} y la ${ordinal(r.cambio[1])} nota cambiaron de lugar.`;
    return `Eran distintas: cambió la ${ordinal(r.cambio[0])} nota.`;
  }
  return "";
}

// ---------- Revisión (para las pruebas con node) ----------
/** Azar con semilla, para que la revisión salga igual cada vez. */
export function semilla(s) {
  return () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Revisa una ronda. Devuelve una lista de problemas (vacía = bien). */
export function revisarRonda(r) {
  const mal = [];
  const e = ESCALONES[r.escalon];
  if (r.modo !== e.modo) mal.push(`modo ${r.modo} en un escalón de ${e.modo}`);
  const textos = [instrHtml(r), vozDe(r).antes, vozDe(r).despues, explica(r)].join(" | ");
  if (/undefined|null|NaN|\$\{/.test(textos)) mal.push(`texto sin llenar: ${textos.slice(0, 120)}`);
  if (/<|>/.test(vozDe(r).antes + vozDe(r).despues + explica(r))) mal.push("la voz tiene etiquetas");
  if (r.modo === "simon") {
    if (r.melodia.length !== e.largo) mal.push(`melodía de ${r.melodia.length} notas (esperaba ${e.largo})`);
    if (r.teclas.length !== e.teclas) mal.push(`${r.teclas.length} teclas (esperaba ${e.teclas})`);
    if (r.melodia.some(t => !r.teclas.includes(t))) mal.push(`nota fuera de las teclas del escalón: ${r.melodia}`);
    if (r.melodia.some((t, k) => k && t === r.melodia[k - 1])) mal.push(`nota repetida seguida: ${r.melodia}`);
    if (r.brillo === "nada" && r.melodia[0] !== 0) mal.push("sin lucecitas, la melodía tiene que empezar en do");
    if (r.brillo === "primera" || r.brillo === "nada") {
      r.melodia.forEach((t, k) => { if (k && Math.abs(r.teclas.indexOf(t) - r.teclas.indexOf(r.melodia[k - 1])) > 2) mal.push(`salto grande sin lucecitas: ${r.melodia}`); });
    }
  } else if (r.modo === "agudo") {
    const [a, b] = r.notas;
    if (a === b) mal.push("las dos notas son iguales");
    if (Math.abs(a - b) !== e.salto) mal.push(`salto de ${Math.abs(a - b)} (esperaba ${e.salto})`);
    if ((b > a ? "sube" : "baja") !== r.respuesta) mal.push("la respuesta no coincide con las notas");
    if (Math.min(a, b) < RANGO_AGUDO[0] || Math.max(a, b) > RANGO_AGUDO[1]) mal.push(`notas fuera del rango: ${r.notas}`);
  } else if (r.modo === "igual") {
    const [m1, m2] = r.melodias;
    if (m1.length !== e.largo || m2.length !== e.largo) mal.push("melodías del largo equivocado");
    if ([...m1, ...m2].some(t => !r.teclas.includes(t))) mal.push("nota fuera de las teclas");
    const iguales = m1.join() === m2.join();
    if (iguales !== r.igual) mal.push("«igual» no coincide con las melodías");
    if (r.respuesta !== (r.igual ? "igual" : "distinto")) mal.push("respuesta equivocada");
    if (!r.igual) {
      const distintas = m1.map((t, k) => (t !== m2[k] ? k : -1)).filter(k => k >= 0);
      if (distintas.join() !== r.cambio.join()) mal.push(`cambio ${r.cambio} pero difieren en ${distintas}`);
      if (e.cambio === "grande" && Math.abs(TECLAS[m1[r.cambio[0]]].midi - TECLAS[m2[r.cambio[0]]].midi) < 5) mal.push("cambio «grande» muy chiquito");
      if (e.cambio === "chico" && Math.abs(TECLAS[m1[r.cambio[0]]].midi - TECLAS[m2[r.cambio[0]]].midi) > 2) mal.push("cambio «chico» muy grande");
      if (e.cambio === "orden" && (r.cambio.length !== 2 || r.cambio[1] !== r.cambio[0] + 1)) mal.push("el cambio de orden no son dos notas vecinas");
    }
  } else {
    const p = r.patron;
    if (p.length !== e.golpes - 1) mal.push(`ritmo de ${p.length + 1} golpes (esperaba ${e.golpes})`);
    if (p.some(x => x !== 1 && x !== 2)) mal.push(`espacio raro: ${p}`);
    if (p.length >= 2 && !(p.includes(1) && p.includes(2))) mal.push(`ritmo sin cortos y largos: ${p}`);
    const ideal = p.reduce((ts, x) => [...ts, ts[ts.length - 1] + x * 380], [0]);
    if (!compararRitmo(p, ideal)) mal.push(`el ritmo tocado perfecto no se acepta: ${p}`);
    const lento = ideal.map(t => t * 1.7);
    if (!compararRitmo(p, lento)) mal.push(`el ritmo tocado más lento no se acepta: ${p}`);
    const parejo = ideal.map((_, k) => k * 500);
    if (compararRitmo(p, parejo)) mal.push(`tocar parejito se acepta en un ritmo con cortos y largos: ${p}`);
    if (compararRitmo(p, ideal.slice(0, -1))) mal.push("se acepta con un golpe de menos");
  }
  return mal;
}

/** Revisa escalones, rondas (miles), el ritmo con toques imperfectos y las canciones. Devuelve [] si todo está bien. */
export function revisarMarimba(vueltas = 400) {
  const mal = [];
  const rnd = semilla(2024);
  if (Object.values(MODOS).flat().length !== ESCALONES.length) mal.push("MODOS no cubre todos los escalones");
  for (let edad = 3; edad <= 12; edad++) { const k = inicio(edad); if (k < 0 || k >= ESCALONES.length) mal.push(`inicio fuera de rango a los ${edad}`); }
  ESCALONES.forEach((e, i) => {
    let anterior = "";
    const vistos = new Set();
    for (let v = 0; v < vueltas; v++) {
      const r = ronda(i, rnd, anterior);
      for (const p of revisarRonda(r)) mal.push(`escalón ${i + 1}: ${p}`);
      if (r.clave === anterior && vistos.size > 1) mal.push(`escalón ${i + 1}: repitió la ronda anterior`);
      anterior = r.clave;
      vistos.add(r.clave);
    }
    if (e.modo === "igual") {
      const rs = Array.from({ length: 200 }, () => ronda(i, rnd));
      const n = rs.filter(r => r.igual).length;
      if (n < 60 || n > 140) mal.push(`escalón ${i + 1}: «iguales» salió ${n} de 200 veces`);
    }
    if (e.modo === "agudo") {
      const rs = Array.from({ length: 200 }, () => ronda(i, rnd));
      const n = rs.filter(r => r.respuesta === "sube").length;
      if (n < 60 || n > 140) mal.push(`escalón ${i + 1}: «sube» salió ${n} de 200 veces`);
    }
  });
  // Ritmo con toques de niño: ±12 % en cada espacio se acepta; con los espacios al revés, no
  for (let v = 0; v < 2000; v++) {
    const g = ent(3, 5, rnd);
    const p = patron(g, rnd);
    const toques = [0];
    p.forEach(x => toques.push(toques[toques.length - 1] + x * 400 * (0.88 + rnd() * 0.24)));
    if (!compararRitmo(p, toques)) mal.push(`ritmo ${p} con toques ${toques.map(Math.round)} no se acepta`);
    const alReves = [...p].reverse();
    if (alReves.join() !== p.join()) {
      const t2 = [0];
      alReves.forEach(x => t2.push(t2[t2.length - 1] + x * 400));
      if (compararRitmo(p, t2)) mal.push(`ritmo ${p} acepta ${alReves}`);
    }
  }
  for (const c of CANCIONES) {
    if (!c.notas.length) mal.push(`${c.id}: sin notas`);
    for (const [t, d] of c.notas) {
      if (!(t >= 0 && t < TECLAS.length)) mal.push(`${c.id}: tecla ${t}`);
      if (!(d > 0)) mal.push(`${c.id}: duración ${d}`);
    }
  }
  return [...new Set(mal)];
}
