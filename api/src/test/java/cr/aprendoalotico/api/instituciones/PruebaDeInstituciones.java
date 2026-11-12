package cr.aprendoalotico.api.instituciones;

import static cr.aprendoalotico.api.identidad.Navegador.con;
import static cr.aprendoalotico.api.identidad.Navegador.desde;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import cr.aprendoalotico.api.identidad.Navegador;
import cr.aprendoalotico.api.identidad.PruebaDeIdentidad;
import jakarta.servlet.http.Cookie;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Lo que comparten las pruebas de instituciones y grupos: personas con su sesión, gente del equipo y atajos para armar
 * una escuela con su dirección, sus docentes o un hogar. Cada pedido sale de una IP nueva (los límites no se mezclan).
 */
public abstract class PruebaDeInstituciones extends PruebaDeIdentidad {

    /** Alguien con cuenta y sesión abierta. */
    public record Persona(UUID id, String correo, Cookie sesion) {
    }

    /** Una cuenta nueva, ya adentro. */
    protected Persona persona() throws Exception {
        String correo = cuentaNueva();
        UUID id = jdbc.sql("select id from public.usuarios where correo = ?").param(correo).query(UUID.class).single();
        return new Persona(id, correo, entrar(correo, CLAVE));
    }

    /** Alguien del equipo (B21): se marca a mano en la base, como en producción. */
    protected Persona admin() throws Exception {
        Persona p = persona();
        jdbc.sql("insert into public.administradores (usuario_id, desde, motivo) values (?, now(), 'Pruebas')").param(p.id()).update();
        return p;
    }

    protected ResultActions como(Persona quien, HttpMethod metodo, String ruta, Map<String, ?> cuerpo) throws Exception {
        return mvc.perform(con(quien.sesion(), desde(Navegador.ipNueva(), metodo, ruta, cuerpo)));
    }

    protected static <T> T leer(ResultActions r, String ruta) throws Exception {
        return JsonPath.read(r.andReturn().getResponse().getContentAsString(), ruta);
    }

    /** Una escuela recién creada por el equipo, todavía sin miembros. */
    protected UUID escuela(Persona admin) throws Exception {
        var r = como(admin, HttpMethod.POST, "/api/v1/admin/escuelas", Map.of("nombre", "Escuela " + UUID.randomUUID().toString().substring(0, 8)))
                .andExpect(status().isCreated());
        return UUID.fromString(leer(r, "$.data.id"));
    }

    /** Un código con ese rol, sacado por quien administra (o por el equipo, si es una escuela y «quien» es admin). */
    protected String codigo(Persona quien, UUID institucion, String rol, boolean comoAdmin) throws Exception {
        String ruta = comoAdmin ? "/api/v1/admin/escuelas/" + institucion + "/invitaciones" : "/api/v1/instituciones/" + institucion + "/invitaciones";
        var r = como(quien, HttpMethod.POST, ruta, Map.of("rol", rol)).andExpect(status().isCreated());
        return leer(r, "$.data.codigo");
    }

    protected ResultActions aceptar(Persona quien, String codigo) throws Exception {
        return como(quien, HttpMethod.POST, "/api/v1/invitaciones/aceptar", Map.of("codigo", codigo));
    }

    /** Una escuela que el equipo le pasó a esa dirección. */
    protected UUID escuelaDe(Persona direccion) throws Exception {
        Persona equipo = admin();
        UUID id = escuela(equipo);
        aceptar(direccion, codigo(equipo, id, "DIRECCION", true)).andExpect(status().isOk());
        return id;
    }

    /** Suma a alguien a la institución con ese rol, con un código de quien administra. */
    protected void unir(Persona quienAdministra, UUID institucion, Persona nueva, String rol) throws Exception {
        aceptar(nueva, codigo(quienAdministra, institucion, rol, false)).andExpect(status().isOk());
    }

    protected UUID hogarDe(Persona encargado) throws Exception {
        var r = como(encargado, HttpMethod.POST, "/api/v1/hogares", Map.of("nombre", "Casa de los Mora")).andExpect(status().isCreated());
        return UUID.fromString(leer(r, "$.data.id"));
    }
}
