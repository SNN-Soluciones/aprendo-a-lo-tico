// 🎲 Generador de oraciones en español y en inglés, para que los juegos no repitan siempre lo mismo.
// Arma sujeto + verbo + complemento con concordancia en los dos idiomas, y solo junta lo que tiene sentido
// (el perezoso no «corre rápido», la rana canta «de noche»). Todo corre en el navegador: no hace falta servidor.

// p: persona gramatical (1s, 3s, 1p, 3p) · g: género (para los adjetivos) · t: qué es (para saber qué puede hacer)
// omitible: en español se puede quitar («Yo tengo hambre» = «Tengo hambre»)
const SUJETOS = [
  { es: "Yo", en: "I", p: "1s", t: "persona", omitible: true },
  { es: "Nosotros", en: "We", p: "1p", t: "persona", omitible: true },
  { es: "Mi hermano", en: "My brother", p: "3s", g: "m", t: "persona" },
  { es: "Mi hermana", en: "My sister", p: "3s", g: "f", t: "persona" },
  { es: "Mi abuela", en: "My grandmother", p: "3s", g: "f", t: "persona" },
  { es: "Mi papá", en: "My dad", p: "3s", g: "m", t: "persona" },
  { es: "Ella", en: "She", p: "3s", g: "f", t: "persona" },
  { es: "Él", en: "He", p: "3s", g: "m", t: "persona" },
  { es: "Mis amigos", en: "My friends", p: "3p", g: "m", t: "persona" },
  { es: "Los niños", en: "The children", p: "3p", g: "m", t: "persona" },
  { es: "Mi perro", en: "My dog", p: "3s", g: "m", t: "perro" },
  { es: "Mi gata", en: "My cat", p: "3s", g: "f", t: "gata" },
  { es: "El perezoso", en: "The sloth", p: "3s", g: "m", t: "perezoso" },
  { es: "El mono", en: "The monkey", p: "3s", g: "m", t: "mono" },
  { es: "La lapa", en: "The macaw", p: "3s", g: "f", t: "ave" },
  { es: "El pájaro", en: "The bird", p: "3s", g: "m", t: "ave" },
  { es: "La rana", en: "The frog", p: "3s", g: "f", t: "rana" },
  { es: "Las tortugas", en: "The turtles", p: "3p", g: "f", t: "tortuga" },
];

