# Plan · Aprendo a lo Tico como plataforma para escuelas, maestras y familias

Hoja de ruta para pasar de **juegos sueltos en el dispositivo** a una **plataforma con maestras, familias,
grupos de clase y avance por temario del MEP**, sin perder lo que la hace buena: gratis, sin anuncios,
funciona sin internet y no pide datos de más.

> El `TODO.md` sigue siendo la lista de contenido y detalles de los juegos. Este plan reemplaza su
> «Fase 3 · Maestros y papás». Marcá con `[x]` lo que se vaya haciendo.

---

## 0. Resumen

- **Hoy:** 62 juegos (51 con escalera 🪜), unos 70 temas de examen, temario de 2°, perfiles y álbum por niño.
  Todo vive en `localStorage`. Sitio estático en DigitalOcean, sin backend, sin analítica y sin tests en CI.
- **Meta:** que una maestra arme su grupo, deje tareas y vea quién va bien y quién necesita ayuda en cada tema;
  que un papá vea el avance de su hijo; y que una escuela o el MEP vea números agregados y anónimos.
- **Cómo:** los juegos **no se reescriben**. Se agrega una API (Spring Boot), un portal para adultos (Angular)
  y dos módulos chiquitos en los juegos (`cuenta.js` y `sync.js`) que conectan el perfil local con la clase
  y suben el avance cuando hay internet.
- **Fecha que manda:** el **curso lectivo 2027 arranca en febrero** (confirmar con el calendario del MEP).
  Si el piloto no está listo para las primeras semanas de clases, se pierde medio año. El plan apunta ahí.

| Hito | Cuándo | Qué hay |
|---|---|---|
| **A** · Presentable | mediados de diciembre 2026 | Fases 0 y 1: dominio, privacidad, números de uso, avance por tema en el dispositivo, examen compartible |
| **B** · Cuentas y clases | fines de enero 2027 | Fases 2 y 3: maestras, grupos, niños que entran a su clase, avance sincronizado |
| **C** · Arranca el piloto | primeras semanas de febrero 2027 | Fase 4: panel de la maestra y tareas |
| **D** · Primer informe | abril–mayo 2027 | Fase 5 (familias) + resultados del piloto para mostrar |
| **E** · Escalar | segundo semestre 2027 | Fase 7: dirección, regionales, cuenta MEP, Play Store |

Las semanas de cada fase son estimadas para una persona trabajando con Claude, a tiempo parcial.

---

## 1. Principios que no se negocian

1. **Gratis para niños y familias, sin anuncios.** Siempre.
2. **Sin internet funciona.** El avance se guarda primero en el dispositivo y se sube después. Hay escuelas rurales
   con señal mala y tabletas compartidas.
3. **Datos mínimos de menores.** Nombre como lo escriba la maestra (puede ser nombre + inicial), grado y grupo.
   Nada de cédula, fecha de nacimiento, foto, ubicación ni texto libre escrito por los niños.
4. **Los juegos no se reescriben.** Son el activo. Se conectan; no se migran a Angular.
5. **Alineado al programa del MEP.** Cada tema del temario dice de qué parte del programa sale.
6. **Cada fase se puede usar y mostrar.** Nada de tres meses sin algo que enseñar.
7. **Le ahorra tiempo a la maestra.** Si una función le da más trabajo del que le quita, no va.

### Qué NO vamos a hacer (por ahora)

- Chat entre niños o entre familias (moderación imposible para un equipo chiquito).
- Fotos o videos de niños.
- Publicidad, venta de datos o rastreadores de terceros.
- Reescribir los juegos en Angular o hacer una app nativa aparte (la PWA y luego Capacitor alcanzan).
- IA que converse con los niños.
- Microservicios: un solo backend ordenado por módulos.

---

## 2. Decisiones de arquitectura

