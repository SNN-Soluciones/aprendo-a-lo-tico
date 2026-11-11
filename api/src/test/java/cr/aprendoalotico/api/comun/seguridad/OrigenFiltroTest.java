package cr.aprendoalotico.api.comun.seguridad;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.mock.web.MockHttpServletRequest;

class OrigenFiltroTest {

    private final OrigenFiltro filtro = new OrigenFiltro(Set.of("https://aprendoalotico.cr"));

    @ParameterizedTest(name = "{0} con Origin «{1}» y Sec-Fetch-Site «{2}» → permitido: {3}")
    @DisplayName("Solo deja pasar los cambios que vienen del propio sitio")
    @CsvSource(nullValues = "-", value = {
        "GET,      https://sitio-malo.com,             -,           true",   // leer no cambia nada
        "HEAD,     https://sitio-malo.com,             -,           true",
        "OPTIONS,  https://sitio-malo.com,             -,           true",
        "POST,     https://aprendoalotico.cr,          same-origin, true",
        "POST,     -,                                  -,           true",   // sin Origin: no es un navegador en otro sitio
        "POST,     -,                                  none,        true",   // lo escribió la persona (barra de direcciones)
        "POST,     https://sitio-malo.com,             -,           false",
        "POST,     https://aprendoalotico.cr.malo.com, -,           false",  // que empiece igual no alcanza
        "POST,     http://aprendoalotico.cr,           -,           false",  // http no es el mismo origen que https
        "POST,     null,                               -,           false",  // Origin «null»: iframes con sandbox y similares
        "POST,     https://sitio-malo.com,             same-origin, false",  // Sec-Fetch-Site no alcanza si el Origin es otro
        "POST,     https://aprendoalotico.cr,          cross-site,  false",  // el navegador avisa que viene de otro sitio
        "POST,     -,                                  cross-site,  false",
        "POST,     -,                                  same-site,   false",  // otro subdominio
        "PUT,      https://sitio-malo.com,             -,           false",
        "PATCH,    https://sitio-malo.com,             -,           false",
        "DELETE,   https://sitio-malo.com,             -,           false",
        "PROPFIND, https://sitio-malo.com,             -,           false",  // cualquier método raro se trata como cambio
        "get,      https://sitio-malo.com,             -,           false",  // los métodos distinguen mayúsculas
    })
    void decideSegunMetodoOrigenYSecFetchSite(String metodo, String origen, String secFetchSite, boolean permitido) {
        // Arrange
        var pedido = new MockHttpServletRequest(metodo, "/api/v1/sesiones");
        if (origen != null) pedido.addHeader("Origin", origen);
        if (secFetchSite != null) pedido.addHeader("Sec-Fetch-Site", secFetchSite);
        // Act + Assert
        assertThat(filtro.permitido(pedido)).isEqualTo(permitido);
    }

    @ParameterizedTest
    @DisplayName("Un Origin vacío no es el del sitio")
    @CsvSource({ "''" })
    void originVacio(String vacio) {
        var pedido = new MockHttpServletRequest("POST", "/api/v1/sesiones");
        pedido.addHeader("Origin", vacio);
        assertThat(filtro.permitido(pedido)).isFalse();
    }

    @ParameterizedTest
    @DisplayName("Acepta todos los orígenes de confianza que le den")
    @CsvSource({ "http://127.0.0.1:8080, true", "http://localhost:4200, true", "http://localhost:4201, false" })
    void variosOrigenes(String origen, boolean permitido) {
        var local = new OrigenFiltro(Set.of("http://127.0.0.1:8080", "http://localhost:4200"));
        var pedido = new MockHttpServletRequest("POST", "/api/v1/sesiones");
        pedido.addHeader("Origin", origen);
        assertThat(local.permitido(pedido)).isEqualTo(permitido);
    }
}
