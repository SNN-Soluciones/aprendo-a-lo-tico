package cr.aprendoalotico.api.grupos;

import java.util.UUID;

/** Un grupo («2-3» del 2027): grado de 0 (preparatoria) a 6, sección y su código de clase. */
public record Grupo(UUID id, UUID institucion, int anio, int grado, String seccion, String codigoClase) {
}
