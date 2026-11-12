package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.comun.Codigos;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

/** Los códigos de invitación (B22): 12 caracteres (60 bits), que se muestran en grupos de 4. */
final class CodigosDeInvitacion {

    static final int LARGO = 12;

    private CodigosDeInvitacion() {
    }

    /** Uno nuevo, listo para mostrar: «ABCD-EFGH-JKLM». */
    static String nuevo() {
        String c = Codigos.nuevo(LARGO);
        return c.substring(0, 4) + "-" + c.substring(4, 8) + "-" + c.substring(8);
    }

    /** El hash de lo que escribió la persona (con o sin guiones, en minúsculas): vacío si no tiene la forma de un código. */
    static Optional<byte[]> hash(String escrito) {
        String limpio = Codigos.limpio(escrito);
        return Codigos.valido(limpio, LARGO) ? Optional.of(sha256(limpio)) : Optional.empty();
    }

    private static byte[] sha256(String codigo) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(codigo.getBytes(StandardCharsets.US_ASCII));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Esta JVM no tiene SHA-256", e);
        }
    }
}
