package cr.aprendoalotico.api.identidad;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

/** El driver de PostgreSQL no sabe pasar un Instant: en la frontera con la base va como OffsetDateTime en UTC. */
final class Fechas {

    private Fechas() {
    }

    static OffsetDateTime utc(Instant instante) {
        return instante.atOffset(ZoneOffset.UTC);
    }
}
