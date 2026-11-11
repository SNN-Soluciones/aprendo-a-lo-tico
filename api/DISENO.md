# Diseño del backend · Aprendo a lo Tico

El API de las Fases 2 a 4 del [PLAN.md](../PLAN.md): cuentas de adultos, escuelas, grupos, estudiantes, avance y
tareas. Este documento fija las decisiones **antes** del código; si una cambia, se cambia aquí primero.

## 1. Decisiones

| # | Decisión | Por qué |
|---|---|---|
| B1 | **Java 21 + Spring Boot 4.1**, Gradle | El stack de snn-core, pero en la línea con soporte: 3.5 dejó de recibir parches libres en junio de 2026 |
| B2 | **Monolito por módulos** en `cr.aprendoalotico.api.<módulo>`, con las fronteras vigiladas por ArchUnit | Una persona lo mantiene; los módulos permiten separar después sin reescribir |
| B3 | **PostgreSQL 16 + Flyway** (`VYYYYMMDD_NN__descripcion.sql`, como snn-core) | Lo conocido. Las migraciones solo **expanden**; borrar o renombrar va en otra, después |
| B4 | **Sesiones opacas en cookie** `httpOnly; Secure; SameSite=Strict`, guardadas con hash en la base. **No JWT** | Se pueden cerrar al instante (salir, cambio de clave, robo); nada legible en el navegador; mismo dominio que el sitio |
| B5 | **CSRF:** SameSite=Strict, y además `OrigenFiltro`: todo método que no sea GET/HEAD/OPTIONS se rechaza si `Sec-Fetch-Site` no es `same-origin`/`none` (también `same-site`) o si `Origin` no es exacto uno de confianza. Sin ninguna de las dos cabeceras pasa (no es un navegador en otro sitio). **Ningún GET cambia nada** | Defensa doble sin tokens en cada formulario |
| B6 | **Claves con Argon2id** (recomendación de OWASP), mínimo 10 caracteres y sin tope corto | Resiste fuerza bruta aunque se filtrara la base |
| B7 | **Correos por SMTP de Resend** (`spring-boot-starter-mail`), remitente de snnsoluciones.com | Estándar: cambiar de proveedor es cambiar variables, no código |
| B8 | **Respuestas siempre en el mismo sobre:** `{ success, data, error: { codigo, mensaje, campos }, meta }` | El portal y los juegos manejan errores igual en todos lados. Los `codigo` son estables y en `MAYUSCULAS_CON_GUIONES` |
| B9 | **Ids UUID** y fechas `timestamptz` en UTC | Sin ids adivinables en las URL; sin líos de zona horaria |
| B10 | **Autorización por institución** en cada servicio, con una prueba de «no ve lo ajeno» por endpoint | Una maestra nunca ve grupos de otra escuela; un papá, solo a sus hijos |
| B11 | **Límites de intentos** (Bucket4j) en entrar, registrarse, recuperar clave y dibujitos | Frena fuerza bruta y abuso del correo |
| B12 | **Auditoría** de todo acceso o cambio a datos de estudiantes (quién, qué, cuándo) | Ley 8968 y confianza de las escuelas |
| B13 | **Logs estructurados sin datos personales:** los errores inesperados se loguean con clase, SQLSTATE y traza, **sin los mensajes** (un error de PostgreSQL trae el correo duplicado); nunca claves ni tokens | Se pueden mandar a cualquier herramienta sin filtrar datos de niños |
| B14 | **Secretos solo por variables de entorno, sin valores por defecto** en producción | Mejor que no arranque a que arranque con una credencial de relleno (igual que snn-core) |
| B15 | El código, las tablas y los mensajes **en español**, también los de validación (locale fijo `es`) | Igual que el resto del repo |
| B16 | **Id de pedido** generado siempre por el servidor (`X-Id-Pedido`, en logs, errores y auditoría); el del cliente queda aparte en el log | Rastrear un error de punta a punta sin que nadie pueda reusar un id ajeno |
| B17 | **Cada módulo abre sus rutas** con un `ContribucionDeSeguridad` (rutas públicas y filtros propios), sin tocar `comun` | Una sola cadena de seguridad: todas las rutas tienen las mismas cabeceras, el filtro de origen y los 401/403 |

## 2. Módulos

```
cr.aprendoalotico.api
├── comun          sobre de respuestas, errores, reloj, filtros (id de pedido), seguridad base
├── estado         GET /api/v1/estado (salud pública y versión)
├── identidad      adultos: registro, verificar correo, entrar, sesiones, salir, recuperar clave, «yo»
├── instituciones  escuelas y hogares, membresías y roles (docente, dirección, encargado)
├── grupos         año lectivo, grupos, docentes por grupo, código de clase
├── estudiantes    estudiantes, matrícula, credenciales (dibujitos y QR), tarjetas
├── familias       vínculos encargado–estudiante, invitaciones, consentimientos
├── avance         eventos de los juegos y derivados: escalera y nivel por tema (Fase 3)
├── tareas         tareas y su cumplimiento (Fase 4)
└── auditoria      registro de accesos y cambios
```

