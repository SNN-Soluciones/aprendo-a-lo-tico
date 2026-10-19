// 🔗 Lógica de «¿Quién se come a quién?» (cadenas alimenticias de Costa Rica). Sin pantalla, para probarla con node.
//
// Las flechas van de quien es comido hacia quien come: así se ve cómo pasa la energía (🌿 → 🐛 = la oruga se come la hoja).
// Solo se usan relaciones ciertas y fáciles de comprobar. Cuando una pregunta depende del dibujo, dice «en esta cadena»
// o «en esta red»: que no aparezca una flecha no quiere decir que en la naturaleza nunca pase.

// ---------- Seres ----------
// tipo: "energia" (el sol) | "productor" | "consumidor" | "descomponedor"
// dieta (solo animales con dieta clara): "herbivoro" | "carnivoro" | "omnivoro" · come: qué come, para explicar
// art + n: «la rana» · pl: cómo se dice en plural («las ranas») · animal: lleva «a» («¿quién se come a la rana?»)
const S = (e, art, n, pl, tipo, extra = {}) => ({ e, art, n, pl, tipo, animal: tipo === "consumidor", ...extra });
const H = "herbivoro", C = "carnivoro", O = "omnivoro";

export const SERES = {
  sol: S("☀️", "el", "sol", "el sol", "energia"),
  // Productores: hacen su propio alimento con la luz del sol
  hojas: S("🌿", "las", "hojas", "las hojas", "productor"),
  guarumo: S("🍃", "las", "hojas de guarumo", "las hojas de guarumo", "productor"),
  semillas: S("🌰", "las", "semillas", "las semillas", "productor", { parte: true }), // parte: viene de una planta (no hace fotosíntesis sola)
  zacate: S("🌱", "el", "zacate", "el zacate", "productor"),
  frutas: S("🍌", "las", "frutas", "las frutas", "productor", { parte: true }),
  algas: S("🌿", "las", "algas", "las algas", "productor"),
  mangle: S("🍃", "las", "hojas de mangle", "las hojas de mangle", "productor"),
  pastos: S("🌱", "los", "pastos marinos", "los pastos marinos", "productor"),
  fitoplancton: S("🟢", "el", "fitoplancton", "el fitoplancton", "productor", { nota: "algas diminutas que flotan en el mar" }),
  guanacaste: S("🌳", "el", "árbol de guanacaste", "los árboles de guanacaste", "productor"),
  girasol: S("🌻", "el", "girasol", "los girasoles", "productor"),
  // Descomponedores: deshacen plantas y animales muertos y devuelven nutrientes al suelo
  hongos: S("🍄", "los", "hongos", "los hongos", "descomponedor"),
  lombriz: S("🪱", "la", "lombriz de tierra", "las lombrices de tierra", "descomponedor"),
  bacterias: S("🦠", "las", "bacterias", "las bacterias", "descomponedor"),
  // Consumidores: herbívoros
  saltamontes: S("🦗", "el", "saltamontes", "los saltamontes", "consumidor", { dieta: H, come: "come hojas y pasto" }),
  oruga: S("🐛", "la", "oruga", "las orugas", "consumidor", { dieta: H, come: "come hojas" }),
  mariposa: S("🦋", "la", "mariposa", "las mariposas", "consumidor", { dieta: H, come: "toma el néctar de las flores" }),
  abeja: S("🐝", "la", "abeja", "las abejas", "consumidor", { dieta: H, come: "se alimenta del néctar y el polen de las flores" }),
  perezoso: S("🦥", "el", "perezoso", "los perezosos", "consumidor", { dieta: H, come: "come hojas, sobre todo de guarumo" }),
  venado: S("🦌", "el", "venado cola blanca", "los venados", "consumidor", { dieta: H, come: "come hojas, pasto y frutos" }),
  congo: S("🐒", "el", "mono congo", "los monos congo", "consumidor", { dieta: H, come: "come hojas y frutas" }),
  iguana: S("🦎", "la", "iguana verde", "las iguanas", "consumidor", { dieta: H, come: "de adulta come hojas, flores y frutas" }),
  tortuga: S("🐢", "la", "tortuga verde", "las tortugas verdes", "consumidor", { dieta: H, come: "de adulta come pastos marinos y algas" }),
  vaca: S("🐄", "la", "vaca", "las vacas", "consumidor", { dieta: H, come: "come zacate" }),
  murcielago: S("🦇", "el", "murciélago frutero", "los murciélagos fruteros", "consumidor", { dieta: H, come: "come frutas" }),
  // Consumidores: carnívoros
  rana: S("🐸", "la", "rana", "las ranas", "consumidor", { dieta: C, come: "come insectos, como saltamontes y grillos" }),
  terciopelo: S("🐍", "la", "serpiente terciopelo", "las serpientes", "consumidor", { dieta: C, come: "caza ratones, ranas y lagartijas" }),
  boa: S("🐍", "la", "boa", "las boas", "consumidor", { dieta: C, come: "caza ratones, aves y murciélagos" }),
  guaco: S("🦅", "el", "halcón guaco", "los halcones guacos", "consumidor", { dieta: C, come: "es famoso porque caza serpientes" }),
  arpia: S("🦅", "el", "águila arpía", "las águilas arpías", "consumidor", { dieta: C, come: "caza perezosos y monos", fem: true }),
  jaguar: S("🐆", "el", "jaguar", "los jaguares", "consumidor", { dieta: C, come: "caza venados, saínos y hasta tortugas en la playa" }),
  cocodrilo: S("🐊", "el", "cocodrilo", "los cocodrilos", "consumidor", { dieta: C, come: "come peces, aves y otros animales" }),
  tigre: S("🦈", "el", "tiburón tigre", "los tiburones tigre", "consumidor", { dieta: C, come: "come tortugas, peces y muchos animales más" }),
  delfin: S("🐬", "el", "delfín", "los delfines", "consumidor", { dieta: C, come: "come peces y calamares" }),
  buho: S("🦉", "el", "búho", "los búhos", "consumidor", { dieta: C, come: "caza ratones e insectos de noche" }),
  garza: S("🐦", "la", "garza", "las garzas", "consumidor", { dieta: C, come: "come peces, ranas y cangrejos" }),
  martin: S("🐦", "el", "martín pescador", "los martines pescadores", "consumidor", { dieta: C, come: "se tira al agua a pescar peces pequeños" }),
  nutria: S("🦦", "la", "nutria", "las nutrias", "consumidor", { dieta: C, come: "come peces, cangrejos y camarones" }),
  // Consumidores: omnívoros
  mapache: S("🦝", "el", "mapache", "los mapaches", "consumidor", { dieta: O, come: "come frutas, cangrejos, huevos e insectos" }),
  carablanca: S("🐵", "el", "mono carablanca", "los monos carablanca", "consumidor", { dieta: O, come: "come frutas, insectos, huevos y hasta lagartijas" }),
  yiguirro: S("🐦", "el", "yigüirro", "los yigüirros", "consumidor", { dieta: O, come: "come lombrices, insectos y frutas" }),
  gallina: S("🐔", "la", "gallina", "las gallinas", "consumidor", { dieta: O, come: "come granos, semillas, insectos y lombrices" }),
  raton: S("🐭", "el", "ratón", "los ratones", "consumidor", { dieta: O, come: "come semillas, frutas e insectos" }),
  humano: S("🧑", "el", "ser humano", "los seres humanos", "consumidor", { dieta: O, come: "come plantas y animales" }),
  // Consumidores que solo salen en las cadenas (su dieta es más revuelta)
  zooplancton: S("🦐", "el", "zooplancton", "el zooplancton", "consumidor", { nota: "animalitos diminutos del mar" }),
  sardina: S("🐟", "la", "sardina", "las sardinas", "consumidor"),
  olomina: S("🐟", "la", "olomina", "las olominas", "consumidor"),
  camaron: S("🦐", "el", "camarón de río", "los camarones de río", "consumidor"),
  guapote: S("🐟", "el", "guapote", "los guapotes", "consumidor"),
  cangrejo: S("🦀", "el", "cangrejo", "los cangrejos", "consumidor"),
  tibBallena: S("🦈", "el", "tiburón ballena", "los tiburones ballena", "consumidor"),
  pezVela: S("🐟", "el", "pez vela", "los peces vela", "consumidor"),
};

