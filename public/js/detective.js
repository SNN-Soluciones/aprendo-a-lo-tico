// 🐆 Lógica de "El jaguar detective" (sin pantalla, para poder probarla sola).
//
// Dos tipos de caso:
//   "sospechosos": hay varios animales y pistas; el niño tacha a los que no pueden ser y acusa al culpable.
//   "libreta":     un cuadro de doble entrada (¿quién hizo qué?); cada animal va con una sola cosa.
// Cada pista es una frase y una función que dice si un animal (o una repartición) la cumple.
// Las pruebas revisan que cada caso tenga UNA sola respuesta y que ninguna pista sobre (salvo la trampa 🐞).

// Características que se usan en las pistas. null = no se usa en pistas (no es tan claro para un niño).
export const ANIMALES = {
  perezoso:   { n: "perezoso", art: "el", e: "🦥", cubierta: "pelo", vuela: false, patas: 4, vive: "arbol", come: "plantas", color: "cafe", noche: null, lento: true },
  mono:       { n: "mono congo", art: "el", e: "🐒", cubierta: "pelo", vuela: false, patas: 4, vive: "arbol", come: "plantas", color: "negro", noche: false, lento: false },
  lapa:       { n: "lapa roja", art: "la", e: "🦜", cubierta: "plumas", vuela: true, patas: 2, vive: "arbol", come: "plantas", color: "rojo", noche: false, lento: false },
  rana:       { n: "rana calzonuda", art: "la", e: "🐸", cubierta: "piel", vuela: false, patas: 4, vive: "arbol", come: "animales", color: "verde", noche: true, lento: false },
  iguana:     { n: "iguana verde", art: "la", e: "🦎", cubierta: "escamas", vuela: false, patas: 4, vive: "arbol", come: "plantas", color: "verde", noche: false, lento: false },
  cocodrilo:  { n: "cocodrilo", art: "el", e: "🐊", cubierta: "escamas", vuela: false, patas: 4, vive: "agua", come: "animales", color: null, noche: null, lento: false },
  tortuga:    { n: "tortuga", art: "la", e: "🐢", cubierta: "caparazon", vuela: false, patas: 4, vive: "agua", come: null, color: null, noche: null, lento: true },
  delfin:     { n: "delfín", art: "el", e: "🐬", cubierta: "piel", vuela: false, patas: 0, vive: "agua", come: "animales", color: "gris", noche: false, lento: false },
  mapache:    { n: "mapache", art: "el", e: "🦝", cubierta: "pelo", vuela: false, patas: 4, vive: "suelo", come: "todo", color: "gris", noche: true, lento: false },
  serpiente:  { n: "terciopelo", art: "la", e: "🐍", cubierta: "escamas", vuela: false, patas: 0, vive: "suelo", come: "animales", color: "cafe", noche: true, lento: false },
  murcielago: { n: "murciélago", art: "el", e: "🦇", cubierta: "pelo", vuela: true, patas: 2, vive: null, come: null, color: "negro", noche: true, lento: false },
  mariposa:   { n: "mariposa morfo", art: "la", e: "🦋", cubierta: null, vuela: true, patas: 6, vive: null, come: "plantas", color: "azul", noche: false, lento: false },
  yiguirro:   { n: "yigüirro", art: "el", e: "🐦", cubierta: "plumas", vuela: true, patas: 2, vive: "arbol", come: "todo", color: "cafe", noche: false, lento: false },
};

export const ETAPAS = [
  { id: "pistas", nombre: "Primeras pistas", emoji: "🔍" },
  { id: "no", nombre: "Pistas con NO", emoji: "🚫" },
  { id: "libreta", nombre: "La libreta del detective", emoji: "📋" },
  { id: "dificiles", nombre: "Casos difíciles", emoji: "🏆" },
];

// Atajos para escribir pistas
const p = (txt, f) => ({ txt, f });

