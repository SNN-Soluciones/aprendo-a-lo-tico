// 🌐 Servidor estático mínimo para correr el sitio y las pruebas sin instalar nada (no tiene dependencias).
//   node scripts/servir.mjs [puerto]   → http://127.0.0.1:8080
// Solo sirve lo que está dentro de public/, como App Platform; lo que no existe responde con 404.html.
import { createServer } from "node:http";
import { readFile, realpath, stat } from "node:fs/promises";
import { realpathSync } from "node:fs";
import { extname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = realpathSync(fileURLToPath(new URL("../public/", import.meta.url))) + sep;
const TIPOS = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif", ".ico": "image/x-icon",
  ".cur": "image/x-icon", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".woff2": "font/woff2", ".woff": "font/woff",
};

/**
 * Archivo pedido dentro de public/ (siguiendo symlinks, pero sin salir de public/), o null si no hay.
 * @throws {URIError} si la ruta está mal codificada
 */
async function archivoDe(url) {
  const ruta = join(RAIZ, decodeURIComponent(url.split(/[?#]/)[0]));
  const real = await realpath(ruta).catch(() => null);
  if (!real || !(real + sep).startsWith(RAIZ)) return null;
  const info = await stat(real);
  if (info.isFile()) return real;
  return info.isDirectory() ? archivoDe(`${url.split(/[?#]/)[0].replace(/\/?$/, "/")}index.html`) : null;
}

async function responder(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405).end(); return; }
  let ruta;
  try { ruta = await archivoDe(req.url); } catch (e) {
    if (!(e instanceof URIError)) throw e;
    res.writeHead(400).end();
    return;
  }
  const [estado, archivo] = ruta ? [200, ruta] : [404, join(RAIZ, "404.html")];
  const cuerpo = await readFile(archivo);
  res.writeHead(estado, {
    "Content-Type": TIPOS[extname(archivo).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-cache",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(req.method === "HEAD" ? undefined : cuerpo);
}

/** El servidor, sin escuchar todavía (las pruebas lo abren en un puerto libre). */
export const crearServidor = () => createServer((req, res) => responder(req, res).catch(e => {
  console.error(`Error sirviendo ${req.url}:`, e);
  if (!res.headersSent) res.writeHead(500);
  res.end();
}));

// Solo cuando se corre como comando. realpath: por si se llama por un symlink.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const puerto = Number(process.argv[2] || process.env.PUERTO || 8080);
  crearServidor().listen(puerto, "127.0.0.1", () => console.log(`🌐 Aprendo a lo Tico en http://127.0.0.1:${puerto}`));
}
