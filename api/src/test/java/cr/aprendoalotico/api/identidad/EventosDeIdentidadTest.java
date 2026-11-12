package cr.aprendoalotico.api.identidad;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.dao.DataAccessResourceFailureException;

@ExtendWith(OutputCaptureExtension.class)
class EventosDeIdentidadTest {

    @Test
    @DisplayName("Si la auditoría falla después de que la clave ya cambió, se avisa en el log y la persona recibe su respuesta igual")
    void fallaSinTumbarElPedido(CapturedOutput salida) {
        var eventos = new EventosDeIdentidad(evento -> {
            throw new DataAccessResourceFailureException("sin base");
        });
        UUID cuenta = UUID.randomUUID();
        assertThatCode(() -> eventos.deLaPersona(cuenta, "CLAVE_CAMBIADA", "USUARIO", cuenta)).doesNotThrowAnyException();
        assertThatCode(() -> eventos.sobreLaCuenta(cuenta, "ENTRAR_FALLIDO")).doesNotThrowAnyException();
        assertThat(salida.getAll()).contains("No se pudo auditar CLAVE_CAMBIADA sobre USUARIO " + cuenta)
                .contains("No se pudo auditar ENTRAR_FALLIDO");
    }
}
