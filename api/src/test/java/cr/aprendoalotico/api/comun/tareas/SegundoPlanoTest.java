package cr.aprendoalotico.api.comun.tareas;

import static org.assertj.core.api.Assertions.assertThat;

import cr.aprendoalotico.api.comun.web.IdDePedido;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.slf4j.MDC;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;

@ExtendWith(OutputCaptureExtension.class)
class SegundoPlanoTest {

    @AfterEach
    void limpiar() {
        MDC.clear();
    }

    @Test
    @DisplayName("La tarea lleva el id del pedido, y el hilo que la corre queda como estaba")
    void llevaElIdDelPedido() throws Exception {
        // Arrange
        MDC.put(IdDePedido.CLAVE_MDC, "pedido-7");
        var visto = new CompletableFuture<String>();
        var enOtroHilo = new SegundoPlano();
        // Act
        enOtroHilo.ejecutar("prueba", () -> visto.complete(IdDePedido.actual()));
        // Assert
        assertThat(visto.get(5, TimeUnit.SECONDS)).isEqualTo("pedido-7");
        enOtroHilo.destroy();

        new SegundoPlano(Runnable::run).ejecutar("prueba", () -> MDC.put(IdDePedido.CLAVE_MDC, "otro"));
        assertThat(IdDePedido.actual()).as("en el mismo hilo, el pedido conserva su id").isEqualTo("pedido-7");
    }

    @Test
    @DisplayName("Si la tarea falla, queda en el log con su nombre y sin el mensaje (puede traer datos); el pedido no se entera")
    void falla(CapturedOutput salida) {
        new SegundoPlano(Runnable::run).ejecutar("pedir cuenta", () -> {
            throw new IllegalStateException("maria@escuela.cr");
        });
        assertThat(salida.getAll()).contains("Falló «pedir cuenta» en segundo plano (java.lang.IllegalStateException)")
                .doesNotContain("maria@");
    }

    @Test
    @DisplayName("Con la cola llena, la tarea no se hace y queda en el log")
    void colaLlena(CapturedOutput salida) {
        new SegundoPlano(t -> {
            throw new RejectedExecutionException("llena");
        }).ejecutar("pedir recuperación", () -> { });
        assertThat(salida.getAll()).contains("Cola de segundo plano llena: no se hizo «pedir recuperación»");
    }
}
