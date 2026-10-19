// 📊 Lógica de «Encuesta en la escuela: gráficos y probabilidad» (sin pantalla, para probarla con node).
// Estadística y probabilidad del MEP: pictogramas, gráficos de barras, tabla de conteo, moda, rango,
// promedio y probabilidad (seguro, posible, imposible; más probable; como fracción).
//
// Una pregunta generada es:
//   { escalon, tipo, titulo, grafico, pregunta, voz, forma: "opciones" | "numero" | "armar",
//     opciones?: [{ id, html, voz }], correcta?: id, respuesta?: número, sufijo?, pista, explica }
//   grafico: { clase: "picto" | "barras" | "armar" | "bolsa" | "datos", … } lo dibuja la página
//   pista: { resaltar?: [índices], guias?: [índices], colores?: [id], datos?: [índices], texto } la primera ayuda

export const COLORES_BARRAS = ["#2F7FD1", "#E8574A", "#2FA85A", "#F29A1F", "#8E5BD9", "#14A3A3"];

// Encuestas del grupo. frase: cómo se dice «¿Cuántos estudiantes ___?» · corto: lo que va en un botón
export const TEMAS = [
  { id: "fruta", pregunta: "¿Cuál es tu fruta favorita?", cual: "¿Qué fruta escogieron", cats: [
    { e: "🥭", n: "mango", art: "el" }, { e: "🍉", n: "sandía", art: "la" }, { e: "🍌", n: "banano", art: "el" },
    { e: "🍍", n: "piña", art: "la" }, { e: "🍓", n: "fresa", art: "la" }, { e: "🍊", n: "naranja", art: "la" }] },
  { id: "deporte", pregunta: "¿Qué deporte te gusta más?", cual: "¿Qué deporte escogieron", cats: [
    { e: "⚽", n: "fútbol", art: "el" }, { e: "🏀", n: "baloncesto", art: "el" }, { e: "🏐", n: "voleibol", art: "el" },
    { e: "🏊", n: "natación", art: "la" }, { e: "🚴", n: "ciclismo", art: "el" }] },
  { id: "transporte", pregunta: "¿Cómo llegás a la escuela?", cual: "¿Cómo llegan", llegar: true, cats: [
    { e: "🚶", n: "a pie" }, { e: "🚌", n: "en bus" }, { e: "🚗", n: "en carro" }, { e: "🚲", n: "en bici" }, { e: "🏍️", n: "en moto" }] },
  { id: "mascota", pregunta: "¿Cuál es tu mascota favorita?", cual: "¿Qué mascota escogieron", cats: [
    { e: "🐶", n: "perro", art: "el" }, { e: "🐱", n: "gato", art: "el" }, { e: "🐟", n: "pez", art: "el" },
    { e: "🐰", n: "conejo", art: "el" }, { e: "🐢", n: "tortuga", art: "la" }, { e: "🐦", n: "pájaro", art: "el" }] },
];
const LUGARES = ["Grecia", "Liberia", "Turrialba", "Pérez Zeledón", "Santa Cruz", "San Carlos", "Limón", "Puntarenas",
  "Atenas", "Sarchí", "Nicoya", "Cartago", "Heredia", "Alajuela", "Upala", "Golfito", "Tilarán", "Orotina"];
const GRUPOS = ["segundo", "tercero", "cuarto", "quinto", "sexto"];

export const CONFITES = [
  { id: "rojo", n: "rojo", p: "rojos", c: "#E53935" },
  { id: "azul", n: "azul", p: "azules", c: "#1E6FD9" },
  { id: "verde", n: "verde", p: "verdes", c: "#2FA85A" },
  { id: "amarillo", n: "amarillo", p: "amarillos", c: "#FFD600" },
  { id: "morado", n: "morado", p: "morados", c: "#8E5BD9" },
  { id: "anaranjado", n: "anaranjado", p: "anaranjados", c: "#F57C00" },
];

// Datos para moda, rango y promedio
const DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const NOMBRES = ["Valeria", "Mateo", "Sofía", "Daniel", "Camila", "Josué", "Fernanda", "Andrés", "Mariana", "Esteban"];
const SERIES = [
  { titulo: "⚽ Goles del equipo de la escuela", fila: "Partido", filas: "partidos", unidad: "goles", min: 0, max: 6 },
  { titulo: "🥭 Mangos que vendió don Carlos en la feria", fila: "dias", filas: "días", unidad: "mangos", min: 10, max: 40 },
  { titulo: "📚 Libros que leyó cada estudiante en el mes", fila: "nombres", filas: "estudiantes", unidad: "libros", min: 1, max: 8 },
  { titulo: "🌡️ Temperatura en Cartago a las 7 de la mañana", fila: "dias", filas: "días", unidad: "°C", min: 14, max: 22 },
  { titulo: "📝 Puntos en la prueba de Matemáticas", fila: "nombres", filas: "estudiantes", unidad: "puntos", min: 60, max: 100, paso: 5 },
  { titulo: "🍞 Panes que hizo la panadería de doña Rosa (en docenas)", fila: "dias", filas: "días", unidad: "docenas", min: 3, max: 12 },
];

