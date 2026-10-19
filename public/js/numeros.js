// 💯 Lógica de «Números del 1 al 100» (sin pantalla, para poder probarla sola con node).
// Sentido numérico de 1° y 2°: antes y después, mayor y menor, pares e impares, series,
// decenas y unidades con bloques, la tabla del 100, números en palabras y redondear.
// Cada ronda: { tipo, modo, instr, voz, escena, opciones?, correcta?, explica, vozExplica, … }
//   tipo "opciones": se escoge una · "armar": barras y cubitos · "ordenar": tocar de menor a mayor
//   · "tabla": tocar la casilla de la tabla del 100

// ---------- Números en palabras ----------
const U = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce",
  "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro",
  "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const D = { 3: "treinta", 4: "cuarenta", 5: "cincuenta", 6: "sesenta", 7: "setenta", 8: "ochenta", 9: "noventa" };
/** 0 a 100 en palabras: 43 → «cuarenta y tres». */
export function enPalabras(n) {
  if (n < 30) return U[n];
  if (n === 100) return "cien";
  const u = n % 10;
  return D[Math.floor(n / 10)] + (u ? ` y ${U[u]}` : "");
}
/** Antes de un sustantivo: «un zapato», «veintiún zapatos», «treinta y un zapatos». */
export const cuantos = n => enPalabras(n).replace(/(veinti)?uno$/, (_, v) => (v ? "veintiún" : "un"));
/** «el 47», «el 1»: para decir «antes del 47» se usa del(n). */
export const del = n => `del ${n}`;

// ---------- Ayudas ----------
const entre = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/** Opciones numéricas: la correcta y distractores distintos dentro de [min, max]. */
function opcionesNum(correcta, otras, cuantas, rnd, min = 0, max = 100) {
  const usadas = new Set([correcta]), lista = [correcta];
  for (const x of [...otras, ...barajar([1, 2, 3, 10, 11, 9, 5].flatMap(d => [correcta + d, correcta - d]), rnd)]) {
    if (lista.length >= cuantas) break;
    if (Number.isInteger(x) && x >= min && x <= max && !usadas.has(x)) { usadas.add(x); lista.push(x); }
  }
  return barajar(lista, rnd).map(x => ({ id: String(x), html: String(x), voz: String(x) }));
}
const FRUTAS = ["🥭", "🍌", "🍓", "🍊", "🍉", "🍍", "🥥", "🍎"];

// Dibujito de decenas y unidades: ▮ por cada decena y • por cada unidad
export const bloquitos = n => `<span class="bloq" aria-hidden="true">${"<i class=\"d\"></i>".repeat(Math.floor(n / 10))}${"<i class=\"u\"></i>".repeat(n % 10)}</span>`;

// ---------- Generadores ----------
/** ¿Qué va antes, después o entre? */
function vecino({ max, entreSi = true }, rnd) {
  const tipos = entreSi ? ["antes", "despues", "entre"] : ["antes", "despues"];
  const tipo = azar(tipos, rnd);
  // Con más de 20, la mitad de las veces se cruza la decena (39 → 40), que es lo difícil
  let n;
  if (max > 20 && rnd() < 0.5) n = tipo === "antes" ? entre(1, Math.floor(max / 10) - 1, rnd) * 10 : entre(1, Math.floor(max / 10) - 1, rnd) * 10 + 9;
  else n = entre(2, max - 1, rnd);
  if (tipo === "entre" && n + 2 > max) n = max - 2;
  if (tipo === "entre" && n < 1) n = 1;
  let correcta, caja, voz, explica, otras;
  if (tipo === "antes") {
    correcta = n - 1;
    caja = [`<b class="hueco">?</b>`, `<b>${n}</b>`];
    voz = `¿Qué número va antes ${del(n)}?`;
    explica = `Antes ${del(n)} va el <b>${correcta}</b>: contamos para atrás, ${n}, ${correcta}.`;
    otras = [n + 1, n % 10 === 0 ? n - 10 : n - 2, n % 10 === 0 ? n - 11 : n + 2];
  } else if (tipo === "despues") {
    correcta = n + 1;
    caja = [`<b>${n}</b>`, `<b class="hueco">?</b>`];
    voz = `¿Qué número va después ${del(n)}?`;
    explica = n % 10 === 9
      ? `Después ${del(n)} va el <b>${correcta}</b>: después del nueve se completa una decena nueva.`
      : `Después ${del(n)} va el <b>${correcta}</b>: contamos para adelante, ${n}, ${correcta}.`;
    otras = [n - 1, n % 10 === 9 ? n - 9 : n + 2, n % 10 === 9 ? n + 11 : n + 10];
  } else {
    correcta = n + 1;
    caja = [`<b>${n}</b>`, `<b class="hueco">?</b>`, `<b>${n + 2}</b>`];
    voz = `¿Qué número va entre el ${n} y el ${n + 2}?`;
    explica = `Entre el ${n} y el ${n + 2} va el <b>${correcta}</b>: ${n}, ${correcta}, ${n + 2}.`;
    otras = [n, n + 2, n + 3, n - 1];
  }
  return { tipo: "opciones", modo: "vecino", instr: `<span class="tira">${caja.join("")}</span>`, voz,
    opciones: opcionesNum(correcta, otras, 3, rnd, 0, Math.max(max, correcta)), correcta: String(correcta), explica,
    pista: tipo === "antes" ? "Contá para atrás, de uno en uno." : "Contá para adelante, de uno en uno." };
}

