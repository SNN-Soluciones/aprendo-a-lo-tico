package cr.aprendoalotico.api.grupos;

import java.util.UUID;

/** Alguien que da clases en un grupo. La materia, solo si es de materia. */
public record Docente(UUID usuario, String nombre, Papel papel, String materia) {

    @Override
    public String toString() {
        return "Docente[usuario=" + usuario + ", papel=" + papel + "]";
    }
}
