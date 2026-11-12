package cr.aprendoalotico.api.instituciones.web;

import cr.aprendoalotico.api.instituciones.DatosDeInstitucion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Lo que mandan las pantallas de instituciones, con sus reglas (los errores vuelven en error.campos). */
final class Formularios {

    private Formularios() {
    }

    /** Un nombre de escuela u hogar: letras, números y la puntuación de un nombre («Escuela N.° 3», «CEN-CINAI»). */
    static final String NOMBRE = "[\\p{L}\\p{M}0-9][\\p{L}\\p{M}0-9 .,'’()°º#/&-]*";
    /** Un lugar (cantón, dirección regional): letras, espacios y poco más. */
    static final String LUGAR = "[\\p{L}\\p{M}][\\p{L}\\p{M}0-9 .'’-]*";
    static final String PROVINCIA = "SAN_JOSE|ALAJUELA|CARTAGO|HEREDIA|GUANACASTE|PUNTARENAS|LIMON";
    static final String ROL = "DOCENTE|DIRECCION|ENCARGADO";

    /** Espacios de más fuera; vacío queda null (los campos opcionales). */
    static String limpio(String texto) {
        if (texto == null) {
            return null;
        }
        String l = texto.strip().replaceAll("\\s+", " ");
        return l.isEmpty() ? null : l;
    }

    /** Una escuela, como la escribe el equipo (con el código MEP). */
    record Escuela(
            @NotBlank(message = "Escribí el nombre") @Size(max = 120, message = "El nombre puede tener hasta 120 caracteres")
            @Pattern(regexp = NOMBRE, message = "Ese nombre tiene caracteres que no van") String nombre,
            @Pattern(regexp = "[0-9]{1,8}", message = "El código del MEP son solo números") String codigoMep,
            @Pattern(regexp = PROVINCIA, message = "Esa provincia no existe") String provincia,
            @Size(max = 60, message = "El cantón puede tener hasta 60 caracteres") @Pattern(regexp = LUGAR, message = "Ese cantón no es válido") String canton,
            @Size(max = 80, message = "La dirección regional puede tener hasta 80 caracteres")
            @Pattern(regexp = LUGAR, message = "Esa dirección regional no es válida") String direccionRegional) {

        Escuela {
            nombre = limpio(nombre);
            codigoMep = limpio(codigoMep);
            provincia = limpio(provincia);
            canton = limpio(canton);
            direccionRegional = limpio(direccionRegional);
        }

        DatosDeInstitucion datos() {
            return new DatosDeInstitucion(nombre, codigoMep, provincia, canton, direccionRegional);
        }
    }

    /** Lo que cambia quien administra (sin el código MEP; en un hogar, solo cuenta el nombre). */
    record Datos(
            @NotBlank(message = "Escribí el nombre") @Size(max = 120, message = "El nombre puede tener hasta 120 caracteres")
            @Pattern(regexp = NOMBRE, message = "Ese nombre tiene caracteres que no van") String nombre,
            @Pattern(regexp = PROVINCIA, message = "Esa provincia no existe") String provincia,
            @Size(max = 60, message = "El cantón puede tener hasta 60 caracteres") @Pattern(regexp = LUGAR, message = "Ese cantón no es válido") String canton,
            @Size(max = 80, message = "La dirección regional puede tener hasta 80 caracteres")
            @Pattern(regexp = LUGAR, message = "Esa dirección regional no es válida") String direccionRegional) {

        Datos {
            nombre = limpio(nombre);
            provincia = limpio(provincia);
            canton = limpio(canton);
            direccionRegional = limpio(direccionRegional);
        }

        DatosDeInstitucion datos() {
            return new DatosDeInstitucion(nombre, null, provincia, canton, direccionRegional);
        }
    }

    record Hogar(
            @NotBlank(message = "Escribí el nombre") @Size(max = 120, message = "El nombre puede tener hasta 120 caracteres")
            @Pattern(regexp = NOMBRE, message = "Ese nombre tiene caracteres que no van") String nombre) {

        Hogar {
            nombre = limpio(nombre);
        }
    }

    record NuevaInvitacion(@NotNull(message = "Falta el rol") @Pattern(regexp = ROL, message = "Ese rol no existe") String rol) {
    }

    record Aceptar(@NotBlank(message = "Escribí el código") @Size(max = 40, message = "Ese código no es válido") String codigo) {

        @Override
        public String toString() {
            return "Aceptar[]";
        }
    }
}