**Reglas (ArchUnit, fallan la build):**
- Un módulo solo usa de otro lo que está en su paquete `api` (servicios y DTO públicos). Nunca sus entidades,
  repositorios ni controladores.
- No hay ciclos entre módulos.
- Los controladores viven en `<módulo>.web` y no tocan repositorios directo.
- Nada de inyección por campo (`@Autowired` en atributos): todo por constructor.

## 3. Datos (primeras tablas)

```
usuarios        id, correo (citext, único), nombre, clave_hash, correo_verificado_en, creado_en, bloqueado_hasta
sesiones        id, usuario_id → usuarios, token_hash (único), creada_en, vista_en, expira_en, cerrada_en, ip_hash, agente
tokens_correo   id, usuario_id, tipo (VERIFICAR | RECUPERAR), token_hash (único), expira_en, usado_en
instituciones   id, tipo (ESCUELA | HOGAR), nombre, codigo_mep?, provincia?, canton?, direccion_regional?, creada_en
membresias      usuario_id, institucion_id, rol (DOCENTE | DIRECCION | ENCARGADO | ADMIN), desde, hasta?
anios_lectivos  id, institucion_id, anio, desde, hasta
grupos          id, anio_lectivo_id, grado (0–6), seccion, codigo_clase (único), creado_en
docentes_grupo  grupo_id, usuario_id, papel (TITULAR | MATERIA), materia?
estudiantes     id, institucion_id, nombre_visible, animalito, grado, lee (NO | POCO | SI), creado_en, retirado_en?
matriculas      estudiante_id, grupo_id, desde, hasta?
credenciales    estudiante_id, dibujitos_hash, qr_token_hash, intentos, bloqueado_hasta
auditoria       id, en, actor_tipo (USUARIO | ESTUDIANTE | SISTEMA), actor_id, accion, recurso, recurso_id, institucion_id, pedido, detalle (jsonb)
                (solo se agregan filas; cada registro va en su propia transacción: sirve en lecturas y sobrevive a un rollback)
```

**De los niños no se guarda:** cédula, fecha de nacimiento, foto, ubicación ni texto libre escrito por ellos.
Los tokens (sesión, verificación, recuperación, QR) se guardan solo como hash SHA-256: una copia de la base no
sirve para entrar.

## 4. Seguridad

| Tema | Regla |
|---|---|
| Sesión | 30 días como máximo y 7 sin uso; se renueva el token al entrar y al cambiar la clave; «salir de todos lados» |
| Recuperar clave | Token de un solo uso de 30 min; al usarlo se cierran todas las sesiones. La respuesta es la misma exista o no el correo |
| Verificar correo | Token de 24 h; sin correo verificado no se pueden crear escuelas ni ver estudiantes |
| Intentos | Entrar: 5 por minuto por IP y 10 por hora por correo; después, espera creciente. Registro y recuperar: 3 por hora por IP |
| Cabeceras | HSTS, `nosniff`, `frame-ancestors 'none'`, `Referrer-Policy: same-origin`, sin `Server` ni versión |
| Errores | Nunca devuelven trazas, SQL ni si un correo existe; todo con un `codigo` estable y el id del pedido |
| Por defecto | Todo endpoint pide sesión salvo los que se abren a propósito (estado, salud, registro, entrar, recuperar, verificar); `/error` solo para el despacho interno de errores |
| Errores tempranos | Lo que el firewall o el servidor rechazan antes de un controlador (`;`, `//`, `%2e`) sale por `ControladorDeErrores` con el sobre, el id y las cabeceras. Tomcat todavía puede responder en HTML a cosas rotas antes del servlet (una cabecera de más de 8 KB): no lleva datos |
| Tamaño | **Pendiente para identidad:** tope al tamaño del cuerpo JSON antes de abrir registro y entrar |
| IP real | **Pendiente para identidad (B11):** detrás de App Platform `getRemoteAddr()` es la del proxy. Antes de los límites por IP hay que confirmar en la documentación de DigitalOcean qué cabecera trae la IP del cliente y no se puede falsificar, y leer solo esa (con prueba) |

## 5. API

- Prefijo `/api/v1`, JSON, nombres en español (`/api/v1/grupos/{id}/estudiantes`).
- Listas con `?pagina=&tamano=` (máximo 100) y `meta: { total, pagina, tamano }`.
- Validación con Bean Validation en los DTO; los errores de campo vuelven en `error.campos`.
- OpenAPI generado en `/api/v1/docs` solo fuera de producción.

