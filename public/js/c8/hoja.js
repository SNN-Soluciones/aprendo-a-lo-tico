// 📄 La hoja de preguntas (práctica y simulacro): pinta cada pregunta para contestar, junta las respuestas y,
// después de entregar, la corrige «en rojo» con la respuesta correcta y la explicación. Antes de entregar no hay
// pistas, ni respuestas, ni nada que ayude: ni corrector ortográfico, ni autocompletar, ni pegar.
import { escapar } from "../html.js";
import { calificar, puntosDe, seCorrigeSolo } from "./revisar.js";
import { enLinea, parrafos, figuraDe } from "./texto.js";
import { hablar, callar, puedeHablar } from "../voz.js";

const LETRAS = "abcde";
const SIN_AYUDA = `autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" translate="no"`;
const VECES_OIR = 2;

/** Orden al azar (Fisher-Yates) sin tocar el original. */
export function barajar(lista) {
  const b = [...lista];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Cómo se barajan las opciones de cada pregunta en esta hoja (se guarda para que no cambie al recargar). */
export function permsPara(entradas) {
  const perms = {};
  for (const { clave, item } of entradas) {
    if (item.t === "opcion") perms[clave] = barajar(item.o.map((_, i) => i));
    else if (item.t === "parejas") perms[clave] = barajar([...new Set(item.pares.map(p => p[1]))].map((_, i) => i));
    else if (item.t === "ordenar") perms[clave] = barajar(item.x.map((_, i) => i));
  }
  return perms;
}

const derechas = item => [...new Set(item.pares.map(p => p[1]))];
const largoBarajado = item => (item.t === "opcion" ? item.o.length : item.t === "parejas" ? derechas(item).length : item.t === "ordenar" ? item.x.length : null);

/**
 * Una hoja guardada con contenido que después cambió (otra cantidad de opciones, preguntas nuevas) se arregla:
 * se vuelven a barajar esas preguntas y se borra lo que había contestado en ellas. Así la página nunca se rompe.
 */
export function ajustarHoja(entradas, hoja) {
  const perms = { ...(hoja.perms || {}) }, respuestas = { ...(hoja.respuestas || {}) };
  let cambio = !hoja.perms || !hoja.respuestas;
  for (const { clave, item } of entradas) {
    const largo = largoBarajado(item);
    if (largo === null) continue;
    const p = perms[clave];
    const bien = Array.isArray(p) && p.length === largo && [...p].sort((a, b) => a - b).every((v, i) => v === i);
    if (bien) continue;
    perms[clave] = permsPara([{ clave, item }])[clave];
    delete respuestas[clave];
    cambio = true;
  }
  return cambio ? { ...hoja, perms, respuestas } : hoja;
}

/** ¿Ya contestó esa pregunta? (en blanco no cuenta) */
export function contestada(item, r) {
  switch (item.t) {
    case "lectura": return true;
    case "opcion": return Number.isInteger(r);
    case "vf": return typeof r === "boolean";
    case "parejas": return Array.isArray(r) && item.pares.every((_, k) => !!r[k]);
    case "ordenar": return Array.isArray(r) && item.x.every((_, k) => !!r[k]);
    case "abierta": case "oral": return r === true;
    default: return typeof r === "string" && r.trim() !== "";
  }
}

const valorPts = item => (puntosDe(item) > 1 ? ` <span class="pts">(${puntosDe(item)} pts)</span>` : "");

function consignaConHueco(item, clave, r, n) {
  const campo = `<input class="hueco" type="text" data-clave="${clave}" value="${escapar(r ?? "")}" aria-label="Respuesta de la pregunta ${n}" aria-describedby="en-${clave}" ${SIN_AYUDA}>`;
  const trozos = String(item.p).split(/_{3,}/);
  if (trozos.length === 1) return `${enLinea(item.p)} ${campo}`;
  return trozos.map((trozo, i) => {
    const txt = enLinea(trozo);
    if (i === trozos.length - 1) return txt;
    return i === 0 ? `${txt}${campo}` : `${txt}<span class="hueco-vacio">______</span>`;
  }).join("");
}

/** Una pregunta lista para contestar. */
function paraContestar(item, clave, n, perm, r) {
  const fig = figuraDe(item.fig, "Figura de la pregunta");
  const num = `<span class="num">${n}.</span>`;
  switch (item.t) {
    case "opcion":
      return `<fieldset class="preg">${fig}<legend>${num} ${enLinea(item.p)}${valorPts(item)}</legend>`
        + perm.map((orig, k) => `<label class="op"><input type="radio" name="r-${clave}" data-clave="${clave}" value="${orig}"${r === orig ? " checked" : ""}>`
          + `<span class="letra">${LETRAS[k]})</span> <span>${enLinea(item.o[orig])}</span></label>`).join("") + `</fieldset>`;
    case "vf":
      return `<fieldset class="preg">${fig}<legend>${num} ${enLinea(item.p)}${valorPts(item)}</legend><div class="vf">`
        + [[true, "Verdadero"], [false, "Falso"]].map(([v, t]) => `<label class="op"><input type="radio" name="r-${clave}" data-clave="${clave}" value="${v ? "v" : "f"}"${r === v ? " checked" : ""}> <span>${t}</span></label>`).join("")
        + `</div></fieldset>`;
    case "completar":
      return `<div class="preg">${fig}<p class="enunciado" id="en-${clave}">${num} ${consignaConHueco(item, clave, r, n)}${valorPts(item)}</p></div>`;
    case "numero": case "expresion":
      return `<div class="preg">${fig}<label class="enunciado" for="in-${clave}">${num} ${enLinea(item.p)}${valorPts(item)}</label>`
        + `<input class="respuesta${item.t === "expresion" ? " algebra" : ""}" id="in-${clave}" type="text" data-clave="${clave}" value="${escapar(r ?? "")}" ${SIN_AYUDA}></div>`;
    case "parejas": {
      const ders = derechas(item);
      return `<fieldset class="preg">${fig}<legend>${num} ${enLinea(item.p)}${valorPts(item)}</legend><div class="parejas">`
        + item.pares.map(([izq], k) => `<label class="pareja"><span>${enLinea(izq)}</span><select data-clave="${clave}" data-k="${k}">`
          + `<option value="">—</option>${perm.map(d => `<option value="${escapar(ders[d])}"${r?.[k] === ders[d] ? " selected" : ""}>${escapar(ders[d])}</option>`).join("")}</select></label>`).join("")
        + `</div></fieldset>`;
    }
    case "ordenar":
      return `<fieldset class="preg">${fig}<legend>${num} ${enLinea(item.p)}${valorPts(item)}</legend><div class="ordenar">`
        + perm.map(k => `<label class="pareja"><select data-clave="${clave}" data-k="${k}" aria-labelledby="or-${clave}-${k}"><option value="">—</option>`
          + item.x.map((_, l) => `<option value="${l + 1}"${Number(r?.[k]) === l + 1 ? " selected" : ""}>${l + 1}</option>`).join("")
          + `</select><span id="or-${clave}-${k}">${enLinea(item.x[k])}</span></label>`).join("") + `</div></fieldset>`;
    case "abierta":
      return `<div class="preg abierta">${fig}<p class="enunciado">${num} ${enLinea(item.p)}${valorPts(item)}</p>`
        + `<p class="en-cuaderno">✍️ Hacelo <b>a mano en el cuaderno</b>${item.palabras ? `, de ${escapar(item.palabras[0])} a ${escapar(item.palabras[1])} palabras (contalas vos)` : item.lineas ? ` (unas ${escapar(item.lineas)} líneas)` : ""}. Aquí no se escribe.</p>`
        + `<label class="check"><input type="checkbox" data-clave="${clave}"${r === true ? " checked" : ""}> Ya lo hice en el cuaderno</label></div>`;
    case "oral":
      return `<div class="preg oral"><p class="enunciado">${num} 🎧 Pregunta oral${valorPts(item)}: tenés <b>${escapar(item.seg)} segundos</b> para contestar en voz alta, con oraciones completas.</p>`
        + (puedeHablar ? `<button type="button" class="btn-oir" data-oir="${clave}">▶ Oír la pregunta <small>(se puede ${VECES_OIR} veces)</small></button>` : "")
        + `<p class="reloj-oral" data-reloj="${clave}" aria-hidden="true"></p><p class="sr-only" data-anuncio="${clave}" aria-live="polite"></p>`
        + `<details class="para-adulto"><summary>${puedeHablar ? "¿No se oye?" : "Este aparato no lee en voz alta"}: que un adulto le lea la pregunta</summary><p lang="en">${enLinea(item.p)}</p></details>`
        + `<label class="check"><input type="checkbox" data-clave="${clave}"${r === true ? " checked" : ""}> Ya contesté en voz alta</label></div>`;
    default: return "";
  }
}

/**
 * La hoja para contestar.
 * @param {{ clave: string, item: any, parte?: { titulo: string, instrucciones: string } }[]} entradas
 * @param {{ perms: Record<string, number[]>, respuestas: Record<string, any> }} hoja
 */
export function pintarParaContestar(entradas, hoja) {
  let n = 0, parte = null;
  return entradas.map(({ clave, item, parte: p }) => {
    let cab = "";
    if (p && p !== parte) {
      parte = p;
      cab = `<header class="parte"><h3>${enLinea(p.titulo)}</h3><p>${enLinea(p.instrucciones)}</p></header>`;
    }
    if (item.t === "lectura") return `${cab}<article class="lectura">${item.titulo ? `<h5>${enLinea(item.titulo)}</h5>` : ""}${figuraDe(item.fig, "Figura de la lectura")}${parrafos(item.x)}</article>`;
    n++;
    return `${cab}<section class="item" data-item="${clave}">${paraContestar(item, clave, n, hoja.perms[clave], hoja.respuestas[clave])}</section>`;
  }).join("");
}

/** Lee lo que cambió en un control y devuelve las respuestas nuevas (sin tocar las de antes). */
export function leerControl(el, entradas, respuestas) {
  const clave = el.dataset.clave;
  const entrada = clave && entradas.find(e => e.clave === clave);
  if (!entrada) return respuestas;
  const { item } = entrada;
  let valor;
  if (item.t === "opcion") valor = Number(el.value);
  else if (item.t === "vf") valor = el.value === "v";
  else if (item.t === "abierta" || item.t === "oral") valor = el.checked;
  else if (item.t === "parejas" || item.t === "ordenar") {
    const lista = [...(respuestas[clave] || [])];
    lista[Number(el.dataset.k)] = item.t === "ordenar" ? (el.value ? Number(el.value) : "") : el.value;
    valor = lista;
  } else valor = el.value;
  return { ...respuestas, [clave]: valor };
}

/** Números (1, 2, 3…) de las preguntas sin contestar. */
export function sinContestar(entradas, respuestas) {
  let n = 0;
  return entradas.flatMap(({ clave, item }) => {
    if (item.t === "lectura") return [];
    n++;
    return contestada(item, respuestas[clave]) ? [] : [n];
  });
}

/**
 * Corrige la hoja entera: cada pregunta y el total (las abiertas y orales, con las marcas de la guía).
 * pts y total son solo de lo ya corregido; pendientes = abiertas u orales sin corregir (valen totalPendiente).
 */
export function corregir(entradas, respuestas, marcas = {}) {
  const porItem = {};
  let pts = 0, total = 0, pendientes = 0, totalPendiente = 0;
  for (const { clave, item } of entradas) {
    if (item.t === "lectura") continue;
    const res = calificar(item, seCorrigeSolo(item) ? respuestas[clave] : marcas[clave]);
    porItem[clave] = res;
    // Las abiertas y orales que todavía nadie corrigió no cuentan en la nota (ni a favor ni en contra)
    if (!seCorrigeSolo(item) && !marcas[clave]) { pendientes++; totalPendiente += res.total; continue; }
    pts += res.pts;
    total += res.total;
  }
  return { porItem, pts, total, pendientes, totalPendiente };
}

const marca = res => (res.ok ? `<span class="marca bien" role="img" aria-label="Bien">✓</span>`
  : res.pts > 0 ? `<span class="marca medio" role="img" aria-label="A medias: ${res.pts} de ${res.total}">${res.pts}/${res.total}</span>`
  : `<span class="marca mal" role="img" aria-label="Mal">✗</span>`);

function respuestaCorrecta(item, r, perm) {
  const tuya = t => `<p class="tuya">Tu respuesta: <span>${t}</span></p>`;
  const letra = i => { const k = perm.indexOf(i); return LETRAS[k >= 0 ? k : i] || "?"; };
  switch (item.t) {
    case "opcion":
      return tuya(Number.isInteger(r) && item.o[r] !== undefined ? `${letra(r)}) ${enLinea(item.o[r])}` : "en blanco") + `<p class="correcta">Correcta: ${letra(item.r)}) ${enLinea(item.o[item.r])}</p>`;
    case "vf": return tuya(typeof r === "boolean" ? (r ? "Verdadero" : "Falso") : "en blanco") + `<p class="correcta">Correcta: ${item.r ? "Verdadero" : "Falso"}</p>`;
    case "completar": case "numero": case "expresion": {
      const r0 = item.t === "completar" ? item.r[0] : String(item.r);
      const otras = item.t === "completar" && item.r.length > 1 ? ` <small>(también vale: ${item.r.slice(1).map(escapar).join(" · ")})</small>` : "";
      return tuya(r && String(r).trim() ? escapar(r) : "en blanco") + `<p class="correcta">Correcta: <b>${escapar(r0)}</b>${otras}</p>`;
    }
    case "parejas":
      return `<ul class="lista-correccion">${item.pares.map(([izq, der], k) => {
        const bien = r?.[k] === der;
        return `<li class="${bien ? "bien" : "mal"}">${enLinea(izq)} → ${escapar(r?.[k] || "en blanco")}${bien ? " ✓" : ` <b>✗ era: ${escapar(der)}</b>`}</li>`;
      }).join("")}</ul>`;
    case "ordenar":
      return `<p class="correcta">Orden correcto:</p><ol class="lista-correccion">${item.x.map((x, k) => `<li class="${Number(r?.[k]) === k + 1 ? "bien" : "mal"}">${enLinea(x)}${Number(r?.[k]) === k + 1 ? " ✓" : ` <b>(le pusiste ${escapar(r?.[k] || "nada")})</b>`}</li>`).join("")}</ol>`;
    default: return "";
  }
}

/**
 * La hoja corregida. En las abiertas y orales aparece la guía para marcar (`leyenda` dice quién y cómo).
 * @param {{ extra?: (clave: string, res: any) => string, leyenda: string, bloqueada?: boolean }} op
 *   extra: algo más debajo de cada pregunta · bloqueada: la guía se ve pero no se puede marcar (falta la clave)
 */
export function pintarCorregida(entradas, hoja, marcas, correccion, { extra = () => "", leyenda, bloqueada = false }) {
  let n = 0, parte = null;
  return entradas.map(({ clave, item, parte: p }) => {
    let cab = "";
    if (p && p !== parte) {
      parte = p;
      cab = `<header class="parte"><h3>${enLinea(p.titulo)}</h3></header>`;
    }
    if (item.t === "lectura") return `${cab}<article class="lectura">${item.titulo ? `<h5>${enLinea(item.titulo)}</h5>` : ""}${figuraDe(item.fig, "Figura de la lectura")}${parrafos(item.x)}</article>`;
    n++;
    const res = correccion.porItem[clave];
    const r = hoja.respuestas[clave];
    const fig = figuraDe(item.fig, "Figura de la pregunta");
    if (!seCorrigeSolo(item)) {
      const m = marcas[clave] || [];
      return `${cab}<section class="item corregida" data-item="${clave}">${fig}<p class="enunciado"><span class="num">${n}.</span> ${item.t === "oral" ? `🎧 <span lang="en">${enLinea(item.p)}</span>` : enLinea(item.p)}${valorPts(item)}</p>`
        + `<div class="modelo"><span class="rotulo">Respuesta modelo</span>${parrafos(item.modelo)}</div>`
        + `<fieldset class="guia"><legend>${escapar(leyenda)}</legend>`
        + item.guia.map((g, k) => `<label class="check"><input type="checkbox" data-guia="${clave}" data-k="${k}"${m[k] ? " checked" : ""}${bloqueada ? " disabled" : ""}> ${enLinea(g)}</label>`).join("")
        + `</fieldset><p class="puntaje" data-puntaje="${clave}">${marcas[clave] ? `${res.pts} de ${res.total}` : "Sin revisar todavía"}</p>${extra(clave, res)}</section>`;
    }
    return `${cab}<section class="item corregida ${res.ok ? "ok" : "falla"}" data-item="${clave}">${marca(res)}${fig}`
      + `<p class="enunciado"><span class="num">${n}.</span> ${enLinea(item.p)}${valorPts(item)}</p>`
      + respuestaCorrecta(item, r, hoja.perms[clave] || [])
      + (res.motivo ? `<p class="motivo">${escapar(res.motivo)}</p>` : "")
      + `<p class="porque"><span class="rotulo">Por qué</span> ${enLinea(item.e)}</p>${extra(clave, res)}</section>`;
  }).join("");
}

/** Marcas de la guía de una pregunta abierta u oral, leídas de sus casillas. */
export const marcasDe = (raiz, clave) => [...raiz.querySelectorAll(`[data-guia="${CSS.escape(clave)}"]`)].map(c => c.checked);

/** Conecta los botones ▶ de las preguntas orales: se oyen hasta 2 veces y después corre el reloj para contestar. */
export function conectarOrales(raiz, entradas) {
  const veces = {};
  let reloj = null;
  raiz.addEventListener("click", async ev => {
    const btn = ev.target.closest("[data-oir]");
    if (!btn) return;
    const clave = btn.dataset.oir;
    const item = entradas.find(e => e.clave === clave)?.item;
    if (!item || (veces[clave] || 0) >= VECES_OIR) return;
    veces[clave] = (veces[clave] || 0) + 1;
    btn.disabled = true;
    clearInterval(reloj);
    const cartel = raiz.querySelector(`[data-reloj="${CSS.escape(clave)}"]`);
    const anuncio = raiz.querySelector(`[data-anuncio="${CSS.escape(clave)}"]`);
    if (cartel) cartel.textContent = "Escuchá…";
    await hablar(item.p, { lang: "en", rate: 0.9 });
    const quedan = VECES_OIR - veces[clave];
    btn.disabled = quedan <= 0;
    btn.innerHTML = quedan > 0 ? `▶ Oír otra vez <small>(queda ${quedan})</small>` : "Ya no se puede oír más";
    let s = item.seg;
    const pintar = () => { if (cartel) cartel.textContent = s > 0 ? `Contestá ahora en voz alta: ${s} s` : "Se acabó el tiempo."; };
    pintar();
    if (anuncio) anuncio.textContent = `Contestá ahora en voz alta: tenés ${s} segundos.`;
    reloj = setInterval(() => {
      s--;
      pintar();
      if (s > 0) return;
      clearInterval(reloj);
      if (anuncio) anuncio.textContent = "Se acabó el tiempo.";
    }, 1000);
  });
  return () => { clearInterval(reloj); callar(); };
}

/** Aquí no se pega texto: todo se escribe. */
export function sinPegar(raiz, avisar) {
  raiz.addEventListener("paste", ev => {
    if (ev.target.matches("input, textarea")) {
      ev.preventDefault();
      avisar("Aquí no se pega: escribilo vos.");
    }
  });
  raiz.addEventListener("drop", ev => {
    if (ev.target.matches("input, textarea")) ev.preventDefault();
  });
}
