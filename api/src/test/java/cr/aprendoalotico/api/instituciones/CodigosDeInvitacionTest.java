package cr.aprendoalotico.api.instituciones;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HexFormat;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CodigosDeInvitacionTest {

    @Test
    @DisplayName("Un código nuevo se muestra en tres grupos de 4")
    void formato() {
        assertThat(CodigosDeInvitacion.nuevo()).matches("[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}");
    }

    @Test
    @DisplayName("El hash es el mismo lo escriba como lo escriba; lo que no tiene forma de código no llega a la base")
    void hash() {
        byte[] hash = CodigosDeInvitacion.hash("ABCD-EFGH-JKLM").orElseThrow();
        assertThat(CodigosDeInvitacion.hash("abcd efgh jklm")).hasValueSatisfying(h -> assertThat(h).isEqualTo(hash));
        // SHA-256 de «ABCDEFGHJKLM» (printf '%s' ABCDEFGHJKLM | shasum -a 256)
        assertThat(HexFormat.of().formatHex(hash)).isEqualTo(SHA_DE_ABCDEFGHJKLM);
        assertThat(CodigosDeInvitacion.hash("ABCD-EFGH-JKL")).isEmpty();
        assertThat(CodigosDeInvitacion.hash("ABCD-EFGH-JKL0")).isEmpty();
        assertThat(CodigosDeInvitacion.hash(null)).isEmpty();
    }

    private static final String SHA_DE_ABCDEFGHJKLM = "3f63d25fcb898ecfd6c2e2322bfdb11f44fe17dd0dc359e70b7246224bb223e9";
}
