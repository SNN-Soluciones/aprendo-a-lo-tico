// 🏘️ Lógica de «Mi comunidad» (sin pantalla, para poder probarla sola con node).
// Oficios, lugares del barrio, servicios, cuidar la comunidad y cuidarnos en la calle, para Prepa a 3°.
// Todo se juega con dibujos y voz: no hace falta leer.
//
// Cada ronda tiene UNA sola respuesta: lo que también podría servir (`tambien`) nunca sale como opción,
// y los oficios del mismo grupo (la misma bata de doctor) nunca salen juntos.

// ---------- Oficios ----------
// f y m: [dibujo, nombre] de la mujer y del hombre (todos los oficios son de mujeres y de hombres).
// marca: dibujito que se le pone encima para distinguirlo (la veterinaria y la dentista usan la misma bata).
const O = (f, m, hace, extra = {}) => ({ f, m, hace, ...extra });
export const OFICIOS = {
  bombero: O(["👩‍🚒", "bombera"], ["👨‍🚒", "bombero"], "apaga el fuego y rescata a las personas", { basico: true }),
  doctor: O(["👩‍⚕️", "doctora"], ["👨‍⚕️", "doctor"], "nos revisa y nos cura cuando estamos enfermos", { basico: true, grupo: "salud" }),
  veterinario: O(["👩‍⚕️", "veterinaria"], ["👨‍⚕️", "veterinario"], "cura a los animales cuando están enfermos", { grupo: "salud", marca: "🐶" }),
  dentista: O(["👩‍⚕️", "dentista"], ["👨‍⚕️", "dentista"], "nos revisa y nos cuida los dientes", { grupo: "salud", marca: "🦷" }),
  mecanico: O(["👩‍🔧", "mecánica"], ["👨‍🔧", "mecánico"], "arregla los carros y las motos"),
  panadero: O(["👩‍🍳", "panadera"], ["👨‍🍳", "panadero"], "hace el pan bien temprano, en el horno", { basico: true }),
  maestro: O(["👩‍🏫", "maestra"], ["👨‍🏫", "maestro"], "nos enseña a leer, a escribir y a contar", { basico: true }),
  agricultor: O(["👩‍🌾", "agricultora"], ["👨‍🌾", "agricultor"], "siembra y cosecha la comida que comemos", { basico: true }),
  policia: O(["👮‍♀️", "policía"], ["👮‍♂️", "policía"], "nos cuida y ayuda a que se cumplan las reglas", { basico: true }),
  constructor: O(["👷‍♀️", "constructora"], ["👷‍♂️", "constructor"], "construye casas, escuelas y puentes"),
};
export const BASICOS = Object.keys(OFICIOS).filter(k => OFICIOS[k].basico);

// ¿Quién nos ayuda si…?  tambien: otros oficios que también podrían ayudar (nunca salen como opción)
const AY = (quien, e, t, tambien = []) => ({ quien, e, t, tambien });
export const AYUDA = [
  AY("bombero", "🔥", "Hay fuego en la cocina de una casa."),
  AY("bombero", "🐱", "Un gatito se subió a un árbol altísimo y no puede bajar."),
  AY("bombero", "🌾", "Se está quemando un potrero."),
  AY("doctor", "🤒", "Tengo fiebre y me duele la cabeza."),
  AY("doctor", "🤢", "Me duele mucho la panza."),
  AY("doctor", "😷", "Tengo mucha tos y no se me quita."),
  AY("veterinario", "🐶", "Mi perrito está enfermo y no quiere comer."),
  AY("veterinario", "🐈", "La gata de la casa se lastimó una pata."),
  AY("veterinario", "🐄", "La vaca de la finca está enferma.", ["agricultor"]),
  AY("dentista", "🦷", "Me duele una muela."),
  AY("dentista", "😁", "Me tienen que revisar los dientes."),
  AY("mecanico", "🚗", "El carro de la familia no quiere arrancar."),
  AY("mecanico", "🏍️", "A la moto del tío se le dañó el motor."),
  AY("panadero", "🥖", "Queremos pan recién hecho para el cafecito."),
  AY("panadero", "🎂", "Necesitamos un queque para el cumpleaños."),
  AY("maestro", "📖", "Quiero aprender a leer y a escribir."),
  AY("maestro", "🔢", "Quiero aprender a sumar y a restar."),
  AY("agricultor", "🌽", "Hay que sembrar el maíz y los frijoles en la finca."),
  AY("agricultor", "🥕", "Queremos zanahorias y papas frescas para la sopa."),
  AY("policia", "🧒", "Me perdí en el centro y no encuentro a mi mamá."),
  AY("policia", "🚦", "Se dañó el semáforo y los carros no saben cuándo pasar."),
  AY("policia", "💥", "Chocaron dos carros en la esquina.", ["bombero", "doctor", "mecanico"]),
  AY("constructor", "🧱", "La escuela necesita un aula nueva."),
  AY("constructor", "🏠", "A la casa se le cayó una pared."),
];

// ¿Quién usa esto?  (verbo: usa, maneja, hace, siembra)
const C = (quien, e, n, verbo, para, tambien = []) => ({ quien, e, n, verbo, para, tambien });
export const COSAS = [
  C("bombero", "🧯", "el extintor", "usa", "para apagar el fuego"),
  C("bombero", "🚒", "el camión de bomberos", "maneja", "para llegar rápido a ayudar"),
  C("doctor", "🩺", "el estetoscopio", "usa", "para escuchar el corazón"),
  C("doctor", "🌡️", "el termómetro", "usa", "para ver si tenemos fiebre"),
  C("mecanico", "🔧", "la llave", "usa", "para apretar los tornillos del carro"),
  C("panadero", "🥖", "el pan", "hace", "en el horno, bien temprano"),
  C("maestro", "📚", "los libros", "usa", "para enseñarle a la clase"),
  C("agricultor", "🚜", "el tractor", "maneja", "para preparar la tierra"),
  C("agricultor", "🌽", "el maíz", "siembra", "en la finca"),
  C("policia", "🚓", "la patrulla", "maneja", "para cuidar las calles"),
  C("constructor", "🧱", "los ladrillos", "usa", "para hacer las paredes"),
  C("constructor", "🔨", "el martillo", "usa", "para clavar los clavos", ["mecanico"]),
];

