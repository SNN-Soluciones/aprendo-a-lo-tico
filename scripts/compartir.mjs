// 📤 Cómo se ve cada página al compartirla por WhatsApp, Facebook o Telegram: título, descripción, imagen y dirección.
// Las redes no corren JavaScript, así que va escrito en el <head> de cada página, entre dos marcas.
//
//   node scripts/compartir.mjs            → pone o actualiza el bloque en todas las páginas
//   node scripts/compartir.mjs --revisar  → no cambia nada; falla si alguna página no lo tiene al día (para la CI)
//
// La dirección del sitio sale de CONFIG.sitio (js/config.js): al cambiar de dominio, cambiala ahí y corré esto.
import { readFileSync, writeFileSync, realpathSync } from "node:fs";
import { relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { CONFIG } from "../public/js/config.js";
import { JUEGOS } from "../public/js/catalog.js";
import { escapar } from "../public/js/html.js";
import { paginas } from "./csp.mjs";

const RAIZ = fileURLToPath(new URL("../public/", import.meta.url));
const INICIO = "<!-- compartir: lo escribe scripts/compartir.mjs -->", FIN = "<!-- /compartir -->";
const BLOQUE = /<!-- compartir: lo escribe scripts\/compartir\.mjs -->\n[\s\S]*?<!-- \/compartir -->\n/;
const DESCRIPCION = "Juegos educativos gratis, hechos en Costa Rica para el programa del MEP. Sin anuncios, sin cuentas y sin internet.";

/** Páginas que no tiene sentido compartir. */
export const SIN_COMPARTIR = new Set(["404.html", "prueba-voz.html"]);
export const IMAGEN = {
  ruta: "img/compartir.png", ancho: 1200, alto: 630,
  alt: "Aprendo a lo Tico: juegos gratis para aprender, hechos en Costa Rica",
};

/** El texto tal cual, sin las entidades que trae del HTML (para volver a escaparlo una sola vez). */
const sinEntidades = t => t.replace(/&(quot|#39|lt|gt|amp);/g, (_, e) => ({ quot: '"', "#39": "'", lt: "<", gt: ">", amp: "&" })[e]);

/**
 * La página con su bloque para compartir al día, justo después del <title>.
 * @param {string} html
 * @param {{ ruta: string, sitio: string }} op ruta: relativa a public/ ("juegos/reloj.html") · sitio: https://… sin / final
 */
export function conMetadatos(html, { ruta, sitio }) {
  if (!/^https:\/\//.test(sitio)) throw new Error(`CONFIG.sitio tiene que empezar con https://: «${sitio}»`);
  if (sitio.endsWith("/")) throw new Error(`CONFIG.sitio va sin barra al final: «${sitio}»`);
  const limpio = html.replace(BLOQUE, "");
  const titulo = limpio.match(/<title>([\s\S]*?)<\/title>\n/);
  if (!titulo) throw new Error(`${ruta}: no tiene <title>…</title> en su propia línea`);
  const propia = limpio.match(/<meta name="description" content="([^"]*)">/)?.[1];
  const descripcion = propia ? sinEntidades(propia) : JUEGOS.find(j => j.url === ruta)?.descripcion ?? DESCRIPCION;
  const url = `${sitio}/${ruta === "index.html" ? "" : ruta}`;
  const meta = (atributo, nombre, valor) => `<meta ${atributo}="${nombre}" content="${escapar(valor)}">`;
  const lineas = [
    INICIO,
    `<link rel="canonical" href="${escapar(url)}">`,
    ...(propia ? [] : [meta("name", "description", descripcion)]),
    meta("property", "og:type", "website"),
    meta("property", "og:site_name", CONFIG.appName),
    meta("property", "og:locale", "es_CR"),
    meta("property", "og:title", sinEntidades(titulo[1])),
    meta("property", "og:description", descripcion),
    meta("property", "og:url", url),
    meta("property", "og:image", `${sitio}/${IMAGEN.ruta}`),
    meta("property", "og:image:width", String(IMAGEN.ancho)),
    meta("property", "og:image:height", String(IMAGEN.alto)),
    meta("property", "og:image:alt", IMAGEN.alt),
    meta("name", "twitter:card", "summary_large_image"),
    FIN,
  ];
  return limpio.replace(titulo[0], `${titulo[0]}${lineas.join("\n")}\n`);
}

/** Cómo tiene que quedar el archivo de esa página (ruta completa) con sus metadatos al día. */
export const esperadaDe = ruta => {
  const rel = relative(RAIZ, ruta).split(sep).join("/");
  return conMetadatos(readFileSync(ruta, "utf8"), { ruta: rel, sitio: CONFIG.sitio });
};

function principal(revisar) {
  const desactualizadas = [];
  for (const ruta of paginas()) {
    if (SIN_COMPARTIR.has(relative(RAIZ, ruta).split(sep).join("/"))) continue;
    const html = readFileSync(ruta, "utf8"), nuevo = esperadaDe(ruta);
    if (nuevo === html) continue;
    desactualizadas.push(relative(RAIZ, ruta));
    if (!revisar) writeFileSync(ruta, nuevo);
  }
  if (!desactualizadas.length) { console.log("📤 Metadatos para compartir al día en todas las páginas."); return 0; }
  if (revisar) {
    console.error(`📤 Metadatos desactualizados en ${desactualizadas.length} página(s): ${desactualizadas.join(", ")}\n   Corré: npm run compartir`);
    return 1;
  }
  console.log(`📤 Metadatos actualizados en ${desactualizadas.length} página(s).`);
  return 0;
}

// Solo cuando se corre como comando (no al importarlo en las pruebas). realpath: por si se llama por un symlink.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = principal(process.argv.includes("--revisar"));
}
