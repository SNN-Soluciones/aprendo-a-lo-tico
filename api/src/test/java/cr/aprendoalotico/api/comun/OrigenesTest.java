package cr.aprendoalotico.api.comun;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

class OrigenesTest {

    @ParameterizedTest(name = "«{0}» → {1}")
    @DisplayName("Normaliza al formato exacto con el que el navegador manda Origin")
    @CsvSource({
        "https://aprendoalotico.cr,       https://aprendoalotico.cr",
        "HTTPS://AprendoALoTico.CR,       https://aprendoalotico.cr",   // mayúsculas
        "https://aprendoalotico.cr:443,   https://aprendoalotico.cr",   // el puerto por defecto no va
        "https://aprendoalotico.cr:8443,  https://aprendoalotico.cr:8443",
        "'  https://aprendoalotico.cr  ', https://aprendoalotico.cr",
        "http://127.0.0.1:8080,           http://127.0.0.1:8080",       // local puede ir sin https
        "http://localhost:4200,           http://localhost:4200",
        "http://localhost:80,             http://localhost",
    })
    void normaliza(String dado, String esperado) {
        assertThat(Origenes.normalizar(dado)).isEqualTo(esperado);
    }

    @ParameterizedTest(name = "«{0}»")
    @DisplayName("Rechaza lo que nunca va a coincidir con un Origin real, o que sería inseguro")
    @ValueSource(strings = {
        "", "   ",
        "aprendoalotico.cr",                  // sin esquema
        "ftp://aprendoalotico.cr",
        "http://aprendoalotico.cr",           // público sin https
        "https://aprendoalotico.cr/",         // barra final
        "https://aprendoalotico.cr/juegos",   // con ruta
        "https://aprendoalotico.cr?x=1",
        "https://aprendoalotico.cr#a",
        "https://usuario@aprendoalotico.cr",
        "https://a b.cr",
    })
    void rechaza(String malo) {
        assertThatThrownBy(() -> Origenes.normalizar(malo)).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("null también se rechaza, con un mensaje que dice qué falta")
    void nulo() {
        assertThatThrownBy(() -> Origenes.normalizar(null)).hasMessageContaining("vacío");
    }

    @ParameterizedTest(name = "{0} → local: {1}")
    @DisplayName("Sabe cuáles son orígenes de la propia compu")
    @CsvSource({ "http://localhost:4200, true", "http://127.0.0.1:8080, true", "http://[::1]:8080, true", "https://aprendoalotico.cr, false" })
    void esLocal(String origen, boolean local) {
        assertThat(Origenes.esLocal(origen)).isEqualTo(local);
    }
}
