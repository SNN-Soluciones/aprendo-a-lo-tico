package cr.aprendoalotico.api.estado;

import java.time.Clock;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.ReentrantLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.info.BuildProperties;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

/**
 * Revisa que la base responda y dice qué versión está corriendo. Es público: la respuesta se repite durante unos
 * segundos, y cuando vence la renueva un solo pedido mientras los demás esperan su resultado, para que muchos pedidos no
 * se conviertan en muchas consultas. La espera por una conexión está limitada por spring.datasource.hikari.connection-timeout
 * (2 s) y la consulta por el socketTimeout del driver (30 s, si la red se cae a media respuesta). La plataforma usa
 * /actuator/health/liveness, que no toca la base.
 */
@Service
public class ServicioEstado {

    static final String SERVICIO = "aprendo-a-lo-tico-api";
    static final Duration VIGENCIA = Duration.ofSeconds(5);
    private static final Logger LOG = LoggerFactory.getLogger(ServicioEstado.class);

    private final JdbcClient jdbc;
    private final Clock reloj;
    private final String version;
    private final AtomicReference<Estado> ultimo = new AtomicReference<>();
    // ReentrantLock y no synchronized: con hilos virtuales, synchronized deja atado el hilo de plataforma mientras espera
    private final ReentrantLock renovando = new ReentrantLock();

    public ServicioEstado(JdbcClient jdbc, Clock reloj, ObjectProvider<BuildProperties> build) {
        this.jdbc = jdbc;
        this.reloj = reloj;
        BuildProperties propiedades = build.getIfAvailable();
        this.version = propiedades == null ? "dev" : propiedades.getVersion();
    }

    public Estado estado() {
        Estado vigente = vigente();
        if (vigente != null) {
            return vigente;
        }
        renovando.lock();
        try {
            // Mientras esperábamos, otro pedido pudo haberla renovado
            vigente = vigente();
            if (vigente != null) {
                return vigente;
            }
            var ahora = reloj.instant();
            var nuevo = new Estado(SERVICIO, version, ahora, baseResponde() ? Estado.BASE_OK : "sin conexión");
            ultimo.set(nuevo);
            return nuevo;
        } finally {
            renovando.unlock();
        }
    }

    /** La última respuesta, si todavía no venció. */
    private Estado vigente() {
        Estado previo = ultimo.get();
        return previo != null && previo.hora().plus(VIGENCIA).isAfter(reloj.instant()) ? previo : null;
    }

    private boolean baseResponde() {
        try {
            return jdbc.sql("select 1").query(Integer.class).single() == 1;
        } catch (DataAccessException e) {
            // Sin traza: durante una caída se repetiría en cada pedido y taparía lo importante
            LOG.warn("La base de datos no responde ({})", e.getClass().getSimpleName());
            return false;
        }
    }
}
