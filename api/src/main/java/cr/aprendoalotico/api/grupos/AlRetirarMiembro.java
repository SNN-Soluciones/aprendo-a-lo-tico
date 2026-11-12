package cr.aprendoalotico.api.grupos;

import cr.aprendoalotico.api.instituciones.api.MiembroRetirado;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/** A quien sacan de una institución se le saca de sus grupos ahí, en la misma transacción (B23). */
@Component
class AlRetirarMiembro {

    private final DocentesDeGrupo docentes;

    AlRetirarMiembro(DocentesDeGrupo docentes) {
        this.docentes = docentes;
    }

    @EventListener
    void sacarDeSusGrupos(MiembroRetirado retirado) {
        docentes.quitarDeInstitucion(retirado.usuario(), retirado.institucion());
    }
}
