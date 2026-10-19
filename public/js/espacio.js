// 🪐 Lógica de «El sistema solar y la Tierra» (sin pantalla, para poder probarla sola con node).
// Datos del Sol, los planetas, la Tierra, la Luna, las épocas del año en Costa Rica y los eclipses;
// los dibujos SVG (no a escala) y los generadores de preguntas.
//
// Cuatro tipos de pregunta:
//   tocar:    { tipo, dibujo: { cual, ... }, meta, tocables, html, voz, bien }      tocar en el dibujo
//   opciones: { tipo, dibujo?, opciones: [{ id, html, voz, por? }], correcta, html, voz, bien, cols? }
//   ordenar:  { tipo, pasos: [{ id, html, n }] (en el orden correcto), html, voz, bien }
//   escribir: { tipo, respuesta, sufijo?, html, voz, bien, pista }                  escribir un número

const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
export const cap = t => t.charAt(0).toUpperCase() + t.slice(1);

// ---------- ☀️ Los planetas (en orden desde el Sol) ----------
// tipo: rocoso o gaseoso · dato: una frase correcta para aprender (también explica por qué no era esa opción)
export const PLANETAS = [
  { id: "mercurio", n: "Mercurio", tipo: "rocoso", color: "#A7A7A7", dato: "Mercurio es el planeta más cercano al Sol y el más pequeño de todos." },
  { id: "venus", n: "Venus", tipo: "rocoso", color: "#E8C27A", dato: "Venus es el planeta más caliente: su aire tan espeso atrapa el calor del Sol. Es el segundo planeta desde el Sol." },
  { id: "tierra", n: "la Tierra", tipo: "rocoso", color: "#2F7FD1", dato: "La Tierra es el tercer planeta desde el Sol y el único donde sabemos que hay vida." },
  { id: "marte", n: "Marte", tipo: "rocoso", color: "#D9573B", dato: "Marte es el planeta rojo: su suelo tiene mucho hierro oxidado. Es el cuarto planeta desde el Sol." },
  { id: "jupiter", n: "Júpiter", tipo: "gaseoso", color: "#D9A066", dato: "Júpiter es el planeta más grande. Tiene una tormenta gigante: la Gran Mancha Roja." },
  { id: "saturno", n: "Saturno", tipo: "gaseoso", color: "#E6CC8A", dato: "Saturno tiene los anillos más grandes y fáciles de ver, hechos de pedazos de hielo y roca." },
  { id: "urano", n: "Urano", tipo: "gaseoso", color: "#86D3DE", dato: "Urano es un gigante helado que gira como acostado." },
  { id: "neptuno", n: "Neptuno", tipo: "gaseoso", color: "#4069D8", dato: "Neptuno es el planeta más lejano del Sol, muy frío y con vientos fortísimos." },
];
export const planeta = id => PLANETAS.find(p => p.id === id);
// «Tocá la Tierra», «Tocá Marte»; «Es la Tierra», «Es Marte»
const nombreSin = p => p.n.replace(/^la /, "");
export const ORDINALES = ["primer", "segundo", "tercer", "cuarto", "quinto", "sexto", "séptimo", "octavo"];
export const NUMEROS = ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho"];
const TIPO_TXT = {
  rocoso: "Mercurio, Venus, la Tierra y Marte son planetas rocosos: tienen el suelo de roca y metal, y son los más cercanos al Sol.",
  gaseoso: "Júpiter, Saturno, Urano y Neptuno son planetas gigantes, hechos sobre todo de gases (Urano y Neptuno también tienen mucho hielo). Son los más lejanos del Sol.",
};

// ---------- 🖼️ Dibujos (no están a escala: los tamaños y las distancias de verdad son muchísimo más grandes) ----------
const W = 400, CY = 64;
// Dónde va cada planeta en el dibujo y su radio
const POS = { mercurio: [72, 5], venus: [100, 8], tierra: [130, 8.5], marte: [158, 6.5], jupiter: [207, 17], saturno: [263, 13], urano: [318, 11], neptuno: [366, 11] };
const ESTRELLAS = [[18, 12], [44, 118], [118, 18], [176, 108], [232, 14], [292, 112], [340, 22], [390, 104], [188, 40], [300, 52], [84, 102], [250, 98]];
const toque = (id, n, tocable) => tocable ? ` role="button" tabindex="0" aria-label="${n}"` : "";

function dibujoPlaneta(p, x, r) {
  let s = `<circle cx="${x}" cy="${CY}" r="${r}" fill="${p.color}"/>`;
  if (p.id === "tierra") s += `<ellipse cx="${x - 2.5}" cy="${CY - 2}" rx="3" ry="2.2" fill="#3FA85A"/><ellipse cx="${x + 3}" cy="${CY + 3}" rx="2.2" ry="1.6" fill="#3FA85A"/>`;
  if (p.id === "jupiter") {
    for (const dy of [-7, -2, 5]) { const h = Math.sqrt(r * r - dy * dy); s += `<line x1="${x - h}" y1="${CY + dy}" x2="${x + h}" y2="${CY + dy}" stroke="#B5713A" stroke-width="2"/>`; }
    s += `<ellipse cx="${x + 6}" cy="${CY + 5}" rx="3.4" ry="2.2" fill="#B5462E"/>`;
  }
  if (p.id === "saturno") s = `<ellipse cx="${x}" cy="${CY}" rx="${r * 2}" ry="${r * 0.55}" fill="none" stroke="#CDB27A" stroke-width="3" transform="rotate(-14 ${x} ${CY})"/>` + s
    + `<path d="M ${x - r * 1.95} ${CY + 4} A ${r * 2} ${r * 0.55} 0 0 0 ${x + r * 1.95} ${CY - 4}" fill="none" stroke="#CDB27A" stroke-width="3" transform="rotate(-14 ${x} ${CY})"/>`;
  return s;
}

/**
 * El Sol y los ocho planetas en fila (no a escala).
 * @param {{nombres?: boolean, tocable?: boolean, solTocable?: boolean, marcar?: string}} op
 */
