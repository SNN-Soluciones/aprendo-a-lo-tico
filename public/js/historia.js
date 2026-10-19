// 🏛️ Lógica de «La historia de Costa Rica» (sin pantalla, para poder probarla sola con node).
// Hechos con su año, personajes, los ocho pueblos indígenas, el gobierno y la ciudadanía.
// Cada escalón arma preguntas al azar de tres tipos:
//   opciones: { tipo: "opciones", instr, html, voz, opciones: [{ id, html, voz, porque }], correcta, explica, cols? }
//             porque: lo que se explica si el niño toca esa opción y no era
//   ordenar:  { tipo: "ordenar", instr, html, voz, items: [hecho], orden: [ids del más antiguo al más reciente], conAño, explica }
//   escribir: { tipo: "escribir", instr, html, voz, respuesta: "1948", año, explica }
// Solo datos bien establecidos (los que enseña el MEP en primaria).

// ---------- Hechos ----------
// año: para ordenar (null = no tiene un año exacto) · fecha: el día, si es una fecha patria · t: título corto
// d: qué pasó · imp: por qué es importante · ordenar: false = no se usa en la línea del tiempo
// grupo: hechos parecidos, que no se ponen juntos en «¿Por qué es importante?» (para que no haya dos respuestas buenas)
export const HECHOS = [
  { id: "pueblos", año: null, cuando: "Antes de 1502", e: "🌽", t: "Los pueblos originarios",
    d: "Antes de que llegaran los españoles, en este territorio vivían muchos pueblos indígenas: sembraban maíz, hacían cerámica, figuras de jade y piezas de oro.",
    imp: "Son nuestras raíces: sus descendientes siguen viviendo aquí, con su idioma y su cultura." },
  { id: "esferas", año: null, cuando: "Antes de 1502", e: "🪨", t: "Las esferas de piedra del Diquís", ordenar: false,
    d: "Pueblos indígenas del sur del país tallaron enormes esferas de piedra; algunas miden más de dos metros.",
    imp: "Son un tesoro de nuestros antepasados que el mundo entero reconoce." },
  { id: "colon", año: 1502, cuando: "1502", e: "⛵", t: "Colón llega al Caribe",
    d: "En su cuarto viaje, Cristóbal Colón llegó a la costa del Caribe, cerca de donde hoy está Limón.",
    imp: "Empezó la llegada de los españoles, que cambió para siempre la vida de los pueblos indígenas." },
  { id: "cartago", año: 1563, cuando: "1563", e: "🏘️", t: "Fundación de Cartago",
    d: "Juan Vázquez de Coronado fundó la ciudad de Cartago, en el valle del Guarco.",
    imp: "Cartago fue la capital de la provincia durante toda la época colonial." },
  { id: "independencia", grupo: "independencia", año: 1821, fecha: "15 de setiembre", cuando: "1821", e: "🇨🇷", t: "La Independencia",
    d: "El 15 de setiembre de 1821 se firmó en Guatemala el Acta de Independencia de Centroamérica. La noticia llegó a Costa Rica en octubre.",
    imp: "Costa Rica dejó de ser una colonia de España y empezó a gobernarse a sí misma." },
  { id: "nicoya", año: 1824, fecha: "25 de julio", cuando: "1824", e: "🤠", t: "Anexión del Partido de Nicoya",
    d: "El 25 de julio de 1824 el Partido de Nicoya decidió unirse a Costa Rica.",
    imp: "Así el territorio que hoy es Guanacaste pasó a ser parte de Costa Rica." },
  { id: "cafe", año: null, cuando: "Años 1800", siglo: 19, e: "☕", t: "El café, el grano de oro", ordenar: false,
    d: "En los años 1800 el café se volvió el producto más importante que Costa Rica vendía a otros países.",
    imp: "Con el dinero del café se construyeron caminos, el tren, escuelas y el Teatro Nacional." },
  { id: "santarosa", grupo: "campaña", año: 1856, fecha: "20 de marzo", cuando: "1856", e: "⚔️", t: "Batalla de Santa Rosa",
    d: "El 20 de marzo de 1856, en la hacienda Santa Rosa, en Guanacaste, el ejército costarricense derrotó a los filibusteros de William Walker.",
    imp: "Fue la primera victoria de la Campaña Nacional para defender la libertad del país." },
  { id: "rivas", grupo: "campaña", año: 1856, fecha: "11 de abril", cuando: "1856", e: "🔥", t: "Batalla de Rivas",
    d: "El 11 de abril de 1856, en Rivas, Nicaragua, Juan Santamaría le prendió fuego al mesón donde se escondían los filibusteros y murió en la batalla.",
    imp: "Recordamos a Juan Santamaría, nuestro héroe nacional: por eso el 11 de abril es feriado." },
  { id: "walker", grupo: "campaña", año: 1857, cuando: "1857", e: "🏳️", t: "Termina la Campaña Nacional",
    d: "En 1857 William Walker se rindió en Rivas, Nicaragua.",
    imp: "Los filibusteros salieron de Centroamérica y terminó la guerra." },
  { id: "educacion", año: 1869, cuando: "1869", e: "🏫", t: "Escuela gratuita y obligatoria",
    d: "La Constitución de 1869 hizo que la educación primaria fuera gratuita y obligatoria, pagada por el Estado.",
    imp: "Gracias a eso muchos más niños y niñas pudieron ir a la escuela." },
  { id: "democracia", grupo: "voto", año: 1889, fecha: "7 de noviembre", cuando: "1889", e: "🗳️", t: "El Día de la Democracia",
    d: "El 7 de noviembre de 1889 el pueblo salió a la calle a defender el resultado de las elecciones.",
    imp: "Es un símbolo de que en Costa Rica se respeta el voto de la gente." },
  { id: "ferrocarril", grupo: "cafe", año: 1890, cuando: "1890", e: "🚂", t: "El tren al Atlántico",
    d: "Se terminó el ferrocarril entre San José y Limón. Para construirlo llegaron trabajadores de Jamaica, China e Italia.",
    imp: "Sirvió para llevar el café hasta el puerto de Limón, y muchas familias afrocaribeñas se quedaron a vivir en Limón." },
  { id: "teatro", grupo: "cafe", año: 1897, cuando: "1897", e: "🎭", t: "El Teatro Nacional",
    d: "Se inauguró el Teatro Nacional, en San José. Se construyó con un impuesto al café.",
    imp: "Muestra cómo el café ayudó a construir el país; es uno de los edificios más bellos de Costa Rica." },
  { id: "ucr", grupo: "reforma", año: 1940, cuando: "1940", e: "🎓", t: "La Universidad de Costa Rica",
    d: "Se fundó la Universidad de Costa Rica.",
    imp: "Más jóvenes pudieron estudiar una carrera sin salir del país." },
  { id: "ccss", grupo: "reforma", año: 1941, cuando: "1941", e: "🏥", t: "Nace la Caja (CCSS)",
    d: "Con el presidente Rafael Ángel Calderón Guardia se creó la Caja Costarricense de Seguro Social.",
    imp: "Gracias a la Caja las personas pueden ir al médico, al EBAIS y al hospital." },
  { id: "garantias", grupo: "reforma", año: 1943, cuando: "1943", e: "🤝", t: "Garantías Sociales y Código de Trabajo",
    d: "Se agregaron las Garantías Sociales a la Constitución y se aprobó el Código de Trabajo.",
    imp: "Protegen a las personas trabajadoras: salario mínimo, vacaciones y una jornada de trabajo justa." },
  { id: "ejercito", grupo: "1948", año: 1948, fecha: "1 de diciembre", cuando: "1948", e: "🕊️", t: "Abolición del ejército",
    d: "El 1 de diciembre de 1948 José Figueres Ferrer anunció la abolición del ejército en el Cuartel Bellavista, que hoy es el Museo Nacional.",
    imp: "El dinero que iba para el ejército se puede usar en educación y salud: Costa Rica es conocida como un país de paz." },
  { id: "constitucion", grupo: "1948", año: 1949, cuando: "1949", e: "📜", t: "La Constitución Política de hoy",
    d: "Se aprobó la Constitución Política que tenemos hoy. Prohíbe tener ejército y les da el voto a las mujeres.",
    imp: "Es la ley más importante del país: todas las demás leyes tienen que respetarla." },
  { id: "voto", grupo: "voto", año: 1950, cuando: "1950", e: "👩", t: "Las mujeres votan por primera vez",
    d: "En 1950, en una votación en La Tigra y La Fortuna de San Carlos, las mujeres votaron por primera vez en Costa Rica.",
    imp: "Fue la primera vez que las mujeres usaron su derecho a votar, que la Constitución de 1949 les había dado." },
  { id: "nobel", año: 1987, cuando: "1987", e: "🏅", t: "Premio Nobel de la Paz",
    d: "Óscar Arias Sánchez recibió el Premio Nobel de la Paz por su plan de paz para Centroamérica.",
    imp: "El mundo reconoció el trabajo de Costa Rica por la paz en una región que vivía guerras." },
  { id: "patrimonio", año: 2014, cuando: "2014", e: "🌎", t: "Las esferas, Patrimonio de la Humanidad", ordenar: false,
    d: "En 2014 la UNESCO declaró Patrimonio de la Humanidad los sitios con esferas de piedra del Diquís.",
    imp: "Ahora el mundo entero tiene que ayudar a cuidar ese tesoro de los pueblos originarios." },
];
export const hecho = id => HECHOS.find(h => h.id === id);
const ordenables = HECHOS.filter(h => h.ordenar !== false);
// Para ordenar: los pueblos originarios van antes que todo
const clave = h => h.año ?? 0;