// ---------- Lugares del barrio ----------
// n: nombre con artículo · voz: cómo se dice (si se escribe distinto) · que: qué se hace ahí
const L = (e, n, que, extra = {}) => ({ e, n, que, ...extra });
export const LUGARES = {
  escuela: L("🏫", "la escuela", "ahí aprendemos y jugamos con los compañeros", { basico: true }),
  ebais: L("🏥", "el EBAIS", "ahí nos atienden cuando estamos enfermos y nos vacunan", { basico: true, voz: "el ebáis" }),
  pulperia: L("🏪", "la pulpería", "ahí compramos arroz, frijoles, huevos y confites", { basico: true }),
  feria: L("🥕", "la feria del agricultor", "ahí los agricultores venden frutas y verduras frescas"),
  parque: L("🌳", "el parque", "ahí jugamos en el play y paseamos", { basico: true }),
  plaza: L("⚽", "la plaza", "ahí se juegan los partidos de fútbol", { basico: true }),
  biblioteca: L("📚", "la biblioteca", "ahí nos prestan libros para leer"),
  bomberos: L("🚒", "la estación de bomberos", "ahí están los bomberos con su camión, listos para ayudar"),
  correo: L("📮", "el correo", "ahí mandamos cartas y paquetes"),
  banco: L("🏦", "el banco", "ahí se guarda la plata"),
  salon: L("👥", "el salón comunal", "ahí se reúnen los vecinos del barrio"),
  parada: L("🚏", "la parada del bus", "ahí esperamos el bus", { basico: true }),
  farmacia: L("💊", "la farmacia", "ahí venden medicinas"),
  taller: L("🔧", "el taller", "ahí arreglan los carros"),
  panaderia: L("🥖", "la panadería", "ahí hacen y venden el pan"),
  finca: L("🐄", "la finca", "ahí se siembra y se cuidan los animales"),
};
export const LUGARES_BASICOS = Object.keys(LUGARES).filter(k => LUGARES[k].basico);

// ¿Adónde vamos para…?  tambien: otros lugares donde también se podría (nunca salen como opción)
const N = (lugar, para, tambien = []) => ({ lugar, para, tambien });
export const ADONDE = [
  N("escuela", "aprender con la maestra y los compañeros", ["biblioteca"]),
  N("ebais", "vacunarnos"),
  N("ebais", "que la doctora nos revise", ["farmacia"]),
  N("pulperia", "comprar arroz, frijoles y un confite"),
  N("feria", "comprar frutas y verduras frescas, directo del agricultor", ["pulperia"]),
  N("parque", "jugar en el play, en los columpios", ["escuela", "plaza"]),
  N("plaza", "jugar un partido de fútbol", ["parque", "escuela"]),
  N("biblioteca", "prestar un libro de cuentos", ["escuela"]),
  N("bomberos", "visitar a los bomberos y conocer su camión"),
  N("correo", "mandarle una carta a la abuela"),
  N("banco", "guardar la plata"),
  N("salon", "ir a la reunión de los vecinos del barrio", ["escuela"]),
  N("parada", "esperar el bus"),
  N("farmacia", "comprar una medicina para la tos", ["ebais", "pulperia"]),
  N("taller", "que arreglen el carro"),
  N("panaderia", "comprar pan recién hecho", ["pulperia"]),
  N("finca", "ver las vacas y las gallinas"),
];

// ¿Dónde trabaja?
export const TRABAJA = { bombero: "bomberos", doctor: "ebais", mecanico: "taller", panadero: "panaderia", maestro: "escuela", agricultor: "finca" };

// ---------- Servicios ----------
export const SERVICIOS = {
  agua: { e: "🚰", n: "el agua", cuida: "Hay que cuidarla: cerrá la llave cuando no la estés usando." },
  luz: { e: "💡", n: "la luz", cuida: "La luz es electricidad: apagala cuando salgás del cuarto." },
  basura: { e: "🚛", n: "el camión de la basura", cuida: "Sacamos la basura el día que pasa el camión." },
  bus: { e: "🚌", n: "el bus", cuida: "En el bus esperamos en la parada y nos sentamos bien." },
  telefono: { e: "📞", n: "el teléfono", cuida: "Con el teléfono hablamos con la gente que está lejos." },
};
export const USOS = [
  ["agua", "bañarnos y lavarnos las manos"], ["agua", "regar las plantas"], ["agua", "cocinar los frijoles"],
  ["luz", "ver de noche dentro de la casa"], ["luz", "que funcionen la refri y la tele"],
  ["basura", "llevarse la basura de las casas"],
  ["bus", "ir al centro sin carro"], ["bus", "viajar a otro pueblo"],
  ["telefono", "hablar con la abuela que vive lejos"],
].map(([s, para]) => ({ s, para }));

// ---------- Acciones: cuidar el barrio y cuidarnos ----------
// bien y malas: [dibujo, qué se hace, por qué] · luz: el semáforo del muñequito («roja» o «verde»)
// voz: cómo se dice la opción (para los números) · numero: la opción es un número grande
const A = (e, t, porque, extra = {}) => ({ e, t, porque, ...extra });
const ACC = (e, t, pregunta, bien, malas, extra = {}) => ({ e, t, pregunta, bien, malas, ...extra });
export const CUIDAR = [
  ACC("🍬", "Te comiste un confite y te quedó el papelito.", "¿Qué hacés con el papelito?",
    A("🚮", "Botarlo en el basurero", "así el barrio queda limpio"),
    [A("🛣️", "Tirarlo en la calle", "la basura en la calle tapa las alcantarillas y ensucia el barrio"),
      A("🌳", "Esconderlo en el zacate del parque", "la basura en el zacate les hace daño a los animales")]),
  ACC("🥤", "Te terminaste el refresco de la botella de plástico.", "¿Qué hacés con la botella?",
    A("♻️", "Separarla para reciclar", "así el plástico se vuelve a usar y no llega al mar"),
    [A("🏞️", "Tirarla al río", "la basura del río llega al mar y lastima a las tortugas"),
      A("🛣️", "Dejarla tirada en la calle", "ensucia el barrio y tapa las alcantarillas")]),
  ACC("😁", "Te estás lavando los dientes.", "¿Qué hacés con la llave del agua?",
    A("🚰", "Cerrarla mientras te cepillás", "así no se desperdicia el agua"),
    [A("💦", "Dejar el agua corriendo todo el rato", "se desperdicia muchísima agua"),
      A("🌊", "Jugar a mojar todo el baño", "se desperdicia el agua y el piso queda resbaloso")]),
  ACC("🚪", "Salís del cuarto y ya no queda nadie adentro.", "¿Qué hacés con la luz?",
    A("👆", "Apagarla", "así ahorramos electricidad"),
    [A("💡", "Dejarla encendida", "se gasta electricidad sin que nadie la use"),
      A("📺", "Encender también la tele", "se gasta electricidad sin que nadie la vea")]),
  ACC("🌷", "En el parque hay unas flores muy bonitas.", "¿Qué hacés?",
    A("👀", "Verlas y dejarlas en su lugar", "así todos las podemos disfrutar"),
    [A("✊", "Arrancarlas todas", "se mueren y nadie más las puede ver"),
      A("👟", "Pisarlas jugando", "se quiebran y se mueren")]),
  ACC("🐕", "Tu perro hizo popó en el parque.", "¿Qué hacés?",
    A("🛍️", "Recogerla con una bolsa y botarla", "así el parque queda limpio para jugar"),
    [A("🙈", "Dejarla ahí", "alguien la puede pisar y ensucia el parque"),
      A("🍂", "Taparla con unas hojas", "sigue ahí y alguien la puede pisar")]),
  ACC("🪑", "Pusieron una banca nueva en el parque.", "¿Qué hacés?",
    A("😌", "Sentarte a descansar", "las bancas son para que todos descansemos"),
    [A("🖍️", "Rayarla", "se ve fea y hay que volverla a pintar"),
      A("🥾", "Pararte encima con los zapatos con barro", "se ensucia para el que se siente después")]),
  ACC("🏖️", "Tu familia fue a pasear a la playa.", "¿Qué hacen con la basura?",
    A("🎒", "Llevársela de vuelta y botarla en un basurero", "así la playa queda limpia para las tortugas y los cangrejos"),
    [A("🥤", "Dejar los vasos en la arena", "el mar se los lleva y lastiman a los animales"),
      A("🌊", "Tirar las bolsas al mar", "las tortugas se las comen porque creen que son medusas")]),
];