```
                    aprendoalotico.cr  (un solo dominio, rutas por componente)
 ┌──────────────────────────┬───────────────────────────┬──────────────────────────┐
 │ /          JUEGOS        │ /portal/    PORTAL         │ /api/v1/    API          │
 │ PWA estática (la de hoy) │ Angular 20 (nuevo)         │ Spring Boot 3.5 · Java 21│
 │ + js/cuenta.js  (entrar) │ maestras · familias        │ monolito por módulos     │
 │ + js/sync.js    (subir)  │ dirección · administración │                          │
 └────────────┬─────────────┴─────────────┬─────────────┴────────────┬─────────────┘
              │ bandeja de salida offline │ cookie httpOnly           │
              └─────── POST /api/v1/avance/sync ──────────────────────┤
                                                              PostgreSQL + Flyway
```

| # | Decisión | Por qué |
|---|---|---|
| D1 | **Los juegos quedan como están** (JS sin build) y solo se les agrega `cuenta.js` y `sync.js` | 62 juegos probados; reescribirlos es meses sin valor nuevo |
| D2 | **Local primero, con bandeja de salida.** El dispositivo guarda; el servidor recibe eventos que no se borran ni se editan | Funciona sin internet y no hay conflictos: juntar eventos de la casa y la escuela es sumar |
| D3 | **Un resumen por sesión de juego**, no un evento por toque | 50 veces menos tráfico y menos datos de menores; alcanza para el panel |
| D4 | **Los niños no tienen correo ni clave escrita.** Entran con código de clase → su animalito → 3 dibujitos, o con el QR de su tarjeta | Los de Prepa y 1° no leen; así lo hacen las plataformas escolares conocidas |
| D5 | **Temario como datos con ids que nunca cambian** (materia → grado → unidad → tema → recursos) | Es lo que permite el «avance por temario»; hoy los temas viven mezclados en el código |
| D6 | **Un solo dominio:** juegos en `/`, portal en `/portal/`, API en `/api/` | Sin CORS, sesión en cookie httpOnly + SameSite=Strict también para los niños (no tokens en `localStorage`) |
| D7 | **Spring Boot 3.5 + Java 21 + PostgreSQL + Flyway + Testcontainers, y Angular 20** | Es el mismo stack de snn-core y snn-pos: cero curva de aprendizaje |
| D8 | **Base de datos y servicio aparte de Nathbit/SNN POS** | Datos de niños separados de datos comerciales; más fácil de explicar al MEP y a la PRODHAB |
| D9 | **Monorepo** (`public/`, `portal/`, `api/`) con un solo `.do/app.yaml` | Un cambio de contrato toca cliente y servidor en el mismo PR. *Decisión abierta: ver §9* |
| D10 | **Las reglas del nivel por tema son una función pura con casos de prueba en JSON** que usan el JS y el Java | Papá (en el dispositivo) y maestra (en el portal) ven el mismo nivel |

---

## 3. Modelo de dominio

```
Institución (tipo: escuela | hogar)
 ├── Membresía ─── Usuario adulto ── rol: docente · dirección · encargado · admin
 ├── Año lectivo (2027)
 │    └── Grupo (2-3) ── DocenteDeGrupo (titular | de materia: inglés, ciencias…)
 │         ├── Código de clase
 │         └── Matrícula ─── Estudiante ── Credencial (dibujitos | QR)
 │                               └── Vínculo ─── Encargado  (con Consentimiento)
 └── Dispositivo de aula (tableta compartida, ligada a un grupo)

Contenido:  Materia → Programa (materia + grado) → Unidad → Tema → Recurso
            Recurso = juego + rango de escalones | lección (aprender.html) | tema de examen

Avance:     Estudiante → SesiónDeJuego, ResultadoDeExamen, StickerGanado    (eventos, solo se agregan)
                       ⇒ EstadoDeEscalera, NivelDeTema                     (derivados, se recalculan)

Clase:      Tarea (grupo, recursos, fecha límite, meta) ⇒ Cumplimiento (derivado de las evidencias)
            Aviso (maestra → encargados del grupo, de una vía)

Plataforma: Auditoría (quién vio o cambió qué de qué estudiante), versión del contenido
```

### Perfiles

