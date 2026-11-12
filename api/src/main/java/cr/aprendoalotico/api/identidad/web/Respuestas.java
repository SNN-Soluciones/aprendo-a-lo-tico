package cr.aprendoalotico.api.identidad.web;

import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import java.util.UUID;

/** Lo que devuelven las rutas de identidad. */
final class Respuestas {

    private Respuestas() {
    }

    /** Un mensaje para mostrar tal cual. */
    record Aviso(String mensaje) {
    }

    /** La persona con sesión: nunca más que esto (ni el hash de la clave, ni la sesión). */
    record Yo(UUID id, String correo, String nombre) {

        static Yo de(UsuarioActual u) {
            return new Yo(u.id(), u.correo(), u.nombre());
        }
    }
}
