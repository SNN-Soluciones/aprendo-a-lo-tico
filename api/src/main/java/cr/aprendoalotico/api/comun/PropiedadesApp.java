package cr.aprendoalotico.api.comun;

import java.util.LinkedHashSet;
import java.util.Set;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuración propia de la aplicación (prefijo «app»). Se valida al arrancar: si falta o está mal, no arranca.
 *
 * @param sitioUrl    origen público del sitio (https://aprendoalotico.cr): los cambios solo se aceptan desde aquí
 * @param origenExtra otro origen de confianza, opcional y solo para la compu de quien programa (el portal local): si
 *                    él o el sitio son públicos, no arranca
 */
@ConfigurationProperties("app")
public record PropiedadesApp(String sitioUrl, String origenExtra) {

    public PropiedadesApp {
        if (sitioUrl == null || sitioUrl.isBlank()) {
            throw new IllegalArgumentException("Falta app.sitio-url (variable SITIO_URL): el origen público del sitio");
        }
        sitioUrl = Origenes.normalizar(sitioUrl);
        origenExtra = origenExtra == null || origenExtra.isBlank() ? null : Origenes.normalizar(origenExtra);
        if (sitioUrl.equals(origenExtra)) {
            origenExtra = null;
        }
        if (origenExtra != null && !(Origenes.esLocal(origenExtra) && Origenes.esLocal(sitioUrl))) {
            throw new IllegalArgumentException("No se puede confiar en " + origenExtra + " con el sitio " + sitioUrl
                    + ": ORIGEN_EXTRA es solo para la compu de quien programa (los dos tienen que ser locales)");
        }
    }

    /** Los orígenes desde los que se aceptan cambios. */
    public Set<String> origenes() {
        var todos = new LinkedHashSet<String>();
        todos.add(sitioUrl);
        if (origenExtra != null) {
            todos.add(origenExtra);
        }
        return Set.copyOf(todos);
    }
}
