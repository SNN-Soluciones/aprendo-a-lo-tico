// 🧩 Lo que toda página del sitio tiene que traer, para que una página nueva no se olvide de nada.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RAIZ, RUTAS } from "../sitio.mjs";

const html = Object.fromEntries(RUTAS.map(r => [r, readFileSync(join(RAIZ, r), "utf8")]));
const sinEsto = (patron) => RUTAS.filter(r => !patron.test(html[r]));

test("cada página carga la letra propia (css/fuentes.css)", () => {
  assert.deepEqual(sinEsto(/<link rel="stylesheet" href="(\.\.\/|\/)?css\/fuentes\.css">/), []);
});

test("cada página cuenta su visita con js/analitica.js (sin cookies)", () => {
  assert.deepEqual(sinEsto(/<script type="module" src="(\.\.\/|\/)?js\/analitica\.js"><\/script>/), []);
});

test("ninguna página carga scripts, estilos ni letras de otro sitio", () => {
  // Arrange: <script src>, <link href> (menos canonical, que es la dirección de la propia página) y url() en estilos
  const deAfuera = r => [
    ...html[r].matchAll(/<script\b[^>]*\ssrc="(https?:)?\/\/[^"]+"/g),
    ...[...html[r].matchAll(/<link\b[^>]*>/g)].filter(([t]) => !/rel="canonical"/.test(t) && /href="(https?:)?\/\//.test(t)),
    ...html[r].matchAll(/url\(\s*["']?(https?:)?\/\//g),
  ];
  // Act + Assert
  assert.deepEqual(RUTAS.filter(r => deAfuera(r).length), []);
});

test("Acerca de y Privacidad están enlazadas desde el inicio", () => {
  assert.match(html["index.html"], /href="acerca\.html"/);
  assert.match(html["index.html"], /href="privacidad\.html"/);
});