| Perfil | Datos | Puede |
|---|---|---|
| **Estudiante** | nombre visible, animalito, grado, si lee (no / poco / sí), grupos | jugar, ver sus tareas, su álbum y su avance |
| **Docente** | nombre, correo verificado, escuelas, grupos, materias | crear grupos, agregar niños, imprimir tarjetas, dejar tareas, ver avance de **sus** grupos |
| **Encargado** (mamá, papá, abuela…) | nombre, correo, hijos vinculados, preferencias de avisos | ver avance y tareas de **sus** hijos, aceptar o retirar el consentimiento, pedir o borrar datos |
| **Dirección** | igual que docente, a nivel escuela | ver todos los grupos de su escuela y el uso agregado |
| **Admin de plataforma** | equipo de Aprendo a lo Tico | contenido, soporte, nunca ver datos de niños sin un motivo registrado |

Un docente puede estar en varias escuelas (las de inglés suelen ser itinerantes) y un encargado puede tener hijos en
escuelas distintas. Una familia sin escuela crea una institución tipo **hogar** y funciona igual.

### Temario como datos (ejemplo)

```js
// public/js/temario/mate-2.js
export default {
  id: "mate-2", materia: "mate", grado: 2,
  fuente: "Programa de estudio de Matemáticas, MEP",   // con la referencia exacta del programa
  unidades: [{
    id: "mate-2-numeros", nombre: "Números hasta el 1000", periodo: 1,
    temas: [{
      id: "mate-2-numeros-orden",                        // NUNCA se renombra; si sobra, se marca obsoleto
      nombre: "Antes, después, mayor y menor",
      mep: "…indicador del programa…",
      recursos: [
        { tipo: "juego", juego: "numeros", escalones: [3, 7] },
        { tipo: "leccion", url: "aprender.html?materia=mate&tema=sucesiones" },
        { tipo: "examen", tema: "numeros-orden" },
      ],
    }],
  }],
};
```

Para poder usar `escalones: [3, 7]`, cada juego exporta qué es cada escalón
(`export const ESCALONES = ["Hasta 20", "Hasta 50", …]`). Se hace juego por juego, empezando por los de 1° y 2°.

### Nivel por tema

Cuatro niveles, con texto y no solo color: **Sin empezar · Empezando · En camino · Lo logró**.

- *Lo logró*: llegó al último escalón del rango en algún juego del tema, **o** acertó 80 % o más en las últimas
  10 preguntas de examen de ese tema.
- *En camino*: pasó la mitad del rango, o acertó 50 % o más.
- *Empezando*: hay actividad, pero no alcanza lo anterior.

Los umbrales se ajustan con las maestras del piloto. Las reglas viven en `js/dominio.js` y en el módulo `avance`
del backend, y las dos pasan los mismos casos de `fixtures/dominio/*.json`.

### Contrato de sincronización (borrador)

```json
POST /api/v1/avance/sync          (cookie de sesión del estudiante)
{
  "dispositivo": "d_8f2…",
  "eventos": [
    { "id": "0b6e…uuid", "tipo": "sesion_juego", "juego": "reloj",
      "inicio": "2027-02-15T09:12:00-06:00", "minutos": 7,
      "rondas": 12, "bien": 9, "conAyuda": 1, "escalonInicio": 3, "escalonFin": 4, "app": "sw-v41" },
    { "id": "5c1d…uuid", "tipo": "examen", "semilla": "x7k2", "temas": ["numeros-orden", "hora"],
      "nota": 85, "porTema": { "numeros-orden": [9, 10], "hora": [8, 10] } }
  ]
}
→ { "success": true,
    "data": { "aceptados": ["0b6e…", "5c1d…"], "escaleras": { "reloj": { "n": 4, "max": 4 } }, "tareas": [ … ] },
    "error": null }
```

El `id` lo genera el dispositivo: si un lote se manda dos veces, el servidor no lo cuenta doble.

---

## 4. Fases

### Fase 0 · Base sólida y presentable · 1–2 semanas · hito A

**Objetivo:** que lo que ya existe se vea serio ante una escuela, el MEP o un diputado, y tener números de uso.

- [ ] Dominio propio conectado en App Platform. `aprendoalotico.cr`, `.com` y `.org` estaban libres el 11/11/2026.
      Al tenerlo: cambiar `CONFIG.sitio` y correr `npm run compartir`
