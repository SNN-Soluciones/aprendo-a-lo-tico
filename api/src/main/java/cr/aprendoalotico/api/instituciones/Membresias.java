package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.comun.Fechas;
import cr.aprendoalotico.api.comun.web.Pagina;
import cr.aprendoalotico.api.instituciones.api.Acceso;
import cr.aprendoalotico.api.instituciones.api.Rol;
import cr.aprendoalotico.api.instituciones.api.TipoDeInstitucion;
import java.time.Instant;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Quién es qué en cada institución (public.membresias). Las vigentes son las que no tienen «hasta». */
@Repository
class Membresias {

    private record Fila(String tipo, String rol) {
    }

    private record FilaDeMiembro(UUID usuario, String nombre, String correo, String roles) {
    }

    private final JdbcClient jdbc;

    Membresias(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    Optional<Acceso> acceso(UUID usuario, UUID institucion) {
        List<Fila> filas = jdbc.sql("""
                select i.tipo, m.rol from public.instituciones i
                join public.membresias m on m.institucion_id = i.id and m.usuario_id = :usuario and m.hasta is null
                where i.id = :institucion""")
                .param("usuario", usuario).param("institucion", institucion).query(Fila.class).list();
        if (filas.isEmpty()) {
            return Optional.empty();
        }
        Set<Rol> roles = filas.stream().map(f -> Rol.valueOf(f.rol())).collect(Collectors.toCollection(() -> EnumSet.noneOf(Rol.class)));
        return Optional.of(new Acceso(institucion, TipoDeInstitucion.valueOf(filas.get(0).tipo()), roles));
    }

    /** Le da un rol. Si ya lo tiene vigente, DuplicateKeyException. */
    void agregar(UUID usuario, UUID institucion, Rol rol, Instant ahora) {
        jdbc.sql("insert into public.membresias (usuario_id, institucion_id, rol, desde) values (:usuario, :institucion, :rol, :ahora)")
                .param("usuario", usuario).param("institucion", institucion).param("rol", rol.name()).param("ahora", Fechas.utc(ahora))
                .update();
    }

    /** Le cierra todos los roles en esa institución. Cuántos cerró. */
    int retirar(UUID usuario, UUID institucion, Instant ahora) {
        return jdbc.sql("""
                update public.membresias set hasta = :ahora
                where usuario_id = :usuario and institucion_id = :institucion and hasta is null""")
                .param("ahora", Fechas.utc(ahora)).param("usuario", usuario).param("institucion", institucion).update();
    }

    /** En cuántos hogares es encargado (para el tope de hogares por cuenta). */
    long hogaresDe(UUID usuario) {
        return jdbc.sql("""
                select count(*) from public.membresias m join public.instituciones i on i.id = m.institucion_id
                where m.usuario_id = :usuario and m.hasta is null and i.tipo = 'HOGAR' and m.rol = 'ENCARGADO'""")
                .param("usuario", usuario).query(Long.class).single();
    }

    /** Cuántas personas tienen ese rol vigente ahí. */
    long conRol(UUID institucion, Rol rol) {
        return jdbc.sql("select count(*) from public.membresias where institucion_id = :institucion and rol = :rol and hasta is null")
                .param("institucion", institucion).param("rol", rol.name()).query(Long.class).single();
    }

    /** Los miembros vigentes, por nombre, cada uno con sus roles. */
    Pagina.Leida<Miembro> miembros(UUID institucion, Pagina pagina) {
        List<Miembro> elementos = jdbc.sql("""
                select u.id as usuario, u.nombre, u.correo, string_agg(m.rol, ',' order by m.rol) as roles
                from public.membresias m join public.usuarios u on u.id = m.usuario_id
                where m.institucion_id = :institucion and m.hasta is null
                group by u.id, u.nombre, u.correo
                order by u.nombre, u.id limit :tamano offset :desde""")
                .param("institucion", institucion).param("tamano", pagina.tamano()).param("desde", pagina.desde())
                .query(FilaDeMiembro.class).list().stream()
                .map(f -> new Miembro(f.usuario(), f.nombre(), f.correo(), Roles.de(f.roles())))
                .toList();
        long total = jdbc.sql("select count(distinct usuario_id) from public.membresias where institucion_id = :institucion and hasta is null")
                .param("institucion", institucion).query(Long.class).single();
        return new Pagina.Leida<>(elementos, total);
    }
}
