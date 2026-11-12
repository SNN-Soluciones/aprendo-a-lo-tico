package cr.aprendoalotico.api.comun;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CodigosTest {

    @Test
    @DisplayName("Los códigos usan solo el alfabeto sin 0, O, 1 ni I, y no se repiten")
    void nuevos() {
        assertThat(Codigos.ALFABETO).hasSize(32).doesNotContain("0", "O", "1", "I");
        var vistos = new HashSet<String>();
        for (int i = 0; i < 1000; i++) {
            String c = Codigos.nuevo(12);
            assertThat(Codigos.valido(c, 12)).isTrue();
            assertThat(vistos.add(c)).isTrue();
        }
    }

    @Test
    @DisplayName("Como lo escribe la persona: sin espacios ni guiones y en mayúsculas; el largo y los caracteres cuentan")
    void limpioYValido() {
        assertThat(Codigos.limpio(" abcd-efgh jk\tlm ")).isEqualTo("ABCDEFGHJKLM");
        assertThat(Codigos.limpio(null)).isEmpty();
        assertThat(Codigos.valido("ABCDEFGHJKLM", 12)).isTrue();
        assertThat(Codigos.valido("ABCDEFGHJKL", 12)).isFalse();
        assertThat(Codigos.valido("ABCDEFGHJKL0", 12)).isFalse();
        assertThat(Codigos.valido("ABCDEFGHJKLI", 12)).isFalse();
    }
}
