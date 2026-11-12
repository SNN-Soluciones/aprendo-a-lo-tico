package cr.aprendoalotico.api.identidad;

import static cr.aprendoalotico.api.identidad.Navegador.con;
import static cr.aprendoalotico.api.identidad.Navegador.desde;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cr.aprendoalotico.api.comun.RelojDePrueba;
import jakarta.servlet.http.Cookie;
import java.util.Map;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

class SesionIT extends PruebaDeIdentidad {

    @Autowired
    RelojDePrueba.Detenible reloj;

    private org.springframework.test.web.servlet.ResultActions yo(Cookie sesion) throws Exception {
        return mvc.perform(con(sesion, desde(Navegador.ipNueva(), HttpMethod.GET, "/api/v1/yo", null)));
    }

    private String tokenDe(Cookie c) {
        return c.getValue();
    }

    @Test
    @DisplayName("Entrar deja la cookie __Host-sesion (HttpOnly, Secure, SameSite=Strict, 30 días) y con ella «yo» dice quién es")
    void entrarYYo() throws Exception {
        // Arrange
        String correo = cuentaNueva();
        // Act
        var r = mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/sesion", Map.of("correo", " " + correo.toUpperCase(), "clave", CLAVE))
                        .header(HttpHeaders.USER_AGENT, "Mozilla/5.0 " + "x".repeat(300)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.correo").value(correo))
                .andExpect(jsonPath("$.data.nombre").value("María José"))
                .andExpect(jsonPath("$.data.token").doesNotExist())
                .andReturn();
        // Assert
        String cookie = r.getResponse().getHeader(HttpHeaders.SET_COOKIE);
        assertThat(cookie).startsWith("__Host-sesion=").contains("Path=/", "Max-Age=2592000", "Secure", "HttpOnly", "SameSite=Strict")
                .doesNotContain("Domain");
        Cookie sesion = Navegador.cookie(r.getResponse().getCookie(CookieDeSesion.NOMBRE).getValue());
        yo(sesion).andExpect(status().isOk()).andExpect(jsonPath("$.data.correo").value(correo)).andExpect(jsonPath("$.data.id").isNotEmpty());
        // En la base: solo el hash del token, y el navegador cortado a 200
        assertThat(filas("select count(*) from public.sesiones where token_hash = sha256(convert_to(?, 'UTF8'))", tokenDe(sesion))).isOne();
        assertThat(filas("select count(*) from public.sesiones where encode(token_hash, 'escape') like ?", "%" + tokenDe(sesion) + "%")).isZero();
        assertThat(filas("select max(length(agente)) from public.sesiones s join public.usuarios u on u.id = s.usuario_id where u.correo = ?", correo))
                .isEqualTo(200);
        assertThat(filas("select count(*) from public.auditoria a join public.usuarios u on u.id = a.actor_id where u.correo = ? and a.accion = 'ENTRAR'",
                correo)).isOne();
    }

    @Test
    @DisplayName("Sin sesión, «yo» es 401; con una cookie inventada también (y no se toca la cookie: la borra «salir»)")
    void sinSesion() throws Exception {
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.GET, "/api/v1/yo", null))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.error.codigo").value("NO_AUTENTICADO"));
        yo(Navegador.cookie(Tokens.nuevo())).andExpect(status().isUnauthorized()).andExpect(header().doesNotExist(HttpHeaders.SET_COOKIE));
        yo(Navegador.cookie("<script>")).andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Clave equivocada y correo sin cuenta dan exactamente el mismo error (no se puede averiguar quién tiene cuenta)")
    void credencialesInvalidas() throws Exception {
        String correo = cuentaNueva();
        String claveMala = mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/sesion", Map.of("correo", correo, "clave", "otra clave larga")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.codigo").value("CREDENCIALES_INVALIDAS"))
                .andExpect(header().doesNotExist(HttpHeaders.SET_COOKIE))
                .andReturn().getResponse().getContentAsString();
        String sinCuenta = mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/sesion",
                        Map.of("correo", Navegador.correoNuevo(), "clave", "otra clave larga")))
                .andExpect(status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        assertThat(claveMala.replaceAll("\"pedido\":\"[^\"]+\"", "")).isEqualTo(sinCuenta.replaceAll("\"pedido\":\"[^\"]+\"", ""));
        assertThat(filas("select count(*) from public.auditoria a join public.usuarios u on u.id = a.recurso_id "
                + "where u.correo = ? and a.accion = 'ENTRAR_FALLIDO' and a.actor_tipo = 'SISTEMA'", correo)).isOne();
    }

    @Test
    @DisplayName("Desde una IP, 5 claves equivocadas por minuto contra una cuenta y la sexta es 429; desde otra IP la dueña entra igual")
    void limitePorIpYCorreo() throws Exception {
        String correo = cuentaNueva();
        String atacante = Navegador.ipNueva();
        for (int i = 0; i < 5; i++) {
            mvc.perform(desde(atacante, HttpMethod.POST, "/api/v1/sesion", Map.of("correo", correo, "clave", "equivocada " + i)))
                    .andExpect(status().isUnauthorized());
        }
        mvc.perform(desde(atacante, HttpMethod.POST, "/api/v1/sesion", Map.of("correo", correo, "clave", CLAVE)))
                .andExpect(status().isTooManyRequests()).andExpect(header().exists("Retry-After"));
        entrar(correo, CLAVE);
    }

    @Test
    @DisplayName("Entrar bien no gasta los intentos fallidos, pero sí cuenta: 30 entradas por hora por cuenta")
    void limiteDeEntradas() throws Exception {
        String correo = cuentaNueva();
        String ip = Navegador.ipNueva();
        for (int i = 0; i < 30; i++) {
            mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/sesion", Map.of("correo", correo, "clave", CLAVE))).andExpect(status().isOk());
        }
        mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/sesion", Map.of("correo", correo, "clave", CLAVE)))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    @DisplayName("La misma clave escrita de otra forma (NFKC) entra, aunque así pase de 128 caracteres")
    void claveEquivalenteMasLarga() throws Exception {
        // 44 ligaduras «ﬃ» (U+FB03): 64 caracteres al crearla; escrita con «ffi», 152
        String correo = cuentaNueva("ﬃ".repeat(44) + CLAVE);
        entrar(correo, "ffi".repeat(44) + CLAVE);
    }

    @Test
    @DisplayName("Con claves equivocadas desde muchas IP nadie deja a la titular sin entrar: las de la cuenta solo las gastan las buenas")
    void fallosAjenosNoGastanLasEntradasDeLaCuenta() throws Exception {
        String correo = cuentaNueva();
        // 35 fallos (más que las 30 entradas por hora de la cuenta), 5 por IP: el máximo por IP y correo
        for (int i = 0; i < 7; i++) {
            String ip = Navegador.ipNueva();
            for (int j = 0; j < 5; j++) {
                mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/sesion", Map.of("correo", correo, "clave", "equivocada")))
                        .andExpect(status().isUnauthorized());
            }
        }
        entrar(correo, CLAVE);
    }

    private int entrarDesde(String ip, String correo, String clave) throws Exception {
        return mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/sesion", Map.of("correo", correo, "clave", clave)))
                .andReturn().getResponse().getStatus();
    }

    @Test
    @DisplayName("Quien sabe el correo agota sus fallidos desde otras IP, pero la titular entra desde donde ya entró (B11)")
    void laTitularEntraDesdeSuIp() throws Exception {
        String correo = cuentaNueva();
        String casa = Navegador.ipNueva();
        assertThat(entrarDesde(casa, correo, CLAVE)).isEqualTo(200);
        reloj.detener();
        try {
            // 50 fallos, el tope por correo: 5 desde cada IP (el máximo por IP y correo)
            for (int i = 0; i < 10; i++) {
                String otra = Navegador.ipNueva();
                for (int j = 0; j < 5; j++) {
                    assertThat(entrarDesde(otra, correo, "equivocada")).isEqualTo(401);
                }
            }
            assertThat(entrarDesde(Navegador.ipNueva(), correo, CLAVE)).isEqualTo(429);
            assertThat(entrarDesde(casa, correo, CLAVE)).isEqualTo(200);
        } finally {
            reloj.soltar();
        }
    }

    @Test
    @DisplayName("Un estudiante agota los fallidos de la IP de la escuela, pero quien ya entró desde ahí entra igual (B11)")
    void laEscuelaNoQuedaBloqueada() throws Exception {
        String maestra = cuentaNueva();
        String nueva = cuentaNueva();
        String escuela = Navegador.ipNueva();
        assertThat(entrarDesde(escuela, maestra, CLAVE)).isEqualTo(200);
        reloj.detener();
        try {
            for (int i = 0; i < 30; i++) {
                assertThat(entrarDesde(escuela, Navegador.correoNuevo(), "equivocada")).isEqualTo(401);
            }
            assertThat(entrarDesde(escuela, Navegador.correoNuevo(), "equivocada")).isEqualTo(429);
            assertThat(entrarDesde(escuela, maestra, CLAVE)).isEqualTo(200);
            // Una cuenta que nunca entró desde la escuela sí espera: con el balde vacío no se compara ninguna clave
            assertThat(entrarDesde(escuela, nueva, CLAVE)).isEqualTo(429);
        } finally {
            reloj.soltar();
        }
    }

    @Test
    @DisplayName("Desde una IP, 30 fallos por minuto (contra distintas cuentas) y después 429")
    void limitePorIp() throws Exception {
        // Con el reloj quieto el tramo no se recupera a media prueba, tarde lo que tarde cada Argon2
        reloj.detener();
        try {
            String ip = Navegador.ipNueva();
            for (int i = 0; i < 30; i++) {
                mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/sesion", Map.of("correo", Navegador.correoNuevo(), "clave", "equivocada")))
                        .andExpect(status().isUnauthorized());
            }
            mvc.perform(desde(ip, HttpMethod.POST, "/api/v1/sesion", Map.of("correo", Navegador.correoNuevo(), "clave", "equivocada")))
                    .andExpect(status().isTooManyRequests());
        } finally {
            reloj.soltar();
        }
    }

    @Test
    @DisplayName("Como mucho 20 sesiones abiertas por cuenta: al abrir otra se cierra la más vieja")
    void topeDeSesiones() throws Exception {
        String correo = cuentaNueva();
        Cookie primera = entrar(correo, CLAVE);
        for (int i = 0; i < 20; i++) {
            entrar(correo, CLAVE);
        }
        yo(primera).andExpect(status().isUnauthorized());
        assertThat(filas("select count(*) from public.sesiones s join public.usuarios u on u.id = s.usuario_id "
                + "where u.correo = ? and s.cerrada_en is null", correo)).isEqualTo(20);
    }

    @Test
    @DisplayName("Si la clave se guardó con parámetros viejos, al entrar se recalcula con los de ahora")
    void renuevaElHash() throws Exception {
        String correo = cuentaNueva();
        String viejo = "{argon2}" + new org.springframework.security.crypto.argon2.Argon2PasswordEncoder(16, 32, 1, 4096, 1).encode(CLAVE);
        jdbc.sql("update public.usuarios set clave_hash = ? where correo = ?").param(1, viejo).param(2, correo).update();
        entrar(correo, CLAVE);
        assertThat(jdbc.sql("select clave_hash from public.usuarios where correo = ?").param(1, correo).query(String.class).single())
                .startsWith("{argon2}$argon2id$v=19$m=19456,t=2,p=1$");
        entrar(correo, CLAVE);
    }

    @Test
    @DisplayName("Salir cierra esta sesión y borra la cookie; la cookie vieja ya no sirve. Sin sesión, salir también responde bien")
    void salir() throws Exception {
        String correo = cuentaNueva();
        Cookie sesion = entrar(correo, CLAVE);
        Cookie otra = entrar(correo, CLAVE);
        mvc.perform(con(sesion, desde(Navegador.ipNueva(), HttpMethod.DELETE, "/api/v1/sesion", null)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.success").value(true))
                .andExpect(header().string(HttpHeaders.SET_COOKIE, Matchers.containsString("Max-Age=0")));
        yo(sesion).andExpect(status().isUnauthorized());
        yo(otra).andExpect(status().isOk());
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.DELETE, "/api/v1/sesion", null)).andExpect(status().isOk());
    }

    @Test
    @DisplayName("Salir de todos lados cierra todas sus sesiones (y solo las suyas)")
    void salirDeTodosLados() throws Exception {
        String correo = cuentaNueva();
        Cookie una = entrar(correo, CLAVE);
        Cookie otra = entrar(correo, CLAVE);
        Cookie ajena = entrar(cuentaNueva(), CLAVE);
        mvc.perform(con(una, desde(Navegador.ipNueva(), HttpMethod.DELETE, "/api/v1/sesiones", null))).andExpect(status().isOk());
        yo(una).andExpect(status().isUnauthorized());
        yo(otra).andExpect(status().isUnauthorized());
        yo(ajena).andExpect(status().isOk());
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.DELETE, "/api/v1/sesiones", null)).andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Una sesión vence a los 30 días, o a los 7 sin uso")
    void vencimiento() throws Exception {
        String correo = cuentaNueva();
        Cookie vieja = entrar(correo, CLAVE);
        Cookie sinUso = entrar(correo, CLAVE);
        jdbc.sql("update public.sesiones set expira_en = now() - interval '1 second' where token_hash = sha256(convert_to(?, 'UTF8'))")
                .param(1, tokenDe(vieja)).update();
        jdbc.sql("update public.sesiones set vista_en = now() - interval '8 days' where token_hash = sha256(convert_to(?, 'UTF8'))")
                .param(1, tokenDe(sinUso)).update();
        yo(vieja).andExpect(status().isUnauthorized());
        yo(sinUso).andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Usar la sesión la mantiene viva: se anota el uso (como mucho cada 5 minutos)")
    void anotaElUso() throws Exception {
        Cookie sesion = entrar(cuentaNueva(), CLAVE);
        jdbc.sql("update public.sesiones set vista_en = now() - interval '6 days' where token_hash = sha256(convert_to(?, 'UTF8'))")
                .param(1, tokenDe(sesion)).update();
        yo(sesion).andExpect(status().isOk());
        assertThat(filas("select count(*) from public.sesiones where token_hash = sha256(convert_to(?, 'UTF8')) and vista_en > now() - interval '1 minute'",
                tokenDe(sesion))).isOne();
    }

    @Test
    @DisplayName("Un cuerpo de más de 64 KB no llega ni a leerse: 413, con el sobre y las cabeceras de seguridad")
    void cuerpoDemasiadoGrande() throws Exception {
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/sesion", Map.of("correo", "a@b.cr", "clave", "x".repeat(70_000))))
                .andExpect(status().isPayloadTooLarge()).andExpect(jsonPath("$.error.codigo").value("DEMASIADO_GRANDE"))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().exists("X-Id-Pedido"));
        // También un formulario a una ruta pública, que antes leía entero el filtro de formularios de Spring
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.DELETE, "/api/v1/sesion", null)
                        .contentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED).content("a=" + "x".repeat(70_000)))
                .andExpect(status().isPayloadTooLarge());
    }
}
