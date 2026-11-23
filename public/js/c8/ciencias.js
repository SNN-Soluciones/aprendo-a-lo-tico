// 🧪 Ciencias · convocatoria de 8° (2° de colegio). Prueba: jueves 3 de diciembre, 7:00 a. m., 120 minutos.
// Temas: tabla periódica, nombres y símbolos, usos de los elementos y minería, el átomo (Z, A, iones e isótopos),
// radiactividad, y usos y seguridad de los materiales radiactivos. La forma de cada pieza está en ./revisar.js.

// ── Dibujos ─────────────────────────────────────────────────────────────────────────────────────────────

const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Tabla periódica esquemática: casillas de 20 px, 18 columnas, 7 periodos y las dos filas del bloque f.
const LADO = 20;
const IZQ = 24;
const ARRIBA = 26;
const FONDO_LEYENDA = 222;
const COLUMNAS = [
  [1, 18],
  [1, 2, ...rango(13, 18)],
  [1, 2, ...rango(13, 18)],
  rango(1, 18), rango(1, 18), rango(1, 18), rango(1, 18),
];
const CASILLAS = [
  ...COLUMNAS.flatMap((cols, i) => cols.map(c => ({ f: i + 1, c }))),
  ...["L", "A"].flatMap(f => rango(4, 17).map(c => ({ f, c }))),
];
const yFila = f => ARRIBA + ((f === "L" ? 8.4 : f === "A" ? 9.4 : f) - 1) * LADO;
const xColumna = c => IZQ + (c - 1) * LADO;
const filaSuperior = c => (c === 1 || c === 18 ? 1 : c === 2 || c >= 13 ? 2 : 4);

/** Bloque (s, p, d o f) de una casilla; el grupo 3 de los periodos 6 y 7 abre los lantánidos y actínidos. */
function bloqueDe({ f, c }) {
  if (f === "L" || f === "A" || (c === 3 && f >= 6)) return "f";
  if (c <= 2 || (f === 1 && c === 18)) return "s";
  return c >= 13 ? "p" : "d";
}

/**
 * Dibuja la tabla esquemática.
 * @param {{ relleno?: (k: {f: number|string, c: number}) => string, marcas?: Record<string, string>,
 *   leyenda?: {color: string, texto: string}[] }} [op]  marcas: «periodo-columna» → letra (por ejemplo «3-1»: "A";
 *   los lantánidos son «L-c» y los actínidos «A-c»)
 * @returns {string} <svg…>
 */
