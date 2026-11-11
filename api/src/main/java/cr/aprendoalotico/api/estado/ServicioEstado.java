package cr.aprendoalotico.api.estado;

import java.time.Clock;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.info.BuildProperties;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

/**
 * Revisa que la base responda y dice qué versión está corriendo. Es público: la respuesta se repite durante unos
 * segundos para que muchos pedidos no se conviertan en muchas consultas, y la consulta tiene un tiempo de espera corto
 * (spring.datasource.hikari.connection-timeout). La plataforma usa /actuator/health/liveness, que no toca la base.
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

    public ServicioEstado(JdbcClient jdbc, Clock reloj, ObjectProvider<BuildProperties> build) {
        this.jdbc = jdbc;
        this.reloj = reloj;
        BuildProperties propiedades = build.getIfAvailable();
        this.version = propiedades == null ? "dev" : propiedades.getVersion();
    }

    public Estado estado() {
        var ahora = reloj.instant();
        Estado previo = ultimo.get();
        if (previo != null && previo.hora().plus(VIGENCIA).isAfter(ahora)) {
            return previo;
        }
        var nuevo = new Estado(SERVICIO, version, ahora, baseResponde() ? Estado.BASE_OK : "sin conexión");
        ultimo.set(nuevo);
        return nuevo;
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
