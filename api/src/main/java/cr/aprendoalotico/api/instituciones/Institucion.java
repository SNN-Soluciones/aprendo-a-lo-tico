package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.instituciones.api.TipoDeInstitucion;
import java.util.UUID;

/** Una escuela o un hogar. Los datos de ubicación son solo de las escuelas (null en un hogar). */
public record Institucion(UUID id, TipoDeInstitucion tipo, String nombre, String codigoMep, String provincia, String canton,
        String direccionRegional) {
}
