// 🎭 Pruebas en el navegador: el sitio se sirve tal cual (public/, sin build) con scripts/servir.mjs.
import { defineConfig } from "@playwright/test";

const PUERTO = 8123;
const CI = !!process.env.CI;

export default defineConfig({
  testDir: "pruebas/navegador",
  fullyParallel: true,
  forbidOnly: CI,
  retries: 0,
  workers: CI ? 2 : undefined,
  reporter: CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PUERTO}/`,
    // Sin service worker: cada prueba ve el archivo real, no una copia guardada
    serviceWorkers: "block",
    // Con «reducir movimiento» el ▶️ deja de latir y se puede tocar; de paso se prueba ese modo (accesibilidad)
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  // Chrome en celular y computadora, Safari (lo que usan los iPhone y iPad de muchas familias) y Firefox
  projects: [
    { name: "chrome-375", use: { browserName: "chromium", viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
    { name: "chrome-1024", use: { browserName: "chromium", viewport: { width: 1024, height: 768 } } },
    { name: "safari-375", use: { browserName: "webkit", viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
    { name: "firefox-1024", use: { browserName: "firefox", viewport: { width: 1024, height: 768 } } },
  ],
  webServer: {
    command: `node scripts/servir.mjs ${PUERTO}`,
    url: `http://127.0.0.1:${PUERTO}/index.html`,
    // Nunca otro servidor que ya esté en ese puerto (podría servir los archivos de otra copia del repo)
    reuseExistingServer: false,
  },
});
