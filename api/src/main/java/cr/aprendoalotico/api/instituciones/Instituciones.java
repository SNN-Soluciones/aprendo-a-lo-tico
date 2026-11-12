package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.comun.Fechas;
import cr.aprendoalotico.api.comun.web.Pagina;
import cr.aprendoalotico.api.instituciones.api.TipoDeInstitucion;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Las escuelas y los hogares (public.instituciones). */
@Repository
class Instituciones {

    private static final String COLUMNAS = "select id, tipo, nombre, codigo_mep, provincia, canton, direccion_regional from public.instituciones ";

    private final JdbcClient jdbc;

    Instituciones(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    /** Si el código MEP ya lo tiene otra escuela, DuplicateKeyException. */
    UUID crear(TipoDeInstitucion tipo, DatosDeInstitucion d, Instant ahora) {
        return jdbc.sql("""
                insert into public.instituciones (tipo, nombre, codigo_mep, provincia, canton, direccion_regional, creada_en)
                values (:tipo, :nombre, :mep, :provincia, :canton, :regional, :ahora) returning id""")
                .param("tipo", tipo.name()).param("nombre", d.nombre()).param("mep", d.codigoMep()).param("provincia", d.provincia())
                .param("canton", d.canton()).param("regional", d.direccionRegional()).param("ahora", Fechas.utc(ahora))
                .query(UUID.class).single();
    }

    Optional<Institucion> porId(UUID id) {
        return jdbc.sql(COLUMNAS + "where id = :id").param("id", id).query(Institucion.class).optional();
    }

    /** Cambia los datos; el código MEP, solo si «conCodigoMep» (lo cambia el equipo, no la escuela). */
    void cambiar(UUID id, DatosDeInstitucion d, boolean conCodigoMep) {
        jdbc.sql("""
                update public.instituciones set nombre = :nombre, provincia = :provincia, canton = :canton,
                       direccion_regional = :regional, codigo_mep = case when :conMep then :mep else codigo_mep end
                where id = :id""")
                .param("nombre", d.nombre()).param("provincia", d.provincia()).param("canton", d.canton())
                .param("regional", d.direccionRegional()).param("conMep", conCodigoMep).param("mep", d.codigoMep()).param("id", id)
                .update();
    }

    /** Todas las escuelas, por nombre (para el equipo). */
    Pagina.Leida<Institucion> escuelas(Pagina pagina) {
        List<Institucion> elementos = jdbc.sql(COLUMNAS + "where tipo = 'ESCUELA' order by nombre, id limit :tamano offset :desde")
                .param("tamano", pagina.tamano()).param("desde", pagina.desde()).query(Institucion.class).list();
        long total = jdbc.sql("select count(*) from public.instituciones where tipo = 'ESCUELA'").query(Long.class).single();
        return new Pagina.Leida<>(elementos, total);
    }

    private record FilaConRoles(UUID id, TipoDeInstitucion tipo, String nombre, String codigoMep, String provincia, String canton,
            String direccionRegional, String roles) {
    }

    /** Las instituciones de las que es miembro, por nombre, con sus roles en cada una. */
    Pagina.Leida<InstitucionConRoles> delUsuario(UUID usuario, Pagina pagina) {
        List<InstitucionConRoles> elementos = jdbc.sql("""
                select i.id, i.tipo, i.nombre, i.codigo_mep, i.provincia, i.canton, i.direccion_regional,
                       string_agg(m.rol, ',' order by m.rol) as roles
                from public.instituciones i join public.membresias m on m.institucion_id = i.id
                where m.usuario_id = :usuario and m.hasta is null
                group by i.id order by i.nombre, i.id limit :tamano offset :desde""")
                .param("usuario", usuario).param("tamano", pagina.tamano()).param("desde", pagina.desde())
                .query(FilaConRoles.class).list().stream()
                .map(f -> new InstitucionConRoles(new Institucion(f.id(), f.tipo(), f.nombre(), f.codigoMep(), f.provincia(), f.canton(),
                        f.direccionRegional()), Roles.de(f.roles())))
                .toList();
        long total = jdbc.sql("select count(distinct institucion_id) from public.membresias where usuario_id = :usuario and hasta is null")
                .param("usuario", usuario).query(Long.class).single();
        return new Pagina.Leida<>(elementos, total);
    }

    /** Traba la institución hasta el fin de la transacción: los cambios de miembros se turnan. */
    void trabar(UUID id) {
        jdbc.sql("select id from public.instituciones where id = :id for update").param("id", id).query(UUID.class).optional();
    }

    /** Traba compartido: varios pueden a la vez, pero nadie la traba para cambiar miembros hasta que terminen. */
    void trabarCompartido(UUID id) {
        jdbc.sql("select id from public.instituciones where id = :id for share").param("id", id).query(UUID.class).optional();
    }
}
