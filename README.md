# Aprendo a lo Tico 🇨🇷

Juegos educativos **gratis** para niños y niñas de Costa Rica, con sabor tico: la hora como la decimos aquí, colones, pulpería y contenido pensado para el programa del MEP.

- Sin anuncios.
- Sin cuentas ni datos personales: el progreso queda en el dispositivo (`localStorage`).
- Funciona sin internet (PWA).
- Donaciones voluntarias por SINPE Móvil.

## Juegos incluidos

| Juego | Materia | Grados | Archivo |
|---|---|---|---|
| 🕒 Aprendo la hora | Matemáticas | 1° a 3° | `public/juegos/reloj.html` |
| 🧱 Restas con bloques | Matemáticas | 2° a 4° | `public/juegos/restas-bloques.html` |
| 🪙 La pulpería | Matemáticas | 1° a 4° | `public/juegos/pulperia.html` |
| ➕ Sumas con bloques | Matemáticas | 1° a 4° | `public/juegos/sumas-bloques.html` |
| 🦥 Animales de Costa Rica | Ciencias | 1° a 4° | `public/juegos/animales-cr.html` |
| 🗺️ Mapa de provincias | Estudios Sociales | 2° a 4° | `public/juegos/provincias.html` |
| 👂 Listen and tap | Inglés | 1° a 4° | `public/juegos/listen-tap.html` |
| 🐥 ¡A contar! | Matemáticas | Prepa y 1° | `public/juegos/contar.html` |
| 🔺 Colores y figuras | Matemáticas | Prepa | `public/juegos/colores-figuras.html` |
| 👂 ¿Con qué empieza? | Español | Prepa y 1° | `public/juegos/sonido-inicial.html` |
| ✍️ Trazá letras y números | Español | Prepa y 1° | `public/juegos/trazos.html` |
| 🦥 Llevá al perezoso | Programación | Prepa a 2° | `public/juegos/perezoso.html` |
| 🔁 Repetí y decidí | Programación | 2° a 4° | `public/juegos/repeti-decidi.html` |
| 🦜 La lapa que dibuja | Programación | 4° a 6° | `public/juegos/lapa.html` |
| 🐆 El jaguar detective | Pensamiento lógico | 1° a 6° | `public/juegos/jaguar.html` |
| 🐸 Sudoku de ranitas | Pensamiento lógico | 1° a 6° | `public/juegos/sudoku-ranas.html` |
| ❌ Gato contra el jaguar | Pensamiento lógico | Prepa a 6° | `public/juegos/gato.html` |
| 📰 ¿Dato u opinión? | Pensamiento lógico | 3° a 6° | `public/juegos/dato-opinion.html` |
| 🦜 Armo en inglés | Inglés | 2° a 6° | `public/juegos/armo-ingles.html` |
| 🛡️ El escudo nacional | Estudios Sociales | 2° a 5° | `public/juegos/escudo.html` |
| ✖️ Tablas en la feria | Matemáticas | 2° a 4° | `public/juegos/tablas.html` |
| 🧩 Armo la oración | Español | 1° a 3° | `public/juegos/oraciones.html` |
| 🌱 Partes de la planta | Ciencias | 1° a 3° | `public/juegos/planta.html` |
| 🌸 Símbolos patrios | Estudios Sociales | 1° a 4° | `public/juegos/simbolos.html` |
| 🧊 Sólido, líquido o gaseoso | Ciencias | 1° a 4° | `public/juegos/estados.html` |
| 🌳 Ecosistemas de Costa Rica | Ciencias | 3° a 6° | `public/juegos/ecosistemas.html` |
| 🐝 Ortografía | Español | 3° a 6° | `public/juegos/ortografia.html` |
| 📅 Efemérides | Estudios Sociales | 2° a 6° | `public/juegos/efemerides.html` |
| 🧠 Memory in English | Inglés | 1° a 4° | `public/juegos/memory-ingles.html` |

## Estructura

