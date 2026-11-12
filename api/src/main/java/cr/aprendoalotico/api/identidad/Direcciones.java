package cr.aprendoalotico.api.identidad;

import java.util.Locale;

/** Los correos se comparan y se guardan en minúsculas y sin espacios: «Maria@X.cr » y «maria@x.cr» son la misma cuenta. */
final class Direcciones {

    private Direcciones() {
    }

    static String normalizar(String correo) {
        return correo.strip().toLowerCase(Locale.ROOT);
    }
}
