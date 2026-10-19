// 📖 Lógica de «Leo y miro» (sin pantalla, para poder probarla sola con node).
// El paso siguiente a «Sílabas mágicas»: leer palabras, frases y oraciones y mostrar que se entendió.
// Cada escalón usa solo las letras que el niño ya vio en Sílabas (en el mismo orden: m p s l t n → d c r b f g → ñ ll ch).
// Hasta las frases, todas las sílabas son directas (consonante + vocal, como «sa», «po»), más las palabritas
// «el», «es» y «un» que Sílabas también usa. Después viene un escalón de palabras con sílabas trabadas
// (sol, pan, flor, tren, fuego) y desde ahí las oraciones ya las pueden tener.
import { GRUPO_A, NUEVAS_B, GRUPO_B, DIFICILES, TODAS, directa, partes } from "./silabas.js";

const C1 = GRUPO_A.slice(0, 4); // m p s l

// ---------- Palabras con dibujo ----------
// [sílabas separadas por guion, dibujo, artículo]. Cada dibujo es de una sola palabra.
const LISTA = [
  // m p s l
  ["ma-má", "👩‍👧", "la"], ["pa-pá", "👨‍👧", "el"], ["pa-pa", "🥔", "la"], ["sa-po", "🐸", "el"], ["o-so", "🐻", "el"],
  ["so-pa", "🍲", "la"], ["ma-pa", "🗺️", "el"], ["lu-pa", "🔍", "la"], ["pi-la", "🔋", "la"], ["pi-pa", "🥥", "la"],
  ["la-pa", "🦜", "la"],
  // t n
  ["mo-no", "🐒", "el"], ["pa-to", "🦆", "el"], ["mo-to", "🏍️", "la"], ["lu-na", "🌙", "la"], ["la-ta", "🥫", "la"],
  ["ma-no", "✋", "la"], ["ti-na", "🛁", "la"], ["ne-na", "👧", "la"], ["pe-pi-no", "🥒", "el"], ["to-ma-te", "🍅", "el"],
  ["pe-lo-ta", "⚽", "la"], ["ma-le-ta", "🧳", "la"], ["pa-lo-ma", "🕊️", "la"],
  // d c r b f g
  ["da-do", "🎲", "el"], ["ca-sa", "🏠", "la"], ["ca-ma", "🛏️", "la"], ["co-pa", "🏆", "la"], ["pe-ra", "🍐", "la"],
  ["to-ro", "🐂", "el"], ["ro-sa", "🌹", "la"], ["bo-ta", "👢", "la"], ["bo-ca", "👄", "la"], ["nu-be", "☁️", "la"],
  ["lo-bo", "🐺", "el"], ["be-bé", "👶", "el"], ["fo-ca", "🦭", "la"], ["so-fá", "🛋️", "el"], ["ga-to", "🐱", "el"],
  ["go-ta", "💧", "la"], ["ma-go", "🧙", "el"], ["gu-sa-no", "🐛", "el"], ["mo-ne-da", "🪙", "la"], ["ba-na-no", "🍌", "el"],
  ["ca-fé", "☕", "el"], ["ca-mo-te", "🍠", "el"], ["do-na", "🍩", "la"], ["ma-ri-po-sa", "🦋", "la"],
  // ñ ll ch
  ["pi-ña", "🍍", "la"], ["ni-ño", "👦", "el"], ["u-ña", "💅", "la"], ["a-ra-ña", "🕷️", "la"], ["po-llo", "🍗", "el"],
  ["si-lla", "🪑", "la"], ["lla-ma", "🦙", "la"], ["ga-lle-ta", "🍪", "la"], ["le-che", "🥛", "la"], ["o-cho", "8️⃣", "el"],
  ["mo-chi-la", "🎒", "la"], ["chi-le", "🌶️", "el"], ["du-cha", "🚿", "la"], ["ca-ba-llo", "🐴", "el"], ["ga-llo", "🐓", "el"],
  ["po-lli-to", "🐤", "el"], ["cu-cha-ra", "🥄", "la"],
  // Con sílabas trabadas: termina en consonante (sol), dos consonantes juntas (flor) o dos vocales juntas (fuego)
  ["sol", "☀️", "el"], ["pan", "🍞", "el"], ["mar", "🌊", "el"], ["bus", "🚌", "el"], ["man-go", "🥭", "el"],
  ["ár-bol", "🌳", "el"], ["tren", "🚂", "el"], ["flor", "🌸", "la"], ["ra-tón", "🐭", "el"], ["ca-mión", "🚚", "el"],
  ["li-món", "🍋", "el"], ["san-dí-a", "🍉", "la"], ["tor-tu-ga", "🐢", "la"], ["tam-bor", "🥁", "el"], ["cam-pa-na", "🔔", "la"],
  ["glo-bo", "🎈", "el"], ["pan-ta-lón", "👖", "el"], ["fue-go", "🔥", "el"], ["pul-pe-rí-a", "🏪", "la"], ["es-tre-lla", "⭐", "la"],
  ["pul-po", "🐙", "el"], ["del-fín", "🐬", "el"], ["ti-bu-rón", "🦈", "el"], ["pie", "🦶", "el"], ["dien-te", "🦷", "el"],
  ["pa-ra-guas", "☂️", "el"], ["fres-co", "🧃", "el"], ["co-co-dri-lo", "🐊", "el"],
];
export const PALABRAS = LISTA.map(([s, e, a]) => ({ s: s.split("-"), t: s.split("-").join(""), e, a }));
const POR_PALABRA = Object.fromEntries(PALABRAS.map(p => [p.t, p]));
/** El dibujo de una palabra (o de la última palabra de «el mono», «mi mamá»…). */
export const dib = frase => POR_PALABRA[frase.split(" ").pop()].e;

