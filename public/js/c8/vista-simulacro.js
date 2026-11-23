// ⏱️ Simulacro: como el examen de verdad. Cuaderno cerrado, con reloj que no se detiene (aunque cierre la página),
// sin corregir nada hasta entregar; si se acaba el tiempo se entrega solo. Las abiertas y orales las corrige un adulto.
import * as P from "./progreso.js";
import { enLinea, cuando } from "./texto.js";
import { nota, MINIMA, puntosDe } from "./revisar.js";
import { escapar } from "../html.js";
import { pedirClave, escucharClave } from "./clave.js";
import { permsPara, ajustarHoja, pintarParaContestar, leerControl, sinContestar, corregir, pintarCorregida, marcasDe, conectarOrales, sinPegar } from "./hoja.js";

const entradasDe = s => s.partes.flatMap((parte, j) => parte.items.map((item, i) => ({ clave: `${j}.${i}`, item, parte })));
const totalDe = s => entradasDe(s).reduce((a, e) => a + puntosDe(e.item), 0);
const reloj = seg => {
  const s = Math.max(0, Math.ceil(seg));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return `${h ? `${h}:` : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(r).padStart(2, "0")}`;
};

function cerrado(ctx, vista) {
  const p = ctx.prog();
  vista.innerHTML = `<article class="hoja"><h2>🔒 El simulacro todavía no</h2>
    <p>Se abre cuando <b>cada práctica</b> tiene ${MINIMA} o más. Primero la materia, después la práctica, después el simulacro.</p>
    <ul class="faltan">${ctx.contenido.temas.map(t => {
      const m = P.mejorNota(p, t.id);
      return `<li class="${m !== null && m >= MINIMA ? "bien" : ""}">${enLinea(t.titulo)}: <b>${m === null ? "sin hacer" : m}</b></li>`;
    }).join("")}</ul>
    <details class="para-adulto"><summary>Para el adulto</summary>
      <p>Si decidís que lo haga ya (por ejemplo, para ver cómo está), podés abrirlo con tu clave. Queda anotado en el registro.</p>
      ${pedirClave(ctx.estado(), "abrir", "Clave del adulto:")}</details></article>`;
  escucharClave(vista, ctx.estado, () => {
    ctx.actualizar(pr => ({ ...pr, desbloqueo: new Date().toISOString() }), "Un adulto abrió el simulacro antes de tiempo");
    ctx.ir({ paso: "simulacro" }, true);
  });
}