/** ¿Dónde hay más (o menos)? Con dibujos. */
function comparar({ max }, rnd) {
  let a = entre(1, max, rnd), b;
  do b = entre(1, max, rnd); while (b === a);
  const mas = rnd() < 0.5, fruta = azar(FRUTAS, rnd);
  const correcta = (mas ? a > b : a < b) ? "a" : "b";
  const grupo = n => `<span class="grupo">${fruta.repeat(n)}</span><b>${n}</b>`;
  const g = correcta === "a" ? a : b, otro = correcta === "a" ? b : a;
  return { tipo: "opciones", modo: "comparar", instr: mas ? "¿Dónde hay <b>más</b>?" : "¿Dónde hay <b>menos</b>?",
    voz: mas ? "¿Dónde hay más? Tocá el grupo que tiene más." : "¿Dónde hay menos? Tocá el grupo que tiene menos.",
    opciones: [{ id: "a", html: grupo(a), voz: String(a) }, { id: "b", html: grupo(b), voz: String(b) }], correcta, cols: 2,
    explica: mas ? `${g} es <b>mayor</b> que ${otro}: hay ${g - otro} más.` : `${g} es <b>menor</b> que ${otro}: hay ${otro - g} menos.`,
    pista: "Contá cada grupo y fijate cuál número es más grande." };
}

/** ¿Par o impar? Con zapatos en parejas (hasta 12) o con la última cifra. */
function paridad({ max }, rnd) {
  const n = entre(1, max, rnd), par = n % 2 === 0;
  let escena, explica;
  if (n <= 12) {
    const parejas = Math.floor(n / 2);
    escena = `<span class="zapatos">${"<span class=\"pareja\">👟👟</span>".repeat(parejas)}${par ? "" : "<span class=\"solo\">👟</span>"}</span>`;
    explica = n === 1
      ? "Con 1 zapato no se hace ninguna pareja: queda solito. El 1 es <b>impar</b>."
      : par
        ? `Con ${n} zapatos se ${parejas === 1 ? "hace una pareja" : `hacen ${parejas} parejas`} y no sobra ninguno: el ${n} es <b>par</b>.`
        : `Con ${n} zapatos se ${parejas === 1 ? "hace una pareja" : `hacen ${parejas} parejas`} y sobra uno solito: el ${n} es <b>impar</b>.`;
  } else {
    const u = n % 10;
    escena = `<span class="grande">${Math.floor(n / 10)}<u>${u}</u></span>`;
    explica = `El ${n} termina en ${u}. Los que terminan en 0, 2, 4, 6 u 8 son pares; los que terminan en 1, 3, 5, 7 o 9 son impares. El ${n} es <b>${par ? "par" : "impar"}</b>.`;
  }
  return { tipo: "opciones", modo: "paridad", instr: `¿El <b>${n}</b> es par o impar?`, voz: `¿El ${n} es par o impar?`, escena,
    opciones: [{ id: "par", html: "👟👟<br>Par", voz: "par" }, { id: "impar", html: "👟<br>Impar", voz: "impar" }], correcta: par ? "par" : "impar", cols: 2,
    explica, pista: n <= 12 ? "Fijate si a algún zapato le falta su pareja." : "Mirá el último número: ¿en qué termina?" };
}

