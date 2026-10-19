# TODO · Aprendo a lo Tico

Hoja de ruta. Marcá con `[x]` lo que se vaya haciendo.

## ✅ Fase 0 · Arranque (hecho)

- [x] Sitio estático listo para App Platform
- [x] Inicio con filtros por materia y grado
- [x] Juego: Aprendo la hora (a lo tico, modo adivinar)
- [x] Juego: Restas con bloques (préstamo visual)
- [x] Juego: La pulpería (billetera, pagar, vuelto)
- [x] Página de apoyo con SINPE Móvil
- [x] PWA: instalable y offline

## ✅ Fase 0.5 · Una materia de cada una (hecho)

- [x] Juego: Sumas con bloques (llevando con el imán 🧲)
- [x] Juego: Animales de Costa Rica (dónde vive, qué come)
- [x] Juego: Mapa de provincias (explorar, dónde queda, cabeceras)
- [x] Juego: Listen and tap (colores, animales, números, familia, frutas; con voz)

## ✅ Fase 0.7 · Para los que no leen (hecho)

- [x] `js/voz.js` + `js/prepa.js` + `css/prepa.css`: voz, sonidos, inicio con ▶️ y piezas comunes
- [x] Juego: ¡A contar! (tocar para contar en voz alta, "contemos juntos" si se equivoca)
- [x] Juego: Colores y figuras (colores, figuras y los dos juntos)
- [x] Juego: ¿Con qué empieza? (sonido inicial: vocales y consonantes)
- [x] Juego: Trazá letras y números (vocales, números y m p s l t n d)

## 🚀 Fase 1 · Publicar bien

- [x] Poner el número real de SINPE en `js/config.js`
- [ ] Definir si las donaciones entran a cuenta personal, de SNN Soluciones o una cuenta aparte (consultarlo con un contador por el tema de Hacienda)
- [ ] Comprar dominio (`aprendoalotico.com` / `.cr`) y conectarlo en App Platform
- [ ] Logo e identidad visual (ícono definitivo, ilustraciones)
- [ ] Fuente Baloo 2 local en `public/fonts/` (offline total y APK)
- [ ] Página "Acerca de" + política de privacidad corta (no recolectamos datos; mencionar FormSubmit en sugerencias)
- [x] Página de ideas y sugerencias con fotos (`sugerencias.html`, vía FormSubmit)
- [ ] Confirmar el correo de activación de FormSubmit y cambiar el correo por el código aleatorio en `js/config.js`
- [ ] Definir licencia: código (MIT) y contenido (CC BY-NC-SA)
- [ ] Imagen para compartir en WhatsApp/Facebook (`og:image`)
- [ ] Analítica sin cookies ni datos personales (o ninguna)

## 🧒 Fase 2 · Para los más chiquitos (Prepa, 4–5 años)

- [x] **Voz en todo:** instrucciones leídas con Web Speech API (`speechSynthesis`, voz `es-*`) → `js/voz.js`
- [x] Botón 🐢 en todos los juegos con voz: normal a 1, tortuga a 0.5
- [ ] Afinar la 🐢 en Apple con las mediciones de `prueba-voz.html` (hoy 0.25)
- [ ] Voz grabada por una persona tica (archivos de audio) para cuando el teléfono no tenga voz en español
- [x] **Trazos de letras:** canvas + pointer events, letra punteada, validación por tolerancia
- [ ] Trazos: flechas y puntito de inicio con el orden correcto de cada trazo
- [ ] Trazos: el resto del abecedario y mayúsculas de consonantes
- [ ] Trazar su nombre (lo escribe el papá)
- [ ] Palabras comunes: mamá, papá, casa, sol, perro…
- [x] 🔤 Sílabas mágicas: vocales, ma me mi mo mu, armar la sílaba y la palabra, leer palabras y oraciones
- [x] Armar palabras con sílabas (tocando)
- [x] Sonido inicial: ¿cuál empieza como…?
- [x] 🧠 Parejas: memoria con dibujos y voz al voltear
- [x] 🔍 ¿Dónde está? (buscar entre 2 a 16 dibujos) y ¿Cuál es diferente?
- [x] 📏 Grande y pequeño: el más grande, el más pequeño, el mediano y ordenar
- [x] 🧩 ¿Qué sigue? Secuencias y patrones (🔴🔵🔴🔵…), ¿qué falta? y completar dos
- [x] 🐮 ¿Quién hace así? (sonidos de animales con la voz)
- [x] 🧺 ¿Dónde va? Clasificar en canastas tocando (frutas, animales, agua/tierra/aire…)
- [x] Contar objetos del 1 al 20
- [x] Colores y figuras

