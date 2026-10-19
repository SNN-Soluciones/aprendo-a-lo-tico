// 🥭 Lógica de «Repartiendo mangos» (sin pantalla, para poder probarla sola con node).
// Dividir es repartir en partes iguales: 14 mangos entre 4 canastas → 3 en cada una y sobran 2.
// 14 ÷ 4 = 3 (cociente) y sobran 2 (residuo), porque 4 × 3 + 2 = 14.

// Cosas para repartir (con dibujo). f = femenino, para decir «cuántas naranjas».
export const COSAS = [
  { e: "🥭", s: "mango", p: "mangos", f: false },
  { e: "🍊", s: "naranja", p: "naranjas", f: true },
  { e: "🍌", s: "banano", p: "bananos", f: false },
  { e: "🍓", s: "fresa", p: "fresas", f: true },
  { e: "🍋", s: "limón", p: "limones", f: false },
  { e: "🥥", s: "pipa", p: "pipas", f: true },
  { e: "🍬", s: "confite", p: "confites", f: false },
  { e: "🍪", s: "galleta", p: "galletas", f: true },
  { e: "✏️", s: "lápiz", p: "lápices", f: false },
];
// Entre quiénes se reparte (canastas o amigos) y en qué se agrupa
export const AMIGOS = [
  { e: "👧", n: "Sofía" }, { e: "👦", n: "Mateo" }, { e: "🧒", n: "Vale" }, { e: "👧", n: "Dani" },
  { e: "👦", n: "Josué" }, { e: "🧒", n: "Sami" }, { e: "👦", n: "Luis" }, { e: "👧", n: "Ana" }, { e: "🧒", n: "Toño" },
];

const D29 = [2, 3, 4, 5, 6, 7, 8, 9];

// 🪜 Escalones: de repartir con dibujos a dividir números grandes y resolver problemas.
//   tipo: "repartir" (tocar canastas) · "agrupar" (llenar bolsitas de tantos) · "multi" (de la multiplicación a la división)
//         "cuenta" (sin dibujos) · "problema" (de la vida tica)
//   residuo: false = siempre exacto · true = siempre sobra algo · "aveces"
export const ESCALONES = [
  { nombre: "Repartir entre 2", tipo: "repartir", divisores: [2], cociente: [2, 5], residuo: false },             // 1. 4 a 10 entre 2
  { nombre: "Repartir entre 2 o 3", tipo: "repartir", divisores: [2, 3], cociente: [2, 5], residuo: false },     // 2.
  { nombre: "Repartir entre 3 o 4", tipo: "repartir", divisores: [3, 4], cociente: [2, 5], residuo: false },     // 3.
  { nombre: "¡Sobran!", tipo: "repartir", divisores: [2, 3], cociente: [2, 5], residuo: true },                  // 4. lo que no alcanza es el residuo
  { nombre: "Repartir entre más", tipo: "repartir", divisores: [3, 4, 5], cociente: [2, 6], residuo: "aveces", vuelta: true }, // 5. con 🔁 una vuelta
  { nombre: "Bolsitas de tantos", tipo: "agrupar", divisores: [2, 3, 4, 5], cociente: [2, 6], residuo: "aveces" }, // 6. ¿cuántos grupos de 5 salen?
  { nombre: "Multiplicar y dividir", tipo: "multi", divisores: [2, 3, 4, 5], cociente: [2, 10], ops: 3 },        // 7. 4 × 3 = 12 → 12 ÷ 4 = 3
  { nombre: "Todas las tablas", tipo: "multi", divisores: D29, cociente: [2, 10], ops: 4 },                       // 8.
  { nombre: "Sin dibujos", tipo: "cuenta", divisores: [2, 3, 4, 5], cociente: [1, 10], residuo: "aveces" },      // 9. 17 ÷ 5
  { nombre: "Sin dibujos, todas", tipo: "cuenta", divisores: D29, cociente: [1, 10], residuo: "aveces" },        // 10.
  { nombre: "Problemas", tipo: "problema", divisores: D29, cociente: [2, 10], grande: false },                    // 11.
  { nombre: "Números de 2 cifras", tipo: "cuenta", divisores: D29, total: [20, 99], residuo: "aveces" },          // 12. 87 ÷ 4
  { nombre: "Problemas grandes", tipo: "problema", divisores: D29, grande: true },                                // 13.
  { nombre: "Números de 3 cifras", tipo: "cuenta", divisores: D29, total: [100, 999], residuo: "aveces" },        // 14. 4.° grado
];

