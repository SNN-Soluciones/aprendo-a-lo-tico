package cr.aprendoalotico.api.identidad;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class TokensTest {

    @Test
    @DisplayName("Cada token son 32 bytes al azar en base64url (43 caracteres), y no se repiten")
    void nuevos() {
        var vistos = new HashSet<String>();
        for (int i = 0; i < 1000; i++) {
            String t = Tokens.nuevo();
            assertThat(Tokens.tieneFormato(t)).isTrue();
            assertThat(vistos.add(t)).isTrue();
        }
    }

    @Test
    @DisplayName("Lo que no tiene el formato se descarta antes de ir a la base")
    void formato() {
        assertThat(Tokens.tieneFormato(null)).isFalse();
        assertThat(Tokens.tieneFormato("corto")).isFalse();
        assertThat(Tokens.tieneFormato("a".repeat(42) + "=")).isFalse();
        assertThat(Tokens.tieneFormato("' or 1=1 --" + "a".repeat(32))).isFalse();
    }

    @Test
    @DisplayName("El hash es SHA-256 (32 bytes), el mismo cada vez")
    void hash() {
        String t = Tokens.nuevo();
        assertThat(Tokens.hash(t)).hasSize(32).isEqualTo(Tokens.hash(t));
    }

    @Test
    @DisplayName("El navegador guardado se corta a 200 caracteres; uno vacío no se guarda")
    void agente() {
        assertThat(ServicioSesiones.cortar("x".repeat(500))).hasSize(200);
        assertThat(ServicioSesiones.cortar("Firefox")).isEqualTo("Firefox");
        assertThat(ServicioSesiones.cortar(" ")).isNull();
        assertThat(ServicioSesiones.cortar(null)).isNull();
    }

    @Test
    @DisplayName("Ni el usuario actual ni lo que se registra muestran datos personales en los logs")
    void sinDatosEnLosLogs() {
        var yo = new cr.aprendoalotico.api.identidad.api.UsuarioActual(java.util.UUID.randomUUID(), java.util.UUID.randomUUID(),
                "maria@escuela.cr", "María");
        assertThat(yo.toString()).doesNotContain("maria").doesNotContain("María");
        assertThat(new Usuarios.Usuario(yo.id(), "maria@escuela.cr", "María", "{argon2}x").toString()).doesNotContain("maria", "argon2");
        assertThat(new ServicioSesiones.Entrada("token-secreto", yo).toString()).doesNotContain("token-secreto");
    }
}