## 🔢 Matemáticas por grado

- [ ] Sacar los rangos de cada juego a una config por grado (`generate(nivel)`)
- [x] Sumas llevando con bloques (espejo de las restas)
- [x] 💯 Números del 1 al 100: antes y después, mayor y menor, pares, series, decenas y la tabla del 100 · 1°–2°
- [x] 🚌 ¿A qué hora llega el bus? Tiempo transcurrido con rutas ticas, a. m./p. m., horarios y días · 2°–5°
- [x] 📐 Perímetro y área en la finca: cuadritos, pintar corrales, fórmulas, figuras en L, triángulos y problemas · 3°–6°
- [x] 📊 Encuesta en la escuela: pictogramas, barras, moda, promedio y probabilidad · 2°–6°
- [ ] Pulpería: ¿cuánta plata hay? (contar un montón)
- [ ] Pulpería: alcancía (¿qué puedo comprar sin pasarme?)
- [ ] Cambiar billetes (¿cuántas de ₡500 hacen ₡5 000?)
- [x] ✖️ Tablas en la feria: multiplicación como filas de fruta en el tramo, tablas del 1 al 10 con trucos, contra reloj · 2°–4°
- [x] 🥭 Repartiendo mangos: división tocando canastas, el sobrante es el residuo, hasta 3 cifras · 2°–4°
- [x] 🍕 Fracciones con pizza y sandía: pintar, comparar, equivalentes, sumar, mixtos y simplificar · 3°–6°
- [x] 🏷️ Ofertas en la feria: decimales con kilos y litros, porcentajes, descuentos e IVA · 4°–6°

## ✏️ Español

- [ ] Lectura de oraciones cortas con audio
- [x] 🧩 Armo la oración: ordenar palabras (con voz), punto/pregunta/emoción y mayúsculas · 1°–3°
- [ ] Mayúsculas y puntuación
- [x] 🐝 Ortografía: b/v, s/c/z y h con dibujo, voz y la regla (mb, nv, -aba, -bir, z→ces, hue-) · 3°–6°
- [x] 📦 ¿Qué es? Sustantivo, verbo, adjetivo, concordancia, pronombres, adverbios y sujeto y predicado · 2°–6°
- [x] 📖 Cuentos ticos: 27 textos originales con preguntas literales, inferenciales, de vocabulario y propósito · 1°–6°
- [x] ✍️ ¿Dónde suena más fuerte? Sílabas, agudas, graves, esdrújulas, tildes e hiato · 2°–6°
- [x] 📖 Más cuentos: 82 textos (unos 8 por escalón)
- [ ] Cuentos con audio grabado

## 🌱 Ciencias

- [x] Animales de Costa Rica (hábitat, qué comen)
- [ ] Animales: más animales (manatí, danta, pizote, tucán) con ilustraciones propias en vez de emoji
- [x] 🌱 Partes de la planta: explorar, ¿dónde está?, ¿para qué sirve? y ¿qué parte comemos? (la papa es tallo, el café es semilla) · 1°–3°
- [x] 🌳 Ecosistemas de Costa Rica: ¿dónde vive?, ¿cómo es? y ¿dónde queda? · 3°–6°
- [x] 🧊 Sólido, líquido o gaseoso: estados y cambios (derretir, congelar, evaporar, condensar) · 1°–4°
- [x] 🫀 El cuerpo humano: sentidos y sistemas, tocando cada órgano · 1°–6°
- [x] 🔗 ¿Quién se come a quién? Cadenas y redes alimenticias de Costa Rica · 2°–6°
- [x] 🪐 El sistema solar y la Tierra (día y noche, fases de la Luna, época seca y lluviosa, eclipses) · 3°–6°

## 🗺️ Estudios Sociales