// ---------- Personajes ----------
export const PERSONAS = [
  { id: "colon", n: "Cristóbal Colón", e: "⛵", d: "Navegante que en 1502 llegó a la costa del Caribe de Costa Rica." },
  { id: "coronado", n: "Juan Vázquez de Coronado", e: "🏘️", d: "Conquistador español que fundó la ciudad de Cartago en 1563." },
  { id: "mora", n: "Juan Rafael Mora Porras", e: "🎖️", d: "Presidente que llamó al pueblo a defender el país contra los filibusteros en la Campaña Nacional de 1856." },
  { id: "santamaria", n: "Juan Santamaría", e: "🔥", d: "Soldado alajuelense que quemó el mesón de los filibusteros en la batalla de Rivas. El aeropuerto internacional lleva su nombre." },
  { id: "pancha", n: "Francisca «Pancha» Carrasco", e: "💪", d: "Mujer cartaginesa que fue a la Campaña Nacional: cuidó a los heridos y también peleó en la batalla de Rivas." },
  { id: "walker", n: "William Walker", e: "🏴", d: "Filibustero estadounidense que se apoderó de Nicaragua y quería dominar Centroamérica." },
  { id: "calderon", n: "Rafael Ángel Calderón Guardia", e: "🏥", d: "Presidente que creó la Caja Costarricense de Seguro Social y las Garantías Sociales." },
  { id: "figueres", n: "José Figueres Ferrer", e: "🕊️", d: "«Don Pepe»: anunció la abolición del ejército el 1 de diciembre de 1948." },
  { id: "arias", n: "Óscar Arias Sánchez", e: "🏅", d: "Presidente que ganó el Premio Nobel de la Paz en 1987 por su plan de paz para Centroamérica." },
];

