package cr.aprendoalotico.api.comun.web;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpStatusCode;

class CodigosHttpTest {

    @ParameterizedTest(name = "{0} → {1}")
    @DisplayName("Cada estado genérico tiene su código estable y un mensaje en español que no está vacío")
    @CsvSource({
        "400, SOLICITUD_INVALIDA, no es válido",
        "401, NO_AUTENTICADO,     entrar",
        "403, PROHIBIDO,          permiso",
        "404, NO_ENCONTRADO,      no existe",
        "405, METODO_NO_PERMITIDO, acción",
        "406, NO_ACEPTABLE,       no es válido",
        "409, CONFLICTO,          choca",
        "413, DEMASIADO_GRANDE,   grande",
        "415, TIPO_NO_SOPORTADO,  formato",
        "429, DEMASIADOS_INTENTOS, intentos",
        "422, SOLICITUD_INVALIDA, no es válido",
        "500, ERROR_INTERNO,      nuestro lado",
        "502, ERROR_INTERNO,      nuestro lado",
        "503, NO_DISPONIBLE,      disponible",
    })
    void codigoYMensaje(int estado, String codigo, String parteDelMensaje) {
        var s = HttpStatusCode.valueOf(estado);
        assertThat(CodigosHttp.codigo(s)).isEqualTo(codigo);
        assertThat(CodigosHttp.mensaje(s)).contains(parteDelMensaje);
    }
}
