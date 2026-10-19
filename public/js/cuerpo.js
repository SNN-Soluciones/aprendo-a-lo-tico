// 🫀 Lógica de «El cuerpo humano» (sin pantalla, para poder probarla sola con node).
// Partes del cuerpo y órganos de cada sistema, el dibujo SVG donde se tocan, y los generadores de preguntas.
//
// Tres tipos de pregunta:
//   tocar:    { tipo, sistema, meta, partes, html, voz, bien }               tocar la parte en el dibujo
//   opciones: { tipo, ver?, opciones: [{ id, html, voz, por? }], correcta, html, voz, bien }
//   ordenar:  { tipo, pasos: [{ id, html }] (en el orden correcto), html, voz, bien }

export const SISTEMAS = {
  externo: { n: "las partes del cuerpo", e: "🧍" },
  digestivo: { n: "el sistema digestivo", e: "🍎", que: "convierte la comida en nutrientes que el cuerpo puede usar" },
  respiratorio: { n: "el sistema respiratorio", e: "🫁", que: "toma el oxígeno del aire y saca el dióxido de carbono" },
  circulatorio: { n: "el sistema circulatorio", e: "❤️", que: "lleva la sangre con oxígeno y nutrientes a todo el cuerpo" },
  oseo: { n: "el sistema óseo", e: "🦴", que: "sostiene el cuerpo y protege los órganos" },
  nervioso: { n: "el sistema nervioso", e: "🧠", que: "controla el cuerpo y lleva los mensajes" },
  excretor: { n: "el sistema excretor", e: "💧", que: "limpia la sangre y saca los desechos del cuerpo" },
};
export const ORGANICOS = ["digestivo", "respiratorio", "circulatorio", "oseo", "nervioso", "excretor"];

// n: con artículo · f: para qué sirve (para decir «El corazón bombea…») · pide: para tocarlo por lo que hace
// dato: en las partes de afuera, una frase para aprender algo
const P = (s, n, f, pide) => ({ s, n, f, pide });
export const PARTES = {
  cabeza: { s: "externo", n: "la cabeza", dato: "En la cabeza están los ojos, la nariz, la boca y las orejas." },
  cuello: { s: "externo", n: "el cuello", dato: "El cuello une la cabeza con el tronco." },
  tronco: { s: "externo", n: "el tronco", dato: "En el tronco están el pecho, la espalda y el abdomen." },
  brazos: { s: "externo", n: "los brazos", dato: "Los brazos son las extremidades superiores." },
  manos: { s: "externo", n: "las manos", dato: "Con las manos agarramos y tocamos las cosas. Cada una tiene cinco dedos." },
  piernas: { s: "externo", n: "las piernas", dato: "Las piernas son las extremidades inferiores." },
  pies: { s: "externo", n: "los pies", dato: "Los pies nos sostienen y nos ayudan a caminar y a brincar." },

  boca: P("digestivo", "la boca", "mastica la comida con los dientes y la mezcla con la saliva", "Tocá donde se mastica la comida."),
  esofago: P("digestivo", "el esófago", "es el tubo que lleva la comida de la boca al estómago", "Tocá el tubo que lleva la comida de la boca al estómago."),
  estomago: P("digestivo", "el estómago", "revuelve la comida con jugos que la van deshaciendo", "Tocá el órgano que revuelve la comida con jugos para deshacerla."),
  delgado: P("digestivo", "el intestino delgado", "pasa los nutrientes de la comida a la sangre", "Tocá donde los nutrientes de la comida pasan a la sangre."),
  grueso: P("digestivo", "el intestino grueso", "saca el agua de lo que sobra y junta los desechos que el cuerpo no usa", "Tocá donde se juntan los desechos que el cuerpo no usa."),

  nariz: P("respiratorio", "la nariz", "deja entrar el aire, lo limpia y lo calienta", "Tocá por donde entra el aire y se limpia."),
  traquea: P("respiratorio", "la tráquea", "es el tubo por donde baja el aire hacia los pulmones", "Tocá el tubo por donde baja el aire a los pulmones."),
  pulmones: P("respiratorio", "los pulmones", "toman el oxígeno del aire y sacan el dióxido de carbono", "Tocá los órganos que toman el oxígeno del aire."),
  diafragma: P("respiratorio", "el diafragma", "es un músculo que baja y sube para que el aire entre y salga de los pulmones", "Tocá el músculo que sube y baja para que podamos respirar."),

  corazon: P("circulatorio", "el corazón", "bombea la sangre a todo el cuerpo", "Tocá el órgano que bombea la sangre."),
  arterias: P("circulatorio", "las arterias", "llevan la sangre desde el corazón hacia todo el cuerpo", "Tocá los tubos que llevan la sangre desde el corazón hacia el cuerpo."),
  venas: P("circulatorio", "las venas", "traen la sangre de vuelta al corazón", "Tocá los tubos que traen la sangre de vuelta al corazón."),

  craneo: P("oseo", "el cráneo", "protege el cerebro", "Tocá el hueso que protege el cerebro."),
  costillas: P("oseo", "las costillas", "protegen el corazón y los pulmones", "Tocá los huesos que protegen el corazón y los pulmones."),
  columna: P("oseo", "la columna vertebral", "nos sostiene derechos y protege la médula espinal", "Tocá los huesos que nos sostienen derechos."),
  femur: P("oseo", "el fémur", "es el hueso del muslo, el más largo del cuerpo", "Tocá el hueso más largo del cuerpo."),

  cerebro: P("nervioso", "el cerebro", "piensa, recuerda y manda las órdenes a todo el cuerpo", "Tocá el órgano con el que pensamos y recordamos."),
  medula: P("nervioso", "la médula espinal", "baja por dentro de la columna y lleva los mensajes entre el cerebro y el cuerpo", "Tocá la que baja por dentro de la columna llevando mensajes."),
  nervios: P("nervioso", "los nervios", "llevan los mensajes del cuerpo al cerebro y del cerebro al cuerpo", "Tocá los hilitos que llevan mensajes hasta las manos y los pies."),

  rinones: P("excretor", "los riñones", "limpian la sangre y forman la orina", "Tocá los órganos que limpian la sangre."),
  vejiga: P("excretor", "la vejiga", "guarda la orina hasta que vamos al baño", "Tocá donde se guarda la orina."),
};
export const partesDe = s => Object.keys(PARTES).filter(id => PARTES[id].s === s);

