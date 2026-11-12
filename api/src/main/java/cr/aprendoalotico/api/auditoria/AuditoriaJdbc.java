package cr.aprendoalotico.api.auditoria;

import cr.aprendoalotico.api.auditoria.api.Auditoria;
import cr.aprendoalotico.api.auditoria.api.EventoAuditoria;
import cr.aprendoalotico.api.comun.web.IdDePedido;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.json.JsonMapper;

/**
 * La auditoría en public.auditoria, con SQL directo: es una tabla en la que solo se agrega.
 *
 * <p>Cada registro va en <b>su propia transacción</b> (REQUIRES_NEW): así se puede auditar desde un servicio de solo
 * lectura («VER estudiante»), y lo auditado queda aunque la operación se eche para atrás (un intento denegado es lo
 * que más le importa a una escuela). Cuesta una segunda conexión mientras dura el insert: el pool de Hikari se
 * dimensiona contando con eso.
 */
@Component
class AuditoriaJdbc implements Auditoria {

    private final JdbcClient jdbc;
    private final JsonMapper json;

    AuditoriaJdbc(JdbcClient jdbc, JsonMapper json) {
        this.jdbc = jdbc;
        this.json = json;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void registrar(EventoAuditoria e) {
        jdbc.sql("""
                insert into public.auditoria (actor_tipo, actor_id, accion, recurso, recurso_id, institucion_id, pedido, detalle)
                values (:tipo, :actor, :accion, :recurso, :recursoId, :institucionId, :pedido, cast(:detalle as jsonb))""")
                .param("tipo", e.tipo().name())
                .param("actor", e.actor())
                .param("accion", e.accion())
                .param("recurso", e.recurso())
                .param("recursoId", e.recursoId())
                .param("institucionId", e.institucionId())
                .param("pedido", IdDePedido.actual())
                .param("detalle", json.writeValueAsString(e.detalle()))
                .update();
    }
}
