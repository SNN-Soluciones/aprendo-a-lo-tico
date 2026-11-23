// 📐 Matemática · convocatoria de 8° (MEP): materia, tareas de cuaderno, práctica por tema y dos simulacros.
// La forma de cada pieza está documentada en revisar.js y la revisa pruebas/unidad/c8-contenido.test.mjs.

const TRAZO = "#1F3A5F";
const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const sup = n => String(n).split("").map(c => SUP[c]).join("");
/** Las dos formas de escribir una potencia en la página: «2^7» y «2⁷». */
const pot = (base, exp) => [`${base}^${exp}`, `${base}${sup(exp)}`];
/** Un segmento se nombra en los dos órdenes: AE y EA. */
const seg = s => [s, [...s].reverse().join("")];
/** Un polígono se nombra empezando en cualquier vértice y en cualquier sentido, siguiendo el borde. */
const ciclos = s => {
  const v = [...s];
  const vueltas = v.map((_, i) => [...v.slice(i), ...v.slice(0, i)]);
  return [...new Set(vueltas.flatMap(r => [r.join(""), [...r].reverse().join("")]))];
};

// ── Figuras (SVG propio, sin scripts) ─────────────────────────────────────────────────────────────

const abrir = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial, Helvetica, sans-serif" font-size="16">`;
const etiquetas = lista => `<g fill="${TRAZO}" text-anchor="middle">${lista.map(([x, y, s]) => `<text x="${x}" y="${y}">${s}</text>`).join("")}</g>`;
const trazos = (visibles, ocultas, extra = "") => `<g fill="none" stroke="${TRAZO}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`
  + `<path d="${visibles}"/><path d="${ocultas}" stroke-dasharray="6 5"/>${extra}</g>`;

/** Pirámide recta cuadrangular: base [A B C D] (D atrás), cúspide E, centro O de la base y M punto medio de AB. */
function piramide([A, B, C, D, E, O, M]) {
  return abrir(300, 230)
    + trazos("M60 190 L200 190 L250 150 M60 190 L155 30 L200 190 M155 30 L250 150", "M60 190 L110 150 L250 150 M110 150 L155 30",
      `<path d="M155 30 L155 170 L130 190" stroke-width="1.5" stroke-dasharray="3 4"/><path d="M155 30 L130 190" stroke-width="1.5"/>`)
    + `<g fill="${TRAZO}"><circle cx="155" cy="170" r="3"/><circle cx="130" cy="190" r="3"/></g>`
    + etiquetas([[44, 207, A], [210, 208, B], [262, 156, C], [118, 170, D], [155, 22, E], [166, 182, O], [130, 212, M]])
    + `</svg>`;
}

/** Prisma recto rectangular ABCD-EFGH: ABCD abajo (D atrás), E sobre A, F sobre B, G sobre C, H sobre D. */
const PRISMA = abrir(280, 230)
  + trazos("M50 200 L190 200 L240 160 L240 40 L100 40 L50 80 Z M50 80 L190 80 L240 40 M190 80 L190 200", "M50 200 L100 160 L240 160 M100 160 L100 40")
  + etiquetas([[40, 218, "A"], [198, 218, "B"], [252, 168, "C"], [88, 156, "D"], [38, 84, "E"], [200, 96, "F"], [252, 38, "G"], [92, 34, "H"]])
  + `</svg>`;

/** Prisma recto triangular ABC-DEF: ABC abajo (C atrás), D sobre A, E sobre B, F sobre C. */
const PRISMA_TRI = abrir(270, 230)
  + trazos("M60 200 L210 200 L210 70 L60 70 Z M60 70 L150 30 L210 70", "M60 200 L150 160 L210 200 M150 160 L150 30")
  + etiquetas([[46, 216, "A"], [222, 216, "B"], [150, 187, "C"], [46, 70, "D"], [224, 74, "E"], [150, 22, "F"]])
  + `</svg>`;

const PIR = piramide(["A", "B", "C", "D", "E", "O", "M"]);
const PIR_B = piramide(["P", "Q", "R", "S", "V", "O", "M"]);

/** Cómo se escribe la notación en el cuaderno. */
const NOTACION = abrir(300, 100)
  + `<g fill="${TRAZO}" text-anchor="middle" font-size="28"><text x="45" y="52">E</text><text x="150" y="52">AB</text><text x="262" y="52">ABE</text></g>`
  + `<g fill="none" stroke="${TRAZO}" stroke-width="2"><line x1="131" y1="24" x2="169" y2="24"/><polygon points="205,50 227,50 216,31"/></g>`
  + etiquetas([[45, 88, "vértice"], [150, 88, "segmento"], [250, 88, "triángulo (cara)"]]).replace("<g ", `<g font-size="13" `)
  + `</svg>`;

/** Hexágono regular con centro O, radio r (punteado), apotema a y lado l. */
const HEXAGONO = abrir(300, 220)
  + `<g fill="none" stroke="${TRAZO}" stroke-width="2" stroke-linejoin="round"><polygon points="235,110 192.5,36.4 107.5,36.4 65,110 107.5,183.6 192.5,183.6"/>`
  + `<path d="M150 110 L150 183.6"/><path d="M150 110 L235 110" stroke-dasharray="6 5"/><path d="M150 173.6 L160 173.6 L160 183.6" stroke-width="1.5"/></g>`
  + `<circle cx="150" cy="110" r="3" fill="${TRAZO}"/>`
  + etiquetas([[138, 104, "O"]])
  + etiquetas([[140, 152, "a"], [195, 102, "r"], [150, 205, "l"]]).replace("<g ", `<g font-style="italic" font-family="Georgia, serif" font-size="18" `)
  + `</svg>`;

/** Pentágono regular de 8 cm de lado y 5,5 cm de apotema. */
const PENTAGONO = abrir(300, 230)
  + `<g fill="none" stroke="${TRAZO}" stroke-width="2" stroke-linejoin="round"><polygon points="150,25 240.4,90.6 205.8,196.9 94.2,196.9 59.6,90.6"/>`
  + `<path d="M150 120 L150 196.9"/><path d="M150 186.9 L160 186.9 L160 196.9" stroke-width="1.5"/></g>`
  + `<circle cx="150" cy="120" r="3" fill="${TRAZO}"/>`
  + etiquetas([[150, 219, "8 cm"]]) + `<text x="158" y="165" fill="${TRAZO}">5,5 cm</text>`
  + `</svg>`;

/** Rectángulo (sombreado) al que se le recortó un cuadrado en una esquina (en blanco). */
const recorte = (largo, ancho, lado) => abrir(300, 210)
  + `<rect x="70" y="30" width="200" height="150" fill="#DCE6F0" stroke="${TRAZO}" stroke-width="2"/>`
  + `<rect x="70" y="30" width="100" height="100" fill="#FFFFFF" stroke="${TRAZO}" stroke-width="2" stroke-dasharray="6 5"/>`
  + etiquetas([[170, 22, largo], [120, 123, lado], [158, 86, lado]])
  + `<text x="120" y="78" fill="${TRAZO}" text-anchor="middle" font-size="13">recorte</text>`
  + `<text x="62" y="110" fill="${TRAZO}" text-anchor="end">${ancho}</text>`
  + `</svg>`;

// ── Cómo se escriben las respuestas ───────────────────────────────────────────────────────────────

const COMO_ESCRIBIR = [
  "Potencias con ^ o con los números pequeños: x^2 o x², a^3b o a³b.",
  "Multiplicación pegada, sin punto ni asterisco: 3xy, -12a^3b^6.",
  "**Sin paréntesis**: la respuesta va ya resuelta.",
  "Fracciones como coeficiente, delante de la letra: 1/2x, -3/4x^2.",
  "**Simplificada al máximo**: si queda un término semejante sin juntar (por ejemplo 3x + 2x), la respuesta está mala aunque valga lo mismo.",
  "Cuando se pide «una sola potencia», se escribe la potencia y no su valor: 2^7, no 128.",
  "Respuestas numéricas y soluciones de ecuaciones: solo el número (x = 3, -5/2 o 2,5), sin unidades, sin ₡ y sin puntos de miles.",
];
const BLOQUES_ESCRIBIR = [{ t: "h", x: "Cómo vas a escribir las respuestas en la página" }, { t: "lista", x: COMO_ESCRIBIR }];

const LECT_ALG = {
  t: "lectura", titulo: "Cómo escribir las respuestas",
  x: "Hacé cada ejercicio completo en el cuaderno y escribí aquí solo el resultado final.\n"
    + "Potencias con ^ o con los números pequeños (x^2 o x²). Multiplicación pegada (3xy). Sin paréntesis. Fracciones como coeficiente, delante de la letra: 1/2x. "
    + "La respuesta tiene que estar **simplificada al máximo**: si queda un término semejante sin juntar, está mala aunque valga lo mismo.\n"
    + "Si se pide «una sola potencia», escribí la potencia (2^7) y no su valor. Las respuestas numéricas van con el número solo: entero, fracción (-5/2) o decimal con coma (2,5).",
};
const LECT_NUM = {
  t: "lectura", titulo: "Cómo escribir las respuestas",
  x: "Hacé cada ejercicio completo en el cuaderno, con todos los pasos, y escribí aquí solo el resultado.\n"
    + "Solo el número: entero, fracción (-14/9) o decimal con coma (31,5). Sin unidades, sin ₡ y sin puntos de miles (153750, no 153.750). "
    + "Las soluciones de ecuaciones se pueden escribir x = 3 o solo 3.",
};
const LECT_FIG = {
  t: "lectura", titulo: "Cómo escribir las respuestas",
  x: "En la página no se puede poner la raya encima de un segmento: escribí solo sus dos letras (AE o EA). Las caras y bases, con las letras de sus vértices en orden por el borde, sin espacios.\n"
    + "Los vértices van **con mayúscula**, como en la prueba: una minúscula cuenta como error. En el cuaderno escribí siempre la notación completa, con la raya encima.",
};
const INSTR_CORTA = "Hacé las operaciones en el cuaderno y escribí aquí solo el resultado final. Potencias con ^ o ² ³ (x^2), multiplicación pegada (3xy), sin paréntesis, "
  + "fracciones como coeficiente así: 1/2x, todo **simplificado al máximo**. «Una sola potencia» se escribe como potencia (2^7, no 128). "
  + "Notación de las figuras: letras mayúsculas, sin raya (AE). Números: solo el número, sin unidades ni ₡. Las de 2 puntos valen todo o nada.";
const INSTR_DESARROLLO = "Resolvé cada ejercicio en el cuaderno con todo el procedimiento, como en la prueba de papel, y escribí aquí solo el resultado final "
  + "(mismas reglas de escritura que en la III parte). Cada uno vale 3 puntos. El problema final lo revisa un adulto con la guía.";

// ── Temas ─────────────────────────────────────────────────────────────────────────────────────────

