// 🍕 Lógica de «Fracciones con pizza y sandía» (sin pantalla, para poder probarla sola con node).
// Cada escalón arma rondas al azar de un tipo: pintar, ¿qué fracción es?, fracción de un grupo, comparar,
// equivalentes, sumar y restar, números mixtos y simplificar. `revisarRonda` comprueba que cada ronda
// tenga una sola respuesta correcta y opciones distintas.

// ---------- Números y fracciones en palabras (para la voz) ----------
const NUM = ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
  "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte"];
const DEN = { 2: ["medio", "medios"], 3: ["tercio", "tercios"], 4: ["cuarto", "cuartos"], 5: ["quinto", "quintos"],
  6: ["sexto", "sextos"], 7: ["séptimo", "séptimos"], 8: ["octavo", "octavos"], 9: ["noveno", "novenos"],
  10: ["décimo", "décimos"], 11: ["onceavo", "onceavos"], 12: ["doceavo", "doceavos"] };
export const MAX_DEN = 12;

/** «tres cuartos», «un medio», «siete quintos». */
export function enPalabras(n, d) {
  if (d === 1) return n === 1 ? "un entero" : `${NUM[n] ?? n} enteros`;
  return `${NUM[n] ?? n} ${DEN[d][n === 1 ? 0 : 1]}`;
}
/** «un entero y tres cuartos», «dos enteros y un medio». */
export const mixtoEnPalabras = (e, n, d) => `${e === 1 ? "un entero" : `${NUM[e] ?? e} enteros`} y ${enPalabras(n, d)}`;

/** Una fracción escrita bonita: numerador sobre denominador. */
export const fr = (n, d, extra = "") => `<span class="fr${extra}"><span class="nu">${n}</span><span class="de">${d}</span></span>`;
export const mixtoHTML = (e, n, d) => `<span class="mixto">${e}${fr(n, d)}</span>`;
// Con espacio duro, para que «₡7 200» no se parta en dos renglones
export const colones = v => "₡" + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");

export const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
export const mcm = (a, b) => a / mcd(a, b) * b;
const igual = (a, b) => a.n * b.d === b.n * a.d;

// ---------- Al azar ----------
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const entre = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

// ---------- Figuras y cosas ----------
// s: con artículo · de: con «de» (y «del» si es masculino) · f: femenino («partida» o «partido»)
export const FORMAS = {
  pizza: { s: "la pizza", de: "de la pizza", f: true, forma: "pizza" },
  sandia: { s: "la tajada de sandía", de: "de la tajada de sandía", f: true, forma: "sandia" },
  chocolate: { s: "la barra de chocolate", de: "de la barra de chocolate", f: true, forma: "barra" },
  queque: { s: "el queque", de: "del queque", f: false, forma: "pizza" },
};
const COSAS = [
  { e: "🥭", s: "mango", p: "mangos" }, { e: "🍌", s: "banano", p: "bananos" }, { e: "🍓", s: "fresa", p: "fresas" },
  { e: "🥚", s: "huevo", p: "huevos" }, { e: "🍊", s: "naranja", p: "naranjas" }, { e: "🎈", s: "globo", p: "globos" },
  { e: "🍪", s: "galleta", p: "galletas" }, { e: "⚽", s: "bola", p: "bolas" },
];
// Problemas con plata: quién, cuánto tiene y en qué gasta (la fracción se pone al armar)
const PLATA = [
  { quien: "Doña Rosa", tiene: "en el monedero", gasta: "en la feria" },
  { quien: "Mateo", tiene: "ahorrados", gasta: "en un regalo para la mamá" },
  { quien: "Valeria", tiene: "de la mesada", gasta: "en la pulpería" },
  { quien: "Don Carlos", tiene: "para el súper", gasta: "en frutas y verduras" },
  { quien: "Sofía", tiene: "en la alcancía", gasta: "en un libro" },
];

