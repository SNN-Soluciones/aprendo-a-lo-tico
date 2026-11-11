# API · Aprendo a lo Tico

Backend de las cuentas de maestras y familias, escuelas, grupos, estudiantes y avance. Las decisiones están en
[DISENO.md](DISENO.md): leelo antes de cambiar algo de fondo.

Java 21 · Spring Boot 4.1 · PostgreSQL 16 · Flyway · Testcontainers · ArchUnit · JaCoCo.

## Correr en la compu

Necesita Java 21 y Docker abierto.

```bash
cd api
./gradlew bootRun    # perfil local: levanta PostgreSQL (compose.yaml, en un puerto libre) y el API en http://127.0.0.1:8081
```

Probalo con <http://127.0.0.1:8081/api/v1/estado>.

## Pruebas

```bash
./gradlew check      # todas las pruebas (con PostgreSQL de verdad), las reglas de arquitectura y la cobertura mínima
```

- **Integración** (`*IT`): la aplicación entera contra PostgreSQL 16 en Docker (`PruebaDeIntegracion`).
- **Arquitectura** (`ArquitecturaTest`): un módulo usa otro solo por su paquete `api`, sin ciclos, sin inyección por
  campo, los controladores no tocan la base.
- **Migraciones** (`MigracionesTest`): nombre `VYYYYMMDD_NN__descripcion.sql`, comentario de cabecera, y nunca borran
  ni renombran.
- **Cobertura:** mínimo 80 % de líneas y de ramas; por debajo, la build falla. El reporte queda en
  `build/reports/jacoco/test/html/index.html`.

La CI (`.github/workflows/api.yml`) corre `./gradlew check` en cada PR que toque `api/`.

## Agregar algo

- **Un módulo nuevo:** `cr.aprendoalotico.api.<modulo>`, con lo que otros pueden usar en `<modulo>.api` y los
  controladores en `<modulo>.web`.
- **Una tabla:** una migración nueva en `src/main/resources/db/migration/` (nunca se edita una ya publicada). Solo
  expandir: borrar o renombrar va en otra migración, después, cuando nada use lo viejo.
- **Un endpoint:** responde con `Respuesta.ok(...)`; los errores esperados se lanzan como `ErrorDeNegocio` con un
  código estable (y un mensaje que no revele si existe algo ajeno). Cada endpoint lleva su prueba de «sin sesión» y de
  «otra institución». **Ningún GET cambia nada.**
- **Abrir una ruta sin sesión o agregar un filtro:** un `@Component` del módulo que implemente
  `ContribucionDeSeguridad` (ver `estado/SeguridadEstado.java`). Nunca una segunda cadena de seguridad.
- **Datos de estudiantes:** todo acceso o cambio se registra con `Auditoria`.

## Producción

Imagen: `docker build -t aprendo-api .` (perfil `prod`). Variables obligatorias, sin valor por defecto:

| Variable | Qué es |
|---|---|
| `DB_URL` | `jdbc:postgresql://…?sslmode=require` de la base administrada: sin `sslmode=require` (o `verify-full`) no arranca |
| `DB_USUARIO`, `DB_CLAVE` | el rol de la aplicación (`aprendo_app`: lee y escribe datos, sin DDL) |
| `DB_MIGRACION_USUARIO`, `DB_MIGRACION_CLAVE` | el rol dueño de las tablas, con el que corre Flyway |
| `SITIO_URL` | origen público, por ejemplo `https://aprendoalotico.cr` (https, sin barra al final) |

La plataforma revisa la salud en `/actuator/health/liveness`; `/api/v1/estado` es para el monitoreo externo.

**Mergear es desplegar** cuando el API esté en App Platform: se pregunta antes, igual que en snn-core.
