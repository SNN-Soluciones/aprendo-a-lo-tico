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

const av = { t: "avanzar" }, der = { t: "der" }, izq = { t: "izq" }, saltar = { t: "saltar" };
const rep = (n, ...cuerpo) => ({ t: "repetir", n, cuerpo });
const hasta = (...cuerpo) => ({ t: "hasta", cuerpo });
const si = (cond, siB, sinoB) => ({ t: "si", cond, si: siB, sino: sinoB });

// Etapas: cada concepto se practica varias veces antes de pasar al siguiente.
export const ETAPAS = [
  { id: "pasos", nombre: "Pasos y giros", emoji: "🦥" },
  { id: "repetir", nombre: "Repetir", emoji: "🔁" },
  { id: "anidado", nombre: "Repetir adentro de repetir", emoji: "🪆" },
  { id: "saltar", nombre: "Saltar", emoji: "🤸" },
  { id: "si", nombre: "Decidir con Si", emoji: "❓" },
  { id: "hasta", nombre: "Repetir hasta", emoji: "♾️" },
  { id: "retos", nombre: "Grandes retos", emoji: "🏆" },
];

// Cada nivel:
//   id (para guardar el progreso), etapa, titulo, voz, mapa, bloques (los que se pueden usar)
//   solucion: una forma de resolverlo (para las pruebas); objetivo = bloques para 3 ⭐
//   inicial:  programa que ya viene puesto. En los niveles 🐞 trae un error para arreglar.
//   pistas:   se muestran de una en una con el botón 💡
const TODOS = ["avanzar", "izq", "der", "saltar", "repetir", "hasta", "si"];
export const NIVELES = [
  // 🦥 Pasos y giros
  { id: "avanza", etapa: "pasos", titulo: "Avanzá",
    voz: "Ahora el perezoso mira hacia un lado. Usá el bloque Avanzar para llevarlo hasta la hoja.",
    mapa: [".....", ">...H", "....."], bloques: ["avanzar"],
    solucion: [av, av, av, av],
    pistas: ["La flechita amarilla dice hacia dónde mira el perezoso.", "Contá las casillas hasta la hoja: son 4."] },
  { id: "gira", etapa: "pasos", titulo: "Girá",
    voz: "Para cambiar de camino, el perezoso tiene que girar. Girar no lo mueve: solo cambia hacia dónde mira.",
    mapa: [">..##", "##.##", "##.##", "##H##"], bloques: ["avanzar", "izq", "der"],
    solucion: [av, av, der, av, av, av],
    pistas: ["Primero avanza 2 casillas.", "Cuando gira a la derecha, queda mirando para abajo."] },
  { id: "rodea", etapa: "pasos", titulo: "Rodeá el árbol",
    voz: "Un camino con varias vueltas. Imaginate que sos el perezoso: ¿para dónde doblarías?",
    mapa: [">.#.H", "#...#"], bloques: ["avanzar", "izq", "der"],
    solucion: [av, der, av, izq, av, av, izq, av, der, av],
    pistas: ["Baja una casilla para pasar por debajo del árbol.", "Avanzar, girar a la derecha, avanzar, girar a la izquierda…", "…avanzar, avanzar, girar a la izquierda, avanzar, girar a la derecha, avanzar."] },
  { id: "arregla-giro", etapa: "pasos", titulo: "🐞 Arreglá el programa", depurar: true,
    voz: "¡Este programa tiene un error! Corrélo para ver dónde choca el perezoso y arreglalo.",
    mapa: ["v###", ".###", "...H"], bloques: ["avanzar", "izq", "der"],
    inicial: [av, av, der, av, av, av],
    solucion: [av, av, izq, av, av, av],
    pistas: ["El perezoso empieza mirando para abajo.", "Si mira para abajo y gira a la derecha, queda mirando a la izquierda. ¿Ese es el lado correcto?", "Cambiá el Girar a la derecha por Girar a la izquierda."] },

  // 🔁 Repetir
  { id: "repeti", etapa: "repetir", titulo: "Repetí",
    voz: "¡Qué camino tan largo! En vez de poner Avanzar muchas veces, usá el bloque Repetir. Tocá el número para cambiarlo.",
    mapa: ["........", ">......H", "........"], bloques: ["avanzar", "izq", "der", "repetir"],
    solucion: [rep(7, av)],
    pistas: ["Poné un Repetir y adentro un Avanzar.", "Contá las casillas: tiene que repetir 7 veces."] },
  { id: "cuadradito", etapa: "repetir", titulo: "El cuadradito",
    voz: "Tres hojas en las esquinas. Fijate: en cada lado el perezoso hace lo mismo. Poné varios bloques adentro del Repetir.",
    mapa: [">.H", ".#.", "H.H"], bloques: ["avanzar", "izq", "der", "repetir"],
    solucion: [rep(3, av, av, der)],
    pistas: ["Un lado es: avanzar, avanzar y girar a la derecha.", "Repetí ese lado 3 veces."] },
  { id: "escalera", etapa: "repetir", titulo: "La escalera",
    voz: "Mirá bien: la escalera repite los mismos pasos. Poné varios bloques adentro del Repetir.",
    mapa: [">.###", "#..##", "##..#", "###.H"], bloques: ["avanzar", "izq", "der", "repetir"],
    solucion: [rep(3, av, der, av, izq), av],
    pistas: ["Un escalón: avanzar, girar a la derecha, avanzar, girar a la izquierda.", "Repetí el escalón 3 veces y al final avanzá una vez más."] },
  { id: "arregla-numero", etapa: "repetir", titulo: "🐞 Arreglá el programa", depurar: true,
    voz: "¡Uy! Este programa casi funciona, pero algo está mal. Corrélo y fijate dónde se queda el perezoso.",
    mapa: ["......", ">....H", "......"], bloques: ["avanzar", "izq", "der", "repetir"],
    inicial: [rep(4, av)],
    solucion: [rep(5, av)],
    pistas: ["El perezoso se queda a un paso de la hoja.", "Cambiá el número del Repetir: tocalo para subirlo."] },

  // 🪆 Repetir adentro de repetir
  { id: "cuadrado-grande", etapa: "anidado", titulo: "El cuadrado grande",
    voz: "Ahora cada lado tiene tres pasos. En vez de avanzar tres veces, ¿podés poner un Repetir adentro de otro Repetir?",
    mapa: [">..H", ".##.", ".##.", "H..H"], bloques: ["avanzar", "izq", "der", "repetir"],
    solucion: [rep(3, rep(3, av), der)],
    pistas: ["Un lado es: avanzar 3 veces y girar a la derecha.", "El «avanzar 3 veces» también es un Repetir.", "Repetir 3 veces: (repetir 3 veces: avanzar) y girar a la derecha."] },
  { id: "rectangulo", etapa: "anidado", titulo: "El rectángulo largo",
    voz: "Un rectángulo: lados largos de cinco pasos y cortos de dos. Usá un Repetir para cada lado, y otro para todo.",
    mapa: [">....H", ".####.", "H....H"], bloques: ["avanzar", "izq", "der", "repetir"],
    solucion: [rep(2, rep(5, av), der, rep(2, av), der)],
    pistas: ["Lado largo: repetir 5 veces avanzar. Lado corto: repetir 2 veces avanzar.", "Largo, girar, corto, girar… y eso se repite 2 veces."] },
  { id: "escalera-doble", etapa: "anidado", titulo: "Escalones de dos",
    voz: "Una escalera con escalones de dos pasos. ¡Repetir adentro de repetir otra vez!",
    mapa: [">..####", "##.####", "##...##", "####.##", "####..H"], bloques: ["avanzar", "izq", "der", "repetir"],
    solucion: [rep(2, rep(2, av), der, rep(2, av), izq), rep(2, av)],
    pistas: ["Un escalón: avanzar 2, girar a la derecha, avanzar 2, girar a la izquierda.", "Repetí el escalón 2 veces y al final avanzá 2 más."] },
  { id: "arregla-anidado", etapa: "anidado", titulo: "🐞 Arreglá el programa", depurar: true,
    voz: "Este programa usa un Repetir adentro de otro, pero tiene un error. ¡Encontralo!",
    mapa: [">..H", ".##.", ".##.", "H..H"], bloques: ["avanzar", "izq", "der", "repetir"],
    inicial: [rep(3, rep(3, av), izq)],
    solucion: [rep(3, rep(3, av), der)],
    pistas: ["Corrélo y fijate hacia dónde gira en la primera esquina.", "Las hojas están para la derecha: cambiá el giro."] },

  // 🤸 Saltar
  { id: "salta", etapa: "saltar", titulo: "Saltá el río",
    voz: "El perezoso aprendió a saltar. El bloque Saltar pasa por encima de un río, pero solo si hay río adelante.",
    mapa: [".....", ">.~.H", "....."], bloques: ["avanzar", "izq", "der", "saltar", "repetir"],
    solucion: [av, saltar, av],
    pistas: ["Avanzá hasta la orilla del río.", "Avanzar, saltar, avanzar."] },
  { id: "rios-fila", etapa: "saltar", titulo: "Ríos en fila",
    voz: "Tres ríos, uno detrás del otro. ¿Se te ocurre cómo hacerlo con muy pocos bloques?",
    mapa: ["#######", ">~.~.~H", "#######"], bloques: ["avanzar", "saltar", "repetir"],
    solucion: [rep(3, saltar)],
    pistas: ["Cada salto cae justo antes del siguiente río.", "Repetir 3 veces: saltar."] },

  // ❓ Decidir con Si
  { id: "decidi", etapa: "si", titulo: "Decidí",
    voz: "Los ríos están desordenados. Usá el bloque Si: si hay río adelante, saltá; si no, avanzá. ¡Y repetilo!",
    mapa: ["#########", ">~.~..~.H", "#########"], bloques: ["avanzar", "saltar", "repetir", "si"],
    solucion: [rep(5, si("rio", [saltar], [av]))],
    pistas: ["Adentro del Si, en la primera parte poné Saltar y en «si no» poné Avanzar.", "Metelo en un Repetir. Probá con 5 veces."] },
  { id: "si-cerrado", etapa: "si", titulo: "Si está cerrado",
    voz: "Un pasillo con curvas. Cambiá el Si para que diga «está cerrado»: si está cerrado, girá; si no, avanzá.",
    mapa: [">...#", "###.#", "###.#", "H...#"], bloques: ["avanzar", "izq", "der", "repetir", "si"],
    solucion: [rep(11, si("cerrado", [der], [av]))],
    pistas: ["Tocá donde dice «hay río» para cambiarlo a «está cerrado».", "Si está cerrado: girar a la derecha. Si no: avanzar.", "El Repetir tiene que ir 11 veces: 9 pasos y 2 giros."] },
  { id: "arregla-si", etapa: "si", titulo: "🐞 Arreglá el programa", depurar: true,
    voz: "Alguien armó este programa con el Si al revés. ¿Lo podés arreglar?",
    mapa: ["#########", ">~.~..~.H", "#########"], bloques: ["avanzar", "saltar", "repetir", "si"],
    inicial: [rep(5, si("rio", [av], [saltar]))],
    solucion: [rep(5, si("rio", [saltar], [av]))],
    pistas: ["Cuando hay río adelante, ¿qué tiene que hacer: avanzar o saltar?", "Intercambiá los bloques de adentro del Si: quitalos y ponelos al revés."] },

  // ♾️ Repetir hasta
  { id: "hasta-hoja", etapa: "hasta", titulo: "Repetí hasta la hoja",
    voz: "¡Qué largo! No hace falta contar: el bloque Repetir hasta sigue y sigue hasta comerse las hojas.",
    mapa: ["############", ">..........H", "############"], bloques: ["avanzar", "repetir", "hasta"],
    solucion: [hasta(av)],
    pistas: ["El bloque se llama Repetir hasta la hoja.", "Adentro solo va Avanzar."] },
  { id: "hasta-rios", etapa: "hasta", titulo: "Hasta, con ríos",
    voz: "Ríos desordenados y un camino largo. Juntá lo que ya sabés: Repetir hasta, con un Si adentro.",
    mapa: ["###########", ">.~.~..~.~H", "###########"], bloques: ["avanzar", "saltar", "repetir", "hasta", "si"],
    solucion: [hasta(si("rio", [saltar], [av]))],
    pistas: ["Es como el nivel Decidí, pero sin contar.", "Repetir hasta: si hay río, saltar; si no, avanzar."] },
  { id: "caracol", etapa: "hasta", titulo: "El caracol",
    voz: "Un caracol de árboles. Usá Repetir hasta la hoja con un Si: si el camino está cerrado, girá; si no, avanzá.",
    mapa: [">....", "####.", "..H#.", ".###.", "....."], bloques: ["avanzar", "izq", "der", "repetir", "hasta", "si"],
    solucion: [hasta(si("cerrado", [der], [av]))],
    pistas: ["Siempre que choca con algo, gira a la derecha.", "Repetir hasta: si está cerrado, girar a la derecha; si no, avanzar."] },

  // 🏆 Grandes retos
  { id: "rios-arboles", etapa: "retos", titulo: "Ríos y árboles",
    voz: "Ahora hay ríos y árboles. Vas a necesitar un Si adentro de otro Si.",
    mapa: [">~....", "#####~", "H~.~.."], bloques: TODOS,
    solucion: [hasta(si("rio", [saltar], [si("cerrado", [der], [av])]))],
    pistas: ["Primero preguntá si hay río. En el «si no», preguntá si está cerrado.", "Repetir hasta: si hay río, saltar; si no, (si está cerrado, girar a la derecha; si no, avanzar)."] },
  { id: "caracol-izq", etapa: "retos", titulo: "El caracol al revés",
    voz: "Otro caracol, pero este da vueltas para el otro lado.",
    mapa: ["....<", ".####", ".#H..", ".###.", "....."], bloques: TODOS,
    solucion: [hasta(si("cerrado", [izq], [av]))],
    pistas: ["Es como el caracol de antes, pero girando a la izquierda."] },
  { id: "arregla-reto", etapa: "retos", titulo: "🐞 El gran error", depurar: true,
    voz: "Este programa es largo y tiene un error escondido. Corrélo con calma y fijate qué bloque se pone rojo.",
    mapa: [">~....", "#####~", "H~.~.."], bloques: TODOS,
    inicial: [hasta(si("cerrado", [saltar], [si("rio", [der], [av])]))],
    solucion: [hasta(si("rio", [saltar], [si("cerrado", [der], [av])]))],
    pistas: ["Fijate qué pregunta hace cada Si y qué hace en cada caso.", "Saltar va con «hay río» y girar va con «está cerrado». Cambiá las condiciones de los dos Si."] },
  { id: "gran-reto", etapa: "retos", titulo: "El gran reto",
    voz: "¡El gran reto! Dos hojas, ríos y árboles. Con un buen programa, el perezoso llega solito.",
    mapa: [">.~...", "#####H", ".H~.#~", ".####.", ".~..~."], bloques: TODOS,
    solucion: [hasta(si("rio", [saltar], [si("cerrado", [der], [av])]))],
    pistas: ["Sirve el mismo programa de Ríos y árboles."] },
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
