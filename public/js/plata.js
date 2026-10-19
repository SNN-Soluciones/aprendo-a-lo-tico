// 💰 Lógica de «La alcancía» (sin pantalla, para poder probarla sola con node).
// La plata de Costa Rica: monedas de ₡5, ₡10, ₡25, ₡50, ₡100 y ₡500, y billetes de ₡1 000 a ₡50 000.
// Cada ronda: { tipo, modo, instr, voz, explica, vozExplica, pista, vozPista, … }
//   tipo "opciones": se escoge una · "pagar": se ponen piezas en el mostrador hasta juntar `meta`
//   · "escribir": se escribe el número (un monto, o cuántas semanas)
// Lo que se ve lleva ₡; lo que dice la voz lleva «colones» (la voz del teléfono no siempre lee el ₡).

export const MONEDAS = [5, 10, 25, 50, 100, 500];
export const BILLETES = [1000, 2000, 5000, 10000, 20000, 50000];
export const esBillete = v => v >= 1000;

/** 1000 → «1 000» (con un espacio de miles que no se parte al final del renglón). */
export function miles(n) {
  const s = String(n);
  let out = "";
  for (let i = 0; i < s.length; i++) { if (i && (s.length - i) % 3 === 0) out += "\u00A0"; out += s[i]; }
  return out;
}
export const col = n => `₡${miles(n)}`;
/** Para la voz: «500 colones» (los números sin espacios, para que los lea enteros). */
export const vc = n => `${n} colones`;
/** «moneda de 25 colones», «billete de 2000 colones»: lo que dice la voz al tocar una pieza. */
export const nombrePieza = v => `${esBillete(v) ? "billete" : "moneda"} de ${vc(v)}`;
/** «una moneda de ₡50», «3 billetes de ₡1 000» (con voz = true: «de 1000 colones»). */
export function piezas(k, v, voz = false) {
  const b = esBillete(v);
  const cuantas = k === 1 ? (b ? "un billete" : "una moneda") : `${k} ${b ? "billetes" : "monedas"}`;
  return `${cuantas} de ${voz ? vc(v) : col(v)}`;
}
const yLista = arr => (arr.length < 2 ? arr.join("") : `${arr.slice(0, -1).join(", ")} y ${arr[arr.length - 1]}`);
const mayus = t => t[0].toUpperCase() + t.slice(1);
export const suma = arr => arr.reduce((s, x) => s + x, 0);
/** [100, 10, 100] → [{ v: 100, k: 2 }, { v: 10, k: 1 }], de la que vale más a la que vale menos. */
export function grupos(lista) {
  const m = new Map();
  for (const v of lista) m.set(v, (m.get(v) || 0) + 1);
  return [...m].sort((a, b) => b[0] - a[0]).map(([v, k]) => ({ v, k }));
}

// ---------- Ayudas de azar (todas reciben `rnd`, para poder repetir una ronda) ----------
const entre = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---------- Cuentas con la plata ----------
/** ¿Se puede juntar `meta` exacto con esas piezas (de cada una hay todas las que se quieran)? */
export function alcanzable(meta, cartera) {
  const ok = new Uint8Array(meta + 1); ok[0] = 1;
  for (let s = 1; s <= meta; s++) ok[s] = cartera.some(v => v <= s && ok[s - v]) ? 1 : 0;
  return !!ok[meta];
}
/** La forma de juntar `meta` con menos piezas (de la más grande a la más chiquita), o null si no se puede. */
export function minimas(meta, cartera) {
  const cuantas = new Array(meta + 1).fill(Infinity), ultima = new Array(meta + 1).fill(0);
  cuantas[0] = 0;
  for (let s = 1; s <= meta; s++) for (const v of cartera) if (v <= s && cuantas[s - v] + 1 < cuantas[s]) { cuantas[s] = cuantas[s - v] + 1; ultima[s] = v; }
  if (!isFinite(cuantas[meta])) return null;
  const out = [];
  for (let s = meta; s > 0; s -= ultima[s]) out.push(ultima[s]);
  return out.sort((a, b) => b - a);
}
/**
 * El vuelto contando hacia arriba, como en la pulpería: del precio a la siguiente centena,
 * a la siguiente unidad de mil… hasta llegar a lo que pagó. 650 → 700 (+50) → 1 000 (+300).
 */
export function contarArriba(precio, pago) {
  const pasos = [];
  let s = precio;
  for (const m of [100, 1000, 10000]) {
    const t = Math.ceil(s / m) * m;
    if (s % m && t <= pago && t > s) { pasos.push({ desde: s, hasta: t, mas: t - s }); s = t; }
  }
  if (s < pago) pasos.push({ desde: s, hasta: pago, mas: pago - s });
  return pasos;
}
/** Cómo se cuenta un montón: primero las que valen más. Devuelve el texto para ver y para oír. */
export function explicarConteo(lista, juntar = false) {
  const ord = [...lista].sort((a, b) => b - a), g = grupos(lista);
  const parciales = [];
  let s = 0;
  for (const v of ord) { s += v; parciales.push(s); }
  const iguales = g.length === 1;
  const antes = juntar && !iguales ? [`Primero juntamos las iguales: ${yLista(g.map(x => piezas(x.k, x.v)))}. `, `Primero juntamos las iguales: ${yLista(g.map(x => piezas(x.k, x.v, true)))}. `] : ["", ""];
  const como = iguales ? [`Contamos de ${miles(g[0].v)} en ${miles(g[0].v)}`, `Contamos de ${g[0].v} en ${g[0].v}`] : ["Contamos primero las que valen más", "Contamos primero las que valen más"];
  return {
    total: s,
    explica: `${antes[0]}${como[0]}: ${parciales.map(miles).join(", ")}. Hay <b>${col(s)}</b>.`,
    vozExplica: `${antes[1]}${como[1]}: ${parciales.join(", ")}. Hay ${vc(s)}.`,
  };
}

