package cr.aprendoalotico.api.comun;

import java.security.SecureRandom;
import java.util.Locale;

/**
 * Códigos para dictar y copiar a mano (B22, B24): de clase y de invitación. Sin 0, O, 1 ni I, que se confunden al
 * leerlos en una tarjeta o en un WhatsApp: 32 caracteres, 5 bits cada uno.
 */
public final class Codigos {

    public static final String ALFABETO = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final SecureRandom AZAR = new SecureRandom();

    private Codigos() {
    }

    /** «largo» caracteres al azar del alfabeto. */
    public static String nuevo(int largo) {
        var codigo = new StringBuilder(largo);
        for (int i = 0; i < largo; i++) {
            codigo.append(ALFABETO.charAt(AZAR.nextInt(ALFABETO.length())));
        }
        return codigo.toString();
    }

    /** Como lo escribe la persona («abcd-efgh jkl»): en mayúsculas y sin espacios ni guiones. */
    public static String limpio(String escrito) {
        return escrito == null ? "" : escrito.replaceAll("[\\s-]", "").toUpperCase(Locale.ROOT);
    }

    /** Si son «largo» caracteres del alfabeto (ya limpios). */
    public static boolean valido(String codigo, int largo) {
        return codigo.length() == largo && codigo.chars().allMatch(c -> ALFABETO.indexOf(c) >= 0);
    }
}
