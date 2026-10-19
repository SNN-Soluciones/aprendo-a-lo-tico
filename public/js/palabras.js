// 🦥 Lógica de «¿Qué es?» (clases de palabras), sin pantalla, para poder probarla sola con node.
//
// Cada ronda es de uno de estos tipos:
//   canasta: una palabra suelta y 2 o 3 canastas (sustantivo, verbo, adjetivo…)
//   tocar:   una oración; se toca la palabra que se pide (o todas las de una clase, con `todos`)
//   corte:   una oración; se toca el espacio donde termina el sujeto y empieza el predicado
//   elegir:  una pregunta con opciones (género, número, concordancia, pronombres…)
//
// Las palabras sueltas son solo las que NO cambian de clase (nada de «canto», «bajo», «rojo», «cocina»).
// Las oraciones se arman con piezas ya marcadas, así siempre se sabe qué es cada palabra.

// ---------- Clases de palabras ----------
export const CLASES = {
  s: { n: "sustantivo", e: "📦", que: "nombra a una persona, un animal, una cosa o un lugar" },
  v: { n: "verbo", e: "🏃", que: "dice una acción: lo que se hace" },
  a: { n: "adjetivo", e: "🎨", que: "dice cómo es algo o alguien" },
  r: { n: "artículo", e: "👉", que: "va antes del sustantivo: el, la, los, las, un, una, unos, unas" },
  p: { n: "preposición", e: "🔗", que: "une palabras: en, con, por, a, sobre, hacia…" },
  d: { n: "adverbio", e: "⏰", que: "dice cuándo o dónde pasa algo" },
  c: { n: "conjunción", e: "➕", que: "une palabras, como «y»" },
};

// ---------- Palabras sueltas (sin dudas) ----------
// sustantivos: [palabra, género, de qué es]
const NOMBRA = { persona: "a una persona", animal: "a un animal", cosa: "una cosa", lugar: "un lugar", comida: "una comida", planta: "una planta" };
const SUSTANTIVOS = [
  ["abuela", "f", "persona"], ["doctora", "f", "persona"], ["bombero", "m", "persona"], ["agricultor", "m", "persona"],
  ["panadero", "m", "persona"], ["enfermera", "f", "persona"], ["pescador", "m", "persona"], ["carpintero", "m", "persona"],
  ["tortuga", "f", "animal"], ["gallina", "f", "animal"], ["ballena", "f", "animal"], ["jirafa", "f", "animal"], ["elefante", "m", "animal"],
  ["perro", "m", "animal"], ["caballo", "m", "animal"], ["vaca", "f", "animal"], ["lapa", "f", "animal"], ["yigüirro", "m", "animal"],
  ["rana", "f", "animal"], ["ardilla", "f", "animal"], ["mariposa", "f", "animal"], ["danta", "f", "animal"], ["pizote", "m", "animal"],
  ["tiburón", "m", "animal"], ["cangrejo", "m", "animal"],
  ["guitarra", "f", "cosa"], ["mesa", "f", "cosa"], ["silla", "f", "cosa"], ["lápiz", "m", "cosa"], ["cuaderno", "m", "cosa"],
  ["mochila", "f", "cosa"], ["bandera", "f", "cosa"], ["carreta", "f", "cosa"], ["zapato", "m", "cosa"], ["ventana", "f", "cosa"],
  ["sombrero", "m", "cosa"], ["reloj", "m", "cosa"], ["cuchara", "f", "cosa"], ["bicicleta", "f", "cosa"], ["avión", "m", "cosa"],
  ["camión", "m", "cosa"], ["tambor", "m", "cosa"], ["marimba", "f", "cosa"], ["hamaca", "f", "cosa"],
  ["escuela", "f", "lugar"], ["playa", "f", "lugar"], ["montaña", "f", "lugar"], ["volcán", "m", "lugar"], ["parque", "m", "lugar"],
  ["pulpería", "f", "lugar"], ["ciudad", "f", "lugar"], ["iglesia", "f", "lugar"], ["hospital", "m", "lugar"], ["plaza", "f", "lugar"],
  ["bosque", "m", "lugar"], ["isla", "f", "lugar"],
  ["mango", "m", "comida"], ["sandía", "f", "comida"], ["piña", "f", "comida"], ["tamal", "m", "comida"], ["pan", "m", "comida"],
  ["arroz", "m", "comida"], ["tortilla", "f", "comida"], ["queso", "m", "comida"], ["banano", "m", "comida"], ["papaya", "f", "comida"],
  ["árbol", "m", "planta"], ["flor", "f", "planta"], ["helecho", "m", "planta"],
];
const INFINITIVOS = ["correr", "saltar", "comer", "cantar", "nadar", "dormir", "escribir", "leer", "jugar", "bailar", "cocinar",
  "barrer", "estudiar", "sembrar", "volar", "caminar", "reír", "llorar", "subir", "dibujar", "trabajar", "aplaudir", "respirar", "lavar"];
const CONJUGADOS = ["corre", "salta", "come", "canta", "duerme", "escribe", "lee", "juega", "baila", "barre", "estudia", "vuela",
  "camina", "ríe", "llora", "sube", "dibuja", "trabaja", "aplaude", "respira", "construye", "lava", "ladra", "maúlla", "brinca", "grita"];
// adjetivos: [masculino, femenino]
const ADJ_SUELTOS = [["bonito", "bonita"], ["hermoso", "hermosa"], ["alegre", "alegre"], ["triste", "triste"], ["feliz", "feliz"],
  ["valiente", "valiente"], ["amable", "amable"], ["inteligente", "inteligente"], ["sucio", "sucia"], ["nuevo", "nueva"],
  ["redondo", "redonda"], ["peludo", "peluda"], ["juguetón", "juguetona"], ["tranquilo", "tranquila"], ["ruidoso", "ruidosa"],
  ["delicioso", "deliciosa"], ["sabroso", "sabrosa"], ["enorme", "enorme"], ["diminuto", "diminuta"], ["brillante", "brillante"],
  ["suave", "suave"], ["caliente", "caliente"], ["salado", "salada"], ["pequeño", "pequeña"], ["grande", "grande"],
  ["colorido", "colorida"], ["cariñoso", "cariñosa"], ["curioso", "curiosa"], ["silencioso", "silenciosa"], ["veloz", "veloz"]];