## 6. Pruebas (puertas que no se negocian)

- **Unidad** (JUnit + AssertJ) para reglas puras: sobre, límites, tokens, nivel por tema.
- **Integración** con PostgreSQL real (Testcontainers) y MockMvc para cada endpoint: caso feliz, validación,
  sin sesión (401), **sesión de otra institución (403/404)**.
- **Migraciones:** una base vacía migra entera; los nombres siguen la convención.
- **Arquitectura:** ArchUnit (sección 2).
- **Cobertura:** JaCoCo, mínimo 80 % de líneas y ramas en total, y 75 % de líneas en cada paquete; la build falla por debajo.
- **Errores por el cableado real:** un controlador solo de pruebas dispara cada tipo de error (403, 415, 405, validación…)
  por MockMvc, y otra prueba con servidor de verdad cubre lo que rechaza el firewall antes de llegar a Spring MVC.
- CI: `.github/workflows/api.yml` corre `./gradlew check` y construye la imagen en cada PR que toque `api/`. Dependabot
  propone las actualizaciones cada semana. Ojo: por el filtro de rutas, si «API» se marca como check obligatorio, los PR
  que no tocan `api/` quedan esperando; hay que marcarlo obligatorio solo junto con un job que siempre corra.

## 7. Operación

- Perfiles: `local` (Docker Compose con PostgreSQL en un puerto libre), `test` (Testcontainers), `prod` (variables de entorno).
- Variables: `DB_URL`, `DB_USUARIO`, `DB_CLAVE`, `DB_MIGRACION_USUARIO`, `DB_MIGRACION_CLAVE`, `SITIO_URL`; con identidad,
  `SMTP_USUARIO`, `SMTP_CLAVE`, `CORREO_REMITENTE`. La conexión a la base va siempre con TLS: `DB_URL` termina en
  `?sslmode=require` (o `verify-full`) y sin eso no arranca (`BaseCifradaEnProduccion`). Va en la dirección y no en las
  propiedades del pool porque las migraciones abren su propia conexión con esa dirección y sin esas propiedades.
  **Pendiente al desplegar:** pasar a `verify-full` con el certificado de la base administrada (`require` cifra, pero no
  verifica que del otro lado esté nuestra base).
- **Dos roles en la base:** `aprendo_migracion` es dueño de las tablas y corre Flyway; `aprendo_app` es con el que se
  conecta la aplicación, sin DDL, y en `auditoria` solo `SELECT, INSERT`. Así ni una inyección SQL ni una credencial
  robada de la app pueden apagar los disparadores de la auditoría. Se crean al montar la base (antes de desplegar), con
  una prueba que, conectada como `aprendo_app`, verifique que `ALTER TABLE … DISABLE TRIGGER` falla.
- **Retención de la auditoría:** el detalle lleva ids, no datos personales. Cuando crezca, particiones por mes y
  borrado de las viejas por el rol dueño, con un plazo acordado con las escuelas.
- Imagen Docker de varias etapas, JRE 21, usuario sin privilegios. La plataforma revisa `/actuator/health/liveness`
  (no toca la base: una caída de la base no reinicia las instancias); `/api/v1/estado` es para el monitoreo externo
  (dice si la base responde: 5 s de caché que renueva un solo pedido a la vez, 2 s para conseguir conexión y 30 s como
  máximo por consulta). Todo en el mismo puerto: el Actuator solo expone la salud.
- Despliegue: un componente *service* más en la misma app de App Platform, ruta `/api` con `preserve_path_prefix: true`
  (los controladores ya viven en `/api/v1/…`), con PostgreSQL administrado y respaldos diarios. HSTS va con
  `includeSubDomains`: todo `aprendoalotico.cr` tiene que servirse por HTTPS. **Mergear es desplegar: se pregunta antes**, como en snn-core.
- Costo estimado del piloto: USD 20–30 al mes (servicio básico + base administrada). Se crea solo con el visto bueno del dueño.

## 8. Orden de construcción (un PR por paso)

1. **Base:** proyecto, sobre de respuestas, errores, seguridad por defecto, estado, migración inicial, ArchUnit,
   Testcontainers, JaCoCo, Docker, CI.
2. **Identidad:** registro, verificar correo, entrar, sesiones, salir, recuperar clave, «yo», límites, auditoría.
3. **Instituciones y grupos:** crear escuela u hogar, membresías, año lectivo, grupos y código de clase.
4. **Estudiantes:** alta por lista, matrícula, dibujitos y tarjetas imprimibles (PDF).
5. **Portal Angular** (`portal/`) para todo lo anterior.
6. **Avance** (Fase 3): entrar a la clase desde los juegos y sincronizar.