export const SEGURIDAD = [
  ACC("🚦", "Vas a cruzar la calle y el muñequito del semáforo está en rojo.", "¿Qué hacés?",
    A("✋", "Esperar en la acera", "el muñequito rojo dice: ¡alto, esperá!"),
    [A("🏃", "Cruzar corriendo", "los carros están pasando y te pueden atropellar"),
      A("🙈", "Cruzar sin mirar", "los carros están pasando y no te ven")], { luz: "roja", basico: true }),
  ACC("🚦", "El muñequito del semáforo se puso en verde.", "¿Cómo cruzás?",
    A("👩‍👧", "De la mano de un adulto, mirando a los dos lados", "así cruzamos seguros"),
    [A("🏃", "Corriendo sin mirar", "aunque esté en verde, siempre hay que mirar a los dos lados"),
      A("📱", "Viendo el celular", "hay que ponerles atención a los carros")], { luz: "verde", basico: true }),
  ACC("🦓", "Tenés que cruzar la calle para llegar a la escuela.", "¿Por dónde cruzás?",
    A("🦓", "Por la cebra, de la mano de un adulto", "la cebra es el paso para la gente: tiene rayas, como una cebra"),
    [A("🚗", "Entre los carros parqueados", "los choferes no te pueden ver"),
      A("🏃", "Por donde sea, corriendo", "los carros no esperan que pasés por ahí")], { basico: true }),
  ACC("🚲", "Vas a andar en bici.", "¿Qué te ponés?",
    A("🚴", "El casco", "el casco te cuida la cabeza si te caés"),
    [A("🙈", "Nada, así está bien", "si te caés, te podés golpear la cabeza"),
      A("🕶️", "Solo los anteojos de sol", "los anteojos no te cuidan la cabeza")], { basico: true }),
  ACC("🚗", "Te subís al carro para ir de paseo.", "¿Qué hacés?",
    A("💺", "Sentarte atrás con el cinturón puesto", "el cinturón te cuida si el carro frena de golpe"),
    [A("🤸", "Ir de pie en el asiento", "si el carro frena, te podés golpear"),
      A("🙈", "Ir sin cinturón", "si el carro frena, te podés golpear")], { basico: true }),
  ACC("🚨", "Hay una emergencia: alguien se lastimó mucho.", "¿A qué número llamamos?",
    A("", "9-1-1", "en Costa Rica, el 9-1-1 es el número de emergencias. Solo se llama cuando de verdad hay una emergencia", { voz: "nueve, uno, uno", numero: true }),
    [A("", "1-2-3", "ese no es el número de emergencias", { voz: "uno, dos, tres", numero: true }),
      A("", "5-5-5", "ese no es el número de emergencias", { voz: "cinco, cinco, cinco", numero: true }),
      A("", "7-7-7", "ese no es el número de emergencias", { voz: "siete, siete, siete", numero: true })]),
  ACC("🍬", "Una persona que no conocés te ofrece un confite y te dice que te vayás con ella.", "¿Qué hacés?",
    A("🙅", "Decirle que no y contarle a un adulto de confianza", "nunca nos vamos con alguien que no conocemos"),
    [A("🚶", "Irte con esa persona", "puede ser peligroso: nunca te vayás con alguien que no conocés"),
      A("🤐", "No contarle a nadie", "los adultos de confianza te cuidan si saben qué pasó")]),
  ACC("🔥", "Encontraste unos fósforos en la mesa.", "¿Qué hacés?",
    A("🙋", "Dárselos a un adulto", "los fósforos pueden empezar un incendio"),
    [A("🔥", "Jugar con ellos", "te podés quemar o quemar la casa"),
      A("🎒", "Guardarlos en el bulto para después", "son peligrosos: hay que dárselos a un adulto")]),
  ACC("🔌", "Hay un enchufe en la pared del cuarto.", "¿Qué hacés?",
    A("🙅", "No meterle nada", "la electricidad es muy peligrosa"),
    [A("✏️", "Meterle un lápiz", "te puede pegar la corriente"),
      A("👆", "Meterle los dedos", "te puede pegar la corriente")]),
  ACC("🛒", "Estás en el súper y no ves a tu familia por ningún lado.", "¿Qué hacés?",
    A("🙋", "Quedarte ahí y pedirle ayuda a la cajera", "las personas que trabajan ahí te ayudan a encontrar a tu familia"),
    [A("🏃", "Salirte a la calle a buscarla", "afuera es más difícil que te encuentren"),
      A("🙈", "Esconderte", "así nadie te puede encontrar")]),
];

