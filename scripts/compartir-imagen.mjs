// 🖼️ Genera public/img/compartir.png (la imagen que se ve al compartir el sitio) a partir de scripts/compartir-imagen.html.
//   node scripts/compartir-imagen.mjs
// Usa el Chromium de Playwright (npx playwright install chromium). Los emoji salen con la letra del sistema donde se corra.
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { IMAGEN } from "./compartir.mjs";

const diseno = new URL("./compartir-imagen.html", import.meta.url).href;
const salida = fileURLToPath(new URL(`../public/${IMAGEN.ruta}`, import.meta.url));

const navegador = await chromium.launch();
try {
  const pagina = await navegador.newPage({ viewport: { width: IMAGEN.ancho, height: IMAGEN.alto } });
  await pagina.goto(diseno);
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.screenshot({ path: salida, type: "png" });
  console.log(`🖼️ ${salida}`);
} finally {
  await navegador.close();
}
