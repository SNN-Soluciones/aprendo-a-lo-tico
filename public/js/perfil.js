// 👧 Perfiles: quién juega, cuántos años tiene y si ya lee. Con eso el inicio sugiere juegos
// y cada juego sabe por dónde empezar. Todo queda en este dispositivo (localStorage), nada se envía.
//
// Un perfil: { id, nombre, edad, lee: "no" | "poco" | "si", avatar }

const KEY = "alt-perfiles";
export const AVATARES = ["🦥", "🐸", "🐆", "🦜", "🐢", "🦋", "🐬", "🐒", "🦝", "🐊", "🐝", "🦄"];
export const EDADES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const LECTURA = [
  { id: "no", emoji: "🙈", nombre: "Todavía no lee" },
  { id: "poco", emoji: "📖", nombre: "Lee un poquito" },
  { id: "si", emoji: "📚", nombre: "Ya lee solo" },
];

function leerTodo() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { lista: Array.isArray(d.lista) ? d.lista : [], activo: d.activo || null };
  } catch (_) { return { lista: [], activo: null }; }
}
function guardarTodo(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (_) {} }

export const perfiles = () => leerTodo().lista;

/** El perfil que está jugando ahora (o null si no se ha creado ninguno). */
export function perfilActivo() {
  const d = leerTodo();
  return d.lista.find(p => p.id === d.activo) || null;
}

export function usarPerfil(id) {
  const d = leerTodo();
  if (d.lista.some(p => p.id === id)) { d.activo = id; guardarTodo(d); }
}

/** Crea o actualiza un perfil y lo deja activo. Devuelve el perfil guardado. */
export function guardarPerfil({ id, nombre = "", edad, lee = "no", avatar = AVATARES[0] }) {
  const d = leerTodo();
  const p = { id: id || `p${Date.now().toString(36)}`, nombre: String(nombre).trim().slice(0, 20), edad: Number(edad), lee, avatar };
  const i = d.lista.findIndex(x => x.id === p.id);
  if (i >= 0) d.lista[i] = p; else d.lista.push(p);
  d.activo = p.id;
  guardarTodo(d);
  return p;
}

export function borrarPerfil(id) {
  const d = leerTodo();
  d.lista = d.lista.filter(p => p.id !== id);
  if (d.activo === id) d.activo = d.lista[0]?.id || null;
  guardarTodo(d);
  try { localStorage.removeItem(`alt-escalera-${id}`); } catch (_) {}
}

/** Grados que suelen tener los niños de esa edad (0 = Preparatoria). En Costa Rica se entra a 1° con 6 años y medio. */
export function gradosParaEdad(edad) {
  if (edad <= 5) return [0];
  const g = Math.min(6, edad - 6);
  return g >= 6 ? [6] : [g, g + 1];
}

/** Edades de un juego: las que dice el catálogo o, si no, las de sus grados. */
export const edadesDe = j => j.edad || [j.grados[0] + 5, j.grados[j.grados.length - 1] + 7];

/**
 * Juegos para un perfil. Si no lee, solo los que se juegan escuchando y mirando (leer: "no");
 * si lee un poquito, también los de leer poco. Primero los que le quedan más justos a la edad
 * (la edad más cerca del centro del rango del juego).
 * @returns {{ juegos: object[], conAyuda: object[] }} conAyuda: los que necesitan a un adulto que lea
 */
export function juegosPara(juegos, perfil) {
  const deSuEdad = juegos.filter(j => { const [a, b] = edadesDe(j); return perfil.edad >= a && perfil.edad <= b; });
  const nivel = { no: 0, poco: 1, si: 2 };
  const puede = j => nivel[j.leer || "si"] <= nivel[perfil.lee];
  const lejos = j => { const [a, b] = edadesDe(j); return Math.abs((a + b) / 2 - perfil.edad); };
  const orden = (a, b) => lejos(a) - lejos(b);
  return {
    juegos: deSuEdad.filter(puede).sort(orden),
    conAyuda: perfil.lee === "si" ? [] : deSuEdad.filter(j => !puede(j)).sort(orden),
  };
}