// Grupos de escalones para los botones del papá o la maestra
export const MANUAL = { repartir: [3, 4], agrupar: [5], cuentas: [6, 7, 8, 9, 11], problemas: [10, 12] };

const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const entre = ([a, b], rnd) => a + Math.floor(rnd() * (b - a + 1));
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/** «sobra 1», «sobran 3» */
export const sobran = r => (r === 1 ? "sobra 1" : `sobran ${r}`);
export const colones = v => "₡" + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const cuantos = c => (c.f ? "Cuántas" : "Cuántos");

/** Divisor, cociente y residuo para un escalón. */
function numeros(e, rnd) {
  const d = azar(e.divisores, rnd);
  const sobra = () => e.residuo === true ? 1 + Math.floor(rnd() * (d - 1))
    : e.residuo === "aveces" ? (rnd() < 0.55 ? 1 + Math.floor(rnd() * (d - 1)) : 0) : 0;
  if (e.total) {
    // Por el tamaño del dividendo (2 o 3 cifras), con cociente de al menos 10
    const [lo, hi] = e.total, qs = [Math.max(10, Math.ceil(lo / d)), Math.floor(hi / d)];
    for (let k = 0; k < 100; k++) {
      const q = entre(qs, rnd), r = sobra(), n = d * q + r;
      if (n >= lo && n <= hi) return { d, q, r, n };
    }
    return { d, q: qs[0], r: 0, n: d * qs[0] };
  }
  const q = entre(e.cociente, rnd), r = sobra();
  return { d, q, r, n: d * q + r };
}

// ---------- Problemas de la vida tica ----------
// pide: "ambos" (cociente y residuo) · "arriba" (hace falta uno más para lo que sobra) · "abajo" (solo los completos)
//       "exacto" (no sobra nada) · "plata" (con colones: cada cosa cuesta ₡d00)
//   ds: divisores que tienen sentido · chico: solo con números chicos · grande: solo con números grandes · max: total máximo
const PROBLEMAS = [
  { pide: "ambos", texto: (n, d) => `La maestra tiene ${n} lápices y los reparte en partes iguales entre ${d} mesas.`,
    q1: "¿Cuántos lápices le tocan a cada mesa?", q2: "¿Cuántos lápices sobran?" },
  { pide: "ambos", texto: (n, d) => `Doña Rosa tiene ${n} mangos y los acomoda en bolsitas de ${d}.`,
    q1: "¿Cuántas bolsitas llena?", q2: "¿Cuántos mangos le sobran?" },
  { pide: "ambos", texto: (n, d) => `En la feria del agricultor, don Luis acomoda ${n} aguacates en canastas de ${d}.`,
    q1: "¿Cuántas canastas llena?", q2: "¿Cuántos aguacates quedan sueltos?" },
  { pide: "ambos", texto: (n, d) => `Una finca de Guanacaste cosechó ${n} melones y los empaca en cajas de ${d}.`,
    q1: "¿Cuántas cajas llena?", q2: "¿Cuántos melones quedan sin caja?" },
  { pide: "arriba", chico: true, ds: [3, 4, 5], texto: (n, d) => `Los papás van a llevar en carro a ${n} niños al paseo. En cada carro caben ${d} niños.`,
    q1: "¿Cuántos carros se necesitan para que vayan todos?", cosa: "niños", grupo: "carros", uno: "uno más" },
  { pide: "arriba", texto: (n, d) => `Para el acto del 15 de setiembre hay que acomodar ${n} sillas en filas de ${d}.`,
    q1: "¿Cuántas filas se necesitan para acomodar todas las sillas?", cosa: "sillas", grupo: "filas", uno: "una más" },
  { pide: "arriba", texto: (n, d) => `Hay ${n} libros para guardar y en cada caja caben ${d}.`,
    q1: "¿Cuántas cajas se necesitan para guardar todos los libros?", cosa: "libros", grupo: "cajas", uno: "una más" },
  { pide: "abajo", ds: [6], texto: (n, d) => `Don Carlos tiene ${n} huevos y los pone en cajitas de ${d}.`,
    q1: "¿Cuántas cajitas llena completas?", cosa: "huevos", noAlcanza: "no alcanzan para otra cajita completa" },
  { pide: "abajo", chico: true, texto: (n, d) => `Una cinta mide ${n} metros y se corta en pedazos de ${d} metros.`,
    q1: "¿Cuántos pedazos completos salen?", cosa: "metros", noAlcanza: "no alcanzan para otro pedazo completo" },
  { pide: "exacto", texto: (n, d) => `Se reparten ${n} confites entre ${d} amigos en partes iguales y no sobra ninguno.`,
    q1: "¿Cuántos confites le tocan a cada uno?" },
  { pide: "exacto", chico: true, ds: [2, 3, 4, 5, 6], max: 40, texto: (n, d) => `En la clase hay ${n} estudiantes y la maestra arma ${d} equipos iguales.`,
    q1: "¿Cuántos estudiantes hay en cada equipo?" },
  { pide: "plata", grande: true, ds: [3, 4, 5, 6, 7, 8, 9], texto: (n, d) => `En la soda, cada empanada cuesta ${colones(d * 100)}. Mamá tiene ${colones(n * 100)}.`,
    q1: "¿Cuántas empanadas puede comprar?", q2: "¿Cuánta plata le sobra?" },
];

