package cr.aprendoalotico.api.instituciones;

import static cr.aprendoalotico.api.identidad.Navegador.desde;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cr.aprendoalotico.api.identidad.Navegador;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;

class InstitucionesIT extends PruebaDeInstituciones {

    @Test
    @DisplayName("Sin sesión, nada de instituciones: 401")
    void sinSesion() throws Exception {
        for (String ruta : List.of("/api/v1/instituciones", "/api/v1/admin/escuelas", "/api/v1/instituciones/" + UUID.randomUUID())) {
            mvc.perform(desde(Navegador.ipNueva(), HttpMethod.GET, ruta, null)).andExpect(status().isUnauthorized());
        }
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/hogares", Map.of("nombre", "Casa"))).andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Las escuelas las crea solo el equipo (B21); el mismo código MEP dos veces: 409")
    void soloElEquipoCreaEscuelas() throws Exception {
        var escuela = Map.of("nombre", "  Escuela   Fidel Chaves Murillo ", "codigoMep", mepNuevo(), "provincia", "ALAJUELA", "canton", "Grecia",
                "direccionRegional", "Occidente");
        // La cadena de seguridad ya lo frena (segunda capa): el servicio lo revisa igual
        como(persona(), HttpMethod.POST, "/api/v1/admin/escuelas", escuela).andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error.codigo").value("PROHIBIDO"));

        Persona equipo = admin();
        como(equipo, HttpMethod.POST, "/api/v1/admin/escuelas", escuela).andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.tipo").value("ESCUELA")).andExpect(jsonPath("$.data.nombre").value("Escuela Fidel Chaves Murillo"))
                .andExpect(jsonPath("$.data.provincia").value("ALAJUELA")).andExpect(jsonPath("$.data.roles").isEmpty());
        como(equipo, HttpMethod.POST, "/api/v1/admin/escuelas", escuela).andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.codigo").value("ESCUELA_REPETIDA"));
    }

