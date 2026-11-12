package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.instituciones.api.Rol;
import java.util.Set;
import java.util.UUID;

/** Un miembro con todos sus roles vigentes. El correo, solo para quien administra (null para los demás). */
public record Miembro(UUID usuario, String nombre, String correo, Set<Rol> roles) {

    public Miembro {
        roles = Set.copyOf(roles);
    }

    Miembro sinCorreo() {
        return new Miembro(usuario, nombre, null, roles);
    }

    @Override
    public String toString() {
        return "Miembro[usuario=" + usuario + ", roles=" + roles + "]";
    }
}