export function sistemaSVG({ nombres = true, tocable = true, solTocable = false, marcar = null } = {}) {
  let s = `<svg viewBox="0 0 ${W} 140" ${tocable ? `role="group"` : `role="img"`} aria-label="El Sol y los planetas, no a escala">`;
  s += `<rect x="0" y="0" width="${W}" height="140" rx="14" fill="#0E1B33"/>`;
  s += ESTRELLAS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#FFFFFF" opacity=".75"/>`).join("");
  // Órbitas: arcos alrededor del Sol
  for (const p of PLANETAS) s += `<circle cx="-30" cy="${CY}" r="${POS[p.id][0] + 30}" fill="none" stroke="#FFFFFF" stroke-opacity=".13" stroke-width="1"/>`;
  s += `<g class="cuerpo${marcar === "sol" ? " marcado" : ""}" data-c="sol"${toque("sol", "el Sol", tocable && solTocable)}>`
    + `<circle cx="-30" cy="${CY}" r="72" fill="#FFC83D"/><circle cx="-30" cy="${CY}" r="72" fill="none" stroke="#FFE38A" stroke-width="4" opacity=".7"/>`
    + (nombres ? `<text x="8" y="${CY + 4}" font-size="12" font-weight="800" fill="#7A4A00">Sol</text>` : "") + `</g>`;
  for (const p of PLANETAS) {
    const [x, r] = POS[p.id];
    s += `<g class="cuerpo${marcar === p.id ? " marcado" : ""}" data-c="${p.id}"${toque(p.id, cap(nombreSin(p)), tocable)}>`
      + `<circle class="hit" cx="${x}" cy="${CY}" r="${Math.max(r + 5, 14)}" fill="transparent"/>${dibujoPlaneta(p, x, r)}`
      // Los nombres de los planetas rocosos van en dos filas alternadas, para que no se encimen
      + (nombres ? `<text x="${x}" y="${CY + (["venus", "marte"].includes(p.id) ? 44 : 30)}" font-size="10.5" font-weight="800" fill="#E9EEF7" text-anchor="middle">${nombreSin(p)}</text>` : "")
      + `</g>`;
  }
  return s + `</svg>`;
}

/** Un planeta chiquito para los botones (ordenar, opciones). */
export function miniPlaneta(id, tam = 30) {
  const p = planeta(id);
  const r = p.tipo === "gaseoso" ? 11 : 8;
  const extra = id === "saturno" ? `<ellipse cx="15" cy="15" rx="14" ry="4" fill="none" stroke="#CDB27A" stroke-width="2.4" transform="rotate(-14 15 15)"/>` : "";
  return `<svg viewBox="0 0 30 30" width="${tam}" height="${tam}" aria-hidden="true" style="vertical-align:middle">${extra}<circle cx="15" cy="15" r="${r}" fill="${p.color}" stroke="#1F3A5F" stroke-width="1.2"/></svg>`;
}

/**
 * La Tierra iluminada por el Sol: la mitad que mira al Sol tiene día; la otra, noche.
 * @param {{solIzq?: boolean, punto?: {dx:number, dy:number}|null, tocable?: boolean}} op  punto: Costa Rica 📍
 */
export function tierraSVG({ solIzq = true, punto = null, tocable = false } = {}) {
  const sx = solIzq ? -40 : 340;
  const dia = solIzq ? `M150 30 A60 60 0 0 0 150 150 Z` : `M150 30 A60 60 0 0 1 150 150 Z`;
  const noche = solIzq ? `M150 30 A60 60 0 0 1 150 150 Z` : `M150 30 A60 60 0 0 0 150 150 Z`;
  const rayos = [-40, -20, 0, 20, 40].map(dy => solIzq
    ? `<line x1="48" y1="${90 + dy}" x2="80" y2="${90 + dy * 0.8}" stroke="#FFC83D" stroke-width="3" stroke-linecap="round"/>`
    : `<line x1="252" y1="${90 + dy}" x2="220" y2="${90 + dy * 0.8}" stroke="#FFC83D" stroke-width="3" stroke-linecap="round"/>`).join("");
  let s = `<svg viewBox="0 0 300 180" ${tocable ? `role="group"` : `role="img"`} aria-label="La Tierra y el Sol: la mitad que mira al Sol tiene día">`;
  s += `<rect x="0" y="0" width="300" height="180" rx="14" fill="#0E1B33"/>`;
  s += `<circle cx="${sx}" cy="90" r="80" fill="#FFC83D"/>${rayos}`;
  s += `<g class="cuerpo" data-c="dia"${toque("dia", "La mitad que mira al Sol", tocable)}><path d="${dia}" fill="#7CC4F2"/></g>`;
  s += `<g class="cuerpo" data-c="noche"${toque("noche", "La mitad que no mira al Sol", tocable)}><path d="${noche}" fill="#1D2C4F"/></g>`;
  s += `<circle cx="150" cy="90" r="60" fill="none" stroke="#9DB3C9" stroke-width="2"/>`;
  if (punto) s += `<circle cx="${150 + punto.dx}" cy="${90 + punto.dy}" r="6" fill="#E53935" stroke="#FFFFFF" stroke-width="2.5"/>`
    + `<text x="${150 + punto.dx}" y="${90 + punto.dy - 11}" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">Costa Rica</text>`;
  s += `<text x="${solIzq ? 20 : 280}" y="172" font-size="12" font-weight="800" fill="#FFE38A" text-anchor="middle">Sol</text>`;
  return s + `</svg>`;
}

// ---------- 🌙 La Luna ----------
// Las cuatro fases principales, en el orden en que van (después de cuarto menguante vuelve la luna nueva).
// Desde Costa Rica (al norte del ecuador), en cuarto creciente se ve iluminada la mitad derecha.
export const FASES = [
  { id: "nueva", n: "luna nueva", como: "casi no se ve: la cara que mira hacia nosotros no recibe luz del Sol" },
  { id: "creciente", n: "cuarto creciente", como: "se ve iluminada la mitad derecha, y cada noche se ve un poquito más" },
  { id: "llena", n: "luna llena", como: "se ve redonda y toda iluminada" },
  { id: "menguante", n: "cuarto menguante", como: "se ve iluminada la mitad izquierda, y cada noche se ve un poquito menos" },
];
export const fase = id => FASES.find(f => f.id === id);
export function lunaSVG(id, tam = 90) {
  const luz = { nueva: "", creciente: `<path d="M50 10 A40 40 0 0 1 50 90 Z" fill="#F6F1D5"/>`, llena: `<circle cx="50" cy="50" r="40" fill="#F6F1D5"/>`,
    menguante: `<path d="M50 10 A40 40 0 0 0 50 90 Z" fill="#F6F1D5"/>` }[id];
  return `<svg viewBox="0 0 100 100" width="${tam}" height="${tam}" role="img" aria-label="${cap(fase(id).n)}" style="vertical-align:middle">`
    + `<rect width="100" height="100" rx="14" fill="#0E1B33"/><circle cx="50" cy="50" r="40" fill="#3A4560"/>${luz}`
    + `<circle cx="50" cy="50" r="40" fill="none" stroke="#8C96A8" stroke-width="2"/></svg>`;
}