- [x] Páginas «Acerca de» y **privacidad** en lenguaje claro (versión 1); responsable: SNN Soluciones
- [ ] Revisar la página de privacidad con un abogado (Ley 8968) y agregar términos de uso
- [x] Licencias: código MIT (`LICENSE`) y contenido CC BY-NC-SA 4.0 (`LICENSE-CONTENIDO.md`)
- [ ] Confirmar de dónde salieron las fotos de `public/img/` (sin fuente registrada; quedan fuera de la licencia)
- [x] Fuente Baloo 2 local (offline total, sin pedirle nada a Google) e imagen para compartir en WhatsApp (`og:image`),
      con título, descripción y dirección en cada página (`scripts/compartir.mjs`)
- [x] **Analítica sin cookies ni datos personales** con GoatCounter: solo la ruta de la página, sin scripts de terceros,
      respeta «No rastrear». Lista en el código, apagada hasta crear la cuenta
- [ ] Crear la cuenta de GoatCounter y poner su código en `CONFIG.analitica.goatcounter` (+ `npm run csp`).
      Sin esto no hay números que enseñar
- [x] Tests: los `revisar…` de cada generador pasados a `node --test` (`pruebas/generadores/`, uno por módulo, con semilla)
- [x] Playwright: las 71 páginas abren y cada juego arranca sin errores de consola ni bloqueos de la CSP, en Chrome
      (375 y 1024 px), Safari y Firefox
- [x] Modo sin internet probado: todo lo que carga cada página está en la lista del service worker, y con el service
      worker de verdad se corta la red y se sigue jugando
- [ ] Correr la prueba del navegador contra el sitio publicado después de cada despliegue
- [x] GitHub Actions: tests en cada PR y en cada push a `main`
- [ ] Proteger `main` en GitHub para que no se pueda mergear con la CI en rojo (Settings → Branches)
- [x] Un solo `escapar()` compartido (`js/html.js`, antes había 7 copias) y una CSP con hashes en todas las páginas
      (`scripts/csp.mjs`), **antes** de que entren nombres desde el servidor
- [ ] Decidir la entidad legal y la cuenta de las donaciones (pendiente en el TODO)
- [ ] **Hablar ya con la escuela piloto**, antes de que cierre el curso lectivo (ver §5)

**Listo cuando:** dominio propio, CI en verde, privacidad publicada y el primer reporte de uso.

### Fase 1 · Temario como datos y avance por tema en el dispositivo · 2–3 semanas · hito A

**Objetivo:** pasar de «juegos sueltos» a «el programa del MEP con avance por tema», todavía sin backend.

- [ ] Modelo de temario en `public/js/temario/` (un archivo por materia y grado, ids estables)
- [ ] `ESCALONES` exportado en cada juego de 1° y 2°: qué se practica en cada escalón
- [ ] Mapear 1° y 2° completos (los grados del piloto): tema → juegos con rango de escalones, lecciones y temas de examen
- [ ] Pasar el temario de 2° de hoy (`temario-2.js`, de una sola escuela) a ese modelo general
- [ ] **Guardar los resultados de examen** por perfil (`alt-examenes-<perfil>`); hoy se pierden al cerrar
- [ ] `js/dominio.js`: función pura del nivel por tema, con sus casos en `fixtures/dominio/`
- [ ] Vista «📋 Mi temario»: materia → unidad → tema con su nivel y el botón «practicar lo que falta»
- [ ] Modo papá con PIN (pendiente en el TODO): protege el ajuste manual y la vista de avance
- [ ] **Examen compartible:** `examen.html?…&semilla=x7k2` → toda la clase hace el mismo examen.
      Primer valor para maestras, sin cuentas
- [ ] Botón «⚠️ Reportar un error» en cada pregunta (por FormSubmit, como las sugerencias)

**Listo cuando:** un papá ve el avance de su hijo por tema de 1° o 2°, y una maestra manda un examen por WhatsApp.

### Fase 2 · Backend y cuentas de adultos · 3–4 semanas · hito B

**Objetivo:** que existan maestras, escuelas, grupos y estudiantes.

- [ ] Estructura del monorepo y `.do/app.yaml` con tres componentes y un dominio; **staging** aparte de producción
- [ ] API Spring Boot: módulos `identidad`, `instituciones`, `temario`, `avance`, `tareas`, `familias`, `auditoria`;
      respuestas `{ success, data, error, meta }`, validación con Bean Validation, OpenAPI, migraciones Flyway