// 🪜 Escalones finos, de 2.° a 6.° grado
export const ESCALONES = [
  { id: "picto-cual", nombre: "Pictograma: ¿cuál tiene más?", tipos: ["picto-cual"], cats: 3, escala: [1], max: 6 },          //  1. contar dibujos y comparar
  { id: "picto-cuantos", nombre: "Pictograma: ¿cuántos?", tipos: ["picto-cuantos"], cats: 3, escala: [1], max: 8 },           //  2. leer una fila
  { id: "prob-seguro", nombre: "¿Seguro, posible o imposible?", tipos: ["prob-seguro"] },                                      //  3. probabilidad con palabras
  { id: "barras-cual", nombre: "Barras: ¿cuál tiene más o menos?", tipos: ["barras-cual"], cats: 4, escala: [1], max: 10 },   //  4. comparar barras
  { id: "barras-cuantos", nombre: "Barras: ¿cuántos?", tipos: ["barras-cuantos"], cats: 4, escala: [1], max: 10 },           //  5. leer el eje
  { id: "armar", nombre: "Armá el gráfico", tipos: ["armar"], cats: 3, escala: [1], max: 8 },                                  //  6. de la tabla de conteo al gráfico
  { id: "barras-comparar", nombre: "Barras: ¿cuántos más? y total", tipos: ["barras-dif", "barras-total"], cats: 4, escala: [1], max: 10 }, //  7. restar y sumar
  { id: "picto-2", nombre: "Pictograma: cada dibujo vale 2", tipos: ["picto-cuantos", "picto-total"], cats: 4, escala: [2], max: 16 },      //  8. medio dibujo = 1
  { id: "prob-mas", nombre: "¿Qué es más probable?", tipos: ["prob-mas"] },                                                    //  9. comparar probabilidades
  { id: "barras-escala", nombre: "Barras de 2 en 2 y de 5 en 5", tipos: ["barras-cuantos", "barras-dif"], cats: 4, escala: [2, 5] }, // 10. ejes con escala
  { id: "picto-5", nombre: "Pictograma: cada dibujo vale 5 o 10", tipos: ["picto-cuantos", "picto-total", "picto-dif"], cats: 4, escala: [5, 10] }, // 11.
  { id: "moda-rango", nombre: "Moda y rango", tipos: ["moda", "moda-grafico", "rango"] },                                     // 12. 5.° grado
  { id: "promedio", nombre: "Promedio (media)", tipos: ["promedio"] },                                                         // 13. 5.° y 6.°
  { id: "prob-fraccion", nombre: "Probabilidad como fracción", tipos: ["prob-fraccion"] },                                     // 14. 6.° grado
];

/** Escalón para empezar según la edad (sin exagerar: si sabe más, sube rápido). */
export const inicioPorEdad = edad => edad === null || edad <= 7 ? 0 : edad === 8 ? 1 : edad === 9 ? 3 : edad === 10 ? 5 : edad === 11 ? 7 : 9;

// ---------- Ayudantes ----------
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const entre = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const may = t => t.charAt(0).toUpperCase() + t.slice(1);
const suma = arr => arr.reduce((a, b) => a + b, 0);
const estudiantes = n => `${n} ${n === 1 ? "estudiante" : "estudiantes"}`;

/** Cómo se nombra una categoría: «el mango», «en bus». */
export const nombreCat = c => (c.art ? `${c.art} ${c.n}` : c.n);
/** «escogieron el mango» / «llegan en bus». */
const frase = (tema, c) => (tema.llegar ? `llegan ${c.n}` : `escogieron ${nombreCat(c)}`);
/** «del mango», «de la sandía», «de "en bus"». */
const deLa = c => (c.art === "el" ? `del ${c.n}` : c.art === "la" ? `de la ${c.n}` : `de «${c.n}»`);
/** Lo que va en un botón: «Mango», «En bus». */
const corto = c => may(c.n);

/** Valores para las categorías: todos distintos (así siempre hay uno que tiene más y uno que tiene menos). */
function valoresDistintos(n, posibles, rnd) {
  return barajar(posibles, rnd).slice(0, n);
}
/** Valores posibles según la escala: de 1 en 1, de 2 en 2 (con impares, que caen entre dos líneas), de 5 en 5… */
function posiblesPara(escala, max) {
  if (escala === 1) return Array.from({ length: max }, (_, i) => i + 1);
  if (escala === 2) return Array.from({ length: (max || 16) - 1 }, (_, i) => i + 2); // 2 a 16
  if (escala === 5) return [5, 10, 15, 20, 25, 30, 35, 40];
  return [10, 20, 30, 40, 50, 60, 70, 80];
}
const topeEje = (escala, valores) => {
  const paso = escala;
  const alto = Math.max(...valores);
  return Math.max(escala === 1 ? 8 : escala * 5, Math.ceil(alto / paso) * paso);
};