// ---------- Historias (un poquito más largas) ----------
// {n} nombre · {o} o/a · {lo} lo/la.  resp: { oficio } | { lugar } | { bien, malas }
const H = (e, t, pregunta, resp, tambien = [], extra = {}) => ({ e, t, pregunta, resp, tambien, ...extra });
export const HISTORIAS = [
  H("🚲", "{n} se cayó de la bici, se raspó la rodilla y le duele mucho.", "¿Adónde {lo} llevan?", { lugar: "ebais" }, ["farmacia"]),
  H("🍳", "La mamá de {n} necesita arroz y huevos para el almuerzo, y no quiere ir hasta el centro.", "¿Adónde va?", { lugar: "pulperia" }, ["feria"]),
  H("🌋", "{n} tiene que hacer una tarea sobre los volcanes, y en la casa no hay libros de eso.", "¿Adónde puede ir?", { lugar: "biblioteca" }, ["escuela"]),
  H("✉️", "La abuela de {n} vive en Limón, y {n} le hizo un dibujo para mandárselo.", "¿Adónde lo lleva?", { lugar: "correo" }),
  H("🚌", "{n} y su papá van para San José y no tienen carro.", "¿Adónde van a esperar?", { lugar: "parada" }),
  H("🎂", "Es el cumpleaños de la abuela de {n} y le quieren llevar un queque.", "¿Adónde van a comprarlo?", { lugar: "panaderia" }, ["pulperia"]),
  H("🐷", "{n} ahorró plata en su alcancía, y su mamá le dice que la pueden guardar en una cuenta.", "¿Adónde van?", { lugar: "banco" }),
  H("🐶", "El perro de {n} se comió algo raro y está vomitando.", "¿Quién le ayuda?", { oficio: "veterinario" }),
  H("💨", "De la casa del vecino de {n} sale mucho humo negro.", "¿Quién nos ayuda?", { oficio: "bombero" }, ["policia"]),
  H("🚗", "El carro de la tía de {n} hace un ruido raro y no quiere arrancar.", "¿Quién le ayuda?", { oficio: "mecanico" }),
  H("🌽", "En la escuela de {n} quieren hacer una huerta y no saben cómo sembrar el maíz.", "¿Quién les puede enseñar?", { oficio: "agricultor" }, ["maestro"]),
  H("🦷", "A {n} se le movió un diente y le duele cuando come.", "¿Quién le ayuda?", { oficio: "dentista" }),
  H("🧱", "En el barrio de {n} quieren hacer un salón comunal nuevo.", "¿Quién lo construye?", { oficio: "constructor" }),
  H("🎪", "En la feria, {n} se soltó de la mano de su papá y ya no lo ve.", "¿Qué hace?", {
    bien: A("🙋", "Quedarse quiet{o} y pedirle ayuda a alguien que trabaja en la feria", "así su papá {lo} encuentra rápido"),
    malas: [A("🏃", "Irse corriendo para la casa", "se puede perder más y su papá no sabría dónde está"),
      A("🚶", "Irse con alguien que no conoce", "nunca nos vamos con alguien que no conocemos")] }),
  H("🚦", "{n} y su abuelo van para la pulpería. Tienen que cruzar la calle y el muñequito está en rojo.", "¿Qué hacen?", {
    bien: A("✋", "Esperar en la acera hasta que se ponga en verde", "el muñequito rojo dice: ¡alto, esperá!"),
    malas: [A("🏃", "Cruzar corriendo para llegar rápido", "los carros están pasando y los pueden atropellar"),
      A("🚗", "Cruzar entre los carros", "los choferes no los ven")] }, [], { luz: "roja" }),
  H("🍌", "Después de comer en el parque, a {n} le quedaron una cáscara de banano y una botella.", "¿Qué hace?", {
    bien: A("🚮", "Botar la cáscara en el basurero y separar la botella para reciclar", "así el parque queda limpio"),
    malas: [A("🌳", "Dejarlas debajo de la banca", "ensucian el parque y atraen moscas"),
      A("🏞️", "Tirarlas a la quebrada", "la basura de la quebrada llega al río y al mar")] }),
  H("💧", "{n} ve que en la calle se reventó un tubo y sale muchísima agua.", "¿Qué hace?", {
    bien: A("🙋", "Avisarle a un adulto para que llame a los del agua", "así lo arreglan rápido y no se desperdicia el agua"),
    malas: [A("💦", "Ponerse a jugar en el agua", "se desperdicia el agua y puede ser peligroso"),
      A("🙈", "No decirle nada a nadie", "se pierde muchísima agua")] }),
];

// ---------- ¿Qué está mal en este dibujo? ----------
// Viñetas del barrio: una está mal y las otras están bien.  luz: semáforo del muñequito en la viñeta
const V = (id, e, t, bien, porque = "", luz = "") => ({ id, e, t, bien, porque, luz });
export const VINETAS = [
  V("rojo", "🚶", "Un niño cruza la calle con el muñequito en rojo.", false, "con el muñequito en rojo hay que esperar en la acera", "roja"),
  V("rio", "🥤🏞️", "Una niña tira una botella al río.", false, "la basura del río llega al mar y lastima a los animales"),
  V("llave", "🚰💦", "La llave del agua quedó abierta y nadie la está usando.", false, "se desperdicia el agua: hay que cerrarla"),
  V("fosforos", "🧒🔥", "Un niño juega con fósforos.", false, "se puede quemar o empezar un incendio"),
  V("enchufe", "👶🔌", "Un bebé mete los dedos en el enchufe.", false, "le puede pegar la corriente"),
  V("rayar", "🖍️🏫", "Un niño raya la pared de la escuela.", false, "la escuela es de todos y hay que cuidarla"),
  V("flores", "✊🌷", "Una niña arranca las flores del parque.", false, "las flores son de todos; si las arrancamos se mueren"),
  V("espera", "👫", "Dos niños esperan en la acera, con el muñequito en rojo.", true, "", "roja"),
  V("verde", "👩‍👧", "Una mamá y su hija cruzan con el muñequito en verde.", true, "", "verde"),
  V("basurero", "🚮", "Alguien bota la basura en el basurero.", true),
  V("reciclar", "♻️🍾", "Una familia separa las botellas para reciclar.", true),
  V("casco", "🚴", "Una muchacha anda en bici con casco.", true),
  V("regar", "👧🌱", "Una niña riega las plantas del jardín.", true),
  V("leer", "👦📚", "Un niño lee en la biblioteca.", true),
  V("perro", "👨🐕", "Un señor pasea a su perro con correa.", true),
  V("bolsas", "👦👵", "Un niño le ayuda a su abuela con las bolsas.", true),
  V("jugar", "⚽🌳", "Unos niños juegan bola en el parque.", true),
];

// ---------- Escalones ----------
// 🪜 De lo más concreto (¿quién es?, con 2 opciones) a las historias y «¿qué está mal?»
export const ESCALONES = [
  { nombre: "¿Quién es? (2)", tipos: ["nombre"], basico: true, ops: 2 },              //  1
  { nombre: "¿Quién nos ayuda? (2)", tipos: ["ayuda"], basico: true, ops: 2 },         //  2
  { nombre: "¿Quién usa esto? (2)", tipos: ["cosa"], basico: true, ops: 2 },           //  3
  { nombre: "Lugares del barrio (2)", tipos: ["lugar"], basico: true, ops: 2 },        //  4
  { nombre: "¿Adónde vamos? (2)", tipos: ["adonde"], basico: true, ops: 2 },           //  5
  { nombre: "Cuidarnos en la calle (2)", tipos: ["seguridad"], basico: true, ops: 2 }, //  6
  { nombre: "¿Quién nos ayuda? (3)", tipos: ["ayuda", "cosa"], ops: 3 },               //  7
  { nombre: "¿Dónde trabaja?", tipos: ["trabaja"], ops: 3 },                           //  8
  { nombre: "¿Adónde vamos? (3)", tipos: ["adonde", "lugar"], ops: 3 },                //  9
  { nombre: "Servicios y cuidar el barrio", tipos: ["servicio", "cuidar"], ops: 3 },   // 10
  { nombre: "Cuidarnos (3)", tipos: ["seguridad"], ops: 3 },                           // 11
  { nombre: "Con 4 opciones", tipos: ["ayuda", "cosa", "adonde", "lugar"], ops: 4 },   // 12
  { nombre: "Historias del barrio", tipos: ["historia"], ops: 3 },                     // 13
  { nombre: "¿Qué está mal?", tipos: ["mal"], ops: 4 },                                // 14
];
// Para el papá o la maestra: grupos de escalones
export const MODOS = {
  oficios: [0, 1, 2, 6, 7],
  lugares: [3, 4, 8],
  seguridad: [5, 10],
  cuidar: [9],
  historias: [12, 13],
};
export const inicio = edad => edad === null || edad <= 4 ? 0 : edad === 5 ? 1 : edad === 6 ? 3 : edad === 7 ? 6 : edad === 8 ? 8 : 10;

