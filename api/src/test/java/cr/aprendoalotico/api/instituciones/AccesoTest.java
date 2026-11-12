package cr.aprendoalotico.api.instituciones;

import static org.assertj.core.api.Assertions.assertThat;

import cr.aprendoalotico.api.instituciones.api.Acceso;
import cr.aprendoalotico.api.instituciones.api.Rol;
import cr.aprendoalotico.api.instituciones.api.TipoDeInstitucion;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class AccesoTest {

    private static Acceso en(TipoDeInstitucion tipo, Rol... roles) {
        return new Acceso(UUID.randomUUID(), tipo, Set.of(roles));
    }

    @Test
    @DisplayName("En una escuela administra la dirección y dan clases docente y dirección (B23)")
    void escuela() {
        assertThat(en(TipoDeInstitucion.ESCUELA, Rol.DIRECCION).administra()).isTrue();
        assertThat(en(TipoDeInstitucion.ESCUELA, Rol.DIRECCION).ensena()).isTrue();
        assertThat(en(TipoDeInstitucion.ESCUELA, Rol.DOCENTE).administra()).isFalse();
        assertThat(en(TipoDeInstitucion.ESCUELA, Rol.DOCENTE).ensena()).isTrue();
        assertThat(en(TipoDeInstitucion.ESCUELA, Rol.ENCARGADO).ensena()).isFalse();
    }

    @Test
    @DisplayName("En un hogar el encargado hace todo; solo ahí se puede ser encargado por código")
    void hogar() {
        assertThat(en(TipoDeInstitucion.HOGAR, Rol.ENCARGADO).administra()).isTrue();
        assertThat(en(TipoDeInstitucion.HOGAR, Rol.ENCARGADO).ensena()).isTrue();
        assertThat(TipoDeInstitucion.HOGAR.roles()).containsExactly(Rol.ENCARGADO);
        assertThat(TipoDeInstitucion.ESCUELA.roles()).containsExactlyInAnyOrder(Rol.DOCENTE, Rol.DIRECCION);
    }

    @Test
    @DisplayName("Los roles no se pueden cambiar desde afuera")
    void inmutable() {
        var roles = new java.util.HashSet<>(Set.of(Rol.DOCENTE));
        var acceso = new Acceso(UUID.randomUUID(), TipoDeInstitucion.ESCUELA, roles);
        roles.add(Rol.DIRECCION);
        assertThat(acceso.administra()).isFalse();
    }
}
