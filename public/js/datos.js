// 📰 Contenido y lógica de «¿Dato u opinión?» (sin pantalla, para poder probarla sola).
//   Dato:    se puede comprobar (en un mapa, un libro, midiendo…). Puede ser verdadero o falso.
//   Opinión: es lo que alguien piensa o siente. No todos piensan igual.
// En las opiniones, las palabras que muestran la opinión van entre *asteriscos* (puede haber más de una).

export const ETAPAS = [
  { id: "clasificar", nombre: "1 · ¿Dato u opinión?", emoji: "📏", preguntas: 8,
    instr: "¿Es un <b>dato</b> (se puede comprobar) o una <b>opinión</b> (es lo que alguien piensa)?",
    voz: "¿Es un dato, que se puede comprobar, o una opinión, que es lo que alguien piensa?" },
  { id: "pista", nombre: "2 · Palabra pista", emoji: "🔍", preguntas: 6,
    instr: "Tocá la <b>palabra que muestra la opinión</b>.",
    voz: "Esta frase es una opinión. Tocá la palabra que muestra la opinión." },
  { id: "verdad", nombre: "3 · ¿Verdadero o falso?", emoji: "✅", preguntas: 9,
    instr: "¿Es un <b>dato verdadero</b>, un <b>dato falso</b> o una <b>opinión</b>?",
    voz: "¿Es un dato verdadero, un dato falso o una opinión?" },
  { id: "noticias", nombre: "4 · Detector de noticias", emoji: "📱", preguntas: 6,
    instr: "Te llegó este mensaje. ¿Es <b>confiable</b> o <b>sospechoso</b>?",
    voz: "Te llegó este mensaje. ¿Es confiable o sospechoso?" },
];

// ---------- Datos que se pueden comprobar ----------
// `como`: cómo se comprueba. En los falsos, `real` dice lo correcto.
export const DATOS = [
  { t: "Costa Rica tiene 7 provincias.", v: true, como: "Se comprueba en un mapa: San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas y Limón." },
  { t: "La capital de Costa Rica es San José.", v: true, como: "Se comprueba en un mapa o en un libro de Estudios Sociales." },
  { t: "Costa Rica celebra la independencia el 15 de setiembre.", v: true, como: "Se comprueba en el calendario de fechas patrias." },
  { t: "El volcán Irazú está en Cartago.", v: true, como: "Se comprueba en un mapa de Costa Rica." },
  { t: "La moneda de Costa Rica es el colón.", v: true, como: "Se comprueba mirando los billetes y las monedas." },
  { t: "El árbol nacional de Costa Rica es el guanacaste.", v: true, como: "Se comprueba en un libro de símbolos nacionales." },
  { t: "El ave nacional de Costa Rica es el yigüirro.", v: true, como: "Se comprueba en un libro de símbolos nacionales." },
  { t: "La flor nacional de Costa Rica es la guaria morada.", v: true, como: "Se comprueba en un libro de símbolos nacionales." },
  { t: "Guanacaste se unió a Costa Rica en 1824.", v: true, como: "Se comprueba en un libro de historia: el 25 de julio de 1824." },
  { t: "El Parque Nacional Tortuguero está en Limón.", v: true, como: "Se comprueba en un mapa de parques nacionales." },
  { t: "Costa Rica tiene costas en el mar Caribe y en el océano Pacífico.", v: true, como: "Se comprueba en un mapa." },
  { t: "Una semana tiene 7 días.", v: true, como: "Se comprueba contando los días en el calendario." },
  { t: "Costa Rica abolió el ejército en 1948.", v: true, como: "Se comprueba en un libro de historia." },
  { t: "El cerro Chirripó es la montaña más alta de Costa Rica.", v: true, como: "Se comprueba comparando las alturas en un libro o un mapa: mide unos 3820 metros." },
  { t: "La rana de vidrio tiene la piel de la panza transparente.", v: true, como: "Se comprueba observándola o en un libro de animales." },
  { t: "Los perezosos pasan casi todo el día en los árboles.", v: true, como: "Se comprueba observándolos o en un libro de animales." },

  { t: "Costa Rica tiene 10 provincias.", v: false, real: "Costa Rica tiene 7 provincias." },
  { t: "La capital de Costa Rica es Limón.", v: false, real: "La capital es San José. Limón es una provincia y una ciudad del Caribe." },
  { t: "El ave nacional de Costa Rica es el tucán.", v: false, real: "El ave nacional es el yigüirro." },
  { t: "El volcán Arenal está en Limón.", v: false, real: "El volcán Arenal está en Alajuela." },
  { t: "La moneda de Costa Rica es el dólar.", v: false, real: "La moneda de Costa Rica es el colón." },
  { t: "Costa Rica celebra la independencia el 25 de diciembre.", v: false, real: "La independencia es el 15 de setiembre. El 25 de diciembre es Navidad." },
  { t: "Una semana tiene 5 días.", v: false, real: "Una semana tiene 7 días." },
  { t: "Los perezosos son los animales más rápidos de la selva.", v: false, real: "Los perezosos son de los animales más lentos: se mueven muy despacio." },
  { t: "La Isla del Coco está en el mar Caribe.", v: false, real: "La Isla del Coco está en el océano Pacífico y es parte de Puntarenas." },
  { t: "El yigüirro es un pez.", v: false, real: "El yigüirro es un pájaro: el ave nacional." },
  { t: "El agua del mar es dulce.", v: false, real: "El agua del mar es salada." },
  { t: "Guanacaste es la provincia más pequeña de Costa Rica.", v: false, real: "La provincia más pequeña es Heredia. Guanacaste es de las más grandes." },
];

