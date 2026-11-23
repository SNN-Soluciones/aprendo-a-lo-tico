// ✅ Corrección de la convocatoria de 8°: funciones puras (sin DOM), las usa el navegador y las prueban en node.
//
// Cada materia es un módulo en js/c8/<id>.js con `export default { temas, simulacros, duracion }`.
// La forma de cada pieza (la revisa pruebas/unidad/c8-contenido.test.mjs):
//
//   Tema      { id, titulo, indicadores: string[], materia: Bloque[], cuaderno: Tarea[], practica: Item[] }
//   Bloque    { t: "h", x } subtítulo · { t: "p", x } párrafo · { t: "lista", x: string[] }
//             { t: "tabla", cab: string[], filas: string[][] } · { t: "ej", x } ejemplo · { t: "ojo", x } error común
//             { t: "texto", titulo?, x } lectura larga (párrafos separados por \n) · { t: "svg", x: "<svg…>", alt }
//             En los textos, **así** sale en negrita y _así_ en cursiva. Todo lo demás se escapa.
//   Tarea     { tipo: "copiar"|"resumir"|"buscar"|"escribir"|"moverse"|"decir", x }  (se hace en el cuaderno)
//   Item      { t: "lectura", titulo?, x }                      texto para leer (no vale puntos)
//             { t: "opcion", p, o: string[], r: índice, e }     selección única (las opciones se barajan)
//             { t: "vf", p, r: boolean, e }                     falso o verdadero
//             { t: "completar", p: "… ___ …", r: string[], e, may?, tildes? }  escribe; r = respuestas aceptadas
//             { t: "numero", p, r: "3/4" | number, e }          un número (entero, decimal con coma o fracción)
//             { t: "expresion", p, r: "6x^3 - 4x^2", e }        expresión algebraica simplificada al máximo
//                                                                (si r es una potencia de un número, «2^7», se pide tal cual)
//             { t: "parejas", p, pares: [izq, der][], e }       a cada izq le elige una der (las der se pueden repetir)
//             { t: "ordenar", p, x: string[], e }              x viene en el orden correcto (se muestra barajado)
//             { t: "abierta", p, guia: string[], modelo, lineas?, palabras?: [min, max] }  en el cuaderno, la revisa un adulto
//             { t: "oral", p, seg, guia: string[], modelo }      la pregunta se oye en inglés y contesta en voz alta
//             Cualquier item puede traer `fig: "<svg…>"` (dibujo) y `pts` (cuánto vale; si no, 1).
//   Simulacro { nombre, partes: [{ titulo, instrucciones, items: Item[] }] }

const SUPER = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-" };

/**
 * Texto comparable: sin espacios de más ni signo final, comillas rectas y, si no se pide, sin mayúsculas.
 * @param {string} texto
 * @param {{ may?: boolean, tildes?: boolean }} [op] may: respeta mayúsculas · tildes: false para no exigirlas
 */