// Parejas que se confunden fácil: tocar una por la otra es «¡Casi!»
const PARECIDOS = [["delgado", "grueso"], ["arterias", "venas"], ["medula", "nervios"], ["brazos", "manos"], ["piernas", "pies"], ["cabeza", "cuello"], ["medula", "columna"]];
export const parecidos = (a, b) => PARECIDOS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

export const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
const plural = n => /^(los|las) /.test(n);
const de = n => n.replace(/^el /, "del ").replace(/^(la|los|las) /, "de $1 ");
/** «Ese es el cráneo», «Esas son las costillas» */
export const eseEs = n => ({ el: "Ese es", la: "Esa es", los: "Esos son", las: "Esas son" })[n.split(" ")[0]] + " " + n;

// ---------- Los sentidos ----------
export const SENTIDOS = [
  { id: "vista", n: "la vista", organo: "los ojos", e: "👀", hace: "vemos", pregunta: "¿Con qué vemos?",
    usos: ["ver los colores del arcoíris", "leer un cuento", "ver si el semáforo está en rojo", "mirar las estrellas de noche"] },
  { id: "oido", n: "el oído", organo: "los oídos", e: "👂", hace: "escuchamos", pregunta: "¿Con qué escuchamos?",
    usos: ["escuchar el canto del yigüirro", "oír la marimba en el turno", "escuchar el timbre de la escuela", "oír la lluvia en el techo"] },
  { id: "olfato", n: "el olfato", organo: "la nariz", e: "👃", hace: "olemos", pregunta: "¿Con qué olemos?",
    usos: ["oler el café recién chorreado", "sentir el olor de una flor", "oler el pan recién horneado"] },
  { id: "gusto", n: "el gusto", organo: "la lengua", e: "👅", hace: "sentimos los sabores", pregunta: "¿Con qué sentimos los sabores?",
    usos: ["saber si el limón está ácido", "saborear un mango maduro", "probar si a la sopa le falta sal", "sentir lo dulce de un helado"] },
  { id: "tacto", n: "el tacto", organo: "la piel", e: "✋", hace: "sentimos si algo está frío, caliente, suave o áspero", pregunta: "¿Con qué sentimos si algo está frío o caliente?",
    usos: ["sentir si el agua está fría o caliente", "sentir lo suave de un peluche", "sentir lo áspero de una piedra", "sentir el viento en la cara"] },
];

// ---------- Recorridos para ordenar ----------
export const RECORRIDOS = {
  comida: { sistema: "digestivo", titulo: "el viaje de la comida", html: "🍎 ¿Por dónde pasa la comida? Tocá en orden.",
    voz: "Ordená el viaje de la comida. Tocá primero por dónde entra.",
    pasos: ["👄 Boca", "Esófago", "Estómago", "Intestino delgado", "Intestino grueso"],
    bien: "La comida entra por la boca, baja por el esófago, el estómago la deshace, en el intestino delgado los nutrientes pasan a la sangre y el intestino grueso junta lo que sobra." },
  aire: { sistema: "respiratorio", titulo: "el camino del aire", html: "🌬️ ¿Por dónde pasa el aire al inhalar? Tocá en orden.",
    voz: "Ordená el camino del aire cuando inhalamos. Tocá primero por dónde entra.",
    pasos: ["👃 Nariz", "Tráquea", "Bronquios", "🫁 Pulmones"],
    bien: "El aire entra por la nariz, baja por la tráquea, se divide en los dos bronquios y llega a los pulmones." },
  sangre: { sistema: "circulatorio", titulo: "la vuelta de la sangre", html: "❤️ ¿Cómo da la vuelta la sangre? Tocá en orden.",
    voz: "Ordená la vuelta que da la sangre. Empezá por el corazón.",
    pasos: ["❤️ El corazón bombea la sangre", "Las arterias la llevan", "Llega a todo el cuerpo", "Las venas la traen de vuelta al corazón"],
    bien: "El corazón bombea la sangre, las arterias la llevan a todo el cuerpo y las venas la traen de vuelta al corazón. ¡Y vuelve a empezar!" },
  mensaje: { sistema: "nervioso", titulo: "el viaje de un mensaje", html: "⚽ Viene una bola: ¿cómo la atrapás? Tocá en orden.",
    voz: "Viene una bola y la atrapás. Ordená el viaje del mensaje.",
    pasos: ["👀 Los ojos ven la bola", "Los nervios llevan el mensaje al cerebro", "🧠 El cerebro decide atraparla", "Los nervios llevan la orden a los músculos", "✋ Las manos atrapan la bola"],
    bien: "Los ojos ven, los nervios avisan al cerebro, el cerebro decide y los nervios llevan la orden a los músculos, que mueven las manos. ¡Todo en menos de un segundo!" },
  orina: { sistema: "excretor", titulo: "cómo se limpia la sangre", html: "💧 ¿Cómo se limpia la sangre? Tocá en orden.",
    voz: "Ordená cómo se limpia la sangre.",
    pasos: ["La sangre llega a los riñones", "Los riñones la limpian y forman la orina", "La orina baja a la vejiga", "La vejiga la guarda hasta ir al baño"],
    bien: "Los riñones limpian la sangre y forman la orina, que baja a la vejiga y se guarda hasta que vamos al baño." },
};

