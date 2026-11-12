package cr.aprendoalotico.api.grupos;

import cr.aprendoalotico.api.comun.limites.Limite;
import cr.aprendoalotico.api.comun.limites.Limite.Tramo;
import java.time.Clock;
import java.time.Duration;
import org.springframework.stereotype.Component;

/** Los límites de grupos (DISENO.md, sección 4: «Intentos»): que nadie llene la base de grupos ni de códigos. */
@Component
class LimitesDeGrupos {

    /** Una escuela entera arma sus grupos en una tarde, y casi siempre lo hace una sola persona. */
    final Limite crearPorCuenta;
    final Limite codigosPorGrupo;

    LimitesDeGrupos(Clock reloj) {
        crearPorCuenta = Limite.de(reloj, new Tramo(60, Duration.ofHours(1)));
        codigosPorGrupo = Limite.de(reloj, new Tramo(10, Duration.ofHours(1)));
    }
}