// ---------- Opiniones (las *palabras pista* muestran la opinión) ----------
export const OPINIONES = [
  "El gallo pinto es el desayuno *más rico* del mundo.",
  "*Creo que* la playa es *mejor* que la montaña.",
  "La clase de mate es *la más divertida* de todas.",
  "*Me parece que* los perezosos son *muy tiernos*.",
  "El fútbol es el deporte *más bonito*.",
  "Los días de lluvia son *aburridos*.",
  "*Yo pienso que* el jaguar es el animal *más lindo* de Costa Rica.",
  "Las vacaciones de medio año *deberían* ser más largas.",
  "El verde es un color *feo*.",
  "La música de marimba es *la mejor* para bailar.",
  "Los tamales de mi abuela son *deliciosos*.",
  "*En mi opinión,* leer es *más divertido* que ver tele.",
  "El volcán Arenal es *el más bonito* del país.",
  "Los gatos son *mejores* mascotas que los perros.",
  "El Día del Niño es *la fecha más especial* del año.",
  "*Ojalá* todos los días fueran sábado.",
];

// ---------- Mensajes para el detector de noticias ----------
export const SENALES = [
  { id: "grita", emoji: "🔠", nombre: "Grita", ayuda: "Usa MAYÚSCULAS o muchos ¡¡!!" },
  { id: "apura", emoji: "⏰", nombre: "Apura", ayuda: "Pide compartir o hacer algo ya" },
  { id: "fuente", emoji: "❓", nombre: "Sin fuente", ayuda: "No dice quién lo informa («dicen que…»)" },
  { id: "imposible", emoji: "🤯", nombre: "Imposible", ayuda: "Es imposible o demasiado bueno para ser cierto" },
  { id: "datos", emoji: "🔑", nombre: "Pide datos", ayuda: "Pide claves, datos o plata" },
];

export const NOTICIAS = [
  { t: "¡¡URGENTE!! Comer mango con leche es VENENOSO. ¡Compartilo ya con todos tus contactos!", ok: false, senales: ["grita", "apura", "fuente"],
    porque: "Grita, apura para compartir y no dice quién lo averiguó. Comer mango con leche no hace daño." },
  { t: "Dicen que un perezoso manejó un bus desde Cartago hasta San José.", ok: false, senales: ["fuente", "imposible"],
    porque: "«Dicen que» no dice quién lo vio, y un perezoso no puede manejar un bus." },
  { t: "¡Ganaste un celular gratis! Solo escribí la clave del banco de tu mamá para recibirlo.", ok: false, senales: ["imposible", "datos"],
    porque: "Nadie regala celulares así, y nunca hay que dar claves. Es una trampa: avisale a un adulto." },
  { t: "Alguien me contó que mañana no hay clases en todo el país. ¡Pasalo rápido!", ok: false, senales: ["fuente", "apura"],
    porque: "«Alguien me contó» no es una fuente, y apura para que lo compartás sin revisar. Hay que preguntar en la escuela." },
  { t: "INCREÍBLE: una tortuga de Tortuguero habla inglés y español.", ok: false, senales: ["grita", "imposible", "fuente"],
    porque: "Grita con mayúsculas, no dice quién lo informa y las tortugas no hablan." },
  { t: "Somos del banco. Mandanos tu PIN hoy mismo o te cerramos la cuenta.", ok: false, senales: ["datos", "apura"],
    porque: "Un banco de verdad nunca pide el PIN por mensaje, y apura para asustar." },
  { t: "Si tomás 10 vasos de fresco de cas vas a crecer 20 centímetros en una semana. ¡¡¡Comprobado!!!", ok: false, senales: ["imposible", "grita", "fuente"],
    porque: "Nadie crece 20 centímetros en una semana, grita con ¡¡¡!!! y no dice quién lo «comprobó»." },
  { t: "Un amigo de un amigo vio un dinosaurio en el volcán Poás. ¡Compartí antes de que lo borren!", ok: false, senales: ["fuente", "imposible", "apura"],
    porque: "«Un amigo de un amigo» no es fuente, los dinosaurios ya no existen y apura para que lo compartás." },

  { t: "El Instituto Meteorológico Nacional (IMN) informó que esta semana va a llover por las tardes en el Valle Central.", ok: true, senales: [],
    porque: "Dice quién informa (el IMN, que estudia el clima), no grita, no apura y es algo que puede pasar." },
  { t: "La directora avisó en la reunión de padres que el paseo de la escuela es el viernes.", ok: true, senales: [],
    porque: "Lo dijo la directora, que es quien organiza el paseo. Es algo normal y se puede preguntar." },
  { t: "Según el Ministerio de Salud, lavarse las manos con jabón ayuda a evitar enfermedades.", ok: true, senales: [],
    porque: "Dice quién lo informa y es algo que se puede comprobar." },
  { t: "La maestra escribió en el cuaderno de comunicaciones la lista de útiles para el lunes.", ok: true, senales: [],
    porque: "Viene de la maestra, por el cuaderno de la escuela. No grita ni pide datos." },
  { t: "Según la Municipalidad, el camión de la basura pasa los martes y los jueves.", ok: true, senales: [],
    porque: "Dice quién informa (la Municipalidad, que se encarga de la basura) y es algo normal." },
  { t: "La bibliotecaria contó en el periódico del pueblo que la biblioteca ahora abre también los sábados.", ok: true, senales: [],
    porque: "Dice quién lo cuenta y dónde. Se puede comprobar yendo a la biblioteca." },
];

