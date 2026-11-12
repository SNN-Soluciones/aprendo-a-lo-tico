package cr.aprendoalotico.api.instituciones.api;

import java.util.Set;
import java.util.UUID;

/**
 * Lo que una persona puede hacer en una institución de la que es miembro (B23). Si no es miembro, no hay Acceso: lo
 * de esa institución le da 404.
 */
public record Acceso(UUID institucion, TipoDeInstitucion tipo, Set<Rol> roles) {

    public Acceso {
        roles = Set.copyOf(roles);
    }

    /** Administra: los datos, los miembros, las invitaciones y los años lectivos. Ve todos los grupos. */
    public boolean administra() {
        return roles.contains(tipo.administra());
    }

    /** Crea grupos y puede ser docente de uno: en una escuela, docente o dirección; en un hogar, el encargado. */
    public boolean ensena() {
        return tipo == TipoDeInstitucion.ESCUELA ? roles.contains(Rol.DOCENTE) || roles.contains(Rol.DIRECCION)
                : roles.contains(Rol.ENCARGADO);
    }
}
