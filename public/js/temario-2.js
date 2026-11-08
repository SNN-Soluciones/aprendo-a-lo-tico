// 📋 Temas del temario de las segundas pruebas de 2° (noviembre): Español, Ciencias y Estudios Sociales.
// Cada tema es { id, nombre, emoji, grados, pregunta(r) } como los de js/examen-temas.js, que los suma a sus listas.
// Las preguntas salen de bancos escritos a mano (con su explicación) y de generadores (diptongo, hiato, rimas…).
import { SITUACIONES } from "./estados.js";

// ---------- Ayudas ----------
const elegir = (arr, r) => arr[Math.floor(r() * arr.length)];
function barajar(arr, r) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function opciones(correcta, otras, r, n) {
  const unicas = [...new Set(otras.map(String))].filter(o => o !== String(correcta));
  return barajar([String(correcta), ...barajar(unicas, r).slice(0, n - 1)], r);
}
const opc = (texto, correcta, otras, explica, r, n = 3, extra = {}) =>
  ({ texto, tipo: "opcion", opciones: opciones(correcta, otras, r, n), correcta: String(correcta), explica, ...extra });
/** Banco de preguntas: [pregunta, correcta, [otras], explicación]. */
const deBanco = (banco, n = 3) => r => { const [t, bien, otras, explica] = elegir(banco, r); return opc(t, bien, otras, explica, r, n); };
/** Elige al azar entre varias maneras de preguntar (cada una con su peso). */
const mezcla = (...formas) => r => {
  const total = formas.reduce((s, [p]) => s + p, 0);
  let x = r() * total;
  for (const [p, f] of formas) { if ((x -= p) < 0) return f(r); }
  return formas[0][1](r);
};

// =====================================================================
// ✏️ ESPAÑOL · lunes 9 de noviembre
// =====================================================================

// ---------- Diptongo e hiato ----------
// Las palabras van separadas en sílabas. Cada una tiene un solo par de vocales juntas.
const DIPTONGOS = ["pei-ne", "ai-re", "cie-lo", "nue-ve", "hue-vo", "jau-la", "rei-na", "pia-no", "a-gua", "bue-no", "tie-rra", "puer-ta",
  "llu-via", "ciu-dad", "rui-do", "au-to", "nie-ve", "sie-te", "cua-tro", "fue-go", "jue-go", "hie-lo", "ca-mión", "a-vión", "can-ción",
  "ra-dio", "fe-ria", "pa-tio", "sua-ve", "rue-da", "pue-blo", "nie-to", "hue-so", "dien-te", "vio-lín", "cuen-to", "jue-ves", "pie", "miel", "seis"];
const HIATOS = ["rí-o", "dí-a", "tí-a", "frí-o", "ma-íz", "pa-ís", "ba-úl", "o-í-do", "le-ón", "po-e-ta", "te-a-tro", "ca-no-a", "co-a-la",
  "ma-es-tra", "o-cé-a-no", "co-rre-o", "pe-le-a", "ro-de-o", "mu-se-o", "le-er", "ca-er", "cre-er", "san-dí-a", "pul-pe-rí-a", "ra-íz",
  "hé-ro-e", "fe-o", "pa-se-o", "tra-e", "ca-fe-te-rí-a"];
// Palabras sin vocales juntas (para que no todas las opciones tengan diptongo o hiato)
const SIN_PAR = ["ca-sa", "pe-rro", "me-sa", "ga-to", "lá-piz", "pe-lo-ta", "za-pa-to", "ma-no", "lu-na", "so-pa"];

const VOCAL = "aeiouáéíóú", ABIERTA = "aeoáéó", CERRADA_TILDE = "íú";
const junta = s => s.replace(/-/g, "");
const par = s => junta(s).match(/[aeiouáéíóú]{2}/)[0];
const silabas = s => s.split("-").length;
const sil = n => (n === 1 ? "1 sílaba" : `${n} sílabas`);
function porQueDiptongo(s) {
  const p = par(s), dos = [...p].every(v => !ABIERTA.includes(v));
  return `«${s}»: la «${p[0]}» y la «${p[1]}» van juntas en la misma sílaba. Es un <b>diptongo</b> (${dos ? "dos vocales cerradas, i y u" : "una vocal abierta (a, e, o) con una cerrada (i, u) sin tilde"}).`;
}
function porQueHiato(s) {
  const p = par(s), tilde = [...p].some(v => CERRADA_TILDE.includes(v));
  return `«${s}»: la «${p[0]}» y la «${p[1]}» quedan en sílabas distintas. Es un <b>hiato</b> (${tilde ? "la i o la u lleva tilde y se separa" : "dos vocales abiertas: a, e, o"}).`;
}
/** Separación equivocada: el diptongo partido (nu-e-ve) o el hiato pegado (río). */
const malSeparada = (s, esDip) => esDip
  ? s.replace(new RegExp(`([${VOCAL}])([${VOCAL}])`), "$1-$2")
  : s.replace(new RegExp(`([${VOCAL}])-([${VOCAL}])`), "$1$2");

const CONCEPTO_DH = [
  ["¿Qué es un diptongo?", "Dos vocales juntas que se pronuncian en la misma sílaba", ["Dos vocales juntas que se separan en sílabas distintas", "Dos consonantes juntas", "Una palabra con tilde"],
    "Diptongo: dos vocales seguidas que suenan juntas en una sola sílaba, como en «pei-ne» o «nue-ve»."],
  ["¿Qué es un hiato?", "Dos vocales juntas que se separan en sílabas distintas", ["Dos vocales juntas en la misma sílaba", "Una sílaba con tres letras", "Dos consonantes juntas"],
    "Hiato: dos vocales seguidas que quedan en sílabas diferentes, como en «rí-o» o «po-e-ta»."],
  ["¿Cuáles son las vocales abiertas (o fuertes)?", "a, e, o", ["i, u", "a, i, u", "e, i, o"], "Las abiertas son a, e, o (abrimos más la boca). Las cerradas son i, u."],
  ["¿Cuáles son las vocales cerradas (o débiles)?", "i, u", ["a, e, o", "a, u", "e, i"], "Las cerradas son i, u. Las abiertas son a, e, o."],
  ["Dos vocales abiertas juntas (como «ea» en «pe-le-a») forman…", "un hiato", ["un diptongo", "una sola sílaba"], "Dos abiertas (a, e, o) siempre se separan: hiato. «pe-le-a», «po-e-ta»."],
  ["Una vocal abierta y una cerrada sin tilde (como «ue» en «hue-vo») forman…", "un diptongo", ["un hiato", "dos sílabas"], "Abierta + cerrada sin tilde van juntas: diptongo. «hue-vo», «pei-ne»."],
  ["Si la i o la u llevan tilde junto a otra vocal (como en «rí-o»), forman…", "un hiato", ["un diptongo", "una sílaba"], "La tilde en la í o la ú las separa: hiato. «dí-a», «ba-úl», «ma-íz»."],
  ["Dos vocales cerradas juntas (como «iu» en «ciu-dad») forman…", "un diptongo", ["un hiato", "dos sílabas"], "i + u o u + i van juntas: diptongo. «ciu-dad», «rui-do»."],
];

function preguntaDipHiato(r, foco) {
  const tipo = elegir(["tiene", "tiene", "cual", "cual", "separa", "separa", "silabas", "concepto", ...(foco === "dip" ? ["vocales"] : [])], r);
  if (tipo === "concepto") { const [t, b, o, e] = elegir(CONCEPTO_DH, r); return opc(t, b, o, e, r, Math.min(3, o.length + 1)); }
  const esDip = foco === "dip" ? r() < 0.8 : r() < 0.2;
  const s = elegir(esDip ? DIPTONGOS : HIATOS, r), w = junta(s), porQue = esDip ? porQueDiptongo(s) : porQueHiato(s);
  if (tipo === "cual") {
    // ¿Cuál palabra tiene diptongo / hiato? Una correcta, las otras del otro tipo o sin vocales juntas
    const busca = foco === "dip" ? "diptongo" : "hiato", bien = elegir(foco === "dip" ? DIPTONGOS : HIATOS, r);
    const malas = [...barajar(foco === "dip" ? HIATOS : DIPTONGOS, r).slice(0, 2), elegir(SIN_PAR, r)].map(junta);
    return opc(`¿Cuál palabra tiene <b>${busca}</b>?`, junta(bien), malas, foco === "dip" ? porQueDiptongo(bien) : porQueHiato(bien), r, 3);
  }
  if (tipo === "separa") {
    const mal = malSeparada(s, esDip);
    return opc(`¿Cómo se separa en sílabas la palabra «${w}»?`, s, [mal], porQue, r, 2);
  }
  if (tipo === "silabas") return { texto: `¿Cuántas sílabas tiene «${w}»? (Aplaudí cada sílaba)`, tipo: "numero", correcta: String(silabas(s)), explica: `${porQue} Por eso tiene ${sil(silabas(s))}: ${s}.` };
  if (tipo === "vocales") {
    const p = par(s), otras = [...new Set(DIPTONGOS.map(par))].filter(x => x !== p);
    return opc(`En «${w}», ¿qué vocales forman el diptongo?`, p, otras, porQue, r, 3);
  }
  return opc(`¿La palabra «${s}» tiene diptongo o hiato?`, esDip ? "Diptongo" : "Hiato", [esDip ? "Hiato" : "Diptongo"], porQue, r, 2);
}
// En «¿tiene diptongo o hiato?» se muestra separada en sílabas para que se vea; las demás formas la muestran junta.