// ---------- Hábitos ----------
export const HABITOS = [
  { t: "Lavarse las manos con agua y jabón antes de comer", si: true, por: "El jabón quita los microbios que nos pueden enfermar." },
  { t: "Cepillarse los dientes después de comer", si: true, por: "Así se quitan los restos de comida y los dientes no se pican." },
  { t: "Comer frutas y verduras todos los días", si: true, por: "Tienen vitaminas y fibra que el cuerpo necesita." },
  { t: "Tomar agua durante el día", si: true, por: "El cuerpo necesita agua para funcionar bien, sobre todo cuando hace calor o hacemos ejercicio." },
  { t: "Jugar afuera y hacer ejercicio", si: true, por: "El ejercicio fortalece los músculos, los huesos y el corazón." },
  { t: "Dormir temprano y bastantes horas", si: true, por: "Mientras dormimos, el cuerpo descansa y crece, y el cerebro ordena lo que aprendimos." },
  { t: "Usar casco al andar en bici", si: true, por: "El casco protege la cabeza y el cerebro si nos caemos." },
  { t: "Taparse con el codo al toser o estornudar", si: true, por: "Así no les pasamos microbios a los demás." },
  { t: "Ponerse bloqueador y gorra bajo el sol fuerte", si: true, por: "Cuidan la piel de las quemaduras del sol." },
  { t: "Tomar muchos refrescos con azúcar en vez de agua", si: false, por: "Mucha azúcar daña los dientes y no le hace bien al cuerpo. Para la sed, lo mejor es el agua." },
  { t: "Pasar toda la tarde sentado frente a una pantalla", si: false, por: "El cuerpo necesita moverse: mejor jugar, caminar o hacer ejercicio un rato." },
  { t: "Acostarse muy tarde todas las noches", si: false, por: "Si no dormimos bien, el cuerpo y el cerebro no descansan." },
  { t: "Comer con las manos sucias", si: false, por: "Los microbios de las manos pueden pasar a la comida y enfermarnos." },
  { t: "Comer solo golosinas y no almorzar", si: false, por: "Las golosinas no tienen lo que el cuerpo necesita para crecer y tener energía." },
];

// ---------- Preguntas de conceptos (una correcta y dos que no) ----------
const C = (p, si, no, por) => ({ p, si, no, por });
export const CONCEPTOS = {
  externo: [
    C("¿Cuáles son las tres partes principales del cuerpo?", "Cabeza, tronco y extremidades", ["Ojos, nariz y boca", "Manos, pies y cuello"], "El cuerpo tiene cabeza, tronco y extremidades: los brazos y las piernas."),
    C("¿Cuáles son las extremidades?", "Los brazos y las piernas", ["La cabeza y el cuello", "El pecho y la espalda"], "Los brazos son las extremidades superiores y las piernas, las inferiores."),
    C("¿Qué une la cabeza con el tronco?", "El cuello", ["La cintura", "La rodilla"], "El cuello une la cabeza con el tronco y nos deja girarla."),
    C("¿Qué doblamos en la mitad del brazo?", "El codo", ["La rodilla", "El tobillo"], "El codo está en la mitad del brazo; la rodilla, en la mitad de la pierna."),
    C("¿Qué doblamos en la mitad de la pierna?", "La rodilla", ["El codo", "La muñeca"], "La rodilla está en la mitad de la pierna; el codo, en la mitad del brazo."),
  ],
  digestivo: [
    C("¿Qué hacen los dientes?", "Cortan y muelen la comida", ["Limpian la sangre", "Llevan el aire a los pulmones"], "Los dientes cortan y muelen la comida para que sea fácil tragarla."),
    C("¿Qué ablanda la comida en la boca?", "La saliva", ["La sangre", "El aire"], "La saliva moja y ablanda la comida, y empieza a digerirla."),
    C("¿Dónde pasan los nutrientes a la sangre?", "En el intestino delgado", ["En el esófago", "En la boca"], "En el intestino delgado los nutrientes pasan a la sangre, que los lleva a todo el cuerpo."),
    C("¿Por qué hay que masticar bien la comida?", "Para que se digiera mejor", ["Para que llegue a los pulmones", "Para que el corazón lata más lento"], "Bien masticada, la comida se deshace mejor y el cuerpo la aprovecha."),
    C("¿Qué hace el sistema digestivo?", "Convierte la comida en nutrientes para el cuerpo", ["Lleva la sangre por todo el cuerpo", "Toma el oxígeno del aire"], "El sistema digestivo convierte la comida en nutrientes que el cuerpo puede usar."),
  ],
  respiratorio: [
    C("Cuando inhalamos…", "entra el aire a los pulmones", ["sale el aire de los pulmones", "tragamos la comida"], "Inhalar es meter el aire; exhalar es sacarlo."),
    C("Cuando exhalamos…", "sale el aire de los pulmones", ["entra el aire a los pulmones", "late más lento el corazón"], "Exhalar es sacar el aire; inhalar es meterlo."),
    C("¿Qué gas del aire necesita el cuerpo?", "El oxígeno", ["El dióxido de carbono", "El humo"], "Los pulmones toman el oxígeno del aire y la sangre lo lleva a todo el cuerpo."),
    C("¿Qué gas de desecho sacamos al exhalar?", "El dióxido de carbono", ["El oxígeno", "El humo"], "Al exhalar sacamos el dióxido de carbono, el gas que el cuerpo no necesita."),
    C("Al inhalar, el diafragma…", "baja y los pulmones se llenan de aire", ["sube y saca el aire", "se queda quieto"], "Al inhalar el diafragma baja y deja espacio para que los pulmones se llenen; al exhalar, sube."),
    C("¿Por qué es mejor respirar por la nariz?", "Porque limpia y calienta el aire", ["Porque así se respira más rápido", "Porque así no se usan los pulmones"], "Los pelitos y la mucosidad de la nariz atrapan el polvo, y el aire se calienta antes de llegar a los pulmones."),
  ],
  circulatorio: [
    C("¿Qué lleva la sangre a todo el cuerpo?", "Oxígeno y nutrientes", ["Solo agua", "Comida sin masticar"], "La sangre lleva el oxígeno de los pulmones y los nutrientes de la comida a todo el cuerpo."),
    C("¿Más o menos de qué tamaño es tu corazón?", "Como tu puño cerrado", ["Como una bola de fútbol", "Como un frijol"], "El corazón es más o menos del tamaño de tu puño, y crece con vos."),
    C("¿Qué sentís al poner los dedos en la muñeca?", "El pulso: los latidos del corazón", ["El aire que respiramos", "La comida que baja"], "Cada latido empuja la sangre por las arterias, y eso se siente como el pulso."),
    C("¿Qué le pasa al corazón cuando corrés?", "Late más rápido", ["Deja de latir", "Late más lento"], "Al hacer ejercicio los músculos necesitan más oxígeno, así que el corazón late más rápido."),
    C("El corazón es…", "un músculo", ["un hueso", "un pulmón"], "El corazón es un músculo que trabaja todo el día y toda la noche, sin descansar."),
  ],
  oseo: [
    C("¿Qué mueve los huesos?", "Los músculos", ["Los pulmones", "Los riñones"], "Los músculos jalan de los huesos para que nos movamos."),
    C("¿Cuál es el hueso más largo del cuerpo?", "El fémur", ["El cráneo", "Una costilla"], "El fémur, el hueso del muslo, es el más largo del cuerpo."),
    C("¿Qué protege el cráneo?", "El cerebro", ["El estómago", "Los pulmones"], "El cráneo es como un casco de hueso que protege el cerebro."),
    C("¿Qué protegen las costillas?", "El corazón y los pulmones", ["El cerebro", "Los pies"], "Las costillas forman una jaula que protege el corazón y los pulmones."),
    C("¿Cómo se llaman las partes donde se unen dos huesos, como el codo y la rodilla?", "Articulaciones", ["Venas", "Nervios"], "En las articulaciones se unen dos huesos, y por eso podemos doblar el codo y la rodilla."),
    C("¿Qué ayuda a tener huesos fuertes?", "Comer bien, tomar leche y hacer ejercicio", ["Tomar muchos refrescos", "No salir nunca de la casa"], "El calcio de la leche y otros alimentos, y el ejercicio, ayudan a tener huesos fuertes."),
  ],
  nervioso: [
    C("¿Qué es un reflejo?", "Una respuesta rápida del cuerpo, sin pensarla", ["Un hueso de la mano", "Un sonido muy fuerte"], "Por ejemplo, quitar la mano rápido de algo caliente: el cuerpo responde antes de que lo pensemos."),
    C("¿Qué huesos protegen la médula espinal?", "La columna vertebral", ["El cráneo", "El fémur"], "La médula espinal baja por dentro de la columna vertebral, que la protege."),
    C("¿Con qué órgano resolvés un problema de mate?", "Con el cerebro", ["Con el estómago", "Con los riñones"], "El cerebro piensa, recuerda y resuelve problemas."),
    C("¿Cómo cuidás tu sistema nervioso?", "Durmiendo bien y usando casco en la bici", ["Durmiendo muy poco", "Viendo pantallas hasta muy tarde"], "Dormir deja descansar al cerebro, y el casco lo protege si nos caemos."),
    C("¿Qué lleva las órdenes del cerebro a los músculos?", "Los nervios", ["Las venas", "Los huesos"], "Los nervios son como cables que llevan los mensajes del cerebro a todo el cuerpo."),
  ],
  excretor: [
    C("¿Por qué hay que tomar agua?", "Para que los riñones trabajen bien", ["Para que los huesos se doblen", "Para no tener que respirar"], "Con suficiente agua, los riñones pueden limpiar bien la sangre."),
    C("Además de los riñones, ¿qué parte saca agua y desechos con el sudor?", "La piel", ["El cráneo", "El fémur"], "Cuando sudamos, la piel saca agua y un poquito de desechos del cuerpo."),
    C("¿Qué limpian los riñones?", "La sangre", ["El aire", "La comida"], "Los riñones filtran la sangre y sacan lo que el cuerpo no necesita en la orina."),
    C("¿Cuántos riñones tenemos?", "Dos", ["Uno", "Cuatro"], "Tenemos dos riñones, uno a cada lado, en la parte de atrás de la cintura."),
  ],
};

