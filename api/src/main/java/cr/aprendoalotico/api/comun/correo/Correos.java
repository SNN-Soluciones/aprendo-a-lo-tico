package cr.aprendoalotico.api.comun.correo;

import cr.aprendoalotico.api.comun.limites.Limite;
import cr.aprendoalotico.api.comun.limites.Limite.Tramo;
import java.time.Clock;
import java.time.Duration;
import java.util.concurrent.Executor;
import java.util.concurrent.RejectedExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

/**
 * Manda los correos en segundo plano (DISENO.md, B7):
 *
 * <ul>
 *   <li>Si hay una transacción, <b>después de que se confirma</b>: nunca sale un enlace a algo que se echó para atrás.</li>
 *   <li>En otro hilo: el pedido no espera al SMTP, y una caída del proveedor no hace fallar el registro.</li>
 *   <li>Con reintentos. Si aun así falla, queda en el log (sin la dirección) y la persona puede pedirlo de nuevo.</li>
 *   <li>Con un tope de {@value #POR_HORA} por hora entre todos: si alguien logra saltarse los límites por IP, no
 *       agota la cuota del proveedor ni le arruina la reputación al dominio con rebotes.</li>
 * </ul>
 * Al apagar, espera un rato a que salgan los que están en la cola.
 */
public class Correos implements DisposableBean {

    private static final Logger LOG = LoggerFactory.getLogger(Correos.class);
    static final int POR_HORA = 300;

    private final Cartero cartero;
    private final Executor ejecutor;
    private final Duration pausa;
    private final int intentos;
    private final Limite tope;

    /** Con su propia cola: 2 envíos a la vez, hasta 500 esperando. */
    public Correos(Cartero cartero, Clock reloj) {
        this(cartero, ejecutorPropio(), Duration.ofSeconds(2), 3, Limite.de(reloj, new Tramo(POR_HORA, Duration.ofHours(1))));
    }

    Correos(Cartero cartero, Executor ejecutor, Duration pausa, int intentos, Limite tope) {
        this.cartero = cartero;
        this.ejecutor = ejecutor;
        this.pausa = pausa;
        this.intentos = intentos;
        this.tope = tope;
    }

    private static ThreadPoolTaskExecutor ejecutorPropio() {
        var e = new ThreadPoolTaskExecutor();
        e.setThreadNamePrefix("correo-");
        e.setCorePoolSize(2);
        e.setMaxPoolSize(2);
        e.setQueueCapacity(500);
        e.setWaitForTasksToCompleteOnShutdown(true);
        e.setAwaitTerminationSeconds(20);
        e.initialize();
        return e;
    }

    /** Lo deja listo para mandar: ya, o al confirmarse la transacción en curso. */
    public void programar(Mensaje mensaje) {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    despachar(mensaje);
                }
            });
        } else {
            despachar(mensaje);
        }
    }

    private void despachar(Mensaje mensaje) {
        if (!tope.intentar("todos")) {
            LOG.error("Se llegó al tope de {} correos por hora: no se mandó «{}»", POR_HORA, mensaje.asunto());
            return;
        }
        try {
            ejecutor.execute(() -> mandarConReintentos(mensaje));
        } catch (RejectedExecutionException e) {
            LOG.error("Cola de correos llena: no se mandó «{}»", mensaje.asunto());
        }
    }

    void mandarConReintentos(Mensaje mensaje) {
        for (int intento = 1; intento <= intentos; intento++) {
            try {
                cartero.enviar(mensaje);
                return;
            } catch (RuntimeException e) {
                if (intento == intentos) {
                    LOG.error("No se pudo mandar «{}» después de {} intentos ({})", mensaje.asunto(), intentos, e.getClass().getName());
                    return;
                }
                LOG.warn("Falló el intento {} de mandar «{}» ({}); se reintenta", intento, mensaje.asunto(), e.getClass().getName());
                esperar(pausa.multipliedBy(intento));
            }
        }
    }

    private static void esperar(Duration cuanto) {
        try {
            Thread.sleep(cuanto);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @Override
    public void destroy() {
        if (ejecutor instanceof ThreadPoolTaskExecutor propio) {
            propio.shutdown();
        }
    }
}