    @Test
    @DisplayName("Lo que no tiene forma de escuela se rechaza campo por campo")
    void validacion() throws Exception {
        como(admin(), HttpMethod.POST, "/api/v1/admin/escuelas", Map.of("nombre", "<script>", "codigoMep", "12a", "provincia", "Narnia"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("VALIDACION"))
                .andExpect(jsonPath("$.error.campos.nombre").exists()).andExpect(jsonPath("$.error.campos.codigoMep").exists())
                .andExpect(jsonPath("$.error.campos.provincia").exists());
    }

    @Test
    @DisplayName("El equipo le pasa la escuela a la dirección con un código; el equipo no es miembro y no la ve como tal")
    void elEquipoLePasaLaEscuelaALaDireccion() throws Exception {
        Persona equipo = admin();
        UUID id = escuela(equipo);
        String codigo = codigo(equipo, id, "DIRECCION", true);
        assertThat(codigo).matches("[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}");

        // El que da la dirección vence en 2 días (B22); el de docente, en 7
        assertThat(filas("select extract(epoch from expira_en - creada_en)::int / 3600 from public.invitaciones "
                + "where institucion_id = ? and rol = 'DIRECCION'", id)).isEqualTo(48);
        Persona directora = persona();
        // Escrito como lo copiaría alguien de un WhatsApp: en minúsculas y sin guiones
        aceptar(directora, codigo.toLowerCase().replace("-", " ")).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(id.toString())).andExpect(jsonPath("$.data.roles[0]").value("DIRECCION"));
        como(directora, HttpMethod.GET, "/api/v1/instituciones", null).andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(id.toString())).andExpect(jsonPath("$.meta.total").value(1));
        como(equipo, HttpMethod.GET, "/api/v1/instituciones/" + id, null).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Un código sirve una vez; el error es el mismo si no existe, se usó, se revocó o venció (B22)")
    void codigoDeUnSoloUso() throws Exception {
        Persona directora = persona();
        UUID id = escuelaDe(directora);
        String usado = codigo(directora, id, "DOCENTE", false);
        aceptar(persona(), usado).andExpect(status().isOk());

        String revocado = codigo(directora, id, "DOCENTE", false);
        UUID idRevocado = UUID.fromString(leer(como(directora, HttpMethod.GET, "/api/v1/instituciones/" + id + "/invitaciones", null), "$.data[0].id"));
        como(directora, HttpMethod.DELETE, "/api/v1/instituciones/" + id + "/invitaciones/" + idRevocado, null).andExpect(status().isOk());

        String vencido = codigo(directora, id, "DOCENTE", false);
        jdbc.sql("update public.invitaciones set expira_en = now() - interval '1 minute' where usada_en is null and revocada_en is null and institucion_id = ?")
                .param(id).update();

        for (String malo : List.of(usado, revocado, vencido, "ABCD-EFGH-JKLM", "no es un código")) {
            aceptar(persona(), malo).andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("INVITACION_INVALIDA"));
        }
    }

    @Test
    @DisplayName("Con el rol que ya tiene: 409 y el código sigue sirviendo para otra persona")
    void yaTieneEseRol() throws Exception {
        Persona directora = persona();
        UUID id = escuelaDe(directora);
        Persona subdirectora = persona();
        unir(directora, id, subdirectora, "DIRECCION");
        String codigo = codigo(directora, id, "DIRECCION", false);
        aceptar(subdirectora, codigo).andExpect(status().isConflict()).andExpect(jsonPath("$.error.codigo").value("YA_TIENE_ESE_ROL"));
        aceptar(persona(), codigo).andExpect(status().isOk());
    }

    @Test
    @DisplayName("Nadie usa un código suyo: ni el equipo se hace dirección de una escuela (B21) ni nadie se da otro rol")
    void codigoPropio() throws Exception {
        Persona equipo = admin();
        UUID id = escuela(equipo);
        String paraLaDireccion = codigo(equipo, id, "DIRECCION", true);
        aceptar(equipo, paraLaDireccion).andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("INVITACION_INVALIDA"));
        Persona directora = persona();
        aceptar(directora, paraLaDireccion).andExpect(status().isOk());
        aceptar(directora, codigo(directora, id, "DOCENTE", false)).andExpect(status().isBadRequest());
        como(equipo, HttpMethod.GET, "/api/v1/instituciones/" + id, null).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Al sacar a alguien, los códigos que sacó dejan de servir: nadie vuelve a entrar por la puerta que dejó")
    void codigosDeQuienSale() throws Exception {
        Persona directora = persona();
        UUID id = escuelaDe(directora);
        Persona subdirectora = persona();
        unir(directora, id, subdirectora, "DIRECCION");
        String suyo = codigo(subdirectora, id, "DIRECCION", false);
        String mio = codigo(directora, id, "DOCENTE", false);

        como(directora, HttpMethod.DELETE, "/api/v1/instituciones/" + id + "/miembros/" + subdirectora.id(), null).andExpect(status().isOk());
        aceptar(subdirectora, suyo).andExpect(status().isBadRequest());
        aceptar(persona(), suyo).andExpect(status().isBadRequest()).andExpect(jsonPath("$.error.codigo").value("INVITACION_INVALIDA"));
        aceptar(persona(), mio).andExpect(status().isOk());
    }

    @Test
    @DisplayName("Con docente y dirección a la vez, sacarla le cierra los dos roles")
    void dosRoles() throws Exception {
        Persona directora = persona();
        UUID id = escuelaDe(directora);
        Persona ambas = persona();
        unir(directora, id, ambas, "DOCENTE");
        unir(directora, id, ambas, "DIRECCION");
        como(ambas, HttpMethod.GET, "/api/v1/instituciones/" + id, null).andExpect(jsonPath("$.data.roles.length()").value(2));

        como(directora, HttpMethod.DELETE, "/api/v1/instituciones/" + id + "/miembros/" + ambas.id(), null).andExpect(status().isOk());
        assertThat(filas("select count(*) from public.membresias where usuario_id = ? and hasta is null", ambas.id())).isZero();
    }

    @Test
    @DisplayName("Dos que administran se sacan una a la otra a la vez: sale una sola y la otra sigue administrando")
    void seSacanALaVez() throws Exception {
        for (int vuelta = 0; vuelta < 5; vuelta++) {
            Persona a = persona();
            UUID id = escuelaDe(a);
            Persona b = persona();
            unir(a, id, b, "DIRECCION");
            String miembros = "/api/v1/instituciones/" + id + "/miembros/";

            List<Integer> estados = aLaVez(() -> estado(como(a, HttpMethod.DELETE, miembros + b.id(), null)),
                    () -> estado(como(b, HttpMethod.DELETE, miembros + a.id(), null)));
            assertThat(estados).containsOnlyOnce(200);
            assertThat(filas("select count(*) from public.membresias where institucion_id = ? and rol = 'DIRECCION' and hasta is null", id))
                    .isOne();
        }
    }

    @Test
    @DisplayName("Dos personas con el mismo código a la vez: entra una sola")
    void mismoCodigoALaVez() throws Exception {
        for (int vuelta = 0; vuelta < 5; vuelta++) {
            Persona directora = persona();
            UUID id = escuelaDe(directora);
            String codigo = codigo(directora, id, "DOCENTE", false);
            Persona una = persona();
            Persona otra = persona();

            List<Integer> estados = aLaVez(() -> estado(aceptar(una, codigo)), () -> estado(aceptar(otra, codigo)));
            assertThat(estados).containsExactlyInAnyOrder(200, 400);
        }
    }

    @Test
    @DisplayName("Lo de otra institución da 404, como si no existiera")
    void loAjeno() throws Exception {
        Persona directoraA = persona();
        escuelaDe(directoraA);
        UUID b = escuelaDe(persona());
        String deB = "/api/v1/instituciones/" + b;
        como(directoraA, HttpMethod.GET, deB, null).andExpect(status().isNotFound()).andExpect(jsonPath("$.error.codigo").value("NO_ENCONTRADO"));
        como(directoraA, HttpMethod.PUT, deB, Map.of("nombre", "Mía")).andExpect(status().isNotFound());
        como(directoraA, HttpMethod.GET, deB + "/miembros", null).andExpect(status().isNotFound());
        como(directoraA, HttpMethod.POST, deB + "/invitaciones", Map.of("rol", "DOCENTE")).andExpect(status().isNotFound());
        como(directoraA, HttpMethod.GET, deB + "/invitaciones", null).andExpect(status().isNotFound());
        como(directoraA, HttpMethod.DELETE, deB + "/miembros/" + directoraA.id(), null).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Una docente ve la escuela y a sus colegas (sin los correos), pero no la administra: 403")
    void docenteNoAdministra() throws Exception {
        Persona directora = persona();
        UUID id = escuelaDe(directora);
        Persona docente = persona();
        unir(directora, id, docente, "DOCENTE");
        String ruta = "/api/v1/instituciones/" + id;

        como(docente, HttpMethod.GET, ruta, null).andExpect(status().isOk()).andExpect(jsonPath("$.data.roles[0]").value("DOCENTE"));
        como(docente, HttpMethod.PUT, ruta, Map.of("nombre", "Otra")).andExpect(status().isForbidden());
        como(docente, HttpMethod.POST, ruta + "/invitaciones", Map.of("rol", "DOCENTE")).andExpect(status().isForbidden());
        como(docente, HttpMethod.GET, ruta + "/invitaciones", null).andExpect(status().isForbidden());
        como(docente, HttpMethod.GET, ruta + "/miembros", null).andExpect(status().isOk()).andExpect(jsonPath("$.meta.total").value(2))
                .andExpect(jsonPath("$.data[0].correo").value(nullValue())).andExpect(jsonPath("$.data[1].correo").value(nullValue()));
        como(directora, HttpMethod.GET, ruta + "/miembros", null).andExpect(status().isOk())
                .andExpect(jsonPath("$.data[*].correo", containsInAnyOrder(directora.correo(), docente.correo())));
    }

    @Test
    @DisplayName("Quien administra cambia los datos, pero no el código MEP; el equipo sí")
    void cambiarDatos() throws Exception {
        Persona equipo = admin();
        String mep = mepNuevo();
        UUID id = UUID.fromString(leer(como(equipo, HttpMethod.POST, "/api/v1/admin/escuelas", Map.of("nombre", "Escuela Vieja", "codigoMep", mep))
                .andExpect(status().isCreated()), "$.data.id"));
        Persona directora = persona();
        aceptar(directora, codigo(equipo, id, "DIRECCION", true)).andExpect(status().isOk());

        var cambio = new HashMap<String, Object>(Map.of("nombre", "Escuela Nueva", "canton", "Grecia"));
        cambio.put("codigoMep", "1");
        como(directora, HttpMethod.PUT, "/api/v1/instituciones/" + id, cambio).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.nombre").value("Escuela Nueva")).andExpect(jsonPath("$.data.canton").value("Grecia"))
                .andExpect(jsonPath("$.data.codigoMep").value(mep));
        String otroMep = mepNuevo();
        como(equipo, HttpMethod.PUT, "/api/v1/admin/escuelas/" + id, Map.of("nombre", "Escuela Nueva", "codigoMep", otroMep)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.codigoMep").value(otroMep));
    }

    @Test
    @DisplayName("Un hogar lo crea cualquiera y queda de encargado; ahí solo hay encargados")
    void hogar() throws Exception {
        Persona mama = persona();
        var r = como(mama, HttpMethod.POST, "/api/v1/hogares", Map.of("nombre", "Casa de los Mora")).andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.tipo").value("HOGAR")).andExpect(jsonPath("$.data.roles[0]").value("ENCARGADO"));
        UUID id = UUID.fromString(leer(r, "$.data.id"));

        como(mama, HttpMethod.POST, "/api/v1/instituciones/" + id + "/invitaciones", Map.of("rol", "DOCENTE")).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.codigo").value("ROL_INVALIDO"));
        Persona papa = persona();
        unir(mama, id, papa, "ENCARGADO");
        // En un hogar, los datos de escuela no se guardan aunque vengan
        como(papa, HttpMethod.PUT, "/api/v1/instituciones/" + id, Map.of("nombre", "Casa Mora Vargas", "canton", "Grecia")).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.nombre").value("Casa Mora Vargas")).andExpect(jsonPath("$.data.canton").value(nullValue()));
        // Y el equipo no maneja hogares
        como(admin(), HttpMethod.POST, "/api/v1/admin/escuelas/" + id + "/invitaciones", Map.of("rol", "ENCARGADO")).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Sacar a alguien le quita el acceso en el acto; al último que administra no se le puede sacar")
    void retirar() throws Exception {
        Persona directora = persona();
        UUID id = escuelaDe(directora);
        Persona docente = persona();
        Persona otra = persona();
        unir(directora, id, docente, "DOCENTE");
        unir(directora, id, otra, "DOCENTE");
        String miembros = "/api/v1/instituciones/" + id + "/miembros/";

        como(otra, HttpMethod.DELETE, miembros + docente.id(), null).andExpect(status().isForbidden());
        como(directora, HttpMethod.DELETE, miembros + docente.id(), null).andExpect(status().isOk());
        como(docente, HttpMethod.GET, "/api/v1/instituciones/" + id, null).andExpect(status().isNotFound());
        como(directora, HttpMethod.DELETE, miembros + docente.id(), null).andExpect(status().isNotFound());

        como(directora, HttpMethod.DELETE, miembros + directora.id(), null).andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.codigo").value("ULTIMO_ADMINISTRADOR"));
        // Cualquiera puede salirse
        como(otra, HttpMethod.DELETE, miembros + otra.id(), null).andExpect(status().isOk());
        // Con otra persona en la dirección, la primera ya se puede ir
        Persona subdirectora = persona();
        unir(directora, id, subdirectora, "DIRECCION");
        como(directora, HttpMethod.DELETE, miembros + directora.id(), null).andExpect(status().isOk());
    }

    @Test
    @DisplayName("Los códigos pendientes se ven sin el código, y uno revocado ya no está")
    void pendientes() throws Exception {
        Persona directora = persona();
        UUID id = escuelaDe(directora);
        codigo(directora, id, "DOCENTE", false);
        codigo(directora, id, "DIRECCION", false);
        String ruta = "/api/v1/instituciones/" + id + "/invitaciones";

        var r = como(directora, HttpMethod.GET, ruta, null).andExpect(status().isOk()).andExpect(jsonPath("$.meta.total").value(2))
                .andExpect(jsonPath("$.data[0].codigo").doesNotExist()).andExpect(jsonPath("$.data[*].rol", hasItem("DIRECCION")));
        String primera = leer(r, "$.data[0].id");
        como(directora, HttpMethod.DELETE, ruta + "/" + primera, null).andExpect(status().isOk());
        como(directora, HttpMethod.GET, ruta, null).andExpect(jsonPath("$.meta.total").value(1));
        como(directora, HttpMethod.DELETE, ruta + "/" + primera, null).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Probar códigos en bucle: 10 por hora por cuenta y después 429")
    void limiteAlAceptar() throws Exception {
        Persona alguien = persona();
        for (int i = 0; i < 10; i++) {
            aceptar(alguien, "ABCD-EFGH-JKLM").andExpect(status().isBadRequest());
        }
        aceptar(alguien, "ABCD-EFGH-JKLM").andExpect(status().isTooManyRequests());
    }

    @Test
    @DisplayName("Las escuelas del equipo van por páginas: de 1 a 100")
    void paginas() throws Exception {
        Persona equipo = admin();
        escuela(equipo);
        escuela(equipo);
        como(equipo, HttpMethod.GET, "/api/v1/admin/escuelas?tamano=1&pagina=2", null).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1)).andExpect(jsonPath("$.meta.pagina").value(2))
                .andExpect(jsonPath("$.meta.tamano").value(1));
        como(equipo, HttpMethod.GET, "/api/v1/admin/escuelas?tamano=101", null).andExpect(status().isBadRequest());
        como(equipo, HttpMethod.GET, "/api/v1/admin/escuelas?pagina=0", null).andExpect(status().isBadRequest());
        como(equipo, HttpMethod.GET, "/api/v1/admin/escuelas?pagina=10001", null).andExpect(status().isBadRequest());
    }

    private static int estado(org.springframework.test.web.servlet.ResultActions r) {
        return r.andReturn().getResponse().getStatus();
    }

    /** Corre los dos pedidos a la vez (salen juntos de una largada) y devuelve sus estados. */
    private static List<Integer> aLaVez(Callable<Integer> uno, Callable<Integer> otro) throws Exception {
        var largada = new CountDownLatch(1);
        try (var hilos = Executors.newFixedThreadPool(2)) {
            List<Future<Integer>> pedidos = List.of(uno, otro).stream().map(p -> hilos.submit(() -> {
                largada.await();
                return p.call();
            })).toList();
            largada.countDown();
            return List.of(pedidos.get(0).get(30, TimeUnit.SECONDS), pedidos.get(1).get(30, TimeUnit.SECONDS));
        }
    }

    private static final AtomicInteger MEPS = new AtomicInteger(10_000_000);

    /** Un código MEP que ninguna otra prueba usó. */
    private static String mepNuevo() {
        return String.valueOf(MEPS.incrementAndGet());
    }
}