function encuesta(cats, rnd) {
  const tema = azar(TEMAS, rnd);
  const lugar = azar(LUGARES, rnd), grupo = azar(GRUPOS, rnd);
  return { tema, lugar, grupo, cats: barajar(tema.cats, rnd).slice(0, cats),
    titulo: `📋 Grupo de ${grupo} de ${lugar}: «${tema.pregunta}»` };
}

/** Opciones con las categorías de la encuesta. */
const opcionesCats = (cats, correcta) => ({
  opciones: cats.map((c, i) => ({ id: String(i), html: `<b>${c.e}</b>${corto(c)}`, voz: corto(c) })),
  correcta: String(correcta),
});

// ---------- Generadores por tipo ----------
const GEN = {
  // Pictograma: ¿cuál tiene más (o menos)?
  "picto-cual"(e, rnd) {
    const en = encuesta(e.cats, rnd), escala = azar(e.escala, rnd);
    const valores = valoresDistintos(e.cats, posiblesPara(escala, e.max), rnd);
    const mas = rnd() < 0.65;
    const i = valores.indexOf(mas ? Math.max(...valores) : Math.min(...valores));
    const c = en.cats[i];
    const pregunta = `${en.tema.cual} ${mas ? "más" : "menos"} estudiantes?`;
    return { titulo: en.titulo, grafico: { clase: "picto", cats: en.cats, valores, escala },
      pregunta, voz: `${en.tema.pregunta} Mirá el pictograma. ${pregunta}`, forma: "opciones", ...opcionesCats(en.cats, i),
      pista: { texto: `Contá los dibujos de cada fila. ¿Cuál fila tiene ${mas ? "más" : "menos"} dibujos?` },
      explica: `La fila ${deLa(c)} tiene ${mas ? "más" : "menos"} dibujos: ${valores[i]}. Las demás: ${en.cats.map((x, k) => k === i ? null : `${x.n}, ${valores[k]}`).filter(Boolean).join("; ")}.` };
  },

  // Pictograma: ¿cuántos escogieron…? (cada dibujo vale 1, 2, 5 o 10)
  "picto-cuantos"(e, rnd) {
    const en = encuesta(e.cats, rnd), escala = azar(e.escala, rnd);
    const valores = valoresDistintos(e.cats, posiblesPara(escala, e.max), rnd);
    const i = entre(0, en.cats.length - 1, rnd), c = en.cats[i], v = valores[i];
    const pregunta = `¿Cuántos estudiantes ${frase(en.tema, c)}?`;
    return { titulo: en.titulo, grafico: { clase: "picto", cats: en.cats, valores, escala },
      pregunta, voz: `Mirá el pictograma. Cada dibujo vale ${escala}. ${pregunta}`, forma: "numero", respuesta: v, sufijo: "estudiantes",
      pista: { resaltar: [i], valoresIconos: true, texto: escala === 1 ? `Contá los dibujos de la fila ${deLa(c)}.` : `Cada dibujo vale ${escala}${escala === 2 ? " y medio dibujo vale 1" : ""}. Sumá lo que vale cada dibujo de esa fila.` },
      explica: explicaPicto(c, v, escala) };
  },

  // Pictograma: ¿cuántos contestaron en total?
  "picto-total"(e, rnd) {
    const en = encuesta(e.cats, rnd), escala = azar(e.escala, rnd);
    const valores = valoresDistintos(e.cats, posiblesPara(escala, e.max), rnd);
    const total = suma(valores);
    const pregunta = "¿Cuántos estudiantes contestaron la encuesta en total?";
    return { titulo: en.titulo, grafico: { clase: "picto", cats: en.cats, valores, escala },
      pregunta, voz: `Mirá el pictograma. Cada dibujo vale ${escala}. ${pregunta}`, forma: "numero", respuesta: total, sufijo: "estudiantes",
      pista: { resaltar: en.cats.map((_, k) => k), valoresIconos: true, texto: `Primero averiguá cuántos hay en cada fila (cada dibujo vale ${escala}) y después sumá todas las filas.` },
      explica: `Cada dibujo vale ${escala}. ${en.cats.map((c, k) => `${may(c.n)}: ${valores[k]}`).join(", ")}. Sumamos: ${valores.join(" + ")} = ${total} estudiantes.` };
  },

  // Pictograma: ¿cuántos más?
  "picto-dif"(e, rnd) {
    const en = encuesta(e.cats, rnd), escala = azar(e.escala, rnd);
    const valores = valoresDistintos(e.cats, posiblesPara(escala, e.max), rnd);
    const [a, b] = barajar(en.cats.map((_, k) => k), rnd).slice(0, 2).sort((x, y) => valores[y] - valores[x]);
    const d = valores[a] - valores[b];
    const pregunta = `¿Cuántos estudiantes más ${frase(en.tema, en.cats[a])} que ${en.tema.llegar ? en.cats[b].n : nombreCat(en.cats[b])}?`;
    return { titulo: en.titulo, grafico: { clase: "picto", cats: en.cats, valores, escala },
      pregunta, voz: `Mirá el pictograma. Cada dibujo vale ${escala}. ${pregunta}`, forma: "numero", respuesta: d, sufijo: "más",
      pista: { resaltar: [a, b], valoresIconos: true, texto: `Averiguá cuántos hay en cada una de las dos filas y restá: el más grande menos el más pequeño.` },
      explica: `${may(en.cats[a].n)}: ${valores[a]} y ${en.cats[b].n}: ${valores[b]}. Restamos: ${valores[a]} − ${valores[b]} = ${d}.` };
  },

  // Barras: ¿cuál tiene más (o menos)?
  "barras-cual"(e, rnd) {
    const en = encuesta(e.cats, rnd), escala = azar(e.escala, rnd);
    const valores = valoresDistintos(e.cats, posiblesPara(escala, e.max), rnd);
    const mas = rnd() < 0.6;
    const i = valores.indexOf(mas ? Math.max(...valores) : Math.min(...valores));
    const pregunta = `${en.tema.cual} ${mas ? "más" : "menos"} estudiantes?`;
    return { titulo: en.titulo, grafico: { clase: "barras", cats: en.cats, valores, escala, max: topeEje(escala, valores) },
      pregunta, voz: `Mirá el gráfico de barras. ${pregunta}`, forma: "opciones", ...opcionesCats(en.cats, i),
      pista: { texto: `La barra más ${mas ? "alta" : "bajita"} es la que tiene ${mas ? "más" : "menos"} estudiantes.` },
      explica: `La barra ${mas ? "más alta" : "más baja"} es la ${deLa(en.cats[i])}: ${estudiantes(valores[i])}.` };
  },

  // Barras: ¿cuántos escogieron…?
  "barras-cuantos"(e, rnd) {
    const en = encuesta(e.cats, rnd), escala = azar(e.escala, rnd);
    const valores = valoresDistintos(e.cats, posiblesPara(escala, e.max), rnd);
    const i = entre(0, en.cats.length - 1, rnd), c = en.cats[i], v = valores[i];
    const max = topeEje(escala, valores);
    const pregunta = `¿Cuántos estudiantes ${frase(en.tema, c)}?`;
    const medio = v % escala !== 0;
    return { titulo: en.titulo, grafico: { clase: "barras", cats: en.cats, valores, escala, max },
      pregunta, voz: `Mirá el gráfico de barras. ${escala > 1 ? `Las rayitas van de ${escala} en ${escala}. ` : ""}${pregunta}`, forma: "numero", respuesta: v, sufijo: "estudiantes",
      pista: { resaltar: [i], guias: [i], texto: `Seguí la rayita desde arriba de la barra hasta los números de la izquierda.${escala > 1 ? ` Ojo: los números van de ${escala} en ${escala}.` : ""}` },
      explica: medio
        ? `La barra queda justo entre el ${v - 1} y el ${v + 1}: es ${v}.`
        : `La barra ${deLa(c)} llega hasta el ${v}: ${estudiantes(v)}.` };
  },

  // Barras: ¿cuántos más que…?
  "barras-dif"(e, rnd) {
    const en = encuesta(e.cats, rnd), escala = azar(e.escala, rnd);
    const valores = valoresDistintos(e.cats, posiblesPara(escala, e.max), rnd);
    const [a, b] = barajar(en.cats.map((_, k) => k), rnd).slice(0, 2).sort((x, y) => valores[y] - valores[x]);
    const d = valores[a] - valores[b];
    const pregunta = `¿Cuántos estudiantes más ${frase(en.tema, en.cats[a])} que ${en.tema.llegar ? en.cats[b].n : nombreCat(en.cats[b])}?`;
    return { titulo: en.titulo, grafico: { clase: "barras", cats: en.cats, valores, escala, max: topeEje(escala, valores) },
      pregunta, voz: `Mirá el gráfico de barras. ${pregunta}`, forma: "numero", respuesta: d, sufijo: "más",
      pista: { resaltar: [a, b], guias: [a, b], texto: "Leé cuánto vale cada una de las dos barras y restá: la más alta menos la más baja." },
      explica: `${may(en.cats[a].n)}: ${valores[a]}. ${may(en.cats[b].n)}: ${valores[b]}. Restamos: ${valores[a]} − ${valores[b]} = ${d}.` };
  },

  // Barras: ¿cuántos en total?
  "barras-total"(e, rnd) {
    const en = encuesta(e.cats, rnd), escala = azar(e.escala, rnd);
    const valores = valoresDistintos(e.cats, posiblesPara(escala, e.max), rnd);
    const total = suma(valores);
    const pregunta = "¿Cuántos estudiantes contestaron la encuesta en total?";
    return { titulo: en.titulo, grafico: { clase: "barras", cats: en.cats, valores, escala, max: topeEje(escala, valores) },
      pregunta, voz: `Mirá el gráfico de barras. ${pregunta}`, forma: "numero", respuesta: total, sufijo: "estudiantes",
      pista: { guias: en.cats.map((_, k) => k), texto: "Leé cuánto vale cada barra y sumalas todas." },
      explica: `${en.cats.map((c, k) => `${may(c.n)}: ${valores[k]}`).join(", ")}. Sumamos: ${valores.join(" + ")} = ${total} estudiantes.` };
  },

  // Armar el gráfico de barras con la tabla de conteo (palitos)
  armar(e, rnd) {
    const en = encuesta(e.cats, rnd);
    const valores = valoresDistintos(e.cats, posiblesPara(1, e.max), rnd);
    return { titulo: en.titulo, grafico: { clase: "armar", cats: en.cats, valores, escala: 1, max: e.max },
      pregunta: "Armá el gráfico de barras con la tabla de conteo.",
      voz: "Armá el gráfico de barras. Contá los palitos de cada fila de la tabla y tocá en la columna hasta dónde llega cada barra. Cada grupito con la raya cruzada vale cinco.",
      forma: "armar", respuesta: valores,
      pista: { texto: "Cada palito es un estudiante y cada grupito con la raya cruzada vale 5. La barra llega hasta ese número." },
      explica: `La tabla dice: ${en.cats.map((c, k) => `${c.e} ${c.n}: ${valores[k]}`).join(", ")}. Cada barra llega hasta su número.` };
  },

  // ¿Seguro, posible o imposible?
  "prob-seguro"(e, rnd) {
    const caso = azar(["seguro", "posible", "imposible"], rnd);
    let bolsa, color;
    if (caso === "seguro") {
      color = azar(CONFITES, rnd);
      bolsa = { [color.id]: entre(3, 8, rnd) };
    } else {
      const cols = barajar(CONFITES, rnd).slice(0, entre(2, 3, rnd));
      bolsa = Object.fromEntries(cols.map(c => [c.id, entre(1, 4, rnd)]));
      color = caso === "posible" ? azar(cols, rnd) : azar(CONFITES.filter(c => !cols.includes(c)), rnd);
    }
    const total = suma(Object.values(bolsa)), hay = bolsa[color.id] || 0;
    const pregunta = `Si sacás un confite sin ver, ¿sacar uno ${color.n} es seguro, posible o imposible?`;
    const explica = caso === "seguro" ? `Todos los confites son ${color.p}: siempre va a salir uno ${color.n}. Es <b>seguro</b>.`
      : caso === "imposible" ? `No hay ningún confite ${color.n} en la bolsa: no puede salir. Es <b>imposible</b>.`
      : `Hay ${hay} ${hay === 1 ? color.n : color.p} y ${total - hay} de otros colores: puede salir ${color.n}, pero no siempre. Es <b>posible</b>.`;
    return { titulo: "🍬 La bolsa de confites", grafico: { clase: "bolsa", bolsa }, pregunta, voz: `Mirá la bolsa. ${pregunta}`,
      forma: "opciones", opciones: [
        { id: "seguro", html: "<b>✅</b>Seguro", voz: "Seguro" },
        { id: "posible", html: "<b>🤔</b>Posible", voz: "Posible" },
        { id: "imposible", html: "<b>🚫</b>Imposible", voz: "Imposible" }],
      correcta: caso, color: color.id,
      pista: { colores: [color.id], texto: `Fijate cuántos confites ${color.p} hay. Si todos son ${color.p}, es seguro; si no hay ninguno, es imposible; si hay algunos, es posible.` },
      explica };
  },

  // ¿Qué color es más (o menos) probable?
  "prob-mas"(e, rnd) {
    const cols = barajar(CONFITES, rnd).slice(0, 3);
    let cuentas;
    do cuentas = barajar([1, 2, 3, 4, 5, 6, 7], rnd).slice(0, 3); while (suma(cuentas) > 12);
    const bolsa = Object.fromEntries(cols.map((c, k) => [c.id, cuentas[k]]));
    const mas = rnd() < 0.6;
    const k = cuentas.indexOf(mas ? Math.max(...cuentas) : Math.min(...cuentas)), c = cols[k];
    const pregunta = `Si sacás un confite sin ver, ¿de qué color es ${mas ? "más" : "menos"} probable que salga?`;
    return { titulo: "🍬 La bolsa de confites", grafico: { clase: "bolsa", bolsa }, pregunta, voz: `Mirá la bolsa. ${pregunta}`,
      forma: "opciones", opciones: cols.map(x => ({ id: x.id, html: `<span class="confite grande" style="--c:${x.c}"></span>${may(x.n)}`, voz: x.n })), correcta: c.id,
      pista: { texto: `Contá cuántos confites hay de cada color. El que tiene ${mas ? "más" : "menos"} es el ${mas ? "más" : "menos"} probable.` },
      explica: `Hay ${cols.map((x, j) => `${cuentas[j]} ${cuentas[j] === 1 ? x.n : x.p}`).join(", ")}. El ${c.n} es el que tiene ${mas ? "más" : "menos"}: es el ${mas ? "más" : "menos"} probable.` };
  },

  // Probabilidad como fracción (6.°)
  "prob-fraccion"(e, rnd) {
    for (;;) {
      const cols = barajar(CONFITES, rnd).slice(0, entre(2, 3, rnd));
      const cuentas = cols.map(() => entre(1, 6, rnd));
      const total = suma(cuentas);
      if (total < 4 || total > 12) continue;
      const k = entre(0, cols.length - 1, rnd), a = cuentas[k], c = cols[k];
      if (a === total) continue;
      const correcta = [a, total];
      const candidatos = [[total - a, total], [a, total - a], [1, total], [a, total + a]];
      cuentas.forEach((x, j) => { if (j !== k) candidatos.push([x, total]); });
      const igual = (p, q) => p[0] * q[1] === q[0] * p[1];
      const distractores = [];
      for (const d of barajar(candidatos, rnd)) {
        if (d[1] <= 0 || d[0] > d[1] || igual(d, correcta) || distractores.some(x => igual(x, d))) continue;
        distractores.push(d);
        if (distractores.length === 3) break;
      }
      if (distractores.length < 3) continue;
      const frac = ([n, d]) => `<span class="frac"><span>${n}</span><span>${d}</span></span>`;
      const opciones = barajar([correcta, ...distractores], rnd).map(([n, d]) => ({ id: `${n}/${d}`, html: frac([n, d]), voz: `${n} de ${d}` }));
      const pregunta = `¿Cuál es la probabilidad de sacar un confite ${c.n}?`;
      return { titulo: "🍬 La bolsa de confites", grafico: { clase: "bolsa", bolsa: Object.fromEntries(cols.map((x, j) => [x.id, cuentas[j]])) },
        pregunta, voz: `Mirá la bolsa. ${pregunta}`, forma: "opciones", opciones, correcta: `${a}/${total}`, cols: 4,
        pista: { colores: [c.id], texto: `Arriba va cuántos confites ${c.p} hay, y abajo cuántos confites hay en total.` },
        explica: `Hay ${a} ${a === 1 ? c.n : c.p} de ${total} confites en total: la probabilidad es ${a}/${total} (${a} de ${total})${simplifica(a, total)}.` };
    }
  },

  // Moda de una lista de datos
  moda(e, rnd) {
    for (;;) {
      const s = serie(rnd, entre(5, 7, rnd));
      const veces = cuenta(s.valores);
      const top = Math.max(...veces.values());
      const modas = [...veces].filter(([, n]) => n === top).map(([v]) => v);
      if (top < 2 || modas.length !== 1) continue;
      const m = modas[0];
      const otros = barajar([...veces.keys()].filter(v => v !== m), rnd).slice(0, 3);
      if (otros.length < 2) continue;
      const pregunta = "¿Cuál es la moda de estos datos?";
      return { titulo: s.titulo, grafico: { clase: "datos", ...s }, pregunta, voz: `${s.tituloVoz}. ${pregunta}`,
        forma: "opciones", opciones: barajar([m, ...otros], rnd).map(v => ({ id: String(v), html: `<b>${v}</b>${s.unidad}`, voz: `${v} ${s.unidad}` })), correcta: String(m),
        pista: { texto: "La moda es el dato que más se repite. Contá cuántas veces aparece cada número." },
        explica: `El ${m} aparece ${top} veces y ningún otro se repite tanto: la moda es ${m} ${s.unidad}.` };
    }
  },

  // Moda en un gráfico: la categoría con la barra más alta
  "moda-grafico"(e, rnd) {
    const en = encuesta(4, rnd);
    const valores = valoresDistintos(4, posiblesPara(1, 10), rnd);
    const i = valores.indexOf(Math.max(...valores));
    const pregunta = "¿Cuál es la moda de esta encuesta?";
    return { titulo: en.titulo, grafico: { clase: "barras", cats: en.cats, valores, escala: 1, max: topeEje(1, valores) },
      pregunta, voz: `Mirá el gráfico. ${pregunta}`, forma: "opciones", ...opcionesCats(en.cats, i),
      pista: { texto: "La moda es la respuesta que más se repite: la que escogieron más estudiantes." },
      explica: `La moda es la respuesta que más se repite: ${en.tema.llegar ? `llegar ${en.cats[i].n}` : nombreCat(en.cats[i])}, con ${estudiantes(valores[i])}.` };
  },

  // Rango: el mayor menos el menor
  rango(e, rnd) {
    const s = serie(rnd, entre(5, 6, rnd));
    const mayor = Math.max(...s.valores), menor = Math.min(...s.valores);
    if (mayor === menor) return GEN.rango(e, rnd);
    const pregunta = "¿Cuál es el rango de estos datos?";
    return { titulo: s.titulo, grafico: { clase: "datos", ...s }, pregunta, voz: `${s.tituloVoz}. ${pregunta}`,
      forma: "numero", respuesta: mayor - menor, sufijo: s.unidad,
      pista: { datos: [s.valores.indexOf(mayor), s.valores.indexOf(menor)], texto: "El rango es el dato mayor menos el dato menor. Buscá el más grande y el más pequeño." },
      explica: `El dato mayor es ${mayor} y el menor es ${menor}. El rango es ${mayor} − ${menor} = ${mayor - menor}.` };
  },

  // Promedio (media aritmética), siempre exacto
  promedio(e, rnd) {
    for (;;) {
      const n = entre(3, 6, rnd);
      const s = serie(rnd, n);
      const total = suma(s.valores);
      if (total % n !== 0) continue;
      const m = total / n;
      const pregunta = "¿Cuál es el promedio (la media) de estos datos?";
      return { titulo: s.titulo, grafico: { clase: "datos", ...s }, pregunta, voz: `${s.tituloVoz}. ${pregunta}`,
        forma: "numero", respuesta: m, sufijo: s.unidad,
        pista: { texto: `Primero sumá todos los datos. Después dividí entre cuántos datos hay (${n}).` },
        explica: `Sumamos: ${s.valores.join(" + ")} = ${total}. Hay ${n} datos: ${total} ÷ ${n} = ${m}. El promedio es ${m} ${s.unidad}.` };
    }
  },
};

