// 💭 Lógica de «¿Cómo se siente?» (sin pantalla, para poder probarla sola con node).
// Emociones y empatía para Prepa a 3°: reconocer caras, situaciones de todos los días, lo que siente
// el cuerpo y qué podemos hacer. Todas las emociones están bien: lo que importa es qué hacemos con ellas.
//
// Cada ronda tiene UNA sola respuesta: en las situaciones, las emociones que también podrían
// sentirse (`tambien`) nunca salen como opción.

// ---------- Emociones ----------
// adj: [masculino, femenino] (para «Mateo se siente enojado», «Sofía se siente enojada»)
// rasgos: cómo es la cara (para describirla sin decir el nombre, también al lector de pantalla)
export const EMO = {
  alegria: { n: "alegría", adj: ["feliz", "feliz"], e: "😄", rasgos: "una sonrisa grande, con la boca abierta",
    cuando: "Sentimos alegría cuando pasa algo lindo.",
    cuerpo: "te dan ganas de reírte, brincar y bailar" },
  tristeza: { n: "tristeza", adj: ["triste", "triste"], e: "😢", rasgos: "la boca para abajo y una lagrimita",
    cuando: "Sentimos tristeza cuando perdemos algo o extrañamos a alguien.",
    cuerpo: "te dan ganas de llorar y el cuerpo se siente pesado, sin ganas de jugar" },
  enojo: { n: "enojo", adj: ["enojado", "enojada"], e: "😠", rasgos: "las cejas bajas y juntas, y la cara roja",
    cuando: "Nos enojamos cuando algo nos parece injusto o nos molesta.",
    cuerpo: "la cara se pone caliente, apretás las manos y te dan ganas de gritar" },
  miedo: { n: "miedo", adj: ["con miedo", "con miedo"], e: "😨", rasgos: "los ojos muy abiertos y la boca temblando",
    cuando: "Sentimos miedo cuando algo nos parece peligroso.",
    cuerpo: "el corazón late muy rápido, las piernas tiemblan y te dan ganas de esconderte" },
  sorpresa: { n: "sorpresa", adj: ["sorprendido", "sorprendida"], e: "😮", rasgos: "las cejas arriba y la boca redonda, haciendo «¡oh!»",
    cuando: "Nos sorprendemos cuando pasa algo que no esperábamos.",
    cuerpo: "los ojos se abren grandotes y la boca hace «¡oh!»" },
  asco: { n: "asco", adj: ["con asco", "con asco"], e: "🤢", rasgos: "la nariz arrugada y la lengua afuera",
    cuando: "Sentimos asco con cosas que huelen o saben muy feo.",
    cuerpo: "arrugás la nariz, sacás la lengua y te dan ganas de alejarte" },
  verguenza: { n: "vergüenza", adj: ["con vergüenza", "con vergüenza"], e: "😳", rasgos: "los cachetes rojos y la mirada para abajo",
    cuando: "Sentimos vergüenza cuando nos equivocamos delante de otras personas.",
    cuerpo: "los cachetes se ponen colorados y te dan ganas de taparte la cara" },
  orgullo: { n: "orgullo", adj: ["orgulloso", "orgullosa"], e: "🏅", rasgos: "una sonrisa con los ojos cerraditos y una medalla",
    cuando: "Sentimos orgullo cuando logramos algo con nuestro esfuerzo.",
    cuerpo: "sacás el pecho, levantás la cabeza y sonreís porque lo lograste" },
  calma: { n: "calma", adj: ["tranquilo", "tranquila"], e: "😌", rasgos: "los ojos cerrados y una sonrisa suave",
    cuando: "Sentimos calma cuando estamos tranquilos y a salvo.",
    cuerpo: "respirás despacio y el cuerpo está suelto y tranquilo" },
  nervios: { n: "nervios", adj: ["nervioso", "nerviosa"], e: "😬", rasgos: "los dientes apretados, los ojos para un lado y una gota de sudor",
    cuando: "Sentimos nervios antes de algo importante, cuando no sabemos cómo nos va a ir.",
    cuerpo: "sentís mariposas en la panza y te sudan las manos" },
};
export const BASICAS = ["alegria", "tristeza", "enojo", "miedo", "sorpresa", "asco"];
export const FINAS = ["verguenza", "orgullo", "calma", "nervios"];
export const TODAS = Object.keys(EMO);

