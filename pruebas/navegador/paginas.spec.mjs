// 🎮 Cada página del sitio (los juegos y las generales) abre sin errores, y cada juego arranca su primera ronda.
// Falla con cualquier error de consola, excepción, bloqueo de la CSP o archivo propio que no cargue,
// y si la página pide un archivo que no está en la lista del service worker (se rompería sin internet).
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RAIZ, RUTAS, guardadoSinInternet } from "../sitio.mjs";

/** Junta todo lo que salga mal en la página mientras se usa, y cada archivo propio que pidió. */
function vigilar(page, origen) {
  const problemas = [], pedidos = new Set();
  const propio = url => new URL(url).origin === origen;
  page.on("console", m => { if (m.type() === "error") problemas.push(`consola: ${m.text()}`); });
  page.on("pageerror", e => problemas.push(`excepción: ${e.message}`));
  page.on("request", r => { if (propio(r.url())) pedidos.add(new URL(r.url()).pathname); });
  page.on("response", r => { if (propio(r.url()) && r.status() >= 400) problemas.push(`${r.status()}: ${r.url()}`); });
  page.on("requestfailed", r => problemas.push(`no cargó: ${r.url()} (${r.failure()?.errorText})`));
  return { problemas, pedidos };
}

test.beforeEach(async ({ page }) => {
  // Google Fonts sin internet: una hoja vacía (se usa la fuente del sistema), así la prueba no depende de la red
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: "text/css", body: "" }));
  // Las violaciones de la CSP también se anotan desde la página, con qué se bloqueó
  await page.addInitScript(() => {
    window.__csp = [];
    document.addEventListener("securitypolicyviolation", e => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
});

for (const ruta of RUTAS) {
  const esJuego = readFileSync(join(RAIZ, ruta), "utf8").includes(`id="startBtn"`);
  test(`abre sin errores${esJuego ? " y arranca" : ""}: ${ruta}`, async ({ page, baseURL }) => {
    // Arrange
    const { problemas, pedidos } = vigilar(page, new URL(baseURL).origin);
    // Act
    const respuesta = await page.goto(ruta);
    expect(respuesta?.status(), "la página misma").toBe(200);
    if (esJuego) {
      await expect(page.locator("#startBtn")).toBeVisible();
      await page.locator("#startBtn").click();
      await expect(page.locator("#start")).toBeHidden();
    }
    await page.waitForLoadState("networkidle");
    // Assert
    expect(await page.evaluate(() => window.__csp)).toEqual([]);
    expect(problemas).toEqual([]);
    expect([...pedidos].filter(p => !guardadoSinInternet(p)), "pedidos que no están en SHELL de sw.js").toEqual([]);
    await expect(page.locator("body")).not.toBeEmpty();
  });
}
