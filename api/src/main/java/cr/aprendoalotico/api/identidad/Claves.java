package cr.aprendoalotico.api.identidad;

import cr.aprendoalotico.api.comun.web.ErrorDeNegocio;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.time.Duration;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Las claves (DISENO.md, B6): Argon2id con los parámetros mínimos de OWASP (19 MiB, 2 pasadas, 1 hilo), guardadas
 * como «{argon2}…» para poder cambiar de parámetros o de algoritmo sin romper las viejas.
 *
 * <ul>
 *   <li>Se normalizan (NFKC) antes del hash: la misma clave escrita en otro teclado («ñ» compuesta o no) es la misma.</li>
 *   <li>Como mucho {@value #A_LA_VEZ} cálculos a la vez: cada uno usa 19 MiB, y con hilos virtuales cien «entrar»
 *       juntos se comerían la memoria. Si no hay turno en 2 s, 503.</li>
 *   <li>Una clave nueva no puede ser de las más usadas (claves-comunes.txt), ni el correo, ni un solo carácter
 *       repetido: es lo que recomiendan NIST y OWASP en lugar de exigir mayúsculas y símbolos.</li>
 *   <li>Si el correo no tiene cuenta igual se calcula un hash ({@link #gastarTiempo}): responder más rápido diría
 *       qué correos tienen cuenta.</li>
 * </ul>
 */
@Component
public class Claves {

    public static final int MINIMO = 10;
    public static final int MAXIMO = 128;
    static final int A_LA_VEZ = 4;

    private static final Set<String> COMUNES = leerComunes();

    private final PasswordEncoder codificador;
    private final Semaphore turnos;
    private final Duration esperaPorTurno;
    private final String deRelleno;

    public Claves() {
        this(new Semaphore(A_LA_VEZ, true), Duration.ofSeconds(2));
    }

    Claves(Semaphore turnos, Duration esperaPorTurno) {
        var argon2 = new Argon2PasswordEncoder(16, 32, 1, 19 * 1024, 2);
        this.codificador = new DelegatingPasswordEncoder("argon2", Map.of("argon2", argon2));
        this.turnos = turnos;
        this.esperaPorTurno = esperaPorTurno;
        this.deRelleno = codificador.encode("una clave que nadie tiene");
    }

    /**
     * Revisa que una clave nueva no sea fácil de adivinar. El largo (10 a 128) ya lo revisó la validación del formulario.
     *
     * @throws ErrorDeNegocio 400 CLAVE_DEBIL
     */
    void exigirQueNoSeaDebil(String clave, String correo) {
        String simple = normalizar(clave).toLowerCase(Locale.ROOT).replaceAll("\\s+", "");
        String usuario = correo.substring(0, Math.max(0, correo.indexOf('@')));
        boolean debil = COMUNES.contains(simple)
                || simple.chars().distinct().count() <= 2
                || simple.equals(correo)
                || (usuario.length() >= 4 && simple.contains(usuario));
        if (debil) {
            throw new ErrorDeNegocio(HttpStatus.BAD_REQUEST, "CLAVE_DEBIL",
                    "Esa clave es muy fácil de adivinar. Probá con una frase de tres o cuatro palabras que solo vos sepás.");
        }
    }

    private static Set<String> leerComunes() {
        try (var lector = new BufferedReader(new InputStreamReader(
                Claves.class.getResourceAsStream("/identidad/claves-comunes.txt"), StandardCharsets.UTF_8))) {
            return lector.lines().map(String::strip).filter(l -> !l.isEmpty() && !l.startsWith("#"))
                    .map(l -> normalizar(l).toLowerCase(Locale.ROOT)).collect(Collectors.toUnmodifiableSet());
        } catch (IOException e) {
            throw new UncheckedIOException("No se pudo leer la lista de claves comunes", e);
        }
    }

    /** El hash para guardar. */
    String hash(String clave) {
        return conTurno(() -> codificador.encode(normalizar(clave)));
    }

    /** ¿La clave es la de ese hash? */
    boolean coincide(String clave, String hash) {
        return conTurno(() -> codificador.matches(normalizar(clave), hash));
    }

    /** Tarda lo mismo que {@link #coincide} y siempre dice que no: para los correos sin cuenta. */
    boolean gastarTiempo(String clave) {
        conTurno(() -> codificador.matches(normalizar(clave), deRelleno));
        return false;
    }

    /** ¿Conviene volver a calcular el hash (se guardó con otros parámetros)? */
    boolean conviene(String hash) {
        return codificador.upgradeEncoding(hash);
    }

    static String normalizar(String clave) {
        return Normalizer.normalize(clave, Normalizer.Form.NFKC);
    }

    private <T> T conTurno(Supplier<T> calculo) {
        boolean conTurno;
        try {
            conTurno = turnos.tryAcquire(esperaPorTurno.toMillis(), TimeUnit.MILLISECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            conTurno = false;
        }
        if (!conTurno) {
            throw new ErrorDeNegocio(HttpStatus.SERVICE_UNAVAILABLE, "OCUPADO", "Hay mucha gente entrando a la vez. Probá en un momento.");
        }
        try {
            return calculo.get();
        } finally {
            turnos.release();
        }
    }
}