// ---------- Caras (SVG propio: cambian las cejas, los ojos y la boca) ----------
const TINTA = "#1F3A5F";
const piel = { enojo: "#FF9E80", asco: "#C5E1A5", calma: "#B3E5FC" };
const ojo = {
  normal: x => `<circle cx="${x}" cy="44" r="4.5" fill="${TINTA}"/>`,
  grande: x => `<circle cx="${x}" cy="44" r="8" fill="#fff" stroke="${TINTA}" stroke-width="2.5"/><circle cx="${x}" cy="45" r="3.5" fill="${TINTA}"/>`,
  feliz: x => `<path d="M${x - 6} 46 Q${x} 38 ${x + 6} 46" fill="none" stroke="${TINTA}" stroke-width="3.5" stroke-linecap="round"/>`,
  cerrado: x => `<path d="M${x - 6} 44 Q${x} 49 ${x + 6} 44" fill="none" stroke="${TINTA}" stroke-width="3.5" stroke-linecap="round"/>`,
  abajo: x => `<circle cx="${x}" cy="49" r="4" fill="${TINTA}"/>`,
  lado: x => `<circle cx="${x}" cy="44" r="6.5" fill="#fff" stroke="${TINTA}" stroke-width="2.5"/><circle cx="${x + 3}" cy="44" r="3" fill="${TINTA}"/>`,
  apretado: x => `<path d="M${x - 6} 43 L${x + 6} 46" stroke="${TINTA}" stroke-width="3.5" stroke-linecap="round"/>`,
};
const linea = d => `<path d="${d}" fill="none" stroke="${TINTA}" stroke-width="3.5" stroke-linecap="round"/>`;
const cejas = {
  suaves: linea("M28 33 Q36 29 44 33") + linea("M56 33 Q64 29 72 33"),
  altas: linea("M27 27 Q36 19 45 27") + linea("M55 27 Q64 19 73 27"),
  tristes: linea("M28 34 L44 28") + linea("M56 28 L72 34"),
  enojadas: linea("M28 28 L44 35") + linea("M56 35 L72 28"),
  preocupadas: linea("M28 31 L44 25") + linea("M56 25 L72 31"),
};
const boca = {
  risa: `<path d="M32 60 Q50 86 68 60 Z" fill="#8E2C2C" stroke="${TINTA}" stroke-width="3" stroke-linejoin="round"/><path d="M40 72 Q50 80 60 72 Q50 68 40 72 Z" fill="#F48FB1"/>`,
  sonrisa: linea("M35 64 Q50 77 65 64"),
  suave: linea("M41 66 Q50 72 59 66"),
  triste: linea("M36 74 Q50 61 64 74"),
  oh: `<ellipse cx="50" cy="70" rx="7" ry="9" fill="#8E2C2C" stroke="${TINTA}" stroke-width="3"/>`,
  tiembla: linea("M37 71 Q41 66 45 71 Q49 76 53 71 Q57 66 61 71 Q63 74 64 71"),
  enojo: `<path d="M38 72 Q50 64 62 72" fill="none" stroke="${TINTA}" stroke-width="4.5" stroke-linecap="round"/>`,
  dientes: `<rect x="35" y="63" width="30" height="11" rx="3" fill="#fff" stroke="${TINTA}" stroke-width="3"/>${linea("M42 63 L42 74")}${linea("M50 63 L50 74")}${linea("M58 63 L58 74")}`,
  asco: linea("M36 68 Q42 63 48 68 Q54 73 62 66") + `<path d="M48 69 Q49 81 56 79 Q60 76 57 69 Z" fill="#F48FB1" stroke="${TINTA}" stroke-width="2.5"/>`,
  timida: linea("M42 69 Q46 72 50 69 Q54 66 58 69"),
};
const extra = {
  lagrima: `<path d="M68 51 Q64 59 68 62 Q72 59 68 51 Z" fill="#4FC3F7" stroke="${TINTA}" stroke-width="1.5"/>`,
  rubor: `<ellipse cx="27" cy="60" rx="7" ry="4.5" fill="#F06292" opacity=".75"/><ellipse cx="73" cy="60" rx="7" ry="4.5" fill="#F06292" opacity=".75"/>`,
  sudor: `<path d="M80 26 Q76 34 80 37 Q84 34 80 26 Z" fill="#4FC3F7" stroke="${TINTA}" stroke-width="1.5"/>`,
  nariz: linea("M45 55 L50 52 L55 55"),
  medalla: `<path d="M74 70 L70 86 M82 70 L86 86" stroke="#1E6FD9" stroke-width="4"/><circle cx="78" cy="88" r="9" fill="#FFC107" stroke="${TINTA}" stroke-width="2.5"/><path d="M78 82 L80 87 L85 87 L81 90 L82 95 L78 92 L74 95 L75 90 L71 87 L76 87 Z" fill="#fff"/>`,
};
const RASGOS = {
  alegria: ["feliz", "suaves", "risa", []],
  tristeza: ["normal", "tristes", "triste", ["lagrima"]],
  enojo: ["normal", "enojadas", "enojo", []],
  miedo: ["grande", "preocupadas", "tiembla", ["sudor"]],
  sorpresa: ["grande", "altas", "oh", []],
  asco: ["apretado", "enojadas", "asco", ["nariz"]],
  verguenza: ["abajo", "tristes", "timida", ["rubor"]],
  orgullo: ["feliz", "altas", "sonrisa", ["medalla"]],
  calma: ["cerrado", "suaves", "suave", []],
  nervios: ["lado", "preocupadas", "dientes", ["sudor"]],
};

/** La cara de una emoción, como SVG (sin texto: la describe quien la usa). */
export function cara(id) {
  const [o, c, b, ex] = RASGOS[id];
  // En el asco, un ojo apretado y el otro normal
  const ojos = id === "asco" ? ojo.apretado(36) + ojo.normal(64) : ojo[o](36) + ojo[o](64);
  return `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="52" r="44" fill="${piel[id] || "#FFD54F"}" stroke="${TINTA}" stroke-width="3"/>`
    + cejas[c] + ojos + boca[b] + ex.map(x => extra[x]).join("") + "</svg>";
}