// Dibujos que no deben salir juntos: se parecen o, si el teléfono no junta el emoji, se ven parecidos (👩‍👧 → 👩👧)
const CHOQUES = [["mamá", "nena"], ["papá", "nena"], ["mano", "uña"]];
const chocan = (a, b) => CHOQUES.some(([x, y]) => (a === x && b === y) || (a === y && b === x));

// ---------- Otras palabras que salen en frases y oraciones (con sus sílabas, para revisarlas) ----------
const OTRAS = `el la los las un u-na mi es en de del
  co-me co-men to-ma es-tá es-tán tie-ne na-da na-dan sa-le sa-len can-ta no-che dí-a
  bo-la cua-dro a-ma-ri-lla a-ma-ri-llo mo-ra-da mo-ra-do blan-ca blan-co ne-gra ne-gro
  fru-ta a-ni-mal plu-mas pa-tas co-la pe-lo ca-lien-te frí-o
  dos tres cua-tro to-cá don-de dón-de cuál cuán-tos cuán-tas mas-co-ta con
  pa-tos ga-tos mo-nos sa-pos po-lli-tos glo-bos man-gos mo-ne-das ga-lle-tas tor-tu-gas mo-tos es-tre-llas
  lo-la pe-pe a-na me-mo ti-to ni-co so-fí-a pa-blo da-ni`.split(/\s+/).filter(Boolean);
export const VOCAB = { ...Object.fromEntries(PALABRAS.map(p => [p.t, p.s])), ...Object.fromEntries(OTRAS.map(w => [w.split("-").join(""), w.split("-")])) };
// Palabritas que Sílabas ya usa en sus oraciones aunque no sean sílabas directas
const PALABRITAS = ["el", "es", "un"];

// ---------- ¿Ya puede leer esta sílaba? ----------
const VOCALES = "aeiouáéíóú";
const GRUPOS = ["pl", "pr", "bl", "br", "fl", "fr", "cl", "cr", "gl", "gr", "tr", "dr"];
// Letras (ch y ll cuentan como una)
const unidades = s => { const u = []; for (let i = 0; i < s.length;) { const d = s.slice(i, i + 2); if (d === "ch" || d === "ll" || d === "rr") { u.push(d); i += 2; } else { u.push(s[i]); i++; } } return u; };

/**
 * ¿Ya vio esta sílaba? Directa (con una letra que ya aprendió) o, si el escalón lo permite, trabada:
 * dos consonantes juntas (fl, tr…), dos vocales juntas (ue, ie…) o que termine en s, n, l, r o m (tam-bor).
 * Nunca: c o g suaves (ce, ci, ge, gi, gue, gui), ni letras que Sílabas no enseña (h, j, q, v, y, z…).
 */
export function silabaOk(s, cons, trabadas = false) {
  if (directa(s)) { const c = partes(s).c; return !c || cons.includes(c); }
  if (!trabadas) return false;
  const u = unidades(s);
  let i = 0;
  const ataque = [], nucleo = [];
  while (i < u.length && !VOCALES.includes(u[i])) ataque.push(u[i++]);
  while (i < u.length && VOCALES.includes(u[i])) nucleo.push(u[i++]);
  const coda = u.slice(i);
  if (!nucleo.length || nucleo.length > 2) return false;
  if (nucleo.length === 2 && !nucleo.some(v => v === "i" || v === "u")) return false; // «ae» son dos sílabas
  if (coda.length > 1 || (coda.length && !["s", "n", "l", "r", "m"].includes(coda[0]))) return false;
  if (ataque.length > 2 || (ataque.length === 2 && !GRUPOS.includes(ataque.join("")))) return false;
  if (![...ataque, ...coda].every(c => cons.includes(c))) return false;
  if (ataque.length === 1 && (ataque[0] === "c" || ataque[0] === "g") && "eiéí".includes(nucleo[0])) return false;
  if (ataque.length === 1 && ataque[0] === "g" && nucleo[0] === "u" && nucleo[1] && "eiéí".includes(nucleo[1])) return false;
  return true;
}