// ---------- El dibujo ----------
const LINEA = "#1F3A5F", PIEL = "#F6CDA8", PIEL_CLARA = "#FBE6D4", HUESO = "#F3EBD3";
// Qué parte del dibujo se ve en cada sistema (x, y, ancho, alto): así los órganos se ven más grandes
export const VISTAS = {
  externo: "0 6 200 370", digestivo: "48 20 104 210", respiratorio: "48 20 104 175", circulatorio: "20 8 160 356",
  oseo: "30 6 140 300", nervioso: "16 6 168 356", excretor: "44 120 112 116",
};

/** Un grupo que se puede tocar: el dibujo y, si hace falta, un área invisible más grande para el dedo. */
const TOCABLE = `role="button" tabindex="0"`;
const parte = (id, dib, toque = "") => `<g class="parte" data-parte="${id}" ${TOCABLE} aria-label="${PARTES[id].n}">${toque}${dib}</g>`;
const toqueLinea = d => `<path d="${d}" fill="none" stroke="transparent" stroke-width="16" stroke-linecap="round"/>`;

function base(sistema) {
  const fuera = sistema === "externo", piel = fuera ? PIEL : PIEL_CLARA, s = `stroke="${LINEA}" stroke-width="3"`;
  const g = (id, dib) => (fuera ? parte(id, dib) : dib);
  const cara = `<circle cx="88" cy="52" r="3.6" fill="${LINEA}"/><circle cx="112" cy="52" r="3.6" fill="${LINEA}"/>`
    + (sistema === "respiratorio" ? "" : `<path d="M100 56 Q96 62 100 63" fill="none" stroke="${LINEA}" stroke-width="2"/>`)
    + (sistema === "digestivo" ? "" : `<path d="M91 69 Q100 76 109 69" fill="none" ${s} stroke-linecap="round"/>`);
  const pelo = `<path d="M67 46 Q65 13 100 12 Q135 13 133 46 Q127 30 113 27 Q101 35 86 27 Q72 30 67 46 Z" fill="#5D3A1A" stroke="${LINEA}" stroke-width="2.5"/>`;
  // Con los órganos, el cuerpo es solo el fondo: no se toca
  return `<g class="base"${fuera ? "" : ` pointer-events="none"`}>
    ${g("piernas", `<rect x="68" y="220" width="28" height="134" rx="14" fill="${piel}" ${s}/><rect x="104" y="220" width="28" height="134" rx="14" fill="${piel}" ${s}/>`)}
    ${g("pies", `<ellipse cx="80" cy="360" rx="20" ry="9" fill="${fuera ? "#E8574A" : piel}" ${s}/><ellipse cx="124" cy="360" rx="20" ry="9" fill="${fuera ? "#E8574A" : piel}" ${s}/>`)}
    ${g("brazos", `<rect x="36" y="100" width="24" height="112" rx="12" fill="${piel}" ${s}/><rect x="140" y="100" width="24" height="112" rx="12" fill="${piel}" ${s}/>`
      + (fuera ? `<rect x="36" y="100" width="24" height="36" rx="12" fill="#FFC83D" ${s}/><rect x="140" y="100" width="24" height="36" rx="12" fill="#FFC83D" ${s}/>` : ""))}
    ${g("manos", `<circle cx="48" cy="222" r="13" fill="${piel}" ${s}/><circle cx="152" cy="222" r="13" fill="${piel}" ${s}/>`)}
    ${g("cuello", `<rect x="88" y="76" width="24" height="24" fill="${piel}" ${s}/>`)}
    ${g("tronco", `<rect x="58" y="94" width="84" height="140" rx="26" fill="${fuera ? "#FFC83D" : piel}" ${s} ${fuera ? "" : `fill-opacity=".9"`}/>`
      + `<path d="M58 206 H142 V240 Q142 250 132 252 H106 L100 240 L94 252 H68 Q58 250 58 240 Z" fill="#7FB3E8" stroke="${LINEA}" stroke-width="2.5"/>`)}
    ${g("cabeza", `<circle cx="66" cy="52" r="8" fill="${piel}" ${s}/><circle cx="134" cy="52" r="8" fill="${piel}" ${s}/>`
      + `<circle cx="100" cy="48" r="34" fill="${piel}" ${s}/>${pelo}${cara}`)}
    ${fuera ? parte("cuello", `<rect x="84" y="78" width="32" height="18" fill="transparent"/>`) /* el cuello se ve poquito: área más grande para el dedo */ : ""}
  </g>`;
}

function organos(sistema) {
  const s = `stroke="${LINEA}" stroke-width="2.5"`;
  switch (sistema) {
    case "digestivo": return [
      parte("grueso", `<path d="M74 222 V182 Q74 172 84 172 H116 Q126 172 126 182 V222" fill="none" stroke="${LINEA}" stroke-width="13" stroke-linecap="round"/><path d="M74 222 V182 Q74 172 84 172 H116 Q126 172 126 182 V222" fill="none" stroke="#C98552" stroke-width="8" stroke-linecap="round"/>`,
        toqueLinea("M74 222 V182 Q74 172 84 172 H116 Q126 172 126 182 V222")),
      parte("delgado", `<path d="M87 186 Q100 180 113 186 Q100 192 87 194 Q100 198 113 202 Q100 208 87 210 Q100 216 113 216" fill="none" stroke="${LINEA}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M87 186 Q100 180 113 186 Q100 192 87 194 Q100 198 113 202 Q100 208 87 210 Q100 216 113 216" fill="none" stroke="#F7A1B5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
        `<rect x="84" y="182" width="32" height="38" fill="transparent"/>`),
      parte("esofago", `<rect x="95" y="74" width="10" height="64" rx="5" fill="#F4A38C" ${s}/>`, `<rect x="90" y="74" width="20" height="62" fill="transparent"/>`),
      parte("estomago", `<ellipse cx="117" cy="148" rx="19" ry="13" transform="rotate(-25 117 148)" fill="#F2A65A" ${s}/>`),
      parte("boca", `<ellipse cx="100" cy="70" rx="10" ry="5.5" fill="#E53935" ${s}/>`, `<circle cx="100" cy="70" r="12" fill="transparent"/>`),
    ].join("");
    case "respiratorio": return [
      parte("diafragma", `<path d="M60 184 Q100 162 140 184 L140 192 Q100 170 60 192 Z" fill="#D9731F" ${s}/>`, toqueLinea("M62 188 Q100 166 138 188")),
      `<path d="M100 116 L84 128 M100 116 L116 128" stroke="#7CC4E8" stroke-width="6" stroke-linecap="round"/>`,
      parte("pulmones", `<ellipse cx="80" cy="144" rx="18" ry="30" fill="#F48FB1" ${s}/><ellipse cx="120" cy="144" rx="18" ry="30" fill="#F48FB1" ${s}/>`),
      parte("traquea", `<rect x="95" y="74" width="10" height="44" rx="4" fill="#9FD8F2" ${s}/><path d="M95 84 H105 M95 94 H105 M95 104 H105" stroke="${LINEA}" stroke-width="1.5"/>`,
        `<rect x="90" y="74" width="20" height="42" fill="transparent"/>`),
      parte("nariz", `<ellipse cx="100" cy="60" rx="6.5" ry="5.5" fill="#F28B82" ${s}/>`, `<circle cx="100" cy="60" r="12" fill="transparent"/>`),
    ].join("");
    case "circulatorio": {
      // Arterias en rojo, venas en azul (así se dibujan en los libros)
      const art = ["M102 124 V92 L104 80 V64", "M100 128 Q76 114 54 120 V212", "M116 128 Q126 114 146 120 V212", "M104 146 V200 Q92 212 90 232 V350", "M112 146 V200 Q116 212 116 232 V350"];
      const ven = ["M96 64 V82 L98 96 V122", "M42 212 V124 Q70 112 98 130", "M158 212 V124 Q132 112 118 132", "M78 350 V232 Q80 210 98 198 V150", "M128 350 V232 Q126 210 116 198 V150"];
      const lineas = (ds, color) => ds.map(d => `<path d="${d}" fill="none" stroke="${LINEA}" stroke-width="6.5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`).join("");
      return parte("venas", lineas(ven, "#1E6FD9"), ven.map(toqueLinea).join(""))
        + parte("arterias", lineas(art, "#E53935"), art.map(toqueLinea).join(""))
        + parte("corazon", `<path d="M108 148 C95 138 90 129 94 122 C98 116 106 117 108 124 C110 117 118 116 122 122 C126 129 121 138 108 148 Z" fill="#D9443A" ${s}/>`,
          `<circle cx="108" cy="132" r="16" fill="transparent"/>`);
    }
    case "oseo": {
      const hueso = `fill="${HUESO}" ${s}`;
      const costilla = [0, 1, 2, 3].map(i => { const y = 110 + i * 14; return `M96 ${y} Q72 ${y - 4} 68 ${y + 16} M104 ${y} Q128 ${y - 4} 132 ${y + 16}`; }).join(" ");
      return `<path d="M70 216 Q100 232 130 216 L126 230 Q100 244 74 230 Z" ${hueso}/>`
        + parte("costillas", `<path d="${costilla}" fill="none" stroke="${LINEA}" stroke-width="7" stroke-linecap="round"/><path d="${costilla}" fill="none" stroke="${HUESO}" stroke-width="3.5" stroke-linecap="round"/>`,
          `<rect x="64" y="104" width="72" height="66" fill="transparent"/>`)
        + parte("columna", Array.from({ length: 12 }, (_, i) => `<rect x="94" y="${96 + i * 11}" width="12" height="9" rx="3" ${hueso}/>`).join(""),
          `<rect x="91" y="94" width="18" height="134" fill="transparent"/>`)
        + parte("femur", [81, 119].map(x => `<rect x="${x - 5}" y="240" width="10" height="56" rx="5" ${hueso}/><circle cx="${x}" cy="240" r="6.5" ${hueso}/><circle cx="${x}" cy="296" r="6.5" ${hueso}/>`).join(""),
          `<rect x="70" y="232" width="22" height="72" fill="transparent"/><rect x="108" y="232" width="22" height="72" fill="transparent"/>`)
        + parte("craneo", `<path d="M72 50 Q72 16 100 16 Q128 16 128 50 Q128 66 116 70 V80 H84 V70 Q72 66 72 50 Z" ${hueso}/><ellipse cx="89" cy="48" rx="6" ry="7" fill="#C9BFA3"/><ellipse cx="111" cy="48" rx="6" ry="7" fill="#C9BFA3"/><path d="M98 60 L100 56 L102 60 Z" fill="#C9BFA3"/>`);
    }
    case "nervioso": {
      const ramas = ["M97 112 Q70 110 50 122 V214", "M103 112 Q130 110 150 122 V214", "M97 226 Q84 236 82 250 V350", "M103 226 Q116 236 118 250 V350", "M97 152 Q80 150 68 162", "M103 152 Q120 150 132 162", "M97 190 Q82 190 72 200", "M103 190 Q118 190 128 200"];
      return parte("nervios", ramas.map(d => `<path d="${d}" fill="none" stroke="${LINEA}" stroke-width="5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#FFD54F" stroke-width="2.5" stroke-linecap="round"/>`).join(""),
          ramas.map(toqueLinea).join(""))
        + parte("medula", `<rect x="96" y="48" width="8" height="182" rx="4" fill="#FFD54F" ${s}/>`, `<rect x="92" y="48" width="16" height="182" fill="transparent"/>`)
        + parte("cerebro", `<ellipse cx="100" cy="34" rx="25" ry="17" fill="#F7B2C4" ${s}/><path d="M84 30 Q90 24 96 30 Q102 36 108 28 Q114 22 118 32 M86 40 Q94 36 100 42 Q108 46 114 40" fill="none" stroke="#C2185B" stroke-width="1.8"/>`);
    }
    case "excretor": return `<path d="M88 184 L97 214 M112 184 L103 214" stroke="${LINEA}" stroke-width="5" stroke-linecap="round"/><path d="M88 184 L97 214 M112 184 L103 214" stroke="#FFE082" stroke-width="2.5" stroke-linecap="round"/>`
      + parte("rinones", `<path d="M76 156 Q90 154 90 168 Q84 172 88 182 Q86 190 78 188 Q68 184 68 170 Q68 158 76 156 Z" fill="#A1503B" ${s}/><path d="M124 156 Q110 154 110 168 Q116 172 112 182 Q114 190 122 188 Q132 184 132 170 Q132 158 124 156 Z" fill="#A1503B" ${s}/>`)
      + parte("vejiga", `<ellipse cx="100" cy="222" rx="13" ry="10" fill="#FFE082" ${s}/>`, `<circle cx="100" cy="222" r="15" fill="transparent"/>`);
    default: return "";
  }
}