// ---------- Personas y situaciones ----------
export const PERSONAS = [["Sofía", 1], ["Mateo", 0], ["Valeria", 1], ["Diego", 0], ["Camila", 1], ["Sebastián", 0],
  ["Daniela", 1], ["Andrés", 0], ["Ana", 1], ["Luis", 0]].map(([n, f]) => ({ n, f: !!f }));

/** Llena una frase con la persona: {n} nombre, {o} o/a, {lo} lo/la, {él} él/ella. */
export const llenar = (t, p) => t.replace(/\{n\}/g, p.n).replace(/\{o\}/g, p.f ? "a" : "o")
  .replace(/\{lo\}/g, p.f ? "la" : "lo").replace(/\{él\}/g, p.f ? "ella" : "él");
export const adjDe = (emo, p) => EMO[emo].adj[p.f ? 1 : 0];

// tambien: emociones que también se podrían sentir ahí (nunca salen como opción en esa ronda)
const S = (emo, e, t, tambien = []) => ({ emo, e, t, tambien });
export const SITUACIONES = [
  S("alegria", "🎂", "Hoy es el cumpleaños de {n} y toda la familia le cantó «Feliz cumpleaños».", ["sorpresa", "orgullo"]),
  S("alegria", "🏖️", "{n} está en la playa saltando las olas con su papá.", ["calma"]),
  S("alegria", "⚽", "{n} está jugando bola con sus amigos en la plaza.", []),
  S("alegria", "🐶", "Cuando {n} llega de la escuela, su perrito {lo} recibe moviendo la cola.", ["calma"]),
  S("alegria", "🍚", "La abuela de {n} vino de visita y le hizo arroz con leche.", ["sorpresa", "calma"]),
  S("tristeza", "🍦", "A {n} se le cayó el helado al suelo.", ["enojo", "sorpresa"]),
  S("tristeza", "🚚", "La mejor amiga de {n} se fue a vivir a otro pueblo.", []),
  S("tristeza", "🌧️", "Está lloviendo mucho y {n} no puede salir a jugar al parque.", ["enojo", "calma"]),
  S("tristeza", "🧸", "{n} no encuentra su peluche favorito por ningún lado.", ["nervios", "enojo", "miedo"]),
  S("tristeza", "🏡", "{n} quería jugar, pero todos sus amigos ya se habían ido para la casa.", ["enojo"]),
  S("enojo", "🧸", "Otro niño le quitó el juguete a {n} sin pedírselo.", ["tristeza", "sorpresa"]),
  S("enojo", "🎨", "Alguien le rayó a {n} el dibujo que hizo con tanto cuidado.", ["tristeza", "sorpresa"]),
  S("enojo", "🎲", "En el juego, le hicieron trampa a {n} para ganarle.", ["tristeza"]),
  S("enojo", "🚶", "{n} estaba haciendo fila y alguien se le metió adelante.", ["sorpresa"]),
  S("enojo", "🧱", "El primo de {n} le botó la torre de bloques a propósito.", ["tristeza", "sorpresa"]),
  S("miedo", "⛈️", "Hay una tormenta con truenos muy fuertes y {n} está solit{o} en su cuarto.", ["nervios", "sorpresa", "tristeza"]),
  S("miedo", "🐕", "Un perro grande que {n} no conoce le ladra muy fuerte.", ["sorpresa", "nervios"]),
  S("miedo", "🌙", "En la noche, {n} escucha un ruido raro afuera de la ventana.", ["nervios", "sorpresa"]),
  S("miedo", "🛒", "En el súper, {n} levanta la vista y no ve a su mamá por ningún lado.", ["nervios", "tristeza", "sorpresa"]),
  S("sorpresa", "🎉", "{n} abrió la puerta y todos gritaron: «¡Sorpresa!».", ["alegria", "miedo"]),
  S("sorpresa", "🌈", "De pronto, {n} vio un arcoíris doble en el cielo.", ["alegria", "calma"]),
  S("sorpresa", "📦", "{n} abrió una cajita y de adentro saltó un muñeco de resorte.", ["miedo", "alegria"]),
  S("sorpresa", "🦋", "Una mariposa morfo azul se le paró a {n} en la mano.", ["alegria", "calma", "miedo"]),
  S("asco", "🥛", "{n} probó una leche que estaba vieja y agria.", ["sorpresa"]),
  S("asco", "🗑️", "Junto a la casa de {n} hay un basurero con muy mal olor.", ["enojo"]),
  S("asco", "🍜", "{n} encontró un pelo en la sopa.", ["sorpresa", "enojo"]),
  S("asco", "👟", "{n} pisó algo pegajoso y apestoso en el zacate.", ["sorpresa", "enojo"]),
  S("verguenza", "🏫", "{n} le dijo «mamá» a la maestra sin querer, frente a toda la clase.", ["sorpresa", "alegria"]),
  S("verguenza", "👕", "{n} llegó a la escuela con la camiseta al revés y todos se dieron cuenta.", ["tristeza", "sorpresa"]),
  S("verguenza", "🤸", "{n} se tropezó en el recreo y todos {lo} vieron caer.", ["tristeza", "sorpresa"]),
  S("verguenza", "🎤", "A {n} se le olvidó lo que tenía que decir en el acto, frente a todos.", ["nervios", "tristeza", "miedo", "sorpresa"]),
  S("orgullo", "🚲", "{n} practicó muchísimo y por fin aprendió a andar en bici sin rueditas.", ["alegria"]),
  S("orgullo", "🧩", "{n} terminó solit{o} un rompecabezas de cien piezas.", ["alegria", "calma"]),
  S("orgullo", "📜", "A {n} le dieron un diploma por ayudar a sus compañeros.", ["alegria", "sorpresa"]),
  S("orgullo", "📖", "{n} practicó mucho y por fin leyó un cuento completo sin ayuda.", ["alegria"]),
  S("calma", "🌧️", "{n} está acostad{o} en la hamaca, escuchando la lluvia.", ["alegria"]),
  S("calma", "☁️", "{n} está acostad{o} en el zacate, mirando las nubes pasar.", ["alegria"]),
  S("calma", "🛏️", "Después del baño, {n} se acurruca con su cobija favorita.", ["alegria"]),
  S("calma", "🐢", "{n} mira despacito cómo nadan las tortugas en la poza.", ["alegria", "sorpresa"]),
  S("nervios", "🎒", "Mañana es el primer día de {n} en una escuela nueva.", ["miedo", "alegria", "tristeza"]),
  S("nervios", "💃", "En un ratito, {n} tiene que bailar en el acto cívico frente a todos.", ["miedo", "alegria", "verguenza"]),
  S("nervios", "🏊", "{n} espera su turno para la prueba de natación.", ["miedo", "alegria"]),
  S("nervios", "🦷", "{n} está en la sala de espera del dentista.", ["miedo"]),
];

