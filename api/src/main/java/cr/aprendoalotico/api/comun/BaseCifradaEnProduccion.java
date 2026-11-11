package cr.aprendoalotico.api.comun;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Set;
import org.springframework.boot.EnvironmentPostProcessor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;

/**
 * En producción, si la conexión a la base no va cifrada, la aplicación no arranca. Se exige en la dirección (DB_URL) y no
 * en las propiedades del pool porque las migraciones abren su propia conexión con la misma dirección y sin esas
 * propiedades: sin {@code sslmode} en la dirección, el driver prueba cifrado y, si el servidor lo permite, sigue en texto
 * plano con la clave del rol dueño. Corre al preparar la configuración, antes de abrir cualquier conexión.
 */
public class BaseCifradaEnProduccion implements EnvironmentPostProcessor, Ordered {

    private static final Set<String> MODOS_CIFRADOS = Set.of("require", "verify-ca", "verify-full");

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment entorno, SpringApplication aplicacion) {
        if (!entorno.matchesProfiles("prod")) {
            return;
        }
        exigirCifrado("DB_URL (spring.datasource.url)", entorno.getProperty("spring.datasource.url"));
        String migraciones = entorno.getProperty("spring.flyway.url");
        if (migraciones != null) {
            exigirCifrado("spring.flyway.url", migraciones);
        }
    }

    /** Después de leer application-prod.yml y las variables de entorno. */
    @Override
    public int getOrder() {
        return ConfigDataEnvironmentPostProcessor.ORDER + 1;
    }

    private static void exigirCifrado(String nombre, String url) {
        if (url == null || url.isBlank()) {
            throw new IllegalStateException("Falta " + nombre + ": la dirección de la base");
        }
        String modo = modoSsl(url);
        if (modo == null || !MODOS_CIFRADOS.contains(modo.toLowerCase(Locale.ROOT))) {
            throw new IllegalStateException(nombre + " tiene que pedir la conexión cifrada: agregale ?sslmode=require"
                    + " (o verify-full) al final");
        }
    }

    /** El sslmode de una dirección JDBC, como lo lee el driver: el nombre exacto y, si se repite, el último. */
    private static String modoSsl(String url) {
        int inicio = url.indexOf('?');
        if (inicio < 0) {
            return null;
        }
        String modo = null;
        for (String parametro : url.substring(inicio + 1).split("&")) {
            int igual = parametro.indexOf('=');
            if (igual > 0 && parametro.substring(0, igual).equals("sslmode")) {
                modo = URLDecoder.decode(parametro.substring(igual + 1), StandardCharsets.UTF_8);
            }
        }
        return modo;
    }
}
