package cr.aprendoalotico.api.comun.limites;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Duration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ConocidosTest {

    private final LimiteTest.Reloj reloj = new LimiteTest.Reloj();

    @Test
    @DisplayName("Recuerda lo anotado, cada clave por su lado, y lo olvida al vencer")
    void recuerdaYOlvida() {
        var conocidos = Conocidos.de(reloj, Duration.ofDays(30));
        conocidos.anotar("10.0.0.1|maria@escuela.cr");

        assertThat(conocidos.conoce("10.0.0.1|maria@escuela.cr")).isTrue();
        assertThat(conocidos.conoce("10.0.0.2|maria@escuela.cr")).isFalse();
        reloj.adelantar(Duration.ofDays(29));
        assertThat(conocidos.conoce("10.0.0.1|maria@escuela.cr")).isTrue();
        reloj.adelantar(Duration.ofDays(2));
        assertThat(conocidos.conoce("10.0.0.1|maria@escuela.cr")).isFalse();
    }

    @Test
    @DisplayName("Sin cuánto recordar no se puede armar")
    void malArmado() {
        assertThatThrownBy(() -> Conocidos.de(reloj, Duration.ZERO)).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> Conocidos.de(reloj, null)).isInstanceOf(IllegalArgumentException.class);
    }
}