// ---------- Qué podemos hacer ----------
// Lo que ayuda y lo que no ayuda tanto (sin decir nunca que la emoción está mal)
const A = (e, t, porque) => ({ e, t, porque });
export const AYUDA = {
  enojo: [A("🌬️", "Respirar hondo y contar hasta cinco", "respirar despacio calma el cuerpo"),
    A("🗣️", "Decir con palabras: «Eso me enoja»", "así los demás entienden qué le pasa"),
    A("🚶", "Alejarse un ratito para calmarse", "un ratito aparte ayuda a pensar mejor"),
    A("🙋", "Pedirle ayuda a un adulto", "un adulto puede ayudar a arreglar el problema")],
  tristeza: [A("🗣️", "Contarle a alguien cómo se siente", "hablar de lo que sentimos nos alivia"),
    A("🤗", "Pedir un abrazo", "un abrazo de alguien que nos quiere reconforta"),
    A("🖍️", "Dibujar lo que siente", "dibujar ayuda a sacar lo que sentimos"),
    A("🙋", "Buscar a un adulto de confianza", "un adulto de confianza nos puede acompañar")],
  miedo: [A("🙋", "Pedirle ayuda a un adulto de confianza", "un adulto nos cuida y nos ayuda"),
    A("🌬️", "Respirar despacio", "respirar despacio calma el corazón"),
    A("🗣️", "Contar qué le da miedo", "cuando lo contamos, alguien nos puede ayudar")],
  nervios: [A("🌬️", "Respirar hondo contando hasta cinco", "respirar despacio calma las mariposas de la panza"),
    A("💪", "Pensar: «¡Yo puedo!»", "darnos ánimo nos ayuda a hacerlo"),
    A("🗣️", "Contarle a alguien que está nervios{o}", "contarlo hace que nos sintamos acompañados")],
  verguenza: [A("😄", "Reírse también, si fue algo chistoso", "a todos nos pasan cosas así"),
    A("🌬️", "Respirar y seguir adelante", "la vergüenza se pasa rápido"),
    A("🗣️", "Contarle a alguien de confianza", "hablarlo nos ayuda a sentirnos mejor")],
};
export const NO_AYUDA = {
  enojo: [A("💥", "Tirar las cosas", "se pueden quebrar o lastimar a alguien"),
    A("📢", "Gritarle a todo el mundo", "los demás se asustan y no entienden qué le pasa"),
    A("🦶", "Patear la silla", "se puede lastimar")],
  tristeza: [A("💥", "Romper sus juguetes", "después ya no los va a tener"),
    A("🤐", "Guardarse lo que siente y no hablar con nadie", "la tristeza pesa más cuando la guardamos solos"),
    A("📢", "Gritarles a los demás", "los demás no tienen la culpa y no entienden qué le pasa")],
  miedo: [A("🏃", "Salir corriendo sin avisarle a nadie", "se puede perder y nadie sabría dónde está"),
    A("🤐", "Quedarse callad{o} sin pedir ayuda", "los adultos no pueden ayudar si no saben"),
    A("📢", "Gritarles a los demás", "gritar no hace que el miedo se vaya")],
  nervios: [A("🏃", "Irse sin avisarle a nadie", "los demás se preocupan si no saben dónde está"),
    A("🙈", "Esconderse para no hacerlo", "así nunca descubre que sí puede"),
    A("📢", "Gritarles a los demás", "los demás no tienen la culpa de los nervios")],
  verguenza: [A("🙈", "No volver nunca a la escuela", "a todos nos pasan cosas así y se olvidan rápido"),
    A("📢", "Gritarles a los que se rieron", "gritar hace que el problema crezca"),
    A("💥", "Tirar las cosas", "se pueden quebrar o lastimar a alguien")],
};