/** Completar la serie: de 2 en 2, de 5 en 5, de 10 en 10. */
function serie({ saltos, libre }, rnd) {
  const s = azar(saltos, rnd), largo = 5;
  let ini;
  if (libre) ini = entre(1, 100 - s * (largo - 1), rnd);
  else ini = s * entre(1, Math.max(1, Math.floor((s === 2 ? 30 : 100) / s) - (largo - 1)), rnd);
  const nums = Array.from({ length: largo }, (_, i) => ini + i * s);
  const h = entre(1, largo - 1, rnd), correcta = nums[h];
  const tira = nums.map((x, i) => (i === h ? `<b class="hueco">?</b>` : `<b>${x}</b>`)).join("");
  return { tipo: "opciones", modo: "serie", instr: `<span class="tira serie">${tira}</span>`,
    voz: `Contamos de ${s} en ${s}: ${nums.map((x, i) => (i === h ? "¿cuál?" : x)).join(", ")}. ¿Qué número falta?`,
    opciones: opcionesNum(correcta, [correcta + 1, correcta - 1, correcta + s, correcta - s], 3, rnd, 0, 100), correcta: String(correcta),
    explica: `Vamos de ${s} en ${s}: ${nums.join(", ")}. Cada vez sumamos ${s}: ${nums[h - 1]} + ${s} = <b>${correcta}</b>.`,
    pista: `Sumale ${s} al número de antes.` };
}

/** Armar un número con barras (decenas) y cubitos (unidades). */
function armar({ max }, rnd) {
  let n;
  do n = entre(11, max, rnd); while (n % 10 === 0);
  return { tipo: "armar", modo: "decenas", n, instr: `Armá el <b>${n}</b>`,
    voz: `Armá el ${n} con barras de diez y cubitos de uno.`,
    explica: `${n} = <b>${Math.floor(n / 10)} ${Math.floor(n / 10) === 1 ? "decena" : "decenas"}</b> y <b>${n % 10} ${n % 10 === 1 ? "unidad" : "unidades"}</b>: ${Math.floor(n / 10)} ${Math.floor(n / 10) === 1 ? "barra" : "barras"} de 10 y ${n % 10} ${n % 10 === 1 ? "cubito" : "cubitos"}.`,
    pista: `El ${n} tiene ${Math.floor(n / 10)} decenas: poné esas barras primero.` };
}

/** <, > o = : la boca del lagarto. */
function signo({ max }, rnd) {
  let a = entre(1, max, rnd), b;
  const r = rnd();
  if (r < 0.15) b = a; // iguales
  else if (r < 0.4 && a >= 10 && a % 11 !== 0) b = (a % 10) * 10 + Math.floor(a / 10); // 34 y 43
  else if (r < 0.65 && a >= 10) { do b = Math.floor(a / 10) * 10 + entre(0, 9, rnd); while (b === a || b < 1); } // misma decena
  else do b = entre(1, max, rnd); while (b === a);
  if (b < 1 || b > max) b = a === max ? a - 1 : a + 1;
  const correcta = a < b ? "<" : a > b ? ">" : "=";
  const nombre = { "<": "es menor que", ">": "es mayor que", "=": "es igual a" };
  const porque = correcta === "="
    ? `${a} y ${b} son el mismo número.`
    : Math.floor(a / 10) !== Math.floor(b / 10)
      ? `Primero se miran las decenas: ${Math.floor(Math.max(a, b) / 10)} decenas es más que ${Math.floor(Math.min(a, b) / 10)}.`
      : `Las decenas son iguales; entonces se miran las unidades: ${Math.max(a, b) % 10} es más que ${Math.min(a, b) % 10}.`;
  return { tipo: "opciones", modo: "signo", instr: `<span class="tira"><b>${a}</b><b class="hueco">?</b><b>${b}</b></span>`,
    voz: `¿Qué signo va entre el ${a} y el ${b}? ¿Menor que, mayor que o igual?`,
    escena: `<span class="par-bloq"><span>${bloquitos(a)}</span><span>${bloquitos(b)}</span></span>`,
    opciones: [{ id: "<", html: "&lt;", voz: "menor que" }, { id: ">", html: "&gt;", voz: "mayor que" }, { id: "=", html: "=", voz: "igual a" }], correcta, cols: 3,
    explica: `${a} ${nombre[correcta]} ${b}: <b>${a} ${correcta === "<" ? "&lt;" : correcta === ">" ? "&gt;" : "="} ${b}</b>. ${porque}${correcta === "=" ? "" : " La boca del lagarto 🐊 se abre hacia el número más grande: ¡se lo quiere comer!"}`,
    pista: "Mirá primero las decenas (las barras). Si son iguales, mirá las unidades." };
}

