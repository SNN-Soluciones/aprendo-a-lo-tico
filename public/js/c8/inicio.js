// 🗓️ Inicio de la convocatoria de 8°: las pruebas por fecha, qué toca ahora, cómo va cada materia
// y, para el adulto, el registro de lo que se marcó y entregó (con la hora) y lo que falta corregir.
import { MATERIAS_8 } from "./materias.js";
import * as P from "./progreso.js";
import { cuando, diaDe, enLinea } from "./texto.js";
import { escapar } from "../html.js";
import { MINIMA } from "./revisar.js";

const $ = s => document.querySelector(s);
const contenidos = {};

/** Lo siguiente que tiene que hacer en una materia, según el orden materia → práctica → simulacro. */
function queToca(m, c, p) {
  if (!c) return null;
  const sinMateria = c.temas.find(t => !P.materiaLista(p, t));
  const sinCorregir = c.temas.find(t => P.faltaCorregir(p, t.id).length);
  if (sinCorregir) return { txt: `Corregir en el cuaderno lo que falló en la práctica de «${sinCorregir.titulo}»`, url: `paso=practica&tema=${sinCorregir.id}` };
  const sinPracticar = c.temas.find(t => P.materiaLista(p, t) && (P.mejorNota(p, t.id) ?? -1) < MINIMA);
  if (sinPracticar) return { txt: `Práctica de «${sinPracticar.titulo}»${P.mejorNota(p, sinPracticar.id) !== null ? ` (va con ${P.mejorNota(p, sinPracticar.id)}: necesita ${MINIMA})` : ""}`, url: `paso=practica&tema=${sinPracticar.id}` };
  if (sinMateria) return { txt: `Materia y tareas de cuaderno: «${sinMateria.titulo}»`, url: `paso=materia&tema=${sinMateria.id}` };
  if (p.simEnCurso) return { txt: "Hay un simulacro empezado: el reloj sigue corriendo", url: "paso=simulacro" };
  const hechos = new Set(p.simulacros.map(s => s.idx));
  const falta = c.simulacros.findIndex((_, k) => !hechos.has(k));
  if (falta >= 0) return { txt: `Simulacro: ${c.simulacros[falta].nombre} (${c.duracion} min, cuaderno cerrado)`, url: "paso=simulacro" };
  return { txt: "Repasar lo que falló en los simulacros y repetir el más bajo", url: "paso=simulacro" };
}

function tarjeta(m, estado) {
  const c = contenidos[m.id], p = P.deMateria(estado, m.id);
  const dias = P.diasQueFaltan(m.fecha);
  const paso = queToca(m, c, p);
  let barras = c === null ? `<p class="cargando">No se pudo cargar: revisá la conexión y recargá.</p>` : `<p class="cargando">Cargando…</p>`;
  if (c) {
    const temas = c.temas.length;
    const conMateria = c.temas.filter(t => P.materiaLista(p, t)).length;
    const aprobadas = c.temas.filter(t => (P.mejorNota(p, t.id) ?? -1) >= MINIMA).length;
    const notas = p.simulacros.filter(s => !s.pendientes).map(s => s.nota);
    const barra = (nombre, hecho, total, txt) => `<div class="barra"><span>${nombre}</span>`
      + `<span class="pista" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${hecho}" aria-label="${nombre}"><i style="--p:${total ? hecho / total : 0}"></i></span><b>${txt}</b></div>`;
    barras = barra("Materia", conMateria, temas, `${conMateria}/${temas}`)
      + barra("Práctica", aprobadas, temas, `${aprobadas}/${temas}`)
      + barra("Simulacro", notas.length ? Math.max(...notas) : 0, 100, notas.length ? String(Math.max(...notas)) : "—");
  }
  return `<li class="examen-tarjeta${dias !== null && dias < 0 ? " pasado" : ""}" style="--m:${m.color}">
    <div class="cabeza"><h3><span aria-hidden="true">${m.emoji}</span> ${escapar(m.nombre)}</h3>
      <p class="fecha">${m.fecha ? `${escapar(diaDe(m.fecha))} · ${escapar(m.hora)}` : "Fecha por confirmar"}</p>
      <p class="falta">${escapar(P.cuantoFalta(m.fecha))}</p></div>
    <div class="avance">${barras}</div>
    ${paso ? `<p class="toca"><span>Ahora toca:</span> <a href="estudio-8.html?m=${m.id}&${paso.url}">${enLinea(paso.txt)}</a></p>` : ""}
    ${m.lleva.length ? `<ul class="lleva">${m.lleva.map(l => `<li>${enLinea(l)}</li>`).join("")}</ul>` : ""}
    <a class="btn principal" href="estudio-8.html?m=${m.id}">Estudiar ${escapar(m.nombre)}</a></li>`;
}

function proximo() {
  const futuras = MATERIAS_8.filter(m => m.fecha && P.diasQueFaltan(m.fecha) >= 0);
  if (!futuras.length) return "";
  const m = futuras[0];
  const mismoDia = futuras.filter(x => P.diasQueFaltan(x.fecha) === P.diasQueFaltan(m.fecha));
  return `<p class="proxima"><span class="grande">${escapar(P.cuantoFalta(m.fecha))}</span>
    <span>para ${mismoDia.map(x => `<b>${escapar(x.nombre)}</b> (${escapar(x.hora)})`).join(" y ")}, ${escapar(diaDe(m.fecha))}.</span></p>`;
}