// Para ayudar a un amigo o amiga ({lo}/{él} es la otra persona)
export const EMPATIA_BIEN = {
  tristeza: [A("❓", "Preguntarle qué le pasa", "así sabe que nos importa"),
    A("🤗", "Darle un abrazo, si quiere", "un abrazo acompaña"),
    A("⚽", "Invitar{lo} a jugar", "jugar juntos le puede alegrar el día"),
    A("🧸", "Prestarle un juguete", "compartir lo hace sentir acompañad{o}")],
  miedo: [A("🤝", "Quedarse con {él} y acompañar{lo}", "acompañado el miedo es más pequeño"),
    A("🙋", "Buscar juntos a un adulto", "un adulto puede ayudar"),
    A("🧸", "Prestarle tu peluche", "abrazar algo suave ayuda con el miedo")],
  verguenza: [A("❓", "Preguntarle si está bien", "así sabe que nos importa"),
    A("💬", "Decirle: «Tranqui, a todos nos pasa»", "le ayuda saber que no es al único que le pasa")],
  enojo: [A("❓", "Preguntarle qué pasó", "escuchar ayuda a calmarse"),
    A("🌬️", "Invitar{lo} a respirar hondo juntos", "respirar juntos calma"),
    A("🙋", "Avisarle a la maestra si necesita ayuda", "un adulto puede ayudar a arreglarlo")],
};
export const EMPATIA_MAL = {
  tristeza: [A("😂", "Reírse de {él}", "reírse de alguien triste lo hace sentir peor"),
    A("🙈", "Hacer como si no pasara nada", "se va a sentir solit{o}"),
    A("🗯️", "Decirle: «¡Qué chillón!»", "llorar está bien; esas palabras lastiman")],
  miedo: [A("😂", "Reírse de {él}", "reírse de alguien con miedo lo hace sentir peor"),
    A("🙈", "Dejar{lo} sol{o}", "con miedo es mejor estar acompañad{o}"),
    A("👻", "Asustar{lo} más para jugar", "eso le da más miedo")],
  verguenza: [A("😂", "Reírse de {él} con los demás", "así siente más vergüenza"),
    A("📢", "Contárselo a toda la escuela", "eso le daría más vergüenza"),
    A("🙈", "Hacer como si no pasara nada", "se puede sentir sol{o}")],
  enojo: [A("📢", "Gritarle también", "dos personas gritando se enojan más"),
    A("😂", "Reírse de {él}", "reírse lo enoja más"),
    A("💥", "Tirarle las cosas", "alguien puede salir lastimado")],
};
// «¡Qué chillón!» cambia con la persona
const chillon = (t, p) => t.replace("«¡Qué chillón!»", p.f ? "«¡Qué chillona!»" : "«¡Qué chillón!»");

// La mejor reacción (2° y 3°): una que ayuda y dos que parecen tentadoras pero no ayudan
export const REACCION = {
  enojo: { bien: A("🗣️", "Decirle con calma: «No me gusta que hagás eso»", "decirlo con palabras arregla el problema sin lastimar"),
    mal: [A("💔", "Decirle: «¡Ya no sos mi amigo!»", "eso lastima y no arregla nada"),
      A("🔁", "Hacerle lo mismo de vuelta", "así el problema se hace más grande")] },
  tristeza: { bien: A("🗣️", "Contarle a alguien de confianza cómo se siente", "hablarlo ayuda a que la tristeza pese menos"),
    mal: [A("🤐", "Quedarse callad{o} todo el día", "la tristeza pesa más cuando la guardamos"),
      A("🚫", "Decir que nunca más va a jugar", "mañana puede ser un día mejor")] },
  miedo: { bien: A("🙋", "Buscar a un adulto y contarle", "un adulto lo puede cuidar"),
    mal: [A("🙈", "Hacer como si no pasara nada", "el miedo nos avisa algo: hay que contarlo"),
      A("🏃", "Irse solit{o} a buscar ayuda lejos", "es mejor quedarse donde lo puedan encontrar y pedir ayuda ahí")] },
  nervios: { bien: A("🌬️", "Respirar hondo y hacerlo lo mejor que pueda", "los nervios bajan cuando respiramos y lo intentamos"),
    mal: [A("🚫", "No ir para no sentir nervios", "así se pierde algo lindo y nunca sabe que sí podía"),
      A("😠", "Enojarse con los demás", "los demás no tienen la culpa de los nervios")] },
  verguenza: { bien: A("😄", "Reírse un poquito y seguir", "a todos nos pasan cosas así"),
    mal: [A("👉", "Decir que fue culpa de otro", "echarle la culpa a otro no es justo"),
      A("🙈", "Esconderse todo el recreo", "la vergüenza se pasa más rápido si seguimos")] },
  orgullo: { bien: A("🎉", "Contarle a su familia lo que logró", "compartir lo que logramos nos alegra a todos"),
    mal: [A("😏", "Burlarse de los que todavía no pueden", "todos aprendemos a nuestro ritmo"),
      A("🛑", "Dejar de practicar porque ya lo sabe todo", "siempre se puede aprender más")] },
  alegria: { bien: A("🤝", "Compartir la alegría con los demás", "la alegría compartida crece"),
    mal: [A("😏", "Presumir para que los demás se sientan mal", "eso hace sentir mal a los demás"),
      A("🙉", "No dejar jugar a nadie más", "jugar juntos es más divertido")] },
};