function lista(ctx, vista) {
  const p = ctx.prog(), { simulacros, duracion } = ctx.contenido;
  vista.innerHTML = `<article class="hoja"><header><h2>Simulacros</h2>
    <p class="instr">Como el examen de verdad: <b>${duracion} minutos</b>, cuaderno <b>cerrado</b>, nadie te ayuda, sin pausa.
    El reloj sigue corriendo aunque cerrés la página, y si se acaba se entrega solo. Hacé uno, corregí en el cuaderno lo que fallaste,
    estudiá eso y después hacé el otro.</p></header>
    <ul class="simulacros">${simulacros.map((s, k) => {
      const hechos = p.simulacros.map((h, i) => ({ ...h, i })).filter(h => h.idx === k);
      return `<li><div><h3>${escapar(s.nombre)}</h3><p>${totalDe(s)} puntos · ${s.partes.length} partes</p>
        ${hechos.length ? `<p class="hechos">${hechos.map(h => `<a href="?m=${ctx.meta.id}&paso=simulacro&ver=${h.i}" data-ver="${h.i}">${escapar(cuando(h.fin))}: <b>${h.nota}</b>${h.pendientes ? " (sin terminar de corregir)" : ""}</a>`).join(" · ")}</p>` : ""}</div>
        <button type="button" class="btn principal" data-empezar="${k}" aria-label="Empezar ${escapar(s.nombre)}">Empezar</button></li>`;
    }).join("")}</ul>
    <div class="confirmar" hidden><h3>Antes de empezar</h3><ul>
      <li>Cerrá el cuaderno y guardá todo. Solo lápiz, lapicero y hojas en blanco.</li>
      <li>Tenés <b>${duracion} minutos</b> desde que tocás «Empezar ahora». No hay pausa.</li>
      <li>Si salís de esta página, queda anotado para el adulto.</li>
      <li>Lo abierto (redacción, desarrollo, preguntas orales) se hace en hojas o en voz alta, y lo corrige un adulto con la guía.</li>
      ${simulacros.some(s => s.partes.some(pa => pa.items.some(i => i.t === "oral"))) ? `<li>Las preguntas orales se contestan con <b>un adulto al lado</b> que escuche, o grabándote con otro teléfono para que lo escuche después.</li>` : ""}</ul>
      <button type="button" class="btn principal" data-ahora>Empezar ahora</button> <button type="button" class="btn" data-no>Todavía no</button></div>
  </article>`;
  let elegido = null;
  vista.addEventListener("click", ev => {
    const ver = ev.target.closest("[data-ver]"), emp = ev.target.closest("[data-empezar]");
    const confirmar = vista.querySelector(".confirmar");
    if (ver) {
      ev.preventDefault();
      ctx.ir({ paso: "simulacro", ver: ver.dataset.ver });
    } else if (emp) {
      elegido = Number(emp.dataset.empezar);
      confirmar.hidden = false;
      confirmar.querySelector("h3").textContent = `Antes de empezar: ${simulacros[elegido].nombre}`;
      confirmar.scrollIntoView({ block: "center" });
      confirmar.querySelector("[data-ahora]").focus({ preventScroll: true });
    } else if (ev.target.closest("[data-no]")) confirmar.hidden = true;
    else if (ev.target.closest("[data-ahora]") && elegido !== null) {
      const s = simulacros[elegido];
      const hoja = { idx: elegido, inicio: new Date().toISOString(), perms: permsPara(entradasDe(s)), respuestas: {}, salidas: 0 };
      ctx.actualizar(pr => P.empezarSimulacro(pr, hoja), `Empezó «${s.nombre}»`);
      ctx.ir({ paso: "simulacro" }, true);
    }
  });
}