const ADV_TIEMPO = ["hoy", "ayer", "siempre", "nunca", "temprano", "ahora", "pronto", "luego", "antes", "después", "todavía"];
const ADV_LUGAR = ["aquí", "ahí", "allá", "cerca", "lejos", "arriba", "abajo", "afuera", "adentro", "delante", "detrás", "encima"];
const ARTICULOS = { definido: ["el", "la", "los", "las"], indefinido: ["un", "una", "unos", "unas"] };

// ---------- Utilidades ----------
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const mayus = t => t.charAt(0).toUpperCase() + t.slice(1);
const art = (g, pl, def = true) => def ? (pl ? (g === "f" ? "las" : "los") : (g === "f" ? "la" : "el")) : (pl ? (g === "f" ? "unas" : "unos") : (g === "f" ? "una" : "un"));
// Plural de un adjetivo: alegre → alegres, feliz → felices, juguetón → juguetones, veloz → veloces
export function pluralAdj(a) {
  if (/[aeiouáéíóú]$/.test(a)) return a + "s";
  if (/z$/.test(a)) return a.slice(0, -1) + "ces";
  return a.replace(/ó(n)$/, "o$1") + "es";
}
/** Piezas marcadas: "en/p el/r árbol/s" → [{ t, c }]. Clases: s, S (propio), v, a, r, p, dt (adverbio de tiempo), dl (de lugar), c. «_» = espacio dentro de una pieza. */
export function piezas(txt) {
  return txt.split(" ").map(x => {
    const [t, c] = x.split("/");
    const o = { t: t.replace(/_/g, " "), c: c[0] === "S" ? "s" : c[0] };
    if (c === "S") o.propio = true;
    if (c[0] === "d") o.at = c[1] === "t" ? "tiempo" : "lugar";
    return o;
  });
}

// ---------- Oraciones ----------
// k: qué es (para saber qué puede hacer)
const SUJ = [
  { s: "yigüirro", pl: "yigüirros", g: "m", k: "ave" }, { s: "lapa", pl: "lapas", g: "f", k: "ave" }, { s: "perico", pl: "pericos", g: "m", k: "ave" },
  { s: "gallina", pl: "gallinas", g: "f", k: "granja" }, { s: "perro", pl: "perros", g: "m", k: "mamifero" }, { s: "gata", pl: "gatas", g: "f", k: "mamifero" },
  { s: "ardilla", pl: "ardillas", g: "f", k: "mamifero" }, { s: "chancho", pl: "chanchos", g: "m", k: "mamifero" },
  { s: "tortuga", pl: "tortugas", g: "f", k: "tortuga" }, { s: "rana", pl: "ranas", g: "f", k: "rana" },
  { s: "niño", pl: "niños", g: "m", k: "persona" }, { s: "niña", pl: "niñas", g: "f", k: "persona" },
  { s: "abuela", pl: "abuelas", g: "f", k: "persona" }, { s: "abuelo", pl: "abuelos", g: "m", k: "persona" },
  { s: "maestra", pl: "maestras", g: "f", k: "persona" }, { s: "agricultor", pl: "agricultores", g: "m", k: "persona" },
  { s: "doctora", pl: "doctoras", g: "f", k: "persona" },
];
const NOMBRES = [["Tatiana", "f"], ["Mateo", "m"], ["Sofía", "f"], ["Daniel", "m"], ["Valeria", "f"], ["Andrés", "m"], ["Camila", "f"], ["Diego", "m"]];
// Verbo en 3.ª persona (singular y plural). quien: qué sujetos lo pueden hacer. c: complementos, con quién va cada uno («*» = todos los que pueden).
const VERBOS = [
  { s: "canta", pl: "cantan", quien: ["yigüirro", "persona"], c: [["en/p el/r árbol/s", "yigüirro"], ["en/p el/r coro/s", "persona"], ["en/p la/r iglesia/s", "persona"], ["en/p el/r patio/s", "*"]] },
  { s: "duerme", pl: "duermen", quien: ["*"], c: [["en/p la/r hamaca/s", "persona"], ["en/p el/r corredor/s", "persona mamifero"], ["en/p la/r sombra/s", "*"], ["en/p el/r árbol/s", "ave"]] },
  { s: "come", pl: "comen", quien: ["*"], c: [["semillas/s", "lapa ardilla perico"], ["mangos/s", "perico persona"], ["maíz/s", "gallina chancho"], ["insectos/s", "rana yigüirro"],
    ["hojas/s", "tortuga"], ["arroz/s", "perro gata"], ["gallo_pinto/s", "persona"], ["arroz/s con/p leche/s", "persona"], ["tamales/s", "persona"]] },
  { s: "juega", pl: "juegan", quien: ["persona", "perro", "gata"], c: [["en/p el/r parque/s", "*"], ["con/p la/r bola/s", "*"], ["en/p la/r plaza/s", "persona"]] },
  { s: "corre", pl: "corren", quien: ["persona", "perro", "ardilla", "chancho", "gallina"], c: [["por/p la/r playa/s", "persona perro"], ["en/p el/r potrero/s", "*"], ["por/p el/r patio/s", "*"]] },
  { s: "nada", pl: "nadan", quien: ["tortuga", "rana", "perro", "persona"], c: [["en/p el/r río/s", "*"], ["en/p el/r mar/s", "tortuga persona"], ["en/p la/r poza/s", "rana perro persona"]] },
  { s: "salta", pl: "saltan", quien: ["rana", "ardilla", "persona", "gata"], c: [["en/p el/r charco/s", "rana persona"], ["sobre/p el/r tronco/s", "*"]] },
  { s: "vuela", pl: "vuelan", quien: ["ave"], c: [["sobre/p el/r volcán/s", "*"], ["sobre/p el/r río/s", "*"], ["sobre/p la/r montaña/s", "*"]] },
  { s: "lee", pl: "leen", quien: ["persona"], c: [["un/r libro/s", "*"], ["un/r cuento/s", "*"], ["el/r periódico/s", "*"]] },
  { s: "cocina", pl: "cocinan", quien: ["persona"], c: [["gallo_pinto/s", "*"], ["tamales/s", "*"], ["arroz/s con/p pollo/s", "*"]] },
  { s: "barre", pl: "barren", quien: ["persona"], c: [["el/r corredor/s", "*"], ["la/r cocina/s", "*"]] },
  { s: "siembra", pl: "siembran", quien: ["persona"], c: [["frijoles/s", "*"], ["maíz/s", "*"], ["café/s", "*"], ["yuca/s", "*"]] },
  { s: "pinta", pl: "pintan", quien: ["persona"], c: [["la/r carreta/s", "*"], ["un/r mural/s", "*"]] },
  { s: "escribe", pl: "escriben", quien: ["persona"], c: [["una/r carta/s", "*"], ["un/r cuento/s", "*"], ["un/r poema/s", "*"]] },
  { s: "baila", pl: "bailan", quien: ["persona"], c: [["en/p el/r turno/s", "*"], ["en/p la/r escuela/s", "*"]] },
  { s: "camina", pl: "caminan", quien: ["persona", "perro", "gallina", "tortuga"], c: [["por/p el/r parque/s", "persona perro"], ["hacia/p la/r pulpería/s", "persona"], ["por/p la/r playa/s", "*"]] },
  { s: "ladra", pl: "ladran", quien: ["perro"], c: [["en/p el/r patio/s", "*"], ["a/p la/r luna/s", "*"]] },
  { s: "maúlla", pl: "maúllan", quien: ["gata"], c: [["en/p el/r techo/s", "*"]] },
];
// Adjetivos para el sujeto: [m, f] y con quién tienen sentido
const ADJ = [
  [["pequeño", "pequeña"], "ave granja mamifero tortuga rana niño niña"], [["grande", "grande"], "ave granja mamifero tortuga rana"],
  [["alegre", "alegre"], "*"], [["tranquilo", "tranquila"], "*"],
  [["juguetón", "juguetona"], "mamifero persona"], [["peludo", "peluda"], "mamifero"], [["colorido", "colorida"], "lapa perico"],
  [["valiente", "valiente"], "persona mamifero"], [["curioso", "curiosa"], "*"], [["ruidoso", "ruidosa"], "ave mamifero granja"],
  [["cariñoso", "cariñosa"], "persona mamifero"], [["trabajador", "trabajadora"], "persona"], [["verde", "verde"], "rana"],
  [["inteligente", "inteligente"], "persona mamifero ave"], [["amable", "amable"], "persona"],
];
// ¿Esta lista («persona mamifero», «*», «lapa») incluye al sujeto?
const sirve = (lista, suj) => lista === "*" || lista.split(" ").some(x => x === suj.k || x === suj.s || x === "*");
const puede = (v, suj) => v.quien.some(q => q === "*" || q === suj.k || q === suj.s);

