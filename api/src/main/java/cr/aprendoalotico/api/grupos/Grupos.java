package cr.aprendoalotico.api.grupos;

import cr.aprendoalotico.api.comun.Fechas;
import cr.aprendoalotico.api.comun.web.Pagina;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Los grupos (public.grupos), con su año lectivo para saber de qué institución y de qué año son. */
@Repository
class Grupos {

    private static final String COLUMNAS = """
            select g.id, a.institucion_id as institucion, a.anio, g.grado, g.seccion, g.codigo_clase
            from public.grupos g join public.anios_lectivos a on a.id = g.anio_lectivo_id
            """;
    private static final String ORDEN = " order by a.anio desc, g.grado, g.seccion, g.id limit :tamano offset :desde";

    private final JdbcClient jdbc;

    Grupos(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Crea el grupo. Vacío si el código de clase ya lo tiene otro (se prueba con otro); DuplicateKeyException si ya hay
     * un grupo con ese grado y sección ese año.
     */
    Optional<UUID> crear(UUID anioLectivo, int grado, String seccion, String codigo, Instant ahora) {
        return jdbc.sql("""
                insert into public.grupos (anio_lectivo_id, grado, seccion, codigo_clase, creado_en)
                values (:anio, :grado, :seccion, :codigo, :ahora)
                on conflict (codigo_clase) do nothing returning id""")
                .param("anio", anioLectivo).param("grado", grado).param("seccion", seccion).param("codigo", codigo)
                .param("ahora", Fechas.utc(ahora)).query(UUID.class).optional();
    }

    Optional<Grupo> porId(UUID id) {
        return jdbc.sql(COLUMNAS + "where g.id = :id").param("id", id).query(Grupo.class).optional();
    }

    /** Los de una institución (de un año, si se dice); con «soloDe», solo aquellos en los que esa persona da clases. */
    Pagina.Leida<Grupo> deInstitucion(UUID institucion, Integer anio, UUID soloDe, Pagina pagina) {
        String donde = "where a.institucion_id = :institucion and (cast(:anio as integer) is null or a.anio = :anio) "
                + "and (cast(:soloDe as uuid) is null or exists (select 1 from public.docentes_grupo d "
                + "where d.grupo_id = g.id and d.usuario_id = :soloDe)) ";
        List<Grupo> elementos = jdbc.sql(COLUMNAS + donde + ORDEN).param("institucion", institucion).param("anio", anio)
                .param("soloDe", soloDe).param("tamano", pagina.tamano()).param("desde", pagina.desde()).query(Grupo.class).list();
        long total = jdbc.sql("select count(*) from public.grupos g join public.anios_lectivos a on a.id = g.anio_lectivo_id " + donde)
                .param("institucion", institucion).param("anio", anio).param("soloDe", soloDe).query(Long.class).single();
        return new Pagina.Leida<>(elementos, total);
    }

    /**
     * Aquellos en los que da clases, de las instituciones de las que sigue siendo miembro. Sacarlo de una institución ya
     * lo saca de sus grupos ahí (MiembroRetirado); esto lo mira igual, por si una fila quedara de más.
     */
    Pagina.Leida<Grupo> delDocente(UUID usuario, Pagina pagina) {
        String donde = "where exists (select 1 from public.docentes_grupo d where d.grupo_id = g.id and d.usuario_id = :usuario) "
                + "and exists (select 1 from public.membresias m where m.usuario_id = :usuario and m.institucion_id = a.institucion_id "
                + "and m.hasta is null) ";
        List<Grupo> elementos = jdbc.sql(COLUMNAS + donde + ORDEN).param("usuario", usuario).param("tamano", pagina.tamano())
                .param("desde", pagina.desde()).query(Grupo.class).list();
        long total = jdbc.sql("select count(*) from public.grupos g join public.anios_lectivos a on a.id = g.anio_lectivo_id " + donde)
                .param("usuario", usuario).query(Long.class).single();
        return new Pagina.Leida<>(elementos, total);
    }

    /** Si ya hay otro con ese grado y sección ese año, DuplicateKeyException. */
    void cambiar(UUID id, int grado, String seccion) {
        jdbc.sql("update public.grupos set grado = :grado, seccion = :seccion where id = :id")
                .param("grado", grado).param("seccion", seccion).param("id", id).update();
    }

    /** False si ese código ya lo tiene otro grupo (se prueba con otro). */
    boolean cambiarCodigo(UUID id, String codigo) {
        try {
            jdbc.sql("update public.grupos set codigo_clase = :codigo where id = :id").param("codigo", codigo).param("id", id).update();
            return true;
        } catch (DuplicateKeyException e) {
            return false;
        }
    }

    /** Traba el grupo hasta el fin de la transacción: los cambios de docentes se turnan. */
    void trabar(UUID id) {
        jdbc.sql("select id from public.grupos where id = :id for update").param("id", id).query(UUID.class).optional();
    }
}