// ---------- Cosas de la pulpería (precio al azar dentro de lo razonable) ----------
// [emoji, nombre, con artículo, plural, precio mínimo, precio máximo]
export const COSAS = [
  ["🍬", "Confites", "unos confites", true, 50, 200],
  ["🍌", "Banano", "un banano", false, 100, 250],
  ["🍭", "Chupeta", "una chupeta", false, 100, 300],
  ["🥭", "Mango", "un mango", false, 200, 600],
  ["🍪", "Galletas", "unas galletas", true, 300, 800],
  ["🍫", "Chocolate", "un chocolate", false, 400, 1000],
  ["🍦", "Helado", "un helado", false, 500, 1200],
  ["🧃", "Jugo", "un jugo", false, 450, 900],
  ["🍅", "Tomates", "unos tomates", true, 600, 1300],
  ["🥛", "Leche", "una caja de leche", false, 800, 1300],
  ["🥤", "Refresco", "un refresco", false, 900, 1600],
  ["🍞", "Pan", "un pan", false, 900, 1800],
  ["🫘", "Frijoles", "una bolsa de frijoles", false, 1000, 1700],
  ["🥑", "Aguacates", "unos aguacates", true, 1000, 2200],
  ["🍚", "Arroz", "un paquete de arroz", false, 1500, 2600],
  ["🥚", "Huevos", "unos huevos", true, 2000, 3200],
  ["☕", "Café", "un paquete de café", false, 2000, 3600],
  ["🍉", "Sandía", "una sandía", false, 2000, 3800],
  ["🧀", "Queso", "un queso", false, 2500, 4800],
  ["🍗", "Pollo", "un pollo", false, 3500, 6500],
  ["⚽", "Bola", "una bola", false, 5000, 14000],
  ["🎒", "Bulto", "un bulto", false, 9000, 26000],
  ["👟", "Tenis", "unas tenis", true, 15000, 45000],
].map(([e, n, con, pl, min, max]) => ({ e, n, con, pl, min, max }));
/** Precio redondito: de 25 en 25 si es menos de ₡1 000, de 50 en 50 hasta ₡5 000 y de 500 en 500 después. */
function precioDe(c, rnd) {
  const paso = c.max <= 1000 ? 25 : c.max <= 5000 ? 50 : 500;
  return paso * entre(Math.ceil(c.min / paso), Math.floor(c.max / paso), rnd);
}
const cuesta = c => (c.pl ? "cuestan" : "cuesta");

// ---------- Opciones de montos ----------
const opcionMonto = m => ({ id: String(m), html: col(m), voz: vc(m) });
function opcionesMonto(total, lista, cuantas, rnd) {
  const g = grupos(lista), chica = g[g.length - 1].v;
  const cand = [...barajar([...g.map(x => total - x.v), ...g.map(x => total + x.v)], rnd), total + chica, total - chica, total + 10, total - 10, total + 100, total - 100, total + 5, total * 2];
  const out = [total];
  for (const x of cand) if (out.length < cuantas && x > 0 && x % 5 === 0 && !out.includes(x)) out.push(x);
  return barajar(out, rnd).map(opcionMonto);
}

// ---------- Generadores ----------
/** ¿Cuánta plata hay? `hacer(rnd)` da la lista de piezas. */
function contar({ hacer, revuelto = false, cuantas = 3, escribir = false, pista }, rnd) {
  const lista = hacer(rnd), e = explicarConteo(lista, revuelto);
  const ver = revuelto ? barajar(lista, rnd) : [...lista].sort((a, b) => b - a);
  const hayBilletes = lista.some(esBillete);
  const q = { modo: "contar", piezas: ver, total: e.total, instr: "¿Cuánta plata hay?",
    voz: `¿Cuánta plata hay? Tocá ${hayBilletes ? "cada billete y cada moneda" : "cada moneda"} para oír cuánto vale.`,
    explica: e.explica, vozExplica: e.vozExplica, pista, vozPista: pista };
  if (escribir) return { ...q, tipo: "escribir", correcta: e.total, prefijo: "₡", voz: `¿Cuánta plata hay? Contala y escribí cuánto es.` };
  return { ...q, tipo: "opciones", opciones: opcionesMonto(e.total, lista, cuantas, rnd), correcta: String(e.total), cols: cuantas === 4 ? 2 : 3 };
}
const iguales = (v, a, b) => rnd => Array(entre(a, b, rnd)).fill(v);
// Monedas para cada escalón de contar
const hacer10y5 = rnd => [...Array(entre(1, 4, rnd)).fill(10), ...Array(entre(1, 2, rnd)).fill(5)];
function hacer25y50(rnd) {
  const grandes = azar([[50], [25], [50, 25], [25, 25], [50, 50]], rnd);
  return [...grandes, ...Array(entre(0, 3, rnd)).fill(10), ...Array(entre(0, 1, rnd)).fill(5)];
}
const hacerCien = rnd => [...Array(entre(1, 4, rnd)).fill(100), ...Array(entre(0, 1, rnd)).fill(50), ...Array(entre(0, 1, rnd)).fill(25), ...Array(entre(0, 3, rnd)).fill(10)];
function hacerMonton(rnd) {
  const k = entre(6, 10, rnd), lista = [];
  for (let i = 0; i < k; i++) lista.push(azar([5, 10, 10, 25, 50, 50, 100, 100, 100], rnd));
  if (rnd() < 0.3) lista[0] = 500;
  if (grupos(lista).length < 3) lista[1] = lista[0] === 25 ? 10 : 25;
  return lista;
}
const hacerBilletes = rnd => [...Array.from({ length: entre(1, 3, rnd) }, () => azar([1000, 1000, 2000, 5000], rnd)), ...Array.from({ length: entre(0, 3, rnd) }, () => azar([50, 100, 100, 500], rnd))];
const hacerBilletesGrandes = rnd => [...Array.from({ length: entre(2, 4, rnd) }, () => azar([1000, 2000, 5000, 10000, 20000, 50000], rnd)), ...Array.from({ length: entre(0, 3, rnd) }, () => azar([100, 500, 500], rnd))];