// ---------- Cadenas (de quien es comido a quien come) ----------
export const CADENAS = [
  { eco: "el bosque", c: ["hojas", "saltamontes", "rana", "terciopelo", "guaco"] },
  { eco: "el bosque", c: ["semillas", "raton", "terciopelo", "guaco"] },
  { eco: "el bosque", c: ["guarumo", "perezoso", "arpia"] },
  { eco: "el bosque", c: ["hojas", "venado", "jaguar"] },
  { eco: "el bosque", c: ["hojas", "oruga", "yiguirro"] },
  { eco: "el bosque", c: ["frutas", "murcielago", "boa"] },
  { eco: "la finca", c: ["zacate", "vaca", "humano"] },
  { eco: "la finca", c: ["zacate", "saltamontes", "gallina"] },
  { eco: "el río", c: ["algas", "olomina", "martin"] },
  { eco: "el río", c: ["algas", "camaron", "guapote", "nutria"] },
  { eco: "el manglar", c: ["mangle", "cangrejo", "mapache"] },
  { eco: "el manglar", c: ["mangle", "cangrejo", "garza"] },
  { eco: "el mar", c: ["fitoplancton", "zooplancton", "sardina", "delfin"] },
  { eco: "el mar", c: ["pastos", "tortuga", "tigre"] },
  { eco: "la playa de Tortuguero", c: ["pastos", "tortuga", "jaguar"] },
];

