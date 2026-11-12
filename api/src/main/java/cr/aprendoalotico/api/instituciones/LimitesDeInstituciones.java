package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.comun.limites.Limite;
import cr.aprendoalotico.api.comun.limites.Limite.Tramo;
import java.time.Clock;
import java.time.Duration;
import org.springframework.stereotype.Component;

/**
 * Los límites de instituciones (DISENO.md, sección 4: «Intentos»). Adivinar un código de 60 bits no se puede igual;
 * estos frenan a quien llena la base de hogares o de invitaciones, o prueba códigos en bucle.
 */
@Component
class LimitesDeInstituciones {

    /** Usar un código, todos los intentos: una persona usa uno o dos en su vida. */
    final Limite aceptarPorCuenta;
    final Limite aceptarPorIp;
    final Limite hogaresPorCuenta;
    final Limite invitacionesPorInstitucion;
    /** Pendientes a la vez por institución: más que el personal de una escuela grande. */
    static final int PENDIENTES_MAXIMAS = 50;
    /** Hogares por cuenta: una familia tiene uno, a lo sumo unos pocos (casas separadas, abuelos). */
    static final int HOGARES_MAXIMOS = 10;

    LimitesDeInstituciones(Clock reloj) {
        aceptarPorCuenta = Limite.de(reloj, new Tramo(10, Duration.ofHours(1)));
        aceptarPorIp = Limite.de(reloj, new Tramo(30, Duration.ofHours(1)));
        hogaresPorCuenta = Limite.de(reloj, new Tramo(5, Duration.ofDays(1)));
        invitacionesPorInstitucion = Limite.de(reloj, new Tramo(30, Duration.ofHours(1)));
    }
}