// ---------- Casos ----------
// sospechosos: ids de ANIMALES · culpable: id · pistas · trampa: índice de la pista que no sirve (🐞)
// libreta: filas (animales) × columnas {id, e, n} · solucion {animal: columna} · pistas f(s) con s.de(animal) y s.quien(col)
export const CASOS = [
  // 🔍 Primeras pistas
  { id: "mangos", etapa: "pistas", tipo: "sospechosos", titulo: "Los mangos de la pulpería",
    historia: "¡Desaparecieron los mangos de la pulpería de doña Rosa! El jaguar encontró una pista.",
    sospechosos: ["perezoso", "lapa", "rana"], culpable: "lapa",
    pistas: [p("Tiene plumas.", a => a.cubierta === "plumas")] },
  { id: "ruido", etapa: "pistas", tipo: "sospechosos", titulo: "Un ruido en la noche",
    historia: "Anoche alguien hizo mucho ruido cerca de la escuela. ¿Quién andaba despierto?",
    sospechosos: ["mono", "lapa", "rana"], culpable: "rana",
    pistas: [p("Sale de noche.", a => a.noche === true)] },
  { id: "huellas", etapa: "pistas", tipo: "sospechosos", titulo: "Huellas junto al río",
    historia: "Hay huellas enormes en la orilla del río. El jaguar sacó su lupa.",
    sospechosos: ["perezoso", "cocodrilo", "lapa"], culpable: "cocodrilo",
    pistas: [p("Vive en el agua.", a => a.vive === "agua")] },
  { id: "hoja", etapa: "pistas", tipo: "sospechosos", titulo: "La hoja mordida",
    historia: "Alguien mordió las hojas del jardín de la escuela. ¡Dos pistas esta vez!",
    sospechosos: ["iguana", "rana", "lapa"], culpable: "iguana",
    pistas: [p("Come plantas.", a => a.come === "plantas"), p("Es verde.", a => a.color === "verde")] },
  { id: "campana", etapa: "pistas", tipo: "sospechosos", titulo: "¿Quién tocó la campana?",
    historia: "La campana de la iglesia sonó a medianoche. ¡Alguien voló hasta arriba!",
    sospechosos: ["murcielago", "mapache", "perezoso", "lapa"], culpable: "murcielago",
    pistas: [p("Tiene pelo.", a => a.cubierta === "pelo"), p("Puede volar.", a => a.vuela)] },

  // 🚫 Pistas con NO
  { id: "banano", etapa: "no", tipo: "sospechosos", titulo: "El banano perdido",
    historia: "¡Se perdió el banano del recreo! Ahora las pistas dicen lo que el culpable NO es.",
    sospechosos: ["perezoso", "mono", "lapa", "iguana"], culpable: "mono",
    pistas: [p("No tiene plumas.", a => a.cubierta !== "plumas"), p("No es verde.", a => a.color !== "verde"), p("No es lento.", a => !a.lento)] },
  { id: "grillo", etapa: "no", tipo: "sospechosos", titulo: "¿Quién se comió al grillo?",
    historia: "El grillo que cantaba en el aula desapareció. Alguien se lo comió.",
    sospechosos: ["rana", "serpiente", "mono", "mapache"], culpable: "rana",
    pistas: [p("No tiene pelo.", a => a.cubierta !== "pelo"), p("No tiene escamas.", a => a.cubierta !== "escamas")] },
  { id: "sobra", etapa: "no", tipo: "sospechosos", titulo: "🐞 La pista que sobra", trampa: 0,
    historia: "Alguien se llevó el néctar de las flores. Pero ojo: una de las pistas no sirve para nada.",
    sospechosos: ["lapa", "yiguirro", "murcielago", "mariposa"], culpable: "mariposa",
    pistas: [p("Puede volar.", a => a.vuela), p("No tiene plumas.", a => a.cubierta !== "plumas"), p("Tiene seis patas.", a => a.patas === 6)] },
  { id: "charco", etapa: "no", tipo: "sospechosos", titulo: "El charco revuelto",
    historia: "Alguien se bañó en el charco y dejó todo lleno de barro.",
    sospechosos: ["cocodrilo", "tortuga", "delfin", "rana"], culpable: "rana",
    pistas: [p("No tiene escamas.", a => a.cubierta !== "escamas"), p("No tiene caparazón.", a => a.cubierta !== "caparazon"), p("Tiene cuatro patas.", a => a.patas === 4)] },
  { id: "almendro", etapa: "no", tipo: "sospechosos", titulo: "Las semillas del almendro",
    historia: "Alguien se comió todas las semillas del almendro de montaña. ¡Cinco sospechosos!",
    sospechosos: ["lapa", "yiguirro", "mono", "perezoso", "iguana"], culpable: "lapa",
    pistas: [p("Come plantas.", a => a.come === "plantas"), p("No tiene pelo.", a => a.cubierta !== "pelo"), p("No es verde.", a => a.color !== "verde")] },

  // 📋 La libreta del detective
  { id: "frutas", etapa: "libreta", tipo: "libreta", titulo: "¿Qué fruta comió cada uno?",
    historia: "Tres amigos se comieron tres frutas distintas. Usá la libreta: marcá ✓ o ✗ en cada casilla.",
    filas: ["mono", "lapa", "perezoso"],
    columnas: [{ id: "mango", e: "🥭", n: "mango" }, { id: "banano", e: "🍌", n: "banano" }, { id: "sandia", e: "🍉", n: "sandía" }],
    solucion: { mono: "banano", lapa: "mango", perezoso: "sandia" },
    pistas: [p("El mono comió banano.", s => s.de("mono") === "banano"), p("La lapa no comió sandía.", s => s.de("lapa") !== "sandia")] },
  { id: "dormir", etapa: "libreta", tipo: "libreta", titulo: "¿Dónde durmió cada uno?",
    historia: "Cada uno durmió en un lugar distinto. ¡A llenar la libreta!",
    filas: ["rana", "iguana", "perezoso"],
    columnas: [{ id: "arbol", e: "🌳", n: "árbol" }, { id: "piedra", e: "🪨", n: "piedra" }, { id: "hoja", e: "🍃", n: "hoja" }],
    solucion: { rana: "hoja", iguana: "piedra", perezoso: "arbol" },
    pistas: [p("El que durmió en la piedra tiene escamas.", s => ANIMALES[s.quien("piedra")].cubierta === "escamas"), p("La rana no durmió en el árbol.", s => s.de("rana") !== "arbol")] },
  { id: "festival", etapa: "libreta", tipo: "libreta", titulo: "El festival de música",
    historia: "En el festival de la escuela, cada uno tocó un instrumento distinto.",
    filas: ["lapa", "mono", "rana"],
    columnas: [{ id: "tambor", e: "🥁", n: "tambor" }, { id: "guitarra", e: "🎸", n: "guitarra" }, { id: "trompeta", e: "🎺", n: "trompeta" }],
    solucion: { lapa: "trompeta", mono: "guitarra", rana: "tambor" },
    pistas: [
      p("El que tocó el tambor no tiene plumas.", s => ANIMALES[s.quien("tambor")].cubierta !== "plumas"),
      p("La rana tocó la trompeta o el tambor.", s => ["trompeta", "tambor"].includes(s.de("rana"))),
      p("El mono no tocó la trompeta.", s => s.de("mono") !== "trompeta"),
      p("La lapa no tocó la guitarra.", s => s.de("lapa") !== "guitarra"),
    ] },
  { id: "almuerzo", etapa: "libreta", tipo: "libreta", titulo: "🐞 El almuerzo", trampa: 2,
    historia: "Cada uno almorzó algo distinto. Una pista no hace falta: ¿cuál será?",
    filas: ["cocodrilo", "lapa", "perezoso"],
    columnas: [{ id: "hojas", e: "🍃", n: "hojas" }, { id: "semillas", e: "🌰", n: "semillas" }, { id: "pescado", e: "🐟", n: "pescado" }],
    solucion: { cocodrilo: "pescado", lapa: "semillas", perezoso: "hojas" },
    pistas: [p("El cocodrilo comió pescado.", s => s.de("cocodrilo") === "pescado"), p("La lapa no comió hojas.", s => s.de("lapa") !== "hojas"), p("El perezoso no comió pescado.", s => s.de("perezoso") !== "pescado")] },

  // 🏆 Casos difíciles
  { id: "robo", etapa: "dificiles", tipo: "sospechosos", titulo: "El gran robo de la pulpería",
    historia: "¡Alguien se robó el queso de la pulpería! Estas pistas usan «o» y «si… entonces». Leelas con calma.",
    sospechosos: ["mono", "lapa", "rana", "iguana", "mapache", "murcielago"], culpable: "mapache",
    pistas: [
      p("Tiene pelo o plumas.", a => a.cubierta === "pelo" || a.cubierta === "plumas"),
      p("Si tiene pelo, entonces sale de noche.", a => a.cubierta !== "pelo" || a.noche === true),
      p("No puede volar.", a => !a.vuela),
    ] },
  { id: "rio", etapa: "dificiles", tipo: "sospechosos", titulo: "El misterio del río",
    historia: "Alguien desordenó las piedras del río. Seis sospechosos, pocas pistas.",
    sospechosos: ["cocodrilo", "tortuga", "delfin", "rana", "serpiente", "iguana"], culpable: "rana",
    pistas: [
      p("No tiene ni caparazón ni escamas.", a => a.cubierta !== "caparazon" && a.cubierta !== "escamas"),
      p("Si no tiene patas, entonces vive en el suelo.", a => a.patas > 0 || a.vive === "suelo"),
    ] },
  { id: "tramposa", etapa: "dificiles", tipo: "sospechosos", titulo: "🐞 La pista tramposa", trampa: 2,
    historia: "Alguien voló por la ventana y se comió la fruta. Una de estas pistas es tramposa: no descarta a nadie.",
    sospechosos: ["lapa", "yiguirro", "murcielago", "mariposa", "mono", "perezoso"], culpable: "murcielago",
    pistas: [
      p("Puede volar.", a => a.vuela),
      p("No tiene plumas.", a => a.cubierta !== "plumas"),
      p("Si es rojo, entonces tiene plumas.", a => a.color !== "rojo" || a.cubierta === "plumas"),
      p("No es azul.", a => a.color !== "azul"),
    ] },
  { id: "final", etapa: "dificiles", tipo: "sospechosos", titulo: "El caso final",
    historia: "¡El último caso! Alguien se comió el pescado del festival. Ocho sospechosos y cuatro pistas.",
    sospechosos: ["perezoso", "mono", "lapa", "rana", "iguana", "cocodrilo", "serpiente", "murcielago"], culpable: "cocodrilo",
    pistas: [
      p("No tiene plumas ni piel lisa.", a => a.cubierta !== "plumas" && a.cubierta !== "piel"),
      p("Tiene cuatro patas o puede volar.", a => a.patas === 4 || a.vuela),
      p("Si tiene escamas, entonces vive en el agua.", a => a.cubierta !== "escamas" || a.vive === "agua"),
      p("No come plantas y no puede volar.", a => a.come !== "plantas" && !a.vuela),
    ] },
];

