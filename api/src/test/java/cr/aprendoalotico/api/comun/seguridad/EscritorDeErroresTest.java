package cr.aprendoalotico.api.comun.seguridad;

import static org.assertj.core.api.Assertions.assertThat;

import cr.aprendoalotico.api.comun.web.IdDePedido;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletResponse;

class EscritorDeErroresTest {

    @AfterEach
    void limpiar() {
        MDC.clear();
    }

    @Test
    @DisplayName("Escribe el sobre de error como JSON UTF-8 con el id del pedido")
    void escribeElSobre() throws Exception {
        // Arrange
        MDC.put(IdDePedido.CLAVE_MDC, "p-1");
        var respuesta = new MockHttpServletResponse();
        // Act
        EscritorDeErrores.escribir(respuesta, HttpStatus.UNAUTHORIZED, "NO_AUTENTICADO", "Tenés que entrar.");
        // Assert
        assertThat(respuesta.getStatus()).isEqualTo(401);
        assertThat(respuesta.getContentType()).startsWith("application/json");
        assertThat(respuesta.getContentAsString()).isEqualTo(
                "{\"success\":false,\"data\":null,\"error\":{\"codigo\":\"NO_AUTENTICADO\",\"mensaje\":\"Tenés que entrar.\","
                        + "\"campos\":null,\"pedido\":\"p-1\"},\"meta\":null}");
    }

    @Test
    @DisplayName("Sin pedido en curso, el id va como null")
    void sinPedido() throws Exception {
        var respuesta = new MockHttpServletResponse();
        EscritorDeErrores.escribir(respuesta, HttpStatus.FORBIDDEN, "PROHIBIDO", "No.");
        assertThat(respuesta.getContentAsString()).contains("\"pedido\":null");
    }

    @Test
    @DisplayName("Escribe exactamente lo mismo que Jackson con Respuesta.falla: si alguien cambia el sobre, esto avisa")
    void igualQueJackson() throws Exception {
        // Arrange
        MDC.put(IdDePedido.CLAVE_MDC, "p-2");
        var respuesta = new MockHttpServletResponse();
        var json = tools.jackson.databind.json.JsonMapper.builder().build();
        // Act
        EscritorDeErrores.escribir(respuesta, HttpStatus.FORBIDDEN, "PROHIBIDO", "No \"tenés\" permiso.");
        var deJackson = json.writeValueAsString(cr.aprendoalotico.api.comun.web.Respuesta.falla(
                new cr.aprendoalotico.api.comun.web.ErrorApi("PROHIBIDO", "No \"tenés\" permiso.", null, "p-2")));
        // Assert
        assertThat(json.readTree(respuesta.getContentAsString())).isEqualTo(json.readTree(deJackson));
    }

    @Test
    @DisplayName("Escapa comillas, barras y caracteres de control para que el JSON nunca se rompa")
    void escapa() {
        assertThat(EscritorDeErrores.texto("di \"hola\" \\ y\nchao\t")).isEqualTo("\"di \\\"hola\\\" \\\\ y\\u000achao\\u0009\"");
    }
}
