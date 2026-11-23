// 📖✏️⏱️ Página de estudio de una materia de la convocatoria de 8°: materia → práctica → simulacro.
// estudio-8.html?m=<materia>&paso=materia|practica|simulacro[&tema=<id>][&ver=<n>]
import { MATERIAS_8, materia8 } from "./materias.js";
import * as P from "./progreso.js";
import { bloque, enLinea, TAREA, cuando, diaDe } from "./texto.js";
import { escapar } from "../html.js";
import { vistaPractica } from "./vista-practica.js";
import { vistaSimulacro } from "./vista-simulacro.js";

const $ = s => document.querySelector(s);
const meta = materia8(new URLSearchParams(location.search).get("m")) || MATERIAS_8[0];
let estado = P.leer();
let contenido = null;
let limpiar = () => {};

document.documentElement.style.setProperty("--m", meta.color);
document.title = `${meta.nombre} · Convocatoria de 8° · Aprendo a lo Tico`;

/** Aviso corto abajo de la pantalla. La región está siempre (vacía) para que los lectores de pantalla la anuncien. */
function avisar(texto) {
  const a = $("#aviso");
  a.textContent = texto;
  clearTimeout(avisar.t);
  avisar.t = setTimeout(() => { a.textContent = ""; }, 5000);
}

/** Vuelve a poner el foco en el control equivalente después de repintar (si el que tenía el foco desapareció). */
export function conservarFoco(selector, repintar) {
  const y = window.scrollY;
  repintar();
  window.scrollTo(0, y);
  if (selector) document.querySelector(selector)?.focus({ preventScroll: true });
}

/** El selector de un control que se puede volver a encontrar después de repintar. */
export function selectorDe(el) {
  for (const a of ["data-tarea", "data-corregida", "data-guia"]) {
    if (el.hasAttribute(a)) {
      const k = el.dataset.k !== undefined ? `[data-k="${CSS.escape(el.dataset.k)}"]` : "";
      return `[${a}="${CSS.escape(el.getAttribute(a))}"]${k}`;
    }
  }
  return "";
}

let navegando = false;

const ctx = {
  meta,
  get contenido() { return contenido; },
  prog: () => P.deMateria(estado, meta.id),
  estado: () => estado,
  /** Cambia algo del estado general (la clave del adulto). */
  actualizarTodo(cambio) {
    estado = cambio(P.leer());
    if (!P.guardar(estado)) avisar("Este navegador no deja guardar: el avance se pierde al cerrar la página.");
  },
  conservarFoco,
  selectorDe,
  /** Cambia el progreso de esta materia, lo guarda y, si viene texto, lo anota en el registro para el adulto. */
  actualizar(cambio, texto) {
    estado = P.cambiar(P.leer(), meta.id, cambio, texto);
    if (!P.guardar(estado)) avisar("Este navegador no deja guardar: el avance se pierde al cerrar la página.");
  },
  avisar,
  /** Va a otro paso (queda en el historial para que «atrás» funcione). */
  ir(params, reemplazar = false) {
    const url = new URL(location.href);
    url.search = new URLSearchParams({ m: meta.id, ...params }).toString();
    history[reemplazar ? "replaceState" : "pushState"](null, "", url);
    navegando = true;
    pintar();
    window.scrollTo(0, 0);
  },
};

function cabecera() {
  const fecha = meta.fecha ? `${diaDe(meta.fecha)} · ${meta.hora}` : "Fecha por confirmar";
  $("#cab").innerHTML = `<p class="volver"><a href="convocatoria-8.html">← Convocatoria de 8°</a></p>`
    + `<h1><span aria-hidden="true">${meta.emoji}</span> ${escapar(meta.nombre)}</h1>`
    + `<p class="cuando">${escapar(fecha)} · <b>${escapar(P.cuantoFalta(meta.fecha))}</b></p>`;
}

function pasos(paso) {
  const p = ctx.prog();
  const algunaLista = contenido.temas.some(t => P.materiaLista(p, t));
  const simu = P.simulacroAbierto(p, contenido.temas);
  const lista = [
    ["materia", "1", "Materia", "estudiar y cuaderno", false],
    ["practica", "2", "Práctica", "por tema, sin ayuda", !algunaLista],
    ["simulacro", "3", "Simulacro", `${contenido.duracion} min, con reloj`, !simu],
  ];
  $("#pasos").innerHTML = lista.map(([id, n, nombre, sub, cerrado]) =>
    `<a href="?m=${meta.id}&paso=${id}" data-paso="${id}" class="${cerrado ? "cerrado" : ""}"${paso === id ? ` aria-current="step"` : ""}>`
    + `<span class="n">${cerrado ? "🔒" : n}</span><span><b>${nombre}</b><small>${sub}</small></span></a>`).join("");
}