// ---------- Los ocho pueblos indígenas de hoy ----------
// donde: dónde viven, en general · pista: algo que solo es de ese pueblo (para «¿Qué pueblo…?»)
// zonas: para no poner en la misma pregunta dos lugares que sirven para el mismo pueblo (Talamanca, el sur de Puntarenas)
export const PUEBLOS = [
  { id: "bribri", zonas: ["talamanca", "sur"], n: "Bribri", donde: "en Talamanca (Limón) y en el sur de Puntarenas", pista: "habla bribri y para su cultura el cacao es muy importante" },
  { id: "cabecar", zonas: ["talamanca"], n: "Cabécar", donde: "en las montañas de Alto Chirripó y Talamanca", pista: "es uno de los pueblos más numerosos y vive en Alto Chirripó" },
  { id: "maleku", zonas: ["norte"], n: "Maleku", donde: "en Guatuso, en la zona norte de Alajuela", pista: "vive en Guatuso, en la zona norte" },
  { id: "boruca", zonas: ["sur"], n: "Brunca o boruca", donde: "en Boruca y Curré, en el sur de Puntarenas", pista: "es famoso por sus máscaras talladas y la Fiesta de los Diablitos" },
  { id: "ngabe", zonas: ["sur"], n: "Ngäbe", donde: "en Coto Brus, Corredores y Golfito, en el sur", pista: "vive en Coto Brus, Corredores y Golfito" },
  { id: "huetar", zonas: ["sanjose"], n: "Huetar", donde: "en Quitirrisí y Zapatón, en la provincia de San José", pista: "vive en Quitirrisí y Zapatón, cerca de la capital" },
  { id: "chorotega", zonas: ["guanacaste"], n: "Chorotega", donde: "en Matambú, en Guanacaste", pista: "vive en Matambú, Guanacaste" },
  { id: "terraba", zonas: ["sur"], n: "Térraba o teribe", donde: "en Térraba, en Buenos Aires de Puntarenas", pista: "vive en Térraba, en Buenos Aires de Puntarenas" },
];