/** Juntar un monto exacto tocando monedas. */
function pagar({ min, max, cartera, mostrarTotal }, rnd) {
  let meta;
  do meta = 5 * entre(min / 5, max / 5, rnd); while (cartera.includes(meta));
  const ej = minimas(meta, cartera);
  const pista = "Empezá con la moneda más grande que no se pase, y seguí con las más chiquitas.";
  return { tipo: "pagar", modo: "pagar", meta, cartera, base: 0, mostrarTotal,
    instr: `Juntá <b>${col(meta)}</b>`,
    voz: `Juntá ${vc(meta)} exactos. Tocá las monedas para ponerlas en el mostrador, y después tocá el visto bueno.`,
    explica: `Por ejemplo: ${ej.map(col).join(" + ")} = <b>${col(meta)}</b>.`,
    vozExplica: `Por ejemplo: ${ej.join(" más ")}, son ${vc(meta)}.`, pista, vozPista: pista };
}

/** ¿Qué te alcanza con la plata de la alcancía? Solo una de las cosas cuesta lo que hay o menos. */
function alcanza(_, rnd) {
  for (;;) {
    const lista = hacerAlcancia(rnd), X = suma(lista);
    const baratas = [], caras = [];
    for (const c of barajar(COSAS, rnd)) {
      const p = precioDe(c, rnd);
      if (p <= X && p >= X * 0.4) baratas.push({ c, p });
      else if (p > X && p <= X * 3) caras.push({ c, p });
    }
    if (!baratas.length || caras.length < 2) continue;
    const si = baratas[0], no = caras.slice(0, 2), todas = barajar([si, ...no], rnd);
    const sobra = X - si.p;
    return { tipo: "opciones", modo: "alcanza", piezas: barajar(lista, rnd), total: X, cosas: todas,
      instr: `En la alcancía hay <b>${col(X)}</b>. ¿Qué te alcanza?`,
      voz: `En la alcancía hay ${vc(X)}. ¿Qué podés comprar sin pasarte?`,
      opciones: todas.map(({ c, p }) => ({ id: c.n, html: `<span class="cosa-e">${c.e}</span><span class="cosa-n">${c.n}</span><b>${col(p)}</b>`, voz: `${c.n}, ${vc(p)}` })),
      correcta: si.c.n, cols: 3,
      explica: `Tenés ${col(X)}. ${mayus(si.c.con)} ${cuesta(si.c)} ${col(si.p)}: ¡sí te alcanza!${sobra ? ` Y te sobran ${col(sobra)}.` : " Y no sobra nada."} Lo demás cuesta más de ${col(X)}.`,
      vozExplica: `Tenés ${vc(X)}. ${mayus(si.c.con)} ${cuesta(si.c)} ${vc(si.p)}: ¡sí te alcanza!${sobra ? ` Y te sobran ${vc(sobra)}.` : " Y no sobra nada."} Lo demás cuesta más.`,
      pista: "Buscá lo que cuesta igual o menos que lo que hay en la alcancía.",
      vozPista: "Buscá lo que cuesta igual o menos que lo que hay en la alcancía.",
      faltan: Object.fromEntries(no.map(({ c, p }) => [c.n, { con: c.con, pl: c.pl, p, falta: p - X }])) };
  }
}
function hacerAlcancia(rnd) {
  const lista = [...Array(entre(1, 6, rnd)).fill(100), ...Array(entre(0, 2, rnd)).fill(50), ...Array(entre(0, 2, rnd)).fill(25)];
  if (rnd() < 0.35) lista.push(500);
  return lista;
}

// ¿Cuántas de estas hacen una de aquellas?
const CAMBIOS = [[10, 100], [25, 100], [50, 100], [50, 500], [100, 500], [100, 1000], [500, 1000], [500, 5000], [1000, 2000],
  [1000, 5000], [1000, 10000], [2000, 10000], [5000, 10000], [5000, 20000], [10000, 50000], [25, 50]];