/**
 * El dibujo del cuerpo con las partes del sistema.
 * tocable: las partes son botones (se enfocan con Tab); si no, el dibujo es solo una imagen.
 */
export function dibujo(sistema, { tocable = true } = {}) {
  const partes = base(sistema) + organos(sistema);
  return tocable
    ? `<svg viewBox="${VISTAS[sistema]}" role="group" aria-label="Dibujo del cuerpo: ${SISTEMAS[sistema].n}">${partes}</svg>`
    : `<svg viewBox="${VISTAS[sistema]}" role="img" aria-label="Dibujo del cuerpo: ${SISTEMAS[sistema].n}">${partes.split(` ${TOCABLE}`).join("")}</svg>`;
}

// ---------- Generadores ----------
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

/** Tocar una parte por su nombre. */
export function tocar(sistema, rnd = Math.random) {
  const partes = partesDe(sistema), meta = azar(partes, rnd), p = PARTES[meta];
  return { tipo: "tocar", sistema, meta, partes,
    html: `<span class="big">${SISTEMAS[sistema].e}</span> Tocá <b>${p.n}</b>`, voz: `Tocá ${p.n}.`,
    bien: p.dato || `${cap(p.n)} ${p.f}.` };
}

/** Tocar una parte por lo que hace (sin decir el nombre). */
export function tocarPorFuncion(sistema, rnd = Math.random) {
  const partes = partesDe(sistema), meta = azar(partes, rnd), p = PARTES[meta];
  return { tipo: "tocar", porFuncion: true, sistema, meta, partes, html: `<span class="big">🔎</span> ${p.pide}`, voz: p.pide,
    bien: `${eseEs(p.n)}: ${p.f}.` };
}

