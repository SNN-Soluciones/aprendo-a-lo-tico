package cr.aprendoalotico.api.identidad;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.request;

import jakarta.servlet.http.Cookie;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.json.JsonMapper;

/**
 * Pedidos como los manda el portal: desde el sitio (Origin y Sec-Fetch-Site), con JSON, y cada prueba desde su propia
 * IP y con su propio correo, para que los límites de intentos (que viven mientras viva la aplicación) no se mezclen.
 */
final class Navegador {

    static final String SITIO = "https://aprendoalotico.cr";
    private static final AtomicInteger IPS = new AtomicInteger();
    private static final JsonMapper JSON = JsonMapper.builder().build();

    private Navegador() {
    }

    /** Una IP que ninguna otra prueba usó. */
    static String ipNueva() {
        int n = IPS.incrementAndGet();
        return "10." + (n >> 16 & 0xff) + "." + (n >> 8 & 0xff) + "." + (n & 0xff);
    }

    static String correoNuevo() {
        return "maestra-" + UUID.randomUUID() + "@escuela.cr";
    }

    static MockHttpServletRequestBuilder desde(String ip, HttpMethod metodo, String ruta, Map<String, ?> cuerpo) {
        return desdeElSitio(SITIO, "same-origin", ip, metodo, ruta, cuerpo);
    }

    /** Como lo mandaría un navegador que está en otro sitio. */
    static MockHttpServletRequestBuilder desdeElSitio(String origen, String secFetchSite, String ip, HttpMethod metodo, String ruta,
            Map<String, ?> cuerpo) {
        var pedido = request(metodo, ruta).header("Origin", origen).header("Sec-Fetch-Site", secFetchSite)
                .with(p -> {
                    p.setRemoteAddr(ip);
                    return p;
                });
        return cuerpo == null ? pedido : pedido.contentType(MediaType.APPLICATION_JSON).content(JSON.writeValueAsString(cuerpo));
    }

    static MockHttpServletRequestBuilder con(Cookie sesion, MockHttpServletRequestBuilder pedido) {
        return pedido.cookie(sesion);
    }

    static Cookie cookie(String token) {
        return new Cookie(CookieDeSesion.NOMBRE, token);
    }
}
