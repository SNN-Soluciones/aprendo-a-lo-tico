package cr.aprendoalotico.api.instituciones.web;

import cr.aprendoalotico.api.comun.web.Pagina;
import cr.aprendoalotico.api.comun.web.Respuesta;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import cr.aprendoalotico.api.instituciones.ServicioInstituciones;
import cr.aprendoalotico.api.instituciones.ServicioInvitaciones;
import cr.aprendoalotico.api.instituciones.api.Rol;
import cr.aprendoalotico.api.instituciones.web.Formularios.Escuela;
import cr.aprendoalotico.api.instituciones.web.Formularios.NuevaInvitacion;
import cr.aprendoalotico.api.instituciones.web.Respuestas.CodigoVista;
import cr.aprendoalotico.api.instituciones.web.Respuestas.InstitucionVista;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Lo que hace el equipo con las escuelas (B21): crearlas, corregirlas y sacar el código para su dirección. */
@RestController
@RequestMapping("/api/v1/admin/escuelas")
class AdminEscuelasController {

    private final ServicioInstituciones instituciones;
    private final ServicioInvitaciones invitaciones;

    AdminEscuelasController(ServicioInstituciones instituciones, ServicioInvitaciones invitaciones) {
        this.instituciones = instituciones;
        this.invitaciones = invitaciones;
    }

    @PostMapping
    ResponseEntity<Respuesta<InstitucionVista>> crear(@AuthenticationPrincipal UsuarioActual yo, @Valid @RequestBody Escuela e) {
        return ResponseEntity.status(HttpStatus.CREATED).body(Respuesta.ok(InstitucionVista.de(instituciones.crearEscuela(yo, e.datos()))));
    }

    @GetMapping
    Respuesta<List<InstitucionVista>> escuelas(@AuthenticationPrincipal UsuarioActual yo,
            @RequestParam(defaultValue = "1") @Min(1) @Max(Pagina.PAGINA_MAXIMA) int pagina,
            @RequestParam(defaultValue = Pagina.TAMANO_COMUN) @Min(1) @Max(Pagina.TAMANO_MAXIMO) int tamano) {
        var p = new Pagina(pagina, tamano);
        var leida = instituciones.escuelas(yo, p);
        return p.respuesta(new Pagina.Leida<>(leida.elementos().stream().map(InstitucionVista::de).toList(), leida.total()));
    }

    @PutMapping("/{id}")
    Respuesta<InstitucionVista> cambiar(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id, @Valid @RequestBody Escuela e) {
        return Respuesta.ok(InstitucionVista.de(instituciones.cambiarEscuela(yo, id, e.datos())));
    }

    @PostMapping("/{id}/invitaciones")
    ResponseEntity<Respuesta<CodigoVista>> invitar(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id,
            @Valid @RequestBody NuevaInvitacion n) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Respuesta.ok(CodigoVista.de(invitaciones.crearComoAdmin(yo, id, Rol.valueOf(n.rol())))));
    }
}