// ---------- Gobierno y ciudadanía (5° y 6°) ----------
export const PODERES = [
  { id: "ejecutivo", n: "Poder Ejecutivo", e: "🏢", quien: "el presidente o la presidenta de la República y sus ministros", hace: "Gobierna y administra el país, y hace cumplir las leyes." },
  { id: "legislativo", n: "Poder Legislativo", e: "🏛️", quien: "la Asamblea Legislativa, con 57 diputados y diputadas", hace: "Hace las leyes y aprueba el presupuesto del país." },
  { id: "judicial", n: "Poder Judicial", e: "⚖️", quien: "la Corte Suprema de Justicia y los tribunales", hace: "Juzga y resuelve los conflictos según las leyes." },
  { id: "tse", n: "Tribunal Supremo de Elecciones", e: "🗳️", quien: "los magistrados del TSE", hace: "Organiza las elecciones y entrega la cédula de identidad." },
];
// Preguntas de respuesta fija: la primera opción es la correcta (se barajan al armar la pregunta)
const CIVICA = [
  { p: "¿Qué poder hace las leyes?", ops: ["Poder Legislativo", "Poder Ejecutivo", "Poder Judicial", "Tribunal Supremo de Elecciones"],
    ex: "El Poder Legislativo, o sea la Asamblea Legislativa, hace las leyes." },
  { p: "¿Quién dirige el Poder Ejecutivo?", ops: ["El presidente o la presidenta de la República", "La Corte Suprema de Justicia", "Los diputados"],
    ex: "El Poder Ejecutivo lo dirige el presidente o la presidenta de la República, con sus ministros." },
  { p: "¿Qué hace el Poder Judicial?", ops: ["Juzga y resuelve conflictos según las leyes", "Hace las leyes", "Organiza las elecciones"],
    ex: "El Poder Judicial juzga y resuelve los conflictos según las leyes." },
  { p: "¿Quién organiza las elecciones?", ops: ["El Tribunal Supremo de Elecciones", "La Asamblea Legislativa", "La Municipalidad"],
    ex: "El Tribunal Supremo de Elecciones (TSE) organiza las elecciones. Tiene el rango de un poder del Estado." },
  { p: "¿Cuántos diputados tiene la Asamblea Legislativa?", ops: ["57", "40", "81", "100"],
    ex: "La Asamblea Legislativa tiene 57 diputados y diputadas." },
  { p: "¿Cada cuántos años se elige presidente o presidenta?", ops: ["Cada 4 años", "Cada 2 años", "Cada 6 años", "Cada año"],
    ex: "En Costa Rica hay elecciones nacionales cada 4 años." },
  { p: "¿Desde qué edad se puede votar en las elecciones?", ops: ["Desde los 18 años", "Desde los 12 años", "Desde los 15 años", "Desde los 25 años"],
    ex: "Pueden votar los costarricenses de 18 años o más." },
  { p: "¿Quién entrega la cédula de identidad?", ops: ["El Tribunal Supremo de Elecciones", "El Poder Judicial", "La escuela"],
    ex: "La cédula la entrega el Tribunal Supremo de Elecciones, por medio del Registro Civil." },
  { p: "¿Cuál es la ley más importante del país?", ops: ["La Constitución Política", "El reglamento de la escuela", "El Código de Trabajo"],
    ex: "La Constitución Política es la ley más importante: todas las demás tienen que respetarla." },
  { p: "¿Cómo se llama el gobierno de cada cantón?", ops: ["La Municipalidad", "La Asamblea Legislativa", "La Corte Suprema"],
    ex: "Cada cantón tiene su Municipalidad, con un alcalde o alcaldesa y el Concejo Municipal." },
  { p: "¿Quién dirige la Municipalidad?", ops: ["El alcalde o la alcaldesa", "El presidente de la República", "Un diputado"],
    ex: "La Municipalidad la dirige el alcalde o la alcaldesa, junto con el Concejo Municipal." },
];
// ¿Derecho o deber?
export const DERECHOS = ["Tener un nombre y una nacionalidad", "Recibir atención cuando estoy enfermo", "Jugar y descansar",
  "Ser tratado con respeto", "Ir a la escuela", "Dar mi opinión y que me escuchen", "Vivir en un ambiente sano"];
export const DEBERES = ["Respetar a los demás", "Cuidar el ambiente", "Cumplir las normas de la escuela", "Cuidar los parques y los bienes de todos",
  "Hacer mis tareas", "Ayudar en la casa", "No botar basura en la calle"];

// ---------- Utilidades ----------
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const ROMANOS = { 15: "XV", 16: "XVI", 17: "XVII", 18: "XVIII", 19: "XIX", 20: "XX", 21: "XXI" };
/** Siglo de un año: 1502 → 16 (los años 1501 a 1600). */
export const siglo = año => Math.ceil(año / 100);
export const romano = n => ROMANOS[n];
const sigloDe = h => h.siglo || siglo(h.año);
const cal = f => { const [dia, mes] = f.split(" de "); return `<span class="calendario"><small>${mes}</small><b>${dia}</b></span>`; };
const titulo = h => `${h.e} ${h.t}`;

/** Escoge n hechos con años distintos (y separados al menos por `sep` años), y como mucho un hecho sin año. */
function escogerHechos(n, sep, rnd, conPueblos = true) {
  for (let intento = 0; intento < 200; intento++) {
    const pool = barajar(ordenables.filter(h => conPueblos || h.año), rnd);
    const elegidos = [];
    for (const h of pool) {
      if (elegidos.length === n) break;
      if (elegidos.every(x => Math.abs(clave(x) - clave(h)) >= sep)) elegidos.push(h);
    }
    if (elegidos.length === n) return elegidos;
  }
  throw new Error("no hay suficientes hechos");
}