/**
 * Una oración nueva: sujeto (artículo + sustantivo [+ adjetivo], o un nombre propio, o dos nombres) + verbo + complemento.
 * @param {{adj?: boolean|null, sujeto?: "comun"|"nombre"|"dos"}} op adj: true = con adjetivo, false = sin, null = a veces
 * @returns {{ tokens, sujetoLargo, sujetoTxt, plural }}
 */
export function oracion(rnd = Math.random, { adj = null, sujeto = "comun" } = {}) {
  for (let intento = 0; intento < 100; intento++) {
    let suj, toks, plural;
    if (sujeto === "comun") {
      suj = azar(SUJ, rnd); plural = rnd() < 0.4;
      const def = rnd() < 0.75;
      toks = [{ t: art(suj.g, plural, def), c: "r" }, { t: plural ? suj.pl : suj.s, c: "s", nucleo: true }];
      const conAdj = adj === null ? rnd() < 0.5 : adj;
      if (conAdj) {
        const posibles = ADJ.filter(([, l]) => sirve(l, suj));
        const [[m, f]] = azar(posibles, rnd);
        const a = suj.g === "f" ? f : m;
        toks.push({ t: plural ? pluralAdj(a) : a, c: "a" });
      }
    } else if (sujeto === "nombre") {
      const [n, g] = azar(NOMBRES, rnd);
      suj = { s: n, g, k: "persona", propio: true }; plural = false;
      toks = [{ t: n, c: "s", propio: true, nucleo: true }];
    } else {
      const [a, b] = barajar(NOMBRES, rnd);
      suj = { s: `${a[0]} y ${b[0]}`, g: a[1] === "f" && b[1] === "f" ? "f" : "m", k: "persona", propio: true }; plural = true;
      toks = [{ t: a[0], c: "s", propio: true }, { t: "y", c: "c" }, { t: b[0], c: "s", propio: true }];
    }
    const verbos = VERBOS.filter(v => puede(v, suj));
    if (!verbos.length) continue;
    const v = azar(verbos, rnd);
    const comps = v.c.filter(([, l]) => sirve(l, suj));
    if (!comps.length) continue;
    const [c] = azar(comps, rnd);
    const sujetoLargo = toks.length;
    const sujetoTxt = toks.map(x => x.t).join(" ");
    const tokens = [...toks, { t: plural ? v.pl : v.s, c: "v", nucleo: true }, ...piezas(c)];
    return { tokens, sujetoLargo, sujetoTxt, plural };
  }
  throw new Error("no se pudo armar una oración");
}

