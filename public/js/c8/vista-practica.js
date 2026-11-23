// ✏️ Práctica por tema: se abre cuando las tareas de cuaderno del tema están hechas. Contesta todo sin pistas,
// entrega, y recién ahí ve la corrección. Lo que falló lo corrige en el cuaderno antes de poder repetirla.
import * as P from "./progreso.js";
import { enLinea } from "./texto.js";
import { nota, MINIMA, seCorrigeSolo } from "./revisar.js";
import { permsPara, ajustarHoja, pintarParaContestar, leerControl, sinContestar, corregir, pintarCorregida, marcasDe, conectarOrales, sinPegar } from "./hoja.js";

const entradasDe = tema => tema.practica.map((item, i) => ({ clave: String(i), item }));

function listaDeTemas(ctx, vista) {
  const p = ctx.prog();
  vista.innerHTML = `<article class="hoja"><header><h2>Práctica por tema</h2>
    <p class="instr">Cada práctica se abre cuando terminás las tareas de cuaderno de su tema. Para abrir el simulacro, cada una necesita <b>${MINIMA} o más</b>.</p></header>
    <ol class="temas-practica">${ctx.contenido.temas.map((t, i) => {
      const abierta = P.materiaLista(p, t), mejor = P.mejorNota(p, t.id), falta = P.faltaCorregir(p, t.id).length;
      const estado = !abierta ? "🔒 Primero la materia" : falta ? `Falta corregir ${falta} en el cuaderno` : mejor === null ? "Sin hacer" : `Mejor nota: ${mejor}`;
      const clase = !abierta ? "cerrado" : mejor !== null && mejor >= MINIMA ? "aprobado" : mejor !== null ? "reprobado" : "";
      return `<li class="${clase}"><a href="?m=${ctx.meta.id}&paso=${abierta ? "practica" : "materia"}&tema=${t.id}" data-tema="${t.id}" data-abierta="${abierta}">`
        + `<span class="n">${i + 1}</span><span><b>${enLinea(t.titulo)}</b><small>${estado}</small></span></a></li>`;
    }).join("")}</ol></article>`;
  vista.addEventListener("click", ev => {
    const a = ev.target.closest("a[data-tema]");
    if (!a) return;
    ev.preventDefault();
    ctx.ir({ paso: a.dataset.abierta === "true" ? "practica" : "materia", tema: a.dataset.tema });
  });
}

