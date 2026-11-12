package cr.aprendoalotico.api.identidad;

import static cr.aprendoalotico.api.identidad.Navegador.con;
import static cr.aprendoalotico.api.identidad.Navegador.desde;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;

class ClaveIT extends PruebaDeIdentidad {

    private static final String NUEVA = "otra clave bien larga";

    private void pedirEnlace(String correo, String ip) throws Exception {
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/clave/recuperar", Map.of("correo", correo))).andExpect(status().isAccepted());
    }

    private void yoResponde(Cookie sesion, int estado) throws Exception {
        mvc.perform(con(sesion, desde(Navegador.ipNueva(), HttpMethod.GET, "/api/v1/yo", null))).andExpect(status().is(estado));
    }

    @Test
    @DisplayName("Recuperar: llega el enlace; la clave nueva sirve, la vieja no, se cierran las sesiones y llega el aviso")
    void recuperar() throws Exception {
        // Arrange
        String correo = cuentaNueva();
        Cookie abierta = entrar(correo, CLAVE);
        String ip = Navegador.ipNueva();
        // Act
        pedirEnlace(correo.toUpperCase(), ip);
        var enlace = buzon.ultimoPara(correo).orElseThrow();
        assertThat(enlace.asunto()).isEqualTo("Tu clave nueva de Aprendo a lo Tico");
        assertThat(enlace.texto()).contains("https://aprendoalotico.cr/portal/clave-nueva#t=");
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/clave/nueva", Map.of("token", buzon.tokenPara(correo), "clave", NUEVA)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.data.mensaje").value(org.hamcrest.Matchers.startsWith("Listo")));
        // Assert
        yoResponde(abierta, 401);
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/sesion", Map.of("correo", correo, "clave", CLAVE)))
                .andExpect(status().isUnauthorized());
        entrar(correo, NUEVA);
        assertThat(buzon.ultimoPara(correo).orElseThrow().asunto()).isEqualTo("Cambió la clave de tu cuenta en Aprendo a lo Tico");
        assertThat(filas("select count(*) from public.auditoria a join public.usuarios u on u.id = a.actor_id "
                + "where u.correo = ? and a.accion = 'CLAVE_RECUPERADA'", correo)).isOne();
    }

    @Test
    @DisplayName("El enlace sirve una sola vez y vence a los 30 minutos; al usar uno, los otros que estaban abiertos dejan de servir")
    void unSoloUso() throws Exception {
        String correo = cuentaNueva();
        String ip = Navegador.ipNueva();
        pedirEnlace(correo, ip);
        String primero = buzon.tokenPara(correo);
        pedirEnlace(correo, ip);
        String segundo = buzon.tokenPara(correo);
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/clave/nueva", Map.of("token", segundo, "clave", NUEVA))).andExpect(status().isOk());

        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/clave/nueva", Map.of("token", segundo, "clave", NUEVA)))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("ENLACE_INVALIDO"));
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/clave/nueva", Map.of("token", primero, "clave", NUEVA)))
                .andExpect(status().isBadRequest());

        String otro = cuentaNueva();
        pedirEnlace(otro, ip);
        jdbc.sql("update public.recuperaciones r set expira_en = now() - interval '1 second' from public.usuarios u "
                + "where u.id = r.usuario_id and u.correo = ?").param(1, otro).update();
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/clave/nueva", Map.of("token", buzon.tokenPara(otro), "clave", NUEVA)))
                .andExpect(status().isBadRequest());
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/clave/nueva", Map.of("token", "corto", "clave", NUEVA)))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("ENLACE_INVALIDO"));
    }

    @Test
    @DisplayName("Dos enlaces de la misma cuenta usados a la vez: uno gana, el otro no sirve, y nunca un 500")
    void dosALaVez() throws Exception {
        for (int vuelta = 0; vuelta < 5; vuelta++) {
            String correo = cuentaNueva();
            String ip = Navegador.ipNueva();
            pedirEnlace(correo, ip);
            String uno = buzon.tokenPara(correo);
            pedirEnlace(correo, ip);
            String otro = buzon.tokenPara(correo);
            var largada = new java.util.concurrent.CyclicBarrier(2);
            try (var hilos = java.util.concurrent.Executors.newFixedThreadPool(2)) {
                var a = hilos.submit(() -> {
                    largada.await();
                    return mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/clave/nueva", Map.of("token", uno, "clave", NUEVA)))
                            .andReturn().getResponse().getStatus();
                });
                var b = hilos.submit(() -> {
                    largada.await();
                    return mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/clave/nueva", Map.of("token", otro, "clave", NUEVA)))
                            .andReturn().getResponse().getStatus();
                });
                assertThat(java.util.List.of(a.get(), b.get())).containsExactlyInAnyOrder(200, 400);
            }
        }
    }

    @Test
    @DisplayName("Cambiar la clave invalida los enlaces de recuperación que estaban abiertos")
    void cambiarInvalidaEnlaces() throws Exception {
        String correo = cuentaNueva();
        Cookie sesion = entrar(correo, CLAVE);
        String ip = Navegador.ipNueva();
        pedirEnlace(correo, ip);
        String enlace = buzon.tokenPara(correo);
        mvc.perform(con(sesion, desde(Navegador.ipNueva(), HttpMethod.PUT, "/api/v1/yo/clave", Map.of("actual", CLAVE, "nueva", NUEVA))))
                .andExpect(status().isOk());
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/clave/nueva", Map.of("token", enlace, "clave", "una tercera clave larga")))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("ENLACE_INVALIDO"));
    }

    @Test
    @DisplayName("La clave nueva tampoco puede ser de las más usadas, ni al recuperar ni al cambiar")
    void claveDebil() throws Exception {
        String correo = cuentaNueva();
        String ip = Navegador.ipNueva();
        pedirEnlace(correo, ip);
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/clave/nueva", Map.of("token", buzon.tokenPara(correo), "clave", "qwertyuiop")))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("CLAVE_DEBIL"));
        Cookie sesion = entrar(correo, CLAVE);
        mvc.perform(con(sesion, desde(Navegador.ipNueva(), HttpMethod.PUT, "/api/v1/yo/clave", Map.of("actual", CLAVE, "nueva", "1234567890"))))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("CLAVE_DEBIL"));
    }

    @Test
    @DisplayName("Un pedido que salió con el token viejo justo antes de cambiar la clave no borra la cookie nueva")
    void pedidoConTokenViejo() throws Exception {
        String correo = cuentaNueva();
        Cookie vieja = entrar(correo, CLAVE);
        mvc.perform(con(vieja, desde(Navegador.ipNueva(), HttpMethod.PUT, "/api/v1/yo/clave", Map.of("actual", CLAVE, "nueva", NUEVA))))
                .andExpect(status().isOk());
        mvc.perform(con(vieja, desde(Navegador.ipNueva(), HttpMethod.GET, "/api/v1/yo", null)))
                .andExpect(status().isUnauthorized())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header().doesNotExist("Set-Cookie"));
    }

    @Test
    @DisplayName("Para un correo sin cuenta la respuesta es idéntica y no se manda nada")
    void correoSinCuenta() throws Exception {
        String conCuenta = cuentaNueva();
        String sinCuenta = Navegador.correoNuevo();
        String ip = Navegador.ipNueva();
        String a = mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/clave/recuperar", Map.of("correo", conCuenta)))
                .andReturn().getResponse().getContentAsString();
        String b = mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/clave/recuperar", Map.of("correo", sinCuenta)))
                .andExpect(status().isAccepted()).andReturn().getResponse().getContentAsString();
        assertThat(a).isEqualTo(b);
        assertThat(buzon.para(sinCuenta)).isEmpty();
    }

    @Test
    @DisplayName("Desde una IP, 20 pedidos de recuperación por hora")
    void limitePorIp() throws Exception {
        String ip = Navegador.ipNueva();
        for (int i = 0; i < 20; i++) {
            pedirEnlace(Navegador.correoNuevo(), ip);
        }
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/clave/recuperar", Map.of("correo", Navegador.correoNuevo())))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    @DisplayName("Cambiar la clave pide la actual; esta sesión sigue con otro token y las demás se cierran")
    void cambiar() throws Exception {
        // Arrange
        String correo = cuentaNueva();
        Cookie esta = entrar(correo, CLAVE);
        Cookie otra = entrar(correo, CLAVE);
        // Act
        mvc.perform(con(esta, desde(Navegador.ipNueva(), HttpMethod.PUT, "/api/v1/yo/clave", Map.of("actual", "no es la clave", "nueva", NUEVA))))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("CLAVE_INCORRECTA"));
        var r = mvc.perform(con(esta, desde(Navegador.ipNueva(), HttpMethod.PUT, "/api/v1/yo/clave", Map.of("actual", CLAVE, "nueva", NUEVA))))
                .andExpect(status().isOk()).andReturn();
        // Assert
        Cookie renovada = Navegador.cookie(r.getResponse().getCookie(CookieDeSesion.NOMBRE).getValue());
        assertThat(renovada.getValue()).isNotEqualTo(esta.getValue());
        yoResponde(renovada, 200);
        yoResponde(esta, 401);
        yoResponde(otra, 401);
        entrar(correo, NUEVA);
        assertThat(buzon.ultimoPara(correo).orElseThrow().asunto()).startsWith("Cambió la clave");
    }

    @Test
    @DisplayName("Con la sesión abierta no se puede probar la clave actual a mano: 5 fallos cada 15 minutos")
    void limiteDelCambio() throws Exception {
        Cookie sesion = entrar(cuentaNueva(), CLAVE);
        for (int i = 0; i < 5; i++) {
            mvc.perform(con(sesion, desde(Navegador.ipNueva(), HttpMethod.PUT, "/api/v1/yo/clave", Map.of("actual", "intento " + i, "nueva", NUEVA))))
                    .andExpect(status().isBadRequest());
        }
        mvc.perform(con(sesion, desde(Navegador.ipNueva(), HttpMethod.PUT, "/api/v1/yo/clave", Map.of("actual", CLAVE, "nueva", NUEVA))))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    @DisplayName("Cambiar la clave sin sesión es 401, y la nueva tiene que cumplir el largo")
    void cambiarSinSesionOConClaveCorta() throws Exception {
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.PUT, "/api/v1/yo/clave", Map.of("actual", CLAVE, "nueva", NUEVA)))
                .andExpect(status().isUnauthorized());
        Cookie sesion = entrar(cuentaNueva(), CLAVE);
        mvc.perform(con(sesion, desde(Navegador.ipNueva(), HttpMethod.PUT, "/api/v1/yo/clave", Map.of("actual", CLAVE, "nueva", "corta"))))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.campos.nueva").exists());
    }
}