// Oraciones con un adverbio de tiempo o de lugar (escritas a mano y revisadas)
const CON_ADVERBIO = [
  "Hoy/dt llueve/v en/p Cartago/S", "Ayer/dt fuimos/v a/p la/r playa/s", "El/r gato/s duerme/v afuera/dl", "Los/r niños/s juegan/v aquí/dl",
  "Siempre/dt desayunamos/v gallo_pinto/s", "El/r bus/s llega/v temprano/dt", "La/r pulpería/s queda/v cerca/dl",
  "Nunca/dt botamos/v basura/s en/p el/r río/s", "Ahora/dt leemos/v un/r cuento/s", "La/r gata/s duerme/v arriba/dl",
  "Pronto/dt llegan/v las/r vacaciones/s", "Mañana/dt visitamos/v a/p la/r abuela/s", "El/r volcán/s Poás/S queda/v lejos/dl",
  "Los/r zapatos/s quedaron/v afuera/dl", "Ayer/dt sembramos/v frijoles/s", "Allá/dl vive/v la/r abuela/s",
  "Hoy/dt hay/v turno/s en/p la/r plaza/s", "Las/r gallinas/s duermen/v adentro/dl", "Mañana/dt jugamos/v en/p Heredia/S",
  "El/r perro/s espera/v afuera/dl",
].map(t => piezas(t).map((x, i) => i === 0 && !x.propio ? { ...x, t: x.t.toLowerCase() } : x));

// Oraciones con nombres propios de personas y lugares de Costa Rica
const LUGARES = ["Limón", "Cartago", "Heredia", "Alajuela", "Puntarenas", "Guanacaste", "Liberia", "Turrialba", "Monteverde", "Golfito", "Nicoya", "Quepos"];
// (los cuatro primeros tienen un lugar {L}; nada de «al» ni «del», que juntan preposición y artículo)
const CON_PROPIOS = [
  n => `${n}/S vive/v en/p {L}/S`, n => `${n}/S viaja/v a/p {L}/S`, n => `${n}/S estudia/v en/p {L}/S`, n => `${n}/S pasea/v por/p {L}/S`,
  n => `${n}/S visita/v el/r volcán/s Arenal/S`, n => `${n}/S rema/v en/p el/r río/s Pacuare/S`, n => `${n}/S pesca/v en/p el/r río/s Tárcoles/S`,
];
const SOLO_UN_PROPIO = [() => "la/r abuela/s vive/v en/p {L}/S", () => "los/r niños/s viajan/v a/p {L}/S", () => "el/r bus/s sale/v para/p {L}/S"];
const LUGARES_PROPIOS = [...LUGARES, "Arenal", "Pacuare", "Tárcoles", "Poás", "Irazú"];

// ---------- Explicaciones ----------
const elDe = (toks, i) => { // «la lapa», «los perros»: el sustantivo que acompaña un adjetivo o artículo
  for (let j = i; j >= 0; j--) if (toks[j].c === "s") return (toks[j - 1]?.c === "r" ? toks[j - 1].t.toLowerCase() + " " : "") + toks[j].t;
  for (let j = i; j < toks.length; j++) if (toks[j].c === "s") return toks[j].t;
  return "";
};
/**
 * Por qué una palabra de la oración es de su clase (para explicar cuando se toca).
 * sujetoTxt: «la lapa colorida» (para decir «lo que hace la lapa colorida») · plural: si el sujeto es plural
 */
export function porQue(toks, i, sujetoTxt = "", plural = false) {
  const x = toks[i], t = x.t;
  switch (x.c) {
    case "s": return x.propio ? `«${t}» es un sustantivo propio: es el nombre de ${LUGARES_PROPIOS.includes(t) ? "un lugar" : "una persona"}, por eso va con mayúscula.`
      : `«${t}» es un sustantivo: nombra a una persona, un animal, una cosa o un lugar.`;
    case "v": return `«${t}» es un verbo: dice la acción${sujetoTxt ? `, lo que ${plural ? "hacen" : "hace"} ${sujetoTxt}` : ""}.`;
    case "a": return `«${t}» es un adjetivo: dice cómo ${/s$/.test(t) ? "son" : "es"} ${elDe(toks, i)}.`;
    case "r": return `«${t}» es un artículo: va antes del sustantivo «${toks.slice(i + 1).find(y => y.c === "s")?.t || ""}».`;
    case "p": return `«${t}» es una preposición: une palabras, como «en», «con» o «por».`;
    case "d": return `«${t}» es un adverbio: dice ${x.at === "tiempo" ? "cuándo" : "dónde"} pasa.`;
    case "c": return `«${t}» une dos palabras: es una conjunción.`;
    default: return `«${t}»`;
  }
}
const BUSCA = {
  v: "Buscá la palabra que dice la acción.",
  a: "Buscá la palabra que dice cómo es.",
  s: "Buscá las palabras que nombran personas, animales, cosas o lugares.",
  r: "Buscá el, la, los, las, un, una…",
  d: "Buscá la palabra que dice cuándo o dónde.",
  propio: "Buscá el nombre de una persona o de un lugar: va con mayúscula.",
};

// ---------- Rondas ----------
/** Ronda «canasta»: una palabra y sus canastas. */
function canasta(rnd, cuales, { conjugados = false } = {}) {
  const clase = azar(cuales, rnd);
  let palabra, que;
  if (clase === "s") { const [p, , k] = azar(SUSTANTIVOS, rnd); palabra = p; que = `nombra ${NOMBRA[k]}`; }
  else if (clase === "v") { palabra = azar(conjugados && rnd() < 0.7 ? CONJUGADOS : INFINITIVOS, rnd); que = "dice una acción, algo que se hace"; }
  else if (clase === "a") { const [m, f] = azar(ADJ_SUELTOS, rnd); palabra = rnd() < 0.7 ? m : f; que = "dice cómo es algo o alguien"; }
  else if (clase === "tiempo") { palabra = azar(ADV_TIEMPO, rnd); que = "dice cuándo pasa algo"; }
  else if (clase === "lugar") { palabra = azar(ADV_LUGAR, rnd); que = "dice dónde pasa algo"; }
  else if (clase === "definido") { palabra = azar(ARTICULOS.definido, rnd); que = "señala algo conocido, que ya sabemos cuál es (el perro)"; }
  else { palabra = azar(ARTICULOS.indefinido, rnd); que = "señala algo cualquiera, no uno en especial (un perro)"; }
  const NOMBRES_C = { s: "sustantivo", v: "verbo", a: "adjetivo", tiempo: "adverbio de tiempo", lugar: "adverbio de lugar", definido: "artículo definido", indefinido: "artículo indefinido" };
  const bien = `«${palabra}» es un ${NOMBRES_C[clase]}: ${que}.`;
  const por = Object.fromEntries(cuales.map(c => [c, c === clase ? bien : `${bien} No es un ${NOMBRES_C[c]}.`]));
  const pregunta = cuales.map(c => NOMBRES_C[c]).join(" o ");
  return { tipo: "canasta", palabra, correcta: clase, canastas: cuales, por, bien,
    instr: `¿Qué es <b>«${palabra}»</b>?`, voz: `¿Qué es ${palabra}? ¿${pregunta}?` };
}