// Verbos: formas en español (1s, 3s, 1p, 3p) e inglés (base y 3s). Cada complemento dice quién lo puede hacer.
// tiempo: no se le agrega «hoy», «los domingos»… (ya dice cuándo, o no tiene sentido) · soloHoy: solo con «hoy»
const VERBOS = [
  { es: ["como", "come", "comemos", "comen"], en: ["eat", "eats"], c: [
    { es: "frutas", en: "fruit", t: ["persona", "mono", "ave"] },
    { es: "hojas", en: "leaves", t: ["perezoso", "tortuga"] },
    { es: "gallo pinto", en: "gallo pinto", t: ["persona"] },
    { es: "arroz con pollo", en: "rice with chicken", t: ["persona"] },
    { es: "insectos", en: "insects", t: ["rana", "ave"] },
    { es: "bananos", en: "bananas", t: ["mono", "persona"] } ] },
  { es: ["tomo", "toma", "tomamos", "toman"], en: ["drink", "drinks"], c: [
    { es: "agua", en: "water", t: ["persona", "perro", "gata", "mono", "ave", "perezoso"] },
    { es: "leche", en: "milk", t: ["persona", "gata"] } ] },
  { es: ["duermo", "duerme", "dormimos", "duermen"], en: ["sleep", "sleeps"], c: [
    { es: "en el árbol", en: "in the tree", t: ["perezoso", "mono", "ave"] },
    { es: "mucho", en: "a lot", t: ["perezoso", "gata", "perro", "persona"] },
    { es: "de noche", en: "at night", t: ["persona", "perro", "ave"], tiempo: true } ] },
  { es: ["juego", "juega", "jugamos", "juegan"], en: ["play", "plays"], c: [
    { es: "en el parque", en: "in the park", t: ["persona", "perro"] },
    { es: "fútbol", en: "soccer", t: ["persona"] },
    { es: "con la pelota", en: "with the ball", t: ["persona", "perro", "gata"] } ] },
  { es: ["corro", "corre", "corremos", "corren"], en: ["run", "runs"], c: [
    { es: "rápido", en: "fast", t: ["persona", "perro", "gata", "mono"] },
    { es: "en la playa", en: "on the beach", t: ["persona", "perro"] } ] },
  { es: ["nado", "nada", "nadamos", "nadan"], en: ["swim", "swims"], c: [
    { es: "en el río", en: "in the river", t: ["persona", "perro", "tortuga", "rana"] },
    { es: "en el mar", en: "in the sea", t: ["persona", "tortuga"] } ] },
  { es: ["salto", "salta", "saltamos", "saltan"], en: ["jump", "jumps"], c: [
    { es: "muy alto", en: "very high", t: ["persona", "rana", "mono", "gata"] } ] },
  { es: ["canto", "canta", "cantamos", "cantan"], en: ["sing", "sings"], c: [
    { es: "en la mañana", en: "in the morning", t: ["persona", "ave"], tiempo: true },
    { es: "de noche", en: "at night", t: ["rana"], tiempo: true },
    { es: "muy bonito", en: "very well", t: ["persona", "ave"] } ] },
  { es: ["leo", "lee", "leemos", "leen"], en: ["read", "reads"], c: [
    { es: "un libro", en: "a book", t: ["persona"] },
    { es: "un cuento", en: "a story", t: ["persona"] } ] },
  { es: ["voy", "va", "vamos", "van"], en: ["go", "goes"], c: [
    { es: "a la escuela", en: "to school", t: ["persona"] },
    { es: "a la playa", en: "to the beach", t: ["persona"] },
    { es: "a la pulpería", en: "to the store", t: ["persona"] } ] },
  { es: ["vivo", "vive", "vivimos", "viven"], en: ["live", "lives"], c: [
    { es: "en Costa Rica", en: "in Costa Rica", t: ["persona"], tiempo: true },
    { es: "en el bosque", en: "in the forest", t: ["perezoso", "mono", "ave", "rana"], tiempo: true },
    { es: "en el mar", en: "in the sea", t: ["tortuga"], tiempo: true } ] },
  // «Tener hambre» en inglés es «to be hungry»
  { es: ["tengo", "tiene", "tenemos", "tienen"], en: ["be"], c: [
    { es: "hambre", en: "hungry", t: ["persona", "perro", "gata", "mono", "perezoso", "ave", "rana", "tortuga"], soloHoy: true } ] },
];

// Adjetivos (solo con sujetos de género conocido): español [m, f, m plural, f plural]
const ADJETIVOS = [
  { es: ["grande", "grande", "grandes", "grandes"], en: "big", t: ["perro", "gata", "mono", "ave", "tortuga"] },
  { es: ["pequeño", "pequeña", "pequeños", "pequeñas"], en: "small", t: ["perro", "gata", "rana", "ave", "tortuga"] },
  { es: ["rápido", "rápida", "rápidos", "rápidas"], en: "fast", t: ["perro", "gata", "mono", "persona"] },
  { es: ["lento", "lenta", "lentos", "lentas"], en: "slow", t: ["perezoso", "tortuga"] },
  { es: ["verde", "verde", "verdes", "verdes"], en: "green", t: ["rana"] },
  { es: ["bonito", "bonita", "bonitos", "bonitas"], en: "beautiful", t: ["ave", "rana", "gata"] },
  { es: ["feliz", "feliz", "felices", "felices"], en: "happy", t: ["persona", "perro"] },
  { es: ["alto", "alta", "altos", "altas"], en: "tall", t: ["persona"] },
];
const SER = { "1s": "soy", "3s": "es", "1p": "somos", "3p": "son" };
const BE = { "1s": "am", "3s": "is", "1p": "are", "3p": "are" };

