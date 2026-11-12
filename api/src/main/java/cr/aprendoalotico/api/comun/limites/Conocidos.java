package cr.aprendoalotico.api.comun.limites;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;

/**
 * Lo que salió bien hace poco (por ejemplo, «desde esta IP entró esta cuenta»), para no frenarlo con los límites que
 * comparte con otros. En memoria, como los límites: por la huella de 64 bits de la clave, con tope, y cada una se olvida
 * a los «vigencia» de anotada (y al reiniciar el API).
 */
public final class Conocidos {

    private final Cache<Long, Boolean> vistos;

    private Conocidos(Duration vigencia, Clock reloj) {
        this.vistos = Caffeine.newBuilder().maximumSize(Limite.CLAVES_MAXIMAS).expireAfterWrite(vigencia)
                .ticker(() -> nanos(reloj.instant())).build();
    }

    public static Conocidos de(Clock reloj, Duration vigencia) {
        if (vigencia == null || vigencia.isNegative() || vigencia.isZero()) {
            throw new IllegalArgumentException("Hace falta cuánto tiempo se recuerda");
        }
        return new Conocidos(vigencia, reloj);
    }

    public void anotar(String clave) {
        vistos.put(Limite.huella(clave), Boolean.TRUE);
    }

    public boolean conoce(String clave) {
        return vistos.getIfPresent(Limite.huella(clave)) != null;
    }

    private static long nanos(Instant ahora) {
        return ahora.getEpochSecond() * 1_000_000_000L + ahora.getNano();
    }
}
