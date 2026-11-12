package cr.aprendoalotico.api.identidad;

import cr.aprendoalotico.api.comun.Fechas;
import java.time.Instant;
import java.util.Optional;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Los pedidos de cuenta que todavía no se confirmaron (public.registros_pendientes, B18): solo el correo y el token. */
@Repository
class RegistrosPendientes {

    private final JdbcClient jdbc;

    RegistrosPendientes(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    void crear(String correo, byte[] tokenHash, Instant ahora, Instant expira) {
        jdbc.sql("""
                insert into public.registros_pendientes (correo, token_hash, creado_en, expira_en)
                values (:correo, :token, :ahora, :expira)""")
                .param("correo", correo).param("token", tokenHash).param("ahora", Fechas.utc(ahora)).param("expira", Fechas.utc(expira))
                .update();
    }

    /** El correo de ese token si todavía vale (sin trabar nada: para descartar enlaces malos antes de calcular la clave). */
    Optional<String> correoDeVigente(byte[] tokenHash, Instant ahora) {
        return jdbc.sql("select correo from public.registros_pendientes where token_hash = :token and expira_en > :ahora")
                .param("token", tokenHash).param("ahora", Fechas.utc(ahora)).query(String.class).optional();
    }

    /**
     * Traba ese correo hasta el fin de la transacción. Dos enlaces del mismo correo abiertos a la vez se turnan: sin
     * esto, cada uno trababa su fila y esperaba la del otro para borrarla (un deadlock, que PostgreSQL corta con un 500).
     */
    void trabar(String correo) {
        jdbc.sql("select pg_advisory_xact_lock(hashtextextended('registro:' || :correo, 0))").param("correo", correo)
                .query((rs, n) -> 1).list();
    }

    void borrarDe(String correo) {
        jdbc.sql("delete from public.registros_pendientes where correo = :correo").param("correo", correo).update();
    }

    int borrarVencidos(Instant antes) {
        return jdbc.sql("delete from public.registros_pendientes where expira_en < :antes").param("antes", Fechas.utc(antes)).update();
    }
}