// ---------- 🌑 Eclipses ----------
/** solar: Sol – Luna – Tierra (la Luna tapa al Sol) · lunar: Sol – Tierra – Luna (la sombra de la Tierra cae sobre la Luna). */
export function eclipseSVG(tipo, invertido = false) {
  const X = x => (invertido ? 320 - x : x);
  const medio = tipo === "solar" ? { n: "Luna", r: 10, c: "#B9C0CC" } : { n: "Tierra", r: 20, c: "#2F7FD1" };
  const fin = tipo === "solar" ? { n: "Tierra", r: 20, c: "#2F7FD1" } : { n: "Luna", r: 10, c: "#8C3B2A" };
  // La sombra sale del cuerpo del medio hacia el del final
  const sombra = `<polygon points="${X(170)},${60 - medio.r} ${X(270)},${60 - fin.r * 0.55} ${X(270)},${60 + fin.r * 0.55} ${X(170)},${60 + medio.r}" fill="#000000" opacity=".45"/>`;
  return `<svg viewBox="0 0 320 120" role="img" aria-label="Sol, ${medio.n} y ${fin.n} en fila">`
    + `<rect width="320" height="120" rx="14" fill="#0E1B33"/>`
    + `<circle cx="${X(40)}" cy="60" r="34" fill="#FFC83D"/>${sombra}`
    + `<circle cx="${X(170)}" cy="60" r="${medio.r}" fill="${medio.c}"/><circle cx="${X(270)}" cy="60" r="${fin.r}" fill="${fin.c}"/>`
    + [["Sol", 40], [medio.n, 170], [fin.n, 270]].map(([t, x]) => `<text x="${X(x)}" y="112" font-size="12" font-weight="800" fill="#E9EEF7" text-anchor="middle">${t}</text>`).join("")
    + `</svg>`;
}