function paraElAdulto(estado) {
  const pendientes = MATERIAS_8.flatMap(m => P.deMateria(estado, m.id).simulacros
    .map((s, k) => ({ m, s, k })).filter(({ s }) => s.pendientes));
  const nombre = id => MATERIAS_8.find(m => m.id === id)?.nombre || id;
  const registro = [...estado.registro].reverse().slice(0, 80);
  return `<h2>Para el adulto</h2>
    <ul class="como-revisar">
      <li><b>El cuaderno manda.</b> Cada tarea marcada queda con la hora: pedile el cuaderno y revisá que esté hecha a mano, completa y con fecha.</li>
      <li><b>Prácticas:</b> nada se corrige hasta que entrega; lo que falla lo tiene que corregir en el cuaderno antes de repetir. Para abrir el simulacro necesita ${MINIMA} o más en cada práctica.</li>
      <li><b>Simulacros:</b> lo que se corrige solo da una nota provisional. Las preguntas abiertas y orales las corregís vos con la guía de cada una, y ahí queda la nota final.</li>
      <li>Si en el simulacro dice que salió de la página, preguntale a dónde fue.</li>
    </ul>
    ${pendientes.length ? `<h3>Por corregir</h3><ul class="pendientes">${pendientes.map(({ m, s, k }) =>
      `<li><a href="estudio-8.html?m=${m.id}&paso=simulacro&ver=${k}">${escapar(m.nombre)}: simulacro del ${escapar(cuando(s.fin))} (${s.pendientes} preguntas)</a></li>`).join("")}</ul>` : ""}
    <h3>Tu clave</h3>
    ${estado.clave
      ? `<p>✓ Ya creaste tu clave. Se pide para abrir un simulacro antes de tiempo, para corregir lo abierto de los simulacros y para borrar el avance.</p>
        <details><summary>Cambiar la clave</summary>
          <form class="llave" id="cambiar-clave"><label>Clave actual <input type="password" inputmode="numeric" autocomplete="off" name="actual"></label>
          <label>Clave nueva <input type="password" inputmode="numeric" autocomplete="off" name="nueva"></label>
          <button class="btn" type="submit">Cambiar</button></form></details>`
      : `<p>Creá una clave de <b>4 a 8 números</b> que ella no sepa. Se va a pedir para abrir un simulacro antes de tiempo,
        para corregir lo abierto de los simulacros y para borrar el avance.</p>
        <form class="llave" id="crear-clave"><label>Clave <input type="password" inputmode="numeric" autocomplete="off" name="nueva"></label>
        <label>Otra vez <input type="password" inputmode="numeric" autocomplete="off" name="otra"></label>
        <button class="btn" type="submit">Crear clave</button></form>`}
    <p class="llave-msg" id="clave-msg" role="status" aria-live="polite"></p>
    <h3>Registro</h3>
    ${registro.length ? `<ol class="registro">${registro.map(r => `<li><time datetime="${escapar(r.f)}">${escapar(cuando(r.f))}</time> <b>${escapar(nombre(r.m))}</b> ${escapar(r.x)}</li>`).join("")}</ol>`
      : `<p>Todavía no hay nada.</p>`}
    <details class="borrar"><summary>Borrar todo el avance</summary>
      <p>Se borra todo lo de este navegador: tareas marcadas, prácticas, simulacros y el registro (la clave queda). No se puede deshacer.
      ${estado.clave ? "Para confirmar, escribí tu clave." : "Para confirmar, escribí <b>BORRAR</b>."}</p>
      <form id="borrar"><input type="${estado.clave ? "password" : "text"}" id="borrar-texto" autocomplete="off" aria-label="${estado.clave ? "Clave del adulto" : "Escribí BORRAR para confirmar"}">
      <button type="submit" class="btn">Borrar</button> <span id="borrar-msg" role="status" aria-live="polite"></span></form></details>`;
}

/** Las tarjetas de las pruebas (sin tocar «Para el adulto», donde puede estar escribiendo). */
function pintarPruebas() {
  const estado = P.leer();
  $("#proxima").innerHTML = proximo();
  $("#examenes").innerHTML = MATERIAS_8.map(m => tarjeta(m, estado)).join("");
}

function pintar() {
  pintarPruebas();
  $("#adulto").innerHTML = paraElAdulto(P.leer());
}

const decir = (id, texto) => { const el = $(id); if (el) el.textContent = texto; };
const CLAVE_VALIDA = /^\d{4,8}$/;

document.addEventListener("submit", async ev => {
  const f = ev.target;
  if (!["crear-clave", "cambiar-clave", "borrar"].includes(f.id)) return;
  ev.preventDefault();
  const estado = P.leer();
  if (f.id === "borrar") {
    const texto = $("#borrar-texto").value.trim();
    const ok = estado.clave ? await P.claveCorrecta(estado, texto) : texto === "BORRAR";
    if (!ok) {
      decir("#borrar-msg", estado.clave ? "Esa no es la clave." : "Escribí BORRAR, en mayúsculas.");
      $("#borrar-texto").focus();
      return;
    }
    P.guardar({ ...P.vacio(), clave: estado.clave || null });
    pintar();
    return;
  }
  const nueva = f.elements.nueva.value.trim();
  if (!CLAVE_VALIDA.test(nueva)) return decir("#clave-msg", "La clave tiene que ser de 4 a 8 números.");
  if (f.id === "crear-clave" && nueva !== f.elements.otra.value.trim()) return decir("#clave-msg", "Las dos claves no coinciden.");
  if (f.id === "cambiar-clave" && !(await P.claveCorrecta(estado, f.elements.actual.value))) return decir("#clave-msg", "La clave actual no es esa.");
  P.guardar(P.conClave(P.leer(), await P.huella(nueva)));
  pintar();
  decir("#clave-msg", "Clave guardada.");
});

pintar();
Promise.all(MATERIAS_8.map(async m => {
  try {
    contenidos[m.id] = (await m.cargar()).default;
  } catch {
    contenidos[m.id] = null;
  }
})).then(pintarPruebas);
addEventListener("pageshow", ev => { if (ev.persisted) pintar(); });
