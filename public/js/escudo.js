// 🛡️ Partes del escudo nacional y lo que significa cada una (sin pantalla, para poder probarla sola).
// Las zonas están en % de la imagen img/escudo.webp (x de 0 a 100 a lo ancho, y de 0 a 100 a lo alto).
// El orden importa: las de más abajo en la lista quedan encima al tocar.

export const PARTES = [
  { id: "mares", nombre: "Los dos mares", emoji: "🌊",
    significa: "El mar Caribe y el océano Pacífico, que bañan las costas de Costa Rica.",
    zona: `<path d="M24 77 H76 L70 86 Q50 90 30 86Z M18 50 H33 V57 H18Z"/>` },
  { id: "republica", nombre: "La cinta «República de Costa Rica»", emoji: "🏛️",
    significa: "Nuestra forma de gobierno: una república democrática, donde el pueblo elige a sus gobernantes.",
    zona: `<path d="M18 29 Q30 20 44 20 H58 Q72 21 83 29 L81 34 Q70 27 58 26 H44 Q30 27 20 34Z"/>` },
  { id: "america", nombre: "La cinta «América Central»", emoji: "🌎",
    significa: "La ubicación geográfica: Costa Rica está en América Central.",
    zona: `<ellipse cx="50" cy="5" rx="19" ry="5"/>` },
  { id: "mirto", nombre: "Las ramas de mirto", emoji: "🌿",
    significa: "La paz.",
    zona: `<ellipse cx="52" cy="17.5" rx="15" ry="3.2"/>` },
  { id: "estrellas", nombre: "Las siete estrellas", emoji: "⭐",
    significa: "Las siete provincias en que se divide el país.",
    zona: `<rect x="24" y="32" width="53" height="6.5" rx="2"/>` },
  { id: "volcanes", nombre: "Los tres volcanes", emoji: "🌋",
    significa: "Las tres cordilleras, o cadenas de montañas, que recorren el país.",
    zona: `<path d="M33 59 L39 38 L47 55 L58 38 L66 52 L71 40 L77 59Z"/>` },
  { id: "sol", nombre: "El sol naciente", emoji: "🌅",
    significa: "Que Costa Rica es una nación joven, libre e independiente.",
    zona: `<ellipse cx="28" cy="46" rx="7" ry="6"/>` },
  { id: "barcos", nombre: "Los barcos", emoji: "⛵",
    significa: "El comercio de Costa Rica con otros países.",
    zona: `<path d="M44 40 H56 V49 H44Z M37 60 H64 V77 H37Z"/>` },
  { id: "cafe", nombre: "Los granos de café", emoji: "☕",
    significa: "El café, el «grano de oro», que ayudó mucho al progreso del país.",
    zona: `<path d="M4 49 H19 V76 H8Z M81 49 H96 L93 72 H81Z"/>` },
];
export const parte = id => PARTES.find(p => p.id === id);

export const MODOS = [
  { id: "explorar", nombre: "🔎 Explorar" },
  { id: "significa", nombre: "🤔 ¿Qué significa?" },
  { id: "donde", nombre: "👆 ¿Dónde está?" },
];

function barajar(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Una ronda: todas las partes en desorden; en «significa», cada una con 3 opciones. */
export function ronda(modo, rnd = Math.random) {
  return barajar(PARTES, rnd).map(p => ({
    id: p.id,
    opciones: modo === "significa" ? barajar([p.id, ...barajar(PARTES.filter(x => x.id !== p.id), rnd).slice(0, 2).map(x => x.id)], rnd) : [],
  }));
}

export function estrellasDe(puntos, total) {
  const p = puntos / total;
  return p >= 0.9 ? 3 : p >= 0.7 ? 2 : p >= 0.5 ? 1 : 0;
}