const NOMBRE_OBJ = { v: ["el verbo", "verbos"], a: ["el adjetivo", "adjetivos"], s: ["el sustantivo", "sustantivos"], r: ["el artículo", "artículos"],
  d: ["el adverbio", "adverbios"], propio: ["el sustantivo propio", "sustantivos propios"] };
/** Ronda «tocar»: tocar la palabra de una clase (o todas las de esa clase, con `todos`). */
function tocarClase(tokens, objetivo, { todos = false, sujetoTxt = "", plural = false } = {}) {
  const es = x => objetivo === "propio" ? x.propio : x.c === objetivo;
  const correctas = tokens.map((x, i) => es(x) ? i : -1).filter(i => i >= 0);
  const [uno, varios] = NOMBRE_OBJ[objetivo], n = correctas.length;
  const instr = todos && n > 1 ? `Tocá los ${n} ${varios}` : `Tocá ${uno}`;
  const frase = tokens.map(x => x.t).join(" ");
  const por = tokens.map((_, i) => porQue(tokens, i, sujetoTxt, plural));
  return { tipo: "tocar", tokens, correctas, todos, objetivo, por, busca: BUSCA[objetivo],
    instr: `${instr}.`, voz: `${instr}. ${mayus(frase)}.`, bien: correctas.map(i => por[i]).join(" ") };
}

/** Ronda «corte»: ¿dónde termina el sujeto? */
function corte(o) {
  const { tokens, sujetoLargo } = o;
  const sujeto = tokens.slice(0, sujetoLargo).map(x => x.t).join(" "), predicado = tokens.slice(sujetoLargo).map(x => x.t).join(" ");
  const verbo = tokens[sujetoLargo].t;
  const mal = i => i < sujetoLargo
    ? `Así el predicado empezaría con «${tokens[i].t}», que no es el verbo. El predicado empieza con el verbo «${verbo}», y el sujeto es «${mayus(sujeto)}».`
    : `«${verbo}» es el verbo, y el verbo va en el predicado. El sujeto es de quién se habla: «${mayus(sujeto)}».`;
  return { tipo: "corte", tokens, corte: sujetoLargo, mal,
    bien: `Sujeto: «${mayus(sujeto)}» (de quién se habla). Predicado: «${predicado}» (lo que se dice del sujeto; empieza con el verbo).`,
    instr: "Tocá ✂️ donde termina el sujeto y empieza el predicado.", voz: `¿Dónde termina el sujeto? ${mayus(tokens.map(x => x.t).join(" "))}.` };
}

/** Ronda «elegir». opciones: [{ id, html, por }] */
const elegir = (instr, voz, opciones, correcta, bien, rnd, html = "") =>
  ({ tipo: "elegir", instr, voz, html, opciones: barajar(opciones, rnd), correcta, bien });

// Género: el o la (con los que engañan: la mano, el mapa…)
const GENERO_RARO = [["mano", "f", "Aunque termina en -o, «mano» es femenino: la mano."], ["foto", "f", "«Foto» viene de «fotografía»: la foto."],
  ["moto", "f", "«Moto» viene de «motocicleta»: la moto."], ["día", "m", "Aunque termina en -a, «día» es masculino: el día."],
  ["mapa", "m", "Aunque termina en -a, «mapa» es masculino: el mapa."], ["planeta", "m", "Aunque termina en -a, «planeta» es masculino: el planeta."],
  ["problema", "m", "Aunque termina en -a, «problema» es masculino: el problema."], ["idioma", "m", "Aunque termina en -a, «idioma» es masculino: el idioma."],
  ["sofá", "m", "«Sofá» es masculino: el sofá."]];
// Plurales: [singular, género, plural, [errores comunes], por qué]
const PLURALES = [
  ["lápiz", "m", "lápices", ["lápizes", "lápizs"], "Las palabras que terminan en z cambian la z por c: lápiz → lápices."],
  ["pez", "m", "peces", ["pezes", "pezs"], "La z cambia por c: pez → peces."],
  ["luz", "f", "luces", ["luzes", "luzs"], "La z cambia por c: luz → luces."],
  ["nariz", "f", "narices", ["narizes", "narizs"], "La z cambia por c: nariz → narices."],
  ["ratón", "m", "ratones", ["ratónes", "ratóns"], "Termina en consonante: se agrega -es. Y la tilde se va: ratones ya no la necesita."],
  ["camión", "m", "camiones", ["camiónes", "camións"], "Se agrega -es y la tilde se va: camiones."],
  ["tiburón", "m", "tiburones", ["tiburónes", "tiburóns"], "Se agrega -es y la tilde se va: tiburones."],
  ["volcán", "m", "volcanes", ["volcánes", "volcáns"], "Se agrega -es y la tilde se va: volcanes."],
  ["árbol", "m", "árboles", ["arboles", "árbols"], "Se agrega -es y queda la tilde: árboles es esdrújula."],
  ["papel", "m", "papeles", ["papels", "papéles"], "Termina en consonante: se agrega -es."],
  ["reloj", "m", "relojes", ["relojs", "relójes"], "Termina en consonante: se agrega -es."],
  ["flor", "f", "flores", ["flors", "flóres"], "Termina en consonante: se agrega -es."],
  ["tamal", "m", "tamales", ["tamals", "tamáles"], "Termina en consonante: se agrega -es."],
  ["joven", "m", "jóvenes", ["jovenes", "jóvens"], "Se agrega -es y aparece una tilde: jóvenes es esdrújula."],
  ["examen", "m", "exámenes", ["examenes", "exámens"], "Se agrega -es y aparece una tilde: exámenes es esdrújula."],
  ["sofá", "m", "sofás", ["sofaes", "sofases"], "Termina en vocal con tilde: se agrega -s."],
  ["rey", "m", "reyes", ["reys", "reies"], "Termina en y: se agrega -es."],
];
/** Plural de un sustantivo de las listas (mesa → mesas, avión → aviones, árbol → árboles, lápiz → lápices). */
export function pluralSus(s) {
  const x = PLURALES.find(p => p[0] === s);
  if (x) return x[2];
  if (/[aeiouáéíóú]$/.test(s)) return s + "s";
  if (/z$/.test(s)) return s.slice(0, -1) + "ces";
  if (/[áéíóú][ns]$/.test(s)) return s.slice(0, -2) + "aeiou"["áéíóú".indexOf(s.at(-2))] + s.at(-1) + "es";
  return s + "es";
}
const SIN_PLURAL = ["arroz"]; // «los arroces» suena raro