/** Un problema para el escalón. */
function problema(e, rnd) {
  const lista = PROBLEMAS.filter(p => (e.grande ? !p.chico : !p.grande));
  const t = azar(lista, rnd);
  const d = azar(t.ds || e.divisores, rnd);
  let q, r;
  if (e.grande) q = entre(t.pide === "plata" ? [10, 20] : [10, 60], rnd);
  else q = entre(e.cociente, rnd);
  if (t.max) q = Math.min(q, Math.floor(t.max / d));
  if (t.pide === "exacto") r = 0;
  else if (t.pide === "arriba" || t.pide === "abajo") r = 1 + Math.floor(rnd() * (d - 1)); // que sí importe lo que sobra
  else r = rnd() < 0.7 ? 1 + Math.floor(rnd() * (d - 1)) : 0;
  const n = d * q + r;
  const cuenta = `${n} ÷ ${d} = ${q}${r ? ` y ${sobran(r)}` : ""}`;
  const pasos = [];
  if (t.pide === "arriba") {
    pasos.push({ id: "total", pregunta: t.q1, respuesta: q + 1,
      explica: `${cuenta}. Con ${q} ${t.grupo} se quedan ${r} ${t.cosa} por fuera: hace falta ${t.uno}. Se necesitan ${q + 1}.` });
  } else if (t.pide === "abajo") {
    pasos.push({ id: "total", pregunta: t.q1, respuesta: q,
      explica: `${cuenta}. Los ${r} ${t.cosa} que sobran ${t.noAlcanza}: son ${q}.` });
  } else if (t.pide === "plata") {
    pasos.push({ id: "cociente", pregunta: t.q1, respuesta: q, explica: `Es como ${n} ÷ ${d} = ${q}${r ? ` y ${sobran(r)}` : ""}: ${q} empanadas cuestan ${colones(q * d * 100)}.` });
    pasos.push({ id: "residuo", pregunta: t.q2, respuesta: r * 100, prefijo: "₡",
      explica: `${colones(n * 100)} − ${colones(q * d * 100)} = ${colones(r * 100)}.` });
  } else if (t.pide === "exacto") {
    pasos.push({ id: "cociente", pregunta: t.q1, respuesta: q, explica: `${n} ÷ ${d} = ${q}, porque ${d} × ${q} = ${n}.` });
  } else {
    pasos.push({ id: "cociente", pregunta: t.q1, respuesta: q, explica: `${cuenta}.` });
    pasos.push({ id: "residuo", pregunta: t.q2, respuesta: r,
      explica: r ? `${d} × ${q} = ${d * q}, y de ${d * q} a ${n} hay ${r}.` : `${d} × ${q} = ${n}: no sobra nada.` });
  }
  return { tipo: "problema", n, d, q, r, texto: t.texto(n, d), pide: t.pide, pasos };
}