// ---------- Ayudas de texto ----------
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const may = t => t.charAt(0).toUpperCase() + t.slice(1);
/** Le pone punto al final, si no termina ya en signo («¡alto, esperá!» queda igual). */
const punto = t => /[.!?…]$/.test(t) ? t : `${t}.`;
/** Junta una preposición con lo que sigue: a + el = al, de + el = del. */
export const con = (prep, frase) => (prep === "a" || prep === "de") && frase.startsWith("el ") ? `${prep}l ${frase.slice(3)}` : `${prep} ${frase}`;

export const PERSONAS = [["Sofía", 1], ["Mateo", 0], ["Valeria", 1], ["Diego", 0], ["Camila", 1], ["Sebastián", 0],
  ["Daniela", 1], ["Andrés", 0], ["Ana", 1], ["Luis", 0]].map(([n, f]) => ({ n, f: !!f }));
/** Llena una frase con la persona: {n} nombre, {o} o/a, {lo} lo/la. */
export const llenar = (t, p) => t.split("{n}").join(p.n).split("{o}").join(p.f ? "a" : "o").split("{lo}").join(p.f ? "la" : "lo");

// ---------- Opciones ----------
/** Un oficio como opción: mujer (f = true) u hombre. voz: «la bombera», «el bombero». */
export function persona(id, f) {
  const o = OFICIOS[id], [e, nom] = f ? o.f : o.m;
  return { id, tipo: "persona", e, marca: o.marca || "", nom, voz: `${f ? "la" : "el"} ${nom}`, f };
}
const sinArticulo = n => n.startsWith("el ") || n.startsWith("la ") ? n.slice(3) : n;
/** Un lugar como opción. voz: cómo se dice («el ebáis»); texto: cómo se escribe («el EBAIS»). */
export function lugar(id) {
  const l = LUGARES[id];
  return { id, tipo: "lugar", e: l.e, nom: sinArticulo(l.n), texto: l.n, voz: l.voz || l.n, f: l.n.startsWith("la ") };
}
const servicio = id => ({ id, tipo: "servicio", e: SERVICIOS[id].e, nom: sinArticulo(SERVICIOS[id].n), voz: SERVICIOS[id].n });
const accion = (a, id, p) => {
  const t = p ? llenar(a.t, p) : a.t;
  return { id, tipo: a.numero ? "numero" : "accion", e: a.e, nom: t, voz: a.voz || t, bien: id === "b", porque: p ? llenar(a.porque, p) : a.porque };
};

/** Escoge n - 1 oficios distintos para acompañar a `meta`: sin los de `tambien` y sin dos del mismo grupo. */
function otrosOficios(meta, n, pool, tambien, rnd) {
  const grupos = new Set([OFICIOS[meta].grupo].filter(Boolean));
  const elegidos = [];
  for (const id of barajar(pool, rnd)) {
    if (elegidos.length >= n - 1) break;
    const g = OFICIOS[id].grupo;
    if (id === meta || tambien.includes(id) || (g && grupos.has(g))) continue;
    if (g) grupos.add(g);
    elegidos.push(id);
  }
  return elegidos;
}
const genero = rnd => rnd() < 0.5;
function opcionesOficio(meta, fMeta, n, pool, tambien, rnd) {
  return barajar([persona(meta, fMeta), ...otrosOficios(meta, n, pool, tambien, rnd).map(id => persona(id, genero(rnd)))], rnd);
}
function opcionesLugar(meta, n, pool, tambien, rnd) {
  const otros = barajar(pool.filter(id => id !== meta && !tambien.includes(id)), rnd).slice(0, n - 1);
  return barajar([meta, ...otros], rnd).map(lugar);
}
function opcionesAccion(item, n, rnd, p) {
  return barajar([accion(item.bien, "b", p), ...barajar(item.malas, rnd).slice(0, n - 1).map((a, k) => accion(a, `m${k}`, p))], rnd);
}

// ---------- Rondas ----------
const BIG = e => `<span class="big" aria-hidden="true">${e}</span>`;

/**
 * Una ronda nueva del escalón `i`. `evitar`: la clave de la ronda anterior (para no repetir).
 * Devuelve { tipo, escalon, meta, opciones, escena, instr, voz, explica, leer, ocultar, clave }.
 *   escena: { e, luz, html } o null · leer: se leen las opciones en voz alta · ocultar: los nombres se ven al final
 */