/** La palabra sin signos, en minúscula: «¿Dónde» → «dónde». */
export function limpia(w) {
  let t = "";
  for (const ch of String(w).toLowerCase()) if (!"¿?¡!.,:;".includes(ch)) t += ch;
  return t;
}

/** ¿Puede leer esta palabra en el escalón e? Devuelve el problema o "" si está bien. */
export function problemaPalabra(w, e) {
  const t = limpia(w);
  const s = VOCAB[t];
  if (!s) return `«${t}» no está en VOCAB`;
  if (s.join("") !== t) return `«${t}»: las sílabas no arman la palabra`;
  const cons = e.cons || TODAS;
  if (!e.trabadas && PALABRITAS.includes(t)) return unidades(t).filter(x => !VOCALES.includes(x)).every(c => cons.includes(c)) ? "" : `«${t}»: letra que no ha visto`;
  const mala = s.find(x => !silabaOk(x, cons, !!e.trabadas));
  return mala ? `«${t}»: la sílaba «${mala}» todavía no la ha visto` : "";
}

/** Consonantes que usa una palabra. */
export const consonantesDe = p => [...new Set(p.s.flatMap(x => unidades(x).filter(c => !VOCALES.includes(c))))];
const lee = (p, e) => !problemaPalabra(p.t, e);
const tieneNueva = (p, e) => !e.nuevas || consonantesDe(p).some(c => e.nuevas.includes(c));

const MIS = ["mamá", "papá", "gato", "casa", "cama", "pelota", "mochila", "maleta", "mano", "boca", "sopa", "galleta", "silla", "moto", "bota", "dado", "copa", "pato", "leche", "piña", "lupa", "mapa", "tina", "sofá"];

// ---------- Oraciones ----------
// El dibujo de la oración son dos: quién y qué (o dónde). Las otras opciones cambian uno de los dos.
const GENTE = ["la nena", "el niño", "mi mamá", "mi papá"];
const ANIMALES = ["el mono", "la lapa", "el gato", "el oso", "el pollito", "el sapo"];
export const PLANTILLAS = [
  { quien: [...GENTE, ...ANIMALES], verbo: "come", que: ["banano", "piña", "mango", "sandía", "pan", "pepino", "camote", "pera", "tomate", "galleta"] },
  { quien: [...GENTE, "el bebé", "el gato"], verbo: "toma", que: ["leche", "café", "fresco", "sopa"] },
  { quien: [...ANIMALES, "la araña"], verbo: "está en", que: ["la cama", "la silla", "el árbol", "la casa", "el sofá", "la tina"] },
  { quien: [...GENTE, "el bebé"], verbo: "tiene", que: ["una pelota", "un globo", "una mochila", "un tambor", "una moneda", "una maleta", "una flor", "un dado", "una campana"] },
];

// ---------- Leé y hacé ----------
const COLORES = [
  { bola: "🟡", cuadro: "🟨", f: "amarilla", m: "amarillo" }, { bola: "🟣", cuadro: "🟪", f: "morada", m: "morado" },
  { bola: "🟤", cuadro: "🟫", f: "café", m: "café" }, { bola: "⚫", cuadro: "⬛", f: "negra", m: "negro" },
  { bola: "⚪", cuadro: "⬜", f: "blanca", m: "blanco" },
];
const NUMEROS = ["", "un", "dos", "tres", "cuatro"];
const CONTABLES = [["pato", "patos"], ["gato", "gatos"], ["mono", "monos"], ["sapo", "sapos"], ["globo", "globos"], ["pollito", "pollitos"], ["estrella", "estrellas"]];
export const CLASES = {
  fruta: { texto: "Tocá la fruta.", son: ["banano", "piña", "mango", "sandía", "pera", "limón"], otras: ["gato", "pelota", "casa", "oso", "globo", "silla", "moto", "pato"] },
  animal: { texto: "Tocá el animal.", son: ["gato", "mono", "oso", "sapo", "caballo", "pato", "tortuga", "araña"], otras: ["pelota", "casa", "banano", "silla", "globo", "moto", "camión", "flor"] },
  mar: { texto: "Tocá el animal del mar.", son: ["delfín", "pulpo", "tiburón", "foca"], otras: ["gato", "mono", "oso", "caballo", "toro", "llama", "lobo"] },
  plumas: { texto: "Tocá el animal con plumas.", son: ["lapa", "pato", "gallo", "paloma", "pollito"], otras: ["gato", "mono", "oso", "sapo", "caballo", "toro", "lobo", "araña"] },
};

