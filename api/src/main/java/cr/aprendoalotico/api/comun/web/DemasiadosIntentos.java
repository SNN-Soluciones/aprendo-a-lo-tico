package cr.aprendoalotico.api.comun.web;

import java.time.Duration;
import org.springframework.http.HttpStatus;

/** Se pasó un límite de intentos (DISENO.md, B11): 429 con Retry-After, para que el cliente sepa cuánto esperar. */
public class DemasiadosIntentos extends ErrorDeNegocio {

    private final long segundos;

    public DemasiadosIntentos(Duration espera) {
        super(HttpStatus.TOO_MANY_REQUESTS, "DEMASIADOS_INTENTOS", mensaje(espera));
        this.segundos = Math.max(1, (espera.toMillis() + 999) / 1000);
    }

    /** Los segundos para la cabecera Retry-After (al menos 1). */
    public long segundos() {
        return segundos;
    }

    private static String mensaje(Duration espera) {
        long minutos = (espera.toSeconds() + 59) / 60;
        return minutos <= 1 ? "Demasiados intentos. Esperá un minuto y probá de nuevo."
                : "Demasiados intentos. Esperá " + minutos + " minutos y probá de nuevo.";
    }
}
