package cr.aprendoalotico.api.comun.seguridad;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import cr.aprendoalotico.api.comun.web.CuerpoDemasiadoGrande;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class LimiteDeCuerpoFiltroTest {

    private final LimiteDeCuerpoFiltro filtro = new LimiteDeCuerpoFiltro(10);

    /** Un pedido que llega por partes: no dice su tamaño. */
    private static MockHttpServletRequest porPartes(String cuerpo) {
        var p = new MockHttpServletRequest("POST", "/api/v1/sesion") {
            @Override
            public long getContentLengthLong() {
                return -1;
            }
        };
        p.setContent(cuerpo.getBytes(StandardCharsets.UTF_8));
        return p;
    }

    @Test
    @DisplayName("Si dice que se pasa del tope, 413 con el sobre y sin llegar a leerlo")
    void diceSuTamano() throws Exception {
        var pedido = new MockHttpServletRequest("POST", "/api/v1/sesion");
        pedido.setContent(new byte[11]);
        var respuesta = new MockHttpServletResponse();
        filtro.doFilter(pedido, respuesta, (p, r) -> {
            throw new AssertionError("no tenía que seguir");
        });
        assertThat(respuesta.getStatus()).isEqualTo(413);
        assertThat(respuesta.getContentAsString()).contains("\"codigo\":\"DEMASIADO_GRANDE\"");
        assertThat(respuesta.getHeader("X-Content-Type-Options")).as("corre antes que Spring Security").isEqualTo("nosniff");
    }

    @Test
    @DisplayName("Por partes: se lee hasta el tope y al pasarlo se corta (ManejadorErrores lo vuelve 413)")
    void porPartesSeCorta() throws Exception {
        filtro.doFilter(porPartes("12345678901"), new MockHttpServletResponse(), (p, r) -> {
            var cuerpo = ((HttpServletRequest) p).getInputStream();
            assertThatThrownBy(cuerpo::readAllBytes).isInstanceOf(CuerpoDemasiadoGrande.class);
        });
        filtro.doFilter(porPartes("12345678901"), new MockHttpServletResponse(), (p, r) -> {
            var cuerpo = ((HttpServletRequest) p).getInputStream();
            assertThatThrownBy(() -> {
                while (cuerpo.read() >= 0) {
                    // de a un byte también cuenta
                }
            }).isInstanceOf(CuerpoDemasiadoGrande.class);
        });
    }

    @Test
    @DisplayName("Por partes y dentro del tope, se lee entero (también como texto)")
    void porPartesDentroDelTope() throws Exception {
        var leido = new AtomicReference<String>();
        filtro.doFilter(porPartes("ñandú"), new MockHttpServletResponse(), (p, r) -> {
            var pedido = (HttpServletRequest) p;
            assertThat(pedido.getInputStream()).isSameAs(pedido.getInputStream());
            assertThat(pedido.getInputStream().isFinished()).isFalse();
            assertThat(pedido.getInputStream().isReady()).isTrue();
            leido.set(pedido.getReader().readLine());
        });
        assertThat(leido.get()).isEqualTo("ñandú");
    }

    @Test
    @DisplayName("Un pedido de tamaño conocido dentro del tope pasa tal cual")
    void dentroDelTope() throws Exception {
        var pedido = new MockHttpServletRequest("POST", "/api/v1/sesion");
        pedido.setContent(new byte[10]);
        var paso = new AtomicReference<Object>();
        filtro.doFilter(pedido, new MockHttpServletResponse(), (p, r) -> paso.set(p));
        assertThat(paso.get()).isSameAs(pedido);
    }
}