// ---------- ¿Sí o no? ----------
// Solo cosas que son ciertas (o falsas) siempre
export const SINO = [
  ["El pato nada.", "🦆", true], ["Las estrellas salen de noche.", "⭐", true], ["La leche es blanca.", "🥛", true],
  ["El mono come banano.", "🐒", true], ["La lapa tiene plumas.", "🦜", true], ["El fuego es caliente.", "🔥", true],
  ["El delfín nada.", "🐬", true], ["La piña es una fruta.", "🍍", true], ["El gallo canta.", "🐓", true],
  ["La araña tiene ocho patas.", "🕷️", true], ["El caballo tiene cuatro patas.", "🐴", true], ["El bebé toma leche.", "👶", true],
  ["El sol sale de día.", "☀️", true], ["La foca nada.", "🦭", true],
  ["El sapo tiene plumas.", "🐸", false], ["La piña es un animal.", "🍍", false], ["La leche es negra.", "🥛", false],
  ["El oso es una fruta.", "🐻", false], ["El caballo tiene dos patas.", "🐴", false], ["El fuego es frío.", "🔥", false],
  ["El pato tiene pelo.", "🦆", false], ["La pelota come sopa.", "⚽", false], ["Las motos comen pan.", "🏍️", false],
  ["El sol sale de noche.", "☀️", false], ["La araña tiene dos patas.", "🕷️", false], ["El tren come banano.", "🚂", false],
].map(([texto, e, si]) => ({ texto, e, si }));

// ---------- Dos oraciones y una pregunta ----------
const NOMBRES = ["Lola", "Pepe", "Ana", "Memo", "Tito", "Nico", "Sofía", "Pablo", "Dani"];
const MASCOTAS = ["un gato", "un pato", "un pollito", "una tortuga", "un sapo"];
const FRUTAS = ["banano", "piña", "mango", "sandía", "pera", "limón"];
const ESTAN = ["el gato", "la lapa", "el mono", "el pollito", "el sapo"];
const LUGARES = ["la cama", "la silla", "el árbol", "la casa", "el sofá", "la tina"];
const MUCHOS = [["globos", "🎈"], ["mangos", "🥭"], ["monedas", "🪙"], ["galletas", "🍪"]];

// ---------- 🪜 Escalones ----------
//   oir: se oye la palabra (y se ve) y se toca su dibujo · leer: se lee la palabra y se toca su dibujo
//   elegir: se ve el dibujo y se escoge la palabra · mezcla: leer o elegir
//   frase: «el sapo», «una pera» · oracion: «El mono come banano.» y su dibujo
//   hacer: «Tocá la bola morada.» · sino: ¿es cierto? · pregunta: dos oraciones y una pregunta
//   solito: oraciones de los escalones anteriores, sin que suene nada al tocar las palabras
export const ESCALONES = [
  { nombre: "Oí y tocá", tipo: "oir", cons: C1, largo: [2, 2], ops: 2 },                       //  1. mamá, sapo, oso
  { nombre: "Oí y tocá (3)", tipo: "oir", cons: GRUPO_A, largo: [2, 2], ops: 3 },             //  2. + mono, pato, luna
  { nombre: "Leé la palabra", tipo: "leer", cons: C1, largo: [2, 2], ops: 2 },                //  3. sin que la diga la voz
  { nombre: "¿Cuál dice?", tipo: "elegir", cons: C1, largo: [2, 2], ops: 2 },                 //  4. del dibujo a la palabra
  { nombre: "Más palabras", tipo: "leer", cons: GRUPO_A, nuevas: ["t", "n"], largo: [2, 3], ops: 3 }, // 5. tomate, pelota
  { nombre: "¿Cuál dice? (3)", tipo: "elegir", cons: GRUPO_A, largo: [2, 3], ops: 3 },        //  6.
  { nombre: "d c r b f g", tipo: "mezcla", cons: GRUPO_B, nuevas: NUEVAS_B, largo: [2, 4], ops: 3 }, // 7. casa, gato, banano
  { nombre: "ñ, ll y ch", tipo: "mezcla", cons: TODAS, nuevas: DIFICILES, largo: [2, 3], ops: 3 },   // 8. piña, silla, leche
  { nombre: "el sapo, una pera", tipo: "frase", cons: TODAS, ops: 3 },                        //  9.
  { nombre: "sol, pan, flor", tipo: "mezcla", cons: TODAS, trabadas: true, soloTrabadas: true, largo: [1, 4], ops: 3 }, // 10.
  { nombre: "Leé la oración", tipo: "oracion", cons: TODAS, trabadas: true, ops: 3 },          // 11.
  { nombre: "Leé y hacé", tipo: "hacer", cons: TODAS, trabadas: true, ops: 4 },               // 12.
  { nombre: "¿Sí o no?", tipo: "sino", cons: TODAS, trabadas: true, ops: 2 },                 // 13.
  { nombre: "Leé y respondé", tipo: "pregunta", cons: TODAS, trabadas: true, ops: 3 },        // 14.
  { nombre: "Leé solito", tipo: "solito", cons: TODAS, trabadas: true },                      // 15.
];
export const inicioPorEdad = edad => (edad === null || edad <= 5 ? 0 : edad === 6 ? 2 : edad === 7 ? 4 : 8);