const TIERRA = ["el bosque", "la finca"];
/** «del mar», «de la finca» */
export const delEco = eco => eco.startsWith("el ") ? `del ${eco.slice(3)}` : `de ${eco}`;

// ---------- Redes alimentarias (5° y 6°) ----------
// pos: dónde va cada uno en el dibujo (viewBox 340 × 316); los que comen van más arriba
export const REDES = [
  { id: "bosque", nombre: "Red del bosque",
    pos: { hojas: [70, 270], semillas: [270, 270], saltamontes: [40, 200], oruga: [130, 200], raton: [270, 200],
      yiguirro: [60, 125], rana: [170, 135], terciopelo: [215, 60], buho: [300, 110], guaco: [110, 40] },
    flechas: [["hojas", "saltamontes"], ["hojas", "oruga"], ["semillas", "raton"], ["saltamontes", "rana"], ["saltamontes", "yiguirro"],
      ["oruga", "yiguirro"], ["rana", "terciopelo"], ["raton", "terciopelo"], ["raton", "buho"], ["terciopelo", "guaco"]] },
  { id: "mar", nombre: "Red del mar",
    pos: { fitoplancton: [70, 270], pastos: [270, 270], zooplancton: [70, 200], tortuga: [270, 200], tibBallena: [55, 125],
      sardina: [160, 135], delfin: [120, 50], pezVela: [220, 50], tigre: [285, 120] },
    flechas: [["fitoplancton", "zooplancton"], ["zooplancton", "sardina"], ["zooplancton", "tibBallena"], ["sardina", "delfin"],
      ["sardina", "pezVela"], ["pastos", "tortuga"], ["tortuga", "tigre"]] },
];

/** Dibujo SVG de una red: círculos con el dibujo y el nombre, y flechas de quien es comido a quien come. */
export function redSVG(id, marca = null) {
  const r = REDES.find(x => x.id === id), R = 24;
  const flechas = r.flechas.map(([a, b]) => {
    const [x1, y1] = r.pos[a], [x2, y2] = r.pos[b], dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy);
    // Si la flecha llega por debajo, termina antes del nombre (que va debajo del círculo) para no taparlo
    const fin = -dy / l > 0.8 ? R + 22 : R + 7;
    return `<line x1="${(x1 + dx / l * (R + 2)).toFixed(1)}" y1="${(y1 + dy / l * (R + 2)).toFixed(1)}" x2="${(x2 - dx / l * fin).toFixed(1)}" y2="${(y2 - dy / l * fin).toFixed(1)}" marker-end="url(#punta)"/>`;
  }).join("");
  const nodos = Object.entries(r.pos).map(([k, [x, y]]) => `<g class="nodo${k === marca ? " marca" : ""}"><circle cx="${x}" cy="${y}" r="${R}"/>`
    + `<text class="e" x="${x}" y="${y + 9}">${SERES[k].e}</text><text class="n" x="${x}" y="${y + R + 13}">${SERES[k].n}</text></g>`).join("");
  return `<svg viewBox="0 0 340 316" role="img" aria-label="${r.nombre}: ${r.flechas.map(([a, b]) => `${SERES[b].n} come ${SERES[a].n}`).join(", ")}">`
    + `<defs><marker id="punta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>`
    + `<g class="flechas">${flechas}</g>${nodos}</svg>`;
}

// ---------- Palabras ----------
export const conArt = id => `${SERES[id].art} ${SERES[id].n}`;
/** «al ratón», «a la rana», «las hojas» (a las plantas no se les pone «a») */
export const objeto = id => { const s = SERES[id]; return s.animal ? (s.art === "el" ? `al ${s.n}` : `a ${s.art} ${s.n}`) : `${s.art} ${s.n}`; };
export const may = t => t.charAt(0).toUpperCase() + t.slice(1);
const esPlural = id => /^(los|las) /.test(SERES[id].pl) && /^(los|las)$/.test(SERES[id].art);
/** Sin artículo, en plural si se puede contar: «saltamontes», «fitoplancton», «hojas de mangle» */
const sinArt = id => SERES[id].pl.replace(/^(el|la|los|las) /, "");
/** «a los saltamontes», «las hojas» */
const aPl = id => SERES[id].animal ? `a ${SERES[id].pl}` : SERES[id].pl;
const desaparece = id => /^(los|las) /.test(SERES[id].pl) ? "desaparecen" : "desaparece";
const yLista = t => t.length > 1 ? `${t.slice(0, -1).join(", ")} y ${t[t.length - 1]}` : t[0];
const DIETA = { herbivoro: "herbívoro", carnivoro: "carnívoro", omnivoro: "omnívoro" };
const DIETA_F = { herbivoro: "herbívora", carnivoro: "carnívora", omnivoro: "omnívora" };
const dietaDe = id => (SERES[id].fem || SERES[id].art === "la" ? DIETA_F : DIETA)[SERES[id].dieta];
export const ROLES = ["productor", "primario", "secundario", "terciario"];
const ROL = { productor: "productor", primario: "consumidor primario", secundario: "consumidor secundario", terciario: "consumidor terciario" };