// La voz lee el texto sin etiquetas: se copia letra por letra, saltando lo que va entre < y >
export function sinEtiquetas(t) {
  let s = "", dentro = false;
  for (const c of String(t)) {
    if (c === "<") dentro = true;
    else if (c === ">") dentro = false;
    else if (!dentro) s += c;
  }
  return s;
}
const opcion = (id, html, por) => ({ id, html, voz: sinEtiquetas(html), por });

/** ¿Para qué sirve? Las opciones malas son de otros sistemas, para que no haya dos respuestas parecidas. */
export function sirve(sistema, rnd = Math.random) {
  const meta = azar(partesDe(sistema), rnd), p = PARTES[meta];
  const otros = barajar(Object.keys(PARTES).filter(id => PARTES[id].f && PARTES[id].s !== sistema), rnd);
  const malos = [];
  for (const id of otros) if (malos.length < 2 && !malos.some(m => PARTES[m].s === PARTES[id].s)) malos.push(id);
  const opciones = barajar([meta, ...malos], rnd).map(id => opcion(id, cap(PARTES[id].f) + ".", id === meta ? "" : `Eso lo ${plural(PARTES[id].n) ? "hacen" : "hace"} ${PARTES[id].n}.`));
  return { tipo: "opciones", ver: { sistema, marcar: meta }, opciones, correcta: meta, cols: 1,
    html: `<span class="big">${SISTEMAS[sistema].e}</span> ¿Para qué sirve <b>${p.n}</b>?`, voz: `¿Para qué sirve ${p.n}?`,
    bien: `${cap(p.n)} ${p.f}.` };
}