// Cuándo: en español va al inicio y en inglés al final (las dos posiciones se aceptan)
const TIEMPOS = [
  { es: "Hoy", en: "today" }, { es: "Los domingos", en: "on Sundays" },
  { es: "En la tarde", en: "in the afternoon" }, { es: "Todos los días", en: "every day" },
];

const IDX = { "1s": 0, "3s": 1, "1p": 2, "3p": 3 };
const mayus = t => t[0].toLocaleUpperCase("es") + t.slice(1);
// Primera letra en minúscula (al mover la frase detrás de «Hoy…»), salvo «I» en inglés
const minus = t => (/^I\b/.test(t) ? t : t[0].toLocaleLowerCase("es") + t.slice(1));
const elegir = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

function verboEn(v, p) {
  if (v.en[0] === "be") return BE[p];
  return p === "3s" ? v.en[1] : v.en[0];
}

/** Una frase al azar: { es, en, altEs, altEn, generada: true }. `tiempo`: probabilidad de agregar «hoy», «los domingos»… */
export function frase(rnd = Math.random, { tiempo = 0.3 } = {}) {
  for (let k = 0; k < 50; k++) {
    const s = elegir(SUJETOS, rnd);
    let es, en, conTiempo = false, soloHoy = false;
    if (rnd() < 0.2) {
      // Oración con «es / is» + adjetivo
      if (!s.g) continue;
      const a = elegir(ADJETIVOS.filter(x => x.t.includes(s.t)), rnd);
      if (!a) continue;
      const i = (s.g === "f" ? 1 : 0) + (s.p.endsWith("p") ? 2 : 0);
      es = `${s.es} ${SER[s.p]} ${a.es[i]}`;
      en = `${s.en} ${BE[s.p]} ${a.en}`;
    } else {
      const v = elegir(VERBOS, rnd);
      const cs = v.c.filter(c => c.t.includes(s.t));
      if (!cs.length) continue;
      const c = elegir(cs, rnd);
      es = `${s.es} ${v.es[IDX[s.p]]} ${c.es}`;
      en = `${s.en} ${verboEn(v, s.p)} ${c.en}`;
      conTiempo = !c.tiempo && rnd() < tiempo;
      soloHoy = !!c.soloHoy;
    }
    const altEs = [], altEn = [];
    if (conTiempo) {
      const t = soloHoy ? TIEMPOS[0] : elegir(TIEMPOS, rnd);
      const base = es;
      es = `${t.es} ${minus(base)}.`;
      altEs.push(`${base} ${t.es.toLocaleLowerCase("es")}.`);
      altEn.push(`${mayus(t.en)}, ${minus(en)}.`);
      en = `${en} ${t.en}.`;
    } else {
      es += "."; en += ".";
    }
    // «Yo tengo hambre» también se puede decir «Tengo hambre»
    if (s.omitible) [es, ...altEs].forEach(x => {
      const sin = x.replace(new RegExp(`(^|\\s)${s.es}\\s`, "i"), "$1").trim();
      altEs.push(mayus(sin));
    });
    return { es, en, altEs, altEn, generada: true };
  }
  return { es: "El perezoso duerme mucho.", en: "The sloth sleeps a lot.", altEs: [], altEn: [], generada: true };
}

/** Varias frases distintas. */
export function frases(n, rnd = Math.random, op) {
  const vistas = new Set(), out = [];
  for (let k = 0; out.length < n && k < n * 20; k++) {
    const f = frase(rnd, op);
    if (!vistas.has(f.es)) { vistas.add(f.es); out.push(f); }
  }
  return out;
}

