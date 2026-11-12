package cr.aprendoalotico.api.comun.correo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import cr.aprendoalotico.api.comun.limites.Limite;
import java.time.Clock;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.RejectedExecutionException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.mail.MailSendException;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.transaction.support.TransactionSynchronizationUtils;

@ExtendWith(OutputCaptureExtension.class)
class CorreosTest {

    private static final Mensaje MENSAJE = new Mensaje("maria@escuela.cr", "Asunto de prueba", "Hola");

    /** Un cartero que falla las primeras «fallas» veces. */
    static final class Cartero implements cr.aprendoalotico.api.comun.correo.Cartero {
        final List<Mensaje> mandados = new ArrayList<>();
        int fallas;
        int intentos;

        @Override
        public void enviar(Mensaje m) {
            intentos++;
            if (intentos <= fallas) {
                throw new MailSendException("SMTP caído");
            }
            mandados.add(m);
        }
    }

    private final Cartero cartero = new Cartero();
    private static Limite sinTope() {
        return Limite.de(Clock.systemUTC(), new Limite.Tramo(1_000, Duration.ofHours(1)));
    }

    private final Correos correos = new Correos(cartero, Runnable::run, Duration.ZERO, 3, sinTope());

    @Test
    @DisplayName("Sin transacción sale ya")
    void sinTransaccion() {
        correos.programar(MENSAJE);
        assertThat(cartero.mandados).containsExactly(MENSAJE);
    }

    @Test
    @DisplayName("Con transacción sale recién al confirmarse; si se echa para atrás, no sale")
    void conTransaccion() {
        TransactionSynchronizationManager.initSynchronization();
        try {
            correos.programar(MENSAJE);
            assertThat(cartero.mandados).isEmpty();
            TransactionSynchronizationUtils.triggerAfterCommit();
            assertThat(cartero.mandados).containsExactly(MENSAJE);
        } finally {
            TransactionSynchronizationManager.clearSynchronization();
        }
        TransactionSynchronizationManager.initSynchronization();
        try {
            correos.programar(MENSAJE);
            TransactionSynchronizationUtils.triggerAfterCompletion(org.springframework.transaction.support.TransactionSynchronization.STATUS_ROLLED_BACK);
            assertThat(cartero.mandados).hasSize(1);
        } finally {
            TransactionSynchronizationManager.clearSynchronization();
        }
    }

    @Test
    @DisplayName("Si el SMTP falla, reintenta; si falla las 3 veces, lo deja en el log sin la dirección")
    void reintentos(CapturedOutput salida) {
        cartero.fallas = 2;
        correos.programar(MENSAJE);
        assertThat(cartero.mandados).hasSize(1);

        cartero.fallas = 99;
        cartero.intentos = 0;
        correos.programar(MENSAJE);
        assertThat(cartero.intentos).isEqualTo(3);
        assertThat(salida.getAll()).contains("No se pudo mandar «Asunto de prueba» después de 3 intentos").doesNotContain("maria@");
    }

    @Test
    @DisplayName("Si la cola está llena, lo deja en el log y el pedido sigue (no revienta el registro)")
    void colaLlena(CapturedOutput salida) {
        var llena = new Correos(cartero, tarea -> {
            throw new RejectedExecutionException("llena");
        }, Duration.ZERO, 1, sinTope());
        llena.programar(MENSAJE);
        assertThat(salida.getAll()).contains("Cola de correos llena");
    }

    @Test
    @DisplayName("La cola de verdad manda en otro hilo y se apaga ordenada")
    void colaDeVerdad() throws Exception {
        var deVerdad = new Correos(cartero, Clock.systemUTC());
        deVerdad.programar(MENSAJE);
        deVerdad.destroy();
        assertThat(cartero.mandados).containsExactly(MENSAJE);
    }

    @Test
    @DisplayName("Con el tope de la hora lleno no se manda más, y queda en el log")
    void topePorHora(CapturedOutput salida) {
        var conTope = new Correos(cartero, Runnable::run, Duration.ZERO, 1, Limite.de(Clock.systemUTC(), new Limite.Tramo(2, Duration.ofHours(1))));
        for (int i = 0; i < 3; i++) {
            conTope.programar(MENSAJE);
        }
        assertThat(cartero.mandados).hasSize(2);
        assertThat(salida.getAll()).contains("Se llegó al tope de 300 correos por hora");
    }

    @Test
    @DisplayName("Un mensaje necesita una dirección sola, un asunto de una línea y texto; en el log no aparece la dirección")
    void mensaje() {
        assertThatThrownBy(() -> new Mensaje("no-es-correo", "a", "b")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new Mensaje("Ana <ana@x.cr>", "a", "b")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new Mensaje("ana@x.cr, beto@x.cr", "a", "b")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new Mensaje(null, "a", "b")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new Mensaje("ana@x.cr", "a\r\nBcc: otro@x.cr", "b")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new Mensaje("ana@x.cr", " ", "b")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new Mensaje("ana@x.cr", "a", null)).isInstanceOf(IllegalArgumentException.class);
        assertThat(MENSAJE.toString()).doesNotContain("maria");
    }
}