// ---------- Lectura apreciativa: tipos de textos y relación entre el título y el contenido ----------
const TEXTOS = [
  { tipo: "cuento", titulo: "El perezoso que quería ver el mar", otros: ["La receta del gallo pinto", "Los volcanes de Costa Rica"],
    t: "Había una vez un perezoso que vivía en un árbol de Belén. Un día escuchó a una lapa hablar del mar y decidió ir a conocerlo. Caminó despacito durante muchos días, hasta que por fin sintió la arena tibia en sus patas. —¡Valió la pena! —dijo, y se quedó mirando las olas.",
    trata: "Un perezoso que viaja despacito para conocer el mar", malas: ["Cómo se prepara un batido", "Una noticia sobre la lluvia"],
    por: "Es un <b>cuento</b>: empieza con «Había una vez», tiene personajes (el perezoso, la lapa), un problema y un final." },
  { tipo: "poema", titulo: "Lluvia en el cafetal", otros: ["El partido de fútbol", "Cómo lavarse las manos"],
    t: "Llueve en el cafetal,<br>las hojas bailan sin parar,<br>el yigüirro quiere cantar<br>y la tierra huele a pan.",
    trata: "La lluvia que cae en un cafetal", malas: ["Un perro que se perdió", "Las reglas de un juego"],
    por: "Es un <b>poema</b>: está escrito en versos (renglones cortos), tiene rima (parar, cantar) y habla de sentimientos y cosas bonitas." },
  { tipo: "receta", titulo: "Batido de banano", otros: ["Mi perro Canelo", "El día de la independencia"],
    t: "Ingredientes: 2 bananos, 1 taza de leche y hielo.<br>Preparación: 1. Pelá los bananos. 2. Ponelos en la licuadora con la leche y el hielo. 3. Liculá un minuto y serví bien frío.",
    trata: "Cómo preparar un batido de banano", malas: ["Un banano que habla", "La historia de una finca"],
    por: "Es una <b>receta</b>: tiene ingredientes y pasos numerados para preparar una comida." },
  { tipo: "noticia", titulo: "Estudiantes siembran árboles en el parque", otros: ["El sapo y la luna", "Adivina, adivinador"],
    t: "Belén, 4 de noviembre. Ayer en la mañana, los estudiantes de segundo grado sembraron veinte árboles en el parque de su comunidad. La maestra explicó que los árboles dan sombra, limpian el aire y son casa de muchos animales.",
    trata: "Unos estudiantes que sembraron árboles en el parque", malas: ["Un árbol mágico que concede deseos", "Cómo hacer un barquito de papel"],
    por: "Es una <b>noticia</b>: cuenta algo que pasó de verdad, dice dónde y cuándo (Belén, 4 de noviembre) y quiénes participaron." },
  { tipo: "carta", titulo: "Querida abuela", otros: ["El ciclo del agua", "Trabalenguas del tigre"],
    t: "Querida abuela:<br>Te escribo para contarte que gané una medalla en la feria científica. Te extraño mucho y quiero visitarte en diciembre.<br>Con cariño, Samantha.",
    trata: "Una niña que le cuenta a su abuela que ganó una medalla", malas: ["Cómo se hace una medalla", "Un cuento de piratas"],
    por: "Es una <b>carta</b>: tiene saludo («Querida abuela»), un mensaje para alguien y una despedida con la firma." },
  { tipo: "fábula", titulo: "La tortuga y la liebre", otros: ["Receta de arroz con leche", "Noticias del clima"],
    t: "Una liebre se burlaba de una tortuga por lenta. La tortuga la retó a una carrera. La liebre, confiada, se durmió a medio camino, y la tortuga, paso a paso, llegó primero.<br><i>Moraleja: con constancia se llega lejos.</i>",
    trata: "Una tortuga que gana una carrera por no rendirse", malas: ["Cómo cuidar una tortuga", "Una liebre que aprende a cocinar"],
    por: "Es una <b>fábula</b>: los personajes son animales que hablan y al final tiene una <b>moraleja</b> (una enseñanza)." },
  { tipo: "adivinanza", titulo: "¿Qué será?", otros: ["La historia de mi cantón", "Cómo sembrar frijoles"],
    t: "Tengo agujas y no sé coser,<br>tengo números y no sé leer.<br>¿Qué soy?",
    trata: "Pistas para adivinar un objeto (el reloj)", malas: ["Una costurera que cose", "Cómo aprender a leer"],
    por: "Es una <b>adivinanza</b>: da pistas para que adivinemos algo y termina preguntando «¿Qué soy?». La respuesta es el reloj." },
  { tipo: "aviso", titulo: "Gran feria científica", otros: ["El gato y el ratón", "Mi diario"],
    t: "¡ATENCIÓN! Gran feria científica de la escuela.<br>Día: viernes 6 de noviembre. Hora: 8:00 a. m. Lugar: el gimnasio.<br>¡Te esperamos con tu familia!",
    trata: "Una invitación a la feria científica de la escuela", malas: ["Un científico que inventa un robot", "Cómo se forma un volcán"],
    por: "Es un <b>aviso</b> (o anuncio): da información corta y clara de un evento: qué, cuándo, a qué hora y dónde." },
];
const TIPOS_TEXTO = [...new Set(TEXTOS.map(x => x.tipo))];
const ESTRATEGIAS = [
  ["¿Qué nos ayuda a imaginar de qué trata un texto antes de leerlo?", "El título y los dibujos", ["El número de la página", "El color del papel", "La cantidad de hojas"],
    "Antes de leer, el título y las ilustraciones nos dan pistas de lo que vamos a leer."],
  ["¿Cuál es una buena manera de disfrutar un cuento?", "Leerlo con calma, imaginar lo que pasa y comentar lo que más me gustó", ["Leerlo lo más rápido posible sin entender", "Leer solo el final", "Saltarse las palabras difíciles"],
    "La lectura apreciativa es leer por gusto: imaginar, sentir, comentar y compartir lo que leímos."],
  ["Leer por gusto, para disfrutar e imaginar, se llama…", "lectura apreciativa", ["lectura de números", "copia", "dictado"],
    "Lectura apreciativa: leer para disfrutar, valorar y sentir lo que dice un texto."],
  ["¿Qué estrategia fomenta la lectura apreciativa?", "Leer en voz alta con buena entonación", ["Leer sin parar en los puntos", "Leer con voz muy baja que nadie oye", "Leer solo palabras sueltas"],
    "Leer en voz alta, con buena entonación y pausas, hace que el texto se disfrute y se entienda mejor."],
  ["Después de leer un cuento, ¿qué actividad ayuda a apreciarlo?", "Dibujar la parte que más me gustó o inventarle otro final", ["Arrancar la página", "Olvidar lo que leí", "Contar las letras"],
    "Dibujar, cambiar el final, dramatizar o recomendar el libro son estrategias de lectura apreciativa."],
  ["El título de un texto debe…", "tener relación con lo que dice el texto", ["ser lo más largo posible", "hablar de otra cosa", "ir al final"],
    "El título y el contenido deben estar relacionados: el título resume de qué trata el texto."],
  ["¿Qué tiene una fábula al final?", "Una moraleja (una enseñanza)", ["Una lista de ingredientes", "Una firma", "La fecha y el lugar"],
    "La fábula termina con una moraleja que nos deja una enseñanza."],
  ["¿Qué texto usamos para aprender a preparar una comida?", "La receta", ["El poema", "La fábula", "La adivinanza"], "La receta trae ingredientes y pasos para preparar algo."],
  ["¿Qué texto está escrito en versos y muchas veces tiene rima?", "El poema", ["La receta", "La noticia", "El aviso"], "El poema está escrito en versos (renglones cortos) y muchas veces tiene rima."],
  ["¿Qué texto cuenta un hecho real que acaba de pasar?", "La noticia", ["El cuento", "La fábula", "La adivinanza"], "La noticia informa algo real: qué pasó, dónde, cuándo y quiénes."],
  ["¿Con qué palabras suelen empezar los cuentos?", "Había una vez…", ["Ingredientes:", "Querida abuela:", "¡Atención!"], "Muchos cuentos empiezan con «Había una vez»."],
  ["¿Qué partes tiene un cuento?", "Inicio, desarrollo (el problema) y final", ["Ingredientes y preparación", "Saludo y firma", "Solo un título"], "Un cuento tiene inicio, desarrollo (donde pasa el problema) y final (cómo se resuelve)."],
];
const lecturaTipos = mezcla(
  [3, r => { const x = elegir(TEXTOS, r); return opc("¿Qué tipo de texto es?", x.tipo, TIPOS_TEXTO, x.por, r, 3, { lectura: x.t }); }],
  [3, r => { const x = elegir(TEXTOS, r); return opc("¿Cuál título tiene más relación con este texto?", x.titulo, x.otros, `El título debe decir de qué trata el texto: «${x.titulo}». ${x.por}`, r, 3, { lectura: x.t }); }],
  [2, r => { const x = elegir(TEXTOS, r); return opc("¿De qué trata este texto?", x.trata, x.malas, x.por, r, 3, { lectura: x.t }); }],
  [3, deBanco(ESTRATEGIAS)],
);

