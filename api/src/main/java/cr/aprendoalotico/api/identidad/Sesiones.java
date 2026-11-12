package cr.aprendoalotico.api.identidad;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Las sesiones abiertas (public.sesiones): se buscan por el hash del token de la cookie. */
@Repository
class Sesiones {

    /** Una sesión que todavía vale, con los datos de su cuenta. */
    record Valida(UUID sesion, UUID usuario, String correo, String nombre, OffsetDateTime vistaEn) {
    }

    private final JdbcClient jdbc;

    Sesiones(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    UUID crear(UUID usuario, byte[] tokenHash, Instant ahora, Instant expira, String agente) {
        return jdbc.sql("""
                insert into public.sesiones (usuario_id, token_hash, creada_en, vista_en, expira_en, agente)
                values (:usuario, :token, :ahora, :ahora, :expira, :agente) returning id""")
                .param("usuario", usuario).param("token", tokenHash).param("ahora", Fechas.utc(ahora)).param("expira", Fechas.utc(expira))
                .param("agente", agente).query(UUID.class).single();
    }

    /** Deja abiertas solo las «conservar» más nuevas de la cuenta. */
    int cerrarLasMasViejas(UUID usuario, int conservar, Instant ahora) {
        return jdbc.sql("""
                update public.sesiones set cerrada_en = :ahora
                where id in (select id from public.sesiones where usuario_id = :usuario and cerrada_en is null
                             order by creada_en desc, id offset :conservar)""")
                .param("ahora", Fechas.utc(ahora)).param("usuario", usuario).param("conservar", conservar).update();
    }

    /** La sesión de ese token si no está cerrada, no venció y se usó después de «vistaDesde». */
    Optional<Valida> valida(byte[] tokenHash, Instant ahora, Instant vistaDesde) {
        return jdbc.sql("""
                select s.id as sesion, u.id as usuario, u.correo, u.nombre, s.vista_en
                from public.sesiones s join public.usuarios u on u.id = s.usuario_id
                where s.token_hash = :token and s.cerrada_en is null and s.expira_en > :ahora and s.vista_en > :vistaDesde""")
                .param("token", tokenHash).param("ahora", Fechas.utc(ahora)).param("vistaDesde", Fechas.utc(vistaDesde))
                .query(Valida.class).optional();
    }

    void marcarVista(UUID sesion, Instant ahora) {
        jdbc.sql("update public.sesiones set vista_en = :ahora where id = :id").param("ahora", Fechas.utc(ahora)).param("id", sesion).update();
    }

    void cerrar(UUID sesion, Instant ahora) {
        jdbc.sql("update public.sesiones set cerrada_en = :ahora where id = :id and cerrada_en is null")
                .param("ahora", Fechas.utc(ahora)).param("id", sesion).update();
    }

    int cerrarTodas(UUID usuario, Instant ahora) {
        return jdbc.sql("update public.sesiones set cerrada_en = :ahora where usuario_id = :usuario and cerrada_en is null")
                .param("ahora", Fechas.utc(ahora)).param("usuario", usuario).update();
    }

    int cerrarOtras(UUID usuario, UUID salvo, Instant ahora) {
        return jdbc.sql("""
                update public.sesiones set cerrada_en = :ahora
                where usuario_id = :usuario and id <> :salvo and cerrada_en is null""")
                .param("ahora", Fechas.utc(ahora)).param("usuario", usuario).param("salvo", salvo).update();
    }

    /**
     * El token viejo deja de servir en el acto: lo que alguien haya copiado de esta sesión ya no entra. Solo si sigue
     * abierta: false si la cerraron (desde otro lado) mientras tanto.
     */
    boolean cambiarToken(UUID sesion, byte[] tokenHash) {
        return jdbc.sql("update public.sesiones set token_hash = :token where id = :id and cerrada_en is null")
                .param("token", tokenHash).param("id", sesion).update() == 1;
    }

    /** Borra las que ya no sirven desde antes de «antes» (cerradas, vencidas o abandonadas). */
    int borrarViejas(Instant antes, java.time.Duration sinUso) {
        return jdbc.sql("""
                delete from public.sesiones
                where coalesce(cerrada_en, least(expira_en, vista_en + make_interval(secs => :sinUso))) < :antes""")
                .param("sinUso", sinUso.toSeconds()).param("antes", Fechas.utc(antes)).update();
    }
}