/** Contestar: la hoja con todas las preguntas del tema y el botón de entregar. */
function contestar(ctx, vista, tema) {
  const entradas = entradasDe(tema);
  let hoja = ctx.prog().hojas[tema.id];
  if (!hoja) {
    hoja = { perms: permsPara(entradas), respuestas: {}, inicio: new Date().toISOString() };
    ctx.actualizar(p => P.guardarHoja(p, tema.id, hoja), `Empezó la práctica de «${tema.titulo}»`);
  } else {
    const ajustada = ajustarHoja(entradas, hoja);
    if (ajustada !== hoja) ctx.actualizar(p => P.guardarHoja(p, tema.id, ajustada));
    hoja = ajustada;
  }
  const contar = () => {
    const faltan = sinContestar(entradas, hoja.respuestas).length, total = entradas.filter(e => e.item.t !== "lectura").length;
    vista.querySelector(".contador").textContent = `${total - faltan} de ${total} contestadas`;
  };
  vista.innerHTML = `<article class="hoja practica">
    <header><p class="sobre">Práctica · ${enLinea(tema.titulo)}</p><h2>Contestá todo</h2>
      <p class="instr">Cuaderno abierto: podés buscar en <b>tus apuntes</b>. Nadie te ayuda, no hay pistas y no se corrige
      nada hasta que entregás. Si no sabés algo, buscalo en el cuaderno o volvé a la materia.</p></header>
    <div class="preguntas">${pintarParaContestar(entradas, hoja)}</div>
    <footer class="entregar"><p class="contador"></p>
      <button type="button" class="btn principal" data-entregar>Entregar</button>
      <div class="confirmar" hidden><p>¿Entregar? Después no se puede cambiar nada.</p>
        <button type="button" class="btn principal" data-si>Sí, entregar</button> <button type="button" class="btn" data-no>Todavía no</button></div>
    </footer></article>`;
  contar();
  const cambio = ev => {
    if (!ev.target.dataset.clave) return;
    hoja = { ...hoja, respuestas: leerControl(ev.target, entradas, hoja.respuestas) };
    ctx.actualizar(p => P.guardarHoja(p, tema.id, hoja));
    contar();
  };
  vista.addEventListener("input", cambio);
  vista.addEventListener("change", cambio);
  sinPegar(vista, ctx.avisar);
  const callar = conectarOrales(vista, entradas);
  vista.addEventListener("click", ev => {
    const confirmar = vista.querySelector(".confirmar");
    if (ev.target.closest("[data-entregar]")) {
      const faltan = sinContestar(entradas, hoja.respuestas);
      if (faltan.length) {
        ctx.avisar(`Te ${faltan.length === 1 ? "falta la pregunta" : "faltan las preguntas"} ${faltan.join(", ")}.`);
        const n = faltan[0], el = [...vista.querySelectorAll("section.item")][n - 1];
        el?.scrollIntoView({ block: "center" });
        el?.querySelector("input, select, button")?.focus({ preventScroll: true });
        return;
      }
      confirmar.hidden = false;
      confirmar.querySelector("[data-si]").focus();
    } else if (ev.target.closest("[data-no]")) confirmar.hidden = true;
    else if (ev.target.closest("[data-si]")) {
      const c = corregir(entradas, hoja.respuestas);
      const falladas = entradas.filter(({ clave, item }) => seCorrigeSolo(item) && !c.porItem[clave].ok).map(e => e.clave);
      const intento = { fecha: new Date().toISOString(), pts: c.pts, total: c.total, nota: nota(c.pts, c.total) };
      ctx.actualizar(p => P.entregarPractica(p, tema.id, { intento, falladas, respuestas: hoja.respuestas, entregada: intento.fecha }),
        `Entregó la práctica de «${tema.titulo}»: ${intento.nota} (${c.pts} de ${c.total})`);
      callar();
      ctx.ir({ paso: "practica", tema: tema.id }, true);
    }
  });
  return callar;
}