// ---------- Gestos, tono de voz, doble sentido, humor, enojo, pausa y silencio ----------
const EXPRESION = [
  ["Si alguien habla muy fuerte, frunce el ceño y cruza los brazos, ¿cómo se siente?", "Enojado", ["Feliz", "Con sueño", "Divertido"],
    "La voz fuerte, el ceño fruncido y los brazos cruzados muestran <b>enojo</b>."],
  ["¿Qué gesto usamos para decir «sí» sin hablar?", "Mover la cabeza de arriba abajo", ["Mover la cabeza de lado a lado", "Taparse los ojos", "Encoger los hombros"],
    "Con un gesto también comunicamos: mover la cabeza de arriba abajo es «sí»."],
  ["¿Qué gesto usamos para decir «no» sin hablar?", "Mover la cabeza de lado a lado", ["Mover la cabeza de arriba abajo", "Aplaudir", "Sonreír"],
    "Mover la cabeza de un lado a otro significa «no»."],
  ["¿Qué gesto hacemos para pedir silencio?", "Ponernos el dedo índice sobre la boca", ["Aplaudir fuerte", "Levantar los hombros", "Saludar con la mano"],
    "El dedo sobre la boca («shhh») pide silencio sin decir palabras."],
  ["Encoger los hombros (subirlos) significa…", "«No sé»", ["«Estoy feliz»", "«Vení»", "«Adiós»"], "Encoger los hombros es un gesto que dice «no sé» o «no estoy seguro»."],
  ["¿Qué comunica una sonrisa?", "Alegría o amabilidad", ["Enojo", "Miedo", "Dolor"], "La sonrisa es un gesto de alegría y de amabilidad."],
  ["Para contar un chiste usamos un tono de voz…", "alegre y divertido", ["triste y bajito", "enojado", "muy serio"], "Los chistes se cuentan con tono alegre: eso es el sentido humorístico."],
  ["Para dar una noticia triste usamos un tono de voz…", "bajo y suave", ["alegre y saltarín", "a gritos", "de chiste"], "El tono de voz cambia según lo que sentimos: para algo triste, bajo y suave."],
  ["Si alguien grita «¡Cuidado!», lo dice con un tono…", "fuerte y rápido, de alerta", ["bajito y lento", "de chiste", "dormido"], "Para avisar un peligro hablamos fuerte y rápido."],
  ["El <b>tono de voz</b> nos ayuda a…", "mostrar cómo nos sentimos (alegría, tristeza, enojo)", ["escribir más rápido", "contar números", "dibujar mejor"],
    "Con el tono de voz mostramos emociones: no es lo mismo decir «¡ven!» alegre que enojado."],
  ["¿Para qué sirve hacer una <b>pausa</b> al leer o al hablar?", "Para respirar y que se entienda mejor lo que decimos", ["Para terminar más rápido", "Para que nadie entienda", "Para hacer ruido"],
    "En la coma hacemos una pausa corta y en el punto una pausa más larga. Así se entiende mejor."],
  ["Al leer, ¿dónde hacemos una pausa corta?", "En la coma ( , )", ["En la letra a", "En medio de una palabra", "En la tilde"], "La coma pide una pausa corta; el punto, una pausa más larga."],
  ["Cuando escuchamos a alguien en <b>silencio</b> y lo miramos, mostramos que…", "le ponemos atención y lo respetamos", ["estamos enojados", "no nos importa", "tenemos hambre"],
    "El silencio también comunica: al escuchar callados mostramos respeto y atención."],
  ["Una frase tiene <b>doble sentido</b> cuando…", "se puede entender de dos maneras", ["tiene dos puntos", "se escribe dos veces", "tiene dos palabras"],
    "Doble sentido: la frase se puede entender de dos formas. Muchos chistes usan el doble sentido."],
  ["«Estoy hecho una sopa». ¿Qué quiere decir?", "Que está muy mojado", ["Que se convirtió en sopa", "Que tiene hambre", "Que sabe cocinar"],
    "Es doble sentido: no se volvió sopa de verdad, ¡quedó empapado como una sopa!"],
  ["«Esa muchacha está en las nubes». ¿Qué quiere decir?", "Que está distraída", ["Que está volando", "Que está en un avión", "Que está mojada"],
    "«Estar en las nubes» quiere decir estar distraído, pensando en otra cosa."],
  ["«Me costó un ojo de la cara». ¿Qué quiere decir?", "Que fue muy caro", ["Que se le cayó un ojo", "Que le dolió el ojo", "Que fue gratis"], "Es una frase con doble sentido: significa que algo costó mucha plata."],
  ["«Mi abuelo tiene un corazón de oro». ¿Qué quiere decir?", "Que es muy bueno y generoso", ["Que su corazón es de metal", "Que es muy rico", "Que está enfermo"], "«Corazón de oro»: una persona muy buena."],
  ["«Se me hace la boca agua». ¿Qué quiere decir?", "Que algo se ve muy rico y da ganas de comerlo", ["Que tiene la boca llena de agua", "Que tiene sed", "Que se mojó"], "Significa que algo se ve delicioso."],
  ["¿Qué tiene humor (es un chiste)?", "—¿Qué le dijo un semáforo a otro? —¡No me mirés, que me estoy cambiando!", ["El semáforo tiene tres colores", "Hay que cruzar en verde", "El semáforo está en la esquina"],
    "Es chistoso por el doble sentido: «cambiarse» de color y «cambiarse» de ropa."],
  ["Para mostrar <b>enojo</b> sin gritar, una persona puede…", "fruncir el ceño y hablar con voz seria", ["reírse a carcajadas", "aplaudir", "dar saltitos"], "Los gestos (ceño fruncido) y el tono serio muestran enojo."],
  ["Si una amiga te saluda moviendo la mano, está diciendo…", "«¡Hola!» o «¡Adiós!»", ["«Tengo hambre»", "«Estoy enojada»", "«No sé»"], "Mover la mano es un gesto de saludo o despedida."],
];

// ---------- Signo de interrogación y entonación ----------
const PREGUNTAS = ["¿Cómo te llamás?", "¿Dónde vivís?", "¿Cuántos años tenés?", "¿Querés jugar conmigo?", "¿Qué hora es?", "¿Cuál es tu color favorito?",
  "¿Ya hiciste la tarea?", "¿Quién trajo el balón?", "¿Cuándo es la feria científica?", "¿Te gusta el gallo pinto?", "¿Vamos al parque?", "¿Por qué llueve?"];