// ---------- 🪜 Escalones: de pintar medios a simplificar ----------
export const ESCALONES = [
  { id: "pintar-1", tipo: "pintar", dens: [2, 3, 4], nombre: "Pintar medios, tercios y cuartos" },          //  1
  { id: "cual-1", tipo: "cual", dens: [2, 3, 4], ops: 3, nombre: "¿Qué fracción está pintada?" },           //  2
  { id: "pintar-2", tipo: "pintar", dens: [5, 6, 8], nombre: "Pintar quintos, sextos y octavos" },          //  3
  { id: "cual-2", tipo: "cual", dens: [3, 4, 5, 6, 8, 10], ops: 4, nombre: "¿Qué fracción es? (más partes)" }, //  4
  { id: "grupo-1", tipo: "grupo", unitaria: true, dibujo: true, nombre: "La mitad, un tercio, un cuarto de un grupo" }, // 5
  { id: "comparar-1", tipo: "comparar", caso: "den", dibujo: true, nombre: "Comparar: mismo denominador" },  //  6
  { id: "grupo-2", tipo: "grupo", unitaria: false, dibujo: true, nombre: "¾ de 12: fracción de un grupo" },  //  7
  { id: "comparar-2", tipo: "comparar", caso: "num", dibujo: true, nombre: "Comparar: mismo numerador" },    //  8
  { id: "equivalentes", tipo: "equivalente", dibujo: true, nombre: "Fracciones equivalentes" },             //  9
  { id: "sumar", tipo: "sumar", dibujo: true, nombre: "Sumar y restar con igual denominador" },            // 10
  { id: "grupo-3", tipo: "grupo", unitaria: false, dibujo: false, nombre: "Fracción de una cantidad (y de plata)" }, // 11
  { id: "comparar-3", tipo: "comparar", caso: "distintas", dibujo: false, nombre: "Comparar con distinto denominador" }, // 12
  { id: "mixtos", tipo: "mixto", nombre: "Fracciones impropias y números mixtos" },                        // 13
  { id: "simplificar", tipo: "simplificar", nombre: "Simplificar" },                                        // 14
];

/** Escalón con que empieza cada edad (sin exagerar: es mejor subir rápido que frustrarse). */
export const inicioPorEdad = edad => edad === null || edad <= 8 ? 0 : edad === 9 ? 1 : edad === 10 ? 3 : edad === 11 ? 5 : 7;

// ---------- Generadores ----------
function opcionesNumero(correcta, candidatos, cuantas, rnd) {
  const ops = [correcta];
  for (const c of barajar(candidatos, rnd)) if (ops.length < cuantas && c > 0 && Number.isInteger(c) && !ops.includes(c)) ops.push(c);
  let extra = 1;
  while (ops.length < cuantas) { const c = correcta + (extra % 2 ? 1 : -1) * Math.ceil(extra / 2); extra++; if (c > 0 && !ops.includes(c)) ops.push(c); }
  return barajar(ops, rnd).map(v => ({ id: String(v), html: String(v), voz: String(v), v }));
}
function opcionesFraccion(correcta, candidatas, cuantas, rnd, html = f => fr(f.n, f.d), voz = f => enPalabras(f.n, f.d)) {
  const ops = [correcta];
  for (const c of barajar(candidatas, rnd)) {
    if (ops.length >= cuantas) break;
    if (c.n < 1 || c.d < 2 || c.d > MAX_DEN || igual(c, correcta) || ops.some(o => o.n === c.n && o.d === c.d) || ops.some(o => igual(o, c))) continue;
    ops.push(c);
  }
  return barajar(ops, rnd).map(f => ({ id: `${f.e ? f.e + "-" : ""}${f.n}-${f.d}`, html: html(f), voz: voz(f), f }));
}

