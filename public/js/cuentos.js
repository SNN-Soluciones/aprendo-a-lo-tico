// 📖 Lógica de «Cuentos ticos: leo y entiendo» (sin pantalla, para poder probarla sola con node).
// Textos ORIGINALES escritos para este juego (cuentos, fábulas, avisos, recetas, instrucciones, adivinanzas, noticias,
// textos informativos y de opinión, crónicas, cartas y poemas),
// con preguntas de comprensión: literales, de inferencia, de vocabulario, de orden, idea principal, propósito,
// dato u opinión y lenguaje figurado. Cada pregunta dice dónde está la respuesta en el texto (`cita`).
//
// Pregunta con opciones: { t, q, ok, no: [distractores], cita?, explica? }
//   t: tipo (ver TIPOS) · ok: la respuesta correcta · cita: frase EXACTA del texto que la respalda
// Pregunta de orden:     { t: "secuencia", q, orden: [lo primero, …, lo último], explica? }

export const TIPOS = {
  literal: { emoji: "🔎", nombre: "Lo dice el texto" },
  sentimiento: { emoji: "❤️", nombre: "Sentimientos" },
  inferencia: { emoji: "💭", nombre: "Pensá un poquito" },
  vocabulario: { emoji: "📚", nombre: "¿Qué quiere decir?" },
  secuencia: { emoji: "🔢", nombre: "¿En qué orden?" },
  idea: { emoji: "💡", nombre: "Idea principal" },
  proposito: { emoji: "🎯", nombre: "¿Para qué es el texto?" },
  tipo: { emoji: "📄", nombre: "Tipo de texto" },
  opinion: { emoji: "🗣️", nombre: "¿Dato u opinión?" },
  figurado: { emoji: "🎨", nombre: "Lenguaje figurado" },
  ensenanza: { emoji: "🌟", nombre: "Enseñanza" },
};

// 🪜 Escalones: de textos de 3 o 4 oraciones con preguntas que están escritas tal cual en el texto (1°),
// hasta crónicas, cartas y poemas con lenguaje figurado y propósito del autor (6°).
export const ESCALONES = [
  { nombre: "Cuentos cortitos", grados: "1°", desc: "3 o 4 oraciones; ¿quién?, ¿dónde?, ¿qué?" },                   // 1
  { nombre: "Cuentos de un párrafo", grados: "1° y 2°", desc: "Un párrafo; también cómo se sentían" },                // 2
  { nombre: "Dos párrafos y el orden", grados: "2°", desc: "¿Qué pasó primero?, ordenar 3 hechos" },                 // 3
  { nombre: "Avisos, recetas y notas", grados: "2° y 3°", desc: "Textos para informar: datos, horas y para qué sirven" }, // 4
  { nombre: "Pensá un poquito", grados: "3°", desc: "¿Por qué?, palabras por el contexto y enseñanzas" },            // 5
  { nombre: "Más largos y en orden", grados: "3° y 4°", desc: "Tres párrafos, ordenar 4 hechos e idea principal" },  // 6
  { nombre: "Textos que informan", grados: "4°", desc: "Animales y noticias: idea principal, dato u opinión" },       // 7
  { nombre: "Personajes y enseñanzas", grados: "4° y 5°", desc: "Qué sienten y piensan los personajes, vocabulario" }, // 8
  { nombre: "Textos expositivos", grados: "5° y 6°", desc: "Propósito del texto, causas y consecuencias, opiniones" }, // 9
  { nombre: "Crónicas, cartas y poemas", grados: "6°", desc: "Lenguaje figurado, argumentos y propósito del autor" },  // 10
];

/** Escalón para empezar según la edad (sin exagerar: es mejor que suba solo). */
export const inicioPorEdad = edad => edad === null || edad === undefined || edad <= 7 ? 0 : edad === 8 ? 2 : edad === 9 ? 3 : edad === 10 ? 5 : edad === 11 ? 6 : 7;

// Bandas para escoger a mano (papá o maestra)
export const BANDAS = [
  { id: "1-2", nombre: "📗 1° y 2°", escalones: [0, 1, 2, 3] },
  { id: "3-4", nombre: "📘 3° y 4°", escalones: [4, 5, 6] },
  { id: "5-6", nombre: "📙 5° y 6°", escalones: [7, 8, 9] },
];

const op = (t, q, ok, no, cita, explica) => ({ t, q, ok, no, cita, explica });
const sec = (q, orden, explica) => ({ t: "secuencia", q, orden, explica });
const ORDENA = "Ordená lo que pasó: tocá primero lo que pasó primero.";

// Tipos de texto: cómo se llama en pantalla, cómo se dice en «Leé el cuento» y si va en versos
export const CLASES = {
  cuento: { nombre: "Cuento", que: "el cuento" },
  fabula: { nombre: "Fábula", que: "la fábula" },
  informativo: { nombre: "Texto informativo", que: "el texto" },
  receta: { nombre: "Receta", que: "la receta" },
  instrucciones: { nombre: "Instrucciones", que: "las instrucciones" },
  aviso: { nombre: "Aviso", que: "el aviso" },
  noticia: { nombre: "Noticia", que: "la noticia" },
  carta: { nombre: "Carta", que: "la carta" },
  poema: { nombre: "Poema", que: "el poema", verso: true },
  adivinanza: { nombre: "Adivinanzas", que: "las adivinanzas", verso: true },
  opinion: { nombre: "Texto de opinión", que: "el texto" },
  cronica: { nombre: "Crónica", que: "la crónica" },
};