// ---------- ❓ Preguntas con datos (cada opción mala explica por qué no) ----------
// t: tema · p: pregunta · ok: la correcta · malas: [[texto, por qué no]] · bien: lo que se aprende
const Q = (t, p, ok, malas, bien) => ({ t, p, ok, malas, bien });
export const DATOS = [
  // ☀️ El Sol
  Q("sol", "¿Qué es el Sol?", "Una estrella", [["Un planeta", "Los planetas no tienen luz propia: giran alrededor de una estrella. El Sol es una estrella."], ["Un satélite", "Un satélite gira alrededor de un planeta, como la Luna alrededor de la Tierra."]],
    "El Sol es una estrella: una bola enorme de gases muy calientes que da luz y calor. Es la estrella más cercana a la Tierra."),
  Q("sol", "¿Qué nos da el Sol?", "Luz y calor", [["Agua y aire", "El agua y el aire están aquí en la Tierra. El Sol nos da luz y calor."], ["Lluvia y viento", "La lluvia cae de las nubes; el Sol nos da luz y calor."]],
    "El Sol nos da luz y calor. Sin él, las plantas no podrían crecer y no habría vida en la Tierra."),
  Q("sol", "¿Qué está en el centro del sistema solar?", "El Sol", [["La Tierra", "Hace mucho tiempo se creía eso, pero la Tierra gira alrededor del Sol."], ["La Luna", "La Luna gira alrededor de la Tierra."]],
    "El Sol está en el centro, y los ocho planetas giran a su alrededor."),
  Q("sol", "¿Cuál es la estrella más cercana a la Tierra?", "El Sol", [["La Luna", "La Luna no es una estrella: es el satélite de la Tierra y no tiene luz propia."], ["Marte", "Marte es un planeta, no una estrella."]],
    "El Sol es la estrella más cercana. Las demás estrellas están tan lejos que las vemos como puntitos de luz."),
  Q("sol6", "¿Cuánto tarda la luz del Sol en llegar a la Tierra?", "Unos 8 minutos", [["Menos de un segundo", "La luz es rapidísima, pero el Sol está tan lejos que tarda unos 8 minutos."], ["Un día entero", "Es mucho menos: unos 8 minutos."]],
    "La luz del Sol tarda unos 8 minutos en llegar a la Tierra, ¡y eso que es lo más rápido que hay!"),
  Q("sol6", "Si el Sol fuera hueco, ¿cuántas Tierras cabrían adentro?", "Más de un millón", [["Unas diez", "El Sol es muchísimo más grande: cabrían más de un millón de Tierras."], ["Unas cien", "Muchísimas más: más de un millón."]],
    "El Sol es tan grande que adentro cabrían más de un millón de Tierras."),
  // 🪐 Planetas
  Q("planetas", "¿Qué es Plutón?", "Un planeta enano", [["El noveno planeta", "Hasta 2006 se contaba como planeta, pero desde ese año es un planeta enano."], ["Una estrella", "Plutón no tiene luz propia, así que no es una estrella."]],
    "Desde 2006, Plutón es un planeta enano. Por eso el sistema solar tiene ocho planetas."),
  Q("planetas", "¿Qué hace un planeta?", "Gira alrededor de una estrella", [["Da luz propia", "Los planetas no tienen luz propia: brillan porque reflejan la luz del Sol."], ["Gira alrededor de otro planeta", "Eso hace un satélite, como la Luna."]],
    "Un planeta gira alrededor de una estrella. Los ocho planetas del sistema solar giran alrededor del Sol."),
  // 🌍 La Tierra: día, noche y año
  Q("tierra", "¿Por qué hay día y noche?", "Porque la Tierra gira sobre sí misma", [["Porque el Sol se apaga en la noche", "El Sol nunca se apaga: cuando aquí es de noche, al otro lado de la Tierra es de día."], ["Porque la Luna tapa al Sol", "La Luna tapa al Sol solo en un eclipse, y eso pasa muy pocas veces."]],
    "La Tierra gira sobre sí misma: la mitad que mira al Sol tiene día, y la otra mitad tiene noche."),
  Q("tierra", "¿Cómo se llama el movimiento de la Tierra cuando gira sobre sí misma?", "Rotación", [["Traslación", "La traslación es la vuelta alrededor del Sol, que dura un año."], ["Evaporación", "La evaporación es cuando el agua se vuelve vapor; no es un movimiento de la Tierra."]],
    "La rotación es el giro de la Tierra sobre sí misma. Una vuelta dura un día: unas 24 horas."),
  Q("tierra", "¿Cuánto dura una vuelta de la Tierra sobre sí misma?", "Un día (unas 24 horas)", [["Un año", "En un año la Tierra da una vuelta alrededor del Sol."], ["Una semana", "Es mucho menos: un día, unas 24 horas."]],
    "Una vuelta de la Tierra sobre sí misma dura un día: unas 24 horas. Eso es la rotación."),
  Q("tierra", "¿Cómo se llama el movimiento de la Tierra alrededor del Sol?", "Traslación", [["Rotación", "La rotación es el giro sobre sí misma, que dura un día."], ["Erupción", "Una erupción es cuando un volcán echa lava o ceniza."]],
    "La traslación es la vuelta de la Tierra alrededor del Sol. Dura un año: unos 365 días."),
  Q("tierra", "¿Cuánto dura una vuelta de la Tierra alrededor del Sol?", "Un año (unos 365 días)", [["Un día", "En un día la Tierra gira sobre sí misma."], ["Un mes", "Más o menos en un mes la Luna da una vuelta alrededor de la Tierra."]],
    "La Tierra tarda un año, unos 365 días, en dar una vuelta alrededor del Sol."),
  Q("tierra", "¿Por dónde sale el Sol en la mañana?", "Por el este", [["Por el oeste", "Por el oeste se pone, en la tarde."], ["Por el sur", "En la mañana el Sol sale por el este."]],
    "Como la Tierra gira de oeste a este, vemos que el Sol sale por el este y se pone por el oeste."),
  Q("tierra6", "¿Por qué cada cuatro años febrero tiene 29 días?", "Porque la vuelta al Sol dura unos 365 días y un cuarto", [["Porque la Tierra gira más despacio ese año", "La Tierra gira igual; es que la vuelta al Sol dura un poquito más de 365 días."], ["Porque ese año hay dos lunas llenas", "Eso no tiene que ver con los años bisiestos."]],
    "La vuelta al Sol dura unos 365 días y un cuarto. Cada cuatro años esos cuartos suman un día: el 29 de febrero, en el año bisiesto."),
  // 🌙 La Luna
  Q("luna", "¿Qué es la Luna?", "El satélite natural de la Tierra", [["Una estrella", "La Luna no tiene luz propia, así que no es una estrella."], ["Un planeta", "La Luna gira alrededor de la Tierra; por eso es un satélite."]],
    "La Luna es el satélite natural de la Tierra: gira alrededor de nuestro planeta."),
  Q("luna", "¿Por qué brilla la Luna?", "Porque refleja la luz del Sol", [["Porque tiene luz propia", "La Luna no tiene luz propia: lo que vemos es la luz del Sol que rebota en ella."], ["Porque tiene fuego por dentro", "La Luna es de roca y no tiene fuego. Brilla con la luz del Sol."]],
    "La Luna no tiene luz propia: brilla porque refleja la luz del Sol."),
  Q("luna", "¿Cada cuánto se repiten las fases de la Luna?", "Más o menos cada mes", [["Cada día", "Cada noche la Luna cambia un poquito, pero el ciclo completo dura casi un mes."], ["Cada año", "Es mucho menos: más o menos un mes."]],
    "Las fases se repiten más o menos cada mes: unos 29 días y medio."),
  // 🌦️ Las épocas del año en Costa Rica
  Q("estaciones", "¿Por qué en Costa Rica no hay cuatro estaciones como en otros países?", "Porque está cerca del ecuador", [["Porque está cerca del Sol", "Todos los países están casi a la misma distancia del Sol. Lo que importa es estar cerca del ecuador."], ["Porque tiene volcanes", "Los volcanes no cambian las estaciones."]],
    "Costa Rica está cerca del ecuador: el sol llega casi igual todo el año, la temperatura cambia poco y los días duran casi lo mismo. Por eso tenemos época seca y época lluviosa."),
  Q("estaciones", "¿Qué dos épocas del año tenemos en gran parte de Costa Rica?", "Época seca y época lluviosa", [["Primavera y otoño", "Eso pasa en los países que están lejos del ecuador."], ["Invierno con nieve y verano", "En Costa Rica no cae nieve. Tenemos época seca y época lluviosa."]],
    "En gran parte de Costa Rica hay dos épocas: la seca y la lluviosa. Lo que cambia es la lluvia, no tanto el calor."),
  Q("estaciones", "En Costa Rica, ¿cómo le dice mucha gente a la época seca?", "Verano", [["Invierno", "Al invierno le decimos a la época lluviosa."], ["Otoño", "En Costa Rica no hablamos de otoño: tenemos época seca y época lluviosa."]],
    "Mucha gente le dice «verano» a la época seca y «invierno» a la época lluviosa."),
  Q("estaciones", "¿En qué meses es la época lluviosa en gran parte del país?", "Más o menos de mayo a noviembre", [["Más o menos de diciembre a abril", "Esos meses son la época seca en gran parte del país."], ["Solo en setiembre", "Llueve muchos meses: más o menos de mayo a noviembre."]],
    "En gran parte del país llueve más o menos de mayo a noviembre. En el Caribe llueve buena parte del año."),
  Q("estaciones", "En Costa Rica, ¿cuánto duran el día y la noche a lo largo del año?", "Casi lo mismo todo el año: unas 12 horas", [["En diciembre el día dura 20 horas", "Eso no pasa aquí: como estamos cerca del ecuador, el día dura casi 12 horas todo el año."], ["En junio casi no hay noche", "Eso pasa cerca de los polos, no en Costa Rica."]],
    "Como Costa Rica está cerca del ecuador, el día y la noche duran casi lo mismo todo el año: unas 12 horas cada uno."),
  Q("estaciones6", "¿Por qué hay estaciones en los países lejos del ecuador?", "Porque la Tierra está inclinada mientras gira alrededor del Sol", [["Porque la Tierra se acerca y se aleja mucho del Sol", "La distancia cambia muy poquito; las estaciones pasan por la inclinación de la Tierra."], ["Porque la Luna tapa al Sol en invierno", "La Luna no tiene que ver con las estaciones."]],
    "La Tierra está inclinada. Mientras da la vuelta al Sol, a veces una parte recibe el sol más directo y por más horas (verano) y a veces menos (invierno)."),
  // 🌑 Eclipses
  Q("eclipses", "¿Qué pasa en un eclipse de sol?", "La Luna se pone entre el Sol y la Tierra", [["La Tierra se pone entre el Sol y la Luna", "Eso es un eclipse de luna."], ["El Sol se apaga un ratito", "El Sol no se apaga: la Luna lo tapa."]],
    "En un eclipse de sol, la Luna pasa entre el Sol y la Tierra y lo tapa por un ratito."),
  Q("eclipses", "¿Qué pasa en un eclipse de luna?", "La sombra de la Tierra cae sobre la Luna", [["La Luna tapa al Sol", "Eso es un eclipse de sol."], ["La Luna se aleja de la Tierra", "La Luna no se aleja: queda en la sombra de la Tierra."]],
    "En un eclipse de luna, la Tierra queda entre el Sol y la Luna, y su sombra cae sobre la Luna. A veces la Luna se ve rojiza."),
  Q("eclipses", "¿Se puede ver el Sol directamente durante un eclipse?", "No, nunca sin filtros especiales", [["Sí, porque está tapado", "Aunque esté tapado, la luz que se escapa puede dañar los ojos."], ["Sí, con lentes de sol comunes", "Los lentes de sol comunes no protegen lo suficiente."]],
    "Nunca hay que ver el Sol directamente, ni en un eclipse: puede dañar los ojos. Se usan filtros especiales o se mira su reflejo."),
  Q("eclipses", "¿En qué fase está la Luna cuando hay un eclipse de sol?", "Luna nueva", [["Luna llena", "En luna llena puede haber eclipse de luna, no de sol."], ["Cuarto creciente", "Para tapar al Sol, la Luna tiene que estar entre el Sol y la Tierra: eso pasa en luna nueva."]],
    "En un eclipse de sol la Luna está entre el Sol y la Tierra: es luna nueva."),
  Q("eclipses", "¿En qué fase está la Luna cuando hay un eclipse de luna?", "Luna llena", [["Luna nueva", "En luna nueva puede haber eclipse de sol, no de luna."], ["Cuarto menguante", "Para que la sombra de la Tierra caiga en la Luna, la Luna tiene que estar al otro lado: eso pasa en luna llena."]],
    "En un eclipse de luna la Tierra está entre el Sol y la Luna: es luna llena."),
  // 💚 Cuidar el planeta
  Q("cuidar", "¿Cuál de estas acciones ayuda a cuidar el planeta?", "Reciclar el papel y el plástico", [["Tirar basura en el río", "La basura en el río ensucia el agua y daña a los animales."], ["Quemar la basura en el patio", "El humo ensucia el aire y hace daño."]],
    "Reciclar ayuda: se gastan menos árboles y menos petróleo, y hay menos basura."),
  Q("cuidar", "¿Cuál de estas acciones ayuda a ahorrar agua?", "Cerrar la llave mientras te cepillás los dientes", [["Dejar la manguera abierta", "Así se desperdicia muchísima agua."], ["Bañarse una hora", "Un baño cortito ahorra mucha agua."]],
    "Cerrar la llave mientras te cepillás ahorra muchísima agua."),
  Q("cuidar", "¿Cuál de estas acciones ayuda a ahorrar electricidad?", "Apagar la luz cuando no se usa", [["Dejar la tele encendida sin verla", "Así se gasta electricidad sin necesidad."], ["Abrir la refri muchas veces", "Cada vez que se abre, la refri gasta más para enfriar."]],
    "Apagar la luz y los aparatos que no se usan ahorra electricidad."),
  Q("cuidar", "¿Qué ayuda a que el aire esté limpio?", "Sembrar árboles", [["Cortar los árboles del parque", "Los árboles limpian el aire: cortarlos lo empeora."], ["Quemar llantas", "El humo de las llantas ensucia muchísimo el aire."]],
    "Los árboles toman el dióxido de carbono y sueltan oxígeno: ayudan a que el aire esté limpio."),
];

