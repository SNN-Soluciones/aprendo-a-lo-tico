package cr.aprendoalotico.api.comun;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Un solo reloj (UTC) para toda la aplicación: en las pruebas se cambia por uno fijo. */
@Configuration(proxyBeanMethods = false)
public class ConfiguracionReloj {

    @Bean
    Clock reloj() {
        return Clock.systemUTC();
    }
}
