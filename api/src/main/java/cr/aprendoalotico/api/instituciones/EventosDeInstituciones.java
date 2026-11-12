package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.auditoria.api.Auditoria;
import cr.aprendoalotico.api.auditoria.api.EventoAuditoria;
import cr.aprendoalotico.api.auditoria.api.TipoDeActor;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Lo que instituciones deja en la auditoría: quién creó o cambió qué, quién dio o usó un código y a quién sacaron. Solo
 * ids y roles. Los datos de una institución se auditan después, sin frenar la respuesta; los permisos, dentro de la
 * transacción ({@link #registrarODeshacer}).
 */
@Component
class EventosDeInstituciones {

    private final Auditoria auditoria;

    EventosDeInstituciones(Auditoria auditoria) {
        this.auditoria = auditoria;
    }

    void registrar(UsuarioActual yo, String accion, String recurso, UUID recursoId, UUID institucion, Map<String, Object> detalle) {
        auditoria.registrarSinFrenar(evento(yo, accion, recurso, recursoId, institucion, detalle));
    }

    /**
     * Para los cambios de quién puede qué (dar o usar un código, sacar a alguien): como último paso de la transacción. Si
     * la auditoría falla, la excepción revierte el cambio: no hay permisos que cambien sin quedar escritos.
     */
    void registrarODeshacer(UsuarioActual yo, String accion, String recurso, UUID recursoId, UUID institucion, Map<String, Object> detalle) {
        auditoria.registrar(evento(yo, accion, recurso, recursoId, institucion, detalle));
    }

    private static EventoAuditoria evento(UsuarioActual yo, String accion, String recurso, UUID recursoId, UUID institucion,
            Map<String, Object> detalle) {
        return new EventoAuditoria(TipoDeActor.USUARIO, yo.id(), accion, recurso, recursoId, institucion, detalle);
    }
}
