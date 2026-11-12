package cr.aprendoalotico.api.grupos;

import cr.aprendoalotico.api.auditoria.api.Auditoria;
import cr.aprendoalotico.api.auditoria.api.EventoAuditoria;
import cr.aprendoalotico.api.auditoria.api.TipoDeActor;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Component;

/** Lo que grupos deja en la auditoría (quién creó o cambió un grupo, sus docentes, su código). Solo ids. */
@Component
class EventosDeGrupos {

    private final Auditoria auditoria;

    EventosDeGrupos(Auditoria auditoria) {
        this.auditoria = auditoria;
    }

    void registrar(UsuarioActual yo, String accion, String recurso, UUID recursoId, UUID institucion, Map<String, Object> detalle) {
        auditoria.registrarSinFrenar(evento(yo, accion, recurso, recursoId, institucion, detalle));
    }

    /** Para quién da clases en un grupo (quién va a ver a sus estudiantes): dentro de la transacción; si falla, se deshace. */
    void registrarODeshacer(UsuarioActual yo, String accion, String recurso, UUID recursoId, UUID institucion, Map<String, Object> detalle) {
        auditoria.registrar(evento(yo, accion, recurso, recursoId, institucion, detalle));
    }

    private static EventoAuditoria evento(UsuarioActual yo, String accion, String recurso, UUID recursoId, UUID institucion,
            Map<String, Object> detalle) {
        return new EventoAuditoria(TipoDeActor.USUARIO, yo.id(), accion, recurso, recursoId, institucion, detalle);
    }
}