// ---------- Mayúsculas: nombres de personas, mascotas y lugares ----------
const NOMBRES = ["María", "José", "Sofía", "Diego", "Valeria", "Mateo", "Camila", "Andrés", "Daniela", "Luis"];
const NOMBRES_F = ["Rosa", "Carmen", "Marta", "Ana"];
const MASCOTAS = ["Lucas", "Toby", "Canela", "Firulais", "Nube"];
const LUGARES = ["Cartago", "Heredia", "Limón", "Liberia", "Puntarenas", "Alajuela", "San José", "Monteverde", "Tortuguero", "Nicoya", "Golfito", "Turrialba"];
const DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];
export const DIAS_Y_MESES = [...DIAS, "sábado", "sábados", "domingo", "domingos", ...MESES];

const PLANTILLAS_MAYUS = [
  r => `${elegir(NOMBRES, r)} vive en ${elegir(LUGARES, r)}.`,
  r => { const a = elegir(NOMBRES, r); let b = elegir(NOMBRES, r); while (b === a) b = elegir(NOMBRES, r); return `${a} y ${b} juegan en la plaza.`; },
  r => `El ${elegir(DIAS, r)} viajamos a ${elegir(LUGARES, r)}.`,
  r => `En ${elegir(MESES, r)} vamos a ${elegir(LUGARES, r)}.`,
  r => `Mi perro ${elegir(MASCOTAS, r)} come mucho.`,
  r => `${elegir(NOMBRES, r)} nació en ${elegir(LUGARES, r)}.`,
  r => `Doña ${elegir(NOMBRES_F, r)} vende empanadas en ${elegir(LUGARES, r)}.`,
  r => `Los sábados ${elegir(NOMBRES, r)} visita a su abuela.`,
  r => `Mi gata ${elegir(MASCOTAS, r)} duerme en el sillón.`,
];
export const fraseMayus = (rnd = Math.random) => elegir(PLANTILLAS_MAYUS, rnd)(rnd);

// ---------- Signos: pregunta, emoción o punto ----------
const PREGUNTAS = [
  r => `¿Dónde está mi ${elegir(["mochila", "cuaderno", "lápiz", "gorra", "borrador"], r)}?`,
  r => `¿Querés ${elegir(["jugar", "bailar", "cantar", "leer", "dibujar"], r)} conmigo?`,
  r => `¿Te gusta ${elegir(["el gallo pinto", "el helado de mora", "la sandía", "el arroz con leche", "el fresco de cas"], r)}?`,
  r => `¿A qué hora sale el bus a ${elegir(LUGARES, r)}?`,
  r => `¿Cuántos ${elegir(["hermanos", "primos", "lápices", "perros"], r)} tenés?`,
  r => `¿Por qué ${elegir(["llora el bebé", "ladra el perro", "canta el gallo", "está cerrada la pulpería"], r)}?`,
];
const EMOCIONES = [
  r => elegir(["¡Qué rico está el gallo pinto!", "¡Qué rica está la sandía!", "¡Qué ricos están los tamales!", "¡Qué rico está el helado!"], r),
  r => `¡Cuidado con ${elegir(["el perro", "la calle", "el hueco", "las abejas", "el fuego"], r)}!`,
  r => `¡Feliz cumpleaños, ${elegir(["abuelita", "mamá", "papá", "tía", "profe"], r)}!`,
  r => `¡Qué ${elegir(["susto", "alegría", "sorpresa", "calor", "frío"], r)}!`,
  r => `¡Qué bien, ganamos el partido de ${elegir(["fútbol", "básquet", "voleibol"], r)}!`,
];
/** Oración con signo: tipo "pregunta" | "exclamacion" | "punto". */
export function fraseSigno(tipo, rnd = Math.random) {
  if (tipo === "pregunta") return elegir(PREGUNTAS, rnd)(rnd);
  if (tipo === "exclamacion") return elegir(EMOCIONES, rnd)(rnd);
  return frase(rnd, { tiempo: 0.4 }).es;
}
