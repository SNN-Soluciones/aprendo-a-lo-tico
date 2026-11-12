package cr.aprendoalotico.api.comun.correo;

import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * La configuración de los correos (prefijo «app.correo»). Se valida al arrancar.
 *
 * @param remitente quién manda, por ejemplo «Aprendo a lo Tico &lt;no-responder@snnsoluciones.com&gt;» (variable
 *                  CORREO_REMITENTE): tiene que ser de un dominio verificado en el proveedor (Resend)
 */
@ConfigurationProperties("app.correo")
public record PropiedadesCorreo(String remitente) {

    public PropiedadesCorreo {
        if (remitente == null || remitente.isBlank()) {
            throw new IllegalArgumentException("Falta app.correo.remitente (variable CORREO_REMITENTE): quién manda los correos");
        }
        try {
            new InternetAddress(remitente, true);
        } catch (AddressException e) {
            throw new IllegalArgumentException("app.correo.remitente no es una dirección válida: " + remitente);
        }
    }
}