function tablaSvg({ relleno = () => "#FFFFFF", marcas = {}, leyenda = [] } = {}) {
  const alto = FONDO_LEYENDA + Math.ceil(leyenda.length / 2) * 18;
  const casillas = CASILLAS.map(k => {
    const x = xColumna(k.c), y = yFila(k.f), letra = marcas[`${k.f}-${k.c}`];
    const texto = letra
      ? `<text x="${x + LADO / 2}" y="${y + 15}" font-size="13" font-weight="700" text-anchor="middle" fill="#111111">${letra}</text>`
      : "";
    return `<rect x="${x}" y="${y}" width="${LADO}" height="${LADO}" fill="${relleno(k)}" stroke="#555555" stroke-width="0.8"/>${texto}`;
  }).join("");
  const grupos = rango(1, 18).map(c =>
    `<text x="${xColumna(c) + LADO / 2}" y="${yFila(filaSuperior(c)) - 4}" font-size="8" text-anchor="middle" fill="#333333">${c}</text>`).join("");
  const periodos = rango(1, 7).map(f =>
    `<text x="${IZQ - 8}" y="${yFila(f) + 14}" font-size="9" text-anchor="middle" fill="#333333">${f}</text>`).join("");
  const filasF = [["L", "lantánidos"], ["A", "actínidos"]].map(([f, t]) =>
    `<text x="${xColumna(4) - 4}" y="${yFila(f) + 13}" font-size="8" text-anchor="end" fill="#333333">${t}</text>`).join("");
  const claves = leyenda.map(({ color, texto }, i) => {
    const x = IZQ + (i % 2) * 185, y = FONDO_LEYENDA + Math.floor(i / 2) * 18;
    return `<rect x="${x}" y="${y}" width="11" height="11" fill="${color}" stroke="#555555" stroke-width="0.8"/>` +
      `<text x="${x + 16}" y="${y + 10}" font-size="10" fill="#111111">${texto}</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 ${alto}" font-family="sans-serif">` +
    `<rect width="400" height="${alto}" fill="#FFFFFF"/>${grupos}${periodos}${filasF}${casillas}${claves}</svg>`;
}

const COLOR_BLOQUE = { s: "#F4B6B6", p: "#F9DC8C", d: "#A9CCF0", f: "#B9E0A5" };

const SVG_BLOQUES = tablaSvg({
  relleno: k => COLOR_BLOQUE[bloqueDe(k)],
  leyenda: [
    { color: COLOR_BLOQUE.s, texto: "bloque s: grupos 1 y 2 (y el He)" },
    { color: COLOR_BLOQUE.p, texto: "bloque p: grupos 13 a 18" },
    { color: COLOR_BLOQUE.d, texto: "bloque d: transición (3 a 12)" },
    { color: COLOR_BLOQUE.f, texto: "bloque f: transición interna" },
  ],
});
const FIG_FAMILIAS = tablaSvg({ marcas: { "3-1": "A", "4-2": "B", "2-13": "C", "5-14": "D", "3-15": "E", "2-16": "F", "4-17": "G", "4-18": "H" } });
const FIG_TIPOS = tablaSvg({ marcas: { "4-1": "P", "4-8": "Q", "A-8": "R", "3-16": "S" } });
const FIG_SIMULACRO_A = tablaSvg({ marcas: { "3-2": "A", "2-17": "B", "4-16": "C", "5-11": "D", "L-10": "E" } });
const FIG_SIMULACRO_B = tablaSvg({ marcas: { "4-1": "A", "2-15": "B", "4-15": "C", "4-10": "D", "3-17": "E" } });

const SVG_NOTACION = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 170" font-family="sans-serif">' +
  '<rect width="520" height="170" fill="#FFFFFF"/>' +
  '<text x="268" y="62" font-size="24" font-weight="700" text-anchor="end" fill="#B4432F">23</text>' +
  '<text x="268" y="118" font-size="24" font-weight="700" text-anchor="end" fill="#1F5FB0">11</text>' +
  '<text x="274" y="112" font-size="68" font-weight="700" fill="#111111">Na</text>' +
  '<rect x="366" y="36" width="26" height="30" fill="none" stroke="#777777" stroke-dasharray="4 3"/>' +
  '<line x1="152" y1="54" x2="238" y2="54" stroke="#B4432F" stroke-width="2"/>' +
  '<line x1="152" y1="110" x2="238" y2="110" stroke="#1F5FB0" stroke-width="2"/>' +
  '<line x1="396" y1="52" x2="420" y2="52" stroke="#777777" stroke-width="2"/>' +
  '<text x="10" y="48" font-size="13" font-weight="700" fill="#B4432F">A: número másico</text>' +
  '<text x="10" y="64" font-size="12" fill="#333333">protones + neutrones</text>' +
  '<text x="10" y="104" font-size="13" font-weight="700" fill="#1F5FB0">Z: número atómico</text>' +
  '<text x="10" y="120" font-size="12" fill="#333333">cantidad de protones</text>' +
  '<text x="426" y="48" font-size="13" font-weight="700" fill="#333333">carga</text>' +
  '<text x="426" y="64" font-size="12" fill="#333333">solo si es ion</text>' +
  '<text x="10" y="156" font-size="12" fill="#111111">Sodio-23: 11 protones · 23 − 11 = 12 neutrones · 11 electrones (átomo neutro)</text>' +
  "</svg>";

const SVG_PENETRACION = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 196" font-family="sans-serif">' +
  '<rect width="460" height="196" fill="#FFFFFF"/>' +
  '<rect x="10" y="30" width="50" height="136" fill="#FDE7A6" stroke="#8A6D1F"/>' +
  '<text x="35" y="102" font-size="11" text-anchor="middle" fill="#111111">fuente</text>' +
  '<rect x="150" y="26" width="4" height="146" fill="#BBBBBB"/>' +
  '<rect x="245" y="26" width="10" height="146" fill="#9AA5B1"/>' +
  '<rect x="340" y="26" width="28" height="146" fill="#5A5F66"/>' +
  '<text x="152" y="18" font-size="11" text-anchor="middle" fill="#111111">papel</text>' +
  '<text x="250" y="18" font-size="11" text-anchor="middle" fill="#111111">aluminio</text>' +
  '<text x="354" y="18" font-size="11" text-anchor="middle" fill="#111111">plomo</text>' +
  '<line x1="62" y1="58" x2="140" y2="58" stroke="#B4432F" stroke-width="3"/>' +
  '<polygon points="140,52 149,58 140,64" fill="#B4432F"/>' +
  '<text x="68" y="50" font-size="12" fill="#B4432F">α (alfa)</text>' +
  '<line x1="62" y1="102" x2="235" y2="102" stroke="#1F5FB0" stroke-width="3"/>' +
  '<polygon points="235,96 244,102 235,108" fill="#1F5FB0"/>' +
  '<text x="68" y="94" font-size="12" fill="#1F5FB0">β (beta)</text>' +
  '<line x1="62" y1="146" x2="339" y2="146" stroke="#1E7F5C" stroke-width="3"/>' +
  '<line x1="369" y1="146" x2="440" y2="146" stroke="#1E7F5C" stroke-width="1.5" stroke-dasharray="5 4"/>' +
  '<polygon points="440,141 449,146 440,151" fill="#1E7F5C"/>' +
  '<text x="68" y="138" font-size="12" fill="#1E7F5C">γ (gamma)</text>' +
  '<text x="10" y="189" font-size="11" fill="#333333">La gamma sale del plomo muy debilitada (línea punteada), pero no desaparece del todo.</text>' +
  "</svg>";

const SVG_TREBOL = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 100" font-family="sans-serif">' +
  '<rect width="250" height="100" fill="#FFFFFF"/>' +
  '<rect x="0" y="0" width="100" height="100" rx="8" fill="#FFD400"/>' +
  '<circle cx="50" cy="50" r="8" fill="#1A1A1A"/>' +
  '<path d="M62 50 L90 50 A40 40 0 0 0 70 15.36 L56 39.61 A12 12 0 0 1 62 50 Z" fill="#1A1A1A"/>' +
  '<path d="M44 39.61 L30 15.36 A40 40 0 0 0 10 50 L38 50 A12 12 0 0 1 44 39.61 Z" fill="#1A1A1A"/>' +
  '<path d="M44 60.39 L30 84.64 A40 40 0 0 0 70 84.64 L56 60.39 A12 12 0 0 1 44 60.39 Z" fill="#1A1A1A"/>' +
  '<text x="112" y="36" font-size="12" font-weight="700" fill="#111111">Símbolo de radiación</text>' +
  '<text x="112" y="54" font-size="11" fill="#333333">trébol negro o magenta</text>' +
  '<text x="112" y="70" font-size="11" fill="#333333">sobre fondo amarillo</text>' +
  "</svg>";

// ── Tema 1 ──────────────────────────────────────────────────────────────────────────────────────────────

const TABLA_PERIODICA = {
  id: "tabla-periodica",
  titulo: "La tabla periódica: familias, bloques y clasificación",
  indicadores: [
    "Identifica las principales familias químicas: alcalinos, alcalinotérreos, térreos, carbonoides, nitrogenoides, calcógenos, halógenos y gases nobles.",
    "Reconoce la organización de los elementos químicos en bloques representativos, de transición y de transición interna.",
    "Clasifica elementos químicos en metales, no metales y metaloides según su ubicación y características generales.",
  ],
  materia: [
    { t: "h", x: "Cómo está organizada la tabla periódica" },
    { t: "p", x: "La **tabla periódica** ordena los **118 elementos químicos** conocidos de menor a mayor **número atómico (Z)**, que es la cantidad de protones del núcleo. La primera versión útil la hizo Dmitri Mendeléiev en 1869: agrupó los elementos por propiedades parecidas y dejó espacios para elementos que todavía no se conocían. Por ese orden, la posición de un elemento en la tabla dice mucho de cómo se comporta." },
    { t: "lista", x: [
      "**Periodos**: son las **7 filas horizontales**. El número del periodo indica en cuántos **niveles de energía** están los electrones del átomo. El sodio está en el periodo 3: sus electrones ocupan 3 niveles.",
      "**Grupos o familias**: son las **18 columnas verticales**. Los elementos de un mismo grupo tienen **la misma cantidad de electrones de valencia** (los del último nivel) y por eso tienen **propiedades químicas parecidas**.",
      "Los grupos se numeran del **1 al 18** (numeración actual) o con números romanos y letras: **IA a VIIIA** para los representativos y **B** para los de transición (numeración antigua). Muchas tablas traen las dos.",
      "Cada casilla trae, como mínimo, el **símbolo**, el **nombre**, el **número atómico** y la **masa atómica** (el promedio de las masas de los isótopos del elemento, en unidades de masa atómica, u).",
    ] },
    { t: "ej", x: "Leer una casilla. En la casilla del sodio aparecen «11», «Na», «Sodio» y «22,99». El número entero, 11, es el número atómico: el sodio tiene 11 protones. El número con decimales, 22,99, es la masa atómica promedio." },
    { t: "h", x: "Las ocho familias de los elementos representativos" },
    { t: "tabla", cab: ["Grupo", "Familia", "Electrones de valencia", "Elementos"], filas: [
      ["1 (IA)", "Alcalinos", "1", "Li, Na, K, Rb, Cs, Fr"],
      ["2 (IIA)", "Alcalinotérreos", "2", "Be, Mg, Ca, Sr, Ba, Ra"],
      ["13 (IIIA)", "Térreos (familia del boro)", "3", "B, Al, Ga, In, Tl"],
      ["14 (IVA)", "Carbonoides (familia del carbono)", "4", "C, Si, Ge, Sn, Pb"],
      ["15 (VA)", "Nitrogenoides (familia del nitrógeno)", "5", "N, P, As, Sb, Bi"],
      ["16 (VIA)", "Calcógenos (o anfígenos)", "6", "O, S, Se, Te, Po"],
      ["17 (VIIA)", "Halógenos", "7", "F, Cl, Br, I, At"],
      ["18 (VIIIA)", "Gases nobles", "8 (el helio, 2)", "He, Ne, Ar, Kr, Xe, Rn"],
    ] },
    { t: "lista", x: [
      "**Alcalinos**: metales blandos (se cortan con cuchillo) y muy reactivos; reaccionan con violencia con el agua, por eso se guardan en aceite. Pierden 1 electrón.",
      "**Alcalinotérreos**: metales reactivos, pero menos que los alcalinos. Pierden 2 electrones. El calcio forma huesos, conchas y la piedra caliza.",
      "**Térreos**: el boro es metaloide y los demás son metales. El aluminio es el metal más abundante de la corteza terrestre.",
      "**Carbonoides**: tienen de todo: un no metal (C), metaloides (Si, Ge) y metales (Sn, Pb). El carbono es la base de los seres vivos.",
      "**Nitrogenoides**: N y P son no metales; As y Sb son metaloides; Bi es metal. El nitrógeno forma cerca del 78 % del aire.",
      "**Calcógenos**: O, S y Se son no metales; Te es metaloide; Po es radiactivo. El oxígeno es el elemento más abundante de la corteza terrestre.",
      "**Halógenos**: no metales muy reactivos; con los metales forman sales («halógeno» significa «formador de sales»). F y Cl son gases, Br es líquido e I es sólido. Ganan 1 electrón.",
      "**Gases nobles**: casi no reaccionan porque su último nivel de energía está completo; existen como átomos sueltos.",
    ] },
    { t: "p", x: "Regla para los representativos: los **electrones de valencia** coinciden con el número romano del grupo antiguo (IA = 1, VIIA = 7) o con la **última cifra** del grupo actual (grupo 13 → 3, grupo 17 → 7). En los elementos de transición esta regla sencilla no se usa." },
    { t: "ej", x: "Ejemplo resuelto. Un elemento está en el grupo 16 y en el periodo 3. Paso 1: grupo 16 = VIA = **calcógenos**. Paso 2: electrones de valencia = 6 (última cifra de 16). Paso 3: periodo 3 = sus electrones ocupan 3 niveles de energía. Paso 4: en la tabla, grupo 16 y periodo 3 es el **azufre (S)**, un no metal." },
    { t: "ojo", x: "El **hidrógeno** se escribe arriba del grupo 1 porque tiene 1 electrón de valencia, pero **no es un metal alcalino**: es un gas no metálico. Y el **helio** va en el grupo 18, con los gases nobles, aunque tenga solo 2 electrones de valencia: su único nivel ya está completo." },
    { t: "h", x: "Bloques: representativos, de transición y de transición interna" },
    { t: "p", x: "Según el subnivel donde queda el último electrón de sus átomos, la tabla se divide en cuatro **bloques: s, p, d y f**. Con esos bloques se forman tres tipos de elementos: **representativos** (bloques s y p), **de transición** (bloque d) y **de transición interna** (bloque f)." },
    { t: "svg", x: SVG_BLOQUES, alt: "Tabla periódica esquemática con los bloques en colores: el bloque s en los grupos 1 y 2 más el helio; el bloque p en los grupos 13 a 18; el bloque d en los grupos 3 a 12, en el centro; y el bloque f en las dos filas separadas de abajo, los lantánidos y los actínidos." },
    { t: "tabla", cab: ["Tipo y bloque", "Dónde están", "Qué son"], filas: [
      ["Representativos (bloques s y p)", "Grupos 1, 2 y 13 a 18, en los dos extremos de la tabla", "Metales, no metales y metaloides; aquí están las ocho familias con nombre. Ejemplos: H, Na, Ca, Al, C, N, O, Cl, Ne"],
      ["De transición (bloque d)", "Grupos 3 a 12, en el centro de la tabla (periodos 4 a 7)", "Todos son metales; muchos forman compuestos de colores. Ejemplos: Fe, Cu, Zn, Ag, Au, Hg, Ni, Cr"],
      ["De transición interna (bloque f)", "Las dos filas separadas abajo: lantánidos (periodo 6) y actínidos (periodo 7)", "Todos son metales y todos los actínidos son radiactivos. Ejemplos: Ce, Nd, U, Pu"],
    ] },
    { t: "ojo", x: "Los lantánidos y los actínidos **no están fuera de la tabla**: pertenecen a los periodos 6 y 7 y se dibujan abajo solo para que la tabla no quede demasiado ancha. Si te preguntan dónde están los elementos de transición interna, la respuesta es **bloque f, las dos filas de abajo**; el centro de la tabla es el bloque d (transición)." },
    { t: "h", x: "Metales, no metales y metaloides" },
    { t: "p", x: "La **línea en escalera** (o diagonal escalonada) empieza junto al **boro (B)** y baja como escalera hacia la derecha hasta el polonio y el astato. Separa los elementos así: a la **izquierda y en el centro**, los **metales** (la gran mayoría); a la **derecha**, los **no metales** (más el **hidrógeno**, que está arriba a la izquierda); **pegados a la escalera**, los **metaloides**." },
    { t: "tabla", cab: ["Característica", "Metales", "No metales", "Metaloides"], filas: [
      ["Ubicación", "Izquierda y centro de la tabla", "Derecha de la escalera, más el hidrógeno", "A lo largo de la escalera"],
      ["Brillo", "Brillo metálico", "En general sin brillo (opacos)", "Algunos tienen brillo"],
      ["Conducción del calor y la electricidad", "Buenos conductores", "Malos conductores (aislantes); excepción: el grafito, una forma del carbono", "Semiconductores: conducen más que los no metales y menos que los metales"],
      ["Estado a temperatura ambiente", "Sólidos, excepto el mercurio (Hg), que es líquido", "Sólidos (C, P, S, I), un líquido (Br) y gases (H, N, O, F, Cl y los gases nobles)", "Sólidos"],
      ["Maleables y dúctiles", "Sí: se hacen láminas (maleables) e hilos (dúctiles)", "No: si son sólidos, son quebradizos", "No: son quebradizos"],
      ["Con los electrones", "Tienden a perderlos y formar cationes (iones positivos)", "Tienden a ganarlos y formar aniones (iones negativos); los gases nobles casi no ganan ni pierden", "Comportamiento intermedio"],
      ["Ejemplos", "Na, K, Mg, Ca, Al, Fe, Cu, Zn, Ag, Au, Hg, Pb", "H, C, N, O, F, P, S, Cl, Br, I, He, Ne", "B, Si, Ge, As, Sb, Te"],
    ] },
    { t: "p", x: "Los metaloides más aceptados son **boro (B), silicio (Si), germanio (Ge), arsénico (As), antimonio (Sb) y telurio (Te)**; algunas tablas también marcan el polonio (Po) y el astato (At). Revisá cuáles marca la tabla de tu clase. El **silicio** y el **germanio** son **semiconductores**: por eso se usan en chips, celulares y paneles solares." },
    { t: "ej", x: "Clasificar por ubicación. Germanio (Ge): grupo 14, periodo 4, pegado a la escalera → **metaloide**. Calcio (Ca): grupo 2, a la izquierda → **metal**. Bromo (Br): grupo 17, a la derecha → **no metal** (el único líquido). Hierro (Fe): grupo 8, en el centro → **metal** de transición." },
    { t: "ojo", x: "El **aluminio** toca la escalera, pero **es un metal** (brilla, conduce y se hace lámina). El **mercurio** es un **metal** aunque sea líquido. El **bromo** es el único **no metal** líquido. Y no confundás «metaloide» con «metal de transición»: los de transición son metales comunes del centro de la tabla." },
  ],
  cuaderno: [
    { tipo: "copiar", x: "En una página nueva escribí el título «La tabla periódica: familias, bloques y clasificación» y la fecha. Copiá completa la tabla de las ocho familias: grupo actual, grupo antiguo, nombre, electrones de valencia y los símbolos de sus elementos." },
    { tipo: "escribir", x: "Dibujá a mano, en una página entera y con regla, una tabla periódica esquemática de 18 columnas y 7 filas, más las dos filas de abajo. Pintá con cuatro colores los bloques s, p, d y f; escribí sobre cada grupo representativo el nombre de su familia; trazá con rojo la línea en escalera y escribí B, Si, Ge, As, Sb y Te en sus casillas." },
    { tipo: "resumir", x: "Escribí un resumen de 8 a 10 líneas, con tus palabras, que compare metales, no metales y metaloides: ubicación, brillo, conducción, estado a temperatura ambiente y qué hacen con los electrones. Incluí las tres excepciones: mercurio, bromo y grafito." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase y en la tabla periódica que usaron en clase cuáles elementos se marcaron como metaloides y cómo se llamaron las familias. Anotá la fecha de esa clase al lado de tu tabla de familias y copiá cualquier nombre o dato distinto que use tu profe (por ejemplo, «anfígenos» en vez de «calcógenos»)." },
    { tipo: "moverse", x: "Hacé 8 papelitos, uno por familia: de un lado el nombre y del otro el grupo (actual y antiguo) y los electrones de valencia. Pegalos en 8 lugares distintos de la casa. Recorrelos en orden, del grupo 1 al 18, diciendo en voz alta el nombre, el grupo, los electrones de valencia y dos elementos de cada familia. Hacé el recorrido tres veces sin voltear los papelitos." },
  ],
  practica: [
    { t: "opcion", p: "Las filas horizontales de la tabla periódica se llaman:", o: ["periodos", "grupos", "familias", "bloques"], r: 0,
      e: "Las filas horizontales son los **periodos** (hay 7). Las columnas verticales son los grupos o familias, y los bloques (s, p, d, f) son zonas de la tabla." },
    { t: "opcion", p: "Los elementos de un mismo grupo tienen propiedades químicas parecidas porque tienen la misma cantidad de:", o: ["electrones de valencia", "niveles de energía", "neutrones", "masa atómica"], r: 0,
      e: "En un grupo todos tienen los mismos **electrones de valencia**, que son los que participan en las reacciones. Los niveles de energía se repiten en un mismo periodo, no en un grupo." },
    { t: "completar", p: "Los elementos del grupo 17 (VIIA), como el flúor y el cloro, forman la familia de los ___.", r: ["halógenos"],
      e: "El grupo 17 es el de los **halógenos** («formadores de sales»): F, Cl, Br, I y At, con 7 electrones de valencia." },
    { t: "completar", p: "El grupo 2 (IIA), formado por berilio, magnesio, calcio, estroncio, bario y radio, es la familia de los ___.", r: ["alcalinotérreos", "alcalino-térreos", "alcalino térreos"],
      e: "El grupo 2 es el de los **alcalinotérreos**, con 2 electrones de valencia. No lo confundás con el grupo 1, los alcalinos." },
    { t: "opcion", p: "El grupo 14 (IVA), al que pertenecen el carbono y el silicio, se llama:", o: ["carbonoides", "térreos", "nitrogenoides", "calcógenos"], r: 0,
      e: "El grupo 14 es la familia del carbono: **carbonoides**. Térreos es el 13, nitrogenoides el 15 y calcógenos el 16." },
    { t: "numero", p: "¿Cuántos electrones de valencia tiene un elemento de la familia de los nitrogenoides?", r: 5,
      e: "Los nitrogenoides son el grupo 15 (VA): tienen **5** electrones de valencia (última cifra de 15, o el número romano V)." },
    { t: "numero", p: "Un elemento representativo tiene 6 electrones de valencia y sus electrones ocupan 2 niveles de energía. ¿En qué grupo está, según la numeración actual del 1 al 18?", r: 16,
      e: "6 electrones de valencia corresponde al grupo VIA, que en la numeración actual es el **16** (calcógenos). Con 2 niveles está en el periodo 2: es el oxígeno." },
    { t: "vf", p: "El hidrógeno es un metal alcalino porque está en el grupo 1.", r: false,
      e: "**Falso.** El hidrógeno se ubica arriba del grupo 1 porque tiene 1 electrón de valencia, pero es un gas no metálico, no un metal alcalino." },
    { t: "parejas", fig: FIG_FAMILIAS, p: "Cada letra de la tabla esquemática marca la casilla de un elemento. Uní cada letra con la familia a la que pertenece.",
      pares: [["A", "alcalinos"], ["B", "alcalinotérreos"], ["C", "térreos"], ["D", "carbonoides"], ["E", "nitrogenoides"], ["F", "calcógenos"], ["G", "halógenos"], ["H", "gases nobles"]],
      e: "Se lee la columna: A grupo 1 (alcalinos, es el Na); B grupo 2 (alcalinotérreos, Ca); C grupo 13 (térreos, B); D grupo 14 (carbonoides, Sn); E grupo 15 (nitrogenoides, P); F grupo 16 (calcógenos, O); G grupo 17 (halógenos, Br); H grupo 18 (gases nobles, Kr)." },
    { t: "opcion", fig: FIG_TIPOS, p: "En la tabla esquemática, ¿qué letra señala un elemento de transición interna?", o: ["R", "Q", "P", "S"], r: 0,
      e: "La **R** está en la fila de los actínidos, abajo: bloque f, transición interna. La Q está en el centro (bloque d, transición); P y S están en los extremos (representativos)." },
    { t: "completar", fig: FIG_TIPOS, p: "En la tabla esquemática, la letra que está sobre un elemento de transición es ___.", r: ["Q"],
      e: "La **Q** está en el grupo 8, en el centro de la tabla: bloque d, elementos de transición (es el hierro). R es de transición interna (bloque f)." },
    { t: "completar", p: "Los elementos representativos forman los bloques s y ___.", r: ["p"],
      e: "Los representativos son los bloques **s** (grupos 1 y 2) y **p** (grupos 13 a 18). El bloque d es de transición y el f, de transición interna." },
    { t: "vf", p: "Los lantánidos y los actínidos forman el bloque f y se llaman elementos de transición interna.", r: true,
      e: "**Verdadero.** Son las dos filas de abajo, el bloque f, y pertenecen a los periodos 6 y 7." },
    { t: "opcion", p: "¿Cuál de estos elementos es un metaloide?", o: ["silicio (Si)", "aluminio (Al)", "azufre (S)", "magnesio (Mg)"], r: 0,
      e: "El **silicio** es metaloide y semiconductor. El aluminio toca la escalera pero es metal; el azufre es no metal y el magnesio es metal." },
    { t: "opcion", p: "Un elemento es sólido, quebradizo, sin brillo y no conduce la electricidad. Lo más probable es que sea:", o: ["un no metal", "un metal alcalino", "un metal de transición", "un gas noble"], r: 0,
      e: "Sin brillo, quebradizo y aislante son características de los **no metales** (como el azufre). Los metales brillan y conducen; los gases nobles no son sólidos." },
    { t: "vf", p: "El mercurio es un no metal porque es líquido a temperatura ambiente.", r: false,
      e: "**Falso.** El mercurio es un **metal** (de transición): brilla y conduce la electricidad. Es la excepción de los metales: el único líquido. El no metal líquido es el bromo." },
    { t: "opcion", p: "Un elemento está en el periodo 4 y en el grupo 2. ¿Cuál afirmación es correcta?",
      o: ["Tiene 2 electrones de valencia y sus electrones ocupan 4 niveles de energía.", "Tiene 4 electrones de valencia y sus electrones ocupan 2 niveles de energía.", "Es un no metal del bloque p.", "Es un elemento de transición del bloque d."], r: 0,
      e: "Grupo 2 → **2 electrones de valencia** (alcalinotérreo, bloque s, metal). Periodo 4 → **4 niveles de energía**. Es el calcio." },
    { t: "ordenar", p: "Ordená las familias según su número de grupo, de menor a mayor.",
      x: ["alcalinos", "alcalinotérreos", "térreos", "carbonoides", "nitrogenoides", "calcógenos", "halógenos", "gases nobles"],
      e: "Grupo 1 alcalinos, 2 alcalinotérreos, 13 térreos, 14 carbonoides, 15 nitrogenoides, 16 calcógenos, 17 halógenos y 18 gases nobles." },
    { t: "opcion", p: "Los gases nobles casi no forman compuestos porque:", o: ["su último nivel de energía está completo", "no tienen electrones", "son metales muy pesados", "su núcleo no tiene protones"], r: 0,
      e: "Con el **último nivel completo** (8 electrones; el helio, 2) son muy estables y casi no ganan, pierden ni comparten electrones." },
    { t: "completar", p: "El silicio y el germanio conducen la electricidad mejor que los no metales, pero peor que los metales; por eso se les llama ___.", r: ["semiconductores"],
      e: "Son **semiconductores**: una característica de los metaloides que permite fabricar chips y paneles solares." },
    { t: "abierta", p: "En tu cuaderno: un elemento X está en el grupo 17 y en el periodo 3. Escribí (a) su familia; (b) cuántos electrones de valencia tiene y cuántos niveles de energía ocupan sus electrones; (c) su bloque y si es representativo, de transición o de transición interna; (d) si es metal, no metal o metaloide, con dos características; (e) qué elemento es, con nombre y símbolo.",
      guia: [
        "(a) Halógenos.",
        "(b) 7 electrones de valencia y 3 niveles de energía.",
        "(c) Bloque p, representativo.",
        "(d) No metal, con dos características correctas (mal conductor, sin brillo, tiende a ganar 1 electrón, gas a temperatura ambiente).",
        "(e) Cloro, Cl (C mayúscula y l minúscula).",
      ],
      modelo: "(a) X pertenece a la familia de los halógenos (grupo 17 o VIIA). (b) Tiene 7 electrones de valencia y sus electrones ocupan 3 niveles de energía porque está en el periodo 3. (c) Está en el bloque p, así que es un elemento representativo. (d) Es un no metal: es mal conductor del calor y la electricidad y tiende a ganar 1 electrón para formar un anión; a temperatura ambiente es un gas. (e) Es el cloro, Cl.",
      lineas: 8 },
  ],
};

// ── Tema 2 ──────────────────────────────────────────────────────────────────────────────────────────────

/** Símbolo pedido con mayúsculas exactas («Na», no «NA» ni «na»). */
const simbolo = (nombre, sim, porque) => ({
  t: "completar", p: `El símbolo del ${nombre} es ___.`, r: [sim], may: true,
  e: `**${sim}**: primera letra mayúscula${sim.length > 1 ? " y segunda minúscula" : ""}. ${porque}`,
});

const SIMBOLOS = {
  id: "simbolos",
  titulo: "Nombres y símbolos de los elementos químicos",
  indicadores: [
    "Reconoce nombres y símbolos de elementos químicos comunes.",
    "Asocia correctamente el nombre de un elemento químico con su símbolo y viceversa.",
  ],
  materia: [
    { t: "h", x: "El lenguaje universal de la química" },
    { t: "p", x: "Cada elemento tiene un **símbolo químico** que es **igual en todos los idiomas**: «Fe» es el hierro en español, _iron_ en inglés y _fer_ en francés. El sistema que se usa hoy lo propuso el químico sueco Jöns Jacob Berzelius a inicios del siglo XIX: usar la letra inicial del nombre del elemento, casi siempre en latín o en griego, y agregar una segunda letra cuando hace falta distinguirlo de otro." },
    { t: "h", x: "Reglas para escribir un símbolo" },
    { t: "lista", x: [
      "Tiene **una o dos letras**: C, O, Ca, Cl.",
      "La **primera letra siempre va en mayúscula**.",
      "La **segunda letra, si la hay, siempre va en minúscula**: Co, no CO; Na, no NA.",
      "**No lleva punto** al final (no es una abreviatura) ni se pone en plural.",
      "Muchos vienen del **latín** u otro idioma; por eso algunos no se parecen al nombre en español.",
    ] },
    { t: "ojo", x: "«CO» **no** es el cobalto: son dos símbolos juntos, C (carbono) y O (oxígeno), y forman el monóxido de carbono, un gas tóxico. El cobalto es **Co**. Por eso en el examen escribir «NA», «na» o «nA» en lugar de **Na** es un error: cada mayúscula empieza un elemento nuevo." },
    { t: "h", x: "Los símbolos que vienen de otro idioma" },
    { t: "p", x: "Estos son los más preguntados, porque el símbolo no sale del nombre en español. Aprendelos con su nombre de origen: así no se te olvidan." },
    { t: "tabla", cab: ["Elemento", "Símbolo", "Nombre de origen", "Idioma"], filas: [
      ["Sodio", "Na", "natrium", "latín"],
      ["Potasio", "K", "kalium", "latín"],
      ["Hierro", "Fe", "ferrum", "latín"],
      ["Cobre", "Cu", "cuprum", "latín"],
      ["Plata", "Ag", "argentum (de ahí viene el nombre de Argentina)", "latín"],
      ["Oro", "Au", "aurum", "latín"],
      ["Mercurio", "Hg", "hydrargyrum («agua plateada»)", "latín, del griego"],
      ["Plomo", "Pb", "plumbum", "latín"],
      ["Estaño", "Sn", "stannum", "latín"],
      ["Antimonio", "Sb", "stibium", "latín"],
      ["Azufre", "S", "sulphur", "latín"],
      ["Fósforo", "P", "phosphoros («portador de luz»)", "griego"],
      ["Nitrógeno", "N", "nitrogenium", "latín"],
      ["Wolframio (o tungsteno)", "W", "wolfram", "alemán"],
    ] },
    { t: "ej", x: "¿Por qué el potasio es **K** y no P? Porque P ya es el **fósforo**, y el símbolo del potasio viene de _kalium_. ¿Y por qué el sodio es **Na** y no S? Porque S es el **azufre** (_sulphur_) y el sodio viene de _natrium_. Si te sabés el nombre de origen, no los confundís." },
    { t: "h", x: "Los 44 elementos que tenés que dominar" },
    { t: "p", x: "Esta es tu lista de estudio. Tenés que poder escribir el símbolo si te dan el nombre y el nombre si te dan el símbolo, **con tildes en el nombre y con mayúscula y minúscula correctas en el símbolo**." },
    { t: "tabla", cab: ["Z", "Nombre", "Símbolo", "Tipo"], filas: [
      ["1", "hidrógeno", "H", "no metal"],
      ["2", "helio", "He", "gas noble"],
      ["3", "litio", "Li", "metal alcalino"],
      ["4", "berilio", "Be", "metal alcalinotérreo"],
      ["5", "boro", "B", "metaloide (térreos)"],
      ["6", "carbono", "C", "no metal (carbonoides)"],
      ["7", "nitrógeno", "N", "no metal (nitrogenoides)"],
      ["8", "oxígeno", "O", "no metal (calcógenos)"],
      ["9", "flúor", "F", "no metal (halógenos)"],
      ["10", "neón", "Ne", "gas noble"],
      ["11", "sodio", "Na", "metal alcalino"],
      ["12", "magnesio", "Mg", "metal alcalinotérreo"],
      ["13", "aluminio", "Al", "metal (térreos)"],
      ["14", "silicio", "Si", "metaloide (carbonoides)"],
      ["15", "fósforo", "P", "no metal (nitrogenoides)"],
      ["16", "azufre", "S", "no metal (calcógenos)"],
      ["17", "cloro", "Cl", "no metal (halógenos)"],
      ["18", "argón", "Ar", "gas noble"],
      ["19", "potasio", "K", "metal alcalino"],
      ["20", "calcio", "Ca", "metal alcalinotérreo"],
      ["22", "titanio", "Ti", "metal de transición"],
      ["24", "cromo", "Cr", "metal de transición"],
      ["25", "manganeso", "Mn", "metal de transición"],
      ["26", "hierro", "Fe", "metal de transición"],
      ["27", "cobalto", "Co", "metal de transición"],
      ["28", "níquel", "Ni", "metal de transición"],
      ["29", "cobre", "Cu", "metal de transición"],
      ["30", "zinc (o cinc)", "Zn", "metal de transición"],
      ["33", "arsénico", "As", "metaloide (nitrogenoides)"],
      ["35", "bromo", "Br", "no metal (halógenos), líquido"],
      ["36", "kriptón", "Kr", "gas noble"],
      ["47", "plata", "Ag", "metal de transición"],
      ["50", "estaño", "Sn", "metal (carbonoides)"],
      ["51", "antimonio", "Sb", "metaloide (nitrogenoides)"],
      ["53", "yodo", "I", "no metal (halógenos)"],
      ["54", "xenón", "Xe", "gas noble"],
      ["56", "bario", "Ba", "metal alcalinotérreo"],
      ["78", "platino", "Pt", "metal de transición"],
      ["79", "oro", "Au", "metal de transición"],
      ["80", "mercurio", "Hg", "metal de transición, líquido"],
      ["82", "plomo", "Pb", "metal (carbonoides)"],
      ["86", "radón", "Rn", "gas noble, radiactivo"],
      ["88", "radio", "Ra", "metal alcalinotérreo, radiactivo"],
      ["92", "uranio", "U", "metal, actínido (transición interna), radiactivo"],
    ] },
    { t: "h", x: "Cómo no confundirlos: agrupalos por letra" },
    { t: "lista", x: [
      "**C**: C carbono · Ca calcio · Cl cloro · Co cobalto · Cr cromo · Cu cobre.",
      "**S**: S azufre · Si silicio · Sn estaño · Sb antimonio.",
      "**N**: N nitrógeno · Na sodio · Ne neón · Ni níquel.",
      "**B**: B boro · Be berilio · Ba bario · Br bromo.",
      "**H y M**: H hidrógeno · He helio · Hg mercurio · Mg magnesio · Mn manganeso.",
      "**A**: Al aluminio · Ar argón · Ag plata · Au oro · As arsénico.",
      "**P y K**: P fósforo · Pb plomo · Pt platino · K potasio · Kr kriptón.",
      "**R**: Ra radio · Rn radón.",
    ] },
    { t: "ojo", x: "Las confusiones que más se repiten en los exámenes: **Ag** (plata) con **Au** (oro); **Mg** (magnesio) con **Mn** (manganeso); **K** (potasio) con **P** (fósforo); **S** (azufre) con **Na** (sodio) y **Sn** (estaño); **Co** (cobalto) con **Cu** (cobre). Escribí estas parejas en rojo en tu cuaderno." },
    { t: "h", x: "Leer los símbolos dentro de una fórmula" },
    { t: "ej", x: "En una fórmula, **cada letra mayúscula empieza un elemento nuevo** y los números pequeños de abajo dicen cuántos átomos hay. NaCl (sal de mesa): Na (sodio) y Cl (cloro), 2 elementos. H₂O (agua): H (hidrógeno) y O (oxígeno). CaCO₃ (carbonato de calcio): Ca (calcio), C (carbono) y O (oxígeno), 3 elementos. CO₂: C y O, **no** cobalto." },
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Nombres y símbolos de los elementos» con la fecha. Copiá las cinco reglas para escribir un símbolo y la tabla de los símbolos que vienen de otro idioma (elemento, símbolo y nombre de origen)." },
    { tipo: "escribir", x: "Hacé 44 fichas con papel cortado en rectángulos: de un lado el nombre (con tilde si lleva) y del otro el símbolo, con letra grande y cuidando mayúscula y minúscula. Guardalas con una liga; las vas a usar hasta el día de la prueba." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase la lista de elementos o la tabla periódica que usaron. Anotá en tu cuaderno de repaso los elementos que aparezcan allí y que no estén en la lista de 44, con su símbolo, y hacé una ficha para cada uno." },
    { tipo: "moverse", x: "Repaso de pie con las fichas: barajalas, leé el nombre en voz alta y decí el símbolo deletreándolo («hierro: efe mayúscula, e minúscula») antes de voltear la ficha. Las que fallés van a otra pila. Repetí esa pila caminando por la casa hasta acertarlas todas dos veces seguidas." },
    { tipo: "escribir", x: "Autoexamen escrito: tapá la columna de símbolos de la lista de 44 y escribí de memoria todos los símbolos en una hoja. Después tapá los nombres y escribí todos los nombres. Corregí con lapicero rojo y copiá cinco veces cada uno que fallaste." },
  ],
  practica: [
    simbolo("sodio", "Na", "Viene del latín natrium; la S es del azufre."),
    simbolo("potasio", "K", "Viene del latín kalium; la P es del fósforo."),
    simbolo("hierro", "Fe", "Viene del latín ferrum."),
    simbolo("cobre", "Cu", "Viene del latín cuprum; Co es el cobalto."),
    simbolo("estaño", "Sn", "Viene del latín stannum; Sb es el antimonio."),
    simbolo("azufre", "S", "Viene del latín sulphur."),
    { t: "completar", p: "El símbolo de la plata es ___.", r: ["Ag"], may: true,
      e: "**Ag**, del latín argentum. No la confundás con Au, que es el oro." },
    { t: "completar", p: "El símbolo del oro es ___.", r: ["Au"], may: true,
      e: "**Au**, del latín aurum. Ag es la plata." },
    { t: "completar", p: "El símbolo del mercurio es ___.", r: ["Hg"], may: true,
      e: "**Hg**, del latín hydrargyrum («agua plateada»), porque es un metal líquido y brillante." },
    { t: "completar", p: "El símbolo del plomo es ___.", r: ["Pb"], may: true,
      e: "**Pb**, del latín plumbum. P sola es el fósforo y Pt es el platino." },
    { t: "completar", p: "El elemento de símbolo Sb se llama ___.", r: ["antimonio"],
      e: "**Sb** es el **antimonio** (del latín stibium), un metaloide. No es el estaño, que es Sn." },
    { t: "completar", p: "El elemento de símbolo Co se llama ___.", r: ["cobalto"],
      e: "**Co** es el **cobalto**. El cobre es Cu y CO (las dos mayúsculas) es el monóxido de carbono." },
    { t: "completar", p: "El elemento de símbolo P se llama ___.", r: ["fósforo"],
      e: "**P** es el **fósforo** (lleva tilde). El potasio es K." },
    { t: "completar", p: "El elemento de símbolo Zn se llama ___.", r: ["zinc", "cinc"],
      e: "**Zn** es el **zinc** (también se escribe cinc), un metal de transición que se usa para galvanizar el hierro." },
    { t: "parejas", p: "Uní cada símbolo con el nombre de su elemento.",
      pares: [["C", "carbono"], ["Ca", "calcio"], ["Cl", "cloro"], ["Co", "cobalto"], ["Cr", "cromo"], ["Cu", "cobre"]],
      e: "Todos empiezan con C, por eso la segunda letra es la que decide: C carbono, Ca calcio, Cl cloro, Co cobalto, Cr cromo, Cu cobre (de cuprum)." },
    { t: "parejas", p: "Uní cada símbolo con su nombre.",
      pares: [["H", "hidrógeno"], ["He", "helio"], ["Hg", "mercurio"], ["Mg", "magnesio"], ["Mn", "manganeso"], ["Ni", "níquel"]],
      e: "H hidrógeno, He helio, Hg mercurio (de hydrargyrum), Mg magnesio, Mn manganeso y Ni níquel. Mg y Mn son la pareja que más se confunde." },
    { t: "vf", p: "«CO» es el símbolo del cobalto.", r: false,
      e: "**Falso.** El cobalto es **Co** (o minúscula). CO, con dos mayúsculas, son dos elementos: carbono y oxígeno (el monóxido de carbono)." },
    { t: "opcion", p: "¿Qué pareja nombre–símbolo es INCORRECTA?", o: ["potasio – P", "plata – Ag", "estaño – Sn", "nitrógeno – N"], r: 0,
      e: "El potasio es **K** (kalium); P es el fósforo. Las otras tres parejas están bien." },
    { t: "numero", p: "¿Cuántos elementos químicos distintos forman el bicarbonato de sodio, NaHCO₃?", r: 4,
      e: "Se cuentan las mayúsculas: **Na** (sodio), **H** (hidrógeno), **C** (carbono) y **O** (oxígeno): 4 elementos. El 3 es la cantidad de átomos de oxígeno, no de elementos." },
    { t: "numero", p: "¿Cuántos elementos químicos distintos hay en el permanganato de potasio, KMnO₄?", r: 3,
      e: "**K** (potasio), **Mn** (manganeso) y **O** (oxígeno): 3 elementos. Mn es un solo símbolo, porque la n es minúscula." },
  ],
};

// ── Tema 3 ──────────────────────────────────────────────────────────────────────────────────────────────

const USOS_Y_MINERIA = {
  id: "usos-y-mineria",
  titulo: "Fuentes y usos de los elementos; minería y ambiente",
  indicadores: [
    "Relaciona elementos químicos con aplicaciones y usos en diferentes actividades humanas (en agricultura, salud e industria).",
    "Relaciona la contaminación del agua y la degradación del suelo con actividades de extracción minera.",
    "Propone acciones sostenibles para disminuir la extracción de nuevos minerales.",
  ],
  materia: [
    { t: "h", x: "De dónde se obtienen los elementos" },
    { t: "p", x: "Casi ningún elemento se encuentra puro en la naturaleza: la mayoría están combinados en **minerales**, compuestos sólidos naturales de la corteza terrestre. Cuando un mineral tiene suficiente metal para que valga la pena extraerlo se llama **mena**. Pocos aparecen puros (**nativos**): el oro, la plata, el cobre, el platino, el azufre y el carbono (diamante y grafito)." },
    { t: "tabla", cab: ["Fuente", "Qué se obtiene", "Ejemplos"], filas: [
      ["Minerales de la corteza", "La mayoría de los metales", "Bauxita → aluminio; hematita y magnetita → hierro; calcopirita → cobre; galena → plomo; casiterita → estaño; cinabrio → mercurio"],
      ["Agua de mar y salinas", "Sodio y cloro (la sal, NaCl), magnesio, bromo", "Las salinas del golfo de Nicoya producen sal marina"],
      ["Aire", "Nitrógeno, oxígeno y argón", "Se separan enfriando el aire hasta volverlo líquido"],
      ["Salares (lagos de agua muy salada)", "Litio", "Bolivia, Chile y Argentina tienen las mayores reservas"],
      ["Gas natural", "Helio", "Pozos de gas natural"],
      ["Petróleo, carbón y seres vivos", "Carbono, hidrógeno, oxígeno, nitrógeno y azufre", "Combustibles, plásticos, abonos orgánicos"],
    ] },
    { t: "h", x: "Usos en la agricultura" },
    { t: "tabla", cab: ["Elemento", "Uso"], filas: [
      ["Nitrógeno (N)", "Fertilizantes (urea, nitrato de amonio): crecimiento de hojas y tallos; forma parte de las proteínas."],
      ["Fósforo (P)", "Fertilizantes (fosfatos): desarrollo de raíces, flores y frutos."],
      ["Potasio (K)", "Fertilizantes (cloruro de potasio): resistencia a enfermedades y sequía; calidad de los frutos."],
      ["Calcio (Ca)", "Cal agrícola (carbonato de calcio): corrige la acidez del suelo (encalado)."],
      ["Magnesio (Mg)", "Forma el centro de la molécula de clorofila; se agrega cuando las hojas se ponen amarillas por falta de él."],
      ["Azufre (S)", "Fungicidas y parte de algunos fertilizantes."],
      ["Cobre (Cu)", "Sulfato de cobre (caldo bordelés): fungicida en cultivos como el café y la papa."],
      ["Zinc, boro, hierro y manganeso", "Micronutrientes: la planta los necesita en cantidades muy pequeñas."],
    ] },
    { t: "p", x: "Los sacos de abono traen tres números, por ejemplo **10-30-10** o **15-15-15**: son los porcentajes de **nitrógeno, fósforo y potasio**, en ese orden (la fórmula **N-P-K**)." },
    { t: "h", x: "Usos en la salud" },
    { t: "tabla", cab: ["Elemento", "Uso"], filas: [
      ["Calcio (Ca)", "Forma huesos y dientes; suplementos de calcio."],
      ["Hierro (Fe)", "Forma parte de la hemoglobina, que transporta el oxígeno en la sangre; su falta causa anemia."],
      ["Yodo (I)", "Lo usa la glándula tiroides; la sal yodada previene el bocio. La povidona yodada desinfecta heridas."],
      ["Flúor (F)", "Como fluoruro, en pastas de dientes y en la sal: previene la caries."],
      ["Sodio (Na) y potasio (K)", "Electrolitos: impulsos nerviosos y contracción de los músculos; se reponen con sueros."],
      ["Cloro (Cl)", "Potabilización del agua (cloración) y desinfectantes como el «cloro» de la casa (hipoclorito)."],
      ["Oxígeno (O)", "Oxígeno medicinal para pacientes con problemas respiratorios."],
      ["Titanio (Ti)", "Prótesis e implantes: el cuerpo no lo rechaza y no se corroe."],
      ["Plata (Ag)", "Antibacteriano en vendajes y apósitos para heridas y quemaduras."],
      ["Bario (Ba)", "El sulfato de bario es el medio de contraste que se toma para radiografías del sistema digestivo."],
      ["Platino (Pt)", "Forma el cisplatino, un medicamento de quimioterapia contra el cáncer."],
      ["Litio (Li)", "Medicamento (carbonato de litio) para tratar el trastorno bipolar."],
      ["Zinc (Zn)", "Defensas del cuerpo; el óxido de zinc está en cremas contra rozaduras y en bloqueadores solares."],
    ] },
    { t: "p", x: "En Costa Rica, la sal de consumo se enriquece con **yodo** y **flúor** desde hace décadas: es una medida de salud pública contra el bocio y la caries." },
    { t: "h", x: "Usos en la industria" },
    { t: "tabla", cab: ["Elemento", "Uso"], filas: [
      ["Hierro (Fe)", "Acero (hierro con un poco de carbono): varillas, vigas, carros, herramientas."],
      ["Aluminio (Al)", "Latas, ventanas, aviones, papel aluminio: es liviano y resiste la corrosión."],
      ["Cobre (Cu)", "Cables eléctricos y tuberías: excelente conductor y dúctil."],
      ["Silicio (Si)", "Chips, celulares, computadoras y paneles solares; la arena (dióxido de silicio) sirve para hacer vidrio."],
      ["Litio (Li)", "Baterías de celulares, computadoras y carros eléctricos."],
      ["Plomo (Pb)", "Baterías de carro y blindaje contra la radiación. Ya no se usa en pinturas ni en gasolina porque es tóxico."],
      ["Zinc (Zn)", "Galvanizado: recubre el hierro para que no se oxide (las láminas de techo «de zinc»)."],
      ["Estaño (Sn)", "Soldadura de circuitos electrónicos; hojalata (hierro recubierto de estaño) para latas."],
      ["Oro (Au) y plata (Ag)", "Joyería y contactos de aparatos electrónicos."],
      ["Cromo (Cr) y níquel (Ni)", "Acero inoxidable y cromado de piezas."],
      ["Wolframio (W)", "Filamentos de los bombillos incandescentes (resiste temperaturas altísimas)."],
      ["Neón (Ne), argón (Ar), helio (He)", "Letreros luminosos rojo anaranjado (Ne); relleno de bombillos y soldadura (Ar); globos y enfriamiento de los equipos de resonancia magnética (He)."],
      ["Sodio (Na)", "Lámparas de alumbrado público de luz amarilla (vapor de sodio)."],
      ["Carbono (C)", "Grafito de los lápices, diamante para cortar, combustibles."],
      ["Uranio (U)", "Combustible de las centrales nucleares."],
    ] },
    { t: "ej", x: "Cómo razonar una pregunta de usos. ¿Por qué los cables eléctricos son de cobre y no de hierro? Porque el cobre **conduce mucho mejor** la electricidad, es **dúctil** (se hace hilo) y se oxida menos. En el examen suelen darte el uso y pedirte el elemento, o al revés; pensá siempre en la **propiedad** que explica el uso." },
    { t: "h", x: "Extracción minera: cómo contamina el agua" },
    { t: "p", x: "La **minería metálica** extrae rocas para obtener metales como oro, plata o cobre. En la **minería a cielo abierto** se quita la vegetación y el suelo y se excavan tajos enormes: para sacar unos pocos gramos de oro se mueve **una tonelada o más de roca**." },
    { t: "lista", x: [
      "**Cianuro**: se rocía sobre la roca molida para disolver el oro (lixiviación). Es muy tóxico: si se derrama o se filtra de las pilas y lagunas de desechos, mata peces y contamina ríos y mantos acuíferos.",
      "**Mercurio**: en la minería artesanal e ilegal se mezcla con el oro para formar una **amalgama** que luego se quema. El vapor es tóxico y el mercurio que llega al agua se transforma en **metilmercurio**, que se acumula en los peces y llega a las personas por la cadena alimentaria; daña el sistema nervioso.",
      "**Drenaje ácido**: la roca removida que contiene sulfuros reacciona con el aire y el agua, forma ácido y este disuelve **metales pesados** (plomo, arsénico, cadmio) que la lluvia arrastra a los ríos.",
      "**Sedimentos**: la tierra removida enturbia los ríos, tapa la luz y entierra los hábitats acuáticos.",
      "Se gastan enormes cantidades de agua en el proceso, que luego sale contaminada.",
    ] },
    { t: "h", x: "Extracción minera: cómo degrada el suelo" },
    { t: "lista", x: [
      "Se elimina la **cubierta vegetal** (deforestación) y la **capa fértil** del suelo.",
      "Aumentan la **erosión** y los deslizamientos porque ya no hay raíces que sostengan la tierra.",
      "El terreno queda cubierto de escombros y de **relaves** (roca molida mezclada con químicos), que no sirven para cultivar.",
      "El suelo contaminado con **metales pesados**, cianuro o mercurio pierde la fertilidad por muchos años.",
      "Se pierde la biodiversidad y el paisaje queda transformado para siempre (tajos y lagunas de desechos).",
    ] },
    { t: "h", x: "El caso de Costa Rica" },
    { t: "p", x: "A finales de **2010**, Costa Rica reformó el Código de Minería con la **Ley 8904**: el país se declaró **libre de minería metálica a cielo abierto** (no se dan permisos nuevos) y **se prohibió el uso de cianuro y mercurio** en la minería metálica. Ese mismo año los tribunales anularon la concesión del proyecto minero de **Crucitas**, en Cutris de San Carlos, cerca del río San Juan. Hoy el problema principal es la **minería ilegal de oro** en Crucitas y otras zonas, que usa mercurio y contamina ríos y suelos. En el país también hubo minería de oro histórica en los **Montes del Aguacate** y en **Abangares** (Guanacaste)." },
    { t: "h", x: "Acciones sostenibles para extraer menos minerales nuevos" },
    { t: "lista", x: [
      "**Reducir**: comprar solo lo necesario y preferir productos duraderos y reparables; no cambiar el celular cada año si funciona.",
      "**Reutilizar**: usar otra vez el mismo objeto sin transformarlo: frascos, herramientas, aparatos que se donan o se venden usados.",
      "**Reparar** aparatos y muebles de metal en vez de botarlos.",
      "**Reciclar metales**: el aluminio, el cobre, el hierro y el acero se pueden reciclar muchas veces sin perder calidad. Reciclar aluminio ahorra cerca del **95 %** de la energía que se necesita para producirlo a partir de bauxita.",
      "**Minería urbana**: recuperar oro, plata, cobre y otros metales de los **residuos electrónicos** (celulares, computadoras), entregándolos en centros de acopio autorizados en vez de botarlos.",
      "**Separar en la fuente**: latas, chatarra, pilas y baterías van a centros de acopio, no a la basura común (las pilas tienen metales pesados).",
      "**Sustituir** materiales escasos o tóxicos: termómetros digitales en vez de los de mercurio; bombillos LED.",
      "**Cumplir y apoyar** la **Ley 8839 para la Gestión Integral de Residuos** (2010) y las campañas de recolección de residuos electrónicos de municipalidades y colegios.",
    ] },
    { t: "ej", x: "Ejemplo de propuesta completa (así se contesta un desarrollo). Problema: cada año se botan miles de celulares viejos. Acción: organizar en el colegio una campaña de recolección de celulares y entregarlos a un gestor autorizado de residuos electrónicos. Por qué disminuye la extracción: el oro, la plata y el cobre de esos celulares se recuperan y se vuelven a usar, y así no hay que sacarlos de una mina nueva." },
    { t: "ojo", x: "**Reciclar** no es lo mismo que **reutilizar**: reutilizar es usar el mismo objeto otra vez; reciclar es transformar el material para hacer algo nuevo (la lata se funde y se hace otra lata). Y **quemar** cables o basura **no** es una acción sostenible: contamina el aire y daña la salud." },
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Usos de los elementos y minería» con la fecha. Copiá las tres tablas de usos (agricultura, salud e industria) con al menos 6 elementos de cada una, con su símbolo." },
    { tipo: "resumir", x: "En 10 a 12 líneas resumí cómo la minería contamina el agua y degrada el suelo. Tienen que aparecer estas palabras subrayadas: cianuro, mercurio, metilmercurio, drenaje ácido, sedimentos, deforestación, erosión y relaves. Terminá con dos líneas sobre la Ley 8904." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase lo que vieron de minería (Crucitas, la ley de minería, contaminación) y de usos de los elementos. Anotá las fechas de esas clases y copiá en tu cuaderno de repaso cualquier ejemplo que haya usado tu profe y que aquí no aparezca." },
    { tipo: "moverse", x: "Recorré la casa con el cuaderno en la mano y encontrá 10 objetos que tengan un elemento químico (por ejemplo: lata → aluminio; cable → cobre; sal → sodio, cloro, yodo y flúor; pasta de dientes → flúor; lápiz → carbono). Hacé una tabla de cuatro columnas: objeto, elemento, símbolo y área (salud, agricultura o industria)." },
    { tipo: "escribir", x: "Escribí 3 acciones sostenibles concretas que tu familia pueda hacer este mes para disminuir la extracción de minerales. Para cada una: qué se hace, quién lo hace, qué metal se ahorra o se recupera y por qué eso disminuye la extracción." },
  ],
  practica: [
    { t: "opcion", p: "¿Qué elemento se usa en los cables eléctricos porque conduce muy bien la electricidad y se puede estirar en hilos?", o: ["cobre", "hierro", "plomo", "azufre"], r: 0,
      e: "El **cobre** es excelente conductor y muy dúctil. El hierro conduce peor y se oxida; el plomo es tóxico y el azufre es un no metal aislante." },
    { t: "opcion", p: "La sal de consumo en Costa Rica se enriquece con dos elementos para prevenir el bocio y la caries. ¿Cuáles son?", o: ["yodo y flúor", "hierro y calcio", "sodio y cloro", "potasio y fósforo"], r: 0,
      e: "El **yodo** previene el bocio y el **flúor** (como fluoruro) previene la caries. El sodio y el cloro forman la sal misma; no se le agregan." },
    { t: "parejas", p: "Uní cada elemento con su uso.",
      pares: [["Litio", "baterías de celulares y carros eléctricos"], ["Silicio", "chips y paneles solares"], ["Titanio", "prótesis e implantes"], ["Hierro", "hemoglobina de la sangre"], ["Nitrógeno", "fertilizantes para hojas y tallos"], ["Bario", "contraste para radiografías del sistema digestivo"]],
      e: "Litio: baterías. Silicio: semiconductor de chips y paneles. Titanio: implantes porque el cuerpo no lo rechaza. Hierro: hemoglobina. Nitrógeno: fertilizantes. Bario: sulfato de bario como medio de contraste." },
    { t: "parejas", p: "Indicá en qué área se usa cada aplicación.",
      pares: [["Cal agrícola para corregir la acidez del suelo", "agricultura"], ["Cloración del agua potable", "salud"], ["Galvanizado de láminas de techo con zinc", "industria"], ["Abono con fórmula 10-30-10", "agricultura"], ["Suplemento de hierro contra la anemia", "salud"], ["Acero para varillas de construcción", "industria"]],
      e: "Cal y abonos: agricultura. Cloración del agua y hierro contra la anemia: salud. Galvanizado y acero: industria." },
    { t: "completar", p: "El mineral del que se obtiene el aluminio se llama ___.", r: ["bauxita"],
      e: "El aluminio se obtiene de la **bauxita**. La hematita y la magnetita son minerales de hierro; la galena, de plomo." },
    { t: "vf", p: "Reciclar aluminio gasta casi la misma energía que producirlo a partir de bauxita.", r: false,
      e: "**Falso.** Reciclar aluminio ahorra cerca del **95 %** de la energía. Por eso reciclarlo es una de las mejores acciones para no extraer más bauxita." },
    { t: "opcion", p: "En un saco de abono con la fórmula 15-15-15, los números indican el porcentaje de:", o: ["nitrógeno, fósforo y potasio", "nitrógeno, oxígeno y carbono", "calcio, magnesio y azufre", "hierro, zinc y cobre"], r: 0,
      e: "La fórmula de los abonos es **N-P-K**: nitrógeno, fósforo y potasio, en ese orden." },
    { t: "opcion", p: "Un agricultor descubre que el suelo de su finca es muy ácido. ¿Qué debe aplicarle?", o: ["cal agrícola (carbonato de calcio)", "sulfato de cobre", "cloro de la casa", "abono solo de nitrógeno"], r: 0,
      e: "La **cal agrícola** (carbonato de calcio) neutraliza la acidez del suelo. El sulfato de cobre es fungicida y el nitrógeno es nutriente, pero no corrigen la acidez." },
    { t: "opcion", p: "¿Qué gas noble se usa en los letreros luminosos de color rojo anaranjado?", o: ["neón", "argón", "radón", "helio"], r: 0,
      e: "El **neón** da la luz rojo anaranjada de los letreros. El argón rellena bombillos; el radón es radiactivo; el helio se usa en globos." },
    { t: "opcion", p: "En la minería de oro a gran escala, el cianuro se usa para:", o: ["disolver el oro de la roca molida", "fertilizar el suelo después de cerrar la mina", "romper la roca con explosiones", "purificar el agua de los ríos cercanos"], r: 0,
      e: "El cianuro **disuelve el oro** de la roca molida (lixiviación). Es muy tóxico: si se escapa, contamina ríos y acuíferos." },
    { t: "opcion", p: "¿Por qué la minería ilegal de oro contamina los ríos con mercurio?", o: ["porque mezclan el mercurio con el oro para separarlo y luego lo queman o lo botan con los desechos", "porque el oro se convierte en mercurio cuando se moja", "porque el mercurio se usa para cortar la roca", "porque el mercurio se forma al quemar la madera del bosque"], r: 0,
      e: "El mercurio forma una **amalgama** con el oro; al quemarla el vapor se esparce y los restos llegan al agua. El oro no se transforma en mercurio." },
    { t: "vf", p: "El metilmercurio se acumula en los peces y puede llegar a las personas que los comen.", r: true,
      e: "**Verdadero.** El mercurio en el agua se transforma en metilmercurio, que se acumula en los peces y pasa a las personas por la cadena alimentaria; daña el sistema nervioso." },
    { t: "completar", p: "Cuando la roca con sulfuros removida por una mina reacciona con el aire y el agua, se forma un líquido ácido que disuelve metales pesados. Ese problema se llama drenaje ___.", r: ["ácido"],
      e: "Es el **drenaje ácido** de mina: arrastra plomo, arsénico y otros metales pesados hacia los ríos." },
    { t: "opcion", p: "¿Cuál es una forma de degradación del suelo causada por la minería a cielo abierto?", o: ["la eliminación de la capa vegetal y la erosión", "el aumento de la fertilidad por los relaves", "la formación de nuevos bosques en los tajos", "el enfriamiento del suelo por el cianuro"], r: 0,
      e: "La mina **quita la vegetación y la capa fértil**, y el suelo desnudo se erosiona. Los relaves contaminan, no fertilizan." },
    { t: "vf", p: "Desde la reforma al Código de Minería de 2010 (Ley 8904), en Costa Rica no se dan permisos nuevos para minería metálica a cielo abierto.", r: true,
      e: "**Verdadero.** La Ley 8904 declaró al país libre de minería metálica a cielo abierto y prohibió el cianuro y el mercurio en la minería metálica." },
    { t: "opcion", p: "Usar un frasco de vidrio vacío para guardar clavos es un ejemplo de:", o: ["reutilizar", "reciclar", "reducir", "extraer"], r: 0,
      e: "Es **reutilizar**: el mismo objeto se usa otra vez sin transformarlo. Reciclar sería fundir el vidrio para hacer otro frasco." },
    { t: "opcion", p: "¿Cuál es una acción sostenible que ayuda a disminuir la extracción de minerales nuevos?", o: ["entregar los celulares viejos a un gestor autorizado para recuperar sus metales", "botar las pilas usadas en la basura común", "quemar cables en el patio para sacarles el cobre", "comprar un celular nuevo cada año aunque el anterior funcione"], r: 0,
      e: "Entregar los celulares a un **gestor autorizado** permite recuperar oro, plata y cobre sin abrir minas nuevas. Quemar cables contamina el aire y no es sostenible." },
    { t: "ordenar", p: "Ordená cómo llega el mercurio de una mina ilegal hasta una persona.",
      x: ["Los mineros mezclan mercurio con el oro para formar una amalgama.", "El mercurio sobrante cae al río con los desechos y la lluvia.", "En el agua, el mercurio se transforma en metilmercurio.", "Los peces acumulan el metilmercurio en sus tejidos.", "Una persona come esos peces y el mercurio daña su sistema nervioso."],
      e: "Amalgama → mercurio al río → metilmercurio → se acumula en los peces → llega a las personas por la cadena alimentaria." },
    { t: "abierta", p: "En tu cuaderno: proponé dos acciones sostenibles para disminuir la extracción de nuevos minerales, una en tu casa y otra en tu colegio o comunidad. Para cada una explicá qué se hace, qué metal se ahorra o se recupera y por qué eso reduce la extracción.",
      guia: [
        "La acción 1 es concreta y realista para la casa.",
        "La acción 2 es concreta y realista para el colegio o la comunidad.",
        "Nombra el metal o material que se ahorra o se recupera en cada acción.",
        "Explica por qué cada acción reduce la extracción (el metal se recupera o se deja de demandar).",
      ],
      modelo: "1) En mi casa: separar las latas de aluminio y llevarlas cada mes al centro de acopio. El aluminio se funde para hacer latas nuevas, así que no hay que sacar más bauxita de una mina y además se ahorra cerca del 95 % de la energía. 2) En el colegio: hacer una campaña para recoger celulares y cargadores viejos y entregarlos a un gestor autorizado de residuos electrónicos. De ahí se recuperan oro, plata y cobre, que ya no hay que extraer de minas nuevas.",
      lineas: 10 },
  ],
};

// ── Tema 4 ──────────────────────────────────────────────────────────────────────────────────────────────

const ATOMO = {
  id: "atomo",
  titulo: "El átomo: Z, A, protones, neutrones, electrones, iones e isótopos",
  indicadores: [
    "Determina la cantidad de protones, neutrones y electrones de un átomo, utilizando el número atómico (Z) y el número másico (A).",
    "Diferencia los átomos neutros, cationes, aniones, a partir de la cantidad de protones y electrones que presentan.",
  ],
  materia: [
    { t: "h", x: "Las partículas del átomo" },
    { t: "tabla", cab: ["Partícula", "Dónde está", "Carga", "Masa aproximada"], filas: [
      ["Protón (p)", "En el núcleo", "Positiva (+1)", "1 u"],
      ["Neutrón (n)", "En el núcleo", "Sin carga (0)", "1 u"],
      ["Electrón (e)", "Alrededor del núcleo, en niveles de energía", "Negativa (−1)", "Casi nada: unas 1836 veces menos que un protón"],
    ] },
    { t: "p", x: "Casi toda la masa del átomo está en el **núcleo**, donde están los protones y los neutrones. Los electrones se mueven alrededor, en niveles de energía, y son los que se ganan o se pierden en las reacciones químicas." },
    { t: "h", x: "Número atómico (Z) y número másico (A)" },
    { t: "lista", x: [
      "**Z = número atómico = cantidad de protones.** Identifica al elemento: todo átomo con 6 protones es carbono. Si cambia Z, cambia el elemento.",
      "**A = número másico = protones + neutrones.** Siempre es un número entero.",
      "**Neutrones: n = A − Z.**",
      "En un **átomo neutro**, la cantidad de electrones es igual a la de protones: **e = Z**.",
    ] },
    { t: "p", x: "**Notación de un isótopo.** Se escribe el símbolo con el **número másico A arriba a la izquierda** y el **número atómico Z abajo a la izquierda**: ²³₁₁Na es sodio con A = 23 y Z = 11. Si el átomo es un ion, la **carga** va **arriba a la derecha** (Na⁺, Cl⁻). También se escribe con el nombre y A: «sodio-23» o «Na-23». A veces se omite Z (²³Na), porque el símbolo ya dice cuál es el elemento y Z se busca en la tabla. **El número de arriba siempre es A y el de abajo siempre es Z.**" },
    { t: "svg", x: SVG_NOTACION, alt: "Notación del sodio-23: el símbolo Na con el 23 arriba a la izquierda (A, número másico, protones más neutrones), el 11 abajo a la izquierda (Z, número atómico, cantidad de protones) y un recuadro arriba a la derecha donde va la carga si es ion. Abajo: 11 protones, 23 menos 11 igual a 12 neutrones y 11 electrones." },
    { t: "ej", x: "Ejemplo 1. ³⁵₁₇Cl (cloro-35, átomo neutro). Protones: p = Z = **17**. Neutrones: n = A − Z = 35 − 17 = **18**. Electrones: como es neutro, e = Z = **17**." },
    { t: "ej", x: "Ejemplo 2 (al revés). Un átomo neutro tiene 26 protones y 30 neutrones. Z = 26 → en la tabla es el **hierro (Fe)**. A = p + n = 26 + 30 = **56**. Electrones = 26. Se escribe ⁵⁶₂₆Fe." },
    { t: "ojo", x: "Errores típicos: **confundir A con Z** (A es el número más grande, salvo en el hidrógeno-1, donde A = Z = 1); **sumar** en vez de restar para sacar los neutrones; y usar la **masa atómica con decimales** de la tabla como si fuera A. A es un entero: solo redondeás la masa de la tabla cuando te piden el isótopo más común y no te dan A." },
    { t: "h", x: "Iones: cationes y aniones" },
    { t: "p", x: "Un **ion** es un átomo que **ganó o perdió electrones** y por eso tiene carga. **Los protones nunca cambian** en un ion (si cambiaran, sería otro elemento) y **los neutrones tampoco**. La carga se escribe arriba a la derecha: Na⁺, Ca²⁺, Al³⁺, Cl⁻, O²⁻." },
    { t: "tabla", cab: ["", "Átomo neutro", "Catión", "Anión"], filas: [
      ["Qué pasó", "No ganó ni perdió electrones", "Perdió electrones", "Ganó electrones"],
      ["Carga", "0", "Positiva (+)", "Negativa (−)"],
      ["Electrones", "e = Z", "e = Z − carga", "e = Z + carga (el número de la carga)"],
      ["Comparación", "protones = electrones", "protones > electrones", "protones < electrones"],
      ["Quiénes lo forman", "—", "Sobre todo los metales", "Sobre todo los no metales"],
      ["Ejemplo", "Na: 11 p y 11 e", "Na⁺: 11 p y 10 e", "Cl⁻: 17 p y 18 e"],
    ] },
    { t: "ej", x: "Ejemplo 3. ⁴⁰₂₀Ca²⁺. Protones = Z = **20**. Neutrones = 40 − 20 = **20**. La carga 2+ dice que **perdió 2 electrones**: e = 20 − 2 = **18**. Es un **catión**." },
    { t: "ej", x: "Ejemplo 4. ³²₁₆S²⁻. Protones = **16**. Neutrones = 32 − 16 = **16**. La carga 2− dice que **ganó 2 electrones**: e = 16 + 2 = **18**. Es un **anión**." },
    { t: "ej", x: "Ejemplo 5 (al revés). Una especie tiene 13 protones y 10 electrones. Z = 13 → **aluminio**. Tiene 3 electrones menos que protones → carga **3+** → es el catión **Al³⁺**." },
    { t: "ojo", x: "El error más común: creer que un catión es positivo porque **ganó** algo positivo. Un catión es positivo porque **perdió electrones** (cargas negativas); los protones no cambian. Truco: la **t** de ca**t**ión parece un signo **+**; la **n** de a**n**ión es de **n**egativo." },
    { t: "h", x: "Isótopos" },
    { t: "p", x: "Los **isótopos** son átomos del **mismo elemento** (mismo Z, mismos protones) con **distinto número de neutrones**, y por eso con **distinto A**. Tienen las mismas propiedades químicas, pero distinta masa. Algunos son estables y otros son radiactivos (se llaman **radioisótopos**)." },
    { t: "tabla", cab: ["Isótopo", "Z (protones)", "A", "Neutrones (A − Z)", "Dato"], filas: [
      ["Hidrógeno-1 (protio)", "1", "1", "0", "El más abundante"],
      ["Hidrógeno-2 (deuterio)", "1", "2", "1", "Estable; forma el «agua pesada»"],
      ["Hidrógeno-3 (tritio)", "1", "3", "2", "Radiactivo"],
      ["Carbono-12", "6", "12", "6", "El más abundante"],
      ["Carbono-13", "6", "13", "7", "Estable"],
      ["Carbono-14", "6", "14", "8", "Radiactivo; sirve para fechar restos de seres vivos"],
      ["Cloro-35", "17", "35", "18", "Estable, el más abundante"],
      ["Cloro-37", "17", "37", "20", "Estable"],
      ["Cobalto-60", "27", "60", "33", "Radiactivo artificial; radioterapia y esterilización"],
      ["Yodo-131", "53", "131", "78", "Radiactivo; tratamientos de la tiroides"],
      ["Uranio-235", "92", "235", "143", "Combustible de los reactores nucleares"],
      ["Uranio-238", "92", "238", "146", "El más abundante del uranio natural"],
    ] },
    { t: "ej", x: "Ejemplo 6. ¿Son isótopos ¹⁴₆C y ¹⁴₇N? **No**: tienen el mismo A, pero distinto Z, así que son elementos diferentes (carbono y nitrógeno). Para ser isótopos tienen que tener el **mismo Z** y distinto A." },
    { t: "ojo", x: "**Isótopo no es lo mismo que ion.** En un isótopo cambian los **neutrones** (cambia A); en un ion cambian los **electrones** (cambia la carga). En ninguno de los dos cambian los protones." },
    { t: "p", x: "Valores de Z que conviene tener a mano: H 1, He 2, C 6, N 7, O 8, F 9, Na 11, Mg 12, Al 13, P 15, S 16, Cl 17, K 19, Ca 20, Fe 26, Cu 29, Zn 30, Br 35, Ag 47, I 53, Au 79, Hg 80, Pb 82, U 92. Si en la prueba no hay tabla periódica, el enunciado te da Z." },
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Z, A, protones, neutrones y electrones» con la fecha. Copiá dentro de un recuadro las fórmulas: p = Z; A = p + n; n = A − Z; átomo neutro: e = Z; catión: e = Z − carga; anión: e = Z + carga. Debajo copiá la tabla de átomo neutro, catión y anión." },
    { tipo: "escribir", x: "Hacé una tabla de 6 columnas (especie, Z, A, protones, neutrones, electrones) y resolvé estas 12 especies mostrando la resta de los neutrones: ¹²₆C, ¹⁶₈O, ²⁷₁₃Al, ³⁹₁₉K, ⁵⁶₂₆Fe, ¹⁹⁷₇₉Au, ²³₁₁Na⁺, ²⁴₁₂Mg²⁺, ¹⁹₉F⁻, ¹⁶₈O²⁻, ²⁷₁₃Al³⁺ y ¹²⁷₅₃I⁻. Al final escribí al lado de cada una si es átomo neutro, catión o anión." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase los ejercicios de Z y A que hicieron. Tapá las respuestas, rehacé en limpio tres de ellos en tu cuaderno de repaso y compará con lo que tenías. Si alguna no coincide, encontrá cuál de las dos está mal y por qué." },
    { tipo: "resumir", x: "En 6 a 8 líneas explicá la diferencia entre átomo neutro, catión, anión e isótopo, con un ejemplo numérico de cada uno (protones, neutrones y electrones)." },
    { tipo: "moverse", x: "Escribí en hojas grandes PROTONES, NEUTRONES y ELECTRONES y pegalas en tres paredes distintas. Escribí 8 especies en papelitos (por ejemplo ³⁵₁₇Cl⁻, ⁴⁰₂₀Ca²⁺, ¹⁴₆C), sacá uno, caminá a cada hoja y decí en voz alta cuántas partículas de ese tipo tiene y cómo lo calculaste. Hacé los 8 papelitos." },
  ],
  practica: [
    { t: "opcion", p: "El número atómico (Z) indica la cantidad de:", o: ["protones del núcleo", "neutrones del núcleo", "protones más neutrones", "niveles de energía del átomo"], r: 0,
      e: "**Z = protones.** Protones más neutrones es A (número másico)." },
    { t: "opcion", p: "El número másico (A) de un átomo es:", o: ["la suma de sus protones y neutrones", "la cantidad de sus electrones", "la resta de protones menos neutrones", "la masa atómica con decimales que trae la tabla"], r: 0,
      e: "**A = p + n**, y es un número entero. La masa atómica de la tabla es un promedio con decimales." },
    { t: "numero", p: "¿Cuántos neutrones tiene un átomo de ²⁷₁₃Al?", r: 14,
      e: "n = A − Z = 27 − 13 = **14**." },
    { t: "numero", p: "¿Cuántos electrones tiene un átomo neutro de ³⁹₁₉K?", r: 19,
      e: "En un átomo neutro e = Z = **19**. El 39 es A y no se usa para los electrones." },
    { t: "numero", p: "¿Cuántos neutrones tiene el ⁵⁶₂₆Fe?", r: 30,
      e: "n = 56 − 26 = **30**." },
    { t: "numero", p: "¿Cuántos protones tiene el ion ³⁵₁₇Cl⁻?", r: 17,
      e: "Los protones no cambian en un ion: p = Z = **17**." },
    { t: "numero", p: "¿Cuántos electrones tiene el ion ³⁵₁₇Cl⁻?", r: 18,
      e: "Carga 1− → ganó 1 electrón: e = 17 + 1 = **18**." },
    { t: "numero", p: "¿Cuántos electrones tiene el ion Mg²⁺, si el magnesio tiene Z = 12?", r: 10,
      e: "Carga 2+ → perdió 2 electrones: e = 12 − 2 = **10**." },
    { t: "numero", p: "¿Cuántos electrones tiene el ion N³⁻, si el nitrógeno tiene Z = 7?", r: 10,
      e: "Carga 3− → ganó 3 electrones: e = 7 + 3 = **10**." },
    { t: "numero", p: "Un átomo neutro tiene 35 protones y 44 neutrones. ¿Cuál es su número másico?", r: 79,
      e: "A = p + n = 35 + 44 = **79**. Es el bromo-79 (Z = 35)." },
    { t: "numero", p: "El uranio-235 tiene Z = 92. ¿Cuántos neutrones tiene?", r: 143,
      e: "En «uranio-235» el 235 es A: n = 235 − 92 = **143**." },
    { t: "numero", p: "¿Cuántos neutrones tiene el carbono-14, si Z = 6?", r: 8,
      e: "n = 14 − 6 = **8**. El carbono-12 tiene 6 neutrones; por eso son isótopos." },
    { t: "opcion", p: "Una especie tiene 26 protones y 23 electrones. ¿Qué es?", o: ["un catión con carga 3+", "un anión con carga 3−", "un catión con carga 2+", "un átomo neutro"], r: 0,
      e: "Tiene 3 electrones menos que protones: perdió 3 → **catión 3+** (es el Fe³⁺)." },
    { t: "opcion", p: "¿Cuál de estas especies es un anión?", o: ["una con 9 protones y 10 electrones", "una con 11 protones y 10 electrones", "una con 12 protones y 12 electrones", "una con 20 protones y 18 electrones"], r: 0,
      e: "Un anión tiene **más electrones que protones**: 9 p y 10 e (es el F⁻). 11/10 y 20/18 son cationes; 12/12 es neutro." },
    { t: "vf", p: "Un catión se forma cuando un átomo gana protones.", r: false,
      e: "**Falso.** Un catión se forma cuando el átomo **pierde electrones**. Los protones no cambian; si cambiaran, sería otro elemento." },
    { t: "completar", p: "Un átomo neutro con 11 protones pierde 1 electrón. La especie que se forma se llama ___.", r: ["catión", "un catión"],
      e: "Al perder un electrón queda con carga positiva: es un **catión** (Na⁺)." },
    { t: "opcion", p: "¿Cuál pareja corresponde a isótopos?", o: ["¹²₆C y ¹³₆C", "¹⁴₆C y ¹⁴₇N", "²³₁₁Na y ²³₁₁Na⁺", "⁴⁰₁₈Ar y ⁴⁰₂₀Ca"], r: 0,
      e: "Los isótopos tienen **el mismo Z y distinto A**: ¹²₆C y ¹³₆C. ¹⁴C y ¹⁴N, o ⁴⁰Ar y ⁴⁰Ca, tienen distinto Z (son otros elementos); Na y Na⁺ solo difieren en electrones (átomo e ion)." },
    { t: "vf", p: "Dos isótopos del mismo elemento tienen igual número de protones y diferente número de neutrones.", r: true,
      e: "**Verdadero.** Esa es la definición de isótopo: mismo Z, distinto número de neutrones y por eso distinto A." },
    { t: "parejas", p: "Uní cada especie con la cantidad de electrones que tiene.",
      pares: [["Na⁺ (Z = 11)", "10"], ["Ca²⁺ (Z = 20)", "18"], ["S²⁻ (Z = 16)", "18"], ["Al neutro (Z = 13)", "13"], ["F⁻ (Z = 9)", "10"], ["Zn²⁺ (Z = 30)", "28"]],
      e: "Na⁺: 11 − 1 = 10. Ca²⁺: 20 − 2 = 18. S²⁻: 16 + 2 = 18. Al neutro: 13. F⁻: 9 + 1 = 10. Zn²⁺: 30 − 2 = 28." },
    { t: "numero", p: "Un ion X²⁺ tiene 18 electrones y 20 neutrones. ¿Cuál es su número másico?", r: 40,
      e: "Si perdió 2 electrones y le quedan 18, tenía 20: **p = 20**. A = p + n = 20 + 20 = **40** (es el ⁴⁰Ca²⁺)." },
  ],
};

// ── Tema 5 ──────────────────────────────────────────────────────────────────────────────────────────────

const RADIACTIVIDAD = {
  id: "radiactividad",
  titulo: "Radiactividad: radiaciones alfa, beta y gamma; natural y artificial",
  indicadores: [
    "Reconoce el concepto de radiactividad y las características de las radiaciones alfa, beta y gamma.",
    "Diferencia la radiactividad natural y artificial, considerando sus características y las formas de producción de la radiactividad artificial estudiadas.",
  ],
  materia: [
    { t: "h", x: "Qué es la radiactividad" },
    { t: "p", x: "La **radiactividad** es la **emisión espontánea de radiaciones desde el núcleo** de átomos **inestables**. Un núcleo es inestable cuando tiene demasiados protones o neutrones, o cuando es muy grande; para volverse más estable se transforma y en el proceso libera partículas y energía. Esos átomos se llaman **radioisótopos**. Cuando un núcleo emite radiación alfa o beta se convierte en **otro elemento**." },
    { t: "p", x: "**Historia.** En **1896**, **Henri Becquerel** descubrió que las sales de **uranio** velaban placas fotográficas aunque estuvieran guardadas en la oscuridad. **Marie Curie** y **Pierre Curie** le dieron el nombre de «radiactividad» y en 1898 descubrieron dos elementos nuevos, el **polonio** y el **radio**. Los tres recibieron el Premio Nobel de Física en 1903. **Ernest Rutherford** identificó y nombró las radiaciones **alfa** y **beta**; la **gamma** la descubrió Paul Villard en 1900." },
    { t: "h", x: "Las tres radiaciones" },
    { t: "tabla", cab: ["", "Alfa (α)", "Beta (β)", "Gamma (γ)"], filas: [
      ["Qué es", "Partícula formada por 2 protones y 2 neutrones (un núcleo de helio)", "Un electrón de alta velocidad que sale del núcleo", "Onda electromagnética de muy alta energía (como la luz, pero invisible y mucho más energética)"],
      ["Carga", "+2", "−1", "0 (sin carga)"],
      ["Masa", "4 u (la mayor)", "Muy pequeña (la de un electrón)", "Sin masa"],
      ["Velocidad", "La más lenta de las tres", "Rápida, cercana a la de la luz", "La de la luz"],
      ["Poder de penetración", "El menor: la detienen una hoja de papel, la piel o unos centímetros de aire", "Medio: atraviesa el papel; la detiene una lámina de aluminio de unos milímetros, el plástico o la madera", "El mayor: atraviesa el cuerpo; se reduce con varios centímetros de plomo o un muro grueso de concreto"],
      ["Poder de ionización (daño al chocar con la materia)", "El mayor: muy peligrosa si se respira o se traga", "Medio", "El menor, pero llega muy adentro del cuerpo"],
      ["En un campo eléctrico", "Se desvía hacia la placa negativa", "Se desvía hacia la placa positiva, más que la alfa", "No se desvía"],
      ["Cambio en el núcleo", "Z baja 2 y A baja 4", "Z sube 1 y A no cambia (un neutrón se convierte en protón)", "Z y A no cambian: solo pierde energía"],
    ] },
    { t: "svg", x: SVG_PENETRACION, alt: "Esquema de penetración: desde una fuente salen tres flechas. La alfa se detiene en una hoja de papel; la beta pasa el papel y se detiene en una lámina de aluminio; la gamma atraviesa el papel y el aluminio, y sale muy debilitada después de un bloque grueso de plomo." },
    { t: "ej", x: "Ejemplo de emisión alfa. El ²³⁸₉₂U emite una partícula alfa: Z = 92 − 2 = **90** (torio) y A = 238 − 4 = **234** → queda ²³⁴₉₀Th. Ejemplo de emisión beta. El ¹⁴₆C emite una partícula beta: Z = 6 + 1 = **7** (nitrógeno) y A sigue siendo **14** → queda ¹⁴₇N." },
    { t: "ojo", x: "La radiación **gamma no es una partícula** ni tiene carga: es energía en forma de onda. La **beta** es un **electrón** aunque salga del **núcleo** (se forma cuando un neutrón se transforma en protón). Y no confundás penetración con peligro: la **alfa casi no penetra**, pero si el material entra al cuerpo (respirado o tragado) es la que **más daño** hace." },
    { t: "h", x: "Vida media" },
    { t: "p", x: "Cada radioisótopo se desintegra a su propio ritmo. La **vida media** (o semivida) es el tiempo en que se desintegra **la mitad** de los núcleos de una muestra. Ejemplos: yodo-131, unos **8 días**; cobalto-60, unos **5,3 años**; carbono-14, unos **5730 años**; uranio-238, unos **4500 millones de años**." },
    { t: "ej", x: "Tenés 80 g de yodo-131 (vida media de 8 días). A los 8 días quedan **40 g**; a los 16 días, **20 g**; a los 24 días, **10 g**. Cada vida media la cantidad se divide entre 2; no llega a cero de golpe." },
    { t: "h", x: "Radiactividad natural" },
    { t: "p", x: "Es la que emiten **por sí solos** núcleos inestables que **ya existen en la naturaleza**, sin intervención humana. Ejemplos: el **uranio** y el **torio** de las rocas, el **radio**, el **radón** (un gas que sale de algunos suelos y rocas), el **potasio-40** (está en alimentos como el banano y en nuestro propio cuerpo) y el **carbono-14** (se forma en la atmósfera por los rayos cósmicos). Todo eso forma la **radiación de fondo** que recibimos todos los días en dosis bajas." },
    { t: "h", x: "Radiactividad artificial (inducida)" },
    { t: "p", x: "Es la que se produce cuando el ser humano **bombardea núcleos estables** con partículas (neutrones, protones o partículas alfa) y los convierte en **núcleos inestables**. La descubrieron **Irène Joliot-Curie** (hija de Marie Curie) y **Frédéric Joliot** en **1934**: bombardearon aluminio con partículas alfa y obtuvieron un fósforo radiactivo que no existe en la naturaleza. Así se fabrican hoy radioisótopos como el **cobalto-60**, el **yodo-131**, el **tecnecio-99m** y el **flúor-18**." },
    { t: "lista", x: [
      "**Bombardeo de núcleos**: es la base de todas las formas: una partícula choca con un núcleo estable y lo vuelve inestable.",
      "**Reactores nucleares**: dentro del reactor hay muchísimos neutrones que bombardean el uranio y también otros materiales colocados ahí a propósito; así se producen radioisótopos para medicina e industria, como el cobalto-60 y el yodo-131.",
      "**Aceleradores de partículas**: aceleran protones u otras partículas a velocidades enormes para chocarlas contra núcleos. Los **ciclotrones** de algunos hospitales producen, por ejemplo, el flúor-18 de los estudios PET.",
      "**Fisión nuclear**: un **neutrón** choca contra un núcleo **pesado** (uranio-235) y lo **divide en dos núcleos más livianos**; se libera muchísima energía y 2 o 3 neutrones nuevos que pueden partir otros núcleos: es la **reacción en cadena**. En una **central nuclear** se controla con **barras de control** que absorben neutrones; en una **bomba atómica** no se controla.",
      "**Fusión nuclear**: dos núcleos **livianos** (deuterio y tritio, isótopos del hidrógeno) se **unen** y forman uno más pesado (helio), liberando, por cada kilogramo de combustible, todavía más energía que la fisión. Ocurre de forma natural en el **Sol** y las estrellas; en la Tierra se ha provocado en bombas de hidrógeno y se investiga en reactores experimentales, pero todavía no produce electricidad porque necesita temperaturas de millones de grados.",
    ] },
    { t: "tabla", cab: ["", "Natural", "Artificial"], filas: [
      ["Origen del núcleo inestable", "Ya existe en la naturaleza", "Lo crea el ser humano a partir de núcleos estables"],
      ["Cómo empieza", "Sola, sin intervención humana", "Provocada: bombardeo de núcleos con partículas"],
      ["Dónde ocurre", "Rocas, suelo, aire, agua, alimentos, nuestro cuerpo", "Reactores nucleares, aceleradores de partículas (ciclotrones), laboratorios"],
      ["Quiénes la descubrieron", "Becquerel (1896) y los esposos Curie", "Irène Joliot-Curie y Frédéric Joliot (1934)"],
      ["Ejemplos", "Uranio-238, torio-232, radio-226, radón-222, potasio-40, carbono-14", "Cobalto-60, yodo-131, tecnecio-99m, flúor-18, plutonio-239"],
    ] },
    { t: "ojo", x: "**Fisión = dividir** (un núcleo pesado se parte, como una fisura); **fusión = unir** (núcleos livianos se funden en uno). Las centrales nucleares de hoy usan **fisión**; el Sol funciona con **fusión**." },
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Radiactividad» con la fecha. Copiá completa la tabla de las tres radiaciones: qué es, carga, masa, velocidad, penetración, qué la detiene, ionización, desviación y cambio en el núcleo." },
    { tipo: "escribir", x: "Dibujá en media página el esquema de penetración: una fuente, tres flechas de colores (α, β, γ) y tres barreras (papel, aluminio y plomo). Mostrá dónde se detiene cada una y escribí debajo dos líneas que expliquen por qué la alfa es la que menos penetra." },
    { tipo: "resumir", x: "En 8 a 10 líneas compará la radiactividad natural y la artificial: origen, quién la descubrió, dónde ocurre, cómo se produce la artificial (bombardeo, reactores, aceleradores, fisión y fusión) y dos ejemplos de radioisótopos de cada una." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase la materia de radiactividad. Anotá qué científicos y qué radioisótopos se mencionaron y si hicieron dibujos de fisión y fusión; copialos en tu cuaderno de repaso con su explicación." },
    { tipo: "moverse", x: "Poné en el piso, en línea, una hoja de papel, un pedazo de papel aluminio doblado y un libro grueso (será el plomo). Caminá desde la «fuente» diciendo en voz alta «soy alfa, carga +2, dos protones y dos neutrones, me detiene el papel» y parate en la barrera correcta. Repetí como beta y como gamma. Al final, con los brazos, hacé la fisión (separándolos) y la fusión (juntándolos) mientras decís qué pasa en cada una." },
  ],
  practica: [
    { t: "opcion", p: "La radiactividad es:", o: ["la emisión espontánea de radiaciones desde el núcleo de átomos inestables", "la luz que emiten los electrones cuando se calienta un metal", "la electricidad que conducen los metales", "el brillo que dejan en la oscuridad los objetos que absorbieron luz"], r: 0,
      e: "La radiactividad sale del **núcleo** de átomos **inestables** y ocurre sola (es espontánea). Lo que pasa con los electrones o la luz absorbida no es radiactividad." },
    { t: "opcion", p: "¿Qué radiación está formada por 2 protones y 2 neutrones?", o: ["alfa", "beta", "gamma"], r: 0,
      e: "La **alfa** es un núcleo de helio: 2 protones y 2 neutrones, carga +2 y masa 4 u." },
    { t: "completar", p: "La radiación gamma no tiene masa ni carga porque es una onda ___.", r: ["electromagnética"],
      e: "La gamma es una onda **electromagnética** de altísima energía, como la luz pero invisible." },
    { t: "opcion", p: "¿Qué carga tiene la radiación beta?", o: ["negativa (−1)", "positiva (+2)", "neutra (0)", "positiva (+1)"], r: 0,
      e: "La beta es un **electrón**: carga **−1**. La alfa tiene +2 y la gamma no tiene carga." },
    { t: "parejas", p: "Uní cada radiación con la barrera mínima que la detiene o la reduce.",
      pares: [["Alfa", "una hoja de papel"], ["Beta", "una lámina de aluminio de pocos milímetros"], ["Gamma", "varios centímetros de plomo o un muro grueso de concreto"]],
      e: "Alfa: papel o la piel. Beta: aluminio de unos milímetros. Gamma: plomo grueso o concreto, que la reducen mucho." },
    { t: "ordenar", p: "Ordená las radiaciones de MENOR a MAYOR poder de penetración.", x: ["alfa", "beta", "gamma"],
      e: "La alfa es la menos penetrante (la para el papel), luego la beta (la para el aluminio) y la más penetrante es la gamma." },
    { t: "vf", p: "La radiación alfa es la más penetrante de las tres.", r: false,
      e: "**Falso.** La alfa es la **menos** penetrante: la detiene una hoja de papel. La más penetrante es la gamma." },
    { t: "opcion", p: "Al pasar por un campo eléctrico, ¿qué radiación NO se desvía?", o: ["gamma", "alfa", "beta"], r: 0,
      e: "La **gamma** no tiene carga, así que ninguna de las placas la atrae: sigue recta. La alfa (+) va hacia la placa negativa y la beta (−) hacia la positiva." },
    { t: "numero", p: "El radio-226 (Z = 88) emite una partícula alfa. ¿Cuál es el número atómico del núcleo que se forma?", r: 86,
      e: "Al emitir alfa, Z baja 2: 88 − 2 = **86**, que es el radón." },
    { t: "numero", p: "En esa misma emisión alfa del radio-226, ¿cuál es el número másico del núcleo que se forma?", r: 222,
      e: "Al emitir alfa, A baja 4: 226 − 4 = **222**. Se forma el radón-222." },
    { t: "numero", p: "El estroncio-90 (Z = 38) emite una partícula beta. ¿Cuál es el número atómico del nuevo núcleo?", r: 39,
      e: "En la emisión beta un neutrón se convierte en protón: Z sube 1 → 38 + 1 = **39** (itrio). A sigue siendo 90." },
    { t: "opcion", p: "¿Quién descubrió la radiactividad en 1896 al trabajar con sales de uranio?", o: ["Henri Becquerel", "Marie Curie", "Ernest Rutherford", "Dmitri Mendeléiev"], r: 0,
      e: "**Becquerel** la descubrió en 1896. Marie Curie le dio el nombre y descubrió el polonio y el radio; Rutherford nombró la alfa y la beta; Mendeléiev ordenó la tabla periódica." },
    { t: "opcion", p: "¿Cuál es un ejemplo de radiactividad natural?", o: ["el gas radón que sale de algunas rocas y suelos", "el cobalto-60 fabricado en un reactor", "el flúor-18 producido en un ciclotrón", "la explosión de una bomba atómica"], r: 0,
      e: "El **radón** se produce solo en la naturaleza, a partir del uranio de las rocas. El cobalto-60, el flúor-18 y la bomba son producidos por el ser humano." },
    { t: "opcion", p: "La radiactividad artificial se produce:", o: ["bombardeando núcleos estables con partículas como neutrones, protones o partículas alfa", "calentando el uranio hasta que brille", "mezclando dos sustancias químicas en un laboratorio", "exponiendo un metal a la luz del sol"], r: 0,
      e: "Se produce **bombardeando núcleos estables** para volverlos inestables (en reactores o aceleradores). Calentar o mezclar sustancias no cambia el núcleo." },
    { t: "vf", p: "Irène Joliot-Curie y Frédéric Joliot obtuvieron por primera vez radiactividad artificial en 1934.", r: true,
      e: "**Verdadero.** Bombardearon aluminio con partículas alfa y obtuvieron un fósforo radiactivo." },
    { t: "vf", p: "Los ciclotrones de algunos hospitales son aceleradores de partículas que producen radioisótopos para hacer diagnósticos.", r: true,
      e: "**Verdadero.** El ciclotrón acelera protones contra núcleos estables y produce radioisótopos de vida corta, como el flúor-18 del estudio PET." },
    { t: "opcion", p: "En la fisión nuclear:", o: ["un núcleo pesado se divide en dos más livianos al chocar con un neutrón", "dos núcleos livianos se unen para formar uno más pesado", "un electrón salta de un nivel de energía a otro", "un átomo pierde electrones y forma un catión"], r: 0,
      e: "**Fisión = dividir**: un neutrón parte un núcleo pesado (como el uranio-235). Unir núcleos livianos es la fusión." },
    { t: "completar", p: "La reacción en la que núcleos livianos de hidrógeno se unen para formar helio, como ocurre en el Sol, se llama ___ nuclear.", r: ["fusión"],
      e: "Es la **fusión** nuclear: por cada kilogramo de combustible libera todavía más energía que la fisión, y es la fuente de energía de las estrellas." },
    { t: "opcion", p: "En una central nuclear, la reacción en cadena se mantiene controlada porque:", o: ["unas barras de control absorben parte de los neutrones", "el agua apaga la radiación gamma", "el uranio se reemplaza por hidrógeno", "se eliminan todos los neutrones que se liberan"], r: 0,
      e: "Las **barras de control** absorben neutrones para que la reacción no se acelere. Si se eliminaran todos los neutrones, la reacción se detendría." },
    { t: "numero", p: "Una muestra tiene 80 g de yodo-131, cuya vida media es de 8 días. ¿Cuántos gramos quedan sin desintegrarse después de 24 días?", r: 10,
      e: "24 días son 3 vidas medias: 80 → 40 → 20 → **10 g**." },
  ],
};

// ── Tema 6 ──────────────────────────────────────────────────────────────────────────────────────────────

const RADIACTIVIDAD_USOS = {
  id: "radiactividad-usos-y-seguridad",
  titulo: "Usos de la radiactividad, beneficios, peligros y seguridad",
  indicadores: [
    "Identifica las principales aplicaciones de la radiactividad en la medicina, agricultura, industria e investigación científica, reconociendo su importancia para la sociedad.",
    "Analiza los beneficios y peligros asociados con el uso de materiales radiactivos, considerando sus posibles efectos sobre la salud humana y el ambiente.",
    "Propone medidas para el uso racional de los materiales radiactivos y el manejo adecuado de los residuos radiactivos, a partir del análisis de situaciones relacionadas con la protección de las personas y el ambiente.",
  ],
  materia: [
    { t: "h", x: "Aplicaciones en medicina" },
    { t: "lista", x: [
      "**Radioterapia**: se dirige radiación contra un tumor para destruir las células cancerosas, por ejemplo con la radiación gamma del **cobalto-60** o con aceleradores lineales.",
      "**Medicina nuclear (diagnóstico)**: se le inyecta al paciente una cantidad muy pequeña de un radioisótopo de **vida corta**, como el **tecnecio-99m** (vida media de unas 6 horas) o el **flúor-18** de los estudios **PET**. Se acumula en un órgano y una cámara especial detecta la radiación y forma imágenes de cómo funciona ese órgano (gammagrafía).",
      "**Yodo-131**: la tiroides absorbe yodo, así que este radioisótopo se usa para tratar el hipertiroidismo y el cáncer de tiroides.",
      "**Esterilización** de jeringas, guantes, gasas y prótesis con radiación gamma, sin calor ni químicos, dentro de su empaque cerrado.",
    ] },
    { t: "ojo", x: "Las **radiografías** y las **tomografías** usan **rayos X** que produce un aparato eléctrico, **no un material radiactivo**: cuando se apaga el aparato, ya no hay radiación. Aun así los rayos X son radiación ionizante y por eso se usan delantales de plomo." },
    { t: "h", x: "Aplicaciones en agricultura y alimentación" },
    { t: "lista", x: [
      "**Técnica del insecto estéril**: se crían millones de insectos de una plaga, se **esterilizan con radiación** y se liberan. Al aparearse con los insectos silvestres no tienen descendencia y la plaga disminuye **sin insecticidas**. En Centroamérica, incluida Costa Rica, se usó para erradicar el **gusano barrenador del ganado** y se ha vuelto a usar cuando la plaga reapareció; también se usa contra la **mosca del Mediterráneo**, que daña las frutas.",
      "**Irradiación de alimentos**: se exponen granos, especias, frutas o carnes a radiación gamma para matar bacterias, hongos e insectos, retrasar la maduración y evitar que papas y cebollas germinen. **Los alimentos irradiados no se vuelven radiactivos.**",
      "**Mejoramiento de cultivos**: se irradian semillas para producir variedades más resistentes a plagas, sequías o enfermedades.",
      "**Trazadores**: con fósforo-32 se puede seguir cuánto fertilizante absorbe una planta, para aplicar solo lo necesario.",
    ] },
    { t: "h", x: "Aplicaciones en la industria" },
    { t: "lista", x: [
      "**Gammagrafía industrial**: con fuentes de **iridio-192** o **cobalto-60** se «radiografían» soldaduras, tuberías y piezas de aviones para encontrar grietas sin romperlas.",
      "**Medidores**: del espesor de láminas de papel, plástico o metal; del nivel de líquidos dentro de tanques; y de la densidad y humedad del suelo en la construcción de carreteras.",
      "**Detectores de humo** iónicos, que tienen una cantidad mínima de **americio-241**.",
      "**Esterilización** industrial de productos médicos y cosméticos.",
      "**Producción de electricidad**: las **centrales nucleares** aprovechan el calor de la fisión del uranio-235. Cerca del 10 % de la electricidad del mundo es nuclear (por ejemplo, en Francia, Estados Unidos y China). **Costa Rica no tiene centrales nucleares**: su electricidad viene casi toda de fuentes renovables (agua, viento y calor de los volcanes).",
    ] },
    { t: "h", x: "Aplicaciones en la investigación científica" },
    { t: "lista", x: [
      "**Datación con carbono-14**: mientras un ser vivo vive, tiene una proporción fija de carbono-14; al morir, ese carbono-14 se desintegra (vida media de unos 5730 años). Midiendo cuánto queda se calcula la edad de huesos, madera, semillas, telas o carbón de hasta unos 50 000 años. Se usa en arqueología, por ejemplo para fechar restos de los pueblos originarios de Costa Rica.",
      "**Datación de rocas** con uranio y plomo, o con potasio y argón, para edades de millones de años.",
      "**Trazadores** para seguir el recorrido del agua en ríos y acuíferos, o el funcionamiento de órganos y plantas.",
      "En Costa Rica, la Universidad de Costa Rica tiene el **CICANUM** (Centro de Investigación en Ciencias Atómicas, Nucleares y Moleculares), que estudia la radiación en el ambiente y en sus usos médicos; el país también trabaja con el **Organismo Internacional de Energía Atómica (OIEA)** en proyectos de salud, agricultura y agua.",
    ] },
    { t: "h", x: "Beneficios y peligros" },
    { t: "tabla", cab: ["Beneficios", "Peligros"], filas: [
      ["Diagnóstico temprano y tratamiento del cáncer y de enfermedades de la tiroides", "Una dosis alta daña las células y el ADN: quemaduras, náuseas, caída del cabello, síndrome agudo por radiación y hasta la muerte"],
      ["Control de plagas sin insecticidas; alimentos que duran más y son más seguros", "La exposición prolongada aumenta el riesgo de cáncer (por ejemplo, leucemia) y de mutaciones; el feto es especialmente sensible"],
      ["Revisar soldaduras y piezas sin romperlas; esterilizar material médico", "Accidentes en centrales nucleares (Chernóbil, Ucrania, 1986; Fukushima, Japón, 2011) contaminan aire, agua, suelo y alimentos durante años"],
      ["Electricidad sin emitir dióxido de carbono", "Residuos radiactivos que siguen siendo peligrosos durante cientos o miles de años"],
      ["Fechar restos y rocas; seguir el agua y los nutrientes en el ambiente", "Uso como arma (Hiroshima y Nagasaki, Japón, 1945) y fuentes perdidas o abandonadas (Goiânia, Brasil, 1987)"],
    ] },
    { t: "p", x: "El daño depende de la **dosis** (cuánta radiación), del **tipo** de radiación, del **tiempo** de exposición y de la parte del cuerpo expuesta. En el **ambiente**, el material radiactivo que se escapa contamina el aire, el agua y el suelo, y entra a la **cadena alimentaria**: después de los accidentes nucleares se encontró yodo-131 en la leche y cesio-137 en suelos, hongos y carne de animales." },
    { t: "ojo", x: "**Irradiación** no es lo mismo que **contaminación radiactiva**. Irradiar es exponer algo a la radiación **desde afuera**: el objeto o la persona **no queda radiactiva** (como los alimentos irradiados o un paciente después de una radiografía). Hay contaminación cuando el **material radiactivo** queda sobre la piel o la ropa, o dentro del cuerpo, y sigue emitiendo." },
    { t: "ej", x: "El accidente de Goiânia (Brasil, 1987). Unas personas sacaron de una clínica abandonada un equipo viejo de radioterapia, lo desarmaron para vender el metal y abrieron una cápsula de **cesio-137**: el polvo brillaba de color azul en la oscuridad y lo repartieron entre familiares y vecinos. Cuatro personas murieron, cientos se contaminaron y hubo que demoler casas y retirar toneladas de tierra. Lección: una fuente radiactiva en desuso **nunca** se abandona ni se vende como chatarra; tiene que estar registrada, rotulada y devolverse o guardarse de forma segura." },
    { t: "h", x: "Protección: tiempo, distancia y blindaje" },
    { t: "svg", x: SVG_TREBOL, alt: "Símbolo internacional de radiación: un círculo central con tres aspas negras alrededor, como un trébol, sobre un cuadro amarillo." },
    { t: "lista", x: [
      "**Tiempo**: estar el **menor tiempo posible** cerca de una fuente; la dosis crece con el tiempo de exposición. Por eso el trabajo se planea antes para hacerlo rápido.",
      "**Distancia**: alejarse lo más posible y manipular las fuentes con pinzas largas o a control remoto. La dosis baja muy rápido: **al doble de distancia llega aproximadamente la cuarta parte**.",
      "**Blindaje**: poner barreras entre la fuente y las personas, según el tipo de radiación: delantales, mamparas y contenedores de plomo, paredes gruesas de concreto en las salas de radioterapia, piscinas de agua para el combustible usado de los reactores.",
    ] },
    { t: "lista", x: [
      "El **símbolo internacional de radiación** es un **trébol** de tres aspas, negro o magenta, sobre **fondo amarillo**. Avisa que hay material radiactivo o radiación; no se entra a una zona con ese símbolo sin autorización ni se abre un recipiente que lo tenga.",
      "Los trabajadores expuestos (radiología, medicina nuclear, industria) usan un **dosímetro personal** que mide cuánta radiación reciben, y tienen límites de dosis.",
      "**Capacitación, permisos y control**: en Costa Rica, el **Ministerio de Salud** autoriza y fiscaliza a quienes usan fuentes de radiación. Las fuentes se guardan bajo llave, inventariadas y rotuladas.",
      "Una mujer embarazada siempre debe avisarlo antes de una radiografía o de un estudio de medicina nuclear.",
      "En un accidente nuclear: seguir las instrucciones de las autoridades, quedarse en interiores con puertas y ventanas cerradas y, si lo indican, tomar **pastillas de yoduro de potasio**, que llenan la tiroides de yodo estable para que no absorba el yodo-131.",
      "**Uso racional**: hacer solo los estudios médicos necesarios, con la menor dosis que sirva, y elegir otra técnica sin radiación cuando dé el mismo resultado.",
    ] },
    { t: "h", x: "Manejo de los residuos radiactivos" },
    { t: "p", x: "Un **residuo radiactivo** es cualquier material que ya no sirve y contiene radioisótopos: fuentes en desuso, guantes, jeringas y ropa contaminada de hospitales, filtros, combustible usado de los reactores. **Nunca** se botan en la basura común ni en ríos, ni se queman, ni se venden como chatarra." },
    { t: "lista", x: [
      "**Clasificar** según su actividad (baja, media o alta) y su vida media.",
      "**Almacenar para que decaigan**: los de vida media corta (horas o días, como los de medicina nuclear) se guardan en un lugar blindado y rotulado hasta que su radiactividad baja a niveles seguros; se mide con un detector antes de desecharlos.",
      "**Acondicionar**: encerrarlos en cemento o en vidrio (vitrificación) dentro de contenedores metálicos sellados, para que no se escapen.",
      "**Devolver** las fuentes selladas que ya no se usan al fabricante, o entregarlas a la autoridad.",
      "**Disponer** en depósitos vigilados: superficiales para los de baja y media actividad, y **repositorios geológicos profundos** (cientos de metros bajo tierra, en roca estable) para los de alta actividad, que duran miles de años.",
      "**Registrar y transportar con control**: inventario, rótulos con el trébol, vigilancia y transporte en contenedores autorizados.",
    ] },
    { t: "ej", x: "Análisis de una situación (así se contesta un desarrollo). En un hospital sobran jeringas y guantes contaminados con tecnecio-99m. Medidas: (1) separarlos en un recipiente blindado y rotulado con el trébol; (2) guardarlos en el almacén de decaimiento del servicio durante varios días, porque su vida media es de unas 6 horas; (3) medirlos con un detector antes de desecharlos; (4) anotar todo en el registro. Así se protege a los trabajadores de limpieza, al público y al ambiente." },
  ],
  cuaderno: [
    { tipo: "copiar", x: "Título «Usos de la radiactividad y seguridad» con la fecha. Copiá las aplicaciones en medicina, agricultura, industria e investigación: al menos 3 por área, con el radioisótopo cuando se menciona." },
    { tipo: "resumir", x: "En 8 a 10 líneas resumí los beneficios y los peligros del uso de materiales radiactivos para la salud y el ambiente. Incluí un accidente internacional y un uso en Costa Rica." },
    { tipo: "escribir", x: "Dibujá y pintá el símbolo del trébol con su fondo amarillo. Debajo explicá con tres dibujos pequeños las reglas de tiempo, distancia y blindaje, cada una con una oración. Después escribí un plan de 5 pasos para manejar los residuos de un servicio de medicina nuclear." },
    { tipo: "buscar", x: "Buscá en tu cuaderno de clase las aplicaciones de la radiactividad y las medidas de seguridad que vieron. Marcá con un asterisco las que no aparezcan en esta materia y copialas en tu cuaderno de repaso." },
    { tipo: "moverse", x: "Hacé un cartel grande (cartulina u hojas pegadas) con tres columnas: TIEMPO, DISTANCIA y BLINDAJE, y pegalo en la pared. De pie frente al cartel, explicá en voz alta, como si dieras la clase, cada medida con un ejemplo de un hospital y otro de una industria. Luego alejate dos pasos, después cuatro, y decí qué le pasa a la dosis cuando la distancia se duplica." },
  ],
  practica: [
    { t: "parejas", p: "Uní cada aplicación con el área donde se usa.",
      pares: [["Técnica del insecto estéril", "agricultura"], ["Gammagrafía de soldaduras", "industria"], ["Tratamiento del cáncer de tiroides con yodo-131", "medicina"], ["Datación con carbono-14", "investigación científica"], ["Irradiación de especias y granos", "agricultura"], ["Detectores de humo con americio-241", "industria"]],
      e: "Insecto estéril e irradiación de alimentos: agricultura. Gammagrafía y detectores de humo: industria. Yodo-131: medicina. Carbono-14: investigación (arqueología)." },
    { t: "opcion", p: "La técnica del insecto estéril controla una plaga porque:", o: ["los insectos esterilizados con radiación se aparean con los silvestres y no dejan descendencia", "la radiación de los insectos liberados mata a los demás insectos", "los insectos irradiados vuelven tóxicas las plantas para la plaga", "los insectos irradiados se comen los huevos de la plaga"], r: 0,
      e: "Los machos estériles compiten con los silvestres: las hembras ponen huevos que no se desarrollan y la población baja **sin insecticidas**. Los insectos liberados no quedan radiactivos." },
    { t: "vf", p: "Un alimento irradiado se vuelve radiactivo y no se debe comer.", r: false,
      e: "**Falso.** La irradiación expone el alimento a la radiación desde afuera: mata microorganismos, pero el alimento **no queda radiactivo**." },
    { t: "opcion", p: "¿Para qué se usa el carbono-14 en la investigación científica?", o: ["para calcular la edad de restos de seres vivos", "para producir electricidad en centrales nucleares", "para detectar grietas en tuberías", "para esterilizar jeringas"], r: 0,
      e: "El carbono-14 permite **fechar** restos orgánicos de hasta unos 50 000 años, porque su vida media es de unos 5730 años." },
    { t: "opcion", p: "En medicina nuclear se le inyecta tecnecio-99m al paciente porque:", o: ["emite radiación que una cámara detecta para formar imágenes de un órgano, y dura poco tiempo", "destruye todas las bacterias del cuerpo", "es un metal que fortalece los huesos", "se queda para siempre en el cuerpo y permite seguir al paciente durante años"], r: 0,
      e: "El tecnecio-99m emite radiación gamma que la cámara detecta, y su vida media corta (unas 6 horas) hace que desaparezca pronto del cuerpo." },
    { t: "vf", p: "Las radiografías comunes se toman con rayos X producidos por un aparato eléctrico, no con un material radiactivo.", r: true,
      e: "**Verdadero.** El tubo de rayos X funciona con electricidad; al apagarlo, no queda radiación. Igual se usa protección de plomo." },
    { t: "vf", p: "Costa Rica produce parte de su electricidad en una central nuclear.", r: false,
      e: "**Falso.** Costa Rica no tiene centrales nucleares; su electricidad es casi toda renovable (agua, viento, geotermia)." },
    { t: "opcion", p: "¿Cuál es un BENEFICIO del uso de materiales radiactivos?", o: ["esterilizar material médico sin calor ni químicos", "producir residuos que duran miles de años", "aumentar el riesgo de cáncer en los trabajadores", "contaminar la cadena alimentaria"], r: 0,
      e: "Esterilizar jeringas y guantes con radiación gamma es un **beneficio**. Las otras tres son peligros." },
    { t: "opcion", p: "El accidente de la central nuclear de Chernóbil ocurrió en:", o: ["Ucrania, 1986", "Japón, 2011", "Brasil, 1987", "Japón, 1945"], r: 0,
      e: "Chernóbil fue en **Ucrania en 1986**. Fukushima fue en Japón en 2011, Goiânia en Brasil en 1987 y las bombas atómicas cayeron sobre Japón en 1945." },
    { t: "opcion", p: "En Goiânia (Brasil, 1987) murieron y se contaminaron personas porque:", o: ["abrieron una cápsula de cesio-137 de un equipo de radioterapia abandonado", "explotó el reactor de una central nuclear", "cayó una bomba atómica sobre la ciudad", "comieron alimentos irradiados"], r: 0,
      e: "Fue una **fuente abandonada**: desarmaron un equipo viejo de radioterapia y repartieron el polvo de cesio-137. Por eso las fuentes en desuso deben devolverse o guardarse con control." },
    { t: "opcion", p: "Una persona recibió radiación desde afuera, sin que le quedara material radiactivo encima ni adentro. ¿Qué le pasó?", o: ["fue irradiada, pero no quedó radiactiva", "quedó contaminada y contamina a los demás", "se volvió radiactiva para siempre", "emite radiación gamma durante varios años"], r: 0,
      e: "Fue **irradiada**: la radiación pasó por su cuerpo, pero no hay material radiactivo en ella, así que no emite nada ni contamina a nadie." },
    { t: "parejas", p: "Uní cada medida con la regla de protección que aplica.",
      pares: [["Alejarse de un tanque que tiene el símbolo del trébol", "distancia"], ["Ponerle al paciente un delantal de plomo", "blindaje"], ["Preparar todo antes para trabajar con la fuente solo unos minutos", "tiempo"], ["Paredes de concreto grueso en la sala de radioterapia", "blindaje"], ["Usar pinzas largas para manipular una fuente", "distancia"]],
      e: "Alejarse y usar pinzas largas: distancia. Delantal de plomo y paredes de concreto: blindaje. Trabajar pocos minutos: tiempo." },
    { t: "numero", p: "Una persona está a 1 m de una fuente radiactiva pequeña y se aleja hasta 2 m. ¿Entre cuánto se divide, aproximadamente, la dosis que recibe?", r: 4,
      e: "La dosis baja con el cuadrado de la distancia: al doble de distancia llega 1/(2 × 2) = 1/4. Se divide entre **4**." },
    { t: "opcion", p: "El símbolo internacional de la radiación es:", o: ["un trébol de tres aspas, negro o magenta, sobre fondo amarillo", "una calavera blanca sobre fondo rojo", "un rayo negro dentro de un triángulo verde", "una llama negra sobre fondo anaranjado"], r: 0,
      e: "Es el **trébol** sobre fondo **amarillo**. La calavera indica sustancias tóxicas y la llama, sustancias inflamables." },
    { t: "vf", p: "Los guantes y jeringas contaminados con un radioisótopo de vida media corta se pueden guardar en un lugar blindado y rotulado hasta que su radiactividad baje.", r: true,
      e: "**Verdadero.** Es el almacenamiento para decaimiento: después se mide con un detector antes de desecharlos." },
    { t: "opcion", p: "¿Qué se debe hacer con una fuente radiactiva sellada que ya no se usa?", o: ["devolverla al fabricante o entregarla a la autoridad competente", "venderla como chatarra", "enterrarla en el patio de la empresa", "botarla en el relleno sanitario municipal"], r: 0,
      e: "Se **devuelve al fabricante** o se entrega a la autoridad. Venderla, enterrarla o botarla puede causar un accidente como el de Goiânia." },
    { t: "completar", p: "Los residuos radiactivos de alta actividad, que siguen siendo peligrosos durante miles de años, se guardan en repositorios ___ profundos, construidos en roca estable a cientos de metros bajo tierra.", r: ["geológicos"],
      e: "Son los **repositorios geológicos profundos**: la roca estable aísla los residuos durante miles de años." },
    { t: "opcion", p: "¿Para qué sirve el dosímetro que usan los trabajadores de radiología?", o: ["para medir cuánta radiación recibe cada trabajador", "para bloquear la radiación gamma", "para desinfectar los equipos", "para producir radioisótopos"], r: 0,
      e: "El **dosímetro** mide la dosis acumulada de cada trabajador, para controlar que no pase los límites. No protege por sí solo." },
    { t: "opcion", p: "Después de un accidente nuclear, las autoridades pueden repartir pastillas de yoduro de potasio porque:", o: ["llenan la tiroides de yodo estable y así no absorbe el yodo-131 radiactivo", "eliminan la radiación gamma del ambiente", "convierten el yodo-131 en yodo estable dentro del cuerpo", "curan las quemaduras causadas por la radiación"], r: 0,
      e: "La tiroides se **satura de yodo estable** y ya no absorbe el yodo-131 que se liberó en el accidente. No elimina la radiación ni cura quemaduras." },
    { t: "abierta", p: "Situación: en una bodega abandonada se encontró un contenedor metálico viejo con el símbolo del trébol, sin dueño conocido, y unos vecinos quieren abrirlo para vender el metal. En tu cuaderno, proponé al menos cuatro medidas para proteger a las personas y al ambiente y explicá por qué cada una.",
      guia: [
        "No abrir ni tocar el contenedor y alejar a las personas (distancia y tiempo).",
        "Aislar y señalizar la zona y avisar a las autoridades (Ministerio de Salud o el 9-1-1).",
        "Que solo personal capacitado, con dosímetro y blindaje, lo retire.",
        "Que se maneje como residuo radiactivo (devolverlo o llevarlo a un depósito autorizado), nunca como chatarra.",
        "Explica el porqué de cada medida (evitar irradiación y contaminación, como en Goiânia).",
      ],
      modelo: "1) No abrirlo ni moverlo, y pedir a los vecinos que se alejen, porque si es una fuente activa, mientras más cerca y más tiempo estén, más radiación reciben. 2) Cerrar el paso a la bodega y poner un aviso, y llamar al 9-1-1 y al Ministerio de Salud, que es la autoridad que controla las fuentes de radiación. 3) Que lo retire solo personal capacitado, con dosímetro, pinzas y un contenedor blindado, porque saben medir la radiación y protegerse. 4) Que el contenedor se devuelva o se guarde en un depósito autorizado de residuos radiactivos, nunca como chatarra: en Goiânia abrir una fuente así mató a cuatro personas y contaminó a cientos, además del suelo y las casas.",
      lineas: 12 },
  ],
};

// ── Simulacros ──────────────────────────────────────────────────────────────────────────────────────────

const INSTRUCCIONES = {
  seleccion: "Marcá la única opción correcta. Cada respuesta correcta vale 1 punto.",
  vf: "Indicá si cada afirmación es verdadera o falsa. Cada respuesta correcta vale 1 punto.",
  correspondencia: "Asociá cada elemento de la izquierda con el de la derecha que le corresponde. Cada asociación correcta vale 1 punto.",
  corta: "Escribí la respuesta en el espacio. Los símbolos deben llevar mayúscula y minúscula correctas y los nombres, sus tildes. Cada respuesta vale 1 punto.",
  desarrollo: "Contestá en tu cuaderno, con oraciones completas. Cada criterio de la respuesta vale 1 punto.",
};

const SIMULACRO_A = {
  nombre: "Simulacro A",
  partes: [
    { titulo: "I parte. Selección única (12 pts)", instrucciones: INSTRUCCIONES.seleccion, items: [
      { t: "opcion", p: "El elemento ubicado en el grupo 15 y en el periodo 2 pertenece a la familia de los:", o: ["nitrogenoides", "carbonoides", "calcógenos", "térreos"], r: 0,
        e: "El grupo 15 (VA) es el de los **nitrogenoides**; en el periodo 2 está el nitrógeno." },
      { t: "opcion", p: "¿En qué bloque de la tabla periódica están los elementos de transición?", o: ["d", "s", "p", "f"], r: 0,
        e: "Los elementos de transición forman el bloque **d** (grupos 3 a 12). El f es de transición interna; s y p son representativos." },
      { t: "opcion", p: "¿Cuál grupo de elementos está formado solo por metaloides?", o: ["B, Si y As", "Al, Si y P", "C, N y O", "Na, K y Li"], r: 0,
        e: "Boro, silicio y arsénico son metaloides. En «Al, Si y P» el aluminio es metal y el fósforo, no metal." },
      { t: "opcion", p: "Un elemento brillante, que se puede estirar en hilos y que conduce bien la electricidad, es:", o: ["un metal", "un no metal", "un gas noble", "un halógeno"], r: 0,
        e: "Brillo, ductilidad y buena conducción son características de los **metales**." },
      { t: "opcion", p: "¿Cuál es el símbolo químico del estaño?", o: ["Sn", "Es", "St", "Sb"], r: 0,
        e: "El estaño es **Sn**, del latín stannum. Sb es el antimonio." },
      { t: "opcion", p: "El mercurio que usa la minería ilegal de oro afecta sobre todo:", o: ["el sistema nervioso de las personas que comen peces contaminados", "solo el suelo, sin llegar al agua", "la capa de ozono de la atmósfera", "solamente a los mineros, nunca a otras personas"], r: 0,
        e: "En el agua el mercurio se vuelve metilmercurio, se acumula en los peces y daña el **sistema nervioso** de quienes los comen." },
      { t: "opcion", p: "Una especie tiene 16 protones y 18 electrones. ¿Qué es?", o: ["un anión con carga 2−", "un catión con carga 2+", "un átomo neutro", "un isótopo del argón"], r: 0,
        e: "Tiene 2 electrones más que protones: ganó 2 → **anión 2−** (es el S²⁻). Sigue siendo azufre porque tiene 16 protones." },
      { t: "opcion", p: "Los isótopos de un mismo elemento se diferencian en su número de:", o: ["neutrones", "protones", "electrones de valencia", "niveles de energía"], r: 0,
        e: "Los isótopos tienen el mismo Z (mismos protones) y distinto número de **neutrones**." },
      { t: "opcion", p: "¿Qué radiación tiene carga +2 y es detenida por una hoja de papel?", o: ["alfa", "beta", "gamma"], r: 0,
        e: "La **alfa**: 2 protones y 2 neutrones, carga +2, poco penetrante." },
      { t: "opcion", p: "La radiactividad artificial se diferencia de la natural en que:", o: ["se obtiene bombardeando núcleos estables en reactores o aceleradores", "no emite radiación alfa, beta ni gamma", "no causa ningún daño a la salud", "solo ocurre en el Sol y las estrellas"], r: 0,
        e: "En la artificial el ser humano **crea** el núcleo inestable bombardeando núcleos estables. Emite las mismas radiaciones y también es peligrosa." },
      { t: "opcion", p: "¿Cuál aplicación de la radiactividad pertenece a la industria?", o: ["revisar soldaduras de tuberías con gammagrafía", "tratar el cáncer de tiroides con yodo-131", "fechar huesos antiguos con carbono-14", "esterilizar moscas para controlar una plaga"], r: 0,
        e: "La **gammagrafía** de soldaduras es industrial. El yodo-131 es medicina, el carbono-14 es investigación y el insecto estéril es agricultura." },
      { t: "opcion", p: "¿Cuál es un PELIGRO asociado al uso de materiales radiactivos?", o: ["sus residuos pueden seguir siendo peligrosos durante miles de años", "permiten diagnosticar enfermedades a tiempo", "ayudan a controlar plagas sin insecticidas", "permiten conservar alimentos por más tiempo"], r: 0,
        e: "Los **residuos** de larga vida son un peligro. Las otras tres opciones son beneficios." },
    ] },
    { titulo: "II parte. Falso o verdadero (6 pts)", instrucciones: INSTRUCCIONES.vf, items: [
      { t: "vf", p: "Los gases nobles están en el grupo 18 y casi no reaccionan con otros elementos.", r: true,
        e: "**Verdadero.** Su último nivel está completo, por eso casi no forman compuestos." },
      { t: "vf", p: "Los lantánidos y los actínidos son elementos representativos.", r: false,
        e: "**Falso.** Son elementos de **transición interna** (bloque f). Los representativos son los bloques s y p." },
      { t: "vf", p: "El símbolo químico del potasio es P.", r: false,
        e: "**Falso.** El potasio es **K** (kalium); P es el fósforo." },
      { t: "vf", p: "La Ley 8904 prohibió en Costa Rica el uso de cianuro y mercurio en la minería metálica.", r: true,
        e: "**Verdadero.** Además declaró al país libre de minería metálica a cielo abierto." },
      { t: "vf", p: "En un catión hay más electrones que protones.", r: false,
        e: "**Falso.** Un catión **perdió** electrones, así que tiene **menos** electrones que protones." },
      { t: "vf", p: "La radiación gamma es una onda electromagnética sin masa y sin carga.", r: true,
        e: "**Verdadero.** Por eso no se desvía en un campo eléctrico y es la más penetrante." },
    ] },
    { titulo: "III parte. Correspondencia (10 pts)", instrucciones: INSTRUCCIONES.correspondencia, items: [
      { t: "parejas", fig: FIG_SIMULACRO_A, p: "En la tabla periódica esquemática hay cinco letras. Indicá la familia o el tipo de elemento que señala cada letra.",
        pares: [["A", "alcalinotérreos"], ["B", "halógenos"], ["C", "calcógenos"], ["D", "transición"], ["E", "transición interna"]],
        e: "A: grupo 2, alcalinotérreos (Mg). B: grupo 17, halógenos (F). C: grupo 16, calcógenos (Se). D: grupo 11, centro de la tabla, transición (Ag). E: fila de los lantánidos, transición interna." },
      { t: "parejas", p: "Uní cada elemento con uno de sus usos.",
        pares: [["Flúor", "prevenir la caries"], ["Cobre", "cables eléctricos"], ["Potasio", "fertilizantes"], ["Plomo", "baterías de carro y blindaje contra la radiación"], ["Calcio", "formación de huesos y dientes"]],
        e: "Flúor: caries (pasta y sal). Cobre: cables. Potasio: la K de los abonos N-P-K. Plomo: baterías y blindaje. Calcio: huesos y dientes." },
    ] },
    { titulo: "IV parte. Respuesta corta (12 pts)", instrucciones: INSTRUCCIONES.corta, items: [
      { t: "completar", p: "El símbolo químico del cloro es ___.", r: ["Cl"], may: true,
        e: "**Cl**: C mayúscula y l minúscula." },
      { t: "completar", p: "El símbolo químico del níquel es ___.", r: ["Ni"], may: true,
        e: "**Ni**: N mayúscula e i minúscula. N sola es el nitrógeno." },
      { t: "completar", p: "El elemento cuyo símbolo es Pb se llama ___.", r: ["plomo"],
        e: "**Pb** es el **plomo**, del latín plumbum." },
      { t: "completar", p: "El elemento cuyo símbolo es Hg se llama ___.", r: ["mercurio"],
        e: "**Hg** es el **mercurio**, del latín hydrargyrum." },
      { t: "numero", p: "Para el ion ⁶⁵₂₉Cu²⁺, ¿cuántos protones hay?", r: 29,
        e: "p = Z = **29**; los protones no cambian en un ion." },
      { t: "numero", p: "Para el ion ⁶⁵₂₉Cu²⁺, ¿cuántos neutrones hay?", r: 36,
        e: "n = A − Z = 65 − 29 = **36**." },
      { t: "numero", p: "Para el ion ⁶⁵₂₉Cu²⁺, ¿cuántos electrones hay?", r: 27,
        e: "Carga 2+ → perdió 2 electrones: 29 − 2 = **27**." },
      { t: "numero", p: "Para el ion ¹²⁷₅₃I⁻, ¿cuántos electrones hay?", r: 54,
        e: "Carga 1− → ganó 1 electrón: 53 + 1 = **54**." },
      { t: "numero", p: "Para el ion ¹²⁷₅₃I⁻, ¿cuántos neutrones hay?", r: 74,
        e: "n = 127 − 53 = **74**." },
      { t: "numero", p: "¿Cuántos neutrones tiene el uranio-238, si su número atómico es 92?", r: 146,
        e: "n = 238 − 92 = **146**." },
      { t: "numero", p: "El radón-222 (Z = 86) emite una partícula alfa. ¿Cuál es el número atómico del núcleo que se forma?", r: 84,
        e: "En la emisión alfa Z baja 2: 86 − 2 = **84** (polonio)." },
      { t: "numero", p: "Una muestra de 64 g de un radioisótopo tiene una vida media de 5 años. ¿Cuántos gramos quedan después de 15 años?", r: 8,
        e: "15 años son 3 vidas medias: 64 → 32 → 16 → **8 g**." },
    ] },
    { titulo: "V parte. Desarrollo (9 pts)", instrucciones: INSTRUCCIONES.desarrollo, items: [
      { t: "abierta", p: "Explicá cómo la minería metálica a cielo abierto contamina el agua y degrada el suelo (dos efectos de cada uno) y proponé una acción sostenible para disminuir la extracción de nuevos minerales, explicando por qué funciona.",
        guia: [
          "Un efecto correcto sobre el agua (cianuro, mercurio o metilmercurio, drenaje ácido o sedimentos).",
          "Un segundo efecto sobre el agua, distinto y correcto.",
          "Un efecto correcto sobre el suelo (deforestación, pérdida de la capa fértil, erosión, relaves, metales pesados).",
          "Un segundo efecto sobre el suelo, distinto y correcto.",
          "Una acción sostenible concreta (reciclar, reutilizar, reparar, recuperar metales de residuos electrónicos) con su explicación.",
        ],
        modelo: "Agua: el cianuro que se usa para disolver el oro puede filtrarse desde las pilas de roca y matar peces en los ríos; además, la roca removida con sulfuros produce drenaje ácido, que disuelve metales pesados como plomo y arsénico y los arrastra al agua. Suelo: para abrir el tajo se elimina la vegetación y la capa fértil, y el suelo desnudo se erosiona; los relaves con químicos quedan sobre el terreno y lo vuelven infértil por muchos años. Acción: reciclar las latas de aluminio en un centro de acopio, porque el aluminio se funde para hacer latas nuevas y así no hay que extraer más bauxita.",
        lineas: 12 },
      { t: "abierta", p: "Situación: en el servicio de medicina nuclear de un hospital se preparan inyecciones de tecnecio-99m todos los días. Proponé cuatro medidas para proteger a los trabajadores, a los pacientes y al ambiente, incluyendo qué hacer con los residuos.",
        guia: [
          "Aplica el tiempo: exposición lo más corta posible.",
          "Aplica la distancia o el blindaje (pinzas, mamparas o protectores de plomo para jeringas, paredes blindadas).",
          "Señalización con el trébol, dosímetro personal o capacitación del personal.",
          "Residuos: separarlos en un recipiente blindado y rotulado, guardarlos hasta que decaigan y medirlos antes de desecharlos; nunca a la basura común.",
        ],
        modelo: "1) Preparar las inyecciones rápido y con todo listo, para estar poco tiempo cerca del material. 2) Manipular las jeringas con protectores de plomo y detrás de una mampara blindada, y alejarse cuando no se está trabajando. 3) Rotular el área y los recipientes con el trébol y que cada trabajador use su dosímetro para controlar la dosis que recibe. 4) Echar las jeringas y guantes usados en un recipiente blindado y rotulado, guardarlo varios días en el almacén de decaimiento (la vida media del tecnecio-99m es de unas 6 horas), medirlo con un detector y solo entonces desecharlo; nunca botarlo en la basura común.",
        lineas: 10 },
    ] },
  ],
};

const SIMULACRO_B = {
  nombre: "Simulacro B",
  partes: [
    { titulo: "I parte. Selección única (12 pts)", instrucciones: INSTRUCCIONES.seleccion, items: [
      { t: "opcion", p: "¿Qué familia tiene 2 electrones de valencia y está formada por metales como el magnesio y el calcio?", o: ["alcalinotérreos", "alcalinos", "térreos", "halógenos"], r: 0,
        e: "El grupo 2 (IIA), con 2 electrones de valencia, es el de los **alcalinotérreos**." },
      { t: "opcion", p: "Los elementos de transición interna se ubican en:", o: ["el bloque f, en las dos filas de abajo de la tabla", "el bloque d, en el centro de la tabla", "el bloque s, a la izquierda de la tabla", "el bloque p, a la derecha de la tabla"], r: 0,
        e: "Los de transición interna (lantánidos y actínidos) forman el **bloque f**, las dos filas de abajo." },
      { t: "opcion", p: "¿Cuál de estos elementos es un no metal líquido a temperatura ambiente?", o: ["bromo", "mercurio", "cloro", "yodo"], r: 0,
        e: "El **bromo** es el único no metal líquido. El mercurio también es líquido, pero es metal; el cloro es gas y el yodo es sólido." },
      { t: "opcion", p: "¿Por qué el silicio se usa para fabricar los chips de las computadoras?", o: ["porque es un metaloide semiconductor", "porque es un gas noble que no reacciona", "porque es el metal que mejor conduce la electricidad", "porque es un halógeno muy reactivo"], r: 0,
        e: "El silicio es un **metaloide semiconductor**: conduce más que un no metal y menos que un metal, y eso permite controlar la corriente en los chips." },
      { t: "opcion", p: "El carbonato de calcio de la cal agrícola tiene la fórmula CaCO₃. ¿Qué elementos contiene?", o: ["calcio, carbono y oxígeno", "carbono, cobalto y oxígeno", "calcio, cobre y oxígeno", "cadmio, carbono y osmio"], r: 0,
        e: "Ca = calcio, C = carbono, O = oxígeno. Cada mayúscula empieza un elemento: no hay cobalto (Co) ni cobre (Cu)." },
      { t: "opcion", p: "En una zona minera, ¿qué efecto produce el drenaje ácido?", o: ["disuelve metales pesados de la roca y los arrastra a los ríos", "neutraliza el cianuro y limpia el agua", "aumenta la fertilidad del suelo", "evita la erosión de las laderas"], r: 0,
        e: "El ácido que se forma con los sulfuros **disuelve metales pesados** (plomo, arsénico) y la lluvia los lleva a los ríos." },
      { t: "opcion", p: "¿Cuál acción ayuda a disminuir la extracción de nuevos minerales?", o: ["reparar los aparatos electrónicos en lugar de cambiarlos por nuevos", "cambiar el celular cada año aunque funcione", "botar las latas de aluminio con la basura común", "quemar los aparatos viejos para deshacerse de ellos"], r: 0,
        e: "**Reparar** alarga la vida del aparato y evita fabricar uno nuevo con metales recién extraídos." },
      { t: "opcion", p: "Un átomo neutro de sodio (Z = 11) pierde un electrón. ¿Cómo queda?", o: ["catión Na⁺ con 11 protones y 10 electrones", "anión Na⁻ con 11 protones y 12 electrones", "catión Na⁺ con 10 protones y 10 electrones", "átomo neutro con 11 protones y 11 electrones"], r: 0,
        e: "Al perder un electrón queda con 10 electrones y los mismos **11 protones**: catión Na⁺." },
      { t: "opcion", p: "¿Cuál de estas especies tiene exactamente 20 neutrones?", o: ["⁴⁰₂₀Ca", "⁴⁰₁₈Ar", "³⁵₁₇Cl", "²⁴₁₂Mg"], r: 0,
        e: "⁴⁰₂₀Ca: 40 − 20 = **20**. ⁴⁰Ar tiene 22, ³⁵Cl tiene 18 y ²⁴Mg tiene 12." },
      { t: "opcion", p: "¿Qué radiación es la más penetrante y solo se reduce con plomo grueso o concreto?", o: ["gamma", "alfa", "beta"], r: 0,
        e: "La **gamma** es la más penetrante; la alfa la para el papel y la beta, el aluminio." },
      { t: "opcion", p: "Cuando un núcleo emite una partícula beta:", o: ["su número atómico aumenta en 1 y su número másico no cambia", "su número atómico disminuye en 2 y su número másico en 4", "no cambian ni su número atómico ni su número másico", "pierde un protón y un electrón"], r: 0,
        e: "En la emisión beta un neutrón se convierte en protón: **Z sube 1** y A queda igual. Bajar 2 y 4 es la alfa; no cambiar es la gamma." },
      { t: "opcion", p: "¿Cuál es una aplicación de la radiactividad en la agricultura?", o: ["esterilizar insectos plaga con radiación para que no se reproduzcan", "producir electricidad en un reactor", "fechar fósiles con carbono-14", "radiografiar soldaduras de puentes"], r: 0,
        e: "La **técnica del insecto estéril** es agrícola. La electricidad y las soldaduras son industria; el carbono-14 es investigación." },
    ] },
    { titulo: "II parte. Falso o verdadero (6 pts)", instrucciones: INSTRUCCIONES.vf, items: [
      { t: "vf", p: "Los metales tienden a perder electrones y a formar cationes.", r: true,
        e: "**Verdadero.** Al perder electrones quedan con carga positiva." },
      { t: "vf", p: "El aluminio es un metaloide porque está junto a la línea en escalera.", r: false,
        e: "**Falso.** El aluminio toca la escalera, pero es un **metal**: brilla, conduce y se hace lámina." },
      { t: "vf", p: "Co es el símbolo del cobalto, mientras que CO representa dos elementos: carbono y oxígeno.", r: true,
        e: "**Verdadero.** Cada mayúscula empieza un elemento nuevo." },
      { t: "vf", p: "El litio se usa en las baterías de los celulares y de los carros eléctricos.", r: true,
        e: "**Verdadero.** Las baterías de iones de litio son livianas y guardan mucha energía." },
      { t: "vf", p: "La radiactividad natural la descubrió Irène Joliot-Curie en 1934.", r: false,
        e: "**Falso.** La natural la descubrió **Becquerel en 1896**; en 1934 Irène Joliot-Curie y Frédéric Joliot obtuvieron la **artificial**." },
      { t: "vf", p: "A un paciente al que le tomaron una radiografía de rayos X le queda radiactividad en el cuerpo durante varios días.", r: false,
        e: "**Falso.** Fue irradiado desde afuera por un aparato eléctrico; no le queda material radiactivo." },
    ] },
    { titulo: "III parte. Correspondencia (10 pts)", instrucciones: INSTRUCCIONES.correspondencia, items: [
      { t: "parejas", fig: FIG_SIMULACRO_B, p: "Cada letra de la tabla periódica esquemática señala un elemento. Clasificá cada uno como metal, no metal o metaloide.",
        pares: [["A", "metal"], ["B", "no metal"], ["C", "metaloide"], ["D", "metal"], ["E", "no metal"]],
        e: "A: grupo 1, metal alcalino (K). B: grupo 15, periodo 2, no metal (N). C: grupo 15, periodo 4, junto a la escalera, metaloide (As). D: centro de la tabla, metal de transición (Ni). E: grupo 17, no metal (Cl)." },
      { t: "parejas", p: "Uní cada radioisótopo con su uso.",
        pares: [["Carbono-14", "fechar restos de seres vivos"], ["Cobalto-60", "radioterapia y esterilización de material médico"], ["Yodo-131", "tratamiento de enfermedades de la tiroides"], ["Americio-241", "detectores de humo"], ["Flúor-18", "estudios de diagnóstico PET"]],
        e: "Carbono-14: datación. Cobalto-60: radioterapia y esterilización. Yodo-131: tiroides. Americio-241: detectores de humo. Flúor-18: PET." },
    ] },
    { titulo: "IV parte. Respuesta corta (12 pts)", instrucciones: INSTRUCCIONES.corta, items: [
      { t: "completar", p: "El símbolo químico del calcio es ___.", r: ["Ca"], may: true,
        e: "**Ca**: C mayúscula y a minúscula. C sola es el carbono." },
      { t: "completar", p: "El símbolo químico del manganeso es ___.", r: ["Mn"], may: true,
        e: "**Mn**. No lo confundás con Mg, el magnesio." },
      { t: "completar", p: "El elemento cuyo símbolo es Ag se llama ___.", r: ["plata"],
        e: "**Ag** es la **plata** (argentum). El oro es Au." },
      { t: "completar", p: "El elemento cuyo símbolo es K se llama ___.", r: ["potasio"],
        e: "**K** es el **potasio** (kalium)." },
      { t: "numero", p: "Para el ion ⁶⁰₂₈Ni²⁺, ¿cuántos protones hay?", r: 28,
        e: "p = Z = **28**." },
      { t: "numero", p: "Para el ion ⁶⁰₂₈Ni²⁺, ¿cuántos neutrones hay?", r: 32,
        e: "n = 60 − 28 = **32**." },
      { t: "numero", p: "Para el ion ⁶⁰₂₈Ni²⁺, ¿cuántos electrones hay?", r: 26,
        e: "Carga 2+ → perdió 2: 28 − 2 = **26**." },
      { t: "numero", p: "Para el ion ³¹₁₅P³⁻, ¿cuántos electrones hay?", r: 18,
        e: "Carga 3− → ganó 3: 15 + 3 = **18**." },
      { t: "numero", p: "Para el ion ³¹₁₅P³⁻, ¿cuántos neutrones hay?", r: 16,
        e: "n = 31 − 15 = **16**." },
      { t: "numero", p: "El cobalto-60 se usa en radioterapia. Si su número atómico es 27, ¿cuántos neutrones tiene?", r: 33,
        e: "n = 60 − 27 = **33**." },
      { t: "numero", p: "El torio-232 (Z = 90) emite una partícula alfa. ¿Cuál es el número másico del núcleo que se forma?", r: 228,
        e: "En la emisión alfa A baja 4: 232 − 4 = **228**." },
      { t: "numero", p: "El yodo-131 tiene una vida media de 8 días. Si un hospital guarda 40 mg, ¿cuántos miligramos quedan a los 16 días?", r: 10,
        e: "16 días son 2 vidas medias: 40 → 20 → **10 mg**." },
    ] },
    { titulo: "V parte. Desarrollo (9 pts)", instrucciones: INSTRUCCIONES.desarrollo, items: [
      { t: "abierta", p: "Una empresa propone abrir una mina de oro a cielo abierto cerca de un río. (a) Explicá dos consecuencias para el agua y una para el suelo. (b) Proponé dos acciones sostenibles que permitan obtener metales sin abrir una mina nueva y explicá por qué funcionan.",
        guia: [
          "(a) Una consecuencia correcta para el agua.",
          "(a) Otra consecuencia correcta y distinta para el agua.",
          "(a) Una consecuencia correcta para el suelo.",
          "(b) Primera acción sostenible concreta, con su explicación.",
          "(b) Segunda acción sostenible concreta y distinta, con su explicación.",
        ],
        modelo: "(a) Agua: el cianuro que se usa para separar el oro puede derramarse o filtrarse al río y matar a los peces; los sedimentos de la tierra removida enturbian el río y entierran los hábitats acuáticos. Suelo: se elimina el bosque y la capa fértil, el terreno se erosiona y queda cubierto de relaves que no sirven para cultivar. (b) Recuperar oro, plata y cobre de celulares y computadoras viejas entregándolos a gestores autorizados: esos metales vuelven a usarse y no hay que extraerlos. Reciclar chatarra de cobre y aluminio en centros de acopio: el metal se funde y se reutiliza muchas veces sin perder calidad. Además, en Costa Rica la Ley 8904 no permite minería metálica a cielo abierto.",
        lineas: 12 },
      { t: "abierta", p: "Analizá esta situación: una empresa constructora usa un medidor con una fuente radiactiva para revisar la compactación del suelo en las carreteras, y al final del día lo deja en la parte de atrás de un pick-up, sin rótulo y sin candado. (a) Nombrá un beneficio de usar ese medidor. (b) Nombrá un peligro de la forma en que lo guardan. (c) Proponé dos medidas para usarlo y guardarlo de forma segura.",
        guia: [
          "(a) Un beneficio correcto (mide densidad o humedad del suelo rápido y sin romper la carretera).",
          "(b) Un peligro correcto (robo o pérdida, que alguien lo abra o lo venda como chatarra, exposición de personas).",
          "(c) Primera medida correcta (guardarlo bajo llave en un lugar blindado, rotulado con el trébol, con inventario).",
          "(c) Segunda medida correcta y distinta (capacitación y dosímetro, tiempo-distancia-blindaje, permiso del Ministerio de Salud, devolverlo al fabricante cuando ya no se use).",
        ],
        modelo: "(a) El medidor permite saber si el suelo está bien compactado sin hacer huecos ni romper la carretera, y lo hace en pocos minutos. (b) Como está sin rótulo ni candado, alguien podría robarlo, abrirlo o venderlo como chatarra sin saber que es radiactivo, y exponerse a la radiación, como pasó en Goiânia. (c) Guardarlo en un contenedor blindado, con candado y rotulado con el trébol, en una bodega autorizada, y llevar un registro de dónde está cada día. Que solo lo use personal capacitado, con dosímetro, el menor tiempo posible y manteniendo distancia; y que la empresa tenga el permiso del Ministerio de Salud y devuelva la fuente al fabricante cuando ya no la use.",
        lineas: 10 },
    ] },
  ],
};

// ── Exportación ─────────────────────────────────────────────────────────────────────────────────────────

export default {
  duracion: 120,
  temas: [TABLA_PERIODICA, SIMBOLOS, USOS_Y_MINERIA, ATOMO, RADIACTIVIDAD, RADIACTIVIDAD_USOS],
  simulacros: [SIMULACRO_A, SIMULACRO_B],
};