// Emociones que se parecen: la cara las distingue (para 2° y 3°)
export const PARECIDAS = [
  ["miedo", "sorpresa", "Con sorpresa la boca hace «¡oh!» y dura un momentito; con miedo la boca tiembla, suda y dan ganas de alejarse."],
  ["nervios", "miedo", "Con nervios se aprietan los dientes y se mira para un lado, porque viene algo importante; con miedo los ojos se abren grandes porque algo asusta."],
  ["orgullo", "alegria", "El orgullo es una alegría especial por algo que lograste con tu esfuerzo: por eso tiene medalla."],
  ["calma", "alegria", "Con alegría dan ganas de reír y brincar; con calma el cuerpo está tranquilo, con los ojos cerrados y respirando despacio."],
  ["verguenza", "tristeza", "Con tristeza sale una lagrimita; con vergüenza se ponen rojos los cachetes y se mira para abajo."],
  ["asco", "enojo", "Con enojo la cara se pone roja y las cejas se juntan; con asco se arruga la nariz y se saca la lengua."],
];
const diferencia = (a, b) => PARECIDAS.find(([x, y]) => (x === a && y === b) || (x === b && y === a))?.[2] || "";

// ---------- Escalones ----------
// 🪜 De lo más concreto (caras de alegría y tristeza) a lo más fino (la mejor reacción)
export const ESCALONES = [
  { nombre: "Caras: feliz o triste", tipo: "cara", emos: ["alegria", "tristeza"], ops: 2 },          //  1
  { nombre: "Caras: feliz, triste o enojado", tipo: "cara", emos: ["alegria", "tristeza", "enojo"], ops: 3 }, //  2
  { nombre: "Caras básicas", tipo: "cara", emos: ["alegria", "tristeza", "enojo", "miedo", "sorpresa"], ops: 3 }, //  3
  { nombre: "¿Cómo se siente? (2)", tipo: "situacion", emos: ["alegria", "tristeza", "enojo", "miedo"], ops: 2 }, //  4
  { nombre: "¿Cómo se siente? (3)", tipo: "situacion", emos: BASICAS, ops: 3 },                          //  5
  { nombre: "Lo que siente el cuerpo", tipo: "cuerpo", emos: BASICAS, ops: 3 },                           //  6
  { nombre: "¿Qué le ayuda?", tipo: "accion", emos: ["enojo", "tristeza", "miedo"], ops: 3 },              //  7
  { nombre: "Ayudar a un amigo", tipo: "empatia", emos: ["tristeza", "miedo", "enojo"], ops: 3 },          //  8
  { nombre: "Caras nuevas", tipo: "cara", emos: TODAS, metas: FINAS, ops: 4 },                            //  9
  { nombre: "¿Cómo se siente? (emociones nuevas)", tipo: "situacion", emos: TODAS, metas: FINAS, ops: 3 }, // 10
  { nombre: "Caras que se parecen", tipo: "parecidas", ops: 3 },                                          // 11
  { nombre: "La mejor reacción", tipo: "reaccion", emos: Object.keys(REACCION), ops: 3 },                // 12
];
// Para el papá o la maestra: grupos de escalones
export const MODOS = {
  caras: [0, 1, 2, 8, 10],
  situaciones: [3, 4, 9],
  cuerpo: [5],
  hacer: [6, 7, 11],
};
export const inicio = edad => edad === null || edad <= 4 ? 0 : edad === 5 ? 1 : edad === 6 ? 2 : edad === 7 ? 3 : edad === 8 ? 5 : 6;

// ---------- Rondas ----------
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const opcionCara = emo => ({ id: emo, tipo: "cara", emo });
const opcionAccion = (a, p, bien, i) => ({ id: `${bien ? "b" : "m"}${i}`, tipo: "accion", e: a.e, t: chillon(llenar(a.t, p), p), bien, porque: llenar(a.porque, p) });
const may = t => t.charAt(0).toUpperCase() + t.slice(1);

