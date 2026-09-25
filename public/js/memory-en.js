// 🧠 Contenido y lógica de «Memory in English» (sin pantalla, para poder probarla sola).
// Parejas: un dibujo y su palabra en inglés. Al voltear la palabra, se escucha en inglés.

export const TEMAS = [
  { id: "animals", nombre: "🐶 Animals", palabras: [
    ["🐶", "dog", "perro"], ["🐱", "cat", "gato"], ["🐦", "bird", "pájaro"], ["🐟", "fish", "pez"], ["🐸", "frog", "rana"], ["🐒", "monkey", "mono"],
    ["🐢", "turtle", "tortuga"], ["🐴", "horse", "caballo"], ["🐄", "cow", "vaca"], ["🐷", "pig", "cerdo"], ["🦆", "duck", "pato"], ["🐝", "bee", "abeja"]] },
  { id: "colors", nombre: "🎨 Colors", palabras: [
    ["🔴", "red", "rojo"], ["🟠", "orange", "anaranjado"], ["🟡", "yellow", "amarillo"], ["🟢", "green", "verde"], ["🔵", "blue", "azul"],
    ["🟣", "purple", "morado"], ["🟤", "brown", "café"], ["⚫", "black", "negro"], ["⚪", "white", "blanco"]] },
  { id: "fruits", nombre: "🍎 Fruits", palabras: [
    ["🍎", "apple", "manzana"], ["🍌", "banana", "banano"], ["🍊", "orange", "naranja"], ["🍇", "grapes", "uvas"], ["🍉", "watermelon", "sandía"],
    ["🍍", "pineapple", "piña"], ["🥭", "mango", "mango"], ["🍓", "strawberry", "fresa"], ["🍋", "lemon", "limón"], ["🥥", "coconut", "pipa"],
    ["🍐", "pear", "pera"], ["🍒", "cherries", "cerezas"]] },
  { id: "clothes", nombre: "👕 Clothes", palabras: [
    ["👕", "shirt", "camisa"], ["👖", "pants", "pantalón"], ["👗", "dress", "vestido"], ["👟", "shoes", "zapatos"], ["👒", "hat", "sombrero"],
    ["🧦", "socks", "medias"], ["🧢", "cap", "gorra"], ["🧥", "jacket", "jacket"], ["🧣", "scarf", "bufanda"], ["🧤", "gloves", "guantes"]] },
  { id: "body", nombre: "👂 Body", palabras: [
    ["👁️", "eye", "ojo"], ["👂", "ear", "oreja"], ["👃", "nose", "nariz"], ["👄", "mouth", "boca"], ["✋", "hand", "mano"],
    ["🦶", "foot", "pie"], ["🦷", "tooth", "diente"], ["🦵", "leg", "pierna"], ["💪", "arm", "brazo"]] },
  { id: "school", nombre: "🎒 School", palabras: [
    ["📚", "book", "libro"], ["✏️", "pencil", "lápiz"], ["🎒", "backpack", "mochila"], ["📏", "ruler", "regla"], ["✂️", "scissors", "tijeras"],
    ["🖍️", "crayon", "crayola"], ["📓", "notebook", "cuaderno"], ["🚌", "bus", "bus"], ["⏰", "clock", "reloj"], ["💻", "computer", "computadora"]] },
];

export const NIVELES = [
  { id: "4", nombre: "4 pairs", parejas: 4 },
  { id: "6", nombre: "6 pairs", parejas: 6 },
  { id: "8", nombre: "8 pairs", parejas: 8 },
];

function barajar(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Cartas: cada palabra tiene una carta con el dibujo y otra con la palabra en inglés. */
export function mazo(tema, parejas, rnd = Math.random) {
  const t = TEMAS.find(x => x.id === tema);
  const ps = barajar(t.palabras, rnd).slice(0, parejas);
  return barajar(ps.flatMap(([e, en, es]) => [{ en, es, e, cara: "dibujo" }, { en, es, e, cara: "palabra" }]), rnd).map((c, n) => ({ ...c, n }));
}
export const sonPareja = (a, b) => a.en === b.en && a.cara !== b.cara;
export const estrellasMemoria = (intentos, parejas) => (intentos <= parejas * 1.5 ? 3 : intentos <= parejas * 2.2 ? 2 : 1);
