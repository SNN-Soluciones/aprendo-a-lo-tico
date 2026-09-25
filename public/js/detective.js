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