/** 📖 La materia: un tema a la vez, con lo que evalúan, lo que hay que estudiar y las tareas de cuaderno. */
function vistaMateria(params) {
  const p = ctx.prog();
  const temas = contenido.temas;
  const tema = temas.find(t => t.id === params.get("tema")) || temas.find(t => !P.materiaLista(p, t)) || temas[0];
  // El tema queda fijo en la dirección: al marcar la última tarea no salta al siguiente tema
  if (params.get("tema") !== tema.id) {
    params.set("tema", tema.id);
    history.replaceState(null, "", `?${params}`);
  }
  const n = temas.indexOf(tema);
  const indice = temas.map((t, i) => {
    const lista = P.materiaLista(p, t);
    return `<li><a href="?m=${meta.id}&paso=materia&tema=${t.id}" data-tema="${t.id}"${t === tema ? ` aria-current="page"` : ""} class="${lista ? "listo" : ""}">`
      + `<span class="n">${lista ? "✓" : i + 1}</span> ${enLinea(t.titulo)}</a></li>`;
  }).join("");
  const hechas = p.tareas[tema.id] || {};
  const tareas = tema.cuaderno.map((k, i) => {
    const tipo = TAREA[k.tipo];
    return `<li><label class="tarea"><input type="checkbox" data-tarea="${i}"${hechas[i] ? " checked" : ""}>`
      + `<span><b>${tipo.emoji} ${tipo.nombre}.</b> ${enLinea(k.x)}${hechas[i] ? `<small class="hora">Marcada: ${escapar(cuando(hechas[i]))}</small>` : ""}</span></label></li>`;
  }).join("");
  const lista = P.materiaLista(p, tema);
  const sig = temas[n + 1];
  $("#vista").innerHTML = `
    <aside class="reglas-cortas"><p><b>Cómo se estudia:</b> cuaderno abierto, leé todo el tema, hacé cada tarea <b>a mano</b>
      y marcala cuando esté hecha. Un adulto puede revisar el cuaderno contra estas marcas (quedan con la hora).
      La práctica de un tema se abre cuando sus tareas están todas.</p></aside>
    <nav class="indice" aria-label="Temas"><ol>${indice}</ol></nav>
    <article class="hoja tema">
      <header><p class="sobre">Tema ${n + 1} de ${temas.length}</p><h2>${enLinea(tema.titulo)}</h2></header>
      <section class="evaluan"><h3>Lo que te van a evaluar</h3><ul>${tema.indicadores.map(i => `<li>${enLinea(i)}</li>`).join("")}</ul></section>
      <section class="contenido">${tema.materia.map(bloque).join("")}</section>
      <section class="cuaderno" aria-labelledby="t-cuaderno"><h3 id="t-cuaderno">En el cuaderno</h3><ol>${tareas}</ol>
        <p class="estado-tema">${lista ? "✓ Tareas hechas: la práctica de este tema está abierta." : `Te faltan ${tema.cuaderno.length - Object.keys(hechas).length} tareas para abrir la práctica.`}</p>
        <div class="acciones">
          <a class="btn${lista ? " principal" : " apagado"}" href="?m=${meta.id}&paso=practica&tema=${tema.id}" data-ir-practica${lista ? "" : ` aria-disabled="true"`}>Ir a la práctica de este tema</a>
          ${sig ? `<a class="btn" href="?m=${meta.id}&paso=materia&tema=${sig.id}" data-tema="${sig.id}">Tema siguiente →</a>` : ""}
        </div>
      </section>
    </article>`;
  $("#vista").onchange = ev => {
    const c = ev.target.closest("[data-tarea]");
    if (!c) return;
    const i = Number(c.dataset.tarea);
    ctx.actualizar(pr => P.marcarTarea(pr, tema.id, i, c.checked),
      `${c.checked ? "Marcó" : "Desmarcó"} la tarea ${i + 1} del tema «${tema.titulo}»`);
    conservarFoco(selectorDe(c), () => vistaMateria(params));
    pasos("materia");
    if (P.materiaLista(ctx.prog(), tema)) avisar("Tareas hechas: la práctica de este tema está abierta.");
  };
  $("#vista").onclick = ev => {
    const a = ev.target.closest("a[data-tema], a[data-ir-practica]");
    if (!a) return;
    ev.preventDefault();
    if (a.hasAttribute("data-ir-practica")) {
      if (a.getAttribute("aria-disabled") === "true") return avisar("Primero hacé y marcá todas las tareas de cuaderno de este tema.");
      return ctx.ir({ paso: "practica", tema: tema.id });
    }
    ctx.ir({ paso: "materia", tema: a.dataset.tema });
  };
}

function pintar() {
  limpiar();
  limpiar = () => {};
  estado = P.leer();
  const params = new URLSearchParams(location.search);
  let paso = params.get("paso") || "materia";
  const p = ctx.prog();
  // Un simulacro empezado no se suelta: el reloj sigue corriendo.
  if (p.simEnCurso && paso !== "simulacro") paso = "simulacro";
  cabecera();
  pasos(paso);
  // Cada vista empieza con un #vista nuevo: así no se le acumulan los escuchadores de la anterior
  const viejo = $("#vista");
  const vista = viejo.cloneNode(false);
  viejo.replaceWith(vista);
  if (paso === "practica") limpiar = vistaPractica(ctx, vista, params) || limpiar;
  else if (paso === "simulacro") limpiar = vistaSimulacro(ctx, vista, params) || limpiar;
  else vistaMateria(params);
  // Al cambiar de vista, el foco va al título nuevo (si no, queda en un botón que ya no existe)
  if (navegando) {
    navegando = false;
    const titulo = $("#vista").querySelector("h2");
    if (titulo) {
      titulo.tabIndex = -1;
      titulo.focus({ preventScroll: true });
    }
  }
}

async function arrancar() {
  cabecera();
  try {
    contenido = (await meta.cargar()).default;
  } catch {
    $("#vista").innerHTML = `<p class="error">No se pudo cargar ${escapar(meta.nombre)}. Revisá la conexión y recargá la página.</p>`;
    return;
  }
  $("#pasos").addEventListener("click", ev => {
    const a = ev.target.closest("a[data-paso]");
    if (!a) return;
    ev.preventDefault();
    if (a.classList.contains("cerrado")) {
      return avisar(a.dataset.paso === "practica"
        ? "La práctica se abre cuando terminás las tareas de cuaderno de un tema."
        : "El simulacro se abre cuando cada práctica tiene 70 o más.");
    }
    ctx.ir({ paso: a.dataset.paso });
  });
  addEventListener("popstate", pintar);
  pintar();
}

arrancar();
