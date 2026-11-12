package cr.aprendoalotico.api.grupos.web;

import cr.aprendoalotico.api.grupos.Docente;
import cr.aprendoalotico.api.grupos.Grupo;
import cr.aprendoalotico.api.grupos.Papel;
import cr.aprendoalotico.api.grupos.ServicioGrupos.Detalle;
import java.util.List;
import java.util.UUID;

/** Lo que devuelven las rutas de grupos. */
final class Respuestas {

    private Respuestas() {
    }

    /** Un grupo con sus docentes, mi papel ahí (null si no doy clases) y si lo puedo cambiar. */
    record GrupoVista(UUID id, UUID institucion, int anio, int grado, String seccion, String codigoClase, List<Docente> docentes,
            Papel miPapel, boolean puedoCambiar) {

        static GrupoVista de(Detalle d) {
            Grupo g = d.grupo();
            return new GrupoVista(g.id(), g.institucion(), g.anio(), g.grado(), g.seccion(), g.codigoClase(), d.docentes(), d.miPapel(),
                    d.puedoCambiar());
        }
    }
}
