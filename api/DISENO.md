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
| B6 | **Claves con Argon2id** (OWASP: 19 MiB, 2 pasadas, 1 hilo), de 10 a 128 caracteres, normalizadas (NFKC). Sin reglas de composición, pero no se aceptan las más usadas (`claves-comunes.txt`), las que contienen el correo ni las de uno o dos caracteres repetidos. Como mucho 4 cálculos a la vez (2 s de espera, después 503) | Lo que recomiendan NIST y OWASP; resiste fuerza bruta aunque se filtrara la base, y el tope de cálculos evita que muchos «entrar» juntos se coman la memoria |
| B7 | **Correos por SMTP de Resend** (`spring-boot-starter-mail`, `smtp.resend.com:2465`, TLS desde el primer byte: DigitalOcean suele bloquear la salida por 25, 465 y 587), remitente de snnsoluciones.com. En texto plano, sin nada que haya escrito otra persona (ni el nombre), y con el token después del `#` del enlace. Se mandan cuando se confirma la transacción, en segundo plano y con reintentos; como mucho 300 por hora entre todos | Estándar: cambiar de proveedor es cambiar variables. Sin texto ajeno nadie usa nuestro dominio para mandar engaños; lo que va después de `#` no llega a ningún servidor ni queda en los logs. El tope cuida la cuota del proveedor y la reputación del dominio |
| B8 | **Respuestas siempre en el mismo sobre:** `{ success, data, error: { codigo, mensaje, campos }, meta }` | El portal y los juegos manejan errores igual en todos lados. Los `codigo` son estables y en `MAYUSCULAS_CON_GUIONES` |
| B9 | **Ids UUID** y fechas `timestamptz` en UTC | Sin ids adivinables en las URL; sin líos de zona horaria |
| B10 | **Autorización por institución** en cada servicio, con una prueba de «no ve lo ajeno» por endpoint | Una maestra nunca ve grupos de otra escuela; un papá, solo a sus hijos |
| B11 | **Límites de intentos** (Bucket4j en memoria; las claves, por su huella de 64 bits en un Caffeine con tope) en entrar, registrarse, recuperar clave y dibujitos. Para los fallidos, el estricto es por IP y correo juntos; los de por correo y por IP no frenan a una IP desde la que esa cuenta ya entró bien | Frena fuerza bruta y abuso del correo. Quien sabe el correo de una maestra no la deja sin entrar desde su propia IP, y una escuela entera (una sola IP) no queda bloqueada por un estudiante |
| B12 | **Auditoría** de todo acceso o cambio a datos de estudiantes (quién, qué, cuándo) | Ley 8968 y confianza de las escuelas |
| B13 | **Logs estructurados sin datos personales:** los errores inesperados se loguean con clase, SQLSTATE y traza, **sin los mensajes** (un error de PostgreSQL trae el correo duplicado); nunca claves ni tokens | Se pueden mandar a cualquier herramienta sin filtrar datos de niños |
| B14 | **Secretos solo por variables de entorno, sin valores por defecto** en producción | Mejor que no arranque a que arranque con una credencial de relleno (igual que snn-core) |
| B15 | El código, las tablas y los mensajes **en español**, también los de validación (locale fijo `es`) | Igual que el resto del repo |
| B16 | **Id de pedido** generado siempre por el servidor (`X-Id-Pedido`, en logs, errores y auditoría); el del cliente queda aparte en el log | Rastrear un error de punta a punta sin que nadie pueda reusar un id ajeno |
| B17 | **Cada módulo abre sus rutas** con un `ContribucionDeSeguridad` (rutas públicas y filtros propios), sin tocar `comun` | Una sola cadena de seguridad: todas las rutas tienen las mismas cabeceras, el filtro de origen y los 401/403 |
| B18 | **La cuenta se crea al confirmar el correo, y ahí se escriben el nombre y la clave.** Pedir una cuenta es dar solo el correo; no existen cuentas sin confirmar | Evita el «pre-secuestro»: si la clave se pusiera al pedirla, alguien podría pedir una cuenta con el correo de una maestra y su propia clave, y quedarse con ella cuando la maestra abra el enlace |
| B20 | **Lo que depende de si un correo tiene cuenta se hace en segundo plano** (`SegundoPlano`): pedir cuenta, recuperar la clave, auditar un intento fallido | La respuesta es la misma y tarda lo mismo: nadie averigua qué correos tienen cuenta midiendo tiempos |
| B19 | **La IP del cliente** sale de la cabecera que pone la plataforma (`do-connecting-ip` en App Platform; `X-Forwarded-For` ahí trae la del proxy), solo si es una IP literal; las IPv6 se agrupan por /64 para los límites | Una IP que el cliente pueda inventar no sirve para limitar nada |

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
usuarios        id, correo (único, en minúsculas), nombre, clave_hash, correo_confirmado_en, creado_en, clave_cambiada_en
registros_pendientes  id, correo, token_hash (único), creado_en, expira_en   (24 h; al confirmar se borran; B18)
sesiones        id, usuario_id → usuarios, token_hash (único), creada_en, vista_en, expira_en, cerrada_en, agente
recuperaciones  id, usuario_id → usuarios, token_hash (único), creada_en, expira_en, usada_en
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
Los tokens (sesión, confirmación, recuperación, QR) son 32 bytes al azar y se guardan solo como hash SHA-256: una
copia de la base no sirve para entrar. De las sesiones no se guarda la IP (ni en hash: el de una IPv4 se revierte
probando todas). Una tarea de cada noche borra las sesiones, registros pendientes y recuperaciones que ya no sirven.

