// 💾 Progreso de la convocatoria de 8°: qué tareas de cuaderno marcó (y a qué hora), cómo le fue en cada práctica,
// qué tiene que corregir en el cuaderno y los simulacros. Vive en este navegador (localStorage), nunca sale de aquí.
// Las funciones que cambian algo devuelven un estado nuevo: no tocan el que reciben.
import { MINIMA } from "./revisar.js";

const CLAVE = "c8:v1";
const MAX_REGISTRO = 400;

/**
 * @typedef {{ fecha: string, pts: number, total: number, nota: number }} Intento
 * @typedef {{ orden: number[], perms: Record<string, number[]>, respuestas: Record<string, any>, inicio?: string, idx?: number, salidas?: number }} Hoja
 * @typedef {{ tareas: Record<string, Record<string, string>>, practicas: Record<string, Intento[]>,
 *   corregir: Record<string, { falladas: string[], hechas: string[] }>, hojas: Record<string, Hoja>,
 *   revisadas: Record<string, { respuestas: Record<string, any>, entregada: string, marcas: Record<string, boolean[]> }>,
 *   simulacros: any[], simEnCurso: Hoja|null, desbloqueo: string|null }} Progreso
 * @typedef {{ v: 1, materias: Record<string, Progreso>, registro: { f: string, m: string, x: string }[] }} Estado
 */

/** @returns {Estado} */
export const vacio = () => ({ v: 1, materias: {}, registro: [] });

/** @returns {Progreso} */
export const progresoVacio = () => ({
  tareas: {}, practicas: {}, corregir: {}, hojas: {}, revisadas: {}, simulacros: [], simEnCurso: null, desbloqueo: null,
});

const esObjeto = x => !!x && typeof x === "object" && !Array.isArray(x);

// Si el navegador no deja guardar (almacenamiento bloqueado o lleno), el estado sigue vivo aquí mientras la página
// esté abierta: así no se pierde lo marcado en el clic siguiente.
let sinGuardar = null;

/** Lee el estado guardado; si no hay, está roto o el navegador no deja, arranca vacío. */
export function leer() {
  if (sinGuardar) return sinGuardar;
  try {
    const e = JSON.parse(localStorage.getItem(CLAVE) || "null");
    if (esObjeto(e) && e.v === 1 && esObjeto(e.materias) && Array.isArray(e.registro)) return e;
  } catch { /* sin almacenamiento o JSON roto: se empieza de cero */ }
  return vacio();
}

/** Guarda; devuelve false si el navegador no deja (modo privado, bloqueado, lleno…): ahí queda solo en memoria. */
export function guardar(estado) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
    sinGuardar = null;
    return true;
  } catch {
    sinGuardar = estado;
    return false;
  }
}

/** El progreso de una materia, siempre completo. */
export const deMateria = (estado, id) => ({ ...progresoVacio(), ...(estado.materias[id] || {}) });

/**
 * Estado nuevo con la materia cambiada por `cambio` y, si viene, una línea en el registro para el adulto.
 * @param {Estado} estado @param {string} id @param {(p: Progreso) => Progreso} cambio @param {string} [texto]
 */
export function cambiar(estado, id, cambio, texto, ahora = new Date().toISOString()) {
  const registro = texto ? [...estado.registro, { f: ahora, m: id, x: texto }].slice(-MAX_REGISTRO) : estado.registro;
  return { ...estado, materias: { ...estado.materias, [id]: cambio(deMateria(estado, id)) }, registro };
}

/** Marca o desmarca la tarea `i` del tema (guarda la hora en que la marcó). */
export function marcarTarea(p, temaId, i, hecha, ahora = new Date().toISOString()) {
  const delTema = { ...(p.tareas[temaId] || {}) };
  if (hecha) delTema[i] = ahora;
  else delete delTema[i];
  return { ...p, tareas: { ...p.tareas, [temaId]: delTema } };
}

/** ¿Hizo todas las tareas de cuaderno del tema? */
export const materiaLista = (p, tema) => tema.cuaderno.every((_, i) => !!p.tareas[tema.id]?.[i]);

/** Mejor nota de las prácticas del tema, o null si nunca entregó. */
export function mejorNota(p, temaId) {
  const intentos = p.practicas[temaId] || [];
  return intentos.length ? Math.max(...intentos.map(i => i.nota)) : null;
}

/** Guarda la hoja de práctica en curso del tema (orden, opciones barajadas y respuestas). */
export const guardarHoja = (p, temaId, hoja) => ({ ...p, hojas: { ...p.hojas, [temaId]: hoja } });

