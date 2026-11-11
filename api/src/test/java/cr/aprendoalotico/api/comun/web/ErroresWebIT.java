package cr.aprendoalotico.api.comun.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cr.aprendoalotico.api.PruebaDeIntegracion;
import cr.aprendoalotico.pruebas.ControladorDePruebas;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/** Cada tipo de error, pasando por el cableado real (filtros, seguridad, MVC), sale con el sobre y el código correctos. */
@Import(ControladorDePruebas.class)
@WithMockUser
@ExtendWith(OutputCaptureExtension.class)
class ErroresWebIT extends PruebaDeIntegracion {

    @Autowired
    MockMvc mvc;

    @Test
    @DisplayName("Un «no tenés permiso» lanzado en un servicio es 403 PROHIBIDO (no 500), con las cabeceras de seguridad")
    void prohibidoEs403() throws Exception {
        mvc.perform(get("/api/v1/pruebas/prohibido"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error.codigo").value("PROHIBIDO"))
                .andExpect(jsonPath("$.error.pedido").isNotEmpty())
                .andExpect(header().string("X-Content-Type-Options", "nosniff"));
    }

    @Test
    @DisplayName("Un parámetro que no cumple su regla es 400 VALIDACION con el campo")
    void parametroInvalidoEsValidacion() throws Exception {
        mvc.perform(get("/api/v1/pruebas/numero").param("n", "0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.codigo").value("VALIDACION"))
                .andExpect(jsonPath("$.error.campos.n").isNotEmpty());
    }

    @Test
    @DisplayName("Un cuerpo inválido es 400 VALIDACION, con los mensajes en español y en el orden de los campos")
    void cuerpoInvalidoEnEspanol() throws Exception {
        mvc.perform(post("/api/v1/pruebas/registro").contentType(MediaType.APPLICATION_JSON).content("{\"nombre\":\" \",\"correo\":\"x\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.codigo").value("VALIDACION"))
                .andExpect(jsonPath("$.error.campos.nombre").value(Matchers.containsString("no debe")))
                .andExpect(jsonPath("$.error.campos.correo").value(Matchers.containsString("correo")));
    }

    @Test
    @DisplayName("Mandar otro tipo de contenido es 415 TIPO_NO_SOPORTADO (no 500)")
    void tipoNoSoportado() throws Exception {
        mvc.perform(post("/api/v1/pruebas/json").contentType(MediaType.TEXT_PLAIN).content("hola"))
                .andExpect(status().isUnsupportedMediaType())
                .andExpect(jsonPath("$.error.codigo").value("TIPO_NO_SOPORTADO"));
    }

    @Test
    @DisplayName("Un ResponseStatusException conserva su estado: 404 NO_ENCONTRADO")
    void responseStatusConservaEstado() throws Exception {
        mvc.perform(get("/api/v1/pruebas/estado-http"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error.codigo").value("NO_ENCONTRADO"));
    }

    @Test
    @DisplayName("Falta una cabecera obligatoria: 400 PARAMETRO_INVALIDO")
    void faltaCabecera() throws Exception {
        mvc.perform(get("/api/v1/pruebas/cabecera"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.codigo").value("PARAMETRO_INVALIDO"));
    }

    @Test
    @DisplayName("Un método que no va es 405 y dice cuáles sí (Allow)")
    void metodoNoPermitido() throws Exception {
        mvc.perform(patch("/api/v1/pruebas/numero"))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.error.codigo").value("METODO_NO_PERMITIDO"))
                .andExpect(header().string("Allow", Matchers.containsString("GET")));
    }

    @Test
    @DisplayName("Un error de negocio sale con su estado y su código")
    void errorDeNegocio() throws Exception {
        mvc.perform(get("/api/v1/pruebas/negocio"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.codigo").value("GRUPO_REPETIDO"));
    }

    @Test
    @DisplayName("Un error de la base es 500 genérico, y el log no guarda los datos personales del mensaje")
    void errorDeBaseSinDatosEnElLog(CapturedOutput salida) throws Exception {
        mvc.perform(get("/api/v1/pruebas/duplicado"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error.codigo").value("ERROR_INTERNO"))
                .andExpect(jsonPath("$.error.mensaje").value(Matchers.not(Matchers.containsString("maria"))));
        assertThat(salida.getAll()).contains("DataIntegrityViolationException").doesNotContain("maria@example.com");
    }

    @Test
    @DisplayName("Una ruta que no existe, con sesión, es 404 NO_ENCONTRADO; el Actuator no expone más que la salud")
    void noExisteYActuatorCerrado() throws Exception {
        mvc.perform(get("/api/v1/nada")).andExpect(status().isNotFound()).andExpect(jsonPath("$.error.codigo").value("NO_ENCONTRADO"));
        mvc.perform(get("/actuator/env")).andExpect(status().isNotFound());
        mvc.perform(get("/actuator/beans")).andExpect(status().isNotFound());
    }
}