const opcionDe = (texto, id, por, voz = texto) => ({ id, html: texto, voz, por });
/** Una pregunta con datos de un tema (o de varios). */
export function dato(temas, rnd = Math.random) {
  const d = azar(DATOS.filter(x => [].concat(temas).includes(x.t)), rnd);
  const opciones = barajar([opcionDe(d.ok, "ok"), ...d.malas.map(([t, por], i) => opcionDe(t, `m${i}`, por))], rnd);
  return { tipo: "opciones", opciones, correcta: "ok", cols: 1, html: `<span class="big">${EMOJI_TEMA[d.t] || "🪐"}</span> ${d.p}`, voz: d.p, bien: d.bien };
}
const EMOJI_TEMA = { sol: "☀️", sol6: "☀️", planetas: "🪐", tierra: "🌍", tierra6: "📅", luna: "🌙", estaciones: "🌦️", estaciones6: "🌦️", eclipses: "🌑", cuidar: "💚" };

// ---------- 🪐 Tocar en el dibujo ----------
/** Tocar el Sol o la Tierra (los primeros pasos). */
export function tocarSolTierra(rnd = Math.random) {
  const sol = rnd() < 0.5;
  return { tipo: "tocar", dibujo: { cual: "sistema", nombres: false, solTocable: true }, meta: sol ? "sol" : "tierra",
    tocables: ["sol", ...PLANETAS.map(p => p.id)],
    html: sol ? `<span class="big">☀️</span> Tocá el <b>Sol</b>` : `<span class="big">🌍</span> Tocá la <b>Tierra</b>: es el tercer planeta desde el Sol`,
    voz: sol ? "Tocá el Sol, la estrella del centro del sistema solar." : "Tocá la Tierra. Es el tercer planeta desde el Sol.",
    bien: sol ? "El Sol es una estrella y está en el centro del sistema solar. El dibujo no está a escala: el Sol es muchísimo más grande." : PLANETAS[2].dato };
}
/** Tocar un planeta por su nombre, con o sin los nombres en el dibujo. */
export function tocarNombre(nombres, rnd = Math.random) {
  const p = azar(PLANETAS, rnd);
  return { tipo: "tocar", dibujo: { cual: "sistema", nombres }, meta: p.id, tocables: PLANETAS.map(x => x.id),
    html: `<span class="big">🪐</span> Tocá <b>${cap(nombreSin(p))}</b>${nombres ? "" : `<small>Contá desde el Sol</small>`}`,
    voz: `Tocá ${p.n}.${nombres ? "" : " Contá los planetas desde el Sol."}`, bien: p.dato };
}
/** Tocar un planeta por su lugar desde el Sol, o por una pista (el más grande, el rojo…). */
const PISTAS = [
  ["jupiter", "el planeta más grande"], ["mercurio", "el planeta más cercano al Sol"], ["neptuno", "el planeta más lejano del Sol"],
  ["saturno", "el planeta con los anillos más fáciles de ver"], ["marte", "el planeta rojo"], ["tierra", "el planeta donde vivimos"],
];
export function tocarPista(rnd = Math.random) {
  if (rnd() < 0.5) {
    const i = Math.floor(rnd() * 8), p = PLANETAS[i];
    return { tipo: "tocar", dibujo: { cual: "sistema", nombres: false }, meta: p.id, tocables: PLANETAS.map(x => x.id),
      html: `<span class="big">🔢</span> Tocá el <b>${ORDINALES[i]} planeta</b> desde el Sol`, voz: `Tocá el ${ORDINALES[i]} planeta desde el Sol.`,
      bien: `El ${ORDINALES[i]} planeta desde el Sol es ${p.n}. ${p.dato}` };
  }
  const [id, pista] = azar(PISTAS, rnd), p = planeta(id);
  return { tipo: "tocar", dibujo: { cual: "sistema", nombres: false }, meta: id, tocables: PLANETAS.map(x => x.id),
    html: `<span class="big">🔎</span> Tocá <b>${pista}</b>`, voz: `Tocá ${pista}.`, bien: `Es ${p.n}. ${p.dato}` };
}

