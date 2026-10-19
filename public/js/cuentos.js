// 📖 Lógica de «Cuentos ticos: leo y entiendo» (sin pantalla, para poder probarla sola con node).
// Textos ORIGINALES escritos para este juego (cuentos, avisos, una receta, noticias, una carta y un poema),
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

// tipo: "cuento" | "informativo" | "receta" | "aviso" | "noticia" | "carta" | "poema"
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
      op("sentimiento", "¿Cómo crees que se sintió doña Marta?", "Contenta con Andrés", ["Enojada con Andrés", "Triste por el confite"], "le regaló un confite",
        "Si le regaló un confite, es porque le alegró lo que hizo Andrés."),
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
      op("inferencia", "¿Por qué crees que esa noche cerraron bien el portón?", "Para que Canelo no se volviera a escapar", ["Porque esa noche iba a llover muy fuerte", "Porque tenían miedo de los ladrones"], "esa noche cerraron bien el portón",
        "Canelo se había escapado porque el portón estaba abierto."),
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
      op("inferencia", "¿Por qué crees que Sofía ofrece la ayuda de los vecinos?", "Para mostrar que ellos también van a colaborar", ["Porque la municipalidad no tiene empleados para eso", "Para no tener que ir a la escuela"], "nos comprometemos a organizar una jornada de limpieza"),
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
  ESCALONES.forEach((_, e) => { if (textosDe(e).length < 2) mal.push(`escalón ${e + 1}: necesita al menos 2 textos`); });
  // Que no se pueda adivinar escogiendo siempre la opción más larga (o la más corta)
  const rango = { larga: 0, corta: 0, total: 0 };
  TEXTOS.forEach(t => t.preguntas.forEach(q => {
    if (!q.no) return;
    const L = [q.ok, ...q.no].map(x => x.length), menores = L.filter(x => x < L[0]).length;
    rango.total++;
    if (menores === L.length - 1) rango.larga++;
    if (menores === 0) rango.corta++;
  }));
  if (rango.larga > rango.total * 0.45) mal.push(`la correcta es la más larga en ${rango.larga} de ${rango.total} preguntas`);
  if (rango.corta > rango.total * 0.45) mal.push(`la correcta es la más corta en ${rango.corta} de ${rango.total} preguntas`);
  return mal;
}