/** Entrega la práctica: guarda el intento, lo que tiene que corregir en el cuaderno y la hoja ya revisada. */
export function entregarPractica(p, temaId, { intento, falladas, respuestas, entregada }) {
  const hojas = { ...p.hojas };
  const hoja = hojas[temaId];
  delete hojas[temaId];
  return {
    ...p,
    hojas,
    practicas: { ...p.practicas, [temaId]: [...(p.practicas[temaId] || []), intento] },
    corregir: { ...p.corregir, [temaId]: { falladas, hechas: [] } },
    revisadas: { ...p.revisadas, [temaId]: { ...hoja, respuestas, entregada, marcas: {} } },
  };
}

/** Marca una pregunta como corregida en el cuaderno. */
export function marcarCorregida(p, temaId, clave, hecha) {
  const c = p.corregir[temaId] || { falladas: [], hechas: [] };
  const hechas = hecha ? [...new Set([...c.hechas, clave])] : c.hechas.filter(k => k !== clave);
  return { ...p, corregir: { ...p.corregir, [temaId]: { ...c, hechas } } };
}

/** ¿Le falta corregir algo en el cuaderno antes de volver a practicar ese tema? */
export function faltaCorregir(p, temaId) {
  const c = p.corregir[temaId];
  return c ? c.falladas.filter(k => !c.hechas.includes(k)) : [];
}

/** Las marcas de la guía (abiertas y orales) de la última práctica revisada, y la nota que queda. */
export function marcarGuia(p, temaId, clave, marcas, notaNueva) {
  const r = p.revisadas[temaId];
  if (!r) return p;
  const intentos = [...(p.practicas[temaId] || [])];
  if (intentos.length && notaNueva) intentos[intentos.length - 1] = { ...intentos[intentos.length - 1], ...notaNueva };
  return {
    ...p,
    practicas: { ...p.practicas, [temaId]: intentos },
    revisadas: { ...p.revisadas, [temaId]: { ...r, marcas: { ...r.marcas, [clave]: marcas } } },
  };
}

/** ¿Puede hacer el simulacro? Todas las prácticas con 70 o más alguna vez, o un adulto lo desbloqueó. */
export const simulacroAbierto = (p, temas) => !!p.desbloqueo || temas.every(t => (mejorNota(p, t.id) ?? -1) >= MINIMA);

/** Empieza un simulacro (con la hora de inicio: el reloj sigue aunque cierre la página). */
export const empezarSimulacro = (p, hoja) => ({ ...p, simEnCurso: hoja });

/** Termina el simulacro en curso y lo deja en la lista con su resultado (si ya se entregó en otra pestaña, nada). */
export function terminarSimulacro(p, resultado) {
  if (!p.simEnCurso) return p;
  return { ...p, simEnCurso: null, simulacros: [...p.simulacros, { ...p.simEnCurso, ...resultado, marcas: {} }] };
}

/** Guarda las respuestas o salidas del simulacro en curso, solo si sigue en curso (no lo revive desde otra pestaña). */
export const guardarSimulacro = (p, hoja) => (p.simEnCurso && p.simEnCurso.inicio === hoja.inicio ? { ...p, simEnCurso: hoja } : p);

/** El adulto corrige con la guía una abierta u oral del simulacro `k` (índice en la lista). */
export function marcarGuiaSimulacro(p, k, clave, marcas, notaNueva) {
  const simulacros = p.simulacros.map((s, i) => (i === k ? { ...s, ...notaNueva, marcas: { ...s.marcas, [clave]: marcas } } : s));
  return { ...p, simulacros };
}

/** Días que faltan (en Costa Rica) hasta la fecha; negativo si ya pasó, null si no hay fecha. */
export function diasQueFaltan(fechaIso, ahora = new Date()) {
  if (!fechaIso) return null;
  const dia = d => Math.floor((new Date(d).getTime() - 6 * 3600e3) / 86400e3);
  return dia(fechaIso) - dia(ahora);
}

/** «Es hoy», «Es mañana», «Faltan 9 días», «Ya pasó», «Fecha por confirmar». */
export function cuantoFalta(fechaIso, ahora = new Date()) {
  const d = diasQueFaltan(fechaIso, ahora);
  if (d === null) return "Fecha por confirmar";
  if (d < 0) return "Ya pasó";
  if (d === 0) return "Es hoy";
  if (d === 1) return "Es mañana";
  return `Faltan ${d} días`;
}

/** Huella SHA-256 de la clave del adulto (no se guarda la clave misma). */
export async function huella(texto) {
  const datos = new TextEncoder().encode(`c8:${String(texto).trim()}`);
  try {
    const h = await crypto.subtle.digest("SHA-256", datos);
    return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return `t:${String(texto).trim()}`; // sin crypto.subtle (página sin https): igual sirve para comparar
  }
}

/** ¿Hay clave del adulto y es esta? */
export const claveCorrecta = async (estado, texto) => !!estado.clave && estado.clave === await huella(texto);

/** Estado nuevo con la clave del adulto (la huella). */
export const conClave = (estado, hash) => ({ ...estado, clave: hash });