// ---------- Casos con sospechosos ----------
/** ¿Qué pistas descartan a este animal? (índices) */
export const descartadoPor = (caso, id) => caso.pistas.map((q, i) => q.f(ANIMALES[id]) ? -1 : i).filter(i => i >= 0);
/** Animales que cumplen todas las pistas (menos las que se indiquen). */
export const quedan = (caso, sin = []) => caso.sospechosos.filter(id => caso.pistas.every((q, i) => sin.includes(i) || q.f(ANIMALES[id])));

// ---------- Casos de libreta ----------
function permutaciones(arr) {
  if (arr.length <= 1) return [arr];
  return arr.flatMap((x, i) => permutaciones([...arr.slice(0, i), ...arr.slice(i + 1)]).map(r => [x, ...r]));
}
const estado = (filas, cols) => {
  const m = Object.fromEntries(filas.map((f, i) => [f, cols[i]]));
  return { de: a => m[a], quien: c => filas.find(f => m[f] === c), mapa: m };
};
/** Todas las reparticiones que cumplen las pistas (menos las que se indiquen). */
export function soluciones(caso, sin = []) {
  const cols = caso.columnas.map(c => c.id);
  return permutaciones(cols).map(ps => estado(caso.filas, ps)).filter(s => caso.pistas.every((q, i) => sin.includes(i) || q.f(s))).map(s => s.mapa);
}
/** Primera pista que no cumple una repartición del niño (o -1 si todas se cumplen). */
export function pistaQueFalla(caso, mapa) {
  const s = { de: a => mapa[a], quien: c => caso.filas.find(f => mapa[f] === c) };
  return caso.pistas.findIndex(q => !q.f(s));
}

