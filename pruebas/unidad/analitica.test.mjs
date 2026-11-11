import { test } from "node:test";
import assert from "node:assert/strict";
import { urlDeVisita } from "../../public/js/analitica.js";

const NAV = { doNotTrack: null, globalPrivacyControl: false, webdriver: false };
const visita = (cambios = {}) => urlDeVisita({ codigo: "aprendo", ruta: "/juegos/reloj.html", host: "aprendoalotico.cr", nav: NAV, ...cambios });

test("con código, cuenta la visita mandando solo la ruta al pixel de GoatCounter", () => {
  // Act
  const url = new URL(visita());
  // Assert
  assert.equal(url.origin, "https://aprendo.goatcounter.com");
  assert.equal(url.pathname, "/count");
  assert.equal(url.searchParams.get("p"), "/juegos/reloj.html");
  assert.deepEqual([...url.searchParams.keys()].sort(), ["p", "rnd"], "nada de título, referencia, pantalla ni identificadores");
});

test("sin código configurado no cuenta nada", () => {
  assert.equal(visita({ codigo: "" }), null);
  assert.equal(visita({ codigo: undefined }), null);
});

test("un código raro no arma ninguna URL", () => {
  assert.equal(visita({ codigo: "evil.com/x?" }), null);
});

test("si el navegador pide no rastrear (Do Not Track o GPC), no cuenta", () => {
  assert.equal(visita({ nav: { ...NAV, doNotTrack: "1" } }), null);
  assert.equal(visita({ nav: { ...NAV, globalPrivacyControl: true } }), null);
});

test("no cuenta las pruebas automáticas ni lo que se abre en la computadora del que programa", () => {
  assert.equal(visita({ nav: { ...NAV, webdriver: true } }), null);
  assert.equal(visita({ host: "localhost" }), null);
  assert.equal(visita({ host: "127.0.0.1" }), null);
});

test("la ruta va codificada (una ruta rara no rompe la URL)", () => {
  assert.equal(new URL(visita({ ruta: "/juegos/año & más.html" })).searchParams.get("p"), "/juegos/año & más.html");
});
