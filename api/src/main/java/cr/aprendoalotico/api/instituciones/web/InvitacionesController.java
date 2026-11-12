package cr.aprendoalotico.api.instituciones.web;

import cr.aprendoalotico.api.comun.web.IpDelCliente;
import cr.aprendoalotico.api.comun.web.Pagina;
import cr.aprendoalotico.api.comun.web.Respuesta;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import cr.aprendoalotico.api.instituciones.InvitacionPendiente;
import cr.aprendoalotico.api.instituciones.ServicioInvitaciones;
import cr.aprendoalotico.api.instituciones.api.Rol;
import cr.aprendoalotico.api.instituciones.web.Formularios.Aceptar;
import cr.aprendoalotico.api.instituciones.web.Formularios.NuevaInvitacion;
import cr.aprendoalotico.api.instituciones.web.Respuestas.CodigoVista;
import cr.aprendoalotico.api.instituciones.web.Respuestas.InstitucionVista;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Los códigos para unirse (B22): sacarlos, verlos, revocarlos y usarlos. */
@RestController
class InvitacionesController {

    private final ServicioInvitaciones invitaciones;
    private final IpDelCliente ip;

    InvitacionesController(ServicioInvitaciones invitaciones, IpDelCliente ip) {
        this.invitaciones = invitaciones;
        this.ip = ip;
    }

    @PostMapping("/api/v1/instituciones/{id}/invitaciones")
    ResponseEntity<Respuesta<CodigoVista>> crear(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id,
            @Valid @RequestBody NuevaInvitacion n) {
        return ResponseEntity.status(HttpStatus.CREATED).body(Respuesta.ok(CodigoVista.de(invitaciones.crear(yo, id, Rol.valueOf(n.rol())))));
    }

    @GetMapping("/api/v1/instituciones/{id}/invitaciones")
    Respuesta<List<InvitacionPendiente>> pendientes(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id,
            @RequestParam(defaultValue = "1") @Min(1) @Max(Pagina.PAGINA_MAXIMA) int pagina,
            @RequestParam(defaultValue = Pagina.TAMANO_COMUN) @Min(1) @Max(Pagina.TAMANO_MAXIMO) int tamano) {
        var p = new Pagina(pagina, tamano);
        return p.respuesta(invitaciones.pendientes(yo, id, p));
    }

    @DeleteMapping("/api/v1/instituciones/{id}/invitaciones/{invitacion}")
    Respuesta<Void> revocar(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id, @PathVariable UUID invitacion) {
        invitaciones.revocar(yo, id, invitacion);
        return Respuesta.ok(null);
    }

    @PostMapping("/api/v1/invitaciones/aceptar")
    Respuesta<InstitucionVista> aceptar(@AuthenticationPrincipal UsuarioActual yo, @Valid @RequestBody Aceptar a, HttpServletRequest pedido) {
        return Respuesta.ok(InstitucionVista.de(invitaciones.aceptar(yo, a.codigo(), ip.paraLimites(pedido))));
    }
}