const AFIRMA = ["Me llamo Samantha.", "Vivo en Belén.", "Tengo siete años.", "Hoy hace mucho calor.", "El perro duerme en el corredor.", "Mañana hay feria científica."];
const EXCLAMA = ["¡Qué lindo día!", "¡Cuidado con el carro!", "¡Ganamos el partido!", "¡Feliz cumpleaños!"];
const INTERROGATIVAS = [["Cómo", "como"], ["Dónde", "donde"], ["Cuándo", "cuando"], ["Qué", "que"], ["Quién", "quien"], ["Cuál", "cual"], ["Cuántos", "cuantos"]];
const ENTONACION = [
  ["¿Dónde se ponen los signos de interrogación?", "Uno al inicio (¿) y otro al final (?) de la pregunta", ["Solo al final", "Solo al inicio", "En medio de la pregunta"],
    "En español la pregunta se abre con ¿ y se cierra con ?. ¡Los dos son obligatorios!"],
  ["¿Para qué sirven los signos de interrogación?", "Para escribir preguntas", ["Para escribir emociones fuertes", "Para terminar una oración", "Para separar palabras"],
    "Los signos ¿? encierran una pregunta. Las emociones fuertes van con ¡!."],
  ["Al leer en voz alta una pregunta como «¿Venís a mi casa?», la voz…", "sube al final", ["baja hasta callarse", "se queda igual, sin cambiar", "se vuelve un grito"],
    "La <b>entonación</b> de las preguntas de sí o no sube al final: «¿Venís a mi casa? ↗»."],
  ["¿Qué es la <b>entonación</b>?", "Las subidas y bajadas de la voz al hablar o leer", ["El tamaño de las letras", "El número de palabras", "La letra con la que empieza"],
    "Entonación: la «música» de la voz. Sube en las preguntas, sube con fuerza en las exclamaciones y baja al terminar una oración con punto."],
  ["Al leer una oración que termina en punto, como «Hoy es lunes.», la voz…", "baja al final", ["sube al final", "grita", "se detiene en medio"], "En las oraciones con punto la voz baja suavemente al final."],
  ["¿Qué signos usamos para expresar sorpresa o alegría, como «¡Qué lindo!»?", "Los signos de exclamación ( ¡! )", ["Los signos de interrogación ( ¿? )", "El punto ( . )", "La coma ( , )"],
    "Las emociones fuertes van entre ¡!. Las preguntas, entre ¿?."],
  ["Las palabras «qué, cómo, dónde, cuándo, quién, cuál» cuando preguntan…", "llevan tilde", ["nunca llevan tilde", "van con mayúscula siempre", "van al final"],
    "Cuando preguntan llevan tilde: «¿Dónde está?», «¿Qué querés?»."],
];
const conMayus = t => t[0].toUpperCase() + t.slice(1);
function interrogacion(r) {
  const tipo = elegir(["bien", "bien", "cual", "noes", "tilde", "concepto", "concepto"], r);
  if (tipo === "concepto") { const [t, b, o, e] = elegir(ENTONACION, r); return opc(t, b, o, e, r, Math.min(4, o.length + 1)); }
  const p = elegir(PREGUNTAS, r), sin = p.slice(1, -1);
  if (tipo === "bien") return opc("¿Cuál pregunta está bien escrita?", p, [`${sin}?`, `¿${sin}`, `?${sin}¿`, `${sin}.`], `Se escribe «${p}»: con ¿ al inicio y ? al final.`, r, 3);
  if (tipo === "cual") return opc("¿Cuál oración es una <b>pregunta</b>?", p, [elegir(AFIRMA, r), elegir(EXCLAMA, r), elegir(AFIRMA, r)], `«${p}» pregunta algo y va entre ¿?. Al leerla, la voz cambia de entonación.`, r, 3);
  if (tipo === "noes") {
    const no = elegir([...AFIRMA, ...EXCLAMA], r), otras = barajar(PREGUNTAS.filter(x => x !== p), r).slice(0, 2);
    return opc("¿Cuál de estas <b>NO</b> es una pregunta?", no, [p, ...otras], `«${no}» no pregunta nada: ${no.startsWith("¡") ? "es una exclamación (¡!)" : "es una oración que termina en punto"}.`, r, 3);
  }
  const [con, sinT] = elegir(INTERROGATIVAS, r), resto = { Cómo: "te fue en la escuela?", Dónde: "dejaste la mochila?", Cuándo: "es tu cumpleaños?", Qué: "comiste hoy?", Quién: "es tu maestra?", Cuál: "es tu fruta favorita?", Cuántos: "hermanos tenés?" }[con];
  return opc(`Completá la pregunta: «____ ${resto}»`, `¿${con}`, [`${conMayus(sinT)}`, `¿${conMayus(sinT)}`, `${con}`], `Se escribe «¿${con} ${resto}»: con ¿ al inicio y «${con}» con tilde porque pregunta.`, r, 3);
}

// ---------- Manifestaciones del lenguaje verbal: adivinanzas, trabalenguas, canciones y rimas ----------
const ADIVINANZAS = [
  ["Tengo agujas y no sé coser, tengo números y no sé leer. ¿Qué soy?", "El reloj", ["La costurera", "El libro", "El lápiz"]],
  ["Oro parece, plata no es. ¿Qué es?", "El plátano", ["El anillo", "La moneda", "El sol"]],
  ["Blanca por dentro, verde por fuera; si no sabés, esperá.", "La pera", ["La sandía", "El limón", "El aguacate"]],
  ["Vuela sin alas, silba sin boca, pega sin manos y no se ve.", "El viento", ["El pájaro", "El avión", "La lluvia"]],
  ["Tiene dientes y no come, tiene barbas y no es hombre.", "El ajo", ["El peine", "El perro", "El tiburón"]],
  ["Lleva su casa a cuestas, camina despacito y deja un caminito brillante.", "El caracol", ["La tortuga", "El cangrejo", "La hormiga"]],
  ["Mientras más le quitás, más grande se hace.", "El hueco (agujero)", ["La sandía", "El globo", "La montaña"]],
  ["Sale de noche, se esconde de día, brilla en el cielo y da luz fría.", "La luna", ["El sol", "La lámpara", "El bombillo"]],
  ["Tengo hojas y no soy árbol, tengo lomo y no soy caballo.", "El libro", ["El cuaderno", "La lechuga", "La silla"]],
  ["Soy de muchos colores, salgo después de la lluvia cuando sale el sol.", "El arcoíris", ["La nube", "El trueno", "La mariposa"]],
];
const TRABALENGUAS = ["Tres tristes tigres tragaban trigo en un trigal.", "Pablito clavó un clavito, ¿qué clavito clavó Pablito?",
  "Erre con erre cigarro, erre con erre barril, rápido ruedan los carros cargados de azúcar del ferrocarril.", "Como poco coco como, poco coco compro."];
const CANCIONES = ["Los pollitos dicen «pío, pío, pío» cuando tienen hambre, cuando tienen frío.", "Arroz con leche, me quiero casar con una señorita de San Nicolás.",
  "Un elefante se balanceaba sobre la tela de una araña…"];
const RIMAS = ["Sana, sana, colita de rana, si no sana hoy, sanará mañana.", "El ratón Ramón se comió un melón en el camión.", "En la mañana temprano, la abeja vuela al verano y se posa en mi mano."];
const GRUPOS_RIMA = [["ratón", "camión", "balón", "corazón", "melón", "limón", "botón"], ["rana", "manzana", "ventana", "campana", "semana", "banana"],
  ["sombrero", "cartero", "panadero", "lucero", "granero"], ["ardilla", "silla", "orilla", "semilla", "tortilla", "mantequilla"],
  ["sol", "girasol", "caracol", "farol", "frijol"], ["gato", "zapato", "pato", "plato", "rato"], ["estrella", "botella", "huella", "bella"]];
const LENGUAJE = [
  ["¿Para qué sirve un trabalenguas?", "Para practicar a pronunciar rápido y claro", ["Para adivinar un objeto", "Para dar una noticia", "Para preparar comida"],
    "Los trabalenguas juntan sonidos parecidos y difíciles: sirven para practicar la pronunciación."],
  ["Una adivinanza…", "da pistas para que descubramos algo", ["cuenta una noticia", "se canta con música", "tiene ingredientes"], "La adivinanza describe algo con pistas y nos reta a adivinarlo."],
  ["¿Qué es una <b>rima</b>?", "Palabras que terminan con el mismo sonido", ["Palabras que empiezan con mayúscula", "Una oración muy larga", "Un dibujo"],
    "Riman las palabras que suenan igual al final: ratón – camión, rana – manzana."],
  ["Las canciones…", "tienen ritmo y música, y se cantan", ["solo se leen en silencio", "siempre son adivinanzas", "no tienen palabras"], "Las canciones unen palabras con música y ritmo."],
  ["Las adivinanzas, los trabalenguas, las canciones y las rimas son manifestaciones del…", "lenguaje verbal (usamos palabras)", ["lenguaje de señas", "lenguaje de los números", "dibujo"],
    "El lenguaje verbal usa palabras, habladas o escritas. Adivinanzas, trabalenguas, canciones y rimas juegan con las palabras."],
];
const muestra = [["adivinanza", ADIVINANZAS.map(a => a[0])], ["trabalenguas", TRABALENGUAS], ["canción", CANCIONES], ["rima", RIMAS]];
const lenguajeVerbal = mezcla(
  [3, r => { const [t, bien, otras] = elegir(ADIVINANZAS, r); return opc(`Adiviná: «${t}»`, bien, otras, `¡Es ${bien.toLowerCase()}! Las adivinanzas dan pistas para descubrir algo.`, r, 3); }],
  [3, r => { const [tipo, lista] = elegir(muestra, r), t = elegir(lista, r);
    const por = { adivinanza: "Es una <b>adivinanza</b>: da pistas para que adivinemos algo.", trabalenguas: "Es un <b>trabalenguas</b>: repite sonidos parecidos y cuesta decirlo rápido.",
      canción: "Es una <b>canción</b>: se canta con música y ritmo.", rima: "Es una <b>rima</b>: sus palabras terminan con el mismo sonido." }[tipo];
    return opc(`¿Qué es esto? «${t}»`, tipo, muestra.map(m => m[0]), por, r, 4); }],
  [3, r => { const g = elegir(GRUPOS_RIMA, r), [a, b] = barajar(g, r), malas = barajar(GRUPOS_RIMA.filter(x => x !== g), r).slice(0, 3).map(x => elegir(x, r));
    return opc(`¿Qué palabra rima con «${a}»?`, b, malas, `«${a}» y «${b}» riman: terminan con el mismo sonido.`, r, 3); }],
  [2, deBanco(LENGUAJE)],
);

