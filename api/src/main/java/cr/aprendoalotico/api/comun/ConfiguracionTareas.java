package cr.aprendoalotico.api.comun;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/** Las tareas programadas (@Scheduled) de los módulos, como la limpieza de sesiones viejas de cada noche. */
@Configuration(proxyBeanMethods = false)
@EnableScheduling
public class ConfiguracionTareas {
}