export function normalizar(texto, { may = false, tildes = true } = {}) {
  let t = String(texto ?? "").normalize("NFC")
    .replace(/[’‘´`]/g, "'").replace(/[“”«»]/g, '"').replace(/[‐‑–—−]/g, "-")
    .replace(/\s+/g, " ").trim()
    .replace(/\s*-\s*/g, "-")
    .replace(/[.!?¡¿,;:]+$/g, "").replace(/^[¡¿]+/, "").trim();
  if (!may) t = t.toLowerCase();
  if (!tildes) t = t.normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC");
  return t;
}

const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/** Fracción reducida {n, d} con d > 0; null si no es exacta (números enormes) o el denominador es 0. */
export function fraccion(n, d = 1) {
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d === 0) return null;
  const g = mcd(n, d), s = d < 0 ? -1 : 1;
  return { n: (s * n) / g || 0, d: (s * d) / g };
}
const sumar = (a, b) => (a && b ? fraccion(a.n * b.d + b.n * a.d, a.d * b.d) : null);
const multiplicar = (a, b) => (a && b ? fraccion(a.n * b.n, a.d * b.d) : null);
/** Exponentes de más de 64 no aparecen en 8°: así una respuesta como «2^99999999» no congela la página. */
const MAX_EXPONENTE = 64;
const elevar = (a, k) => {
  if (!a || Math.abs(k) > MAX_EXPONENTE) return null;
  if (k < 0) return a.n === 0 ? null : elevar(fraccion(a.d, a.n), -k);
  let r = fraccion(1);
  for (let i = 0; i < k && r; i++) r = multiplicar(r, a);
  return r;
};

/** «12», «-2,5», «3/4», «x = -7/2», «153.750» → fracción reducida; null si no es un número («1 1/2» tampoco). */
export function leerNumero(texto) {
  if (typeof texto === "number") {
    if (!Number.isFinite(texto)) return null;
    texto = texto.toFixed(10).replace(/\.?0+$/, "");
  }
  let crudo = String(texto ?? "").replace(/[−–]/g, "-").trim();
  // Miles como se escriben en Costa Rica: «153.750» o «153 750» (el decimal va con coma: «153.750,5»)
  if (/^[+-]?\d{1,3}(?:[ .]\d{3})+(?:,\d+)?$/.test(crudo)) crudo = crudo.replace(/[ .]/g, "");
  if (/\d\s+\d/.test(crudo)) return null;
  const t = crudo.replace(/\s+/g, "").replace(/^[a-z]=/i, "");
  let m = t.match(/^([+-]?)(\d+)\/(\d+)$/);
  if (m) return fraccion((m[1] === "-" ? -1 : 1) * Number(m[2]), Number(m[3]));
  m = t.match(/^([+-]?)(\d+)(?:[.,](\d+))?$/);
  if (!m) return null;
  const dec = m[3] || "";
  return fraccion((m[1] === "-" ? -1 : 1) * Number(m[2] + dec), 10 ** dec.length);
}

export const mismoNumero = (a, b) => {
  const x = leerNumero(a), y = leerNumero(b);
  return !!x && !!y && x.n === y.n && x.d === y.d;
};

/**
 * Lee una expresión algebraica escrita como suma de monomios: «-3x^2y + 1/2x - 5», «3x/4», «2³·2⁴», «a²b - ab²».
 * No acepta paréntesis: la respuesta tiene que venir ya resuelta.
 * @returns {{ terminos: Map<string, {n:number,d:number}>, simplificada: boolean } | null}
 *   terminos: clave «x2.y1» → coeficiente · simplificada: sin términos semejantes repetidos, ni ceros sobrantes,
 *   ni la misma letra dos veces en un término, ni potencias de números sin calcular junto a letras.
 */
export function leerExpresion(texto) {
  const t = String(texto ?? "").normalize("NFC").replace(/\s+/g, "")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, s => "^" + [...s].map(c => SUPER[c]).join(""))
    .replace(/[−–]/g, "-").replace(/[·×*]/g, "*");
  if (!t || t.length > 200 || /[^0-9a-z^*+\-/,.]/i.test(t)) return null;
  const terminos = new Map();
  let simplificada = true, i = 0, leidos = 0, ceroConLetras = false, ceros = 0;
  const numero = () => {
    const m = t.slice(i).match(/^\d+(?:[.,]\d+)?/);
    if (!m) return null;
    i += m[0].length;
    return leerNumero(m[0]);
  };
  const exponente = () => {
    if (t[i] !== "^") return 1;
    const m = t.slice(i + 1).match(/^-?\d+/);
    if (!m) return null;
    i += 1 + m[0].length;
    return Number(m[0]);
  };
  const divisor = () => { // «/4» después de un número o de una letra
    i++;
    const d = numero();
    return d && d.n !== 0 ? fraccion(d.d, d.n) : null;
  };
  while (i < t.length) {
    let signo = 1;
    if (t[i] === "+" || t[i] === "-") { signo = t[i] === "-" ? -1 : 1; i++; }
    else if (i > 0) return null;
    let coef = fraccion(signo), letras = {}, algo = false, numeros = 0;
    while (i < t.length && t[i] !== "+" && t[i] !== "-") {
      if (t[i] === "*") { i++; continue; }
      if (t[i] === "/") {
        if (!algo) return null;
        coef = multiplicar(coef, divisor());
      } else if (/\d/.test(t[i])) {
        let n = numero();
        if (t[i] === "/") n = multiplicar(n, divisor());
        const k = exponente();
        if (k === null) return null;
        if (k !== 1) numeros++;
        coef = multiplicar(coef, elevar(n, k));
        algo = true;
      } else if (/[a-z]/i.test(t[i])) {
        const letra = t[i++];
        const k = exponente();
        if (k === null || Math.abs(k) > MAX_EXPONENTE) return null;
        if (letra in letras) simplificada = false;
        letras[letra] = (letras[letra] || 0) + k;
        algo = true;
      } else return null;
      if (!coef) return null;
    }
    if (!algo) return null;
    leidos++;
    const clave = Object.keys(letras).filter(l => letras[l] !== 0).sort().map(l => l + letras[l]).join(".");
    if (numeros && clave) simplificada = false;
    if (coef.n === 0) { ceros++; if (clave) ceroConLetras = true; }
    if (terminos.has(clave)) { simplificada = false; terminos.set(clave, sumar(terminos.get(clave), coef)); }
    else terminos.set(clave, coef);
  }
  // Un «0» solo está bien; un cero al lado de otros términos (o «0x») sobra
  if (ceroConLetras || (ceros && leidos > 1)) simplificada = false;
  for (const [k, c] of terminos) if (c.n === 0) terminos.delete(k);
  return { terminos, simplificada };
}

/** La forma escrita, para comparar potencias de números que tienen que quedar como potencia («2^7», no «128»). */
const forma = x => String(x ?? "").normalize("NFC").replace(/\s+/g, "")
  .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, s => "^" + [...s].map(c => SUPER[c]).join("")).replace(/[−–]/g, "-");

/** ¿La respuesta vale lo mismo que la esperada y está simplificada al máximo? */
export function mismaExpresion(respuesta, esperada) {
  const a = leerExpresion(respuesta), b = leerExpresion(esperada);
  if (!a || !b) return { ok: false, motivo: a ? "" : "No se entiende cómo está escrita (sin paréntesis, potencias con ^)." };
  const iguales = a.terminos.size === b.terminos.size &&
    [...a.terminos].every(([k, c]) => { const o = b.terminos.get(k); return o && o.n === c.n && o.d === c.d; });
  if (!iguales) return { ok: false, motivo: "" };
  if (!a.simplificada) return { ok: false, motivo: "Vale lo mismo, pero no está simplificada al máximo." };
  // Si lo esperado es una potencia de un número sin letras («5^3»), se pide tal cual, no el resultado ni otra forma
  if (/^\d+\^-?\d+$/.test(forma(esperada)) && forma(respuesta) !== forma(esperada)) {
    return { ok: false, motivo: "Se pide expresado como una sola potencia." };
  }
  return { ok: true, motivo: "" };
}

/** Cuánto vale un item (los de lectura, nada). */
export function puntosDe(item) {
  if (item.t === "lectura") return 0;
  if (item.t === "parejas") return item.pares.length;
  if (item.t === "abierta" || item.t === "oral") return item.guia.length;
  return item.pts ?? 1;
}

/** ¿El item lo corrige la página (true) o un adulto con la guía (false)? */
export const seCorrigeSolo = item => !["abierta", "oral", "lectura"].includes(item.t);

/**
 * Corrige una respuesta.
 * - opcion: índice de la opción original · vf: true/false · completar, numero y expresion: el texto escrito
 * - parejas: arreglo con la der elegida para cada par (en el orden de `pares`)
 * - ordenar: arreglo con el número de lugar (1, 2, 3…) que le puso a cada frase de `x`
 * - abierta y oral: arreglo de true/false, uno por criterio de la guía (lo marca el adulto)
 * @returns {{ pts: number, total: number, ok: boolean, motivo: string }}
 */
export function calificar(item, respuesta) {
  try {
    return calificarSinProteger(item, respuesta);
  } catch {
    // Una respuesta rarísima nunca rompe la entrega: cuenta como incorrecta
    return { pts: 0, total: puntosDe(item), ok: false, motivo: "No se pudo leer la respuesta." };
  }
}

function calificarSinProteger(item, respuesta) {
  const total = puntosDe(item);
  const res = (bien, motivo = "") => ({ pts: bien ? total : 0, total, ok: bien, motivo });
  switch (item.t) {
    case "lectura": return { pts: 0, total: 0, ok: true, motivo: "" };
    case "opcion": return res(respuesta === item.r);
    case "vf": return res(respuesta === item.r);
    case "completar": {
      const op = { may: !!item.may, tildes: item.tildes !== false };
      const dada = normalizar(respuesta, op);
      return res(!!dada && item.r.some(r => normalizar(r, op) === dada));
    }
    case "numero": return res(mismoNumero(respuesta, item.r));
    case "expresion": {
      const { ok, motivo } = mismaExpresion(respuesta, item.r);
      return res(ok, motivo);
    }
    case "parejas": {
      const elegidas = Array.isArray(respuesta) ? respuesta : [];
      const pts = item.pares.filter(([, der], i) => elegidas[i] === der).length;
      return { pts, total, ok: pts === total, motivo: "" };
    }
    case "ordenar": {
      const lugares = Array.isArray(respuesta) ? respuesta.map(Number) : [];
      return res(item.x.every((_, i) => lugares[i] === i + 1));
    }
    case "abierta":
    case "oral": {
      const marcas = Array.isArray(respuesta) ? respuesta : [];
      const pts = item.guia.filter((_, i) => marcas[i] === true).length;
      return { pts, total, ok: pts === total, motivo: "" };
    }
    default: return { pts: 0, total, ok: false, motivo: "Tipo de pregunta desconocido." };
  }
}

/** Nota de 0 a 100 como en el colegio (redondeada). */
export const nota = (pts, total) => (total > 0 ? Math.round((100 * pts) / total) : 0);

/** Nota mínima para aprobar en el colegio. */
export const MINIMA = 70;
