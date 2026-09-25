// 📝 Temas para «Preparate para el examen». Cada tema: para qué grados es y cómo arma una pregunta al azar.
// Una pregunta es:
//   { texto, tipo: "opcion" | "numero", opciones?: [texto], correcta: texto, explica, voz? }
// En las de "numero" el niño escribe la respuesta; en las de "opcion", la elige.
// `g` es el grado (1 a 6): la dificultad crece con el grado. `nombre` se usa en los problemas.
import { ESTADOS, COSAS, CAMBIOS, SITUACIONES } from "./estados.js";
import { ECOS, SERES, LUGARES } from "./ecosistemas.js";
import { CABECERAS } from "./generador-datos.js";
import { PARTES as PLANTA, COMIDAS } from "./planta.js";
import { SIMBOLOS, titulo as tituloSimbolo } from "./simbolos.js";
import { PARTES as ESCUDO } from "./escudo.js";
import { FECHAS } from "./efemerides.js";
import { TEMAS as VOCAB } from "./memory-en.js";
import { TODAS as ORTO, regla } from "./ortografia.js";
import { SIGNOS, signoDe, sinSignos } from "./oraciones.js";
import { frases, fraseSigno, fraseMayus } from "./generador-frases.js";
import { ANIMALES } from "./detective.js";

// ---------- Ayudas ----------
const ent = (a, b, r) => a + Math.floor(r() * (b - a + 1));
const elegir = (arr, r) => arr[Math.floor(r() * arr.length)];
function barajar(arr, r) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const miles = n => n.toLocaleString("es-CR");
/** Opciones: la correcta y otras distintas (sin repetir), en desorden. */
function opciones(correcta, otras, r, n = 3) {
  const unicas = [...new Set(otras.map(String))].filter(o => o !== String(correcta));
  return barajar([String(correcta), ...barajar(unicas, r).slice(0, n - 1)], r);
}
const num = (texto, correcta, explica) => ({ texto, tipo: "numero", correcta: String(correcta), explica });
const opc = (texto, correcta, otras, explica, r, n) => ({ texto, tipo: "opcion", opciones: opciones(correcta, otras, r, n), correcta: String(correcta), explica });
const cercanos = (n, r, d = [1, 2, 10]) => d.flatMap(x => [n + x, n - x]).filter(x => x >= 0);
const quien = (nombre, r) => nombre || elegir(["Sofía", "Mateo", "Valeria", "Diego", "Camila"], r);

// Tamaño de los números según el grado
const tope = g => [0, 20, 100, 1000, 10000, 100000, 1000000][g];

