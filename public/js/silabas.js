// 🔤 Lógica de «Sílabas mágicas» (sin pantalla, para poder probarla sola con node).
// El método silábico de primer grado: vocales → ma me mi mo mu → armar la sílaba → armar y leer palabras → oraciones.
// Solo se usan sílabas directas (consonante + vocal, o una vocal sola), como al empezar a leer.

export const VOCALES = ["a", "e", "i", "o", "u"];
// Cómo se llama cada letra (la voz dice «la eme»)
export const NOMBRE = {
  a: "a", e: "e", i: "i", o: "o", u: "u",
  m: "eme", p: "pe", s: "ese", l: "ele", t: "te", n: "ene", d: "de", c: "ce", r: "erre", b: "be", f: "efe", g: "ge",
  "ñ": "eñe", ll: "elle", ch: "che",
};
// Grupos de consonantes en el orden en que se aprenden
export const GRUPO_A = ["m", "p", "s", "l", "t", "n"];
export const NUEVAS_B = ["d", "c", "r", "b", "f", "g"];
export const GRUPO_B = [...GRUPO_A, ...NUEVAS_B];
export const DIFICILES = ["ñ", "ll", "ch"];
export const TODAS = [...GRUPO_B, ...DIFICILES];

/** Sílabas de una consonante: con c y g solo ca co cu y ga go gu (ce, ci, ge, gi suenan distinto). */
export const silabasDe = c => (c === "c" || c === "g" ? ["a", "o", "u"] : VOCALES).map(v => c + v);

const SIN_TILDE = { á: "a", é: "e", í: "i", ó: "o", ú: "u" };
/** La consonante de una sílaba («" para «u» sola) y su vocal sin tilde. */
export const partes = s => ({ c: s.slice(0, -1), v: SIN_TILDE[s.slice(-1)] || s.slice(-1) });
/** ¿Es una sílaba directa (consonante + vocal, o una vocal)? */
export const directa = s => /^(ch|ll|[bcdfglmnprstñ])?[aeiouáéíóú]$/.test(s) && !/^[cg][eiéí]$/.test(s);

// Palabras con dibujo: sílabas, dibujo y artículo (para decir «ese es el pato»)
export const PALABRAS = [
  // m p s l t n
  { s: ["ma", "no"], e: "✋", a: "la" }, { s: ["mo", "no"], e: "🐒", a: "el" }, { s: ["pa", "to"], e: "🦆", a: "el" },
  { s: ["ma", "pa"], e: "🗺️", a: "el" }, { s: ["mo", "to"], e: "🏍️", a: "la" }, { s: ["so", "pa"], e: "🍲", a: "la" },
  { s: ["lu", "na"], e: "🌙", a: "la" }, { s: ["la", "ta"], e: "🥫", a: "la" }, { s: ["pi", "la"], e: "🔋", a: "la" },
  { s: ["pa", "pa"], e: "🥔", a: "la" }, { s: ["no", "ta"], e: "🎵", a: "la" },
  { s: ["to", "ma", "te"], e: "🍅", a: "el" }, { s: ["pe", "lo", "ta"], e: "⚽", a: "la" }, { s: ["ma", "le", "ta"], e: "🧳", a: "la" },
  // d c r b f g
  { s: ["da", "do"], e: "🎲", a: "el" }, { s: ["de", "do"], e: "👆", a: "el" }, { s: ["mo", "ne", "da"], e: "🪙", a: "la" },
  { s: ["ca", "sa"], e: "🏠", a: "la" }, { s: ["ca", "ma"], e: "🛏️", a: "la" }, { s: ["co", "pa"], e: "🏆", a: "la" },
  { s: ["co", "co"], e: "🥥", a: "el" }, { s: ["pe", "ra"], e: "🍐", a: "la" }, { s: ["lo", "ro"], e: "🦜", a: "el" },
  { s: ["to", "ro"], e: "🐂", a: "el" }, { s: ["ro", "sa"], e: "🌹", a: "la" }, { s: ["ra", "na"], e: "🐸", a: "la" },
  { s: ["bo", "ta"], e: "👢", a: "la" }, { s: ["bo", "ca"], e: "👄", a: "la" }, { s: ["nu", "be"], e: "☁️", a: "la" },
  { s: ["lo", "bo"], e: "🐺", a: "el" }, { s: ["be", "bé"], e: "👶", a: "el" }, { s: ["fo", "ca"], e: "🦭", a: "la" },
  { s: ["fo", "co"], e: "💡", a: "el" }, { s: ["so", "fá"], e: "🛋️", a: "el" }, { s: ["ga", "to"], e: "🐱", a: "el" },
  { s: ["go", "ta"], e: "💧", a: "la" }, { s: ["ma", "go"], e: "🧙", a: "el" }, { s: ["gu", "sa", "no"], e: "🐛", a: "el" },
  // ñ ll ch
  { s: ["pi", "ña"], e: "🍍", a: "la" }, { s: ["ni", "ño"], e: "👦", a: "el" }, { s: ["u", "ña"], e: "💅", a: "la" },
  { s: ["a", "ra", "ña"], e: "🕷️", a: "la" }, { s: ["po", "llo"], e: "🍗", a: "el" }, { s: ["si", "lla"], e: "🪑", a: "la" },
  { s: ["lla", "ma"], e: "🦙", a: "la" }, { s: ["ga", "lle", "ta"], e: "🍪", a: "la" }, { s: ["le", "che"], e: "🥛", a: "la" },
  { s: ["o", "cho"], e: "8️⃣", a: "el" }, { s: ["mo", "chi", "la"], e: "🎒", a: "la" }, { s: ["chi", "le"], e: "🌶️", a: "el" },
].map(p => ({ ...p, t: p.s.join("") }));
export const CON_DIBUJO = PALABRAS.filter(p => p.e);

