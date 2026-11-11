package cr.aprendoalotico.api.auditoria;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import cr.aprendoalotico.api.PruebaDeIntegracion;
import cr.aprendoalotico.api.auditoria.api.Auditoria;
import cr.aprendoalotico.api.auditoria.api.EventoAuditoria;
import cr.aprendoalotico.api.auditoria.api.TipoDeActor;
import cr.aprendoalotico.api.comun.web.IdDePedido;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

class AuditoriaIT extends PruebaDeIntegracion {

    @Autowired
    Auditoria auditoria;

    @Autowired
    JdbcClient jdbc;

    @AfterEach
    void limpiar() {
        MDC.clear();
    }

    @Test
    @DisplayName("Registra quién hizo qué sobre qué, con el detalle y el id del pedido")
    void registraUnEvento() {
        // Arrange
        var maestra = UUID.randomUUID();
        var estudiante = UUID.randomUUID();
        var escuela = UUID.randomUUID();
        MDC.put(IdDePedido.CLAVE_MDC, "pedido-auditoria");
        // Act
        auditoria.registrar(new EventoAuditoria(TipoDeActor.USUARIO, maestra, "VER", "ESTUDIANTE", estudiante, escuela,
                Map.of("desde", "portal", "grado", 2)));
        // Assert
        var fila = jdbc.sql("""
                select actor_tipo, actor_id, accion, recurso, recurso_id, institucion_id, pedido,
                       detalle ->> 'desde' as desde, (detalle ->> 'grado')::int as grado
                from public.auditoria where recurso_id = :id""")
                .param("id", estudiante)
                .query()
                .singleRow();
        assertThat(fila).containsEntry("actor_tipo", "USUARIO").containsEntry("actor_id", maestra)
                .containsEntry("accion", "VER").containsEntry("recurso", "ESTUDIANTE")
                .containsEntry("institucion_id", escuela).containsEntry("pedido", "pedido-auditoria")
                .containsEntry("desde", "portal").containsEntry("grado", 2);
    }

    @Test
    @DisplayName("Un evento del sistema puede ir sin actor, sin institución y sin detalle")
    void eventoDelSistemaMinimo() {
        var recurso = UUID.randomUUID();
        auditoria.registrar(new EventoAuditoria(TipoDeActor.SISTEMA, null, "LIMPIAR", "SESIONES", recurso, null, null));
        var detalle = jdbc.sql("select detalle::text from public.auditoria where recurso_id = :id").param("id", recurso)
                .query(String.class).single();
        assertThat(detalle).isEqualTo("{}");
    }

    @Test
    @DisplayName("Un evento sin acción o sin recurso no se puede armar")
    void eventoIncompleto() {
        assertThatThrownBy(() -> new EventoAuditoria(TipoDeActor.USUARIO, UUID.randomUUID(), " ", "ESTUDIANTE", null, null, null))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new EventoAuditoria(null, null, "VER", "ESTUDIANTE", null, null, null))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("La base no deja editar, borrar ni vaciar la auditoría: solo se agregan filas")
    void soloSeAgrega() {
        var recurso = UUID.randomUUID();
        auditoria.registrar(new EventoAuditoria(TipoDeActor.SISTEMA, null, "PRUEBA", "NADA", recurso, null, null));
        assertThatThrownBy(() -> jdbc.sql("update public.auditoria set accion = 'OTRA' where recurso_id = :id").param("id", recurso).update())
                .hasMessageContaining("solo se agregan filas");
        assertThatThrownBy(() -> jdbc.sql("delete from public.auditoria where recurso_id = :id").param("id", recurso).update())
                .hasMessageContaining("solo se agregan filas");
        assertThatThrownBy(() -> jdbc.sql("truncate public.auditoria").update()).hasMessageContaining("solo se agregan filas");
    }

    @Test
    @DisplayName("Se puede auditar desde un servicio de solo lectura (ver un estudiante es justamente lo que hay que registrar)")
    void desdeUnaTransaccionDeSoloLectura() {
        // Arrange
        var plantilla = new TransactionTemplate(transacciones);
        plantilla.setReadOnly(true);
        var estudiante = UUID.randomUUID();
        // Act
        plantilla.executeWithoutResult(t -> auditoria.registrar(
                new EventoAuditoria(TipoDeActor.USUARIO, UUID.randomUUID(), "VER", "ESTUDIANTE", estudiante, null, null)));
        // Assert
        assertThat(filasDe(estudiante)).isEqualTo(1);
    }

    @Test
    @DisplayName("Lo auditado queda aunque la operación se eche para atrás (un intento denegado es lo que más importa)")
    void sobreviveAlRollback() {
        // Arrange
        var estudiante = UUID.randomUUID();
        // Act
        new TransactionTemplate(transacciones).executeWithoutResult(t -> {
            auditoria.registrar(new EventoAuditoria(TipoDeActor.USUARIO, UUID.randomUUID(), "VER_DENEGADO", "ESTUDIANTE", estudiante, null, null));
            t.setRollbackOnly();
        });
        // Assert
        assertThat(filasDe(estudiante)).isEqualTo(1);
    }

    @Test
    @DisplayName("El detalle conserva valores vacíos y el orden en que se armó")
    void detalleConNulos() {
        var detalle = new java.util.LinkedHashMap<String, Object>();
        detalle.put("b", 1);
        detalle.put("a", null);
        var evento = new EventoAuditoria(TipoDeActor.SISTEMA, null, "PRUEBA", "NADA", null, null, detalle);
        assertThat(evento.detalle().keySet()).containsExactly("b", "a");
    }

    private int filasDe(UUID recurso) {
        return jdbc.sql("select count(*) from public.auditoria where recurso_id = :id").param("id", recurso).query(Integer.class).single();
    }

    @Autowired
    PlatformTransactionManager transacciones;
}