function cambio(_, rnd) {
  const [chica, grande] = azar(CAMBIOS, rnd), n = grande / chica;
  const nom = esBillete(chica) ? "billetes" : "monedas", una = esBillete(grande) ? "un billete" : "una moneda";
  const cuantas = esBillete(chica) ? "Cuántos" : "Cuántas";
  const otras = [2, 4, 5, 10, 20, 50, 100].filter(x => x !== n);
  const ops = barajar([n, ...barajar(otras, rnd).slice(0, 3)], rnd).map(x => ({ id: String(x), html: String(x), voz: String(x) }));
  const cuenta = n <= 10 ? `: ${Array.from({ length: n }, (_, i) => miles(chica * (i + 1))).join(", ")}` : "";
  const vcuenta = n <= 10 ? `: ${Array.from({ length: n }, (_, i) => chica * (i + 1)).join(", ")}` : "";
  return { tipo: "opciones", modo: "cambio", piezas: [grande], chica, grande, cols: 2,
    instr: `¿${cuantas} ${nom} de <b>${col(chica)}</b> hacen ${una} de <b>${col(grande)}</b>?`,
    voz: `¿${cuantas} ${nom} de ${vc(chica)} hacen ${una} de ${vc(grande)}?`,
    opciones: ops, correcta: String(n),
    explica: `Contamos de ${miles(chica)} en ${miles(chica)} hasta ${miles(grande)}${cuenta}. Son <b>${n}</b> ${nom}: ${n} × ${col(chica)} = ${col(grande)}.`,
    vozExplica: `Contamos de ${chica} en ${chica} hasta ${grande}${vcuenta}. Son ${n} ${nom}.`,
    pista: `Contá de ${miles(chica)} en ${miles(chica)} hasta llegar a ${miles(grande)}.`,
    vozPista: `Contá de ${chica} en ${chica} hasta llegar a ${grande}.` };
}

// Cambiar una pieza grande en plata más chiquita
const MENUDO = [[500, [100, 50, 25]], [1000, [500, 100, 50]], [2000, [1000, 500, 100]], [5000, [2000, 1000, 500]], [10000, [5000, 2000, 1000]], [20000, [10000, 5000, 2000]]];
function cambiar(_, rnd) {
  const [pieza, cartera] = azar(MENUDO, rnd);
  const ej = minimas(pieza, cartera), otro = minimas(pieza, cartera.slice(1));
  const que = esBillete(pieza) ? `el billete de ${col(pieza)}` : `la moneda de ${col(pieza)}`;
  const vque = esBillete(pieza) ? `el billete de ${vc(pieza)}` : `la moneda de ${vc(pieza)}`;
  const pista = `Poné piezas más chiquitas hasta juntar ${miles(pieza)}.`;
  return { tipo: "pagar", modo: "cambiar", meta: pieza, cartera, base: 0, mostrarTotal: false, piezas: [pieza],
    instr: `Cambiá ${que} en plata más chiquita`,
    voz: `Cambiá ${vque} en plata más chiquita. Poné en el mostrador piezas que juntas valgan lo mismo.`,
    explica: `${mayus(que)} vale lo mismo que ${ej.map(col).join(" + ")}${otro ? `, o que ${yLista(grupos(otro).map(g => piezas(g.k, g.v)))}` : ""}.`,
    vozExplica: `${mayus(vque)} vale lo mismo que ${ej.join(" más ")}${otro ? `, o que ${yLista(grupos(otro).map(g => piezas(g.k, g.v, true)))}` : ""}.`,
    pista, vozPista: `Poné piezas más chiquitas hasta juntar ${pieza}.` };
}

/** Una cosa de la pulpería y con qué pieza paga. `max`: hasta qué precio. */
function compra(rnd, { minPrecio = 0, maxPrecio = Infinity, maxVuelto = Infinity }) {
  for (;;) {
    const c = azar(COSAS, rnd), p = precioDe(c, rnd);
    if (p < minPrecio || p > maxPrecio) continue;
    const mayores = [100, 500, ...BILLETES].filter(v => v > p);
    if (!mayores.length) continue;
    const pago = rnd() < 0.8 ? mayores[0] : mayores[Math.min(1, mayores.length - 1)];
    if (pago - p > maxVuelto) continue;
    return { c, p, pago, vuelto: pago - p };
  }
}
function explicarVuelto(p, pago) {
  const pasos = contarArriba(p, pago), v = pago - p;
  return {
    explica: `Contamos desde ${col(p)} hasta ${col(pago)}: ${pasos.map(s => `+ ${col(s.mas)} → ${miles(s.hasta)}`).join(", ")}. El vuelto es ${pasos.length > 1 ? `${pasos.map(s => col(s.mas)).join(" + ")} = ` : ""}<b>${col(v)}</b>.`,
    vozExplica: `Contamos desde ${p} hasta ${pago}: ${pasos.map(s => `más ${s.mas}, ${s.hasta}`).join("; ")}. El vuelto es ${vc(v)}.`,
  };
}
/** Dar el vuelto tocando monedas, contando hacia arriba desde el precio. */
function vueltoContando(_, rnd) {
  const { c, p, pago, vuelto } = compra(rnd, { maxPrecio: 1950, maxVuelto: 1000 });
  const e = explicarVuelto(p, pago);
  const cartera = MONEDAS.filter(v => v < pago && v <= Math.max(vuelto, 100));
  const pista = `Empezá en ${miles(p)} y contá hacia arriba con monedas hasta llegar a ${miles(pago)}.`;
  return { tipo: "pagar", modo: "vuelto", meta: vuelto, cartera, base: p, pago, cosa: c, mostrarTotal: true, piezas: [pago],
    instr: `${c.e} ${mayus(c.con)} ${cuesta(c)} <b>${col(p)}</b> y te pagan con <b>${col(pago)}</b>. Dale el vuelto.`,
    voz: `${mayus(c.con)} ${cuesta(c)} ${vc(p)} y te pagan con ${esBillete(pago) ? "un billete" : "una moneda"} de ${vc(pago)}. Dale el vuelto: contá desde ${p} hasta ${pago}.`,
    ...e, pista, vozPista: `Empezá en ${p} y contá hacia arriba con monedas hasta llegar a ${pago}.` };
}
/** ¿Cuánto vuelto? Se escribe. */
function vueltoEscrito(_, rnd) {
  const { c, p, pago, vuelto } = compra(rnd, { minPrecio: 400 });
  const e = explicarVuelto(p, pago);
  return { tipo: "escribir", modo: "vuelto", correcta: vuelto, prefijo: "₡", piezas: [pago], cosa: c, precio: p, pago,
    instr: `${c.e} ${mayus(c.con)} ${cuesta(c)} <b>${col(p)}</b>. Pagás con <b>${col(pago)}</b>. ¿Cuánto es el vuelto?`,
    voz: `${mayus(c.con)} ${cuesta(c)} ${vc(p)}. Pagás con ${esBillete(pago) ? "un billete" : "una moneda"} de ${vc(pago)}. ¿Cuánto es el vuelto?`,
    ...e, pista: `Contá hacia arriba desde ${miles(p)} hasta ${miles(pago)}.`, vozPista: `Contá hacia arriba desde ${p} hasta ${pago}.` };
}