- [x] Provincias y cabeceras en mapa interactivo
- [ ] Mapa: cantones por provincia (5°–6°)
- [x] 🌸 Símbolos patrios: conocer los 12, memoria dibujo–nombre (4, 6 y 8 parejas) y adivinanzas · 1°–4°
- [x] 🛡️ El escudo nacional: tocar cada parte (estrellas, volcanes, barcos, sol, café…) y su significado · 2°–5°
- [x] 📅 Efemérides: ¿qué se celebra?, ¿qué día es? y ¿por qué? (15 fechas) · 2°–6°
- [ ] Mi comunidad: servicios, oficios
- [x] 🏛️ La historia de Costa Rica: línea del tiempo, pueblos originarios, personajes y gobierno · 2°–6°
- [x] 🧭 Direcciones a lo tico: rosa de los vientos, «200 metros al este», coordenadas, latitud y longitud · 1°–6°
- [x] 🌋 Volcanes, ríos, parques, golfos, cordilleras y las seis regiones, en el mapa · 3°–6°

## 💬 Inglés

- [x] Vocabulario con imagen y audio (colores, animales, números, familia)
- [x] Listen and tap
- [x] Listen and tap: más temas (ropa, cuerpo, escuela, comida) y números hasta 100
- [x] 🦜 Armo en inglés: escuchar y armar, traducir al inglés y al español, con fichas trampa y repaso de las falladas (tipo Duolingo)
- [x] 🌦️ My day in English: días, meses, clima, ropa, la hora y la rutina · 2°–6°

## 💻 Programación (sin servidor: todo corre en el navegador)

- [x] 🦥 Llevá al perezoso: secuencias con flechas, 10 niveles, sin leer (Prepa a 2°)
- [x] Más ejercicios con progresión suave: perezoso 16 niveles, «Repetí y decidí» 24 en 7 etapas, lapa 24 en 5 etapas
- [x] Niveles 🐞 «Arreglá el programa» (depurar), bloques iniciales y botón 💡 de pistas
- [ ] 🦥 Editor para que los niños armen sus propios niveles y los compartan
- [x] 🔁 Repetí y decidí: avanzar/girar, repetir N, repetir hasta, «si hay río / si está cerrado» y saltar; 10 niveles (2° a 4°)
- [ ] 🔁 Repetí y decidí: arrastrar bloques en computadora y mover bloques ya puestos
- [x] 🦜 La lapa que dibuja: Blockly (dentro del sitio) con avanzar, girar, repetir, color, lápiz y grosor; 10 retos + dibujo libre (4° a 6°)
- [ ] 🦜 Lapa: variables y «para cada» (espirales), y compartir el dibujo por WhatsApp
- [ ] Guardar proyectos en el dispositivo y exportarlos o importarlos como archivo

## 📝 Preparate para el examen

- [x] Armar un examen de práctica: nombre, grado, materia (4 básicas e inglés), 2 a 5 temas, 3/5/10 preguntas por tema
- [x] Nota de 0 a 100, resultado por tema, revisión con explicaciones y «practicar lo que fallé»
- [x] Imprimir el examen con hoja de respuestas
- [ ] Más temas por grado (según el programa del MEP) y preguntas con dibujos (relojes, figuras, mapas)
- [x] Usar los generadores de los juegos nuevos como temas del examen (14 temas nuevos)
- [ ] Temas viejos con pocas preguntas distintas: geometría y plata de 1°–2°, límites, provincias, escudo
- [ ] En el examen, poemas e instrucciones de la comprensión lectora con sus saltos de línea
- [ ] Compartir el examen por WhatsApp (mismo examen con un enlace)

## 🎲 Que no siempre sea lo mismo (generadores, sin servidor)

- [x] Generador de oraciones en español e inglés («Armo la oración» y «Armo en inglés»)
- [x] Generadores de datos, opiniones y mensajes para «¿Dato u opinión?»
- [x] Casos al azar del jaguar detective
- [x] Niveles al azar en «Llevá al perezoso» (mapas con verificador) y «Repetí y decidí» (pasillos, escaleras, cuadrados y ríos de tamaño al azar)
- [x] Retos al azar en «La lapa que dibuja» (polígonos, estrella, rectángulo, escalera y flor de cuadrados)
- [x] Más vocabulario en «Listen and tap» (10 temas)
- [ ] Más animales en «Animales de Costa Rica»
- [x] «Reto del día» en el inicio: el mismo reto para todos ese día (semilla con la fecha), con ✅ al resolverlo

