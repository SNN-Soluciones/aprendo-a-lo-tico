package cr.aprendoalotico.api.comun;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

class PropiedadesAppTest {

    private final ApplicationContextRunner contexto = new ApplicationContextRunner().withUserConfiguration(Config.class);

    @EnableConfigurationProperties(PropiedadesApp.class)
    static class Config { }

    /** El mensaje de la causa más profunda del arranque fallido. */
    private static String causa(Throwable t) {
        Throwable c = t;
        while (c.getCause() != null) c = c.getCause();
        return c.getMessage();
    }

    @Test
    @DisplayName("Sin la dirección del sitio no arranca, y dice qué variable falta")
    void sinSitioNoArranca() {
        contexto.run(ctx -> {
            assertThat(ctx).hasFailed();
            assertThat(causa(ctx.getStartupFailure())).contains("SITIO_URL");
        });
    }

    @Test
    @DisplayName("Un sitio con ruta, o público sin https, no arranca")
    void sitioMalNoArranca() {
        contexto.withPropertyValues("app.sitio-url=https://aprendoalotico.cr/juegos/").run(ctx -> assertThat(ctx).hasFailed());
        contexto.withPropertyValues("app.sitio-url=http://aprendoalotico.cr").run(ctx -> {
            assertThat(ctx).hasFailed();
            assertThat(causa(ctx.getStartupFailure())).contains("https");
        });
    }

    @Test
    @DisplayName("Un sitio público no puede confiar en un origen de la compu de alguien (ORIGEN_EXTRA local en producción)")
    void sitioPublicoConOrigenLocalNoArranca() {
        contexto.withPropertyValues("app.sitio-url=https://aprendoalotico.cr", "app.origen-extra=http://localhost:4200").run(ctx -> {
            assertThat(ctx).hasFailed();
            assertThat(causa(ctx.getStartupFailure())).contains("local");
        });
    }

    @Test
    @DisplayName("El origen extra es solo para la compu: uno público no arranca, ni con un sitio público ni con uno local")
    void origenExtraPublicoNoArranca() {
        contexto.withPropertyValues("app.sitio-url=https://aprendoalotico.cr", "app.origen-extra=https://portal.example.com").run(ctx -> {
            assertThat(ctx).hasFailed();
            assertThat(causa(ctx.getStartupFailure())).contains("ORIGEN_EXTRA");
        });
        contexto.withPropertyValues("app.sitio-url=http://127.0.0.1:8080", "app.origen-extra=https://portal.example.com")
                .run(ctx -> assertThat(ctx).hasFailed());
    }

    @Test
    @DisplayName("Con un origen válido arranca: normaliza, y el origen extra es opcional")
    void conSitioArranca() {
        contexto.withPropertyValues("app.sitio-url=HTTPS://AprendoALoTico.cr:443").run(ctx -> {
            assertThat(ctx).hasNotFailed();
            var app = ctx.getBean(PropiedadesApp.class);
            assertThat(app.sitioUrl()).isEqualTo("https://aprendoalotico.cr");
            assertThat(app.origenExtra()).isNull();
            assertThat(app.origenes()).containsExactly("https://aprendoalotico.cr");
        });
    }

    @Test
    @DisplayName("Un origen extra vacío no cuenta, y uno repetido no se duplica")
    void origenExtraVacioORepetido() {
        contexto.withPropertyValues("app.sitio-url=https://aprendoalotico.cr", "app.origen-extra=  ")
                .run(ctx -> assertThat(ctx.getBean(PropiedadesApp.class).origenExtra()).isNull());
        contexto.withPropertyValues("app.sitio-url=https://aprendoalotico.cr", "app.origen-extra=https://aprendoalotico.cr")
                .run(ctx -> assertThat(ctx.getBean(PropiedadesApp.class).origenes()).containsExactly("https://aprendoalotico.cr"));
    }

    @Test
    @DisplayName("La cabecera de la IP del cliente es opcional, y si está tiene que ser un nombre de cabecera")
    void cabeceraIp() {
        contexto.withPropertyValues("app.sitio-url=https://aprendoalotico.cr", "app.cabecera-ip= do-connecting-ip ")
                .run(ctx -> assertThat(ctx.getBean(PropiedadesApp.class).cabeceraIp()).isEqualTo("do-connecting-ip"));
        contexto.withPropertyValues("app.sitio-url=https://aprendoalotico.cr", "app.cabecera-ip=")
                .run(ctx -> assertThat(ctx.getBean(PropiedadesApp.class).cabeceraIp()).isNull());
        contexto.withPropertyValues("app.sitio-url=https://aprendoalotico.cr", "app.cabecera-ip=X-Real-IP: 1.2.3.4").run(ctx -> {
            assertThat(ctx).hasFailed();
            assertThat(causa(ctx.getStartupFailure())).contains("app.cabecera-ip");
        });
    }

    @Test
    @DisplayName("En la compu, el sitio local puede confiar además en el portal local")
    void localConPortalLocal() {
        contexto.withPropertyValues("app.sitio-url=http://127.0.0.1:8080", "app.origen-extra=http://localhost:4200")
                .run(ctx -> assertThat(ctx.getBean(PropiedadesApp.class).origenes())
                        .containsExactlyInAnyOrder("http://127.0.0.1:8080", "http://localhost:4200"));
    }
}
