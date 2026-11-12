package cr.aprendoalotico.api.grupos;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Los años lectivos (public.anios_lectivos): uno por institución y año. */
@Repository
class AniosLectivos {

    private final JdbcClient jdbc;

    AniosLectivos(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    /** El id del año; si no existía, lo crea del 1 de febrero al 15 de diciembre (B24). Dos a la vez no lo duplican. */
    UUID asegurar(UUID institucion, int anio) {
        jdbc.sql("""
                insert into public.anios_lectivos (institucion_id, anio, desde, hasta)
                values (:institucion, :anio, make_date(:anio, 2, 1), make_date(:anio, 12, 15))
                on conflict (institucion_id, anio) do nothing""")
                .param("institucion", institucion).param("anio", anio).update();
        return jdbc.sql("select id from public.anios_lectivos where institucion_id = :institucion and anio = :anio")
                .param("institucion", institucion).param("anio", anio).query(UUID.class).single();
    }

    /** Todos los de la institución, del más nuevo al más viejo (uno por año: no hace falta paginar). */
    List<AnioLectivo> de(UUID institucion) {
        return jdbc.sql("select anio, desde, hasta from public.anios_lectivos where institucion_id = :institucion order by anio desc")
                .param("institucion", institucion).query(AnioLectivo.class).list();
    }

    /** Pone las fechas de un año, y lo crea si todavía no existía. */
    void poner(UUID institucion, int anio, LocalDate desde, LocalDate hasta) {
        jdbc.sql("""
                insert into public.anios_lectivos (institucion_id, anio, desde, hasta) values (:institucion, :anio, :desde, :hasta)
                on conflict (institucion_id, anio) do update set desde = excluded.desde, hasta = excluded.hasta""")
                .param("institucion", institucion).param("anio", anio).param("desde", desde).param("hasta", hasta).update();
    }
}