/** El simulacro en curso, con el reloj. */
function enCurso(ctx, vista) {
  const { duracion, simulacros } = ctx.contenido;
  let hoja = ctx.prog().simEnCurso;
  const s = simulacros[hoja.idx];
  if (!s) { // el contenido cambió y ese simulacro ya no está
    ctx.actualizar(pr => ({ ...pr, simEnCurso: null }));
    return lista(ctx, vista);
  }
  const entradas = entradasDe(s);
  const ajustada = ajustarHoja(entradas, hoja);
  if (ajustada !== hoja) {
    hoja = ajustada;
    ctx.actualizar(pr => P.guardarSimulacro(pr, hoja));
  }
  const fin = new Date(hoja.inicio).getTime() + duracion * 60e3;
  const entregar = automatico => {
    const c = corregir(entradas, hoja.respuestas);
    const resultado = {
      fin: new Date(Math.min(Date.now(), fin)).toISOString(), automatico,
      pts: c.pts, total: c.total, nota: nota(c.pts, c.total), pendientes: c.pendientes, totalPendiente: c.totalPendiente,
    };
    const k = ctx.prog().simulacros.length;
    ctx.actualizar(pr => P.terminarSimulacro(pr, { ...hoja, ...resultado }),
      `${automatico ? "Se le acabó el tiempo en" : "Entregó"} «${s.nombre}»: ${resultado.nota}${c.pendientes ? " (falta corregir lo abierto)" : ""}`);
    ctx.ir({ paso: "simulacro", ver: String(k) }, true);
  };
  if (Date.now() >= fin) { entregar(true); return undefined; }
  vista.innerHTML = `<div class="barra-reloj" role="timer" aria-live="off"><span class="tiempo">⏱ <b data-tiempo></b></span>
      <span class="contador"></span><button type="button" class="btn principal" data-entregar>Entregar</button></div>
    <article class="hoja simulacro">
      <header class="examen"><p class="sobre">Simulacro de convocatoria · 8° año</p><h2>${escapar(ctx.meta.nombre)}: ${escapar(s.nombre)}</h2>
        <p>Valor total: <b>${totalDe(s)} puntos</b> · Tiempo: <b>${duracion} minutos</b> · Cuaderno cerrado.</p></header>
      <div class="preguntas">${pintarParaContestar(entradas, hoja)}</div>
      <footer class="entregar"><button type="button" class="btn principal" data-entregar>Entregar</button>
        <div class="confirmar" hidden><p data-pregunta></p><button type="button" class="btn principal" data-si>Sí, entregar</button> <button type="button" class="btn" data-no>Seguir</button></div>
      </footer></article>`;
  const tiempo = vista.querySelector("[data-tiempo]"), barra = vista.querySelector(".barra-reloj");
  const contar = () => {
    const faltan = sinContestar(entradas, hoja.respuestas).length, total = entradas.filter(e => e.item.t !== "lectura").length;
    vista.querySelector(".contador").textContent = `${total - faltan}/${total}`;
  };
  // Para los lectores de pantalla (el reloj no se anuncia cada segundo): avisos a los 10, 5 y 1 minutos
  const avisados = new Set();
  const tic = () => {
    const quedan = (fin - Date.now()) / 1000;
    tiempo.textContent = reloj(quedan);
    barra.classList.toggle("poco", quedan <= 600);
    for (const min of [10, 5, 1]) {
      if (quedan <= min * 60 && quedan > (min - 1) * 60 && !avisados.has(min)) {
        avisados.add(min);
        ctx.avisar(`Queda${min === 1 ? "" : "n"} ${min} minuto${min === 1 ? "" : "s"}.`);
      }
    }
    if (quedan <= 0) { parar(); entregar(true); }
  };
  const intervalo = setInterval(tic, 1000);
  const salir = () => {
    if (document.visibilityState !== "hidden") return;
    hoja = { ...hoja, salidas: (hoja.salidas || 0) + 1 };
    ctx.actualizar(pr => P.guardarSimulacro(pr, hoja), `Salió de la página durante «${s.nombre}»`);
  };
  document.addEventListener("visibilitychange", salir);
  const callar = conectarOrales(vista, entradas);
  const parar = () => { clearInterval(intervalo); document.removeEventListener("visibilitychange", salir); callar(); };
  tic();
  contar();
  const cambio = ev => {
    if (!ev.target.dataset.clave) return;
    hoja = { ...hoja, respuestas: leerControl(ev.target, entradas, hoja.respuestas) };
    ctx.actualizar(pr => P.guardarSimulacro(pr, hoja));
    contar();
  };
  vista.addEventListener("input", cambio);
  vista.addEventListener("change", cambio);
  sinPegar(vista, ctx.avisar);
  vista.addEventListener("click", ev => {
    const confirmar = vista.querySelector(".confirmar");
    if (ev.target.closest("[data-entregar]")) {
      const faltan = sinContestar(entradas, hoja.respuestas).length;
      confirmar.querySelector("[data-pregunta]").textContent = faltan
        ? `Dejaste ${faltan} ${faltan === 1 ? "pregunta" : "preguntas"} en blanco. ¿Entregar igual? Después no se puede cambiar nada.`
        : "¿Entregar? Después no se puede cambiar nada.";
      confirmar.hidden = false;
      confirmar.scrollIntoView({ block: "center" });
      confirmar.querySelector("[data-si]").focus({ preventScroll: true });
    } else if (ev.target.closest("[data-no]")) confirmar.hidden = true;
    else if (ev.target.closest("[data-si]")) { parar(); entregar(false); }
  });
  return parar;
}

