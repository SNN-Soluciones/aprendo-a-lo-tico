// 🦜 Contenido y lógica de «Armo en inglés» (sin pantalla, para poder probarla sola).
// Cada frase tiene su versión en inglés y en español; `altEn` / `altEs` son otras traducciones que también están bien
// (solo sirven si se pueden armar con las fichas, por ejemplo quitando el «Yo»).

export const FRASES = [
  { en: "I have a dog.", es: "Yo tengo un perro.", altEs: ["Tengo un perro."] },
  { en: "The cat is black.", es: "El gato es negro." },
  { en: "I like mango.", es: "Me gusta el mango." },
  { en: "She is my sister.", es: "Ella es mi hermana." },
  { en: "We go to school.", es: "Nosotros vamos a la escuela.", altEs: ["Vamos a la escuela."] },
  { en: "The sloth is slow.", es: "El perezoso es lento." },
  { en: "It is raining today.", es: "Hoy está lloviendo.", altEn: ["Today it is raining."], altEs: ["Está lloviendo hoy."] },
  { en: "My mom makes gallo pinto.", es: "Mi mamá hace gallo pinto." },
  { en: "The sea is blue.", es: "El mar es azul." },
  { en: "I am ten years old.", es: "Yo tengo diez años.", altEs: ["Tengo diez años."] },
  { en: "Where is my backpack?", es: "¿Dónde está mi mochila?" },
  { en: "The toucan has a big beak.", es: "El tucán tiene un pico grande." },
  { en: "I drink coffee with milk.", es: "Yo tomo café con leche.", altEs: ["Tomo café con leche."] },
  { en: "My brother plays soccer.", es: "Mi hermano juega fútbol." },
  { en: "The frog is green.", es: "La rana es verde." },
  { en: "Do you want to play?", es: "¿Querés jugar?" },
  { en: "The monkey eats a banana.", es: "El mono come un banano." },
  { en: "I live in Costa Rica.", es: "Yo vivo en Costa Rica.", altEs: ["Vivo en Costa Rica."] },
  { en: "Good morning, teacher.", es: "Buenos días, maestra." },
  { en: "I am hungry.", es: "Yo tengo hambre.", altEs: ["Tengo hambre."] },
  { en: "They are my friends.", es: "Ellos son mis amigos.", altEs: ["Son mis amigos."] },
  { en: "The volcano is very big.", es: "El volcán es muy grande." },
  { en: "I can swim.", es: "Yo puedo nadar.", altEs: ["Puedo nadar."] },
  { en: "The bird sings in the morning.", es: "El pájaro canta en la mañana." },
];

export const ETAPAS = [
  { id: "escuchar", nombre: "1 · Escuchá y armá", emoji: "👂", de: "en", a: "en" },
  { id: "al-ingles", nombre: "2 · Al inglés", emoji: "🇺🇸", de: "es", a: "en" },
  { id: "al-espanol", nombre: "3 · Al español", emoji: "🇨🇷", de: "en", a: "es" },
];
export const PREGUNTAS = 8;

// Palabras que no se usan como «trampa»: con ellas se podrían armar frases casi correctas y confundir.
// Tampoco los pedazos de nombres de dos palabras («Rica» sola no tiene sentido).
const NO_TRAMPA = new Set(["a", "an", "the", "is", "are", "am", "el", "la", "los", "las", "un", "una", "es", "está", "yo", "i", "my", "mi",
  "costa", "rica", "gallo", "pinto"]);
// Nombres que siempre van con mayúscula
const NOMBRES = new Set(["I", "Costa", "Rica"]);

/** Palabras de una frase como fichas: sin signos y sin la mayúscula del inicio (para no regalar cuál va primero). */
export function fichasDe(frase) {
  return frase.replace(/[.,;:¿?¡!]/g, "").split(/\s+/).filter(Boolean)
    .map((w, i) => (i === 0 && !NOMBRES.has(w) ? w[0].toLocaleLowerCase() + w.slice(1) : w));
}

/** Para comparar: minúsculas, sin signos y sin espacios de más. */
export const normal = t => t.toLocaleLowerCase().replace(/[.,;:¿?¡!]/g, "").replace(/\s+/g, " ").trim();

/** Las respuestas aceptadas en el idioma `a` para una frase. */
export const aceptadas = (f, a) => (a === "en" ? [f.en, ...(f.altEn || [])] : [f.es, ...(f.altEs || [])]);

/** ¿Está bien lo que se armó (arreglo de palabras)? */
export const esCorrecta = (armada, f, a) => aceptadas(f, a).map(normal).includes(normal(armada.join(" ")));

function barajar(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Fichas para armar la frase en el idioma `a`: las correctas más 2 o 3 «trampas» de otras frases. */
export function fichas(f, a, rnd = Math.random) {
  const buenas = fichasDe(a === "en" ? f.en : f.es);
  const usadas = new Set(buenas.map(w => w.toLocaleLowerCase()));
  const otras = [...new Set(FRASES.filter(x => x !== f).flatMap(x => fichasDe(a === "en" ? x.en : x.es)))]
    .filter(w => !usadas.has(w.toLocaleLowerCase()) && !NO_TRAMPA.has(w.toLocaleLowerCase()));
  const trampas = barajar(otras, rnd).slice(0, buenas.length <= 4 ? 2 : 3);
  return barajar([...buenas, ...trampas], rnd).map((w, id) => ({ id, w }));
}

/** Frases de una ronda. */
export const ronda = (rnd = Math.random) => barajar(FRASES, rnd).slice(0, PREGUNTAS);

export function estrellasDe(bien, total) {
  const p = bien / total;
  return p >= 0.9 ? 3 : p >= 0.7 ? 2 : p >= 0.5 ? 1 : 0;
}
