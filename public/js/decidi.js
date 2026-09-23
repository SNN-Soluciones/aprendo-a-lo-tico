// 🔁 Lógica de "Repetí y decidí" (sin nada de pantalla, para poder probarla sola).
//
// El perezoso ahora MIRA hacia un lado y se mueve como un robot de verdad:
// avanzar, girar a la izquierda o a la derecha. Además hay bloques para repetir y para decidir.
//
// Mapas:  > < ^ v = perezoso mirando hacia ese lado   H = hoja   # = árbol   ~ = río   . = libre
//
// Bloques (el programa es una lista de bloques):
//   { t: "avanzar" }  { t: "izq" }  { t: "der" }  { t: "saltar" }         ← acciones
//   { t: "repetir", n: 3, cuerpo: [] }                                    ← repetir N veces
//   { t: "hasta", cuerpo: [] }                                            ← repetir hasta comer todas las hojas
//   { t: "si", cond: "rio" | "cerrado", si: [], sino: [] }                ← decidir

// dir: 0 = arriba, 1 = derecha, 2 = abajo, 3 = izquierda
export const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
const FLECHAS = { "^": 0, ">": 1, "v": 2, "<": 3 };
export const MAX_PASOS = 200;

// solucion: una forma de resolverlo (para las pruebas); objetivo = bloques para 3 ⭐
export const NIVELES = [
  {
    titulo: "Avanzá",
    voz: "Ahora el perezoso mira hacia un lado. Usá el bloque Avanzar para llevarlo hasta la hoja.",
    mapa: [".....", ">...H", "....."],
    bloques: ["avanzar"],
    solucion: [{ t: "avanzar" }, { t: "avanzar" }, { t: "avanzar" }, { t: "avanzar" }],
  },
  {
    titulo: "Girá",
    voz: "Para cambiar de camino, el perezoso tiene que girar. Girar no lo mueve: solo cambia hacia dónde mira.",
    mapa: [">..##", "##.##", "##.##", "##H##"],
    bloques: ["avanzar", "izq", "der"],
    solucion: [{ t: "avanzar" }, { t: "avanzar" }, { t: "der" }, { t: "avanzar" }, { t: "avanzar" }, { t: "avanzar" }],
  },
  {
    titulo: "Repetí",
    voz: "¡Qué camino tan largo! En vez de poner Avanzar muchas veces, usá el bloque Repetir. Tocá el número para cambiarlo.",
    mapa: ["........", ">......H", "........"],
    bloques: ["avanzar", "izq", "der", "repetir"],
    solucion: [{ t: "repetir", n: 7, cuerpo: [{ t: "avanzar" }] }],
  },
  {
    titulo: "La escalera",
    voz: "Mirá bien: la escalera repite los mismos pasos. Poné varios bloques adentro del Repetir.",
    mapa: [">.###", "#..##", "##..#", "###.H"],
    bloques: ["avanzar", "izq", "der", "repetir"],
    solucion: [
      { t: "repetir", n: 3, cuerpo: [{ t: "avanzar" }, { t: "der" }, { t: "avanzar" }, { t: "izq" }] },
      { t: "avanzar" },
    ],
  },
  {
    titulo: "Un repetir adentro de otro",
    voz: "Cada lado del cuadrado es igual. ¿Podés poner un Repetir adentro de otro Repetir?",
    mapa: [">..H", ".##.", ".##.", "H..H"],
    bloques: ["avanzar", "izq", "der", "repetir"],
    solucion: [{ t: "repetir", n: 3, cuerpo: [{ t: "repetir", n: 3, cuerpo: [{ t: "avanzar" }] }, { t: "der" }] }],
  },
  {
    titulo: "Saltá el río",
    voz: "El perezoso aprendió a saltar. El bloque Saltar pasa por encima de un río, pero solo si hay río adelante.",
    mapa: [".....", ">.~.H", "....."],
    bloques: ["avanzar", "izq", "der", "saltar", "repetir"],
    solucion: [{ t: "avanzar" }, { t: "saltar" }, { t: "avanzar" }],
  },
  {
    titulo: "Decidí",
    voz: "Los ríos están desordenados. Usá el bloque Si: si hay río adelante, saltá; si no, avanzá. ¡Y repetilo!",
    mapa: ["#########", ">~.~..~.H", "#########"],
    bloques: ["avanzar", "saltar", "repetir", "si"],
    solucion: [{ t: "repetir", n: 5, cuerpo: [{ t: "si", cond: "rio", si: [{ t: "saltar" }], sino: [{ t: "avanzar" }] }] }],
  },
  {
    titulo: "Repetí hasta llegar",
    voz: "Un caracol de árboles. Usá Repetir hasta la hoja con un Si: si el camino está cerrado, girá; si no, avanzá.",
    mapa: [">....", "####.", "..H#.", ".###.", "....."],
    bloques: ["avanzar", "izq", "der", "repetir", "hasta", "si"],
    solucion: [{ t: "hasta", cuerpo: [{ t: "si", cond: "cerrado", si: [{ t: "der" }], sino: [{ t: "avanzar" }] }] }],
  },
  {
    titulo: "Ríos y árboles",
    voz: "Ahora hay ríos y árboles. Vas a necesitar un Si adentro de otro Si.",
    mapa: [">~....", "#####~", "H~.~.."],
    bloques: ["avanzar", "izq", "der", "saltar", "repetir", "hasta", "si"],
    solucion: [{ t: "hasta", cuerpo: [{ t: "si", cond: "rio", si: [{ t: "saltar" }], sino: [{ t: "si", cond: "cerrado", si: [{ t: "der" }], sino: [{ t: "avanzar" }] }] }] }],
  },
  {
    titulo: "El gran reto",
    voz: "¡El gran reto! Dos hojas, ríos y árboles. Con un buen programa, el perezoso llega solito.",
    mapa: [">.~...", "#####H", ".H~.#~", ".####.", ".~..~."],
    bloques: ["avanzar", "izq", "der", "saltar", "repetir", "hasta", "si"],
    solucion: [{ t: "hasta", cuerpo: [{ t: "si", cond: "rio", si: [{ t: "saltar" }], sino: [{ t: "si", cond: "cerrado", si: [{ t: "der" }], sino: [{ t: "avanzar" }] }] }] }],
  },
];