const mcd = (a, b) => (b ? mcd(b, a % b) : a);
/** «, que es lo mismo que 1/3» cuando la fracción se puede simplificar. */
const simplifica = (a, b) => { const m = mcd(a, b); return m > 1 ? `, que es lo mismo que ${a / m}/${b / m}` : ""; };

function explicaPicto(c, v, escala) {
  if (escala === 1) return `En la fila ${deLa(c)} hay ${v} ${v === 1 ? "dibujo" : "dibujos"}: ${estudiantes(v)}.`;
  const enteros = Math.floor(v / escala), medio = v % escala !== 0;
  const dibujos = `${enteros} ${enteros === 1 ? "dibujo" : "dibujos"}${medio ? " y medio" : ""}`;
  const vale = `Cada dibujo vale ${escala}${medio ? ` y medio dibujo vale ${escala / 2}` : ""}.`;
  if (enteros === 1 && !medio) return `${vale} En la fila ${deLa(c)} hay 1 dibujo: ${estudiantes(v)}.`;
  const partes = [...Array(enteros).fill(escala), ...(medio ? [escala / 2] : [])];
  return `${vale} En la fila ${deLa(c)} hay ${dibujos}: ${partes.join(" + ")} = ${v}${medio ? "" : ` (${enteros} × ${escala} = ${v})`}.`;
}

