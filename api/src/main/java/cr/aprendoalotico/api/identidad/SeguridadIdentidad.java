package cr.aprendoalotico.api.identidad;

import cr.aprendoalotico.api.comun.seguridad.ContribucionDeSeguridad;
import java.util.List;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;

/**
 * Lo que identidad aporta a la seguridad (B17): abre registrarse, confirmar, entrar, salir y recuperar la clave, y
 * agrega el filtro que reconoce la cookie de sesión. Todo lo demás del API pide sesión.
 */
@Component
class SeguridadIdentidad implements ContribucionDeSeguridad {

    private final ServicioSesiones sesiones;

    SeguridadIdentidad(ServicioSesiones sesiones) {
        this.sesiones = sesiones;
    }

    @Override
    public List<RequestMatcher> publicas() {
        var m = PathPatternRequestMatcher.withDefaults();
        return List.of(
                m.matcher(HttpMethod.POST, "/api/v1/cuentas"),
                m.matcher(HttpMethod.POST, "/api/v1/cuentas/confirmar"),
                m.matcher(HttpMethod.POST, "/api/v1/sesion"),
                // Salir sin sesión (la cookie ya venció) también vale: borra la cookie y listo
                m.matcher(HttpMethod.DELETE, "/api/v1/sesion"),
                m.matcher(HttpMethod.POST, "/api/v1/clave/recuperar"),
                m.matcher(HttpMethod.POST, "/api/v1/clave/nueva"));
    }

    @Override
    public void configurar(HttpSecurity http) {
        http.addFilterBefore(new FiltroDeSesion(sesiones), AnonymousAuthenticationFilter.class);
    }
}