// =====================================================================
// 🌱 CIENCIAS · martes 10 de noviembre
// =====================================================================
const CONTAMINACION = [
  ["¿Qué es la <b>contaminación ambiental</b>?", "Cuando el aire, el agua o el suelo se ensucian con basura o sustancias que dañan a los seres vivos", ["Cuando llueve mucho", "Cuando sembramos árboles", "Cuando hace calor"],
    "Contaminación ambiental: meter en el ambiente (aire, agua, suelo) basura, humo, ruido o sustancias que hacen daño a las personas, animales y plantas."],
  ["¿Quiénes causan la mayor parte de la contaminación?", "Las personas, con sus acciones", ["Los animales del bosque", "Las nubes", "Las plantas"], "La mayoría de la contaminación la causan las acciones humanas."],
  ["¿Cuál acción contamina el <b>aire</b>?", "Quemar basura", ["Sembrar un árbol", "Andar en bicicleta", "Reciclar el papel"], "Quemar basura suelta humo y gases que ensucian el aire y nos hacen toser."],
  ["¿Cuál acción contamina el <b>agua</b>?", "Tirar basura al río", ["Cerrar el tubo al lavarse los dientes", "Recoger la basura", "Usar una botella reutilizable"], "La basura en los ríos ensucia el agua y mata a los peces."],
  ["¿Cuál acción contamina el <b>suelo</b>?", "Tirar plásticos y químicos en la tierra", ["Hacer abono con cáscaras", "Sembrar frijoles", "Barrer las hojas"], "Los plásticos tardan cientos de años en desaparecer y los químicos dañan la tierra."],
  ["Poner la música a todo volumen y pitar sin razón causa contaminación…", "sónica (por ruido)", ["del agua", "del suelo", "por basura"], "El ruido muy fuerte también contamina: es contaminación sónica. Daña los oídos y estresa."],
  ["El humo de los carros y las fábricas contamina…", "el aire", ["el agua del mar solamente", "solo las casas", "nada"], "El humo lleva gases que ensucian el aire que respiramos."],
  ["¿Qué le pasa a una tortuga marina que se come una bolsa plástica?", "Se puede enfermar o morir", ["Crece más rápido", "Nada, la digiere", "Se vuelve más fuerte"], "Los animales confunden el plástico con comida y se enferman. Por eso no hay que tirar plásticos."],
  ["¿Qué acción <b>ayuda</b> a cuidar el ambiente?", "Separar la basura y reciclar", ["Quemar llantas", "Tirar basura en la calle", "Dejar el tubo abierto"], "Reducir, reutilizar y reciclar (las 3 R) ayuda a cuidar el ambiente."],
  ["¿Qué significa <b>reutilizar</b>?", "Volver a usar algo en lugar de botarlo", ["Comprar más cosas", "Quemar la basura", "Tirar todo al río"], "Reutilizar: darle otro uso, como un frasco para guardar lápices."],
  ["¿Qué significa <b>reducir</b>?", "Usar menos cosas y producir menos basura", ["Hacer más basura", "Romper las cosas", "Comprar bolsas plásticas"], "Reducir: usar menos, por ejemplo llevar bolsa de tela al súper."],
  ["Cortar muchos árboles (deforestación) provoca…", "que los animales pierdan su casa y el aire esté menos limpio", ["que llueva chocolate", "que haya más animales", "más sombra"], "Los árboles limpian el aire y son casa de animales; sin ellos, todo se daña."],
  ["Cuando la basura tapa las alcantarillas y llueve, puede haber…", "inundaciones", ["más peces", "arcoíris", "terremotos"], "Si la basura tapa los desagües, el agua no puede pasar y se inunda la calle."],
  ["Usar mucho veneno (plaguicidas) en los cultivos puede…", "contaminar el suelo y el agua", ["limpiar el río", "hacer crecer los peces", "limpiar el aire"], "Los químicos se van con la lluvia a los ríos y dañan la tierra y el agua."],
  ["¿Cuál es un <b>efecto</b> de respirar aire contaminado?", "Enfermedades como tos y asma", ["Crecer más alto", "Ver mejor", "Correr más rápido"], "El aire sucio daña los pulmones: tos, alergias y asma."],
  ["¿Cuál acción ayuda a tener un aire más limpio?", "Caminar o andar en bicicleta en vez de usar el carro para todo", ["Quemar hojas", "Dejar el carro encendido", "Pitar mucho"], "Menos carros = menos humo en el aire."],
  ["¿Dónde debemos echar la basura?", "En el basurero, separada", ["En el río", "En la calle", "En el patio del vecino"], "La basura va en el basurero, separada en orgánica, reciclable y no reciclable."],
];
const CAUSA_EFECTO = [
  ["Tirar basura al río", "Los peces se mueren y el agua se ensucia"], ["Quemar basura", "El aire se llena de humo y la gente tose"],
  ["Cortar los árboles del bosque", "Los animales se quedan sin casa"], ["Tirar basura en la calle", "Se tapan las alcantarillas y hay inundaciones"],
  ["Poner la música a todo volumen", "Duelen los oídos y la gente se estresa"], ["Tirar bolsas plásticas en la playa", "Las tortugas se las comen y se enferman"],
  ["Echar químicos en la tierra", "El suelo se daña y las plantas no crecen bien"], ["El humo de muchos carros", "El aire se contamina y cuesta respirar"],
];
const contaminacion = mezcla(
  [3, deBanco(CONTAMINACION)],
  [2, r => { const [c, e] = elegir(CAUSA_EFECTO, r); return opc(`<b>Causa:</b> ${c}. ¿Cuál es el <b>efecto</b>?`, e, CAUSA_EFECTO.map(x => x[1]), `${c} → ${e.toLowerCase()}. La causa es lo que hacemos; el efecto, lo que pasa por eso.`, r, 3); }],
  [1, r => { const [c, e] = elegir(CAUSA_EFECTO, r); return opc(`<b>Efecto:</b> ${e}. ¿Cuál fue la <b>causa</b>?`, c, CAUSA_EFECTO.map(x => x[0]), `${c} → ${e.toLowerCase()}.`, r, 3); }],
);

