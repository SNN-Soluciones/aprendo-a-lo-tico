package cr.aprendoalotico.api.identidad.api;

import java.util.UUID;

/**
 * Quién hace el pedido: la persona adulta con sesión abierta. Lo pone el filtro de sesión y los controladores lo
 * reciben con {@code @AuthenticationPrincipal UsuarioActual yo}. Los demás módulos lo usan para decidir qué puede ver.
 *
 * @param id     la cuenta
 * @param sesion la sesión con la que entró (para cerrarla o cambiarle el token)
 */
public record UsuarioActual(UUID id, UUID sesion, String correo, String nombre) {

    /** Para los logs: solo ids, nunca el correo ni el nombre. */
    @Override
    public String toString() {
        return "UsuarioActual[id=" + id + ", sesion=" + sesion + "]";
    }
}