/** Quita los *asteriscos*. */
export const limpio = t => t.replace(/\*/g, "");

/** Parte una opinión en pedazos: [{ t: "El gallo pinto es el desayuno", pista: false }, { t: "más rico", pista: true }, …] */
export function partes(texto) {
  return texto.split("*").map((t, i) => ({ t: t.trim(), pista: i % 2 === 1 })).filter(p => p.t);
}

/** Palabras de una opinión, cada una con si es palabra pista. */
export function palabras(texto) {
  const ws = [];
  for (const p of partes(texto)) for (const w of p.t.split(/\s+/)) {
    // Un punto o una coma sueltos («*feo*.») se pegan a la palabra anterior
    if (/^[.,;:!?]+$/.test(w) && ws.length) ws[ws.length - 1].w += w;
    else ws.push({ w, pista: p.pista });
  }
  return ws;
}

/** Las palabras pista juntas: «más rico», «Creo que»… */
export const pistasDe = texto => partes(texto).filter(p => p.pista).map(p => p.t.replace(/[.,]$/, ""));

function barajar(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/**
 * Preguntas de una ronda. Cada una es:
 *   { tipo: "dato", t, v, como|real }   ·   { tipo: "opinion", t (con *pistas*) }   ·   { tipo: "noticia", t, ok, senales, porque }
 */
export function ronda(etapaId, rnd = Math.random) {
  const e = ETAPAS.find(x => x.id === etapaId);
  const n = e.preguntas;
  const dato = d => ({ tipo: "dato", ...d });
  const opinion = t => ({ tipo: "opinion", t });
  if (etapaId === "clasificar") {
    // Solo datos verdaderos: primero aprendemos a distinguir, después a revisar si son ciertos.
    const k = Math.floor(n / 2);
    return barajar([...barajar(DATOS.filter(d => d.v), rnd).slice(0, k).map(dato), ...barajar(OPINIONES, rnd).slice(0, n - k).map(opinion)], rnd);
  }
  if (etapaId === "pista") return barajar(OPINIONES, rnd).slice(0, n).map(opinion);
  if (etapaId === "verdad") {
    const k = n / 3;
    return barajar([
      ...barajar(DATOS.filter(d => d.v), rnd).slice(0, k).map(dato),
      ...barajar(DATOS.filter(d => !d.v), rnd).slice(0, k).map(dato),
      ...barajar(OPINIONES, rnd).slice(0, k).map(opinion),
    ], rnd);
  }
  // Noticias: 4 sospechosas y 2 confiables
  return barajar([
    ...barajar(NOTICIAS.filter(x => !x.ok), rnd).slice(0, 4),
    ...barajar(NOTICIAS.filter(x => x.ok), rnd).slice(0, n - 4),
  ], rnd).map(x => ({ tipo: "noticia", ...x }));
}

/** Respuesta correcta en las etapas de botones: "dato" | "opinion" | "verdadero" | "falso" | "confiable" | "sospechosa". */
export function respuesta(p, etapaId) {
  if (p.tipo === "noticia") return p.ok ? "confiable" : "sospechosa";
  if (p.tipo === "opinion") return "opinion";
  return etapaId === "verdad" ? (p.v ? "verdadero" : "falso") : "dato";
}

/** Compara las señales que marcó el niño con las del mensaje. */
export function revisarSenales(elegidas, correctas) {
  const e = new Set(elegidas), c = new Set(correctas);
  const bien = [...e].filter(x => c.has(x)), faltan = [...c].filter(x => !e.has(x)), sobran = [...e].filter(x => !c.has(x));
  return { bien, faltan, sobran, exacto: !faltan.length && !sobran.length };
}

/** Estrellas de una ronda según los puntos (0 a 3). */
export function estrellasDe(puntos, total) {
  const p = puntos / total;
  return p >= 0.9 ? 3 : p >= 0.7 ? 2 : p >= 0.5 ? 1 : 0;
}
