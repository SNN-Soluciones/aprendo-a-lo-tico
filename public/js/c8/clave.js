// 🔑 Clave del adulto: la piden abrir el simulacro antes de tiempo y corregir lo abierto de un simulacro,
// para que eso no lo pueda hacer la alumna sola. Se crea en el inicio («Para el adulto»); se guarda solo su huella.
import * as P from "./progreso.js";
import { escapar } from "../html.js";

/** El formulario para pedir la clave (o, si todavía no hay, cómo crearla). */
export function pedirClave(estado, id, texto) {
  if (!estado.clave) {
    return `<p class="llave">Para esto hace falta la <b>clave del adulto</b>. Se crea en <a href="convocatoria-8.html#adulto">el inicio, en «Para el adulto»</a>.</p>`;
  }
  return `<form class="llave" data-llave="${escapar(id)}"><label>${escapar(texto)} <input type="password" inputmode="numeric" autocomplete="off" spellcheck="false" data-clave-adulto></label>`
    + ` <button class="btn" type="submit">Seguir</button> <span class="llave-msg" role="status" aria-live="polite"></span></form>`;
}

/** Escucha los formularios de clave dentro de `raiz`; si la clave está bien, llama `alAbrir(id)`. */
export function escucharClave(raiz, leerEstado, alAbrir) {
  raiz.addEventListener("submit", async ev => {
    const f = ev.target.closest("[data-llave]");
    if (!f) return;
    ev.preventDefault();
    const campo = f.querySelector("[data-clave-adulto]");
    if (await P.claveCorrecta(leerEstado(), campo.value)) return alAbrir(f.dataset.llave);
    campo.value = "";
    campo.focus();
    f.querySelector(".llave-msg").textContent = "Esa no es la clave.";
  });
}