// ---------- Generadores de preguntas ----------
/** ¿Qué pasó primero? Dos hechos; con o sin el año a la vista. */
function primero({ verAño, sep }, rnd) {
  const [a, b] = escogerHechos(2, sep, rnd, !verAño);
  const antes = clave(a) < clave(b) ? a : b, despues = antes === a ? b : a;
  const op = h => ({ id: h.id, html: `<b>${h.e}</b>${h.t}${verAño ? `<small>${h.cuando}</small>` : ""}`, voz: h.t,
    porque: `No: ${h.t} fue ${h === despues ? "después" : "antes"}, en ${h.cuando.toLowerCase()}.` });
  return { tipo: "opciones", instr: "¿Qué pasó <b>primero</b>?", cols: 2,
    html: `⏳ ¿Qué pasó primero?${verAño ? "<small>Fijate en los años: el número más pequeño es el más antiguo.</small>" : ""}`,
    voz: `¿Qué pasó primero: ${a.t}, o ${b.t}?`,
    opciones: barajar([a, b], rnd).map(op), correcta: antes.id,
    explica: `Primero fue <b>${titulo(antes)}</b> (${antes.cuando}) y después <b>${titulo(despues)}</b> (${despues.cuando}). ${antes.d}` };
}

/** Línea del tiempo: tocar los hechos del más antiguo al más reciente. */
function ordenar({ n, verAño, sep }, rnd) {
  const items = barajar(escogerHechos(n, sep, rnd, !verAño), rnd);
  const orden = [...items].sort((x, y) => clave(x) - clave(y)).map(h => h.id);
  return { tipo: "ordenar", instr: "Ordená del más <b>antiguo</b> al más <b>reciente</b>", conAño: verAño,
    html: `⏳ Tocá los hechos en orden: primero el más antiguo.${verAño ? "<small>El año más pequeño va primero.</small>" : ""}`,
    voz: `Ordená estos hechos, del más antiguo al más reciente: ${items.map(h => h.t).join(", ")}.`,
    items, orden,
    explica: orden.map(id => { const h = hecho(id); return `${h.e} <b>${h.cuando}</b>: ${h.t}`; }).join(" → ") };
}

/** Fechas patrias: ¿qué pasó ese día? o ¿qué día fue? */
function fechaPatria(rnd) {
  const con = HECHOS.filter(h => h.fecha);
  const x = azar(con, rnd), otros = barajar(con.filter(h => h !== x), rnd).slice(0, 2);
  if (rnd() < 0.5) {
    return { tipo: "opciones", instr: "¿Qué pasó ese <b>día</b>?", cols: 1,
      html: `${cal(x.fecha)}${x.fecha} de ${x.año}`, voz: `¿Qué pasó el ${x.fecha} de ${x.año}?`,
      opciones: barajar([x, ...otros], rnd).map(h => ({ id: h.id, html: titulo(h), voz: h.t, porque: `No: ${h.t} fue el ${h.fecha} de ${h.año}.` })),
      correcta: x.id, explica: `<b>${x.fecha} de ${x.año}</b>: ${titulo(x)}. ${x.d}` };
  }
  return { tipo: "opciones", instr: "¿Qué <b>día</b> fue?", cols: 1,
    html: `<span class="grande">${x.e}</span>${x.t}`, voz: `¿Qué día fue: ${x.t}?`,
    opciones: barajar([x, ...otros], rnd).map(h => ({ id: h.id, html: `${h.fecha} de ${h.año}`, voz: `${h.fecha} de ${h.año}`, porque: `No: el ${h.fecha} de ${h.año} fue ${h.t}.` })),
    correcta: x.id, explica: `${titulo(x)}: <b>${x.fecha} de ${x.año}</b>. ${x.d}` };
}

// Pueblos originarios y la llegada de los españoles (preguntas de respuesta fija)
const ORIGINARIOS = [
  { p: "¿Quiénes vivían en Costa Rica antes de que llegaran los españoles?", ops: ["Muchos pueblos indígenas", "Nadie: estaba vacía", "Los aztecas"],
    ex: "Antes de 1502 aquí vivían muchos pueblos indígenas, que hoy llamamos pueblos originarios." },
  { p: "¿Qué tallaron los pueblos indígenas del Diquís, en el sur del país?", ops: ["Esferas de piedra", "Pirámides de piedra", "Castillos"],
    ex: "En el Diquís, en el sur, tallaron enormes esferas de piedra; algunas miden más de dos metros." },
  { p: "¿Con qué hacían figuras y joyas los pueblos precolombinos?", ops: ["Con jade y oro", "Con plástico y vidrio", "Con hierro y acero"],
    ex: "Hacían figuras de jade y piezas de oro muy finas. Se pueden ver en el Museo del Jade y en el Museo del Oro Precolombino, en San José." },
  { p: "¿Qué alimento sembraban los pueblos originarios?", ops: ["Maíz", "Trigo", "Arroz"],
    ex: "El maíz era uno de sus alimentos principales. El arroz y el trigo los trajeron los europeos." },
  { p: "¿Cuál de estos es un pueblo indígena de Costa Rica?", ops: ["*pueblo*", "Los aztecas", "Los incas", "Los mayas"],
    ex: "Los aztecas vivían en México, los incas en Sudamérica y los mayas en México y el norte de Centroamérica. En Costa Rica hay ocho pueblos indígenas." },
  { p: "¿Cuántos pueblos indígenas hay hoy en Costa Rica?", ops: ["8", "3", "15", "1"],
    ex: "Hoy hay ocho pueblos indígenas: bribri, cabécar, maleku, brunca o boruca, ngäbe, huetar, chorotega y térraba o teribe." },
  { p: "¿En qué año llegó Cristóbal Colón a Costa Rica?", ops: ["1502", "1821", "1948"],
    ex: "Colón llegó en 1502, en su cuarto viaje." },
  { p: "¿A qué costa llegó Cristóbal Colón?", ops: ["Al Caribe, cerca de Limón", "Al Pacífico, cerca de Puntarenas", "A la orilla del lago Arenal"],
    ex: "Colón llegó a la costa del Caribe, cerca de donde hoy está Limón." },
  { p: "¿Qué declaró la UNESCO Patrimonio de la Humanidad en 2014?", ops: ["Las esferas de piedra del Diquís", "El Teatro Nacional", "El volcán Irazú"],
    ex: "En 2014 la UNESCO declaró Patrimonio de la Humanidad los sitios con esferas de piedra del Diquís." },
  { p: "¿Qué ciudad fue la capital durante la época colonial?", ops: ["Cartago", "San José", "Limón"],
    ex: "Cartago, fundada en 1563, fue la capital durante toda la época colonial." },
];