/**
 * Una ronda nueva para un escalón.
 * @returns {{ tipo, n, d, q, r, cosa?, quien?, vuelta?, texto?, pasos: {id, pregunta, respuesta, opciones?, prefijo?, explica?}[] }}
 *   pasos: lo que se pregunta después de repartir (o de una vez, sin dibujos)
 */
export function ronda(e, rnd = Math.random, anterior = null) {
  for (let k = 0; k < 20; k++) {
    const r = armar(e, rnd);
    if (!anterior || r.n !== anterior.n || r.d !== anterior.d) return r;
  }
  return armar(e, rnd);
}

function armar(e, rnd) {
  if (e.tipo === "problema") return problema(e, rnd);
  const { d, q, r, n } = numeros(e, rnd);
  const cosa = azar(COSAS, rnd);
  if (e.tipo === "repartir") {
    const amigos = rnd() < 0.45;
    const quien = amigos ? { tipo: "amigos", lista: barajar(AMIGOS, rnd).slice(0, d) } : { tipo: "canastas" };
    const cada = amigos ? "amigo" : "canasta";
    const pasos = [{ id: "cociente", pregunta: `¿${cuantos(cosa)} ${cosa.p} le tocaron a cada ${cada}?`, respuesta: q }];
    if (e.residuo) pasos.push({ id: "residuo", pregunta: `¿${cuantos(cosa)} ${cosa.p} sobraron?`, respuesta: r });
    return { tipo: e.tipo, n, d, q, r, cosa, quien, vuelta: !!e.vuelta, pasos };
  }
  if (e.tipo === "agrupar") {
    const pasos = [{ id: "cociente", pregunta: "¿Cuántas bolsitas salieron?", respuesta: q },
      { id: "residuo", pregunta: `¿${cuantos(cosa)} ${cosa.p} sobraron?`, respuesta: r }];
    return { tipo: e.tipo, n, d, q, r, cosa, pasos };
  }
  if (e.tipo === "multi") {
    // a × b = c → c ÷ a = b (a veces se pregunta c ÷ b = a)
    const otra = rnd() < 0.5;
    const divisor = otra ? q : d, resp = otra ? d : q;
    const ops = new Set([resp]);
    for (const x of barajar([resp - 1, resp + 1, resp - 2, resp + 2, divisor, resp * 2], rnd)) if (ops.size < e.ops && x >= 1 && x <= 20) ops.add(x);
    while (ops.size < e.ops) ops.add(1 + Math.floor(rnd() * 12));
    return { tipo: e.tipo, n: d * q, d: divisor, q: resp, r: 0, a: d, b: q, cosa,
      pasos: [{ id: "cociente", pregunta: `${d * q} ÷ ${divisor} = ?`, respuesta: resp, opciones: barajar([...ops], rnd) }] };
  }
  // cuenta sin dibujos
  return { tipo: "cuenta", n, d, q, r,
    pasos: [{ id: "cociente", pregunta: `${n} ÷ ${d} = ?`, respuesta: q }, { id: "residuo", pregunta: "¿Cuánto sobra?", respuesta: r }] };
}

/**
 * Pista para el cociente sin dibujos: los múltiplos del divisor o, si el número es grande, por partes.
 * completa = false: solo el primer paso (para que el niño termine); true: la cuenta entera (cuando se le muestra).
 */