// ================= MATEMÁTICAS =================
const MATE = [
  { id: "sumas", nombre: "Sumas", emoji: "➕", grados: [1, 2, 3, 4, 5, 6], pregunta: (r, g) => {
    const t = tope(g), a = ent(Math.floor(t / 10), Math.floor(t / 2), r), b = ent(1, Math.floor(t / 2) - 1, r);
    return num(`${miles(a)} + ${miles(b)} = ?`, a + b, `${miles(a)} + ${miles(b)} = ${miles(a + b)}. Sumá primero las unidades y llevá si pasa de 9.`);
  } },
  { id: "restas", nombre: "Restas", emoji: "➖", grados: [1, 2, 3, 4, 5, 6], pregunta: (r, g) => {
    const t = tope(g), a = ent(Math.floor(t / 4), t - 1, r), b = ent(1, a - 1, r);
    return num(`${miles(a)} − ${miles(b)} = ?`, a - b, `${miles(a)} − ${miles(b)} = ${miles(a - b)}. Para revisar: ${miles(a - b)} + ${miles(b)} = ${miles(a)}.`);
  } },
  { id: "multiplicacion", nombre: "Multiplicación", emoji: "✖️", grados: [2, 3, 4, 5, 6], pregunta: (r, g) => {
    const [a, b] = g <= 3 ? [ent(2, 10, r), ent(2, 10, r)] : g === 4 ? [ent(11, 99, r), ent(2, 9, r)] : [ent(12, 99, r), ent(11, 40, r)];
    return num(`${a} × ${b} = ?`, a * b, g <= 3 ? `${a} × ${b} = ${a * b}: son ${a} grupos de ${b}.` : `${a} × ${b} = ${miles(a * b)}.`);
  } },
  { id: "division", nombre: "División", emoji: "➗", grados: [3, 4, 5, 6], pregunta: (r, g) => {
    const b = ent(2, g <= 3 ? 10 : 9, r), c = g <= 3 ? ent(2, 10, r) : g === 4 ? ent(11, 99, r) : ent(100, 999, r), a = b * c;
    return num(`${miles(a)} ÷ ${b} = ?`, c, `${miles(a)} ÷ ${b} = ${miles(c)}, porque ${miles(c)} × ${b} = ${miles(a)}.`);
  } },
  { id: "problemas", nombre: "Problemas con plata", emoji: "🪙", grados: [1, 2, 3, 4, 5, 6], pregunta: (r, g, nombre) => {
    const n = quien(nombre, r);
    const cosas = [["un helado", 350], ["un pan", 200], ["una bolsa de mangos", 800], ["un cuaderno", 650], ["un lápiz", 150], ["un fresco", 400]];
    const [cosa, precioBase] = elegir(cosas, r), precio = precioBase * (g >= 4 ? ent(2, 5, r) : 1);
    const tipo = g <= 2 ? "vuelto" : elegir(["vuelto", "varios", "juntar"], r);
    if (tipo === "varios") { const k = ent(2, g >= 4 ? 9 : 5, r); return num(`${n} compra ${k} veces ${cosa} de ₡${miles(precio)}. ¿Cuánto paga en total?`, k * precio, `${k} × ₡${miles(precio)} = ₡${miles(k * precio)}.`); }
    if (tipo === "juntar") { const a = ent(2, 20, r) * 50, b = ent(2, 20, r) * 50; return num(`${n} tiene ₡${miles(a)} y su abuela le regala ₡${miles(b)}. ¿Cuánto tiene ahora?`, a + b, `₡${miles(a)} + ₡${miles(b)} = ₡${miles(a + b)}.`); }
    const billete = [1000, 2000, 5000, 10000].find(x => x > precio);
    return num(`${n} compra ${cosa} de ₡${miles(precio)} y paga con ₡${miles(billete)}. ¿Cuánto le dan de vuelto?`, billete - precio, `₡${miles(billete)} − ₡${miles(precio)} = ₡${miles(billete - precio)}.`);
  } },
  { id: "numeros", nombre: "Números y valor posicional", emoji: "🔢", grados: [1, 2, 3, 4], pregunta: (r, g) => {
    const t = tope(g), n = ent(Math.floor(t / 10) + 1, t - 1, r), tipo = elegir(["sucesor", "antecesor", "mayor", g >= 2 ? "decenas" : "sucesor"], r);
    if (tipo === "sucesor") return num(`¿Qué número va después del ${miles(n)}?`, n + 1, `Después del ${miles(n)} va el ${miles(n + 1)} (se le suma 1).`);
    if (tipo === "antecesor") return num(`¿Qué número va antes del ${miles(n)}?`, n - 1, `Antes del ${miles(n)} va el ${miles(n - 1)} (se le resta 1).`);
    if (tipo === "decenas") { const d = Math.floor(n / 10) % 10; return num(`¿Qué número está en el lugar de las decenas en ${miles(n)}?`, d, `En ${miles(n)}, las decenas son el ${d}: es la segunda cifra de derecha a izquierda.`); }
    const m = ent(Math.floor(t / 10) + 1, t - 1, r); if (m === n) return num(`¿Qué número va después del ${miles(n)}?`, n + 1, `Después del ${miles(n)} va el ${miles(n + 1)}.`);
    return opc(`¿Cuál número es mayor?`, Math.max(n, m), [Math.min(n, m)], `${miles(Math.max(n, m))} es mayor que ${miles(Math.min(n, m))}.`, r, 2);
  } },
  { id: "geometria", nombre: "Geometría", emoji: "📐", grados: [1, 2, 3, 4, 5, 6], pregunta: (r, g) => {
    const figuras = [["triángulo", 3], ["cuadrado", 4], ["rectángulo", 4], ["pentágono", 5], ["hexágono", 6], ["octágono", 8]];
    const tipo = g <= 2 ? "lados" : elegir(g >= 4 ? ["perimetro", "area", "angulo", "lados"] : ["perimetro", "lados", "figura"], r);
    if (tipo === "lados") { const [f, l] = elegir(figuras.slice(0, g <= 1 ? 3 : 6), r); return num(`¿Cuántos lados tiene un ${f}?`, l, `El ${f} tiene ${l} lados.`); }
    if (tipo === "figura") { const [f, l] = elegir(figuras.filter(x => x[0] !== "rectángulo"), r); return opc(`¿Qué figura tiene ${l} lados?`, f, figuras.filter(x => x[1] !== l).map(x => x[0]), `La figura con ${l} lados es el ${f}.`, r); }
    const a = ent(2, g >= 5 ? 25 : 12, r), b = ent(2, g >= 5 ? 25 : 12, r);
    if (tipo === "perimetro") return num(`Un rectángulo mide ${a} cm de largo y ${b} cm de ancho. ¿Cuál es su perímetro (en cm)?`, 2 * (a + b), `Perímetro = suma de todos los lados: ${a} + ${b} + ${a} + ${b} = ${2 * (a + b)} cm.`);
    if (tipo === "area") return num(`Un rectángulo mide ${a} cm de largo y ${b} cm de ancho. ¿Cuál es su área (en cm²)?`, a * b, `Área = largo × ancho: ${a} × ${b} = ${a * b} cm².`);
    const angulos = [["agudo", "mide menos de 90°", ent(10, 80, r)], ["recto", "mide exactamente 90°", 90], ["obtuso", "mide más de 90° y menos de 180°", ent(100, 170, r)]];
    const [nombre, def, grados] = elegir(angulos, r);
    return opc(`Un ángulo de ${grados}° es…`, nombre, angulos.map(x => x[0]), `Es ${nombre}: ${def}.`, r);
  } },
  { id: "fracciones", nombre: "Fracciones", emoji: "🍕", grados: [3, 4, 5, 6], pregunta: (r, g) => {
    const d = ent(2, 8, r), n = ent(1, d - 1, r);
    if (g >= 4 && r() < 0.5) { const k = ent(2, 9, r) * d; return num(`¿Cuánto es ${n}/${d} de ${k}?`, k / d * n, `${k} ÷ ${d} = ${k / d}, y ${k / d} × ${n} = ${k / d * n}.`); }
    if (g >= 5 && r() < 0.5) { const m = ent(1, d - 1, r); if (m !== n) return opc(`¿Cuál fracción es mayor?`, `${Math.max(n, m)}/${d}`, [`${Math.min(n, m)}/${d}`], `Si tienen el mismo denominador, es mayor la del numerador más grande: ${Math.max(n, m)}/${d}.`, r, 2); }
    const barra = "🟩".repeat(n) + "⬜".repeat(d - n);
    return opc(`¿Qué fracción está pintada de verde? ${barra}`, `${n}/${d}`, [`${d - n}/${d}`, `${n}/${d + 1}`, `${d}/${n}`, `${n + 1}/${d}`], `Hay ${n} partes verdes de ${d} en total: ${n}/${d}.`, r);
  } },
  { id: "hora", nombre: "La hora", emoji: "🕒", grados: [1, 2, 3], pregunta: (r) => {
    const h = ent(1, 12, r), media = r() < 0.5;
    const reloj = String.fromCodePoint((media ? 0x1F55C : 0x1F550) + h - 1);
    const bien = media ? `${h}:30` : `${h}:00`, otras = [`${h % 12 + 1}:00`, `${h}:${media ? "00" : "30"}`, `${(h + 10) % 12 + 1}:30`, `${h}:15`];
    return opc(`¿Qué hora marca el reloj? <span style="font-size:2.4rem">${reloj}</span>`, bien, otras, media ? `Son las ${h} y media (${h}:30): la aguja larga apunta al 6.` : `Son las ${h} en punto (${h}:00): la aguja larga apunta al 12.`, r);
  } },
  { id: "decimales", nombre: "Decimales", emoji: "🔟", grados: [5, 6], pregunta: (r) => {
    const a = ent(1, 99, r) / 10, b = ent(1, 99, r) / 10, s = Math.round((a + b) * 10) / 10;
    const f = x => x.toLocaleString("es-CR", { minimumFractionDigits: 1 });
    return opc(`${f(a)} + ${f(b)} = ?`, f(s), [f(s + 1), f(Math.round((s - 0.1) * 10) / 10), f(Math.round((s + 0.1) * 10) / 10), f(s * 10)], `Se suman poniendo la coma una debajo de la otra: ${f(a)} + ${f(b)} = ${f(s)}.`, r);
  } },
  { id: "porcentajes", nombre: "Porcentajes", emoji: "💯", grados: [6], pregunta: (r) => {
    const p = elegir([10, 20, 25, 50, 75], r), base = ent(2, 20, r) * 20;
    return num(`¿Cuánto es el ${p}% de ${miles(base)}?`, base * p / 100, `${p}% de ${miles(base)} = ${miles(base)} × ${p} ÷ 100 = ${miles(base * p / 100)}.`);
  } },
];

