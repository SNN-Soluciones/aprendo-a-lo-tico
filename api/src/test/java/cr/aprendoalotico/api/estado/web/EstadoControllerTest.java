package cr.aprendoalotico.api.estado.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import cr.aprendoalotico.api.estado.Estado;
import cr.aprendoalotico.api.estado.ServicioEstado;
import java.time.Instant;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class EstadoControllerTest {

    private final ServicioEstado servicio = mock(ServicioEstado.class);
    private final EstadoController controlador = new EstadoController(servicio);

    @Test
    @DisplayName("Con la base caída responde 503 con BASE_SIN_CONEXION, y aun así manda el estado")
    void baseCaidaEs503() {
        // Arrange
        var caido = new Estado("aprendo-a-lo-tico-api", "0.1.0", Instant.EPOCH, "sin conexión");
        when(servicio.estado()).thenReturn(caido);
        // Act
        var r = controlador.estado();
        // Assert
        assertThat(r.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
        assertThat(r.getBody().success()).isFalse();
        assertThat(r.getBody().data()).isEqualTo(caido);
        assertThat(r.getBody().error().codigo()).isEqualTo("BASE_SIN_CONEXION");
    }

    @Test
    @DisplayName("Con la base bien responde 200 y success")
    void todoBienEs200() {
        when(servicio.estado()).thenReturn(new Estado("aprendo-a-lo-tico-api", "0.1.0", Instant.EPOCH, Estado.BASE_OK));
        var r = controlador.estado();
        assertThat(r.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(r.getBody().success()).isTrue();
        assertThat(r.getBody().error()).isNull();
    }
}
