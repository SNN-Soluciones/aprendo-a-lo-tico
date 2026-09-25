// 🇨🇷 Contenido y lógica de «Símbolos patrios» (sin pantalla, para poder probarla sola).

export const SIMBOLOS = [
  { id: "bandera", el: "la bandera", nombre: "Bandera", tipo: "Bandera nacional",
    pista: "Tiene cinco franjas: azul, blanca, roja, blanca y azul.",
    dato: "La franja roja es la del medio y es la más ancha. La diseñó doña Pacífica Fernández en 1848." },
  { id: "escudo", el: "el escudo", nombre: "Escudo", tipo: "Escudo nacional",
    pista: "Tiene tres volcanes, dos mares, dos barcos y siete estrellas.",
    dato: "Las siete estrellas son las siete provincias, y los dos mares son el Caribe y el Pacífico." },
  { id: "himno", el: "el himno", nombre: "Himno", tipo: "Himno nacional",
    pista: "Lo cantamos de pie y con respeto. Empieza: “Noble patria, tu hermosa bandera…”.",
    dato: "La música es de Manuel María Gutiérrez y la letra de José María Zeledón." },
  { id: "guaria", el: "la guaria morada", nombre: "Guaria morada", tipo: "Flor nacional",
    pista: "Es una orquídea morada que crece pegada a los árboles.",
    dato: "La guaria morada es la flor nacional. Florece en los primeros meses del año." },
  { id: "yiguirro", el: "el yigüirro", nombre: "Yigüirro", tipo: "Ave nacional",
    pista: "Es un pájaro café y sencillo que canta cuando empiezan las lluvias.",
    dato: "El yigüirro es el ave nacional. Dicen que con su canto «llama» a la lluvia." },
  { id: "guanacaste", el: "el guanacaste", nombre: "Guanacaste", tipo: "Árbol nacional",
    pista: "Es un árbol enorme de copa ancha que da mucha sombra. Sus frutos parecen orejas.",
    dato: "El guanacaste es el árbol nacional y le dio su nombre a una provincia." },
  { id: "carreta", el: "la carreta", nombre: "Carreta", tipo: "Símbolo del trabajo",
    pista: "La jalan los bueyes y sus ruedas están pintadas de muchos colores.",
    dato: "La carreta típica es el símbolo del trabajo. Antes llevaba el café; las más famosas se pintan en Sarchí." },
  { id: "antorcha", el: "la antorcha", nombre: "Antorcha", tipo: "Antorcha de la independencia",
    pista: "La llevan corriendo estudiantes desde Guatemala hasta Cartago en setiembre.",
    dato: "La antorcha llega a Cartago el 14 de setiembre, para celebrar la independencia el 15." },
  { id: "venado", el: "el venado cola blanca", nombre: "Venado cola blanca", tipo: "Símbolo de la fauna silvestre",
    pista: "Es un mamífero del bosque que, cuando se asusta, levanta la cola blanca.",
    dato: "El venado cola blanca es el símbolo de la fauna silvestre. Vive mucho en Guanacaste." },
  { id: "marimba", el: "la marimba", nombre: "Marimba", tipo: "Instrumento nacional",
    pista: "Es un instrumento con teclas de madera que se toca con mazos.",
    dato: "La marimba es el instrumento musical nacional. Suena mucho en las fiestas de Guanacaste." },
  { id: "manati", el: "el manatí", nombre: "Manatí", tipo: "Símbolo de la fauna marina",
    pista: "Es un mamífero grande y tranquilo que vive en los ríos y lagunas del Caribe.",
    dato: "El manatí es el símbolo de la fauna marina. Come plantas del agua y está en peligro." },
  { id: "esferas", el: "las esferas de piedra", nombre: "Esferas de piedra", tipo: "Símbolo nacional",
    pista: "Son bolas de piedra muy redondas que hicieron los pueblos indígenas del sur del país.",
    dato: "Las esferas de piedra del Diquís, en la zona sur, son Patrimonio de la Humanidad." },
];
export const simbolo = id => SIMBOLOS.find(s => s.id === id);
/** «Flor nacional: Guaria morada», pero solo «Bandera nacional» (sin repetir el nombre). */
export const titulo = s => s.tipo.toLowerCase().includes(s.nombre.toLowerCase()) ? s.tipo : `${s.tipo}: ${s.nombre}`;

export const NIVELES = [
  { id: "facil", nombre: "4 parejas", parejas: 4 },
  { id: "medio", nombre: "6 parejas", parejas: 6 },
  { id: "dificil", nombre: "8 parejas", parejas: 8 },
];

function barajar(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Cartas de la memoria: cada símbolo tiene una carta con el dibujo y otra con el nombre. */
export function mazo(parejas, rnd = Math.random) {
  const ids = barajar(SIMBOLOS.map(s => s.id), rnd).slice(0, parejas);
  return barajar(ids.flatMap(id => [{ id, cara: "dibujo" }, { id, cara: "nombre" }]), rnd).map((c, i) => ({ ...c, n: i }));
}

/** Dos cartas son pareja si son del mismo símbolo y una es dibujo y la otra nombre. */
export const sonPareja = (a, b) => a.id === b.id && a.cara !== b.cara;

/** Estrellas de la memoria según los intentos (cada intento = voltear dos cartas). */
export function estrellasMemoria(intentos, parejas) {
  return intentos <= parejas * 1.5 ? 3 : intentos <= parejas * 2.2 ? 2 : 1;
}

/** Adivinanzas: 8 símbolos distintos, cada uno con 3 opciones. */
export function adivinanzas(rnd = Math.random, n = 8) {
  return barajar(SIMBOLOS, rnd).slice(0, n).map(s => ({
    id: s.id,
    opciones: barajar([s.id, ...barajar(SIMBOLOS.filter(x => x.id !== s.id), rnd).slice(0, 2).map(x => x.id)], rnd),
  }));
}

export function estrellasDe(puntos, total) {
  const p = puntos / total;
  return p >= 0.9 ? 3 : p >= 0.7 ? 2 : p >= 0.5 ? 1 : 0;
}
