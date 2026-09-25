// 🐸 Dibujos de las ranitas de Costa Rica (SVG, sin imágenes externas).
// Cada una tiene colores Y dibujos distintos (manchas, corazón, ojos rojos) para que se distingan
// también si alguien no ve bien los colores.

const ESTILOS = {
  calzonuda: { piel: "#43B649", panza: "#E8F7C8", patas: "#43B649", dedos: "#F57C00", iris: "#E53935", pupila: "raya", borde: "#1F6B2A",
    extra: `<path d="M22 60 Q30 70 26 80 M78 60 Q70 70 74 80" stroke="#2F6FD1" stroke-width="5" fill="none" stroke-linecap="round"/>` },
  fresa: { piel: "#E53935", panza: "#F28B82", patas: "#2F5FD1", dedos: "#2F5FD1", iris: "#1B1B1B", pupila: "punto", borde: "#8E1C18", extra: "" },
  verdinegra: { piel: "#3DDC84", panza: "#3DDC84", patas: "#3DDC84", dedos: "#1B1B1B", iris: "#1B1B1B", pupila: "punto", borde: "#136B3C",
    extra: `<g fill="#1B1B1B"><ellipse cx="38" cy="58" rx="8" ry="5" transform="rotate(-20 38 58)"/><ellipse cx="62" cy="64" rx="9" ry="5" transform="rotate(25 62 64)"/>
      <ellipse cx="50" cy="44" rx="6" ry="4"/><ellipse cx="44" cy="74" rx="6" ry="4"/><circle cx="67" cy="47" r="3.5"/></g>` },
  vidrio: { piel: "#C9F2B8", panza: "#E7FBE0", patas: "#B5E8A0", dedos: "#E9F071", iris: "#F4E7A1", pupila: "punto", borde: "#6BA85A", opacidad: 0.85,
    extra: `<path d="M50 70 C 44 64 38 67 42 73 L50 80 L58 73 C 62 67 56 64 50 70 Z" fill="#E53935" opacity=".85"/>` },
  arlequin: { piel: "#FFC21A", panza: "#FFC21A", patas: "#FFC21A", dedos: "#1B1B1B", iris: "#1B1B1B", pupila: "punto", borde: "#8A5A00",
    extra: `<g fill="#1B1B1B"><path d="M30 50 q8 -4 10 6 q-6 6 -10 -6z"/><path d="M58 52 q12 -2 10 10 q-10 2 -10 -10z"/><path d="M40 68 q10 -4 14 4 q-8 8 -14 -4z"/>
      <path d="M46 36 q6 -3 9 2 q-4 5 -9 -2z"/></g>` },
  dorado: { piel: "#FF8C1A", panza: "#FFAA4D", patas: "#FF8C1A", dedos: "#E07000", iris: "#1B1B1B", pupila: "punto", borde: "#A24E00", extra: "" },
};

/** SVG de una rana. `id`: calzonuda | fresa | verdinegra | vidrio | arlequin | dorado */
export function ranaSVG(id, titulo = "") {
  const e = ESTILOS[id];
  const pupila = e.pupila === "raya"
    ? `<ellipse cx="0" cy="0" rx="2.6" ry="7" fill="#111"/>`
    : `<circle cx="0" cy="0" r="5.5" fill="#111"/>`;
  const ojo = (x) => `<g transform="translate(${x} 27)"><circle r="11" fill="${e.iris}" stroke="${e.borde}" stroke-width="2.5"/>${pupila}<circle cx="-3" cy="-4" r="2.4" fill="#fff" opacity=".9"/></g>`;
  const pata = (x, espejo) => `<g transform="translate(${x} 0) scale(${espejo ? -1 : 1} 1)">
      <path d="M0 62 Q-24 66 -22 86 Q-20 92 -12 90" fill="none" stroke="${e.patas}" stroke-width="9" stroke-linecap="round"/>
      <circle cx="-13" cy="90" r="4.5" fill="${e.dedos}"/><circle cx="-5" cy="92" r="4" fill="${e.dedos}"/></g>`;
  return `<svg viewBox="0 0 100 100" role="img" aria-label="${titulo}">
    <g opacity="${e.opacidad || 1}">
      ${pata(28, false)}${pata(72, true)}
      <ellipse cx="50" cy="62" rx="30" ry="26" fill="${e.piel}" stroke="${e.borde}" stroke-width="3"/>
      <ellipse cx="50" cy="68" rx="18" ry="15" fill="${e.panza}"/>
      <ellipse cx="50" cy="42" rx="29" ry="19" fill="${e.piel}" stroke="${e.borde}" stroke-width="3"/>
      ${e.extra}
      <path d="M36 46 Q50 54 64 46" stroke="${e.borde}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="30" cy="84" r="4.5" fill="${e.dedos}"/><circle cx="70" cy="84" r="4.5" fill="${e.dedos}"/>
    </g>
    ${ojo(33)}${ojo(67)}
  </svg>`;
}