// ================= ESPAÑOL =================
const PALABRAS = {
  sustantivo: ["perro", "casa", "escuela", "mango", "maestra", "volcán", "río", "lápiz", "abuela", "pelota", "árbol", "mochila"],
  verbo: ["correr", "cantar", "come", "salta", "escribe", "jugar", "leer", "duerme", "nadar", "baila", "pinta", "camina"],
  adjetivo: ["grande", "bonito", "verde", "rápido", "alto", "feliz", "delicioso", "pequeña", "suave", "alegre", "frío", "lento"],
};
const QUE_ES = { sustantivo: "nombra personas, animales, cosas o lugares", verbo: "dice una acción (lo que se hace)", adjetivo: "dice cómo es algo (una cualidad)" };
const ANTONIMOS = [["grande", "pequeño"], ["alto", "bajo"], ["feliz", "triste"], ["rápido", "lento"], ["frío", "caliente"], ["día", "noche"], ["abrir", "cerrar"], ["subir", "bajar"], ["lleno", "vacío"], ["limpio", "sucio"]];
const SINONIMOS = [["bonito", "lindo"], ["contento", "feliz"], ["rápido", "veloz"], ["empezar", "comenzar"], ["carro", "auto"], ["hablar", "conversar"], ["mirar", "observar"], ["regalo", "obsequio"], ["enojado", "molesto"], ["casa", "hogar"]];
const SILABAS = [["sol", 1], ["pan", 1], ["mar", 1], ["casa", 2], ["mano", 2], ["perro", 2], ["mesa", 2], ["gato", 2], ["pelota", 3], ["zapato", 3], ["tortuga", 3], ["camisa", 3], ["mariposa", 4], ["bicicleta", 4], ["elefante", 4], ["pulpería", 4], ["hipopótamo", 5], ["refrigerador", 5]];

