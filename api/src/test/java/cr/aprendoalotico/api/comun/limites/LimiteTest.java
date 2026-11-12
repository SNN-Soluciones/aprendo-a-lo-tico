package cr.aprendoalotico.api.comun.limites;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import cr.aprendoalotico.api.comun.limites.Limite.Tramo;
import cr.aprendoalotico.api.comun.web.DemasiadosIntentos;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class LimiteTest {

    /** Un reloj que se adelanta a mano. */
    static final class Reloj extends Clock {
        Instant ahora = Instant.parse("2026-11-11T18:00:00Z");

        void adelantar(Duration d) {
            ahora = ahora.plus(d);
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zona) {
            return this;
        }

        @Override
        public Instant instant() {
            return ahora;
        }
    }

    private final Reloj reloj = new Reloj();

    @Test
    @DisplayName("Deja los intentos del tramo y después 429 con lo que falta esperar; cada clave cuenta por su lado")
    void cuentaPorClave() {
        // Arrange
        var limite = Limite.de(reloj, new Tramo(3, Duration.ofMinutes(1)));
        // Act
        for (int i = 0; i < 3; i++) {
            limite.gastar("10.0.0.1");
        }
        // Assert
        assertThatThrownBy(() -> limite.gastar("10.0.0.1")).isInstanceOfSatisfying(DemasiadosIntentos.class,
                e -> assertThat(e.segundos()).isBetween(1L, 20L));
        limite.gastar("10.0.0.2");
    }

    @Test
    @DisplayName("Los intentos se recuperan de a poco con el tiempo")
    void seRecuperan() {
        var limite = Limite.de(reloj, new Tramo(2, Duration.ofMinutes(1)));
        limite.gastar("a");
        limite.gastar("a");
        reloj.adelantar(Duration.ofSeconds(31));
        limite.gastar("a");
        assertThatThrownBy(() -> limite.gastar("a")).isInstanceOf(DemasiadosIntentos.class);
    }

    @Test
    @DisplayName("Con dos tramos manda el más estricto en cada momento (5 por minuto y 7 por hora)")
    void dosTramos() {
        var limite = Limite.de(reloj, new Tramo(5, Duration.ofMinutes(1)), new Tramo(7, Duration.ofHours(1)));
        for (int i = 0; i < 5; i++) {
            limite.gastar("x");
        }
        assertThatThrownBy(() -> limite.gastar("x")).isInstanceOf(DemasiadosIntentos.class);
        reloj.adelantar(Duration.ofMinutes(2));
        limite.gastar("x");
        limite.gastar("x");
        assertThatThrownBy(() -> limite.gastar("x")).as("ya van 7 en la hora").isInstanceOfSatisfying(DemasiadosIntentos.class,
                e -> assertThat(e.segundos()).isGreaterThan(60));
    }

    @Test
    @DisplayName("Un intento devuelto no cuenta (entrar con la clave correcta no gasta)")
    void devolver() {
        var limite = Limite.de(reloj, new Tramo(1, Duration.ofHours(1)));
        limite.gastar("y").devolver();
        limite.gastar("y");
        assertThatThrownBy(() -> limite.gastar("y")).isInstanceOf(DemasiadosIntentos.class);
    }

    @Test
    @DisplayName("Gastar en varios a la vez: si uno no deja, se devuelve lo gastado en los otros")
    void enTodos() {
        var a = Limite.de(reloj, new Tramo(5, Duration.ofHours(1)));
        var b = Limite.de(reloj, new Tramo(1, Duration.ofHours(1)));
        Limite.gastarEnTodos(new Limite.Gasto(a, "k"), new Limite.Gasto(b, "k"));
        for (int i = 0; i < 3; i++) {
            assertThatThrownBy(() -> Limite.gastarEnTodos(new Limite.Gasto(a, "k"), new Limite.Gasto(b, "k")))
                    .isInstanceOf(DemasiadosIntentos.class);
        }
        // a no perdió nada en los intentos rechazados: le quedan 4
        for (int i = 0; i < 4; i++) {
            a.gastar("k");
        }
        assertThatThrownBy(() -> a.gastar("k")).isInstanceOf(DemasiadosIntentos.class);
    }

    @Test
    @DisplayName("La ficha de varios devuelve en todos")
    void devolverEnTodos() {
        var a = Limite.de(reloj, new Tramo(1, Duration.ofHours(1)));
        var b = Limite.de(reloj, new Tramo(1, Duration.ofHours(1)));
        Limite.gastarEnTodos(new Limite.Gasto(a, "k"), new Limite.Gasto(b, "k")).devolver();
        a.gastar("k");
        b.gastar("k");
    }

    @Test
    @DisplayName("Las claves se guardan por una huella de tamaño fijo: un correo de 10 000 letras ocupa lo mismo que uno corto")
    void huella() {
        assertThat(Limite.huella("x".repeat(10_000))).isNotEqualTo(Limite.huella("x".repeat(9_999)));
        assertThat(Limite.huella("10.0.0.1")).isEqualTo(Limite.huella("10.0.0.1"));
    }

    @Test
    @DisplayName("«intentar» no lanza: dice si quedaba (para lo que se deja de hacer en silencio)")
    void intentar() {
        var limite = Limite.de(reloj, new Tramo(2, Duration.ofHours(1)));
        assertThat(limite.intentar("z")).isTrue();
        assertThat(limite.intentar("z")).isTrue();
        assertThat(limite.intentar("z")).isFalse();
    }

    @Test
    @DisplayName("«exigirQueQuede» mira sin gastar: 429 solo cuando ya no queda")
    void exigirQueQuede() {
        var limite = Limite.de(reloj, new Tramo(1, Duration.ofMinutes(1)));
        limite.exigirQueQuede("w");
        limite.exigirQueQuede("w");
        limite.gastar("w");
        assertThatThrownBy(() -> limite.exigirQueQuede("w")).isInstanceOf(DemasiadosIntentos.class)
                .satisfies(e -> assertThat(((DemasiadosIntentos) e).segundos()).isBetween(1L, 60L));
        reloj.adelantar(Duration.ofMinutes(1));
        limite.exigirQueQuede("w");
    }

    @Test
    @DisplayName("Un límite sin tramos, o un tramo sin intentos o sin periodo, no se puede armar")
    void malArmado() {
        assertThatThrownBy(() -> Limite.de(reloj)).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new Tramo(0, Duration.ofMinutes(1))).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new Tramo(1, Duration.ZERO)).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new Tramo(1, null)).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("El mensaje dice cuánto esperar: «un minuto» o «N minutos»")
    void mensaje() {
        assertThat(new DemasiadosIntentos(Duration.ofSeconds(20)).getMessage()).contains("un minuto");
        assertThat(new DemasiadosIntentos(Duration.ofMinutes(14).plusSeconds(3)).getMessage()).contains("15 minutos");
        assertThat(new DemasiadosIntentos(Duration.ofMillis(1)).segundos()).isEqualTo(1);
    }
}