- [ ] Identidad: registro con correo verificado, clave con hash fuerte, recuperación, sesión en cookie httpOnly,
      refresh rotativo, roles por institución
- [ ] Límite de intentos en login y en todo endpoint público; mensajes de error que no filtran datos
- [ ] Instituciones: escuela (nombre, código del MEP opcional, provincia, cantón, dirección regional) u hogar
- [ ] Grupos: año lectivo, grado, sección, docente titular y docentes de materia; código de clase (sin letras que
      se confunden: 0/O, 1/I)
- [ ] Estudiantes: alta pegando una lista de nombres; nada de cédula, fecha de nacimiento ni foto
- [ ] **Tarjetas de acceso imprimibles** (PDF): QR, código de clase y los dibujitos de cada niño
- [ ] Portal Angular 20 en `/portal/`: entrar, mis grupos, crear grupo, estudiantes, tarjetas
- [ ] El temario de la Fase 1 se carga al backend desde el repo (una sola fuente, con versión)
- [ ] Auditoría: quién vio o cambió datos de qué estudiante
- [ ] Respaldos automáticos de la base y una restauración probada en staging

**Listo cuando:** una maestra crea su grupo de 2° con 25 niños e imprime las tarjetas en menos de 10 minutos.

### Fase 3 · Los niños entran a su clase y el avance se sincroniza · 3–4 semanas · hito B

**Objetivo:** que lo que el niño juega, en la escuela o en la casa, le llegue a su maestra.

- [ ] `js/cuenta.js`: «🏫 Entrar a mi clase» → escanear el QR o poner el código → tocar su animalito y nombre →
      3 dibujitos. Sin teclado, con voz, para los que no leen
- [ ] Ligar el perfil local con el estudiante y subir lo que ya llevaba (con confirmación del adulto)
- [ ] **Modo aula** para tabletas compartidas: el dispositivo queda ligado al grupo; cada niño se escoge y se sale,
      y el avance nunca se mezcla
- [ ] `js/sync.js`: bandeja de salida en el dispositivo, un resumen por sesión de juego, envío en lotes cuando hay
      internet, reintentos con espera creciente, ids únicos
- [ ] API `POST /api/v1/avance/sync` + derivados: escalera (la más alta) y nivel por tema (mismas reglas y casos de la Fase 1)
- [ ] La escalera también baja del servidor: si juega en la casa y en la escuela, sigue donde iba
- [ ] Bloqueo tras varios intentos fallidos de dibujitos; la maestra lo desbloquea o le cambia los dibujitos
- [ ] Pruebas de punta a punta: jugar sin internet → volver a tener señal → el avance aparece una sola vez

**Listo cuando:** un niño juega sin internet en el aula y, al rato de volver la señal, su maestra ve ese avance.

### Fase 4 · Panel de la maestra · 3–4 semanas · hito C → arranca el piloto

**Objetivo:** que la maestra sepa en un minuto quién va bien y quién necesita ayuda, sin calificar a mano.

- [ ] **Mapa del grupo:** estudiantes × temas, con el nivel en color y en texto
- [ ] Ficha del estudiante: temas, juegos, exámenes y minutos de práctica de la semana
- [ ] Alertas: «se quedó pegado en…», «no ha practicado en 7 días», «bajó de escalón varias veces»
- [ ] **Tareas:** tema(s), juego(s) o examen, fecha límite y meta (llegar al escalón N, sacar 70 o más).
      El niño las ve arriba en su inicio y se marcan solas al cumplirlas
- [ ] Exámenes de grupo: el mismo examen para todos (semilla), nota automática y análisis por pregunta
      («el 60 % falló la 4»)
- [ ] Exportar: Excel del grupo y PDF por estudiante (reunión de padres, informes)
- [ ] Guía «¿Cómo se usa?» para docentes, con video corto

**Listo cuando:** la maestra deja una tarea el lunes y el viernes sabe quién la hizo y quién necesita ayuda.

### Fase 5 · Familias · 2–3 semanas · durante el piloto

**Objetivo:** que la familia acompañe sin tener que preguntarle a la maestra.