const ESPANOL = [
  { id: "ortografia-bv", nombre: "Ortografía: b y v", emoji: "🐄", grados: [2, 3, 4, 5, 6], pregunta: r => orto(ORTO.bv, r) },
  { id: "ortografia-scz", nombre: "Ortografía: s, c y z", emoji: "🦊", grados: [3, 4, 5, 6], pregunta: r => orto(ORTO.scz, r) },
  { id: "ortografia-h", nombre: "Ortografía: la h", emoji: "🥚", grados: [2, 3, 4, 5, 6], pregunta: r => orto(ORTO.h, r) },
  { id: "silabas", nombre: "Sílabas", emoji: "👏", grados: [1, 2, 3], pregunta: r => {
    const [w, n] = elegir(SILABAS, r);
    return num(`¿Cuántas sílabas tiene la palabra «${w}»? (Aplaudí cada sílaba)`, n, `«${w}» tiene ${n} ${n === 1 ? "sílaba" : "sílabas"}.`);
  } },
  { id: "clases", nombre: "Sustantivo, verbo o adjetivo", emoji: "🏷️", grados: [3, 4, 5, 6], pregunta: r => {
    const clase = elegir(Object.keys(PALABRAS), r), w = elegir(PALABRAS[clase], r);
    return opc(`La palabra «${w}» es un…`, clase, Object.keys(PALABRAS), `«${w}» es un ${clase}: ${QUE_ES[clase]}.`, r);
  } },
  { id: "antonimos", nombre: "Sinónimos y antónimos", emoji: "↔️", grados: [2, 3, 4, 5, 6], pregunta: r => {
    const ant = r() < 0.5, lista = ant ? ANTONIMOS : SINONIMOS, [a, b] = elegir(lista, r), [w, bien] = r() < 0.5 ? [a, b] : [b, a];
    const otras = lista.filter(x => !x.includes(w)).flat();
    return opc(ant ? `¿Cuál es el antónimo (lo contrario) de «${w}»?` : `¿Cuál es un sinónimo (significa lo mismo) de «${w}»?`, bien, otras, `${ant ? "Lo contrario" : "Un sinónimo"} de «${w}» es «${bien}».`, r);
  } },
  { id: "signos", nombre: "Punto, pregunta o exclamación", emoji: "❓", grados: [1, 2, 3, 4], pregunta: r => {
    const t = r() < 0.5 ? elegir(SIGNOS, r) : fraseSigno(elegir(["pregunta", "exclamacion", "punto"], r), r), s = signoDe(t);
    const nombres = { punto: "Punto final ( . )", pregunta: "Signos de pregunta ( ¿? )", exclamacion: "Signos de exclamación ( ¡! )" };
    return opc(`¿Qué signos le faltan? «${sinSignos(t)}»`, nombres[s], Object.values(nombres), `Se escribe: «${t}».`, r);
  } },
  { id: "mayusculas", nombre: "Mayúsculas", emoji: "🔠", grados: [1, 2, 3, 4], pregunta: r => {
    const bien = fraseMayus(r), ws = bien.split(" ");
    const mal1 = ws.map((w, i) => (i > 0 && /^[A-ZÁÉÍÓÚÑ]/.test(w) ? w.toLocaleLowerCase("es") : w)).join(" ");
    const mal2 = ws[0].toLocaleLowerCase("es") + " " + ws.slice(1).join(" ");
    const mal3 = ws.map(w => w[0].toLocaleUpperCase("es") + w.slice(1)).join(" ");
    return opc(`¿Cuál oración está bien escrita?`, bien, [mal1, mal2, mal3], `«${bien}»: la primera palabra y los nombres de personas, mascotas y lugares van con mayúscula.`, r);
  } },
];
function orto(lista, r) {
  const p = elegir(lista, r), antes = p.w.slice(0, p.i), despues = p.w.slice(p.i + p.l.length);
  const ops = p.grupo === "bv" ? ["b", "v"] : p.grupo === "scz" ? ["s", "c", "z"] : ["con h", "sin h"];
  return opc(`${p.e} ¿Qué va en el espacio? <b style="font-size:1.6rem">${antes}__${despues}</b>`, p.grupo === "h" ? (p.l ? "con h" : "sin h") : p.l, ops,
    `Se escribe «${p.w}». ${regla(p).replace(/<[^>]+>/g, "")}`, r, ops.length);
}

