// 📚 Materias de la convocatoria de 8° (2° de colegio), en orden de fecha. El contenido de cada una se carga
// solo cuando se abre (import dinámico), así la página de inicio no baja todo.
// La hora es la de Costa Rica (UTC−6). fecha: null = todavía no se sabe.

/**
 * @typedef {{ id: string, nombre: string, emoji: string, color: string, fecha: string|null, hora: string,
 *   lleva: string[], cargar: () => Promise<{ default: any }> }} Materia8
 */

/** @type {Materia8[]} */
export const MATERIAS_8 = [
  {
    id: "ciencias", nombre: "Ciencias", emoji: "🧪", color: "#1E7F5C",
    fecha: "2026-12-03T07:00:00-06:00", hora: "7:00 a. m.",
    lleva: ["Pedí en la fotocopiadora del colegio la práctica de repaso de la profe y hacela completa."],
    cargar: () => import("./ciencias.js"),
  },
  {
    id: "ingles-escrito", nombre: "Inglés escrito", emoji: "📝", color: "#B4432F",
    fecha: "2026-12-03T09:20:00-06:00", hora: "9:20 a 11:20 a. m.",
    lleva: [],
    cargar: () => import("./ingles-escrito.js"),
  },
  {
    id: "espanol", nombre: "Español", emoji: "📚", color: "#6A3FA0",
    fecha: "2026-12-04T09:20:00-06:00", hora: "9:20 a. m.",
    lleva: ["Leé otra vez «Es que somos muy pobres» de Juan Rulfo completo, de tu fotocopia o tu libro."],
    cargar: () => import("./espanol.js"),
  },
  {
    id: "ingles-oral", nombre: "Inglés oral", emoji: "🎤", color: "#1F5FB0",
    fecha: "2026-12-07T09:20:00-06:00", hora: "9:20 a 11:20 a. m.",
    lleva: ["Uniforme completo.", "Cuaderno de comunicaciones.", "Aula 17.", "Toda la materia está en tu cuaderno de inglés: las prácticas orales de clase también cuentan."],
    cargar: () => import("./ingles-oral.js"),
  },
  {
    id: "matematica", nombre: "Matemática", emoji: "📐", color: "#B7791F",
    fecha: null, hora: "",
    lleva: ["La fecha no viene en el temario: preguntala en el colegio."],
    cargar: () => import("./matematica.js"),
  },
];

/** La materia con ese id, o undefined. */
export const materia8 = id => MATERIAS_8.find(m => m.id === id);
