// 📊 Cuenta cuántas veces se abre cada página, sin cookies ni datos de nadie (GoatCounter; ver privacidad.html).
// Solo viaja la ruta (por ejemplo /juegos/reloj.html): nada de nombres, edades, perfiles ni identificadores.
// Si el navegador pide no rastrear (Do Not Track o GPC), no se cuenta nada.
// Se activa poniendo el código de la cuenta en CONFIG.analitica.goatcounter (js/config.js) y corriendo `npm run csp`.
import { CONFIG } from "./config.js";

const LOCALES = ["localhost", "127.0.0.1", "[::1]"];

/**
 * URL del pixel de GoatCounter para esa visita, o null si no hay que contarla.
 * @param {{ codigo?: string, ruta: string, host: string, nav: { doNotTrack?: string|null, globalPrivacyControl?: boolean, webdriver?: boolean } }} visita
 * @returns {string|null}
 */
export function urlDeVisita({ codigo, ruta, host, nav }) {
  if (!codigo || !/^[a-z0-9-]+$/.test(codigo)) return null;
  if (nav.doNotTrack === "1" || nav.globalPrivacyControl === true || nav.webdriver) return null;
  if (LOCALES.includes(host) || host.endsWith(".localhost")) return null;
  // rnd: para que ningún caché se quede con el pixel y la visita sí llegue
  return `https://${codigo}.goatcounter.com/count?p=${encodeURIComponent(ruta)}&rnd=${Math.random().toString(36).slice(2)}`;
}

if (typeof location !== "undefined") {
  const url = urlDeVisita({ codigo: CONFIG.analitica?.goatcounter, ruta: location.pathname, host: location.hostname, nav: navigator });
  if (url) new Image().src = url;
}
