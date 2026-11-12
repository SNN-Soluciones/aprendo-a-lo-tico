package cr.aprendoalotico.api.comun.correo;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;

/**
 * El cartero de verdad (SMTP) y la cola. Sin spring.mail.host no hay JavaMailSender y la aplicación no arranca: mejor
 * eso que aceptar registros cuyos correos nunca van a salir.
 */
@Configuration(proxyBeanMethods = false)
class ConfiguracionCorreo {

    @Bean
    Cartero carteroSmtp(JavaMailSender smtp, PropiedadesCorreo propiedades) {
        return new CarteroSmtp(smtp, propiedades);
    }

    @Bean
    Correos correos(Cartero cartero, Clock reloj) {
        return new Correos(cartero, reloj);
    }
}
