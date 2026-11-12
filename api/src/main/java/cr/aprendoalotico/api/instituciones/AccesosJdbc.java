package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.instituciones.api.Acceso;
import cr.aprendoalotico.api.instituciones.api.Accesos;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

/** Accesos leídos de las membresías vigentes: cada pedido mira la base, así que sacar a alguien vale en el acto. */
@Component
class AccesosJdbc implements Accesos {

    private final Membresias membresias;
    private final Instituciones instituciones;

    AccesosJdbc(Membresias membresias, Instituciones instituciones) {
        this.membresias = membresias;
        this.instituciones = instituciones;
    }

    @Override
    public Optional<Acceso> de(UUID usuario, UUID institucion) {
        return membresias.acceso(usuario, institucion);
    }

    @Override
    public Optional<Acceso> deTrabando(UUID usuario, UUID institucion) {
        instituciones.trabarCompartido(institucion);
        return membresias.acceso(usuario, institucion);
    }
}