// ================= CIENCIAS =================
const SENTIDOS = [["ver", "los ojos", "la vista"], ["oír", "los oídos", "el oído"], ["oler", "la nariz", "el olfato"], ["saborear", "la lengua", "el gusto"], ["sentir si algo está frío o caliente", "la piel", "el tacto"]];
const ORGANOS = [["bombea la sangre por todo el cuerpo", "el corazón"], ["nos permiten respirar", "los pulmones"], ["digiere la comida", "el estómago"], ["piensa y controla todo el cuerpo", "el cerebro"], ["sostienen el cuerpo y le dan forma", "los huesos"], ["nos permiten movernos", "los músculos"]];
const CUBRE = { pelo: "pelo", plumas: "plumas", escamas: "escamas", caparazon: "caparazón", piel: "piel lisa y húmeda" };

const CIENCIAS = [
  { id: "estados", nombre: "Estados de la materia", emoji: "🧊", grados: [1, 2, 3, 4], pregunta: r => {
    const c = elegir(COSAS, r);
    return opc(`${c.e} ${c.n[0].toUpperCase() + c.n.slice(1)} está en estado…`, ESTADOS[c.s].nombre, Object.values(ESTADOS).map(x => x.nombre), ESTADOS[c.s].explica.replace(/<[^>]+>/g, ""), r);
  } },
  { id: "cambios", nombre: "Cambios de estado", emoji: "🫠", grados: [2, 3, 4, 5, 6], pregunta: r => {
    const s = elegir(SITUACIONES, r), c = CAMBIOS[s.c];
    return opc(`${s.e} ${s.t} ¿Qué le pasó?`, c.nombre, Object.values(CAMBIOS).map(x => x.nombre), `${c.nombre[0].toUpperCase() + c.nombre.slice(1)}: pasa de ${c.de}.`, r, 4);
  } },
  { id: "planta", nombre: "Partes de la planta", emoji: "🌱", grados: [1, 2, 3], pregunta: r => {
    if (r() < 0.5) { const p = elegir(PLANTA, r); return opc(`¿Qué parte de la planta hace esto? «${p.sirve.replace(/ ¡.*$/, "")}»`, p.nombre, PLANTA.map(x => x.nombre), `${p.el[0].toUpperCase() + p.el.slice(1)}: ${p.sirve}`, r); }
    const c = elegir(COMIDAS, r), p = PLANTA.find(x => x.id === c.parte);
    return opc(`${c.e} ¿Qué parte de la planta es ${c.n}?`, p.nombre, PLANTA.map(x => x.nombre), c.dato, r);
  } },
  { id: "cuerpo", nombre: "El cuerpo humano", emoji: "🫀", grados: [1, 2, 3, 4, 5, 6], pregunta: r => {
    if (r() < 0.5) { const [acc, org, sentido] = elegir(SENTIDOS, r); return opc(`¿Con qué parte del cuerpo podemos ${acc}?`, org, SENTIDOS.map(x => x[1]), `Con ${org}: es el sentido de${sentido.startsWith("el ") ? "l " + sentido.slice(3) : " " + sentido}.`, r); }
    const [hace, org] = elegir(ORGANOS, r);
    return opc(`¿Qué órgano ${hace}?`, org, ORGANOS.map(x => x[1]), `${org[0].toUpperCase() + org.slice(1)} ${hace}.`, r);
  } },
  { id: "animales", nombre: "Los animales", emoji: "🐸", grados: [1, 2, 3, 4], pregunta: r => {
    const ids = Object.keys(ANIMALES).filter(id => CUBRE[ANIMALES[id].cubierta]), a = ANIMALES[elegir(ids, r)];
    return opc(`${a.e} ¿Qué cubre el cuerpo ${a.art === "el" ? "del" : "de la"} ${a.n}?`, CUBRE[a.cubierta], Object.values(CUBRE), `${a.art[0].toUpperCase() + a.art.slice(1)} ${a.n} tiene ${CUBRE[a.cubierta]}.`, r);
  } },
  { id: "ecosistemas", nombre: "Ecosistemas de Costa Rica", emoji: "🌳", grados: [3, 4, 5, 6], pregunta: r => {
    const lugar = r() < 0.4, x = elegir(lugar ? LUGARES : SERES, r), malos = Object.keys(ECOS).filter(k => k !== x.eco && !(x.tambien || []).includes(k));
    return opc(lugar ? `¿Qué ecosistema hay en ${x.n}?` : `${x.e} ¿En qué ecosistema vive ${x.n.toLowerCase()}?`, ECOS[x.eco].n, malos.map(k => ECOS[k].n),
      `${ECOS[x.eco].n}: ${ECOS[x.eco].como}.`, r);
  } },
];