// ---------- Azar ----------
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const ficha = id => `<span class="ficha"><span class="fe">${SERES[id].e}</span><span class="fn">${SERES[id].n}</span></span>`;
/** Para pintar una cadena con flechas (la página la dibuja con la clase .cadena) */
export const cadenaHTML = (ids, marcar = -1) =>
  `<div class="cadena">${ids.map((id, i) => `${i ? `<span class="fl" aria-hidden="true">➜</span>` : ""}<span class="ficha${i === marcar ? " marcada" : ""}"><span class="fe">${SERES[id].e}</span><span class="fn">${SERES[id].n}</span></span>`).join("")}</div>`;

// Quién come a quién, según las cadenas y las redes (solo para escoger opciones que de verdad no sean su comida)
export const PRESAS = {};
for (const { c } of CADENAS) c.forEach((id, i) => { if (i) (PRESAS[id] ||= new Set()).add(c[i - 1]); });
for (const r of REDES) r.flechas.forEach(([a, b]) => (PRESAS[b] ||= new Set()).add(a));
const GRANDES = ["jaguar", "tigre", "arpia", "cocodrilo"]; // ninguno es comida de los demás en este juego

const ids = f => Object.keys(SERES).filter(id => f(SERES[id]));
const HERB = ids(s => s.dieta === H), CARN = ids(s => s.dieta === C), OMNI = ids(s => s.dieta === O);

// ---------- 🪜 Escalones ----------
// tipo: qué pregunta sale · los demás campos afinan la dificultad
export const ESCALONES = [
  { tipo: "dieta", dietas: [H, C], nombre: "¿Herbívoro o carnívoro?" },                 // 1. dos opciones
  { tipo: "dieta", dietas: [H, C, O], nombre: "Herbívoro, carnívoro u omnívoro" },      // 2. con omnívoros
  { tipo: "come", nombre: "¿Qué come?" },                                               // 3. qué come cada animal
  { tipo: "armar", largo: [3, 3], nombre: "Armá una cadena de 3" },                     // 4. ordenar 3 eslabones
  { tipo: "armar", largo: [4, 5], nombre: "Armá cadenas más largas" },                  // 5. 4 o 5 eslabones
  { tipo: "papel", nombre: "Productor, consumidor o descomponedor" },                   // 6. el papel de cada ser vivo
  { tipo: "rol", nombre: "Consumidor primario, secundario o terciario" },               // 7. en una cadena dibujada
  { tipo: "armar", largo: [3, 5], sol: true, sobra: true, nombre: "Con el sol y uno que sobra" }, // 8. empezar por el sol y descartar
  { tipo: "falta", nombre: "¿Qué pasa si desaparece?" },                                 // 9. consecuencias
  { tipo: "ideas", nombre: "Energía, flechas y descomponedores" },                      // 10. conceptos
  { tipo: "red", preguntas: ["come", "comido"], nombre: "Leer una red alimentaria" },     // 11. ¿qué come? ¿quién se lo come?
  { tipo: "red", preguntas: ["desaparece", "primarios", "come", "comido"], nombre: "Redes: si desaparece…" }, // 12. lo más difícil
];

// ---------- Generadores ----------
const opcion = (id, html, extra = {}) => ({ id: String(id), html, ...extra });

function preguntaDieta(e, rnd) {
  const dieta = azar(e.dietas, rnd);
  const id = azar({ herbivoro: HERB, carnivoro: CARN, omnivoro: OMNI }[dieta], rnd);
  const s = SERES[id];
  const nom = { herbivoro: "🌿 Herbívoro", carnivoro: "🥩 Carnívoro", omnivoro: "🍽️ Omnívoro" };
  const que = { herbivoro: "solo come plantas", carnivoro: "come otros animales", omnivoro: "come plantas y animales" };
  return {
    tipo: "opciones",
    html: `<span class="grande">${s.e}</span>${may(conArt(id))}<small>${may(s.come)}.</small>`,
    voz: `${may(conArt(id))} ${s.come}. ¿Es herbívoro, carnívoro${e.dietas.length > 2 ? " u omnívoro" : ""}?`,
    opciones: e.dietas.map(d => opcion(d, nom[d], { mal: `No: ${d === "herbivoro" ? "un herbívoro solo come plantas" : d === "carnivoro" ? "un carnívoro come otros animales" : "un omnívoro come plantas y animales"}, y ${conArt(id)} ${s.come}.` })),
    correcta: dieta,
    explica: `${may(conArt(id))} ${s.come}: ${que[dieta]}, por eso es <b>${dietaDe(id)}</b>.`,
  };
}

