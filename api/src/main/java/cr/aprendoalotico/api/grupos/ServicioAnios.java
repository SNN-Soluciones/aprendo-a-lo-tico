package cr.aprendoalotico.api.grupos;

import cr.aprendoalotico.api.comun.web.ErrorDeNegocio;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import cr.aprendoalotico.api.instituciones.api.Acceso;
import cr.aprendoalotico.api.instituciones.api.Accesos;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/** Los años lectivos (B24): se crean solos con el primer grupo; quien administra les cambia las fechas. */
@Service
public class ServicioAnios {

    private final AniosLectivos anios;
    private final Accesos accesos;
    private final EventosDeGrupos eventos;
    private final TransactionTemplate transaccion;
    private final Clock reloj;

    ServicioAnios(AniosLectivos anios, Accesos accesos, EventosDeGrupos eventos, PlatformTransactionManager transacciones, Clock reloj) {
        this.anios = anios;
        this.accesos = accesos;
        this.eventos = eventos;
        this.transaccion = new TransactionTemplate(transacciones);
        this.reloj = reloj;
    }

    public List<AnioLectivo> de(UsuarioActual yo, UUID institucion) {
        accesos.de(yo.id(), institucion).orElseThrow(ServicioGrupos::institucionNoEncontrada);
        return anios.de(institucion);
    }

    /** Las fechas de un año (y lo crea si no existía): las dos dentro de ese año y la primera antes. */
    public AnioLectivo poner(UsuarioActual yo, UUID institucion, int anio, LocalDate desde, LocalDate hasta) {
        ServicioGrupos.exigirAnioCercano(anio, reloj);
        if (desde.getYear() != anio || hasta.getYear() != anio || !desde.isBefore(hasta)) {
            throw new ErrorDeNegocio(HttpStatus.BAD_REQUEST, "FECHAS_INVALIDAS",
                    "Las fechas tienen que ser de ese año, y la primera antes que la última.");
        }
        // Con la institución trabada: si a quien pide la sacan mientras tanto, no cambia nada
        transaccion.executeWithoutResult(estado -> {
            Acceso acceso = accesos.deTrabando(yo.id(), institucion).orElseThrow(ServicioGrupos::institucionNoEncontrada);
            if (!acceso.administra()) {
                throw ErrorDeNegocio.sinPermiso();
            }
            anios.poner(institucion, anio, desde, hasta);
        });
        eventos.registrar(yo, "CAMBIAR", "ANIO_LECTIVO", null, institucion, Map.of("anio", anio));
        return new AnioLectivo(anio, desde, hasta);
    }
}