- [ ] Invitación por estudiante (código o enlace que entrega la maestra) → el encargado crea su cuenta y
      **acepta el consentimiento** (queda registrado con la versión del texto y la fecha)
- [ ] Ver el avance por tema, las tareas y los exámenes de sus hijos (varios, de escuelas distintas)
- [ ] Ligar los perfiles que ya existen en el teléfono de la casa con cada hijo
- [ ] Resumen semanal por correo (se puede apagar)
- [ ] Avisos de la maestra a las familias del grupo (de una vía, sin chat)
- [ ] Descargar o borrar los datos de mi hijo, y retirar el consentimiento

**Listo cuando:** un papá recibe el resumen del domingo y sabe qué practicar con su hijo.

### Fase 6 · Piloto · febrero a mayo 2027

Ver §5.

### Fase 7 · Escala institucional · segundo semestre 2027

**Objetivo:** estar listos para que el MEP, una dirección regional o una municipalidad lo adopte.

- [ ] Rol dirección: vista de la escuela (grupos, uso, avance por grado) y carga de matrícula por CSV
- [ ] Vistas agregadas por circuito y dirección regional, siempre anónimas (nada con menos de 10 estudiantes)
- [ ] «Entrar con cuenta del MEP» (Microsoft) para docentes: confirma que es docente
- [ ] APK en Google Play con Capacitor, cumpliendo la Families Policy
- [ ] Auditoría de accesibilidad WCAG 2.2 AA, pentest externo, pruebas de carga (k6) y plan de recuperación probado
- [ ] Editor de contenido para un equipo de maestras revisoras, con revisión antes de publicar
- [ ] Temario de 3° a 6° y Prepa; voz grabada por una persona tica
- [ ] Costo por estudiante al año, documentado (para cualquier convenio)

---

## 5. Piloto

- **Dónde:** la Escuela Fidel Chaves Murillo (Belén), de donde salió el temario de 2°, más **una escuela rural**
  para probar de verdad el modo sin internet y las tabletas compartidas.
- **Tamaño:** 3 a 6 grupos de 1° y 2°, unas 100 a 150 familias.
- **Antes de diciembre:** reunión con la dirección, carta de autorización, maestras voluntarias identificadas y
  el texto del consentimiento revisado por un abogado. En vacaciones no hay a quién preguntarle.
- **Primera semana de clases:** taller de 1 hora con las maestras, tarjetas impresas y soporte por WhatsApp.
- **Qué medir:**
  - estudiantes activos por semana (meta: 60 % o más del grupo)
  - minutos de práctica por estudiante por semana
  - tareas cumplidas a tiempo
  - notas de las pruebas del MEP antes y después, comparadas con un grupo que no lo usa (si la escuela lo permite)
  - satisfacción de maestras y familias (encuesta corta al mes 1 y al mes 3)
  - errores de contenido reportados y corregidos, e incidentes técnicos
- **Entregable:** informe de 4 o 5 páginas en abril–mayo. Esa evidencia es lo que convence a un diputado o al MEP.

---

## 6. Legal y privacidad

Confirmar todo esto con un abogado **antes** del piloto.

- [ ] **Ley 8968** (protección de datos personales): base legal del tratamiento, consentimiento informado de los
      encargados y derechos de acceso, rectificación y eliminación
- [ ] Evaluar si la base de datos se debe inscribir ante la **PRODHAB**
- [ ] **Código de la Niñez y la Adolescencia** (Ley 7739): nada que exponga a los niños
- [ ] Quién es responsable de los datos: la escuela, Aprendo a lo Tico o los dos (convenio con cada escuela)
- [ ] Retención: qué se borra al cerrar el año lectivo y qué queda solo en forma anónima
- [ ] Dónde están los datos: DigitalOcean (Nueva York) sirve para el piloto; una institución pública puede pedir otra cosa
- [ ] Entidad legal: SNN Soluciones, una asociación o una fundación (afecta donaciones, convenios y confianza)
- [ ] Si algún día hay venta al Estado, es por SICOP; mientras tanto, convenios de colaboración
- [ ] Contenido original siempre: el programa del MEP es la guía, pero no se copian libros de texto

---

## 7. Calidad y operación