/** Consonantes que usa una palabra. */
export const consonantesDe = p => [...new Set(p.s.map(s => partes(s).c).filter(Boolean))];
const cabe = (p, cons) => consonantesDe(p).every(c => cons.includes(c));

// Oraciones de 3 a 6 palabras con un hueco: lo que va en el hueco se escoge por el dibujo.
// x: [lo que va en el hueco, dibujo]. Todas las palabras tienen sílabas directas (y algunas cortitas: el, es, una).
export const ORACIONES = [
  { t: "papá toma ___", x: [["sopa", "🍲"], ["leche", "🥛"], ["café", "☕"]] },
  { t: "___ nada", x: [["la foca", "🦭"], ["la rana", "🐸"], ["el pato", "🦆"]] },
  { t: "mi mamá me da una ___", x: [["pera", "🍐"], ["piña", "🍍"], ["galleta", "🍪"], ["moneda", "🪙"]] },
  { t: "el ___ come", x: [["gato", "🐱"], ["mono", "🐒"], ["toro", "🐂"], ["loro", "🦜"]] },
  { t: "el niño come ___", x: [["piña", "🍍"], ["pera", "🍐"], ["papa", "🥔"], ["coco", "🥥"]] },
  { t: "mi ___ es bonita", x: [["casa", "🏠"], ["cama", "🛏️"], ["mochila", "🎒"], ["maleta", "🧳"]] },
  { t: "la nena toma ___", x: [["sopa", "🍲"], ["leche", "🥛"], ["café", "☕"]] },
];

// 🪜 Escalones (de a poquito). tipo:
//   "oir": se oye una vocal o sílaba y se toca · "vocal": falta la vocal (m + ? = mo) · "consonante": falta la letra (? + a = la)
//   "armar": con el dibujo, se tocan las sílabas en orden · "leer": se lee la palabra (o la oración) y se toca su dibujo
//   "oracion": se lee la oración y se toca el dibujo que va en el hueco
// voz: al tocar una sílaba o palabra suena (si es false, el 💡 la dice, y cuenta como ayuda)
export const ESCALONES = [
  { nombre: "Las vocales", tipo: "oir", vocales: true, ops: 2 },                       //  1. a e i o u, entre 2
  { nombre: "Las vocales (3)", tipo: "oir", vocales: true, ops: 3 },                   //  2. entre 3
  { nombre: "ma me mi mo mu", tipo: "oir", cons: ["m"], ops: 2 },                      //  3. misma letra, hay que oír la vocal
  { nombre: "ma me mi mo mu (3)", tipo: "oir", cons: ["m"], ops: 3 },                  //  4.
  { nombre: "Con m y p", tipo: "oir", cons: ["m", "p"], ops: 3 },                      //  5. ma o pa: hay que oír la letra también
  { nombre: "Armá la sílaba: ¿qué vocal?", tipo: "vocal", cons: ["m", "p", "s"], ops: 3 }, // 6. m + ? = mo
  { nombre: "m p s l t n", tipo: "oir", cons: GRUPO_A, ops: 3 },                       //  7.
  { nombre: "Armá la sílaba: ¿qué letra?", tipo: "consonante", cons: GRUPO_A, ops: 3 }, // 8. ? + a = la
  { nombre: "Armá la palabra", tipo: "armar", cons: GRUPO_A, largo: [2, 2], extra: 1 }, //  9. ma + no = mano (con una sílaba de más)
  { nombre: "Leé la palabra", tipo: "leer", cons: GRUPO_A, largo: [2, 2], ops: 2, voz: true }, // 10. tocando cada sílaba, que suena
  { nombre: "d c r b f g", tipo: "oir", cons: NUEVAS_B, ops: 3 },                      // 11. ca co cu, ga go gu…
  { nombre: "Armá palabras más largas", tipo: "armar", cons: GRUPO_B, largo: [2, 3], extra: 2 }, // 12. to + ma + te
  { nombre: "Leé más palabras", tipo: "leer", cons: GRUPO_B, largo: [2, 3], ops: 3, voz: true }, // 13.
  { nombre: "ñ, ll y ch", tipo: "oir", cons: DIFICILES, ops: 3 },                      // 14. ña, llo, che…
  { nombre: "Leé la oración", tipo: "oracion", ops: 3, voz: true },                    // 15. papá toma sopa
  { nombre: "Leé solito", tipo: "leer", cons: TODAS, largo: [2, 3], ops: 3, voz: false, oraciones: true }, // 16. sin voz al tocar
];
export const inicioPorEdad = edad => (edad === null || edad <= 5 ? 0 : edad === 6 ? 2 : 6);