/** Problemas de ahorro y de compras. */
function ahorro(_, rnd) {
  const tipo = azar(["semanas", "semanas", "junta", "falta", "queda"], rnd);
  if (tipo === "semanas") {
    const a = azar([100, 200, 250, 500, 1000, 2000], rnd), k = entre(2, 12, rnd), meta = a * k;
    const cuenta = Array.from({ length: k }, (_, i) => miles(a * (i + 1))).join(", ");
    return { tipo: "escribir", modo: "ahorro", clase: "semanas", correcta: k, sufijo: "semanas",
      texto: `Ahorrás ${col(a)} cada semana. ¿En cuántas semanas juntás ${col(meta)}?`,
      instr: `🐷 Ahorrás <b>${col(a)}</b> cada semana. ¿En cuántas semanas juntás <b>${col(meta)}</b>?`,
      voz: `Ahorrás ${vc(a)} cada semana. ¿En cuántas semanas juntás ${vc(meta)}?`,
      explica: `Contamos de ${miles(a)} en ${miles(a)}: ${cuenta}. Son <b>${k} semanas</b>. También: ${miles(meta)} ÷ ${miles(a)} = ${k}.`,
      vozExplica: `Contamos de ${a} en ${a}: ${Array.from({ length: k }, (_, i) => a * (i + 1)).join(", ")}. Son ${k} semanas.`,
      pista: `Contá de ${miles(a)} en ${miles(a)} hasta ${miles(meta)} y fijate cuántas veces contaste.`,
      vozPista: `Contá de ${a} en ${a} hasta ${meta} y fijate cuántas veces contaste.` };
  }
  if (tipo === "junta") {
    const a = azar([25, 50, 100, 200, 250, 500], rnd), k = entre(3, 10, rnd), total = a * k;
    return { tipo: "escribir", modo: "ahorro", clase: "junta", correcta: total, prefijo: "₡",
      texto: `Echás ${col(a)} en la alcancía todos los días, durante ${k} días. ¿Cuántos colones juntás?`,
      instr: `🐷 Echás <b>${col(a)}</b> en la alcancía todos los días, durante <b>${k} días</b>. ¿Cuánto juntás?`,
      voz: `Echás ${vc(a)} en la alcancía todos los días, durante ${k} días. ¿Cuánto juntás?`,
      explica: `${k} × ${col(a)} = <b>${col(total)}</b>: ${Array.from({ length: k }, (_, i) => miles(a * (i + 1))).join(", ")}.`,
      vozExplica: `${k} veces ${a} son ${vc(total)}.`,
      pista: `Sumá ${miles(a)} una vez por cada día.`, vozPista: `Sumá ${a} una vez por cada día.` };
  }
  if (tipo === "falta") {
    for (;;) {
      const c = azar(COSAS.filter(x => x.min >= 1000), rnd), p = precioDe(c, rnd);
      const X = 100 * entre(Math.ceil(p / 300), Math.floor((p - 100) / 100), rnd);
      if (X <= 0 || X >= p) continue;
      return { tipo: "escribir", modo: "ahorro", clase: "falta", correcta: p - X, prefijo: "₡", cosa: c,
        texto: `Querés comprar ${c.con} de ${col(p)} y en la alcancía hay ${col(X)}. ¿Cuántos colones te faltan?`,
        instr: `🐷 Querés comprar ${c.con} ${c.e} de <b>${col(p)}</b> y en la alcancía hay <b>${col(X)}</b>. ¿Cuánto te falta?`,
        voz: `Querés comprar ${c.con} de ${vc(p)} y en la alcancía hay ${vc(X)}. ¿Cuánto te falta?`,
        explica: `${col(p)} − ${col(X)} = <b>${col(p - X)}</b>. Contando hacia arriba: de ${miles(X)} a ${miles(p)} faltan ${miles(p - X)}.`,
        vozExplica: `${p} menos ${X} son ${vc(p - X)}.`,
        pista: `Contá desde ${miles(X)} hasta ${miles(p)}.`, vozPista: `Contá desde ${X} hasta ${p}.` };
    }
  }
  // queda: dos cosas con un billete
  for (;;) {
    const [a, b] = barajar(COSAS.filter(x => x.max <= 3800), rnd);
    const pa = precioDe(a, rnd), pb = precioDe(b, rnd), B = BILLETES.find(v => v > pa + pb);
    if (!B || B > 10000) continue;
    const queda = B - pa - pb;
    return { tipo: "escribir", modo: "ahorro", clase: "queda", correcta: queda, prefijo: "₡", piezas: [B],
      texto: `Tenés ${col(B)}. Comprás ${a.con} de ${col(pa)} y ${b.con} de ${col(pb)}. ¿Cuántos colones te quedan?`,
      instr: `🐷 Tenés <b>${col(B)}</b>. Comprás ${a.con} ${a.e} de <b>${col(pa)}</b> y ${b.con} ${b.e} de <b>${col(pb)}</b>. ¿Cuánto te queda?`,
      voz: `Tenés ${vc(B)}. Comprás ${a.con} de ${vc(pa)} y ${b.con} de ${vc(pb)}. ¿Cuánto te queda?`,
      explica: `Primero se suma lo que gastás: ${col(pa)} + ${col(pb)} = ${col(pa + pb)}. Después: ${col(B)} − ${col(pa + pb)} = <b>${col(queda)}</b>.`,
      vozExplica: `Primero se suma lo que gastás: ${pa} más ${pb} son ${pa + pb}. Después, ${B} menos ${pa + pb} son ${vc(queda)}.`,
      pista: "Primero sumá lo que gastás, y después restalo de lo que tenés.",
      vozPista: "Primero sumá lo que gastás, y después restalo de lo que tenés." };
  }
}