const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
const con = p => `${p.a} ${p.t}`; // «el sapo»

/** Una ronda para el escalón i (sin repetir la anterior). */
export function ronda(i, rnd = Math.random, antes = "") {
  const e = ESCALONES[i];
  let r = null;
  for (let intento = 0; intento < 30; intento++) {
    r = armar(e, rnd);
    if (r.clave !== antes) break;
  }
  return { ...r, escalon: i };
}

// La palabra y sus opciones (dibujos que se parecen poco entre sí, y alguno con una sílaba igual, para que haya que leer todo)
function palabraYOtras(e, rnd) {
  const pool = PALABRAS.filter(p => lee(p, e) && p.s.length >= e.largo[0] && p.s.length <= e.largo[1]);
  const metas = pool.filter(p => tieneNueva(p, e) && (!e.soloTrabadas || !p.s.every(directa)));
  const p = azar(metas, rnd);
  const posibles = pool.filter(o => o !== p && !chocan(o.t, p.t));
  const parecidas = barajar(posibles.filter(o => o.s.some(s => p.s.includes(s))), rnd);
  const otras = [];
  for (const o of [...parecidas.slice(0, 1), ...barajar(posibles, rnd)]) {
    if (otras.length >= e.ops - 1) break;
    if (!otras.includes(o) && otras.every(x => !chocan(x.t, o.t))) otras.push(o);
  }
  return { p, opciones: barajar([p, ...otras], rnd) };
}

function armar(e, rnd) {
  const tipo = e.tipo === "mezcla" ? (rnd() < 0.5 ? "leer" : "elegir") : e.tipo;
  if (tipo === "oir" || tipo === "leer" || tipo === "elegir") {
    const { p, opciones } = palabraYOtras(e, rnd);
    return {
      tipo, voz: true, palabra: p, piezas: tipo === "elegir" ? [] : p.s, lineas: [], dibujo: tipo === "elegir" ? p.e : "",
      meta: p.t, opciones: opciones.map(o => ({ id: o.t, e: o.e, t: o.t, a: o.a, dicho: con(o) })),
      dicho: p.s.length > 1 ? `${p.s.join(", ")}. ¡${cap(p.t)}!` : `¡${cap(p.t)}!`, lectura: p.s.length > 1 ? `${p.s.join(", ")}. ${p.t}.` : `${p.t}.`, clave: p.t,
    };
  }
  if (tipo === "frase") {
    const pool = PALABRAS.filter(p => lee(p, e));
    const p = azar(pool, rnd);
    // «mi» solo con lo que uno tiene (mi gato, mi casa); «el ocho» nunca «un ocho»
    const arts = p.t === "ocho" ? [p.a] : [p.a, p.a === "la" ? "una" : "un", ...(MIS.includes(p.t) ? ["mi"] : [])];
    const art = azar(arts, rnd);
    const parecidas = barajar(pool.filter(o => o !== p && !chocan(o.t, p.t) && o.s.some(s => p.s.includes(s))), rnd);
    const otras = [];
    for (const o of [...parecidas.slice(0, 1), ...barajar(pool, rnd)]) {
      if (otras.length >= e.ops - 1) break;
      if (o !== p && !chocan(o.t, p.t) && !otras.includes(o) && otras.every(x => !chocan(x.t, o.t))) otras.push(o);
    }
    const texto = `${art} ${p.t}`;
    return {
      tipo, voz: true, palabra: p, piezas: [], lineas: [texto.split(" ")], dibujo: "", meta: p.t,
      opciones: barajar([p, ...otras], rnd).map(o => ({ id: o.t, e: o.e, t: o.t, a: o.a, dicho: con(o) })),
      dicho: `¡${cap(texto)}!`, lectura: `${texto}.`, clave: texto,
    };
  }
  if (tipo === "oracion") return oracion(e, rnd);
  if (tipo === "hacer") return hacer(e, rnd);
  if (tipo === "sino") return sino(rnd);
  if (tipo === "pregunta") return pregunta(rnd);
  // solito: una de las anteriores, sin voz al tocar
  const r = azar([oracion, hacer, (_, x) => sino(x), (_, x) => pregunta(x)], rnd)(e, rnd);
  return { ...r, voz: false, solito: true };
}

