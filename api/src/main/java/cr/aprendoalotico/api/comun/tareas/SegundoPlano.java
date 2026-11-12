package cr.aprendoalotico.api.comun.tareas;

import cr.aprendoalotico.api.comun.web.ManejadorErrores;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.RejectedExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

/**
 * Trabajo que no tiene que hacer esperar al pedido. Sobre todo, lo que depende de si un correo tiene cuenta
 * (registrarse, recuperar la clave): hecho en el pedido, el tiempo de la respuesta diría qué correos existen.
 *
 * <p>Dos hilos y hasta 1000 tareas esperando; si la cola se llena, la tarea no se hace y queda en el log. Lleva el
 * id del pedido (MDC) a la tarea, para que sus logs y su auditoría se puedan rastrear. Al apagar, espera a las que
 * están en la cola.
 */
@Component
public class SegundoPlano implements DisposableBean {

    private static final Logger LOG = LoggerFactory.getLogger(SegundoPlano.class);

    private final Executor ejecutor;

    public SegundoPlano() {
        this(ejecutorPropio());
    }

    SegundoPlano(Executor ejecutor) {
        this.ejecutor = ejecutor;
    }

    private static ThreadPoolTaskExecutor ejecutorPropio() {
        var e = new ThreadPoolTaskExecutor();
        e.setThreadNamePrefix("segundo-plano-");
        e.setCorePoolSize(2);
        e.setMaxPoolSize(2);
        e.setQueueCapacity(1000);
        e.setWaitForTasksToCompleteOnShutdown(true);
        e.setAwaitTerminationSeconds(20);
        e.initialize();
        return e;
    }

    /** @param nombre qué es, para el log si falla (sin datos personales) */
    public void ejecutar(String nombre, Runnable tarea) {
        Map<String, String> contexto = MDC.getCopyOfContextMap();
        try {
            ejecutor.execute(() -> {
                // Lo que tenía el hilo antes vuelve al terminar (si el ejecutor corre la tarea en el hilo del pedido, el
                // pedido sigue con su id)
                Map<String, String> previo = MDC.getCopyOfContextMap();
                if (contexto != null) {
                    MDC.setContextMap(contexto);
                }
                try {
                    tarea.run();
                } catch (RuntimeException e) {
                    LOG.error("Falló «{}» en segundo plano ({})", nombre, e.getClass().getName(), ManejadorErrores.sinMensajes(e));
                } finally {
                    if (previo == null) {
                        MDC.clear();
                    } else {
                        MDC.setContextMap(previo);
                    }
                }
            });
        } catch (RejectedExecutionException e) {
            LOG.error("Cola de segundo plano llena: no se hizo «{}»", nombre);
        }
    }

    @Override
    public void destroy() {
        if (ejecutor instanceof ThreadPoolTaskExecutor propio) {
            propio.shutdown();
        }
    }
}