// ---------- 🪜 Escalones: de contar monedas de ₡10 a resolver problemas de ahorro ----------
const PISTA_CONTAR = "Empezá por las que valen más y andá sumando.";
export const ESCALONES = [
  { nombre: "Monedas de ₡10", gen: r => contar({ hacer: iguales(10, 2, 5), pista: "Contá de 10 en 10." }, r) },                       //  1
  { nombre: "Monedas de ₡10 y ₡5", gen: r => contar({ hacer: hacer10y5, pista: "Contá primero las de 10, de 10 en 10, y después sumá las de 5." }, r) }, // 2
  { nombre: "Con ₡25 y ₡50", gen: r => contar({ hacer: hacer25y50, pista: PISTA_CONTAR }, r) },                                        //  3
  { nombre: "Con ₡100", gen: r => contar({ hacer: hacerCien, pista: "Contá primero las de 100, de 100 en 100, y después sumá las demás." }, r) }, // 4
  { nombre: "Un montón revuelto", gen: r => contar({ hacer: hacerMonton, revuelto: true, cuantas: 4, pista: "Juntá las iguales y contá primero las de 100." }, r) }, // 5
  { nombre: "Pagar exacto hasta ₡100", gen: r => pagar({ min: 15, max: 100, cartera: [50, 25, 10, 5], mostrarTotal: true }, r) },     //  6
  { nombre: "Pagar exacto hasta ₡1 000", gen: r => pagar({ min: 105, max: 1000, cartera: [500, 100, 50, 25, 10, 5], mostrarTotal: false }, r) }, // 7
  { nombre: "¿Me alcanza?", gen: r => alcanza({}, r) },                                                                                 //  8
  { nombre: "Billetes y monedas", gen: r => contar({ hacer: hacerBilletes, cuantas: 4, pista: "Contá primero los billetes y después las monedas." }, r) }, // 9
  { nombre: "¿Cuántas hacen uno?", gen: r => cambio({}, r) },                                                                           // 10
  { nombre: "Cambiar en plata más chiquita", gen: r => cambiar({}, r) },                                                               // 11
  { nombre: "Dar el vuelto contando", gen: r => vueltoContando({}, r) },                                                               // 12
  { nombre: "Contar billetes grandes", gen: r => contar({ hacer: hacerBilletesGrandes, escribir: true, pista: "Ordená los billetes del más grande al más chiquito y andá sumando." }, r) }, // 13
  { nombre: "¿Cuánto es el vuelto?", gen: r => vueltoEscrito({}, r) },                                                                // 14
  { nombre: "Problemas de ahorro", gen: r => ahorro({}, r) },                                                                          // 15
];
// Modos a mano (papá o maestra): escalones de cada tema
export const MODOS = [
  { id: "contar", emoji: "🪙", nombre: "Contar monedas", escalones: [0, 1, 2, 3, 4] },
  { id: "pagar", emoji: "👛", nombre: "Pagar exacto", escalones: [5, 6] },
  { id: "alcanza", emoji: "🐷", nombre: "¿Me alcanza?", escalones: [7] },
  { id: "billetes", emoji: "💵", nombre: "Billetes y cambios", escalones: [8, 9, 10, 12] },
  { id: "vuelto", emoji: "🔄", nombre: "El vuelto", escalones: [11, 13] },
  { id: "ahorro", emoji: "📅", nombre: "Ahorro", escalones: [14] },
];
export const inicio = edad => (edad === null || edad <= 6 ? 0 : edad === 7 ? 2 : edad === 8 ? 5 : edad === 9 ? 7 : edad === 10 ? 9 : 11);
export const ronda = (i, rnd = Math.random) => ESCALONES[i].gen(rnd);