function oracion(e, rnd) {
  const pl = azar(PLANTILLAS, rnd);
  const quien = azar(pl.quien, rnd), que = azar(pl.que, rnd);
  const otroQuien = azar(pl.quien.filter(q => q !== quien && !chocan(q.split(" ").pop(), quien.split(" ").pop())), rnd);
  const otroQue = azar(pl.que.filter(q => q !== que), rnd);
  const texto = `${cap(quien)} ${pl.verbo} ${que}.`;
  const escena = (a, b) => ({ id: `${a}|${b}`, e: dib(a) + dib(b), quien: a, que: b, t: `${a}, ${b}`, dicho: "" });
  return {
    tipo: "oracion", voz: true, piezas: [], lineas: [texto.split(" ")], dibujo: "", meta: `${quien}|${que}`,
    opciones: barajar([escena(quien, que), escena(otroQuien, que), escena(quien, otroQue)], rnd),
    dicho: texto, lectura: texto, clave: texto,
  };
}

function hacer(e, rnd) {
  const sub = azar(["bola", "cuadro", "contar", "clase", "clase"], rnd);
  if (sub === "bola" || sub === "cuadro") {
    const cols = barajar(COLORES, rnd).slice(0, 4), c = cols[0];
    const texto = sub === "bola" ? `Tocá la bola ${c.f}.` : `Tocá el cuadro ${c.m}.`;
    return {
      tipo: "hacer", sub, voz: true, piezas: [], lineas: [texto.split(" ")], dibujo: "", meta: c.f,
      opciones: barajar(cols, rnd).map(x => ({ id: x.f, e: x[sub], color: x.f, t: sub === "bola" ? `bola ${x.f}` : `cuadro ${x.m}`, dicho: sub === "bola" ? `Esa es la bola ${x.f}` : `Ese es el cuadro ${x.m}` })),
      dicho: texto, lectura: texto, clave: texto,
    };
  }
  if (sub === "contar") {
    const [uno, varios] = azar(CONTABLES, rnd), n = 1 + Math.floor(rnd() * 4);
    const e1 = POR_PALABRA[uno].e;
    const cosa = k => (k === 1 ? `${uno === "estrella" ? "una" : "un"} ${uno}` : `${NUMEROS[k]} ${varios}`);
    const texto = n === 1 ? `Tocá donde está ${cosa(1)}.` : `Tocá donde están ${cosa(n)}.`;
    return {
      tipo: "hacer", sub, voz: true, piezas: [], lineas: [texto.split(" ")], dibujo: "", meta: String(n),
      opciones: barajar([1, 2, 3, 4], rnd).map(k => ({ id: String(k), e: e1.repeat(k), n: k, t: cosa(k), dicho: k === 1 ? `Ahí está ${cosa(1)}` : `Ahí están ${cosa(k)}` })),
      dicho: texto, lectura: texto, clave: texto,
    };
  }
  const nombre = azar(Object.keys(CLASES), rnd), cl = CLASES[nombre];
  const si = azar(cl.son, rnd), no = barajar(cl.otras, rnd).slice(0, 3);
  const texto = cl.texto;
  return {
    tipo: "hacer", sub: "clase", clase: nombre, voz: true, piezas: [], lineas: [texto.split(" ")], dibujo: "", meta: si,
    opciones: barajar([si, ...no], rnd).map(w => ({ id: w, e: POR_PALABRA[w].e, t: w, dicho: `${POR_PALABRA[w].a === "la" ? "Esa es la" : "Ese es el"} ${w}` })),
    dicho: texto, lectura: texto, clave: `${texto}${si}`,
  };
}

