package cr.aprendoalotico.api.comun.web;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import java.util.regex.Pattern;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Pone el id a cada pedido, antes que todo (incluida la seguridad), para que hasta un 401 se pueda rastrear. */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class IdDePedidoFiltro extends OncePerRequestFilter {

    /** Solo letras, números, punto, guion y guion bajo: nada que ensucie o rompa una línea de log. */
    private static final Pattern VALIDO = Pattern.compile("[A-Za-z0-9._-]{1,64}");

    @Override
    protected void doFilterInternal(HttpServletRequest pedido, HttpServletResponse respuesta, FilterChain cadena)
            throws ServletException, IOException {
        String id = UUID.randomUUID().toString();
        String delCliente = pedido.getHeader(IdDePedido.CABECERA);
        MDC.put(IdDePedido.CLAVE_MDC, id);
        if (delCliente != null && VALIDO.matcher(delCliente).matches()) {
            MDC.put(IdDePedido.CLAVE_MDC_CLIENTE, delCliente);
        }
        pedido.setAttribute(IdDePedido.ATRIBUTO, id);
        respuesta.setHeader(IdDePedido.CABECERA, id);
        try {
            cadena.doFilter(pedido, respuesta);
        } finally {
            MDC.remove(IdDePedido.CLAVE_MDC);
            MDC.remove(IdDePedido.CLAVE_MDC_CLIENTE);
        }
    }
}