/** Revisa que un caso esté bien armado. Devuelve una lista de problemas (vacía = bien). */
export function revisarCaso(caso) {
  const mal = [];
  if (caso.tipo === "sospechosos") {
    const q = quedan(caso);
    if (q.length !== 1 || q[0] !== caso.culpable) mal.push(`quedan ${q.join(", ")} (esperaba ${caso.culpable})`);
    caso.pistas.forEach((pi, i) => {
      const descarta = caso.sospechosos.some(id => !pi.f(ANIMALES[id]));
      if (i === caso.trampa ? descarta : !descarta) mal.push(`pista ${i + 1} ${i === caso.trampa ? "debería no descartar a nadie" : "no descarta a nadie"}`);
    });
  } else {
    const s = soluciones(caso);
    if (s.length !== 1) mal.push(`${s.length} soluciones`);
    else if (JSON.stringify(s[0]) !== JSON.stringify(caso.solucion)) mal.push("la solución no coincide");
    if (caso.trampa !== undefined && soluciones(caso, [caso.trampa]).length !== 1) mal.push("la pista trampa sí hace falta");
    caso.pistas.forEach((_, i) => {
      if (i !== caso.trampa && soluciones(caso, [i]).length === 1 && caso.trampa !== undefined) mal.push(`pista ${i + 1} también sobra`);
    });
  }
  return mal;
}

