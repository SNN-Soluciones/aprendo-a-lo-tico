package cr.aprendoalotico.api.comun.correo;

import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;

/**
 * Un correo para mandar, en texto plano (DISENO.md, B7): sin HTML no hay nada que se pueda inyectar ni que se vea
 * distinto en cada programa de correo.
 *
 * @param para   una sola dirección
 * @param asunto una línea, sin saltos (un salto de línea en un encabezado permitiría agregar otros)
 * @param texto  el cuerpo
 */
public record Mensaje(String para, String asunto, String texto) {

    public Mensaje {
        if (para == null || !esDireccion(para)) {
            throw new IllegalArgumentException("El destinatario no es una dirección de correo");
        }
        if (asunto == null || asunto.isBlank() || asunto.indexOf('\r') >= 0 || asunto.indexOf('\n') >= 0) {
            throw new IllegalArgumentException("El asunto tiene que ser una sola línea");
        }
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("El correo no tiene texto");
        }
    }

    private static boolean esDireccion(String texto) {
        try {
            var direccion = new InternetAddress(texto, true);
            // Solo la dirección: nada de «Nombre <...>» ni listas
            return direccion.getAddress().equals(texto) && direccion.getPersonal() == null;
        } catch (AddressException e) {
            return false;
        }
    }

    /** Para los logs: nunca la dirección (es un dato personal). */
    @Override
    public String toString() {
        return "Mensaje[asunto=" + asunto + "]";
    }
}
