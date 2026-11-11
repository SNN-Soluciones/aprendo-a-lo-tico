// 📵 Sin internet solo funciona lo que está en la lista SHELL del service worker. Si un juego carga un archivo
// que no está ahí, abre con internet y se rompe sin él. Esto lo revisa siguiendo los import de cada página.
// (La prueba del navegador revisa además cada archivo que de verdad se pidió al jugar, incluidas imágenes y audios.)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname, normalize } from "node:path";
import { RAIZ, RUTAS, SHELL } from "../sitio.mjs";

const sinComentarios = t => t.replace(/^\s*\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "");
/** Archivos propios que carga una página o un módulo: import, <script src> y hojas de estilo. */
function dependencias(archivo) {
  const texto = sinComentarios(readFileSync(join(RAIZ, archivo), "utf8")), urls = [];
  for (const m of texto.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)["']([^"']+)["']/g)) urls.push(m[1]);
  if (archivo.endsWith(".html")) {
    for (const m of texto.matchAll(/<script\b[^>]*\ssrc=["']([^"']+)["']/g)) urls.push(m[1]);
    // <link> con rel y href en cualquier orden
    for (const [tag] of texto.matchAll(/<link\b[^>]*>/g)) {
      if (/\brel=["']stylesheet["']/.test(tag)) urls.push(tag.match(/\bhref=["']([^"']+)["']/)?.[1]);
    }
  }
  return urls.filter(u => u && !/^(https?:)?\/\//.test(u)).map(u => normalize(join(dirname(archivo), u.split(/[?#]/)[0])));
}

test("la lista del service worker tiene archivos", () => {
  assert.ok(SHELL.size > 50, `solo ${SHELL.size}`);
});

test("cada archivo de la lista del service worker existe", () => {
  const noExisten = [...SHELL].filter(a => a !== "./" && !existsSync(join(RAIZ, a)));
  assert.deepEqual(noExisten, []);
});

test("todas las páginas y lo que cargan están en la lista del service worker (para jugar sin internet)", () => {
  // Arrange
  const faltan = new Set(), vistos = new Set();
  const visitar = archivo => {
    if (vistos.has(archivo)) return;
    vistos.add(archivo);
    if (!SHELL.has(archivo)) faltan.add(archivo);
    // vendor/ es código de terceros (Blockly): tiene que estar, pero no se leen sus import
    if (/\.(html|js)$/.test(archivo) && !archivo.startsWith("vendor/") && existsSync(join(RAIZ, archivo))) dependencias(archivo).forEach(visitar);
  };
  // Act
  RUTAS.forEach(visitar);
  // Assert
  assert.deepEqual([...faltan].sort(), []);
});
