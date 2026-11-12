package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.comun.Fechas;
import cr.aprendoalotico.api.comun.web.Pagina;
import cr.aprendoalotico.api.instituciones.api.Rol;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Los códigos para unirse (public.invitaciones, B22). Del código solo se guarda el hash. */
@Repository
class Invitaciones {

    /** La que se acaba de usar: a qué institución y con qué rol. */
    record Usada(UUID id, UUID institucion, Rol rol) {
    }

    private static final String PENDIENTES = "from public.invitaciones i where i.institucion_id = :institucion "
            + "and i.usada_en is null and i.revocada_en is null and i.expira_en > :ahora ";

    private final JdbcClient jdbc;

    Invitaciones(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    UUID crear(UUID institucion, Rol rol, byte[] codigoHash, UUID creadaPor, Instant ahora, Instant expira) {
        return jdbc.sql("""
                insert into public.invitaciones (institucion_id, rol, codigo_hash, creada_por, creada_en, expira_en)
                values (:institucion, :rol, :codigo, :por, :ahora, :expira) returning id""")
                .param("institucion", institucion).param("rol", rol.name()).param("codigo", codigoHash).param("por", creadaPor)
                .param("ahora", Fechas.utc(ahora)).param("expira", Fechas.utc(expira)).query(UUID.class).single();
    }

    long contarPendientes(UUID institucion, Instant ahora) {
        return jdbc.sql("select count(*) " + PENDIENTES).param("institucion", institucion).param("ahora", Fechas.utc(ahora))
                .query(Long.class).single();
    }

    Pagina.Leida<InvitacionPendiente> pendientes(UUID institucion, Instant ahora, Pagina pagina) {
        List<InvitacionPendiente> elementos = jdbc.sql("""
                select i.id, i.rol, u.nombre as creada_por, i.creada_en, i.expira_en
                from public.invitaciones i join public.usuarios u on u.id = i.creada_por
                where i.institucion_id = :institucion and i.usada_en is null and i.revocada_en is null and i.expira_en > :ahora
                order by i.creada_en desc, i.id limit :tamano offset :desde""")
                .param("institucion", institucion).param("ahora", Fechas.utc(ahora)).param("tamano", pagina.tamano())
                .param("desde", pagina.desde()).query(InvitacionPendiente.class).list();
        return new Pagina.Leida<>(elementos, contarPendientes(institucion, ahora));
    }

    /**
     * La usa, si todavía sirve: en una sola sentencia, así dos personas con el mismo código no la usan las dos. Vacío si
     * no existe, ya se usó, se revocó, venció o la sacó la misma persona (B22: para quien la escribe es lo mismo). Nadie
     * se da un rol a sí mismo: ni el equipo se hace dirección de una escuela con un código suyo.
     */
    Optional<Usada> usar(byte[] codigoHash, UUID usuario, Instant ahora) {
        return jdbc.sql("""
                update public.invitaciones set usada_en = :ahora, usada_por = :usuario
                where codigo_hash = :codigo and usada_en is null and revocada_en is null and expira_en > :ahora
                  and creada_por <> :usuario
                returning id, institucion_id as institucion, rol""")
                .param("ahora", Fechas.utc(ahora)).param("usuario", usuario).param("codigo", codigoHash).query(Usada.class).optional();
    }

    /** Revoca las pendientes que sacó esa persona ahí (la sacaron de la institución: sus códigos dejan de servir). */
    int revocarLasDe(UUID creadaPor, UUID institucion, Instant ahora) {
        return jdbc.sql("""
                update public.invitaciones set revocada_en = :ahora
                where creada_por = :por and institucion_id = :institucion and usada_en is null and revocada_en is null""")
                .param("ahora", Fechas.utc(ahora)).param("por", creadaPor).param("institucion", institucion).update();
    }

    /** Revoca una pendiente de esa institución. False si no había (ya se usó, ya se revocó o es de otra). */
    boolean revocar(UUID id, UUID institucion, Instant ahora) {
        return jdbc.sql("""
                update public.invitaciones set revocada_en = :ahora
                where id = :id and institucion_id = :institucion and usada_en is null and revocada_en is null""")
                .param("ahora", Fechas.utc(ahora)).param("id", id).param("institucion", institucion).update() == 1;
    }
}
