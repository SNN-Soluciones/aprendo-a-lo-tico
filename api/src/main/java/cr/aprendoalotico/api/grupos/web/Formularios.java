package cr.aprendoalotico.api.grupos.web;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.Locale;

/** Lo que mandan las pantallas de grupos, con sus reglas (los errores vuelven en error.campos). */
final class Formularios {

    private Formularios() {
    }

    static final String SECCION = "[0-9A-Za-z]{1,4}";
    static final String MENSAJE_GRADO = "El grado va de 0 (preparatoria) a 6";
    static final String MENSAJE_SECCION = "La sección son hasta 4 letras o números";
    /** Una materia: letras y espacios («Inglés», «Educación Física»). */
    static final String MATERIA = "[\\p{L}\\p{M}][\\p{L}\\p{M} .'’-]*";

    static String enMayusculas(String escrita) {
        return escrita == null ? null : escrita.strip().toUpperCase(Locale.ROOT);
    }

    record NuevoGrupo(
            @NotNull(message = "Falta el año") @Min(value = 2020, message = "Ese año no es válido") @Max(value = 2100, message = "Ese año no es válido")
            Integer anio,
            @NotNull(message = MENSAJE_GRADO) @Min(value = 0, message = MENSAJE_GRADO) @Max(value = 6, message = MENSAJE_GRADO) Integer grado,
            @NotBlank(message = MENSAJE_SECCION) @Pattern(regexp = SECCION, message = MENSAJE_SECCION) String seccion) {

        NuevoGrupo {
            seccion = enMayusculas(seccion);
        }
    }

    record CambioDeGrupo(
            @NotNull(message = MENSAJE_GRADO) @Min(value = 0, message = MENSAJE_GRADO) @Max(value = 6, message = MENSAJE_GRADO) Integer grado,
            @NotBlank(message = MENSAJE_SECCION) @Pattern(regexp = SECCION, message = MENSAJE_SECCION) String seccion) {

        CambioDeGrupo {
            seccion = enMayusculas(seccion);
        }
    }

    record DocenteDelGrupo(
            @NotNull(message = "Falta el papel") @Pattern(regexp = "TITULAR|MATERIA", message = "El papel es TITULAR o MATERIA") String papel,
            @Size(max = 40, message = "La materia puede tener hasta 40 letras") @Pattern(regexp = MATERIA, message = "Escribí solo el nombre de la materia")
            String materia) {

        DocenteDelGrupo {
            materia = materia == null || materia.isBlank() ? null : materia.strip().replaceAll("\\s+", " ");
        }
    }

    record Fechas(@NotNull(message = "Falta la fecha de inicio") LocalDate desde, @NotNull(message = "Falta la fecha de cierre") LocalDate hasta) {
    }
}
