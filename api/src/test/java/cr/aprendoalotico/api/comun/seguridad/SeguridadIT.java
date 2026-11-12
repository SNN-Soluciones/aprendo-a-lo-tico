package cr.aprendoalotico.api.comun.seguridad;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cr.aprendoalotico.api.PruebaDeIntegracion;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

class SeguridadIT extends PruebaDeIntegracion {

    @Autowired
    MockMvc mvc;

    @Autowired
    ApplicationContext contexto;

    @Test
    @DisplayName("Todo lo que no se abrió a propósito pide sesión, con el sobre, el id del pedido y las cabeceras")
    void todoLoQueNoSeAbrioAPropositoPideSesion() throws Exception {
        mvc.perform(get("/api/v1/grupos"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data").doesNotExist())
                .andExpect(jsonPath("$.error.codigo").value("NO_AUTENTICADO"))
                .andExpect(jsonPath("$.error.pedido").isNotEmpty())
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().exists("X-Id-Pedido"));
    }

    @Test
    @DisplayName("Un POST desde otro sitio se rechaza antes de todo, también con cabeceras e id del pedido")
    void unPostDesdeOtroSitioSeRechazaAntesDeTodo() throws Exception {
        mvc.perform(post("/api/v1/sesiones").header("Origin", "https://sitio-malo.com"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error.codigo").value("ORIGEN_NO_PERMITIDO"))
                .andExpect(jsonPath("$.error.pedido").isNotEmpty())
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().string("X-Frame-Options", "DENY"));
    }

    @Test
    @DisplayName("Un POST desde el propio sitio pasa el filtro de origen y sigue a la autenticación")
    void unPostDesdeElSitioPasaElFiltro() throws Exception {
        mvc.perform(post("/api/v1/sesiones").header("Origin", "https://aprendoalotico.cr").header("Sec-Fetch-Site", "same-origin"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.codigo").value("NO_AUTENTICADO"));
    }

    @Test
    @DisplayName("Las respuestas traen las cabeceras de seguridad, y HSTS cuando la conexión es segura")
    void lasRespuestasTraenLasCabecerasDeSeguridad() throws Exception {
        mvc.perform(get("/api/v1/estado").secure(true))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().string("X-Frame-Options", "DENY"))
                .andExpect(header().string("Referrer-Policy", "same-origin"))
                .andExpect(header().string("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'"))
                .andExpect(header().string("Strict-Transport-Security", Matchers.containsString("max-age=31536000")))
                .andExpect(header().string("Cache-Control", Matchers.containsString("no-store")));
    }

    @Test
    @DisplayName("La salud del Actuator es pública (para la plataforma); lo demás del Actuator no existe")
    void soloLaSaludEsPublica() throws Exception {
        mvc.perform(get("/actuator/health")).andExpect(status().isOk());
        mvc.perform(get("/actuator/health/liveness")).andExpect(status().isOk());
    }

    @Test
    @DisplayName("No hay usuario por defecto de Spring con clave impresa en el log: las cuentas son nuestras")
    void sinUsuarioPorDefecto() {
        assertThat(contexto.getBeanNamesForType(UserDetailsService.class)).isEmpty();
    }
}