// ---------- 🌍 Día y noche ----------
/** ¿Es de día o de noche en Costa Rica? (o tocar la mitad de día o de noche) */
export function diaNoche(rnd = Math.random) {
  const solIzq = rnd() < 0.5;
  if (rnd() < 0.5) {
    const que = rnd() < 0.5 ? "dia" : "noche";
    return { tipo: "tocar", dibujo: { cual: "tierra", solIzq }, meta: que, tocables: ["dia", "noche"],
      html: `<span class="big">${que === "dia" ? "🌞" : "🌙"}</span> Tocá la parte de la Tierra donde es <b>de ${que === "dia" ? "día" : "noche"}</b>`,
      voz: `Tocá la parte de la Tierra donde es de ${que === "dia" ? "día" : "noche"}.`,
      bien: `${que === "dia" ? "Es de día en la mitad que mira al Sol" : "Es de noche en la mitad que no mira al Sol"}. Como la Tierra gira, cada lugar pasa del día a la noche.` };
  }
  // El punto queda bien adentro de una mitad (no en la orilla)
  const deDia = rnd() < 0.5;
  const lado = (deDia === solIzq) ? -1 : 1; // del lado del Sol si es de día
  const punto = { dx: lado * (18 + Math.floor(rnd() * 24)), dy: Math.floor(rnd() * 50) - 25 };
  return { tipo: "opciones", dibujo: { cual: "tierra", solIzq, punto }, correcta: deDia ? "dia" : "noche", cols: 2,
    opciones: [opcionDe("🌞 De día", "dia", "Fijate: el puntito no está en la mitad que mira al Sol.", "De día"), opcionDe("🌙 De noche", "noche", "Fijate: el puntito está en la mitad que mira al Sol.", "De noche")],
    html: `<span class="big">📍</span> Así está la Tierra ahora. ¿En Costa Rica es <b>de día o de noche</b>?`, voz: "Así está la Tierra ahora. ¿En Costa Rica es de día o de noche?",
    bien: deDia ? "Es de día: Costa Rica está en la mitad que mira al Sol." : "Es de noche: Costa Rica está en la mitad que no mira al Sol. Del otro lado de la Tierra es de día." };
}

// ---------- 🪐 Rocosos o gaseosos ----------
export function rocosoGaseoso(rnd = Math.random) {
  const p = azar(PLANETAS, rnd);
  return { tipo: "opciones", correcta: p.tipo, cols: 2,
    opciones: [opcionDe("🪨 Rocoso", "rocoso", TIPO_TXT.rocoso, "Rocoso"), opcionDe("💨 Gaseoso", "gaseoso", TIPO_TXT.gaseoso, "Gaseoso")],
    html: `${miniPlaneta(p.id, 54)} ¿${cap(nombreSin(p))} es un planeta <b>rocoso o gaseoso</b>?`, voz: `¿${cap(nombreSin(p))} es un planeta rocoso o gaseoso?`,
    bien: `${cap(p.n)} es ${p.tipo}. ${TIPO_TXT[p.tipo]}` };
}

// ---------- 🏆 El planeta que… ----------
const SUPER = [
  ["jupiter", "¿Cuál es el planeta más grande?"], ["mercurio", "¿Cuál es el planeta más cercano al Sol?"], ["mercurio", "¿Cuál es el planeta más pequeño?"],
  ["venus", "¿Cuál es el planeta más caliente?"], ["marte", "¿A qué planeta le dicen el planeta rojo?"], ["neptuno", "¿Cuál es el planeta más lejano del Sol?"],
  ["saturno", "¿Qué planeta tiene los anillos más grandes y fáciles de ver?"], ["tierra", "¿En qué planeta sabemos que hay vida?"],
];
const BIEN_SUPER = {
  venus: "Es Venus, aunque Mercurio está más cerca del Sol: el aire espeso de Venus atrapa el calor.",
  saturno: "Es Saturno. Júpiter, Urano y Neptuno también tienen anillos, pero son delgados y oscuros, y casi no se ven.",
  neptuno: "Es Neptuno. Plutón está más lejos, pero desde 2006 es un planeta enano.",
};
export function elPlanetaQue(rnd = Math.random) {
  const [id, p] = azar(SUPER, rnd);
  // Las otras opciones: planetas que no cumplen (el más pequeño y el más cercano son el mismo, así que no hay dos buenas)
  const otros = barajar(PLANETAS.filter(x => x.id !== id), rnd).slice(0, 2);
  const opciones = barajar([planeta(id), ...otros], rnd).map(x => ({ id: x.id, html: `${miniPlaneta(x.id)} ${cap(nombreSin(x))}`, voz: cap(nombreSin(x)), por: x.id === id ? "" : x.dato }));
  return { tipo: "opciones", opciones, correcta: id, cols: 1, html: `<span class="big">🏆</span> ${p}`, voz: p, bien: BIEN_SUPER[id] || planeta(id).dato };
}

// ---------- 🔢 Ordenar ----------
/** Ordenar n planetas del más cercano al más lejano del Sol. soloRocosos: los cuatro primeros. */
export function ordenarPlanetas(n, soloRocosos = false, rnd = Math.random) {
  const base = soloRocosos ? PLANETAS.slice(0, 4) : PLANETAS;
  const elegidos = n >= base.length ? base : barajar(base, rnd).slice(0, n).sort((a, b) => PLANETAS.indexOf(a) - PLANETAS.indexOf(b));
  const lista = elegidos.map(p => cap(nombreSin(p))).join(", ");
  return { tipo: "ordenar", pasos: elegidos.map(p => ({ id: p.id, n: cap(nombreSin(p)), html: `${miniPlaneta(p.id)} ${cap(nombreSin(p))}` })),
    html: `<span class="big">☀️➡️</span> Tocá los planetas <b>en orden</b>, del más cercano al más lejano del Sol`,
    voz: "Tocá los planetas en orden, del más cercano al más lejano del Sol.",
    bien: `El orden es: ${lista}.${n === 8 ? " Un truco: «Mi Viejo Tío Mario Jugaba Siempre Usando Naipes», con la primera letra de cada planeta." : ""}` };
}
/** Ordenar las fases de la Luna, empezando por la luna nueva. */
export function ordenarFases() {
  return { tipo: "ordenar", pasos: FASES.map(f => ({ id: f.id, n: f.n, html: `${lunaSVG(f.id, 40)} ${cap(f.n)}` })),
    html: `<span class="big">🌙</span> Ordená las fases de la Luna, <b>empezando por la luna nueva</b>`,
    voz: "Ordená las fases de la Luna, empezando por la luna nueva.",
    bien: "Luna nueva, cuarto creciente, luna llena, cuarto menguante… y otra vez luna nueva. Se repite más o menos cada mes." };
}