function preguntaCome(e, rnd) {
  let c, i, id;
  do { c = azar(CADENAS, rnd); i = 1 + Math.floor(rnd() * (c.c.length - 1)); id = c.c[i]; } while (id === "humano");
  const presa = c.c[i - 1], s = SERES[id];
  // Opciones que seguro no son su comida: a un carnívoro, plantas; a un herbívoro, animales;
  // a los demás (omnívoros y pececitos), depredadores grandes que no se pueden comer
  const noEs = x => x !== id && x !== presa && !PRESAS[id]?.has(x);
  const plantas = barajar(ids(x => x.tipo === "productor" && !x.parte).filter(noEs), rnd);
  const animales = barajar(CARN.filter(noEs), rnd);
  const grandes = barajar(GRANDES.filter(noEs), rnd);
  const otras = (s.dieta === C ? plantas : s.dieta === H ? animales : grandes).slice(0, 2);
  const ops = barajar([presa, ...otras], rnd);
  return {
    tipo: "opciones",
    html: `<span class="grande">${s.e}</span>¿Qué come ${conArt(id)}?<small>en ${c.eco}</small>`,
    voz: `En ${c.eco}, ¿qué come ${conArt(id)}?`,
    opciones: ops.map(x => opcion(x, `<b>${SERES[x].e}</b>${SERES[x].n}`, x === presa ? {} : {
      mal: s.dieta === C ? `${may(conArt(id))} no come plantas: es ${dietaDe(id)}.`
        : s.dieta === H ? `${may(conArt(id))} no come animales: es ${dietaDe(id)}.`
          : `${may(conArt(id))} no se come ${objeto(x)}.`,
    })),
    correcta: presa,
    explica: `En ${c.eco}, ${conArt(id)} se come ${objeto(presa)}. ${cadenaHTML(c.c.slice(i - 1, i + 1))}`,
    cols: 3,
  };
}

function preguntaArmar(e, rnd) {
  const posibles = CADENAS.filter(c => c.c.length >= e.largo[0] && c.c.length <= e.largo[1]);
  const c = azar(posibles, rnd);
  const cadena = e.sol ? ["sol", ...c.c] : [...c.c];
  const piezas = [...cadena];
  let sobra = null;
  if (e.sobra) {
    // Uno que sobra: un animal que solo sale en cadenas del otro medio (de tierra si la cadena es de agua, y al revés)
    const medio = k => TIERRA.includes(k.eco) ? "tierra" : "agua";
    sobra = azar(ids(s => s.tipo === "consumidor").filter(x => CADENAS.some(k => k.c.includes(x)) && CADENAS.every(k => !k.c.includes(x) || medio(k) !== medio(c))), rnd);
    piezas.push(sobra);
  }
  return {
    tipo: "armar", eco: c.eco, cadena, piezas: barajar(piezas, rnd), sobra,
    html: `🔗 Armá la cadena ${delEco(c.eco)}<small>${e.sol ? "Empezá donde empieza la energía" : "Empezá por la planta"} y seguí con quién se la come.${e.sobra ? " ¡Ojo! Uno no es de esta cadena." : ""}</small>`,
    voz: `Armá la cadena alimenticia ${delEco(c.eco)}. ${e.sol ? "Empezá por donde empieza la energía" : "Empezá por la planta"}, y después tocá quién se la come, y así.${e.sobra ? " ¡Ojo! Uno no es de esta cadena." : ""}`,
    explica: e.sol
      ? `La energía empieza en el sol, pasa a la planta y después a cada animal que se come al anterior.`
      : `La energía pasa de la planta al que se la come, y de ahí a cada animal que se come al anterior.`,
  };
}

function preguntaPapel(e, rnd) {
  const tipo = azar(["productor", "consumidor", "descomponedor"], rnd);
  const id = azar(ids(s => s.tipo === tipo && !s.parte && (tipo !== "consumidor" || s.dieta)), rnd);
  const s = SERES[id], pl = esPlural(id);
  const nom = { productor: "🌱 Productor", consumidor: "🍽️ Consumidor", descomponedor: "🍄 Descomponedor" };
  const por = {
    productor: `${pl ? "hacen" : "hace"} su propio alimento con la luz del sol, el agua y el aire (fotosíntesis)`,
    consumidor: `no puede hacer su alimento: ${s.come}`,
    descomponedor: `${pl ? "deshacen" : "deshace"} plantas y animales muertos y ${pl ? "devuelven" : "devuelve"} nutrientes al suelo, que después usan las plantas`,
  };
  return {
    tipo: "opciones",
    html: `<span class="grande">${s.e}</span>${may(conArt(id))}${s.nota ? `<small>${s.nota}</small>` : ""}`,
    voz: `${may(conArt(id))}: ¿es productor, consumidor o descomponedor?`,
    opciones: ["productor", "consumidor", "descomponedor"].map(t => opcion(t, nom[t], { mal: `No: ${conArt(id)} ${por[tipo]}.` })),
    correcta: tipo,
    explica: `${may(conArt(id))} ${por[tipo]}: ${pl ? "son" : "es"} <b>${tipo}${pl ? "es" : ""}</b>.`,
  };
}