const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const entre = ([a, b], rnd) => a + Math.floor(rnd() * (b - a + 1));

/** Escoge n distintos de una lista (sin repetir), con el primero ya puesto. */
function conOtros(meta, lista, n, rnd) {
  return [meta, ...barajar(lista.filter(x => x !== meta), rnd).slice(0, n - 1)];
}

/**
 * Una ronda para el escalón i. `antes` es la meta de la ronda anterior, para no repetirla seguida.
 * @returns {object} tipo y lo que hace falta para pintarla
 */
export function ronda(i, rnd = Math.random, antes = "") {
  const e = ESCALONES[i];
  for (let intento = 0; intento < 30; intento++) {
    const r = armarRonda(e, rnd);
    if (r.clave !== antes) return { ...r, escalon: i };
  }
  return { ...armarRonda(e, rnd), escalon: i };
}

function armarRonda(e, rnd) {
  if (e.tipo === "oir") {
    const pool = e.vocales ? VOCALES : e.cons.flatMap(silabasDe);
    const meta = azar(pool, rnd);
    return { tipo: "oir", vocales: !!e.vocales, meta, opciones: barajar(conOtros(meta, pool, e.ops, rnd), rnd), clave: meta };
  }
  if (e.tipo === "vocal") {
    const c = azar(e.cons, rnd), meta = azar(silabasDe(c).map(s => partes(s).v), rnd);
    const vocales = c === "c" || c === "g" ? ["a", "o", "u"] : VOCALES;
    return { tipo: "vocal", c, v: meta, silaba: c + meta, meta, opciones: barajar(conOtros(meta, vocales, e.ops, rnd), rnd), clave: c + meta };
  }
  if (e.tipo === "consonante") {
    const v = azar(["a", "o", "u"], rnd), meta = azar(e.cons, rnd);
    return { tipo: "consonante", c: meta, v, silaba: meta + v, meta, opciones: barajar(conOtros(meta, e.cons, e.ops, rnd), rnd), clave: meta + v };
  }
  if (e.tipo === "armar") {
    const lista = CON_DIBUJO.filter(p => cabe(p, e.cons) && p.s.length >= e.largo[0] && p.s.length <= e.largo[1]);
    const palabra = azar(lista, rnd);
    const otras = barajar(e.cons.flatMap(silabasDe).filter(s => !palabra.s.includes(s)), rnd).slice(0, e.extra);
    return { tipo: "armar", palabra, fichas: barajar([...palabra.s, ...otras], rnd), meta: palabra.t, clave: palabra.t };
  }
  if (e.tipo === "oracion" || (e.oraciones && rnd() < 0.5)) {
    const o = azar(ORACIONES, rnd);
    const [hueco, dibujo] = azar(o.x, rnd);
    const opciones = barajar(conOtros(hueco, o.x.map(x => x[0]), Math.min(e.ops, o.x.length), rnd), rnd)
      .map(h => ({ t: h, e: o.x.find(x => x[0] === h)[1] }));
    const texto = o.t.replace("___", hueco);
    return { tipo: "oracion", voz: e.voz !== false, texto, palabras: texto.split(" "), meta: hueco, dibujo, opciones, clave: texto };
  }
  // leer
  const lista = CON_DIBUJO.filter(p => cabe(p, e.cons) && p.s.length >= e.largo[0] && p.s.length <= e.largo[1]);
  const palabra = azar(lista, rnd);
  // Las otras opciones: dibujos distintos (si se puede, con alguna sílaba igual, para que haya que leer todo)
  const parecidas = barajar(CON_DIBUJO.filter(p => p !== palabra && p.s.some(s => palabra.s.includes(s))), rnd);
  const resto = barajar(CON_DIBUJO.filter(p => p !== palabra && !parecidas.includes(p)), rnd);
  const otras = [...parecidas.slice(0, 1), ...resto].slice(0, e.ops - 1);
  return { tipo: "leer", voz: e.voz !== false, palabra, meta: palabra.t, opciones: barajar([palabra, ...otras], rnd).map(p => ({ t: p.t, e: p.e, a: p.a })), clave: palabra.t };
}

