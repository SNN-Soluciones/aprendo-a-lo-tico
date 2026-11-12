package cr.aprendoalotico.api.comun.tareas;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

/** En las pruebas de integración, lo de segundo plano corre en el mismo hilo: cuando MockMvc responde, ya pasó. */
@TestConfiguration(proxyBeanMethods = false)
public class TareasDePrueba {

    @Bean
    @Primary
    SegundoPlano segundoPlanoEnElMismoHilo() {
        return new SegundoPlano(Runnable::run);
    }
}
