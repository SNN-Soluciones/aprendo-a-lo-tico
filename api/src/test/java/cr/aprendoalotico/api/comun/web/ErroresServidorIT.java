package cr.aprendoalotico.api.comun.web;

import static java.nio.charset.StandardCharsets.US_ASCII;
import static org.assertj.core.api.Assertions.assertThat;

import cr.aprendoalotico.api.PruebaDeIntegracion;
import cr.aprendoalotico.api.comun.seguridad.LimiteDeCuerpoFiltro;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.Socket;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Arrays;
import java.util.regex.Pattern;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.api.Test;
import org.apache.coyote.http11.AbstractHttp11Protocol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.tomcat.TomcatWebServer;
import org.springframework.boot.web.server.context.WebServerApplicationContext;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/**
 * Con un servidor de verdad (no MockMvc): lo que rechaza el firewall de Spring Security o Tomcat antes de llegar a un
 * controlador también tiene que salir con el sobre, el id del pedido y las cabeceras de seguridad.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ErroresServidorIT extends PruebaDeIntegracion {

    @LocalServerPort
    int puerto;

    @Autowired
    WebServerApplicationContext contexto;

    private final HttpClient cliente = HttpClient.newHttpClient();
    private final JsonMapper json = JsonMapper.builder().build();

    private HttpResponse<String> pedir(String metodo, String ruta) throws Exception {
        var pedido = HttpRequest.newBuilder(URI.create("http://localhost:" + puerto + ruta)).method(metodo, HttpRequest.BodyPublishers.noBody());
        return cliente.send(pedido.build(), HttpResponse.BodyHandlers.ofString());
    }

    @ParameterizedTest(name = "{0}")
    @DisplayName("Una ruta que el firewall rechaza sale con el sobre, el id del pedido y las cabeceras")
    @ValueSource(strings = { "/api/v1/estado;x=1", "/api/v1//estado", "/api/v1/%2e%2e/estado" })
    void rechazosDelFirewall(String ruta) throws Exception {
        // Act
        var r = pedir("GET", ruta);
        // Assert
        assertThat(r.statusCode()).isEqualTo(400);
        JsonNode cuerpo = json.readTree(r.body());
        assertThat(cuerpo.get("success").asBoolean()).isFalse();
        assertThat(cuerpo.at("/error/codigo").asString()).isEqualTo("SOLICITUD_INVALIDA");
        assertThat(cuerpo.at("/error/pedido").asString()).isEqualTo(r.headers().firstValue("X-Id-Pedido").orElseThrow());
        assertThat(r.body()).doesNotContain("estado;x=1").doesNotContain("%2e");
        assertThat(r.headers().firstValue("X-Content-Type-Options")).hasValue("nosniff");
    }

    @Test
    @DisplayName("Tomcat tiene el mismo tope de 64 KB para lo que lee por su cuenta: el cuerpo que nadie lee y los formularios")
    void topeDeTomcat() {
        var conector = ((TomcatWebServer) contexto.getWebServer()).getTomcat().getConnector();
        assertThat(((AbstractHttp11Protocol<?>) conector.getProtocolHandler()).getMaxSwallowSize()).isEqualTo((int) LimiteDeCuerpoFiltro.MAXIMO);
        assertThat(conector.getMaxPostSize()).isEqualTo((int) LimiteDeCuerpoFiltro.MAXIMO);
    }

    @Test
    @DisplayName("Un cuerpo por partes que la ruta no lee: con 8 KB la conexión sigue; con 200 KB Tomcat la corta pasados los 64 KB")
    void cuerpoQueNadieLee() throws Exception {
        assertThat(respuestasEnUnaConexion(8 * 1024)).isEqualTo(2);
        // Con el tope de Tomcat por defecto (2 MB) se descartaría entero y el GET también tendría respuesta
        assertThat(respuestasEnUnaConexion(200 * 1024)).isLessThanOrEqualTo(1);
    }

    /**
     * Manda por la misma conexión un DELETE /api/v1/sesion con «bytes» de cuerpo por partes (salir no lo lee) y
     * después un GET al estado, y cuenta cuántas respuestas llegan antes de que se cierre.
     */
    private long respuestasEnUnaConexion(int bytes) throws IOException {
        try (var conexion = new Socket("localhost", puerto)) {
            conexion.setSoTimeout(10_000);
            var salida = conexion.getOutputStream();
            try {
                salida.write(("DELETE /api/v1/sesion HTTP/1.1\r\nHost: localhost\r\nSec-Fetch-Site: same-origin\r\n"
                        + "Content-Type: application/json\r\nTransfer-Encoding: chunked\r\n\r\n").getBytes(US_ASCII));
                byte[] trozo = new byte[8 * 1024];
                Arrays.fill(trozo, (byte) 'x');
                for (int mandados = 0; mandados < bytes; mandados += trozo.length) {
                    salida.write((Integer.toHexString(trozo.length) + "\r\n").getBytes(US_ASCII));
                    salida.write(trozo);
                    salida.write("\r\n".getBytes(US_ASCII));
                }
                salida.write("0\r\n\r\nGET /api/v1/estado HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n".getBytes(US_ASCII));
                salida.flush();
            } catch (IOException cortada) {
                // Tomcat cortó la conexión mientras se mandaba el resto
            }
            var leido = new ByteArrayOutputStream();
            try {
                conexion.getInputStream().transferTo(leido);
            } catch (IOException cortada) {
                // Un reset también es un corte: cuenta lo que llegó antes
            }
            return Pattern.compile("HTTP/1\\.1 \\d{3}").matcher(leido.toString(US_ASCII)).results().count();
        }
    }

    @Test
    @DisplayName("GET /error directo no es público: 401 como cualquier otra cosa")
    void errorDirectoPideSesion() throws Exception {
        var r = pedir("GET", "/error");
        assertThat(r.statusCode()).isEqualTo(401);
        assertThat(json.readTree(r.body()).at("/error/codigo").asString()).isEqualTo("NO_AUTENTICADO");
    }

    @Test
    @DisplayName("HEAD al estado funciona (algunos monitores lo usan) y GET al estado responde con el sobre")
    void headYGetAlEstado() throws Exception {
        assertThat(pedir("HEAD", "/api/v1/estado").statusCode()).isEqualTo(200);
        assertThat(pedir("HEAD", "/actuator/health/liveness").statusCode()).isEqualTo(200);
        assertThat(json.readTree(pedir("GET", "/api/v1/estado").body()).get("success").asBoolean()).isTrue();
    }
}
