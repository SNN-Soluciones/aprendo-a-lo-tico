package cr.aprendoalotico.api.identidad;

import static cr.aprendoalotico.api.identidad.Navegador.desde;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cr.aprendoalotico.api.PruebaDeIntegracion;
import cr.aprendoalotico.api.comun.correo.CorreosDePrueba.Buzon;
import jakarta.servlet.http.Cookie;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.test.web.servlet.MockMvc;

/** Lo que comparten las pruebas de identidad: crear una cuenta de punta a punta y entrar. */
abstract class PruebaDeIdentidad extends PruebaDeIntegracion {

    static final String CLAVE = "una clave bien larga";

    @Autowired
    MockMvc mvc;

    @Autowired
    Buzon buzon;

    @Autowired
    JdbcClient jdbc;

    /** Pide la cuenta, abre el enlace del correo (con nombre y clave) y devuelve el correo de la cuenta nueva. */
    String cuentaNueva() throws Exception {
        String correo = Navegador.correoNuevo();
        String ip = Navegador.ipNueva();
        pedirCuenta(correo, ip);
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(buzon.tokenPara(correo), CLAVE)))
                .andExpect(status().isCreated());
        return correo;
    }

    void pedirCuenta(String correo, String ip) throws Exception {
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas", Map.of("correo", correo))).andExpect(status().isAccepted());
    }

    static Map<String, String> confirmacion(String token, String clave) {
        return Map.of("token", token, "nombre", "  María   José ", "clave", clave);
    }

    /** Entra y devuelve la cookie de la sesión. */
    Cookie entrar(String correo, String clave) throws Exception {
        var r = mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/sesion", Map.of("correo", correo, "clave", clave)))
                .andExpect(status().isOk()).andReturn();
        Cookie sesion = r.getResponse().getCookie(CookieDeSesion.NOMBRE);
        assertThat(sesion).isNotNull();
        return Navegador.cookie(sesion.getValue());
    }

    int filas(String sql, Object... valores) {
        var consulta = jdbc.sql(sql);
        for (int i = 0; i < valores.length; i++) {
            consulta = consulta.param(i + 1, valores[i]);
        }
        return consulta.query(Integer.class).single();
    }
}
