package cr.aprendoalotico.api.identidad;

import static cr.aprendoalotico.api.identidad.Navegador.desde;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;

class RegistroIT extends PruebaDeIdentidad {

    @Test
    @DisplayName("Pedir la cuenta manda el enlace; al abrirlo con nombre y clave se crea la cuenta y se puede entrar")
    void dePuntaAPunta() throws Exception {
        // Arrange
        String correo = Navegador.correoNuevo();
        String ip = Navegador.ipNueva();
        // Act
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas", Map.of("correo", " " + correo.toUpperCase() + " ")))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.mensaje").value(Matchers.startsWith("Revisá tu correo")));
        // Assert: todavía no hay cuenta, solo el pedido pendiente y el correo
        assertThat(filas("select count(*) from public.usuarios where correo = ?", correo)).isZero();
        var mensaje = buzon.ultimoPara(correo).orElseThrow();
        assertThat(mensaje.asunto()).isEqualTo("Creá tu cuenta en Aprendo a lo Tico");
        assertThat(mensaje.texto()).contains("https://aprendoalotico.cr/portal/confirmar#t=");

        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(buzon.tokenPara(correo), CLAVE)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.mensaje").value(Matchers.startsWith("¡Listo!")));
        assertThat(jdbc.sql("select nombre from public.usuarios where correo = ?").param(1, correo).query(String.class).single())
                .isEqualTo("María José");
        assertThat(filas("select count(*) from public.registros_pendientes where correo = ?", correo)).isZero();
        assertThat(filas("select count(*) from public.auditoria a join public.usuarios u on u.id = a.recurso_id "
                + "where u.correo = ? and a.accion = 'CUENTA_CREADA'", correo)).isOne();
        entrar(correo, CLAVE);
    }

    @Test
    @DisplayName("El enlace sirve una sola vez, y uno inventado o vencido no sirve")
    void enlaceDeUnSoloUso() throws Exception {
        String correo = Navegador.correoNuevo();
        String ip = Navegador.ipNueva();
        pedirCuenta(correo, ip);
        String token = buzon.tokenPara(correo);
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(token, CLAVE))).andExpect(status().isCreated());

        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(token, CLAVE)))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("ENLACE_INVALIDO"));
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion("x".repeat(43), CLAVE)))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("ENLACE_INVALIDO"));
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion("no es un token", CLAVE)))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("ENLACE_INVALIDO"));

        String otro = Navegador.correoNuevo();
        pedirCuenta(otro, ip);
        jdbc.sql("update public.registros_pendientes set expira_en = now() - interval '1 minute' where correo = ?").param(1, otro).update();
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(buzon.tokenPara(otro), CLAVE)))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("ENLACE_INVALIDO"));
    }

    @Test
    @DisplayName("Con un correo que ya tiene cuenta la respuesta es idéntica, y al correo le llega «ya tenés cuenta» (no un enlace)")
    void correoConCuenta() throws Exception {
        // Arrange
        String correo = cuentaNueva();
        String ip = Navegador.ipNueva();
        String deUnoNuevo = mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas", Map.of("correo", Navegador.correoNuevo())))
                .andReturn().getResponse().getContentAsString();
        // Act
        var r = mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas", Map.of("correo", correo))).andExpect(status().isAccepted()).andReturn();
        // Assert
        assertThat(r.getResponse().getContentAsString()).isEqualTo(deUnoNuevo);
        var aviso = buzon.ultimoPara(correo).orElseThrow();
        assertThat(aviso.asunto()).isEqualTo("Ya tenés una cuenta en Aprendo a lo Tico");
        assertThat(aviso.texto()).doesNotContain("#t=").contains("/portal/recuperar");
        assertThat(filas("select count(*) from public.registros_pendientes where correo = ?", correo)).isZero();
    }

    @Test
    @DisplayName("Quien pide una cuenta con el correo de otra persona no decide nada: la clave y el nombre los pone quien abre el enlace")
    void sinPreSecuestro() throws Exception {
        // Arrange: alguien pide la cuenta con el correo de una maestra; ella después la pide también
        String correo = Navegador.correoNuevo();
        pedirCuenta(correo, Navegador.ipNueva());
        String delOtro = buzon.tokenPara(correo);
        pedirCuenta(correo, Navegador.ipNueva());
        // Act: ella abre cualquiera de los dos enlaces (le llegaron a ella) y pone su clave
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(delOtro, CLAVE + "!")))
                .andExpect(status().isCreated());
        // Assert: la cuenta es suya, con su clave; el otro enlace ya no sirve
        entrar(correo, CLAVE + "!");
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(buzon.tokenPara(correo), CLAVE)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Dos enlaces del mismo correo abiertos a la vez: una sola cuenta y nunca un 500 (se turnan, no se trancan)")
    void dosALaVez() throws Exception {
        for (int vuelta = 0; vuelta < 10; vuelta++) {
            // Arrange
            String correo = Navegador.correoNuevo();
            pedirCuenta(correo, Navegador.ipNueva());
            String uno = buzon.tokenPara(correo);
            pedirCuenta(correo, Navegador.ipNueva());
            String otro = buzon.tokenPara(correo);
            var largada = new CyclicBarrier(2);
            List<Future<Integer>> estados = new ArrayList<>();
            // Act
            try (var hilos = Executors.newFixedThreadPool(2)) {
                for (String token : List.of(uno, otro)) {
                    estados.add(hilos.submit(() -> {
                        largada.await();
                        return mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(token, CLAVE)))
                                .andReturn().getResponse().getStatus();
                    }));
                }
                // Assert
                List<Integer> codigos = new ArrayList<>();
                for (Future<Integer> e : estados) {
                    codigos.add(e.get());
                }
                assertThat(codigos).containsExactlyInAnyOrder(201, 400);
            }
            assertThat(filas("select count(*) from public.usuarios where correo = ?", correo)).isOne();
        }
    }

    @Test
    @DisplayName("Valida cada campo con un mensaje en español: correo (solo ASCII, sin trucos), nombre (sin enlaces) y clave de 10 a 128")
    void validacion() throws Exception {
        for (String malo : List.of("no-es-correo", "a<b@c.de", "a,b@c.de", "maría@escuela.cr", "a..b@c.de", "a@b", "a\u0000b@c.de")) {
            mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/cuentas", Map.of("correo", malo)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error.campos.correo").value("Ese correo no es válido"));
        }
        String correo = Navegador.correoNuevo();
        pedirCuenta(correo, Navegador.ipNueva());
        String token = buzon.tokenPara(correo);
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/cuentas/confirmar",
                        Map.of("token", token, "nombre", "Visitá https://estafa.example", "clave", "corta")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.codigo").value("VALIDACION"))
                .andExpect(jsonPath("$.error.campos.nombre").value("Escribí solo tu nombre, con letras"))
                .andExpect(jsonPath("$.error.campos.clave").value("La clave tiene que tener entre 10 y 128 caracteres"));
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(token, "x".repeat(129))))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.campos.clave").exists());
        // Con todo eso, el enlace sigue sirviendo
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(token, CLAVE)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Una clave de las más usadas, o que contiene el correo, no se acepta (y el enlace sigue sirviendo)")
    void claveDebil() throws Exception {
        String correo = "carmen.solis." + System.nanoTime() + "@escuela.cr";
        pedirCuenta(correo, Navegador.ipNueva());
        String token = buzon.tokenPara(correo);
        for (String debil : List.of("1234567890", "Contraseña123", "puravida123", "aaaaaaaaaaaa", "ababababab", correo.substring(0, correo.indexOf('@')) + "!")) {
            mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(token, debil)))
                    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("CLAVE_DEBIL"));
        }
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(token, CLAVE)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Desde una misma IP, 60 pedidos de cuenta por hora; después 429 con Retry-After")
    void limitePorIp() throws Exception {
        String ip = Navegador.ipNueva();
        for (int i = 0; i < 60; i++) {
            pedirCuenta(Navegador.correoNuevo(), ip);
        }
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas", Map.of("correo", Navegador.correoNuevo())))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().exists("Retry-After"))
                .andExpect(jsonPath("$.error.codigo").value("DEMASIADOS_INTENTOS"));
    }

    @Test
    @DisplayName("Desde una misma IP, 60 enlaces por hora (aunque sean inventados)")
    void limiteDeEnlaces() throws Exception {
        String ip = Navegador.ipNueva();
        for (int i = 0; i < 60; i++) {
            mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(Tokens.nuevo(), CLAVE)))
                    .andExpect(status().isBadRequest());
        }
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/cuentas/confirmar", confirmacion(Tokens.nuevo(), CLAVE)))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    @DisplayName("A un mismo correo le llegan 3 correos de cuenta por hora como mucho: la respuesta sigue igual, pero no se manda más")
    void limitePorDestinatario() throws Exception {
        String correo = Navegador.correoNuevo();
        for (int i = 0; i < 5; i++) {
            pedirCuenta(correo, Navegador.ipNueva());
        }
        assertThat(buzon.para(correo)).hasSize(3);
        assertThat(filas("select count(*) from public.registros_pendientes where correo = ?", correo)).isEqualTo(3);
    }

    @Test
    @DisplayName("Un pedido desde otro sitio no puede pedir cuentas (CSRF): 403")
    void desdeOtroSitio() throws Exception {
        mvc.perform(Navegador.desdeElSitio("https://otro.example", "cross-site", Navegador.ipNueva(), HttpMethod.POST, "/api/v1/cuentas",
                        Map.of("correo", Navegador.correoNuevo())))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.error.codigo").value("ORIGEN_NO_PERMITIDO"));
    }
}
