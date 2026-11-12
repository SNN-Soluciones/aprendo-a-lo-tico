package cr.aprendoalotico.api.auditoria.api;

import org.slf4j.LoggerFactory;

/**
 * Registro de quién vio o cambió qué (DISENO.md, B12). Todo módulo que toque datos de estudiantes lo usa.
 * Solo se agregan filas: la base no deja editarlas ni borrarlas.
 */
public interface Auditoria {

    void registrar(EventoAuditoria evento);

    /**
     * Para lo que ya pasó y no depende de quedar auditado (se creó una escuela, alguien aceptó un código): si la
     * auditoría falla, se avisa en el log y la respuesta sale igual. Para ver datos de estudiantes, {@link #registrar}.
     */
    default void registrarSinFrenar(EventoAuditoria evento) {
        try {
            registrar(evento);
        } catch (RuntimeException e) {
            LoggerFactory.getLogger(Auditoria.class).error("No se pudo auditar {} sobre {} {} ({})", evento.accion(), evento.recurso(),
                    evento.recursoId(), e.getClass().getName());
        }
    }
}