/** Pregunta de respuesta fija: la primera opción es la correcta. */
function fija(q, instr, rnd) {
  const ops = q.ops.map(o => (o === "*pueblo*" ? `Los ${azar(PUEBLOS, rnd).n.toLowerCase()}` : o));
  const opciones = ops.map((o, i) => ({ id: `o${i}`, html: o, voz: o, porque: "" }));
  return { tipo: "opciones", instr, html: q.p, voz: q.p, cols: ops.some(o => o.length > 14) ? 1 : Math.min(ops.length, 2),
    opciones: barajar(opciones, rnd), correcta: "o0", explica: q.ex };
}

/** ¿Quién fue? (o ¿Qué hizo?) */
function quien(rnd) {
  const [x, ...otros] = barajar(PERSONAS, rnd).slice(0, 3);
  if (rnd() < 0.5) {
    return { tipo: "opciones", instr: "¿<b>Quién</b> fue?", cols: 1,
      html: `«${x.d}»`, voz: `¿Quién fue? ${x.d}`,
      opciones: barajar([x, ...otros], rnd).map(p => ({ id: p.id, html: `${p.e} ${p.n}`, voz: p.n, porque: `No: ${p.n}. ${p.d}` })),
      correcta: x.id, explica: `${x.e} <b>${x.n}</b>: ${x.d}` };
  }
  return { tipo: "opciones", instr: "¿Qué <b>hizo</b>?", cols: 1,
    html: `<span class="grande">${x.e}</span>${x.n}`, voz: `¿Qué hizo ${x.n}?`,
    opciones: barajar([x, ...otros], rnd).map(p => ({ id: p.id, html: p.d, voz: p.d, porque: `Eso lo hizo ${p.n}.` })),
    correcta: x.id, explica: `${x.e} <b>${x.n}</b>: ${x.d}` };
}

/** ¿Por qué es importante? */
function importancia(rnd) {
  // Las esferas se preguntan en «pueblos originarios»; el café se parece mucho al tren y al teatro
  const pool = HECHOS.filter(h => !["patrimonio", "esferas", "cafe"].includes(h.id));
  const x = azar(pool, rnd);
  const otros = [];
  for (const h of barajar(pool, rnd)) {
    if (otros.length < 2 && h !== x && (!h.grupo || (h.grupo !== x.grupo && otros.every(o => o.grupo !== h.grupo)))) otros.push(h);
  }
  return { tipo: "opciones", instr: "¿Por qué es <b>importante</b>?", cols: 1,
    html: `<span class="grande">${x.e}</span>${x.t}<small>${x.cuando}</small>`, voz: `${x.t}. ¿Por qué es importante?`,
    opciones: barajar([x, ...otros], rnd).map(h => ({ id: h.id, html: h.imp, voz: h.imp, porque: `Eso es por ${h.t}.` })),
    correcta: x.id, explica: `${x.d} <b>${x.imp}</b>` };
}