## 🧠 Pensamiento lógico y crítico

- [x] 🐆 El jaguar detective: 18 casos en 4 etapas (pistas, pistas con NO, libreta de doble entrada, casos con «o» y «si… entonces»), con 🐞 pistas trampa
- [x] 🎲 Jaguar detective: casos nuevos al azar (fácil, medio, difícil y libreta), siempre con una sola respuesta
- [ ] 🐆 Libretas de 4 × 4
- [x] 🐸 Sudoku de ranitas de Costa Rica (4×4 y 6×6, 5 dificultades, pistas que explican el razonamiento)
- [ ] 🐸 Sudoku: modo con números o letras para 6°, y sudoku del día
- [x] 📰 ¿Dato u opinión? (4 etapas: clasificar, palabra pista, verdadero/falso y detector de noticias con señales de alerta)
- [x] ❌⭕ Gato contra el jaguar (fácil, medio, difícil que nunca pierde, 2 jugadores, consejos que explican)
- [x] ♟️ Estrategia contra el jaguar: quitar mangos (Nim) y cuatro en línea, con escalera
- [x] 💭 ¿Cómo se siente? (emociones y empatía, con rincón de calma, Prepa a 3°)

## 🪜 De a poquito: por edad y sin frustrarse

- [x] Preguntar la edad y si ya lee; sugerir los juegos de su edad (sin leer, si no lee) con 🔊 en cada tarjeta
- [x] `js/escalera.js`: escalones chiquitos que suben con 4 aciertos y bajan si le cuesta, por perfil y por juego
- [x] Ayudas sin pedirlas: repetir la instrucción si se queda quieto, señalar la respuesta 👆, señalar tras el 2.º error
- [x] Escalera en ¡A contar!, Colores y figuras, ¿Con qué empieza?, Sudoku de ranitas y todos los juegos nuevos de Prepa
- [x] Jaguar detective 🪜 paso a paso: de 2 sospechosos y 1 pista hasta los difíciles, con dibujos en las pistas
- [x] Perezoso: 💡 pone la siguiente flecha después de 2 intentos fallidos
- [x] Escalera en Listen and tap, Trazá letras, Gato (de muy fácil a difícil) y Memory in English
- [x] «📈 Cómo va…» en el inicio: en qué escalón va el niño en cada juego
- [x] `js/quiz.js` con modo 🪜 y respuestas escritas
- [ ] Modo papá: mover a mano el escalón de un juego desde el inicio
- [ ] Voz grabada para las onomatopeyas de «¿Quién hace así?» (la voz del teléfono no siempre las dice bien)

## 👨‍👩‍👧 Perfiles y progreso (local)

- [x] Perfiles por niño (nombre opcional, edad, si lee y animalito) en `localStorage`
- [ ] Estrellas y logros por perfil
- [ ] Modo papá con PIN: ver progreso, cambiar grado, reiniciar
- [ ] Superhéroes ticos **originales** como mascotas/avatares (no personajes con derechos de autor)

## 🏫 Fase 3 · Maestros y papás (con backend)

- [ ] Backend Spring Boot en DO + base de datos
- [ ] Roles: estudiante / papá / maestro
- [ ] Maestro crea grupo con código de clase
- [ ] Niños entran con avatar + clave de dibujitos (sin correo)
- [ ] Maestro asigna tareas y ve avance del grupo
- [ ] Consentimiento de papás; cumplir Ley 8968 (protección de datos) y revisar lineamientos de PRODHAB
- [ ] Contenido como JSON editable + editor para maestros

## 🛠️ Técnico

- [ ] Extraer estilos comunes de los juegos a `css/juego.css`
- [x] Crear `js/voz.js` compartido (lo usan los juegos de Prepa)
- [ ] Pasar animales, provincias y listen-tap a `js/voz.js` (hoy tienen su propia copia)
- [ ] Componentes reutilizables: teclado numérico, retroalimentación, estrellas
- [ ] Tests de los generadores de problemas (que siempre sean válidos)
- [ ] APK con Capacitor + ícono y splash
- [ ] Publicar en Google Play (cuenta de desarrollador, ficha de "apps para niños" / Families Policy)
- [ ] Accesibilidad: contraste, tamaños táctiles, lector de pantalla
- [ ] Evaluar migrar a Angular cuando haya perfiles y backend