// tipo: una de las CLASES
export const TEXTOS = [
  // ---------- 1. Cuentos cortitos (1°) ----------
  { id: "lolo", escalon: 0, tipo: "cuento", emoji: "🦥", titulo: "Lolo llega tarde",
    parrafos: ["Lolo es un perezoso que vive en un guarumo. Todos los días sale muy temprano para la escuela, porque camina despacito. Hoy se quedó dormido y llegó cuando ya había sonado la campana. La maestra le sonrió y le dijo: «Mañana salí más temprano, Lolo»."],
    preguntas: [
      op("literal", "¿Dónde vive Lolo?", "En un guarumo", ["En una cueva", "En el río"], "vive en un guarumo"),
      op("literal", "¿Por qué llegó tarde Lolo hoy?", "Porque se quedó dormido", ["Porque se perdió", "Porque estaba lloviendo"], "Hoy se quedó dormido"),
      op("literal", "¿Qué hizo la maestra cuando Lolo llegó?", "Le sonrió y le dio un consejo", ["Lo regañó delante de todos", "Le pidió que fuera a la dirección"], "La maestra le sonrió"),
    ] },
  { id: "rubi", escalon: 0, tipo: "cuento", emoji: "🦜", titulo: "La pluma de Rubí",
    parrafos: ["Rubí es una lapa roja. Un día de mucho viento perdió una pluma azul de su ala. La buscó en el almendro, en el río y en el zacate. Al final la encontró en el sombrero de don Toño, que la había guardado para ella."],
    preguntas: [
      op("literal", "¿De qué color es la pluma que perdió Rubí?", "Azul", ["Roja", "Amarilla"], "perdió una pluma azul"),
      op("literal", "¿Cómo era el día en que Rubí perdió la pluma?", "Un día de mucho viento", ["Un día de lluvia", "Una noche oscura"], "Un día de mucho viento"),
      op("literal", "¿Dónde encontró Rubí la pluma?", "En el sombrero de don Toño", ["En las ramas del almendro grande", "En el zacate junto al río"], "la encontró en el sombrero de don Toño",
        "Rubí buscó en el almendro y en el río, pero ahí no estaba."),
    ] },
  { id: "mangos", escalon: 0, tipo: "cuento", emoji: "🥭", titulo: "Los mangos de la abuela",
    parrafos: ["La abuela Rosa tiene un palo de mango en el patio. En marzo, el árbol se llena de mangos amarillos. Sofía y su hermano Diego los recogen en un balde. Después, la abuela les hace fresco de mango."],
    preguntas: [
      op("literal", "¿Qué árbol tiene la abuela en el patio?", "Un palo de mango", ["Un palo de naranja", "Un almendro"], "tiene un palo de mango en el patio"),
      op("literal", "¿Quiénes recogen los mangos?", "Sofía y su hermano Diego", ["La abuela Rosa y su nieta Sofía", "Diego y su papá"], "Sofía y su hermano Diego los recogen"),
      op("literal", "¿Qué les hace la abuela con los mangos?", "Fresco de mango", ["Un queque de mango", "Ensalada de frutas"], "les hace fresco de mango"),
    ] },
  { id: "michi", escalon: 0, tipo: "cuento", emoji: "🐱", titulo: "Michi y el sol",
    parrafos: ["Michi es una gata blanca con manchas negras. Todas las mañanas se acuesta en la ventana a tomar el sol. Cuando llueve, se mete debajo de la cama de Ana. En la noche duerme en un canasto junto a la cocina."],
    preguntas: [
      op("literal", "¿Cómo es Michi?", "Blanca con manchas negras", ["Negra con manchas blancas", "Gris con rayas"], "es una gata blanca con manchas negras"),
      op("literal", "¿Qué hace Michi cuando llueve?", "Se mete debajo de la cama", ["Sale a jugar al patio", "Se sube al techo de la casa"], "se mete debajo de la cama de Ana"),
      op("literal", "¿Dónde duerme Michi en la noche?", "En un canasto", ["En la ventana de la sala", "En la cama de Ana"], "duerme en un canasto junto a la cocina"),
    ] },
  { id: "charco", escalon: 0, tipo: "cuento", emoji: "🐸", titulo: "La rana del charco",
    parrafos: ["Después del aguacero, se formó un charco en el patio de la escuela. Mateo vio una rana verde con ojos rojos sentada en una hoja. La rana dio un salto y se metió al agua. Mateo corrió a contarle a la maestra."],
    preguntas: [
      op("literal", "¿Cuándo se formó el charco?", "Después del aguacero", ["Con mucho sol", "Durante la noche de Navidad"], "Después del aguacero"),
      op("literal", "¿De qué color eran los ojos de la rana?", "Rojos", ["Amarillos", "Azules"], "una rana verde con ojos rojos"),
      op("literal", "¿Qué hizo la rana?", "Saltó al agua", ["Se quedó dormida en la hoja", "Cantó"], "La rana dio un salto y se metió al agua"),
      op("literal", "¿A quién le contó Mateo?", "A la maestra", ["A su mamá", "Al conserje de la escuela"], "corrió a contarle a la maestra"),
    ] },
  { id: "bus7", escalon: 0, tipo: "cuento", emoji: "🚌", titulo: "El bus de las siete",
    parrafos: ["Mía y su mamá esperan el bus en la parada. El bus pasa a las siete de la mañana. Mía paga el pasaje con monedas y se sienta en la ventana. Desde ahí ve las vacas, el río y la iglesia del pueblo."],
    preguntas: [
      op("literal", "¿A qué hora pasa el bus?", "A las siete de la mañana", ["A las ocho de la noche", "A las doce"], "El bus pasa a las siete de la mañana"),
      op("literal", "¿Con qué paga Mía el pasaje?", "Con monedas", ["Con un billete grande", "Con una tarjeta"], "paga el pasaje con monedas"),
      op("literal", "¿Qué ve Mía desde la ventana?", "Las vacas, el río y la iglesia", ["El mar, los barcos y la playa", "Los carros, los edificios y el parque"], "ve las vacas, el río y la iglesia del pueblo"),
    ] },
  { id: "pinta", escalon: 0, tipo: "cuento", emoji: "🐔", titulo: "La gallina Pinta",
    parrafos: ["La gallina Pinta vive en la finca del abuelo Juan. Cada mañana pone un huevo en el nido de paja. Tomás va con una canasta a recogerlo. Con los huevos, la abuela hace tortas de huevo para el almuerzo."],
    preguntas: [
      op("literal", "¿Dónde vive la gallina Pinta?", "En la finca del abuelo", ["En la casa de Tomás en el pueblo", "En la escuela"], "vive en la finca del abuelo Juan"),
      op("literal", "¿Dónde pone Pinta el huevo?", "En el nido de paja", ["En la canasta de Tomás", "Debajo del árbol de mango"], "pone un huevo en el nido de paja"),
      op("literal", "¿Qué hace la abuela con los huevos?", "Tortas de huevo", ["Un queque de vainilla", "Un flan"], "hace tortas de huevo para el almuerzo"),
    ] },
  { id: "colibri", escalon: 0, tipo: "cuento", emoji: "🌺", titulo: "El colibrí y la flor",
    parrafos: ["Un colibrí verde llegó al jardín de doña Elena. Movía las alas tan rápido que casi no se veían. Metió el pico largo en una flor roja para tomar el néctar. Después se fue volando hacia la cerca de amapolas."],
    preguntas: [
      op("literal", "¿De qué color era el colibrí?", "Verde", ["Rojo", "Amarillo"], "Un colibrí verde"),
      op("literal", "¿Cómo movía las alas?", "Muy rápido", ["Muy despacio", "No las movía nada"], "Movía las alas tan rápido que casi no se veían"),
      op("literal", "¿Dónde metió el pico?", "En una flor roja", ["En el agua de la pila", "En la tierra"], "Metió el pico largo en una flor roja"),
    ] },

  // ---------- 2. Cuentos de un párrafo (1° y 2°) ----------
  { id: "bola", escalon: 1, tipo: "cuento", emoji: "⚽", titulo: "La bola en el techo",
    parrafos: ["En el recreo, Mateo pateó la bola muy fuerte y quedó en el techo del aula. Todos se quedaron callados mirando hacia arriba. Mateo estaba muy triste, porque la bola era nueva. Entonces llegó don Carlos, el conserje, con una escalera. Bajó la bola y todos aplaudieron."],
    preguntas: [
      op("literal", "¿Dónde quedó la bola?", "En el techo del aula", ["En el árbol del patio", "En la calle"], "quedó en el techo del aula"),
      op("sentimiento", "¿Cómo se sentía Mateo?", "Triste", ["Feliz", "Enojado"], "Mateo estaba muy triste", "Y estaba triste porque la bola era nueva."),
      op("literal", "¿Quién bajó la bola?", "Don Carlos, el conserje", ["La maestra de Mateo", "Un compañero de sexto grado"], "llegó don Carlos, el conserje, con una escalera"),
      op("literal", "¿Qué hicieron todos al final?", "Aplaudieron", ["Se fueron para la casa", "Se pusieron a llorar"], "todos aplaudieron"),
    ] },
  { id: "yiguirro", escalon: 1, tipo: "cuento", emoji: "🐦", titulo: "El yigüirro y la lluvia",
    parrafos: ["Una mañana de abril, Valeria escuchó cantar a un yigüirro en el jardín. Su abuelo sonrió y le dijo que ese canto anunciaba las lluvias. Valeria no le creyó mucho. Pero esa misma tarde cayó un aguacero tan fuerte que tuvieron que entrar la ropa corriendo. «¡El yigüirro tenía razón!», dijo Valeria riéndose."],
    preguntas: [
      op("literal", "¿En qué mes escuchó Valeria al yigüirro?", "En abril", ["En diciembre", "En setiembre"], "Una mañana de abril"),
      op("literal", "Según el abuelo, ¿qué anunciaba el canto del yigüirro?", "Las lluvias", ["Los días de sol", "La Navidad"], "ese canto anunciaba las lluvias"),
      op("literal", "¿Qué pasó esa misma tarde?", "Cayó un aguacero muy fuerte", ["Salió el sol", "Hubo un temblor"], "cayó un aguacero tan fuerte"),
      op("vocabulario", "¿Qué es un «aguacero»?", "Una lluvia fuerte", ["Un río muy crecido", "Un vaso grande de agua"], "cayó un aguacero tan fuerte que tuvieron que entrar la ropa corriendo",
        "Si tuvieron que entrar la ropa corriendo, era porque llovía fuerte."),
    ] },
  { id: "vuelto", escalon: 1, tipo: "cuento", emoji: "🏪", titulo: "El vuelto de Andrés",
    parrafos: ["Andrés fue a la pulpería de doña Marta a comprar pan y leche. Pagó con un billete de ₡5 000. Doña Marta le dio el vuelto y Andrés lo contó con cuidado. Se dio cuenta de que le había dado ₡1 000 de más y se los devolvió. Doña Marta le regaló un confite por ser tan honrado."],
    preguntas: [
      op("literal", "¿Qué fue a comprar Andrés?", "Pan y leche", ["Arroz y frijoles", "Confites"], "a comprar pan y leche"),
      op("literal", "¿Qué hizo Andrés con la plata que le dieron de más?", "La devolvió", ["Se la guardó", "Compró más pan"], "se los devolvió"),
      op("vocabulario", "Una persona «honrada» es una persona que…", "Devuelve lo que no es suyo", ["Corre rápido", "Sabe contar"], "por ser tan honrado",
        "Doña Marta le dijo honrado porque Andrés devolvió la plata que no era suya."),
      op("sentimiento", "¿Cómo creés que se sintió doña Marta?", "Contenta con Andrés", ["Enojada con Andrés", "Triste por el confite"], "le regaló un confite",
        "Si le regaló un confite, es porque le alegró lo que hizo Andrés."),
    ] },
  { id: "diente", escalon: 1, tipo: "cuento", emoji: "🦷", titulo: "El diente de Pablo",
    parrafos: ["Pablo tenía un diente flojo desde hacía una semana. Una tarde, mordiendo una manzana, ¡el diente se cayó! Pablo se asustó un poquito, pero después se rio frente al espejo. Esa noche puso el diente debajo de la almohada para el ratón Pérez. En la mañana encontró una moneda brillante y una notita que decía: «¡Cepillate bien!»."],
    preguntas: [
      op("literal", "¿Desde cuándo tenía Pablo el diente flojo?", "Desde hacía una semana", ["Desde hacía un año", "Desde esa tarde"], "desde hacía una semana"),
      op("sentimiento", "¿Cómo se sintió Pablo cuando se le cayó el diente?", "Un poquito asustado", ["Muy enojado", "Aburrido y con sueño"], "Pablo se asustó un poquito"),
      op("literal", "¿Dónde puso Pablo el diente?", "Debajo de la almohada", ["En un vaso con agua en la mesa de noche", "En su mochila"], "puso el diente debajo de la almohada"),
      op("inferencia", "¿Qué le pedía la notita a Pablo?", "Que se lavara bien los dientes", ["Que comiera más manzanas", "Que se durmiera más temprano todas las noches"], "«¡Cepillate bien!»",
        "Cepillarse es lavarse los dientes con el cepillo."),
    ] },
  { id: "octubre", escalon: 1, tipo: "cuento", emoji: "☔", titulo: "Lluvia de octubre",
    parrafos: ["En octubre llueve casi todas las tardes. Emma se pone las botas de hule y abre su sombrilla amarilla para ir a la escuela. En el camino salta todos los charcos, ¡plaf, plaf, plaf! Cuando llega, tiene las medias secas, porque las botas no dejan pasar el agua. La maestra le dice que fue muy precavida."],
    preguntas: [
      op("literal", "¿De qué color es la sombrilla de Emma?", "Amarilla", ["Roja", "Azul"], "su sombrilla amarilla"),
      op("literal", "¿Qué hace Emma en el camino?", "Salta todos los charcos", ["Corre para no mojarse", "Se mete debajo de un árbol"], "salta todos los charcos"),
      op("inferencia", "¿Por qué Emma llegó con las medias secas?", "Porque las botas no dejan pasar el agua", ["Porque ese día no llovió en todo el camino", "Porque se fue en carro"], "las botas no dejan pasar el agua"),
      op("vocabulario", "Ser «precavida» es…", "Prepararse antes para evitar problemas", ["Llegar tarde a todo", "Tenerle miedo a la lluvia"], "fue muy precavida",
        "Emma se preparó con botas y sombrilla antes de salir."),
    ] },
  { id: "tortillas", escalon: 1, tipo: "cuento", emoji: "🌽", titulo: "Las tortillas de la abuela",
    parrafos: ["Los sábados, la abuela Toya hace tortillas palmeadas. Primero prepara la masa de maíz y luego hace bolitas. Después las aplana con las manos: ¡pla, pla, pla! Isabel le ayuda a ponerlas en el comal caliente. El olor llega hasta la calle y los vecinos preguntan si ya están listas."],
    preguntas: [
      op("literal", "¿Qué día hace tortillas la abuela?", "Los sábados", ["Los domingos", "Todos los días"], "Los sábados"),
      op("literal", "¿De qué es la masa?", "De maíz", ["De trigo", "De arroz"], "la masa de maíz"),
      op("literal", "¿Dónde pone Isabel las tortillas?", "En el comal caliente", ["En el horno", "En un plato frío sobre la mesa"], "ponerlas en el comal caliente"),
      op("inferencia", "¿Por qué los vecinos preguntan si ya están listas?", "Porque les llega el olor y se les antojan", ["Porque la abuela las vende en la calle", "Porque oyen a Isabel gritar"], "El olor llega hasta la calle"),
    ] },
  { id: "morfo", escalon: 1, tipo: "cuento", emoji: "🦋", titulo: "La mariposa azul",
    parrafos: ["En el paseo al bosque, Gabriel vio una mariposa enorme de color azul brillante. Cuando cerró las alas, por debajo era café con círculos que parecían ojos. «¡Desapareció!», gritó Gabriel. El guía le explicó que así la mariposa se esconde de los pájaros. Gabriel quedó maravillado."],
    preguntas: [
      op("literal", "¿De qué color era la mariposa con las alas abiertas?", "Azul brillante", ["Amarilla con negro", "Roja"], "de color azul brillante"),
      op("literal", "¿Cómo era por debajo?", "Café con círculos como ojos", ["Verde con rayas", "Blanca con puntitos"], "por debajo era café con círculos que parecían ojos"),
      op("inferencia", "¿Por qué Gabriel gritó «¡Desapareció!»?", "Porque al cerrar las alas ya no se veía azul", ["Porque la mariposa se fue volando muy, muy lejos", "Porque se la comió un pájaro"], "Cuando cerró las alas"),
      op("vocabulario", "«Maravillado» quiere decir…", "Muy sorprendido y contento", ["Muy cansado", "Con miedo"], "Gabriel quedó maravillado"),
    ] },
  { id: "cumple", escalon: 1, tipo: "cuento", emoji: "🎂", titulo: "El cumpleaños de Sami",
    parrafos: ["Sami cumplió ocho años y su familia le hizo una fiesta en el corredor. Hubo queque de chocolate, gelatina y una piñata con forma de perezoso. Cuando le cantaron, Sami sopló las velas de un solo soplido. Su prima Lucía le regaló un libro de dinosaurios. Sami dijo que fue el mejor día del año."],
    preguntas: [
      op("literal", "¿Cuántos años cumplió Sami?", "Ocho", ["Siete", "Diez"], "cumplió ocho años"),
      op("literal", "¿Qué forma tenía la piñata?", "De perezoso", ["De estrella", "De carro rojo"], "una piñata con forma de perezoso"),
      op("literal", "¿Qué le regaló Lucía?", "Un libro de dinosaurios", ["Un queque de chocolate con fresas", "Una bola"], "le regaló un libro de dinosaurios"),
      op("sentimiento", "¿Cómo se sintió Sami?", "Muy feliz", ["Triste", "Aburrido"], "fue el mejor día del año"),
    ] },

  // ---------- 3. Dos párrafos y el orden (2°) ----------
  { id: "tren", escalon: 2, tipo: "cuento", emoji: "🚂", titulo: "El tren a Puntarenas",
    parrafos: [
      "El abuelo Memo cuenta que, cuando era niño, viajaba en tren de San José a Puntarenas. Salían muy de mañana y el viaje duraba varias horas. Por la ventana veía potreros, ríos y cafetales.",
      "Al llegar, lo primero que hacía era correr a ver el mar. Después se comía un churchill bien frío en el Paseo de los Turistas. En la tarde volvían en el mismo tren, cansados pero felices.",
    ],
    preguntas: [
      op("literal", "¿A dónde viajaba en tren el abuelo Memo?", "A Puntarenas", ["A Puerto Limón", "A Cartago"], "de San José a Puntarenas"),
      op("literal", "¿Qué veía el abuelo por la ventana del tren?", "Potreros, ríos y cafetales", ["Edificios, carros y semáforos", "Volcanes, playas y barcos"], "veía potreros, ríos y cafetales"),
      sec(ORDENA, ["Viajaba en tren desde San José", "Corría a ver el mar", "Se comía un churchill"]),
      op("sentimiento", "¿Cómo volvían en la tarde?", "Cansados pero felices", ["Tristes y enojados", "Con mucho frío"], "cansados pero felices"),
    ] },
  { id: "semilla", escalon: 2, tipo: "cuento", emoji: "🌱", titulo: "La semilla de Camila",
    parrafos: [
      "En la escuela, la maestra le dio a cada niño una semilla de frijol. Camila la puso en un vasito con algodón mojado y lo dejó junto a la ventana.",
      "Todos los días le echaba un poquito de agua. A los pocos días salió una raíz blanca y después dos hojitas verdes. Camila estaba tan orgullosa que le tomó una foto para enseñársela a su mamá.",
    ],
    preguntas: [
      op("literal", "¿Dónde puso Camila la semilla?", "En un vasito con algodón", ["En una maceta con tierra negra", "En el jardín de la escuela"], "en un vasito con algodón mojado"),
      op("literal", "¿Qué le echaba Camila todos los días?", "Un poquito de agua", ["Un poco de azúcar", "Mucha tierra"], "le echaba un poquito de agua"),
      sec(ORDENA, ["Camila puso la semilla en un vasito", "Salió una raíz blanca", "Salieron dos hojitas verdes"]),
      op("vocabulario", "Camila estaba «orgullosa». Eso quiere decir que estaba…", "Feliz por lo que logró", ["Asustada por la raíz", "Cansada de echarle agua"], "estaba tan orgullosa que le tomó una foto",
        "Le tomó una foto para enseñarla: estaba feliz porque su semilla creció."),
    ] },
  { id: "canelo", escalon: 2, tipo: "cuento", emoji: "🐶", titulo: "¿Dónde está Canelo?",
    parrafos: [
      "Una tarde, el perro Canelo se escapó por el portón abierto. Lucía y su papá lo buscaron por todo el barrio. Preguntaron en la pulpería, en la plaza y en la iglesia, pero nadie lo había visto.",
      "Ya estaba oscureciendo cuando escucharon unos ladridos detrás de la escuela. ¡Era Canelo, jugando con otros perros! Lucía lo abrazó fuerte y esa noche cerraron bien el portón.",
    ],
    preguntas: [
      op("literal", "¿Por dónde se escapó Canelo?", "Por el portón abierto", ["Por una ventana", "Por un hueco de la cerca"], "se escapó por el portón abierto"),
      sec(ORDENA, ["Canelo se escapó", "Preguntaron en la pulpería", "Escucharon ladridos detrás de la escuela"]),
      op("literal", "¿Dónde encontraron a Canelo?", "Detrás de la escuela", ["En la pulpería del barrio", "En la iglesia"], "detrás de la escuela",
        "En la pulpería y en la iglesia solo preguntaron, pero nadie lo había visto."),
      op("inferencia", "¿Por qué creés que esa noche cerraron bien el portón?", "Para que Canelo no se volviera a escapar", ["Porque esa noche iba a llover muy fuerte", "Porque tenían miedo de los ladrones"], "esa noche cerraron bien el portón",
        "Canelo se había escapado porque el portón estaba abierto."),
    ] },
  { id: "monos", escalon: 2, tipo: "cuento", emoji: "🐒", titulo: "Los monos de la playa",
    parrafos: [
      "El domingo, la familia de Iker fue a la playa de Manuel Antonio. Pusieron las toallas debajo de un árbol y dejaron el bolso con la comida en la arena. Iker y su hermana se metieron al mar a jugar con las olas.",
      "Cuando volvieron, ¡un mono cariblanco estaba abriendo el bolso! Se llevó un banano y subió al árbol. El guarda del parque les explicó que no hay que darles comida a los monos, porque la comida de las personas les hace daño. Desde ese día, Iker guarda bien la comida cuando va a la playa.",
    ],
    preguntas: [
      op("literal", "¿A qué playa fueron?", "A Manuel Antonio", ["A Tamarindo", "A Puerto Viejo"], "la playa de Manuel Antonio"),
      sec(ORDENA, ["Pusieron las toallas debajo de un árbol", "Iker y su hermana se metieron al mar", "Un mono abrió el bolso de la comida"]),
      op("literal", "¿Por qué no hay que darles comida a los monos?", "Porque nuestra comida les hace daño", ["Porque ya tienen suficiente comida en el bosque", "Porque los monos no comen frutas"], "la comida de las personas les hace daño"),
      op("ensenanza", "¿Qué aprendió Iker?", "A guardar bien la comida en la playa", ["A no meterse más al mar", "A tenerles miedo a los monos"], "Iker guarda bien la comida"),
    ] },
  { id: "primerdia", escalon: 2, tipo: "cuento", emoji: "🏫", titulo: "El primer día de clases",
    parrafos: [
      "Era el primer día de clases y Emma tenía un nudo en la panza. No conocía a nadie en su nueva escuela. Su papá le dio un abrazo en el portón y le dijo: «Vas a ver que todo sale bien».",
      "En el aula, la maestra la sentó junto a Valentina, que tenía un estuche igual al suyo. Las dos se rieron al darse cuenta. En el recreo compartieron sus meriendas y jugaron quedó con otros niños. Al salir, Emma corrió donde su papá: «¡Mañana quiero venir temprano!».",
    ],
    preguntas: [
      op("figurado", "Emma «tenía un nudo en la panza». Eso quiere decir que estaba…", "Nerviosa", ["Llena de comer", "Enferma del estómago"], "tenía un nudo en la panza",
        "Es una forma de decir que sentía nervios."),
      op("literal", "¿Por qué se rieron Emma y Valentina?", "Porque tenían el estuche igual", ["Porque la maestra contó un chiste", "Porque Emma se cayó"], "tenía un estuche igual al suyo"),
      sec(ORDENA, ["El papá abrazó a Emma en el portón", "La maestra la sentó junto a Valentina", "Compartieron sus meriendas en el recreo"]),
      op("sentimiento", "¿Cómo se sentía Emma al final del día?", "Contenta y con ganas de volver", ["Triste y con ganas de cambiarse de escuela", "Igual de nerviosa"], "«¡Mañana quiero venir temprano!»"),
    ] },
  { id: "trompo", escalon: 2, tipo: "cuento", emoji: "🌀", titulo: "El trompo del abuelo",
    parrafos: [
      "El abuelo Chalo le regaló a Diego un trompo de madera. «Yo jugaba con uno igualito cuando tenía tu edad», le contó. Le enseñó a enrollar la cuerda bien apretada, desde la punta hacia arriba.",
      "Diego lo intentó muchas veces, pero el trompo caía de lado y no bailaba. El abuelo le dijo que tirara con fuerza y soltara la cuerda al final. Al décimo intento, ¡el trompo bailó en el piso del corredor! Diego y el abuelo celebraron como si fuera un gol.",
    ],
    preguntas: [
      op("literal", "¿De qué era el trompo?", "De madera", ["De plástico", "De metal"], "un trompo de madera"),
      sec(ORDENA, ["El abuelo le regaló el trompo", "Le enseñó a enrollar la cuerda", "El trompo bailó en el corredor"]),
      op("literal", "¿Qué consejo le dio el abuelo?", "Tirar con fuerza y soltar la cuerda al final", ["Tirarlo despacito, sin enrollarle bien la cuerda", "Jugar en la calle"], "le dijo que tirara con fuerza y soltara la cuerda al final"),
      op("figurado", "«Celebraron como si fuera un gol» quiere decir que…", "Celebraron con mucha alegría", ["Estaban jugando fútbol en el corredor", "Se pusieron tristes"], "celebraron como si fuera un gol"),
    ] },
  { id: "papalote", escalon: 2, tipo: "cuento", emoji: "🪁", titulo: "El papalote de diciembre",
    parrafos: [
      "En diciembre, en el Valle Central sopla mucho viento. Por eso Sofía y su tío hicieron un papalote con papel de colores, palitos de bambú y una cola larga de tela.",
      "Fueron a la plaza, lejos de los cables de la luz. El tío sostuvo el papalote y Sofía corrió con el hilo. De pronto, el viento lo levantó y subió tan alto que parecía un pajarito. Sofía no quería volver a la casa.",
    ],
    preguntas: [
      op("literal", "¿Por qué hicieron el papalote en diciembre?", "Porque sopla mucho viento", ["Porque era el cumpleaños de Sofía", "Porque había vacaciones de medio año"], "En diciembre, en el Valle Central sopla mucho viento"),
      op("literal", "¿Con qué hicieron el papalote?", "Papel, bambú y tela", ["Plástico, alambre y cinta", "Cartón, lana y madera"], "papel de colores, palitos de bambú y una cola larga de tela"),
      op("inferencia", "¿Por qué fueron lejos de los cables de la luz?", "Para que el papalote no se enredara en ellos", ["Porque ahí no había viento", "Porque los cables hacen mucho ruido con el viento"], "lejos de los cables de la luz",
        "Un papalote enredado en los cables es peligroso y se pierde."),
      sec(ORDENA, ["Hicieron el papalote", "Fueron a la plaza", "El viento levantó el papalote"]),
    ] },
  { id: "pollitos", escalon: 2, tipo: "cuento", emoji: "🐣", titulo: "Los pollitos de la Colorada",
    parrafos: [
      "La gallina Colorada se pasó tres semanas echada sobre sus huevos en un rincón del gallinero. Casi no se levantaba, ni siquiera para comer. Martina le llevaba agua y maíz todos los días.",
      "Una mañana, Martina escuchó un «pío, pío» muy suave. Se asomó con cuidado y vio un pollito amarillo saliendo del cascarón. Al mediodía ya había siete pollitos caminando detrás de su mamá.",
    ],
    preguntas: [
      op("literal", "¿Cuánto tiempo estuvo la gallina sobre los huevos?", "Tres semanas", ["Tres días", "Tres meses"], "se pasó tres semanas echada"),
      op("literal", "¿Qué le llevaba Martina?", "Agua y maíz", ["Pan y leche", "Arroz y frijoles"], "le llevaba agua y maíz"),
      sec(ORDENA, ["La gallina se echó sobre los huevos", "Martina escuchó un «pío, pío»", "Siete pollitos caminaban detrás de su mamá"]),
      op("inferencia", "¿Por qué Martina se asomó con cuidado?", "Para no asustar a la gallina y a los pollitos", ["Porque estaba muy oscuro", "Porque la gallina picaba"], "Se asomó con cuidado",
        "Los pollitos acababan de nacer y la gallina los estaba cuidando."),
    ] },

  // ---------- 4. Avisos, recetas y notas (2° y 3°) ----------
  { id: "feria", escalon: 3, tipo: "aviso", emoji: "📢", titulo: "Feria del Agricultor de Barrio Las Flores",
    parrafos: [
      "Todos los sábados, de 6 de la mañana a 12 del mediodía, en el parqueo del gimnasio.",
      "Encontrá frutas, verduras, huevos, queso tierno y tamales, frescos y directo del productor. Traé tu propia bolsa: ¡así cuidamos el ambiente!",
    ],
    preguntas: [
      op("literal", "¿Qué día es la feria?", "Los sábados", ["Los domingos", "Los lunes"], "Todos los sábados"),
      op("literal", "¿A qué hora termina la feria?", "A las 12 del mediodía", ["A las 6 de la mañana", "A las 3 de la tarde en punto"], "a 12 del mediodía",
        "A las 6 de la mañana es cuando empieza."),
      op("literal", "¿Por qué piden traer tu propia bolsa?", "Para cuidar el ambiente", ["Porque no venden bolsas", "Porque las bolsas son caras"], "¡así cuidamos el ambiente!"),
      op("proposito", "¿Para qué sirve este texto?", "Para invitar a ir a la feria", ["Para contar un cuento", "Para enseñar a sembrar"], null,
        "Es un aviso: dice cuándo, dónde y qué hay, para que la gente vaya."),
    ] },
  { id: "arroz", escalon: 3, tipo: "receta", emoji: "🍚", titulo: "Arroz con leche",
    parrafos: [
      "Ingredientes: 1 taza de arroz, 2 tazas de agua, 4 tazas de leche, 1 taza de azúcar, 2 rajas de canela y unos clavos de olor.",
      "Preparación: Primero, cociná el arroz en el agua con la canela y los clavos de olor hasta que se suavice. Después, agregá la leche y el azúcar. Luego, dejalo a fuego bajo, moviendo de vez en cuando, hasta que espese. Por último, servilo frío o caliente.",
      "¡Pedile ayuda a un adulto para usar la cocina!",
    ],
    preguntas: [
      op("literal", "¿Cuántas tazas de leche lleva?", "4", ["2", "1"], "4 tazas de leche"),
      op("literal", "¿Qué se hace primero?", "Cocinar el arroz en el agua con canela", ["Agregar la leche y el azúcar a la olla", "Servirlo frío o caliente en un plato"], "Primero, cociná el arroz en el agua con la canela"),
      sec("Ordená los pasos de la receta:", ["Cocinar el arroz con agua, canela y clavos", "Agregar la leche y el azúcar", "Dejarlo a fuego bajo hasta que espese"]),
      op("inferencia", "¿Por qué dice que le pidás ayuda a un adulto?", "Porque usar la cocina puede ser peligroso", ["Porque la olla de arroz pesa muchísimo", "Porque los niños no saben medir las tazas"], "¡Pedile ayuda a un adulto para usar la cocina!",
        "En la cocina hay fuego y ollas calientes."),
      op("proposito", "¿Para qué sirve este texto?", "Para explicar cómo se prepara una comida", ["Para contar una historia", "Para vender arroz"], null,
        "Una receta dice los ingredientes y los pasos para preparar algo."),
    ] },
  { id: "faroles", escalon: 3, tipo: "aviso", emoji: "🏮", titulo: "Nota para las familias",
    parrafos: [
      "Queridas familias de segundo grado:",
      "En la noche del 14 de setiembre haremos el desfile de faroles para celebrar la Independencia. Cada niño debe traer su farol hecho en casa, con material reciclado. Nos reuniremos a las 6 de la tarde frente a la escuela.",
      "Muchas gracias. Niña Ana",
    ],
    preguntas: [
      op("literal", "¿Qué día es el desfile de faroles?", "El 14 de setiembre", ["El 15 de setiembre", "El 25 de julio"], "14 de setiembre"),
      op("literal", "¿Qué tiene que traer cada niño?", "Un farol hecho en casa", ["Una bandera", "Un tambor"], "su farol hecho en casa"),
      op("literal", "¿Qué se celebra con el desfile?", "La Independencia", ["El Día de la Madre", "El Día del Niño"], "para celebrar la Independencia"),
      op("inferencia", "¿Quién escribió la nota?", "La maestra, la niña Ana", ["Una mamá de segundo grado", "El director de la escuela"], "Niña Ana",
        "La nota está firmada por la niña Ana y les escribe a las familias de su grado: es la maestra."),
    ] },
  { id: "pinto", escalon: 3, tipo: "receta", emoji: "🍳", titulo: "Gallo pinto",
    parrafos: [
      "Ingredientes: 2 tazas de arroz cocinado del día anterior, 1 taza y media de frijoles negros cocinados, un poquito del caldo de los frijoles, media cebolla, medio chile dulce, culantro picado, una cucharada de aceite y salsa inglesa al gusto.",
      "Preparación: Primero, picá la cebolla y el chile dulce bien finitos. Después, sofreílos en el aceite hasta que se suavicen. Luego, agregá los frijoles con un poquito del caldo y dejalos hervir un momento. Por último, echá el arroz y el culantro, y revolvé hasta que todo quede pintadito.",
      "¡Pedile a un adulto que te ayude con el fuego! Se sirve con huevo, natilla o plátano maduro.",
    ],
    preguntas: [
      op("literal", "¿Qué frijoles lleva el gallo pinto de esta receta?", "Frijoles negros", ["Frijoles rojos", "Frijoles blancos"], "frijoles negros cocinados"),
      op("literal", "¿Qué se hace primero?", "Picar la cebolla y el chile dulce", ["Echar el arroz y el culantro", "Hervir los frijoles con el caldo"], "Primero, picá la cebolla y el chile dulce bien finitos"),
      sec("Ordená los pasos de la receta:", ["Picar la cebolla y el chile dulce", "Sofreírlos en el aceite", "Agregar los frijoles con caldo", "Echar el arroz y el culantro"]),
      op("vocabulario", "«Hasta que todo quede pintadito» quiere decir…", "Hasta que el arroz quede manchado de frijol", ["Hasta que el arroz quede blanco y bien suelto", "Hasta pintar el plato"], "hasta que todo quede pintadito",
        "Por eso se llama gallo pinto: el arroz queda pinto, con manchitas de frijol."),
      op("tipo", "¿Qué tipo de texto es?", "Una receta", ["Un cuento", "Una carta"], null,
        "Tiene ingredientes y pasos para preparar una comida."),
    ] },
  { id: "escondido", escalon: 3, tipo: "instrucciones", emoji: "🙈", titulo: "Cómo jugar escondido",
    parrafos: [
      "Jugadores: de 3 en adelante. Se necesita un lugar seguro con buenos escondites, como el patio o el corredor.",
      "Instrucciones:\n1. Escojan a quien va a contar.\n2. Esa persona se tapa los ojos en la «base» y cuenta en voz alta hasta 20.\n3. Mientras tanto, los demás corren a esconderse.\n4. Al terminar de contar, grita «¡Listos o no, allá voy!» y sale a buscar.\n5. Si encuentra a alguien, los dos corren a la base: el que llegue primero gana.",
      "Regla importante: no se vale esconderse en la calle ni en lugares peligrosos.",
    ],
    preguntas: [
      op("literal", "¿Hasta cuánto cuenta la persona que busca?", "Hasta 20", ["Hasta 10", "Hasta 100"], "cuenta en voz alta hasta 20"),
      op("literal", "¿Qué grita al terminar de contar?", "¡Listos o no, allá voy!", ["¡Se acabó el recreo!", "¡Todos a la base ya!"], "«¡Listos o no, allá voy!»"),
      sec("Ordená los pasos del juego:", ["Escoger a quien va a contar", "Contar hasta 20 en la base", "Salir a buscar a los demás"]),
      op("inferencia", "¿Por qué no se vale esconderse en la calle?", "Porque es peligroso", ["Porque ahí nadie busca", "Porque se ensucia la ropa"], "no se vale esconderse en la calle ni en lugares peligrosos"),
      op("proposito", "¿Para qué sirve este texto?", "Para explicar cómo se juega", ["Para contar una aventura de unos niños en el recreo", "Para vender juguetes"], null,
        "Tiene jugadores, pasos con números y reglas: son instrucciones."),
    ] },
  { id: "tigre", escalon: 3, tipo: "aviso", emoji: "🐈", titulo: "¡Se busca!",
    parrafos: [
      "¡SE BUSCA! Gato anaranjado con rayas, de ojos verdes y con un collar azul con una campanita. Se llama Tigre y responde a su nombre. Se perdió el martes en la tarde por el parque de Barrio San Martín.",
      "Es muy cariñoso, pero se asusta con los perros. Si lo ves, no lo persigás: avisale a la familia Mora, en la casa verde frente a la plaza. ¡Gracias por ayudarnos a encontrarlo!",
    ],
    preguntas: [
      op("literal", "¿Cómo es el collar de Tigre?", "Azul con una campanita", ["Rojo con una placa", "Verde con su nombre"], "un collar azul con una campanita"),
      op("literal", "¿Cuándo se perdió Tigre?", "El martes en la tarde", ["El sábado en la mañana", "Anoche"], "Se perdió el martes en la tarde"),
      op("inferencia", "¿Por qué piden que no lo persigan?", "Porque se puede asustar y escaparse más lejos", ["Porque Tigre muerde", "Porque es muy rápido y nadie lo podría alcanzar"], "no lo persigás",
        "El aviso dice que se asusta; si alguien corre detrás de él, puede huir más lejos."),
      op("literal", "¿Dónde vive la familia Mora?", "En la casa verde frente a la plaza", ["En la casa azul junto al parque central", "Al lado de la escuela"], "en la casa verde frente a la plaza"),
      op("proposito", "¿Para qué escribieron el aviso?", "Para encontrar a su gato", ["Para vender un gato", "Para invitar a una fiesta"], "¡Gracias por ayudarnos a encontrarlo!"),
    ] },
  { id: "dianino", escalon: 3, tipo: "aviso", emoji: "🎈", titulo: "Invitación: Día de la Niña y del Niño",
    parrafos: [
      "¡Te invitamos a celebrar el Día de la Niña y del Niño! Será el 9 de setiembre, de 8 a 11 de la mañana, en la plaza de la escuela.",
      "Habrá juegos tradicionales: carreras de sacos, el huevo en la cuchara, suiza y quedó. También habrá pintacaritas y una merienda de arroz con leche. Venite con ropa cómoda y una botella de agua. ¡No faltés!",
      "Organiza: Comité de Padres de Familia.",
    ],
    preguntas: [
      op("literal", "¿Qué se celebra?", "El Día de la Niña y del Niño", ["La Independencia", "El Día del Árbol"], "celebrar el Día de la Niña y del Niño"),
      op("literal", "¿Hasta qué hora es la actividad?", "Hasta las 11 de la mañana", ["Hasta las 8 de la mañana", "Hasta el mediodía"], "de 8 a 11 de la mañana"),
      op("literal", "¿Qué hay que llevar?", "Ropa cómoda y una botella de agua", ["Un regalo", "El uniforme de gala completo y los zapatos negros"], "con ropa cómoda y una botella de agua"),
      op("literal", "¿Quién organiza la actividad?", "El Comité de Padres de Familia", ["La maestra de primer grado", "Los estudiantes de sexto grado y sus maestras"], "Organiza: Comité de Padres de Familia"),
      op("tipo", "¿Qué tipo de texto es?", "Una invitación", ["Una receta", "Una noticia"], null,
        "Invita a una actividad y dice qué día, a qué hora, dónde y qué llevar."),
    ] },
  { id: "reciclaje", escalon: 3, tipo: "aviso", emoji: "♻️", titulo: "Campaña de reciclaje",
    parrafos: [
      "La Escuela Los Ángeles realizará una campaña de reciclaje durante todo el mes de octubre. Cada viernes recibiremos materiales en el aula de quinto grado, de 7 a 8 de la mañana.",
      "Se reciben: botellas de plástico, latas de aluminio, papel y cartón. Todo debe venir limpio, seco y separado en bolsas distintas. No se reciben vidrios quebrados ni empaques sucios con comida.",
      "El grupo que recoja más material ganará una tarde de cine en la escuela. ¡Reciclar es cuidar nuestro planeta!",
    ],
    preguntas: [
      op("literal", "¿Qué día se reciben los materiales?", "Los viernes", ["Los lunes", "Todos los días"], "Cada viernes recibiremos materiales"),
      op("literal", "¿Cuál de estas cosas NO se recibe?", "Vidrios quebrados", ["Latas de aluminio", "Botellas de plástico"], "No se reciben vidrios quebrados"),
      op("inferencia", "¿Por qué piden los materiales separados?", "Porque cada material se recicla aparte", ["Para que pesen más", "Para que se vean bonitos"], "separado en bolsas distintas",
        "El plástico, el papel y el aluminio se reciclan de formas distintas."),
      op("literal", "¿Qué gana el grupo que recoja más?", "Una tarde de cine", ["Un viaje a la playa", "Medallas de oro"], "ganará una tarde de cine"),
      op("proposito", "¿Cuál es el propósito del aviso?", "Invitar a reciclar y decir cómo hacerlo", ["Contar la historia de cómo se inventó el plástico", "Vender latas usadas"], null,
        "Dice qué se recibe, cuándo, dónde y cómo traerlo, e invita a participar."),
    ] },
  { id: "tortillasqueso", escalon: 3, tipo: "receta", emoji: "🧀", titulo: "Tortillas palmeadas con queso",
    parrafos: [
      "Ingredientes (para 8 tortillas): 2 tazas de harina de maíz, 1 taza y media de agua tibia, 1 taza de queso tierno rallado y una pizca de sal.",
      "Preparación: Primero, mezclá la harina, la sal y el queso en un tazón. Después, agregá el agua poco a poco y amasá hasta que la masa ya no se pegue en las manos. Luego, hacé 8 bolitas del tamaño de un limón y palmealas hasta que queden redondas y delgaditas. Por último, cocinalas en el comal caliente unos dos minutos por cada lado, hasta que tengan manchitas doradas.",
      "Consejo: si la masa se quiebra en los bordes, le falta agua. ¡Pedile ayuda a un adulto para usar el comal!",
    ],
    preguntas: [
      op("literal", "¿Cuánta agua lleva la receta?", "Una taza y media de agua tibia", ["Dos tazas de agua bien fría del refrigerador", "Media taza de leche"], "1 taza y media de agua tibia"),
      sec("Ordená los pasos de la receta:", ["Mezclar la harina, la sal y el queso", "Agregar el agua y amasar", "Hacer bolitas y palmearlas", "Cocinarlas en el comal"]),
      op("literal", "¿De qué tamaño se hacen las bolitas?", "Del tamaño de un limón", ["Del tamaño de una naranja grande", "Del tamaño de un frijol"], "del tamaño de un limón"),
      op("inferencia", "Si la masa se quiebra en los bordes, ¿qué hay que hacer?", "Echarle un poquito más de agua", ["Echarle más harina de maíz", "Cocinarla más rato en el comal", "Dejarla en el refrigerador toda la noche"], "si la masa se quiebra en los bordes, le falta agua",
        "Si se quiebra es porque le falta agua: hay que echarle un poquito más."),
      op("vocabulario", "¿Qué quiere decir «palmear» las tortillas?", "Aplastarlas con las palmas de las manos", ["Cocinarlas debajo de una palmera", "Aplaudir con fuerza cuando ya están todas listas"], "palmealas hasta que queden redondas y delgaditas",
        "Palmear es darle forma a la masa aplastándola entre las palmas de las manos."),
    ] },

  // ---------- 5. Pensá un poquito (3°) ----------
  { id: "tormenta", escalon: 4, tipo: "cuento", emoji: "⛈️", titulo: "Tormenta en Cahuita",
    parrafos: [
      "Keisha vive en Cahuita, cerca del mar. Aquella tarde, el cielo se puso gris oscuro y el viento empezó a mover las palmeras como si fueran de papel. Su mamá cerró las ventanas y guardó las hamacas.",
      "Durante la noche llovió sin parar. Keisha tenía miedo de los truenos, así que su abuela le contó historias hasta que se durmió. En la mañana, el sol brillaba otra vez y la playa estaba llena de ramas y cocos que había tirado la tormenta.",
    ],
    preguntas: [
      op("inferencia", "¿Por qué la mamá cerró las ventanas?", "Porque venía una tormenta", ["Porque hacía mucho calor", "Porque iban a salir de viaje"], "el cielo se puso gris oscuro",
        "El cielo gris oscuro y el viento fuerte eran señales de tormenta."),
      op("figurado", "El viento movía las palmeras «como si fueran de papel». Eso quiere decir que el viento…", "Era muy fuerte", ["Era muy suave", "Estaba muy frío"], "como si fueran de papel",
        "El papel se mueve con cualquier soplido; si las palmeras se movían así, el viento era muy fuerte."),
      op("literal", "¿Qué hizo la abuela para ayudar a Keisha?", "Le contó historias hasta que se durmió", ["Le dio un vaso de leche caliente con pan", "Le prestó una linterna para ver"], "le contó historias hasta que se durmió"),
      op("literal", "¿Cómo estaba la playa en la mañana?", "Llena de ramas y cocos", ["Limpia y vacía", "Llena de turistas"], "llena de ramas y cocos"),
    ] },
  { id: "concurso", escalon: 4, tipo: "cuento", emoji: "🎨", titulo: "El concurso de dibujo",
    parrafos: [
      "En la escuela hicieron un concurso de dibujo sobre la naturaleza. Josué quería ganar, así que copió un dibujo de un libro. Su amiga María dibujó los molinos de viento que veía desde su casa, aunque no le quedaron perfectos.",
      "La maestra felicitó a María porque su dibujo mostraba algo real y lo había hecho ella misma. Josué se quedó pensativo. Al día siguiente, salió al patio con su cuaderno y dibujó el árbol de guanacaste de la escuela. No le quedó tan bonito como el del libro, pero esta vez se sintió orgulloso de verdad.",
    ],
    preguntas: [
      op("literal", "¿Por qué la maestra felicitó a María?", "Porque dibujó algo real y lo hizo ella misma", ["Porque su dibujo era perfecto", "Porque copió de un libro"], "porque su dibujo mostraba algo real y lo había hecho ella misma",
        "El texto dice que el dibujo de María no quedó perfecto."),
      op("vocabulario", "Josué «se quedó pensativo». Eso quiere decir que…", "Se quedó pensando en eso", ["Se quedó dormido en la clase", "Se puso a llorar en el recreo"], "Josué se quedó pensativo"),
      op("literal", "¿Qué dibujó Josué al día siguiente?", "El guanacaste de la escuela", ["Los molinos de viento", "Un dibujo de un libro"], "dibujó el árbol de guanacaste de la escuela"),
      op("ensenanza", "¿Qué aprendió Josué?", "Que vale más hacer las cosas uno mismo", ["Que los dibujos de los libros son feos", "Que nunca va a ganar ningún concurso"], "se sintió orgulloso de verdad",
        "Su dibujo no quedó tan bonito, pero se sintió orgulloso porque lo hizo él."),
    ] },
  { id: "mochila", escalon: 4, tipo: "cuento", emoji: "🎒", titulo: "La mochila de Ian",
    parrafos: [
      "Ian dejó la mochila en la parada del bus y se subió corriendo porque iba tarde. Cuando el bus arrancó, se tocó la espalda y sintió un vacío en la panza: ¡ahí estaban sus cuadernos y la tarea de matemáticas!",
      "Al llegar a la escuela, le contó todo a la maestra. Ella llamó a la mamá de Ian, que fue a la parada y encontró la mochila con la señora de la soda de enfrente. La señora la había guardado al ver que nadie volvía por ella. Desde ese día, Ian revisa sus cosas antes de subirse al bus.",
    ],
    preguntas: [
      op("literal", "¿Dónde dejó Ian la mochila?", "En la parada del bus", ["Dentro del bus", "En la entrada de la escuela"], "dejó la mochila en la parada del bus"),
      op("figurado", "Ian «sintió un vacío en la panza». Eso quiere decir que…", "Se asustó mucho", ["Tenía mucha hambre", "Le dolía la espalda"], "sintió un vacío en la panza",
        "Esa sensación da cuando uno se asusta de repente, como cuando Ian se dio cuenta de que no tenía la mochila."),
      op("literal", "¿Quién había guardado la mochila?", "La señora de la soda", ["La maestra de Ian", "El chofer del bus de Ian"], "la señora de la soda de enfrente"),
      op("ensenanza", "¿Qué aprendió Ian?", "A revisar sus cosas antes de subir", ["A no ir más en bus", "A dejar la mochila en la casa"], "Ian revisa sus cosas antes de subirse al bus"),
    ] },
  { id: "pizote", escalon: 4, tipo: "fabula", emoji: "🦝", titulo: "El pizote presumido",
    parrafos: [
      "En el bosque vivía un pizote que estaba muy orgulloso de su cola larga y rayada. Todas las mañanas la levantaba bien alta y les decía a los demás animales: «¡Miren qué cola más bonita! Ninguno de ustedes tiene una igual».",
      "Un día, la ardilla se cayó a la quebrada y no podía salir. La tortuga, que era muy lenta, y el perezoso, que estaba lejos, no podían ayudarla. Entonces el pizote se agarró de una raíz y le bajó su larga cola para que la ardilla se sujetara. Así la sacó del agua.",
      "Esa tarde, el pizote entendió que su cola no servía solo para presumir. Desde entonces ya no se burla de nadie, y los animales lo quieren más por su ayuda que por su cola.",
    ],
    preguntas: [
      op("vocabulario", "El pizote era «presumido». Eso quiere decir que…", "Se creía mejor que los demás", ["Era muy tímido", "Tenía mucha hambre"], "¡Miren qué cola más bonita!"),
      op("literal", "¿Qué le pasó a la ardilla?", "Se cayó a la quebrada", ["Se perdió en el bosque", "Se enfermó"], "la ardilla se cayó a la quebrada"),
      op("inferencia", "¿Por qué no la ayudaron la tortuga ni el perezoso?", "Una era muy lenta y el otro estaba lejos", ["No querían ayudar porque la ardilla era antipática", "Estaban dormidos"], "La tortuga, que era muy lenta, y el perezoso, que estaba lejos"),
      op("literal", "¿Cómo sacó el pizote a la ardilla?", "Le bajó la cola para que se agarrara", ["La empujó con la nariz", "Llamó a otros pizotes del bosque para que la jalaran"], "le bajó su larga cola para que la ardilla se sujetara"),
      op("ensenanza", "¿Cuál es la enseñanza de la fábula?", "Lo que tenemos vale más si sirve para ayudar", ["Hay que esconder lo que uno tiene para que nadie lo envidie", "Las colas largas son peligrosas"], "los animales lo quieren más por su ayuda que por su cola"),
    ] },
  { id: "adivinanzas", escalon: 4, tipo: "adivinanza", emoji: "🤔", titulo: "Tres adivinanzas ticas",
    parrafos: [
      "Nazco verde y me pongo rojo,\nme cogen en diciembre con cuidado;\nme tuestan, me muelen y me chorrean,\ny en la mañana estoy en tu taza.",
      "Vivo colgado de las ramas,\nnunca tengo prisa para nada;\ncomo hojas, duermo mucho\ny bajo al suelo una vez a la semana.",
      "Tengo dos ruedas pintadas\ncon flores de mil colores;\nlos bueyes me jalan despacio\ny soy orgullo de Sarchí.",
    ],
    preguntas: [
      op("inferencia", "¿Cuál es la respuesta de la primera adivinanza?", "El café", ["El mango", "El chocolate"], "me tuestan, me muelen y me chorrean",
        "Se coge en diciembre, se tuesta, se muele y se chorrea: es el café."),
      op("inferencia", "¿Qué animal es el de la segunda adivinanza?", "El perezoso", ["El mono congo", "La lapa roja"], "bajo al suelo una vez a la semana",
        "Vive colgado, no tiene prisa, come hojas y duerme mucho."),
      op("inferencia", "¿Cuál es la respuesta de la tercera adivinanza?", "La carreta típica", ["El bus del pueblo", "La bicicleta"], "los bueyes me jalan despacio",
        "Las carretas de Sarchí tienen ruedas pintadas y las jalan bueyes."),
      op("vocabulario", "«Chorrear» el café quiere decir…", "Prepararlo pasando agua caliente", ["Derramarlo en el piso", "Sembrarlo en la finca"], "me chorrean",
        "En Costa Rica, el café se chorrea en el chorreador."),
      op("tipo", "¿Qué tipo de texto es?", "Adivinanzas", ["Una noticia", "Una receta"], null,
        "Describen algo sin decir su nombre, para que el lector adivine qué es."),
    ] },
  { id: "regalo", escalon: 4, tipo: "cuento", emoji: "💌", titulo: "El regalo para mamá",
    parrafos: [
      "Faltaban dos días para el 15 de agosto, el Día de la Madre, y Andrea no tenía plata para comprarle nada a su mamá. Revisó su alcancía: solo tenía unas pocas monedas. Se sentó en la grada de la casa, triste y sin ideas.",
      "Entonces vio las rosas del jardín de la abuela y se le ocurrió algo. Con permiso de la abuela, cortó tres rosas y las puso en un frasco de vidrio decorado con cintas. Además, escribió una tarjeta: «Mamá, gracias por cuidarme cuando estoy enferma y por enseñarme a leer».",
      "Cuando su mamá leyó la tarjeta, se le aguaron los ojos y la abrazó largo rato. Esa noche, el frasco con las rosas quedó en el centro de la mesa, como el regalo más valioso de la casa.",
    ],
    preguntas: [
      op("literal", "¿Qué problema tenía Andrea?", "No tenía plata para comprar un regalo", ["No sabía qué día era el Día de la Madre", "Su mamá estaba enferma"], "no tenía plata para comprarle nada a su mamá"),
      op("literal", "¿Qué hizo Andrea antes de cortar las rosas?", "Le pidió permiso a la abuela", ["Las compró en la feria del agricultor", "Las regó"], "Con permiso de la abuela"),
      op("figurado", "«Se le aguaron los ojos» quiere decir que la mamá…", "Se emocionó hasta casi llorar", ["Tenía una basurita en el ojo", "Se lavó la cara"], "se le aguaron los ojos"),
      op("ensenanza", "¿Cuál es la enseñanza del cuento?", "Un regalo hecho con cariño puede valer más que uno comprado", ["Hay que ahorrar mucho para poder comprar regalos caros y bonitos", "Las flores no son buen regalo"], "como el regalo más valioso de la casa"),
    ] },
  { id: "huellas", escalon: 4, tipo: "cuento", emoji: "🐾", titulo: "El misterio de las huellas",
    parrafos: [
      "Una mañana, Luis encontró unas huellas pequeñas en el barro del patio. Tenían cuatro deditos redondos y una almohadilla en el centro. Las huellas iban desde el portón hasta el plato de comida del gato, que estaba vacío.",
      "Luis llamó a su hermana Karla y los dos se pusieron a investigar como detectives. «No pueden ser del gato, porque Michi duerme adentro», dijo Karla. Luis notó que junto a las huellas había unos pelos cafés y que el portón tenía un hueco abajo.",
      "Esa noche se quedaron vigilando por la ventana. A las nueve, un perrito callejero, flaco y café, entró por el hueco del portón y se acercó al plato. Karla le puso más comida y agua. Una semana después, el perrito ya tenía nombre: Detective.",
    ],
    preguntas: [
      op("inferencia", "¿Por qué Karla pensó que las huellas no eran del gato?", "Porque Michi duerme adentro de la casa", ["Porque las huellas eran grandísimas", "Porque el gato no come"], "No pueden ser del gato, porque Michi duerme adentro"),
      op("inferencia", "¿Qué pista mostraba por dónde entraba el animal?", "El hueco abajo del portón", ["Los pelos cafés en el barro", "El plato de comida vacío"], "el portón tenía un hueco abajo"),
      op("vocabulario", "Un perro «callejero» es…", "Un perro que vive en la calle, sin dueño", ["Un perro de raza", "Un perro guardián que cuida la casa de su dueño"], "un perrito callejero"),
      op("inferencia", "¿Por qué creés que al perrito le pusieron «Detective»?", "Porque lo encontraron investigando como detectives", ["Porque sabía buscar cosas", "Porque así se llamaba en la casa de su dueño anterior"], "el perrito ya tenía nombre: Detective",
        "Luis y Karla jugaron a ser detectives para descubrir quién dejaba las huellas."),
    ] },
  { id: "arturo", escalon: 4, tipo: "cuento", emoji: "🌳", titulo: "Don Arturo y los árboles",
    parrafos: [
      "Don Arturo tiene ochenta años y todos los días siembra un arbolito en la orilla del río. Un vecino joven se rio y le dijo: «¿Para qué siembra árboles, si usted no va a verlos grandes?».",
      "Don Arturo le contestó con calma: «Cuando yo era niño, alguien sembró los árboles que hoy me dan sombra. Ahora me toca a mí sembrar para los que vienen». El vecino se quedó callado y se fue pensando.",
      "Al día siguiente, el vecino llegó con una pala y dos arbolitos de guanacaste. Desde entonces siembran juntos los sábados, y la orilla del río ya no se ve pelada.",
    ],
    preguntas: [
      op("inferencia", "¿Por qué el vecino se rio de don Arturo?", "Creía que a su edad no valía la pena sembrar", ["Porque don Arturo sembraba los árboles al revés", "Porque los árboles eran feos"], "¿Para qué siembra árboles, si usted no va a verlos grandes?"),
      op("literal", "Según don Arturo, ¿cuándo sembraron los árboles que hoy le dan sombra?", "Cuando él era niño", ["El año pasado", "Hace una semana"], "Cuando yo era niño, alguien sembró los árboles"),
      op("inferencia", "¿Qué cambió en el vecino?", "Entendió y se puso a sembrar también", ["Se enojó con don Arturo", "Se fue a vivir a otro barrio con más sombra"], "el vecino llegó con una pala y dos arbolitos"),
      op("vocabulario", "En este cuento, «pelada» quiere decir…", "Sin árboles ni plantas", ["Sin pelo", "Sin agua"], "ya no se ve pelada"),
      op("ensenanza", "¿Cuál es la enseñanza?", "Cuidar la naturaleza pensando en los que vienen", ["Solo los jóvenes deben sembrar", "No vale la pena hacer cosas que tardan mucho en dar fruto"], null,
        "Don Arturo siembra árboles que otros van a disfrutar, como alguien hizo por él."),
    ] },

  // ---------- 6. Más largos y en orden (3° y 4°) ----------
  { id: "turno", escalon: 5, tipo: "cuento", emoji: "🎡", titulo: "El turno del pueblo",
    parrafos: [
      "Cada año, en el pueblo de Pablo hacen un turno para recoger plata y arreglar el salón comunal. Ese sábado, desde temprano se escuchaba la cimarrona tocando por las calles.",
      "Pablo y su prima Ana se subieron primero a los caballitos. Después se comieron unos churros y un granizado. Más tarde vieron pasar las mascaradas: el diablo, la giganta y la calavera persiguieron a los chiquillos, que corrían entre gritos y risas.",
      "En la noche hubo pólvora y baile en el salón. Pablo llegó a la casa tan cansado que se durmió con los zapatos puestos.",
    ],
    preguntas: [
      op("literal", "¿Para qué hacen el turno?", "Para recoger plata para el salón comunal", ["Para celebrar un cumpleaños", "Para vender caballos"], "para recoger plata y arreglar el salón comunal"),
      sec(ORDENA, ["Se escuchaba la cimarrona", "Se subieron a los caballitos", "Vieron pasar las mascaradas", "Hubo pólvora y baile"]),
      op("inferencia", "¿Por qué Pablo se durmió con los zapatos puestos?", "Porque estaba muy cansado", ["Porque tenía mucho frío en los pies", "Porque quería ir temprano a la escuela"], "tan cansado que se durmió con los zapatos puestos"),
      op("idea", "¿De qué trata principalmente el texto?", "De un día de fiesta en el turno del pueblo", ["De cómo se hace un granizado", "De un viaje en tren a la playa con la prima"], null,
        "Todos los párrafos cuentan lo que Pablo hizo en el turno, de la mañana a la noche."),
    ] },
  { id: "partido", escalon: 5, tipo: "cuento", emoji: "🥅", titulo: "El partido en la plaza",
    parrafos: [
      "Todos los domingos, los chiquillos del barrio jugaban fútbol en la plaza. Ese domingo, el equipo de Sebastián perdía 2 a 0 y faltaban pocos minutos.",
      "Sebastián tenía la bola cerca del marco, pero vio que su compañera Emily estaba sola y mejor colocada. En vez de patear él, le pasó la bola. Emily metió el gol. Un minuto después, Sebastián recuperó la bola y anotó el empate.",
      "Al final, los dos equipos se dieron la mano. «Lo mejor fue el pase», le dijo Emily a Sebastián. Él sonrió: había aprendido que jugar en equipo vale más que lucirse solo.",
    ],
    preguntas: [
      op("literal", "¿Cómo iba el partido al principio?", "El equipo de Sebastián perdía 2 a 0", ["Iban empatados", "El equipo de Sebastián ganaba 2 a 0"], "perdía 2 a 0"),
      sec(ORDENA, ["Sebastián le pasó la bola a Emily", "Emily metió el gol", "Sebastián anotó el empate", "Los equipos se dieron la mano"]),
      op("inferencia", "¿Cuántos goles metió el equipo de Sebastián?", "Dos", ["Uno", "Tres"], "anotó el empate",
        "Perdían 2 a 0: Emily metió uno y Sebastián el otro, para empatar 2 a 2."),
      op("ensenanza", "¿Qué aprendió Sebastián?", "Que jugar en equipo vale más que lucirse solo", ["Que hay que patear siempre al marco", "Que el fútbol es aburrido"], "jugar en equipo vale más que lucirse solo"),
    ] },
  { id: "tortuguero", escalon: 5, tipo: "cuento", emoji: "🐢", titulo: "La gira a Tortuguero",
    parrafos: [
      "El grupo de cuarto grado salió de la escuela a las cuatro de la mañana. Viajaron en bus hasta un muelle y desde ahí siguieron en bote, porque a Tortuguero no se llega en carro. Por los canales vieron garzas, caimanes y un perezoso dormido en un árbol.",
      "En la tarde, el guía les explicó que a esa playa llegan las tortugas verdes a poner sus huevos. Les enseñó las reglas para visitarlas de noche: hablar bajito, no usar linternas comunes ni tomar fotos con flash, y quedarse detrás del guía.",
      "Ya de noche, caminaron en silencio por la arena. De pronto, el guía levantó la mano: una tortuga enorme cavaba un hueco con las aletas de atrás. Nadie dijo nada, pero todos sabían que nunca iban a olvidar ese momento.",
    ],
    preguntas: [
      op("literal", "¿Por qué tuvieron que seguir en bote?", "Porque a Tortuguero no se llega en carro", ["Porque el bus se quedó varado", "Porque querían pescar"], "a Tortuguero no se llega en carro"),
      sec(ORDENA, ["Salieron de la escuela en bus", "Siguieron en bote por los canales", "El guía les explicó las reglas", "Vieron una tortuga cavando en la arena"]),
      op("inferencia", "¿Por qué no se pueden tomar fotos con flash?", "Porque la luz molesta a las tortugas", ["Porque las fotos salen feas de noche", "Porque el guía quería tomarlas"], "ni tomar fotos con flash",
        "Las reglas sirven para no asustar a las tortugas mientras ponen sus huevos."),
      op("literal", "¿Con qué cavaba la tortuga el hueco?", "Con las aletas de atrás", ["Con la boca", "Con las aletas de adelante"], "cavaba un hueco con las aletas de atrás"),
      op("idea", "¿De qué trata principalmente el texto?", "De una gira para ver tortugas en Tortuguero", ["De cómo se construye un bote para navegar por los canales", "De los animales peligrosos del Caribe"], null,
        "Todo el texto cuenta el viaje del grupo hasta ver a una tortuga poniendo huevos."),
    ] },
  { id: "desfile", escalon: 5, tipo: "cuento", emoji: "🥁", titulo: "El desfile del 15 de setiembre",
    parrafos: [
      "Desde agosto, la banda de la escuela ensayaba todas las tardes. Daniel tocaba el tambor y le costaba llevar el ritmo, pero no faltaba a ningún ensayo. Su mamá le planchó el uniforme de gala la noche del 14.",
      "La mañana del 15 de setiembre, las calles del pueblo estaban llenas de banderas. Primero pasaron las niñas y los niños de preescolar con trajes típicos y banderitas. Después desfilaron las bastoneras y, por último, la banda de la escuela.",
      "Cuando le tocó pasar frente a la iglesia, Daniel escuchó a su abuelo gritar: «¡Ese es mi nieto!». Se le olvidaron los nervios y tocó mejor que nunca. Al terminar, el director felicitó a la banda por su esfuerzo.",
    ],
    preguntas: [
      op("literal", "¿Qué instrumento tocaba Daniel?", "El tambor", ["La trompeta", "La lira"], "Daniel tocaba el tambor"),
      sec(ORDENA, ["Daniel ensayaba todas las tardes", "Su mamá le planchó el uniforme", "Pasaron los de preescolar con banderitas", "El director felicitó a la banda"]),
      op("inferencia", "¿Por qué a Daniel se le olvidaron los nervios?", "Porque escuchó a su abuelo animándolo", ["Porque se acabó el desfile", "Porque dejó de tocar"], "Se le olvidaron los nervios"),
      op("literal", "¿Quiénes desfilaron de últimos?", "La banda de la escuela", ["Las bastoneras", "Los de preescolar con banderitas"], "por último, la banda de la escuela"),
      op("idea", "¿De qué trata principalmente el texto?", "De cómo Daniel se preparó y tocó en el desfile", ["De la historia de la Independencia de Costa Rica en 1821", "De cómo se hace un farol"], null,
        "Cuenta los ensayos de Daniel y lo que vivió el día del desfile."),
    ] },
  { id: "soda", escalon: 5, tipo: "cuento", emoji: "🍽️", titulo: "La soda de doña Chepa",
    parrafos: [
      "Doña Chepa tiene una soda frente a la parada de buses. Abre a las cinco y media de la mañana, porque a esa hora pasan los trabajadores que van para San José. Su especialidad son las empanadas de papa y los casados con pescado.",
      "En vacaciones, su nieto Esteban le ayuda. Primero limpia las mesas y saca las sillas. Después anota los pedidos en una libreta y le lleva los platos a la gente. Al final del día, cuenta la plata con su abuela y anota todo en un cuaderno.",
      "Esteban dice que en la soda aprendió más matemática que en la escuela. Doña Chepa se ríe y le contesta que lo más importante que aprendió fue a tratar a la gente con respeto y una sonrisa.",
    ],
    preguntas: [
      op("literal", "¿Por qué la soda abre tan temprano?", "Porque a esa hora pasan trabajadores", ["Porque doña Chepa casi no duerme en la noche", "Porque las empanadas tardan mucho"], "porque a esa hora pasan los trabajadores"),
      sec(ORDENA, ["Limpia las mesas y saca las sillas", "Anota los pedidos en una libreta", "Les lleva los platos a la gente", "Cuenta la plata con su abuela"]),
      op("vocabulario", "En la soda, un «casado» es…", "Un plato de comida", ["Un señor que se casó", "Una bebida de frutas"], "los casados con pescado",
        "La soda vende «casados con pescado»: es un plato con arroz, frijoles, ensalada y algo más."),
      op("inferencia", "¿Por qué Esteban dice que aprendió matemática en la soda?", "Porque cuenta la plata y anota las cuentas", ["Porque su abuela le pone tareas", "Porque lee libros en la soda"], "cuenta la plata con su abuela"),
      op("idea", "¿De qué trata principalmente el texto?", "De lo que Esteban aprende ayudando a su abuela", ["De cómo se hacen las empanadas", "De por qué los buses de la mañana salen tan temprano"], null,
        "Cuenta cómo Esteban ayuda en la soda y qué aprende ahí."),
    ] },
  { id: "mascaradas", escalon: 5, tipo: "cuento", emoji: "🎭", titulo: "El taller de mascaradas",
    parrafos: [
      "En Barva de Heredia, don Mario tiene un taller donde hace mascaradas desde hace treinta años. Un sábado invitó a los niños del barrio a ver cómo se hacen.",
      "Primero moldeó la cara con barro. Después la cubrió con capas de papel y engrudo, y la dejó secar varios días al sol. Cuando estuvo dura, la despegó del molde y la pintó con colores brillantes. Por último, le puso un armazón para que alguien la pudiera llevar sobre los hombros.",
      "Los niños preguntaron por qué las mascaradas persiguen a la gente en los turnos. Don Mario les contó que es parte del juego y de la tradición, y que el 31 de octubre se celebra en Costa Rica el Día de la Mascarada Tradicional.",
    ],
    preguntas: [
      op("literal", "¿Con qué moldeó don Mario la cara?", "Con barro", ["Con madera", "Con plástico"], "moldeó la cara con barro"),
      sec(ORDENA, ["Moldeó la cara con barro", "La cubrió con papel y engrudo", "La pintó con colores brillantes", "Le puso un armazón"]),
      op("literal", "¿Para qué sirve el armazón?", "Para llevar la mascarada sobre los hombros", ["Para que la cabeza se seque más rápido al sol", "Para colgarla en la pared"], "para que alguien la pudiera llevar sobre los hombros"),
      op("literal", "¿Qué se celebra el 31 de octubre?", "El Día de la Mascarada Tradicional", ["El Día de la Madre", "La Independencia"], "el 31 de octubre se celebra en Costa Rica el Día de la Mascarada Tradicional"),
      op("idea", "¿De qué trata principalmente el texto?", "De cómo se hace una mascarada tradicional", ["De la historia del barrio", "De por qué los turnos del pueblo se hacen los sábados"], null,
        "El texto explica, paso a paso, cómo don Mario hace una mascarada."),
    ] },
  { id: "bici", escalon: 5, tipo: "cuento", emoji: "🚲", titulo: "La bici de segunda",
    parrafos: [
      "Ian quería una bicicleta, pero en su casa no alcanzaba la plata para una nueva. Su papá le propuso un trato: si ahorraba la mitad, él ponía la otra mitad para comprar una de segunda.",
      "Durante cuatro meses, Ian guardó lo que le daban para la merienda, ayudó a lavar carros los sábados y vendió limones del palo del patio. Cada semana anotaba en un papel cuánto llevaba. Hubo días en que quiso gastar la plata en confites, pero se aguantó.",
      "Por fin juntaron lo necesario y compraron una bici azul, un poco rayada. Ian y su papá la limpiaron, le cambiaron la cadena y le pusieron un timbre. Ian dice que es la mejor bici del mundo, porque la ganó con su propio esfuerzo.",
    ],
    preguntas: [
      op("literal", "¿Qué trato le propuso el papá?", "Si Ian ahorraba la mitad, él ponía la otra mitad", ["Le compraría una nueva si sacaba buenas notas en el año", "Le prestaría la suya"], "si ahorraba la mitad, él ponía la otra mitad"),
      sec(ORDENA, ["El papá le propuso un trato", "Ian ahorró durante cuatro meses", "Compraron una bici azul", "Le cambiaron la cadena"]),
      op("vocabulario", "Una bicicleta «de segunda» es…", "Una que ya tuvo otro dueño", ["Una que ganó el segundo lugar", "Una de dos asientos"], "comprar una de segunda"),
      op("inferencia", "¿Por qué Ian anotaba cuánto llevaba?", "Para saber cuánto le faltaba", ["Para presumir con sus amigos", "Porque la maestra se lo pidió"], "Cada semana anotaba en un papel cuánto llevaba"),
      op("idea", "¿De qué trata principalmente el texto?", "De cómo Ian ahorró para su bicicleta", ["De cómo se cambia la cadena de una bicicleta vieja", "De por qué los limones son ácidos"], null,
        "Cuenta el trato, el ahorro y la compra de la bici."),
    ] },
  { id: "perezosocalle", escalon: 5, tipo: "cuento", emoji: "🦥", titulo: "El perezoso en la calle",
    parrafos: [
      "Una tarde, en la calle principal de Puerto Viejo, los carros se detuvieron de repente. Un perezoso de tres dedos cruzaba despacito la calle, de un árbol a otro.",
      "Valeria quería alzarlo para ayudarlo, pero su tía la detuvo: «Los animales silvestres no se tocan; se pueden asustar o lastimar». En cambio, la tía se paró con los brazos abiertos para que los carros esperaran y llamó al centro de rescate más cercano.",
      "Mientras tanto, el perezoso terminó de cruzar y empezó a subir por un tronco. Cuando llegaron los del centro de rescate, revisaron que estuviera bien y lo dejaron en su árbol. Valeria aprendió que a veces ayudar es simplemente dar espacio y avisar a quien sabe.",
    ],
    preguntas: [
      op("literal", "¿Dónde pasó la historia?", "En Puerto Viejo", ["En San José", "En Monteverde"], "en la calle principal de Puerto Viejo"),
      sec(ORDENA, ["Los carros se detuvieron", "La tía detuvo a Valeria", "El perezoso subió por un tronco", "Llegaron los del centro de rescate"]),
      op("literal", "¿Por qué la tía no dejó que Valeria alzara al perezoso?", "Porque los animales silvestres no se tocan", ["Porque el perezoso estaba dormido", "Porque Valeria era muy pequeña para cargar un animal"], "Los animales silvestres no se tocan"),
      op("literal", "¿Para qué se paró la tía con los brazos abiertos?", "Para que los carros esperaran", ["Para abrazar al perezoso", "Para que Valeria no se fuera"], "para que los carros esperaran"),
      op("ensenanza", "¿Qué aprendió Valeria?", "Que a veces ayudar es dar espacio y avisar a quien sabe", ["Que hay que llevarse para la casa a los animales que uno encuentra", "Que los perezosos cruzan para jugar"], "a veces ayudar es simplemente dar espacio y avisar a quien sabe"),
    ] },
  { id: "arrozpollo", escalon: 5, tipo: "receta", emoji: "🍗", titulo: "Arroz con pollo",
    parrafos: [
      "El arroz con pollo es una de las comidas favoritas en las fiestas de Costa Rica. Se sirve con frijoles molidos, ensalada y papitas tostadas. Esta receta alcanza para seis personas.",
      "Ingredientes: 2 tazas de arroz, 2 pechugas de pollo, 4 tazas del caldo donde se cocinó el pollo, 1 cebolla, 1 chile dulce, 2 dientes de ajo, 1 taza de verduras picadas (zanahoria, vainica y petit pois), un poquito de achiote, sal y un manojo de culantro.",
      "Preparación: Primero, cociná las pechugas en agua con sal y un poco de culantro; guardá el caldo y deshilachá el pollo. Después, sofreí la cebolla, el chile y el ajo bien picaditos, y agregá el arroz con el achiote para que agarre color. Luego, echá el caldo caliente y dejá que hierva hasta que se seque un poco. Por último, agregá el pollo, las verduras y el culantro picado, tapá la olla y cociná a fuego bajo hasta que el arroz esté suave. ¡Pedile ayuda a un adulto para cortar y para usar la cocina!",
    ],
    preguntas: [
      op("literal", "Según el texto, ¿con qué se sirve el arroz con pollo?", "Con frijoles molidos, ensalada y papitas tostadas", ["Con tortillas palmeadas, natilla, huevo frito y plátano maduro", "Con pan, mantequilla y café con leche"], "Se sirve con frijoles molidos, ensalada y papitas tostadas"),
      sec("Ordená los pasos de la receta:", ["Cocinar las pechugas y guardar el caldo", "Sofreír la cebolla, el chile y el ajo", "Echar el caldo caliente", "Agregar el pollo y las verduras"]),
      op("literal", "¿Para qué se le echa achiote al arroz?", "Para que el arroz agarre color", ["Para que quede más suave", "Para que no se pegue en el fondo de la olla"], "para que agarre color"),
      op("vocabulario", "¿Qué quiere decir «deshilachar» el pollo?", "Partirlo en tiritas delgadas", ["Cocinarlo amarrado con un hilo de cocina", "Freírlo bien tostadito"], "deshilachá el pollo",
        "Deshilachar es separar en hilos o tiritas, como cuando se deshace la orilla de una tela."),
      op("proposito", "¿Para qué sirve este texto?", "Para enseñar a preparar arroz con pollo", ["Para contar lo que pasó en una fiesta de cumpleaños", "Para vender pollo en el mercado"], null,
        "Tiene ingredientes y pasos en orden: es una receta."),
    ] },

  // ---------- 7. Textos que informan (4°) ----------
  { id: "baula", escalon: 6, tipo: "informativo", emoji: "🐢", titulo: "La tortuga baula",
    parrafos: [
      "La baula es la tortuga marina más grande del mundo: puede medir casi dos metros de largo. A diferencia de otras tortugas, su caparazón no es duro, sino como un cuero grueso.",
      "En Costa Rica, las baulas llegan de noche a playas como Playa Grande, en Guanacaste, para poner sus huevos en la arena. Unos dos meses después, nacen las tortuguitas y caminan hacia el mar.",
      "La baula está en peligro de extinción. Por eso es importante no dejar basura en la playa, no usar luces fuertes de noche y respetar los lugares donde ponen sus huevos. En mi opinión, ver nacer una tortuguita es lo más lindo que hay.",
    ],
    preguntas: [
      op("literal", "¿Cómo es el caparazón de la baula?", "Como un cuero grueso, no duro", ["Duro y liso como una piedra", "Lleno de espinas y de manchas"], "su caparazón no es duro, sino como un cuero grueso"),
      op("opinion", "¿Cuál de estas frases es una OPINIÓN?", "Ver nacer una tortuguita es lo más lindo que hay", ["La baula es la tortuga marina más grande del mundo", "Las baulas llegan de noche a poner sus huevos"], "En mi opinión, ver nacer una tortuguita es lo más lindo que hay",
        "Una opinión es lo que alguien piensa o siente; un dato se puede comprobar."),
      op("vocabulario", "«En peligro de extinción» quiere decir que la baula…", "Podría desaparecer para siempre", ["Es muy peligrosa para las personas", "Hay demasiadas en la playa"], "La baula está en peligro de extinción",
        "Por eso el texto dice cómo cuidarla."),
      op("idea", "¿Cuál es la idea principal del texto?", "Cómo es la baula, cómo nace y cómo cuidarla", ["Cómo pescan en las playas de Guanacaste", "Por qué todas las tortugas del mar son lentas"], null,
        "El primer párrafo dice cómo es, el segundo dónde pone sus huevos y el tercero cómo cuidarla."),
    ] },
  { id: "perezosos", escalon: 6, tipo: "informativo", emoji: "🦥", titulo: "Datos del perezoso",
    parrafos: [
      "En Costa Rica viven dos tipos de perezosos: el de dos dedos y el de tres dedos. Pasan casi toda su vida colgados de los árboles y se mueven muy despacio para gastar poca energía.",
      "Comen sobre todo hojas, que les dan poca energía. Por eso duermen muchas horas al día. Más o menos una vez por semana, bajan del árbol para hacer sus necesidades en el suelo.",
      "Algunas personas creen que los perezosos son vagos, pero eso no es cierto: su lentitud es una forma de sobrevivir en el bosque. Además, el alga verde que crece en su pelo les ayuda a esconderse entre las hojas.",
    ],
    preguntas: [
      op("literal", "¿Cuántos tipos de perezosos viven en Costa Rica?", "Dos", ["Uno", "Tres"], "viven dos tipos de perezosos",
        "Ojo: uno es «el de tres dedos», pero son dos tipos."),
      op("literal", "¿Por qué el perezoso se mueve tan despacio?", "Para gastar poca energía", ["Porque es vago", "Porque le da miedo caerse"], "se mueven muy despacio para gastar poca energía"),
      op("inferencia", "Según el texto, ¿es cierto que los perezosos son vagos?", "No, ser lentos les ayuda a vivir", ["Sí, porque duermen mucho", "Sí, porque no bajan nunca"], "pero eso no es cierto"),
      op("literal", "¿Para qué les sirve el alga verde de su pelo?", "Para esconderse entre las hojas", ["Para tener calor en las noches frías", "Para comérsela cuando tienen hambre"], "les ayuda a esconderse entre las hojas"),
      op("idea", "¿De qué trata principalmente el texto?", "De cómo viven los perezosos", ["De los animales rápidos", "De los árboles del bosque"], null,
        "Los tres párrafos hablan del perezoso: cómo se mueve, qué come y cómo se esconde."),
    ] },
  { id: "huerta", escalon: 6, tipo: "noticia", emoji: "📰", titulo: "Estudiantes de cuarto grado siembran su propia huerta",
    parrafos: [
      "Los estudiantes de cuarto grado de la Escuela El Roble inauguraron el lunes pasado una huerta en el patio de la escuela.",
      "En la huerta sembraron lechuga, culantro, rábanos y tomate. Cada grupo se encarga de regar las plantas dos veces por semana y de quitar las malas hierbas. Las verduras que se cosechen se usarán en el comedor escolar.",
      "«Ahora los chiquillos comen más ensalada, porque la sembraron ellos», dijo la cocinera, doña Lidia. La maestra Patricia opinó que «es el mejor proyecto que ha tenido la escuela».",
    ],
    preguntas: [
      op("literal", "¿Quiénes hicieron la huerta?", "Los estudiantes de cuarto grado", ["Los papás y mamás de la escuela", "La cocinera, doña Lidia"], "Los estudiantes de cuarto grado"),
      op("literal", "¿Qué pasará con las verduras que se cosechen?", "Se usarán en el comedor escolar", ["Se venderán en la feria del sábado", "Se las llevarán para la casa"], "se usarán en el comedor escolar"),
      op("opinion", "¿Cuál de estas frases es una OPINIÓN?", "Es el mejor proyecto que ha tenido la escuela", ["Sembraron lechuga, culantro, rábanos y tomate", "Cada grupo riega las plantas dos veces por semana"], "es el mejor proyecto que ha tenido la escuela",
        "Lo que se sembró se puede comprobar; «el mejor proyecto» es lo que piensa la maestra."),
      op("tipo", "¿Qué tipo de texto es este?", "Una noticia", ["Una receta", "Un cuento inventado"], null,
        "Cuenta algo que pasó de verdad, con quiénes, cuándo y dónde, y lo que dijeron las personas."),
    ] },
  { id: "quetzal", escalon: 6, tipo: "informativo", emoji: "🐦", titulo: "El quetzal",
    parrafos: [
      "El quetzal es una de las aves más bonitas de América. El macho es de color verde brillante con el pecho rojo, y tiene en la cola unas plumas larguísimas que pueden medir más que su propio cuerpo. La hembra es menos colorida y no tiene esas plumas largas.",
      "En Costa Rica vive en los bosques nubosos de las montañas, como los de Monteverde y San Gerardo de Dota. Su comida favorita es el aguacatillo, un fruto pequeño parecido al aguacate. Se traga el fruto entero y después devuelve la semilla, y así ayuda a sembrar nuevos árboles.",
      "El quetzal hace su nido en huecos de troncos viejos. Para protegerlo, es importante cuidar los bosques donde vive. En mi opinión, verlo volar entre la neblina es como ver una joya con alas.",
    ],
    preguntas: [
      op("literal", "¿En qué se diferencian el macho y la hembra?", "Solo el macho tiene las plumas largas en la cola", ["La hembra es más colorida y tiene la cola más larga", "El macho no puede volar"], "La hembra es menos colorida y no tiene esas plumas largas"),
      op("literal", "¿Cuál es la comida favorita del quetzal?", "El aguacatillo", ["Los insectos del río", "Las semillas de café"], "Su comida favorita es el aguacatillo"),
      op("inferencia", "¿Cómo ayuda el quetzal a sembrar árboles?", "Devuelve las semillas de los frutos que come", ["Entierra frutas con las patas", "Hace nidos en árboles nuevos"], "devuelve la semilla, y así ayuda a sembrar nuevos árboles"),
      op("opinion", "¿Cuál de estas frases es una OPINIÓN?", "Verlo volar es como ver una joya con alas", ["El quetzal hace su nido en troncos viejos", "El macho tiene el pecho rojo"], "En mi opinión, verlo volar entre la neblina",
        "Lo del nido y el color se puede comprobar; lo de la joya es lo que siente quien escribe."),
      op("idea", "¿Cuál es la idea principal del texto?", "Cómo es el quetzal, dónde vive y cómo cuidarlo", ["Cómo se forman las nubes", "Por qué el aguacate silvestre es bueno para la salud"], null,
        "Un párrafo dice cómo es, otro dónde vive y qué come, y el último cómo protegerlo."),
    ] },
  { id: "lapa", escalon: 6, tipo: "informativo", emoji: "🦜", titulo: "La lapa roja",
    parrafos: [
      "La lapa roja es un loro grande de plumas rojas, amarillas y azules. Tiene un pico curvo y muy fuerte con el que rompe semillas duras, como las del almendro de playa.",
      "En Costa Rica se puede ver en lugares como el Parque Nacional Carara y la península de Osa. Las lapas viven en parejas que se mantienen juntas por muchos años, y hacen sus nidos en huecos de árboles muy altos.",
      "Hace años, las lapas eran cazadas para venderlas como mascotas, y casi desaparecieron de algunas zonas. Hoy está prohibido tenerlas en jaulas y, gracias a proyectos de protección, cada vez se ven más volando en parejas por la costa del Pacífico.",
    ],
    preguntas: [
      op("literal", "¿Para qué le sirve el pico fuerte?", "Para romper semillas duras", ["Para hacer huecos en la tierra", "Para pelear con otras aves"], "con el que rompe semillas duras"),
      op("literal", "¿Dónde hacen sus nidos?", "En huecos de árboles muy altos", ["En la arena de la playa", "En los techos de las casas"], "hacen sus nidos en huecos de árboles muy altos"),
      op("inferencia", "¿Por qué casi desaparecieron de algunas zonas?", "Porque las cazaban para venderlas", ["Porque no tenían qué comer", "Porque se fueron a otros países"], "eran cazadas para venderlas como mascotas"),
      op("vocabulario", "Si algo está «prohibido», quiere decir que…", "No está permitido", ["Es muy caro", "Es obligatorio"], "está prohibido tenerlas en jaulas"),
      op("idea", "¿Cuál es la idea principal del texto?", "Cómo es la lapa roja y por qué hay que protegerla", ["Cómo se arma una jaula", "Dónde queda la península de Osa y cómo llegar hasta ahí"], null,
        "Describe la lapa, dice dónde vive y cuenta cómo se está protegiendo."),
    ] },
  { id: "manati", escalon: 6, tipo: "informativo", emoji: "🌊", titulo: "El manatí del Caribe",
    parrafos: [
      "El manatí es un mamífero grande que vive en ríos, lagunas y en el mar. Aunque pasa toda su vida en el agua, tiene que subir a la superficie a respirar aire, como nosotros.",
      "Es tranquilo y lento, y se alimenta solo de plantas acuáticas: ¡puede comer muchísimas en un día! En Costa Rica vive en el Caribe, en lugares como Tortuguero y el refugio Gandoca-Manzanillo.",
      "El manatí es el símbolo nacional de la fauna marina de Costa Rica. Sus mayores peligros son los golpes de los motores de los botes y la basura en el agua. Por eso, en los canales donde vive se pide navegar despacio.",
    ],
    preguntas: [
      op("inferencia", "¿Por qué el manatí sube a la superficie?", "Porque necesita respirar aire", ["Porque busca comida en la orilla", "Porque le gusta el sol"], "tiene que subir a la superficie a respirar aire"),
      op("literal", "¿Qué come el manatí?", "Plantas acuáticas", ["Peces pequeños", "Cangrejos y camarones"], "se alimenta solo de plantas acuáticas"),
      op("inferencia", "¿Por qué se pide navegar despacio en los canales?", "Para no golpear a los manatíes con los motores", ["Para no asustar a los turistas que van en otros botes", "Porque el agua es poco profunda"], "Por eso, en los canales donde vive se pide navegar despacio"),
      op("vocabulario", "El manatí es un «mamífero». Eso quiere decir que…", "Sus crías toman leche de su mamá", ["Pone huevos en la arena", "Tiene escamas como los peces"], "es un mamífero grande",
        "Los mamíferos, como nosotros, toman leche de su mamá cuando son pequeños."),
      op("idea", "¿Cuál es la idea principal del texto?", "Cómo vive el manatí y cómo protegerlo", ["Cómo se maneja un bote", "Por qué el mar es salado"], null,
        "Cuenta cómo respira, qué come, dónde vive y qué lo pone en peligro."),
    ] },
  { id: "acopio", escalon: 6, tipo: "noticia", emoji: "📰", titulo: "Escuela recolecta 500 kilos de material reciclable",
    parrafos: [
      "La Escuela La Esperanza recolectó 500 kilos de material reciclable durante la campaña «Mi escuela verde», que terminó el viernes pasado.",
      "Durante un mes, los estudiantes llevaron botellas, latas, papel y cartón limpios y separados. El material se entregó a un centro de acopio de la comunidad, que pagó con bolsas de abono para la huerta escolar.",
      "«Los niños les enseñaron a sus familias a separar la basura en la casa», contó la directora, Carmen Solís. El estudiante Marco Vargas, de sexto grado, opinó que «fue la campaña más divertida del año». La escuela planea repetirla en marzo.",
    ],
    preguntas: [
      op("literal", "¿Cuánto material se recolectó?", "500 kilos", ["50 kilos", "5 000 kilos"], "recolectó 500 kilos de material reciclable"),
      op("literal", "¿Qué recibieron a cambio del material?", "Bolsas de abono para la huerta", ["Plata para un paseo", "Libros para la biblioteca"], "pagó con bolsas de abono para la huerta escolar"),
      op("opinion", "¿Cuál de estas frases es una OPINIÓN?", "Fue la campaña más divertida del año", ["La campaña duró un mes", "El material se entregó a un centro de acopio"], "fue la campaña más divertida del año",
        "Que duró un mes o a dónde se llevó se puede comprobar; «la más divertida» es lo que piensa Marco."),
      op("vocabulario", "Un «centro de acopio» es…", "Un lugar donde se recibe material para reciclar", ["Una tienda grande donde se venden ropa y zapatos usados", "Un hospital"], "centro de acopio de la comunidad",
        "Ahí se entregó todo lo que juntaron para reciclar."),
      op("tipo", "¿Qué tipo de texto es?", "Una noticia", ["Un poema", "Una receta"], null,
        "Cuenta algo que pasó, con quiénes, cuándo y dónde, y lo que dijeron las personas."),
    ] },
  { id: "ballenas", escalon: 6, tipo: "informativo", emoji: "🐋", titulo: "Las ballenas jorobadas de Uvita",
    parrafos: [
      "Cada año, muchas ballenas jorobadas llegan a las aguas cálidas del Pacífico de Costa Rica. Vienen a tener sus crías y a cuidarlas en sus primeros meses de vida. Uno de los mejores lugares para verlas es el Parque Nacional Marino Ballena, en Uvita.",
      "Algo especial de Costa Rica es que recibe ballenas de dos lugares distintos: unas vienen del sur, de las aguas frías cerca de la Antártida, entre julio y noviembre; otras vienen del norte, entre diciembre y abril. Por eso, aquí se pueden ver ballenas casi todo el año.",
      "En Punta Uvita, cuando baja la marea, se forma una lengua de arena con forma de cola de ballena. Para observarlas hay que ir con guías autorizados, que mantienen el bote a distancia para no molestarlas.",
    ],
    preguntas: [
      op("literal", "¿Para qué llegan las ballenas a Costa Rica?", "Para tener sus crías", ["Para comer peces pequeños", "Para escapar del frío del Caribe"], "Vienen a tener sus crías"),
      op("inferencia", "¿Por qué en Costa Rica se ven ballenas casi todo el año?", "Porque llegan del sur y del norte en meses distintos", ["Porque viven siempre aquí", "Porque el agua es muy fría"], "recibe ballenas de dos lugares distintos"),
      op("literal", "¿Qué se forma en Punta Uvita cuando baja la marea?", "Una lengua de arena con forma de cola de ballena", ["Una isla rocosa con forma de tortuga marina gigante", "Un río de agua dulce"], "se forma una lengua de arena con forma de cola de ballena"),
      op("inferencia", "¿Por qué los guías mantienen el bote a distancia?", "Para no molestar a las ballenas", ["Para que no se moje la gente", "Porque desde lejos se ven más grandes"], "para no molestarlas"),
      op("idea", "¿Cuál es la idea principal del texto?", "Por qué y cuándo llegan las ballenas a Costa Rica", ["Cómo se pesca en Uvita", "Cómo se construye un barco para ver ballenas en Uvita"], null,
        "Explica para qué vienen, de dónde, en qué meses y cómo verlas sin molestarlas."),
    ] },

  // ---------- 8. Personajes y enseñanzas (4° y 5°) ----------
  { id: "cafe", escalon: 7, tipo: "cuento", emoji: "☕", titulo: "La cogida de café",
    parrafos: [
      "En diciembre, cuando Daniela salía de vacaciones, su familia se iba a coger café a una finca de Naranjo. Se levantaban antes de que saliera el sol, se ponían botas y camisa de manga larga, y cada uno llevaba su canasto amarrado a la cintura.",
      "Daniela aprendió que solo se cogen los granos rojos, porque los verdes todavía no están maduros. Al principio llenaba el canasto muy despacio y se le caían muchos granos al suelo. Su abuela, que cogía café desde niña, le enseñó a sostener la rama con una mano y a arrancar los granos con la otra.",
      "Al final del día, el recibidor medía el café en cajuelas. Daniela había llenado su primera cajuela completa. Estaba cansada y tenía las manos manchadas, pero cuando le pagaron, sintió que esa plata valía el doble, porque se la había ganado con su esfuerzo.",
    ],
    preguntas: [
      op("literal", "¿Por qué solo se cogen los granos rojos?", "Porque los verdes no están maduros", ["Porque los rojos son más grandes y dulces", "Porque los verdes son venenosos"], "los verdes todavía no están maduros"),
      op("vocabulario", "En este texto, ¿qué es una «cajuela»?", "Una medida para el café", ["La parte de atrás de un carro", "Un canasto para dormir"], "el recibidor medía el café en cajuelas",
        "«Cajuela» también es la parte de atrás de un carro, pero aquí se usa para medir el café."),
      op("literal", "¿Quién le enseñó a Daniela a coger café más rápido?", "Su abuela", ["El recibidor", "Su mamá"], "Su abuela, que cogía café desde niña, le enseñó"),
      op("inferencia", "¿Por qué Daniela sintió que la plata valía el doble?", "Porque se la había ganado con su esfuerzo", ["Porque le pagaron el doble que a los demás", "Porque era plata de otro país"], "porque se la había ganado con su esfuerzo"),
    ] },
  { id: "nueva", escalon: 7, tipo: "cuento", emoji: "✏️", titulo: "La nueva de la clase",
    parrafos: [
      "A mitad de año llegó una niña nueva a quinto grado: se llamaba Yolanda y venía de Nicaragua. El primer día casi no habló. En el recreo se sentó sola en una banca, mirando cómo los demás jugaban.",
      "Tomás notó que Yolanda tenía un cuaderno lleno de dibujos de pájaros. Se acercó y le preguntó por uno de colores brillantes. «Es un guardabarranco, el ave nacional de mi país», le explicó ella con una sonrisa. Tomás le contó que el ave nacional de Costa Rica es el yigüirro, que es café y sencillo, pero canta muy bonito.",
      "Desde ese día, Yolanda y Tomás dibujan pájaros juntos en el recreo. Con el tiempo, Yolanda se animó a enseñarle su cuaderno a toda la clase. Ya nadie la ve como «la nueva», sino como la mejor dibujante de quinto.",
    ],
    preguntas: [
      op("sentimiento", "¿Cómo se sentía Yolanda el primer día?", "Tímida y sola", ["Enojada con todos", "Alegre"], "El primer día casi no habló",
        "Casi no habló y se sentó sola en el recreo."),
      op("literal", "¿Qué hizo Tomás para acercarse a Yolanda?", "Le preguntó por uno de sus dibujos", ["La invitó a jugar fútbol con sus amigos", "Le prestó un lápiz"], "le preguntó por uno de colores brillantes"),
      op("literal", "Según el texto, ¿cuál es el ave nacional de Nicaragua?", "El guardabarranco", ["El yigüirro", "El pájaro carpintero"], "Es un guardabarranco, el ave nacional de mi país",
        "El yigüirro es el ave nacional de Costa Rica."),
      op("vocabulario", "Yolanda «se animó» a enseñar su cuaderno. Eso quiere decir que…", "Se atrevió a hacerlo", ["Se puso triste", "Se cansó de enseñarlo"], "Yolanda se animó a enseñarle su cuaderno"),
      op("ensenanza", "¿Cuál es la enseñanza del texto?", "Ser amable ayuda a que otros no se sientan solos", ["Los nuevos siempre deben esperar a que les hablen primero", "Es mejor dibujar pájaros que jugar en el recreo"], null,
        "Tomás se acercó con amabilidad, y gracias a eso Yolanda dejó de sentirse sola."),
    ] },
  { id: "reloj", escalon: 7, tipo: "cuento", emoji: "⌚", titulo: "El reloj del abuelo",
    parrafos: [
      "En la sala de la casa de Fernanda había un reloj de pared que había sido del bisabuelo. Nadie podía tocarlo; solo su abuelo le daba cuerda cada domingo. Un sábado, jugando con la bola dentro de la casa, Fernanda le pegó al reloj y el vidrio se quebró.",
      "Asustada, recogió los vidrios y pensó en decir que había sido el gato. Toda la tarde estuvo callada, con un peso en el pecho. En la cena no pudo comer y, al final, se acercó al abuelo con los ojos llorosos y le contó la verdad.",
      "El abuelo se quedó serio un rato. Después le dijo: «El vidrio se puede cambiar. Lo que me importa es que me dijiste la verdad, y eso vale más que cualquier reloj». Al día siguiente fueron juntos a la relojería, y desde entonces Fernanda le ayuda a darle cuerda cada domingo.",
    ],
    preguntas: [
      op("literal", "¿Qué pensó decir Fernanda al principio?", "Que había sido el gato", ["Que el reloj se cayó solo", "Que había sido su primo"], "pensó en decir que había sido el gato"),
      op("figurado", "Fernanda estaba «con un peso en el pecho». Eso quiere decir que…", "Se sentía mal por lo que había hecho", ["Tenía algo pesado en la camisa", "Le dolía el pecho de correr"], "con un peso en el pecho"),
      op("inferencia", "¿Por qué el abuelo dijo que la verdad vale más que el reloj?", "Porque poder confiar en ella era lo más importante", ["Porque el reloj ya no servía y no se podía arreglar", "Porque el vidrio era barato"], "eso vale más que cualquier reloj"),
      op("literal", "¿Qué hace ahora Fernanda los domingos?", "Le ayuda al abuelo a darle cuerda al reloj", ["Juega bola en la sala", "Va sola a la relojería del centro a comprar baterías"], "Fernanda le ayuda a darle cuerda cada domingo"),
      op("ensenanza", "¿Cuál es la enseñanza del cuento?", "Decir la verdad, aunque cueste, da confianza", ["Hay que esconder los errores para que nadie se enoje", "Los relojes viejos no sirven"], null,
        "A Fernanda le costó, pero decir la verdad hizo que su abuelo confiara más en ella."),
    ] },
  { id: "portero", escalon: 7, tipo: "cuento", emoji: "🦽", titulo: "El mejor portero",
    parrafos: [
      "Andrés usa silla de ruedas desde pequeño. Le encanta el fútbol y se sabe de memoria los nombres de todos los jugadores de la Selección. Pero en los recreos se quedaba mirando, porque nadie lo invitaba a jugar.",
      "Un día, Nicole tuvo una idea: «¿Y si Andrés es el portero? Tiene los brazos fuertes y unos reflejos buenísimos». Algunos dudaron, pero probaron. Andrés atajó tres tiros seguidos y todos se quedaron con la boca abierta.",
      "Desde entonces, el equipo cambió algunas reglas para que todos pudieran jugar: los partidos son en la cancha de cemento y nadie patea fuerte cerca de la portería. Ahora Andrés es el portero titular, y sus compañeros dicen que es el mejor del recreo.",
    ],
    preguntas: [
      op("literal", "¿Por qué Andrés se quedaba mirando en los recreos?", "Porque nadie lo invitaba a jugar", ["Porque no le gustaba el fútbol ni ningún deporte", "Porque estaba castigado"], "nadie lo invitaba a jugar"),
      op("figurado", "«Se quedaron con la boca abierta» quiere decir que…", "Se sorprendieron mucho", ["Tenían mucha hambre", "Se pusieron a gritar"], "se quedaron con la boca abierta"),
      op("literal", "¿Para qué cambiaron algunas reglas?", "Para que todos pudieran jugar", ["Para que Andrés no atajara tanto", "Porque la maestra lo ordenó"], "para que todos pudieran jugar"),
      op("sentimiento", "¿Cómo creés que se siente Andrés ahora?", "Incluido y feliz con su equipo", ["Solo y aburrido", "Enojado con Nicole"], "Ahora Andrés es el portero titular",
        "Pasó de mirar desde afuera a ser el portero del equipo."),
      op("ensenanza", "¿Cuál es la enseñanza del cuento?", "Incluir a todos hace mejor al equipo", ["Solo deben jugar los que corren rápido", "Es mejor jugar solo"], null,
        "Cuando le dieron un lugar a Andrés, el equipo ganó un gran portero."),
    ] },
  { id: "examen", escalon: 7, tipo: "cuento", emoji: "📝", titulo: "La nota de Gabriel",
    parrafos: [
      "El día del examen de matemática, Gabriel vio que su compañero de al lado tenía todas las respuestas escritas en la mano. El compañero le hizo una seña para que mirara. Gabriel sintió que el corazón le latía rapidísimo.",
      "Pensó en las tardes en que su mamá le había ayudado a estudiar las fracciones con pedazos de tortilla. Pensó también en lo que diría su maestra si lo descubría. Respiró hondo, miró su propia hoja y siguió resolviendo los ejercicios a su manera.",
      "Gabriel sacó 78. Su compañero sacó 95, pero la maestra descubrió lo que había hecho y le pidió que repitiera el examen. Esa tarde, Gabriel le enseñó la nota a su mamá. «No es un cien», le dijo él. «Para mí vale más que un cien, porque es tuya», le contestó ella.",
    ],
    preguntas: [
      op("literal", "¿Qué tenía escrito el compañero en la mano?", "Las respuestas del examen", ["Su número de teléfono", "Una lista de compras"], "tenía todas las respuestas escritas en la mano"),
      op("sentimiento", "Cuando el compañero le hizo la seña, Gabriel se sintió…", "Nervioso", ["Aburrido", "Muy tranquilo"], "el corazón le latía rapidísimo"),
      op("inferencia", "¿Qué recordó Gabriel que lo ayudó a decidir?", "Las tardes estudiando con su mamá", ["Un partido de fútbol", "Lo que comió en el almuerzo"], "su mamá le había ayudado a estudiar las fracciones"),
      op("inferencia", "¿Qué quiso decir la mamá con «vale más que un cien, porque es tuya»?", "Que la nota fue honesta, ganada por él", ["Que 78 es más que 100", "Que la maestra se equivocó al revisar el examen"], "porque es tuya"),
      op("ensenanza", "¿Cuál es la enseñanza del cuento?", "Es mejor una nota honesta que una copiada", ["Hay que sacar cien como sea", "Los exámenes no sirven para nada si uno no saca cien"], null,
        "Gabriel sacó menos que su compañero, pero su nota fue suya de verdad."),
    ] },
  { id: "abuela", escalon: 7, tipo: "cuento", emoji: "📚", titulo: "La abuela aprende a leer",
    parrafos: [
      "Doña Amalia tiene setenta y dos años. De niña tuvo que dejar la escuela para ayudar en la finca, y nunca aprendió a leer. Cada vez que le llegaba una carta, tenía que pedirle a alguien que se la leyera.",
      "Un día, su nieta Alison, que está en tercer grado, le propuso enseñarle. Todas las tardes se sentaban en el corredor con un cuaderno. Alison le enseñaba las letras con paciencia, como lo hacía su maestra con ella. A veces doña Amalia se cansaba y decía que ya estaba muy vieja, pero Alison le respondía: «Nunca es tarde, abuela».",
      "Seis meses después, doña Amalia leyó sola, en voz alta, el nombre de su pueblo en un rótulo de la carretera. Se puso a llorar de alegría. Ahora lee el periódico, las recetas y hasta los mensajes del celular, y dice que su nieta es la mejor maestra del mundo.",
    ],
    preguntas: [
      op("literal", "¿Por qué doña Amalia no aprendió a leer de niña?", "Porque tuvo que dejar la escuela para ayudar en la finca", ["Porque cuando era niña no le gustaba estudiar ni ir a la escuela", "Porque no había escuelas"], "tuvo que dejar la escuela para ayudar en la finca"),
      op("literal", "¿Cómo le enseñaba Alison?", "Con paciencia, como su maestra", ["Con regaños", "Con videos del celular"], "con paciencia, como lo hacía su maestra con ella"),
      op("vocabulario", "Un «rótulo» es…", "Un letrero", ["Un tipo de carro", "Un árbol grande"], "en un rótulo de la carretera"),
      op("sentimiento", "¿Por qué lloró doña Amalia?", "De alegría por poder leer sola", ["Porque estaba cansada", "Porque se perdió en la carretera"], "Se puso a llorar de alegría"),
      op("ensenanza", "¿Cuál es la enseñanza del cuento?", "Con paciencia y esfuerzo se aprende a cualquier edad", ["Los adultos ya no pueden aprender cosas nuevas aunque lo intenten", "Leer no sirve en el campo"], "Nunca es tarde, abuela"),
    ] },
  { id: "feriaciencia", escalon: 7, tipo: "cuento", emoji: "🔬", titulo: "La feria científica",
    parrafos: [
      "Para la feria científica, a Mariana, Josué y Kendall les tocó trabajar juntos. Mariana quería hacer un volcán de bicarbonato, Josué quería estudiar las hormigas y Kendall no decía nada. La primera semana solo discutieron y no avanzaron.",
      "Un día, la maestra les sugirió escuchar la idea de cada uno. Entonces Kendall, que casi nunca hablaba, contó que en su casa la ropa tardaba mucho en secarse en la época lluviosa. Propuso investigar qué tela se secaba más rápido. A los otros dos les encantó la idea.",
      "Durante dos semanas mojaron pedazos de tela y midieron cuánto tardaban en secarse. Descubrieron que el poliéster se secaba más rápido que el algodón. El día de la feria, Kendall explicó los resultados con seguridad, y el grupo ganó una mención especial por su trabajo en equipo.",
    ],
    preguntas: [
      op("literal", "¿Qué pasó la primera semana?", "Solo discutieron y no avanzaron", ["Terminaron el proyecto", "Ganaron la feria"], "La primera semana solo discutieron"),
      op("inferencia", "¿Qué cambió cuando escucharon la idea de cada uno?", "Encontraron una idea que les gustó a todos", ["Cada uno trabajó por aparte", "Escogieron el volcán"], "A los otros dos les encantó la idea"),
      op("literal", "¿Qué descubrieron en el experimento?", "Que el poliéster se seca más rápido que el algodón", ["Que el algodón se seca mucho más rápido que el poliéster", "Que todas las telas tardan igual"], "el poliéster se secaba más rápido que el algodón"),
      op("inferencia", "¿Cómo cambió Kendall al final?", "Habló con seguridad frente a todos", ["Siguió sin decir nada", "Se enojó con el grupo"], "Kendall explicó los resultados con seguridad",
        "Al principio casi nunca hablaba; al final explicó los resultados con seguridad."),
      op("ensenanza", "¿Cuál es la enseñanza del cuento?", "Escuchar a todos mejora el trabajo en equipo", ["En un grupo siempre gana el que grita más fuerte", "Es mejor trabajar solo"], null,
        "La mejor idea salió de la persona que menos hablaba, cuando la escucharon."),
    ] },
  { id: "asiento", escalon: 7, tipo: "cuento", emoji: "🚍", titulo: "El asiento de Felipe",
    parrafos: [
      "Todos los días, Felipe viaja en bus a la escuela. Siempre se sienta en el mismo asiento, junto a la ventana, y se pone los audífonos.",
      "Una mañana, el bus iba lleno. En una parada se subió una señora mayor con un bastón y dos bolsas del mercado. Nadie se levantó. Felipe miró por la ventana, haciéndose el que no veía, pero la señora casi se cae cuando el bus arrancó.",
      "Felipe se quitó los audífonos, se levantó y le dio su asiento. La señora le sonrió y le regaló un mamón chino de su bolsa. Felipe viajó de pie el resto del camino, pero se bajó del bus sintiéndose más grande que nunca.",
    ],
    preguntas: [
      op("literal", "¿Qué llevaba la señora?", "Un bastón y dos bolsas del mercado", ["Una maleta y un paraguas", "Un perro pequeño"], "con un bastón y dos bolsas del mercado"),
      op("figurado", "Felipe miraba por la ventana «haciéndose el que no veía». Eso quiere decir que…", "Fingía no darse cuenta", ["No podía ver bien", "Estaba dormido"], "haciéndose el que no veía"),
      op("inferencia", "¿Qué hizo que Felipe cambiara de idea?", "Ver que la señora casi se cae", ["Que el chofer se lo ordenó", "Que se le acabó la batería"], "la señora casi se cae cuando el bus arrancó"),
      op("figurado", "Felipe se sintió «más grande que nunca». Eso quiere decir que…", "Se sintió orgulloso de lo que hizo", ["Creció de tamaño", "Le quedó pequeña la ropa de tanto crecer"], "sintiéndose más grande que nunca"),
      op("ensenanza", "¿Cuál es la enseñanza del cuento?", "Hay que ayudar aunque los demás no lo hagan", ["Hay que llegar temprano a la parada para tener asiento", "Los audífonos son malos"], null,
        "Nadie se levantó, pero Felipe decidió ayudar a la señora."),
    ] },

  // ---------- 9. Textos expositivos (5° y 6°) ----------
  { id: "irazu", escalon: 8, tipo: "informativo", emoji: "🌋", titulo: "El volcán Irazú",
    parrafos: [
      "El volcán Irazú está en la provincia de Cartago y es el volcán más alto de Costa Rica: su cima está a más de 3 400 metros sobre el nivel del mar. En los días despejados, desde allí se pueden ver el océano Pacífico y el mar Caribe.",
      "El Irazú es un volcán activo. Entre 1963 y 1965 tuvo una gran erupción que cubrió de ceniza a San José y a Cartago. Las personas tenían que barrer la ceniza de los techos y andar con pañuelos en la cara. Sin embargo, con los años, esa ceniza volvió más fértiles los suelos de la zona.",
      "Hoy, el volcán forma parte del Parque Nacional Volcán Irazú, que recibe visitantes de todo el mundo. Allí hace mucho frío, por lo que conviene llevar abrigo. En mi opinión, ver el cráter es una experiencia que todo costarricense debería vivir.",
    ],
    preguntas: [
      op("literal", "¿Qué pasó entre 1963 y 1965?", "Una erupción llenó de ceniza San José y Cartago", ["Un terremoto botó las casas de San José y Cartago", "Cerraron el parque nacional por mucho frío"], "Entre 1963 y 1965 tuvo una gran erupción"),
      op("inferencia", "¿Qué consecuencia buena tuvo la ceniza con los años?", "Volvió más fértiles los suelos", ["Limpió los techos", "Hizo que dejara de llover"], "esa ceniza volvió más fértiles los suelos de la zona",
        "«Sin embargo» anuncia algo distinto: después de lo malo, algo bueno."),
      op("opinion", "¿Cuál de estas frases es una OPINIÓN?", "Todo costarricense debería ver el cráter", ["El Irazú es un volcán activo de Cartago", "Su cima está a más de 3 400 metros de altura"], "En mi opinión, ver el cráter",
        "Las otras dos se pueden comprobar: son datos."),
      op("proposito", "¿Cuál es el propósito principal del texto?", "Informar sobre el volcán Irazú", ["Convencer de no visitar volcanes", "Contar un cuento inventado"], null,
        "Da datos de dónde está, su historia y el parque: es un texto para informar."),
      op("idea", "¿Cuál es la idea principal del segundo párrafo?", "La gran erupción del Irazú y sus consecuencias", ["El frío que hace cuando uno visita el volcán", "La altura del volcán y lo que se ve desde arriba"], "Entre 1963 y 1965 tuvo una gran erupción"),
    ] },
  { id: "agua", escalon: 8, tipo: "informativo", emoji: "💧", titulo: "¿Cómo cuidamos el agua?",
    parrafos: [
      "El agua dulce que podemos usar es muy poca comparada con toda el agua del planeta. Aunque en Costa Rica llueve mucho, en algunos lugares, como Guanacaste, hay épocas en que falta el agua.",
      "En la casa podemos ahorrar agua con acciones sencillas: cerrar el tubo mientras nos cepillamos los dientes, bañarnos en menos tiempo, arreglar las fugas y regar las plantas temprano en la mañana o al final de la tarde, cuando el sol no evapora tan rápido el agua.",
      "Cuidar el agua no es solo tarea de los adultos. Si cada estudiante ahorra un poco todos los días, entre todos ahorramos muchísimo. ¡Empecemos hoy!",
    ],
    preguntas: [
      op("proposito", "¿Cuál es el propósito de este texto?", "Convencer a los lectores de ahorrar agua", ["Contar la historia de un río de Guanacaste", "Explicar cómo se forma la lluvia"], "¡Empecemos hoy!",
        "Da razones y consejos, y termina invitando a actuar: quiere convencer."),
      op("literal", "¿Por qué conviene regar las plantas temprano o al final de la tarde?", "Porque el sol no evapora tan rápido el agua", ["Porque al mediodía las plantas están dormidas", "Porque el agua está más fría"], "cuando el sol no evapora tan rápido el agua"),
      op("vocabulario", "En Costa Rica, ¿qué quiere decir «cerrar el tubo»?", "Cerrar la llave del agua", ["Cortar un pedazo de tubería", "Tapar el desagüe"], "cerrar el tubo mientras nos cepillamos los dientes"),
      op("inferencia", "¿Qué quiere decir «entre todos ahorramos muchísimo»?", "Que lo poquito de cada uno suma mucho", ["Que solo los adultos tienen que ahorrar agua", "Que hay que ahorrar plata"], "Si cada estudiante ahorra un poco todos los días"),
      op("idea", "¿Cuál es la idea principal del texto?", "Todos podemos ahorrar agua en la casa", ["En Guanacaste nunca llueve", "El agua del mar se puede tomar si se hierve"], null,
        "El texto explica por qué hay que cuidar el agua y cómo puede ayudar cada uno."),
    ] },
  { id: "cafeoro", escalon: 8, tipo: "informativo", emoji: "☕", titulo: "El café, el grano de oro",
    parrafos: [
      "El café llegó a Costa Rica a finales del siglo XVIII y, con el tiempo, se convirtió en el producto más importante del país. Durante el siglo XIX, los cafetaleros vendían el grano a Europa, y con esas ganancias se construyeron caminos, escuelas y edificios como el Teatro Nacional. Por eso al café se le llamó «el grano de oro».",
      "Antes de que existieran el tren y las carreteras, el café se llevaba al puerto de Puntarenas en carretas jaladas por bueyes. De esa tradición nació la carreta típica pintada de colores, que hoy es el símbolo nacional del trabajo.",
      "Hoy, el café de Costa Rica es conocido en el mundo por su calidad. Se cultiva en zonas como Tarrazú, el Valle Central y Naranjo. Sin embargo, cada vez hay menos cafetales cerca de las ciudades, porque muchos terrenos se han usado para construir casas.",
    ],
    preguntas: [
      op("inferencia", "¿Por qué al café se le llamó «el grano de oro»?", "Porque dejó muchas ganancias al país", ["Porque el grano de café es de color amarillo brillante", "Porque se cambiaba por oro"], "con esas ganancias se construyeron caminos, escuelas y edificios",
        "No era de oro: valía mucho porque con lo que se ganaba se construyó el país."),
      op("literal", "¿Cómo se llevaba el café a Puntarenas antes del tren?", "En carretas jaladas por bueyes", ["En barcos por el río", "En aviones pequeños"], "en carretas jaladas por bueyes"),
      op("inferencia", "¿Por qué hay menos cafetales cerca de las ciudades?", "Porque en esos terrenos se construyeron casas", ["Porque en Costa Rica ya no se vende ni se toma café", "Porque llueve menos"], "muchos terrenos se han usado para construir casas"),
      op("vocabulario", "En el último párrafo, «sin embargo» sirve para…", "Presentar algo distinto a lo anterior", ["Dar un ejemplo", "Terminar el texto"], "Sin embargo, cada vez hay menos cafetales",
        "Antes dice algo bueno del café; «sin embargo» anuncia un problema."),
      op("proposito", "¿Cuál es el propósito del texto?", "Informar sobre la historia e importancia del café", ["Convencer de tomar más café", "Contar el cuento de un cafetalero y su carreta de bueyes"], null,
        "Da datos de cuándo llegó, por qué fue importante y dónde se cultiva hoy."),
    ] },
  { id: "cacao", escalon: 8, tipo: "informativo", emoji: "🍫", titulo: "Del cacao al chocolate",
    parrafos: [
      "El cacao es un árbol originario de América. Sus frutos, llamados mazorcas, crecen pegados al tronco y a las ramas gruesas. Dentro de cada mazorca hay semillas cubiertas de una pulpa blanca y dulce.",
      "Para hacer chocolate, primero se sacan las semillas y se dejan fermentar varios días. Después se secan al sol, se tuestan y se muelen hasta formar una pasta. A esa pasta se le agrega azúcar y otros ingredientes para hacer las barras de chocolate.",
      "Para el pueblo bribri, el cacao es una planta sagrada que se usa en ceremonias importantes. En Costa Rica se cultiva sobre todo en el Caribe y en la zona norte. Muchas familias siembran el cacao junto con otros árboles, lo que ayuda a conservar el bosque y a los animales que viven en él.",
    ],
    preguntas: [
      op("literal", "¿Dónde crecen las mazorcas del cacao?", "Pegadas al tronco y a las ramas gruesas", ["En la punta de las hojas", "Debajo de la tierra"], "crecen pegados al tronco y a las ramas gruesas"),
      sec("Ordená los pasos para hacer chocolate:", ["Se sacan las semillas y se fermentan", "Se secan al sol", "Se tuestan y se muelen", "Se le agrega azúcar a la pasta"]),
      op("literal", "¿Qué significa el cacao para el pueblo bribri?", "Es una planta sagrada", ["Es una plaga del bosque", "Es un dulce para niños"], "el cacao es una planta sagrada"),
      op("inferencia", "¿Por qué sembrar cacao junto con otros árboles ayuda al bosque?", "Porque se conservan los árboles y los animales", ["Porque así el cacao ya no necesita agua ni cuidados", "Porque se vende más caro"], "lo que ayuda a conservar el bosque"),
      op("proposito", "¿Cuál es el propósito del texto?", "Explicar de dónde viene el chocolate y su importancia", ["Vender chocolate", "Contar la historia de una familia que vende chocolates"], null,
        "Explica cómo es el cacao, cómo se hace el chocolate y por qué el cacao es importante."),
    ] },
  { id: "volcanes", escalon: 8, tipo: "informativo", emoji: "🌋", titulo: "¿Por qué hay tantos volcanes en Costa Rica?",
    parrafos: [
      "La superficie de la Tierra está formada por enormes pedazos de roca llamados placas tectónicas, que se mueven muy despacio. Costa Rica está en un lugar donde una placa se mete debajo de otra. Ahí, con el calor de las profundidades, la roca se derrite y se forma magma, que a veces sube y sale por los volcanes.",
      "Por eso Costa Rica forma parte del Cinturón de Fuego del Pacífico, una zona con muchos volcanes y temblores alrededor del océano Pacífico. En el país hay volcanes muy conocidos, como el Arenal, el Poás, el Irazú, el Turrialba y el Rincón de la Vieja.",
      "Los volcanes pueden ser peligrosos, pero también traen beneficios: la ceniza vuelve fértiles los suelos y el calor de la tierra se usa en Guanacaste para producir electricidad con energía geotérmica. Además, atraen a turistas de todo el mundo.",
    ],
    preguntas: [
      op("vocabulario", "¿Qué son las «placas tectónicas»?", "Pedazos enormes de roca de la superficie de la Tierra", ["Platos de barro antiguos", "Capas de nubes"], "enormes pedazos de roca llamados placas tectónicas"),
      op("inferencia", "Según el texto, ¿por qué hay tantos volcanes en Costa Rica?", "Porque aquí una placa se mete debajo de otra", ["Porque llueve mucho", "Porque hay mucho bosque y llueve casi todo el año"], "una placa se mete debajo de otra"),
      op("literal", "¿Para qué se usa el calor de la tierra en Guanacaste?", "Para producir electricidad", ["Para cocinar en los hoteles", "Para calentar el mar"], "para producir electricidad con energía geotérmica"),
      op("idea", "¿Cuál es la idea principal del tercer párrafo?", "Los beneficios de los volcanes", ["Los peligros de vivir cerca de un volcán", "Los nombres de los volcanes del país"], "también traen beneficios"),
      op("proposito", "¿Cuál es el propósito del texto?", "Explicar por qué hay volcanes y qué beneficios traen", ["Convencer a las personas de no visitar nunca los volcanes", "Contar una leyenda de un volcán"], null,
        "Explica la causa (las placas) y las consecuencias (volcanes, temblores y beneficios)."),
    ] },
  { id: "ostional", escalon: 8, tipo: "informativo", emoji: "🐢", titulo: "Las arribadas de Ostional",
    parrafos: [
      "En la playa de Ostional, en Guanacaste, ocurre algo que pasa en muy pocos lugares del mundo: las arribadas. Durante varias noches seguidas, miles de tortugas lora salen del mar casi al mismo tiempo para poner sus huevos en la arena.",
      "Cada tortuga cava un hueco con sus aletas traseras, pone alrededor de cien huevos, los tapa y regresa al mar. Unas siete semanas después nacen las tortuguitas, que deben llegar solas hasta el agua.",
      "La playa forma parte del Refugio Nacional de Vida Silvestre Ostional, donde la comunidad y los guardaparques trabajan juntos para proteger a las tortugas. Los visitantes deben ir con guías locales y respetar las reglas, como no usar luces fuertes en la noche.",
    ],
    preguntas: [
      op("vocabulario", "¿Qué es una «arribada»?", "Cuando miles de tortugas llegan juntas a poner huevos", ["Una ola muy grande", "Un barco que llega al puerto"], "miles de tortugas lora salen del mar casi al mismo tiempo"),
      op("literal", "¿Cuántos huevos pone, más o menos, cada tortuga?", "Alrededor de cien", ["Alrededor de diez", "Alrededor de mil"], "pone alrededor de cien huevos"),
      sec("Ordená lo que hace cada tortuga:", ["Sale del mar", "Cava un hueco con las aletas", "Pone los huevos y los tapa", "Regresa al mar"]),
      op("inferencia", "¿Por qué no se deben usar luces fuertes en la noche?", "Porque confunden a las tortugas", ["Porque se gasta la batería", "Porque está prohibido entrar a la playa"], "como no usar luces fuertes en la noche",
        "La luz puede desorientar a las tortugas y a las tortuguitas que buscan el mar."),
      op("proposito", "¿Cuál es el propósito del texto?", "Informar sobre las arribadas y cómo cuidar a las tortugas", ["Invitar a pescar en Ostional", "Contar la vida de un guardaparques que trabaja en la playa"], null,
        "Explica qué son las arribadas, cómo nacen las tortugas y cómo se protegen."),
    ] },
  { id: "nuboso", escalon: 8, tipo: "informativo", emoji: "☁️", titulo: "El bosque nuboso de Monteverde",
    parrafos: [
      "En las montañas de Monteverde, en Puntarenas, hay un bosque muy especial: el bosque nuboso. Se llama así porque casi siempre está cubierto de nubes y neblina, que pasan entre los árboles empujadas por el viento.",
      "Los árboles del bosque nuboso están cubiertos de musgos, helechos, orquídeas y bromelias, que crecen sobre sus ramas. Estas plantas atrapan el agua de las nubes, que luego gotea hasta el suelo y forma quebradas y ríos. Por eso se dice que el bosque nuboso es como una fábrica de agua.",
      "En Monteverde viven el quetzal, el pájaro campana y cientos de especies de orquídeas. Para protegerlo se crearon reservas y áreas protegidas. Los científicos estudian estos bosques porque son muy sensibles a los cambios del clima.",
    ],
    preguntas: [
      op("literal", "¿Por qué se llama bosque nuboso?", "Porque casi siempre está cubierto de nubes", ["Porque sus árboles son muy altos", "Porque llueve solo de noche"], "casi siempre está cubierto de nubes y neblina"),
      op("figurado", "¿Por qué se dice que el bosque nuboso es «como una fábrica de agua»?", "Porque sus plantas atrapan el agua de las nubes", ["Porque ahí hay una fábrica que llena botellas de agua", "Porque llueve todo el día"], "Estas plantas atrapan el agua de las nubes"),
      op("literal", "¿Qué plantas crecen sobre las ramas?", "Musgos, helechos, orquídeas y bromelias", ["Cafetos, bananos y caña", "Mangos, aguacates y naranjas"], "musgos, helechos, orquídeas y bromelias"),
      op("literal", "¿Por qué los científicos estudian estos bosques?", "Porque son muy sensibles a los cambios del clima", ["Porque tienen oro", "Porque son fáciles de visitar y quedan cerca de la ciudad"], "son muy sensibles a los cambios del clima"),
      op("idea", "¿Cuál es la idea principal del texto?", "Cómo es el bosque nuboso y por qué es importante", ["Cómo se forman los volcanes", "Cómo viajar a Puntarenas"], null,
        "Explica por qué se llama así, cómo da agua y qué vive en él."),
    ] },
  { id: "aguatubo", escalon: 8, tipo: "informativo", emoji: "🚰", titulo: "¿De dónde viene el agua del tubo?",
    parrafos: [
      "Cuando abrimos el tubo, el agua sale limpia, pero hizo un largo viaje. Puede venir de nacientes en las montañas, de ríos o de pozos que sacan el agua de debajo de la tierra.",
      "Antes de llegar a las casas, el agua pasa por una planta potabilizadora. Ahí se le quitan la tierra, las hojas y otras impurezas, y se le agrega un poco de cloro para eliminar los microbios que causan enfermedades. Después se guarda en tanques y viaja por tuberías hasta cada casa.",
      "Que el agua sea potable quiere decir que se puede tomar sin peligro. Cuidarla no es solo no desperdiciarla: también es proteger los bosques donde están las nacientes y no tirar basura a los ríos. Sin bosques ni ríos limpios, no habría agua en el tubo.",
    ],
    preguntas: [
      op("vocabulario", "¿Qué quiere decir que el agua sea «potable»?", "Que se puede tomar sin peligro", ["Que viene del mar", "Que está caliente"], "se puede tomar sin peligro"),
      sec("Ordená el viaje del agua:", ["Sale de una naciente o de un río", "Pasa por la planta potabilizadora", "Se guarda en tanques", "Viaja por tuberías hasta las casas"]),
      op("literal", "¿Para qué se le agrega cloro al agua?", "Para eliminar los microbios", ["Para que tenga sabor", "Para que se vea azul"], "para eliminar los microbios que causan enfermedades"),
      op("inferencia", "¿Por qué cuidar los bosques ayuda a tener agua?", "Porque en los bosques están las nacientes", ["Porque los árboles fabrican el cloro que limpia el agua", "Porque en el bosque no llueve"], "proteger los bosques donde están las nacientes"),
      op("proposito", "¿Cuál es el propósito del texto?", "Explicar el recorrido del agua y por qué cuidarla", ["Vender filtros para el agua", "Contar un paseo al río"], null,
        "Explica de dónde viene el agua, cómo se limpia y qué podemos hacer para cuidarla."),
    ] },

  // ---------- 10. Crónicas, cartas y poemas (6°) ----------
  { id: "sabanero", escalon: 9, tipo: "cuento", emoji: "🐂", titulo: "El último arreo",
    parrafos: [
      "Don Efraín había sido sabanero en Guanacaste durante cuarenta años. Conocía cada palo de guanacaste del camino y cada vuelta del río Tempisque como la palma de su mano. Esa mañana de enero, el sol ya quemaba como un comal y el viento levantaba remolinos de polvo en el potrero.",
      "Era su último arreo antes de retirarse. Su nieta Fabiola, de doce años, montaba a su lado en una yegua mansa. Él le iba enseñando a leer las señales: «Cuando las vacas se juntan y miran todas hacia el mismo lado, algo las asustó». Fabiola escuchaba con los ojos bien abiertos, guardando cada palabra como un tesoro.",
      "Al caer la tarde, el ganado entró completo al corral. Don Efraín se quitó el sombrero, miró a su nieta y le dijo: «Ahora el camino es tuyo». Fabiola no contestó nada; solo apretó las riendas y sonrió. Esa noche, por primera vez en cuarenta años, don Efraín durmió sin pensar en el ganado.",
    ],
    preguntas: [
      op("figurado", "«El sol quemaba como un comal» quiere decir que…", "Hacía muchísimo calor", ["Estaban cocinando tortillas", "El sol estaba muy bajo"], "el sol ya quemaba como un comal",
        "El comal es una plancha muy caliente: es una comparación."),
      op("figurado", "Conocía el río «como la palma de su mano». Eso significa que…", "Conocía el camino perfectamente", ["Llevaba un mapa del río en la mano", "Se perdía con facilidad"], "como la palma de su mano"),
      op("vocabulario", "¿Qué es un «arreo»?", "Llevar el ganado de un lugar a otro", ["Un tipo de caballo de Guanacaste", "Una fiesta de sabaneros con cimarrona"], "el ganado entró completo al corral",
        "Durante el día llevaron las vacas hasta el corral: eso es arrear."),
      op("inferencia", "¿Qué quiso decir don Efraín con «Ahora el camino es tuyo»?", "Que ahora Fabiola sería la sabanera", ["Que le regalaba la finca", "Que tenía que volver sola"], "«Ahora el camino es tuyo»",
        "Era su último arreo y le había enseñado todo a su nieta: le pasaba la tarea a ella."),
      op("inferencia", "¿Por qué don Efraín durmió esa noche sin pensar en el ganado?", "Porque confiaba en su nieta", ["Porque vendió las vacas", "Porque estaba enfermo y muy cansado del viaje"], "durmió sin pensar en el ganado"),
    ] },
  { id: "carta", escalon: 9, tipo: "carta", emoji: "📬", titulo: "Carta a la Municipalidad",
    parrafos: [
      "Señores de la Municipalidad: Mi nombre es Sofía Castro y estoy en sexto grado. Les escribo porque el parque de mi barrio está en muy mal estado: los columpios están quebrados, hay basura por todo lado y en la noche no hay luz.",
      "Muchos niños ya no van al parque porque es peligroso, y prefieren quedarse en la casa viendo pantallas. Un parque bonito y seguro haría que las familias salieran a compartir, a hacer ejercicio y a conocer a los vecinos.",
      "Por eso les pido que reparen los juegos y que pongan basureros y alumbrado. Nosotros, los vecinos, nos comprometemos a organizar una jornada de limpieza una vez al mes. Muchas gracias por su atención. Atentamente, Sofía Castro.",
    ],
    preguntas: [
      op("proposito", "¿Para qué escribió Sofía la carta?", "Para pedir que arreglen el parque", ["Para contar un paseo", "Para invitar a una fiesta"], "Por eso les pido que reparen los juegos"),
      op("literal", "¿Qué ofrecen hacer los vecinos?", "Una jornada de limpieza una vez al mes", ["Pagar entre todos los columpios nuevos", "Cerrar el parque de noche"], "organizar una jornada de limpieza una vez al mes"),
      op("inferencia", "¿Cuál de estas razones usa Sofía para convencer?", "Un parque seguro haría que las familias compartan", ["Los columpios nuevos son baratos y fáciles de poner", "A ella no le gustan las pantallas"], "Un parque bonito y seguro haría que las familias salieran a compartir",
        "Un buen argumento explica qué se gana con lo que se pide."),
      op("tipo", "¿Qué tipo de texto es?", "Una carta formal", ["Una noticia del periódico", "Un cuento"], "Atentamente, Sofía Castro",
        "Tiene saludo, se presenta, explica, pide y se despide con «Atentamente»."),
      op("inferencia", "¿Por qué creés que Sofía ofrece la ayuda de los vecinos?", "Para mostrar que ellos también van a colaborar", ["Porque la municipalidad no tiene empleados para eso", "Para no tener que ir a la escuela"], "nos comprometemos a organizar una jornada de limpieza"),
    ] },
  { id: "zinc", escalon: 9, tipo: "poema", emoji: "🌧️", titulo: "Lluvia en el zinc",
    parrafos: [
      "Sobre el techo de zinc\nla lluvia toca el tambor;\nparece una cimarrona\nque llegó sin invitación.",
      "Las gotas bailan en fila\npor la canoa del corredor,\ny el zacate del potrero\nse pone verde de amor.",
      "Mamá prende el fogón,\nhuele a café recién chorreado,\ny yo escucho el aguacero\ncon la cobija hasta el cuello.",
    ],
    preguntas: [
      op("figurado", "En el poema, ¿con qué se compara el ruido de la lluvia en el techo?", "Con una cimarrona que toca el tambor", ["Con un carro viejo que pasa por la calle", "Con un perro que ladra"], "parece una cimarrona",
        "«Parece» une las dos cosas que se comparan: la lluvia y la cimarrona."),
      op("figurado", "«El zacate se pone verde de amor» quiere decir que el zacate…", "Se pone verde y bonito", ["Se enamoró de alguien", "Se secó con el sol de verano"], "se pone verde de amor",
        "El zacate no se enamora: es una forma bonita de decir que la lluvia lo pone verde."),
      op("vocabulario", "En el poema, ¿qué es la «canoa»?", "El canal del techo que recoge el agua", ["Un bote para navegar", "Un mueble de la cocina"], "por la canoa del corredor",
        "En Costa Rica, la canoa es el canal que recoge el agua del techo."),
      op("sentimiento", "¿Cómo se siente la persona que habla en el poema?", "Tranquila y a gusto en su casa", ["Asustada por la tormenta", "Aburrida porque no puede salir"], "con la cobija hasta el cuello",
        "Está tapada, huele a café y escucha la lluvia: es un momento acogedor."),
      op("tipo", "¿Qué tipo de texto es?", "Un poema", ["Una noticia", "Una receta"], null,
        "Está escrito en versos y estrofas, y juega con comparaciones."),
    ] },
  { id: "cronica", escalon: 9, tipo: "cronica", emoji: "🐋", titulo: "Crónica: el día que vimos ballenas",
    parrafos: [
      "Eran las seis de la mañana del 12 de setiembre cuando los treinta estudiantes de sexto grado llegamos al muelle de Uvita. El mar estaba tranquilo y el cielo, despejado. Nos pusimos los chalecos salvavidas y escuchamos las instrucciones del capitán: nada de gritos y nadie de pie mientras el bote avanzara.",
      "Navegamos casi una hora sin ver nada. Algunos ya habían perdido la esperanza cuando, de pronto, alguien señaló hacia el horizonte: un chorro de agua salió disparado del mar. Era una ballena jorobada con su cría. Durante diez minutos las vimos subir a respirar, una y otra vez, a una distancia segura.",
      "De regreso, nadie hablaba mucho; creo que todos seguíamos pensando en lo que habíamos visto. Aquel día aprendimos más sobre el mar que en todo un año en el aula. Y, como dijo nuestra maestra, ahora tenemos una razón más para cuidarlo.",
    ],
    preguntas: [
      op("tipo", "¿Qué tipo de texto es?", "Una crónica", ["Una receta", "Una carta formal"], null,
        "Cuenta hechos reales en orden, con fecha, lugar y detalles, desde lo que vivió quien escribe."),
      op("literal", "¿Qué instrucciones dio el capitán?", "Nada de gritos y nadie de pie", ["Tomar fotos con flash", "Tirarles comida a las ballenas"], "nada de gritos y nadie de pie mientras el bote avanzara"),
      op("inferencia", "¿Qué quiere decir que «algunos ya habían perdido la esperanza»?", "Que creían que no iban a ver ballenas", ["Que se habían mareado", "Que querían bajarse del bote"], "Algunos ya habían perdido la esperanza"),
      op("inferencia", "¿Por qué el chorro de agua avisó que había una ballena?", "Porque las ballenas lanzan agua al respirar", ["Porque era una ola grande", "Porque estaba lloviendo a lo lejos, en el horizonte"], "un chorro de agua salió disparado del mar",
        "Las ballenas respiran por unos orificios arriba de la cabeza y, al sacar el aire, lanzan un chorro."),
      op("proposito", "¿Cuál es el propósito del texto?", "Contar una experiencia real y lo que dejó", ["Vender paseos en bote", "Explicar cómo se construye un muelle para los botes"], null,
        "Narra lo que vivió el grupo y termina con lo que aprendieron."),
    ] },
  { id: "celulares", escalon: 9, tipo: "opinion", emoji: "📱", titulo: "¿Celulares en el recreo? Mejor no",
    parrafos: [
      "En muchas escuelas se discute si los estudiantes deberían usar el celular en el recreo. En mi opinión, el recreo debería ser un tiempo libre de pantallas.",
      "Mi primera razón es que el recreo sirve para moverse. Después de horas sentados en el aula, el cuerpo necesita correr, saltar y jugar. Mi segunda razón es que el recreo es el mejor momento para hacer amigos: cuando cada uno está pegado a su pantalla, nadie conversa ni se ríe con los demás.",
      "Algunas personas dicen que el celular sirve para avisar a la familia si pasa algo. Es cierto, pero para eso la escuela tiene teléfono y personal que puede ayudar. Por eso propongo que los celulares se queden en la mochila durante el recreo. Así, ese ratito volvería a ser lo que siempre fue: un momento para jugar y compartir.",
    ],
    preguntas: [
      op("tipo", "¿Qué tipo de texto es?", "Un texto de opinión", ["Una noticia", "Un cuento"], "En mi opinión, el recreo debería ser un tiempo libre de pantallas",
        "Quien escribe dice lo que piensa y da razones para convencer."),
      op("literal", "¿Cuál es la primera razón del autor?", "Que el recreo sirve para moverse", ["Que los celulares son caros", "Que las pantallas dañan la vista"], "Mi primera razón es que el recreo sirve para moverse"),
      op("inferencia", "¿Qué hace el autor con la idea de que el celular sirve para avisar a la familia?", "La reconoce y le contesta con otro argumento", ["La acepta y cambia de opinión al final del texto", "No la menciona"], "Es cierto, pero para eso la escuela tiene teléfono",
        "Mencionar lo que piensan otros y contestarlo hace más fuerte un argumento."),
      op("figurado", "«Pegado a su pantalla» quiere decir…", "Que no deja de mirar el celular", ["Que el celular tiene goma", "Que la pantalla está quebrada"], "pegado a su pantalla"),
      op("proposito", "¿Cuál es el propósito del texto?", "Convencer de dejar el celular en la mochila en el recreo", ["Explicar cómo funciona un celular por dentro y cómo se carga", "Contar lo que pasó en un recreo"], "propongo que los celulares se queden en la mochila"),
    ] },
  { id: "cartayo", escalon: 9, tipo: "carta", emoji: "✉️", titulo: "Carta a mí mismo de primer grado",
    parrafos: [
      "Querido Matías de primer grado: te escribo desde sexto, a punto de terminar la escuela. Sé que en este momento te da miedo leer en voz alta, porque se te enredan las palabras y algunos se ríen. Quiero contarte que eso va a cambiar.",
      "En tercero vas a descubrir los libros de aventuras y no vas a querer soltarlos. En cuarto, la niña Rebeca te va a pedir que leas un cuento frente a la escuela entera, y lo vas a hacer temblando, pero lo vas a lograr. También vas a aprender que los errores no dan vergüenza: son la manera en que todos aprendemos.",
      "No te preocupés tanto. Seguí preguntando, aunque te dé pena, y no dejés de jugar en los recreos. Ah, y cuidá bien tu lápiz de dinosaurio: todavía lo extraño. Con cariño, Matías de sexto.",
    ],
    preguntas: [
      op("inferencia", "¿Quién escribe la carta y para quién?", "Matías de sexto, para él mismo en primero", ["Una maestra, para un estudiante nuevo de la escuela", "Matías de primero, para su hermano"], "te escribo desde sexto"),
      op("sentimiento", "¿Qué sentía Matías en primer grado al leer en voz alta?", "Miedo", ["Alegría", "Aburrimiento"], "te da miedo leer en voz alta"),
      op("literal", "¿Qué pasó en cuarto grado?", "Leyó un cuento frente a toda la escuela", ["Ganó un concurso de dibujo", "Se cambió de escuela"], "te va a pedir que leas un cuento frente a la escuela entera"),
      op("literal", "Según Matías, ¿qué son los errores?", "La manera en que todos aprendemos", ["Algo que da vergüenza", "Algo que solo les pasa a los pequeños"], "son la manera en que todos aprendemos"),
      op("figurado", "«Lo vas a hacer temblando» quiere decir que…", "Lo va a hacer muy nervioso", ["Va a tener mucho frío", "Va a leer muy rápido"], "lo vas a hacer temblando"),
    ] },
  { id: "volcandormido", escalon: 9, tipo: "poema", emoji: "🌋", titulo: "El volcán dormido",
    parrafos: [
      "Duerme el volcán en la montaña\ncon su sombrero de neblina;\nronca despacio, muy despacio,\nun humito de cocina.",
      "Las vacas pastan en su falda,\nlos cafetales le hacen cosquillas,\ny el río baja cantando\nentre piedras amarillas.",
      "Nadie sabe cuándo despierta,\npero el pueblo lo quiere y lo cuida\ncomo se cuida a un abuelo\nque descansa toda la vida.",
    ],
    preguntas: [
      op("figurado", "«Con su sombrero de neblina» quiere decir que…", "La neblina cubre la cima del volcán", ["El volcán usa sombrero", "Está lloviendo en el pueblo"], "con su sombrero de neblina"),
      op("figurado", "Cuando dice que el volcán «ronca», el poema…", "Le da al volcán una acción de persona", ["Lo compara con un animal", "Exagera el tamaño real que tiene el volcán"], "ronca despacio, muy despacio",
        "Los volcanes no roncan: el poema le da acciones de persona. Eso se llama personificación."),
      op("vocabulario", "En el poema, la «falda» del volcán es…", "La parte baja de la montaña", ["Una prenda de vestir", "El cráter del volcán"], "Las vacas pastan en su falda",
        "Las vacas pastan en la parte baja, las faldas de la montaña."),
      op("inferencia", "¿Cómo ve el pueblo al volcán?", "Con cariño, como a un abuelo", ["Con mucho miedo", "Como a un enemigo"], "como se cuida a un abuelo"),
      op("tipo", "¿Qué tipo de texto es?", "Un poema", ["Una noticia", "Una receta"], null,
        "Está escrito en versos y estrofas, y usa comparaciones y personificaciones."),
    ] },
  { id: "juegos", escalon: 9, tipo: "opinion", emoji: "🪀", titulo: "Que vuelvan los juegos tradicionales",
    parrafos: [
      "Hoy muchos niños pasan las tardes frente a una pantalla. Yo creo que deberíamos volver a jugar los juegos tradicionales, como el trompo, la suiza, el quedó y las bolinchas.",
      "Primero, estos juegos no cuestan casi nada: un trompo, una cuerda o unas bolinchas duran años. Segundo, se juegan en grupo, así que ayudan a hacer amigos y a resolver problemas conversando. Tercero, nos hacen movernos al aire libre, lo que es bueno para la salud.",
      "Hay quienes dicen que esos juegos son aburridos o pasados de moda. Pero basta con ver a un grupo de niños jugando suiza en el recreo para saber que la diversión no pasa de moda. Por eso invito a cada familia a enseñarles a sus hijos los juegos con que ellos crecieron.",
    ],
    preguntas: [
      op("literal", "¿Qué opina el autor?", "Que deberíamos volver a los juegos tradicionales", ["Que las pantallas son mejores", "Que hay que prohibir el trompo y las bolinchas en la escuela"], "Yo creo que deberíamos volver a jugar los juegos tradicionales"),
      op("literal", "¿Cuál es la segunda razón del autor?", "Que se juegan en grupo y ayudan a hacer amigos", ["Que no cuestan casi nada", "Que son buenos para la salud"], "Segundo, se juegan en grupo"),
      op("inferencia", "¿Cómo les contesta el autor a quienes dicen que esos juegos son aburridos?", "Con el ejemplo de niños jugando suiza en el recreo", ["Les da la razón", "Dice que las pantallas son peligrosas para la vista de los niños"], "basta con ver a un grupo de niños jugando suiza"),
      op("vocabulario", "En Costa Rica, las «bolinchas» son…", "Canicas de vidrio para jugar", ["Dulces redondos", "Pelotas de fútbol"], "unas bolinchas duran años",
        "Se mencionan junto al trompo y la cuerda: son juguetes, las canicas."),
      op("proposito", "¿Cuál es el propósito del texto?", "Convencer a las familias de enseñar juegos tradicionales", ["Explicar paso a paso las reglas para jugar suiza y trompo", "Contar la historia del trompo"], "invito a cada familia a enseñarles a sus hijos"),
    ] },
];