/** Pueblos indígenas de hoy: ¿dónde viven? o ¿qué pueblo…? */
function pueblo(rnd) {
  let [x, ...otros] = barajar(PUEBLOS, rnd).slice(0, 4);
  if (rnd() < 0.5) {
    // ¿Dónde vive?: sin otros pueblos de la misma zona, para que solo un lugar sea correcto
    otros = barajar(PUEBLOS.filter(p => p !== x && !p.zonas.some(z => x.zonas.includes(z))), rnd).slice(0, 3);
    return { tipo: "opciones", instr: "¿Dónde <b>vive</b>?", cols: 1,
      html: `🏡 ¿Dónde vive el pueblo ${x.n.toLowerCase()}?`, voz: `¿Dónde vive el pueblo ${x.n}?`,
      opciones: barajar([x, ...otros], rnd).map(p => ({ id: p.id, html: p.donde, voz: p.donde, porque: `Ahí vive el pueblo ${p.n.toLowerCase()}.` })),
      correcta: x.id, explica: `El pueblo <b>${x.n.toLowerCase()}</b> vive ${x.donde}.` };
  }
  return { tipo: "opciones", instr: "¿Qué <b>pueblo</b> es?", cols: 2,
    html: `🔎 ¿Qué pueblo indígena ${x.pista}?`, voz: `¿Qué pueblo indígena ${x.pista}?`,
    opciones: barajar([x, ...otros], rnd).map(p => ({ id: p.id, html: p.n, voz: p.n, porque: `El pueblo ${p.n.toLowerCase()} vive ${p.donde}.` })),
    correcta: x.id, explica: `El pueblo <b>${x.n.toLowerCase()}</b> ${x.pista}. Vive ${x.donde}.` };
}

/** ¿En qué siglo pasó? */
function enQueSiglo(rnd) {
  const x = azar(HECHOS.filter(h => h.año || h.siglo), rnd);
  const s = sigloDe(x);
  const otros = barajar([16, 18, 19, 20, 21].filter(n => n !== s), rnd).slice(0, 3);
  const rango = n => `del ${(n - 1) * 100 + 1} al ${n * 100}`;
  return { tipo: "opciones", instr: "¿En qué <b>siglo</b> fue?", cols: 2,
    html: `<span class="grande">${x.e}</span>${x.t}${x.año ? `<small>${x.año}</small>` : ""}`, voz: `${x.t}${x.año ? `, en ${x.año}` : ""}. ¿En qué siglo fue?`,
    opciones: barajar([s, ...otros], rnd).map(n => ({ id: `s${n}`, html: `Siglo ${romano(n)}`, voz: `Siglo ${romano(n)}`,
      porque: `El siglo ${romano(n)} son los años ${rango(n)}.` })),
    correcta: `s${s}`,
    explica: `${x.año ? `${x.año} está` : "Los años 1800 están"} en el <b>siglo ${romano(s)}</b>: los años ${rango(s)}. Truco: tomá los dos primeros números del año y sumale uno (${x.año ? `${Math.floor((x.año - 1) / 100)} + 1 = ${s}` : "18 + 1 = 19"}).` };
}

/** Gobierno y ciudadanía: poderes, preguntas fijas y ¿derecho o deber? */
function civica(rnd) {
  const r = rnd();
  if (r < 0.3) {
    const [x, ...otros] = barajar(PODERES, rnd);
    return { tipo: "opciones", instr: "¿Qué <b>hace</b>?", cols: 1,
      html: `<span class="grande">${x.e}</span>${x.n}<small>Lo forman ${x.quien}.</small>`, voz: `¿Qué hace el ${x.n}?`,
      opciones: barajar([x, ...otros.slice(0, 2)], rnd).map(p => ({ id: p.id, html: p.hace, voz: p.hace, porque: `Eso lo hace el ${p.n}.` })),
      correcta: x.id, explica: `${x.e} <b>${x.n}</b>: ${x.hace} Lo forman ${x.quien}.` };
  }
  if (r < 0.55) {
    const derecho = rnd() < 0.5, x = azar(derecho ? DERECHOS : DEBERES, rnd);
    return { tipo: "opciones", instr: "¿<b>Derecho</b> o <b>deber</b>?", cols: 2,
      html: `«${x}»`, voz: `${x}. ¿Es un derecho o un deber?`,
      opciones: [{ id: "derecho", html: "🎁 Un derecho", voz: "Un derecho", porque: "" }, { id: "deber", html: "🧹 Un deber", voz: "Un deber", porque: "" }],
      correcta: derecho ? "derecho" : "deber",
      explica: derecho ? `«${x}» es un <b>derecho</b>: algo que todos los niños y niñas merecen, y que los adultos tienen que cuidar.`
        : `«${x}» es un <b>deber</b>: algo que nos toca hacer a nosotros, para convivir bien.` };
  }
  return fija(azar(CIVICA, rnd), "Gobierno y ciudadanía", rnd);
}

/** ¿En qué año…? (se escribe el año). Solo los años que se aprenden en la escuela. */
const AÑOS_CLAVE = ["colon", "cartago", "independencia", "nicoya", "santarosa", "rivas", "educacion", "ferrocarril", "ccss", "ejercito", "constitucion", "voto", "nobel"];
function enQueAño(rnd) {
  const x = hecho(azar(AÑOS_CLAVE, rnd));
  return { tipo: "escribir", instr: "¿En qué <b>año</b> fue?", año: x.año, respuesta: String(x.año),
    html: `<span class="grande">${x.e}</span>${x.t}`, voz: `${x.t}. ¿En qué año fue?`,
    explica: `${titulo(x)}: <b>${x.año}</b>. ${x.d}` };
}