/** ¿De qué sistema es? */
export function sistemaDe(rnd = Math.random) {
  const s = azar(ORGANICOS, rnd), meta = azar(partesDe(s), rnd), p = PARTES[meta];
  const opciones = barajar([s, ...barajar(ORGANICOS.filter(x => x !== s), rnd).slice(0, 3)], rnd)
    .map(id => opcion(id, `${SISTEMAS[id].e} ${cap(SISTEMAS[id].n.replace("el sistema ", ""))}`, id === s ? "" : `${cap(SISTEMAS[id].n)} ${SISTEMAS[id].que}.`));
  return { tipo: "opciones", opciones, correcta: s, cols: 2,
    html: `<span class="big">🧩</span> ¿De qué sistema es <b>${p.n}</b>?`, voz: `¿De qué sistema es ${p.n}?`,
    bien: `${cap(p.n)} ${plural(p.n) ? "son" : "es"} ${de(SISTEMAS[s].n)}, que ${SISTEMAS[s].que}.` };
}

/** Pregunta de conceptos de un tema. */
export function concepto(tema, rnd = Math.random) {
  const c = azar(CONCEPTOS[tema], rnd);
  const opciones = barajar([["si", c.si], ...c.no.map((t, i) => [`no${i}`, t])], rnd).map(([id, t]) => opcion(id, cap(t), id === "si" ? "" : c.por));
  return { tipo: "opciones", opciones, correcta: "si", cols: 1, html: `<span class="big">${SISTEMAS[tema].e}</span> ${c.p}`, voz: c.p, bien: c.por };
}

/** Ordenar un recorrido. */
export function ordenar(id) {
  const r = RECORRIDOS[id];
  return { tipo: "ordenar", recorrido: id, pasos: r.pasos.map((t, i) => ({ id: `p${i}`, html: t })), html: r.html, voz: r.voz, bien: r.bien };
}

/** Sentidos: ¿con qué olemos? (opciones con los órganos) */
export function sentidoOrgano(rnd = Math.random) {
  const s = azar(SENTIDOS, rnd);
  const opciones = barajar([s, ...barajar(SENTIDOS.filter(x => x !== s), rnd).slice(0, 2)], rnd)
    .map(x => opcion(x.id, `<b>${x.e}</b>${cap(x.organo)}`, x === s ? "" : `Con ${x.organo} ${x.hace}.`));
  return { tipo: "opciones", opciones, correcta: s.id, html: `<span class="big">🤔</span> ${s.pregunta}`, voz: s.pregunta,
    bien: `Con ${s.organo} ${s.hace}: es el sentido ${de(s.n)}.` };
}

/** Sentidos: ¿qué sentido usás para…? */
export function sentidoUso(rnd = Math.random) {
  const s = azar(SENTIDOS, rnd), uso = azar(s.usos, rnd);
  const opciones = barajar([s, ...barajar(SENTIDOS.filter(x => x !== s), rnd).slice(0, 3)], rnd)
    .map(x => opcion(x.id, `<b>${x.e}</b>${cap(x.n.replace(/^(el|la) /, ""))}`, x === s ? "" : `Con ${x.n} ${x.hace}, usando ${x.organo}.`));
  return { tipo: "opciones", opciones, correcta: s.id, cols: 2, html: `<span class="big">🤔</span> ¿Qué sentido usás para ${uso}?`,
    voz: `¿Qué sentido usás para ${uso}?`, bien: `Para ${uso} usamos ${s.n}, con ${s.organo}.` };
}

/** Hábitos: ¿esto cuida tu cuerpo? */
export function habitoSiNo(rnd = Math.random) {
  const h = azar(HABITOS, rnd);
  const opciones = [opcion("si", "<b>👍</b>Sí, lo cuida", h.por), opcion("no", "<b>👎</b>No lo cuida", h.por)];
  return { tipo: "opciones", opciones, correcta: h.si ? "si" : "no", html: `<span class="big">🥦</span> ¿Esto cuida tu cuerpo?<br><b>«${h.t}»</b>`,
    voz: `¿Esto cuida tu cuerpo? ${h.t}.`, bien: h.por };
}

/** Hábitos: ¿cuál sí cuida tu cuerpo? (o ¿cuál no?) */
export function habitoCual(rnd = Math.random) {
  const no = rnd() < 0.4, buenos = barajar(HABITOS.filter(h => h.si), rnd), malos = barajar(HABITOS.filter(h => !h.si), rnd);
  const meta = no ? malos[0] : buenos[0], resto = no ? buenos.slice(0, 2) : malos.slice(0, 2);
  const opciones = barajar([meta, ...resto], rnd).map((h, i) => opcion(h === meta ? "meta" : `x${i}`, h.t, h === meta ? "" : h.por));
  const p = no ? "¿Cuál NO cuida tu cuerpo?" : "¿Cuál cuida tu cuerpo?";
  return { tipo: "opciones", opciones, correcta: "meta", cols: 1, html: `<span class="big">🥦</span> ${p}`, voz: p, bien: meta.por };
}

