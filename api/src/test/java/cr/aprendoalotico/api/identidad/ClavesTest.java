package cr.aprendoalotico.api.identidad;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import cr.aprendoalotico.api.comun.web.ErrorDeNegocio;
import java.time.Duration;
import java.util.concurrent.Semaphore;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ClavesTest {

    private final Claves claves = new Claves();

    @Test
    @DisplayName("Guarda Argon2id con los parámetros de OWASP, y reconoce la clave correcta y no otra")
    void argon2id() {
        String hash = claves.hash("una clave bien larga");
        assertThat(hash).startsWith("{argon2}$argon2id$v=19$m=19456,t=2,p=1$");
        assertThat(claves.coincide("una clave bien larga", hash)).isTrue();
        assertThat(claves.coincide("una clave bien largA", hash)).isFalse();
        assertThat(claves.hash("una clave bien larga")).as("cada hash con su sal").isNotEqualTo(hash);
        assertThat(claves.conviene(hash)).isFalse();
    }

    @Test
    @DisplayName("La misma clave escrita de otra forma (ñ compuesta o no, letras de ancho completo) es la misma")
    void normaliza() {
        String compuesta = "contraseña larga";
        String separada = "contraseña larga";
        assertThat(claves.coincide(separada, claves.hash(compuesta))).isTrue();
        assertThat(Claves.normalizar("ＡＢＣ")).isEqualTo("ABC");
    }

    @Test
    @DisplayName("Rechaza las claves más usadas, las de uno o dos caracteres repetidos y las que contienen el correo")
    void debiles() {
        for (String debil : new String[] { "1234567890", "Contraseña123", "contrasena 123", "QWERTYUIOP", "aaaaaaaaaa", "abababababab",
            "carmen@escuela.cr", "Soy carmen y ya", "puravida123" }) {
            assertThatThrownBy(() -> claves.exigirQueNoSeaDebil(debil, "carmen@escuela.cr")).as(debil)
                    .isInstanceOfSatisfying(ErrorDeNegocio.class, e -> assertThat(e.codigo()).isEqualTo("CLAVE_DEBIL"));
        }
        claves.exigirQueNoSeaDebil("tres palabras sueltas", "carmen@escuela.cr");
        claves.exigirQueNoSeaDebil("ana es corta", "ana@escuela.cr");
    }

    @Test
    @DisplayName("Para un correo sin cuenta igual calcula (tarda lo mismo) y dice que no")
    void gastarTiempo() {
        assertThat(claves.gastarTiempo("cualquier cosa")).isFalse();
    }

    @Test
    @DisplayName("Un hash guardado con otros parámetros conviene recalcularlo")
    void conviene() {
        String viejo = new org.springframework.security.crypto.argon2.Argon2PasswordEncoder(16, 32, 1, 4096, 1).encode("x");
        assertThat(claves.conviene("{argon2}" + viejo)).isTrue();
    }

    @Test
    @DisplayName("Sin turno libre a tiempo responde 503 OCUPADO en vez de comerse la memoria; el turno ocupado no se pierde")
    void sinTurno() throws Exception {
        // Arrange: el único turno lo tiene otro cálculo
        var turnos = new Semaphore(1);
        var unaALaVez = new Claves(turnos, Duration.ofMillis(50));
        turnos.acquire();
        // Act + Assert
        assertThatThrownBy(() -> unaALaVez.hash("una clave bien larga")).isInstanceOfSatisfying(ErrorDeNegocio.class,
                e -> assertThat(e.codigo()).isEqualTo("OCUPADO"));
        turnos.release();
        assertThat(unaALaVez.hash("una clave bien larga")).startsWith("{argon2}");
        assertThat(turnos.availablePermits()).isOne();
    }
}