function generoNumero(rnd) {
  if (rnd() < 0.5) {
    const [s, g, pl, malos, por] = azar(PLURALES, rnd);
    const Un = g === "f" ? "Una" : "Un";
    const ops = [{ id: pl, html: pl, por }, ...malos.map(m => ({ id: m, html: m, por: `«${m}» no se escribe así. ${por}` }))];
    return elegir(`¿Cómo se escribe el plural de <b>«${s}»</b>?`, `${Un} ${s}, dos… ¿Cómo se escribe el plural de ${s}?`, ops, pl, por, rnd,
      `<span class="frase">${Un} ${s} → dos <span class="hueco">?</span></span>`);
  }
  // el / la (a veces en plural: los / las), con los que engañan: la mano, el mapa…
  let s, g, por;
  if (rnd() < 0.5) [s, g, por] = azar(GENERO_RARO, rnd);
  else { [s, g] = azar(SUSTANTIVOS, rnd); por = `«${s}» es ${g === "f" ? "femenino" : "masculino"}: ${g === "f" ? "la" : "el"} ${s}.`; }
  const pl = rnd() < 0.3 && !SIN_PLURAL.includes(s);
  const palabra = pl ? pluralSus(s) : s;
  const ops = (pl ? ["los", "las"] : ["el", "la"]).map(a => ({ id: a, html: a, por }));
  const pregunta = pl ? "¿Los o las?" : "¿El o la?";
  return elegir(pregunta, `${pregunta} … ${palabra}`, ops, art(g, pl), por, rnd, `<span class="frase"><span class="hueco">?</span> ${palabra}</span>`);
}

// Concordancia: artículo + sustantivo + adjetivo, o sujeto + verbo
function concordancia(rnd) {
  if (rnd() < 0.35) {
    const o = oracion(rnd, { adj: false });
    const v = o.tokens[o.sujetoLargo], vb = VERBOS.find(x => x.s === v.t || x.pl === v.t);
    const resto = o.tokens.slice(o.sujetoLargo + 1).map(x => x.t).join(" ");
    const suj = mayus(o.sujetoTxt);
    const bien = `«${suj}» ${o.plural ? "son varios: plural" : "es uno solo: singular"}, entonces el verbo va en ${o.plural ? "plural" : "singular"}: ${o.plural ? vb.pl : vb.s}.`;
    return elegir("¿Cuál completa bien la oración?", `¿Cuál completa bien? ${suj} … ${resto}.`,
      [{ id: vb.s, html: vb.s, por: bien }, { id: vb.pl, html: vb.pl, por: bien }], o.plural ? vb.pl : vb.s, bien, rnd,
      `<span class="frase">${suj} <span class="hueco">?</span> ${resto}.</span>`);
  }
  const suj = azar(SUJ, rnd), pl = rnd() < 0.5;
  const [[m, f]] = azar(ADJ.filter(([, l]) => sirve(l, suj)), rnd);
  const forma = (g, p) => { const a = g === "f" ? f : m; return p ? pluralAdj(a) : a; };
  const frase = (a1, s1, a2) => `${a1} ${s1} ${a2}`;
  const nombre = pl ? suj.pl : suj.s;
  const correcta = frase(art(suj.g, pl), nombre, forma(suj.g, pl));
  const malas = new Set([
    frase(art(suj.g, pl), nombre, forma(suj.g, !pl)),                 // adjetivo en otro número
    frase(art(suj.g, pl), nombre, forma(suj.g === "f" ? "m" : "f", pl)), // adjetivo en otro género
    frase(art(suj.g === "f" ? "m" : "f", pl), nombre, forma(suj.g, pl)), // artículo en otro género
    frase(art(suj.g, !pl), nombre, forma(suj.g, pl)),                 // artículo en otro número
  ]);
  malas.delete(correcta);
  const elegidas = barajar([...malas], rnd).slice(0, 2);
  const bien = `En «${correcta}» todas las palabras van en ${suj.g === "f" ? "femenino" : "masculino"} y en ${pl ? "plural" : "singular"}: así concuerdan.`;
  return elegir("¿Cuál está bien dicha?", "¿Cuál está bien dicha? Fijate en el género y el número.",
    [{ id: correcta, html: correcta, por: bien }, ...elegidas.map(x => ({ id: x, html: x, por: `En «${x}» las palabras no concuerdan. ${bien}` }))],
    correcta, bien, rnd);
}