// ---------- Cambios de estado con sus nombres: fusión, solidificación, evaporación y condensación ----------
const NOMBRES = { derrite: "Fusión", congela: "Solidificación", evapora: "Evaporación", condensa: "Condensación" };
const PASO = { Fusión: "de sólido a líquido (con calor)", Solidificación: "de líquido a sólido (con frío)", Evaporación: "de líquido a gas (con calor)", Condensación: "de gas a líquido (con frío)" };
const CAMBIOS_BANCO = [
  ["¿Cómo se llama el paso de <b>sólido a líquido</b>?", "Fusión", ["Solidificación", "Condensación", "Evaporación"], "Fusión: un sólido se derrite y pasa a líquido, como el hielo al sol."],
  ["¿Cómo se llama el paso de <b>líquido a sólido</b>?", "Solidificación", ["Fusión", "Evaporación", "Condensación"], "Solidificación: un líquido se enfría y se vuelve sólido, como el agua en el congelador."],
  ["¿Cómo se llama el paso de <b>líquido a gas</b>?", "Evaporación", ["Condensación", "Fusión", "Solidificación"], "Evaporación: el líquido se calienta y se vuelve vapor, como el agua que hierve."],
  ["¿Cómo se llama el paso de <b>gas a líquido</b>?", "Condensación", ["Evaporación", "Fusión", "Solidificación"], "Condensación: el vapor se enfría y se vuelve gotitas, como en el espejo del baño."],
  ["¿Qué hace que el hielo se derrita (fusión)?", "El calor (subir la temperatura)", ["El frío", "La oscuridad", "El ruido"], "Al subir la temperatura, el sólido pasa a líquido."],
  ["¿Qué hace que el agua se congele (solidificación)?", "El frío (bajar la temperatura)", ["El calor", "El viento", "La luz"], "Al bajar la temperatura, el líquido pasa a sólido."],
  ["Cuando el hielo se derrite y se vuelve agua, ¿sigue siendo agua?", "Sí, solo cambió de estado", ["No, se volvió otra cosa", "Se volvió leche", "Desapareció"],
    "Los cambios de estado son cambios físicos: cambia la forma (sólido, líquido o gas) pero no lo que es. El hielo, el agua y el vapor son todos agua."],
  ["Los cambios de estado ocurren al variar…", "la temperatura (calor o frío) o la presión", ["el color", "el nombre", "el tamaño del recipiente"], "La temperatura y la presión hacen que la materia cambie de estado, sin cambiar su composición."],
];
const cambiosNombres = mezcla(
  [3, r => { const s = elegir(SITUACIONES, r), n = NOMBRES[s.c]; return opc(`${s.e} ${s.t} ¿Qué cambio de estado es?`, n, Object.values(NOMBRES), `${n}: pasa ${PASO[n]}.${s.extra ? " " + s.extra : ""}`, r, 4); }],
  [2, deBanco(CAMBIOS_BANCO, 4)],
);

// ---------- El ciclo del agua y su importancia ----------
const CICLO = ["Evaporación", "Condensación", "Precipitación", "Recolección"];
const DESC_CICLO = {
  Evaporación: "El sol calienta el agua de mares, ríos y lagos, y sube al cielo como vapor.",
  Condensación: "El vapor sube, se enfría y forma gotitas que hacen las nubes.",
  Precipitación: "Las nubes se ponen pesadas y el agua cae como lluvia (o granizo).",
  Recolección: "El agua cae a ríos, lagos y al mar, o se mete en la tierra, y el ciclo vuelve a empezar.",
};
const CICLO_BANCO = [
  ["¿Qué es el <b>ciclo del agua</b>?", "El camino que recorre el agua: sube al cielo, forma nubes, cae como lluvia y vuelve a empezar", ["Una bicicleta que usa agua", "Cuando el agua se acaba", "El agua de la piscina"],
    "El ciclo del agua es el viaje sin fin del agua: evaporación → condensación → precipitación → recolección."],
  ["¿Qué hace el <b>sol</b> en el ciclo del agua?", "Calienta el agua y la evapora", ["Congela el agua", "Hace que llueva hielo", "Nada"], "El sol es el motor del ciclo: con su calor el agua se evapora."],
  ["Las nubes se forman por…", "condensación del vapor de agua", ["fusión del hielo", "el humo de los carros", "el viento solamente"], "El vapor sube, se enfría y se condensa en gotitas: así nacen las nubes."],
  ["Cuando el agua cae de las nubes como lluvia se llama…", "precipitación", ["evaporación", "condensación", "fusión"], "Precipitación: el agua cae de las nubes como lluvia o granizo."],
  ["¿Por qué es importante el ciclo del agua?", "Porque renueva el agua que necesitan las personas, los animales y las plantas", ["Porque ensucia los ríos", "Porque seca el mar", "No es importante"],
    "Gracias al ciclo del agua siempre hay agua dulce para beber, regar las plantas y para que vivan los seres vivos."],
  ["Sin el ciclo del agua…", "no llovería y las plantas y animales no tendrían agua", ["habría más lluvia", "el mar crecería", "no pasaría nada"], "La lluvia del ciclo llena ríos y nacientes; sin ella no habría agua para vivir."],
  ["¿Cuál de estos seres vivos necesita el agua?", "Todos: personas, animales y plantas", ["Solo los peces", "Solo las plantas", "Solo las personas"], "Todos los seres vivos necesitamos agua para vivir."],
  ["¿Cómo podemos cuidar el agua?", "Cerrar el tubo mientras nos cepillamos los dientes", ["Dejar el tubo abierto", "Tirar aceite al fregadero", "Lavar el carro con manguera todo el día"], "Cerrar el tubo, bañarnos rápido y no contaminar los ríos cuida el agua."],
  ["En el ciclo del agua, ¿qué cambios de estado ocurren?", "Evaporación (líquido a gas) y condensación (gas a líquido)", ["Solo fusión", "Ninguno", "Solo solidificación"], "El agua se evapora con el sol y se condensa en las nubes."],
];
const cicloAgua = mezcla(
  [2, deBanco(CICLO_BANCO)],
  [2, r => { const i = Math.floor(r() * CICLO.length), p = CICLO[i]; return opc(`¿Qué paso del ciclo del agua es este? «${DESC_CICLO[p]}»`, p, CICLO, `${p}: ${DESC_CICLO[p]}`, r, 4); }],
  [2, r => { const i = Math.floor(r() * CICLO.length), sig = CICLO[(i + 1) % 4];
    return opc(`En el ciclo del agua, después de la <b>${CICLO[i].toLowerCase()}</b> viene la…`, sig, CICLO.filter(x => x !== CICLO[i]), `El orden es: evaporación → condensación → precipitación → recolección → y vuelve a empezar.`, r, 3); }],
);

