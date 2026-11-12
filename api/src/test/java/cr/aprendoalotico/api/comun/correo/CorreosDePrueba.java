package cr.aprendoalotico.api.comun.correo;

import cr.aprendoalotico.api.comun.limites.Limite;
import java.time.Clock;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

/**
 * En las pruebas de integración los correos no salen: van a un buzón en memoria, y en el mismo hilo (después de la
 * transacción, como en producción). Así, cuando MockMvc responde, el correo ya está en el buzón: sin esperas a ciegas.
 */
@TestConfiguration(proxyBeanMethods = false)
public class CorreosDePrueba {

    /** Primario: así ni la cola de verdad (la que arma ConfiguracionCorreo) llega a usar el SMTP. */
    @Bean
    @Primary
    Buzon buzon() {
        return new Buzon();
    }

    @Bean
    @Primary
    Correos correosEnElMismoHilo(Buzon buzon) {
        return new Correos(buzon, Runnable::run, Duration.ZERO, 1,
                Limite.de(Clock.systemUTC(), new Limite.Tramo(1_000_000, Duration.ofHours(1))));
    }

    /** Los correos «mandados». */
    public static class Buzon implements Cartero {

        private static final Pattern TOKEN = Pattern.compile("#t=([A-Za-z0-9_-]{43})");
        private final List<Mensaje> llegados = new ArrayList<>();

        @Override
        public synchronized void enviar(Mensaje mensaje) {
            llegados.add(mensaje);
        }

        public synchronized List<Mensaje> para(String direccion) {
            return llegados.stream().filter(m -> m.para().equals(direccion)).toList();
        }

        public Optional<Mensaje> ultimoPara(String direccion) {
            List<Mensaje> suyos = para(direccion);
            return suyos.isEmpty() ? Optional.empty() : Optional.of(suyos.getLast());
        }

        /** El token del enlace del último correo a esa dirección. */
        public String tokenPara(String direccion) {
            Mensaje m = ultimoPara(direccion).orElseThrow(() -> new AssertionError("No le llegó ningún correo"));
            Matcher t = TOKEN.matcher(m.texto());
            if (!t.find()) {
                throw new AssertionError("El correo «" + m.asunto() + "» no trae enlace");
            }
            return t.group(1);
        }
    }
}
