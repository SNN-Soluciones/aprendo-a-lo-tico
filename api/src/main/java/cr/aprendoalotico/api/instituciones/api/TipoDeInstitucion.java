package cr.aprendoalotico.api.instituciones.api;

import java.util.Set;

/** Una escuela (la crea el equipo, B21) o un hogar (una familia sin escuela, que funciona igual). */
public enum TipoDeInstitucion {
    ESCUELA(Set.of(Rol.DOCENTE, Rol.DIRECCION), Rol.DIRECCION),
    HOGAR(Set.of(Rol.ENCARGADO), Rol.ENCARGADO);

    private final Set<Rol> roles;
    private final Rol administra;

    TipoDeInstitucion(Set<Rol> roles, Rol administra) {
        this.roles = roles;
        this.administra = administra;
    }

    /** Los roles que se pueden tener aquí (y que puede dar un código de invitación). */
    public Set<Rol> roles() {
        return roles;
    }

    /** El rol que administra: datos, miembros, invitaciones y años lectivos. */
    public Rol administra() {
        return administra;
    }
}
