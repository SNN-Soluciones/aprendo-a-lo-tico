package cr.aprendoalotico.api.comun.web;

import cr.aprendoalotico.api.comun.PropiedadesApp;
import jakarta.servlet.http.HttpServletRequest;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

/**
 * La IP de quien hace el pedido, para los límites de intentos (DISENO.md, B19). Detrás de App Platform la conexión
 * viene del proxy: la IP real está en la cabecera que la plataforma pone (app.cabecera-ip). Solo se acepta si es una IP
 * literal; si no, se usa la de la conexión. Nunca se resuelve un nombre (eso sería una consulta DNS por pedido).
 */
@Component
public class IpDelCliente {

    private static final Pattern IPV4 = Pattern.compile("\\d{1,3}(\\.\\d{1,3}){3}");
    /**
     * Empieza con un dígito hexadecimal o «:»: así InetAddress la trata como IPv6 y, si no lo es, falla sin preguntarle
     * al DNS. Con otro primer carácter («.:»), la buscaría como nombre.
     */
    private static final Pattern IPV6 = Pattern.compile("[0-9A-Fa-f:][0-9A-Fa-f:.]{1,44}");

    private final String cabecera;

    public IpDelCliente(PropiedadesApp app) {
        this.cabecera = app.cabeceraIp();
    }

    /** La IP del cliente, normalizada. */
    public String de(HttpServletRequest pedido) {
        if (cabecera != null) {
            InetAddress ip = literal(pedido.getHeader(cabecera));
            if (ip != null) {
                return ip.getHostAddress();
            }
        }
        InetAddress conexion = literal(pedido.getRemoteAddr());
        return conexion == null ? "desconocida" : conexion.getHostAddress();
    }

    /**
     * La clave para los límites: la IPv4 tal cual; de una IPv6, su red /64, porque cualquiera con una conexión
     * hogareña tiene millones de direcciones dentro de la suya y podría estrenar una por intento.
     */
    public String paraLimites(HttpServletRequest pedido) {
        String ip = de(pedido);
        InetAddress direccion = literal(ip);
        if (direccion instanceof Inet6Address v6) {
            byte[] bytes = v6.getAddress();
            StringBuilder red = new StringBuilder();
            for (int i = 0; i < 8; i += 2) {
                red.append(Integer.toHexString(((bytes[i] & 0xff) << 8) | (bytes[i + 1] & 0xff))).append(':');
            }
            return red.append(":/64").toString();
        }
        return ip;
    }

    /** La dirección si el texto es una IP literal (v4 o v6, sin zona); null si no. */
    static InetAddress literal(String texto) {
        if (texto == null) {
            return null;
        }
        String t = texto.trim();
        try {
            if (IPV4.matcher(t).matches()) {
                return ipv4(t);
            }
            if (t.indexOf(':') >= 0 && IPV6.matcher(t).matches()) {
                return InetAddress.getByName(t);
            }
        } catch (UnknownHostException | IllegalArgumentException e) {
            // IllegalArgumentException: algunas formas raras («1.2.3.4:80») la JDK las rechaza así
            return null;
        }
        return null;
    }

    /**
     * Arma la IPv4 a mano: «999.1.1.1» InetAddress no la toma como IP sino como nombre, y la buscaría en el DNS.
     */
    private static InetAddress ipv4(String t) throws UnknownHostException {
        String[] partes = t.split("\\.");
        byte[] bytes = new byte[4];
        for (int i = 0; i < 4; i++) {
            int n = Integer.parseInt(partes[i]);
            if (n > 255) {
                return null;
            }
            bytes[i] = (byte) n;
        }
        return InetAddress.getByAddress(bytes);
    }
}