/** Ordenar de menor a mayor. */
function ordenar({ cuantos: k }, rnd) {
  const nums = new Set();
  const base = entre(12, 98, rnd);
  if (base % 11 !== 0) nums.add(base).add((base % 10) * 10 + Math.floor(base / 10)); // con trampa: 34 y 43
  while (nums.size < k) { const x = entre(1, 100, rnd); if (x >= 1) nums.add(x); }
  const lista = barajar([...nums].slice(0, k).filter(x => x >= 1 && x <= 100), rnd);
  while (lista.length < k) { const x = entre(1, 100, rnd); if (!lista.includes(x)) lista.push(x); }
  const orden = [...lista].sort((a, b) => a - b);
  return { tipo: "ordenar", modo: "ordenar", numeros: lista, orden, instr: "Tocalos de <b>menor a mayor</b>",
    voz: `Tocá los números de menor a mayor: primero el más pequeño. Son: ${lista.join(", ")}.`,
    explica: `De menor a mayor: <b>${orden.join(" &lt; ")}</b>.`, pista: "Buscá el que tiene menos decenas." };
}

/** La tabla del 100: ¿dónde va? */
function tablaDonde(_, rnd) {
  let n;
  do n = entre(12, 99, rnd); while (n % 10 === 0 || n % 10 === 1);
  return { tipo: "tabla", modo: "tabla", n, instr: `¿Dónde va el <b>${n}</b>?`,
    voz: `Tocá en la tabla dónde va el ${n}.`,
    explica: `El ${n} va en la fila que empieza con el ${Math.floor((n - 1) / 10) * 10 + 1}, en la columna del ${(n - 1) % 10 + 1}: ${Math.floor(n / 10)} decenas y ${n % 10} unidades.`,
    pista: `Buscá la fila que empieza con el ${Math.floor((n - 1) / 10) * 10 + 1}.` };
}

/** La tabla del 100: ¿qué número falta? (para abajo +10, a la derecha +1) */
function tablaFalta(_, rnd) {
  let n;
  do n = entre(12, 89, rnd); while (n % 10 === 0 || n % 10 === 1);
  const vec = { arriba: n - 10, abajo: n + 10, izq: n - 1, der: n + 1 };
  const cual = azar(Object.keys(vec), rnd), correcta = vec[cual];
  const celda = k => (k === cual ? `<b class="hueco">?</b>` : `<b>${vec[k]}</b>`);
  const cruz = `<span class="cruz"><i></i>${celda("arriba")}<i></i>${celda("izq")}<b class="centro">${n}</b>${celda("der")}<i></i>${celda("abajo")}<i></i></span>`;
  const regla = { arriba: "Para arriba se resta 10", abajo: "Para abajo se suma 10", izq: "A la izquierda se resta 1", der: "A la derecha se suma 1" }[cual];
  return { tipo: "opciones", modo: "tabla", instr: "¿Qué número <b>falta</b> en la tabla del 100?", voz: "Este es un pedacito de la tabla del 100. ¿Qué número falta?",
    escena: cruz, opciones: opcionesNum(correcta, cual === "arriba" || cual === "abajo" ? [n + (cual === "arriba" ? 10 : -10), n - 1 + (cual === "abajo" ? 10 : -10), correcta + 1] : [correcta + 10, correcta - 10, n + (cual === "der" ? -1 : 1)], 3, rnd, 1, 100),
    correcta: String(correcta), explica: `${regla}: ${n} ${cual === "abajo" || cual === "der" ? "+" : "−"} ${cual === "arriba" || cual === "abajo" ? 10 : 1} = <b>${correcta}</b>.`,
    pista: "En la tabla del 100, para abajo va de 10 en 10 y para el lado, de 1 en 1." };
}

