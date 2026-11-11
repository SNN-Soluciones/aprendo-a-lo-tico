// 🗺️ Lo que las pruebas necesitan saber del sitio: dónde está, qué páginas tiene y qué guarda el service worker.
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { paginas } from "../scripts/csp.mjs";

export const RAIZ = fileURLToPath(new URL("../public/", import.meta.url));

/** Todas las páginas, relativas a public/: "index.html", "juegos/reloj.html"… */
export const RUTAS = paginas().map(p => relative(RAIZ, p)).sort();

/** La lista SHELL de sw.js: lo que queda guardado para jugar sin internet (sin las líneas comentadas). */
export const SHELL = (() => {
  const bloque = readFileSync(join(RAIZ, "sw.js"), "utf8").match(/const SHELL = \[([\s\S]*?)\];/);
  if (!bloque) throw new Error("No encontré «const SHELL = [ … ];» en public/sw.js");
  return new Set([...bloque[1].replace(/^\s*\/\/.*$/gm, "").matchAll(/"([^"]+)"/g)].map(m => m[1]));
})();

/** ¿Esa ruta pedida al servidor (con / al inicio) está guardada para jugar sin internet? */
export const guardadoSinInternet = pathname => pathname === "/" || SHELL.has(decodeURIComponent(pathname.slice(1)));