/** Corregida: nota, cada pregunta en rojo y lo que tiene que corregir en el cuaderno. */
function corregida(ctx, vista, tema) {
  const entradas = entradasDe(tema);
  const temas = ctx.contenido.temas;
  const sig = temas[temas.indexOf(tema) + 1];
  const pintarla = () => {
    const p = ctx.prog(), guardada = p.revisadas[tema.id];
    // Si el contenido cambió, se rebaraja lo que haga falta para mostrarla; lo contestado y lo marcado se mantiene
    const r = { ...ajustarHoja(entradas, guardada), respuestas: guardada.respuestas || {}, marcas: guardada.marcas || {} };
    const c = corregir(entradas, r.respuestas, r.marcas);
    const falta = P.faltaCorregir(p, tema.id), hechas = p.corregir[tema.id]?.hechas || [];
    const n = nota(c.pts, c.total), bien = entradas.filter(e => seCorrigeSolo(e.item) && c.porItem[e.clave].ok).length;
    const auto = entradas.filter(e => seCorrigeSolo(e.item)).length;
    const extra = (clave, res) => (seCorrigeSolo(entradas.find(e => e.clave === clave).item) && !res.ok
      ? `<label class="check corregir"><input type="checkbox" data-corregida="${clave}"${hechas.includes(clave) ? " checked" : ""}> Ya la corregí en el cuaderno (pregunta, respuesta correcta y por qué)</label>` : "");
    vista.innerHTML = `<article class="hoja practica revisada">
      <header><p class="sobre">Práctica corregida · ${enLinea(tema.titulo)}</p>
        <div class="resultado"><p class="sello ${n >= MINIMA ? "aprueba" : "reprueba"}" aria-label="Nota ${n}">${n}</p>
          <div><h2>${bien} de ${auto} bien${c.pendientes ? ` · ${c.pendientes} por revisar con la guía` : ""}</h2>
          <p>${n >= MINIMA ? "Aprobada. Igual corregí todo lo que fallaste." : `Por debajo de ${MINIMA}: volvé a la materia de este tema antes de repetir.`}</p></div></div>
        ${falta.length ? `<p class="instr deber"><b>Antes de repetir:</b> en el cuaderno, por cada ✗ copiá la pregunta, la respuesta correcta y el porqué. Marcá cada una aquí cuando esté (te faltan ${falta.length}).</p>` : ""}
      </header>
      <div class="preguntas">${pintarCorregida(entradas, r, r.marcas, c, { extra, leyenda: "Compará con el modelo y marcá con honestidad lo que cumpliste (1 punto cada uno):" })}</div>
      <footer class="acciones">
        <button type="button" class="btn${falta.length ? " apagado" : " principal"}" data-otra${falta.length ? ` aria-disabled="true"` : ""}>Hacer la práctica otra vez</button>
        <a class="btn" href="?m=${ctx.meta.id}&paso=materia&tema=${tema.id}" data-materia>Volver a la materia del tema</a>
        ${sig ? `<a class="btn" href="?m=${ctx.meta.id}&paso=practica&tema=${sig.id}" data-sig="${sig.id}">Práctica siguiente →</a>` : ""}
      </footer></article>`;
  };
  pintarla();
  vista.addEventListener("change", ev => {
    const cor = ev.target.closest("[data-corregida]"), guia = ev.target.closest("[data-guia]");
    if (cor) {
      ctx.actualizar(p => P.marcarCorregida(p, tema.id, cor.dataset.corregida, cor.checked),
        cor.checked ? `Corrigió en el cuaderno una pregunta de «${tema.titulo}»` : "");
    } else if (guia) {
      const clave = guia.dataset.guia, r = ctx.prog().revisadas[tema.id];
      const marcas = { ...r.marcas, [clave]: marcasDe(vista, clave) };
      const c = corregir(entradas, r.respuestas, marcas);
      ctx.actualizar(p => P.marcarGuia(p, tema.id, clave, marcas[clave], { pts: c.pts, total: c.total, nota: nota(c.pts, c.total) }));
    } else return;
    ctx.conservarFoco(ctx.selectorDe(ev.target), pintarla);
  });
  vista.addEventListener("click", ev => {
    const el = ev.target.closest("[data-otra], [data-materia], [data-sig]");
    if (!el) return;
    ev.preventDefault();
    if (el.hasAttribute("data-materia")) return ctx.ir({ paso: "materia", tema: tema.id });
    if (el.hasAttribute("data-sig")) return ctx.ir({ paso: "practica", tema: el.dataset.sig });
    if (P.faltaCorregir(ctx.prog(), tema.id).length) return ctx.avisar("Primero corregí en el cuaderno todo lo que fallaste y marcalo.");
    const hoja = { perms: permsPara(entradas), respuestas: {}, inicio: new Date().toISOString() };
    ctx.actualizar(p => P.guardarHoja(p, tema.id, hoja), `Empezó otra vez la práctica de «${tema.titulo}»`);
    ctx.ir({ paso: "practica", tema: tema.id }, true);
  });
}

/** @returns {(() => void) | undefined} limpieza al salir de la vista */
export function vistaPractica(ctx, vista, params) {
  const tema = ctx.contenido.temas.find(t => t.id === params.get("tema"));
  if (!tema) return listaDeTemas(ctx, vista);
  const p = ctx.prog();
  if (!P.materiaLista(p, tema)) {
    vista.innerHTML = `<article class="hoja"><h2>🔒 Primero la materia</h2>
      <p>La práctica de <b>${enLinea(tema.titulo)}</b> se abre cuando hagás y marqués todas las tareas de cuaderno de ese tema.</p>
      <p><a class="btn principal" href="?m=${ctx.meta.id}&paso=materia&tema=${tema.id}" data-materia>Ir a la materia del tema</a></p></article>`;
    vista.addEventListener("click", ev => {
      if (!ev.target.closest("[data-materia]")) return;
      ev.preventDefault();
      ctx.ir({ paso: "materia", tema: tema.id });
    });
    return undefined;
  }
  if (p.hojas[tema.id] || !p.revisadas[tema.id]) return contestar(ctx, vista, tema);
  return corregida(ctx, vista, tema);
}