/** Números en palabras: de la palabra al número o al revés. */
function palabras(_, rnd) {
  let n;
  do n = entre(13, 99, rnd); while (n % 11 === 0 || n % 10 === 0);
  const vuelta = (n % 10) * 10 + Math.floor(n / 10);
  const otrosNum = [vuelta, n + 10, n - 10, Math.floor(n / 10) * 10, n + 1].filter(x => x >= 1 && x <= 100 && x !== n && x % 10 !== 0 || x === Math.floor(n / 10) * 10);
  if (rnd() < 0.5) {
    return { tipo: "opciones", modo: "palabras", instr: `<span class="palabra">${enPalabras(n)}</span>`, voz: `¿Qué número es ${enPalabras(n)}?`,
      opciones: opcionesNum(n, otrosNum, 4, rnd, 1, 100), correcta: String(n), cols: 2,
      explica: `«${enPalabras(n)}» es el <b>${n}</b>: ${Math.floor(n / 10)} decenas y ${n % 10} unidades.`,
      pista: "La primera palabra dice las decenas; la que va después de la «y», las unidades." };
  }
  const malas = [...new Set(otrosNum)].slice(0, 3);
  const ops = barajar([n, ...malas].slice(0, 4), rnd).map(x => ({ id: String(x), html: enPalabras(x), voz: enPalabras(x) }));
  return { tipo: "opciones", modo: "palabras", instr: `¿Cómo se dice el <b class="grande-num">${n}</b>?`, voz: `¿Cuál de estas palabras es el ${n}?`,
    opciones: ops, correcta: String(n), cols: 1,
    explica: `El <b>${n}</b> se dice «${enPalabras(n)}».`,
    pista: `El ${n} empieza con ${Math.floor(n / 10)} decenas.` };
}

/** Redondear a la decena más cercana. */
function redondear(_, rnd) {
  let n;
  do n = entre(11, 99, rnd); while (n % 10 === 0);
  const abajo = Math.floor(n / 10) * 10, arriba = abajo + 10, u = n % 10, correcta = u >= 5 ? arriba : abajo;
  const marcas = Array.from({ length: 11 }, (_, i) => `<i class="${abajo + i === n ? "aqui" : ""}">${i === 0 || i === 10 || abajo + i === n ? abajo + i : ""}</i>`).join("");
  const explica = u === 5
    ? `${n} está justo en el medio entre ${abajo} y ${arriba}. Cuando termina en 5, se redondea para arriba: <b>${arriba}</b>.`
    : u > 5
      ? `${n} está más cerca del ${arriba} (le faltan ${10 - u}) que del ${abajo} (está a ${u}): <b>${arriba}</b>.`
      : `${n} está más cerca del ${abajo} (está a ${u}) que del ${arriba} (le faltan ${10 - u}): <b>${abajo}</b>.`;
  return { tipo: "opciones", modo: "redondear", instr: `Redondeá el <b>${n}</b> a la decena más cercana`,
    voz: `Redondeá el ${n} a la decena más cercana. ¿Está más cerca del ${abajo} o del ${arriba}?`,
    escena: `<span class="recta">${marcas}</span>`,
    opciones: opcionesNum(correcta, [correcta === abajo ? arriba : abajo, n], 3, rnd, 0, 100).map(o => o.id === String(n) ? { ...o, html: String(n) } : o),
    correcta: String(correcta), explica, pista: "Mirá en la recta a cuál decena le queda más cerquita." };
}