export function ronda(i, rnd = Math.random, evitar = "") {
  const es = ESCALONES[i];
  const n = es.ops;
  const tipo = azar(es.tipos, rnd);
  const base = { tipo, escalon: i, leer: true, ocultar: false, escena: null };
  const sinRepetir = (lista, clave) => { const l = lista.filter(x => clave(x) !== evitar); return l.length ? l : lista; };
  const oficios = es.basico ? BASICOS : Object.keys(OFICIOS);

  if (tipo === "nombre") {
    const meta = azar(sinRepetir(oficios, x => x), rnd), f = genero(rnd);
    const ops = opcionesOficio(meta, f, n, oficios, [], rnd);
    const p = persona(meta, f);
    return { ...base, meta, opciones: ops, clave: meta, leer: false, ocultar: true,
      instr: `${BIG("🔍")} Tocá <b>${con("a", p.voz)}</b>`,
      voz: `Tocá ${con("a", p.voz)}.`,
      explica: `¡Sí! ${may(p.voz)} ${OFICIOS[meta].hace}.` };
  }
  if (tipo === "ayuda") {
    const lista = AYUDA.filter(s => oficios.includes(s.quien));
    const s = azar(sinRepetir(lista, x => x.t), rnd), f = genero(rnd);
    const ops = opcionesOficio(s.quien, f, n, oficios, s.tambien, rnd);
    const p = persona(s.quien, f);
    return { ...base, meta: s.quien, opciones: ops, clave: s.t, item: s,
      escena: { e: s.e, html: s.t }, instr: `${BIG("🙋")} ¿Quién nos ayuda?`,
      voz: `${s.t} ¿Quién nos ayuda?`,
      explica: `${may(p.voz)}: ${OFICIOS[s.quien].hace}.` };
  }
  if (tipo === "cosa") {
    const lista = COSAS.filter(c => oficios.includes(c.quien));
    const c = azar(sinRepetir(lista, x => x.n), rnd), f = genero(rnd);
    const ops = opcionesOficio(c.quien, f, n, oficios, c.tambien, rnd);
    const p = persona(c.quien, f);
    const pregunta = `¿Quién ${c.verbo} ${c.n} ${c.para}?`;
    return { ...base, meta: c.quien, opciones: ops, clave: c.n, item: c,
      escena: { e: c.e, html: `${may(c.n)}` }, instr: `${BIG("🤔")} ${pregunta}`,
      voz: pregunta, explica: `${may(p.voz)} ${c.verbo} ${c.n} ${c.para}.` };
  }
  if (tipo === "lugar") {
    const pool = es.basico ? LUGARES_BASICOS : Object.keys(LUGARES);
    const meta = azar(sinRepetir(pool, x => x), rnd);
    const l = lugar(meta);
    return { ...base, meta, opciones: opcionesLugar(meta, n, pool, [], rnd), clave: meta, leer: false, ocultar: true,
      instr: `${BIG("🔍")} Tocá <b>${l.texto}</b>`, voz: `Tocá ${l.voz}.`,
      explica: `¡Sí! ${may(l.voz)}: ${LUGARES[meta].que}.` };
  }
  if (tipo === "adonde") {
    const pool = es.basico ? LUGARES_BASICOS : Object.keys(LUGARES);
    const lista = ADONDE.filter(x => pool.includes(x.lugar));
    const a = azar(sinRepetir(lista, x => x.para), rnd);
    const l = lugar(a.lugar);
    return { ...base, meta: a.lugar, opciones: opcionesLugar(a.lugar, n, pool, a.tambien, rnd), clave: a.para, item: a,
      instr: `${BIG("🗺️")} ¿Adónde vamos para <b>${a.para}</b>?`, voz: `¿Adónde vamos para ${a.para}?`,
      explica: `${may(con("a", l.voz))}: ${LUGARES[a.lugar].que}.` };
  }
  if (tipo === "trabaja") {
    const quienes = Object.keys(TRABAJA);
    const quien = azar(sinRepetir(quienes, x => x), rnd), f = genero(rnd);
    const p = persona(quien, f), l = lugar(TRABAJA[quien]);
    const explica = `${may(p.voz)} trabaja en ${l.voz}: ${OFICIOS[quien].hace}.`;
    if (rnd() < 0.5) {
      // ¿Dónde trabaja la bombera?
      const otros = barajar(quienes.filter(x => x !== quien), rnd).slice(0, n - 1).map(x => TRABAJA[x]);
      return { ...base, tipo: "trabaja", meta: l.id, opciones: barajar([l.id, ...otros], rnd).map(lugar), clave: quien,
        escena: { e: p.e, marca: p.marca, html: may(p.voz) }, instr: `${BIG("🏢")} ¿Dónde trabaja <b>${p.voz}</b>?`,
        voz: `¿Dónde trabaja ${p.voz}?`, explica };
    }
    // ¿Quién trabaja en la escuela?
    const ops = barajar([p, ...barajar(quienes.filter(x => x !== quien), rnd).slice(0, n - 1).map(x => persona(x, genero(rnd)))], rnd);
    return { ...base, tipo: "trabajaEn", meta: quien, opciones: ops, clave: quien,
      escena: { e: l.e, html: may(l.texto) }, instr: `${BIG("🏢")} ¿Quién trabaja en <b>${l.texto}</b>?`,
      voz: `¿Quién trabaja en ${l.voz}?`, explica };
  }
  if (tipo === "servicio") {
    const u = azar(sinRepetir(USOS, x => x.para), rnd);
    const otros = barajar(Object.keys(SERVICIOS).filter(x => x !== u.s), rnd).slice(0, n - 1);
    const s = SERVICIOS[u.s];
    return { ...base, meta: u.s, opciones: barajar([u.s, ...otros], rnd).map(servicio), clave: u.para, item: u,
      instr: `${BIG("🏠")} ¿Qué usamos para <b>${u.para}</b>?`, voz: `¿Qué usamos para ${u.para}?`,
      explica: `¡${may(s.n)}! ${s.cuida}` };
  }
  if (tipo === "cuidar" || tipo === "seguridad") {
    const lista = (tipo === "cuidar" ? CUIDAR : SEGURIDAD).filter(x => !es.basico || x.basico);
    const item = azar(sinRepetir(lista, x => x.t), rnd);
    const ops = opcionesAccion(item, n, rnd);
    return { ...base, tipo, meta: "b", opciones: ops, clave: item.t, item,
      escena: { e: item.e, luz: item.luz || "", html: item.t },
      instr: `${BIG(tipo === "cuidar" ? "♻️" : "🦺")} ${item.pregunta}`, voz: `${item.t} ${item.pregunta}`,
      explica: `¡Eso es! ${punto(may(item.bien.porque))}` };
  }
  if (tipo === "historia") {
    const h = azar(sinRepetir(HISTORIAS, x => x.t), rnd);
    const p = azar(PERSONAS, rnd);
    const texto = llenar(h.t, p), pregunta = llenar(h.pregunta, p);
    const r = { ...base, clave: h.t, item: h, persona: p,
      escena: { e: h.e, luz: h.luz || "", html: texto },
      instr: `${BIG("📖")} ${pregunta}`, voz: `${texto} ${pregunta}` };
    if (h.resp.oficio) {
      const q = h.resp.oficio, f = genero(rnd), pq = persona(q, f);
      return { ...r, resp: "oficio", meta: q, opciones: opcionesOficio(q, f, n, Object.keys(OFICIOS), h.tambien, rnd),
        explica: `${may(pq.voz)}: ${OFICIOS[q].hace}.` };
    }
    if (h.resp.lugar) {
      const l = lugar(h.resp.lugar);
      return { ...r, resp: "lugar", meta: l.id, opciones: opcionesLugar(l.id, n, Object.keys(LUGARES), h.tambien, rnd),
        explica: `${may(con("a", l.voz))}: ${LUGARES[l.id].que}.` };
    }
    return { ...r, resp: "accion", meta: "b", opciones: opcionesAccion(h.resp, n, rnd, p),
      explica: `¡Eso es! ${punto(may(llenar(h.resp.bien.porque, p)))}` };
  }
  // mal: una viñeta que está mal y las demás bien (con un solo semáforo en el dibujo)
  const malas = VINETAS.filter(v => !v.bien), buenas = VINETAS.filter(v => v.bien);
  const mala = azar(sinRepetir(malas, x => x.id), rnd);
  const elegidas = [];
  for (const v of barajar(buenas, rnd)) {
    if (elegidas.length >= n - 1) break;
    if (v.luz && (mala.luz || elegidas.some(x => x.luz))) continue;
    elegidas.push(v);
  }
  const ops = barajar([mala, ...elegidas], rnd).map(v => ({ id: v.id, tipo: "vineta", e: v.e, luz: v.luz, nom: v.t, voz: v.t, bien: v.bien, porque: v.porque }));
  return { ...base, meta: mala.id, opciones: ops, clave: mala.id, leer: false,
    instr: `${BIG("🔍")} ¿Qué está mal en el dibujo?`, voz: "Mirá bien el dibujo del barrio. Algo está mal. ¿Qué es? Tocalo.",
    explica: `¡Eso está mal! ${mala.t} ${punto(may(mala.porque))}` };
}

