package cr.aprendoalotico.api.estado;

import java.time.Instant;

/**
 * Cómo está el servicio: para el monitoreo y para que el portal sepa con qué versión habla.
 *
 * @param base "ok" si la base de datos responde, "sin conexión" si no
 */
public record Estado(String servicio, String version, Instant hora, String base) {

    public static final String BASE_OK = "ok";

    public boolean baseResponde() {
        return BASE_OK.equals(base);
    }
}
