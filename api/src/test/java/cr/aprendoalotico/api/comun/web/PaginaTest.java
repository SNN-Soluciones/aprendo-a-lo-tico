package cr.aprendoalotico.api.comun.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class PaginaTest {

    @Test
    @DisplayName("La página 3 de 20 se salta 40, y la respuesta lleva el meta con el total")
    void desdeYMeta() {
        var p = new Pagina(3, 20);
        assertThat(p.desde()).isEqualTo(40);
        var r = p.respuesta(new Pagina.Leida<>(List.of("a"), 41));
        assertThat(r.success()).isTrue();
        assertThat(r.meta()).isEqualTo(new Meta(41, 3, 20));
    }

    @Test
    @DisplayName("Fuera de rango no se puede armar: desde la página 1, de 1 a 100")
    void fueraDeRango() {
        assertThatThrownBy(() -> new Pagina(0, 20)).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new Pagina(1, 0)).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new Pagina(1, 101)).isInstanceOf(IllegalArgumentException.class);
    }
}