/** Qué decir cuando toca una opción equivocada. */
export function porQueNo(r, id) {
  const o = r.opciones.find(x => x.id === id);
  if (!o) return "";
  const esa = o.f ? "Esa es" : "Ese es";
  if (r.tipo === "nombre") return `${esa} ${o.voz}. Buscá ${con("a", r.opciones.find(x => x.id === r.meta).voz)}.`;
  if (o.tipo === "persona") return `${may(o.voz)} ${OFICIOS[id].hace}. Pensá otra vez.`;
  if (r.tipo === "lugar") return `${esa} ${o.voz}. Buscá ${r.opciones.find(x => x.id === r.meta).voz}.`;
  if (o.tipo === "lugar") return `${may(o.voz)}: ${LUGARES[id].que}. Pensá otra vez.`;
  if (o.tipo === "servicio") return `${may(o.voz)} no sirve para eso. Pensá otra vez.`;
  if (o.tipo === "vineta") return `Eso está bien: ${o.voz} Buscá lo que está mal.`;
  return `Eso no: ${punto(o.porque)}`;
}

// ---------- 🚦 El semáforo del muñequito (SVG propio) ----------
const APAGADO = "#4A5A66";
/** Semáforo de peatones: arriba el muñequito rojo (quieto), abajo el verde (caminando). */
export function semaforo(luz) {
  const rojo = luz === "roja" ? "#FF3B30" : APAGADO, verde = luz === "verde" ? "#34E07A" : APAGADO;
  return `<svg viewBox="0 0 60 110" aria-hidden="true" focusable="false">`
    + `<rect x="4" y="4" width="52" height="102" rx="12" fill="#263238" stroke="#1F3A5F" stroke-width="3"/>`
    + `<circle cx="30" cy="30" r="21" fill="#10171C"/><circle cx="30" cy="80" r="21" fill="#10171C"/>`
    // quieto
    + `<g fill="${rojo}"><circle cx="30" cy="17" r="4.2"/><rect x="24.5" y="22" width="11" height="13" rx="3"/>`
    + `<rect x="25" y="33" width="4" height="12" rx="1.8"/><rect x="31" y="33" width="4" height="12" rx="1.8"/></g>`
    // caminando
    + `<g stroke="${verde}" stroke-width="4" stroke-linecap="round" fill="none"><path d="M31 72 L28 84"/><path d="M28 84 L22 94"/>`
    + `<path d="M28 84 L35 94"/><path d="M30 74 L23 80"/><path d="M30 74 L37 79"/></g><circle cx="32" cy="66" r="4.2" fill="${verde}"/>`
    + `</svg>`;
}

// ---------- 📝 Para «Preparate para el examen» (1° y 2°) ----------
/** Una pregunta para el examen. Usa solo `r` como azar. */
export function preguntaExamen(r, g = 1) {
  const sacar = (lista, correcta, k) => barajar(lista.filter(x => x !== correcta), r).slice(0, k);
  const tipo = azar(["ayuda", "adonde", "seguridad", "trabaja"], r);
  const etiqueta = id => { const p = persona(id, genero(r)); return may(p.voz); };
  if (tipo === "ayuda") {
    const s = azar(AYUDA, r);
    const otros = otrosOficios(s.quien, 3, Object.keys(OFICIOS), s.tambien, r);
    const correcta = etiqueta(s.quien);
    return { texto: `${s.e} ${s.t} ¿Quién nos ayuda?`, tipo: "opcion", opciones: barajar([correcta, ...otros.map(etiqueta)], r),
      correcta, explica: `${correcta}: ${OFICIOS[s.quien].hace}.` };
  }
  if (tipo === "adonde") {
    const a = azar(ADONDE, r);
    const otros = sacar(Object.keys(LUGARES).filter(x => !a.tambien.includes(x)), a.lugar, 2);
    const correcta = may(LUGARES[a.lugar].n);
    return { texto: `🗺️ ¿Adónde vamos para ${a.para}?`, tipo: "opcion", opciones: barajar([correcta, ...otros.map(x => may(LUGARES[x].n))], r),
      correcta, explica: `${may(con("a", LUGARES[a.lugar].n))}: ${LUGARES[a.lugar].que}.` };
  }
  if (tipo === "trabaja") {
    const quien = azar(Object.keys(TRABAJA), r);
    const otros = sacar(Object.values(TRABAJA), TRABAJA[quien], 2);
    const p = persona(quien, genero(r)), correcta = may(LUGARES[TRABAJA[quien]].n);
    return { texto: `${p.e} ¿Dónde trabaja ${p.voz}?`, tipo: "opcion", opciones: barajar([correcta, ...otros.map(x => may(LUGARES[x].n))], r),
      correcta, explica: `${may(p.voz)} trabaja en ${LUGARES[TRABAJA[quien]].n}.` };
  }
  const item = azar(SEGURIDAD.concat(g >= 2 ? CUIDAR : []), r);
  const correcta = item.bien.t;
  return { texto: `${item.e} ${item.t} ${item.pregunta}`, tipo: "opcion", opciones: barajar([correcta, ...barajar(item.malas, r).slice(0, 2).map(a => a.t)], r),
    correcta, explica: punto(may(item.bien.porque)) };
}

// ---------- Revisión (para las pruebas) ----------
// Copia letra por letra saltando lo que va entre < y >, para revisar el texto sin etiquetas
export function sinEtiquetas(t) {
  let s = "", dentro = false;
  for (const c of String(t)) {
    if (c === "<") dentro = true;
    else if (c === ">") dentro = false;
    else if (!dentro) s += c;
  }
  return s;
}
const MAL_DICHO = /(^|[\s,.;:¿¡«])(de|a) el\s/iu;

