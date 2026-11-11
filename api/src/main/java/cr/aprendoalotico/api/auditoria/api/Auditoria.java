package cr.aprendoalotico.api.auditoria.api;

/**
 * Registro de quién vio o cambió qué (DISENO.md, B12). Todo módulo que toque datos de estudiantes lo usa.
 * Solo se agregan filas: la base no deja editarlas ni borrarlas.
 */
public interface Auditoria {

    void registrar(EventoAuditoria evento);
}
