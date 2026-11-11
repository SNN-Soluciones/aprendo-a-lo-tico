// ⚙️ Configuración general. Cambiá estos datos antes de publicar.
export const CONFIG = {
  appName: "Aprendo a lo Tico",
  sinpe: {
    // Número de SINPE Móvil que recibe las donaciones (formato 8888-8888).
    // Mientras diga "PENDIENTE", la página de apoyo muestra un aviso en vez del número.
    numero: "7201-0233",
    nombre: "Jorge Andres Mayorga Espinoza",
    detalle: "Aprendo a lo Tico",
  },
  // 💡 Sugerencias: el formulario de sugerencias.html llega a este correo por FormSubmit (formsubmit.co).
  // La primera vez, FormSubmit manda un correo de activación: hay que confirmarlo.
  // Después podés cambiar el correo por el código que te dan (ej. "a1b2c3d4…") para no dejarlo público.
  sugerencias: {
    destino: "info@snnsoluciones.com",
  },
  // 🌐 Dirección pública del sitio: la usan los enlaces al compartir (WhatsApp, Facebook) y la dirección canónica.
  // Cuando esté el dominio propio, cambiala aquí y corré `npm run compartir`.
  sitio: "https://plankton-app-auidd.ondigitalocean.app",
  // 🔒 Quién responde por el sitio y por los datos (privacidad.html y acerca.html)
  responsable: {
    nombre: "SNN Soluciones",
    correo: "info@snnsoluciones.com",
  },
  // 📊 Visitas por página, sin cookies (GoatCounter, js/analitica.js). Mientras esté vacío no se cuenta nada.
  // Creá la cuenta en goatcounter.com, poné aquí el código (lo que va antes de .goatcounter.com) y corré `npm run csp`.
  analitica: {
    goatcounter: "",
  },
};