// ---------- 🎲 Casos nuevos al azar ----------
// Pistas posibles para un animal: cada una dice si la cumple (f) y si es una pista con NO.
// Solo se usan características que todos los sospechosos tienen definidas (sin null), para que no haya dudas.
const COLOR = { cafe: "café", negro: "negro", rojo: "rojo", verde: "verde", gris: "gris", azul: "azul" };
const CUBIERTAS = { pelo: "pelo", plumas: "plumas", escamas: "escamas", caparazon: "caparazón" };
const PATAS = { 0: "No tiene patas.", 2: "Tiene dos patas.", 4: "Tiene cuatro patas.", 6: "Tiene seis patas." };
const PATAS_NO = { 0: "Tiene patas.", 2: "No tiene dos patas.", 4: "No tiene cuatro patas.", 6: "No tiene seis patas." };
const VIVE = { arbol: "los árboles", agua: "el agua", suelo: "el suelo" };

function pistasPara(culpable, ids) {
  const c = ANIMALES[culpable], out = [];
  const definido = k => ids.every(id => ANIMALES[id][k] !== null && ANIMALES[id][k] !== undefined);
  const add = (txt, f, no = false) => out.push({ txt, f, no });
  if (definido("cubierta")) {
    if (CUBIERTAS[c.cubierta]) add(`Tiene ${CUBIERTAS[c.cubierta]}.`, a => a.cubierta === c.cubierta);
    for (const [v, n] of Object.entries(CUBIERTAS)) if (v !== c.cubierta) add(`No tiene ${n}.`, a => a.cubierta !== v, true);
  }
  if (definido("vuela")) add(c.vuela ? "Puede volar." : "No puede volar.", a => a.vuela === c.vuela, !c.vuela);
  if (definido("patas")) {
    add(PATAS[c.patas], a => a.patas === c.patas, c.patas === 0);
    for (const v of [0, 2, 4, 6]) if (v !== c.patas) add(PATAS_NO[v], a => a.patas !== v, v !== 0);
  }
  if (definido("vive")) {
    add(`Vive en ${VIVE[c.vive]}.`, a => a.vive === c.vive);
    for (const [v, n] of Object.entries(VIVE)) if (v !== c.vive) add(`No vive en ${n}.`, a => a.vive !== v, true);
  }
  // «Come de todo» también come plantas: para no confundir, solo se usa si nadie come de todo
  if (definido("come") && ids.every(id => ANIMALES[id].come !== "todo")) {
    add(c.come === "plantas" ? "Come plantas." : "Come otros animales.", a => a.come === c.come);
    add(c.come === "plantas" ? "No come otros animales." : "No come plantas.", a => a.come === c.come, true);
  }
  if (definido("color")) {
    add(`Es de color ${COLOR[c.color]}.`, a => a.color === c.color);
    for (const [v, n] of Object.entries(COLOR)) if (v !== c.color) add(`No es de color ${n}.`, a => a.color !== v, true);
  }
  if (definido("noche")) add(c.noche ? "Sale de noche." : "Sale de día.", a => a.noche === c.noche);
  if (definido("lento")) add(c.lento ? "Se mueve muy despacio." : "No se mueve despacio.", a => a.lento === c.lento, !c.lento);
  return out;
}

const HISTORIAS = [
  ["¿Quién se comió {cosa}?", "¡Alguien se comió {cosa}! El jaguar sacó su libreta."],
  ["Un ruido en {lugar}", "Anoche alguien hizo mucho ruido en {lugar}. ¿Quién fue?"],
  ["Huellas en {lugar}", "Aparecieron huellas misteriosas en {lugar}. ¡A investigar!"],
  ["¿Quién se llevó {cosa}?", "Alguien se llevó {cosa}. El jaguar tiene varios sospechosos."],
];
const COSAS = ["los mangos de la pulpería", "el queso del recreo", "las galletas de la maestra", "el pan de la abuela", "las fresas del jardín",
  "los bananos de la feria", "la sandía del paseo", "el arroz con leche de la fiesta"];