const generadores = {
  pintar(es, rnd) {
    const d = azar(es.dens, rnd), n = entre(1, d - 1, rnd);
    const forma = azar(Object.keys(FORMAS), rnd);
    return {
      tipo: "pintar", n, d, forma,
      html: `Pintá ${fr(n, d)} ${FORMAS[forma].de}`,
      voz: `Pintá ${enPalabras(n, d)} ${FORMAS[forma].de}. Está ${FORMAS[forma].f ? "partida" : "partido"} en ${NUM[d]} partes iguales: tocá las partes para pintarlas.`,
      explica: `${fr(n, d)}: de <b>${d}</b> partes iguales (el denominador, abajo), se pintan <b>${n}</b> (el numerador, arriba).`,
      vozExplica: `De ${NUM[d]} partes iguales, se pintan ${n === 1 ? "una" : NUM[n]}. Eso es ${enPalabras(n, d)}.`,
      pista: `Hay que pintar ${n === 1 ? "una parte" : `${NUM[n]} partes`}.`,
    };
  },
  cual(es, rnd) {
    const d = azar(es.dens, rnd), n = entre(1, d - 1, rnd);
    const forma = azar(Object.keys(FORMAS), rnd);
    // Errores comunes: pintadas sobre no pintadas, contar las no pintadas, contar mal las partes
    const malas = [{ n, d: d - n }, { n: d - n, d }, { n, d: d + 1 }, { n, d: d - 1 }, { n: n + 1, d }, { n: Math.max(1, n - 1), d }];
    return {
      tipo: "cual", n, d, forma,
      html: `¿Qué fracción ${FORMAS[forma].de} está pintada?`,
      voz: `¿Qué fracción ${FORMAS[forma].de} está pintada?`,
      opciones: opcionesFraccion({ n, d }, malas, es.ops, rnd), correcta: `${n}-${d}`,
      explica: `Hay <b>${d}</b> partes iguales y <b>${n}</b> pintadas: ${fr(n, d)}. El de abajo cuenta todas las partes; el de arriba, las pintadas.`,
      vozExplica: `Hay ${NUM[d]} partes iguales y ${n === 1 ? "una pintada" : `${NUM[n]} pintadas`}: ${enPalabras(n, d)}.`,
      pista: "Contá todas las partes (eso va abajo) y después las pintadas (eso va arriba).",
    };
  },
  grupo(es, rnd) {
    const cosa = azar(COSAS, rnd);
    let n, d, k;
    if (es.unitaria) { d = azar([2, 3, 4], rnd); n = 1; k = entre(2, d === 2 ? 6 : 4, rnd); }
    else if (es.dibujo) { d = azar([3, 4, 5, 6], rnd); n = entre(2, d - 1, rnd); k = entre(2, d >= 5 ? 3 : 4, rnd); }
    else { d = azar([2, 3, 4, 5, 6, 8, 10], rnd); n = entre(1, d - 1, rnd); if (n === 1) n = Math.min(d - 1, 2 + Math.floor(rnd() * (d - 2))); k = entre(3, 12, rnd); }
    const total = d * k, res = n * k;
    const dinero = !es.dibujo && rnd() < 0.5;
    const r = { tipo: "grupo", n, d, k, total, res, cosa, dibujo: es.dibujo, dinero };
    if (dinero) {
      // Plata: múltiplos de ₡50 para que dé exacto
      const unidad = azar([50, 100, 250, 500], rnd);
      r.total = total * unidad; r.res = res * unidad; r.k = k * unidad;
      const p = azar(PLATA, rnd);
      r.html = `${p.quien} tiene <b>${colones(r.total)}</b> ${p.tiene} y gasta ${fr(n, d)} ${p.gasta}. ¿Cuánto gastó?`;
      r.voz = `${p.quien} tiene ${r.total} colones ${p.tiene} y gasta ${enPalabras(n, d)} ${p.gasta}. ¿Cuánto gastó?`;
      r.prefijo = "₡";
    } else {
      r.html = `¿Cuánto es ${fr(n, d)} de <b>${r.total}</b> ${cosa.p}?`;
      r.voz = `¿Cuánto es ${enPalabras(n, d)} de ${r.total} ${cosa.p}?`;
    }
    const enGrupos = es.dibujo ? " Tocá los grupos para marcarlos." : "";
    r.voz += enGrupos;
    r.explica = `${fr(n, d)} de ${r.dinero ? colones(r.total) : r.total}: primero se reparte en <b>${d}</b> partes iguales (${r.dinero ? colones(r.total) : r.total} ÷ ${d} = ${r.dinero ? colones(r.k) : r.k})`
      + (n > 1 ? ` y se toman <b>${n}</b> partes (${r.dinero ? colones(r.k) : r.k} × ${n} = <b>${r.dinero ? colones(r.res) : r.res}</b>).` : `, y se toma <b>una</b>: <b>${r.dinero ? colones(r.res) : r.res}</b>.`);
    r.vozExplica = `Se divide ${r.total} entre ${d}: da ${r.k}.${n > 1 ? ` Y se multiplica por ${n}: da ${r.res}.` : ""}`;
    r.pista = `Primero dividí ${r.total} entre ${d}.`;
    if (es.dibujo) {
      r.opciones = opcionesNumero(r.res, [r.k, r.total - r.res, r.res + k, r.res - k, n * d, r.total / n].filter(Number.isInteger), 4, rnd);
      r.correcta = String(r.res);
    } else r.numero = r.res;
    return r;
  },
  comparar(es, rnd) {
    let a, b;
    if (es.caso === "den") {
      const d = azar([3, 4, 5, 6, 8, 10], rnd);
      const n1 = entre(1, d - 1, rnd);
      let n2 = rnd() < 0.15 ? n1 : entre(1, d - 1, rnd);
      if (n2 === n1 && rnd() < 0.5) n2 = n1 === d - 1 ? n1 - 1 : n1 + 1;
      a = { n: n1, d }; b = { n: n2, d };
    } else if (es.caso === "num") {
      const n = azar([1, 1, 2, 3], rnd);
      const ds = barajar([2, 3, 4, 5, 6, 8, 10].filter(x => x > n), rnd);
      a = { n, d: ds[0] }; b = { n, d: ds[1] };
    } else {
      // Denominadores distintos, con el común hasta 12
      const pares = [[2, 4], [2, 6], [2, 8], [3, 6], [3, 9], [4, 8], [2, 10], [5, 10], [3, 12], [4, 12], [6, 12], [2, 3], [3, 4], [2, 5], [4, 6]];
      const [d1, d2] = barajar(azar(pares, rnd), rnd), m = mcm(d1, d2);
      const n1 = entre(1, d1 - 1, rnd);
      let n2;
      if (rnd() < 0.25 && (n1 * d2) % d1 === 0) n2 = n1 * d2 / d1; // equivalentes
      else { do n2 = entre(1, d2 - 1, rnd); while (n2 * d1 === n1 * d2 && d2 > 2); }
      a = { n: n1, d: d1 }; b = { n: n2, d: d2 };
      if (m > MAX_DEN) return generadores.comparar(es, rnd);
    }
    const c = a.n * b.d - b.n * a.d;
    const correcta = c > 0 ? ">" : c < 0 ? "<" : "=";
    const palabra = { ">": "es mayor que", "<": "es menor que", "=": "es igual a" };
    const r = { tipo: "comparar", caso: es.caso, a, b, dibujo: es.dibujo, correcta };
    r.html = `${fr(a.n, a.d)} <span class="hueco-signo">?</span> ${fr(b.n, b.d)}`;
    r.voz = `¿${enPalabras(a.n, a.d)} es mayor, menor o igual que ${enPalabras(b.n, b.d)}?`;
    r.opciones = [">", "=", "<"].map(s => ({ id: s, html: `<b>${s}</b><small>${palabra[s]}</small>`, voz: palabra[s] }));
    const AB = `${fr(a.n, a.d)} ${correcta} ${fr(b.n, b.d)}`;
    if (es.caso === "den") {
      r.explica = `Las dos tienen <b>${a.d}</b> partes iguales: gana la que tiene más partes pintadas. ${AB}`;
      r.vozExplica = `Las dos están partidas en ${NUM[a.d]} partes. ${enPalabras(a.n, a.d)} ${palabra[correcta]} ${enPalabras(b.n, b.d)}.`;
      r.pista = "Mirá los numeradores: el denominador es el mismo.";
    } else if (es.caso === "num") {
      r.explica = `Las dos tienen <b>${a.n}</b> ${a.n === 1 ? "parte" : "partes"}, pero si el entero se parte en más pedazos, cada pedazo es más pequeño. ${AB}`;
      r.vozExplica = `Entre más partes, más pequeño cada pedazo. ${enPalabras(a.n, a.d)} ${palabra[correcta]} ${enPalabras(b.n, b.d)}.`;
      r.pista = "¿Qué pedazo es más grande: uno de una pizza partida en pocas partes o en muchas?";
    } else {
      const m = mcm(a.d, b.d), A = a.n * m / a.d, B = b.n * m / b.d;
      // La que ya está en el denominador común se queda igual
      const pasa = (f, X) => f.d === m ? `${fr(f.n, f.d)} se queda igual` : `${fr(f.n, f.d)} = ${fr(X, m)}`;
      const pasaVoz = (f, X) => `${enPalabras(f.n, f.d)} ${f.d === m ? (f.n === 1 ? "se queda igual" : "se quedan igual") : `${f.n === 1 ? "equivale" : "equivalen"} a ${enPalabras(X, m)}`}`;
      r.explica = `Se pasan las dos a <b>${DEN[m][1]}</b>: ${pasa(a, A)} y ${pasa(b, B)}. Como ${A} ${correcta} ${B}: ${AB}`;
      r.vozExplica = `En ${DEN[m][1]}: ${pasaVoz(a, A)}, y ${pasaVoz(b, B)}. Entonces ${enPalabras(a.n, a.d)} ${palabra[correcta]} ${enPalabras(b.n, b.d)}.`;
      r.pista = `Pasalas a ${DEN[m][1]}: multiplicá arriba y abajo por el mismo número.`;
    }
    return r;
  },
  equivalente(es, rnd) {
    // a/b = ?/c con c múltiplo de b (o al revés, para simplificar)
    let base, f;
    do { const d = azar([2, 3, 4, 5, 6], rnd); base = { n: entre(1, d - 1, rnd), d }; f = azar([2, 3, 4], rnd); }
    while (base.d * f > MAX_DEN || mcd(base.n, base.d) !== 1);
    const grande = { n: base.n * f, d: base.d * f };
    const alReves = rnd() < 0.3;
    const [de, a] = alReves ? [grande, base] : [base, grande];
    const r = { tipo: "equivalente", de, a, f, alReves, dibujo: es.dibujo };
    r.html = `${fr(de.n, de.d)} = ${fr("?", a.d, " falta")}`;
    r.voz = `${enPalabras(de.n, de.d)} es igual a ¿cuántos ${DEN[a.d][1]}?`;
    r.opciones = opcionesNumero(a.n, [de.n, a.n + 1, a.n - 1, a.d - a.n, de.n + f, de.n * a.d].filter(x => x > 0 && x < a.d * 2), 4, rnd);
    r.correcta = String(a.n);
    r.explica = alReves
      ? `Se divide arriba y abajo entre ${f}: ${fr(de.n, de.d)} = ${fr(a.n, a.d)}. Es el mismo pedazo, con partes más grandes.`
      : `Se multiplica arriba y abajo por ${f}: ${fr(de.n, de.d)} = ${fr(a.n, a.d)}. Es el mismo pedazo, partido en más partes.`;
    r.vozExplica = `${alReves ? "Se divide arriba y abajo entre" : "Se multiplica arriba y abajo por"} ${f}. ${enPalabras(de.n, de.d)} es igual a ${enPalabras(a.n, a.d)}.`;
    r.pista = alReves ? `${de.d} entre ¿cuánto da ${a.d}? Hacé lo mismo arriba.` : `${de.d} por ¿cuánto da ${a.d}? Hacé lo mismo arriba.`;
    return r;
  },
  sumar(es, rnd) {
    const d = azar([3, 4, 5, 6, 8, 10], rnd), resta = rnd() < 0.4;
    let x, y;
    if (resta) { x = entre(2, d, rnd); y = entre(1, x - 1, rnd); }
    else { x = entre(1, d - 1, rnd); y = entre(1, d - x, rnd); }
    const res = resta ? x - y : x + y, s = resta ? "−" : "+";
    const r = { tipo: "sumar", d, x, y, resta, res, dibujo: es.dibujo };
    r.html = `${fr(x, d)} ${s} ${fr(y, d)} = ${fr("?", d, " falta")}`;
    r.voz = `¿Cuánto es ${enPalabras(x, d)} ${resta ? "menos" : "más"} ${enPalabras(y, d)}?`;
    r.numero = res;
    r.explica = `Con el mismo denominador, se ${resta ? "restan" : "suman"} solo los numeradores: ${x} ${s} ${y} = ${res}. El denominador se queda igual: ${fr(res, d)}`
      + (res === d ? ` = ¡un entero!` : ".");
    r.vozExplica = `${enPalabras(x, d)} ${resta ? "menos" : "más"} ${enPalabras(y, d)} son ${enPalabras(res, d)}${res === d ? ": ¡un entero!" : "."}`;
    r.pista = `Los ${DEN[d][1]} se ${resta ? "restan" : "suman"} como si fueran mangos: ${x} ${resta ? "menos" : "más"} ${y}.`;
    return r;
  },
  mixto(es, rnd) {
    const d = azar([2, 3, 4, 5, 6], rnd), e = entre(1, 3, rnd), n = entre(1, d - 1, rnd);
    const imp = { n: e * d + n, d };
    const aMixto = rnd() < 0.5;
    const r = { tipo: "mixto", d, e, n, imp, aMixto };
    const mh = (f) => mixtoHTML(f.e, f.n, f.d), mv = f => mixtoEnPalabras(f.e, f.n, f.d);
    if (aMixto) {
      r.html = `${fr(imp.n, d)} = <span class="hueco-signo">?</span>`;
      r.voz = `${enPalabras(imp.n, d)}: ¿cuántos enteros y qué fracción son?`;
      const correcta = { e, n, d };
      const malas = [{ e: e + 1, n, d }, { e, n: n === d - 1 ? n - 1 : n + 1, d }, { e: e - 1, n, d }, { e: n, n: e < d ? e : 1, d }, { e: e + 1, n: d - n, d }]
        .filter(f => f.e >= 1 && f.n >= 1 && f.n < f.d);
      const valor = f => ({ n: f.e * f.d + f.n, d: f.d });
      const ops = [correcta];
      for (const m of barajar(malas, rnd)) if (ops.length < 4 && !ops.some(o => igual(valor(o), valor(m)))) ops.push(m);
      // Si faltan (con números chiquitos casi todos se repiten), más enteros
      for (let extra = 2; ops.length < 4; extra++) { const m = { e: e + extra, n, d }; if (!ops.some(o => igual(valor(o), valor(m)))) ops.push(m); }
      r.opciones = barajar(ops, rnd).map(f => ({ id: `${f.e}-${f.n}-${f.d}`, html: mh(f), voz: mv(f), f }));
      r.correcta = `${e}-${n}-${d}`;
    } else {
      r.html = `${mixtoHTML(e, n, d)} = <span class="hueco-signo">?</span>`;
      r.voz = `${mixtoEnPalabras(e, n, d)}: ¿cuántos ${DEN[d][1]} son?`;
      r.opciones = opcionesFraccion(imp, [{ n: e + n, d }, { n: e * n + d, d }, { n: e * d - n, d }, { n: imp.n + 1, d }, { n: imp.n - 1, d }, { n: e * d, d }], 4, rnd);
      r.correcta = `${imp.n}-${d}`;
    }
    r.explica = `Cada entero tiene <b>${d}</b> ${DEN[d][1]}. ${e} ${e === 1 ? "entero" : "enteros"} = ${e} × ${d} = ${e * d} ${DEN[d][1]}, y ${e * d} + ${n} = ${imp.n}. Entonces ${fr(imp.n, d)} = ${mixtoHTML(e, n, d)}.`;
    r.vozExplica = `Cada entero tiene ${NUM[d]} ${DEN[d][1]}. ${enPalabras(imp.n, d)} son ${mixtoEnPalabras(e, n, d)}.`;
    r.pista = `¿Cuántos ${DEN[d][1]} caben en un entero? ${d}.`;
    return r;
  },
  simplificar(es, rnd) {
    let p, q, f;
    do { q = entre(2, 6, rnd); p = entre(1, q - 1, rnd); f = azar([2, 2, 3, 4], rnd); } while (mcd(p, q) !== 1 || q * f > MAX_DEN);
    const de = { n: p * f, d: q * f };
    const r = { tipo: "simplificar", de, a: { n: p, d: q }, f };
    r.html = `Simplificá ${fr(de.n, de.d)} = <span class="hueco-signo">?</span>`;
    r.voz = `Simplificá ${enPalabras(de.n, de.d)}: escribila con los números más pequeños posibles.`;
    // Errores comunes: dividir solo arriba o solo abajo, restar en vez de dividir
    const malas = [{ n: p, d: de.d }, { n: de.n, d: q }, { n: de.n - 1, d: de.d - 1 }, { n: p + 1, d: q }, { n: p, d: q + 1 }, { n: de.n - f, d: de.d - f }]
      .filter(m => m.n !== m.d);
    r.opciones = opcionesFraccion({ n: p, d: q }, malas, 4, rnd);
    r.correcta = `${p}-${q}`;
    r.explica = `${de.n} y ${de.d} se pueden dividir entre <b>${f}</b>: ${de.n} ÷ ${f} = ${p} y ${de.d} ÷ ${f} = ${q}. ${fr(de.n, de.d)} = ${fr(p, q)}, y ya no se puede simplificar más.`;
    r.vozExplica = `${de.n} y ${de.d} se dividen entre ${f}. ${enPalabras(de.n, de.d)} es igual a ${enPalabras(p, q)}.`;
    r.pista = `¿Qué número divide exacto a ${de.n} y a ${de.d}?`;
    return r;
  },
};