// =====================================================================
// 🗺️ ESTUDIOS SOCIALES · jueves 12 de noviembre (Escuela Fidel Chaves Murillo, La Ribera de Belén, Heredia)
// =====================================================================
const CANTON = [
  ["¿Cómo se llama mi escuela?", "Escuela Fidel Chaves Murillo", ["Escuela República Argentina", "Escuela Juan Santamaría", "Escuela Ojo de Agua"], "Nuestra escuela es la Escuela Fidel Chaves Murillo."],
  ["¿En qué provincia está la Escuela Fidel Chaves Murillo?", "Heredia", ["San José", "Alajuela", "Cartago"], "La escuela está en la provincia de Heredia."],
  ["¿En qué cantón está la Escuela Fidel Chaves Murillo?", "Belén", ["Barva", "Santo Domingo", "Flores"], "La escuela está en el cantón de Belén, provincia de Heredia."],
  ["¿En qué distrito de Belén está la escuela?", "La Ribera", ["San Antonio", "La Asunción", "San Rafael"], "La escuela está en el distrito de La Ribera, cantón de Belén."],
  ["¿Cuáles son los tres distritos del cantón de Belén?", "San Antonio, La Ribera y La Asunción", ["Heredia, Barva y Flores", "San José, Alajuela y Cartago", "Mercedes, Ulloa y Varablanca"], "Belén tiene tres distritos: San Antonio (la cabecera), La Ribera y La Asunción."],
  ["¿Cuál es la cabecera (el centro) del cantón de Belén?", "San Antonio", ["La Ribera", "Heredia", "Barva"], "La cabecera de Belén es San Antonio: ahí está la Municipalidad."],
  ["¿Qué institución gobierna y cuida el cantón?", "La Municipalidad de Belén", ["La escuela", "El supermercado", "La iglesia"], "La Municipalidad se encarga del cantón: calles, parques, basura, cultura y más."],
  ["¿Por qué es importante el <b>desarrollo cultural</b> de mi cantón?", "Porque conserva nuestras tradiciones y nos une como comunidad", ["Porque hace más ruido", "Porque no sirve para nada", "Porque solo es para los adultos"],
    "El desarrollo cultural (música, arte, tradiciones, fiestas) nos da identidad, conserva nuestra historia y une a los vecinos."],
  ["¿Qué es la <b>cultura</b> de un cantón?", "Sus tradiciones, costumbres, comidas, música, arte y forma de vivir", ["Solo sus calles", "Solo sus edificios", "Solo el clima"], "La cultura es todo lo que comparte un pueblo: tradiciones, costumbres, arte, comidas, fiestas."],
  ["¿Cuál es una forma de cuidar la cultura de mi cantón?", "Participar en las fiestas, desfiles y actividades culturales", ["Burlarse de las tradiciones", "Quedarse siempre en la casa", "Rayar los monumentos"],
    "Participar, aprender y respetar las tradiciones mantiene viva la cultura."],
  ["¿En qué país está el cantón de Belén?", "Costa Rica", ["Panamá", "Nicaragua", "Guatemala"], "Belén es un cantón de la provincia de Heredia, en Costa Rica."],
];
const PERSONAJES = [
  ["¿Por qué nuestra escuela se llama «Fidel Chaves Murillo»?", "En honor a don Fidel Chaves Murillo, vecino de La Ribera en cuya casa empezaron las clases", ["Por un futbolista famoso", "Por un presidente de otro país", "Por un río"],
    "La escuela comenzó (hacia 1912) en el corredor de la casa de don Fidel Chaves Murillo. Por eso, desde 1976, la escuela lleva su nombre."],
  ["¿Dónde se dieron las primeras clases de la escuela de La Ribera?", "En el corredor de la casa de don Fidel Chaves Murillo", ["En un estadio", "En un avión", "En la playa"],
    "Las primeras clases se dieron en el corredor de la casa de don Fidel: él prestó su casa para que los niños estudiaran."],
  ["¿Qué valor mostró don Fidel Chaves al prestar su casa para la escuela?", "Solidaridad (ayudar a la comunidad)", ["Egoísmo", "Pereza", "Enojo"], "Prestar su casa para que los niños estudiaran fue un acto de solidaridad con La Ribera."],
  ["¿Cuál era el nombre completo de «Don Billo»?", "Wilfrido Sánchez Mondragón", ["Fidel Chaves Murillo", "Juan Santamaría", "José Figueres Ferrer"], "«Don Billo» es el apodo de don Wilfrido Sánchez Mondragón."],
  ["Don Wilfrido Sánchez Mondragón era conocido como…", "Don Billo", ["Don Fidel", "El Erizo", "Don Pepe"], "A don Wilfrido Sánchez Mondragón le decían cariñosamente «Don Billo»."],
  ["¿Qué hizo Don Billo por el cantón de Belén?", "Trabajó por la comunidad en la Municipalidad (fue tesorero y presidente municipal)", ["Fue astronauta", "Fundó otro país", "Fue jugador de la Selección"],
    "Don Billo sirvió a Belén desde la Municipalidad: fue tesorero municipal y presidente municipal."],
  ["Belén nombró a Don Billo «Hijo Predilecto». ¿Qué significa?", "Que es una persona muy querida y especial para el cantón por todo lo que hizo", ["Que era el hijo menor", "Que nació en Belén", "Que era el alcalde"],
    "«Hijo predilecto» es un honor que da el cantón a alguien que hizo mucho bien por la comunidad."],
  ["La Municipalidad de Belén entrega la «Orden Billo Sánchez». ¿A quiénes?", "A personas que ayudan mucho a la comunidad", ["A quien gane una carrera de carros", "A los turistas", "A quien bote más basura"],
    "La Orden Billo Sánchez reconoce a personas que trabajan por Belén. Su símbolo son dos manos unidas: solidaridad."],
  ["¿Antes de servir a Belén, a qué se dedicó Don Billo desde niño?", "A la agricultura, con su papá", ["A pilotear aviones", "A cantar en la radio", "A pescar en el mar"], "Don Billo nació en Alajuela y desde niño trabajó la tierra con su papá."],
  ["¿Por qué es importante conocer a las personas representativas del cantón?", "Porque su trabajo nos enseña a servir y ayudar a la comunidad", ["Porque eran famosos en la tele", "Porque eran ricos", "No es importante"],
    "Don Fidel y Don Billo son ejemplo: trabajaron por el desarrollo social de Belén."],
];
const EXPRESIONES = [
  ["¿Cuál de estas es una <b>expresión artística</b>?", "Las mascaradas", ["Barrer el patio", "Hacer fila en el banco", "Lavar los platos"], "Las mascaradas, la música, la pintura y el baile son expresiones artísticas."],
  ["¿Qué son las <b>mascaradas</b>?", "Figuras grandes con máscaras (gigantes, diablos, payasos) que bailan en las fiestas", ["Un tipo de comida", "Un deporte", "Un animal"],
    "Las mascaradas son personajes con máscaras enormes que bailan por las calles en las fiestas, acompañados de música."],
  ["¿Con qué se hacen tradicionalmente las máscaras de las mascaradas?", "Con papel maché (papel y engrudo) sobre un molde", ["Con vidrio", "Con hielo", "Con hojas de plátano frescas"], "Las máscaras tradicionales se hacen con papel maché y se pintan con muchos colores."],
  ["¿Qué es la <b>cimarrona</b>?", "La banda de música alegre que acompaña a las mascaradas", ["Una máscara", "Un baile de salón", "Una comida típica"], "La cimarrona toca música alegre (con tambores y trompetas) para que bailen las mascaradas."],
  ["¿Qué día se celebra el Día de la Mascarada Tradicional Costarricense?", "El 31 de octubre", ["El 15 de setiembre", "El 25 de diciembre", "El 1 de mayo"], "El 31 de octubre es el Día de la Mascarada Tradicional Costarricense."],
  ["¿Cuál es una expresión artística de música?", "Tocar en una banda o cimarrona", ["Hacer una suma", "Jugar fútbol", "Barrer"], "La música es una expresión artística: bandas, cimarronas, coros, marimba."],
  ["Pintar un cuadro o hacer un mural es una expresión artística de…", "pintura", ["música", "deporte", "cocina"], "La pintura es una expresión artística: cuadros, murales, dibujos."],
  ["¿Qué instrumento es símbolo nacional de Costa Rica y se toca en las fiestas?", "La marimba", ["El piano", "La guitarra eléctrica", "La batería"], "La marimba es instrumento nacional y alegra muchas fiestas del país."],
  ["¿Por qué son importantes las expresiones artísticas del cantón?", "Porque muestran nuestra cultura y nos alegran y unen", ["Porque hacen basura", "Porque son aburridas", "No son importantes"], "El arte muestra quiénes somos y mantiene vivas nuestras tradiciones."],
  ["El baile típico con trajes de colores y faldas grandes se llama…", "baile folclórico", ["baile de robot", "carrera", "natación"], "El baile folclórico es una expresión artística tradicional de Costa Rica."],
];
const PARTICIPACION = [
  ["¿Qué significa <b>FEA</b>?", "Festival Estudiantil de las Artes", ["Feria de Ejercicios Atléticos", "Fiesta de Estudiantes Alegres", "Federación de Escuelas Agrícolas"],
    "FEA: Festival Estudiantil de las Artes. Ahí los estudiantes muestran canto, baile, pintura, teatro y más."],
  ["¿En qué actividad participa la escuela con canto, baile, pintura y teatro?", "En el Festival Estudiantil de las Artes (FEA)", ["En un torneo de fútbol", "En la feria del agricultor", "En una carrera de carros"], "El FEA es el festival de las artes de los estudiantes."],
  ["¿Cuál es una participación <b>deportiva</b> de la escuela?", "Los torneos deportivos", ["La feria científica", "El FEA", "Las exposiciones de pintura"], "Los torneos deportivos (fútbol, atletismo…) son participación deportiva."],
  ["¿Cuál es una participación <b>académica</b> de la escuela?", "La Feria Científica", ["Un torneo de fútbol", "La banda en el desfile", "Un partido de baloncesto"],
    "Participación académica: Feria Científica, exposiciones, trabajos y juegos grupales donde mostramos lo que aprendemos."],
  ["¿Qué hace la <b>banda institucional</b> de la escuela?", "Toca música y representa a la escuela en desfiles y actos", ["Juega fútbol", "Vende comida", "Limpia el aula"], "La banda representa a la escuela en desfiles, como el del 15 de setiembre."],
  ["En la <b>Feria Científica</b> los estudiantes…", "presentan experimentos e investigaciones", ["solo comen", "juegan fútbol", "duermen"], "En la Feria Científica investigamos y presentamos proyectos de ciencia."],
  ["Una exposición de arte con pinturas y mascaradas hechas por los estudiantes es una participación…", "académica y cultural", ["deportiva", "de compras", "de vacaciones"], "Las exposiciones de arte (pintura y mascaradas) muestran lo que aprendemos y nuestra cultura."],
  ["Cuando la escuela participa en actividades del cantón, está…", "representando a la escuela y a la comunidad", ["perdiendo el tiempo", "faltando a clases sin razón", "molestando"], "Al participar, la escuela representa a sus estudiantes y al cantón."],
  ["Hacer trabajos y juegos en grupo nos ayuda a…", "compartir ideas y aprender juntos", ["pelear", "copiarnos", "no hacer nada"], "En grupo aprendemos a cooperar, escuchar y compartir."],
];
const VALORES_DEF = {
  Respeto: "tratar bien a todos y escuchar sus ideas", Honestidad: "decir siempre la verdad y no tomar lo ajeno", Solidaridad: "ayudar a quien lo necesita",
  Tolerancia: "aceptar que otros piensen o sean diferentes", Compañerismo: "ser buen compañero y apoyar al grupo", Cooperación: "trabajar juntos para lograr algo",
  Empatía: "ponerse en el lugar del otro y entender cómo se siente", Armonía: "convivir en paz, sin pleitos",
};
const VALORES_CASOS = [
  ["Samantha encontró una cartuchera ajena y se la devolvió a su dueño.", "Honestidad"], ["Diego le prestó su lápiz a un compañero que no tenía.", "Solidaridad"],
  ["Todo el grupo trabajó junto para armar la maqueta de la feria científica.", "Cooperación"], ["Valeria escuchó sin interrumpir mientras su compañero exponía.", "Respeto"],
  ["Mateo vio a un compañero triste, se imaginó cómo se sentía y lo consoló.", "Empatía"], ["En el equipo, un niño piensa distinto y los demás aceptan su idea con calma.", "Tolerancia"],
  ["Camila animó a su equipo en el torneo aunque perdieron.", "Compañerismo"], ["En el aula todos conversan en paz y resuelven los problemas sin pelear.", "Armonía"],
  ["Sofía dijo la verdad cuando la maestra preguntó quién rompió el florero.", "Honestidad"], ["Los estudiantes recogieron víveres para una familia que perdió su casa.", "Solidaridad"],
];
const valores = mezcla(
  [3, r => { const [c, v] = elegir(VALORES_CASOS, r); return opc(`${c} ¿Qué valor practicó?`, v, Object.keys(VALORES_DEF), `${v}: ${VALORES_DEF[v]}.`, r, 4); }],
  [2, r => { const v = elegir(Object.keys(VALORES_DEF), r); return opc(`¿Qué valor es «${VALORES_DEF[v]}»?`, v, Object.keys(VALORES_DEF), `${v}: ${VALORES_DEF[v]}.`, r, 4); }],
  [1, deBanco([["¿Qué valores se fomentan cuando participamos en las actividades de la escuela?", "Respeto, cooperación, compañerismo y solidaridad", ["Egoísmo y pereza", "Enojo y burla", "Mentira y desorden"],
    "Al participar (FEA, torneos, feria científica) practicamos armonía, honestidad, solidaridad, tolerancia, compañerismo, respeto, cooperación y empatía."]])],
);
const CIUDADANIA = [
  ["¿Qué es el <b>gobierno estudiantil</b>?", "El grupo de estudiantes elegidos para representar a todos los alumnos de la escuela", ["Los maestros de la escuela", "El presidente de Costa Rica", "Los papás"],
    "El gobierno estudiantil lo forman estudiantes elegidos por votación para representar a todos y proponer mejoras."],
  ["¿Cómo se elige al gobierno estudiantil?", "Por medio de elecciones estudiantiles, con el voto", ["Lo escoge el más grande", "Por sorteo con una moneda", "Lo eligen solo los maestros"], "Se elige en elecciones: cada estudiante vota por su opción favorita."],
  ["¿Qué es la <b>directiva de sección</b>?", "Los compañeros elegidos para organizar y representar a nuestro grupo", ["La maestra", "El director", "Los conserjes"], "Cada sección elige su directiva: presidente, vicepresidente, secretario, tesorero, fiscal y vocal."],
  ["¿Cuál es un puesto de la directiva de sección?", "Presidente o presidenta", ["Director", "Conserje", "Doctor"], "La directiva tiene presidente(a), vicepresidente(a), secretario(a), tesorero(a), fiscal y vocal."],
  ["¿Qué significa que el voto es <b>secreto</b>?", "Que nadie más ve por quién votamos", ["Que lo gritamos en voz alta", "Que lo escribimos en la pizarra", "Que votamos por todos"],
    "Voto secreto: votamos en privado y nadie tiene que saber por quién votamos."],
  ["¿Qué significa que el voto es <b>voluntario</b>?", "Que votamos porque queremos, nadie nos obliga", ["Que nos obligan a votar", "Que solo votan los grandes", "Que hay que pagar para votar"],
    "Voto voluntario: cada quien decide libremente si vota y por quién."],
  ["¿Qué es ser un <b>ciudadano activo</b>?", "Participar, opinar y ayudar en la escuela y la comunidad", ["Quedarse callado siempre", "No ir a votar nunca", "Solo ver televisión"], "Ciudadanía activa: participar, votar, opinar con respeto y ayudar a la comunidad."],
  ["¿Cuál es un espacio de participación en la escuela?", "Las elecciones estudiantiles", ["El recreo para dormir", "La fila de la soda", "El baño"], "Las elecciones estudiantiles y la directiva de sección son espacios para participar."],
  ["¿Qué debemos hacer si nuestro candidato pierde las elecciones?", "Respetar el resultado y apoyar a los elegidos", ["Pelear", "Romper las papeletas", "No hablarle a nadie"], "En democracia se respeta lo que decide la mayoría."],
  ["¿Dónde marcamos nuestro voto en las elecciones?", "En la papeleta, dentro del recinto, en secreto", ["En la pared", "En el cuaderno del compañero", "En la mano"], "Votamos marcando la papeleta en privado y la echamos en la urna."],
  ["¿Qué hace el <b>Tribunal Electoral Estudiantil</b> (TEE)?", "Organiza y cuida que las elecciones de la escuela sean limpias", ["Vende comida", "Juega fútbol", "Da las notas"], "El TEE organiza las elecciones estudiantiles y cuida que todo sea justo."],
];

