package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.instituciones.api.Rol;
import java.util.Set;

/** Una institución como la ve alguien: con sus roles ahí (ninguno si es el equipo mirando una escuela). */
public record InstitucionConRoles(Institucion institucion, Set<Rol> roles) {

    public InstitucionConRoles {
        roles = Set.copyOf(roles);
    }
}
