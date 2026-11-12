package cr.aprendoalotico.api.comun.limites;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import cr.aprendoalotico.api.comun.web.DemasiadosIntentos;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.EstimationProbe;
import io.github.bucket4j.TimeMeter;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

/**
 * Un límite de intentos por clave (una IP, un correo, una cuenta), en memoria (DISENO.md, B11). Cada clave tiene su
 * balde de Bucket4j con uno o más tramos («5 por minuto y 10 por hora»). Los baldes viven en un Caffeine con tope y
 * se guardan por un hash de 64 bits de la clave, no por la clave: inventando correos larguísimos nadie hace crecer
 * la memoria (dos claves con el mismo hash compartirían balde: con 64 bits, no pasa). Uno que nadie usa se olvida solo.
 *
 * <p>Con más de una instancia del API, cada una cuenta por su lado: el límite real se multiplica por la cantidad de
 * instancias. Para el piloto hay una sola.
 */
public final class Limite {

    /** Cuántas claves recuerda como mucho cada límite (las menos usadas se olvidan primero): unos pocos MB. */
    static final int CLAVES_MAXIMAS = 20_000;

    private final List<Bandwidth> tramos;
    private final TimeMeter medidor;
    private final Cache<Long, Bucket> baldes;

    private Limite(List<Bandwidth> tramos, Duration olvido, Clock reloj) {
        this.tramos = tramos;
        this.medidor = medidorDe(reloj);
        this.baldes = Caffeine.newBuilder().maximumSize(CLAVES_MAXIMAS).expireAfterAccess(olvido).build();
    }

    /** «veces» intentos cada «periodo»; se recuperan de a poco, no todos juntos al final del periodo. */
    public record Tramo(long veces, Duration periodo) {

        public Tramo {
            if (veces < 1 || periodo == null || periodo.isNegative() || periodo.isZero()) {
                throw new IllegalArgumentException("Un tramo necesita al menos un intento y un periodo");
            }
        }
    }

    public static Limite de(Clock reloj, Tramo... tramos) {
        if (tramos.length == 0) {
            throw new IllegalArgumentException("Un límite necesita al menos un tramo");
        }
        List<Bandwidth> anchos = Arrays.stream(tramos)
                .map(t -> Bandwidth.builder().capacity(t.veces()).refillGreedy(t.veces(), t.periodo()).build())
                .toList();
        Duration olvido = Arrays.stream(tramos).map(Tramo::periodo).max(Comparator.naturalOrder()).orElseThrow();
        return new Limite(anchos, olvido, reloj);
    }

    /** Gasta un intento. Si no queda, DemasiadosIntentos (429) con lo que falta esperar. */
    public Ficha gastar(String clave) {
        Bucket balde = balde(clave);
        ConsumptionProbe prueba = balde.tryConsumeAndReturnRemaining(1);
        if (!prueba.isConsumed()) {
            throw new DemasiadosIntentos(Duration.ofNanos(prueba.getNanosToWaitForRefill()));
        }
        return () -> balde.addTokens(1);
    }

    /**
     * Que quede al menos un intento, sin gastarlo: para lo que se gasta después, solo si sale bien. Si no queda,
     * DemasiadosIntentos (429).
     */
    public void exigirQueQuede(String clave) {
        EstimationProbe prueba = balde(clave).estimateAbilityToConsume(1);
        if (!prueba.canBeConsumed()) {
            throw new DemasiadosIntentos(Duration.ofNanos(prueba.getNanosToWaitForRefill()));
        }
    }

    /** Un intento en un límite, para gastar en varios a la vez. */
    public record Gasto(Limite limite, String clave) {
    }

    /**
     * Gasta en todos o en ninguno: si alguno no deja, devuelve lo que ya se había gastado en los otros y lanza su
     * DemasiadosIntentos. La ficha que devuelve los devuelve todos.
     */
    public static Ficha gastarEnTodos(Gasto... gastos) {
        List<Ficha> gastadas = new ArrayList<>();
        try {
            for (Gasto g : gastos) {
                gastadas.add(g.limite().gastar(g.clave()));
            }
        } catch (DemasiadosIntentos e) {
            gastadas.forEach(Ficha::devolver);
            throw e;
        }
        return () -> gastadas.forEach(Ficha::devolver);
    }

    /** Gasta un intento si queda; si no, devuelve false sin lanzar nada (para lo que se deja de hacer en silencio). */
    public boolean intentar(String clave) {
        return balde(clave).tryConsume(1);
    }

    private Bucket balde(String clave) {
        return baldes.get(huella(clave), k -> {
            var armado = Bucket.builder().withCustomTimePrecision(medidor);
            tramos.forEach(armado::addLimit);
            return armado.build();
        });
    }

    /** 64 bits del SHA-256 de la clave: tamaño fijo, sea cual sea la clave. */
    static long huella(String clave) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256").digest(clave.getBytes(StandardCharsets.UTF_8));
            return ByteBuffer.wrap(hash).getLong();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Esta JVM no tiene SHA-256", e);
        }
    }

    /** Un intento gastado, que se puede devolver (por ejemplo, si al final la clave era la correcta). */
    @FunctionalInterface
    public interface Ficha {

        void devolver();
    }

    /** El reloj de la aplicación para Bucket4j: en las pruebas se adelanta a mano. */
    private static TimeMeter medidorDe(Clock reloj) {
        return new TimeMeter() {
            @Override
            public long currentTimeNanos() {
                Instant ahora = reloj.instant();
                return ahora.getEpochSecond() * 1_000_000_000L + ahora.getNano();
            }

            @Override
            public boolean isWallClockBased() {
                return true;
            }
        };
    }
}
