import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { relative } from "node:path";
import { conMetadatos, esperadaDe, SIN_COMPARTIR, IMAGEN } from "../../scripts/compartir.mjs";
import { paginas } from "../../scripts/csp.mjs";
import { RAIZ } from "../sitio.mjs";

const SITIO = "https://aprendoalotico.cr";
const PAGINA = `<!DOCTYPE html>
<html lang="es-CR">
<head>
<meta charset="UTF-8">
<title>Aprendo la hora · Aprendo a lo Tico</title>
<meta name="description" content="Leé la hora &quot;a lo tico&quot;.">
</head>
<body></body>
</html>
`;
const meta = (html, prop) => html.match(new RegExp(`<meta (?:property|name)="${prop}" content="([^"]*)">`))?.[1];

test("pone título, descripción, dirección e imagen absolutas para WhatsApp y Facebook", () => {
  // Act
  const html = conMetadatos(PAGINA, { ruta: "juegos/reloj.html", sitio: SITIO });
  // Assert
  assert.equal(meta(html, "og:title"), "Aprendo la hora · Aprendo a lo Tico");
  assert.equal(meta(html, "og:description"), "Leé la hora &quot;a lo tico&quot;.");
  assert.equal(meta(html, "og:url"), `${SITIO}/juegos/reloj.html`);
  assert.equal(meta(html, "og:image"), `${SITIO}/${IMAGEN.ruta}`);
  assert.equal(meta(html, "twitter:card"), "summary_large_image");
  assert.match(html, new RegExp(`<link rel="canonical" href="${SITIO}/juegos/reloj.html">`));
});

test("el inicio comparte la dirección del sitio, sin index.html", () => {
  assert.equal(meta(conMetadatos(PAGINA, { ruta: "index.html", sitio: SITIO }), "og:url"), `${SITIO}/`);
});

test("un juego sin descripción propia usa la del catálogo, y la agrega también para los buscadores", () => {
  // Arrange
  const sinDescripcion = PAGINA.replace(/<meta name="description"[^>]*>\n/, "");
  // Act
  const html = conMetadatos(sinDescripcion, { ruta: "juegos/reloj.html", sitio: SITIO });
  // Assert
  assert.match(meta(html, "og:description"), /agujas/);
  assert.equal(meta(html, "description"), meta(html, "og:description"));
});

test("escapa lo que va en los atributos (un título con comillas no rompe el HTML)", () => {
  const html = conMetadatos(PAGINA.replace("Aprendo la hora", `La "hora" & <más>`), { ruta: "x.html", sitio: SITIO });
  assert.equal(meta(html, "og:title"), "La &quot;hora&quot; &amp; &lt;más&gt; · Aprendo a lo Tico");
});

test("es estable: aplicarlo dos veces da lo mismo, y cambiar el sitio reemplaza el bloque", () => {
  // Arrange
  const una = conMetadatos(PAGINA, { ruta: "index.html", sitio: SITIO });
  // Act
  const otra = conMetadatos(una, { ruta: "index.html", sitio: "https://otro.cr" });
  // Assert
  assert.equal(conMetadatos(una, { ruta: "index.html", sitio: SITIO }), una);
  assert.equal(otra.match(/og:url/g).length, 1);
  assert.equal(meta(otra, "og:url"), "https://otro.cr/");
});

test("el sitio tiene que ser una dirección https sin barra al final", () => {
  assert.throws(() => conMetadatos(PAGINA, { ruta: "index.html", sitio: "http://x.cr" }), /https/);
  assert.throws(() => conMetadatos(PAGINA, { ruta: "index.html", sitio: "https://x.cr/" }), /barra/);
});

test("la imagen para compartir existe y tiene el tamaño que dice (1200 × 630)", () => {
  // Arrange
  const png = readFileSync(`${RAIZ}${IMAGEN.ruta}`);
  // Act: el ancho y el alto están en el encabezado IHDR del PNG
  const [ancho, alto] = [png.readUInt32BE(16), png.readUInt32BE(20)];
  // Assert
  assert.deepEqual([ancho, alto], [IMAGEN.ancho, IMAGEN.alto]);
  assert.ok(png.length < 300_000, `pesa ${png.length} bytes: WhatsApp prefiere menos de 300 KB`);
});

test("todas las páginas que se comparten tienen sus metadatos al día (si no, corré npm run compartir)", () => {
  const desactualizadas = paginas()
    .filter(ruta => !SIN_COMPARTIR.has(relative(RAIZ, ruta)))
    .filter(ruta => esperadaDe(ruta) !== readFileSync(ruta, "utf8"));
  assert.deepEqual(desactualizadas, []);
});

test("las páginas que no se comparten existen (si se borra una, que se saque de la lista)", () => {
  for (const p of SIN_COMPARTIR) assert.ok(existsSync(`${RAIZ}${p}`), p);
});
