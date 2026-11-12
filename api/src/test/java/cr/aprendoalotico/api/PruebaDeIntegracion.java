package cr.aprendoalotico.api;

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
 * el mismo motor y versión que en producción. El contenedor se comparte entre todas las clases de prueba.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(PruebaDeIntegracion.Contenedores.class)
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