// ================= ESTUDIOS SOCIALES =================
const LIMITES = [["¿Con qué país limita Costa Rica al norte?", "Nicaragua", ["Panamá", "Honduras", "Colombia"]], ["¿Con qué país limita Costa Rica al sur?", "Panamá", ["Nicaragua", "Guatemala", "Venezuela"]],
  ["¿Qué mar baña la costa este de Costa Rica?", "el mar Caribe", ["el océano Pacífico", "el mar Mediterráneo"]], ["¿Qué océano está al oeste de Costa Rica?", "el océano Pacífico", ["el mar Caribe", "el océano Atlántico"]],
  ["¿Por dónde sale el sol?", "por el este", ["por el oeste", "por el norte", "por el sur"]], ["¿Por dónde se oculta el sol?", "por el oeste", ["por el este", "por el norte", "por el sur"]],
  ["¿Cuántas provincias tiene Costa Rica?", "7", ["5", "9", "10"]], ["¿Cuál es la capital de Costa Rica?", "San José", ["Cartago", "Alajuela", "Limón"]]];

const SOCIALES = [
  { id: "provincias", nombre: "Provincias y cabeceras", emoji: "🗺️", grados: [2, 3, 4], pregunta: r => {
    const [p, c] = elegir(CABECERAS, r);
    return opc(`¿Cuál es la cabecera de la provincia de ${p}?`, c, CABECERAS.map(x => x[1]), `La cabecera de ${p} es ${c}.`, r);
  } },
  { id: "limites", nombre: "Límites y puntos cardinales", emoji: "🧭", grados: [1, 2, 3, 4, 5, 6], pregunta: r => {
    const [t, bien, malos] = elegir(LIMITES, r);
    return opc(t, bien, malos, `La respuesta es: ${bien}.`, r);
  } },
  { id: "simbolos", nombre: "Símbolos patrios", emoji: "🌸", grados: [1, 2, 3, 4], pregunta: r => {
    const s = elegir(SIMBOLOS, r);
    return opc(`¿De qué símbolo se trata? «${s.pista}»`, s.nombre, SIMBOLOS.map(x => x.nombre), `${tituloSimbolo(s)}. ${s.dato}`, r);
  } },
  { id: "escudo", nombre: "El escudo nacional", emoji: "🛡️", grados: [2, 3, 4, 5, 6], pregunta: r => {
    const p = elegir(ESCUDO, r);
    return opc(`En el escudo nacional, ¿qué ${/^(La|El) /.test(p.nombre) ? "significa" : "significan"} ${p.nombre.toLowerCase()}?`, p.significa, ESCUDO.map(x => x.significa), `${p.nombre}: ${p.significa}`, r);
  } },
  { id: "efemerides", nombre: "Efemérides", emoji: "📅", grados: [2, 3, 4, 5, 6], pregunta: r => {
    const f = elegir(FECHAS, r);
    return r() < 0.5
      ? opc(`¿Qué se celebra el ${f.f}?`, f.n, FECHAS.map(x => x.n), `${f.f}: ${f.n}. ${f.porque}`, r)
      : opc(`¿Qué día se celebra: ${f.n}?`, f.f, FECHAS.map(x => x.f), `${f.n}: ${f.f}. ${f.porque}`, r);
  } },
];

