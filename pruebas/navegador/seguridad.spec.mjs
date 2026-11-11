// 🛡️ Las dos defensas contra HTML metido a la fuerza, en el navegador de verdad:
// escapar() muestra el texto tal cual, y si algo se cuela igual, la CSP no deja correr su código.
import { test, expect } from "@playwright/test";

const ATAQUE = `<img src=x onerror="window.__xss=1">Ana`;

test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: "text/css", body: "" }));
});

test("el nombre del perfil se ve como texto y nunca se ejecuta como HTML", async ({ page }) => {
  // Arrange: un perfil guardado con HTML en el nombre (como podría llegar algún día desde el servidor)
  await page.addInitScript(nombre => {
    localStorage.setItem("alt-perfiles", JSON.stringify({ lista: [{ id: "p1", nombre, edad: 7, lee: "si", avatar: "🦥" }], activo: "p1" }));
  }, ATAQUE);
  // Act
  await page.goto("index.html");
  await page.waitForLoadState("networkidle");
  // Assert
  await expect(page.getByText(ATAQUE).first()).toBeVisible();
  expect(await page.locator("img[src='x']").count()).toBe(0);
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
});

test("en el examen, el nombre se ve como texto en el historial, la hoja, los problemas, la nota y la impresión", async ({ page }) => {
  // Arrange: el nombre (y un examen viejo) guardados con HTML, y window.print apagado para la impresión
  await page.addInitScript(nombre => {
    localStorage.setItem("examen-config", JSON.stringify({ nombre }));
    localStorage.setItem("examen-historial", JSON.stringify([{ fecha: "1/11/2026", nombre, materia: "Matemáticas", grado: 3, nota: 80 }]));
    window.print = () => {};
  }, ATAQUE);
  const sinHtmlColado = async donde => {
    expect(await page.locator("img[src='x']").count(), donde).toBe(0);
    expect(await page.evaluate(() => window.__xss), donde).toBeUndefined();
  };
  // Act + Assert: el historial
  await page.goto("examen.html");
  await expect(page.locator("#historial")).toContainText(ATAQUE);
  await sinHtmlColado("historial");
  // los «Problemas con plata» usan el nombre en el enunciado
  await page.goto("examen.html?materia=mate&grado=3&temas=problemas&empezar");
  await expect(page.locator("#hojaTitulo")).toContainText(ATAQUE);
  await sinHtmlColado("hoja del examen");
  // imprimir (el 🖨️ está mientras el examen sigue abierto)
  await page.locator("#imprimirBtn").click();
  await expect(page.locator("#imprimir")).toContainText(ATAQUE);
  await sinHtmlColado("impresión");
  // entregar (la primera vez avisa que faltan respuestas)
  await page.locator("#entregarBtn").click();
  await page.locator("#entregarBtn").click();
  await expect(page.locator("#resultado")).toContainText(ATAQUE);
  await sinHtmlColado("nota");
});

test("la CSP bloquea un manejador inline aunque el HTML llegue a la página", async ({ page }) => {
  // Arrange
  await page.goto("index.html");
  await page.waitForLoadState("networkidle");
  const bloqueos = page.evaluate(() => new Promise(listo => {
    document.addEventListener("securitypolicyviolation", e => listo(e.violatedDirective), { once: true });
  }));
  // Act: se salta escapar() a propósito
  await page.evaluate(html => document.body.insertAdjacentHTML("beforeend", html), ATAQUE);
  // Assert
  expect(await bloqueos).toMatch(/^script-src/);
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
});

test("la CSP bloquea un <script> inline que no está en la lista de hashes", async ({ page }) => {
  // Arrange
  await page.goto("juegos/reloj.html");
  await page.waitForLoadState("networkidle");
  // Act
  const directiva = await page.evaluate(() => new Promise(listo => {
    document.addEventListener("securitypolicyviolation", e => listo(e.violatedDirective), { once: true });
    const s = document.createElement("script");
    s.textContent = "window.__xss = 1";
    document.head.appendChild(s);
  }));
  // Assert
  expect(directiva).toMatch(/^script-src/);
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
});
