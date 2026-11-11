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
import java.util.List;
import java.util.Properties;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.stream.IntStream;
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

    @Test
    @DisplayName("Si muchos pedidos llegan juntos con la respuesta vencida, uno solo consulta la base y los demás usan su resultado")
    void unaSolaConsultaALaVez() throws Exception {
        // Arrange: la primera consulta se queda pegada hasta que la soltemos
        var consultando = new CountDownLatch(1);
        var soltar = new CountDownLatch(1);
        when(jdbc.sql("select 1").query(Integer.class).single()).thenAnswer(invocacion -> {
            consultando.countDown();
            assertThat(soltar.await(5, TimeUnit.SECONDS)).isTrue();
            return 1;
        });
        var servicio = new ServicioEstado(jdbc, Clock.fixed(AHORA, ZoneOffset.UTC), build(null));
        var respuestas = new ConcurrentLinkedQueue<Estado>();
        Runnable pedir = () -> respuestas.add(servicio.estado());
        var primero = Thread.ofPlatform().start(pedir);
        assertThat(consultando.await(5, TimeUnit.SECONDS)).isTrue();
        var otros = IntStream.range(0, 20).mapToObj(n -> Thread.ofPlatform().start(pedir)).toList();
        esperarQueTodosEsperen(otros);
        // Act
        soltar.countDown();
        primero.join(5_000);
        for (var hilo : otros) {
            hilo.join(5_000);
        }
        // Assert
        assertThat(respuestas).hasSize(21).allSatisfy(e -> assertThat(e).isSameAs(respuestas.peek()));
        verify(jdbc.sql("select 1").query(Integer.class), times(1)).single();
    }

    /** Espera (sin adivinar un tiempo) a que cada hilo esté detenido esperando algo, o ya haya terminado. */
    private static void esperarQueTodosEsperen(List<Thread> hilos) {
        long limite = System.nanoTime() + TimeUnit.SECONDS.toNanos(5);
        while (hilos.stream().anyMatch(h -> h.getState() == Thread.State.NEW || h.getState() == Thread.State.RUNNABLE)) {
            if (System.nanoTime() > limite) {
                throw new AssertionError("Los pedidos no llegaron a esperar");
            }
            Thread.onSpinWait();
        }
    }
}
