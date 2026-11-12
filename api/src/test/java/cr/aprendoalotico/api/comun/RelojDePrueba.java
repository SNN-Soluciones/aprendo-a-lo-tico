package cr.aprendoalotico.api.comun;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.concurrent.atomic.AtomicReference;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

/**
 * En las pruebas de integración, el reloj de la aplicación anda como el de verdad, pero se puede detener: con el reloj
 * quieto, un límite no se recupera a media prueba por lo que tarde cada Argon2 en la máquina que corre las pruebas.
 */
@TestConfiguration(proxyBeanMethods = false)
public class RelojDePrueba {

    @Bean
    @Primary
    Detenible relojDetenible() {
        return new Detenible();
    }

    /** UTC, como el de producción. Quien lo detiene lo vuelve a soltar al terminar (en un finally). */
    public static final class Detenible extends Clock {

        private final AtomicReference<Instant> detenido = new AtomicReference<>();

        public void detener() {
            detenido.set(Instant.now());
        }

        public void soltar() {
            detenido.set(null);
        }

        @Override
        public Instant instant() {
            Instant quieto = detenido.get();
            return quieto != null ? quieto : Instant.now();
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zona) {
            throw new UnsupportedOperationException("La aplicación usa el reloj en UTC");
        }
    }
}