```
aprendo-a-lo-tico/
├── .do/app.yaml            # Spec de DigitalOcean App Platform
├── public/                 # Todo lo que se publica (sitio estático, sin build)
│   ├── index.html          # Inicio: menú de categorías (☰) y filtro por grado
│   ├── apoyar.html         # Página de donación por SINPE Móvil
│   ├── 404.html
│   ├── manifest.webmanifest
│   ├── sw.js               # Service worker (modo sin internet)
│   ├── css/base.css        # Estilos del inicio y páginas generales
│   ├── css/prepa.css       # Estilos compartidos de los juegos de Prepa
│   ├── js/config.js        # ⚙️ Número SINPE y datos generales
│   ├── js/catalog.js       # 📚 Materias, grados y lista de juegos
│   ├── js/home.js          # Lógica del inicio
│   ├── js/voz.js           # 🔊 Voz (speechSynthesis) y sonidos compartidos
│   ├── js/prepa.js         # Piezas comunes de los juegos de Prepa
│   ├── js/perezoso.js      # 🦥 Niveles y lógica de "Llevá al perezoso"
│   ├── js/decidi.js        # 🔁 Niveles e intérprete de bloques de "Repetí y decidí"
│   ├── js/lapa.js          # 🦜 Retos, dibujo y comparación de "La lapa que dibuja"
│   ├── js/detective.js     # 🐆 Animales, casos y verificador de "El jaguar detective"
│   ├── js/sudoku.js        # 🐸 Generador de sudokus (una sola solución, sin adivinar) y pistas
│   ├── js/ranas-svg.js     # 🐸 Dibujos SVG de las ranitas de Costa Rica
│   ├── js/gato.js          # ❌⭕ Gato: jugadas del jaguar (fácil, medio, perfecto) y consejos
│   ├── js/tablas.js        # ✖️ Tablas: preguntas, trucos de cada tabla y estrellas
│   ├── js/oraciones.js     # 🧩 Oraciones para ordenar, signos y mayúsculas
│   ├── js/generador-frases.js # 🎲 Arma oraciones nuevas en español e inglés (concordancia y sentido)
│   ├── js/planta.js        # 🌱 Partes de la planta, para qué sirven y qué parte comemos
│   ├── js/simbolos.js      # 🌸 Símbolos patrios: datos, memoria y adivinanzas
│   ├── js/simbolos-svg.js  # 🌸 Dibujos SVG de los símbolos patrios
│   ├── img/                # Escudo nacional (sin fondo) y fotos de símbolos patrios (yigüirro, guanacaste, venado, manatí, esferas)
│   ├── js/escudo.js       # 🛡️ Partes del escudo, su significado y zonas para tocar
│   ├── js/frases-en.js    # 🦜 Frases en inglés y español, fichas con trampas y revisión
│   ├── js/memory-en.js    # 🧠 Palabras en inglés por tema y lógica de la memoria
│   ├── js/efemerides.js   # 📅 Fechas patrias y celebraciones de Costa Rica
│   ├── js/ortografia.js   # 🐝 Palabras con b/v, s/c/z y h, y sus reglas
│   ├── js/ecosistemas.js  # 🌳 Ecosistemas, quién vive en cada uno y dónde quedan
│   ├── js/estados.js      # 🧊 Estados de la materia y sus cambios
│   ├── js/quiz.js          # ❓ Motor compartido de los juegos de preguntas (modos, estrellas, voz)
│   ├── css/quiz.css        # ❓ Estilos de esos juegos
│   ├── js/datos.js         # 📰 Frases, datos falsos, mensajes y señales de «¿Dato u opinión?»
│   ├── js/generador-datos.js # 🎲 Datos verdaderos/falsos, opiniones y mensajes nuevos para «¿Dato u opinión?»
│   ├── vendor/blockly/     # Blockly 13 (Apache 2.0), copiado tal cual para que funcione sin internet
│   ├── icons/              # Íconos de la app
│   └── juegos/             # Cada juego es un HTML autocontenido
├── README.md
└── TODO.md                 # Hoja de ruta
```

## Correr en local

No necesita build. Cualquier servidor estático sirve:

```bash
cd public
python3 -m http.server 8080
# o: npx serve .
```

Abrí <http://localhost:8080>.

> Abrirlo con doble clic (`file://`) no funciona bien porque usa módulos JS y service worker.

## Configurar SINPE

Editá `public/js/config.js`:

```js
sinpe: {
  numero: "8888-8888",
  nombre: "Nombre del titular",
  detalle: "Aprendo a lo Tico",
}
```

Mientras `numero` diga `"PENDIENTE"`, la página de apoyo muestra un aviso en lugar del número.

## Ideas y sugerencias (con fotos)