function sino(rnd) {
  const s = azar(SINO, rnd);
  return {
    tipo: "sino", voz: true, piezas: [], lineas: [s.texto.split(" ")], dibujo: s.e, meta: s.si ? "si" : "no",
    opciones: [{ id: "si", e: "👍", t: "Sí", dicho: "" }, { id: "no", e: "👎", t: "No", dicho: "" }],
    dicho: `${s.texto} ${s.si ? "¡Sí, es cierto!" : "¡No, no es cierto!"}`, lectura: s.texto, clave: s.texto,
  };
}

function pregunta(rnd) {
  const [a, b] = barajar(NOMBRES, rnd);
  const cual = rnd() < 0.5 ? 0 : 1;
  const sub = azar(["mascota", "fruta", "donde", "cuantos"], rnd);
  let frases, meta, opciones;
  if (sub === "mascota") {
    const [x, y, z] = barajar(MASCOTAS, rnd);
    frases = [`${a} tiene ${x}.`, `${b} tiene ${y}.`, `Tocá la mascota de ${[a, b][cual]}.`];
    meta = [x, y][cual];
    opciones = [x, y, z].map(m => ({ id: m, e: dib(m), t: m, dicho: "" }));
  } else if (sub === "fruta") {
    const [x, y, z] = barajar(FRUTAS, rnd);
    frases = [`${a} come ${x}.`, `${b} come ${y}.`, `¿Cuál fruta come ${[a, b][cual]}?`];
    meta = [x, y][cual];
    opciones = [x, y, z].map(m => ({ id: m, e: dib(m), t: m, dicho: "" }));
  } else if (sub === "donde") {
    const [x, y] = barajar(ESTAN, rnd), [l1, l2, l3] = barajar(LUGARES, rnd);
    frases = [`${cap(x)} está en ${l1}.`, `${cap(y)} está en ${l2}.`, `¿Dónde está ${[x, y][cual]}?`];
    meta = [l1, l2][cual];
    opciones = [l1, l2, l3].map(m => ({ id: m, e: dib(m), t: m, dicho: "" }));
  } else {
    const [cosas, e1] = azar(MUCHOS, rnd);
    const [n1, n2] = barajar([2, 3, 4], rnd).slice(0, 2);
    const n3 = [1, 2, 3, 4].filter(k => k !== n1 && k !== n2)[Math.floor(rnd() * 2)];
    frases = [`${a} tiene ${NUMEROS[n1]} ${cosas}.`, `${b} tiene ${NUMEROS[n2]} ${cosas}.`, `¿Cuántos ${cosas} tiene ${[a, b][cual]}?`];
    // «monedas» y «galletas» son femeninas: ¿cuántas?
    if (cosas === "monedas" || cosas === "galletas") frases[2] = frases[2].replace("Cuántos", "Cuántas");
    meta = String([n1, n2][cual]);
    opciones = [n1, n2, n3].map(k => ({ id: String(k), e: e1.repeat(k), n: k, t: `${k} ${cosas}`, dicho: "" }));
  }
  const texto = frases.join(" ");
  return {
    tipo: "pregunta", sub, voz: true, piezas: [], lineas: frases.map(f => f.split(" ")), dibujo: "", meta,
    opciones: barajar(opciones, rnd), dicho: texto, lectura: texto, clave: texto,
  };
}