// ---------- Utilidades ----------
const barajarCon = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const textosDe = escalon => TEXTOS.filter(t => t.escalon === escalon);

/** ¿En qué párrafo está la cita? (-1 si no está) */
export const parrafoDe = (texto, cita) => (cita ? texto.parrafos.findIndex(p => p.includes(cita)) : -1);

/**
 * El próximo texto de esos escalones, sin repetir los ya vistos. Cuando ya vio todos, esos vuelven a estar
 * disponibles (menos el último que leyó). Devuelve el texto y la lista de vistos actualizada.
 */
export function siguienteTexto(escalones, vistos = [], rnd = Math.random, ultimo = null) {
  const pool = TEXTOS.filter(t => escalones.includes(t.escalon));
  let v = vistos, libres = pool.filter(t => !vistos.includes(t.id));
  if (!libres.length) {
    v = vistos.filter(id => !pool.some(t => t.id === id));
    libres = pool.filter(t => t.id !== ultimo);
    if (!libres.length) libres = pool;
  }
  const texto = libres[Math.floor(rnd() * libres.length)];
  return { texto, vistos: [...v.filter(id => id !== texto.id), texto.id] };
}

/**
 * Prepara las preguntas de un texto para jugar: opciones barajadas y los pasos de ordenar revueltos.
 * Las de idea principal, propósito y tipo de texto quedan al final (se contestan mejor al terminar).
 */
