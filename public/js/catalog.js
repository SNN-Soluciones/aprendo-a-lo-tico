// 📚 Catálogo de juegos. Para agregar uno nuevo: poné el HTML en /juegos y agregalo aquí.
export const MATERIAS = [
  { id: "mate",     nombre: "Matemáticas",       emoji: "🔢", color: "#2F7FD1" },
  { id: "espanol",  nombre: "Español",           emoji: "✏️", color: "#E8574A" },
  { id: "ciencias", nombre: "Ciencias",          emoji: "🌱", color: "#2FA85A" },
  { id: "sociales", nombre: "Estudios Sociales", emoji: "🗺️", color: "#F29A1F" },
  { id: "ingles",   nombre: "Inglés",            emoji: "💬", color: "#8E5BD9" },
];

// 0 = Preparatoria (materno/transición), 1..6 = grados de primaria
export const GRADOS = [
  { id: 0, corto: "Prepa", nombre: "Preparatoria" },
  { id: 1, corto: "1°", nombre: "Primer grado" },
  { id: 2, corto: "2°", nombre: "Segundo grado" },
  { id: 3, corto: "3°", nombre: "Tercer grado" },
  { id: 4, corto: "4°", nombre: "Cuarto grado" },
  { id: 5, corto: "5°", nombre: "Quinto grado" },
  { id: 6, corto: "6°", nombre: "Sexto grado" },
];

export const JUEGOS = [
  {
    id: "reloj",
    titulo: "Aprendo la hora",
    descripcion: "Mové las agujas y adiviná la hora, dicha a lo tico.",
    emoji: "🕒",
    materia: "mate",
    grados: [1, 2, 3],
    url: "juegos/reloj.html",
  },
  {
    id: "restas-bloques",
    titulo: "Restas con bloques",
    descripcion: "Unidades, decenas, centenas y miles. Rompé bloques para pedir prestado.",
    emoji: "🧱",
    materia: "mate",
    grados: [2, 3, 4],
    url: "juegos/restas-bloques.html",
  },
  {
    id: "pulperia",
    titulo: "La pulpería",
    descripcion: "Pagá con billetes y monedas de colones y calculá el vuelto.",
    emoji: "🪙",
    materia: "mate",
    grados: [1, 2, 3, 4],
    url: "juegos/pulperia.html",
  },
  {
    id: "sumas-bloques",
    titulo: "Sumas con bloques",
    descripcion: "Agregá bloques y juntá 10 para llevar a la siguiente columna.",
    emoji: "➕",
    materia: "mate",
    grados: [1, 2, 3, 4],
    url: "juegos/sumas-bloques.html",
  },
  {
    id: "animales-cr",
    titulo: "Animales de Costa Rica",
    descripcion: "¿Dónde vive el perezoso? ¿Qué come la baula? Aprendé de nuestra fauna.",
    emoji: "🦥",
    materia: "ciencias",
    grados: [1, 2, 3, 4],
    url: "juegos/animales-cr.html",
  },
  {
    id: "provincias",
    titulo: "Mapa de provincias",
    descripcion: "Explorá el mapa, encontrá cada provincia y aprendé sus cabeceras.",
    emoji: "🗺️",
    materia: "sociales",
    grados: [2, 3, 4],
    url: "juegos/provincias.html",
  },
  {
    id: "listen-tap",
    titulo: "Listen and tap",
    descripcion: "Escuchá la palabra en inglés y tocá el dibujo: colores, animales, números y más.",
    emoji: "👂",
    materia: "ingles",
    grados: [1, 2, 3, 4],
    url: "juegos/listen-tap.html",
  },
];
