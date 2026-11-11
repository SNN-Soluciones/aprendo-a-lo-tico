package cr.aprendoalotico.api.comun.web;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.slf4j.MDC;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class IdDePedidoFiltroTest {

    private final IdDePedidoFiltro filtro = new IdDePedidoFiltro();

    @Test
    @DisplayName("Genera el id, lo pone en el MDC y en el pedido mientras dura, lo devuelve y limpia al terminar")
    void generaUnId() throws Exception {
        // Arrange
        var pedido = new MockHttpServletRequest("GET", "/api/v1/estado");
        var respuesta = new MockHttpServletResponse();
        var visto = new AtomicReference<String>();
        // Act
        filtro.doFilter(pedido, respuesta, (req, res) -> visto.set(MDC.get(IdDePedido.CLAVE_MDC)));
        // Assert
        assertThat(visto.get()).matches("[0-9a-f-]{36}");
        assertThat(respuesta.getHeader(IdDePedido.CABECERA)).isEqualTo(visto.get());
        assertThat(pedido.getAttribute(IdDePedido.ATRIBUTO)).as("para la página de error, que corre después").isEqualTo(visto.get());
        assertThat(MDC.get(IdDePedido.CLAVE_MDC)).as("se limpia al terminar").isNull();
    }

    @Test
    @DisplayName("El id del cliente nunca reemplaza al nuestro: queda aparte en los logs, para cruzarlo con el portal")
    void elDelClienteVaAparte() throws Exception {
        // Arrange
        var pedido = new MockHttpServletRequest("GET", "/api/v1/estado");
        pedido.addHeader(IdDePedido.CABECERA, "juego-reloj-123");
        var respuesta = new MockHttpServletResponse();
        var delCliente = new AtomicReference<String>();
        // Act
        filtro.doFilter(pedido, respuesta, (req, res) -> delCliente.set(MDC.get(IdDePedido.CLAVE_MDC_CLIENTE)));
        // Assert
        assertThat(respuesta.getHeader(IdDePedido.CABECERA)).isNotEqualTo("juego-reloj-123").matches("[0-9a-f-]{36}");
        assertThat(delCliente.get()).isEqualTo("juego-reloj-123");
        assertThat(MDC.get(IdDePedido.CLAVE_MDC_CLIENTE)).isNull();
    }

    @ParameterizedTest
    @DisplayName("Un id del cliente raro o largo ni siquiera va al log (podría ensuciarlo)")
    @ValueSource(strings = { "con espacios", "<script>", "a\nb", "uno-de-mas-de-sesenta-y-cuatro-caracteres-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", "" })
    void ignoraIdsRaros(String raro) throws Exception {
        var pedido = new MockHttpServletRequest("GET", "/api/v1/estado");
        pedido.addHeader(IdDePedido.CABECERA, raro);
        var delCliente = new AtomicReference<String>("sin-correr");
        filtro.doFilter(pedido, new MockHttpServletResponse(), (req, res) -> delCliente.set(MDC.get(IdDePedido.CLAVE_MDC_CLIENTE)));
        assertThat(delCliente.get()).isNull();
    }
}
