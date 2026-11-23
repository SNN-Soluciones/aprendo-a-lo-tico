// 📄 Convocatoria de 8°: el orden se respeta (materia → práctica → simulacro), nada se corrige antes de entregar,
// lo fallado se corrige en el cuaderno antes de repetir, y el reloj del simulacro sigue aunque se recargue la página.
import { test, expect } from "@playwright/test";
import { MATERIAS_8 } from "../../public/js/c8/materias.js";

const M = MATERIAS_8[0].id;

/** Contesta todo lo que haya en la hoja con lo primero que encuentre (no importa si está bien). */
async function contestarTodo(page) {
  for (const grupo of await page.locator("section.item fieldset:has(input[type=radio])").all()) await grupo.locator("input[type=radio]").first().check();
  for (const campo of await page.locator("section.item input[type=text]").all()) await campo.fill("1");
  for (const lista of await page.locator("section.item select").all()) await lista.selectOption({ index: 1 });
  for (const c of await page.locator("section.item input[type=checkbox]").all()) await c.check();
}

test("el inicio muestra las pruebas por fecha con qué toca ahora", async ({ page }) => {
  await page.goto("convocatoria-8.html");
  await expect(page.locator(".examen-tarjeta")).toHaveCount(MATERIAS_8.length);
  await expect(page.locator(".examen-tarjeta").first().locator("h3")).toContainText(MATERIAS_8[0].nombre);
  await expect(page.locator(".examen-tarjeta .toca").first()).toBeVisible();
  await expect(page.locator("#adulto h2")).toHaveText("Para el adulto");
});

test("la práctica de un tema se abre solo con las tareas de cuaderno hechas", async ({ page }) => {
  await page.goto(`estudio-8.html?m=${M}`);
  const ir = page.locator("[data-ir-practica]");
  await expect(ir).toHaveAttribute("aria-disabled", "true");
  await expect(page.locator("nav.pasos [data-paso=practica]")).toHaveClass(/cerrado/);
  const tareas = page.locator("[data-tarea]");
  for (const t of await tareas.all()) await t.check();
  await expect(page.locator(".tarea .hora").first()).toBeVisible();
  await expect(ir).not.toHaveAttribute("aria-disabled", "true");
  await ir.click();
  await expect(page).toHaveURL(/paso=practica/);
  await expect(page.locator(".hoja.practica h2")).toHaveText("Contestá todo");
});

test("práctica: no se corrige hasta entregar, y lo fallado se corrige antes de repetir", async ({ page }) => {
  await page.goto(`estudio-8.html?m=${M}`);
  for (const t of await page.locator("[data-tarea]").all()) await t.check();
  await page.locator("[data-ir-practica]").click();
  // Sin pistas ni respuestas a la vista
  await expect(page.locator(".correcta, .porque, .marca")).toHaveCount(0);
  await expect(page.locator("section.item input[type=text]").first()).toHaveAttribute("spellcheck", "false");
  // Entregar con preguntas en blanco no deja
  await page.locator("[data-entregar]").click();
  await expect(page.locator("#aviso")).toContainText(/falta/);
  await contestarTodo(page);
  await page.locator("[data-entregar]").click();
  await page.locator("[data-si]").click();
  await expect(page.locator(".sello")).toBeVisible();
  await expect(page.locator(".porque").first()).toBeVisible();
  const corregir = page.locator("[data-corregida]");
  if (await corregir.count()) {
    await expect(page.locator("[data-otra]")).toHaveAttribute("aria-disabled", "true");
    for (const c of await corregir.all()) await c.check();
  }
  await expect(page.locator("[data-otra]")).not.toHaveAttribute("aria-disabled", "true");
  await page.locator("[data-otra]").click();
  await expect(page.locator(".hoja.practica h2")).toHaveText("Contestá todo");
});

test("en la práctica no se puede pegar texto", async ({ page }) => {
  await page.goto(`estudio-8.html?m=${M}`);
  for (const t of await page.locator("[data-tarea]").all()) await t.check();
  await page.locator("[data-ir-practica]").click();
  const campo = page.locator("section.item input[type=text]").first();
  test.skip(!(await campo.count()), "esta práctica no tiene campos de texto");
  await campo.dispatchEvent("paste");
  await expect(page.locator("#aviso")).toContainText("no se pega");
});

/** Crea la clave del adulto en el inicio. */
async function crearClave(page, clave = "4821") {
  await page.goto("convocatoria-8.html");
  await page.locator("#crear-clave [name=nueva]").fill(clave);
  await page.locator("#crear-clave [name=otra]").fill(clave);
  await page.locator("#crear-clave button").click();
  await expect(page.locator("#clave-msg")).toHaveText("Clave guardada.");
}

test("simulacro: cerrado hasta aprobar las prácticas; con reloj que sigue al recargar", async ({ page }) => {
  await crearClave(page);
  await page.goto(`estudio-8.html?m=${M}&paso=simulacro`);
  await expect(page.locator(".hoja h2")).toContainText("todavía no");
  await page.locator(".para-adulto summary").click();
  // Sin la clave correcta no se abre
  await page.locator("[data-clave-adulto]").fill("0000");
  await page.locator("[data-llave] button").click();
  await expect(page.locator(".llave-msg")).toHaveText("Esa no es la clave.");
  await page.locator("[data-clave-adulto]").fill("4821");
  await page.locator("[data-llave] button").click();
  await page.locator("[data-empezar]").first().click();
  await page.locator("[data-ahora]").click();
  const reloj = page.locator("[data-tiempo]");
  await expect(reloj).toHaveText(/\d+:\d\d/);
  // Recargar no reinicia nada: sigue el mismo simulacro (aunque pida otro paso)
  await page.goto(`estudio-8.html?m=${M}&paso=materia`);
  await expect(page.locator(".barra-reloj")).toBeVisible();
  await expect(page.locator(".correcta")).toHaveCount(0);
  await page.locator(".barra-reloj [data-entregar]").click();
  await page.locator("[data-si]").click();
  await expect(page.locator(".sello")).toBeVisible();
  await expect(page.locator(".datos")).toContainText("Salió de la página");
  // Lo abierto solo lo marca el adulto con su clave
  const guia = page.locator("[data-guia]").first();
  if (await guia.count()) {
    await expect(guia).toBeDisabled();
    await page.locator("[data-clave-adulto]").fill("4821");
    await page.locator("[data-llave] button").click();
    await expect(page.locator("[data-guia]").first()).toBeEnabled();
  }
  await page.goto("convocatoria-8.html");
  await expect(page.locator(".registro")).toContainText("Entregó");
});

test("borrar el avance pide la clave del adulto", async ({ page }) => {
  await crearClave(page);
  await page.goto(`estudio-8.html?m=${M}`);
  await page.locator("[data-tarea]").first().check();
  await page.goto("convocatoria-8.html");
  await expect(page.locator(".registro")).toContainText("Marcó la tarea 1");
  await page.locator(".borrar summary").click();
  await page.locator("#borrar-texto").fill("BORRAR");
  await page.locator("#borrar button").click();
  await expect(page.locator("#borrar-msg")).toHaveText("Esa no es la clave.");
  await page.locator("#borrar-texto").fill("4821");
  await page.locator("#borrar button").click();
  await expect(page.locator(".registro")).toHaveCount(0);
  await expect(page.locator("#adulto")).toContainText("Ya creaste tu clave");
});