// ---------- 🌙 Fases ----------
export function queFase(rnd = Math.random) {
  if (rnd() < 0.5) {
    const f = azar(FASES, rnd);
    const opciones = barajar(FASES, rnd).map(x => ({ id: x.id, html: cap(x.n), voz: cap(x.n), por: x.id === f.id ? "" : `En ${x.n}, la Luna ${x.como}.` }));
    return { tipo: "opciones", dibujo: { cual: "luna", fase: f.id }, opciones, correcta: f.id, cols: 2,
      html: `<span class="big">🔭</span> ¿Qué fase de la Luna es?`, voz: "¿Qué fase de la Luna es?", bien: `Es ${f.n}: la Luna ${f.como}.` };
  }
  const i = Math.floor(rnd() * 4), f = FASES[i], sig = FASES[(i + 1) % 4];
  const opciones = barajar(FASES.filter(x => x.id !== f.id), rnd).map(x => ({ id: x.id, html: `${lunaSVG(x.id, 34)} ${cap(x.n)}`, voz: cap(x.n),
    por: x.id === sig.id ? "" : `Después de ${f.n} no viene ${x.n}. El orden es: luna nueva, cuarto creciente, luna llena y cuarto menguante.` }));
  return { tipo: "opciones", opciones, correcta: sig.id, cols: 1,
    html: `${lunaSVG(f.id, 54)} Después de <b>${f.n}</b>, ¿qué fase sigue?`, voz: `Después de ${f.n}, ¿qué fase sigue?`,
    bien: `Después de ${f.n} sigue ${sig.n}. El orden es: luna nueva, cuarto creciente, luna llena y cuarto menguante.` };
}

// ---------- 🌑 ¿Qué eclipse es? ----------
export function queEclipse(rnd = Math.random) {
  const tipo = rnd() < 0.5 ? "solar" : "lunar";
  return { tipo: "opciones", dibujo: { cual: "eclipse", tipo, invertido: rnd() < 0.5 }, correcta: tipo, cols: 2,
    opciones: [opcionDe("🌞 Eclipse de sol", "solar", "Fijate en quién está en el medio: si es la Tierra, su sombra cae sobre la Luna. Eso es un eclipse de luna.", "Eclipse de sol"),
      opcionDe("🌕 Eclipse de luna", "lunar", "Fijate en quién está en el medio: si es la Luna, tapa al Sol. Eso es un eclipse de sol.", "Eclipse de luna")],
    html: `<span class="big">🌑</span> ¿Qué eclipse es?`, voz: "Mirá el dibujo. ¿Qué eclipse es?",
    bien: tipo === "solar" ? "Es un eclipse de sol: la Luna está en el medio y tapa al Sol." : "Es un eclipse de luna: la Tierra está en el medio y su sombra cae sobre la Luna." };
}

// ---------- ✏️ Escribir el número ----------
const NUMS = [
  { r: "8", suf: "planetas", p: "¿Cuántos planetas tiene el sistema solar?", bien: "Son ocho: Mercurio, Venus, la Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Plutón es planeta enano desde 2006.", pista: "Contalos desde el Sol: Mercurio, Venus, la Tierra…" },
  { r: "24", suf: "horas", p: "¿Cuántas horas dura un día, una vuelta de la Tierra sobre sí misma?", bien: "Un día dura unas 24 horas: es la rotación de la Tierra.", pista: "Es lo que dura un día completo, con su noche." },
  { r: "365", suf: "días", p: "¿Cuántos días tiene un año que no es bisiesto?", bien: "Un año tiene 365 días; el bisiesto tiene 366. Es lo que dura la vuelta de la Tierra alrededor del Sol.", pista: "Es lo que tarda la Tierra en dar la vuelta al Sol." },
  { r: "366", suf: "días", p: "¿Cuántos días tiene un año bisiesto?", bien: "El año bisiesto tiene 366 días: febrero tiene 29 días ese año.", pista: "Es un día más que un año normal de 365." },
  { r: "1", suf: "luna", p: "¿Cuántas lunas tiene la Tierra?", bien: "La Tierra tiene una sola luna. Marte tiene dos lunas pequeñitas.", pista: "Mirá al cielo en la noche: ¿cuántas ves?" },
];
export function escribirNumero(rnd = Math.random) {
  if (rnd() < 0.5) {
    const i = Math.floor(rnd() * 8), p = PLANETAS[i];
    return { tipo: "escribir", respuesta: String(i + 1), sufijo: "", html: `${miniPlaneta(p.id, 46)} ¿Qué número de planeta es <b>${cap(nombreSin(p))}</b>, contando desde el Sol?`,
      voz: `¿Qué número de planeta es ${p.n}, contando desde el Sol?`, bien: `${cap(p.n)} es el planeta número ${i + 1}: el ${ORDINALES[i]} desde el Sol.`,
      pista: "Contá desde el Sol: Mercurio es el 1, Venus el 2…" };
  }
  const x = azar(NUMS, rnd);
  return { tipo: "escribir", respuesta: x.r, sufijo: x.suf, html: `<span class="big">✏️</span> ${x.p}`, voz: x.p, bien: x.bien, pista: x.pista };
}

// ---------- 🪜 Escalones (de 3° a 6°) ----------
// tipos: generadores que se van turnando al azar dentro del escalón
export const ESCALONES = [
  { nombre: "El Sol y la Tierra", tipos: [tocarSolTierra, r => dato("sol", r)] },                                          //  1. el Sol es una estrella, tocar el Sol y la Tierra
  { nombre: "Los planetas (con nombres)", tipos: [r => tocarNombre(true, r), r => dato("planetas", r)] },                   //  2. tocar cada planeta leyendo el nombre
  { nombre: "El día y la noche", tipos: [diaNoche, r => dato("tierra", r)] },                                               //  3. rotación: día y noche
  { nombre: "Ordená los planetas rocosos", tipos: [r => ordenarPlanetas(4, true, r), r => tocarNombre(true, r)] },           //  4. Mercurio, Venus, Tierra, Marte
  { nombre: "Rocosos y gaseosos", tipos: [rocosoGaseoso, elPlanetaQue] },                                                  //  5. tipos y el planeta que…
  { nombre: "Los planetas sin nombres", tipos: [tocarPista, r => tocarNombre(false, r)] },                                  //  6. por su lugar o por una pista
  { nombre: "Ordená 5 planetas", tipos: [r => ordenarPlanetas(5, false, r), elPlanetaQue] },                                //  7
  { nombre: "La Luna y sus fases", tipos: [queFase, () => ordenarFases(), r => dato("luna", r)] },                          //  8
  { nombre: "El año y la traslación", tipos: [r => dato(["tierra", "tierra6"], r), escribirNumero] },                       //  9
  { nombre: "Época seca y época lluviosa", tipos: [r => dato("estaciones", r)] },                                           // 10. por qué no hay cuatro estaciones
  { nombre: "Los ocho planetas en orden", tipos: [r => ordenarPlanetas(8, false, r), tocarPista, escribirNumero] },        // 11
  { nombre: "Eclipses y el Sol de cerca", tipos: [queEclipse, r => dato(["eclipses", "sol6", "estaciones6"], r)] },          // 12. 6°
  { nombre: "Todo el sistema solar", tipos: [elPlanetaQue, tocarPista, queFase, diaNoche, queEclipse, escribirNumero, r => dato(["sol", "sol6", "planetas", "tierra", "tierra6", "luna", "estaciones", "estaciones6", "eclipses", "cuidar"], r)] }, // 13
];

