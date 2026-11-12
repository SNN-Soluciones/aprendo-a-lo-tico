package cr.aprendoalotico.api.identidad;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Los enlaces para poner una clave nueva (public.recuperaciones). */
@Repository
class Recuperaciones {

    private final JdbcClient jdbc;

    Recuperaciones(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    void crear(UUID usuario, byte[] tokenHash, Instant ahora, Instant expira) {
        jdbc.sql("""
                insert into public.recuperaciones (usuario_id, token_hash, creada_en, expira_en)
                values (:usuario, :token, :ahora, :expira)""")
                .param("usuario", usuario).param("token", tokenHash).param("ahora", Fechas.utc(ahora)).param("expira", Fechas.utc(expira)).update();
    }

    /**
     * La cuenta de ese enlace si no se usó ni venció. No traba nada: quien lo usa traba primero la cuenta
     * (Usuarios.trabar) y vuelve a preguntar, así dos enlaces de la misma cuenta se turnan en vez de trabarse.
     */
    Optional<UUID> cuentaDeVigente(byte[] tokenHash, Instant ahora) {
        return jdbc.sql("""
                select usuario_id from public.recuperaciones
                where token_hash = :token and usada_en is null and expira_en > :ahora""")
                .param("token", tokenHash).param("ahora", Fechas.utc(ahora)).query(UUID.class).optional();
    }

    /** Marca como usados todos los enlaces abiertos de la cuenta: con uno basta, los demás dejan de servir. */
    int usarTodas(UUID usuario, Instant ahora) {
        return jdbc.sql("update public.recuperaciones set usada_en = :ahora where usuario_id = :usuario and usada_en is null")
                .param("ahora", Fechas.utc(ahora)).param("usuario", usuario).update();
    }

    int borrarViejas(Instant antes) {
        return jdbc.sql("delete from public.recuperaciones where expira_en < :antes").param("antes", Fechas.utc(antes)).update();
    }
}
