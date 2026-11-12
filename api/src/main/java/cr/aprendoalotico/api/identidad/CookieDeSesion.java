package cr.aprendoalotico.api.identidad;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import org.springframework.http.ResponseCookie;

/**
 * La cookie de la sesión (DISENO.md, B4). El prefijo «__Host-» obliga al navegador a aceptarla solo con Secure,
 * Path=/ y sin Domain: ningún subdominio la puede pisar. HttpOnly (el JavaScript no la ve) y SameSite=Strict (no
 * viaja en pedidos que empiezan en otro sitio).
 */
public final class CookieDeSesion {

    public static final String NOMBRE = "__Host-sesion";

    private CookieDeSesion() {
    }

    public static ResponseCookie con(String token, Duration duracion) {
        return armar(token, duracion);
    }

    /** La que le dice al navegador que la borre. */
    public static ResponseCookie borrada() {
        return armar("", Duration.ZERO);
    }

    /** El token que trae el pedido, o null. */
    static String leer(HttpServletRequest pedido) {
        Cookie[] cookies = pedido.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie c : cookies) {
            if (NOMBRE.equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }

    private static ResponseCookie armar(String valor, Duration duracion) {
        return ResponseCookie.from(NOMBRE, valor).httpOnly(true).secure(true).sameSite("Strict").path("/").maxAge(duracion).build();
    }
}