// ================= INGLÉS =================
const NUMEROS_EN = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const DECENAS_EN = { 30: "thirty", 40: "forty", 50: "fifty", 60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety", 100: "one hundred" };
function vocab(temaId) {
  const t = VOCAB.find(x => x.id === temaId);
  return r => {
    const [e, en, es] = elegir(t.palabras, r), otras = t.palabras.filter(p => p[1] !== en);
    return r() < 0.5
      ? { ...opc(`${e} ¿Cómo se dice «${es}» en inglés?`, en, otras.map(p => p[1]), `«${es}» en inglés es «${en}».`, r), en: true }
      : opc(`${e} ¿Qué significa «${en}»?`, es, otras.map(p => p[2]), `«${en}» significa «${es}».`, r);
  };
}
const INGLES = [
  ...VOCAB.map(t => ({ id: `vocab-${t.id}`, nombre: t.nombre.replace(/^\S+ /, ""), emoji: t.nombre.split(" ")[0], grados: [1, 2, 3, 4, 5, 6], pregunta: vocab(t.id) })),
  { id: "numbers", nombre: "Numbers", emoji: "🔢", grados: [1, 2, 3, 4, 5, 6], pregunta: (r, g) => {
    const lista = g <= 2 ? NUMEROS_EN.slice(1, 13).map((w, i) => [i + 1, w]) : [...NUMEROS_EN.slice(1).map((w, i) => [i + 1, w]), ...Object.entries(DECENAS_EN).map(([n, w]) => [Number(n), w])];
    const [n, w] = elegir(lista, r);
    return { ...opc(`¿Cómo se escribe el número ${n} en inglés?`, w, lista.map(x => x[1]), `${n} en inglés es «${w}».`, r), en: true };
  } },
  { id: "frases", nombre: "Frases (traducir)", emoji: "💬", grados: [3, 4, 5, 6], pregunta: r => {
    const [f, ...otras] = frases(4, r, { tiempo: 0.2 });
    return opc(`¿Qué significa: «${f.en}»?`, f.es, otras.map(o => o.es), `«${f.en}» significa «${f.es}».`, r);
  } },
];

export const MATERIAS_EXAMEN = [
  { id: "mate", nombre: "Matemáticas", emoji: "🔢", color: "#2F7FD1", temas: MATE },
  { id: "espanol", nombre: "Español", emoji: "✏️", color: "#E8574A", temas: ESPANOL },
  { id: "ciencias", nombre: "Ciencias", emoji: "🌱", color: "#2FA85A", temas: CIENCIAS },
  { id: "sociales", nombre: "Estudios Sociales", emoji: "🗺️", color: "#F29A1F", temas: SOCIALES },
  { id: "ingles", nombre: "Inglés", emoji: "💬", color: "#8E5BD9", temas: INGLES },
];

/** Temas de una materia para un grado. */
export const temasPara = (materia, grado) => MATERIAS_EXAMEN.find(m => m.id === materia).temas.filter(t => t.grados.includes(grado));

/**
 * Arma el examen: `porTema` preguntas de cada tema, sin repetir preguntas dentro del mismo tema.
 * Devuelve [{ tema, preguntas: [...] }].
 */
export function armarExamen({ materia, grado, temas, porTema = 5, nombre = "" }, r = Math.random) {
  const m = MATERIAS_EXAMEN.find(x => x.id === materia);
  return temas.map(id => {
    const tema = m.temas.find(t => t.id === id), vistas = new Set(), preguntas = [];
    for (let k = 0; preguntas.length < porTema && k < porTema * 30; k++) {
      const q = tema.pregunta(r, grado, nombre);
      if (vistas.has(q.texto)) continue;
      vistas.add(q.texto); preguntas.push({ ...q, tema: id });
    }
    return { tema, preguntas };
  });
}

/** ¿Está bien la respuesta? En las de número se aceptan puntos o espacios de miles («1.250» = «1250»). */
export function revisar(q, respuesta) {
  if (respuesta === undefined || respuesta === null || String(respuesta).trim() === "") return false;
  if (q.tipo === "numero") return String(respuesta).replace(/[\s.,]/g, "") === q.correcta.replace(/[\s.,]/g, "");
  return respuesta === q.correcta;
}

/** Nota de 0 a 100, como en la escuela. */
export const nota = (bien, total) => Math.round((bien / total) * 100);
