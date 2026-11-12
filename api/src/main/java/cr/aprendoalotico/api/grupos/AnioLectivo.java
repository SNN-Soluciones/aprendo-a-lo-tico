package cr.aprendoalotico.api.grupos;

import java.time.LocalDate;

/** El curso de una institución: el año y sus fechas (B24). */
public record AnioLectivo(int anio, LocalDate desde, LocalDate hasta) {
}