const LUGARES = ["la biblioteca", "el aula de sexto", "la plaza", "la cocina de la escuela", "el jardín", "la bodega", "el gimnasio"];

export const DIFICULTADES = [
  { id: "facil", nombre: "Fácil", sospechosos: [3, 3], pistas: [1, 2], no: false },
  { id: "medio", nombre: "Medio", sospechosos: [4, 5], pistas: [2, 3], no: true },
  { id: "dificil", nombre: "Difícil", sospechosos: [5, 6], pistas: [3, 4], no: true },
];

const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const entre = ([a, b], rnd) => a + Math.floor(rnd() * (b - a + 1));
// El título y la historia usan la misma cosa y el mismo lugar
const llenar = (textos, rnd) => { const cosa = COSAS[Math.floor(rnd() * COSAS.length)], lugar = LUGARES[Math.floor(rnd() * LUGARES.length)]; return textos.map(t => t.replace("{cosa}", cosa).replace("{lugar}", lugar)); };

/** Un caso de sospechosos nuevo, con una sola respuesta. dificultad: "facil" | "medio" | "dificil" */
export function casoAlAzar(dificultad = "facil", rnd = Math.random) {
  const d = DIFICULTADES.find(x => x.id === dificultad);
  for (let intento = 0; intento < 300; intento++) {
    const ids = barajar(Object.keys(ANIMALES), rnd).slice(0, entre(d.sospechosos, rnd));
    const culpable = ids[0];
    let posibles = pistasPara(culpable, ids).filter(q => d.no || !q.no);
    const pistas = [];
    let quedan = ids.slice(1);
    while (quedan.length && pistas.length < d.pistas[1]) {
      // Pistas que descartan a alguien que todavía queda; se prefieren las que descartan pocos (así hacen falta varias)
      const utiles = posibles.filter(q => quedan.some(id => !q.f(ANIMALES[id])));
      if (!utiles.length) break;
      const menor = Math.min(...utiles.map(q => quedan.filter(id => !q.f(ANIMALES[id])).length));
      const q = barajar(utiles.filter(x => quedan.filter(id => !x.f(ANIMALES[id])).length <= menor + 1), rnd)[0];
      pistas.push(q);
      quedan = quedan.filter(id => q.f(ANIMALES[id]));
      posibles = posibles.filter(x => x.txt !== q.txt);
    }
    if (quedan.length) continue;
    // Se quitan las pistas que sobran: en un buen caso hacen falta todas
    const resuelve = ps => ids.filter(id => ps.every(q => q.f(ANIMALES[id]))).length === 1;
    for (let i = pistas.length - 1; i >= 0; i--) if (resuelve(pistas.filter((_, j) => j !== i))) pistas.splice(i, 1);
    if (pistas.length < d.pistas[0]) continue;
    if (d.no && !pistas.some(q => q.no)) continue;
    const [titulo, historia] = llenar(HISTORIAS[Math.floor(rnd() * HISTORIAS.length)], rnd);
    const caso = { id: `azar-${dificultad}`, azar: dificultad, etapa: "azar", tipo: "sospechosos", titulo, historia,
      sospechosos: barajar(ids, rnd), culpable, pistas: barajar(pistas, rnd).map(({ txt, f }) => ({ txt, f })) };
    if (!revisarCaso(caso).length) return caso;
  }
  return { ...CASOS[0], id: `azar-${dificultad}`, azar: dificultad };
}