## 4. Seguridad

| Tema | Regla |
|---|---|
| Sesión | Cookie `__Host-sesion` (`HttpOnly; Secure; SameSite=Strict; Path=/`). 30 días como máximo y 7 sin uso; cada entrada es una sesión nueva, y como mucho 20 abiertas por cuenta (se cierran las más viejas); al cambiar la clave se cambia el token y se cierran las demás; «salir de todos lados». Una cookie que no sirve no se borra desde el servidor (un pedido viejo podría borrar la nueva): la borra «salir» |
| Recuperar clave | Token de un solo uso de 30 min; al usarlo (o al cambiar la clave con la sesión) se cierran las sesiones, dejan de servir los demás enlaces y llega un aviso al correo. La respuesta es la misma exista o no el correo (y a un correo sin cuenta no se le manda nada) |
| Confirmar correo | Token de 24 h (B18). Si alguien pide una cuenta con un correo que ya tiene una, la respuesta es la misma y a ese correo le llega «ya tenés cuenta» |
| Carreras | Dos enlaces del mismo correo (o de la misma cuenta) usados a la vez se turnan: se traba el correo (`pg_advisory_xact_lock`) o la fila de la cuenta antes de tocar nada, siempre en el mismo orden. Sin eso, cada uno trababa su fila y esperaba la del otro. Entrar y cambiar la clave comprueban la clave sin trabar (el Argon2 tarda) y después, con la cuenta trabada, miran que siga siendo la misma: una sesión no queda abierta con la clave que una recuperación acaba de reemplazar, ni un cambio pisa la clave recuperada. Cambiar la clave con una sesión que cerraron mientras tanto no cambia nada (401) |
| Intentos | Entrar, fallidos: 5 por minuto y 10 por hora por IP y correo juntos; 50 por hora por correo; 30 por minuto y 200 por hora por IP. Se gastan antes de comprobar la clave y se devuelven si era esa: si solo frenaran las equivocadas, con el balde vacío la buena entraría y la mala no, y se podría seguir probando. Los de por correo y por IP los agota cualquiera (quien sabe el correo, desde otras IP; un estudiante, desde la de la escuela), así que no frenan a una IP desde la que esa cuenta entró bien en los últimos 30 días: ahí solo cuenta el de IP y correo (B11). Esas entradas buenas se recuerdan en memoria, por su huella, y se olvidan al reiniciar. Lo que queda: desde la misma IP, quien prueba claves de una maestra sí la frena (10 por hora), y una cuenta que nunca entró desde esa IP espera mientras dure el ataque. Entrar bien: 30 por hora por cuenta (cada una cuesta un Argon2 y una sesión); solo las gastan las buenas, así que con claves equivocadas nadie deja sin entrar a la titular, y si no queda ninguna se rechaza antes del Argon2. Entrar, todas: 600 por hora por IP. Pedir cuenta: 60 por hora por IP. Recuperar: 20 por hora por IP. Usar un enlace: 60 por hora por IP. Cambiar la clave: 5 fallidos cada 15 min y 5 en total por hora, por cuenta. A un mismo correo, 3 correos de cuenta y 3 de recuperación por hora (los demás no se mandan, sin avisar). Al pasarse: 429 con `Retry-After` |
| Cabeceras | HSTS, `nosniff`, `frame-ancestors 'none'`, `Referrer-Policy: same-origin`, sin `Server` ni versión |
| Errores | Nunca devuelven trazas, SQL ni si un correo existe; todo con un `codigo` estable y el id del pedido |
| Por defecto | Todo endpoint pide sesión salvo los que se abren a propósito (estado, salud, registro, entrar, recuperar, verificar); `/error` solo para el despacho interno de errores |
| Errores tempranos | Lo que el firewall o el servidor rechazan antes de un controlador (`;`, `//`, `%2e`) sale por `ControladorDeErrores` con el sobre, el id y las cabeceras. Tomcat todavía puede responder en HTML a cosas rotas antes del servlet (una cabecera de más de 8 KB): no lleva datos |
| Tamaño | Cuerpo de 64 KB como máximo (`LimiteDeCuerpoFiltro`, filtro del servlet justo después del id de pedido, antes que cualquiera que lea el cuerpo): 413 `DEMASIADO_GRANDE`, también si llega por partes sin decir su tamaño. Lo que llega por partes a una ruta que no lee el cuerpo (`DELETE /sesion`) Tomcat lo descarta sin guardarlo y, pasados 64 KB, corta la conexión (`server.tomcat.max-swallow-size`); los formularios que arma él mismo tienen el mismo tope. El filtro de formularios de Spring está apagado: el API es solo JSON |
| IP real | B19: `app.cabecera-ip: do-connecting-ip` en producción, según la [documentación de DigitalOcean](https://docs.digitalocean.com/support/where-can-i-find-the-client-ip-address-of-a-request-connecting-to-my-app/). **Bloquea la salida a producción:** comprobar que un `do-connecting-ip` mandado por el cliente se reemplaza (la documentación no lo dice). Si no, todos los límites por IP se pueden saltar: quedan los por correo y por cuenta, el tope de Argon2 y el de correos por hora |

## 5. API

- Prefijo `/api/v1`, JSON, nombres en español (`/api/v1/grupos/{id}/estudiantes`).
- Listas con `?pagina=&tamano=` (máximo 100) y `meta: { total, pagina, tamano }`.
- Validación con Bean Validation en los DTO; los errores de campo vuelven en `error.campos`.
- OpenAPI generado en `/api/v1/docs` solo fuera de producción.

**Identidad** (públicas salvo las marcadas 🔒):

| Ruta | Qué hace |
|---|---|
| `POST /api/v1/cuentas` | Pedir una cuenta `{correo}` → 202 siempre (B18, B20) |
| `POST /api/v1/cuentas/confirmar` | `{token, nombre, clave}` del enlace → 201 (sin sesión: después se entra con `POST /sesion`); o 400 `ENLACE_INVALIDO`, `CLAVE_DEBIL` o `VALIDACION` (el enlace sigue sirviendo) |
| `POST /api/v1/sesion` | Entrar `{correo, clave}` → 200 con «yo» y la cookie, o 401 `CREDENCIALES_INVALIDAS` |
| `DELETE /api/v1/sesion` | Salir (sin sesión también responde 200 y borra la cookie) |
| `DELETE /api/v1/sesiones` 🔒 | Salir de todos lados |
| `GET /api/v1/yo` 🔒 | `{id, correo, nombre}` |
| `PUT /api/v1/yo/clave` 🔒 | `{actual, nueva}` → cambia el token de esta sesión y cierra las demás; 400 `CLAVE_INCORRECTA` o `CLAVE_DEBIL` |
| `POST /api/v1/clave/recuperar` | `{correo}` → 202 siempre |
| `POST /api/v1/clave/nueva` | `{token, clave}` del enlace → 200, o 400 `ENLACE_INVALIDO` o `CLAVE_DEBIL` |

Los enlaces de los correos van al portal: `{sitio}/portal/confirmar#t={token}` y `{sitio}/portal/clave-nueva#t={token}`.
La página lee el token, lo manda por POST (ningún GET cambia nada) y lo borra de la barra de direcciones.

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
- Variables: `DB_URL`, `DB_USUARIO`, `DB_CLAVE`, `DB_MIGRACION_USUARIO`, `DB_MIGRACION_CLAVE`, `SITIO_URL`, `SMTP_USUARIO`
  (en Resend, la palabra `resend`), `SMTP_CLAVE` (la clave de API de Resend) y `CORREO_REMITENTE` (de un dominio verificado
  en Resend). En la compu, los correos los atrapa Mailpit (compose.yaml): se ven en <http://127.0.0.1:8025>. La conexión a la base va siempre con TLS: `DB_URL` termina en
  `?sslmode=require` (o `verify-full`) y sin eso no arranca (`BaseCifradaEnProduccion`). Va en la dirección y no en las
  propiedades del pool porque las migraciones abren su propia conexión con esa dirección y sin esas propiedades.
  **Pendiente al desplegar:** pasar a `verify-full` con el certificado de la base administrada (`require` cifra, pero no
  verifica que del otro lado esté nuestra base).
- **Dos roles en la base:** `aprendo_migracion` es dueño de las tablas y corre Flyway; `aprendo_app` es con el que se
  conecta la aplicación, sin DDL, y en `auditoria` solo `SELECT, INSERT`. Así ni una inyección SQL ni una credencial
  robada de la app pueden apagar los disparadores de la auditoría. En dos momentos: **antes de la primera migración**
  se crean los roles y `ALTER DEFAULT PRIVILEGES FOR ROLE aprendo_migracion IN SCHEMA public GRANT SELECT, INSERT,
  UPDATE, DELETE ON TABLES TO aprendo_app` (identidad borra sesiones y enlaces viejos); **después de la primera
  migración**, cuando `public.auditoria` ya existe, `REVOKE UPDATE, DELETE ON public.auditoria FROM aprendo_app` (antes
  falla: la tabla todavía no está). Y una prueba que, conectada como `aprendo_app`, verifique que identidad funciona y que
  `ALTER TABLE … DISABLE TRIGGER` falla.
- **Antes de abrir al público (además de los dos roles):** comprobar `do-connecting-ip` (sección 4, «IP real»); mandar
  un correo de verdad desde una instancia desplegada (que App Platform deje salir por el 2465); y una alerta en los logs
  para «No se pudo mandar», «Se llegó al tope de» y «Cola … llena», que hoy solo quedan escritos.
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