// ---------- 🪜 Escalones (de 1° a 6°) ----------
// tipos: generadores que se van turnando al azar dentro del escalón
export const ESCALONES = [
  { nombre: "Partes del cuerpo", tipos: [r => tocar("externo", r)] },                                                // 1. tocar cabeza, brazos, pies…
  { nombre: "Los sentidos", tipos: [sentidoOrgano] },                                                                // 2. ¿con qué olemos?
  { nombre: "Sentidos y partes", tipos: [sentidoUso, r => concepto("externo", r)] },                                 // 3. ¿qué sentido usás para…? y extremidades
  { nombre: "Sistema digestivo: ¿dónde está?", tipos: [r => tocar("digestivo", r)] },                                // 4. tocar los órganos
  { nombre: "Sistema digestivo", tipos: [r => sirve("digestivo", r), () => ordenar("comida"), r => concepto("digestivo", r)] }, // 5. para qué sirve y el viaje de la comida
  { nombre: "Sistema respiratorio", tipos: [r => tocar("respiratorio", r), r => sirve("respiratorio", r), () => ordenar("aire"), r => concepto("respiratorio", r)] }, // 6
  { nombre: "Sistema circulatorio", tipos: [r => tocar("circulatorio", r), r => sirve("circulatorio", r), () => ordenar("sangre"), r => concepto("circulatorio", r)] }, // 7
  { nombre: "Hábitos saludables", tipos: [habitoSiNo, habitoCual] },                                                 // 8. qué cuida el cuerpo y por qué
  { nombre: "Huesos y músculos", tipos: [r => tocar("oseo", r), r => sirve("oseo", r), r => concepto("oseo", r)] },  // 9
  { nombre: "Sistema nervioso", tipos: [r => tocar("nervioso", r), r => sirve("nervioso", r), () => ordenar("mensaje"), r => concepto("nervioso", r)] }, // 10
  { nombre: "Sistema excretor", tipos: [r => tocar("excretor", r), r => sirve("excretor", r), () => ordenar("orina"), r => concepto("excretor", r)] }, // 11
  { nombre: "¿Qué parte hace esto?", tipos: [r => tocarPorFuncion(azar(ORGANICOS, r), r)] },                          // 12. tocar por lo que hace, sin el nombre
  { nombre: "Todo el cuerpo", tipos: [sistemaDe, r => tocarPorFuncion(azar(ORGANICOS, r), r), r => ordenar(azar(Object.keys(RECORRIDOS), r)), r => concepto(azar(ORGANICOS, r), r)] }, // 13. de qué sistema es, y mezcla
];

/** Escalón inicial según la edad (7 años → el primero). */
export const inicio = edad => (edad === null || edad <= 7 ? 0 : edad === 8 ? 1 : edad === 9 ? 3 : edad === 10 ? 4 : edad === 11 ? 6 : 7);

// Temas para escoger a mano (papá o maestra)
export const TEMAS = [
  { id: "sentidos", nombre: "👀 Sentidos", tipos: [sentidoOrgano, sentidoUso] },
  { id: "partes", nombre: "🧍 Partes", tipos: [r => tocar("externo", r), r => concepto("externo", r)] },
  ...ORGANICOS.map(s => ({ id: s, nombre: `${SISTEMAS[s].e} ${cap(SISTEMAS[s].n.replace("el sistema ", ""))}`,
    tipos: [r => tocar(s, r), r => sirve(s, r), r => concepto(s, r), ...Object.keys(RECORRIDOS).filter(k => RECORRIDOS[k].sistema === s).map(k => () => ordenar(k))] })),
  { id: "habitos", nombre: "🥦 Hábitos", tipos: [habitoSiNo, habitoCual] },
  { id: "todo", nombre: "🧩 Todo", tipos: ESCALONES[ESCALONES.length - 1].tipos },
];

/** Una pregunta de una lista de tipos. */
export const generar = (tipos, rnd = Math.random) => azar(tipos, rnd)(rnd);

/** Revisa una pregunta. Devuelve una lista de problemas (vacía = bien). Para las pruebas. */
export function revisarPregunta(q) {
  const mal = [];
  if (!q.html || !q.voz || !q.bien) mal.push("falta texto");
  if (q.tipo === "tocar") {
    if (!q.partes.includes(q.meta)) mal.push(`${q.meta} no está entre las partes`);
    const svg = dibujo(q.sistema);
    q.partes.forEach(id => { if (!svg.includes(`data-parte="${id}"`)) mal.push(`${id} no está en el dibujo de ${q.sistema}`); });
    const sobran = [...svg.matchAll(/data-parte="([^"]+)"/g)].map(m => m[1]).filter(id => !q.partes.includes(id));
    if (sobran.length) mal.push(`en el dibujo sobran ${sobran.join(", ")}`);
  } else if (q.tipo === "opciones") {
    const ids = q.opciones.map(o => o.id), textos = q.opciones.map(o => o.voz);
    if (new Set(ids).size !== ids.length) mal.push("ids repetidos");
    if (new Set(textos).size !== textos.length) mal.push("opciones repetidas");
    if (!ids.includes(q.correcta)) mal.push("la correcta no está");
    if (ids.length < 2 || ids.length > 4) mal.push(`${ids.length} opciones`);
    q.opciones.forEach(o => { if (o.id !== q.correcta && !o.por) mal.push(`la opción ${o.voz} no explica por qué no`); });
    if (q.ver && !partesDe(q.ver.sistema).includes(q.ver.marcar)) mal.push("lo marcado no está en el dibujo");
  } else if (q.tipo === "ordenar") {
    if (q.pasos.length < 3) mal.push("muy pocos pasos");
    if (new Set(q.pasos.map(p => p.html)).size !== q.pasos.length) mal.push("pasos repetidos");
  } else mal.push(`tipo ${q.tipo}`);
  return mal;
}