/** Cuenta todos los bloques, también los de adentro. */
export function contar(lista) {
  return lista.reduce((s, b) => s + 1 + contar(b.cuerpo || []) + contar(b.si || []) + contar(b.sino || []), 0);
}
NIVELES.forEach(n => { n.objetivo ??= contar(n.solucion); });

/** Convierte el mapa en datos. */
export function leer(nivel) {
  const filas = nivel.mapa, alto = filas.length, ancho = filas[0].length;
  let salida = null;
  const hojas = [], celdas = [];
  filas.forEach((f, y) => [...f].forEach((c, x) => {
    if (c in FLECHAS) salida = { x, y, d: FLECHAS[c] };
    if (c === "H") hojas.push({ x, y });
    celdas.push({ x, y, tipo: c === "#" ? "arbol" : c === "~" ? "rio" : "libre" });
  }));
  const tipo = (x, y) => (x < 0 || y < 0 || x >= ancho || y >= alto) ? "borde" : celdas[y * ancho + x].tipo;
  return { ancho, alto, salida, hojas, celdas, tipo };
}

/**
 * Corre el programa. Devuelve los eventos para animarlo y cómo terminó.
 * Cada evento lleva `ruta`: dónde está el bloque en el programa (para iluminarlo).
 * resultado: "gano" | "choco" | "incompleto" | "cansado"
 */
export function ejecutar(juego, programa) {
  let { x, y, d } = juego.salida;
  const faltan = new Set(juego.hojas.map(h => `${h.x},${h.y}`));
  const eventos = [];
  let pasos = 0;
  class Fin { constructor(r) { Object.assign(this, r); } }

  const adelante = (k = 1) => juego.tipo(x + DX[d] * k, y + DY[d] * k);
  const comer = () => {
    const k = `${x},${y}`;
    if (faltan.delete(k)) eventos.push({ t: "comer", k });
    if (!faltan.size) throw new Fin({ resultado: "gano" });
  };
  const paso = () => { if (++pasos > MAX_PASOS) throw new Fin({ resultado: "cansado" }); };
  const choque = (motivo, ruta) => {
    eventos.push({ t: "choque", motivo, ruta, x, y, d });
    throw new Fin({ resultado: "choco", motivo, ruta });
  };

  function correr(lista, ruta) {
    lista.forEach((b, i) => {
      const r = [...ruta, i];
      switch (b.t) {
        case "avanzar": {
          paso();
          const t = adelante();
          if (t !== "libre") choque(t, r);
          x += DX[d]; y += DY[d];
          eventos.push({ t: "mover", x, y, d, ruta: r });
          comer();
          break;
        }
        case "izq": case "der":
          paso();
          d = (d + (b.t === "der" ? 1 : 3)) % 4;
          eventos.push({ t: "girar", x, y, d, ruta: r });
          break;
        case "saltar": {
          paso();
          if (adelante() !== "rio") choque("sinrio", r);
          if (adelante(2) !== "libre") choque("aterrizaje", r);
          x += DX[d] * 2; y += DY[d] * 2;
          eventos.push({ t: "saltar", x, y, d, ruta: r });
          comer();
          break;
        }
        case "repetir":
          for (let k = 0; k < b.n; k++) { paso(); correr(b.cuerpo, [...r, "cuerpo"]); }
          break;
        case "hasta":
          if (!b.cuerpo.length) choque("vacio", r);
          while (true) { paso(); correr(b.cuerpo, [...r, "cuerpo"]); }
        case "si": {
          paso();
          const t = adelante();
          const cumple = b.cond === "rio" ? t === "rio" : t === "arbol" || t === "borde";
          eventos.push({ t: "decidir", cumple, ruta: r });
          correr(cumple ? b.si : b.sino, [...r, cumple ? "si" : "sino"]);
          break;
        }
      }
    });
  }

  let fin;
  try { correr(programa, []); fin = { resultado: "incompleto" }; }
  catch (e) { if (!(e instanceof Fin)) throw e; fin = e; }
  return { ...fin, eventos, x, y, d, faltan: faltan.size, pasos };
}