export function prepararPreguntas(texto, rnd = Math.random) {
  const alFinal = q => ["idea", "proposito", "tipo", "ensenanza"].includes(q.t);
  const orden = [...barajarCon(texto.preguntas.filter(q => !alFinal(q)), rnd), ...texto.preguntas.filter(alFinal)];
  return orden.map(q => {
    if (q.t === "secuencia") {
      let pasos;
      do pasos = barajarCon(q.orden, rnd); while (pasos.every((p, i) => p === q.orden[i]));
      return { ...q, pasos };
    }
    return { ...q, opciones: barajarCon([q.ok, ...q.no], rnd) };
  });
}

/** Explicación de una pregunta: lo que dice el texto (con la cita) y, si hay, la pista o el porqué. */
export function explicacion(texto, q) {
  const partes = [];
  const i = parrafoDe(texto, q.cita);
  if (q.cita) partes.push(`${texto.parrafos.length > 1 ? `En el párrafo ${i + 1}, el texto` : "El texto"} dice: «${q.cita.replace(/^«|»$/g, "")}».`);
  if (q.explica) partes.push(q.explica);
  return partes.join(" ");
}

const oraciones = p => (p.match(/[.!?…](»)?(\s|$)/g) || []).length;

/** Revisa que todos los textos estén bien armados. Devuelve una lista de problemas (vacía = bien). */
export function revisarCuentos() {
  const mal = [];
  const ids = new Set();
  TEXTOS.forEach(t => {
    const donde = `«${t.id}»`;
    if (ids.has(t.id)) mal.push(`${donde}: id repetido`);
    ids.add(t.id);
    if (!(t.escalon >= 0 && t.escalon < ESCALONES.length)) mal.push(`${donde}: escalón fuera de rango`);
    if (!t.titulo || !t.emoji || !t.parrafos?.length) mal.push(`${donde}: le falta título, emoji o párrafos`);
    if (!CLASES[t.tipo]) mal.push(`${donde}: tipo de texto desconocido ${t.tipo}`);
    if (t.escalon <= 1 && (t.parrafos.length !== 1 || oraciones(t.parrafos[0]) > 6)) mal.push(`${donde}: muy largo para el escalón ${t.escalon + 1}`);
    if (t.escalon >= 2 && t.parrafos.length < 2) mal.push(`${donde}: debería tener al menos 2 párrafos`);
    const todo = t.parrafos.join("\n");
    if (/septiembre/i.test(todo)) mal.push(`${donde}: se dice «setiembre»`);
    if ((todo.match(/«/g) || []).length !== (todo.match(/»/g) || []).length) mal.push(`${donde}: comillas « » sin cerrar`);
    if (/ {2}|\s[,.;:]/.test(todo.replace(/\n/g, " "))) mal.push(`${donde}: espacios de más`);
    if (t.preguntas.length < 3 || t.preguntas.length > 5) mal.push(`${donde}: tiene ${t.preguntas.length} preguntas (de 3 a 5)`);
    t.preguntas.forEach((q, k) => {
      const dq = `${donde} pregunta ${k + 1}`;
      if (!TIPOS[q.t]) mal.push(`${dq}: tipo desconocido ${q.t}`);
      if (q.t === "secuencia") {
        if (q.orden.length < 3 || q.orden.length > 4) mal.push(`${dq}: ordenar necesita 3 o 4 pasos`);
        if (new Set(q.orden).size !== q.orden.length) mal.push(`${dq}: pasos repetidos`);
        return;
      }
      const ops = [q.ok, ...q.no];
      if (q.no.length < 2 || q.no.length > 3) mal.push(`${dq}: necesita 2 o 3 distractores`);
      if (new Set(ops.map(o => o.toLowerCase())).size !== ops.length) mal.push(`${dq}: opciones repetidas`);
      if (ops.some(o => !o || /\s$|^\s/.test(o))) mal.push(`${dq}: opción vacía o con espacios`);
      if (q.cita && parrafoDe(t, q.cita) < 0) mal.push(`${dq}: la cita «${q.cita}» no está en el texto`);
      if (!q.cita && !q.explica) mal.push(`${dq}: necesita cita o explicación`);
      if (q.cita && t.parrafos.filter(p => p.includes(q.cita)).length > 1) mal.push(`${dq}: la cita aparece en varios párrafos`);
    });
  });
  // Varios textos por escalón, para no repetir enseguida (el niño se queda un rato en cada uno)
  ESCALONES.forEach((_, e) => { if (textosDe(e).length < 6) mal.push(`escalón ${e + 1}: necesita al menos 6 textos`); });
  // Que no se pueda adivinar escogiendo siempre la opción más larga (o la más corta), ni en todo el juego
  // ni dentro de un escalón
  const contar = lista => {
    const rango = { larga: 0, corta: 0, total: 0 };
    lista.forEach(t => t.preguntas.forEach(q => {
      if (!q.no) return;
      const L = [q.ok, ...q.no].map(x => x.length), menores = L.filter(x => x < L[0]).length;
      rango.total++;
      if (menores === L.length - 1) rango.larga++;
      if (menores === 0) rango.corta++;
    }));
    return rango;
  };
  [["", TEXTOS], ...ESCALONES.map((_, e) => [` del escalón ${e + 1}`, textosDe(e)])].forEach(([donde, lista]) => {
    const rango = contar(lista);
    if (rango.larga > rango.total * 0.45) mal.push(`la correcta es la más larga en ${rango.larga} de ${rango.total} preguntas${donde}`);
    if (rango.corta > rango.total * 0.45) mal.push(`la correcta es la más corta en ${rango.corta} de ${rango.total} preguntas${donde}`);
  });
  return mal;
}