/** Cuántas veces aparece cada valor. */
function cuenta(valores) {
  const m = new Map();
  valores.forEach(v => m.set(v, (m.get(v) || 0) + 1));
  return m;
}

/** Una lista de datos (goles, mangos, temperatura…) con n filas. */
function serie(rnd, n) {
  const s = azar(SERIES, rnd);
  const paso = s.paso || 1;
  const valores = Array.from({ length: n }, () => s.min + paso * entre(0, Math.floor((s.max - s.min) / paso), rnd));
  const filas = s.fila === "dias" ? DIAS.slice(0, n).map(may)
    : s.fila === "nombres" ? barajar(NOMBRES, rnd).slice(0, n)
    : Array.from({ length: n }, (_, k) => `${s.fila} ${k + 1}`);
  return { titulo: s.titulo, tituloVoz: s.titulo.replace(/^\S+\s/, ""), unidad: s.unidad, nombreFilas: s.filas, filas, valores };
}

/** Una pregunta nueva del escalón i. */
export function generar(i, rnd = Math.random) {
  const e = ESCALONES[i];
  const tipo = azar(e.tipos, rnd);
  return { escalon: e.id, tipo, ...GEN[tipo](e, rnd) };
}

/** Revisa una pregunta generada. Devuelve una lista de problemas (vacía = bien). */
export function revisarPregunta(q) {
  const mal = [];
  const g = q.grafico;
  if (!q.pregunta || !q.voz || !q.explica) mal.push("faltan textos");
  if (q.forma === "opciones") {
    const ids = q.opciones.map(o => o.id);
    if (new Set(ids).size !== ids.length) mal.push("opciones repetidas");
    if (!ids.includes(String(q.correcta))) mal.push("la correcta no está en las opciones");
    if (ids.length < 2) mal.push("muy pocas opciones");
  }
  if (q.forma === "numero" && (!Number.isInteger(q.respuesta) || q.respuesta < 0)) mal.push(`respuesta rara: ${q.respuesta}`);
  // Cada dato tiene que tener su fila: si no, se vería un dato menos del que se usa para calificar
  if (g.filas && g.valores && g.filas.length !== g.valores.length) mal.push(`${g.filas.length} filas para ${g.valores.length} datos`);
  if (g.clase === "picto" || g.clase === "barras" || g.clase === "armar") {
    if (new Set(g.valores).size !== g.valores.length) mal.push("valores repetidos en el gráfico");
    if (g.valores.some(v => v <= 0)) mal.push("valor en cero");
    if (g.clase === "picto") {
      const iconos = g.valores.map(v => v / g.escala);
      if (iconos.some(n => n > 8.5)) mal.push("demasiados dibujos en una fila");
      if (g.escala !== 2 && g.valores.some(v => v % g.escala)) mal.push("dibujo partido con escala que no es 2");
    }
    if (g.clase === "barras" || g.clase === "armar") {
      if (Math.max(...g.valores) > g.max) mal.push("una barra se sale del eje");
      if (g.max % g.escala) mal.push("eje mal");
      if (g.max / g.escala > 12) mal.push("eje con demasiadas rayas");
    }
    // ¿Cuál tiene más/menos? → una sola respuesta
    if (q.tipo === "picto-cual" || q.tipo === "barras-cual" || q.tipo === "moda-grafico") {
      const v = g.valores[Number(q.correcta)];
      if (g.valores.filter(x => x === v).length !== 1) mal.push("empate en la respuesta");
      if (v !== Math.max(...g.valores) && v !== Math.min(...g.valores)) mal.push("la correcta no es ni la mayor ni la menor");
    }
    if (q.tipo === "picto-cuantos" || q.tipo === "barras-cuantos") {
      if (!g.valores.includes(q.respuesta)) mal.push("la respuesta no es un valor del gráfico");
    }
    if (q.tipo.endsWith("-total") && q.respuesta !== suma(g.valores)) mal.push("total mal");
    if (q.tipo.endsWith("-dif") && q.respuesta <= 0) mal.push("diferencia no positiva");
  }
  if (g.clase === "bolsa") {
    const total = suma(Object.values(g.bolsa));
    if (total < 1 || total > 12) mal.push(`bolsa de ${total}`);
    if (q.tipo === "prob-seguro") {
      const hay = g.bolsa[q.color] || 0;
      const debe = hay === total ? "seguro" : hay === 0 ? "imposible" : "posible";
      if (debe !== q.correcta) mal.push(`debía ser ${debe}`);
    }
    if (q.tipo === "prob-mas") {
      const cuentas = Object.values(g.bolsa);
      if (new Set(cuentas).size !== cuentas.length) mal.push("empate de colores");
    }
    if (q.tipo === "prob-fraccion") {
      const [a, t] = q.correcta.split("/").map(Number);
      if (t !== total) mal.push("el total no es el de la bolsa");
      const val = q.opciones.map(o => { const [n, d] = o.id.split("/").map(Number); return n / d; });
      if (new Set(val).size !== val.length) mal.push("dos fracciones valen lo mismo");
      if (!Object.values(g.bolsa).includes(a)) mal.push("el numerador no es un color");
    }
  }
  if (g.clase === "datos") {
    if (q.tipo === "promedio" && suma(g.valores) / g.valores.length !== q.respuesta) mal.push("promedio mal");
    if (q.tipo === "rango" && Math.max(...g.valores) - Math.min(...g.valores) !== q.respuesta) mal.push("rango mal");
    if (q.tipo === "moda") {
      const veces = cuenta(g.valores), top = Math.max(...veces.values());
      const modas = [...veces].filter(([, n]) => n === top).map(([v]) => String(v));
      if (modas.length !== 1 || modas[0] !== q.correcta) mal.push("moda mal");
    }
  }
  return mal;
}
