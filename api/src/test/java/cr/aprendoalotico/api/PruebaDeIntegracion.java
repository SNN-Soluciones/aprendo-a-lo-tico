package cr.aprendoalotico.api;

import cr.aprendoalotico.api.comun.RelojDePrueba;
import cr.aprendoalotico.api.comun.correo.CorreosDePrueba;
import cr.aprendoalotico.api.comun.tareas.TareasDePrueba;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.postgresql.PostgreSQLContainer;

/**
 * Base de las pruebas de integración: la aplicación completa contra un PostgreSQL de verdad (Testcontainers),
 * el mismo motor y versión que en producción. El contenedor se comparte entre todas las clases de prueba, y los
 * correos van a un buzón en memoria (CorreosDePrueba), lo de segundo plano corre en el mismo hilo (TareasDePrueba) y
 * el reloj se puede detener (RelojDePrueba). Todas usan la misma configuración: así Spring arma el contexto una sola
 * vez para todas.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import({ PruebaDeIntegracion.Contenedores.class, CorreosDePrueba.class, TareasDePrueba.class, RelojDePrueba.class })
public abstract class PruebaDeIntegracion {

    @TestConfiguration(proxyBeanMethods = false)
    static class Contenedores {

        @Bean
        @ServiceConnection
        PostgreSQLContainer postgres() {
            return new PostgreSQLContainer("postgres:16-alpine");
        }
    }
}
