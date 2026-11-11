// 📵 Con el service worker de verdad: se abre el sitio una vez con internet, se corta la red y se sigue jugando.
import { test, expect } from "@playwright/test";

test.use({ serviceWorkers: "allow" });
// El service worker en Playwright es confiable en Chromium; Safari y Firefox se prueban sin él en paginas.spec
test.skip(({ browserName }) => browserName !== "chromium", "service worker solo en Chromium");

const JUEGOS = ["juegos/contar.html", "juegos/bus.html", "juegos/lapa.html"];

test("después de la primera visita, el inicio y los juegos abren y arrancan sin internet", async ({ page, context, baseURL }) => {
  // Arrange: primera visita con internet; el service worker guarda todo
  await page.goto("index.html");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  const problemas = [];
  const propio = url => new URL(url).origin === new URL(baseURL).origin;
  page.on("pageerror", e => problemas.push(`excepción: ${e.message}`));
  page.on("requestfailed", r => { if (propio(r.url())) problemas.push(`no cargó sin internet: ${r.url()}`); });
  // Act: se corta la red
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("body")).not.toBeEmpty();
  for (const juego of JUEGOS) {
    await page.goto(juego);
    await page.locator("#startBtn").click();
    await expect(page.locator("#start"), juego).toBeHidden();
  }
  // Assert
  expect(problemas).toEqual([]);
});
