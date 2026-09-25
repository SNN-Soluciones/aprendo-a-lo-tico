// 🇨🇷 Dibujos de los símbolos patrios (SVG, sin imágenes externas).
// Son dibujos sencillos, para reconocerlos; no son las versiones oficiales.

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

  // Escudo: siete estrellas, tres volcanes, dos mares y dos barcos
  escudo: `<path d="M20 14 H80 V52 Q80 82 50 94 Q20 82 20 52Z" fill="#FFD54F" stroke="#1F3A5F" stroke-width="3"/>
    <path d="M26 20 H74 V52 Q74 76 50 86 Q26 76 26 52Z" fill="#9ED8F5"/>
    <g fill="#fff">${[0, 1, 2, 3, 4, 5, 6].map(i => estrella(31 + i * 6.3, 29 - Math.sin(i / 6 * Math.PI) * 5, 3)).join("")}</g>
    <path d="M26 60 L38 40 L46 52 L52 36 L60 50 L66 42 L74 58 V62 H26Z" fill="#3E8E41" stroke="#2A6A2D" stroke-width="1.5"/>
    <path d="M26 60 H74 V70 Q64 76 50 80 Q36 76 26 70Z" fill="#2F6FD1"/>
    <g fill="#8B5A2B"><path d="M30 62 h8 l-2 3 h-4z"/><path d="M60 64 h8 l-2 3 h-4z"/></g>
    <g stroke="#fff" stroke-width="1"><path d="M34 62 v-5 l3 3z" fill="#fff"/><path d="M64 64 v-5 l3 3z" fill="#fff"/></g>`,

  himno: `<g fill="#1F3A5F"><ellipse cx="30" cy="72" rx="11" ry="8" transform="rotate(-20 30 72)"/><ellipse cx="68" cy="64" rx="11" ry="8" transform="rotate(-20 68 64)"/>
    <rect x="38" y="20" width="4.5" height="52"/><rect x="76" y="12" width="4.5" height="52"/><path d="M38 20 L80.5 12 V24 L38 32Z"/></g>
    <path d="M14 88 Q50 80 86 88" stroke="#CE1126" stroke-width="3" fill="none"/>`,

  // Orquídea morada
  guaria: `<g transform="translate(50 50)" stroke="#6A1B9A" stroke-width="2">
    <ellipse rx="10" ry="26" transform="rotate(0) translate(0 -18)" fill="#C77DDB"/><ellipse rx="10" ry="26" transform="rotate(115) translate(0 -18)" fill="#C77DDB"/>
    <ellipse rx="10" ry="26" transform="rotate(-115) translate(0 -18)" fill="#C77DDB"/>
    <ellipse rx="14" ry="20" transform="rotate(55) translate(0 -16)" fill="#B05CC9"/><ellipse rx="14" ry="20" transform="rotate(-55) translate(0 -16)" fill="#B05CC9"/>
    <path d="M-14 6 Q0 36 14 6 Q0 14 -14 6Z" fill="#7B1FA2"/><circle r="5" fill="#FFF3B0"/></g>`,

  // Pajarito café, sencillo
  yiguirro: `<path d="M80 50 L96 40 L94 58Z" fill="#7A5C3E"/>
    <ellipse cx="56" cy="56" rx="28" ry="20" fill="#9C7B5B" stroke="#5E4630" stroke-width="2.5"/>
    <ellipse cx="50" cy="64" rx="18" ry="11" fill="#D9B98F"/>
    <path d="M52 50 Q66 44 78 54" stroke="#6E5238" stroke-width="3" fill="none"/>
    <circle cx="30" cy="40" r="15" fill="#9C7B5B" stroke="#5E4630" stroke-width="2.5"/>
    <path d="M16 40 L4 44 L16 46Z" fill="#C9A227"/><circle cx="26" cy="37" r="3.5" fill="#1B1B1B"/><circle cx="26" cy="37" r="6" fill="none" stroke="#E8B04A" stroke-width="1.5"/>
    <path d="M50 76 v12 M60 76 v12" stroke="#5E4630" stroke-width="3"/>`,

  // Árbol grande de copa ancha, con frutos en forma de oreja
  guanacaste: `<rect x="44" y="52" width="12" height="40" fill="#7A4E2A"/><path d="M50 60 L32 48 M50 58 L68 46" stroke="#7A4E2A" stroke-width="6"/>
    <ellipse cx="50" cy="38" rx="44" ry="22" fill="#3E9B45" stroke="#276B2C" stroke-width="2.5"/>
    <ellipse cx="30" cy="34" rx="14" ry="9" fill="#58B85F"/><ellipse cx="66" cy="30" rx="16" ry="9" fill="#58B85F"/>
    <g fill="#6B3E1E"><path d="M24 52 q6 -6 10 0 q-4 5 -10 0z"/><path d="M70 54 q6 -6 10 0 q-4 5 -10 0z"/></g>
    <rect x="6" y="92" width="88" height="4" rx="2" fill="#6DBE45"/>`,

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

  venado: `<text x="50" y="72" text-anchor="middle" font-size="64">🦌</text>`,

  // Teclas de madera sobre un marco, con mazos
  marimba: `<path d="M8 72 L92 60 M12 88 L90 76" stroke="#6B3E1E" stroke-width="4"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${10 + i * 10.2}" y="${22 + i * 3}" width="8.5" height="${46 - i * 3}" rx="2" fill="${i % 2 ? "#C8874A" : "#A86A34"}" stroke="#5C3A1A" stroke-width="1.5"/>`).join("")}
    <path d="M20 16 L36 30 M78 10 L64 24" stroke="#5C3A1A" stroke-width="3"/><circle cx="18" cy="14" r="5" fill="#E53935"/><circle cx="80" cy="8" r="5" fill="#E53935"/>`,

  // Manatí gris con cola en forma de remo
  manati: `<rect x="0" y="0" width="100" height="100" fill="#BFE3F2" rx="12"/>
    <path d="M78 48 Q98 40 96 58 Q94 72 78 60Z" fill="#8E9AA3" stroke="#56626B" stroke-width="2.5"/>
    <ellipse cx="50" cy="54" rx="32" ry="18" fill="#9EAAB3" stroke="#56626B" stroke-width="2.5"/>
    <ellipse cx="22" cy="54" rx="14" ry="12" fill="#9EAAB3" stroke="#56626B" stroke-width="2.5"/>
    <ellipse cx="12" cy="58" rx="6" ry="5" fill="#B7C1C8"/><circle cx="20" cy="49" r="2.2" fill="#1B1B1B"/>
    <path d="M40 66 Q36 78 30 74" stroke="#56626B" stroke-width="3" fill="#8E9AA3"/>
    <path d="M8 90 Q30 84 50 90 T92 90" stroke="#6FA9C9" stroke-width="3" fill="none"/>`,

  esferas: `<defs><radialGradient id="piedra" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#E0E0E0"/><stop offset=".6" stop-color="#9E9E9E"/><stop offset="1" stop-color="#616161"/></radialGradient></defs>
    <rect x="4" y="84" width="92" height="10" rx="5" fill="#6DBE45"/>
    <circle cx="36" cy="54" r="32" fill="url(#piedra)"/><circle cx="80" cy="74" r="14" fill="url(#piedra)"/>`,
};

/** Dibujo SVG de un símbolo (id de js/simbolos.js). */
export const dibujo = (id, titulo = "") => svg(DIBUJOS[id], titulo);
export const IDS_DIBUJOS = Object.keys(DIBUJOS);