// ---------- 🪜 Escalones: de 1–10 a 1–100 ----------
export const ESCALONES = [
  { nombre: "Antes y después hasta 10", gen: r => vecino({ max: 10, entreSi: false }, r) },   //  1
  { nombre: "¿Dónde hay más?", gen: r => comparar({ max: 10 }, r) },                          //  2. con dibujos
  { nombre: "Par o impar hasta 10", gen: r => paridad({ max: 10 }, r) },                      //  3. zapatos en parejas
  { nombre: "Antes, después y entre hasta 20", gen: r => vecino({ max: 20 }, r) },            //  4
  { nombre: "De 2 en 2 y de 10 en 10", gen: r => serie({ saltos: [2, 10] }, r) },             //  5. desde 0
  { nombre: "Decenas y unidades hasta 50", gen: r => armar({ max: 50 }, r) },                 //  6. barras y cubitos
  { nombre: "Mayor, menor o igual hasta 100", gen: r => signo({ max: 100 }, r) },             //  7. la boca del lagarto
  { nombre: "Antes, después y entre hasta 100", gen: r => vecino({ max: 100 }, r) },          //  8. cruzando la decena
  { nombre: "Series desde cualquier número", gen: r => serie({ saltos: [2, 5, 10], libre: true }, r) }, // 9
  { nombre: "Par o impar hasta 100", gen: r => paridad({ max: 100 }, r) },                    // 10. la última cifra
  { nombre: "La tabla del 100", gen: r => (r() < 0.5 ? tablaDonde : tablaFalta)({}, r) },     // 11
  { nombre: "Ordenar de menor a mayor", gen: r => ordenar({ cuantos: r() < 0.5 ? 3 : 4 }, r) }, // 12
  { nombre: "Números en palabras", gen: r => palabras({}, r) },                               // 13
  { nombre: "Redondear a la decena", gen: r => redondear({}, r) },                            // 14 (2°)
];
// Modos a mano (papá o maestra): escalones de cada tema
export const MODOS = [
  { id: "vecino", emoji: "🔢", nombre: "Antes y después", escalones: [0, 3, 7] },
  { id: "comparar", emoji: "🐊", nombre: "Mayor y menor", escalones: [1, 6, 11] },
  { id: "paridad", emoji: "👟", nombre: "Pares e impares", escalones: [2, 9] },
  { id: "serie", emoji: "🦘", nombre: "Series", escalones: [4, 8] },
  { id: "decenas", emoji: "🧱", nombre: "Decenas", escalones: [5, 13] },
  { id: "tabla", emoji: "💯", nombre: "Tabla del 100", escalones: [10] },
  { id: "palabras", emoji: "🔤", nombre: "En palabras", escalones: [12] },
];
export const inicio = edad => (edad === null || edad <= 6 ? 0 : edad === 7 ? 3 : 6);

export const ronda = (i, rnd = Math.random) => ESCALONES[i].gen(rnd);

/** Revisa una ronda. Devuelve una lista de problemas (vacía = bien). */
export function revisarRonda(q) {
  const mal = [];
  const texto = JSON.stringify(q);
  if (/undefined|NaN|null/.test(texto)) mal.push("undefined/NaN");
  if (/de el |\buno (zapatos|decenas|unidades|barras|cubitos)/.test(texto)) mal.push("gramática");
  if (q.tipo === "opciones") {
    const ids = q.opciones.map(o => o.id);
    if (new Set(ids).size !== ids.length) mal.push("opciones repetidas");
    if (!ids.includes(q.correcta)) mal.push("falta la correcta");
    if (ids.length < 2) mal.push("muy pocas opciones");
    if (q.modo === "vecino" || q.modo === "serie" || q.modo === "tabla" || q.modo === "redondear" || q.modo === "palabras")
      ids.forEach(x => { if (!(Number(x) >= 0 && Number(x) <= 100)) mal.push(`opción fuera de rango: ${x}`); });
    if (q.modo === "redondear") {
      const n = Number(q.instr.match(/<b>(\d+)<\/b>/)[1]);
      const esp = n % 10 >= 5 ? Math.ceil(n / 10) * 10 : Math.floor(n / 10) * 10;
      if (String(esp) !== q.correcta) mal.push("redondeo mal");
    }
  }
  if (q.tipo === "armar" && !(q.n >= 11 && q.n <= 100)) mal.push("número para armar fuera de rango");
  if (q.tipo === "ordenar") {
    if (new Set(q.numeros).size !== q.numeros.length) mal.push("números repetidos");
    if (q.orden.some((x, i) => i && x <= q.orden[i - 1])) mal.push("orden mal");
    if (q.numeros.some(x => x < 1 || x > 100)) mal.push("número fuera de rango");
  }
  if (q.tipo === "tabla" && !(q.n >= 1 && q.n <= 100)) mal.push("tabla fuera de rango");
  return mal;
}
