package cr.aprendoalotico.api.comun.seguridad;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Las cabeceras de seguridad, también para las respuestas que salen sin pasar por Spring Security (la página de error
 * de un pedido que el firewall rechazó antes de llegar a sus filtros).
 */
public final class CabecerasDeSeguridad {

    static final String CSP = "default-src 'none'; frame-ancestors 'none'";

    private CabecerasDeSeguridad() {
    }

    /** Pone las que falten; no pisa las que ya estén. */
    public static void ponerSiFaltan(HttpServletResponse respuesta) {
        poner(respuesta, "X-Content-Type-Options", "nosniff");
        poner(respuesta, "X-Frame-Options", "DENY");
        poner(respuesta, "Referrer-Policy", "same-origin");
        poner(respuesta, "Content-Security-Policy", CSP);
        poner(respuesta, "Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
    }

    private static void poner(HttpServletResponse respuesta, String nombre, String valor) {
        if (!respuesta.containsHeader(nombre)) {
            respuesta.setHeader(nombre, valor);
        }
    }
}