function preguntaRol(e, rnd) {
  const c = azar(CADENAS, rnd);
  const i = Math.floor(rnd() * Math.min(4, c.c.length));
  const id = c.c[i], rol = ROLES[i];
  const nom = { productor: "🌱 Productor", primario: "1️⃣ Consumidor primario", secundario: "2️⃣ Consumidor secundario", terciario: "3️⃣ Consumidor terciario" };
  const pl = esPlural(id);
  const por = i === 0
    ? (SERES[id].parte ? `vienen de una planta, que hace su propio alimento con la luz del sol` : `${pl ? "hacen" : "hace"} su propio alimento con la luz del sol`)
    : i === 1 ? `se come al productor (${conArt(c.c[0])})`
      : `se come ${objeto(c.c[i - 1])}, que es ${ROL[ROLES[i - 1]]}`;
  return {
    tipo: "opciones",
    html: `${cadenaHTML(c.c, i)}En esta cadena, ¿qué es ${conArt(id)}?`,
    voz: `En esta cadena ${delEco(c.eco)}: ${c.c.map(conArt).join(", ")}. ¿Qué es ${conArt(id)}?`,
    opciones: ROLES.map(r => opcion(r, nom[r])),
    correcta: rol,
    explica: `${may(conArt(id))} ${por}: ${pl ? "son el" : "es"} <b>${ROL[rol]}</b>.`,
    cols: 2,
  };
}

function preguntaFalta(e, rnd) {
  const c = azar(CADENAS, rnd);
  const i = Math.floor(rnd() * c.c.length);
  // Sobre quién se pregunta: si desaparece la planta, cualquier animal; si no, el de abajo (presa) o el de arriba (depredador)
  const vecinos = i === 0 ? c.c.slice(1).map((_, k) => k + 1) : [i - 1, i + 1].filter(j => j > 0 && j < c.c.length);
  const j = azar(vecinos, rnd);
  const ya = c.c[i], otro = c.c[j];
  const sube = i > 0 && j === i - 1;
  const correcta = sube ? "mas" : "menos";
  const comian = /^(los|las) /.test(SERES[ya].pl) ? "se comían" : "se comía";
  const explica = i === 0
    ? `Sin ${sinArt(ya)} nadie en esta cadena tiene alimento: la energía empieza en los productores. Va a haber <b>menos ${sinArt(otro)}</b>.`
    : sube
      ? `En esta cadena, ${SERES[ya].pl} ${comian} ${aPl(otro)}. Si ${desaparece(ya)}, ya nadie se come ${aPl(otro)}: va a haber <b>más ${sinArt(otro)}</b>.`
      : `En esta cadena, ${SERES[otro].pl} se alimenta${/^(los|las) /.test(SERES[otro].pl) ? "n" : ""} de ${sinArt(ya)}. Sin su comida, va a haber <b>menos ${sinArt(otro)}</b>.`;
  return {
    tipo: "opciones",
    html: `${cadenaHTML(c.c, i)}Si ${desaparece(ya)} ${SERES[ya].pl} ${SERES[ya].e}, ¿qué pasa con ${SERES[otro].pl} ${SERES[otro].e}?`,
    voz: `En esta cadena ${delEco(c.eco)}, si ${desaparece(ya)} ${SERES[ya].pl}, ¿qué pasa con ${SERES[otro].pl}?`,
    opciones: [opcion("mas", "📈 Va a haber más"), opcion("menos", "📉 Va a haber menos"), opcion("igual", "😐 Nada cambia",
      { mal: "Sí cambia algo: en una cadena, cada eslabón depende de los otros." })],
    correcta, explica,
  };
}