/** Revisa una ronda. Devuelve una lista de problemas (vacía = bien). */
export function revisarRonda(r) {
  const mal = [];
  const es = ESCALONES[r.escalon];
  const ids = r.opciones.map(o => o.id);
  if (ids.length !== es.ops) mal.push(`${r.tipo}: hay ${ids.length} opciones (esperaba ${es.ops})`);
  if (new Set(ids).size !== ids.length) mal.push(`${r.tipo}: opciones repetidas`);
  if (!ids.includes(r.meta)) mal.push(`${r.tipo}: la respuesta no está entre las opciones`);
  const dibujos = r.opciones.filter(o => o.e).map(o => o.e + (o.marca || ""));
  if (new Set(dibujos).size !== dibujos.length) mal.push(`${r.tipo}: dibujos repetidos ${dibujos.join(" ")}`);
  const textos = [r.voz, r.explica, r.instr, r.escena?.html || "", ...r.opciones.map(o => `${o.nom} ${o.voz} ${o.porque || ""}`)].join(" | ");
  if (/\{|\}|undefined|null|NaN/.test(textos)) mal.push(`${r.tipo}: texto sin llenar: ${textos.slice(0, 140)}`);
  if (/<|>/.test(r.voz + r.explica)) mal.push(`${r.tipo}: la voz tiene etiquetas`);
  const dicho = [r.voz, r.explica, sinEtiquetas(r.instr), porQue(r)].join(" ");
  if (/[!?]\./.test(dicho)) mal.push(`${r.tipo}: «!.» en ${dicho.slice(0, 120)}`);
  if (MAL_DICHO.test(dicho)) mal.push(`${r.tipo}: «de el» o «a el»: ${dicho.slice(0, 160)}`);
  // Una sola respuesta correcta
  const personas = r.opciones.filter(o => o.tipo === "persona");
  const tamb = r.item?.tambien || [];
  for (const o of r.opciones) if (o.id !== r.meta && tamb.includes(o.id)) mal.push(`${r.tipo}: «${o.id}» también podría ser`);
  const grupos = personas.map(o => OFICIOS[o.id].grupo).filter(Boolean);
  if (new Set(grupos).size !== grupos.length) mal.push(`${r.tipo}: dos oficios del mismo grupo`);
  if (r.tipo === "trabaja") for (const o of r.opciones) if (o.id !== r.meta && Object.values(TRABAJA).filter(x => x === o.id).length !== 1) mal.push("trabaja: lugar raro");
  if (r.tipo === "trabajaEn") for (const o of r.opciones) if (o.id !== r.meta && TRABAJA[o.id] === TRABAJA[r.meta]) mal.push("trabajaEn: dos trabajan ahí");
  const acciones = r.opciones.filter(o => o.tipo === "accion" || o.tipo === "numero");
  if (acciones.length && acciones.filter(o => o.bien).length !== 1) mal.push(`${r.tipo}: no hay exactamente una acción buena`);
  if (r.tipo === "mal") {
    if (r.opciones.filter(o => !o.bien).length !== 1) mal.push("mal: no hay exactamente una viñeta mala");
    if (r.opciones.filter(o => o.luz).length > 1) mal.push("mal: dos semáforos en el dibujo");
  }
  if (r.tipo === "nombre" || r.tipo === "lugar") { if (r.leer || !r.ocultar) mal.push(`${r.tipo}: se leerían o verían los nombres`); }
  return mal;
}
function porQue(r) { return r.opciones.map(o => o.id === r.meta ? "" : porQueNo(r, o.id)).join(" "); }

/** Revisa los datos: referencias, distractores suficientes, cosas con al menos 2 malas… */
export function revisarDatos() {
  const mal = [];
  const okO = id => OFICIOS[id], okL = id => LUGARES[id];
  for (const s of AYUDA) { if (!okO(s.quien)) mal.push(`ayuda: ${s.quien}`); for (const t of s.tambien) if (!okO(t) || t === s.quien) mal.push(`ayuda tambien: ${t}`); }
  for (const c of COSAS) { if (!okO(c.quien)) mal.push(`cosa: ${c.quien}`); for (const t of c.tambien) if (!okO(t)) mal.push(`cosa tambien: ${t}`); }
  for (const a of ADONDE) { if (!okL(a.lugar)) mal.push(`adonde: ${a.lugar}`); for (const t of a.tambien) if (!okL(t) || t === a.lugar) mal.push(`adonde tambien: ${t}`); }
  for (const [o, l] of Object.entries(TRABAJA)) if (!okO(o) || !okL(l)) mal.push(`trabaja: ${o} ${l}`);
  if (new Set(Object.values(TRABAJA)).size !== Object.keys(TRABAJA).length) mal.push("trabaja: dos en el mismo lugar");
  for (const u of USOS) if (!SERVICIOS[u.s]) mal.push(`uso: ${u.s}`);
  for (const x of [...CUIDAR, ...SEGURIDAD]) if (x.malas.length < 2) mal.push(`pocas malas: ${x.t}`);
  for (const h of HISTORIAS) {
    if (h.resp.oficio && !okO(h.resp.oficio)) mal.push(`historia: ${h.resp.oficio}`);
    if (h.resp.lugar && !okL(h.resp.lugar)) mal.push(`historia: ${h.resp.lugar}`);
    if (!h.resp.oficio && !h.resp.lugar && (!h.resp.bien || h.resp.malas.length < 2)) mal.push(`historia sin acciones: ${h.t}`);
  }
  const ids = VINETAS.map(v => v.id);
  if (new Set(ids).size !== ids.length) mal.push("viñetas con id repetido");
  if (VINETAS.filter(v => v.bien && !v.luz).length < 3) mal.push("pocas viñetas buenas sin semáforo");
  const lugaresE = Object.values(LUGARES).map(l => l.e);
  if (new Set(lugaresE).size !== lugaresE.length) mal.push("lugares con el mismo dibujo");
  for (const id of Object.keys(OFICIOS)) for (const id2 of Object.keys(OFICIOS)) {
    if (id >= id2) continue;
    const a = OFICIOS[id], b = OFICIOS[id2];
    for (const k of ["f", "m"]) if (a[k][0] + (a.marca || "") === b[k][0] + (b.marca || "") && (!a.grupo || a.grupo !== b.grupo)) mal.push(`mismo dibujo: ${id} y ${id2}`);
  }
  return mal;
}

/** Revisión completa: datos, miles de rondas de cada escalón y preguntas de examen. */
export function revisarComunidad(veces = 400) {
  const mal = [...revisarDatos()];
  let semilla = 7;
  const rnd = () => { semilla = (semilla * 1103515245 + 12345) % 2147483648; return semilla / 2147483648; };
  for (let i = 0; i < ESCALONES.length; i++) {
    let clave = "";
    for (let k = 0; k < veces; k++) {
      let r;
      try { r = ronda(i, rnd, clave); } catch (e) { mal.push(`escalón ${i + 1}: ${e.message}`); break; }
      clave = r.clave;
      for (const m of revisarRonda(r)) mal.push(`escalón ${i + 1}: ${m}`);
    }
  }
  for (let k = 0; k < veces * 4; k++) {
    const g = 1 + (k % 2), q = preguntaExamen(rnd, g);
    if (!q.opciones.includes(q.correcta)) mal.push(`examen: la correcta no está: ${q.texto}`);
    if (new Set(q.opciones).size !== q.opciones.length) mal.push(`examen: opciones repetidas: ${q.texto}`);
    if (q.opciones.length < 3) mal.push(`examen: pocas opciones: ${q.texto}`);
    if (/\{|\}|undefined|NaN/.test(q.texto + q.explica + q.opciones.join())) mal.push(`examen: texto sin llenar: ${q.texto}`);
    if (/[!?]\./.test(q.explica)) mal.push(`examen: «!.»: ${q.explica}`);
    if (MAL_DICHO.test(q.texto + " " + q.explica)) mal.push(`examen: «a el»: ${q.texto} ${q.explica}`);
  }
  return [...new Set(mal)];
}