`public/sugerencias.html` es un formulario para que papás y maestras manden ideas de juegos o ejercicios, con hasta 3 fotos. Como el sitio es estático, el correo se envía con [FormSubmit](https://formsubmit.co) (gratis, sin servidor propio). El destino se configura en `public/js/config.js`:

```js
sugerencias: {
  destino: "andres.mayorga07@icloud.com",
}
```

1. **Activación (una sola vez):** el primer mensaje que alguien mande dispara un correo de FormSubmit a esa dirección. Hay que abrirlo y confirmar. Hasta entonces no llegan los mensajes.
2. **Esconder el correo (recomendado):** después de activar, FormSubmit da un código tipo `a1b2c3d4e5…`. Poné ese código en `destino` en lugar del correo, así no queda público en el código de la página.
3. Las fotos se achican solas en el teléfono (máx. 1600 px) antes de enviarse, y se pide no subir fotos de niños.

## Desplegar en DigitalOcean App Platform

**Opción A: panel web**

1. Subí el repo a GitHub.
2. En DigitalOcean: **Create → App → GitHub** y escogé el repo y la rama `main`.
3. **Antes de darle Next**, en **Source directory** poné `public`.
   La raíz del repo no tiene `index.html` ni `package.json`, así que si lo dejás en `/`
   aparece el error *"No components detected"*.
4. Cuando detecte el componente, configuralo como **Static Site**:
   - **Source directory:** `public`
   - **Build command:** (vacío)
   - **Output directory:** (vacío)
5. Crear. Cada `git push` a `main` redespliega solo.

Los sitios estáticos de App Platform tienen capa gratuita (hasta 3 por cuenta), así que el costo inicial es ₡0.

**Opción B: doctl con el spec**

1. Revisá que `github.repo` en `.do/app.yaml` apunte a tu repo (ya dice `SNN-Soluciones/aprendo-a-lo-tico`).
2. Ejecutá:

```bash
doctl apps create --spec .do/app.yaml
# para actualizar después:
doctl apps update <APP_ID> --spec .do/app.yaml
```

**Dominio propio:** en la app, ir a **Settings → Domains** y agregar el dominio, por ejemplo `aprendoalotico.com`.

## ⚠️ Al publicar cambios

Subí la versión en `public/sw.js`:

```js
const VERSION = "v2";
```

Si agregás archivos nuevos, sumalos también a la lista `SHELL` para que funcionen sin internet.

## Agregar un juego

1. Creá `public/juegos/mi-juego.html`. Copiá el `<head>`, el botón 🏠 y el registro del service worker de cualquier juego existente.
2. Agregalo en `public/js/catalog.js`:

```js
{
  id: "mi-juego",
  titulo: "Mi juego",
  descripcion: "Qué aprende el niño, en una línea.",
  emoji: "🦥",
  materia: "espanol",   // mate | espanol | ciencias | sociales | ingles
  grados: [0, 1],       // 0 = Preparatoria, 1..6 = grados
  url: "juegos/mi-juego.html",
},
```

3. Sumalo a `SHELL` en `sw.js` y subí `VERSION`.

### Juegos para los que todavía no leen (Prepa)

Usan `css/prepa.css`, `js/voz.js` y `js/prepa.js` (ver `juegos/contar.html` como ejemplo):

- **Arrancan con un ▶️ gigante.** Los celulares no dejan sonar audio hasta que el usuario toca algo.
- **Todo se dice en voz alta:** la instrucción, lo que se tocó y la retroalimentación. El botón 🔊 repite.
- **Nada depende de leer:** íconos, dibujos y números. El texto chiquito es para el papá o la maestra.
- **Sonidos cortos** de acierto y error con `sonido("ok" | "casi" | "mal")`, sin archivos de audio.
- **Velocidad de la voz:** normal a `VELOCIDAD = 1` y el botón 🐢 repite despacio a `LENTO` (en `js/voz.js`, lo usan todos los juegos). `LENTO` es `0.5`, salvo en iPhone, iPad y Safari, donde las voces de Apple necesitan `0.25` para sonar de verdad a la mitad. Para medirlo en un equipo: abrí `prueba-voz.html` y tocá **⏱️ Medir esta voz**.

### Programación: etapas, pistas y niveles 🐞

Los tres juegos de programación suben de a poquito: cada concepto se practica varias veces antes del siguiente (por ejemplo, en la lapa: cuadrado → dos cuadrados → tres en fila con el cuadrado ya puesto → molino → flores).

- **`id`**: cada nivel tiene un nombre fijo; el progreso se guarda por ese nombre, así que se pueden agregar o reordenar niveles sin perder las estrellas.
- **`inicial`**: bloques o flechas que ya vienen puestos (un empujón, o un programa con error).
- **`depurar: true`**: nivel 🐞 «Arreglá el programa»; el `inicial` trae un error a propósito.
- **`pistas`**: se muestran de una en una con el botón 💡 (en «Repetí y decidí» y en la lapa).
- **`etapa`**: agrupa los niveles en el selector (ver `ETAPAS` en `js/decidi.js` y `js/lapa.js`).

### Agregar niveles al perezoso

Los niveles están en `public/js/perezoso.js` como mapas de texto: `S` perezoso, `H` hoja, `#` árbol, `~` río y `.` camino. Las 3 estrellas se ganan con el camino más corto, que el juego calcula solo.

### Agregar niveles a «Repetí y decidí»

En `public/js/decidi.js`: el mapa usa `> < ^ v` para el perezoso (hacia dónde mira), `H` hoja, `#` árbol, `~` río y `.` camino. Cada nivel dice qué bloques se pueden usar y trae una `solucion` de ejemplo: las 3 estrellas se dan con esa cantidad de bloques (o menos). Para comprobar que las soluciones funcionan:

```bash
cd public
node --input-type=module -e 'import { NIVELES, leer, ejecutar } from "./js/decidi.js"; NIVELES.forEach((n, i) => console.log(i + 1, ejecutar(leer(n), n.solucion).resultado))'
```

### La lapa que dibuja (Blockly)

Usa [Blockly](https://github.com/google/blockly), la librería de bloques de Google (licencia Apache 2.0). Está copiada en `public/vendor/blockly/` (núcleo, español y `media/`), sin descargar nada de internet. Los bloques propios (`avanzar`, `girar`, `repetir`, `color`, `lápiz`, `grosor`) se definen en `juegos/lapa.html`. La lógica está en `js/lapa.js`: cada reto trae una `solucion` que dibuja la meta y fija las 3 estrellas. El dibujo del niño se compara con la meta sin importar el orden ni los colores.

### Casos del jaguar detective

En `public/js/detective.js`. Cada animal tiene sus características (`cubierta`, `vuela`, `patas`, `vive`, `come`, `color`, `noche`), y cada pista es una frase más una función que dice si el animal la cumple. Hay dos tipos de caso: **sospechosos** (tachar y acusar) y **libreta** (cuadro de doble entrada). `trampa` marca la pista 🐞 que no sirve. Para comprobar que cada caso tiene una sola respuesta y que ninguna pista sobra:

```bash
cd public
node --input-type=module -e 'import { CASOS, revisarCaso } from "./js/detective.js"; CASOS.forEach(c => console.log(c.id, revisarCaso(c).join("; ") || "✓"))'
```

### Guía de estilo de los juegos

- **Paleta:** fondo menta `#CFEFE3`, bordes azul marino `#1F3A5F`, botones amarillos `#FFC83D`.
- **Colores de materia:** mate azul `#2F7FD1`, español rojo `#E8574A`, ciencias verde `#2FA85A`, sociales naranja `#F29A1F`, inglés morado `#8E5BD9`.
- **Tipografía:** Baloo 2, con fuentes del sistema como respaldo.
- **Botones:** grandes y con sombra sólida (se ven "presionables").
- **Retroalimentación:** siempre tres niveles: **¡Acertado!**, **¡Casi!** y **No es**, con una pista de qué revisar.
- **Lenguaje:** voseo tico y cariñoso ("Poné", "Revisá", "¡Pura vida!").
- **Datos:** nada de datos personales. Si se guarda algo, que sea en `localStorage` y envuelto en `try/catch`.

## APK con Capacitor (Android)

```bash
npm init -y
npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Aprendo a lo Tico" cr.aprendoalotico.app --web-dir public
npx cap add android
npx cap sync
npx cap open android   # compilar desde Android Studio
```

Para que funcione 100% offline dentro del APK, conviene descargar la fuente Baloo 2 (`.woff2`) a `public/fonts/` y cambiar el `<link>` de Google Fonts por un `@font-face` local.

## Créditos

- Mapa de provincias: © colaboradores de [OpenStreetMap](https://www.openstreetmap.org/copyright), licencia ODbL, obtenido de [geoBoundaries](https://www.geoboundaries.org/) y simplificado.

## Licencia

Por definir (ver TODO.md).