/** Un simulacro ya entregado: la nota, la corrección y, para el adulto, la guía de lo abierto. */
function entregado(ctx, vista, k) {
  const { simulacros, duracion } = ctx.contenido;
  let conClave = false; // lo abierto solo lo marca el adulto, con su clave
  const pintarlo = () => {
    const guardado = ctx.prog().simulacros[k], s = guardado && simulacros[guardado.idx];
    if (!s) { vista.innerHTML = `<article class="hoja"><p>Ese simulacro no está.</p></article>`; return; }
    const entradas = entradasDe(s);
    const h = { ...guardado, ...ajustarHoja(entradas, guardado), respuestas: guardado.respuestas || {}, marcas: guardado.marcas || {} };
    const abiertas = entradas.some(e => e.item.t === "abierta" || e.item.t === "oral");
    const c = corregir(entradas, h.respuestas, h.marcas);
    const n = nota(c.pts, c.total);
    const minutos = Math.round((new Date(h.fin) - new Date(h.inicio)) / 60e3);
    vista.innerHTML = `<article class="hoja simulacro revisada">
      <header><p class="sobre">${escapar(s.nombre)} · entregado ${escapar(cuando(h.fin))}</p>
        <div class="resultado"><p class="sello ${n >= MINIMA ? "aprueba" : "reprueba"}" aria-label="Nota ${n}">${n}</p>
          <div><h2>${c.pts} de ${c.total} puntos${c.pendientes ? " (provisional)" : ""}</h2>
            <p>${c.pendientes ? `Falta que <b>un adulto</b> corrija ${c.pendientes} ${c.pendientes === 1 ? "pregunta abierta u oral" : "preguntas abiertas u orales"} (${c.totalPendiente} puntos) con la guía de cada una.` : n >= MINIMA ? "Con esta nota aprobaría." : `Con esta nota no aprobaría (mínimo ${MINIMA}).`}</p>
            <p class="datos">Tiempo usado: ${Math.min(minutos, duracion)} de ${duracion} min${h.automatico ? " (se acabó el tiempo)" : ""} · Salió de la página: ${h.salidas || 0} ${h.salidas === 1 ? "vez" : "veces"}</p></div></div>
        <p class="instr deber"><b>Ahora:</b> en el cuaderno, por cada ✗ copiá la pregunta, la respuesta correcta y el porqué. Después volvé a la materia de esos temas.</p>
        ${abiertas && !conClave ? pedirClave(ctx.estado(), "corregir", "Para corregir lo abierto, clave del adulto:") : ""}
      </header>
      <div class="preguntas">${pintarCorregida(entradas, h, h.marcas, c, { leyenda: "Para el adulto: marcá lo que se cumplió (1 punto cada uno):", bloqueada: !conClave })}</div>
      <footer class="acciones"><a class="btn principal" href="?m=${ctx.meta.id}&paso=simulacro" data-lista>Volver a los simulacros</a></footer></article>`;
  };
  pintarlo();
  escucharClave(vista, ctx.estado, () => {
    conClave = true;
    pintarlo();
    ctx.avisar("Listo: ya podés marcar la guía de cada pregunta abierta u oral.");
    vista.querySelector("[data-guia]")?.focus();
  });
  vista.addEventListener("change", ev => {
    const guia = ev.target.closest("[data-guia]");
    if (!guia || !conClave) return;
    const clave = guia.dataset.guia, h = ctx.prog().simulacros[k], s = simulacros[h.idx];
    const marcas = { ...h.marcas, [clave]: marcasDe(vista, clave) };
    const c = corregir(entradasDe(s), h.respuestas, marcas);
    ctx.actualizar(pr => P.marcarGuiaSimulacro(pr, k, clave, marcas[clave], { pts: c.pts, total: c.total, nota: nota(c.pts, c.total), pendientes: c.pendientes, totalPendiente: c.totalPendiente }),
      c.pendientes ? "" : `Un adulto terminó de corregir «${s.nombre}»: ${nota(c.pts, c.total)}`);
    ctx.conservarFoco(ctx.selectorDe(guia), pintarlo);
  });
  vista.addEventListener("click", ev => {
    if (!ev.target.closest("[data-lista]")) return;
    ev.preventDefault();
    ctx.ir({ paso: "simulacro" });
  });
}

/** @returns {(() => void) | undefined} limpieza al salir de la vista */
export function vistaSimulacro(ctx, vista, params) {
  const p = ctx.prog();
  if (p.simEnCurso) return enCurso(ctx, vista);
  const ver = params.get("ver");
  if (ver !== null && p.simulacros[Number(ver)]) return entregado(ctx, vista, Number(ver));
  if (!P.simulacroAbierto(p, ctx.contenido.temas)) return cerrado(ctx, vista);
  return lista(ctx, vista);
}

