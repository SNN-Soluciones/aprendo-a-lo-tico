// ✏️ Contenido y lógica de «Armo la oración» (sin pantalla, para poder probarla sola).
// Etapas: ordenar palabras (cortas y largas), elegir el signo (. ¿? ¡!) y poner las mayúsculas.

export const ETAPAS = [
  { id: "cortas", nombre: "1 · Oraciones cortas", emoji: "🧩", preguntas: 6 },
  { id: "largas", nombre: "2 · Oraciones largas", emoji: "🚂", preguntas: 6 },
  { id: "signos", nombre: "3 · ¿Punto, pregunta o emoción?", emoji: "❓", preguntas: 8 },
  { id: "mayus", nombre: "4 · Mayúsculas", emoji: "🔠", preguntas: 6 },
];

// La mayúscula del inicio y el punto final ayudan a saber qué palabra va primero y cuál de último.
// `alt`: otros órdenes que también están bien.
export const CORTAS = [
  { t: "Mi perro es café." },
  { t: "La lapa vuela alto." },
  { t: "Mamá hace gallo pinto." },
  { t: "El sol está caliente." },
  { t: "Me gusta el mango." },
  { t: "El perezoso duerme mucho." },
  { t: "Vamos a la escuela." },
  { t: "Llueve en la tarde." },
  { t: "Mi abuela hace tamales." },
  { t: "El mar es azul." },
  { t: "Yo tengo un gato." },
  { t: "La rana es verde." },
  { t: "Papá toma café." },
  { t: "El bus va lleno." },
];

export const LARGAS = [
  { t: "El yigüirro canta cuando empieza a llover." },
  { t: "Los domingos comemos arroz con pollo." },
  { t: "Mi hermana juega fútbol en la plaza." },
  { t: "La tortuga pone sus huevos en la arena." },
  { t: "En diciembre hace mucho viento." },
  { t: "El volcán Arenal está en Alajuela." },
  { t: "Mi papá maneja el bus de Cartago." },
  { t: "Los niños cantan el himno nacional." },
  { t: "La maestra lee un cuento bonito." },
  { t: "El mono congo grita en la mañana." },
  { t: "Hoy vamos a la feria con mi abuelo." },
  { t: "Mi gata duerme encima de la cama." },
  { t: "Las ranas cantan de noche en el río.", alt: ["Las ranas de noche cantan en el río."] },
];

// Oraciones con su signo: se muestran sin signos y el niño elige.
export const SIGNOS = [
  "¿Dónde está mi mochila?",
  "¡Qué rico está el gallo pinto!",
  "Mañana vamos a la playa.",
  "¿Cuántos años tenés?",
  "¡Cuidado con el perro!",
  "El perezoso vive en los árboles.",
  "¿Querés jugar conmigo?",
  "¡Qué susto me diste!",
  "Mi mamá trabaja en el hospital.",
  "¿A qué hora sale el bus?",
  "¡Feliz cumpleaños, abuelita!",
  "Los gatos toman leche.",
  "¿Te gusta el helado de mora?",
  "¡Qué bonito tu dibujo!",
  "La guaria morada es la flor nacional.",
  "¿Por qué llora el bebé?",
  "¡Auxilio, se me cayó el helado!",
  "Mi escuela tiene una huerta.",
];

// Oraciones bien escritas: se muestran en minúscula y el niño toca las que llevan mayúscula.
export const MAYUS = [
  "María vive en Cartago.",
  "El volcán Poás está en Alajuela.",
  "Los sábados vamos a Puntarenas.",
  "La capital de Costa Rica es San José.",
  "Mi perro Lucas come mucho.",
  "El río Tárcoles tiene cocodrilos.",
  "Sofía y Diego juegan en la plaza.",
  "El lunes viajamos a Limón.",
  "Doña Rosa vende empanadas en la feria.",
  "Mi abuela nació en Nicoya.",
  "En abril vimos tucanes en Monteverde.",
  "En setiembre vamos al desfile en Heredia.",
];

export const palabrasDe = t => t.split(/\s+/);

function barajar(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Fichas desordenadas (nunca en el orden correcto). Cada ficha: { id, w }. */
export function fichas(t, rnd = Math.random) {
  const ws = palabrasDe(t).map((w, id) => ({ id, w }));
  for (let k = 0; k < 20; k++) {
    const b = barajar(ws, rnd);
    if (b.map(x => x.w).join(" ") !== t) return b;
  }
  return [...ws].reverse();
}

/** ¿La oración armada (arreglo de palabras) está bien? */
export const esCorrecta = (armada, o) => [o.t, ...(o.alt || [])].includes(armada.join(" "));

/** Primera posición equivocada (comparando con la versión que más se parece), o -1. */
export function primerError(armada, o) {
  let mejor = 0;
  for (const t of [o.t, ...(o.alt || [])]) {
    const ws = palabrasDe(t);
    let i = 0;
    while (i < armada.length && armada[i] === ws[i]) i++;
    if (i === ws.length && armada.length === ws.length) return -1;
    mejor = Math.max(mejor, i);
  }
  return mejor;
}

/** "pregunta" | "exclamacion" | "punto" */
export const signoDe = t => t.endsWith("?") ? "pregunta" : t.endsWith("!") ? "exclamacion" : "punto";
/** La oración sin signos: «Dónde está mi mochila» */
export const sinSignos = t => t.replace(/[¿?¡!]/g, "").replace(/\.$/, "");

/** Minúscula / mayúscula de la primera letra. */
const minus = w => w[0].toLocaleLowerCase("es") + w.slice(1);
export const mayus = w => w[0].toLocaleUpperCase("es") + w.slice(1);

/** Palabras en minúscula con si llevan mayúscula: [{ w: "maría", mayus: true }, …] */
export const paraMayus = t => palabrasDe(t).map(w => ({ w: minus(w), mayus: w[0] !== minus(w)[0] }));

/** Compara las palabras que el niño puso en mayúscula (índices) con las correctas. */
export function revisarMayus(elegidas, t) {
  const correctas = paraMayus(t).map((p, i) => (p.mayus ? i : -1)).filter(i => i >= 0);
  const e = new Set(elegidas);
  const faltan = correctas.filter(i => !e.has(i)), sobran = [...e].filter(i => !correctas.includes(i));
  return { correctas, faltan, sobran, exacto: !faltan.length && !sobran.length };
}

/** Preguntas de una ronda de la etapa. */
export function ronda(etapaId, rnd = Math.random) {
  const e = ETAPAS.find(x => x.id === etapaId);
  const fuente = { cortas: CORTAS, largas: LARGAS, signos: SIGNOS.map(t => ({ t })), mayus: MAYUS.map(t => ({ t })) }[etapaId];
  if (etapaId !== "signos") return barajar(fuente, rnd).slice(0, e.preguntas);
  // Signos: que haya de los tres tipos
  const por = tipo => barajar(fuente.filter(o => signoDe(o.t) === tipo), rnd);
  const [p, q, x] = [por("punto"), por("pregunta"), por("exclamacion")];
  return barajar([...p.slice(0, 3), ...q.slice(0, 3), ...x.slice(0, 2)], rnd);
}

/** Estrellas de una ronda (0 a 3). */
export function estrellasDe(puntos, total) {
  const p = puntos / total;
  return p >= 0.9 ? 3 : p >= 0.7 ? 2 : p >= 0.5 ? 1 : 0;
}
