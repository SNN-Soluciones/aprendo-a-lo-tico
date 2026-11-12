package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.instituciones.api.Rol;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.Set;
import java.util.stream.Collectors;

/** Los roles como los junta la base (string_agg: «DIRECCION,DOCENTE»). */
final class Roles {

    private Roles() {
    }

    static Set<Rol> de(String juntos) {
        return Arrays.stream(juntos.split(",")).map(Rol::valueOf).collect(Collectors.toCollection(() -> EnumSet.noneOf(Rol.class)));
    }
}