/** Una ronda nueva del escalón i. */
export function ronda(i, rnd = Math.random) {
  const es = ESCALONES[i];
  return { escalon: i, ...generadores[es.tipo](es, rnd) };
}

/** Revisa una ronda. Devuelve una lista de problemas (vacía = bien). */
export function revisarRonda(r) {
  const mal = [];
  const val = f => f.n / f.d;
  const okFr = f => Number.isInteger(f.n) && Number.isInteger(f.d) && f.n >= 1 && f.d >= 2 && f.d <= MAX_DEN;
  if (r.opciones) {
    const ids = r.opciones.map(o => o.id);
    if (new Set(ids).size !== ids.length) mal.push("opciones repetidas");
    if (ids.filter(x => x === String(r.correcta)).length !== 1) mal.push("la correcta no está una vez");
    if (r.opciones.length < 3) mal.push("pocas opciones");
  }
  switch (r.tipo) {
    case "pintar": if (!(r.n >= 1 && r.n < r.d && DEN[r.d])) mal.push("pintar raro"); break;
    case "cual": {
      if (!(r.n >= 1 && r.n < r.d)) mal.push("cual raro");
      const iguales = r.opciones.filter(o => igual(o.f, { n: r.n, d: r.d }));
      if (iguales.length !== 1) mal.push("hay otra opción con el mismo valor");
      if (!r.opciones.every(o => okFr(o.f))) mal.push("opción inválida");
      if (new Set(r.opciones.map(o => val(o.f))).size !== r.opciones.length) mal.push("dos opciones valen lo mismo");
      break;
    }
    case "grupo": {
      if (r.total % r.d !== 0 || r.total / r.d * r.n !== r.res || !Number.isInteger(r.res) || r.res <= 0) mal.push("grupo no da exacto");
      if (r.dibujo && r.total > 24) mal.push("grupo con muchos dibujos");
      if (r.opciones && !r.opciones.every(o => Number.isInteger(o.v) && o.v > 0)) mal.push("opción de grupo rara");
      break;
    }
    case "comparar": {
      const c = Math.sign(r.a.n * r.b.d - r.b.n * r.a.d);
      if ({ 1: ">", "-1": "<", 0: "=" }[c] !== r.correcta) mal.push("comparación mal");
      if (!okFr(r.a) || !okFr(r.b) || r.a.n >= r.a.d || r.b.n >= r.b.d) mal.push("fracción inválida al comparar");
      if (r.caso === "distintas" && mcm(r.a.d, r.b.d) > MAX_DEN) mal.push("denominador común muy grande");
      if (r.caso === "den" && r.a.d !== r.b.d) mal.push("no tienen el mismo denominador");
      if (r.caso === "num" && (r.a.n !== r.b.n || r.a.d === r.b.d)) mal.push("no tienen el mismo numerador");
      break;
    }
    case "equivalente":
      if (!igual(r.de, r.a) || !okFr(r.de) || !okFr(r.a)) mal.push("no son equivalentes");
      if (r.opciones.filter(o => o.v * r.de.d === r.de.n * r.a.d).length !== 1) mal.push("equivalente con dos respuestas");
      break;
    case "sumar":
      if (r.res < 1 || r.res > r.d || r.res !== (r.resta ? r.x - r.y : r.x + r.y)) mal.push("suma fuera de rango");
      break;
    case "mixto": {
      if (r.imp.n !== r.e * r.d + r.n || r.n >= r.d || r.n < 1) mal.push("mixto mal");
      const valorDe = o => r.aMixto ? (o.f.e * o.f.d + o.f.n) / o.f.d : val(o.f);
      if (r.opciones.filter(o => valorDe(o) === r.imp.n / r.d).length !== 1) mal.push("mixto con dos respuestas");
      if (new Set(r.opciones.map(valorDe)).size !== r.opciones.length) mal.push("mixtos que valen lo mismo");
      break;
    }
    case "simplificar": {
      if (mcd(r.a.n, r.a.d) !== 1 || !igual(r.de, r.a)) mal.push("simplificar mal");
      if (r.opciones.filter(o => igual(o.f, r.a)).length !== 1) mal.push("simplificar con dos respuestas");
      if (!r.opciones.every(o => okFr(o.f))) mal.push("opción inválida");
      break;
    }
  }
  if (!r.html || !r.voz || !r.explica || !r.vozExplica || !r.pista) mal.push("faltan textos");
  if (/undefined|NaN/.test(r.html + r.voz + r.explica + r.vozExplica)) mal.push("texto con undefined/NaN");
  return mal;
}