export function pista({ n, d, q, r }, completa = false) {
  if (q < 10) {
    const mult = Array.from({ length: Math.min(q + 2, 11) }, (_, i) => d * (i + 1));
    return completa ? `${d} × ${q} = ${d * q}${r ? `, y de ${d * q} a ${n} hay ${r}` : ""}: ${n} ÷ ${d} = ${q}${r ? ` y ${sobran(r)}` : ""}.`
      : `Pensá en la tabla del ${d}: ${mult.join(", ")}… ¿Cuál es el más grande que no se pasa de ${n}?`;
  }
  // Por partes: primero las centenas o decenas del cociente, después lo que queda
  const partes = [];
  let resto = n;
  for (let v = 100; v >= 1; v /= 10) {
    const c = Math.floor(resto / (d * v)) * v;
    if (c) { partes.push({ txt: `${d} × ${c} = ${d * c}, quedan ${resto - d * c}`, c, resto: resto - d * c }); resto -= d * c; }
  }
  if (!completa) return `Por partes: ${partes[0].txt}. ¿Cuántas veces más cabe el ${d} en ${partes[0].resto}?`;
  return `Por partes: ${partes.map(x => x.txt).join("; ")}. Juntá: ${partes.map(x => x.c).join(" + ")} = ${q}${r ? ` y ${sobran(r)}` : ""}.`;
}

/** Revisa una ronda. Devuelve una lista de problemas (vacía = bien). Para las pruebas. */
export function revisarRonda(x, e) {
  const mal = [];
  if (x.n !== x.d * x.q + x.r) mal.push(`${x.n} ≠ ${x.d} × ${x.q} + ${x.r}`);
  if (x.r < 0 || x.r >= x.d) mal.push(`residuo ${x.r} con divisor ${x.d}`);
  if (x.d < 2 || x.d > (x.tipo === "multi" ? 10 : 9)) mal.push(`divisor ${x.d}`);
  if (e.residuo === false && x.r) mal.push("no debía sobrar");
  if (e.residuo === true && !x.r) mal.push("debía sobrar");
  if (e.total && (x.n < e.total[0] || x.n > e.total[1])) mal.push(`total ${x.n} fuera de ${e.total}`);
  if (e.total && x.q < 10) mal.push("cociente chico");
  if ((x.tipo === "repartir" || x.tipo === "agrupar") && x.n > 40) mal.push(`muchos dibujos: ${x.n}`);
  if (x.tipo === "repartir" && x.quien.tipo === "amigos" && x.quien.lista.length !== x.d) mal.push("faltan amigos");
  if (!x.pasos.length) mal.push("sin preguntas");
  for (const p of x.pasos) {
    if (!Number.isInteger(p.respuesta) || p.respuesta < 0) mal.push(`respuesta ${p.respuesta}`);
    if (p.opciones) {
      if (new Set(p.opciones).size !== p.opciones.length) mal.push("opciones repetidas");
      if (!p.opciones.includes(p.respuesta)) mal.push("falta la respuesta");
      if (p.opciones.length !== e.ops) mal.push("cuántas opciones");
    }
  }
  if (x.tipo === "multi" && x.d * x.q !== x.n) mal.push("multi no calza");
  if (x.tipo === "problema") {
    const p = x.pasos[0];
    const esperado = x.pide === "arriba" ? x.q + 1 : x.q;
    if (p.respuesta !== esperado) mal.push(`problema ${x.pide}: ${p.respuesta} ≠ ${esperado}`);
    if ((x.pide === "arriba" || x.pide === "abajo") && !x.r) mal.push("debía sobrar en el problema");
    if (x.pide === "exacto" && x.r) mal.push("no debía sobrar en el problema");
    if (/undefined|NaN/.test(x.texto + x.pasos.map(p => p.explica).join(" "))) mal.push("texto roto");
    if (!/\d/.test(x.texto)) mal.push("texto sin números");
  }
  return mal;
}
