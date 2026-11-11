package cr.aprendoalotico.api.comun.seguridad;

import java.util.List;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.util.matcher.RequestMatcher;

/**
 * Lo que cada módulo aporta a la seguridad, sin tocar «comun» ni armar otra cadena (que perdería las cabeceras,
 * el filtro de origen y las respuestas 401/403). Un módulo declara un @Component que implementa esto.
 *
 * <p>Ejemplo: identidad abre «entrar» y «registrarse», y agrega el filtro que lee la cookie de sesión.
 */
public interface ContribucionDeSeguridad {

    /** Rutas que este módulo abre sin sesión. Todo lo demás pide sesión. */
    default List<RequestMatcher> publicas() {
        return List.of();
    }

    /** Ajustes propios antes de cerrar la cadena (por ejemplo, agregar un filtro). */
    default void configurar(HttpSecurity http) throws Exception {
    }
}