// Preguntas de ideas (fijas, con las opciones revueltas)
const IDEAS = [
  { p: "¿De dónde viene la energía de las cadenas alimenticias?", ok: "☀️ Del sol", no: ["🌊 Del agua", "🐆 De los depredadores"],
    ex: "Del sol: las plantas usan su luz para hacer su alimento, y de ahí la energía pasa a los animales." },
  { p: "¿Qué quiere decir la flecha 🌿 ➜ 🐛?", ok: "La oruga se come la hoja", no: ["La hoja se come a la oruga", "La oruga vive en la hoja"],
    ex: "La flecha va de quien es comido hacia quien come: la energía pasa de la hoja a la oruga." },
  { p: "¿Qué hacen los descomponedores, como los hongos y las lombrices?", ok: "Deshacen seres muertos y abonan el suelo", no: ["Cazan animales grandes", "Hacen su alimento con el sol"],
    ex: "Deshacen plantas y animales muertos y devuelven los nutrientes al suelo. Así las plantas vuelven a crecer." },
  { p: "¿Por qué las plantas son productores?", ok: "Hacen su propio alimento", no: ["Se comen a otros seres vivos", "Viven mucho tiempo"],
    ex: "Con la luz del sol, el agua y el aire hacen su propio alimento: eso se llama fotosíntesis." },
  { p: "¿Qué es un consumidor primario?", ok: "El que come plantas", no: ["El que caza a todos", "El que deshace seres muertos"],
    ex: "El consumidor primario se come a los productores (las plantas): por ejemplo, la vaca que come zacate." },
  { p: "¿Qué ayuda a cuidar las cadenas alimenticias?", ok: "Cuidar los bosques y no cazar", no: ["Botar basura en los ríos", "Cortar todos los árboles"],
    ex: "Si cuidamos los bosques, los ríos y el mar, y no cazamos animales silvestres, cada eslabón sigue teniendo su comida." },
  { p: "Un animal omnívoro come…", ok: "Plantas y animales", no: ["Solo plantas", "Solo animales"],
    ex: "Omnívoro quiere decir que come de todo: plantas y animales, como el mapache o nosotros." },
  { p: "¿Por qué hay muchos menos jaguares que venados?", ok: "La energía se gasta en cada paso", no: ["Los jaguares no tienen hijos", "Los venados son más fuertes"],
    ex: "En cada eslabón se gasta mucha energía en vivir y moverse: arriba de la cadena alcanza para menos animales." },
  { p: "Si un río se contamina y se mueren las algas, ¿qué pasa?", ok: "Los animales del río pierden su alimento", no: ["No pasa nada", "Hay más peces"],
    ex: "Las algas son los productores del río: sin ellas, los camarones y los peces se quedan sin alimento." },
  { p: "¿Cuál de estos es un descomponedor?", ok: "🍄 El hongo", no: ["🐸 La rana", "🌻 El girasol"],
    ex: "El hongo es un descomponedor: deshace hojas y troncos muertos. La rana es consumidor y el girasol es productor." },
];
function preguntaIdea(e, rnd) {
  const q = azar(IDEAS, rnd);
  const ops = barajar([opcion("ok", q.ok), ...q.no.map((t, k) => opcion("no" + k, t))], rnd);
  return { tipo: "opciones", html: q.p, voz: q.p, opciones: ops, correcta: "ok", explica: q.ex, cols: 1 };
}

// Redes: preguntas que se contestan mirando el dibujo
const nombres = s => yLista(s.map(conArt));
const de = id => SERES[id].art === "el" ? `del ${SERES[id].n}` : `de ${conArt(id)}`;
export const comeEnRed = (r, id) => r.flechas.filter(f => f[1] === id).map(f => f[0]);
export const loComenEnRed = (r, id) => r.flechas.filter(f => f[0] === id).map(f => f[1]);
function opcionesDeGrupos(correcto, otros, rnd) {
  const clave = g => [...g].sort().join("+");
  const vistos = new Set([clave(correcto)]), ops = [correcto];
  for (const g of otros) if (g.length && !vistos.has(clave(g)) && ops.length < 3) { vistos.add(clave(g)); ops.push(g); }
  return barajar(ops, rnd);
}
function preguntaRed(e, rnd) {
  const r = azar(REDES, rnd);
  const nodos = Object.keys(r.pos);
  for (let intento = 0; intento < 50; intento++) {
    const que = azar(e.preguntas, rnd);
    if (que === "primarios") {
      const prim = nodos.filter(id => comeEnRed(r, id).some(x => SERES[x].tipo === "productor"));
      const n = prim.length;
      const ops = barajar([...new Set([n, n + 1, Math.max(1, n - 1), n + 2])].slice(0, 3), rnd);
      return { tipo: "opciones", red: r.id, html: "En esta red, ¿cuántos consumidores primarios hay?", voz: "Mirá la red. ¿Cuántos consumidores primarios hay? Son los que comen plantas.",
        opciones: ops.map(x => opcion(x, `<b>${x}</b>`)), correcta: String(n),
        explica: `Los consumidores primarios comen productores: ${nombres(prim)}. Son <b>${n}</b>.` };
    }
    const id = azar(nodos.filter(x => que === "comido" || que === "desaparece" ? loComenEnRed(r, x).length : comeEnRed(r, x).length), rnd);
    const correcto = que === "come" ? comeEnRed(r, id) : loComenEnRed(r, id);
    const vecinos = que === "come" ? loComenEnRed(r, id) : comeEnRed(r, id);
    const resto = nodos.filter(x => x !== id && !correcto.includes(x) && !vecinos.includes(x));
    const otros = [
      [...correcto, azar(vecinos.length ? vecinos : resto, rnd)].filter(Boolean),
      correcto.length > 1 ? correcto.slice(0, -1) : [azar(resto, rnd)],
      vecinos.length ? vecinos : [azar(resto, rnd)],
      [azar(resto, rnd)],
      [azar(resto, rnd), azar(resto, rnd)].filter((x, k, a) => a.indexOf(x) === k),
    ];
    const grupos = opcionesDeGrupos(correcto, otros, rnd);
    if (grupos.length < 3) continue;
    const varios = correcto.length > 1;
    const textos = {
      come: [`En esta red, ¿qué come ${conArt(id)}?`, `${may(conArt(id))} come ${yLista(correcto.map(sinArt))}: son las flechas que apuntan hacia ${conArt(id)}.`],
      comido: [`En esta red, ¿quién se come ${objeto(id)}?`, `Las flechas que salen ${de(id)} van hacia ${nombres(correcto)}: ${varios ? "ellos se comen" : "se come"} ${aPl(id)}.`],
      desaparece: [`Si ${desaparece(id)} ${SERES[id].pl}, ¿quién pierde parte de su comida?`,
        `${may(nombres(correcto))} se ${varios ? "comen" : "come"} ${aPl(id)}: si ${desaparece(id)}, se ${varios ? "quedan" : "queda"} con menos alimento.`],
    }[que];
    return {
      tipo: "opciones", red: r.id, marca: id, html: textos[0], voz: `Mirá la red. ${textos[0]}`,
      opciones: grupos.map((g, k) => opcion("g" + k, g.map(x => `${SERES[x].e} ${SERES[x].n}`).join("<br>"), { grupo: [...g].sort().join("+") })),
      correcta: "g" + grupos.indexOf(correcto), explica: textos[1], cols: 3,
    };
  }
  return preguntaPapel(e, rnd);
}

