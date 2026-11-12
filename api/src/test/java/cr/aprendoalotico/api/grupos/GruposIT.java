package cr.aprendoalotico.api.grupos;

import static cr.aprendoalotico.api.identidad.Navegador.desde;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cr.aprendoalotico.api.identidad.Navegador;
import cr.aprendoalotico.api.instituciones.PruebaDeInstituciones;
import java.time.Year;
import java.time.ZoneId;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.ResultActions;

class GruposIT extends PruebaDeInstituciones {

    private static final String CODIGO_DE_CLASE = "[2-9A-HJ-NP-Z]{6}";
    /** El curso que viene, como el que se arma a fin de año: el año de un grupo tiene que estar cerca del de hoy. */
    private static final int ANIO = Year.now(ZoneId.of("America/Costa_Rica")).getValue() + 1;

    private Persona directora;
    private Persona titular;
    private UUID escuela;

    @BeforeEach
    void armar() throws Exception {
        directora = persona();
        escuela = escuelaDe(directora);
        titular = persona();
        unir(directora, escuela, titular, "DOCENTE");
    }

    private ResultActions crear(Persona quien, UUID institucion, int grado, String seccion) throws Exception {
        return como(quien, HttpMethod.POST, "/api/v1/instituciones/" + institucion + "/grupos", Map.of("anio", ANIO, "grado", grado, "seccion", seccion));
    }

    private UUID grupo(Persona quien, UUID institucion, int grado, String seccion) throws Exception {
        return UUID.fromString(leer(crear(quien, institucion, grado, seccion).andExpect(status().isCreated()), "$.data.id"));
    }