/** Una ronda nueva del escalón `i`. `evitar`: emoción o situación de la ronda anterior (para no repetir). */
export function ronda(i, rnd = Math.random, evitar = "") {
  const es = ESCALONES[i];
  const p = azar(PERSONAS, rnd);
  if (es.tipo === "cara") {
    const metas = (es.metas || es.emos).filter(x => x !== evitar);
    const meta = azar(metas.length ? metas : es.emos, rnd);
    const otras = barajar(es.emos.filter(x => x !== meta), rnd).slice(0, es.ops - 1);
    return { tipo: "cara", escalon: i, meta, emo: meta, clave: meta,
      opciones: barajar([meta, ...otras], rnd).map(opcionCara),
      html: "", voz: `Tocá la cara de ${EMO[meta].n}.`,
      explica: `Esa es la cara de ${EMO[meta].n}: ${EMO[meta].rasgos}.` };
  }
  if (es.tipo === "situacion") {
    const lista = SITUACIONES.filter(s => (es.metas || es.emos).includes(s.emo) && s.t !== evitar);
    const s = azar(lista, rnd);
    const libres = es.emos.filter(x => x !== s.emo && !s.tambien.includes(x));
    const otras = barajar(libres, rnd).slice(0, es.ops - 1);
    const texto = llenar(s.t, p);
    return { tipo: "situacion", escalon: i, meta: s.emo, emo: s.emo, persona: p, sit: s, clave: s.t,
      opciones: barajar([s.emo, ...otras], rnd).map(opcionCara),
      escena: s.e, texto, html: texto, voz: `${texto} ¿Cómo se siente ${p.n}?`,
      explica: `${p.n} se siente ${adjDe(s.emo, p)}. ${EMO[s.emo].cuando}` };
  }
  if (es.tipo === "cuerpo") {
    const meta = azar(es.emos.filter(x => x !== evitar), rnd);
    const otras = barajar(es.emos.filter(x => x !== meta), rnd).slice(0, es.ops - 1);
    const texto = `Cuando ${EMO[meta].cuerpo}…`;
    return { tipo: "cuerpo", escalon: i, meta, emo: meta, clave: meta,
      opciones: barajar([meta, ...otras], rnd).map(opcionCara),
      escena: "💓", texto: may(EMO[meta].cuerpo) + ".", html: may(EMO[meta].cuerpo) + ".",
      voz: `Imaginá que ${EMO[meta].cuerpo}. ¿Qué estás sintiendo?`,
      explica: `Es ${EMO[meta].n}: ${EMO[meta].cuerpo}. ¡El cuerpo nos avisa lo que sentimos!` };
  }
  if (es.tipo === "accion" || es.tipo === "empatia" || es.tipo === "reaccion") {
    const emo = azar(es.emos.filter(x => x !== evitar), rnd);
    // La situación que cuenta qué pasó (de esa emoción); en «reacción» las de orgullo y alegría también sirven
    const s = azar(SITUACIONES.filter(x => x.emo === emo), rnd);
    const texto = llenar(s.t, p);
    let bien, malas;
    if (es.tipo === "accion") { bien = azar(AYUDA[emo], rnd); malas = barajar(NO_AYUDA[emo], rnd).slice(0, es.ops - 1); }
    else if (es.tipo === "empatia") { bien = azar(EMPATIA_BIEN[emo], rnd); malas = barajar(EMPATIA_MAL[emo], rnd).slice(0, es.ops - 1); }
    else { bien = REACCION[emo].bien; malas = REACCION[emo].mal.slice(0, es.ops - 1); }
    const opciones = barajar([opcionAccion(bien, p, true, 0), ...malas.map((a, k) => opcionAccion(a, p, false, k + 1))], rnd);
    const pregunta = es.tipo === "accion" ? `${p.n} se siente ${adjDe(emo, p)}. ¿Qué le puede ayudar?`
      : es.tipo === "empatia" ? `${p.n} se siente ${adjDe(emo, p)}. ¿Qué podés hacer vos para ayudar${p.f ? "la" : "lo"}?`
      : `${p.n} se siente ${adjDe(emo, p)}. ¿Qué es lo mejor que puede hacer?`;
    const elegida = opciones.find(o => o.bien);
    return { tipo: es.tipo, escalon: i, meta: elegida.id, emo, persona: p, sit: s, clave: s.t, opciones,
      escena: s.e, texto, html: `${texto} <b>${pregunta}</b>`, voz: `${texto} ${pregunta}`,
      explica: `¡Eso ayuda! ${may(elegida.porque)}. Todas las emociones están bien; lo importante es qué hacemos con ellas.` };
  }
  // parecidas: se ve una cara y hay que decir cuál de dos emociones parecidas es
  const [a, b] = azar(PARECIDAS.filter(([x, y]) => x !== evitar && y !== evitar), rnd);
  const [meta, parecida] = rnd() < 0.5 ? [a, b] : [b, a];
  const otra = azar(TODAS.filter(x => x !== a && x !== b), rnd);
  return { tipo: "parecidas", escalon: i, meta, emo: meta, parecida, clave: meta,
    opciones: barajar([meta, parecida, otra], rnd).map(x => ({ id: x, tipo: "nombre", emo: x })),
    html: "", voz: `Mirá esta cara. ¿Siente ${EMO[a].n} o ${EMO[b].n}?`, preguntaNombres: [a, b],
    explica: `Es ${EMO[meta].n}. ${diferencia(a, b)}` };
}