// Pronombres personales: ¿qué pronombre reemplaza a…?
function pronombre(rnd) {
  const casos = [];
  NOMBRES.forEach(([n, g]) => casos.push([n, g === "f" ? "ella" : "él", g === "f" ? `${n} es una mujer: ella.` : `${n} es un hombre: él.`]));
  casos.push(["Tatiana y Sofía", "ellas", "Son dos mujeres: ellas."], ["Valeria y Camila", "ellas", "Son dos mujeres: ellas."],
    ["Mateo y Daniel", "ellos", "Son dos hombres: ellos."], ["Tatiana y Mateo", "ellos", "Si en el grupo hay al menos un hombre, se dice «ellos»."],
    ["La abuela", "ella", "La abuela es una sola mujer: ella."], ["El agricultor", "él", "El agricultor es un hombre: él."],
    ["Los perros", "ellos", "Son varios perros: ellos."], ["Las tortugas", "ellas", "Son varias tortugas: ellas."],
    ["Mi papá y yo", "nosotros", "Si yo estoy en el grupo, se dice «nosotros»."], ["Vos y tu primo", "ustedes", "Si vos estás en el grupo (y yo no), se dice «ustedes»."],
    ["Vos y tu prima", "ustedes", "Si vos estás en el grupo (y yo no), se dice «ustedes»."]);
  const [frase, ok, por] = azar(casos, rnd);
  const otros = barajar(["él", "ella", "ellos", "ellas", "nosotros", "ustedes"].filter(x => x !== ok), rnd).slice(0, 3);
  return elegir(`¿Qué pronombre reemplaza a <b>«${frase}»</b>?`, `¿Qué pronombre puede reemplazar a ${frase}?`,
    [ok, ...otros].map(x => ({ id: x, html: x, por: x === ok ? por : `«${x}» no. ${por}` })), ok, `Los pronombres reemplazan al nombre. ${por}`, rnd);
}

// Propios: ¿cuál está bien escrita? o tocar el sustantivo propio
function propios(rnd) {
  const [n] = azar(NOMBRES, rnd), L = azar(LUGARES, rnd);
  if (rnd() < 0.5) {
    const toks = piezas(azar(rnd() < 0.5 ? CON_PROPIOS : SOLO_UN_PROPIO, rnd)(n).replace("{L}", L));
    const varios = toks.filter(x => x.propio).length > 1;
    return tocarClase(toks, "propio", { todos: varios });
  }
  const toks = piezas(azar(CON_PROPIOS.slice(0, 4), rnd)(n).replace("{L}", L));
  const txt = ts => mayus(ts.join(" ")) + ".";
  const correcta = txt(toks.map(x => x.t));
  const sinNombre = toks.map((x, i) => i === 0 ? x.t.toLowerCase() : x.t); // la primera palabra igual va con mayúscula
  const sinLugar = toks.map(x => x.propio && LUGARES.includes(x.t) ? x.t.toLowerCase() : x.t);
  const verboMayus = toks.map(x => x.c === "v" ? mayus(x.t) : x.t);
  const limon = L === "Limón" ? " Con minúscula, «limón» es la fruta; la provincia es «Limón»." : "";
  const ops = [
    { id: "bien", html: correcta, por: `Bien: los nombres de personas y lugares son sustantivos propios y van con mayúscula.${limon}` },
    { id: "lugar", html: sinLugar.join(" ") + ".", por: `«${L}» es el nombre de un lugar: sustantivo propio, va con mayúscula.${limon}` },
    { id: "verbo", html: verboMayus.join(" ") + ".", por: `«${toks.find(x => x.c === "v").t}» es un verbo, no un nombre: va con minúscula.` },
  ];
  if (rnd() < 0.5) ops[2] = { id: "nombre", html: sinNombre.join(" ") + ".", por: `«${n}» es el nombre de una persona, y además es la primera palabra: va con mayúscula.` };
  return elegir("¿Cuál está bien escrita?", "¿Cuál oración está bien escrita? Fijate en las mayúsculas.", ops, "bien", ops[0].por, rnd);
}

// ---------- 🪜 Escalones ----------
// gen(rnd) → una ronda. grupo: para los modos a mano (papá o maestra).
export const ESCALONES = [
  { nombre: "Sustantivo o verbo", gen: rnd => canasta(rnd, ["s", "v"]) },                                    // 1. 2.°: dos canastas, verbos en infinitivo
  { nombre: "Sustantivo o adjetivo", gen: rnd => canasta(rnd, ["s", "a"]) },                                 // 2.
  { nombre: "Sustantivo, verbo o adjetivo", gen: rnd => canasta(rnd, ["s", "v", "a"], { conjugados: true }) }, // 3. tres canastas, verbos conjugados
  { nombre: "El verbo en la oración", gen: rnd => { const o = oracion(rnd); return tocarClase(o.tokens, "v", { sujetoTxt: o.sujetoTxt, plural: o.plural }); } }, // 4. 3.°
  { nombre: "El adjetivo en la oración", gen: rnd => { const o = oracion(rnd, { adj: true }); return tocarClase(o.tokens, "a", { sujetoTxt: o.sujetoTxt, plural: o.plural }); } }, // 5.
  { nombre: "Todos los sustantivos", gen: rnd => { const o = oracion(rnd); return tocarClase(o.tokens, "s", { todos: true, sujetoTxt: o.sujetoTxt, plural: o.plural }); } }, // 6.
  { nombre: "Sustantivos propios", gen: propios },                                                            // 7. mayúsculas
  { nombre: "Género y número", gen: generoNumero },                                                           // 8. 4.°: el/la, plurales
  { nombre: "Concordancia", gen: concordancia },                                                              // 9.
  { nombre: "Artículos y pronombres", gen: rnd => {                                                           // 10.
    const r = rnd();
    if (r < 0.35) return pronombre(rnd);
    if (r < 0.6) return canasta(rnd, ["definido", "indefinido"]);
    const o = oracion(rnd, { sujeto: "comun" });
    return tocarClase(o.tokens, "r", { todos: true, sujetoTxt: o.sujetoTxt, plural: o.plural });
  } },
  { nombre: "Adverbios de tiempo y de lugar", gen: rnd => rnd() < 0.5 ? canasta(rnd, ["tiempo", "lugar"]) : tocarClase(azar(CON_ADVERBIO, rnd), "d") }, // 11. 5.°
  { nombre: "Sujeto y predicado", gen: rnd => corte(oracion(rnd, { sujeto: azar(["comun", "comun", "nombre", "dos"], rnd) })) },                      // 12. 5.°–6.°
  { nombre: "Núcleo del sujeto y del predicado", gen: rnd => nucleo(oracion(rnd, { adj: rnd() < 0.7, sujeto: rnd() < 0.8 ? "comun" : "nombre" }), rnd) }, // 13. 6.°
];

