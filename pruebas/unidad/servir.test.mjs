import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { request } from "node:http";
import { crearServidor } from "../../scripts/servir.mjs";

let servidor, puerto;
before(async () => {
  servidor = crearServidor();
  await new Promise(listo => servidor.listen(0, "127.0.0.1", listo));
  puerto = servidor.address().port;
});
after(() => servidor.close());

/** GET con la ruta tal cual (fetch normaliza «..» y no deja probar el escape de public/). */
const pedir = ruta => new Promise((listo, falla) => {
  request({ host: "127.0.0.1", port: puerto, path: ruta }, res => {
    let cuerpo = "";
    res.on("data", c => (cuerpo += c)).on("end", () => listo({ estado: res.statusCode, tipo: res.headers["content-type"], cabeceras: res.headers, cuerpo }));
  }).on("error", falla).end();
});

test("sirve las páginas y los módulos con su tipo", async () => {
  assert.deepEqual((({ estado, tipo }) => ({ estado, tipo }))(await pedir("/")), { estado: 200, tipo: "text/html; charset=utf-8" });
  assert.equal((await pedir("/js/html.js")).tipo, "text/javascript; charset=utf-8");
  assert.equal((await pedir("/manifest.webmanifest")).tipo, "application/manifest+json");
});

test("lo que no existe responde 404 con la página 404.html", async () => {
  const r = await pedir("/no-existe.js");
  assert.equal(r.estado, 404);
  assert.match(r.cuerpo, /<html/i);
});

test("no deja salir de public/ ni con .. ni con %2e%2e", async () => {
  for (const ruta of ["/../package.json", "/%2e%2e/package.json", "/..%2fpackage.json", "/js/../../package.json"]) {
    const r = await pedir(ruta);
    assert.equal(r.estado, 404, ruta);
    assert.doesNotMatch(r.cuerpo, /"devDependencies"/, ruta);
  }
});

test("una ruta mal codificada responde 400 en vez de 500", async () => {
  assert.equal((await pedir("/%E0%A4%A")).estado, 400);
});

test("manda nosniff para que el navegador no adivine tipos", async () => {
  assert.equal((await pedir("/")).cabeceras["x-content-type-options"], "nosniff");
});