// ---------- 🪜 Escalones ----------
export const ESCALONES = [
  { nombre: "¿Qué pasó primero? (con años)", gen: rnd => primero({ verAño: true, sep: 20 }, rnd) },       //  1. dos hechos y los años a la vista
  { nombre: "Línea del tiempo de 3 (con años)", gen: rnd => ordenar({ n: 3, verAño: true, sep: 5 }, rnd) },//  2. ordenar 3 mirando los años
  { nombre: "Fechas patrias", gen: fechaPatria },                                                           //  3. 15 de setiembre, 11 de abril…
  { nombre: "Los pueblos originarios", gen: rnd => fija(azar(ORIGINARIOS, rnd), "Antes de los españoles", rnd) }, // 4.
  { nombre: "¿Quién fue?", gen: quien },                                                                    //  5. personajes
  { nombre: "¿Qué pasó primero? (sin años)", gen: rnd => primero({ verAño: false, sep: 40 }, rnd) },      //  6. hay que saber cuándo fue
  { nombre: "Línea del tiempo de 3 (sin años)", gen: rnd => ordenar({ n: 3, verAño: false, sep: 25 }, rnd) }, // 7.
  { nombre: "¿Por qué es importante?", gen: importancia },                                                  //  8.
  { nombre: "Los ocho pueblos indígenas", gen: pueblo },                                                    //  9. dónde viven
  { nombre: "¿En qué siglo?", gen: enQueSiglo },                                                            // 10. siglos XVI, XIX, XX… (5° y 6°)
  { nombre: "Gobierno y ciudadanía", gen: civica },                                                         // 11. poderes, TSE, derechos y deberes
  { nombre: "Línea del tiempo de 4 (sin años)", gen: rnd => ordenar({ n: 4, verAño: false, sep: 10 }, rnd) }, // 12. más hechos y más cercanos
  { nombre: "¿En qué año fue?", gen: enQueAño },                                                            // 13. escribir el año
];
/** Escalón para empezar según la edad. */
export const inicioPorEdad = edad => edad === null || edad <= 7 ? 0 : edad === 8 ? 1 : edad === 9 ? 3 : edad === 10 ? 4 : edad === 11 ? 5 : 7;

// Modos a mano (para el papá o la maestra): cada uno mezcla algunos tipos de pregunta
export const MODOS = [
  { id: "linea", nombre: "⏳ Línea del tiempo", gens: [rnd => ordenar({ n: 3, verAño: false, sep: 25 }, rnd), rnd => ordenar({ n: 4, verAño: false, sep: 10 }, rnd), rnd => primero({ verAño: false, sep: 30 }, rnd)] },
  { id: "originarios", nombre: "🌽 Pueblos originarios", gens: [rnd => fija(azar(ORIGINARIOS, rnd), "Antes de los españoles", rnd), pueblo] },
  { id: "personajes", nombre: "👤 Personajes", gens: [quien] },
  { id: "importa", nombre: "💡 ¿Por qué importa?", gens: [importancia, fechaPatria] },
  { id: "siglos", nombre: "📅 Años y siglos", gens: [enQueSiglo, enQueAño] },
  { id: "gobierno", nombre: "🏛️ Gobierno", gens: [civica] },
];
export const preguntaDeModo = (modo, rnd = Math.random) => azar(modo.gens, rnd)(rnd);

// ---------- Revisión (para las pruebas) ----------
/** Revisa una pregunta. Devuelve una lista de problemas (vacía = bien). */
export function revisarPregunta(q) {
  const mal = [];
  if (!q.html || !q.voz || !q.explica || !q.instr) mal.push("falta texto");
  if (q.tipo === "opciones") {
    const ids = q.opciones.map(o => o.id), textos = q.opciones.map(o => o.html);
    if (new Set(ids).size !== ids.length) mal.push("ids repetidos");
    if (new Set(textos).size !== textos.length) mal.push(`opciones repetidas: ${textos.join(" | ")}`);
    if (!ids.includes(q.correcta)) mal.push("la correcta no está");
    if (q.opciones.length < 2) mal.push("muy pocas opciones");
  } else if (q.tipo === "ordenar") {
    const claves = q.orden.map(id => clave(hecho(id)));
    if (claves.some((c, i) => i && c <= claves[i - 1])) mal.push(`orden con empates: ${q.orden.join(",")}`);
    if (new Set(q.items.map(h => h.id)).size !== q.items.length) mal.push("hechos repetidos");
    if (q.items.filter(h => h.año === null).length > 1) mal.push("dos hechos sin año");
    if (q.conAño && q.items.some(h => h.año === null)) mal.push("hecho sin año con años a la vista");
  } else if (q.tipo === "escribir") {
    if (!/^\d{4}$/.test(q.respuesta)) mal.push("respuesta rara");
  } else mal.push("tipo desconocido");
  return mal;
}
