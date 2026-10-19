// 🏆 Álbum de stickers: cada vez que la escalera 🪜 de un juego sube un escalón, el niño gana un sticker
// (un animal o una cosa tica) que no tenía. Se guarda por perfil en este dispositivo (localStorage), nada se envía.
// Este archivo no toca la pantalla: escalera.js da el sticker y js/home.js dibuja el álbum.

const PREFIJO = "alt-album-";

// Dibujos propios para lo que no tiene emoji (viewBox 0 0 100 100, sin texto ni scripts)
const SVG = {
  tucan: `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <rect x="6" y="80" width="88" height="8" rx="4" fill="#8B5A2B"/>
    <path d="M30 70 L22 96 L38 96 Z" fill="#1E1E1E"/>
    <ellipse cx="34" cy="56" rx="19" ry="25" fill="#1E1E1E"/>
    <path d="M44 34 C52 40 52 58 42 66 C36 58 36 42 44 34 Z" fill="#FFD23F"/>
    <path d="M38 78 v6 M44 78 v6" stroke="#3A7BD5" stroke-width="4" stroke-linecap="round"/>
    <circle cx="38" cy="30" r="14" fill="#1E1E1E"/>
    <path d="M47 21 C64 12 86 16 95 27 C86 36 64 38 48 36 Z" fill="#F7941D"/>
    <path d="M47 21 C52 19 57 18 61 18 L61 37 C56 37 51 37 48 36 Z" fill="#7AC143"/>
    <path d="M86 18 C90 20 93 23 95 27 C92 30 89 32 85 33 Z" fill="#E03C31"/>
    <path d="M49 29 C62 28 78 27 93 27" stroke="#1E1E1E" stroke-width="1.6" fill="none"/>
    <circle cx="38" cy="27" r="5.5" fill="#9BE36B"/><circle cx="38.5" cy="27" r="2.4" fill="#111"/>
  </svg>`,
  quetzal: `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <rect x="4" y="54" width="62" height="7" rx="3.5" fill="#8B5A2B"/>
    <path d="M40 56 C52 70 70 84 96 96 C74 92 54 82 40 66 Z" fill="#1F9E5A"/>
    <path d="M38 58 C46 74 60 88 82 98 C60 96 46 84 36 66 Z" fill="#33C27A"/>
    <ellipse cx="34" cy="40" rx="15" ry="19" fill="#21B36B"/>
    <path d="M24 44 C26 56 34 60 42 56 C44 48 40 42 34 42 Z" fill="#E0262F"/>
    <circle cx="30" cy="22" r="12" fill="#21B36B"/>
    <path d="M22 14 C26 4 36 4 40 12 C34 10 28 12 22 14 Z" fill="#1F9E5A"/>
    <path d="M19 22 L10 25 L19 27 Z" fill="#F4C430"/>
    <circle cx="26" cy="21" r="3.2" fill="#111"/><circle cx="25" cy="20" r="1" fill="#fff"/>
    <path d="M40 34 C50 38 52 48 46 54" stroke="#178049" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`,
  colibri: `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <path d="M14 96 C16 80 18 70 22 60" stroke="#3E8E41" stroke-width="4" fill="none"/>
    <path d="M22 60 C10 54 8 42 16 38 C20 46 26 50 30 52 C34 44 40 40 44 44 C40 50 34 56 22 60 Z" fill="#E94F8A"/>
    <circle cx="23" cy="52" r="3.5" fill="#FFD23F"/>
    <path d="M58 46 C46 26 50 10 62 6 C64 22 64 34 62 46 Z" fill="#9ED9C9" opacity=".85"/>
    <path d="M60 50 C74 32 90 30 96 36 C86 44 74 50 62 54 Z" fill="#9ED9C9" opacity=".85"/>
    <ellipse cx="62" cy="58" rx="16" ry="10" transform="rotate(-25 62 58)" fill="#1FA67A"/>
    <path d="M74 66 L92 82 L78 82 L70 70 Z" fill="#167A5A"/>
    <path d="M58 62 C62 66 66 66 70 63" stroke="#E0262F" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="48" cy="50" r="9" fill="#1FA67A"/>
    <path d="M40 50 L22 54" stroke="#222" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="47" cy="48" r="2.4" fill="#111"/><circle cx="46.3" cy="47.3" r=".8" fill="#fff"/>
  </svg>`,
  manati: `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <rect x="0" y="0" width="100" height="100" rx="18" fill="#BFE6F5"/>
    <path d="M8 20 C18 16 26 24 36 20 S56 16 66 20 S84 24 94 20" stroke="#fff" stroke-width="3" fill="none"/>
    <path d="M70 56 C80 46 92 46 96 54 C94 66 82 70 72 64 Z" fill="#8C9AA6"/>
    <ellipse cx="46" cy="58" rx="32" ry="20" fill="#9AA8B4"/>
    <ellipse cx="44" cy="66" rx="24" ry="9" fill="#B4C0CA"/>
    <path d="M38 72 C34 82 26 86 22 82 C26 78 30 74 32 70 Z" fill="#8C9AA6"/>
    <ellipse cx="16" cy="56" rx="10" ry="9" fill="#9AA8B4"/>
    <circle cx="12" cy="58" r="1.2" fill="#555"/><circle cx="16" cy="60" r="1.2" fill="#555"/><circle cx="12" cy="62" r="1.2" fill="#555"/>
    <circle cx="20" cy="50" r="2.2" fill="#222"/>
    <circle cx="70" cy="88" r="3" fill="#fff" opacity=".8"/><circle cx="78" cy="80" r="2" fill="#fff" opacity=".8"/>
  </svg>`,
  danta: `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <rect x="0" y="86" width="100" height="14" fill="#8CC56B"/>
    <path d="M26 66 v22 h8 v-20 Z M62 66 v22 h8 v-22 Z" fill="#3D3B3F"/>
    <path d="M36 70 v18 h8 v-18 Z M74 64 v24 h8 v-24 Z" fill="#4A474D"/>
    <ellipse cx="56" cy="56" rx="34" ry="20" fill="#4A474D"/>
    <path d="M86 52 C92 52 94 58 90 60" stroke="#4A474D" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="24" cy="50" rx="16" ry="14" fill="#4A474D"/>
    <path d="M10 50 C2 52 2 62 8 64 C10 60 12 56 14 54 Z" fill="#3D3B3F"/>
    <ellipse cx="22" cy="58" rx="9" ry="5" fill="#CFC8C2"/>
    <ellipse cx="28" cy="36" rx="5" ry="7" fill="#3D3B3F" stroke="#E8E2DC" stroke-width="2"/>
    <circle cx="20" cy="46" r="2.4" fill="#111"/>
  </svg>`,
  hormiguero: `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <rect x="0" y="84" width="100" height="16" fill="#C9A26B"/>
    <path d="M78 58 C92 56 98 66 92 76 C88 82 82 80 84 74 C88 70 86 64 78 64 Z" fill="#D8B45C"/>
    <path d="M36 70 v16 h7 v-16 Z M62 70 v16 h7 v-16 Z" fill="#2A2A2A"/>
    <ellipse cx="54" cy="60" rx="28" ry="17" fill="#E3C46A"/>
    <path d="M36 50 C46 62 64 64 78 56 C76 66 70 74 60 76 C48 76 38 70 34 62 Z" fill="#2A2A2A"/>
    <path d="M30 56 C24 50 14 52 4 58 C12 60 22 62 30 64 Z" fill="#E3C46A"/>
    <ellipse cx="32" cy="54" rx="10" ry="9" fill="#E3C46A"/>
    <path d="M4 58 C2 62 4 64 8 63" stroke="#E07A8F" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="34" cy="45" rx="4" ry="5" fill="#D1AE55"/>
    <circle cx="27" cy="52" r="2.2" fill="#111"/>
  </svg>`,
  marimba: `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <path d="M10 40 L90 30 M10 70 L90 58" stroke="#6B3E1E" stroke-width="5" stroke-linecap="round"/>
    <path d="M14 42 v44 M86 32 v54" stroke="#6B3E1E" stroke-width="4"/>
    <g fill="#B5651D" stroke="#6B3E1E" stroke-width="1.5">
      <rect x="14" y="36" width="9" height="40" rx="2"/><rect x="25" y="36" width="9" height="37" rx="2"/>
      <rect x="36" y="35" width="9" height="34" rx="2"/><rect x="47" y="34" width="9" height="31" rx="2"/>
      <rect x="58" y="33" width="9" height="28" rx="2"/><rect x="69" y="32" width="9" height="25" rx="2"/>
    </g>
    <g fill="#7A4A22"><rect x="16" y="76" width="5" height="12"/><rect x="27" y="73" width="5" height="11"/>
      <rect x="38" y="69" width="5" height="10"/><rect x="49" y="65" width="5" height="9"/>
      <rect x="60" y="61" width="5" height="8"/><rect x="71" y="57" width="5" height="7"/></g>
    <path d="M40 8 L52 30 M62 6 L64 30" stroke="#8B5A2B" stroke-width="3" stroke-linecap="round"/>
    <circle cx="52" cy="30" r="5" fill="#E03C31"/><circle cx="64" cy="30" r="5" fill="#E03C31"/>
  </svg>`,
  carreta: `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <circle cx="50" cy="50" r="46" fill="#E03C31" stroke="#5A2A0E" stroke-width="4"/>
    <circle cx="50" cy="50" r="38" fill="#F7941D"/>
    <g fill="#FFFFFF" stroke="#1F3A5F" stroke-width="1.5">
      <path d="M50 14 L57 43 L86 50 L57 57 L50 86 L43 57 L14 50 L43 43 Z"/>
    </g>
    <g fill="#2F7FD1"><path d="M50 22 L54 46 L50 50 L46 46 Z"/><path d="M78 50 L54 54 L50 50 L54 46 Z"/>
      <path d="M50 78 L46 54 L50 50 L54 54 Z"/><path d="M22 50 L46 46 L50 50 L46 54 Z"/></g>
    <g fill="#2FA85A"><circle cx="27" cy="27" r="5"/><circle cx="73" cy="27" r="5"/><circle cx="27" cy="73" r="5"/><circle cx="73" cy="73" r="5"/></g>
    <circle cx="50" cy="50" r="7" fill="#FFD23F" stroke="#5A2A0E" stroke-width="2"/>
  </svg>`,
  yiguirro: `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <rect x="6" y="76" width="88" height="7" rx="3.5" fill="#6B4423"/>
    <path d="M58 50 C70 50 86 56 96 64 C84 66 72 64 62 60 Z" fill="#8A6A45"/>
    <ellipse cx="50" cy="56" rx="22" ry="17" fill="#A27C52"/>
    <ellipse cx="44" cy="62" rx="15" ry="11" fill="#D9BF94"/>
    <path d="M50 46 C60 46 70 52 74 60 C64 60 56 56 50 52 Z" fill="#8A6A45"/>
    <circle cx="32" cy="40" r="13" fill="#A27C52"/>
    <path d="M20 40 L8 43 L20 46 Z" fill="#C9B037"/>
    <path d="M24 46 C26 50 30 52 34 50" stroke="#C7A878" stroke-width="2" fill="none"/>
    <circle cx="28" cy="38" r="4" fill="#C0602A"/><circle cx="28" cy="38" r="2.2" fill="#111"/>
    <path d="M44 72 v6 M52 72 v6" stroke="#B88A5A" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  pizote: `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <rect x="0" y="84" width="100" height="16" fill="#8CC56B"/>
    <path d="M76 56 C82 40 84 22 80 8" stroke="#8B5A2B" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M77 50 h9 M80 38 h8 M81 26 h7 M81 15 h6" stroke="#3B2614" stroke-width="4" stroke-linecap="round"/>
    <path d="M36 68 v18 h7 v-18 Z M62 68 v18 h7 v-18 Z" fill="#5A3A1E"/>
    <ellipse cx="54" cy="60" rx="26" ry="15" fill="#A0693A"/>
    <ellipse cx="54" cy="66" rx="20" ry="8" fill="#C79A6B"/>
    <path d="M34 52 C24 50 14 54 4 62 C14 64 24 64 34 62 Z" fill="#A0693A"/>
    <ellipse cx="32" cy="54" rx="11" ry="10" fill="#A0693A"/>
    <path d="M6 61 C3 60 2 63 5 64" fill="#2A1A0E" stroke="#2A1A0E" stroke-width="3" stroke-linecap="round"/>
    <path d="M14 60 C18 62 24 62 30 60" stroke="#F1E3CF" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="34" cy="43" rx="4" ry="4.5" fill="#7A4A22"/>
    <ellipse cx="25" cy="52" rx="4.5" ry="3.2" fill="#F1E3CF"/><circle cx="25" cy="52" r="2" fill="#111"/>
  </svg>`,
  gallopinto: `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <ellipse cx="50" cy="62" rx="46" ry="26" fill="#FFFFFF" stroke="#2F7FD1" stroke-width="4"/>
    <ellipse cx="50" cy="62" rx="36" ry="18" fill="#F3EEE4"/>
    <path d="M18 62 C20 40 44 30 58 34 C76 38 84 50 80 62 C70 70 30 72 18 62 Z" fill="#E9DCC6"/>
    <g fill="#4A2A1E">
      <ellipse cx="30" cy="56" rx="3" ry="2"/><ellipse cx="40" cy="48" rx="3" ry="2" transform="rotate(30 40 48)"/>
      <ellipse cx="52" cy="42" rx="3" ry="2"/><ellipse cx="62" cy="50" rx="3" ry="2" transform="rotate(-20 62 50)"/>
      <ellipse cx="70" cy="58" rx="3" ry="2"/><ellipse cx="46" cy="58" rx="3" ry="2" transform="rotate(15 46 58)"/>
      <ellipse cx="58" cy="62" rx="3" ry="2"/><ellipse cx="36" cy="62" rx="3" ry="2"/>
      <ellipse cx="56" cy="52" rx="3" ry="2" transform="rotate(40 56 52)"/><ellipse cx="66" cy="42" rx="3" ry="2"/>
    </g>
    <g fill="#3E9B4F"><circle cx="44" cy="40" r="2"/><circle cx="60" cy="58" r="2"/><circle cx="34" cy="52" r="2"/></g>
  </svg>`,
};

/**
 * Los stickers, en el orden del álbum. `art`: el artículo con que se nombra (la voz dice «el perezoso»).
 * `e`: emoji, o `svg`: dibujo propio. `dato`: algo cortito y cierto para contarle al tocarlo.
 */
export const GRUPOS = [
  { id: "animales", nombre: "Animales", emoji: "🐾" },
  { id: "comidas", nombre: "Comidas", emoji: "🍽️" },
  { id: "ticas", nombre: "Cosas ticas", emoji: "🇨🇷" },
];
export const STICKERS = [
  { id: "perezoso", art: "el", nombre: "perezoso", e: "🦥", g: "animales", dato: "Pasa casi toda su vida colgado de los árboles y se mueve muy despacito." },
  { id: "rana", art: "la", nombre: "rana calzonuda", e: "🐸", g: "animales", dato: "Tiene los ojos rojos y las patas anaranjadas. De día duerme pegada a una hoja." },
  { id: "jaguar", art: "el", nombre: "jaguar", e: "🐆", g: "animales", dato: "Es el felino más grande de América, y nada muy bien." },
  { id: "congo", art: "el", nombre: "mono congo", e: "🐒", g: "animales", dato: "Su aullido se oye desde muy lejos, ¡a kilómetros!" },
  { id: "baula", art: "la", nombre: "tortuga baula", e: "🐢", g: "animales", dato: "Es la tortuga más grande del mundo. Pone sus huevos en playas de Guanacaste." },
  { id: "lapa", art: "la", nombre: "lapa roja", e: "🦜", g: "animales", dato: "Es un loro grande de plumas rojas, azules y amarillas, y vive muchos años." },
  { id: "tucan", art: "el", nombre: "tucán", svg: SVG.tucan, g: "animales", dato: "Su pico es enorme, pero muy liviano." },
  { id: "quetzal", art: "el", nombre: "quetzal", svg: SVG.quetzal, g: "animales", dato: "El macho tiene una cola verde larguísima. Vive en los bosques nubosos." },
  { id: "colibri", art: "el", nombre: "colibrí", svg: SVG.colibri, g: "animales", dato: "Mueve las alas tan rápido que puede quedarse quieto en el aire." },
  { id: "yiguirro", art: "el", nombre: "yigüirro", svg: SVG.yiguirro, g: "animales", dato: "Es el ave nacional de Costa Rica. Canta cuando empiezan las lluvias." },
  { id: "ballena", art: "la", nombre: "ballena jorobada", e: "🐋", g: "animales", dato: "Viene a Uvita a tener sus crías. ¡Los machos cantan!" },
  { id: "morpho", art: "la", nombre: "mariposa morpho", e: "🦋", g: "animales", dato: "Sus alas son azules y brillantes por encima, y cafés por debajo." },
  { id: "manati", art: "el", nombre: "manatí", svg: SVG.manati, g: "animales", dato: "Vive en ríos y lagunas del Caribe, como en Tortuguero, y come plantas." },
  { id: "danta", art: "la", nombre: "danta", svg: SVG.danta, g: "animales", dato: "Es el mamífero de tierra más grande de Costa Rica. Su nariz es una trompita." },
  { id: "pizote", art: "el", nombre: "pizote", svg: SVG.pizote, g: "animales", dato: "Anda en grupos y camina con su cola larga y rayada bien parada." },
  { id: "mapache", art: "el", nombre: "mapache", e: "🦝", g: "animales", dato: "Tiene un antifaz negro en la cara y anillos en la cola." },
  { id: "hormiguero", art: "el", nombre: "oso hormiguero", svg: SVG.hormiguero, g: "animales", dato: "Tiene una lengua larguísima para comer hormigas y termitas." },
  { id: "venado", art: "el", nombre: "venado cola blanca", e: "🦌", g: "animales", dato: "Es símbolo nacional. Si se asusta, levanta la cola y se le ve blanca." },
  { id: "cocodrilo", art: "el", nombre: "cocodrilo", e: "🐊", g: "animales", dato: "Desde el puente del río Tárcoles se ven muchos cocodrilos." },
  { id: "martillo", art: "el", nombre: "tiburón martillo", e: "🦈", g: "animales", dato: "Nada en grupos grandes alrededor de la Isla del Coco." },
  { id: "delfin", art: "el", nombre: "delfín", e: "🐬", g: "animales", dato: "Respira aire por un huequito que tiene arriba de la cabeza." },
  { id: "pezloro", art: "el", nombre: "pez loro", e: "🐠", g: "animales", dato: "Muerde el coral con su boca de pico, y así ayuda a hacer arena blanca." },
  { id: "pulpo", art: "el", nombre: "pulpo", e: "🐙", g: "animales", dato: "Tiene ocho brazos y cambia de color para esconderse." },
  { id: "cangrejo", art: "el", nombre: "cangrejo", e: "🦀", g: "animales", dato: "Camina de lado y tiene dos tenazas." },
  { id: "iguana", art: "la", nombre: "iguana verde", e: "🦎", g: "animales", dato: "Le encanta tomar el sol. Come hojas, flores y frutas." },
  { id: "zompopa", art: "la", nombre: "zompopa", e: "🐜", g: "animales", dato: "Corta pedacitos de hoja y los lleva a su nido para cultivar un hongo que se come." },
  { id: "murcielago", art: "el", nombre: "murciélago", e: "🦇", g: "animales", dato: "Algunos comen frutas y, al botar las semillas, siembran árboles." },
  { id: "lechuza", art: "la", nombre: "lechuza", e: "🦉", g: "animales", dato: "Caza de noche y puede girar muchísimo la cabeza." },
  { id: "gavilan", art: "el", nombre: "gavilán", e: "🦅", g: "animales", dato: "Ve desde muy alto y baja rapidísimo a cazar." },
  { id: "abeja", art: "la", nombre: "abeja", e: "🐝", g: "animales", dato: "Lleva el polen de flor en flor y hace miel." },
  { id: "mariquita", art: "la", nombre: "mariquita", e: "🐞", g: "animales", dato: "Es un escarabajo chiquito con puntitos, y se come los pulgones de las plantas." },
  { id: "caracol", art: "el", nombre: "caracol", e: "🐌", g: "animales", dato: "Lleva su casa en la espalda." },
  { id: "grillo", art: "el", nombre: "grillo", e: "🦗", g: "animales", dato: "Canta de noche frotando sus alas." },
  { id: "ardilla", art: "la", nombre: "ardilla", e: "🐿️", g: "animales", dato: "Guarda semillas y usa su cola peluda para no perder el equilibrio." },
  { id: "nutria", art: "la", nombre: "nutria", e: "🦦", g: "animales", dato: "Vive en los ríos, nada muy bien y come peces." },
  { id: "zorrohediondo", art: "el", nombre: "zorro hediondo", e: "🦨", g: "animales", dato: "Si se asusta, suelta un olor feísimo para defenderse." },
  { id: "vaca", art: "la", nombre: "vaca", e: "🐄", g: "animales", dato: "Da leche. En Guanacaste, los sabaneros cuidan el ganado a caballo." },
  { id: "buey", art: "el", nombre: "buey", e: "🐂", g: "animales", dato: "Dos bueyes juntos jalan la carreta." },
  { id: "gallo", art: "el", nombre: "gallo", e: "🐓", g: "animales", dato: "Canta temprano en la mañana: ¡quiquiriquí!" },

  { id: "gallopinto", art: "el", nombre: "gallo pinto", svg: SVG.gallopinto, g: "comidas", dato: "Es arroz con frijoles revueltos: el desayuno tico más famoso." },
  { id: "empanada", art: "la", nombre: "empanada", e: "🥟", g: "comidas", dato: "Se rellena de frijoles, papa, queso o carne." },
  { id: "elote", art: "el", nombre: "elote", e: "🌽", g: "comidas", dato: "Es la mazorca de maíz tierno. Se come asado o cocinado." },
  { id: "copo", art: "el", nombre: "copo", e: "🍧", g: "comidas", dato: "Es hielo raspado con sirope y leche condensada." },
  { id: "pipa", art: "la", nombre: "pipa", e: "🥥", g: "comidas", dato: "Es un coco verde. Se le toma el agua, bien fría." },
  { id: "mango", art: "el", nombre: "mango", e: "🥭", g: "comidas", dato: "Se come maduro, o verde con sal y limón." },
  { id: "pina", art: "la", nombre: "piña", e: "🍍", g: "comidas", dato: "Costa Rica es de los países que más piña venden al mundo." },
  { id: "banano", art: "el", nombre: "banano", e: "🍌", g: "comidas", dato: "Costa Rica vende bananos a muchos países." },
  { id: "sandia", art: "la", nombre: "sandía", e: "🍉", g: "comidas", dato: "Es verde por fuera y roja por dentro, y tiene mucha agua." },
  { id: "cafe", art: "el", nombre: "café", e: "☕", g: "comidas", dato: "Su frutito se pone rojo cuando está maduro, y por dentro tiene el grano." },

  { id: "carreta", art: "la", nombre: "carreta", svg: SVG.carreta, g: "ticas", dato: "La carreta pintada es símbolo nacional del trabajo. La jalan los bueyes." },
  { id: "marimba", art: "la", nombre: "marimba", svg: SVG.marimba, g: "ticas", dato: "Es el instrumento nacional: tiene teclas de madera que se tocan con mazos." },
  { id: "guaria", art: "la", nombre: "guaria morada", e: "🌺", g: "ticas", dato: "Es la flor nacional de Costa Rica: una orquídea morada." },
  { id: "guanacaste", art: "el", nombre: "árbol de guanacaste", e: "🌳", g: "ticas", dato: "Es el árbol nacional. Su copa es enorme y da mucha sombra." },
  { id: "volcan", art: "el", nombre: "volcán", e: "🌋", g: "ticas", dato: "Costa Rica tiene muchos volcanes, como el Arenal, el Poás y el Irazú." },
  { id: "chirripo", art: "el", nombre: "Chirripó", e: "🏔️", g: "ticas", dato: "Es la montaña más alta de Costa Rica." },
  { id: "playa", art: "la", nombre: "playa", e: "🏖️", g: "ticas", dato: "Costa Rica tiene playas en el mar Caribe y en el océano Pacífico." },
  { id: "concha", art: "la", nombre: "concha", e: "🐚", g: "ticas", dato: "Es la casita de un animal de mar que la dejó vacía." },
  { id: "aguacero", art: "el", nombre: "aguacero", e: "🌧️", g: "ticas", dato: "Así se le dice a una lluvia muy fuerte. ¡En la época lluviosa hay muchos!" },
  { id: "arcoiris", art: "el", nombre: "arcoíris", e: "🌈", g: "ticas", dato: "Sale cuando brilla el sol mientras llueve." },
  { id: "mejenga", art: "la", nombre: "mejenga", e: "⚽", g: "ticas", dato: "Es un partido de fútbol entre amigos, en la calle o en la plaza." },
];
export const TOTAL = STICKERS.length;
const POR_ID = new Map(STICKERS.map(s => [s.id, s]));
export const stickerDe = id => POR_ID.get(id) || null;

/** «el perezoso», «la rana calzonuda». */
export const conArticulo = s => `${s.art} ${s.nombre}`;

/** HTML del dibujo (emoji o SVG propio). Solo usa datos de este archivo, nunca texto que escribe alguien. */
export const dibujo = s => s.svg ? `<span class="stk-svg">${s.svg}</span>` : `<span class="stk-emoji">${s.e}</span>`;

/** «un sticker», «21 stickers» dicho «veintiún stickers»… para la voz. */
export function cuantos(n, una = "sticker", varias = "stickers") {
  const decenas = { 2: "veinti", 3: "treinta y ", 4: "cuarenta y ", 5: "cincuenta y ", 6: "sesenta y ", 7: "setenta y ", 8: "ochenta y ", 9: "noventa y " };
  if (n === 1) return `un ${una}`;
  if (n % 10 === 1 && n > 20 && n < 100) return `${decenas[Math.floor(n / 10)]}ún ${varias}`.replace("y ún", "y un");
  return `${n} ${varias}`;
}

/** El siguiente sticker que se gana: uno que todavía no tiene (al azar). null si ya los tiene todos. */
export function siguiente(tengo, azar = Math.random) {
  const ya = new Set(tengo);
  const faltan = STICKERS.filter(s => !ya.has(s.id));
  return faltan.length ? faltan[Math.floor(azar() * faltan.length) % faltan.length] : null;
}

// ---------- Guardado por perfil ----------
export const claveAlbum = perfilId => PREFIJO + perfilId;

/** Los stickers ganados por un perfil, en el orden en que los ganó (solo ids que existen, sin repetir). */
export function albumDe(perfilId) {
  if (!perfilId) return [];
  try {
    const d = JSON.parse(localStorage.getItem(claveAlbum(perfilId)) || "[]");
    return Array.isArray(d) ? [...new Set(d.filter(id => POR_ID.has(id)))] : [];
  } catch (_) { return []; }
}

/** Le da un sticker nuevo al perfil y lo guarda. Sin perfil, o con el álbum lleno, devuelve null. */
export function ganarSticker(perfilId, azar = Math.random) {
  if (!perfilId) return null;
  const tengo = albumDe(perfilId);
  const s = siguiente(tengo, azar);
  if (!s) return null;
  try { localStorage.setItem(claveAlbum(perfilId), JSON.stringify([...tengo, s.id])); } catch (_) { return null; }
  return s;
}

export function borrarAlbum(perfilId) {
  try { localStorage.removeItem(claveAlbum(perfilId)); } catch (_) {}
}

// ---------- Revisión (node) ----------
// Sustantivos que no siguen la regla de «-a es la, -o es el» (por si se agregan stickers)
const EXCEPCIONES = { "día": "el", "mapa": "el", "planeta": "el", "águila": "el", "mano": "la", "foto": "la" };

/** Revisa los datos del álbum: devuelve [] si todo está bien. */
export function revisarAlbum() {
  const err = [];
  const vistos = new Set(), nombres = new Set();
  if (TOTAL < 40) err.push(`hay ${TOTAL} stickers: deberían ser al menos 40`);
  for (const s of STICKERS) {
    if (vistos.has(s.id)) err.push(`id repetido: ${s.id}`);
    vistos.add(s.id);
    if (nombres.has(s.nombre)) err.push(`nombre repetido: ${s.nombre}`);
    nombres.add(s.nombre);
    if (!GRUPOS.some(g => g.id === s.g)) err.push(`${s.id}: grupo desconocido ${s.g}`);
    if (!!s.e === !!s.svg) err.push(`${s.id}: necesita emoji o dibujo (uno de los dos)`);
    if (s.svg && (!s.svg.startsWith("<svg viewBox=\"0 0 100 100\"") || !s.svg.trim().endsWith("</svg>") || s.svg.includes("<script") || s.svg.includes("<text") || /\son\w+=/.test(s.svg)))
      err.push(`${s.id}: dibujo raro`);
    if (s.art !== "el" && s.art !== "la") err.push(`${s.id}: artículo «${s.art}»`);
    const primera = s.nombre.split(" ")[0].toLowerCase();
    const esperado = EXCEPCIONES[primera] || (primera.endsWith("a") ? "la" : primera.endsWith("o") ? "el" : null);
    if (esperado && esperado !== s.art) err.push(`${s.id}: «${s.art} ${s.nombre}» (¿no es «${esperado}»?)`);
    if (!s.dato || s.dato.length > 95) err.push(`${s.id}: dato vacío o muy largo (${s.dato?.length})`);
    for (const t of [s.nombre, s.dato]) if (/[<>&]/.test(t)) err.push(`${s.id}: texto con <, > o &`);
    if (!/[.!]$/.test(s.dato)) err.push(`${s.id}: el dato debe terminar en punto`);
    if (/septiembre/i.test(s.dato)) err.push(`${s.id}: «setiembre»`);
  }
  // Ganar: nunca repite mientras falten, y con el álbum lleno ya no da más
  let tengo = [];
  for (let i = 0; i < TOTAL; i++) {
    const s = siguiente(tengo, () => (i * 0.618) % 1);
    if (!s) { err.push(`se acabaron a los ${i}`); break; }
    if (tengo.includes(s.id)) err.push(`repitió ${s.id}`);
    tengo.push(s.id);
  }
  if (siguiente(tengo, Math.random)) err.push("con el álbum lleno todavía da stickers");
  for (let k = 0; k < 2000; k++) { // azar en los extremos (0 y casi 1)
    const s = siguiente(tengo.slice(0, k % TOTAL), () => (k % 2 ? 0 : 0.999999));
    if (!s || tengo.slice(0, k % TOTAL).includes(s.id)) { err.push("siguiente() falló en un extremo"); break; }
  }
  // La voz
  const casos = { 1: "un sticker", 2: "2 stickers", 21: "veintiún stickers", 31: "treinta y un stickers", 51: "cincuenta y un stickers", 11: "11 stickers" };
  for (const [n, t] of Object.entries(casos)) if (cuantos(Number(n)) !== t) err.push(`cuantos(${n}) = «${cuantos(Number(n))}»`);
  return err;
}
