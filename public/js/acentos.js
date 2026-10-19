// ✍️ Lógica de «¿Dónde suena más fuerte?» (sin pantalla, para poder probarla sola con node).
// Sílabas, sílaba tónica, agudas, graves, esdrújulas y sobresdrújulas, la tilde y el hiato.
//
// Las palabras están curadas a mano: guiones entre sílabas y un apóstrofo antes de la sílaba que suena más fuerte
// («ca-'ba-llo», «'ár-bol»). `revisarPalabras()` las compara con un separador de sílabas automático y con las
// reglas de la tilde, para que un error en la lista no se le enseñe a nadie.

const LISTA = `
'ma-no 'ca-sa 'lu-na 'ga-to 'me-sa 'pa-to 'lo-ro 'so-pa 'pi-ña 'ro-sa 'de-do 'mo-no 'sa-po 'to-ro 'ca-ma 'pe-lo 'bo-ca
ca-'fé so-'fá ma-'má pa-'pá be-'bé ma-'ní
pe-re-'zo-so to-'ma-te pa-'pa-ya ma-ri-'po-sa pe-'lo-ta ca-'mi-sa co-'ne-jo ba-'na-no pa-'lo-ma ma-'le-ta Ca-'ri-be
'pá-ja-ro 'mú-si-ca 'sá-ba-do 'nú-me-ro 'mé-di-co te-'lé-fo-no pe-'lí-cu-la 'pá-gi-na 'sí-la-ba 'jí-ca-ra co-li-'brí
ca-'ba-llo ga-'lli-na 'ca-lle es-'tre-lla 'llu-via 'pe-rro 'ca-rro a-'rroz yi-'güi-rro gui-'ta-rra pin-'güi-no ci-'güe-ña
cho-co-'la-te mu-'cha-cho 'le-che 'no-che 'que-so pe-'que-ño 'má-qui-na cas-'ca-da gua-na-'cas-te tor-'tu-ga tor-'ti-lla
ven-'ta-na 'cam-po 'pla-ya 'glo-bo a-'bra-zo co-co-'dri-lo chan-'cle-ta 'li-bros pa-'ra-guas
es-'cue-la 'a-gua 'hue-vo 'nie-ve 'rei-na 'au-to 'jau-la 'pei-ne 'rui-do 'sue-lo ciu-'dad ver-'dad
can-'ción can-'cio-nes ra-'tón ra-'to-nes ca-'mión ca-'mio-nes a-'vión ja-'bón co-ra-'zón sa-'lón bo-'tón lec-'ción
a-'quí a-'sí tam-'bién sar-'tén al-go-'dón com-'pás
re-'loj pa-'pel se-'ñor co-'lor fe-'liz ju-'gar co-'mer vi-'vir es-pa-'ñol na-'riz a-'zul ca-fe-'tal ma-'mey es-'toy
'ár-bol 'ár-bo-les 'lá-piz a-'zú-car 'fá-cil 'dé-bil 'cés-ped 'ál-bum 'cár-cel ca-'dá-ver 'ú-til 'mó-vil 'án-gel 'tó-rax
'fút-bol 'béis-bol ca-'rác-ter 'dó-lar
'jo-ven 'jó-ve-nes e-'xa-men e-'xá-me-nes 'or-den 'ór-de-nes
mur-'cié-la-go 'plá-ta-no 'brú-ju-la 'lám-pa-ra ma-te-'má-ti-cas 'miér-co-les es-'drú-ju-la 'lá-gri-ma
Ma-'rí-a 'dí-a pa-'ís 'rí-o 'tí-o ma-'íz ba-'úl o-'í-do 'frí-o 'bú-ho Ra-'úl ca-'í-da re-'ír 'grú-a pul-pe-'rí-a pa-na-de-'rí-a
Li-'món Car-'ta-go He-'re-dia A-la-'jue-la Pun-ta-'re-nas Gua-na-'cas-te Tor-tu-'gue-ro A-re-'nal Mon-te-'ver-de
Sa-ra-pi-'quí Pa-'cí-fi-co A-'mé-ri-ca 'Á-fri-ca 'Mé-xi-co Pa-na-'má Ja-'pón Gon-'zá-lez 'Pé-rez 'Ló-pez Ro-'drí-guez
'Cé-sar Pa-ra-'guay
'dí-ga-me-lo 'trái-ga-me-lo 'cóm-pre-me-lo ex-'plí-que-me-lo de-'vuél-va-me-lo en-'tré-gue-me-lo 'dí-ga-se-lo
'cuén-te-me-lo re-'gá-le-me-lo
`;

