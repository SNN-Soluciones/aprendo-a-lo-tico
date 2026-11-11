// 🛡️ Política de seguridad (CSP) de cada página, como <meta> (el sitio es estático: no hay cabeceras propias).
//
// Los scripts inline se permiten uno por uno con su hash sha256, nunca con 'unsafe-inline': así un HTML
// metido a la fuerza (<img onerror=…>, <script>…) no corre aunque se cuele en un innerHTML.
//
//   node scripts/csp.mjs            → pone o actualiza la meta CSP en todas las páginas de public/
//   node scripts/csp.mjs --revisar  → no cambia nada; falla si alguna página no tiene la CSP al día (para la CI)
//
// ⚠️ Cada vez que cambiés un <script> inline de una página, corré `npm run csp`: si no, el navegador lo bloquea.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, realpathSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { CONFIG } from "../public/js/config.js";

const RAIZ = fileURLToPath(new URL("../public/", import.meta.url));
const META = /<meta http-equiv="Content-Security-Policy" content="([^"]*)">\n?/;
const CHARSET = `<meta charset="UTF-8">\n`;
/** Las únicas páginas que mandan su formulario a FormSubmit (que reenvía a cualquier correo). */
export const FORM_SUBMIT = new Set(["sugerencias.html"]);

/** Texto de cada <script> sin src, exactamente como lo hashea el navegador. */
export function scriptsInline(html) {
  // El cierre acepta lo mismo que el navegador: </script>, </script >, </SCRIPT\t>…
  const bloques = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\b[^>]*>/gi)];
  // Si hay más «<script» que bloques leídos, algo raro (un «<script>» escrito dentro de otro script…)
  // haría que un hash no coincida: mejor fallar aquí que bloquear un script en el navegador sin aviso.
  const abiertos = html.match(/<script\b/gi)?.length ?? 0;
  if (abiertos !== bloques.length) throw new Error(`Hay ${abiertos} <script> pero se leyeron ${bloques.length}: revisá cómo están escritos`);
  return bloques.filter(([, attrs]) => !/(^|\s)src\s*=/i.test(attrs)).map(([, , texto]) => texto);
}

/** 'sha256-…' del texto en UTF-8. El navegador pasa los CRLF a LF antes de hashear: aquí también. */
export const hashDe = texto =>
  `'sha256-${createHash("sha256").update(texto.replace(/\r\n?/g, "\n"), "utf8").digest("base64")}'`;

/**
 * La política completa para una página con esos hashes de scripts inline.
 * @param {string[]} hashes
 * @param {{ formSubmit?: boolean, goatcounter?: string }} [op]
 *   formSubmit: la página manda su formulario a FormSubmit (solo sugerencias)
 *   goatcounter: código de la cuenta de GoatCounter (CONFIG.analitica): se permite solo su pixel
 */
export function politica(hashes, { formSubmit = false, goatcounter = "" } = {}) {
  if (goatcounter && !/^[a-z0-9-]+$/.test(goatcounter)) throw new Error(`Código de GoatCounter raro: «${goatcounter}»`);
  return [
    "default-src 'self'",
    `script-src ${["'self'", ...hashes].join(" ")}`,
    // style 'unsafe-inline': los juegos pintan con style="…" y <style> desde JS (no ejecuta código)
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    // data: y blob: para el dibujo de la lapa y la vista previa de las fotos en sugerencias
    `img-src 'self' data: blob:${goatcounter ? ` https://${goatcounter}.goatcounter.com` : ""}`,
    "media-src 'self'",
    "connect-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    // FormSubmit manda a cualquier correo: abierto en todas las páginas, un <form> colado serviría para sacar datos
    `form-action 'self'${formSubmit ? " https://formsubmit.co" : ""}`,
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join("; ") + ";";
}

/** La política que trae la página, o null si no tiene. */
export const politicaDe = html => html.match(META)?.[1] ?? null;

/**
 * La página con su meta CSP al día, justo después del charset (antes de cualquier script).
 * @param {{ formSubmit?: boolean }} [op] lo que esa página necesita además de lo común (ver FORM_SUBMIT)
 */
export function conPolitica(html, op = {}) {
  const p = politica([...new Set(scriptsInline(html).map(hashDe))], op);
  const sinMeta = html.replace(META, "");
  if (!sinMeta.includes(CHARSET)) throw new Error(`La página no tiene ${CHARSET.trim()}`);
  return sinMeta.replace(CHARSET, `${CHARSET}<meta http-equiv="Content-Security-Policy" content="${p}">\n`);
}

/** Todas las páginas del sitio (sin las de vendor/). */
export function paginas(dir = RAIZ) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) return e.name === "vendor" ? [] : paginas(ruta);
    return e.name.endsWith(".html") ? [ruta] : [];
  });
}

/** Cómo tiene que quedar el archivo de esa página (ruta completa) con su CSP al día. */
export const esperadaDe = ruta => conPolitica(readFileSync(ruta, "utf8"), {
  formSubmit: FORM_SUBMIT.has(relative(RAIZ, ruta).split(sep).join("/")),
  goatcounter: CONFIG.analitica?.goatcounter || "",
});

function principal(revisar) {
  const desactualizadas = [];
  for (const ruta of paginas()) {
    const html = readFileSync(ruta, "utf8"), nuevo = esperadaDe(ruta);
    if (nuevo === html) continue;
    desactualizadas.push(relative(RAIZ, ruta));
    if (!revisar) writeFileSync(ruta, nuevo);
  }
  if (!desactualizadas.length) { console.log("🛡️ CSP al día en todas las páginas."); return 0; }
  if (revisar) {
    console.error(`🛡️ CSP desactualizada en ${desactualizadas.length} página(s): ${desactualizadas.join(", ")}\n   Corré: npm run csp`);
    return 1;
  }
  console.log(`🛡️ CSP actualizada en ${desactualizadas.length} página(s).`);
  return 0;
}

// Solo cuando se corre como comando (no al importarlo en las pruebas). realpath: por si se llama por un symlink.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = principal(process.argv.includes("--revisar"));
}
