package cr.aprendoalotico.api;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Stream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/** Las migraciones siguen la convención de snn-core: VYYYYMMDD_NN__descripcion.sql, con un comentario que dice el porqué. */
class MigracionesTest {

    private static final Path CARPETA = Path.of("src/main/resources/db/migration");

    /**
     * Lo que una migración normal no hace: borrar, renombrar, cambiar tipos, vaciar, ni tocar los candados de la
     * auditoría. Eso va en una migración aparte, después (expandir → migrar → contraer), revisada a mano.
     */
    private static final List<Pattern> PROHIBIDO = Stream.of(
            "\\bdrop\\s+(table|column|trigger|function|index|schema|view|constraint)\\b",
            "\\brename\\s+(to|column|constraint)\\b",
            "\\balter\\s+column\\s+\\w+\\s+(set\\s+data\\s+)?type\\b",
            "\\b(disable|enable)\\s+trigger\\b",
            "\\bcreate\\s+or\\s+replace\\s+function\\s+public\\.auditoria",
            "(?m)^\\s*truncate\\b",
            "(?m)^\\s*delete\\s+from\\b")
            .map(r -> Pattern.compile(r, Pattern.CASE_INSENSITIVE))
            .toList();

    private static List<Path> migraciones() throws IOException {
        try (Stream<Path> archivos = Files.list(CARPETA)) {
            return archivos.sorted().toList();
        }
    }

    /** El SQL sin los comentarios de línea, que pueden mencionar lo prohibido para explicar por qué no se hace. */
    private static String sqlSinComentarios(Path m) throws IOException {
        return Files.readString(m).replaceAll("(?m)--.*$", "");
    }

    @Test
    @DisplayName("Cada migración se llama VYYYYMMDD_NN__descripcion_en_minusculas.sql")
    void nombres() throws IOException {
        assertThat(migraciones()).isNotEmpty()
                .allSatisfy(m -> assertThat(m.getFileName().toString()).matches("V20\\d{6}_\\d{2}__[a-z0-9_]+\\.sql"));
    }

    @Test
    @DisplayName("Cada migración empieza con un comentario que explica el porqué")
    void comentarioDeCabecera() throws IOException {
        assertThat(migraciones()).allSatisfy(m -> assertThat(Files.readString(m)).startsWith("--"));
    }

    @Test
    @DisplayName("Las migraciones solo expanden: nada de borrar, renombrar, cambiar tipos, vaciar ni tocar los candados")
    void soloExpanden() throws IOException {
        for (Path m : migraciones()) {
            String sql = sqlSinComentarios(m);
            assertThat(PROHIBIDO).as(m.getFileName().toString()).noneMatch(p -> p.matcher(sql).find());
        }
    }

    @Test
    @DisplayName("La lista de prohibidos detecta lo que tiene que detectar (si no, la prueba de arriba no probaría nada)")
    void loProhibidoSeDetecta() {
        List<String> malos = List.of("drop table x;", "ALTER TABLE public.auditoria DISABLE TRIGGER auditoria_sin_cambios;",
                "drop trigger auditoria_sin_cambios on public.auditoria;", "alter table t alter column c type text;",
                "create or replace function public.auditoria_solo_agregar() returns trigger", "truncate public.auditoria;",
                "delete from public.auditoria;", "alter table t rename column a to b;");
        assertThat(malos).allSatisfy(sql -> assertThat(PROHIBIDO).anyMatch(p -> p.matcher(sql).find()));
        assertThat(PROHIBIDO).noneMatch(p -> p.matcher("before update or delete on public.auditoria\n  before truncate on x").find());
    }
}
