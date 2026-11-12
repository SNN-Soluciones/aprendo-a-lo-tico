package cr.aprendoalotico.api.identidad;

import cr.aprendoalotico.api.auditoria.api.Auditoria;
import cr.aprendoalotico.api.auditoria.api.EventoAuditoria;
import cr.aprendoalotico.api.auditoria.api.TipoDeActor;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Lo que identidad deja en la auditoría: quién entró, salió o cambió su clave, y los intentos fallidos contra una
 * cuenta. Solo ids: ni correos ni claves (la auditoría no se borra).
 *
 * <p>Se registra después de que lo auditado ya pasó (la clave ya cambió, la sesión ya se abrió): si la auditoría falla
 * en ese momento, se avisa en el log y la persona recibe su respuesta igual. Echarle un 500 a alguien cuya clave ya
 * cambió lo dejaría afuera sin la cookie nueva. (Para datos de estudiantes la regla es la contraria: sin auditoría,
 * no se muestran.)
 */
@Component
class EventosDeIdentidad {

    private static final Logger LOG = LoggerFactory.getLogger(EventosDeIdentidad.class);

    private final Auditoria auditoria;

    EventosDeIdentidad(Auditoria auditoria) {
        this.auditoria = auditoria;
    }

    void deLaPersona(UUID usuario, String accion, String recurso, UUID recursoId) {
        registrar(new EventoAuditoria(TipoDeActor.USUARIO, usuario, accion, recurso, recursoId, null, null));
    }

    /** Algo que le pasó a una cuenta sin que la persona lo hiciera (alguien probó su clave, pidió recuperarla). */
    void sobreLaCuenta(UUID usuario, String accion) {
        registrar(new EventoAuditoria(TipoDeActor.SISTEMA, null, accion, "USUARIO", usuario, null, null));
    }

    private void registrar(EventoAuditoria evento) {
        try {
            auditoria.registrar(evento);
        } catch (RuntimeException e) {
            LOG.error("No se pudo auditar {} sobre {} {} ({})", evento.accion(), evento.recurso(), evento.recursoId(), e.getClass().getName());
        }
    }
}
