package cr.aprendoalotico.api.estado;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Properties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.info.BuildProperties;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.jdbc.core.simple.JdbcClient;

class ServicioEstadoTest {

    private static final Instant AHORA = Instant.parse("2026-11-11T18:00:00Z");
    private final JdbcClient jdbc = mock(JdbcClient.class, RETURNS_DEEP_STUBS);

    /** Un reloj que se puede adelantar a mano. */
    static final class RelojDePrueba extends Clock {
        Instant ahora = AHORA;

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

    @SuppressWarnings("unchecked")
    private static ObjectProvider<BuildProperties> build(BuildProperties propiedades) {
        ObjectProvider<BuildProperties> proveedor = mock(ObjectProvider.class);
        when(proveedor.getIfAvailable()).thenReturn(propiedades);
        return proveedor;
    }

    @Test
    @DisplayName("Con la base respondiendo y datos de build, dice la versión y que la base está bien")
    void todoBien() {
        // Arrange
        when(jdbc.sql("select 1").query(Integer.class).single()).thenReturn(1);
        var propiedades = new Properties();
        propiedades.setProperty("version", "0.1.0");
        // Act
        var estado = new ServicioEstado(jdbc, Clock.fixed(AHORA, ZoneOffset.UTC), build(new BuildProperties(propiedades))).estado();
        // Assert
        assertThat(estado).isEqualTo(new Estado(ServicioEstado.SERVICIO, "0.1.0", AHORA, Estado.BASE_OK));
        assertThat(estado.baseResponde()).isTrue();
    }

    @Test
    @DisplayName("Si la base no responde no revienta: avisa «sin conexión»; sin datos de build la versión es «dev»")
    void baseCaida() {
        when(jdbc.sql("select 1").query(Integer.class).single()).thenThrow(new DataAccessResourceFailureException("sin red"));
        var estado = new ServicioEstado(jdbc, Clock.fixed(AHORA, ZoneOffset.UTC), build(null)).estado();
        assertThat(estado.base()).isEqualTo("sin conexión");
        assertThat(estado.baseResponde()).isFalse();
        assertThat(estado.version()).isEqualTo("dev");
    }

    @Test
    @DisplayName("Durante 5 segundos repite la última respuesta: mil pedidos anónimos no son mil consultas a la base")
    void guardaLaRespuestaUnRato() {
        // Arrange
        when(jdbc.sql("select 1").query(Integer.class).single()).thenReturn(1);
        var reloj = new RelojDePrueba();
        var servicio = new ServicioEstado(jdbc, reloj, build(null));
        // Act
        var primero = servicio.estado();
        reloj.ahora = AHORA.plus(Duration.ofSeconds(4));
        var segundo = servicio.estado();
        reloj.ahora = AHORA.plus(Duration.ofSeconds(6));
        var tercero = servicio.estado();
        // Assert
        assertThat(segundo).isSameAs(primero);
        assertThat(tercero.hora()).isEqualTo(AHORA.plus(Duration.ofSeconds(6)));
        verify(jdbc.sql("select 1").query(Integer.class), times(2)).single();
    }
}