| Área | Qué se hace |
|---|---|
| Tests | Generadores con `node --test`; backend con JUnit + Testcontainers; portal con pruebas unitarias; **80 % de cobertura** en API y portal |
| Punta a punta | Playwright: los 62 juegos abren; entrar a la clase; jugar sin internet y sincronizar; maestra deja tarea y ve el cumplimiento |
| CI | GitHub Actions en cada PR: tests, cobertura y build; no se mergea en rojo |
| Ambientes | local → staging (datos de prueba) → producción; las migraciones se prueban en staging primero |
| Seguridad | Cookies httpOnly + SameSite=Strict, CSP, `escapar()` en todo HTML con datos, límite de intentos, auditoría, revisión de seguridad antes de cada fase con datos de niños |
| Errores | Errores del cliente a un endpoint propio, sin datos personales; alertas de despliegue fallido y de caída |
| Respaldos | Respaldo diario de PostgreSQL + restauración probada cada mes |
| Accesibilidad | Contraste, botones grandes, lector de pantalla, nivel en texto y no solo en color, respeta «reducir movimiento» |
| Rendimiento | Los juegos siguen estáticos y en caché; la API recibe un resumen por sesión, no cada toque |
| Costos | Del orden de USD 30–60 al mes en el piloto (servicio de API + PostgreSQL administrado; los juegos casi no cuestan) |

---

## 8. Para la reunión con los diputados

- **Qué llevar:** la demo en un celular **sin internet**; los números de uso (Fase 0); este plan con fechas;
  la política de privacidad; y, cuando exista, el informe del piloto.
- **Qué pedir (no plata, todavía):**
  - una presentación con el MEP (Dirección de Recursos Tecnológicos en Educación y Desarrollo Curricular)
  - aval para el piloto en unas cuantas escuelas, incluida una rural
  - contacto con la Fundación Omar Dengo (PRONIE MEP-FOD) y con la municipalidad del cantón piloto
- **Qué contar:** hecho en Costa Rica, para el programa del MEP, gratis, sin anuncios, sin internet y con datos
  mínimos. Ninguna plataforma extranjera cuenta la hora «a lo tico» ni paga en colones.

---

## 9. Decisiones pendientes (del dueño)

1. **Entidad legal y modelo:** ¿todo gratis siempre? ¿O gratis para familias y docentes, con convenios para
   instituciones (vistas regionales, soporte, capacitación)?
2. **Monorepo o repos separados** (recomendado: monorepo, D9).
3. **Escuelas piloto:** ¿Fidel Chaves Murillo con 1° y 2°? ¿Cuál escuela rural?
4. **Entrada de docentes:** correo y clave desde el día 1; ¿cuenta del MEP en la Fase 7 o antes?
5. **Dominio:** `.cr` (NIC.cr) o `.com`.
6. **Residencia de los datos:** ¿DigitalOcean sirve, o hay que prever un hosting en Costa Rica para el Estado?

---

## 10. Riesgos

| Riesgo | Cómo se evita |
|---|---|
| Querer hacer todo a la vez siendo una persona | Fases cerradas; cada una se usa sola; lo que no entra se anota en el TODO |
| Un incidente con datos de niños | Datos mínimos, sin texto libre ni fotos, revisión legal y de seguridad antes del piloto |
| Un error de contenido frente a una autoridad | Revisión de maestras, botón «Reportar un error», tests de los generadores |
| La maestra no lo adopta | Que le ahorre tiempo: tareas que se marcan solas, exámenes que se califican solos, informes listos |
| Mala señal en la escuela | Local primero con bandeja de salida; se prueba en la escuela rural del piloto |
| Tabletas compartidas que mezclan el avance | Modo aula: cada niño entra y sale de forma explícita |
| Depender de la política (cambio de gobierno o de ministro) | Valor directo para familias y escuelas; el piloto no depende de un contrato |
| Que solo una persona sepa cómo funciona | Tests, CI, README de cada parte y este plan al día |

---

## 11. Próximo paso

Arrancar la **Fase 0** y, en paralelo, **pedir la reunión con la escuela piloto esta misma semana**: el curso
lectivo cierra en diciembre y sin escuela no hay piloto en febrero.
