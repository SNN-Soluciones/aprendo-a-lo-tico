package cr.aprendoalotico.api.instituciones;

/** Lo que se escribe de una institución (ya validado en el formulario). */
public record DatosDeInstitucion(String nombre, String codigoMep, String provincia, String canton, String direccionRegional) {

    public static DatosDeInstitucion deUnHogar(String nombre) {
        return new DatosDeInstitucion(nombre, null, null, null, null);
    }
}