    @Test
    @DisplayName("Una docente crea su grupo: queda de titular, con código de clase, y el año lectivo se crea solo (B24)")
    void crearGrupo() throws Exception {
        crear(titular, escuela, 2, " 3 ").andExpect(status().isCreated()).andExpect(jsonPath("$.data.anio").value(ANIO))
                .andExpect(jsonPath("$.data.grado").value(2)).andExpect(jsonPath("$.data.seccion").value("3"))
                .andExpect(jsonPath("$.data.codigoClase").value(org.hamcrest.Matchers.matchesPattern(CODIGO_DE_CLASE)))
                .andExpect(jsonPath("$.data.miPapel").value("TITULAR")).andExpect(jsonPath("$.data.puedoCambiar").value(true))
                .andExpect(jsonPath("$.data.docentes[0].usuario").value(titular.id().toString()));
        como(titular, HttpMethod.GET, "/api/v1/instituciones/" + escuela + "/anios", null).andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].anio").value(ANIO)).andExpect(jsonPath("$.data[0].desde").value(ANIO + "-02-01"))
                .andExpect(jsonPath("$.data[0].hasta").value(ANIO + "-12-15"));
    }

    @Test
    @DisplayName("Un año lejano no: el pasado, este o el que viene (400)")
    void anioLejano() throws Exception {
        como(titular, HttpMethod.POST, "/api/v1/instituciones/" + escuela + "/grupos", Map.of("anio", ANIO + 4, "grado", 1, "seccion", "1"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("ANIO_INVALIDO"));
        como(directora, HttpMethod.PUT, "/api/v1/instituciones/" + escuela + "/anios/" + (ANIO - 3),
                Map.of("desde", (ANIO - 3) + "-02-01", "hasta", (ANIO - 3) + "-12-01")).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.codigo").value("ANIO_INVALIDO"));
    }

    @Test
    @DisplayName("El mismo grado y sección el mismo año: 409 (la sección se compara en mayúsculas)")
    void grupoRepetido() throws Exception {
        grupo(titular, escuela, 2, "a");
        crear(directora, escuela, 2, "A").andExpect(status().isConflict()).andExpect(jsonPath("$.error.codigo").value("GRUPO_REPETIDO"));
        crear(directora, escuela, 3, "A").andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Grado fuera de 0–6 o sección con guiones: 400 campo por campo")
    void validacion() throws Exception {
        crear(titular, escuela, 7, "2-3").andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.campos.grado").exists())
                .andExpect(jsonPath("$.error.campos.seccion").exists());
    }

    @Test
    @DisplayName("Sin sesión, 401; de otra institución, 404 (ni el grupo ni crear ahí)")
    void sinSesionYAjeno() throws Exception {
        UUID id = grupo(titular, escuela, 1, "1");
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.GET, "/api/v1/grupos/" + id, null)).andExpect(status().isUnauthorized());

        Persona deOtra = persona();
        UUID otra = escuelaDe(deOtra);
        como(deOtra, HttpMethod.GET, "/api/v1/grupos/" + id, null).andExpect(status().isNotFound());
        como(deOtra, HttpMethod.PUT, "/api/v1/grupos/" + id, Map.of("grado", 1, "seccion", "9")).andExpect(status().isNotFound());
        como(deOtra, HttpMethod.POST, "/api/v1/grupos/" + id + "/codigo", null).andExpect(status().isNotFound());
        crear(deOtra, escuela, 1, "2").andExpect(status().isNotFound());
        como(deOtra, HttpMethod.GET, "/api/v1/instituciones/" + escuela + "/grupos", null).andExpect(status().isNotFound());
        como(titular, HttpMethod.GET, "/api/v1/instituciones/" + otra + "/anios", null).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("La dirección ve todos los grupos de la escuela; otra docente, solo los suyos")
    void quienVeQue() throws Exception {
        UUID delTitular = grupo(titular, escuela, 2, "1");
        Persona otra = persona();
        unir(directora, escuela, otra, "DOCENTE");
        grupo(otra, escuela, 2, "2");
        String deLaEscuela = "/api/v1/instituciones/" + escuela + "/grupos";

        como(otra, HttpMethod.GET, deLaEscuela, null).andExpect(jsonPath("$.meta.total").value(1))
                .andExpect(jsonPath("$.data[0].seccion").value("2"));
        como(otra, HttpMethod.GET, "/api/v1/grupos/" + delTitular, null).andExpect(status().isNotFound());
        como(directora, HttpMethod.GET, deLaEscuela + "?anio=" + ANIO, null).andExpect(jsonPath("$.meta.total").value(2));
        como(directora, HttpMethod.GET, deLaEscuela + "?anio=" + (ANIO - 1), null).andExpect(jsonPath("$.meta.total").value(0));
        // El equipo no es miembro: no ve grupos (B21)
        como(admin(), HttpMethod.GET, "/api/v1/grupos/" + delTitular, null).andExpect(status().isNotFound());
        como(directora, HttpMethod.GET, "/api/v1/grupos/" + delTitular, null).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.miPapel").value(nullValue())).andExpect(jsonPath("$.data.puedoCambiar").value(true));
    }

    @Test
    @DisplayName("Una docente de materia ve el grupo pero no lo cambia (403); se puede salir sola")
    void docenteDeMateria() throws Exception {
        UUID id = grupo(titular, escuela, 4, "1");
        Persona ingles = persona();
        unir(directora, escuela, ingles, "DOCENTE");
        String ruta = "/api/v1/grupos/" + id;

        como(titular, HttpMethod.PUT, ruta + "/docentes/" + ingles.id(), Map.of("papel", "MATERIA", "materia", " Inglés ")).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.docentes[*].materia", containsInAnyOrder(nullValue(), org.hamcrest.Matchers.is("Inglés"))));
        como(ingles, HttpMethod.GET, ruta, null).andExpect(status().isOk()).andExpect(jsonPath("$.data.miPapel").value("MATERIA"))
                .andExpect(jsonPath("$.data.puedoCambiar").value(false));
        como(ingles, HttpMethod.PUT, ruta, Map.of("grado", 4, "seccion", "2")).andExpect(status().isForbidden());
        como(ingles, HttpMethod.POST, ruta + "/codigo", null).andExpect(status().isForbidden());
        como(ingles, HttpMethod.DELETE, ruta + "/docentes/" + titular.id(), null).andExpect(status().isForbidden());
        como(ingles, HttpMethod.PUT, ruta + "/docentes/" + ingles.id(), Map.of("papel", "TITULAR")).andExpect(status().isForbidden());
        como(ingles, HttpMethod.DELETE, ruta + "/docentes/" + ingles.id(), null).andExpect(status().isOk());
        como(ingles, HttpMethod.GET, ruta, null).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("De materia sin materia, titular con materia o alguien que no da clases ahí: 400")
    void docenteInvalido() throws Exception {
        UUID id = grupo(titular, escuela, 5, "1");
        Persona colega = persona();
        unir(directora, escuela, colega, "DOCENTE");
        String docentes = "/api/v1/grupos/" + id + "/docentes/";

        como(titular, HttpMethod.PUT, docentes + colega.id(), Map.of("papel", "MATERIA")).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.codigo").value("MATERIA_INVALIDA"));
        como(titular, HttpMethod.PUT, docentes + colega.id(), Map.of("papel", "TITULAR", "materia", "Música")).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.codigo").value("MATERIA_INVALIDA"));
        como(titular, HttpMethod.PUT, docentes + persona().id(), Map.of("papel", "MATERIA", "materia", "Música")).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.codigo").value("NO_DA_CLASES_AQUI"));
    }

    @Test
    @DisplayName("Una titular nueva reemplaza a la anterior, que deja el grupo (y la respuesta le sale igual)")
    void titularNueva() throws Exception {
        UUID id = grupo(titular, escuela, 6, "1");
        Persona nueva = persona();
        unir(directora, escuela, nueva, "DOCENTE");

        como(titular, HttpMethod.PUT, "/api/v1/grupos/" + id + "/docentes/" + nueva.id(), Map.of("papel", "TITULAR")).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.docentes.length()").value(1)).andExpect(jsonPath("$.data.docentes[0].usuario").value(nueva.id().toString()))
                .andExpect(jsonPath("$.data.miPapel").value(nullValue())).andExpect(jsonPath("$.data.puedoCambiar").value(false));
        como(titular, HttpMethod.GET, "/api/v1/grupos/" + id, null).andExpect(status().isNotFound());
        como(nueva, HttpMethod.GET, "/api/v1/grupos/" + id, null).andExpect(jsonPath("$.data.miPapel").value("TITULAR"));
    }

    @Test
    @DisplayName("Un código de clase nuevo reemplaza al anterior")
    void codigoNuevo() throws Exception {
        UUID id = grupo(titular, escuela, 0, "1");
        String viejo = leer(como(titular, HttpMethod.GET, "/api/v1/grupos/" + id, null), "$.data.codigoClase");
        como(titular, HttpMethod.POST, "/api/v1/grupos/" + id + "/codigo", null).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.codigoClase").value(not(viejo)));
        assertThat(filas("select count(*) from public.grupos where codigo_clase = ?", viejo)).isZero();
    }

    @Test
    @DisplayName("A quien sacan de la escuela se le saca de sus grupos ahí (B23)")
    void alSacarlaDeLaEscuela() throws Exception {
        UUID id = grupo(titular, escuela, 3, "1");
        Persona musica = persona();
        unir(directora, escuela, musica, "DOCENTE");
        como(titular, HttpMethod.PUT, "/api/v1/grupos/" + id + "/docentes/" + musica.id(), Map.of("papel", "MATERIA", "materia", "Música"))
                .andExpect(status().isOk());

        como(directora, HttpMethod.DELETE, "/api/v1/instituciones/" + escuela + "/miembros/" + musica.id(), null).andExpect(status().isOk());
        como(musica, HttpMethod.GET, "/api/v1/grupos", null).andExpect(jsonPath("$.meta.total").value(0));
        como(musica, HttpMethod.DELETE, "/api/v1/grupos/" + id + "/docentes/" + titular.id(), null).andExpect(status().isNotFound());
        como(titular, HttpMethod.GET, "/api/v1/grupos/" + id, null).andExpect(jsonPath("$.data.docentes.length()").value(1));
    }

    @Test
    @DisplayName("Quien administra cambia las fechas del año; las fechas tienen que ser de ese año")
    void fechasDelAnio() throws Exception {
        String ruta = "/api/v1/instituciones/" + escuela + "/anios/" + ANIO;
        String inicio = ANIO + "-02-08";
        String cierre = ANIO + "-12-10";
        como(directora, HttpMethod.PUT, ruta, Map.of("desde", inicio, "hasta", cierre)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.desde").value(inicio));
        como(titular, HttpMethod.PUT, ruta, Map.of("desde", inicio, "hasta", cierre)).andExpect(status().isForbidden());
        como(directora, HttpMethod.PUT, ruta, Map.of("desde", cierre, "hasta", inicio)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.codigo").value("FECHAS_INVALIDAS"));
        como(directora, HttpMethod.PUT, ruta, Map.of("desde", (ANIO - 1) + "-12-01", "hasta", cierre)).andExpect(status().isBadRequest());
        // El grupo que se crea después usa las fechas que ya puso
        grupo(titular, escuela, 1, "5");
        como(titular, HttpMethod.GET, "/api/v1/instituciones/" + escuela + "/anios", null).andExpect(jsonPath("$.data[0].desde").value(inicio));
    }

    @Test
    @DisplayName("En un hogar funciona igual, y «mis grupos» junta los de todas mis instituciones")
    void hogarYMisGrupos() throws Exception {
        UUID hogar = hogarDe(titular);
        grupo(titular, hogar, 2, "1");
        grupo(titular, escuela, 2, "1");
        como(titular, HttpMethod.GET, "/api/v1/grupos", null).andExpect(status().isOk()).andExpect(jsonPath("$.meta.total").value(2))
                .andExpect(jsonPath("$.data[*].institucion", containsInAnyOrder(hogar.toString(), escuela.toString())));
    }
}