// ---------- Separar en sílabas (para revisar la lista) ----------
const VOCALES = "aeiouáéíóúü";
const ABIERTAS = "aeoáéó";
const CON_TILDE = "áéíóú";
const SIN_TILDE = { á: "a", é: "e", í: "i", ó: "o", ú: "u", Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U" };
export const quitarTildes = t => t.replace(/[áéíóúÁÉÍÓÚ]/g, c => SIN_TILDE[c]);

/** Letras agrupadas en sonidos: ch, ll, rr, qu y gu (antes de e, i) son una sola consonante; la y final suena como vocal. */
function unidades(palabra) {
  const w = palabra.toLowerCase(), out = [];
  for (let i = 0; i < w.length; i++) {
    const c = w[i], d = w.slice(i, i + 2), sig = w[i + 2];
    if (d === "ch" || d === "ll" || d === "rr") { out.push({ t: d, v: false }); i++; continue; }
    if ((d === "qu" || d === "gu") && sig && "eéií".includes(sig)) { out.push({ t: d, v: false }); i++; continue; }
    if (c === "y") { out.push({ t: c, v: !(w[i + 1] && VOCALES.includes(w[i + 1])) }); continue; }
    out.push({ t: c, v: VOCALES.includes(c) });
  }
  return out;
}
const abierta = u => ABIERTAS.includes(u.t);
const cerradaConTilde = u => u.t === "í" || u.t === "ú";
// ¿Dos vocales seguidas van en sílabas distintas? (dos abiertas, o una cerrada con tilde junto a una abierta)
const hiato = (a, b) => (abierta(a) && abierta(b)) || (cerradaConTilde(a) && abierta(b)) || (abierta(a) && cerradaConTilde(b));
// Grupos de consonantes que no se separan: pr, bl, tr, gl…
const inseparable = (a, b) => "pbfcgtdk".includes(a) && "lr".includes(b) && a + b !== "dl";

/** Separa una palabra en sílabas con las reglas de siempre (sirve para revisar la lista curada). */
export function silabear(palabra) {
  const u = unidades(palabra);
  // Núcleos: grupos de vocales seguidas, partidos donde hay hiato
  const nucleos = [];
  for (let i = 0; i < u.length; i++) {
    if (!u[i].v) continue;
    if (nucleos.length && nucleos[nucleos.length - 1].fin === i - 1 && !hiato(u[i - 1], u[i])) nucleos[nucleos.length - 1].fin = i;
    else nucleos.push({ ini: i, fin: i });
  }
  if (!nucleos.length) return [palabra];
  // Dónde empieza cada sílaba (en unidades)
  const inicios = [0];
  for (let k = 1; k < nucleos.length; k++) {
    const a = nucleos[k - 1].fin + 1, b = nucleos[k].ini; // consonantes entre a y b-1
    const n = b - a;
    let corte;
    if (n <= 1) corte = a;
    else if (n === 2) corte = inseparable(u[a].t, u[a + 1].t) ? a : a + 1;
    else if (n === 3) corte = inseparable(u[a + 1].t, u[a + 2].t) ? a + 1 : a + 2;
    else corte = a + 2;
    inicios.push(corte);
  }
  // Pasar de unidades a letras de la palabra original (con sus mayúsculas)
  const largo = u.map(x => x.t.length), pos = [0];
  largo.forEach(l => pos.push(pos[pos.length - 1] + l));
  return inicios.map((ini, k) => palabra.slice(pos[ini], pos[k + 1 < inicios.length ? inicios[k + 1] : u.length]));
}

/** La sílaba que suena más fuerte según cómo está escrita: la de la tilde o, si no hay, la regla de n, s o vocal. */
export function tonicaPorEscritura(silabas) {
  const i = silabas.findIndex(s => [...s.toLowerCase()].some(c => CON_TILDE.includes(c)));
  if (i >= 0) return i;
  if (silabas.length === 1) return 0;
  const ultima = silabas[silabas.length - 1].toLowerCase().slice(-1);
  return "aeiouns".includes(ultima) ? silabas.length - 2 : silabas.length - 1;
}

// ---------- Las palabras ----------
export const TIPOS = [
  { id: "aguda", nombre: "Aguda", donde: "la última" },
  { id: "grave", nombre: "Grave", donde: "la penúltima" },
  { id: "esdrujula", nombre: "Esdrújula", donde: "la antepenúltima" },
  { id: "sobresdrujula", nombre: "Sobresdrújula", donde: "antes de la antepenúltima" },
];
// Para las cajitas: cómo se llama cada sílaba contando desde el final
export const POSICIONES = ["última", "penúltima", "antepenúltima", "trasantepenúltima"];

function leer(entrada) {
  const crudas = entrada.split("-");
  const tonica = crudas.findIndex(s => s.startsWith("'"));
  const silabas = crudas.map(s => s.replace(/'/g, ""));
  const palabra = silabas.join("");
  const desdeFinal = silabas.length - 1 - tonica;
  const u = unidades(palabra);
  const letras = [...palabra];
  const vocalTilde = letras.findIndex(c => CON_TILDE.includes(c.toLowerCase()));
  // Hiato con tilde: una í o ú que suena fuerte pegada a una a, e, o (la h del medio no cuenta: bú-ho)
  const sinH = u.filter(x => x.t !== "h");
  const conHiato = sinH.some((x, i) => cerradaConTilde(x) && ((sinH[i - 1]?.v && abierta(sinH[i - 1])) || (sinH[i + 1]?.v && abierta(sinH[i + 1]))));
  const diptongo = silabas.some(s => unidades(s).filter(x => x.v).length >= 2);
  // «Simple»: todas las sílabas son consonante + vocal (o solo vocal), sin ll, rr, ch, qu, gu ni consonante al final
  const simple = silabas.every(s => { const us = unidades(s); return us.length <= 2 && us[us.length - 1].v && us.filter(x => x.v).length === 1 && us.every(x => x.t.length === 1); });
  return {
    palabra, silabas, tonica, n: silabas.length,
    tipo: TIPOS[Math.min(desdeFinal, 3)].id,
    tilde: vocalTilde >= 0, vocalTilde, hiato: conHiato, diptongo, simple,
    propio: palabra[0] !== palabra[0].toLowerCase(),
    sinTilde: quitarTildes(palabra),
  };
}

export const PALABRAS = LISTA.trim().split(/\s+/).map(leer);

/** Revisa la lista: separación, sílaba fuerte y tilde. Devuelve los problemas (vacío = bien). */
export function revisarPalabras(lista = PALABRAS) {
  const mal = [];
  const vistas = new Set();
  for (const p of lista) {
    if (vistas.has(p.palabra)) mal.push(`${p.palabra}: repetida`);
    vistas.add(p.palabra);
    if (p.tonica < 0) { mal.push(`${p.palabra}: sin sílaba fuerte`); continue; }
    const auto = silabear(p.palabra);
    if (auto.join("-") !== p.silabas.join("-")) mal.push(`${p.palabra}: separé ${p.silabas.join("-")} pero la regla da ${auto.join("-")}`);
    const t = tonicaPorEscritura(p.silabas);
    if (t !== p.tonica) mal.push(`${p.palabra}: la fuerte es ${p.silabas[p.tonica]} pero como está escrita sonaría ${p.silabas[t]}`);
    if (p.tilde && !p.silabas[p.tonica].toLowerCase().split("").some(c => CON_TILDE.includes(c))) mal.push(`${p.palabra}: la tilde no está en la sílaba fuerte`);
    if ((p.palabra.match(/[áéíóú]/gi) || []).length > 1) mal.push(`${p.palabra}: más de una tilde`);
    // Sin la tilde, ¿se leería distinto? Tiene que pasar justo cuando la palabra lleva tilde (salvo el hiato, que cambia las sílabas)
    if (!p.hiato) {
      const sin = silabear(p.sinTilde);
      const cambia = sin.length !== p.n || tonicaPorEscritura(sin) !== p.tonica;
      if (cambia !== p.tilde) mal.push(`${p.palabra}: ${p.tilde ? "la tilde no hace falta según las reglas" : "le faltaría la tilde según las reglas"}`);
    }
    if (llevaTilde(p) !== p.tilde) mal.push(`${p.palabra}: la regla dice ${llevaTilde(p) ? "con" : "sin"} tilde`);
  }
  return mal;
}

/** Las reglas de la tilde, como se enseñan en la escuela. */
export function llevaTilde(p) {
  if (p.hiato) return true;
  if (p.n === 1) return false;
  const fin = p.sinTilde.slice(-1).toLowerCase();
  const nsv = "aeiouns".includes(fin);
  if (p.tipo === "aguda") return nsv;
  if (p.tipo === "grave") return !nsv;
  return true;
}

// ---------- Explicaciones ----------
const Q = t => t.charAt(0).toUpperCase() + t.slice(1);
/** «ca-BA-llo»: la sílaba fuerte en mayúsculas. */
export const marcada = p => p.silabas.map((s, i) => (i === p.tonica ? s.toUpperCase() : s)).join("-");
/** Lo que dice la voz para que se oiga la sílaba fuerte por separado: «ca, ¡BA!, llo». */
export const separada = p => p.silabas.map((s, i) => (i === p.tonica ? `¡${s.toLowerCase()}!` : s.toLowerCase())).join(", ");
const tipoDe = p => TIPOS.find(t => t.id === p.tipo);
const finalDe = p => {
  const c = p.sinTilde.slice(-1).toLowerCase();
  if (c === "y") return "en y (que al final suena como i pero cuenta como consonante)";
  return "aeiou".includes(c) ? `en vocal (${c})` : `en ${c}`;
};

/** Por qué lleva tilde o no (para después de contestar). Con `hiatos`, también explica los diptongos. */
export function porQueTilde(p, { hiatos = false } = {}) {
  const nom = Q(p.palabra), t = tipoDe(p);
  if (p.hiato) {
    const v = p.sinTilde[p.vocalTilde].toLowerCase();
    return `En «${p.palabra}» la ${v} suena fuerte pegada a otra vocal, y por eso se separan: ${marcada(p)}. Cuando eso pasa, la ${v} lleva tilde siempre (es un hiato).`;
  }
  if (hiatos && p.diptongo) {
    const s = p.silabas.find(x => unidades(x).filter(y => y.v).length >= 2);
    return `En «${p.palabra}» las vocales de «${s.toLowerCase()}» suenan juntas, en la misma sílaba (${p.silabas.join("-")}): no es hiato. ${porQueTilde(p)}`;
  }
  if (p.tipo === "esdrujula" || p.tipo === "sobresdrujula") return `${nom} es ${t.nombre.toLowerCase()} (${marcada(p)}): las ${t.nombre.toLowerCase()}s llevan tilde siempre.`;
  const nsv = "aeiouns".includes(p.sinTilde.slice(-1).toLowerCase());
  if (p.tipo === "aguda") return nsv
    ? `${nom} es aguda (${marcada(p)}) y termina ${finalDe(p)}: las agudas que terminan en n, s o vocal llevan tilde.`
    : `${nom} es aguda (${marcada(p)}) pero termina ${finalDe(p)}, no en n, s ni vocal: no lleva tilde.`;
  return nsv
    ? `${nom} es grave (${marcada(p)}) y termina ${finalDe(p)}: las graves que terminan en n, s o vocal NO llevan tilde.`
    : `${nom} es grave (${marcada(p)}) y termina ${finalDe(p)}, que no es n, s ni vocal: lleva tilde.`;
}
/** Por qué es aguda, grave… */
export const porQueTipo = p => `En ${marcada(p)} suena más fuerte ${p.silabas[p.tonica].toLowerCase()}, que es ${tipoDe(p).donde}: ${p.palabra} es ${tipoDe(p).nombre.toLowerCase()}.`;
/** Cómo se separa y qué hay que fijarse. */
export function porQueSilabas(p) {
  const notas = [];
  const w = p.palabra.toLowerCase();
  if (/ll|rr|ch/.test(w)) notas.push("la ll, la rr y la ch no se separan");
  if (/qu|gu[eéií]/.test(w)) notas.push("la u de que, qui, gue y gui va con su sílaba");
  if (p.silabas.some(s => /^(pr|br|fr|tr|dr|cr|gr|pl|bl|fl|cl|gl)/i.test(s))) notas.push("pr, tr, bl, cl… van juntas");
  if (p.diptongo) notas.push("dos vocales que suenan juntas, como ue o ia, van en la misma sílaba");
  return `Se separa así: ${p.silabas.join("-")}${notas.length ? `. Fijate: ${notas.join("; ")}` : ""}.`;
}

// ---------- 🪜 Escalones ----------
// tipo: "cortar" (tocar entre letras), "tonica" (tocar la sílaba fuerte), "clasificar" (aguda, grave…),
//       "tilde" (¿le falta la tilde? tocar la vocal o «No lleva»)
const sinRaros = p => p.tipo !== "sobresdrujula" && !p.hiato;
export const ESCALONES = [
  // 1. Separar palabras cortas de consonante y vocal: ma-no, ca-fé
  { tipo: "cortar", nombre: "Separar en sílabas: palabras cortas", filtro: p => p.simple && p.n === 2 },
  // 2. Palabras más largas, todavía sencillas: pe-re-zo-so, te-lé-fo-no
  { tipo: "cortar", nombre: "Separar en sílabas: palabras largas", filtro: p => p.simple && p.n >= 3 },
  // 3. Con ll, rr, ch, qu, pr, tr…, consonante al final y diptongos: ca-ba-llo, cas-ca-da, es-cue-la
  { tipo: "cortar", nombre: "Separar: ll, rr, tr, diptongos…", filtro: p => !p.simple && sinRaros(p) && p.n <= 4 },
  // 4. ¿Qué sílaba suena más fuerte? con palabras de 2 sílabas
  { tipo: "tonica", nombre: "La sílaba que suena más fuerte", filtro: p => p.n === 2 && sinRaros(p) },
  // 5. Lo mismo con 3 y 4 sílabas
  { tipo: "tonica", nombre: "La sílaba fuerte en palabras largas", filtro: p => p.n >= 3 && p.n <= 4 && sinRaros(p) },
  // 6. Aguda o grave, con la sílaba fuerte marcada y el nombre de cada sílaba
  { tipo: "clasificar", nombre: "¿Aguda o grave?", ops: 2, marcada: true, filtro: p => (p.tipo === "aguda" || p.tipo === "grave") && sinRaros(p) },
  // 7. Aguda, grave o esdrújula, con la sílaba fuerte marcada
  { tipo: "clasificar", nombre: "¿Aguda, grave o esdrújula?", ops: 3, marcada: true, filtro: sinRaros, pesos: true },
  // 8. Lo mismo, pero hay que encontrar la sílaba fuerte escuchando
  { tipo: "clasificar", nombre: "Escuchá y clasificá", ops: 3, marcada: false, filtro: sinRaros, pesos: true },
  // 9. ¿Le falta la tilde? Solo agudas (canción sí, reloj no)
  { tipo: "tilde", nombre: "La tilde en las agudas", filtro: p => p.tipo === "aguda" && sinRaros(p) && p.n > 1 },
  // 10. Solo graves (árbol sí, examen no)
  { tipo: "tilde", nombre: "La tilde en las graves", filtro: p => p.tipo === "grave" && sinRaros(p) },
  // 11. Esdrújulas (siempre) revueltas con las otras
  { tipo: "tilde", nombre: "Las esdrújulas, siempre con tilde", filtro: sinRaros, pesos: true },
  // 12. Todas revueltas, con nombres de lugares y apellidos
  { tipo: "tilde", nombre: "La tilde: todas revueltas", filtro: sinRaros },
  // 13. Hiato (Ma-rí-a, pa-ís) contra diptongo (ciu-dad, a-gua)
  { tipo: "tilde", nombre: "Hiato: María, país, río", filtro: p => p.hiato || (p.diptongo && !p.tilde && p.tipo !== "sobresdrujula"), hiatos: true },
  // 14. Sobresdrújulas (dígamelo) entre las demás
  { tipo: "clasificar", nombre: "¿Y las sobresdrújulas?", ops: 4, marcada: false, filtro: p => !p.hiato, pesos: true },
];

const azarDe = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

/** Escoge una palabra para el escalón, balanceando: mitad con tilde y mitad sin, y los tipos parejos. */
export function escogerPalabra(escalon, rnd = Math.random, evitar = "") {
  let lista = PALABRAS.filter(escalon.filtro).filter(p => p.palabra !== evitar);
  if (escalon.tipo === "tilde") {
    const grupo = escalon.hiatos ? (rnd() < 0.6 ? lista.filter(p => p.hiato) : lista.filter(p => !p.hiato))
      : (rnd() < 0.5 ? lista.filter(p => p.tilde) : lista.filter(p => !p.tilde));
    if (grupo.length) lista = grupo;
  }
  if (escalon.pesos) {
    // Que salgan parejos los tipos que caben en el escalón (si no, casi todo serían graves)
    const tipos = [...new Set(lista.map(p => p.tipo))];
    const t = azarDe(tipos.filter(x => x !== "sobresdrujula" || escalon.ops === 4), rnd);
    lista = lista.filter(p => p.tipo === t);
  }
  return azarDe(lista, rnd);
}

/**
 * Una ronda: { tipo, p (la palabra), cortes (cortar), opciones (clasificar), respuesta }.
 *   cortar: respuesta = posiciones (en letras) donde se corta · tonica: índice de sílaba
 *   clasificar: id del tipo · tilde: índice de la letra con tilde, o -1 si no lleva
 */
export function ronda(escalon, rnd = Math.random, evitar = "") {
  const p = escogerPalabra(escalon, rnd, evitar);
  if (escalon.tipo === "cortar") {
    const cortes = [];
    let k = 0;
    p.silabas.slice(0, -1).forEach(s => { k += s.length; cortes.push(k); });
    return { tipo: "cortar", p, respuesta: cortes };
  }
  if (escalon.tipo === "tonica") return { tipo: "tonica", p, respuesta: p.tonica };
  if (escalon.tipo === "clasificar") return { tipo: "clasificar", p, marcada: escalon.marcada, opciones: TIPOS.slice(0, escalon.ops).map(t => t.id), respuesta: p.tipo };
  return { tipo: "tilde", p, respuesta: p.vocalTilde };
}

/** Revisa una ronda generada (para las pruebas). */
export function revisarRonda(r) {
  const mal = [];
  if (!r.p) return ["sin palabra"];
  if (r.tipo === "cortar" && r.respuesta.length !== r.p.n - 1) mal.push("cortes");
  if (r.tipo === "clasificar" && !r.opciones.includes(r.respuesta)) mal.push("la respuesta no está entre las opciones");
  if (r.tipo === "tilde") {
    if (r.p.tilde !== (r.respuesta >= 0)) mal.push("tilde");
    if (r.respuesta >= 0 && !"aeiou".includes(r.p.sinTilde[r.respuesta].toLowerCase())) mal.push("la tilde no va en una vocal");
  }
  return mal;
}