// ---------- 📝 Para «Preparate para el examen» (formato de js/examen-temas.js; solo usa `r` como azar) ----------
const opcionesTexto = (correcta, otras, r, n = 3) => {
  const unicas = [...new Set(otras.map(String))].filter(o => o !== String(correcta));
  return barajar([String(correcta), ...barajar(unicas, r).slice(0, n - 1)], r);
};
/** Una pregunta de plata para el grado `g` (1 a 4). */
export function preguntaExamen(r, g = 2) {
  const tipos = ["contar", "contar"];
  if (g >= 2) tipos.push("cambio", "contarBilletes");
  if (g >= 3) tipos.push("formar", "vuelto", "semanas");
  if (g >= 4) tipos.push("queda", "falta");
  const tipo = azar(tipos, r);
  if (tipo === "contar" || tipo === "contarBilletes") {
    const lista = (tipo === "contar" ? (g <= 1 ? azar([hacer10y5, hacer25y50], r) : azar([hacer25y50, hacerCien, hacerMonton], r)) : hacerBilletes)(r);
    const e = explicarConteo(lista, true);
    return { texto: `En ${lista.some(esBillete) ? "la billetera" : "la alcancía"} hay ${yLista(grupos(lista).map(x => piezas(x.k, x.v)))}. ¿Cuántos colones hay?`, tipo: "numero",
      correcta: String(e.total), explica: e.explica };
  }
  if (tipo === "cambio") {
    const q = cambio({}, r);
    return { texto: q.instr.split("<b>").join("").split("</b>").join(""), tipo: "opcion",
      opciones: opcionesTexto(q.correcta, q.opciones.map(o => o.id), r, 4), correcta: q.correcta, explica: q.explica };
  }
  if (tipo === "formar") {
    const meta = 5 * entre(7, 39, r), cartera = [100, 50, 25, 10, 5].filter(v => v < meta);
    const bien = minimas(meta, cartera), texto = l => l.map(col).join(" + ");
    const ultima = bien[bien.length - 1], otra = cartera.filter(v => v !== ultima);
    const malas = [[...bien.slice(0, -1), azar(otra, r)], [...bien.slice(0, -1), azar(otra, r)], [...bien, azar([5, 10], r)], bien.length > 1 ? bien.slice(0, -1) : [ultima, ultima]]
      .filter(l => l.length && suma(l) !== meta).map(l => texto([...l].sort((a, b) => b - a)));
    return { texto: `¿Con cuáles monedas se juntan exactamente ${col(meta)}?`, tipo: "opcion",
      opciones: opcionesTexto(texto(bien), malas, r, 3), correcta: texto(bien),
      explica: `${texto(bien)} = ${col(meta)}.` };
  }
  if (tipo === "vuelto") {
    const { c, p, pago, vuelto } = compra(r, { minPrecio: 100, maxPrecio: g >= 4 ? 20000 : 4800 });
    return { texto: `${mayus(c.con)} ${cuesta(c)} ${col(p)} y se paga con ${esBillete(pago) ? "un billete" : "una moneda"} de ${col(pago)}. ¿Cuántos colones de vuelto le dan?`,
      tipo: "numero", correcta: String(vuelto), explica: explicarVuelto(p, pago).explica };
  }
  // semanas, queda o falta: se arman problemas de ahorro hasta que sale uno de ese tipo
  let p;
  do p = ahorro({}, r); while (p.clase !== tipo);
  return { texto: p.texto, tipo: "numero", correcta: String(p.correcta), explica: p.explica };
}