// Libretas al azar: tres animales y tres cosas; pistas directas, con NO, o por características
const TEMAS = [
  { titulo: "¿Qué fruta comió cada uno?", historia: "Cada uno comió una fruta distinta. ¡A llenar la libreta!", verbo: "comió",
    columnas: [{ id: "mango", e: "🥭", n: "mango", art: "el" }, { id: "banano", e: "🍌", n: "banano", art: "el" }, { id: "sandia", e: "🍉", n: "sandía", art: "la" }, { id: "pina", e: "🍍", n: "piña", art: "la" }] },
  { titulo: "¿Dónde durmió cada uno?", historia: "Cada uno durmió en un lugar distinto. ¿Dónde?", verbo: "durmió en",
    columnas: [{ id: "arbol", e: "🌳", n: "árbol", art: "el" }, { id: "piedra", e: "🪨", n: "piedra", art: "la" }, { id: "hoja", e: "🍃", n: "hoja", art: "la" }, { id: "cueva", e: "🕳️", n: "cueva", art: "la" }] },
  { titulo: "El festival de música", historia: "En el festival, cada uno tocó un instrumento distinto.", verbo: "tocó",
    columnas: [{ id: "tambor", e: "🥁", n: "tambor", art: "el" }, { id: "guitarra", e: "🎸", n: "guitarra", art: "la" }, { id: "trompeta", e: "🎺", n: "trompeta", art: "la" }, { id: "marimba", e: "🎹", n: "marimba", art: "la" }] },
  { titulo: "¿De qué color es cada mochila?", historia: "Cada uno llevó una mochila de otro color al paseo.", verbo: "llevó la mochila",
    columnas: [{ id: "roja", e: "🔴", n: "roja", art: "" }, { id: "azul", e: "🔵", n: "azul", art: "" }, { id: "amarilla", e: "🟡", n: "amarilla", art: "" }, { id: "verde", e: "🟢", n: "verde", art: "" }] },
];

/** Una libreta 3 × 3 nueva, con una sola solución y sin pistas de sobra. */
export function libretaAlAzar(rnd = Math.random) {
  const Q = s => s[0].toUpperCase() + s.slice(1);
  for (let intento = 0; intento < 200; intento++) {
    const tema = TEMAS[Math.floor(rnd() * TEMAS.length)];
    const filas = barajar(Object.keys(ANIMALES), rnd).slice(0, 3);
    const columnas = barajar(tema.columnas, rnd).slice(0, 3).map(({ id, e, n, art }) => ({ id, e, n, art }));
    const perm = barajar(columnas.map(c => c.id), rnd);
    const solucion = Object.fromEntries(filas.map((f, i) => [f, perm[i]]));
    const cosa = c => { const col = columnas.find(x => x.id === c); return `${col.art ? col.art + " " : ""}${col.n}`; };
    const nom = f => `${ANIMALES[f].art} ${ANIMALES[f].n}`;
    // Pistas candidatas (todas verdaderas para la solución)
    const cand = [];
    for (const f of filas) for (const c of columnas) {
      if (solucion[f] === c.id) cand.push(p(`${Q(nom(f))} ${tema.verbo} ${cosa(c.id)}.`, s => s.de(f) === c.id));
      else cand.push(p(`${Q(nom(f))} no ${tema.verbo} ${cosa(c.id)}.`, s => s.de(f) !== c.id));
    }
    for (const c of columnas) {
      const a = ANIMALES[filas.find(f => solucion[f] === c.id)];
      if (CUBIERTAS[a.cubierta] && filas.filter(f => ANIMALES[f].cubierta === a.cubierta).length === 1)
        cand.push(p(`El que ${tema.verbo} ${cosa(c.id)} tiene ${CUBIERTAS[a.cubierta]}.`, s => ANIMALES[s.quien(c.id)].cubierta === a.cubierta));
    }
    // Se agregan pistas al azar hasta que haya una sola solución, y después se quitan las que sobran
    const caso = { id: "azar-libreta", azar: "libreta", etapa: "azar", tipo: "libreta", titulo: tema.titulo, historia: tema.historia, filas, columnas, solucion, pistas: [] };
    // Las directas («X comió Y») son muy fáciles: se usan poco
    for (const q of barajar(cand, rnd).sort((a, b) => (/ no /.test(b.txt) || /El que/.test(b.txt) ? 1 : 0) - (/ no /.test(a.txt) || /El que/.test(a.txt) ? 1 : 0))) {
      if (soluciones(caso).length === 1) break;
      const antes = soluciones(caso).length;
      caso.pistas.push(q);
      if (soluciones(caso).length === antes) caso.pistas.pop();
    }
    for (let i = caso.pistas.length - 1; i >= 0; i--) if (soluciones(caso, [i]).length === 1) caso.pistas.splice(i, 1);
    if (caso.pistas.length >= 2 && !revisarCaso(caso).length) { caso.pistas = barajar(caso.pistas, rnd); return caso; }
  }
  return { ...CASOS.find(c => c.tipo === "libreta"), id: "azar-libreta", azar: "libreta" };
}
