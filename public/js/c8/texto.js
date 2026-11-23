// 🖋️ Del contenido (texto plano con **negrita** y _cursiva_) a HTML seguro: todo se escapa antes de dar formato.
// Los <svg> de las figuras son nuestros y los revisa pruebas/unidad/c8-contenido.test.mjs (sin scripts ni on…=).
import { escapar } from "../html.js";

/** Una línea con **negrita** y _cursiva_ (los ___ de completar se dejan como están). */
export const enLinea = t => escapar(t)
  .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
  // Después de escapar, las comillas son &quot; y &#39;: por eso antes puede venir «;» y después «&»
  .replace(/(^|[\s(¿¡«;])_([^_\s][^_]*?)_(?=$|[\s).,;:!?»&])/g, "$1<i>$2</i>");

/** Varias líneas (\n) como párrafos. */
export const parrafos = t => String(t).split(/\n+/).filter(l => l.trim()).map(l => `<p>${enLinea(l)}</p>`).join("");

/** Con saltos de línea pero en un solo bloque (ejemplos, versos). */
export const conSaltos = t => String(t).split("\n").map(enLinea).join("<br>");

const figura = (svg, alt) => `<figure class="fig" role="img" aria-label="${escapar(alt || "Figura")}">${svg}</figure>`;
export const figuraDe = (svg, alt) => (svg ? figura(svg, alt) : "");

/** Un bloque de la materia. */
export function bloque(b) {
  switch (b.t) {
    case "h": return `<h4>${enLinea(b.x)}</h4>`;
    case "p": return parrafos(b.x);
    case "lista": return `<ul>${b.x.map(x => `<li>${enLinea(x)}</li>`).join("")}</ul>`;
    case "tabla": return `<div class="tabla"><table><thead><tr>${b.cab.map(c => `<th scope="col">${enLinea(c)}</th>`).join("")}</tr></thead>`
      + `<tbody>${b.filas.map(f => `<tr>${f.map(c => `<td>${conSaltos(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    case "ej": return `<div class="nota-ej"><span class="rotulo">Ejemplo</span>${conSaltos(b.x)}</div>`;
    case "ojo": return `<div class="nota-ojo"><span class="rotulo">Ojo</span>${conSaltos(b.x)}</div>`;
    case "texto": return `<article class="lectura">${b.titulo ? `<h5>${enLinea(b.titulo)}</h5>` : ""}${parrafos(b.x)}</article>`;
    case "svg": return figura(b.x, b.alt);
    default: return "";
  }
}

/** Qué se hace en el cuaderno, según el tipo de tarea. */
export const TAREA = {
  copiar: { emoji: "✍️", nombre: "Copiá" },
  resumir: { emoji: "🗒️", nombre: "Resumí" },
  buscar: { emoji: "🔎", nombre: "Buscá" },
  escribir: { emoji: "✏️", nombre: "Escribí" },
  moverse: { emoji: "🚶", nombre: "Movete" },
  decir: { emoji: "🗣️", nombre: "Decilo en voz alta" },
};

/** Fecha y hora cortas para el registro: «23 nov, 7:42 p. m.». */
export function cuando(iso) {
  try {
    return new Date(iso).toLocaleString("es-CR", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "America/Costa_Rica" });
  } catch {
    return iso;
  }
}

/** «jueves 3 de diciembre». */
export function diaDe(iso) {
  try {
    return new Date(iso).toLocaleDateString("es-CR", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Costa_Rica" });
  } catch {
    return iso;
  }
}
