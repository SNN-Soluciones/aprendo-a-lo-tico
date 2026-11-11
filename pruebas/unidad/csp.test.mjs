import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { scriptsInline, hashDe, politica, conPolitica, politicaDe, paginas } from "../../scripts/csp.mjs";

const sha = t => `'sha256-${createHash("sha256").update(t, "utf8").digest("base64")}'`;
const PAGINA = `<!DOCTYPE html>
<html lang="es-CR">
<head>
<meta charset="UTF-8">
<title>Prueba</title>
<script src="js/externo.js"></script>
</head>
<body>
<script type="module">
  import { hablar } from "./js/voz.js";
  hablar("¡Pura vida!");
</script>
<script>if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");</script>
</body>
</html>
`;

test("scriptsInline devuelve solo los scripts sin src, con su texto exacto", () => {
  // Act
  const scripts = scriptsInline(PAGINA);
  // Assert
  assert.equal(scripts.length, 2);
  assert.equal(scripts[0], `\n  import { hablar } from "./js/voz.js";\n  hablar("¡Pura vida!");\n`);
  assert.ok(scripts[1].startsWith(`if ("serviceWorker"`));
});

test("hashDe calcula el sha256 en base64 del texto en UTF-8, como el navegador", () => {
  assert.equal(hashDe("¡Pura vida! 🦥"), sha("¡Pura vida! 🦥"));
});

test("hashDe trata igual los saltos de línea CRLF y LF (el navegador los normaliza)", () => {
  assert.equal(hashDe("a\r\nb"), hashDe("a\nb"));
});

test("politica permite los scripts propios y solo los inline con hash, nunca 'unsafe-inline'", () => {
  // Act
  const p = politica(["'sha256-AAA='", "'sha256-BBB='"]);
  // Assert
  assert.match(p, /script-src 'self' 'sha256-AAA=' 'sha256-BBB=';/);
  assert.doesNotMatch(p.match(/script-src[^;]*/)[0], /unsafe-inline|unsafe-eval/);
  assert.match(p, /object-src 'none'/);
  assert.match(p, /base-uri 'self'/);
  assert.match(p, /font-src 'self' https:\/\/fonts\.gstatic\.com/);
  assert.match(p, /form-action 'self';/);
});

test("politica solo deja mandar formularios a FormSubmit en la página que lo usa", () => {
  // Arrange
  const sugerencias = PAGINA.replace("</body>", `<p><a href="https://formsubmit.co/">FormSubmit</a></p>\n</body>`);
  // Act + Assert
  assert.match(politicaDe(conPolitica(sugerencias)), /form-action 'self' https:\/\/formsubmit\.co;/);
  assert.match(politicaDe(conPolitica(PAGINA)), /form-action 'self';/);
});

test("scriptsInline cuenta como inline un script con data-src (no es src)", () => {
  assert.equal(scriptsInline(`<script data-src="x">hola()</script>`).length, 1);
});

test("conPolitica falla en vez de adivinar si hay un <script> que no sabe leer", () => {
  // Arrange: «</script >» con espacio hace que dos scripts se lean como uno
  const rara = PAGINA.replace("</body>", `<script>a()</script ><script>b()</script>\n</body>`);
  // Act + Assert
  assert.throws(() => conPolitica(rara), /script/);
});

test("todas las páginas del sitio tienen la CSP al día (si no, corré npm run csp)", () => {
  // Act
  const desactualizadas = paginas().filter(ruta => { const html = readFileSync(ruta, "utf8"); return conPolitica(html) !== html; });
  // Assert
  assert.deepEqual(desactualizadas, []);
});

test("politica sin scripts inline deja script-src solo en 'self'", () => {
  assert.match(politica([]), /script-src 'self';/);
});

test("conPolitica pone la meta CSP justo después del charset, antes de cualquier script", () => {
  // Act
  const html = conPolitica(PAGINA);
  // Assert
  const meta = html.indexOf(`<meta http-equiv="Content-Security-Policy"`);
  assert.ok(meta > html.indexOf(`<meta charset="UTF-8">`));
  assert.ok(meta < html.indexOf("<script"));
  for (const s of scriptsInline(PAGINA)) assert.ok(politicaDe(html).includes(sha(s)), "falta un hash");
});

test("conPolitica reemplaza una política vieja en vez de agregar otra", () => {
  // Arrange
  const vieja = PAGINA.replace(`<meta charset="UTF-8">\n`, `<meta charset="UTF-8">\n<meta http-equiv="Content-Security-Policy" content="default-src *">\n`);
  // Act
  const html = conPolitica(vieja);
  // Assert
  assert.equal(html.match(/Content-Security-Policy/g).length, 1);
  assert.doesNotMatch(html, /default-src \*/);
});

test("conPolitica no toca el texto de los scripts (si no, los hashes no coincidirían)", () => {
  assert.deepEqual(scriptsInline(conPolitica(PAGINA)), scriptsInline(PAGINA));
});

test("conPolitica es estable: aplicarla dos veces da lo mismo", () => {
  const una = conPolitica(PAGINA);
  assert.equal(conPolitica(una), una);
});

test("politicaDe devuelve null si la página no tiene CSP", () => {
  assert.equal(politicaDe(PAGINA), null);
});
