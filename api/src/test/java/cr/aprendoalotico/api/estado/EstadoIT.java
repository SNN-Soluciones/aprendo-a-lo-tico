package cr.aprendoalotico.api.estado;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cr.aprendoalotico.api.PruebaDeIntegracion;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

class EstadoIT extends PruebaDeIntegracion {

    @Autowired
    MockMvc mvc;

    @Test
    void elEstadoEsPublicoYDiceQueLaBaseResponde() throws Exception {
        mvc.perform(get("/api/v1/estado"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.servicio").value("aprendo-a-lo-tico-api"))
                .andExpect(jsonPath("$.data.base").value("ok"))
                .andExpect(jsonPath("$.data.version").isNotEmpty())
                .andExpect(jsonPath("$.data.hora").isNotEmpty())
                .andExpect(jsonPath("$.error").doesNotExist());
    }

    @Test
    void cadaRespuestaTraeSuIdDePedido() throws Exception {
        mvc.perform(get("/api/v1/estado"))
                .andExpect(header().string("X-Id-Pedido", org.hamcrest.Matchers.matchesPattern("[0-9a-f-]{36}")));
    }

    @Test
    void elIdLoPoneSiempreElServidorAunqueElClienteMandeUno() throws Exception {
        mvc.perform(get("/api/v1/estado").header("X-Id-Pedido", "juego-reloj-123"))
                .andExpect(header().string("X-Id-Pedido", org.hamcrest.Matchers.matchesPattern("[0-9a-f-]{36}")));
    }
}