// ---------- Revisión (node) ----------
const sinMarcas = t => { let out = "", dentro = false; for (const ch of String(t)) { if (ch === "<") dentro = true; else if (ch === ">") dentro = false; else if (!dentro) out += ch; } return out; };
/** Revisa una ronda. Devuelve una lista de problemas (vacía = bien). */
export function revisarRonda(q, i) {
  const mal = [];
  const txt = JSON.stringify(q);
  if (/undefined|NaN|null|Infinity/.test(txt)) mal.push("undefined/NaN");
  if (/\b1 (monedas|billetes|semanas|días)|una monedas|un billetes|de el |Cuántas billetes|Cuántos monedas|\b(21|31|41|51|61|71|81|91) (monedas|billetes|semanas|días)/.test(txt)) mal.push("gramática");
  for (const k of ["voz", "vozExplica", "vozPista"]) if (String(q[k] || "").includes("₡")) mal.push(`₡ en ${k}`);
  for (const k of ["voz", "vozExplica", "vozPista"]) if (/\d[\s\u00A0]\d/.test(String(q[k] || ""))) mal.push(`número con espacio en ${k}`);
  if (!q.voz || !q.explica || !q.vozExplica || !q.pista) mal.push("faltan textos");
  if (q.piezas && q.piezas.some(v => !MONEDAS.includes(v) && !BILLETES.includes(v))) mal.push("pieza que no existe");
  if (q.tipo === "opciones") {
    const ids = q.opciones.map(o => o.id);
    if (new Set(ids).size !== ids.length) mal.push("opciones repetidas");
    if (!ids.includes(q.correcta)) mal.push("falta la correcta");
    if (ids.length < 2) mal.push("muy pocas opciones");
    if (q.opciones.some(o => /₡/.test(o.voz))) mal.push("₡ en la voz de una opción");
  }
  if (q.modo === "contar") {
    if (suma(q.piezas) !== q.total) mal.push("total mal");
    if (String(q.correcta) !== String(q.total)) mal.push("la correcta no es el total");
    if (q.tipo === "opciones" && q.opciones.some(o => !(Number(o.id) > 0 && Number(o.id) % 5 === 0))) mal.push("opción de monto rara");
    if (!sinMarcas(q.explica).includes(sinMarcas(col(q.total)))) mal.push("la explicación no dice el total");
  }
  if (q.tipo === "pagar") {
    if (!(q.meta > 0) || !alcanzable(q.meta, q.cartera)) mal.push(`no se puede juntar ${q.meta}`);
    if (q.cartera.includes(q.meta) && q.modo !== "vuelto") mal.push("la meta es una sola pieza");
    if (q.modo === "cambiar" && q.cartera.some(v => v >= q.meta)) mal.push("se cambia por una pieza igual o más grande");
    if (q.modo === "vuelto") {
      if (q.base + q.meta !== q.pago || q.base >= q.pago) mal.push("vuelto mal");
      if (q.meta > 1000) mal.push("vuelto muy grande para contar con monedas");
      const pasos = contarArriba(q.base, q.pago);
      if (suma(pasos.map(s => s.mas)) !== q.meta || pasos[pasos.length - 1].hasta !== q.pago) mal.push("contar hacia arriba mal");
    }
  }
  if (q.modo === "alcanza") {
    const caben = q.cosas.filter(x => x.p <= q.total);
    if (caben.length !== 1 || caben[0].c.n !== q.correcta) mal.push("alcanza: no hay justo una que alcance");
    if (suma(q.piezas) !== q.total) mal.push("alcancía mal");
  }
  if (q.modo === "cambio" && Number(q.correcta) * q.chica !== q.grande) mal.push("cambio mal");
  if (q.tipo === "escribir") {
    if (!(Number.isInteger(q.correcta) && q.correcta > 0)) mal.push("respuesta escrita rara");
    if (q.modo === "vuelto" && (q.pago - q.precio !== q.correcta || suma(contarArriba(q.precio, q.pago).map(s => s.mas)) !== q.correcta)) mal.push("vuelto escrito mal");
  }
  if (i !== undefined && !(i >= 0)) mal.push("escalón raro");
  return mal;
}

/** Revisa todo: miles de rondas por escalón, las cuentas y las preguntas del examen. Devuelve [] si está bien. */
export function revisarPlata(n = 3000) {
  const mal = [];
  // Cuentas
  if (minimas(75, [50, 25, 10, 5]).join() !== "50,25") mal.push("minimas(75)");
  if (contarArriba(650, 1000).map(s => s.mas).join() !== "50,300") mal.push("contarArriba(650, 1000)");
  if (contarArriba(2345, 5000).map(s => s.mas).join() !== "55,600,2000") mal.push("contarArriba(2345, 5000)");
  if (miles(1000) !== "1\u00A0000" || miles(50000) !== "50\u00A0000" || miles(500) !== "500") mal.push("miles()");
  if (piezas(1, 5) !== "una moneda de ₡5" || piezas(3, 1000, true) !== "3 billetes de 1000 colones") mal.push("piezas()");
  for (let i = 0; i < ESCALONES.length; i++) {
    for (let k = 0; k < n; k++) {
      const q = ronda(i);
      const p = revisarRonda(q, i);
      if (p.length) { mal.push(`escalón ${i + 1} (${ESCALONES[i].nombre}): ${p.join(", ")} · ${JSON.stringify(q).slice(0, 300)}`); break; }
    }
  }
  for (const m of MODOS) for (const e of m.escalones) if (!ESCALONES[e]) mal.push(`modo ${m.id}: escalón ${e} no existe`);
  for (let edad = 3; edad <= 12; edad++) if (!ESCALONES[inicio(edad)]) mal.push(`inicio(${edad})`);
  // Examen
  for (let g = 1; g <= 4; g++) {
    for (let k = 0; k < n; k++) {
      const q = preguntaExamen(Math.random, g);
      const txt = JSON.stringify(q);
      const p = [];
      if (/undefined|NaN|null|Infinity|🐷/.test(txt) || /<b>/.test(q.texto)) p.push("texto raro");
      if (!q.texto || !q.explica || !q.correcta) p.push("faltan campos");
      if (q.tipo === "opcion") {
        if (!q.opciones.includes(q.correcta)) p.push("falta la correcta");
        if (new Set(q.opciones).size !== q.opciones.length || q.opciones.length < 2) p.push("opciones repetidas o pocas");
      } else if (!(Number(q.correcta) > 0)) p.push("número raro");
      if (/\b1 (monedas|billetes|semanas|días)|una monedas|un billetes|Cuántas billetes|Cuántos monedas/.test(txt)) p.push("gramática");
      if (q.tipo === "opcion" && q.opciones.some(o => /₡/.test(o) && o.split(" + ").some(x => !MONEDAS.includes(Number(x.slice(1)))))) p.push("moneda que no existe");
      if (p.length) { mal.push(`examen ${g}°: ${p.join(", ")} · ${txt.slice(0, 300)}`); break; }
    }
  }
  return mal;
}
