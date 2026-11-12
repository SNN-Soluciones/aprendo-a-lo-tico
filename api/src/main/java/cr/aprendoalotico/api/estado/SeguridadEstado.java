package cr.aprendoalotico.api.estado;

import cr.aprendoalotico.api.comun.seguridad.ContribucionDeSeguridad;
import java.util.List;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;

/** El estado es público (GET y HEAD, que algunos monitores usan): no dice nada más que la versión y si la base responde. */
@Component
class SeguridadEstado implements ContribucionDeSeguridad {

    @Override
    public List<RequestMatcher> publicas() {
        var m = PathPatternRequestMatcher.withDefaults();
        return List.of(m.matcher(HttpMethod.GET, "/api/v1/estado"), m.matcher(HttpMethod.HEAD, "/api/v1/estado"));
    }
}
