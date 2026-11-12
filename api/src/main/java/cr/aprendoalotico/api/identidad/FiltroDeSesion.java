package cr.aprendoalotico.api.identidad;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Reconoce la sesión de cada pedido por su cookie y deja a la persona como «autenticada» para Spring Security. Si la
 * cookie no sirve (vencida, cerrada, inventada), el pedido sigue sin sesión y las rutas que la piden responden 401.
 * No se le pide al navegador que la borre: un pedido que salió con el token viejo justo antes de cambiar la clave
 * podría volver después de la cookie nueva y borrarla. El portal, ante un 401, llama a salir y listo.
 *
 * <p>No es un bean: si lo fuera, Spring Boot además lo registraría como filtro suelto y correría dos veces.
 */
class FiltroDeSesion extends OncePerRequestFilter {

    private final ServicioSesiones sesiones;
    private final SecurityContextHolderStrategy contextos = SecurityContextHolder.getContextHolderStrategy();

    FiltroDeSesion(ServicioSesiones sesiones) {
        this.sesiones = sesiones;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest pedido, HttpServletResponse respuesta, FilterChain cadena)
            throws ServletException, IOException {
        String token = CookieDeSesion.leer(pedido);
        if (token != null) {
            sesiones.reconocer(token).ifPresent(yo -> {
                var contexto = contextos.createEmptyContext();
                contexto.setAuthentication(UsernamePasswordAuthenticationToken.authenticated(yo, null, List.of()));
                contextos.setContext(contexto);
            });
        }
        cadena.doFilter(pedido, respuesta);
    }
}
