package cr.aprendoalotico.api.comun.seguridad;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Defensa contra CSRF (DISENO.md, B5), además de las cookies SameSite=Strict: rechaza todo cambio
 * (cualquier método que no sea GET, HEAD u OPTIONS) que el navegador diga que viene de otro sitio.
 *
 * <ul>
 *   <li>Sec-Fetch-Site distinto de «same-origin» o «none» (lo escribió la persona): se rechaza, aunque sea otro
 *       subdominio («same-site»). Por eso el portal local habla con el API a través de un proxy, no directo.</li>
 *   <li>Origin presente: tiene que ser uno de los orígenes de confianza, exacto.</li>
 *   <li>Sin Origin ni Sec-Fetch-Site no es un navegador mandando un formulario desde otro sitio (los navegadores
 *       siempre los ponen en esos casos), así que pasa: la sesión y los permisos se revisan después.</li>
 * </ul>
 * Regla para todo el API: <b>ningún GET cambia nada</b>, porque los GET no pasan por aquí.
 */
public class OrigenFiltro extends OncePerRequestFilter {

    private static final Set<String> LEEN = Set.of("GET", "HEAD", "OPTIONS");
    private static final Set<String> MISMO_SITIO = Set.of("same-origin", "none");

    private final Set<String> origenes;

    public OrigenFiltro(Set<String> origenes) {
        this.origenes = Set.copyOf(origenes);
    }

    /** ¿Este pedido puede seguir? */
    boolean permitido(HttpServletRequest pedido) {
        if (LEEN.contains(pedido.getMethod())) {
            return true;
        }
        String sitio = pedido.getHeader("Sec-Fetch-Site");
        if (sitio != null && !MISMO_SITIO.contains(sitio)) {
            return false;
        }
        String origen = pedido.getHeader("Origin");
        return origen == null || origenes.contains(origen);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest pedido, HttpServletResponse respuesta, FilterChain cadena)
            throws ServletException, IOException {
        if (permitido(pedido)) {
            cadena.doFilter(pedido, respuesta);
            return;
        }
        EscritorDeErrores.escribir(respuesta, HttpStatus.FORBIDDEN, "ORIGEN_NO_PERMITIDO",
                "Este pedido no viene de Aprendo a lo Tico.");
    }
}
