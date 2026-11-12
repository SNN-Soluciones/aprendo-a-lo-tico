package cr.aprendoalotico.api.identidad;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.regex.Pattern;

/**
 * Los tokens de sesión, de confirmación y de recuperación: 32 bytes al azar (256 bits, imposibles de adivinar), en
 * base64url. En la base solo va su SHA-256 (DISENO.md, sección 3): con una copia de la base no se entra a nada.
 */
final class Tokens {

    private static final SecureRandom AZAR = new SecureRandom();
    private static final Pattern FORMATO = Pattern.compile("[A-Za-z0-9_-]{43}");

    private Tokens() {
    }

    static String nuevo() {
        byte[] bytes = new byte[32];
        AZAR.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    /** ¿Puede ser un token nuestro? Lo que no, se descarta sin ir a la base. */
    static boolean tieneFormato(String token) {
        return token != null && FORMATO.matcher(token).matches();
    }

    static byte[] hash(String token) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.US_ASCII));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Esta JVM no tiene SHA-256", e);
        }
    }
}
