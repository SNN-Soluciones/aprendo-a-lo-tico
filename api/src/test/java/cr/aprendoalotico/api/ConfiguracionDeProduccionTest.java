package cr.aprendoalotico.api;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.ClassPathResource;

/** application-prod.yml no se puede arrancar en las pruebas (pide las variables de verdad): se revisa lo que dice. */
class ConfiguracionDeProduccionTest {

    private static PropertySource<?> produccion() throws IOException {
        return new YamlPropertySourceLoader().load("prod", new ClassPathResource("application-prod.yml")).getFirst();
    }

    @Test
    @DisplayName("El correo sale por Resend con TLS desde el primer byte, en el 2465, y verificando el certificado")
    void correo() throws IOException {
        var prod = produccion();
        assertThat(prod.getProperty("spring.mail.host")).hasToString("smtp.resend.com");
        assertThat(prod.getProperty("spring.mail.port")).hasToString("2465");
        assertThat(prod.getProperty("spring.mail.properties.mail.smtp.ssl.enable")).hasToString("true");
        assertThat(prod.getProperty("spring.mail.properties.mail.smtp.ssl.checkserveridentity")).hasToString("true");
        assertThat(prod.getProperty("spring.mail.username")).hasToString("${SMTP_USUARIO}");
        assertThat(prod.getProperty("spring.mail.password")).hasToString("${SMTP_CLAVE}");
        assertThat(prod.getProperty("app.correo.remitente")).hasToString("${CORREO_REMITENTE}");
    }

    @Test
    @DisplayName("La IP del cliente sale de do-connecting-ip (la que pone App Platform)")
    void ipDelCliente() throws IOException {
        assertThat(produccion().getProperty("app.cabecera-ip")).hasToString("do-connecting-ip");
    }
}