/** Escalón inicial según la edad (conservador: mejor que suba rápido a que se frustre). */
export const inicio = edad => (edad === null || edad <= 8 ? 0 : edad === 9 ? 1 : edad === 10 ? 3 : edad === 11 ? 5 : 7);

// Temas para escoger a mano (papá o maestra)
export const TEMAS = [
  { id: "planetas", nombre: "🪐 Planetas", tipos: [r => tocarNombre(true, r), tocarPista, rocosoGaseoso, elPlanetaQue, r => ordenarPlanetas(4 + Math.floor(r() * 5), false, r), r => dato(["sol", "planetas"], r)] },
  { id: "tierra", nombre: "🌍 Día, noche y año", tipos: [diaNoche, r => dato(["tierra", "tierra6"], r), escribirNumero] },
  { id: "luna", nombre: "🌙 La Luna", tipos: [queFase, () => ordenarFases(), r => dato("luna", r)] },
  { id: "estaciones", nombre: "🌦️ Épocas del año", tipos: [r => dato(["estaciones", "estaciones6"], r)] },
  { id: "eclipses", nombre: "🌑 Eclipses", tipos: [queEclipse, r => dato("eclipses", r)] },
  { id: "cuidar", nombre: "💚 Cuidar el planeta", tipos: [r => dato("cuidar", r)] },
];

/** Una pregunta de una lista de tipos. */
export const generar = (tipos, rnd = Math.random) => azar(tipos, rnd)(rnd);

/** Texto sin etiquetas (para revisar la voz): se copia letra por letra, saltando lo que va entre < y >. */
export function sinEtiquetas(t) {
  let s = "", dentro = false;
  for (const c of String(t)) {
    if (c === "<") dentro = true;
    else if (c === ">") dentro = false;
    else if (!dentro) s += c;
  }
  return s;
}

/** El SVG de una pregunta (o "" si no lleva dibujo). */
export function dibujoDe(q) {
  const d = q.dibujo;
  if (!d) return "";
  if (d.cual === "sistema") return sistemaSVG({ nombres: d.nombres, tocable: q.tipo === "tocar", solTocable: d.solTocable });
  if (d.cual === "tierra") return tierraSVG({ solIzq: d.solIzq, punto: d.punto || null, tocable: q.tipo === "tocar" });
  if (d.cual === "luna") return lunaSVG(d.fase, 130);
  if (d.cual === "eclipse") return eclipseSVG(d.tipo, d.invertido);
  return "";
}

/** Revisa una pregunta. Devuelve una lista de problemas (vacía = bien). Para las pruebas con node. */
export function revisarPregunta(q) {
  const mal = [];
  if (!q.html || !q.voz || !q.bien) mal.push("falta texto");
  const textos = [q.voz, q.bien, ...(q.opciones || []).map(o => `${o.voz} ${o.por || ""}`), ...(q.pasos || []).map(p => p.n)];
  textos.forEach(t => {
    if (/[<>]/.test(t)) mal.push(`la voz tiene < o >: ${t}`);
    if (/\bde el\b|\ba el\b/i.test(t)) mal.push(`«de el» o «a el»: ${t}`);
    if (/undefined|NaN|null/.test(t)) mal.push(`texto roto: ${t}`);
  });
  if (q.tipo === "tocar") {
    if (!q.tocables.includes(q.meta)) mal.push(`${q.meta} no se puede tocar`);
    const svg = dibujoDe(q);
    q.tocables.forEach(id => { if (!svg.includes(`data-c="${id}"`)) mal.push(`${id} no está en el dibujo`); });
    if (!svg.includes(`data-c="${q.meta}"`) || !new RegExp(`data-c="${q.meta}" role="button"`).test(svg)) mal.push(`${q.meta} no es tocable con el teclado`);
  } else if (q.tipo === "opciones") {
    const ids = q.opciones.map(o => o.id), vs = q.opciones.map(o => o.voz);
    if (new Set(ids).size !== ids.length) mal.push("ids repetidos");
    if (new Set(vs).size !== vs.length) mal.push("opciones repetidas");
    if (!ids.includes(q.correcta)) mal.push("la correcta no está");
    if (ids.length < 2 || ids.length > 4) mal.push(`${ids.length} opciones`);
    q.opciones.forEach(o => { if (o.id !== q.correcta && !o.por) mal.push(`la opción ${o.voz} no explica por qué no`); });
    if (q.dibujo && !dibujoDe(q)) mal.push("dibujo vacío");
  } else if (q.tipo === "ordenar") {
    if (q.pasos.length < 3) mal.push("muy pocos pasos");
    if (new Set(q.pasos.map(p => p.id)).size !== q.pasos.length) mal.push("pasos repetidos");
    // Los planetas tienen que ir en orden desde el Sol
    const idx = q.pasos.map(p => PLANETAS.findIndex(x => x.id === p.id));
    if (idx.every(i => i >= 0) && idx.some((v, k) => k && v < idx[k - 1])) mal.push("los planetas no van en orden");
  } else if (q.tipo === "escribir") {
    if (!/^\d+$/.test(q.respuesta)) mal.push(`respuesta rara: ${q.respuesta}`);
    if (!q.pista) mal.push("falta la pista");
  } else mal.push(`tipo ${q.tipo}`);
  return mal;
}

/** Revisa los datos: los planetas en su orden, ningún dato con tipo cambiado, y las preguntas completas. */
export function revisarDatos() {
  const mal = [];
  const orden = ["mercurio", "venus", "tierra", "marte", "jupiter", "saturno", "urano", "neptuno"];
  if (PLANETAS.map(p => p.id).join() !== orden.join()) mal.push("el orden de los planetas está mal");
  PLANETAS.forEach((p, i) => { if ((i < 4) !== (p.tipo === "rocoso")) mal.push(`${p.id}: tipo raro`); });
  DATOS.forEach(d => {
    if (!EMOJI_TEMA[d.t]) mal.push(`tema sin emoji: ${d.t}`);
    if (d.malas.length !== 2) mal.push(`${d.p}: tiene que tener 2 malas`);
    if (d.malas.some(([t]) => t === d.ok)) mal.push(`${d.p}: una mala es igual a la buena`);
  });
  return mal;
}

/** «Ese es Marte», «Esa es la Tierra», «Ese es el Sol»: para decir qué se tocó. */
export function eseEs(id) {
  if (id === "sol") return "Ese es el Sol";
  if (id === "dia") return "Esa es la mitad que mira al Sol: ahí es de día";
  if (id === "noche") return "Esa es la mitad que no mira al Sol: ahí es de noche";
  const p = planeta(id);
  return p.id === "tierra" ? "Esa es la Tierra" : `Ese es ${p.n}`;
}
