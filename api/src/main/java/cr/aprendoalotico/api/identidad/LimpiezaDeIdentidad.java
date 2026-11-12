package cr.aprendoalotico.api.identidad;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Cada noche borra lo que ya no sirve: sesiones cerradas o vencidas hace más de 30 días, y registros pendientes y
 * enlaces de recuperación vencidos hace más de uno. Guardar menos es cuidar mejor (DISENO.md, sección 3). Con varias
 * instancias corre en cada una; da igual, borrar dos veces lo mismo no hace nada.
 */
@Component
class LimpiezaDeIdentidad {

    private static final Logger LOG = LoggerFactory.getLogger(LimpiezaDeIdentidad.class);
    static final Duration SESIONES_SE_GUARDAN = Duration.ofDays(30);
    static final Duration ENLACES_SE_GUARDAN = Duration.ofDays(1);

    private final Sesiones sesiones;
    private final RegistrosPendientes pendientes;
    private final Recuperaciones recuperaciones;
    private final Clock reloj;

    LimpiezaDeIdentidad(Sesiones sesiones, RegistrosPendientes pendientes, Recuperaciones recuperaciones, Clock reloj) {
        this.sesiones = sesiones;
        this.pendientes = pendientes;
        this.recuperaciones = recuperaciones;
        this.reloj = reloj;
    }

    @Scheduled(cron = "0 23 3 * * *", zone = "America/Costa_Rica")
    void limpiar() {
        Instant ahora = reloj.instant();
        int s = sesiones.borrarViejas(ahora.minus(SESIONES_SE_GUARDAN), ServicioSesiones.SIN_USO);
        int p = pendientes.borrarVencidos(ahora.minus(ENLACES_SE_GUARDAN));
        int r = recuperaciones.borrarViejas(ahora.minus(ENLACES_SE_GUARDAN));
        LOG.info("Limpieza de identidad: {} sesiones, {} registros pendientes y {} recuperaciones borradas", s, p, r);
    }
}