/** Revisa una ronda. Devuelve una lista de problemas (vacía = bien). */
export function revisarRonda(r) {
  const mal = [];
  const e = ESCALONES[r.escalon];
  const ids = (r.opciones || []).map(o => (typeof o === "string" ? o : o.t));
  if (r.opciones && new Set(ids).size !== ids.length) mal.push("opciones repetidas");
  if (r.opciones && !ids.includes(r.meta)) mal.push("la respuesta no está entre las opciones");
  if (r.opciones && r.opciones.some(o => typeof o !== "string" && !o.e)) mal.push("opción sin dibujo");
  if (r.opciones && typeof r.opciones[0] !== "string" && new Set(r.opciones.map(o => o.e)).size !== r.opciones.length) mal.push("dibujos repetidos");
  if (r.tipo === "oir") {
    if (e.ops !== r.opciones.length) mal.push(`hay ${r.opciones.length} opciones`);
    if (!r.vocales && !r.opciones.every(directa)) mal.push("sílaba no directa");
    if (!r.vocales && !r.opciones.every(s => e.cons.includes(partes(s).c))) mal.push("sílaba de otro grupo");
  }
  if (r.tipo === "vocal" && (r.c + r.meta !== r.silaba || !directa(r.silaba))) mal.push("sílaba mal armada");
  if (r.tipo === "consonante" && (r.meta + r.v !== r.silaba || !directa(r.silaba))) mal.push("sílaba mal armada");
  if (r.tipo === "armar") {
    const sobran = [...r.fichas];
    for (const s of r.palabra.s) { const k = sobran.indexOf(s); if (k < 0) mal.push(`falta la ficha ${s}`); else sobran.splice(k, 1); }
    if (sobran.length !== e.extra) mal.push("fichas de más mal contadas");
    if (sobran.some(s => r.palabra.s.includes(s))) mal.push("una ficha de más también va en la palabra");
    if (!r.fichas.every(directa)) mal.push("ficha no directa");
  }
  if (r.tipo === "leer" && !r.palabra.s.every(directa)) mal.push("palabra con sílaba no directa");
  if (r.tipo === "oracion") {
    if (r.palabras.some(p => !p)) mal.push("palabra vacía");
    if (!r.texto.includes(r.meta)) mal.push("el hueco no quedó en la oración");
  }
  return mal;
}

/** Revisa las palabras y las oraciones (todas con sílabas directas, sin repetir dibujos). */
export function revisarPalabras() {
  const mal = [];
  for (const p of PALABRAS) {
    p.s.forEach(s => { if (!directa(s)) mal.push(`${p.t}: «${s}» no es directa`); });
    if (p.e && !["el", "la"].includes(p.a)) mal.push(`${p.t}: sin artículo`);
    if (!consonantesDe(p).every(c => TODAS.includes(c))) mal.push(`${p.t}: letra que no se enseña`);
  }
  const dib = CON_DIBUJO.map(p => p.e);
  if (new Set(dib).size !== dib.length) mal.push("dibujos repetidos en PALABRAS");
  for (const o of ORACIONES) {
    if (o.t.split("___").length !== 2) mal.push(`«${o.t}»: sin hueco`);
    if (new Set(o.x.map(x => x[1])).size !== o.x.length) mal.push(`«${o.t}»: dibujos repetidos`);
  }
  return mal;
}
