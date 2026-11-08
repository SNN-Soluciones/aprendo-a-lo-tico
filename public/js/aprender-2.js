// 📖 Lecciones del temario de 2° para aprender ANTES de practicar (aprender.html).
// Cada tema: tarjetas para leer y oír (sin preguntas) y frases para completar en la práctica.
//   tarjetas: [{ e: emoji grande, t: texto (HTML corto), ej?: ejemplo }]
//   completar: [frase con ___, respuesta, [otras palabras del banco]]
// La práctica de «marque con X» sale de los temas del examen (js/examen-temas.js).

export const LECCIONES = {
  // ======================= ✏️ ESPAÑOL =======================
  "lectura-apreciativa": {
    tarjetas: [
      { e: "📚", t: "Hay muchos <b>tipos de textos</b>. Cada uno sirve para algo distinto." },
      { e: "🧚", t: "El <b>cuento</b> empieza muchas veces con «Había una vez». Tiene personajes, un problema y un final." },
      { e: "🐢", t: "La <b>fábula</b> tiene animales que hablan y al final deja una enseñanza: la <b>moraleja</b>." },
      { e: "🌸", t: "El <b>poema</b> se escribe en renglones cortos que se llaman <b>versos</b>. Muchas veces tiene rima." },
      { e: "🍌", t: "La <b>receta</b> trae los ingredientes y los pasos para preparar una comida." },
      { e: "📰", t: "La <b>noticia</b> cuenta algo que pasó de verdad: qué pasó, dónde, cuándo y quiénes." },
      { e: "💌", t: "La <b>carta</b> tiene un saludo, un mensaje y una despedida con la firma.", ej: "Querida abuela: … Con cariño, Samantha." },
      { e: "📢", t: "El <b>aviso</b> da información corta de un evento: el día, la hora y el lugar." },
      { e: "🏷️", t: "El <b>título</b> tiene que decir de qué trata el texto. Por ejemplo, una receta de batido se llama «Batido de banano»." },
      { e: "😊", t: "<b>Lectura apreciativa</b> es leer por gusto: imaginar, sentir y contar lo que más nos gustó. Antes de leer, miramos el título y los dibujos." },
    ],
    completar: [
      ["La fábula termina con una ___, que es una enseñanza.", "moraleja", ["receta", "firma"]],
      ["El poema se escribe en renglones cortos que se llaman ___.", "versos", ["pasos", "títulos"]],
      ["La ___ trae ingredientes y pasos para cocinar.", "receta", ["carta", "fábula"]],
      ["Muchos cuentos empiezan con «Había una ___».", "vez", ["casa", "noticia"]],
      ["La ___ cuenta algo que pasó de verdad.", "noticia", ["fábula", "adivinanza"]],
      ["La carta termina con una despedida y la ___.", "firma", ["moraleja", "receta"]],
      ["El ___ nos dice de qué trata el texto.", "título", ["número", "color"]],
      ["Leer por gusto, para disfrutar, es lectura ___.", "apreciativa", ["rápida", "aburrida"]],
    ],
  },
  diptongo: {
    tarjetas: [
      { e: "🅰️", t: "Las vocales son cinco: a, e, i, o, u." },
      { e: "😮", t: "Las vocales <b>abiertas</b> (o fuertes) son <b>a, e, o</b>. ¡Abrimos bien la boca para decirlas!" },
      { e: "🙂", t: "Las vocales <b>cerradas</b> (o débiles) son <b>i, u</b>." },
      { e: "🤝", t: "Un <b>diptongo</b> es cuando dos vocales están juntas y se dicen en <b>la misma sílaba</b>, de un solo golpe.", ej: "nue-ve · pei-ne · jau-la" },
      { e: "👏", t: "Aplaudí: <b>nue</b>-ve. La <b>u</b> y la <b>e</b> suenan en el mismo aplauso. ¡Eso es diptongo!" },
      { e: "➕", t: "Se forma con una abierta + una cerrada: <b>pia</b>-no, <b>hue</b>-vo, <b>ai</b>-re. O con dos cerradas: <b>ciu</b>-dad, <b>rui</b>-do." },
    ],
    completar: [
      ["Las vocales abiertas son a, e y ___.", "o", ["i", "u"]],
      ["Las vocales cerradas son i y ___.", "u", ["a", "e"]],
      ["En el diptongo, las dos vocales van en la ___ sílaba.", "misma", ["otra", "última"]],
      ["«nue-ve» tiene ___ sílabas.", "2", ["3", "1"]],
      ["En «pei-ne», el diptongo es ___.", "ei", ["pe", "ne"]],
      ["En «jau-la», el diptongo es ___.", "au", ["ja", "la"]],
      ["«ciu-dad» tiene diptongo con dos vocales ___.", "cerradas", ["abiertas", "grandes"]],
    ],
  },
  hiato: {
    tarjetas: [
      { e: "✂️", t: "Un <b>hiato</b> es cuando dos vocales están juntas pero se separan en <b>sílabas distintas</b>.", ej: "po-e-ta · rí-o · le-ón" },
      { e: "👏", t: "Aplaudí: rí-o. La <b>í</b> y la <b>o</b> caen en aplausos diferentes. ¡Eso es hiato!" },
      { e: "😮😮", t: "Dos vocales <b>abiertas</b> (a, e, o) juntas siempre se separan: te-a-tro, ma-es-tra, ca-no-a." },
      { e: "✍️", t: "Si la <b>i</b> o la <b>u</b> llevan <b>tilde</b>, también se separan: dí-a, ma-íz, ba-úl, pul-pe-rí-a." },
      { e: "🆚", t: "Diptongo: juntas en una sílaba (<b>pia</b>-no). Hiato: separadas (rí-o)." },
    ],
    completar: [
      ["En el hiato, las vocales van en sílabas ___.", "distintas", ["iguales", "juntas"]],
      ["«rí-o» tiene ___ sílabas.", "2", ["1", "3"]],
      ["«po-e-ta» tiene ___ sílabas.", "3", ["2", "4"]],
      ["Dos vocales abiertas juntas forman un ___.", "hiato", ["diptongo", "verso"]],
      ["En «dí-a», la i lleva ___ y por eso se separa.", "tilde", ["punto", "rima"]],
      ["«te-a-tro» tiene hiato porque la e y la a son vocales ___.", "abiertas", ["cerradas", "mayúsculas"]],
    ],
  },
  "expresion-oral": {
    tarjetas: [
      { e: "🙋", t: "También hablamos <b>sin palabras</b>, con <b>gestos</b>: mover la cabeza para decir sí o no, saludar con la mano." },
      { e: "🤫", t: "El dedo sobre la boca pide <b>silencio</b>. Encoger los hombros quiere decir «no sé»." },
      { e: "🗣️", t: "El <b>tono de voz</b> muestra cómo nos sentimos: alegre para un chiste, bajito y suave para algo triste, fuerte para «¡Cuidado!»." },
      { e: "😠", t: "Cuando alguien está <b>enojado</b>: frunce el ceño, habla fuerte o serio y cruza los brazos." },
      { e: "😂", t: "El <b>sentido humorístico</b> es lo que da risa: chistes, adivinanzas graciosas, ocurrencias." },
      { e: "🍲", t: "<b>Doble sentido</b>: una frase que se entiende de dos maneras.", ej: "«Estoy hecho una sopa» = estoy muy mojado." },
      { e: "⏸️", t: "La <b>pausa</b> nos deja respirar y ayuda a entender. En la coma, pausa corta; en el punto, más larga." },
      { e: "👂", t: "El <b>silencio</b> también dice algo: cuando escuchamos callados mostramos respeto y atención." },
    ],
    completar: [
      ["Mover la cabeza de arriba abajo quiere decir ___.", "sí", ["no", "adiós"]],
      ["El dedo sobre la boca pide ___.", "silencio", ["comida", "ayuda"]],
      ["Para un chiste usamos un tono ___.", "alegre", ["triste", "enojado"]],
      ["En la coma hacemos una ___ corta.", "pausa", ["rima", "pregunta"]],
      ["«Estoy hecho una sopa» quiere decir que estoy muy ___.", "mojado", ["cansado", "feliz"]],
      ["Fruncir el ceño y cruzar los brazos muestra ___.", "enojo", ["alegría", "sueño"]],
      ["Escuchar en silencio muestra ___.", "respeto", ["enojo", "hambre"]],
    ],
  },
  interrogacion: {
    tarjetas: [
      { e: "❔", t: "Las <b>preguntas</b> se escriben entre <b>signos de interrogación</b>: uno al principio y otro al final." },
      { e: "✅", t: "¿Cómo te llamás? ← lleva <b>¿</b> al inicio y <b>?</b> al final. ¡Los dos!" },
      { e: "❌", t: "Así está mal: «Cómo te llamás?» (le falta el primero) o «¿Cómo te llamás» (le falta el último)." },
      { e: "🎵", t: "La <b>entonación</b> es cómo sube y baja la voz. En una pregunta como «¿Venís a mi casa?» la voz <b>sube al final</b> ↗." },
      { e: "⬇️", t: "En una oración con punto, como «Hoy es lunes.», la voz <b>baja</b> al final." },
      { e: "❗", t: "Las emociones fuertes van con signos de <b>exclamación</b>: ¡Qué lindo día!" },
      { e: "✍️", t: "Qué, cómo, dónde, cuándo, quién y cuál llevan <b>tilde</b> cuando preguntan: ¿<b>Dónde</b> vivís?" },
    ],
    completar: [
      ["Las preguntas van entre signos de ___.", "interrogación", ["exclamación", "punto"]],
      ["El signo ¿ va al ___ de la pregunta.", "inicio", ["final", "medio"]],
      ["El signo ? va al ___ de la pregunta.", "final", ["inicio", "medio"]],
      ["En «¿Venís a mi casa?» la voz ___ al final.", "sube", ["baja", "calla"]],
      ["En una oración con punto la voz ___ al final.", "baja", ["sube", "grita"]],
      ["___ te llamás?", "¿Cómo", ["Cómo", "¡Cómo"]],
      ["¿___ vivís?", "Dónde", ["Donde", "dónde."]],
    ],
  },
  "lenguaje-verbal": {
    tarjetas: [
      { e: "🗣️", t: "Con las palabras podemos jugar. Eso es <b>lenguaje verbal</b>: adivinanzas, trabalenguas, canciones y rimas." },
      { e: "🕵️", t: "La <b>adivinanza</b> da pistas para que descubramos algo.", ej: "Tengo agujas y no sé coser, tengo números y no sé leer. (¡El reloj!)" },
      { e: "👅", t: "El <b>trabalenguas</b> junta sonidos parecidos para practicar a hablar claro y rápido.", ej: "Tres tristes tigres tragaban trigo en un trigal." },
      { e: "🎶", t: "La <b>canción</b> tiene palabras con música y ritmo, y se canta.", ej: "Los pollitos dicen pío, pío, pío…" },
      { e: "🔔", t: "La <b>rima</b> es cuando las palabras terminan con el mismo sonido.", ej: "ratón – camión · rana – manzana · sol – caracol" },
    ],
    completar: [
      ["La ___ da pistas para descubrir algo.", "adivinanza", ["canción", "receta"]],
      ["El ___ sirve para practicar a hablar claro y rápido.", "trabalenguas", ["poema", "aviso"]],
      ["La ___ se canta con música.", "canción", ["adivinanza", "noticia"]],
      ["«Ratón» rima con ___.", "camión", ["perro", "casa"]],
      ["«Rana» rima con ___.", "manzana", ["gato", "sol"]],
      ["«Sol» rima con ___.", "caracol", ["luna", "mesa"]],
      ["Tengo agujas y no sé coser, tengo números y no sé leer. Soy el ___.", "reloj", ["libro", "lápiz"]],
    ],
  },

  // ======================= 🌱 CIENCIAS =======================
  contaminacion: {
    tarjetas: [
      { e: "🏭", t: "La <b>contaminación ambiental</b> es cuando el aire, el agua o el suelo se ensucian con basura, humo, ruido o químicos que dañan a los seres vivos." },
      { e: "🧍", t: "La mayor parte de la contaminación la causan las <b>acciones de las personas</b>." },
      { e: "🔥", t: "Quemar basura y el humo de carros y fábricas ensucian el <b>aire</b>. Efecto: tos, asma y alergias." },
      { e: "🐟", t: "Tirar basura al río ensucia el <b>agua</b>. Efecto: los peces se mueren." },
      { e: "🌱", t: "Los plásticos y los químicos en la tierra dañan el <b>suelo</b>. Efecto: las plantas no crecen bien." },
      { e: "🌳", t: "Cortar los árboles deja a los animales sin casa. La basura en la calle tapa las alcantarillas y causa inundaciones." },
      { e: "🔊", t: "El ruido muy fuerte también contamina: es contaminación <b>sónica</b>. Daña los oídos." },
      { e: "♻️", t: "¿Cómo ayudamos? <b>Reducir</b> (usar menos), <b>reutilizar</b> (volver a usar) y <b>reciclar</b>. Botar la basura separada y sembrar árboles." },
    ],
    completar: [
      ["Quemar basura contamina el ___.", "aire", ["agua", "suelo"]],
      ["Tirar basura al río contamina el ___.", "agua", ["aire", "cielo"]],
      ["El ruido muy fuerte es contaminación ___.", "sónica", ["del agua", "dulce"]],
      ["Si cortamos los árboles, los animales se quedan sin ___.", "casa", ["agua", "ruido"]],
      ["Volver a usar algo se llama ___.", "reutilizar", ["quemar", "botar"]],
      ["La basura en la calle tapa las alcantarillas y causa ___.", "inundaciones", ["arcoíris", "nubes"]],
      ["La mayoría de la contaminación la causan las ___.", "personas", ["plantas", "nubes"]],
      ["Las tres R son reducir, reutilizar y ___.", "reciclar", ["romper", "regar"]],
    ],
  },
  estados: {
    tarjetas: [
      { e: "🧊", t: "La materia es todo lo que ocupa un lugar. Está en tres <b>estados</b>: sólido, líquido y gaseoso." },
      { e: "🪨", t: "<b>Sólido</b>: tiene su propia forma y no se derrama.", ej: "el hielo, una piedra, un lápiz" },
      { e: "💧", t: "<b>Líquido</b>: toma la forma del recipiente y se derrama.", ej: "el agua, la leche, el jugo" },
      { e: "♨️", t: "<b>Gaseoso</b>: se esparce por todo el espacio y casi no se ve.", ej: "el vapor, el aire del globo, el viento" },
    ],
    completar: [
      ["Una piedra está en estado ___.", "sólido", ["líquido", "gaseoso"]],
      ["La leche está en estado ___.", "líquido", ["sólido", "gaseoso"]],
      ["El vapor de la olla está en estado ___.", "gaseoso", ["sólido", "líquido"]],
      ["El líquido toma la forma del ___.", "recipiente", ["sol", "viento"]],
      ["El ___ tiene su propia forma.", "sólido", ["gas", "líquido"]],
    ],
  },
  "cambios-nombres": {
    tarjetas: [
      { e: "🌡️", t: "Con <b>calor</b> o con <b>frío</b>, la materia cambia de estado. ¡Pero sigue siendo lo mismo! El hielo, el agua y el vapor son todos agua." },
      { e: "🫠", t: "<b>Fusión</b>: de sólido a líquido, con calor.", ej: "el hielo se derrite al sol" },
      { e: "🥶", t: "<b>Solidificación</b>: de líquido a sólido, con frío.", ej: "el agua se hace hielo en el congelador" },
      { e: "♨️", t: "<b>Evaporación</b>: de líquido a gas, con calor.", ej: "el agua de la olla hierve y sale vapor" },
      { e: "🪞", t: "<b>Condensación</b>: de gas a líquido, con frío.", ej: "el espejo del baño se llena de gotitas" },
    ],
    completar: [
      ["El hielo que se derrite es ___.", "fusión", ["condensación", "solidificación"]],
      ["El agua que se vuelve hielo es ___.", "solidificación", ["evaporación", "fusión"]],
      ["El agua que hierve y se vuelve vapor es ___.", "evaporación", ["solidificación", "fusión"]],
      ["Las gotitas en el espejo del baño son ___.", "condensación", ["fusión", "evaporación"]],
      ["La fusión y la evaporación pasan con ___.", "calor", ["frío", "ruido"]],
      ["La solidificación y la condensación pasan con ___.", "frío", ["calor", "luz"]],
    ],
  },
  "ciclo-agua": {
    tarjetas: [
      { e: "🔄", t: "El agua hace un viaje que nunca termina: el <b>ciclo del agua</b>. ¡El <b>sol</b> es el que lo pone a andar!" },
      { e: "☀️", t: "1. <b>Evaporación</b>: el sol calienta el agua de mares, ríos y lagos, y sube al cielo como vapor." },
      { e: "☁️", t: "2. <b>Condensación</b>: arriba el vapor se enfría y se hace gotitas que forman las <b>nubes</b>." },
      { e: "🌧️", t: "3. <b>Precipitación</b>: las nubes se ponen pesadas y el agua cae como lluvia o granizo." },
      { e: "🏞️", t: "4. <b>Recolección</b>: el agua llega a los ríos, lagos y el mar, o se mete en la tierra… ¡y vuelve a empezar!" },
      { e: "💚", t: "<b>Importancia</b>: el ciclo renueva el agua dulce que todos los seres vivos necesitamos para beber y vivir. ¡Hay que cuidarla!" },
    ],
    completar: [
      ["El ___ calienta el agua y la evapora.", "sol", ["viento", "frío"]],
      ["Las nubes se forman por ___.", "condensación", ["fusión", "recolección"]],
      ["Cuando el agua cae de las nubes se llama ___.", "precipitación", ["evaporación", "condensación"]],
      ["El primer paso del ciclo es la ___.", "evaporación", ["precipitación", "recolección"]],
      ["Después de la condensación viene la ___.", "precipitación", ["evaporación", "fusión"]],
      ["Todos los seres ___ necesitamos agua.", "vivos", ["fríos", "grandes"]],
    ],
  },

  // ======================= 🗺️ ESTUDIOS SOCIALES =======================
  "canton-belen": {
    tarjetas: [
      { e: "🏫", t: "Mi escuela se llama <b>Escuela Fidel Chaves Murillo</b>." },
      { e: "📍", t: "Queda en el distrito de <b>La Ribera</b>, en el cantón de <b>Belén</b>, en la provincia de <b>Heredia</b>, en Costa Rica." },
      { e: "🗺️", t: "Belén tiene tres distritos: <b>San Antonio</b>, <b>La Ribera</b> y <b>La Asunción</b>. San Antonio es la cabecera: ahí está la <b>Municipalidad</b>." },
      { e: "🏛️", t: "La <b>Municipalidad</b> cuida el cantón: calles, parques, basura y actividades culturales." },
      { e: "🎉", t: "La <b>cultura</b> son las tradiciones, costumbres, comidas, música y arte de un pueblo." },
      { e: "💛", t: "El <b>desarrollo cultural</b> es importante porque conserva nuestras tradiciones y nos une como comunidad." },
    ],
    completar: [
      ["Mi escuela se llama Escuela Fidel ___ Murillo.", "Chaves", ["Santamaría", "Mora"]],
      ["Mi escuela está en el cantón de ___.", "Belén", ["Barva", "Flores"]],
      ["Belén está en la provincia de ___.", "Heredia", ["Cartago", "Limón"]],
      ["Mi escuela está en el distrito de La ___.", "Ribera", ["Asunción", "Sabana"]],
      ["La cabecera de Belén es San ___.", "Antonio", ["José", "Pablo"]],
      ["Belén tiene ___ distritos.", "3", ["7", "5"]],
      ["La ___ cuida las calles y los parques del cantón.", "Municipalidad", ["pulpería", "escuela"]],
    ],
  },
  "personajes-belen": {
    tarjetas: [
      { e: "🏡", t: "<b>Don Fidel Chaves Murillo</b> era vecino de La Ribera. Las primeras clases de la escuela se dieron en el <b>corredor de su casa</b>." },
      { e: "🏫", t: "Por eso la escuela lleva su nombre: <b>Escuela Fidel Chaves Murillo</b>. Prestar su casa fue un gesto de <b>solidaridad</b>." },
      { e: "👨‍🌾", t: "<b>Don Billo</b> se llamaba <b>Wilfrido Sánchez Mondragón</b>. Nació en Alajuela y desde niño trabajó la tierra con su papá." },
      { e: "🏛️", t: "Don Billo trabajó por Belén en la <b>Municipalidad</b>: fue tesorero y presidente municipal." },
      { e: "🏅", t: "Belén lo nombró <b>Hijo Predilecto</b>. Hoy la Municipalidad entrega la <b>Orden Billo Sánchez</b> a quienes ayudan a la comunidad. Su símbolo: dos manos unidas." },
    ],
    completar: [
      ["Las primeras clases fueron en el corredor de la casa de don ___.", "Fidel", ["Billo", "Juan"]],
      ["A don Wilfrido Sánchez Mondragón le decían Don ___.", "Billo", ["Pepe", "Fidel"]],
      ["Don Billo trabajó en la ___ de Belén.", "Municipalidad", ["playa", "fábrica"]],
      ["Belén nombró a Don Billo Hijo ___.", "Predilecto", ["Menor", "Famoso"]],
      ["Prestar su casa para la escuela fue un gesto de ___.", "solidaridad", ["egoísmo", "pereza"]],
      ["Desde niño, Don Billo trabajó en la ___.", "agricultura", ["radio", "televisión"]],
    ],
  },
  "expresiones-artisticas": {
    tarjetas: [
      { e: "🎨", t: "Las <b>expresiones artísticas</b> son formas de mostrar nuestra cultura: mascaradas, música, pintura, baile y teatro." },
      { e: "👹", t: "Las <b>mascaradas</b> son personajes con máscaras gigantes que bailan en las fiestas. Las máscaras se hacen de <b>papel maché</b>." },
      { e: "🥁", t: "La <b>cimarrona</b> es la banda alegre que toca para que bailen las mascaradas." },
      { e: "📅", t: "El <b>31 de octubre</b> es el Día de la Mascarada Tradicional Costarricense." },
      { e: "🎶", t: "La <b>música</b> (bandas, marimba, coros) y la <b>pintura</b> (cuadros, murales) también son arte de nuestro cantón." },
    ],
    completar: [
      ["Las máscaras gigantes que bailan en las fiestas se llaman ___.", "mascaradas", ["cimarronas", "carretas"]],
      ["La banda que toca para las mascaradas es la ___.", "cimarrona", ["marimba", "escuela"]],
      ["Las máscaras se hacen de papel ___.", "maché", ["higiénico", "aluminio"]],
      ["El Día de la Mascarada es el 31 de ___.", "octubre", ["diciembre", "mayo"]],
      ["Hacer cuadros y murales es ___.", "pintura", ["música", "deporte"]],
    ],
  },
  "participacion-escuela": {
    tarjetas: [
      { e: "🏆", t: "Nuestra escuela <b>participa y representa</b> al cantón en muchas actividades." },
      { e: "🎭", t: "<b>FEA</b> quiere decir <b>Festival Estudiantil de las Artes</b>: ahí mostramos canto, baile, pintura y teatro." },
      { e: "⚽", t: "En los <b>torneos deportivos</b> la escuela juega contra otras escuelas." },
      { e: "🎺", t: "La <b>banda institucional</b> representa a la escuela en desfiles, como el del 15 de setiembre." },
      { e: "🔬", t: "Participación <b>académica</b>: la <b>Feria Científica</b>, las exposiciones, los trabajos y juegos en grupo, y las exposiciones de arte (pintura y mascaradas)." },
    ],
    completar: [
      ["FEA quiere decir Festival Estudiantil de las ___.", "Artes", ["Aguas", "Arañas"]],
      ["En la Feria ___ presentamos experimentos.", "Científica", ["del Agricultor", "de Comidas"]],
      ["La banda ___ toca en los desfiles.", "institucional", ["de rock", "invisible"]],
      ["Los torneos ___ son de fútbol, atletismo y más.", "deportivos", ["de pintura", "de canto"]],
      ["La Feria Científica es una participación ___.", "académica", ["deportiva", "de compras"]],
    ],
  },
  valores: {
    tarjetas: [
      { e: "🤝", t: "Cuando participamos en la escuela practicamos <b>valores</b>." },
      { e: "🙏", t: "<b>Respeto</b>: tratar bien a todos. <b>Honestidad</b>: decir siempre la verdad." },
      { e: "🫶", t: "<b>Solidaridad</b>: ayudar a quien lo necesita. <b>Empatía</b>: ponerse en el lugar del otro." },
      { e: "🧩", t: "<b>Cooperación</b>: trabajar juntos. <b>Compañerismo</b>: ser buen compañero." },
      { e: "☮️", t: "<b>Tolerancia</b>: aceptar a quien piensa distinto. <b>Armonía</b>: convivir en paz." },
    ],
    completar: [
      ["Decir siempre la verdad es ___.", "honestidad", ["pereza", "tolerancia"]],
      ["Ayudar a quien lo necesita es ___.", "solidaridad", ["egoísmo", "armonía"]],
      ["Trabajar juntos para lograr algo es ___.", "cooperación", ["enojo", "honestidad"]],
      ["Ponerse en el lugar del otro es ___.", "empatía", ["respeto", "pereza"]],
      ["Convivir en paz, sin pleitos, es ___.", "armonía", ["solidaridad", "honestidad"]],
      ["Aceptar a quien piensa distinto es ___.", "tolerancia", ["compañerismo", "egoísmo"]],
    ],
  },
  ciudadania: {
    tarjetas: [
      { e: "🗳️", t: "En la escuela participamos como <b>ciudadanos activos</b>: opinamos, votamos y ayudamos." },
      { e: "🏫", t: "El <b>gobierno estudiantil</b> lo forman estudiantes elegidos para representar a toda la escuela. Se elige en las <b>elecciones estudiantiles</b>." },
      { e: "👥", t: "Cada grupo elige su <b>directiva de sección</b>: presidente, vicepresidente, secretario, tesorero, fiscal y vocal." },
      { e: "🤐", t: "El voto es <b>secreto</b>: nadie ve por quién votamos." },
      { e: "🙋", t: "El voto es <b>voluntario</b>: votamos porque queremos, nadie nos obliga." },
      { e: "🤝", t: "Si nuestro candidato pierde, <b>respetamos</b> el resultado y apoyamos a los elegidos." },
    ],
    completar: [
      ["El voto ___ quiere decir que nadie ve por quién votamos.", "secreto", ["voluntario", "fuerte"]],
      ["El voto ___ quiere decir que nadie nos obliga.", "voluntario", ["secreto", "pagado"]],
      ["El gobierno estudiantil se elige con ___ estudiantiles.", "elecciones", ["carreras", "rifas"]],
      ["Los compañeros que organizan nuestro grupo son la directiva de ___.", "sección", ["fútbol", "cocina"]],
      ["Si mi candidato pierde, ___ el resultado.", "respeto", ["rompo", "ignoro"]],
    ],
  },
};
