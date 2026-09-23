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

## Estructura

```
aprendo-a-lo-tico/
├── .do/app.yaml            # Spec de DigitalOcean App Platform
├── public/                 # Todo lo que se publica (sitio estático, sin build)
│   ├── index.html          # Inicio: filtros por materia y grado
│   ├── apoyar.html         # Página de donación por SINPE Móvil
│   ├── 404.html
│   ├── manifest.webmanifest
│   ├── sw.js               # Service worker (modo sin internet)
│   ├── css/base.css        # Estilos del inicio y páginas generales
│   ├── js/config.js        # ⚙️ Número SINPE y datos generales
│   ├── js/catalog.js       # 📚 Materias, grados y lista de juegos
│   ├── js/home.js          # Lógica del inicio
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