// ---------- Revisión (node) ----------
/** Revisa una ronda: devuelve la lista de problemas (vacía = bien). */
export function revisarRonda(r) {
  const mal = [];
  const e = ESCALONES[r.escalon];
  const ee = r.solito ? { ...e, trabadas: true, cons: TODAS } : e;
  // Lo que se lee: solo sílabas que ya vio
  const palabras = [...(r.piezas.length ? [r.palabra.t] : []), ...r.lineas.flat(), ...(r.tipo === "elegir" ? r.opciones.map(o => o.t) : [])];
  for (const w of palabras) { const p = problemaPalabra(w, ee); if (p) mal.push(p); }
  // Opciones
  const ids = r.opciones.map(o => o.id), dibs = r.opciones.map(o => o.e);
  if (new Set(ids).size !== ids.length) mal.push("opciones repetidas");
  if (new Set(dibs).size !== dibs.length) mal.push("dibujos repetidos");
  if (!ids.includes(r.meta)) mal.push("la respuesta no está entre las opciones");
  if (e.ops && !r.solito && r.opciones.length !== e.ops) mal.push(`hay ${r.opciones.length} opciones`);
  if (["oir", "leer", "elegir", "frase"].includes(r.tipo)) {
    // Cada dibujo es de una sola palabra, y la de la respuesta es la de la palabra
    if (r.opciones.some(o => POR_PALABRA[o.id]?.e !== o.e)) mal.push("dibujo que no es de su palabra");
    if (r.opciones.some((o, k) => r.opciones.some((x, j) => j > k && chocan(o.id, x.id)))) mal.push("dibujos que se confunden");
    if (r.tipo !== "frase" && r.palabra.s.join("") !== r.meta) mal.push("la palabra no es la respuesta");
  }
  if (r.tipo === "oracion") {
    const [q, x] = r.meta.split("|");
    if (!r.lineas[0].join(" ").toLowerCase().startsWith(q) || !r.lineas[0].join(" ").endsWith(`${x}.`)) mal.push("la oración no dice la respuesta");
    if (r.opciones.filter(o => o.quien === q && o.que === x).length !== 1) mal.push("más de un dibujo sirve");
  }
  if (r.tipo === "hacer") {
    const sirven = r.opciones.filter(o => (r.sub === "contar" ? o.n === Number(r.meta) : r.sub === "clase" ? CLASES[r.clase].son.includes(o.id) : o.color === r.meta));
    if (sirven.length !== 1) mal.push(`en «${r.dicho}» sirven ${sirven.length}`);
    if (r.sub === "clase" && r.opciones.some(o => !CLASES[r.clase].son.includes(o.id) && !CLASES[r.clase].otras.includes(o.id))) mal.push("opción sin clase");
  }
  if (r.tipo === "pregunta") {
    if (r.lineas.length !== 3) mal.push("no son dos oraciones y una pregunta");
    const texto = r.lineas.flat().join(" ");
    if (r.sub !== "cuantos" && !texto.includes(r.meta)) mal.push("la respuesta no sale en las oraciones");
    if (r.sub === "cuantos" && !texto.includes(` ${NUMEROS[Number(r.meta)]} `)) mal.push("el número no sale en las oraciones");
  }
  if (r.tipo === "sino" && !["si", "no"].includes(r.meta)) mal.push("sí o no mal puesto");
  return mal;
}

/** Revisa los datos y miles de rondas de cada escalón. Devuelve [] si todo está bien. */
export function revisarLeo(n = 3000, rnd = Math.random) {
  const mal = new Set();
  const dibs = PALABRAS.map(p => p.e), ts = PALABRAS.map(p => p.t);
  if (new Set(dibs).size !== dibs.length) mal.add("dibujos repetidos en PALABRAS");
  if (new Set(ts).size !== ts.length) mal.add("palabras repetidas en PALABRAS");
  for (const p of PALABRAS) {
    if (!["el", "la"].includes(p.a)) mal.add(`${p.t}: sin artículo`);
    const pr = problemaPalabra(p.t, { cons: TODAS, trabadas: true });
    if (pr) mal.add(pr);
  }
  // Las listas de las plantillas, clases y preguntas usan palabras con dibujo
  const conDibujo = w => !!POR_PALABRA[w.split(" ").pop()];
  for (const pl of PLANTILLAS) for (const w of [...pl.quien, ...pl.que]) if (!conDibujo(w)) mal.add(`«${w}» sin dibujo`);
  for (const [k, cl] of Object.entries(CLASES)) {
    for (const w of [...cl.son, ...cl.otras]) if (!POR_PALABRA[w]) mal.add(`${k}: «${w}» sin dibujo`);
    if (cl.son.some(w => cl.otras.includes(w))) mal.add(`${k}: palabra en las dos listas`);
  }
  for (const w of [...MASCOTAS, ...FRUTAS, ...ESTAN, ...LUGARES]) if (!conDibujo(w)) mal.add(`«${w}» sin dibujo`);
  for (const s of SINO) for (const w of s.texto.split(" ")) { const p = problemaPalabra(w, { cons: TODAS, trabadas: true }); if (p) mal.add(p); }
  // Para escalones de palabras: que haya de dónde escoger
  ESCALONES.forEach((e, i) => {
    if (!e.largo) return;
    const pool = PALABRAS.filter(p => lee(p, e) && p.s.length >= e.largo[0] && p.s.length <= e.largo[1]);
    const metas = pool.filter(p => tieneNueva(p, e) && (!e.soloTrabadas || !p.s.every(directa)));
    if (metas.length < 6) mal.add(`escalón ${i + 1}: solo ${metas.length} palabras`);
  });
  for (let i = 0; i < ESCALONES.length; i++) {
    let antes = "";
    for (let k = 0; k < n; k++) {
      const r = ronda(i, rnd, antes);
      antes = r.clave;
      for (const m of revisarRonda(r)) mal.add(`escalón ${i + 1} (${r.tipo}): ${m}`);
    }
  }
  return [...mal];
}