/** Qué decir cuando toca una opción equivocada (sin decir nunca que una emoción está mal). */
export function porQueNo(r, id) {
  const o = r.opciones.find(x => x.id === id);
  if (!o) return "";
  if (r.tipo === "cara") return `Esa es la cara de ${EMO[id].n}: ${EMO[id].rasgos}. Buscá la cara de ${EMO[r.meta].n}.`;
  if (r.tipo === "situacion") return `Esa es la cara de ${EMO[id].n}. Pensá: si eso te pasara a vos, ¿cómo te sentirías?`;
  if (r.tipo === "cuerpo") return `Con ${EMO[id].n}, ${EMO[id].cuerpo}. Escuchá otra vez qué siente el cuerpo.`;
  if (r.tipo === "parecidas") return id === r.parecida ? `¡Casi! ${diferencia(r.meta, r.parecida)}` : `No es ${EMO[id].n}. Mirá bien la cara: ${EMO[r.meta].rasgos}.`;
  // acciones
  const emo = EMO[r.emo].n;
  if (r.tipo === "empatia") return `Eso no le ayuda: ${o.porque}. ¿Qué te gustaría que hicieran por vos?`;
  return `Sentir ${emo} está bien. Pero eso no ayuda tanto: ${o.porque}. Buscá algo que sí ayude.`;
}

// ---------- Revisión (para las pruebas) ----------
// Copia letra por letra saltando lo que va entre < y >, para revisar el texto sin etiquetas
export function sinEtiquetas(t) {
  let s = "", dentro = false;
  for (const c of String(t)) {
    if (c === "<") dentro = true;
    else if (c === ">") dentro = false;
    else if (!dentro) s += c;
  }
  return s;
}

/** Revisa una ronda. Devuelve una lista de problemas (vacía = bien). */
export function revisarRonda(r) {
  const mal = [];
  const es = ESCALONES[r.escalon];
  const ids = r.opciones.map(o => o.id);
  if (ids.length !== es.ops) mal.push(`hay ${ids.length} opciones (esperaba ${es.ops})`);
  if (new Set(ids).size !== ids.length) mal.push("opciones repetidas");
  if (!ids.includes(r.meta)) mal.push("la respuesta no está entre las opciones");
  const textos = [r.voz, r.explica, r.html || "", ...r.opciones.map(o => o.t || "")].join(" | ");
  if (/\{|\}|undefined|null|NaN/.test(textos)) mal.push(`texto sin llenar: ${textos.slice(0, 120)}`);
  if (/<|>/.test(r.voz)) mal.push("la voz tiene etiquetas");
  if (/(^|[\s,.;:¿¡«])(de|a) el\s/u.test(sinEtiquetas(textos))) mal.push("«de el» o «a el»");
  for (const o of r.opciones) if (o.emo && !EMO[o.emo]) mal.push(`emoción desconocida ${o.emo}`);
  if (r.tipo === "situacion") {
    for (const o of r.opciones) if (o.id !== r.meta && (r.sit.tambien.includes(o.id) || o.id === r.sit.emo)) mal.push(`«${o.id}» también podría ser`);
  }
  if (["accion", "empatia", "reaccion"].includes(r.tipo)) {
    if (r.opciones.filter(o => o.bien).length !== 1) mal.push("no hay exactamente una opción que ayuda");
    if (new Set(r.opciones.map(o => o.t)).size !== r.opciones.length) mal.push("acciones repetidas");
  }
  if (r.tipo === "parecidas" && !ids.includes(r.parecida)) mal.push("falta la emoción parecida");
  // Concordancia: con una niña, ningún adjetivo masculino de la lista
  if (r.persona?.f) for (const k of TODAS) { const m = EMO[k].adj[0], f = EMO[k].adj[1]; if (m !== f && new RegExp(`\\b${m}\\b`).test(r.voz)) mal.push(`«${m}» con una niña`); }
  if (r.persona && !r.persona.f) for (const k of TODAS) { const m = EMO[k].adj[0], f = EMO[k].adj[1]; if (m !== f && new RegExp(`\\b${f}\\b`).test(r.voz)) mal.push(`«${f}» con un niño`); }
  return mal;
}

/** Revisa los datos: toda situación tiene al menos dos emociones posibles para opciones, etc. */
export function revisarDatos() {
  const mal = [];
  for (const s of SITUACIONES) {
    if (!EMO[s.emo]) mal.push(`situación con emoción desconocida: ${s.t}`);
    for (const t of s.tambien) if (!EMO[t] || t === s.emo) mal.push(`tambien raro en: ${s.t}`);
  }
  for (const e of TODAS) if (!SITUACIONES.some(s => s.emo === e)) mal.push(`sin situaciones: ${e}`);
  for (const e of Object.keys(REACCION)) if (!SITUACIONES.some(s => s.emo === e)) mal.push(`reacción sin situación: ${e}`);
  for (const [a, b] of PARECIDAS) if (!EMO[a] || !EMO[b]) mal.push(`parecidas raras ${a} ${b}`);
  return mal;
}
