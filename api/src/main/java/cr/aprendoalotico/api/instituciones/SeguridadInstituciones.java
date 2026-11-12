package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.comun.seguridad.ContribucionDeSeguridad;
import java.util.List;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;

/** Lo que instituciones aporta a la seguridad (B17): las rutas del equipo, solo para el equipo (B21). */
@Component
class SeguridadInstituciones implements ContribucionDeSeguridad {

    @Override
    public List<RequestMatcher> soloEquipo() {
        return List.of(PathPatternRequestMatcher.withDefaults().matcher("/api/v1/admin/**"));
    }
}