const GENERADORES = { dieta: preguntaDieta, come: preguntaCome, armar: preguntaArmar, papel: preguntaPapel, rol: preguntaRol,
  falta: preguntaFalta, ideas: preguntaIdea, red: preguntaRed };
/** Una pregunta nueva para el escalón i. */
export const pregunta = (i, rnd = Math.random) => { const e = ESCALONES[i]; return { ...GENERADORES[e.tipo](e, rnd), escalon: i }; };

// ---------- Revisiones (para las pruebas) ----------
/** Revisa los datos: que cada cadena calce con la dieta de cada animal. Devuelve problemas (vacío = bien). */
export function revisarDatos() {
  const mal = [];
  for (const { c, eco } of CADENAS) {
    c.forEach(id => { if (!SERES[id]) mal.push(`${eco}: no existe ${id}`); });
    if (SERES[c[0]]?.tipo !== "productor") mal.push(`${eco}: la cadena no empieza en un productor`);
    c.slice(1).forEach((id, k) => {
      const s = SERES[id], presa = SERES[c[k]];
      if (s?.tipo !== "consumidor") mal.push(`${eco}: ${id} no es consumidor`);
      if (s?.dieta === C && presa?.tipo === "productor") mal.push(`${eco}: ${id} es carnívoro y come plantas`);
      if (s?.dieta === H && presa?.tipo !== "productor") mal.push(`${eco}: ${id} es herbívoro y come animales`);
    });
  }
  for (const r of REDES) for (const [a, b] of r.flechas) {
    if (!r.pos[a] || !r.pos[b]) mal.push(`${r.id}: ${a}→${b} sin posición`);
    if (SERES[b].dieta === C && SERES[a].tipo === "productor") mal.push(`${r.id}: ${b} carnívoro come plantas`);
    if (SERES[b].dieta === H && SERES[a].tipo !== "productor") mal.push(`${r.id}: ${b} herbívoro come animales`);
    if (r.pos[a][1] <= r.pos[b][1]) mal.push(`${r.id}: ${b} debería ir más arriba que ${a}`);
  }
  for (const g of GRANDES) for (const x of Object.keys(PRESAS)) if (PRESAS[x].has(g)) mal.push(`${g} es comida de ${x}`);
  return mal;
}

/** Revisa una pregunta generada. Devuelve problemas (vacío = bien). */
export function revisarPregunta(q) {
  const mal = [];
  if (q.tipo === "opciones") {
    const ids = q.opciones.map(o => o.id);
    if (new Set(ids).size !== ids.length) mal.push("opciones repetidas");
    if (ids.filter(x => x === String(q.correcta)).length !== 1) mal.push("la correcta no está una vez");
    const htmls = q.opciones.map(o => o.html);
    if (new Set(htmls).size !== htmls.length) mal.push("dos opciones se ven igual");
    if (q.opciones.length < 2) mal.push("muy pocas opciones");
    if (q.opciones.some(o => o.grupo) && new Set(q.opciones.map(o => o.grupo)).size !== q.opciones.length) mal.push("grupos repetidos");
    if (/undefined|NaN/.test(q.html + q.voz + q.explica + htmls.join(""))) mal.push("texto con undefined");
  } else {
    if (!q.cadena.every(id => q.piezas.includes(id))) mal.push("faltan piezas");
    if (q.sobra && q.cadena.includes(q.sobra)) mal.push("lo que sobra está en la cadena");
    if (q.piezas.length !== q.cadena.length + (q.sobra ? 1 : 0)) mal.push("piezas de más");
    if (/undefined|NaN/.test(q.html + q.voz)) mal.push("texto con undefined");
  }
  return mal;
}
