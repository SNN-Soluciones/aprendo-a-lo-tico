// 🇨🇷 Dibujos de los símbolos patrios (SVG, sin imágenes externas).
// Son dibujos sencillos, para reconocerlos; no son las versiones oficiales (el escudo y las fotos están en img/).

const svg = (cuerpo, titulo) => `<svg viewBox="0 0 100 100" role="img" aria-label="${titulo}">${cuerpo}</svg>`;

const DIBUJOS = {
  // Cinco franjas: azul, blanca, roja (el doble de ancha), blanca y azul
  bandera: `<rect x="12" y="8" width="4" height="86" rx="2" fill="#8B5A2B"/>
    <g transform="translate(16 16)"><rect width="74" height="10" fill="#002B7F"/><rect y="10" width="74" height="10" fill="#fff"/>
    <rect y="20" width="74" height="20" fill="#CE1126"/><rect y="40" width="74" height="10" fill="#fff"/><rect y="50" width="74" height="10" fill="#002B7F"/>
    <rect width="74" height="60" fill="none" stroke="#1F3A5F" stroke-width="2"/></g>`,

  // Escudo nacional: imagen real (img/escudo.webp, sin el fondo blanco)
  escudo: `<image href="../img/escudo.webp" x="2" y="1" width="96" height="98" preserveAspectRatio="xMidYMid meet"/>`,

  himno: `<g fill="#1F3A5F"><ellipse cx="30" cy="72" rx="11" ry="8" transform="rotate(-20 30 72)"/><ellipse cx="68" cy="64" rx="11" ry="8" transform="rotate(-20 68 64)"/>
    <rect x="38" y="20" width="4.5" height="52"/><rect x="76" y="12" width="4.5" height="52"/><path d="M38 20 L80.5 12 V24 L38 32Z"/></g>
    <path d="M14 88 Q50 80 86 88" stroke="#CE1126" stroke-width="3" fill="none"/>`,

};

// Fotos (cuadradas, en img/): se muestran con las esquinas redondeadas
const FOTOS = ["guaria", "yiguirro", "guanacaste", "carreta", "antorcha", "venado", "marimba", "manati", "esferas"];
const foto = id => `<clipPath id="redondo-${id}"><rect width="100" height="100" rx="12"/></clipPath>
  <image href="../img/${id}.webp" width="100" height="100" clip-path="url(#redondo-${id})" preserveAspectRatio="xMidYMid slice"/>`;

/** Dibujo (o foto) de un símbolo (id de js/simbolos.js), como SVG. */
export const dibujo = (id, titulo = "") => svg(FOTOS.includes(id) ? foto(id) : DIBUJOS[id], titulo);
export const IDS_DIBUJOS = [...Object.keys(DIBUJOS), ...FOTOS];
