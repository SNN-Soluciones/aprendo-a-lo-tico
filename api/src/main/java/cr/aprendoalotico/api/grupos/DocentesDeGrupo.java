package cr.aprendoalotico.api.grupos;

import cr.aprendoalotico.api.comun.Fechas;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Quién da clases en cada grupo (public.docentes_grupo). */
@Repository
class DocentesDeGrupo {

    private final JdbcClient jdbc;

    DocentesDeGrupo(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    /** Los de un grupo: la titular primero y después por nombre. */
    List<Docente> de(UUID grupo) {
        return jdbc.sql("""
                select d.usuario_id as usuario, u.nombre, d.papel, d.materia
                from public.docentes_grupo d join public.usuarios u on u.id = d.usuario_id
                where d.grupo_id = :grupo order by d.papel desc, u.nombre, u.id""")
                .param("grupo", grupo).query(Docente.class).list();
    }

    Optional<Papel> papel(UUID grupo, UUID usuario) {
        return jdbc.sql("select papel from public.docentes_grupo where grupo_id = :grupo and usuario_id = :usuario")
                .param("grupo", grupo).param("usuario", usuario).query(String.class).optional().map(Papel::valueOf);
    }

    /** Lo pone (o le cambia el papel). Una titular nueva reemplaza a la anterior, que deja el grupo. */
    void poner(UUID grupo, UUID usuario, Papel papel, String materia, Instant ahora) {
        if (papel == Papel.TITULAR) {
            jdbc.sql("delete from public.docentes_grupo where grupo_id = :grupo and papel = 'TITULAR' and usuario_id <> :usuario")
                    .param("grupo", grupo).param("usuario", usuario).update();
        }
        jdbc.sql("""
                insert into public.docentes_grupo (grupo_id, usuario_id, papel, materia, desde) values (:grupo, :usuario, :papel, :materia, :ahora)
                on conflict (grupo_id, usuario_id) do update set papel = excluded.papel, materia = excluded.materia""")
                .param("grupo", grupo).param("usuario", usuario).param("papel", papel.name()).param("materia", materia)
                .param("ahora", Fechas.utc(ahora)).update();
    }

    boolean quitar(UUID grupo, UUID usuario) {
        return jdbc.sql("delete from public.docentes_grupo where grupo_id = :grupo and usuario_id = :usuario")
                .param("grupo", grupo).param("usuario", usuario).update() == 1;
    }

    /** Lo saca de todos los grupos de esa institución (lo sacaron de ella). */
    int quitarDeInstitucion(UUID usuario, UUID institucion) {
        return jdbc.sql("""
                delete from public.docentes_grupo d using public.grupos g, public.anios_lectivos a
                where d.grupo_id = g.id and g.anio_lectivo_id = a.id and d.usuario_id = :usuario and a.institucion_id = :institucion""")
                .param("usuario", usuario).param("institucion", institucion).update();
    }
}
