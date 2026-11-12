package cr.aprendoalotico.api.comun.seguridad;

import cr.aprendoalotico.api.comun.web.IdDePedido;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

/**
 * Escribe el sobre de error desde los filtros (401, 403, origen), donde todavía no hay controladores.
 * Lo arma a mano a propósito: solo lleva textos nuestros y el id del pedido, que ya viene validado.
 */
final class EscritorDeErrores {

    private EscritorDeErrores() {
    }

    static void escribir(HttpServletResponse respuesta, HttpStatus estado, String codigo, String mensaje) throws IOException {
        respuesta.setStatus(estado.value());
        respuesta.setContentType(MediaType.APPLICATION_JSON_VALUE);
        respuesta.setCharacterEncoding("UTF-8");
        String pedido = IdDePedido.actual();
        respuesta.getWriter().write("{\"success\":false,\"data\":null,\"error\":{\"codigo\":" + texto(codigo)
                + ",\"mensaje\":" + texto(mensaje) + ",\"campos\":null,\"pedido\":" + (pedido == null ? "null" : texto(pedido))
                + "},\"meta\":null}");
    }

    /** Un texto como cadena JSON: escapa comillas, barras y caracteres de control. */
    static String texto(String s) {
        StringBuilder sb = new StringBuilder("\"");
        for (char c : s.toCharArray()) {
            switch (c) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                default -> {
                    if (c < 0x20) {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
                }
            }
        }
        return sb.append('"').toString();
    }
}
