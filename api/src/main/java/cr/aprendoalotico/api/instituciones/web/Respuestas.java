package cr.aprendoalotico.api.instituciones.web;

import cr.aprendoalotico.api.instituciones.Institucion;
import cr.aprendoalotico.api.instituciones.InstitucionConRoles;
import cr.aprendoalotico.api.instituciones.ServicioInvitaciones.CodigoNuevo;
import cr.aprendoalotico.api.instituciones.api.Rol;
import cr.aprendoalotico.api.instituciones.api.TipoDeInstitucion;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

/** Lo que devuelven las rutas de instituciones. */
final class Respuestas {

    private Respuestas() {
    }

    record InstitucionVista(UUID id, TipoDeInstitucion tipo, String nombre, String codigoMep, String provincia, String canton,
            String direccionRegional, Set<Rol> roles) {

        static InstitucionVista de(InstitucionConRoles conRoles) {
            Institucion i = conRoles.institucion();
            return new InstitucionVista(i.id(), i.tipo(), i.nombre(), i.codigoMep(), i.provincia(), i.canton(), i.direccionRegional(),
                    conRoles.roles());
        }

        /** Para el equipo, que no es miembro: sin roles. */
        static InstitucionVista de(Institucion i) {
            return de(new InstitucionConRoles(i, Set.of()));
        }
    }

    /** El código sale una sola vez: aquí. */
    record CodigoVista(UUID id, String codigo, Rol rol, Instant expiraEn) {

        static CodigoVista de(CodigoNuevo c) {
            return new CodigoVista(c.id(), c.codigo(), c.rol(), c.expiraEn());
        }
    }
}
