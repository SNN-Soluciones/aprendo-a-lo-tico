package cr.aprendoalotico.api.identidad;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Las cuentas (public.usuarios). */
@Repository
class Usuarios {

    /** Una cuenta, con el hash de la clave: no sale de este módulo. */
    record Usuario(UUID id, String correo, String nombre, String claveHash) {

        @Override
        public String toString() {
            return "Usuario[id=" + id + "]";
        }
    }

    private static final String COLUMNAS = "select id, correo, nombre, clave_hash from public.usuarios ";

    private final JdbcClient jdbc;

    Usuarios(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    Optional<Usuario> porCorreo(String correo) {
        return jdbc.sql(COLUMNAS + "where correo = :correo").param("correo", correo).query(Usuario.class).optional();
    }

    Optional<Usuario> porId(UUID id) {
        return jdbc.sql(COLUMNAS + "where id = :id").param("id", id).query(Usuario.class).optional();
    }

    /** Crea la cuenta ya confirmada. Si el correo ya tiene una, DuplicateKeyException. */
    UUID crear(String correo, String nombre, String claveHash, Instant ahora) {
        return jdbc.sql("""
                insert into public.usuarios (correo, nombre, clave_hash, correo_confirmado_en, creado_en, clave_cambiada_en)
                values (:correo, :nombre, :clave, :ahora, :ahora, :ahora) returning id""")
                .param("correo", correo).param("nombre", nombre).param("clave", claveHash).param("ahora", Fechas.utc(ahora))
                .query(UUID.class).single();
    }

    void cambiarClave(UUID id, String claveHash, Instant ahora) {
        jdbc.sql("update public.usuarios set clave_hash = :clave, clave_cambiada_en = :ahora where id = :id")
                .param("clave", claveHash).param("ahora", Fechas.utc(ahora)).param("id", id).update();
    }

    /**
     * El mismo hash con parámetros nuevos: la clave no cambió. Solo si sigue el viejo: si mientras tanto alguien cambió
     * la clave, esto no la pisa con el hash de la anterior.
     */
    void renovarHash(UUID id, String viejo, String nuevo) {
        jdbc.sql("update public.usuarios set clave_hash = :nuevo where id = :id and clave_hash = :viejo")
                .param("nuevo", nuevo).param("viejo", viejo).param("id", id).update();
    }

    /**
     * Traba la cuenta hasta el fin de la transacción (los cambios de clave y las entradas de una misma cuenta se turnan)
     * y devuelve el hash que tiene ahora: quien comprobó la clave antes de trabar ve si mientras tanto cambió.
     */
    Optional<String> trabar(UUID id) {
        return jdbc.sql("select clave_hash from public.usuarios where id = :id for update").param("id", id).query(String.class).optional();
    }
}