// ---------- Dibujos (SVG) ----------
const COLOR = {
  pizza: { lleno: "#F6A623", vacio: "#FFF1D2", borde: "#B5651D" },
  sandia: { lleno: "#F2545B", vacio: "#FFE3E3", borde: "#2E8B3E" },
  barra: { lleno: "#8B5A2B", vacio: "#F1E2CF", borde: "#5C3A1A" },
};
const punto = (cx, cy, r, ang) => [cx + r * Math.cos(ang * Math.PI / 180), cy + r * Math.sin(ang * Math.PI / 180)].map(v => v.toFixed(2));

/**
 * Una figura partida en d partes iguales.
 * @param {string} forma pizza | sandia | barra
 * @param {number} d partes · @param {number[]|number} pintadas índices pintados, o cuántos (los primeros)
 * @param {{toca?: boolean, extra?: string, bajita?: boolean}} op toca: las partes se pueden tocar (data-p) ·
 *   bajita: barra más delgada, para poner varias una debajo de la otra
 */
export function figura(forma, d, pintadas = [], { toca = false, extra = "", bajita = false } = {}) {
  const f = FORMAS[forma]?.forma || forma, c = COLOR[f];
  const lista = Array.isArray(pintadas) ? pintadas : Array.from({ length: pintadas }, (_, i) => i);
  const part = (i, dibujo) => `<path class="parte${lista.includes(i) ? " pintada" : ""}"${toca ? ` data-p="${i}" role="button" tabindex="0" aria-label="Parte ${i + 1}${lista.includes(i) ? ", pintada" : ""}"` : ""} d="${dibujo}" style="--lleno:${c.lleno};--vacio:${c.vacio}"/>`;
  if (f === "barra") {
    const w = 92 / d, alto = bajita ? 22 : 44;
    const partes = Array.from({ length: d }, (_, i) => part(i, `M${(4 + i * w).toFixed(2)} 4 h${w.toFixed(2)} v${alto} h-${w.toFixed(2)} Z`)).join("");
    return `<svg class="figura barra ${extra}" viewBox="0 0 100 ${alto + 8}" aria-hidden="${!toca}">${partes}<rect x="4" y="4" width="92" height="${alto}" rx="3" fill="none" stroke="${c.borde}" stroke-width="2.5"/></svg>`;
  }
  if (f === "sandia") {
    const cx = 50, cy = 6, r = 44;
    const partes = Array.from({ length: d }, (_, i) => {
      const a0 = i * 180 / d, a1 = (i + 1) * 180 / d;
      const [x0, y0] = punto(cx, cy, r, a0), [x1, y1] = punto(cx, cy, r, a1);
      return part(i, `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`);
    }).join("");
    const semillas = Array.from({ length: d }, (_, i) => {
      if (!lista.includes(i)) return "";
      const [x, y] = punto(cx, cy, r * 0.62, (i + 0.5) * 180 / d);
      return `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.6" fill="#2B2B2B" pointer-events="none"/>`;
    }).join("");
    return `<svg class="figura sandia ${extra}" viewBox="0 0 100 56" aria-hidden="${!toca}">${partes}${semillas}<path d="M6 6 A44 44 0 0 0 94 6" fill="none" stroke="${c.borde}" stroke-width="5"/></svg>`;
  }
  const cx = 50, cy = 50, r = 44;
  const partes = d === 1
    ? part(0, `M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy} Z`)
    : Array.from({ length: d }, (_, i) => {
      const a0 = -90 + i * 360 / d, a1 = -90 + (i + 1) * 360 / d;
      const [x0, y0] = punto(cx, cy, r, a0), [x1, y1] = punto(cx, cy, r, a1);
      return part(i, `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1} Z`);
    }).join("");
  // Pepperoni en las partes pintadas de la pizza
  const peperoni = forma === "pizza" ? lista.map(i => {
    const [x, y] = punto(cx, cy, r * 0.58, -90 + (i + 0.5) * 360 / d);
    return `<circle cx="${x}" cy="${y}" r="${d > 8 ? 3 : 4.5}" fill="#C0392B" pointer-events="none"/>`;
  }).join("") : "";
  return `<svg class="figura pizza ${extra}" viewBox="0 0 100 100" aria-hidden="${!toca}">${partes}${peperoni}<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c.borde}" stroke-width="3"/></svg>`;
}
