package cr.aprendoalotico.api.comun;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Locale;
import java.util.Set;

/**
 * Orígenes web (esquema://dominio[:puerto]) escritos exactamente como el navegador los manda en la cabecera Origin.
 * Un origen mal escrito en la configuración haría rechazar todos los cambios sin ningún aviso: por eso se valida al arrancar.
 */
public final class Origenes {

    private static final Set<String> LOCALES = Set.of("localhost", "127.0.0.1", "[::1]");

    private Origenes() {
    }

    /**
     * El origen normalizado: minúsculas y sin el puerto por defecto.
     *
     * @throws IllegalArgumentException si está vacío, trae ruta, consulta o usuario, no es http(s), o es público sin https
     */
    public static String normalizar(String texto) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("El origen está vacío");
        }
        URI uri;
        try {
            uri = new URI(texto.trim());
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("«" + texto + "» no es una dirección válida");
        }
        String esquema = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase(Locale.ROOT);
        String host = uri.getHost() == null ? null : uri.getHost().toLowerCase(Locale.ROOT);
        boolean soloOrigen = uri.getRawPath() != null && uri.getRawPath().isEmpty() && uri.getRawQuery() == null
                && uri.getRawFragment() == null && uri.getRawUserInfo() == null;
        if (!(esquema.equals("http") || esquema.equals("https")) || host == null || !soloOrigen) {
            throw new IllegalArgumentException("«" + texto + "» tiene que ser un origen: https://dominio, sin ruta ni barra al final");
        }
        if (esquema.equals("http") && !LOCALES.contains(host)) {
            throw new IllegalArgumentException("«" + texto + "» tiene que usar https (solo localhost puede ir con http)");
        }
        int puertoPorDefecto = esquema.equals("https") ? 443 : 80;
        boolean conPuerto = uri.getPort() != -1 && uri.getPort() != puertoPorDefecto;
        return esquema + "://" + host + (conPuerto ? ":" + uri.getPort() : "");
    }

    /** ¿Es un origen de la propia compu (localhost)? Se asume ya normalizado. */
    public static boolean esLocal(String origen) {
        return LOCALES.contains(URI.create(origen).getHost());
    }
}
