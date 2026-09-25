// 🇨🇷 Dibujos de los símbolos patrios (SVG, sin imágenes externas).
// Son dibujos sencillos, para reconocerlos; no son las versiones oficiales (el escudo y los animales, el árbol y las esferas son imágenes en img/).

const svg = (cuerpo, titulo) => `<svg viewBox="0 0 100 100" role="img" aria-label="${titulo}">${cuerpo}</svg>`;
const estrella = (x, y, r) => {
  const p = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p.push(`${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`); }
  return `<polygon points="${p.join(" ")}"/>`;
};

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

  // Orquídea morada
  guaria: `<g transform="translate(50 50)" stroke="#6A1B9A" stroke-width="2">
    <ellipse rx="10" ry="26" transform="rotate(0) translate(0 -18)" fill="#C77DDB"/><ellipse rx="10" ry="26" transform="rotate(115) translate(0 -18)" fill="#C77DDB"/>
    <ellipse rx="10" ry="26" transform="rotate(-115) translate(0 -18)" fill="#C77DDB"/>
    <ellipse rx="14" ry="20" transform="rotate(55) translate(0 -16)" fill="#B05CC9"/><ellipse rx="14" ry="20" transform="rotate(-55) translate(0 -16)" fill="#B05CC9"/>
    <path d="M-14 6 Q0 36 14 6 Q0 14 -14 6Z" fill="#7B1FA2"/><circle r="5" fill="#FFF3B0"/></g>`,


  // Carreta típica con rueda pintada
  carreta: `<path d="M18 40 H86 L80 58 H24Z" fill="#E53935" stroke="#7A1C1C" stroke-width="2.5"/>
    <path d="M24 44 H80 M28 50 H76" stroke="#FFD54F" stroke-width="2"/><path d="M18 50 L4 56" stroke="#7A4E2A" stroke-width="4"/>
    <g transform="translate(52 66)"><circle r="24" fill="#FFB300" stroke="#1F3A5F" stroke-width="3"/>
    ${[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => `<path d="M0 0 L-6 -20 L6 -20Z" transform="rotate(${a})" fill="${["#E53935", "#1E6FD9", "#2FA85A", "#E53935", "#1E6FD9", "#2FA85A", "#E53935", "#1E6FD9"][i]}"/>`).join("")}
    <circle r="15" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/><circle r="6" fill="#1F3A5F"/></g>`,

  antorcha: `<path d="M44 52 H56 L53 94 H47Z" fill="#8B5A2B" stroke="#5C3A1A" stroke-width="2"/>
    <rect x="40" y="46" width="20" height="8" rx="2" fill="#B0BEC5" stroke="#607D8B" stroke-width="2"/>
    <path d="M50 6 C 64 20 70 30 62 42 C 60 46 40 46 38 42 C 30 30 40 20 44 24 C 44 16 48 10 50 6Z" fill="#FF7A1A"/>
    <path d="M50 18 C 58 28 60 34 55 42 H45 C 40 34 44 28 50 18Z" fill="#FFD54F"/>
    <g fill="#002B7F"><rect x="46" y="60" width="8" height="4"/></g><rect x="46" y="64" width="8" height="4" fill="#CE1126"/>`,

  // Teclas de madera sobre un marco, con mazos
  marimba: `<path d="M8 72 L92 60 M12 88 L90 76" stroke="#6B3E1E" stroke-width="4"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${10 + i * 10.2}" y="${22 + i * 3}" width="8.5" height="${46 - i * 3}" rx="2" fill="${i % 2 ? "#C8874A" : "#A86A34"}" stroke="#5C3A1A" stroke-width="1.5"/>`).join("")}
    <path d="M20 16 L36 30 M78 10 L64 24" stroke="#5C3A1A" stroke-width="3"/><circle cx="18" cy="14" r="5" fill="#E53935"/><circle cx="80" cy="8" r="5" fill="#E53935"/>`,

};

// Fotos (cuadradas, en img/): se muestran con las esquinas redondeadas
const FOTOS = ["yiguirro", "guanacaste", "venado", "manati", "esferas"];
const foto = id => `<clipPath id="redondo-${id}"><rect width="100" height="100" rx="12"/></clipPath>
  <image href="../img/${id}.webp" width="100" height="100" clip-path="url(#redondo-${id})" preserveAspectRatio="xMidYMid slice"/>`;

/** Dibujo (o foto) de un símbolo (id de js/simbolos.js), como SVG. */
export const dibujo = (id, titulo = "") => svg(FOTOS.includes(id) ? foto(id) : DIBUJOS[id], titulo);
export const IDS_DIBUJOS = [...Object.keys(DIBUJOS), ...FOTOS];
