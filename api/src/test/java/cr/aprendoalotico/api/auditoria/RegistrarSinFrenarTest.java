package cr.aprendoalotico.api.auditoria;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

import cr.aprendoalotico.api.auditoria.api.Auditoria;
import cr.aprendoalotico.api.auditoria.api.EventoAuditoria;
import cr.aprendoalotico.api.auditoria.api.TipoDeActor;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class RegistrarSinFrenarTest {

    private final EventoAuditoria evento = new EventoAuditoria(TipoDeActor.USUARIO, UUID.randomUUID(), "CREAR", "GRUPO", UUID.randomUUID(), null, null);

    @Test
    @DisplayName("Si la auditoría responde, registra lo mismo que registrar")
    void registra() {
        List<EventoAuditoria> registrados = new ArrayList<>();
        Auditoria auditoria = registrados::add;
        auditoria.registrarSinFrenar(evento);
        assertThat(registrados).containsExactly(evento);
    }

    @Test
    @DisplayName("Si la auditoría falla, lo ya hecho no se frena: se avisa en el log y sigue")
    void noFrena() {
        Auditoria caida = e -> {
            throw new IllegalStateException("la base no responde");
        };
        assertThatCode(() -> caida.registrarSinFrenar(evento)).doesNotThrowAnyException();
    }
}