// =====================================================================
export const ESPANOL_2 = [
  { id: "lectura-apreciativa", nombre: "Tipos de textos y lectura apreciativa", emoji: "📚", grados: [2, 3], pregunta: lecturaTipos },
  { id: "diptongo", nombre: "El diptongo", emoji: "🤝", grados: [2, 3, 4], pregunta: r => preguntaDipHiato(r, "dip") },
  { id: "hiato", nombre: "El hiato", emoji: "✂️", grados: [2, 3, 4], pregunta: r => preguntaDipHiato(r, "hia") },
  { id: "expresion-oral", nombre: "Gestos, tono, doble sentido, pausa y silencio", emoji: "🎭", grados: [2, 3], pregunta: deBanco(EXPRESION) },
  { id: "interrogacion", nombre: "Signos de interrogación y entonación", emoji: "❔", grados: [1, 2, 3], pregunta: interrogacion },
  { id: "lenguaje-verbal", nombre: "Adivinanzas, trabalenguas, canciones y rimas", emoji: "🎵", grados: [1, 2, 3], pregunta: lenguajeVerbal },
];
export const CIENCIAS_2 = [
  { id: "contaminacion", nombre: "Contaminación ambiental: causas y efectos", emoji: "🏭", grados: [2, 3, 4], pregunta: contaminacion },
  { id: "cambios-nombres", nombre: "Fusión, solidificación, evaporación y condensación", emoji: "🌡️", grados: [2, 3, 4, 5], pregunta: cambiosNombres },
  { id: "ciclo-agua", nombre: "El ciclo del agua", emoji: "🌧️", grados: [2, 3, 4], pregunta: cicloAgua },
];
export const SOCIALES_2 = [
  { id: "canton-belen", nombre: "Mi escuela y mi cantón (Belén)", emoji: "🏘️", grados: [2, 3], pregunta: deBanco(CANTON) },
  { id: "personajes-belen", nombre: "Don Fidel Chaves y Don Billo", emoji: "👴", grados: [2, 3], pregunta: deBanco(PERSONAJES) },
  { id: "expresiones-artisticas", nombre: "Mascaradas, música y pintura", emoji: "🎭", grados: [2, 3], pregunta: deBanco(EXPRESIONES) },
  { id: "participacion-escuela", nombre: "Mi escuela participa (FEA, torneos, feria)", emoji: "🏆", grados: [2, 3], pregunta: deBanco(PARTICIPACION) },
  { id: "valores", nombre: "Los valores", emoji: "🤝", grados: [1, 2, 3, 4], pregunta: valores },
  { id: "ciudadania", nombre: "Gobierno estudiantil y el voto", emoji: "🗳️", grados: [2, 3, 4], pregunta: deBanco(CIUDADANIA) },
];

/** Para la página del temario y las pruebas: cuántas preguntas distintas tiene cada banco escrito a mano. */
export const BANCOS = { DIPTONGOS, HIATOS, TEXTOS, EXPRESION, CONTAMINACION, CANTON, PERSONAJES, EXPRESIONES, PARTICIPACION, CIUDADANIA };