const piramidePrisma = {
  id: "piramide-prisma",
  titulo: "Pirámides y prismas rectos: elementos y notación",
  indicadores: [
    "Reconoce los conceptos fundamentales de los elementos de una pirámide recta.",
    "Reconoce los conceptos fundamentales de los elementos de un prisma recto.",
    "Representa mediante notación simbólica elementos de un prisma o pirámide a partir de una figura dada.",
  ],
  materia: [
    { t: "p", x: "Las **pirámides** y los **prismas** son **poliedros**: cuerpos geométricos limitados solo por polígonos planos. Cada polígono es una **cara**; el segmento donde se juntan dos caras es una **arista**; el punto donde se juntan tres o más aristas es un **vértice**." },
    { t: "h", x: "La pirámide recta" },
    { t: "p", x: "Una **pirámide** tiene **una sola base**, que puede ser cualquier polígono, y **caras laterales triangulares** que se juntan en un mismo vértice: la **cúspide** (también se llama **ápice**). La pirámide es **recta** cuando la altura cae justo en el **centro de la base**. Se nombra según el polígono de la base: pirámide triangular, cuadrangular, pentagonal, hexagonal…" },
    { t: "svg", x: PIR, alt: "Pirámide recta cuadrangular. La base es el cuadrilátero ABCD, con D atrás; la cúspide E está arriba. O es el centro de la base y M el punto medio de la arista AB. Están trazadas la altura EO, la apotema de la pirámide EM y la apotema de la base OM. Las aristas que no se ven (AD, DC y ED) están punteadas." },
    { t: "tabla", cab: ["Elemento", "Qué es", "En la figura"], filas: [
      ["Base", "El polígono sobre el que se apoya la pirámide. Solo hay una.", "ABCD"],
      ["Caras laterales", "Los triángulos que van de cada lado de la base hasta la cúspide.", "ABE, BCE, CDE, DAE"],
      ["Aristas básicas", "Los lados de la base.", "AB, BC, CD, DA"],
      ["Aristas laterales", "Los segmentos que unen la cúspide con cada vértice de la base.", "EA, EB, EC, ED"],
      ["Vértices", "Los puntos donde se juntan las aristas: los de la base y la cúspide.", "A, B, C, D y E"],
      ["Cúspide o ápice", "El vértice donde se juntan todas las caras laterales.", "E"],
      ["Altura", "El segmento perpendicular que va de la cúspide a la base. En la pirámide recta llega al centro de la base.", "EO"],
      ["Apotema de la pirámide", "La altura de una cara lateral: va de la cúspide al punto medio de una arista básica.", "EM"],
      ["Apotema de la base", "Va del centro de la base al punto medio de uno de sus lados, perpendicular a ese lado.", "OM"],
    ] },
    { t: "ojo", x: "No confundás los tres segmentos que salen de la cúspide. La **altura** (EO) va por dentro del cuerpo hasta el centro de la base. La **apotema de la pirámide** (EM) va por encima de una cara hasta el punto medio de una arista básica. La **arista lateral** (EA) es un borde que llega a un vértice.\nEn una pirámide recta de base regular: altura < apotema de la pirámide < arista lateral." },
    { t: "h", x: "El prisma recto" },
    { t: "p", x: "Un **prisma** tiene **dos bases** iguales y paralelas, y sus **caras laterales** son paralelogramos. Es **recto** cuando las aristas laterales son perpendiculares a las bases; entonces las caras laterales son **rectángulos**. La **altura** del prisma es la distancia entre las dos bases: en un prisma recto mide lo mismo que **cualquier arista lateral**. El prisma no tiene cúspide." },
    { t: "svg", x: PRISMA, alt: "Prisma recto rectangular ABCD-EFGH. La base de abajo es ABCD, con D atrás; la de arriba es EFGH, con E sobre A, F sobre B, G sobre C y H sobre D. Las aristas que no se ven (AD, DC y DH) están punteadas." },
    { t: "tabla", cab: ["Elemento", "Qué es", "En la figura"], filas: [
      ["Bases", "Los dos polígonos iguales y paralelos.", "ABCD (abajo) y EFGH (arriba)"],
      ["Caras laterales", "Los rectángulos que unen las dos bases.", "ABFE, BCGF, CDHG, DAEH"],
      ["Aristas básicas", "Los lados de las dos bases.", "AB, BC, CD, DA, EF, FG, GH, HE"],
      ["Aristas laterales", "Los segmentos que unen cada vértice de una base con el vértice que le corresponde en la otra.", "AE, BF, CG, DH"],
      ["Vértices", "Los vértices de las dos bases.", "A, B, C, D, E, F, G y H"],
      ["Altura", "La distancia entre las bases. En el prisma recto es igual a una arista lateral.", "AE (o BF, CG, DH)"],
    ] },
    { t: "ojo", x: "Un segmento que une dos vértices **no siempre es una arista**. En el prisma de la figura, BG cruza la cara BCGF de esquina a esquina: es una **diagonal** de esa cara. EG cruza la base de arriba: también es una diagonal. Las aristas son solo los bordes del cuerpo." },
    { t: "h", x: "Contar caras, aristas y vértices" },
    { t: "tabla", cab: ["Si la base tiene n lados", "Caras", "Aristas", "Vértices"], filas: [
      ["Pirámide", "n + 1 (n laterales y 1 base)", "2n (n básicas y n laterales)", "n + 1 (n de la base y la cúspide)"],
      ["Prisma", "n + 2 (n laterales y 2 bases)", "3n (2n básicas y n laterales)", "2n (n en cada base)"],
    ] },
    { t: "ej", x: "Pirámide hexagonal (n = 6): caras = 6 + 1 = **7**; aristas = 2 · 6 = **12**; vértices = 6 + 1 = **7**.\nPrisma pentagonal (n = 5): caras = 5 + 2 = **7**; aristas = 3 · 5 = **15**; vértices = 2 · 5 = **10**.\nComprobación con la fórmula de Euler, caras + vértices − aristas = 2: pirámide 7 + 7 − 12 = 2; prisma 7 + 10 − 15 = 2." },
    { t: "ej", x: "Al revés: una pirámide tiene 16 aristas. Las aristas de una pirámide son 2n, así que 2n = 16 y n = 8: la base es un **octágono**." },
    { t: "h", x: "Notación simbólica" },
    { t: "lista", x: [
      "**Vértices y puntos**: una letra mayúscula. En la pirámide, la cúspide es E y el centro de la base es O.",
      "**Segmentos** (aristas, altura, apotemas, diagonales): las letras de sus dos extremos con una **raya encima**. AB y BA son el mismo segmento.",
      "**Caras y bases** (polígonos): las letras de sus vértices **en orden, siguiendo el borde**. Se puede empezar en cualquier vértice y dar la vuelta para cualquier lado: ABFE, BFEA y EFBA nombran la misma cara; AFBE no, porque salta en diagonal. A un triángulo se le puede poner △ delante (△ABE).",
      "**El cuerpo completo**: pirámide ABCDE (la base y después la cúspide) o prisma ABCD-EFGH (una base y después la otra).",
    ] },
    { t: "svg", x: NOTACION, alt: "Cómo se escribe la notación en el cuaderno: E para un vértice; AB con una raya encima para un segmento; un triangulito seguido de ABE para una cara triangular." },
    { t: "ej", x: "Con la pirámide de la materia:\nbase: ABCD · una cara lateral: △BCE · una arista básica: CD (con raya encima) · una arista lateral: EC (con raya) · altura: EO · apotema de la pirámide: EM · apotema de la base: OM · cúspide: E." },
    { t: "h", x: "Cómo vas a escribir las respuestas en la página" },
    { t: "p", x: "En la página no se puede poner la raya: escribí solo las dos letras del segmento, **en mayúscula** (AE o EA). Las caras, con sus letras en orden por el borde, en mayúscula y sin espacios. En el cuaderno y en la prueba de papel, **siempre** con la raya encima." },
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Pirámides y prismas rectos» y la fecha. Con regla, dibujá grande (media página cada uno) la pirámide ABCDE y el prisma ABCD-EFGH de la materia, con las aristas ocultas punteadas y todas las letras. Debajo de cada dibujo copiá su tabla de elementos, con la notación con raya encima." },
    { tipo: "escribir", x: "Hacé una tabla con 8 cuerpos: pirámide y prisma de base triangular, cuadrangular, pentagonal y hexagonal. Para cada uno escribí cuántas caras, aristas y vértices tiene, y comprobá cada fila con caras + vértices − aristas = 2." },
    { tipo: "resumir", x: "En 6 líneas, sin copiar de la materia, explicá la diferencia entre altura, apotema de la pirámide, apotema de la base y arista lateral. Después, en 2 líneas más, explicá por qué en un prisma recto la altura mide lo mismo que una arista lateral." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase la materia de pirámides y prismas. Copiá debajo de tu resumen dos definiciones tal como las dio tu profe y marcá con color cualquier diferencia de nombre o de notación con esta materia (por ejemplo «ápice» en vez de «cúspide»). En la prueba usá la forma de tu profe." },
    { tipo: "moverse", x: "Conseguí una caja de cartón (es un prisma) y armá una pirámide con cartulina, o con palillos y plastilina. Pegá papelitos con las letras de los vértices como en las figuras. De pie, caminando alrededor de la mesa, señalá con el dedo y decí en voz alta cada elemento con su notación: «base ABCD», «arista lateral EB», «altura EO»… Repetilo hasta hacerlo sin mirar la materia." },
  ],
  practica: [
    LECT_FIG,
    { t: "opcion", p: "¿Cuántas bases tiene una pirámide?", o: ["Una", "Dos", "Tantas como caras laterales", "No tiene base, solo caras laterales"], r: 0,
      e: "La pirámide tiene una sola base; las demás caras son triángulos que se juntan en la cúspide. El que tiene dos bases es el prisma." },
    { t: "vf", p: "En un prisma recto, las caras laterales son rectángulos.", r: true,
      e: "Verdadero: en el prisma recto las aristas laterales son perpendiculares a las bases, así que cada cara lateral tiene cuatro ángulos rectos." },
    { t: "opcion", p: "¿Qué forma tienen las caras laterales de una pirámide?", o: ["Triángulos", "Rectángulos", "La misma forma que la base", "Trapecios"], r: 0,
      e: "Cada cara lateral va de un lado de la base hasta la cúspide: tiene tres vértices, así que es un triángulo." },
    { t: "vf", p: "En una pirámide recta, la altura y la apotema de la pirámide son el mismo segmento.", r: false,
      e: "Falso: la altura va por dentro, de la cúspide al centro de la base; la apotema de la pirámide va sobre una cara, de la cúspide al punto medio de una arista básica. La apotema es más larga." },
    { t: "opcion", p: "¿Cómo se llama el segmento que va del centro de la base de una pirámide al punto medio de uno de los lados de la base?", o: ["Apotema de la base", "Apotema de la pirámide", "Altura", "Arista básica"], r: 0,
      e: "Es la apotema de la base: está en la base y va del centro al punto medio de un lado. La apotema de la pirámide sale de la cúspide." },
    { t: "numero", p: "¿Cuántas aristas tiene una pirámide hexagonal?", r: 12,
      e: "Una pirámide tiene 2n aristas: n básicas y n laterales. Con n = 6: 6 + 6 = 12." },
    { t: "numero", p: "¿Cuántos vértices tiene un prisma pentagonal?", r: 10,
      e: "Un prisma tiene 2n vértices, n en cada base. Con n = 5: 5 + 5 = 10." },
    { t: "numero", p: "¿Cuántas caras tiene un prisma hexagonal, contando las bases?", r: 8,
      e: "Un prisma tiene n + 2 caras: n laterales y 2 bases. Con n = 6: 6 + 2 = 8." },
    { t: "completar", fig: PIR, may: true, p: "En la pirámide de la figura, la cúspide es el vértice ___.", r: ["E"],
      e: "La cúspide es el vértice donde se juntan todas las caras laterales: E." },
    { t: "completar", fig: PIR, may: true, p: "Escribí la arista lateral que va de la cúspide al vértice C en la pirámide de la figura: ___", r: seg("EC"),
      e: "Las aristas laterales unen la cúspide E con un vértice de la base; la que llega a C es EC (con raya encima en el cuaderno)." },
    { t: "completar", fig: PIR, may: true, p: "La altura de la pirámide de la figura es el segmento ___", r: seg("EO"),
      e: "La altura va de la cúspide E, perpendicular a la base, hasta su centro O: EO." },
    { t: "parejas", fig: PIR, p: "Uní cada segmento o punto de la pirámide de la figura con el elemento que es.",
      pares: [["EM", "Apotema de la pirámide"], ["OM", "Apotema de la base"], ["EB", "Arista lateral"], ["BC", "Arista básica"], ["EO", "Altura"], ["E", "Cúspide"]],
      e: "EO va por dentro hasta el centro: altura. EM va sobre la cara ABE hasta el punto medio de AB: apotema de la pirámide. OM va en la base del centro al punto medio de AB: apotema de la base. EB une la cúspide con un vértice: arista lateral. BC es un lado de la base: arista básica. E es la cúspide." },
    { t: "completar", fig: PIR, may: true, p: "Escribí la cara lateral de la pirámide de la figura que contiene la arista AB (tres letras): ___", r: ciclos("ABE"),
      e: "La cara lateral que tiene el lado AB de la base sube hasta la cúspide E: es el triángulo ABE (en cualquier orden de sus tres letras)." },
    { t: "opcion", fig: PRISMA, p: "En el prisma de la figura, ¿cuál de estos segmentos es una arista lateral?", o: ["CG", "BC", "BG", "EG"], r: 0,
      e: "CG une el vértice C de la base de abajo con G, que está justo encima: es arista lateral. BC es arista básica; BG es diagonal de la cara BCGF y EG es diagonal de la base EFGH." },
    { t: "completar", fig: PRISMA, may: true, p: "Escribí la cara lateral del prisma de la figura que tiene las aristas BF y CG (cuatro letras, en orden por el borde): ___", r: ciclos("BCGF"),
      e: "Esa cara tiene los vértices B, C, G y F; siguiendo el borde: BCGF (o empezando en otra letra, como CGFB o FGCB)." },
    { t: "opcion", fig: PRISMA, p: "En el prisma recto de la figura, ¿qué segmentos miden lo mismo que la altura?", o: ["AE, BF, CG y DH", "AB, BC, CD y DA", "AC y BD", "EG y FH"], r: 0,
      e: "En un prisma recto, las aristas laterales son perpendiculares a las bases, así que cada una mide lo mismo que la distancia entre las bases: AE, BF, CG y DH." },
    { t: "vf", p: "Un prisma triangular tiene 9 aristas.", r: true,
      e: "Verdadero: 3n = 3 · 3 = 9 (3 en cada base y 3 laterales)." },
    { t: "opcion", p: "Una pirámide tiene 10 aristas. ¿Qué polígono es su base?", o: ["Un pentágono", "Un decágono", "Un hexágono", "Un cuadrilátero"], r: 0,
      e: "Una pirámide tiene 2n aristas: 2n = 10, entonces n = 5. La base tiene 5 lados: es un pentágono." },
    { t: "ordenar", p: "En una pirámide recta de base cuadrada, ordená estos segmentos del más corto al más largo.", x: ["La apotema de la base", "La apotema de la pirámide", "La arista lateral"],
      e: "En el triángulo rectángulo EOM, EM es la hipotenusa, así que es más larga que OM. En el triángulo rectángulo EMA (ángulo recto en M), EA es la hipotenusa, así que es más larga que EM." },
    { t: "abierta", p: "En el cuaderno, dibujá con regla un prisma recto triangular ABC-DEF (ABC abajo, D arriba de A, E arriba de B y F arriba de C), con las aristas ocultas punteadas. Escribí con notación simbólica: las dos bases, las tres caras laterales, las seis aristas básicas, las tres aristas laterales y un segmento que sea la altura.",
      guia: [
        "El dibujo es un prisma recto triangular hecho con regla, con todas las letras en su lugar y las aristas ocultas punteadas.",
        "Las bases están bien nombradas: △ABC y △DEF.",
        "Las tres caras laterales tienen las letras en orden por el borde: ABED, BCFE y CADF (o empezando en otra letra).",
        "Están las seis aristas básicas (AB, BC, CA, DE, EF, FD) y las tres laterales (AD, BE, CF), todas con raya encima.",
        "La altura está bien elegida (AD, BE o CF) y escrita con raya encima.",
      ],
      modelo: "Bases: △ABC y △DEF. Caras laterales: ABED, BCFE, CADF. Aristas básicas: AB, BC, CA, DE, EF, FD. Aristas laterales: AD, BE, CF. Altura: AD (mide lo mismo que BE y CF). Todos los segmentos van con raya encima." },
  ],
};

const potencias = {
  id: "potencias",
  titulo: "Leyes de las potencias",
  indicadores: ["Aplica las propiedades de las potencias de igual base para simplificar expresiones algebraicas."],
  materia: [
    { t: "h", x: "Qué es una potencia" },
    { t: "p", x: "Una **potencia** es una multiplicación de factores iguales: a^n = a · a · … · a (n veces). **a** es la **base** y **n** el **exponente**. Por ejemplo, 2⁵ = 2 · 2 · 2 · 2 · 2 = 32 y x³ = x · x · x.\nSi no se ve el exponente, es 1: x = x¹. Si no se ve el coeficiente, es 1: x²y = 1x²y." },
    { t: "h", x: "Leyes de las potencias de igual base" },
    { t: "tabla", cab: ["Ley", "Regla", "Ejemplo"], filas: [
      ["Producto de igual base", "a^m · a^n = a^(m + n)\nSe copia la base y se **suman** los exponentes.", "x³ · x⁴ = x⁷"],
      ["Cociente de igual base", "a^m ÷ a^n = a^(m − n), con a ≠ 0\nSe copia la base y se **restan** los exponentes.", "y⁹ ÷ y² = y⁷"],
      ["Potencia de una potencia", "(a^m)^n = a^(m · n)\nSe **multiplican** los exponentes.", "(x²)⁵ = x¹⁰"],
      ["Potencia de un producto", "(a · b)^n = a^n · b^n\nEl exponente le llega a **cada factor**, también al coeficiente.", "(3x)² = 9x²"],
      ["Potencia de un cociente", "(a ÷ b)^n = a^n ÷ b^n, con b ≠ 0", "(x ÷ 2)³ = x³ ÷ 8"],
      ["Exponente cero", "a⁰ = 1, con a ≠ 0", "7⁰ = 1; (5xy)⁰ = 1"],
      ["Exponente negativo", "a^(−n) = 1 ÷ a^n, con a ≠ 0\nSe pasa al denominador con exponente positivo.", "2⁻³ = 1/8; x⁻² = 1/x²"],
    ] },
    { t: "p", x: "**Por qué a⁰ = 1**: x³ ÷ x³ = 1, porque todo número (distinto de cero) dividido entre sí mismo da 1; y con la ley del cociente, x³ ÷ x³ = x³⁻³ = x⁰. Entonces x⁰ = 1.\n**Por qué a⁻ⁿ = 1/aⁿ**: x² ÷ x⁵ = (x · x) ÷ (x · x · x · x · x) = 1/x³; y con la ley del cociente, x² ÷ x⁵ = x²⁻⁵ = x⁻³. Entonces x⁻³ = 1/x³." },
    { t: "h", x: "Con coeficientes y varias letras" },
    { t: "p", x: "Primero se operan los **coeficientes** como números (con la ley de signos) y después **cada letra por aparte** con las leyes. Una letra que aparece en un solo factor se copia igual." },
    { t: "ej", x: "Producto: (−3x²y)(4x⁵y³)\n= (−3 · 4) · x^(2 + 5) · y^(1 + 3)\n= **−12x⁷y⁴**" },
    { t: "ej", x: "Cociente: 18a⁶b⁴ ÷ 6a²b\n= (18 ÷ 6) · a^(6 − 2) · b^(4 − 1)\n= **3a⁴b³**" },
    { t: "ej", x: "Potencia de un producto: (−2x³y²)³\n= (−2)³ · x^(3 · 3) · y^(2 · 3)\n= **−8x⁹y⁶**" },
    { t: "ej", x: "Como una sola potencia: (2³)² · 2⁴ ÷ 2⁵\n= 2⁶ · 2⁴ ÷ 2⁵\n= 2¹⁰ ÷ 2⁵\n= **2⁵** (si se pide una sola potencia, se deja 2⁵ y no 32)" },
    { t: "ej", x: "Exponente cero: 6x⁰y² = 6 · 1 · y² = **6y²** (solo la x está elevada a la cero).\nExponente negativo: x² ÷ x⁶ = x⁻⁴ = **1/x⁴**." },
    { t: "h", x: "Signos en las potencias" },
    { t: "lista", x: [
      "Base negativa con exponente **par**: el resultado es positivo. (−2)⁴ = 16.",
      "Base negativa con exponente **impar**: el resultado es negativo. (−2)³ = −8.",
      "**−2⁴ no es lo mismo que (−2)⁴.** En −2⁴ el exponente solo le llega al 2: −2⁴ = −(2 · 2 · 2 · 2) = −16. En (−2)⁴ le llega al −2: da 16.",
    ] },
    { t: "ojo", x: "x³ · x⁴ = x⁷, **no** x¹²: al multiplicar potencias se suman los exponentes; solo se multiplican en una potencia de potencia, (x³)⁴ = x¹².\n2³ · 2⁴ = 2⁷, **no** 4⁷: la base se copia, no se multiplica.\n(3x)² = 9x², **no** 3x²: el exponente le llega también al coeficiente." },
    { t: "ojo", x: "3x⁰ = 3 (solo la x va a la cero), pero (3x)⁰ = 1.\nx³ + x⁴ **no** se puede juntar: las leyes sirven para multiplicar y dividir, no para sumar ni restar." },
    ...BLOQUES_ESCRIBIR,
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Leyes de las potencias» y la fecha. Copiá la tabla de leyes y, en cada fila, agregá un ejemplo inventado por vos, resuelto. Copiá también los ejemplos con coeficientes y la lista de signos." },
    { tipo: "resumir", x: "En 5 líneas, explicá con tus palabras la diferencia entre −3⁴ y (−3)⁴, entre 5x⁰ y (5x)⁰, y entre x² · x³ y (x²)³. Poné el resultado de cada uno." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase 4 ejercicios resueltos de potencias. Tapá la solución, rehacelos en este cuaderno y compará. Si alguno te dio distinto, escribí al lado qué ley usaste mal." },
    { tipo: "moverse", x: "Hacé 8 fichas: en un lado, el nombre de la ley (producto, cociente, potencia de una potencia, potencia de un producto, potencia de un cociente, exponente cero, exponente negativo, signos); en el otro, la regla y un ejemplo. Pegalas en 8 lugares distintos de la casa. Recorrelas de pie y decí en voz alta cada regla antes de voltear la ficha. Al día siguiente, hacé el recorrido otra vez sin voltearlas." },
    { tipo: "escribir", x: "Inventá y resolvé 10 ejercicios con coeficientes y dos letras: 2 de producto, 2 de cociente, 2 de potencia de un producto, 2 con exponente cero y 2 con exponente negativo." },
  ],
  practica: [
    LECT_ALG,
    { t: "expresion", p: "Simplificá: x⁴ · x³", r: "x^7", e: "Producto de igual base: se copia la x y se suman los exponentes, 4 + 3 = 7." },
    { t: "expresion", p: "Simplificá: a² · a⁵ · a", r: "a^8", e: "La a sola es a¹. Se suman los exponentes: 2 + 5 + 1 = 8." },
    { t: "completar", p: "Expresá como una sola potencia: 3⁴ · 3⁵ = ___", r: pot(3, 9), e: "Igual base: se copia el 3 y se suman los exponentes, 4 + 5 = 9. Se deja 3⁹, sin calcular su valor." },
    { t: "opcion", p: "¿Cuál es el resultado de (x³)⁴?", o: ["x¹²", "x⁷", "x⁸¹", "4x³"], r: 0, e: "Potencia de una potencia: se multiplican los exponentes, 3 · 4 = 12. Sumarlos (x⁷) es la ley del producto, no esta." },
    { t: "expresion", p: "Simplificá: m¹⁰ ÷ m⁴", r: "m^6", e: "Cociente de igual base: se restan los exponentes, 10 − 4 = 6." },
    { t: "numero", p: "Calculá: 5⁰ + 2³", r: 9, e: "5⁰ = 1 y 2³ = 8; 1 + 8 = 9." },
    { t: "vf", p: "−3² = 9", r: false, e: "Falso: el exponente solo le llega al 3, así que −3² = −(3 · 3) = −9. El que da 9 es (−3)²." },
    { t: "expresion", p: "Simplificá: (2x³)(5x⁴)", r: "10x^7", e: "Coeficientes: 2 · 5 = 10. Letras: x^(3 + 4) = x⁷. Resultado: 10x⁷." },
    { t: "expresion", p: "Simplificá: (−3a²b)(4ab⁵)", r: "-12a^3b^6", e: "Coeficientes: (−3)(4) = −12. a: 2 + 1 = 3. b: 1 + 5 = 6. Resultado: −12a³b⁶." },
    { t: "expresion", p: "Simplificá: 24x⁸y⁵ ÷ 6x³y²", r: "4x^5y^3", e: "Coeficientes: 24 ÷ 6 = 4. x: 8 − 3 = 5. y: 5 − 2 = 3. Resultado: 4x⁵y³." },
    { t: "expresion", p: "Simplificá: (3x²y⁴)²", r: "9x^4y^8", e: "El exponente 2 le llega a cada factor: 3² = 9, (x²)² = x⁴, (y⁴)² = y⁸. Resultado: 9x⁴y⁸." },
    { t: "expresion", p: "Simplificá: (−2m³n)³", r: "-8m^9n^3", e: "(−2)³ = −8 (exponente impar, queda negativo); (m³)³ = m⁹; n³. Resultado: −8m⁹n³." },
    { t: "expresion", p: "Simplificá: 7x⁰y³", r: "7y^3", e: "Solo la x está elevada a la cero: x⁰ = 1. Queda 7 · 1 · y³ = 7y³." },
    { t: "numero", p: "Calculá: 2⁻³", r: "1/8", e: "Exponente negativo: 2⁻³ = 1/2³ = 1/8 (también se puede escribir 0,125). No es negativo: el signo del exponente no cambia el signo del resultado." },
    { t: "completar", p: "Escribí con exponente positivo: x⁵ ÷ x⁹ = ___", r: ["1/x^4", "1/x⁴"], e: "x⁵ ÷ x⁹ = x^(5 − 9) = x⁻⁴ = 1/x⁴." },
    { t: "opcion", p: "¿Cuál de estas expresiones **no** es igual a x¹²?", o: ["x⁶ · x²", "(x⁴)³", "x¹⁵ ÷ x³", "x⁷ · x⁵"], r: 0, e: "x⁶ · x² = x⁸ (se suman los exponentes, no se multiplican). Las otras dan x¹²: 4 · 3 = 12; 15 − 3 = 12; 7 + 5 = 12." },
    { t: "expresion", p: "Simplificá: (x²)³ · x⁴ ÷ x⁵", r: "x^5", e: "(x²)³ = x⁶; x⁶ · x⁴ = x¹⁰; x¹⁰ ÷ x⁵ = x⁵." },
    { t: "completar", p: "Expresá como una sola potencia de base 2: (2³)⁴ · 2⁵ ÷ 2¹⁰ = ___", r: pot(2, 7), e: "(2³)⁴ = 2¹²; 2¹² · 2⁵ = 2¹⁷; 2¹⁷ ÷ 2¹⁰ = 2⁷." },
    { t: "expresion", p: "Simplificá: (−2a²b³)² · 3ab", r: "12a^5b^7", e: "(−2a²b³)² = 4a⁴b⁶ (exponente par: positivo). Después 4a⁴b⁶ · 3ab = 12a⁵b⁷." },
    { t: "expresion", p: "Simplificá: 36x⁶y⁴z² ÷ (−9x²y⁴z)", r: "-4x^4z", e: "36 ÷ (−9) = −4. x: 6 − 2 = 4. y: 4 − 4 = 0, y⁰ = 1 (desaparece). z: 2 − 1 = 1. Resultado: −4x⁴z." },
  ],
};

const valorNumerico = {
  id: "valor-numerico",
  titulo: "Valor numérico de expresiones algebraicas",
  indicadores: ["Calcula el valor numérico de expresiones algebraicas sustituyendo variables por valores dados y realizando las operaciones correspondientes."],
  materia: [
    { t: "h", x: "Qué es el valor numérico" },
    { t: "p", x: "El **valor numérico** de una expresión algebraica es el número que se obtiene al **sustituir cada letra por el valor dado** y hacer las operaciones. La misma expresión tiene distintos valores numéricos según los valores de las letras: 3x + 1 vale 7 si x = 2, y vale −5 si x = −2." },
    { t: "h", x: "El método de los paréntesis" },
    { t: "lista", x: [
      "**Copiá** la expresión cambiando cada letra por un paréntesis vacío: 3x² − 2xy + y → 3( )² − 2( )( ) + ( ).",
      "**Poné cada valor** dentro de su paréntesis, con su signo. Los negativos y las fracciones van **siempre** entre paréntesis.",
      "**Resolvé en orden**: primero las potencias, después multiplicaciones y divisiones (de izquierda a derecha) y al final sumas y restas.",
      "**Revisá los signos** antes de escribir el resultado.",
    ] },
    { t: "tabla", cab: ["Orden", "Qué se hace", "En 3x² − 5 con x = −2"], filas: [
      ["1°", "Sustituir con paréntesis", "3(−2)² − 5"],
      ["2°", "Potencias", "(−2)² = 4 → 3 · 4 − 5"],
      ["3°", "Multiplicaciones y divisiones", "3 · 4 = 12 → 12 − 5"],
      ["4°", "Sumas y restas", "12 − 5 = **7**"],
    ] },
    { t: "ej", x: "3x² − 2xy + y con x = −2 e y = 5:\n3(−2)² − 2(−2)(5) + (5)\n= 3 · 4 − (−20) + 5\n= 12 + 20 + 5 = **37**" },
    { t: "ej", x: "Con fracciones: 4a² − b³ con a = 1/2 y b = −3:\n4(1/2)² − (−3)³\n= 4 · 1/4 − (−27)\n= 1 + 27 = **28**" },
    { t: "ej", x: "Con división: (x² + y) ÷ (x − y) con x = 3 e y = −1:\n((3)² + (−1)) ÷ ((3) − (−1))\n= (9 − 1) ÷ (3 + 1)\n= 8 ÷ 4 = **2**" },
    { t: "ej", x: "Con una fórmula: el área de un trapecio es A = (B + b) · h ÷ 2. Si B = 10 cm, b = 6 cm y h = 4 cm:\nA = (10 + 6) · 4 ÷ 2 = 16 · 4 ÷ 2 = 64 ÷ 2 = **32 cm²**" },
    { t: "ojo", x: "−x² con x = −3 es −(−3)² = −9, **no** 9: primero la potencia y después el signo de afuera.\n2x² con x = 3 es 2 · 9 = 18, **no** 6² = 36: el exponente es solo de la x.\n3x con x = 4 es 3 · 4 = 12, **no** 34: entre el coeficiente y la letra hay una multiplicación." },
    { t: "ojo", x: "Restar un negativo es sumar: 5 − (−4) = 5 + 4 = 9. Por eso el valor negativo va entre paréntesis: sin paréntesis es muy fácil perder un signo." },
    { t: "h", x: "Cómo vas a escribir las respuestas en la página" },
    { t: "p", x: "El resultado es un número: entero, fracción (−14/9) o decimal con coma (31,5). Solo el número, **sin unidades** y sin puntos de miles. Las fracciones, simplificadas." },
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Valor numérico» y la fecha. Copiá los cuatro pasos del método de los paréntesis, la tabla del orden de las operaciones y los cuatro ejemplos resueltos con todos sus pasos." },
    { tipo: "resumir", x: "En 4 líneas, explicá por qué hay que poner entre paréntesis un valor negativo al sustituirlo. Usá como ejemplo −x² con x = −4, resuelto bien y resuelto mal." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase 3 ejercicios de valor numérico (o de sustituir en una fórmula). Rehacelos con el método de los paréntesis, escribiendo cada paso, y compará el resultado con el de clase." },
    { tipo: "moverse", x: "Escribí en una hoja grande 2x² − 3xy + y² y pegala en la pared. En 6 papelitos escribí: (x = 1, y = 2), (x = −1, y = 3), (x = 2, y = −2), (x = −3, y = −1), (x = 1/2, y = 4), (x = 0, y = −5). Doblalos y metelos en una bolsa. De pie frente a la hoja, sacá uno, resolvelo en voz alta paso por paso y anotá el resultado en el cuaderno. Seguí hasta sacarlos todos." },
    { tipo: "escribir", x: "Inventá 6 ejercicios de valor numérico con dos letras: 2 con un valor negativo, 2 con una fracción y 2 con una potencia al cubo. Resolvelos completos." },
  ],
  practica: [
    LECT_NUM,
    { t: "numero", p: "Calculá el valor numérico de 5x − 3 si x = 4.", r: 17, e: "5(4) − 3 = 20 − 3 = 17." },
    { t: "numero", p: "Calculá el valor numérico de x² + 2x si x = −3.", r: 3, e: "(−3)² + 2(−3) = 9 − 6 = 3." },
    { t: "opcion", p: "Si y = −4, ¿cuánto vale −2y²?", o: ["−32", "32", "64", "−64"], r: 0, e: "Primero la potencia: (−4)² = 16. Después −2 · 16 = −32. El 64 sale si se eleva (−2y) completo, pero el exponente es solo de la y." },
    { t: "vf", p: "Si x = −2, entonces x³ = 8.", r: false, e: "Falso: (−2)³ = (−2)(−2)(−2) = −8. Base negativa con exponente impar da negativo." },
    { t: "numero", p: "Calculá el valor numérico de −x² + 4 si x = −5.", r: -21, e: "−(−5)² + 4 = −25 + 4 = −21. Primero la potencia (25) y después el signo de afuera." },
    { t: "numero", p: "Calculá el valor numérico de 3a²b si a = 2 y b = −1.", r: -12, e: "3(2)²(−1) = 3 · 4 · (−1) = −12." },
    { t: "numero", p: "Calculá el valor numérico de 2m − 3n + mn si m = −2 y n = 4.", r: -24, e: "2(−2) − 3(4) + (−2)(4) = −4 − 12 − 8 = −24." },
    { t: "numero", p: "Calculá el valor numérico de x² − 5x + 6 si x = 2.", r: 0, e: "(2)² − 5(2) + 6 = 4 − 10 + 6 = 0." },
    { t: "numero", p: "Calculá el valor numérico de 8a² − 2a + 1 si a = 1/2.", r: 2, e: "8(1/2)² − 2(1/2) + 1 = 8 · 1/4 − 1 + 1 = 2 − 1 + 1 = 2." },
    { t: "numero", p: "Calculá el valor numérico de (x + y)² − xy si x = −3 e y = 5.", r: 19, e: "(−3 + 5)² − (−3)(5) = 2² − (−15) = 4 + 15 = 19." },
    { t: "numero", p: "Calculá el valor numérico de a³ − b³ si a = −1 y b = −2.", r: 7, e: "(−1)³ − (−2)³ = −1 − (−8) = −1 + 8 = 7." },
    { t: "numero", p: "Calculá el valor numérico de (3x − y) ÷ (x + 1) si x = 3 e y = 1.", r: 2, e: "(3 · 3 − 1) ÷ (3 + 1) = 8 ÷ 4 = 2." },
    { t: "numero", p: "El área de un triángulo es A = b · h ÷ 2. ¿Cuántos centímetros cuadrados mide un triángulo con b = 9 cm y h = 7 cm?", r: 31.5, e: "A = 9 · 7 ÷ 2 = 63 ÷ 2 = 31,5 cm²." },
    { t: "numero", p: "La fórmula F = 9C ÷ 5 + 32 pasa una temperatura de grados Celsius (C) a grados Fahrenheit (F). ¿Cuántos grados Fahrenheit son 25 °C?", r: 77, e: "F = 9 · 25 ÷ 5 + 32 = 225 ÷ 5 + 32 = 45 + 32 = 77." },
    { t: "numero", p: "El perímetro de un rectángulo es P = 2l + 2a. ¿Cuántos metros mide P si l = 3,5 m y a = 2,25 m?", r: 11.5, e: "P = 2(3,5) + 2(2,25) = 7 + 4,5 = 11,5 m." },
    { t: "numero", p: "Calculá el valor numérico de −2x²y + 3xy² − y³ si x = −1 e y = 3.", r: -60, e: "−2(−1)²(3) + 3(−1)(3)² − (3)³ = −2 · 1 · 3 + 3 · (−1) · 9 − 27 = −6 − 27 − 27 = −60." },
    { t: "numero", p: "Calculá el valor numérico de x² − 3x si x = 2/3.", r: "-14/9", e: "(2/3)² − 3(2/3) = 4/9 − 2 = 4/9 − 18/9 = −14/9." },
    { t: "opcion", p: "Para calcular 2x² con x = −3, alguien escribió 2 · −3² = −18. ¿Qué está mal?", o: ["Faltó el paréntesis: es 2(−3)² = 2 · 9 = 18", "Tenía que multiplicar primero: (2 · (−3))² = 36", "Tenía que dar −36", "Está bien: el resultado es −18"], r: 0,
      e: "Sin paréntesis, el cuadrado le llega solo al 3 y el signo se pierde. Con paréntesis: (−3)² = 9 y 2 · 9 = 18. El exponente es solo de la x, así que no se eleva el 2." },
  ],
};

const poligonosRegulares = {
  id: "poligonos-regulares",
  titulo: "Perímetro y área de polígonos regulares",
  indicadores: ["Resuelve problemas del entorno planteados que involucran el cálculo del perímetro y el área de polígonos regulares mediante la aplicación de fórmulas geométricas."],
  materia: [
    { t: "h", x: "Polígonos regulares" },
    { t: "p", x: "Un **polígono regular** tiene **todos sus lados iguales y todos sus ángulos iguales**. El cuadrado es regular. Un rectángulo que no es cuadrado no lo es (sus lados no son todos iguales), y un rombo que no es cuadrado tampoco (sus ángulos no son todos iguales)." },
    { t: "tabla", cab: ["Lados (n)", "Nombre"], filas: [
      ["3", "Triángulo equilátero"], ["4", "Cuadrado"], ["5", "Pentágono regular"], ["6", "Hexágono regular"], ["7", "Heptágono regular"],
      ["8", "Octágono regular"], ["9", "Eneágono regular"], ["10", "Decágono regular"], ["12", "Dodecágono regular"],
    ] },
    { t: "svg", x: HEXAGONO, alt: "Hexágono regular con su centro O. Del centro sale un radio r (punteado) hasta un vértice y una apotema a hasta el punto medio del lado de abajo, que forma un ángulo recto con ese lado. El lado de abajo está marcado con l." },
    { t: "lista", x: [
      "**Lado (l)**: cada uno de los segmentos iguales del borde.",
      "**Centro (O)**: el punto que está a la misma distancia de todos los vértices.",
      "**Radio (r)**: el segmento del centro a un **vértice**.",
      "**Apotema (a)**: el segmento del centro al **punto medio de un lado**; es **perpendicular** a ese lado. Es la distancia del centro al lado.",
      "**Perímetro (P)**: la suma de todos los lados.",
    ] },
    { t: "h", x: "Fórmulas" },
    { t: "tabla", cab: ["Qué se busca", "Fórmula", "Unidades"], filas: [
      ["Perímetro", "P = n · l", "cm, m (lineales)"],
      ["Área", "A = P · a ÷ 2", "cm², m² (cuadradas)"],
      ["Lado, si se sabe el perímetro", "l = P ÷ n", "cm, m"],
      ["Apotema, si se saben el área y el perímetro", "a = 2A ÷ P", "cm, m"],
    ] },
    { t: "p", x: "El área de un polígono regular es **el perímetro por la apotema, entre dos**. ¿Por qué? El polígono se parte en n triángulos iguales con un vértice en el centro. Cada triángulo tiene base l y altura a, así que su área es l · a ÷ 2. Los n juntos: n · l · a ÷ 2 = P · a ÷ 2." },
    { t: "ej", x: "Hexágono regular de 6 cm de lado y 5,2 cm de apotema.\nPerímetro: P = 6 · 6 = **36 cm**.\nÁrea: A = 36 · 5,2 ÷ 2 = 187,2 ÷ 2 = **93,6 cm²**." },
    { t: "ej", x: "Al revés: un polígono regular tiene 40 cm de perímetro y 110 cm² de área.\nApotema: a = 2 · 110 ÷ 40 = 220 ÷ 40 = **5,5 cm**." },
    { t: "ej", x: "Problema: una señal de alto es un octágono regular de 25 cm de lado y 30 cm de apotema. ¿Cuánta lámina se necesita para 12 señales?\nUna señal: P = 8 · 25 = 200 cm; A = 200 · 30 ÷ 2 = 3 000 cm².\nDoce señales: 12 · 3 000 = 36 000 cm².\nEn metros cuadrados: 36 000 ÷ 10 000 = **3,6 m²**." },
    { t: "ej", x: "Problema con dinero: un jardín con forma de hexágono regular de 4 m de lado y 3,5 m de apotema se va a cercar con malla de ₡2 000 el metro y a cubrir con zacate de ₡3 000 el metro cuadrado.\nMalla (perímetro): P = 6 · 4 = 24 m → 24 · 2 000 = **₡48 000**.\nZacate (área): A = 24 · 3,5 ÷ 2 = 42 m² → 42 · 3 000 = **₡126 000**." },
    { t: "ojo", x: "La apotema **no es el radio**: el radio llega a un vértice y es más largo; la apotema llega al punto medio de un lado. Para el área se usa la apotema.\nNo te olvidés de **dividir entre 2**.\nEl perímetro va en unidades lineales (cm) y el área en **unidades cuadradas** (cm²)." },
    { t: "ojo", x: "Si los datos vienen en unidades distintas, convertí antes de calcular: 1 m = 100 cm y **1 m² = 10 000 cm²** (no 100).\nLeé bien qué pide el problema: cercar, poner cinta, rodapié o un borde es **perímetro**; pintar, cubrir, sembrar, forrar o embaldosar es **área**." },
    { t: "h", x: "Cómo vas a escribir las respuestas en la página" },
    { t: "p", x: "Solo el número, en la unidad que pide la pregunta, con coma decimal si hace falta (93,6). Sin unidades, sin ₡ y sin puntos de miles (126000)." },
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Polígonos regulares: perímetro y área» y la fecha. Dibujá con compás y regla un hexágono regular grande y marcá con colores el centro, un radio, una apotema y un lado. Copiá la tabla de fórmulas y los dos problemas resueltos (señal de alto y jardín)." },
    { tipo: "resumir", x: "En 5 líneas, explicá por qué el área de un polígono regular es P · a ÷ 2 (con la idea de partirlo en triángulos) y cómo sabés si un problema pide perímetro o área." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase los problemas de perímetro y área de polígonos regulares. Escogé 2, copiá el enunciado y resolvelos de nuevo con todos los pasos y las unidades." },
    { tipo: "moverse", x: "Buscá en la casa 3 objetos con forma de polígono regular (un mosaico, una tuerca, la cara de una caja cuadrada, un lápiz hexagonal…). Medí con regla el lado y la apotema de cada uno, anotá las medidas en el cuaderno junto a un dibujo y calculá su perímetro y su área. Decí en voz alta cada resultado con su unidad." },
    { tipo: "escribir", x: "Inventá 2 problemas del entorno, uno de perímetro y otro de área con costo en colones, y resolvelos completos, con la respuesta en una oración." },
  ],
  practica: [
    LECT_NUM,
    { t: "opcion", p: "¿Qué es la apotema de un polígono regular?", o: ["El segmento del centro al punto medio de un lado, perpendicular a ese lado", "El segmento del centro a un vértice", "El segmento que une dos vértices que no son consecutivos", "La mitad del perímetro"], r: 0,
      e: "La apotema va del centro al punto medio de un lado y es perpendicular a él. Del centro a un vértice es el radio; entre vértices no consecutivos es una diagonal." },
    { t: "vf", p: "Un rombo que no es cuadrado es un polígono regular.", r: false, e: "Falso: tiene los cuatro lados iguales, pero sus ángulos no son todos iguales. Un polígono regular necesita las dos cosas." },
    { t: "numero", p: "¿Cuál es el perímetro, en centímetros, de un octágono regular de 7 cm de lado?", r: 56, e: "P = n · l = 8 · 7 = 56 cm." },
    { t: "numero", p: "Un pentágono regular tiene 65 cm de perímetro. ¿Cuánto mide cada lado, en centímetros?", r: 13, e: "l = P ÷ n = 65 ÷ 5 = 13 cm." },
    { t: "opcion", p: "¿Cuál es la fórmula del área de un polígono regular de perímetro P y apotema a?", o: ["A = P · a ÷ 2", "A = P · a", "A = P + a ÷ 2", "A = l · a ÷ 2"], r: 0,
      e: "A = P · a ÷ 2. La fórmula l · a ÷ 2 da el área de uno solo de los triángulos en que se parte el polígono." },
    { t: "opcion", p: "Un cuadrado tiene 12 cm de lado. ¿Cuánto mide su apotema?", o: ["6 cm", "12 cm", "24 cm", "3 cm"], r: 0,
      e: "En el cuadrado, del centro al punto medio de un lado hay la mitad del lado: 12 ÷ 2 = 6 cm." },
    { t: "numero", fig: PENTAGONO, p: "Calculá el área, en centímetros cuadrados, del pentágono regular de la figura.", r: 110,
      e: "P = 5 · 8 = 40 cm. A = 40 · 5,5 ÷ 2 = 220 ÷ 2 = 110 cm²." },
    { t: "numero", p: "Calculá el área, en centímetros cuadrados, de un hexágono regular de 10 cm de lado y 8,66 cm de apotema.", r: 259.8,
      e: "P = 6 · 10 = 60 cm. A = 60 · 8,66 ÷ 2 = 519,6 ÷ 2 = 259,8 cm²." },
    { t: "numero", p: "Un polígono regular tiene 60 cm de perímetro y 270 cm² de área. ¿Cuánto mide su apotema, en centímetros?", r: 9,
      e: "De A = P · a ÷ 2 se despeja a = 2A ÷ P = 2 · 270 ÷ 60 = 540 ÷ 60 = 9 cm." },
    { t: "vf", p: "Si se duplica el lado de un hexágono regular (y con él su apotema), el área también se duplica.", r: false,
      e: "Falso: el perímetro se duplica y la apotema también, así que el área (P · a ÷ 2) queda multiplicada por 2 · 2 = 4." },
    { t: "numero", p: "Un mosaico de piso tiene forma de hexágono regular de 15 cm de lado y 13 cm de apotema. ¿Cuántos centímetros cuadrados cubre?", r: 585,
      e: "P = 6 · 15 = 90 cm. A = 90 · 13 ÷ 2 = 1 170 ÷ 2 = 585 cm²." },
    { t: "numero", p: "Una mesa tiene forma de octágono regular de 50 cm de lado y 60 cm de apotema. Se le quiere pegar una cinta por todo el borde. ¿Cuántos metros de cinta se necesitan?", r: 4,
      e: "El borde es el perímetro: P = 8 · 50 = 400 cm = 4 m. La apotema no se usa porque no se pide el área." },
    { t: "numero", p: "El vidrio de una ventana tiene forma de octágono regular de 40 cm de lado y 48 cm de apotema y cuesta ₡9 000 el metro cuadrado. ¿Cuántos colones cuesta el vidrio?", r: 6912,
      e: "P = 8 · 40 = 320 cm. A = 320 · 48 ÷ 2 = 7 680 cm². En m²: 7 680 ÷ 10 000 = 0,768 m². Costo: 0,768 · 9 000 = ₡6 912." },
    { t: "numero", p: "Un jardín con forma de pentágono regular de 6 m de lado y 4,1 m de apotema se va a sembrar con zacate de ₡2 500 el metro cuadrado. ¿Cuántos colones cuesta el zacate?", r: 153750,
      e: "P = 5 · 6 = 30 m. A = 30 · 4,1 ÷ 2 = 61,5 m². Costo: 61,5 · 2 500 = ₡153 750." },
    { t: "numero", p: "Un pasillo se cubre, sin dejar espacios, con 400 mosaicos con forma de hexágono regular de 10 cm de lado y 8,7 cm de apotema. ¿Cuántos metros cuadrados mide el pasillo?", r: 10.44,
      e: "Un mosaico: P = 60 cm; A = 60 · 8,7 ÷ 2 = 261 cm². Los 400: 400 · 261 = 104 400 cm². En m²: 104 400 ÷ 10 000 = 10,44 m²." },
    { t: "numero", p: "Para cercar un terreno con forma de hexágono regular se dieron 3 vueltas de alambre y se gastaron 162 m en total. ¿Cuánto mide cada lado del terreno, en metros?", r: 9,
      e: "Una vuelta es el perímetro: 162 ÷ 3 = 54 m. Cada lado: 54 ÷ 6 = 9 m." },
    { t: "ordenar", p: "Ordená los pasos para saber cuánto cuesta pintar una pared con forma de hexágono regular, si se conocen su lado y su apotema en centímetros y el precio de cada metro cuadrado de pintura.",
      x: ["Calcular el perímetro multiplicando 6 por el lado", "Calcular el área: perímetro por apotema, entre dos", "Pasar el área de cm² a m² dividiendo entre 10 000", "Multiplicar el área en m² por el precio de cada metro cuadrado", "Escribir la respuesta en colones en una oración"],
      e: "Primero el perímetro, porque la fórmula del área lo necesita; después el área; después se pasa a m², porque el precio es por metro cuadrado; al final se multiplica por el precio y se contesta." },
    { t: "abierta", p: "Resolvé en el cuaderno: el piso de un salón tiene forma de hexágono regular de 5 m de lado y 4,33 m de apotema. Se va a cubrir con piso laminado de ₡8 500 el metro cuadrado y se le va a poner rodapié (un borde alrededor) de ₡1 200 el metro. ¿Cuánto se gasta en total?",
      guia: [
        "Calcula bien el perímetro: P = 6 · 5 = 30 m.",
        "Calcula bien el área: A = 30 · 4,33 ÷ 2 = 64,95 m².",
        "Calcula el costo del laminado (64,95 · 8 500 = ₡552 075) y el del rodapié (30 · 1 200 = ₡36 000).",
        "Suma los dos costos y responde en una oración: se gastan ₡588 075.",
      ],
      modelo: "P = 6 · 5 = 30 m. A = 30 · 4,33 ÷ 2 = 129,9 ÷ 2 = 64,95 m². Laminado: 64,95 · 8 500 = ₡552 075. Rodapié: 30 · 1 200 = ₡36 000. Total: 552 075 + 36 000 = ₡588 075. Respuesta: en total se gastan ₡588 075." },
  ],
};

const sumaResta = {
  id: "suma-resta-polinomios",
  titulo: "Suma y resta de polinomios",
  indicadores: ["Efectúa adiciones y sustracciones de expresiones algebraicas identificando y consolidando términos semejantes, modificando de forma exacta los signos algebraicos del polinomio sustraendo en el caso de las restas."],
  materia: [
    { t: "h", x: "Vocabulario" },
    { t: "tabla", cab: ["Palabra", "Qué es", "Ejemplo"], filas: [
      ["Monomio", "Un solo término: un número, letras con exponentes naturales, o un número por letras.", "−5x²y"],
      ["Coeficiente", "El número que multiplica a las letras, con su signo.", "En −5x²y es −5"],
      ["Parte literal", "Las letras con sus exponentes.", "En −5x²y es x²y"],
      ["Polinomio", "Suma o resta de monomios. Con 2 términos es binomio; con 3, trinomio.", "3a² − 2a + 7"],
      ["Términos semejantes", "Términos con **la misma parte literal**: las mismas letras con los mismos exponentes.", "4xy² y −xy² sí lo son\n4xy² y 4x²y no"],
    ] },
    { t: "h", x: "Reducir términos semejantes" },
    { t: "p", x: "Se **suman o restan los coeficientes** y se **copia la parte literal igual**: los exponentes no cambian. Los términos que no son semejantes se dejan como están." },
    { t: "ej", x: "3x² − 5x + 7x² + 2x − 4\nx²: 3 + 7 = 10 · x: −5 + 2 = −3 · números: −4\nResultado: **10x² − 3x − 4**" },
    { t: "h", x: "Suma de polinomios" },
    { t: "p", x: "Un signo **+** delante de un paréntesis no cambia nada: se quitan los paréntesis dejando cada signo igual y se reducen los términos semejantes." },
    { t: "ej", x: "(4a² − 3a + 5) + (−a² + 7a − 9)\n= 4a² − 3a + 5 − a² + 7a − 9\n= **3a² + 4a − 4**" },
    { t: "h", x: "Resta de polinomios" },
    { t: "p", x: "Un signo **−** delante de un paréntesis **cambia el signo de todos los términos** de adentro. El polinomio que se resta se llama **sustraendo**. Después de cambiar los signos, se reducen los semejantes." },
    { t: "ej", x: "(5x² − 2x + 1) − (3x² − 6x + 4)\n= 5x² − 2x + 1 **− 3x² + 6x − 4**\n= **2x² + 4x − 3**" },
    { t: "ej", x: "Cuidado con el orden de las palabras: «**restá A de B**» es B − A, y «**de B restá A**» también es B − A.\nRestá 2x − 3 de 5x + 1: (5x + 1) − (2x − 3) = 5x + 1 − 2x + 3 = **3x + 4**" },
    { t: "ej", x: "Con fracciones: (1/2x + 3) − (3/4x − 1) = 1/2x + 3 − 3/4x + 1\nx: 1/2 − 3/4 = 2/4 − 3/4 = −1/4 · números: 3 + 1 = 4\nResultado: **−1/4x + 4**" },
    { t: "ej", x: "Tres polinomios: (2y² − y) − (y² + 3y − 5) + (4y − 2)\n= 2y² − y − y² − 3y + 5 + 4y − 2\ny²: 2 − 1 = 1 · y: −1 − 3 + 4 = 0 (desaparece) · números: 5 − 2 = 3\nResultado: **y² + 3**" },
    { t: "ojo", x: "El error más común: cambiar solo el signo del **primer** término del sustraendo. −(3x² − 6x + 4) es −3x² **+ 6x − 4**: cambian los tres.\nOtros errores: sumar exponentes al sumar (x² + x² = 2x², no x⁴), juntar términos que no son semejantes (3x + 2y se queda así) y dejar escrito 0x (si un término se anula, desaparece)." },
    ...BLOQUES_ESCRIBIR,
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Suma y resta de polinomios» y la fecha. Copiá la tabla de vocabulario y todos los ejemplos resueltos. En las restas, marcá con rojo cada signo que cambió." },
    { tipo: "resumir", x: "En 5 líneas, explicá qué son términos semejantes (con dos ejemplos que sí y dos que no) y qué pasa con los signos al restar un polinomio." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase 3 restas de polinomios resueltas. Rehacelas sin mirar y compará: si te equivocaste en algún signo, marcalo y escribí al lado la regla." },
    { tipo: "moverse", x: "Recortá 16 papelitos y escribí en cada uno un término: 3x², −5x, 7, −x², 2x, −4, 6xy, −2xy, 4x², −x, 1, −3xy, x², 8x, −6, xy. Tiralos desordenados en el piso, agachate y agrupalos por términos semejantes. De pie, decí en voz alta el resultado de cada grupo y escribí el polinomio reducido en el cuaderno (tiene que darte 7x² + 2xy + 4x − 2)." },
    { tipo: "escribir", x: "Resolvé en el cuaderno 8 ejercicios inventados por vos: 4 sumas y 4 restas de trinomios, al menos 2 con fracciones como coeficientes." },
  ],
  practica: [
    LECT_ALG,
    { t: "opcion", p: "¿Cuál par está formado por términos semejantes?", o: ["−7a²b y 3a²b", "4ab² y 4a²b", "5x y 5x²", "2xy y 2x"], r: 0,
      e: "−7a²b y 3a²b tienen la misma parte literal, a²b. En 4ab² y 4a²b los exponentes están cambiados; los coeficientes iguales no los hacen semejantes." },
    { t: "vf", p: "3x² + 2x² = 5x⁴", r: false, e: "Falso: al sumar se suman los coeficientes y la parte literal queda igual: 3x² + 2x² = 5x²." },
    { t: "expresion", p: "Reducí: 7m − 3n + 2m − 5n", r: "9m - 8n", e: "m: 7 + 2 = 9. n: −3 − 5 = −8. Resultado: 9m − 8n." },
    { t: "expresion", p: "Reducí: 4x² − 6x + 1 − x² + 6x − 8", r: "3x^2 - 7", e: "x²: 4 − 1 = 3. x: −6 + 6 = 0 (desaparece). Números: 1 − 8 = −7. Resultado: 3x² − 7." },
    { t: "expresion", p: "Resolvé: (3a² − 5a + 2) + (4a² + a − 7)", r: "7a^2 - 4a - 5", e: "3a² − 5a + 2 + 4a² + a − 7. a²: 3 + 4 = 7. a: −5 + 1 = −4. Números: 2 − 7 = −5." },
    { t: "expresion", p: "Resolvé: (2x³ − x + 4) + (−5x³ + 3x² − 4)", r: "-3x^3 + 3x^2 - x", e: "x³: 2 − 5 = −3. x²: 3. x: −1. Números: 4 − 4 = 0. Resultado: −3x³ + 3x² − x." },
    { t: "vf", p: "−(2x − 5) = −2x − 5", r: false, e: "Falso: el menos cambia el signo de los dos términos: −(2x − 5) = −2x + 5." },
    { t: "expresion", p: "Resolvé: (6y² + 2y − 3) − (2y² − 5y + 1)", r: "4y^2 + 7y - 4", e: "Se cambian los signos del sustraendo: 6y² + 2y − 3 − 2y² + 5y − 1. y²: 4. y: 2 + 5 = 7. Números: −3 − 1 = −4." },
    { t: "opcion", p: "¿Cuál es el resultado de (5a − 2b) − (3a − 4b)?", o: ["2a + 2b", "2a − 6b", "2a − 2b", "8a − 6b"], r: 0,
      e: "5a − 2b − 3a + 4b = 2a + 2b. Si solo se cambia el signo del 3a queda 2a − 6b, que es el error típico." },
    { t: "expresion", p: "Resolvé: (x² − 4x) − (−3x² + x − 9)", r: "4x^2 - 5x + 9", e: "x² − 4x + 3x² − x + 9. x²: 1 + 3 = 4. x: −4 − 1 = −5. Números: +9." },
    { t: "expresion", p: "Restá 3x² − 2x + 5 de 7x² + x − 1.", r: "4x^2 + 3x - 6", e: "«Restá A de B» es B − A: (7x² + x − 1) − (3x² − 2x + 5) = 7x² + x − 1 − 3x² + 2x − 5 = 4x² + 3x − 6." },
    { t: "expresion", p: "De 2ab − 3a² restá 5ab + a² − 4.", r: "-4a^2 - 3ab + 4", e: "(2ab − 3a²) − (5ab + a² − 4) = 2ab − 3a² − 5ab − a² + 4. a²: −3 − 1 = −4. ab: 2 − 5 = −3. Números: +4." },
    { t: "expresion", p: "Resolvé: (1/2x² + 3x) + (1/4x² − 5x)", r: "3/4x^2 - 2x", e: "x²: 1/2 + 1/4 = 2/4 + 1/4 = 3/4. x: 3 − 5 = −2. Resultado: 3/4x² − 2x." },
    { t: "expresion", p: "Resolvé: (2/3m − 1) − (1/6m + 1/2)", r: "1/2m - 3/2", e: "2/3m − 1 − 1/6m − 1/2. m: 2/3 − 1/6 = 4/6 − 1/6 = 3/6 = 1/2. Números: −1 − 1/2 = −3/2. Resultado: 1/2m − 3/2." },
    { t: "expresion", p: "Resolvé: (4x²y − 3xy² + xy) − (x²y + 2xy² − 5xy)", r: "3x^2y - 5xy^2 + 6xy", e: "4x²y − 3xy² + xy − x²y − 2xy² + 5xy. x²y: 4 − 1 = 3. xy²: −3 − 2 = −5. xy: 1 + 5 = 6." },
    { t: "expresion", p: "Resolvé: (3a − 2) + (a² − 4a) − (2a² − a + 3)", r: "-a^2 - 5", e: "3a − 2 + a² − 4a − 2a² + a − 3. a²: 1 − 2 = −1. a: 3 − 4 + 1 = 0. Números: −2 − 3 = −5. Resultado: −a² − 5." },
    { t: "expresion", p: "¿Qué polinomio hay que sumarle a 3x² − 2x + 1 para obtener 5x² + x − 4?", r: "2x^2 + 3x - 5", e: "Es la resta (5x² + x − 4) − (3x² − 2x + 1) = 5x² + x − 4 − 3x² + 2x − 1 = 2x² + 3x − 5. Comprobación: (3x² − 2x + 1) + (2x² + 3x − 5) = 5x² + x − 4." },
  ],
};

const multiplicacion = {
  id: "multiplicacion-polinomios",
  titulo: "Multiplicación de polinomios",
  indicadores: [
    "Resuelve multiplicaciones de un monomio por un polinomio aplicando correctamente la propiedad distributiva, las leyes de los signos y las propiedades de las potencias de igual base.",
    "Resuelve productos de dos polinomios multiplicando de forma ordenada cada término del primero por cada término del segundo, agrupando los monomios resultantes para simplificar la expresión a su mínima cantidad de términos.",
  ],
  materia: [
    { t: "h", x: "Ley de signos" },
    { t: "tabla", cab: ["Signos", "Resultado", "Ejemplo"], filas: [
      ["(+)(+)", "+", "(3)(4) = 12"], ["(−)(−)", "+", "(−3)(−4) = 12"], ["(+)(−)", "−", "(3)(−4) = −12"], ["(−)(+)", "−", "(−3)(4) = −12"],
    ] },
    { t: "h", x: "Monomio por monomio" },
    { t: "p", x: "Se multiplican los **coeficientes** (con la ley de signos) y las **letras** con la ley del producto de potencias de igual base: se suman los exponentes." },
    { t: "ej", x: "(−4a³b)(2a²b⁴) = (−4 · 2) · a^(3 + 2) · b^(1 + 4) = **−8a⁵b⁵**" },
    { t: "h", x: "Monomio por polinomio" },
    { t: "p", x: "Se usa la **propiedad distributiva**: el monomio multiplica a **cada término** del polinomio, cada uno con su signo. a(b + c − d) = ab + ac − ad." },
    { t: "ej", x: "−3x²(2x³ − 5x + 4)\n= (−3x²)(2x³) + (−3x²)(−5x) + (−3x²)(4)\n= **−6x⁵ + 15x³ − 12x²**" },
    { t: "ej", x: "2ab(3a² − ab + 4b²)\n= (2ab)(3a²) + (2ab)(−ab) + (2ab)(4b²)\n= **6a³b − 2a²b² + 8ab³**" },
    { t: "ej", x: "Dos productos y reducción: x(x + 3) − 2(x² − x)\n= x² + 3x − 2x² + 2x\n= **−x² + 5x**\nEl −2 multiplica con su signo: (−2)(x²) = −2x² y (−2)(−x) = +2x." },
    { t: "h", x: "Polinomio por polinomio" },
    { t: "p", x: "Se multiplica **cada término del primero por cada término del segundo**, en orden para no saltarse ninguno, y después se **reducen los términos semejantes**. Un binomio por un binomio da 4 productos; un binomio por un trinomio, 6; un trinomio por un trinomio, 9." },
    { t: "ej", x: "(x + 4)(x − 3)\n= x · x + x · (−3) + 4 · x + 4 · (−3)\n= x² − 3x + 4x − 12\n= **x² + x − 12**" },
    { t: "ej", x: "(2a − 5)(3a² + a − 4)\n= 6a³ + 2a² − 8a − 15a² − 5a + 20\na²: 2 − 15 = −13 · a: −8 − 5 = −13\n= **6a³ − 13a² − 13a + 20**" },
    { t: "ej", x: "Un binomio al cuadrado también es un producto: (x + 3)² = (x + 3)(x + 3) = x² + 3x + 3x + 9 = **x² + 6x + 9**" },
    { t: "p", x: "**Cómo comprobar**: dale a la letra un valor fácil (por ejemplo x = 2) en el ejercicio y en tu resultado: tienen que dar el mismo número. En (x + 4)(x − 3) con x = 2: 6 · (−1) = −6. En x² + x − 12 con x = 2: 4 + 2 − 12 = −6. Coinciden." },
    { t: "ojo", x: "(x + 3)² **no** es x² + 9: faltan los productos del medio (6x).\nx · x = x², no 2x. 3x · 2x = 6x², no 6x.\nNo te olvidés de multiplicar el **último** término ni de llevar el signo de cada término: en (x − 5)(x + 2), el −5 multiplica con su menos." },
    ...BLOQUES_ESCRIBIR,
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Multiplicación de polinomios» y la fecha. Copiá la ley de signos y los ejemplos de monomio por polinomio y de polinomio por polinomio, dibujando con color una flecha por cada producto." },
    { tipo: "resumir", x: "En 5 líneas, explicá cómo se multiplica un polinomio por otro, cuántos productos salen antes de reducir y cómo se comprueba el resultado dándole un valor a la letra." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase 4 multiplicaciones de polinomios resueltas (2 de monomio por polinomio y 2 de polinomio por polinomio). Rehacelas sin mirar y comprobá cada una dándole un valor a la letra." },
    { tipo: "moverse", x: "Pegá en la pared una hoja grande con (3x − 2)(x² + 2x − 5). De pie, con un marcador, dibujá una flecha por cada producto y decí cada uno en voz alta antes de escribirlo («3x por x² da 3x³…»). Al final reducí y escribí el resultado grande. Comprobalo con x = 1: el ejercicio da (1)(−2) = −2, y tu resultado tiene que dar lo mismo." },
    { tipo: "escribir", x: "Resolvé 10 multiplicaciones inventadas por vos: 5 de monomio por polinomio y 5 de polinomio por polinomio (al menos 2 de binomio por trinomio). Comprobá cada una con x = 2." },
  ],
  practica: [
    LECT_ALG,
    { t: "expresion", p: "Resolvé y simplificá: 4x(3x − 5)", r: "12x^2 - 20x", e: "4x · 3x = 12x²; 4x · (−5) = −20x. Resultado: 12x² − 20x." },
    { t: "expresion", p: "Resolvé y simplificá: −2a(a² − 3a + 4)", r: "-2a^3 + 6a^2 - 8a", e: "(−2a)(a²) = −2a³; (−2a)(−3a) = +6a²; (−2a)(4) = −8a." },
    { t: "opcion", p: "¿Cuál es el resultado de −3x(2x − 4)?", o: ["−6x² + 12x", "−6x² − 12x", "6x² − 12x", "−6x² − 4"], r: 0,
      e: "(−3x)(2x) = −6x²; (−3x)(−4) = +12x, porque menos por menos da más." },
    { t: "expresion", p: "Resolvé y simplificá: 3x²y(2x − 5y + xy)", r: "6x^3y - 15x^2y^2 + 3x^3y^2", e: "3x²y · 2x = 6x³y; 3x²y · (−5y) = −15x²y²; 3x²y · xy = 3x³y². Los tres tienen distinta parte literal: no se reducen." },
    { t: "expresion", p: "Resolvé y simplificá: −5m³(−2m² + m − 1)", r: "10m^5 - 5m^4 + 5m^3", e: "(−5m³)(−2m²) = 10m⁵; (−5m³)(m) = −5m⁴; (−5m³)(−1) = 5m³." },
    { t: "expresion", p: "Resolvé y simplificá: 1/2x(4x² − 6x + 2)", r: "2x^3 - 3x^2 + x", e: "1/2x · 4x² = 2x³; 1/2x · (−6x) = −3x²; 1/2x · 2 = x." },
    { t: "expresion", p: "Resolvé y simplificá: 2x(x − 3) − x(x + 5)", r: "x^2 - 11x", e: "2x² − 6x − x² − 5x (el −x multiplica con su signo). x²: 2 − 1 = 1. x: −6 − 5 = −11." },
    { t: "expresion", p: "Resolvé y simplificá: (x + 5)(x + 2)", r: "x^2 + 7x + 10", e: "x² + 2x + 5x + 10 = x² + 7x + 10." },
    { t: "expresion", p: "Resolvé y simplificá: (a − 6)(a + 4)", r: "a^2 - 2a - 24", e: "a² + 4a − 6a − 24 = a² − 2a − 24." },
    { t: "vf", p: "(x + 4)² = x² + 16", r: false, e: "Falso: (x + 4)(x + 4) = x² + 4x + 4x + 16 = x² + 8x + 16. Faltan los productos del medio." },
    { t: "expresion", p: "Resolvé y simplificá: (3x − 2)(2x + 5)", r: "6x^2 + 11x - 10", e: "6x² + 15x − 4x − 10 = 6x² + 11x − 10." },
    { t: "expresion", p: "Resolvé y simplificá: (2m − 3)²", r: "4m^2 - 12m + 9", e: "(2m − 3)(2m − 3) = 4m² − 6m − 6m + 9 = 4m² − 12m + 9." },
    { t: "expresion", p: "Resolvé y simplificá: (2a − b)(3a + 4b)", r: "6a^2 + 5ab - 4b^2", e: "6a² + 8ab − 3ab − 4b² = 6a² + 5ab − 4b²." },
    { t: "numero", p: "Al multiplicar (x + 1)(x² + x + 1), ¿cuántos productos se obtienen antes de reducir términos semejantes?", r: 6, e: "Cada uno de los 2 términos del binomio multiplica a cada uno de los 3 del trinomio: 2 · 3 = 6 productos." },
    { t: "expresion", p: "Resolvé y simplificá: (x + 2)(x² − 3x + 1)", r: "x^3 - x^2 - 5x + 2", e: "x³ − 3x² + x + 2x² − 6x + 2. x²: −3 + 2 = −1. x: 1 − 6 = −5. Resultado: x³ − x² − 5x + 2." },
    { t: "opcion", p: "Alguien resolvió (x − 3)(x + 7) = x² − 21. ¿Qué error cometió?", o: ["Le faltaron los productos x · 7 y −3 · x, que juntos dan 4x", "Se equivocó en el signo: era x² + 21", "Tenía que dar x² − 4x − 21", "No cometió ningún error"], r: 0,
      e: "(x − 3)(x + 7) = x² + 7x − 3x − 21 = x² + 4x − 21. Multiplicó solo los primeros entre sí y los últimos entre sí." },
    { t: "expresion", p: "Resolvé y simplificá: (x² − 2)(x² + 3x − 4)", r: "x^4 + 3x^3 - 6x^2 - 6x + 8", e: "x⁴ + 3x³ − 4x² − 2x² − 6x + 8. x²: −4 − 2 = −6. Resultado: x⁴ + 3x³ − 6x² − 6x + 8." },
    { t: "expresion", p: "Resolvé y simplificá: (x − 1)(x + 1)(x + 2)", r: "x^3 + 2x^2 - x - 2", e: "Primero (x − 1)(x + 1) = x² + x − x − 1 = x² − 1. Después (x² − 1)(x + 2) = x³ + 2x² − x − 2." },
    { t: "expresion", p: "Resolvé y simplificá: (3x − 1)(x + 2) − (x − 4)(x + 4)", r: "2x^2 + 5x + 14", e: "(3x − 1)(x + 2) = 3x² + 5x − 2. (x − 4)(x + 4) = x² − 16. Restando: 3x² + 5x − 2 − x² + 16 = 2x² + 5x + 14." },
  ],
};

const problemasPolinomios = {
  id: "problemas-polinomios",
  titulo: "Problemas con operaciones de polinomios",
  indicadores: ["Resuelve problemas prácticos o geométricos calculando relaciones lógicas a partir de enunciados que involucran operaciones combinadas de polinomios."],
  materia: [
    { t: "h", x: "Cómo atacar un problema con polinomios" },
    { t: "lista", x: [
      "**Leé dos veces** y hacé un dibujo con las medidas.",
      "**Decidí la operación**: perímetro = suma de todos los lados; área = producto; «cuánto más», «diferencia» o «lo que queda» = resta; «el doble», «el triple» = multiplicar por 2 o por 3.",
      "**Escribí la expresión con paréntesis** antes de operar, por ejemplo P = 2(2x + 3) + 2(x − 1).",
      "**Resolvé y simplificá al máximo.**",
      "Si te dan el valor de x, **sustituí al final** en la expresión ya simplificada y comprobá con las medidas originales.",
    ] },
    { t: "tabla", cab: ["Figura o situación", "Expresión"], filas: [
      ["Perímetro de un rectángulo de largo L y ancho A", "2L + 2A"],
      ["Área de un rectángulo", "L · A"],
      ["Área de un cuadrado de lado l", "l · l = l²"],
      ["Área de un triángulo de base b y altura h", "b · h ÷ 2"],
      ["Perímetro de un polígono regular de n lados", "n · l"],
      ["Volumen de una caja (prisma rectangular)", "largo · ancho · alto"],
      ["Área de una figura con un recorte", "área grande − área del recorte"],
    ] },
    { t: "ej", x: "Un rectángulo mide (2x + 3) cm de largo y (x − 1) cm de ancho.\nPerímetro: 2(2x + 3) + 2(x − 1) = 4x + 6 + 2x − 2 = **6x + 4** cm.\nÁrea: (2x + 3)(x − 1) = 2x² − 2x + 3x − 3 = **2x² + x − 3** cm².\nSi x = 5: perímetro 6 · 5 + 4 = 34 cm y área 2 · 25 + 5 − 3 = 52 cm². Comprobación con los lados (13 cm y 4 cm): 13 + 13 + 4 + 4 = 34 y 13 · 4 = 52." },
    { t: "svg", x: recorte("x + 4", "x + 2", "x"), alt: "Rectángulo sombreado de (x + 4) de largo por (x + 2) de ancho. En la esquina de arriba a la izquierda tiene un recorte en blanco: un cuadrado de lado x." },
    { t: "ej", x: "Figura con recorte (la de arriba): área que queda = área del rectángulo − área del cuadrado\n= (x + 4)(x + 2) − x²\n= x² + 2x + 4x + 8 − x²\n= **6x + 8**" },
    { t: "ej", x: "Un triángulo tiene base 4x y altura (x + 6). Área: 4x(x + 6) ÷ 2 = (4x² + 24x) ÷ 2 = **2x² + 12x**. Al dividir entre 2 se divide cada término." },
    { t: "ej", x: "Dinero: una camisa cuesta (3x + 500) colones y un pantalón (5x − 200). Por 2 camisas y 1 pantalón se paga\n2(3x + 500) + (5x − 200) = 6x + 1 000 + 5x − 200 = **11x + 800** colones." },
    { t: "ej", x: "Diferencia: ¿cuánto más mide el perímetro de un cuadrado de lado (2x + 1) que el de un triángulo equilátero de lado (x + 3)?\n4(2x + 1) − 3(x + 3) = 8x + 4 − 3x − 9 = **5x − 5**" },
    { t: "ej", x: "Caja: mide x de largo, (x + 2) de ancho y 5 de alto. Volumen: x · (x + 2) · 5 = 5x(x + 2) = **5x² + 10x**." },
    { t: "ojo", x: "En el perímetro de un rectángulo hay **dos** largos y **dos** anchos.\nEl área se multiplica, no se suma.\nAl restar un área, el menos cambia **todos** los términos: −(x² + 6x + 9) = −x² − 6x − 9.\nUnidades: perímetro en cm, área en cm², volumen en cm³." },
    ...BLOQUES_ESCRIBIR,
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Problemas con polinomios» y la fecha. Copiá la tabla de figuras y los ejemplos del rectángulo y del recorte, con sus dibujos y sus medidas." },
    { tipo: "resumir", x: "En 4 líneas, explicá cómo sabés si un problema pide sumar, restar o multiplicar polinomios, con una palabra clave de cada caso." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase o en tus prácticas un problema de perímetro o área con polinomios. Copialo, resolvelo de nuevo y comprobá el resultado dándole un valor a x." },
    { tipo: "moverse", x: "Con cinta adhesiva o hilo, marcá en el piso un rectángulo grande y poné en cada lado un papelito con su medida: (x + 6) en los largos y (x + 2) en los anchos. Caminá por el borde diciendo en voz alta cada lado para armar el perímetro. Después escribí en el cuaderno el perímetro y el área simplificados y calculalos con x = 4 (te tienen que dar 32 y 60)." },
    { tipo: "escribir", x: "Inventá 3 problemas con polinomios: uno de perímetro, uno de área y uno de dinero. Resolvelos completos y comprobá cada uno con un valor de x." },
  ],
  practica: [
    LECT_ALG,
    { t: "expresion", p: "Un rectángulo mide (3x + 2) cm de largo y (x + 4) cm de ancho. Escribí su perímetro simplificado.", r: "8x + 12", e: "2(3x + 2) + 2(x + 4) = 6x + 4 + 2x + 8 = 8x + 12." },
    { t: "expresion", p: "Un terreno rectangular mide (3x + 2) m de largo y (x + 4) m de ancho. Escribí su área simplificada.", r: "3x^2 + 14x + 8", e: "(3x + 2)(x + 4) = 3x² + 12x + 2x + 8 = 3x² + 14x + 8." },
    { t: "expresion", p: "Los lados de un triángulo miden (2a + 1) cm, (3a − 4) cm y (a + 5) cm. Escribí su perímetro.", r: "6a + 2", e: "(2a + 1) + (3a − 4) + (a + 5). a: 2 + 3 + 1 = 6. Números: 1 − 4 + 5 = 2. Resultado: 6a + 2." },
    { t: "opcion", p: "¿Qué expresión es el perímetro de un rectángulo de (4x − 1) cm de largo y (x + 3) cm de ancho?", o: ["10x + 4", "5x + 2", "4x² + 11x − 3", "10x + 2"], r: 0,
      e: "2(4x − 1) + 2(x + 3) = 8x − 2 + 2x + 6 = 10x + 4. 5x + 2 suma solo un largo y un ancho; 4x² + 11x − 3 es el área." },
    { t: "expresion", p: "Un cuadrado tiene (2y − 3) cm de lado. Escribí su área.", r: "4y^2 - 12y + 9", e: "(2y − 3)(2y − 3) = 4y² − 6y − 6y + 9 = 4y² − 12y + 9." },
    { t: "expresion", p: "Un hexágono regular tiene (x² + 2x − 1) cm de lado. Escribí su perímetro.", r: "6x^2 + 12x - 6", e: "6(x² + 2x − 1) = 6x² + 12x − 6." },
    { t: "expresion", p: "Un triángulo tiene 6x cm de base y (2x − 4) cm de altura. Escribí su área.", r: "6x^2 - 12x", e: "6x(2x − 4) ÷ 2 = (12x² − 24x) ÷ 2 = 6x² − 12x." },
    { t: "expresion", fig: recorte("x + 5", "x + 3", "x"), p: "La figura es un rectángulo de (x + 5) cm por (x + 3) cm al que se le recortó un cuadrado de x cm de lado. Escribí el área de la parte sombreada.", r: "8x + 15",
      e: "(x + 5)(x + 3) − x² = x² + 3x + 5x + 15 − x² = 8x + 15." },
    { t: "expresion", p: "Un cuaderno cuesta (2x + 150) colones y un lapicero (x − 50) colones. Se compran 3 cuadernos y 4 lapiceros. Escribí el total que se paga.", r: "10x + 250", e: "3(2x + 150) + 4(x − 50) = 6x + 450 + 4x − 200 = 10x + 250." },
    { t: "expresion", p: "El largo de un rectángulo es (x + 7) cm y el ancho mide 2 cm menos que el largo. Escribí su área.", r: "x^2 + 12x + 35", e: "Ancho: (x + 7) − 2 = x + 5. Área: (x + 7)(x + 5) = x² + 5x + 7x + 35 = x² + 12x + 35." },
    { t: "expresion", p: "¿Cuánto más mide el perímetro de un cuadrado de lado (3x + 1) que el de un triángulo equilátero de lado (2x + 1)?", r: "6x + 1", e: "4(3x + 1) − 3(2x + 1) = 12x + 4 − 6x − 3 = 6x + 1." },
    { t: "expresion", p: "Una caja con forma de prisma rectangular mide x cm de largo, (x − 2) cm de ancho y 3 cm de alto. Escribí su volumen.", r: "3x^2 - 6x", e: "x · (x − 2) · 3 = 3x(x − 2) = 3x² − 6x." },
    { t: "expresion", p: "Un cuadro rectangular mide (2x + 4) cm por (x + 4) cm y adentro tiene una foto de 2x cm por x cm; el resto es marco. Escribí el área del marco.", r: "12x + 16",
      e: "(2x + 4)(x + 4) − 2x · x = 2x² + 8x + 4x + 16 − 2x² = 12x + 16." },
    { t: "expresion", p: "Un jardín cuadrado de (x + 3) m de lado se agranda: el largo aumenta 2 m y el ancho 1 m. ¿Cuánto aumenta el área?", r: "3x + 11",
      e: "Área nueva: (x + 5)(x + 4) = x² + 9x + 20. Área vieja: (x + 3)² = x² + 6x + 9. Aumento: x² + 9x + 20 − x² − 6x − 9 = 3x + 11." },
    { t: "numero", p: "Un rectángulo mide (x + 3) cm de largo y (x − 1) cm de ancho. ¿Cuántos centímetros cuadrados mide su área si x = 7?", r: 60, e: "Los lados miden 7 + 3 = 10 cm y 7 − 1 = 6 cm. Área: 10 · 6 = 60 cm² (con x² + 2x − 3: 49 + 14 − 3 = 60)." },
    { t: "numero", p: "El perímetro de un triángulo equilátero es (6x − 3) cm. Si x = 4, ¿cuánto mide cada lado, en centímetros?", r: 7, e: "Perímetro: 6 · 4 − 3 = 21 cm. Los tres lados son iguales: 21 ÷ 3 = 7 cm." },
    { t: "abierta", p: "En el cuaderno: un terreno rectangular mide (x + 4) m de largo y (2x − 1) m de ancho. a) Escribí su perímetro simplificado. b) Escribí su área simplificada. c) Calculá el perímetro y el área si x = 6 y comprobá con las medidas del terreno.",
      guia: [
        "Plantea el perímetro con paréntesis: 2(x + 4) + 2(2x − 1).",
        "Simplifica bien el perímetro: 6x + 6.",
        "Plantea y simplifica bien el área: (x + 4)(2x − 1) = 2x² + 7x − 4.",
        "Con x = 6 obtiene perímetro 42 m y área 110 m², y lo comprueba con los lados de 10 m y 11 m.",
      ],
      modelo: "a) P = 2(x + 4) + 2(2x − 1) = 2x + 8 + 4x − 2 = 6x + 6. b) A = (x + 4)(2x − 1) = 2x² − x + 8x − 4 = 2x² + 7x − 4. c) Con x = 6: P = 6 · 6 + 6 = 42 m y A = 2 · 36 + 7 · 6 − 4 = 110 m². Comprobación: los lados miden 6 + 4 = 10 m y 2 · 6 − 1 = 11 m; 10 + 10 + 11 + 11 = 42 y 10 · 11 = 110." },
  ],
};

const ecuaciones = {
  id: "ecuaciones",
  titulo: "Ecuaciones de primer grado",
  indicadores: ["Despeja la incógnita en ecuaciones lineales de una sola variable eliminando signos de agrupación, reduciendo términos y aplicando operaciones inversas (propiedades de la igualdad) hasta hallar su valor."],
  materia: [
    { t: "h", x: "Qué es una ecuación" },
    { t: "p", x: "Una **ecuación** es una igualdad con una letra desconocida, la **incógnita**. **Resolver** la ecuación es encontrar el valor de la incógnita que hace verdadera la igualdad: ese valor es la **solución**. En 2x + 3 = 11 la solución es x = 4, porque 2 · 4 + 3 = 11." },
    { t: "h", x: "Propiedades de la igualdad" },
    { t: "lista", x: [
      "Se puede **sumar o restar** el mismo número (o la misma expresión) a los dos lados.",
      "Se puede **multiplicar o dividir** los dos lados por el mismo número, si no es cero.",
      "En la práctica se dice que un término «pasa al otro lado» con la **operación inversa**: lo que suma pasa restando, lo que resta pasa sumando, lo que multiplica pasa dividiendo (**con su signo**) y lo que divide pasa multiplicando.",
    ] },
    { t: "tabla", cab: ["Paso", "Qué se hace"], filas: [
      ["1", "Quitar los signos de agrupación (paréntesis, corchetes) con la propiedad distributiva, cuidando los signos."],
      ["2", "Si hay fracciones, multiplicar **todos** los términos por el mínimo común múltiplo de los denominadores."],
      ["3", "Pasar los términos con x a un lado y los números al otro."],
      ["4", "Reducir términos semejantes en cada lado."],
      ["5", "Despejar: dividir entre el coeficiente de x, con su signo."],
      ["6", "Comprobar: sustituir la solución en la ecuación original."],
    ] },
    { t: "ej", x: "3x − 7 = 11\n3x = 11 + 7\n3x = 18\nx = 18 ÷ 3 → **x = 6**\nComprobación: 3 · 6 − 7 = 18 − 7 = 11. Correcto." },
    { t: "ej", x: "Con x en los dos lados: 5x + 4 = 2x − 11\n5x − 2x = −11 − 4\n3x = −15 → **x = −5**\nComprobación: 5(−5) + 4 = −21 y 2(−5) − 11 = −21." },
    { t: "ej", x: "Con paréntesis: 3(x − 2) − 2(x + 1) = 4\n3x − 6 − 2x − 2 = 4\nx − 8 = 4 → **x = 12**\nEl −2 multiplica con su signo: (−2)(x) = −2x y (−2)(1) = −2." },
    { t: "ej", x: "Con un menos delante del paréntesis: 4 − (2x − 5) = 3x − 1\n4 − 2x + 5 = 3x − 1\n9 − 2x = 3x − 1\n9 + 1 = 3x + 2x\n10 = 5x → **x = 2**" },
    { t: "ej", x: "Con fracciones: x/2 + x/3 = 10. El mcm de 2 y 3 es 6; se multiplica todo por 6:\n3x + 2x = 60\n5x = 60 → **x = 12**" },
    { t: "ej", x: "Fracciones con paréntesis: (x − 1)/4 = (x + 2)/6. El mcm de 4 y 6 es 12:\n3(x − 1) = 2(x + 2)\n3x − 3 = 2x + 4 → **x = 7**" },
    { t: "ej", x: "Solución que no es entera: 4x + 3 = 2x − 2\n2x = −5 → **x = −5/2** (también se escribe −2,5)." },
    { t: "ojo", x: "−3x = 12 da x = 12 ÷ (−3) = **−4**: el −3 pasa dividiendo con su signo, no «restando».\n2x = 9 da x = 9/2, no 7: el 2 multiplica, no suma.\n−(x − 5) es −x + 5.\nAl multiplicar por el mcm se multiplican **todos** los términos, también los que no tienen denominador: en x/3 + 2 = 5, por 3 queda x + 6 = 15." },
    { t: "h", x: "Cómo vas a escribir las respuestas en la página" },
    { t: "p", x: "La solución, sola: x = 3, 3, −5/2 o −2,5. Las fracciones, simplificadas." },
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Ecuaciones de primer grado» y la fecha. Copiá la tabla de pasos y todos los ejemplos resueltos, cada uno con su comprobación." },
    { tipo: "resumir", x: "En 5 líneas, explicá qué significa «pasar al otro lado» con la operación inversa y por qué es lo mismo que aplicar las propiedades de la igualdad. Incluí el caso del coeficiente negativo (−3x = 12)." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase 4 ecuaciones resueltas, al menos una con paréntesis y una con fracciones. Resolvelas otra vez sin mirar y hacé la comprobación de cada una, aunque en clase no se haya hecho." },
    { tipo: "moverse", x: "Dibujá en una cartulina grande una balanza con dos platos y pegala en la pared. Escribí en papelitos los términos de 3x + 5 = x + 13 y pegalos en cada plato. De pie, resolvela moviendo papelitos: cada vez que quitás algo de un plato, quitá lo mismo del otro, y decí en voz alta lo que hacés. Anotá cada paso en el cuaderno." },
    { tipo: "escribir", x: "Resolvé 10 ecuaciones inventadas por vos: 3 sencillas, 3 con paréntesis, 2 con fracciones y 2 con solución negativa o fraccionaria. Comprobá cada una." },
  ],
  practica: [
    LECT_NUM,
    { t: "numero", p: "Resolvé: 2x + 9 = 21", r: 6, e: "2x = 21 − 9 = 12; x = 12 ÷ 2 = 6. Comprobación: 2 · 6 + 9 = 21." },
    { t: "numero", p: "Resolvé: 7 − 3x = 22", r: -5, e: "−3x = 22 − 7 = 15; x = 15 ÷ (−3) = −5. Comprobación: 7 − 3(−5) = 7 + 15 = 22." },
    { t: "numero", p: "Resolvé: 5x − 8 = 3x + 6", r: 7, e: "5x − 3x = 6 + 8; 2x = 14; x = 7." },
    { t: "vf", p: "x = −2 es solución de 3x + 4 = x.", r: true, e: "Verdadero: 3(−2) + 4 = −6 + 4 = −2, que es igual a x = −2." },
    { t: "opcion", p: "Para despejar x en −4x = 20, ¿qué se hace?", o: ["Se dividen los dos lados entre −4, y x = −5", "Se suma 4 a los dos lados, y x = 24", "Se dividen los dos lados entre 4, y x = 5", "Se resta 4 a los dos lados, y x = 16"], r: 0,
      e: "El −4 multiplica a x, así que se divide entre −4 con su signo: x = 20 ÷ (−4) = −5." },
    { t: "numero", p: "Resolvé: 4(x − 3) = 2x + 6", r: 9, e: "4x − 12 = 2x + 6; 4x − 2x = 6 + 12; 2x = 18; x = 9." },
    { t: "numero", p: "Resolvé: 2(3x + 1) − 5(x − 2) = 15", r: 3, e: "6x + 2 − 5x + 10 = 15 (el −5 por −2 da +10); x + 12 = 15; x = 3." },
    { t: "numero", p: "Resolvé: 10 − (x + 4) = 3x − 2", r: 2, e: "10 − x − 4 = 3x − 2; 6 − x = 3x − 2; 6 + 2 = 3x + x; 8 = 4x; x = 2." },
    { t: "numero", p: "Resolvé: 6x + 5 = 2x − 1", r: "-3/2", e: "6x − 2x = −1 − 5; 4x = −6; x = −6/4 = −3/2 (−1,5)." },
    { t: "numero", p: "Resolvé: x/3 + 4 = 10", r: 18, e: "x/3 = 6; x = 6 · 3 = 18. (O multiplicando todo por 3: x + 12 = 30.)" },
    { t: "ordenar", p: "Ordená los pasos para resolver 3(x − 2) = x + 4.", x: ["3x − 6 = x + 4", "3x − x = 4 + 6", "2x = 10", "x = 5"],
      e: "Primero se quita el paréntesis, después se pasan las x a un lado y los números al otro, se reduce y se divide entre 2." },
    { t: "numero", p: "Resolvé: x/2 − x/5 = 6", r: 20, e: "El mcm de 2 y 5 es 10: 5x − 2x = 60; 3x = 60; x = 20." },
    { t: "numero", p: "Resolvé: (x + 3)/4 = (x − 1)/2", r: 5, e: "Por 4 los dos lados: x + 3 = 2(x − 1); x + 3 = 2x − 2; 3 + 2 = 2x − x; x = 5." },
    { t: "numero", p: "Resolvé: 3x/4 − 1 = x/2 + 2", r: 12, e: "Por 4 todos los términos: 3x − 4 = 2x + 8; 3x − 2x = 8 + 4; x = 12." },
    { t: "numero", p: "Resolvé: 0,5x + 1,2 = 0,3x + 2", r: 4, e: "0,5x − 0,3x = 2 − 1,2; 0,2x = 0,8; x = 0,8 ÷ 0,2 = 4." },
    { t: "numero", p: "Resolvé: −2(x + 5) = 3(1 − x) − 4", r: 9, e: "−2x − 10 = 3 − 3x − 4; −2x − 10 = −3x − 1; −2x + 3x = −1 + 10; x = 9." },
    { t: "numero", p: "Resolvé: 5 − 2(3 − x) = 4(x − 2) − 3x", r: -7, e: "5 − 6 + 2x = 4x − 8 − 3x; 2x − 1 = x − 8; 2x − x = −8 + 1; x = −7." },
    { t: "numero", p: "Resolvé: 3x − [2 − (x − 4)] = 18", r: 6, e: "Primero el paréntesis de adentro: 2 − (x − 4) = 2 − x + 4 = 6 − x. Después 3x − (6 − x) = 3x − 6 + x = 4x − 6. Entonces 4x − 6 = 18; 4x = 24; x = 6." },
    { t: "numero", p: "Resolvé: (2x − 1)/3 − (x + 2)/4 = 1", r: "22/5", e: "El mcm es 12: 4(2x − 1) − 3(x + 2) = 12; 8x − 4 − 3x − 6 = 12; 5x − 10 = 12; 5x = 22; x = 22/5 (4,4)." },
  ],
};

const plantearEcuaciones = {
  id: "plantear-ecuaciones",
  titulo: "Plantear y resolver ecuaciones a partir de un enunciado",
  indicadores: ["Representa enunciados textuales o problemas en lenguaje natural al lenguaje matemático y algebraico estructurado, formulando la ecuación de primer grado correspondiente."],
  materia: [
    { t: "h", x: "Del lenguaje común al lenguaje algebraico" },
    { t: "tabla", cab: ["En palabras", "En símbolos (x = el número)"], filas: [
      ["Un número", "x"],
      ["El doble, el triple, el cuádruple de un número", "2x; 3x; 4x"],
      ["La mitad, la tercera parte, la cuarta parte", "x/2; x/3; x/4"],
      ["Un número aumentado en 5 (o más 5)", "x + 5"],
      ["Un número disminuido en 4 (o menos 4)", "x − 4"],
      ["4 menos que un número", "x − 4"],
      ["Si al doble de un número se le suman 3", "2x + 3"],
      ["El doble de la suma de un número y 3", "2(x + 3)"],
      ["El cuadrado de un número", "x²"],
      ["Dos números consecutivos", "x y x + 1"],
      ["Dos pares (o dos impares) consecutivos", "x y x + 2"],
      ["La edad dentro de 5 años; hace 3 años", "x + 5; x − 3"],
      ["Un número excede a otro en 7", "el menor es x y el mayor x + 7"],
      ["Es, da, se obtiene, resulta, equivale a", "="],
    ] },
    { t: "h", x: "Pasos para resolver un problema" },
    { t: "lista", x: [
      "**Leé** el problema completo dos veces y subrayá lo que se pregunta.",
      "**Definí la incógnita** por escrito: «x = edad de la hermana».",
      "**Escribí las demás cantidades** usando x: «edad de Luis = 3x».",
      "**Planteá la ecuación** traduciendo la frase que tiene el «es igual»: x + 3x = 48.",
      "**Resolvé** la ecuación.",
      "**Contestá la pregunta** con una oración y unidades: a veces lo que se pregunta no es x, sino otra cantidad.",
      "**Comprobá** con el enunciado, no solo con la ecuación.",
    ] },
    { t: "ej", x: "La suma de tres números consecutivos es 84. ¿Cuáles son?\nx = el menor; los otros son x + 1 y x + 2.\nx + (x + 1) + (x + 2) = 84 → 3x + 3 = 84 → 3x = 81 → x = 27\n**Respuesta: 27, 28 y 29.** Comprobación: 27 + 28 + 29 = 84." },
    { t: "ej", x: "Luis tiene el triple de la edad de su hermana y entre los dos suman 48 años.\nx = edad de la hermana; Luis = 3x.\nx + 3x = 48 → 4x = 48 → x = 12\n**La hermana tiene 12 años y Luis 36.** Comprobación: 36 es el triple de 12 y 12 + 36 = 48." },
    { t: "ej", x: "El largo de un rectángulo mide 5 cm más que el ancho y el perímetro es 54 cm.\nx = ancho; largo = x + 5.\n2x + 2(x + 5) = 54 → 4x + 10 = 54 → 4x = 44 → x = 11\n**El ancho mide 11 cm y el largo 16 cm.** Comprobación: 2 · 11 + 2 · 16 = 22 + 32 = 54." },
    { t: "ej", x: "Se pagaron ₡7 500 por 3 cuadernos iguales y un lapicero de ₡900.\nx = precio de un cuaderno.\n3x + 900 = 7 500 → 3x = 6 600 → x = 2 200\n**Cada cuaderno cuesta ₡2 200.** Comprobación: 3 · 2 200 + 900 = 7 500." },
    { t: "ej", x: "Edades en el tiempo: dentro de 6 años, la edad de Ana será el doble de la que tenía hace 3 años.\nx = edad de Ana hoy; dentro de 6 años: x + 6; hace 3 años: x − 3.\nx + 6 = 2(x − 3) → x + 6 = 2x − 6 → 6 + 6 = 2x − x → x = 12\n**Ana tiene 12 años.** Comprobación: dentro de 6 años tendrá 18, el doble de 9, que es la edad que tenía hace 3 años." },
    { t: "ojo", x: "«4 menos que un número» es x − 4, **no** 4 − x.\n«Si al doble de un número se le suman 3» es 2x + 3, pero «el doble de la suma de un número y 3» es 2(x + 3).\nNo contestés solo «x = 27» si la pregunta pide los tres números o el mayor. Escribí siempre qué representa x." },
    { t: "h", x: "Cómo vas a escribir las respuestas en la página" },
    { t: "p", x: "Si se pide la ecuación, elegís la correcta entre las opciones. Si se pide un número, escribí solo el número, sin unidades, sin ₡ y sin puntos de miles." },
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Plantear ecuaciones» y la fecha. Copiá completa la tabla de traducciones y los pasos para resolver un problema." },
    { tipo: "resumir", x: "En 5 líneas, explicá por qué hay que definir la incógnita por escrito y comprobar con el enunciado, usando como ejemplo el problema del rectángulo de la materia." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase 3 problemas que se resolvieron con ecuaciones. Para cada uno escribí: qué es x, la ecuación, la solución y la comprobación con el enunciado." },
    { tipo: "moverse", x: "Escribí en 10 papelitos frases como «el triple de un número», «un número disminuido en 8», «dos pares consecutivos», «la edad hace 4 años»… y en otros 10 papelitos su traducción con x. Mezclalos, pegá las frases en una pared y las traducciones en otra. Caminá de una pared a la otra formando las parejas y decí cada una en voz alta." },
    { tipo: "escribir", x: "Inventá 4 problemas: uno de números consecutivos, uno de edades, uno de un rectángulo y uno de dinero en colones. Para cada uno escribí qué es x, la ecuación, la solución, la respuesta en una oración y la comprobación." },
  ],
  practica: [
    LECT_NUM,
    { t: "opcion", p: "«Si al triple de un número se le restan 7, se obtiene 20.» ¿Qué ecuación representa la frase?", o: ["3x − 7 = 20", "3(x − 7) = 20", "7 − 3x = 20", "x/3 − 7 = 20"], r: 0,
      e: "Primero se saca el triple (3x) y a eso se le restan 7: 3x − 7. «Se obtiene» es el igual." },
    { t: "opcion", p: "«Si a la mitad de un número se le suman 5, el resultado es 12.» ¿Qué ecuación la representa?", o: ["x/2 + 5 = 12", "(x + 5)/2 = 12", "2x + 5 = 12", "x/2 = 12 + 5"], r: 0,
      e: "La mitad del número es x/2; se le suman 5: x/2 + 5 = 12. (x + 5)/2 sería la mitad de la suma." },
    { t: "opcion", p: "«La suma de dos números consecutivos es 45.» Si x es el menor, ¿qué ecuación la representa?", o: ["x + (x + 1) = 45", "x + 2x = 45", "x + (x + 2) = 45", "x(x + 1) = 45"], r: 0,
      e: "El consecutivo de x es x + 1, y «suma» pide sumarlos: x + (x + 1) = 45. Con x + 2 serían pares o impares consecutivos." },
    { t: "opcion", p: "«Un número excede en 8 a otro y entre los dos suman 50.» Si x es el número menor, ¿qué ecuación la representa?", o: ["x + (x + 8) = 50", "x + 8x = 50", "x(x + 8) = 50", "x + 8 = 50"], r: 0,
      e: "Si el menor es x, el mayor tiene 8 más: x + 8. Sumados: x + (x + 8) = 50." },
    { t: "opcion", p: "El lado de un cuadrado mide (x + 2) cm y su perímetro es 36 cm. ¿Qué ecuación representa la situación?", o: ["4(x + 2) = 36", "4x + 2 = 36", "(x + 2)² = 36", "2(x + 2) = 36"], r: 0,
      e: "El perímetro de un cuadrado son 4 lados: 4(x + 2) = 36. (x + 2)² sería el área." },
    { t: "opcion", p: "Pedro tenía x colones. Gastó la tercera parte en pasajes y ₡1 500 en el almuerzo, y le quedaron ₡3 500. ¿Qué ecuación representa la situación?", o: ["x − x/3 − 1 500 = 3 500", "x/3 + 1 500 = 3 500", "x − 3x − 1 500 = 3 500", "x − x/3 + 1 500 = 3 500"], r: 0,
      e: "A lo que tenía (x) se le resta lo que gastó (x/3 y 1 500) y queda 3 500: x − x/3 − 1 500 = 3 500. La tercera parte es x/3, no 3x." },
    { t: "numero", p: "Si al doble de un número se le suman 9, se obtiene 35. ¿Cuál es el número?", r: 13, e: "2x + 9 = 35; 2x = 26; x = 13. Comprobación: 2 · 13 + 9 = 35." },
    { t: "numero", p: "La suma de tres números consecutivos es 99. ¿Cuál es el mayor de los tres?", r: 34, e: "x + (x + 1) + (x + 2) = 99; 3x + 3 = 99; x = 32. Los números son 32, 33 y 34: el mayor es 34." },
    { t: "numero", p: "Dos números pares consecutivos suman 86. ¿Cuál es el menor?", r: 42, e: "x + (x + 2) = 86; 2x = 84; x = 42. Comprobación: 42 + 44 = 86." },
    { t: "numero", p: "En una soda, 2 empanadas y un fresco cuestan ₡2 300. El fresco cuesta ₡700. ¿Cuántos colones cuesta cada empanada?", r: 800, e: "2x + 700 = 2 300; 2x = 1 600; x = 800." },
    { t: "numero", p: "En un grupo de 35 estudiantes hay 5 mujeres más que hombres. ¿Cuántos hombres hay?", r: 15, e: "x = hombres; mujeres = x + 5. x + (x + 5) = 35; 2x = 30; x = 15. Comprobación: 15 hombres y 20 mujeres, 35 en total." },
    { t: "numero", p: "Un rectángulo tiene 46 cm de perímetro y su largo mide 7 cm más que el ancho. ¿Cuánto mide el ancho, en centímetros?", r: 8, e: "x = ancho; largo = x + 7. 2x + 2(x + 7) = 46; 4x + 14 = 46; 4x = 32; x = 8. Comprobación: 2 · 8 + 2 · 15 = 46." },
    { t: "numero", p: "Un taxi cobra ₡700 al subir y ₡650 por cada kilómetro. Un viaje costó ₡5 900. ¿Cuántos kilómetros se recorrieron?", r: 8, e: "700 + 650x = 5 900; 650x = 5 200; x = 8." },
    { t: "numero", p: "Los ángulos de un triángulo miden x, 2x y (x + 20) grados. ¿Cuánto mide el ángulo mayor, en grados?", r: 80, e: "Los ángulos de un triángulo suman 180°: x + 2x + x + 20 = 180; 4x = 160; x = 40. Miden 40°, 80° y 60°: el mayor es 80°." },
    { t: "numero", p: "Carla tiene 4 años más que su hermano. Dentro de 3 años, entre los dos sumarán 40 años. ¿Cuántos años tiene hoy el hermano?", r: 15, e: "x = hermano; Carla = x + 4. Dentro de 3 años: (x + 3) + (x + 7) = 40; 2x + 10 = 40; x = 15. Comprobación: 18 + 22 = 40." },
    { t: "numero", p: "Un número, más su mitad, más su tercera parte, da 66. ¿Cuál es el número?", r: 36, e: "x + x/2 + x/3 = 66. Por 6: 6x + 3x + 2x = 396; 11x = 396; x = 36. Comprobación: 36 + 18 + 12 = 66." },
    { t: "numero", p: "Hace 4 años, la edad de una madre era el triple de la de su hija. Hoy la madre tiene 40 años. ¿Cuántos años tiene hoy la hija?", r: 16, e: "x = edad de la hija hoy. Hace 4 años: madre 36, hija x − 4. 36 = 3(x − 4); 36 = 3x − 12; 48 = 3x; x = 16. Comprobación: hace 4 años tenían 36 y 12, y 36 es el triple de 12." },
    { t: "abierta", p: "Resolvé en el cuaderno con todos los pasos (incógnita, ecuación, resolución, respuesta y comprobación): un tanque tenía agua. El lunes se gastó la cuarta parte y el martes 30 litros, y quedaron 60 litros. ¿Cuántos litros tenía al inicio?",
      guia: [
        "Define la incógnita por escrito: x = litros que había al inicio.",
        "Plantea bien la ecuación: x − x/4 − 30 = 60 (o una equivalente).",
        "Resuelve bien la ecuación: x = 120.",
        "Responde en una oración y comprueba con el enunciado: 120 − 30 − 30 = 60.",
      ],
      modelo: "x = litros al inicio. x − x/4 − 30 = 60. Por 4: 4x − x − 120 = 240; 3x = 360; x = 120. Respuesta: el tanque tenía 120 litros. Comprobación: la cuarta parte de 120 es 30; 120 − 30 − 30 = 60." },
  ],
};

// ── Simulacros ────────────────────────────────────────────────────────────────────────────────────

const simulacroA = {
  nombre: "Simulacro A",
  partes: [
    { titulo: "I parte. Selección única (10 puntos)", instrucciones: "Elegí la opción correcta. Cada pregunta vale 1 punto. Hacé en el cuaderno las operaciones que necesités.",
      items: [
        { t: "opcion", p: "En una pirámide recta, ¿cómo se llama el segmento que va de la cúspide al punto medio de una arista básica?", o: ["Apotema de la pirámide", "Altura de la pirámide", "Arista lateral", "Apotema de la base"], r: 0,
          e: "Es la apotema de la pirámide: la altura de una cara lateral. La altura llega al centro de la base y la arista lateral a un vértice." },
        { t: "opcion", p: "¿Cuántas aristas tiene un prisma octagonal?", o: ["24", "16", "10", "18"], r: 0, e: "Un prisma tiene 3n aristas: 3 · 8 = 24 (8 en cada base y 8 laterales)." },
        { t: "opcion", p: "¿Cuál es el resultado de (a²)⁵ · a³?", o: ["a¹³", "a¹⁰", "a³⁰", "a²¹"], r: 0, e: "(a²)⁵ = a¹⁰ (se multiplican los exponentes); a¹⁰ · a³ = a¹³ (se suman)." },
        { t: "opcion", p: "¿Cuál es el resultado de −4² + (−4)²?", o: ["0", "32", "−32", "16"], r: 0, e: "−4² = −16 (el exponente es solo del 4) y (−4)² = 16. −16 + 16 = 0." },
        { t: "opcion", p: "Si a = −2 y b = 3, ¿cuál es el valor numérico de a² − ab?", o: ["10", "−2", "−10", "2"], r: 0, e: "(−2)² − (−2)(3) = 4 − (−6) = 4 + 6 = 10." },
        { t: "opcion", p: "Un hexágono regular tiene 54 cm de perímetro. ¿Cuánto mide su lado?", o: ["9 cm", "6 cm", "13,5 cm", "48 cm"], r: 0, e: "l = P ÷ n = 54 ÷ 6 = 9 cm." },
        { t: "opcion", p: "¿Cuál es el resultado de (2x² − 3x) − (x² − 5x)?", o: ["x² + 2x", "x² − 8x", "3x² − 8x", "x² + 8x"], r: 0, e: "2x² − 3x − x² + 5x = x² + 2x. Si no se cambia el signo del −5x sale x² − 8x." },
        { t: "opcion", p: "¿Cuál es el resultado de (x − 5)(x + 2)?", o: ["x² − 3x − 10", "x² − 10", "x² + 3x − 10", "x² − 7x − 10"], r: 0, e: "x² + 2x − 5x − 10 = x² − 3x − 10." },
        { t: "opcion", p: "¿Cuál es la solución de 3(x − 4) = x + 6?", o: ["x = 9", "x = 5", "x = 3", "x = −3"], r: 0, e: "3x − 12 = x + 6; 2x = 18; x = 9. Comprobación: 3(5) = 15 y 9 + 6 = 15." },
        { t: "opcion", p: "«Si al cuádruple de un número se le restan 6, se obtiene el doble del número.» ¿Qué ecuación representa la frase?", o: ["4x − 6 = 2x", "4(x − 6) = 2x", "4x − 6 = x + 2", "6 − 4x = 2x"], r: 0,
          e: "El cuádruple es 4x; se le restan 6: 4x − 6. «El doble del número» es 2x." },
      ] },
    { titulo: "II parte. Correspondencia (6 puntos)", instrucciones: "Observá el prisma recto triangular ABC-DEF de la figura (D está sobre A, E sobre B y F sobre C). Elegí qué elemento es cada notación. Cada pareja correcta vale 1 punto.",
      items: [
        { t: "parejas", fig: PRISMA_TRI, p: "Uní cada notación del prisma de la figura con lo que es.",
          pares: [["DEF", "Base"], ["ABED", "Cara lateral"], ["BC", "Arista básica"], ["CF", "Arista lateral"], ["F", "Vértice"], ["AE", "Diagonal de una cara lateral"]],
          e: "DEF es la base de arriba. ABED es la cara lateral del frente. BC es un lado de la base ABC. CF une C con el vértice que tiene encima. F es un vértice. AE cruza la cara ABED de esquina a esquina: es una diagonal, no una arista." },
      ] },
    { titulo: "III parte. Respuesta corta (13 puntos)", instrucciones: INSTR_CORTA,
      items: [
        { t: "completar", fig: PRISMA_TRI, may: true, p: "En el prisma de la figura, una de las bases es DEF. Escribí la otra base (tres letras): ___", r: ciclos("ABC"), e: "Las dos bases del prisma son los triángulos de abajo y de arriba: ABC y DEF." },
        { t: "completar", fig: PRISMA_TRI, may: true, p: "Escribí la arista lateral del prisma de la figura que sale del vértice B: ___", r: seg("BE"), e: "Las aristas laterales unen cada vértice de abajo con el que tiene encima: B con E, BE." },
        { t: "completar", p: "Expresá como una sola potencia: 5⁸ ÷ 5³ · 5² = ___", r: pot(5, 7), e: "De izquierda a derecha: 5⁸ ÷ 5³ = 5⁵; 5⁵ · 5² = 5⁷." },
        { t: "expresion", pts: 2, p: "Simplificá: (−4x³y²)(5x²y)", r: "-20x^5y^3", e: "(−4)(5) = −20; x^(3 + 2) = x⁵; y^(2 + 1) = y³." },
        { t: "expresion", pts: 2, p: "Simplificá: (3a⁴b)² ÷ 9a⁵", r: "a^3b^2", e: "(3a⁴b)² = 9a⁸b²; 9a⁸b² ÷ 9a⁵ = 1 · a³ · b² = a³b²." },
        { t: "numero", pts: 2, p: "Calculá el valor numérico de 2x² − 3xy + y² si x = −1 e y = 4.", r: 30, e: "2(−1)² − 3(−1)(4) + (4)² = 2 + 12 + 16 = 30." },
        { t: "expresion", pts: 2, p: "Resolvé: (4m² − 3m + 7) − (m² + 5m − 2)", r: "3m^2 - 8m + 9", e: "4m² − 3m + 7 − m² − 5m + 2 = 3m² − 8m + 9." },
        { t: "expresion", pts: 2, p: "Resolvé: −2x(3x² − x + 5)", r: "-6x^3 + 2x^2 - 10x", e: "(−2x)(3x²) = −6x³; (−2x)(−x) = 2x²; (−2x)(5) = −10x." },
      ] },
    { titulo: "IV parte. Desarrollo (19 puntos)", instrucciones: INSTR_DESARROLLO,
      items: [
        { t: "expresion", pts: 3, p: "Resolvé y simplificá al máximo: (2x − 3)(x² + 4x − 1)", r: "2x^3 + 5x^2 - 14x + 3", e: "2x³ + 8x² − 2x − 3x² − 12x + 3. x²: 8 − 3 = 5. x: −2 − 12 = −14. Resultado: 2x³ + 5x² − 14x + 3." },
        { t: "numero", pts: 3, p: "Una mesa con forma de hexágono regular mide 40 cm de lado y 34,6 cm de apotema. ¿Cuántos centímetros cuadrados mide su superficie?", r: 4152, e: "P = 6 · 40 = 240 cm. A = 240 · 34,6 ÷ 2 = 8 304 ÷ 2 = 4 152 cm²." },
        { t: "expresion", pts: 3, p: "Un lote rectangular mide (2x + 5) m de largo y (x − 3) m de ancho. Escribí su área simplificada.", r: "2x^2 - x - 15", e: "(2x + 5)(x − 3) = 2x² − 6x + 5x − 15 = 2x² − x − 15." },
        { t: "numero", pts: 3, p: "Resolvé: (x + 2)/3 − (x − 1)/2 = 1", r: 1, e: "Por 6: 2(x + 2) − 3(x − 1) = 6; 2x + 4 − 3x + 3 = 6; −x + 7 = 6; x = 1. Comprobación: 3/3 − 0/2 = 1." },
        { t: "numero", pts: 3, p: "El largo de un rectángulo es el triple del ancho y su perímetro mide 64 cm. ¿Cuánto mide el largo, en centímetros?", r: 24, e: "x = ancho; largo = 3x. 2x + 2(3x) = 64; 8x = 64; x = 8. El largo mide 3 · 8 = 24 cm." },
        { t: "abierta", p: "En una tienda, una camisa cuesta ₡3 000 más que un pantalón. Por 2 camisas y 1 pantalón se pagaron ₡36 000. ¿Cuánto cuesta el pantalón? Resolvelo en el cuaderno con incógnita, ecuación, resolución, respuesta y comprobación.",
          guia: [
            "Define la incógnita: x = precio del pantalón (y la camisa = x + 3 000).",
            "Plantea bien la ecuación: 2(x + 3 000) + x = 36 000.",
            "Resuelve bien: 3x + 6 000 = 36 000; x = 10 000.",
            "Responde en una oración (el pantalón cuesta ₡10 000) y comprueba: 2 · 13 000 + 10 000 = 36 000.",
          ],
          modelo: "x = precio del pantalón; camisa = x + 3 000. 2(x + 3 000) + x = 36 000 → 2x + 6 000 + x = 36 000 → 3x = 30 000 → x = 10 000. El pantalón cuesta ₡10 000 (y la camisa ₡13 000). Comprobación: 2 · 13 000 + 10 000 = 36 000." },
      ] },
  ],
};

const simulacroB = {
  nombre: "Simulacro B",
  partes: [
    { titulo: "I parte. Selección única (10 puntos)", instrucciones: "Elegí la opción correcta. Cada pregunta vale 1 punto. Hacé en el cuaderno las operaciones que necesités.",
      items: [
        { t: "opcion", p: "¿Qué forma tienen las caras laterales de un prisma recto?", o: ["Rectángulos", "Triángulos", "La misma forma que las bases", "Trapecios"], r: 0, e: "En el prisma recto las aristas laterales son perpendiculares a las bases, así que las caras laterales son rectángulos." },
        { t: "opcion", p: "¿Cuántos vértices tiene una pirámide heptagonal?", o: ["8", "14", "7", "9"], r: 0, e: "Una pirámide tiene n + 1 vértices: los 7 de la base y la cúspide, 8." },
        { t: "opcion", p: "¿Cuál es el resultado de x⁹ ÷ x³?", o: ["x⁶", "x³", "x¹²", "x²⁷"], r: 0, e: "Cociente de igual base: se restan los exponentes, 9 − 3 = 6. No se dividen." },
        { t: "opcion", p: "¿Cuál es el resultado de (−2a)³?", o: ["−8a³", "8a³", "−6a³", "−2a³"], r: 0, e: "(−2)³ = −8 (exponente impar: negativo) y a³: −8a³." },
        { t: "opcion", p: "Si m = 1/2, ¿cuál es el valor numérico de 4m² − m?", o: ["1/2", "3/2", "0", "7/2"], r: 0, e: "4(1/2)² − 1/2 = 4 · 1/4 − 1/2 = 1 − 1/2 = 1/2." },
        { t: "opcion", p: "Un octágono regular mide 6 cm de lado y 7,2 cm de apotema. ¿Cuál es su área?", o: ["172,8 cm²", "345,6 cm²", "43,2 cm²", "86,4 cm²"], r: 0, e: "P = 8 · 6 = 48 cm. A = 48 · 7,2 ÷ 2 = 172,8 cm². Sin dividir entre 2 sale 345,6." },
        { t: "opcion", p: "¿Cuál es el resultado de (3x² + x − 4) + (x² − 5x + 4)?", o: ["4x² − 4x", "4x² − 4x − 8", "4x⁴ − 4x", "4x² + 6x"], r: 0, e: "x²: 3 + 1 = 4. x: 1 − 5 = −4. Números: −4 + 4 = 0. Resultado: 4x² − 4x." },
        { t: "opcion", p: "¿Cuál es el resultado de (2x + 3)²?", o: ["4x² + 12x + 9", "4x² + 9", "4x² + 6x + 9", "2x² + 12x + 9"], r: 0, e: "(2x + 3)(2x + 3) = 4x² + 6x + 6x + 9 = 4x² + 12x + 9." },
        { t: "opcion", p: "¿Cuál es la solución de x/4 + 3 = x/2?", o: ["x = 12", "x = 4", "x = −12", "x = 6"], r: 0, e: "Por 4: x + 12 = 2x; 12 = x. Comprobación: 12/4 + 3 = 6 y 12/2 = 6." },
        { t: "opcion", p: "«La edad de un padre es el triple de la de su hijo y la diferencia entre sus edades es 26 años.» Si x es la edad del hijo, ¿qué ecuación representa la situación?", o: ["3x − x = 26", "x − 3x = 26", "3x + x = 26", "3(x − 26) = x"], r: 0,
          e: "El padre tiene 3x y la diferencia es mayor menos menor: 3x − x = 26 (el hijo tiene 13 años y el padre 39)." },
      ] },
    { titulo: "II parte. Correspondencia (7 puntos)", instrucciones: "Observá la pirámide recta PQRSV de la figura: su base es PQRS, O es el centro de la base y M el punto medio de PQ. Elegí qué elemento es cada notación. Cada pareja correcta vale 1 punto.",
      items: [
        { t: "parejas", fig: PIR_B, p: "Uní cada notación de la pirámide de la figura con lo que es.",
          pares: [["VO", "Altura"], ["VM", "Apotema de la pirámide"], ["OM", "Apotema de la base"], ["VS", "Arista lateral"], ["QR", "Arista básica"], ["VQR", "Cara lateral"], ["PQRS", "Base"]],
          e: "VO va de la cúspide al centro de la base: altura. VM va sobre la cara PQV al punto medio de PQ: apotema de la pirámide. OM va del centro al punto medio de PQ: apotema de la base. VS une la cúspide con un vértice: arista lateral. QR es lado de la base: arista básica. VQR es un triángulo lateral. PQRS es la base." },
      ] },
    { titulo: "III parte. Respuesta corta (13 puntos)", instrucciones: INSTR_CORTA,
      items: [
        { t: "completar", fig: PIR_B, may: true, p: "En la pirámide de la figura, escribí la cara lateral que contiene la arista SP (tres letras): ___", r: ciclos("SPV"), e: "La cara que tiene el lado SP de la base sube hasta la cúspide V: es el triángulo SPV (en cualquier orden)." },
        { t: "completar", fig: PIR_B, may: true, p: "En la base de la pirámide de la figura, escribí la arista básica que no toca ni a P ni a Q: ___", r: seg("RS"), e: "La base PQRS tiene los lados PQ, QR, RS y SP. El único que no tiene ni P ni Q es RS." },
        { t: "completar", p: "Expresá como una sola potencia: (7²)³ · 7 = ___", r: pot(7, 7), e: "(7²)³ = 7⁶; 7⁶ · 7¹ = 7⁷." },
        { t: "expresion", pts: 2, p: "Simplificá: 45a⁷b³c ÷ (−5a²b³)", r: "-9a^5c", e: "45 ÷ (−5) = −9; a^(7 − 2) = a⁵; b^(3 − 3) = b⁰ = 1; la c se copia. Resultado: −9a⁵c." },
        { t: "expresion", pts: 2, p: "Simplificá: (−x²y³)³ · 2xy", r: "-2x^7y^10", e: "(−x²y³)³ = −x⁶y⁹; −x⁶y⁹ · 2xy = −2x⁷y¹⁰." },
        { t: "numero", pts: 2, p: "Calculá el valor numérico de −a² + 3ab − b² si a = −2 y b = −1.", r: 1, e: "−(−2)² + 3(−2)(−1) − (−1)² = −4 + 6 − 1 = 1." },
        { t: "expresion", pts: 2, p: "De 5x² − 2xy + y² restá 2x² + 3xy − 4y².", r: "3x^2 - 5xy + 5y^2", e: "(5x² − 2xy + y²) − (2x² + 3xy − 4y²) = 5x² − 2xy + y² − 2x² − 3xy + 4y² = 3x² − 5xy + 5y²." },
        { t: "expresion", pts: 2, p: "Resolvé: 3a²b(2a − 4b + 1)", r: "6a^3b - 12a^2b^2 + 3a^2b", e: "3a²b · 2a = 6a³b; 3a²b · (−4b) = −12a²b²; 3a²b · 1 = 3a²b." },
      ] },
    { titulo: "IV parte. Desarrollo (19 puntos)", instrucciones: INSTR_DESARROLLO,
      items: [
        { t: "expresion", pts: 3, p: "Resolvé y simplificá al máximo: (3x + 2)(2x² − x + 4)", r: "6x^3 + x^2 + 10x + 8", e: "6x³ − 3x² + 12x + 4x² − 2x + 8. x²: −3 + 4 = 1. x: 12 − 2 = 10. Resultado: 6x³ + x² + 10x + 8." },
        { t: "numero", pts: 3, p: "Un parque tiene forma de pentágono regular de 30 m de lado y 20,6 m de apotema. Se va a cubrir con zacate que cuesta ₡1 800 el metro cuadrado. ¿Cuántos colones cuesta el zacate?", r: 2781000,
          e: "P = 5 · 30 = 150 m. A = 150 · 20,6 ÷ 2 = 1 545 m². Costo: 1 545 · 1 800 = ₡2 781 000." },
        { t: "expresion", pts: 3, p: "Una ventana cuadrada mide (x + 5) cm de lado. Tiene un vidrio cuadrado de (x + 1) cm de lado y el resto es marco. Escribí el área del marco.", r: "8x + 24",
          e: "(x + 5)² − (x + 1)² = (x² + 10x + 25) − (x² + 2x + 1) = x² + 10x + 25 − x² − 2x − 1 = 8x + 24." },
        { t: "numero", pts: 3, p: "Resolvé: 2(3x − 1) − (x + 4) = 3(x − 2) + 6", r: 3, e: "6x − 2 − x − 4 = 3x − 6 + 6; 5x − 6 = 3x; 2x = 6; x = 3. Comprobación: 2(8) − 7 = 9 y 3(1) + 6 = 9." },
        { t: "numero", pts: 3, p: "La suma de tres números impares consecutivos es 81. ¿Cuál es el menor?", r: 25, e: "x + (x + 2) + (x + 4) = 81; 3x + 6 = 81; 3x = 75; x = 25. Los números son 25, 27 y 29." },
        { t: "abierta", p: "El perímetro de un triángulo isósceles es 55 cm. Cada uno de los dos lados iguales mide 5 cm más que la base. ¿Cuánto mide cada lado? Resolvelo en el cuaderno con incógnita, ecuación, resolución, respuesta y comprobación.",
          guia: [
            "Define la incógnita: x = base (y cada lado igual = x + 5).",
            "Plantea bien la ecuación: x + 2(x + 5) = 55.",
            "Resuelve bien: 3x + 10 = 55; x = 15.",
            "Responde con las tres medidas (base 15 cm, lados iguales 20 cm) y comprueba: 15 + 20 + 20 = 55.",
          ],
          modelo: "x = base; cada lado igual = x + 5. x + 2(x + 5) = 55 → x + 2x + 10 = 55 → 3x = 45 → x = 15. La base mide 15 cm y cada lado igual 20 cm. Comprobación: 15 + 20 + 20 = 55." },
      ] },
  ],
};

export default {
  duracion: 120,
  temas: [piramidePrisma, potencias, valorNumerico, poligonosRegulares, sumaResta, multiplicacion, problemasPolinomios, ecuaciones, plantearEcuaciones],
  simulacros: [simulacroA, simulacroB],
};
