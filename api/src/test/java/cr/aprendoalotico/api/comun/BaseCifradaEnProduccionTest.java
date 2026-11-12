package cr.aprendoalotico.api.comun;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import cr.aprendoalotico.api.ApiApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.mock.env.MockEnvironment;

class BaseCifradaEnProduccionTest {

    private static final String BASE = "jdbc:postgresql://db.example.com:25060/aprendo";

    private final BaseCifradaEnProduccion revision = new BaseCifradaEnProduccion();

    private static MockEnvironment produccion(String url) {
        var entorno = new MockEnvironment().withProperty("spring.datasource.url", url);
        entorno.setActiveProfiles("prod");
        return entorno;
    }

    private void revisar(MockEnvironment entorno) {
        revision.postProcessEnvironment(entorno, new SpringApplication());
    }

    @ParameterizedTest(name = "sslmode={0}")
    @ValueSource(strings = { "require", "verify-ca", "verify-full", "VERIFY-FULL" })
    @DisplayName("En producción arranca si DB_URL pide la conexión cifrada")
    void cifradaArranca(String modo) {
        assertThatCode(() -> revisar(produccion(BASE + "?sslmode=" + modo + "&ApplicationName=api"))).doesNotThrowAnyException();
    }

    @ParameterizedTest(name = "{0}")
    @ValueSource(strings = {
        BASE,
        BASE + "?sslmode=prefer",
        BASE + "?sslmode=allow",
        BASE + "?sslmode=disable",
        BASE + "?SSLMODE=require",
        BASE + "?sslmode=require&sslmode=disable",
    })
    @DisplayName("En producción no arranca si DB_URL no pide cifrado: el driver caería a texto plano (el último sslmode es el que vale)")
    void sinCifradoNoArranca(String url) {
        assertThatThrownBy(() -> revisar(produccion(url))).isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("DB_URL").hasMessageContaining("sslmode=require");
    }

    @Test
    @DisplayName("Si las migraciones usan otra dirección (spring.flyway.url), también tiene que ir cifrada")
    void migracionesConOtraDireccion() {
        var entorno = produccion(BASE + "?sslmode=require").withProperty("spring.flyway.url", BASE);
        assertThatThrownBy(() -> revisar(entorno)).isInstanceOf(IllegalStateException.class).hasMessageContaining("spring.flyway.url");
    }

    @Test
    @DisplayName("En producción, sin dirección de la base no arranca")
    void sinDireccion() {
        var entorno = new MockEnvironment();
        entorno.setActiveProfiles("prod");
        assertThatThrownBy(() -> revisar(entorno)).isInstanceOf(IllegalStateException.class).hasMessageContaining("DB_URL");
    }

    @Test
    @DisplayName("Fuera de producción (la base de Docker en la compu) no se exige")
    void fueraDeProduccion() {
        var entorno = new MockEnvironment().withProperty("spring.datasource.url", "jdbc:postgresql://127.0.0.1:5432/aprendo");
        entorno.setActiveProfiles("local");
        assertThatCode(() -> revisar(entorno)).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("La aplicación de verdad la corre al arrancar con el perfil prod, antes de abrir cualquier conexión")
    void correAlArrancar() {
        var aplicacion = new SpringApplicationBuilder(ApiApplication.class).profiles("prod").web(WebApplicationType.NONE)
                .properties("DB_URL=jdbc:postgresql://127.0.0.1:1/aprendo", "DB_USUARIO=app", "DB_CLAVE=x",
                        "DB_MIGRACION_USUARIO=duena", "DB_MIGRACION_CLAVE=x", "SITIO_URL=https://aprendoalotico.cr");
        assertThatThrownBy(aplicacion::run).isInstanceOf(IllegalStateException.class).hasMessageContaining("sslmode=require");
    }
}