/** Ronda de núcleo: con el sujeto y el predicado ya marcados, tocar el núcleo de uno de los dos. */
function nucleo(o, rnd) {
  const deSujeto = rnd() < 0.5;
  const { tokens, sujetoLargo } = o;
  const idx = tokens.findIndex((x, i) => x.nucleo && (deSujeto ? i < sujetoLargo : i >= sujetoLargo));
  const n = tokens[idx].t;
  const r = tocarClase(tokens, deSujeto ? "s" : "v", { sujetoTxt: o.sujetoTxt, plural: o.plural });
  r.correctas = [idx];
  r.marcarPartes = sujetoLargo;
  r.instr = `Tocá el núcleo del ${deSujeto ? "sujeto" : "predicado"}.`;
  r.voz = `Tocá el núcleo del ${deSujeto ? "sujeto" : "predicado"}. ${mayus(tokens.map(x => x.t).join(" "))}.`;
  r.bien = deSujeto ? `El núcleo del sujeto es el sustantivo más importante: «${n}».` : `El núcleo del predicado es el verbo: «${n}».`;
  r.por = tokens.map((x, i) => i === idx ? r.bien
    : `${porQue(tokens, i, o.sujetoTxt, o.plural)} ${deSujeto ? (i < sujetoLargo ? `Acompaña al núcleo «${n}».` : "Esa palabra está en el predicado, no en el sujeto.") : (i >= sujetoLargo ? `El núcleo del predicado es el verbo.` : "Esa palabra está en el sujeto, no en el predicado.")}`);
  r.busca = deSujeto ? "Buscá el sustantivo principal del sujeto." : "Buscá el verbo.";
  return r;
}

/** Ronda del escalón i. */
export const ronda = (i, rnd = Math.random) => ({ ...ESCALONES[i].gen(rnd), escalon: i });

/** Cuántas cosas se pueden tocar (para la escalera: con 2 opciones, adivinar mal cuenta como ronda difícil). */
export const opcionesDe = r => r.tipo === "canasta" ? r.canastas.length : r.tipo === "elegir" ? r.opciones.length
  : r.tipo === "corte" ? r.tokens.length - 1 : r.todos ? 0 : r.tokens.length;

/** Revisa una ronda. Devuelve una lista de problemas (vacía = bien). Para las pruebas. */
export function revisarRonda(r) {
  const mal = [];
  if (!r.instr || !r.voz || !r.bien) mal.push("falta texto");
  if (r.tipo === "canasta") {
    if (!r.canastas.includes(r.correcta)) mal.push("la correcta no está en las canastas");
    if (new Set(r.canastas).size !== r.canastas.length) mal.push("canastas repetidas");
    // la palabra no puede estar en dos listas a la vez
    const listas = { s: SUSTANTIVOS.map(x => x[0]), v: [...INFINITIVOS, ...CONJUGADOS], a: ADJ_SUELTOS.flat(), tiempo: ADV_TIEMPO, lugar: ADV_LUGAR, definido: ARTICULOS.definido, indefinido: ARTICULOS.indefinido };
    const en = Object.keys(listas).filter(k => listas[k].includes(r.palabra));
    if (en.length !== 1 || en[0] !== r.correcta) mal.push(`«${r.palabra}» está en ${en.join(", ")}`);
  } else if (r.tipo === "tocar" || r.tipo === "corte") {
    if (r.tokens.length < 3) mal.push("oración muy corta");
    r.tokens.forEach(x => { if (!/^[a-záéíóúñü]+( [a-záéíóúñü]+)?$/i.test(x.t)) mal.push(`pieza rara: ${x.t}`); });
    const adjs = new Set(ADJ.flatMap(([[m, f]]) => [m, f, pluralAdj(m), pluralAdj(f)]));
    r.tokens.forEach(x => { if (x.c === "a" && !adjs.has(x.t)) mal.push(`adjetivo raro: ${x.t}`); });
    if (r.tokens.some(x => !x.t || !x.c)) mal.push("pieza sin marcar");
    if (r.tokens.filter(x => x.c === "v").length !== 1) mal.push(`${r.tokens.filter(x => x.c === "v").length} verbos`);
    if (r.tipo === "tocar") {
      if (!r.correctas.length) mal.push("nada que tocar");
      if (!r.todos && r.correctas.length !== 1) mal.push(`${r.correctas.length} respuestas para tocar una`);
      if (r.por.length !== r.tokens.length) mal.push("faltan explicaciones");
      // en sujeto + adjetivo, el adjetivo concuerda con el sustantivo
      const ai = r.tokens.findIndex(x => x.c === "a");
      if (ai > 0 && r.tokens[ai - 1].c === "s") {
        const pS = /s$/.test(r.tokens[ai - 1].t), pA = /s$/.test(r.tokens[ai].t);
        if (pS !== pA) mal.push(`no concuerda: ${r.tokens[ai - 1].t} ${r.tokens[ai].t}`);
      }
    } else {
      if (r.corte < 1 || r.corte >= r.tokens.length) mal.push("corte fuera");
      if (r.tokens[r.corte].c !== "v") mal.push("el predicado no empieza con el verbo");
    }
  } else if (r.tipo === "elegir") {
    const ids = r.opciones.map(o => o.id);
    r.opciones.forEach(o => { if (/[*,]|undefined/.test(o.html)) mal.push(`opción rara: ${o.html}`); });
    if (new Set(ids).size !== ids.length) mal.push("opciones repetidas");
    if (new Set(r.opciones.map(o => o.html)).size !== ids.length) mal.push("opciones que se ven iguales");
    if (ids.filter(x => x === r.correcta).length !== 1) mal.push("la correcta no está una vez");
    if (ids.length < 2) mal.push("muy pocas opciones");
  } else mal.push("tipo desconocido");
  return mal;
}
