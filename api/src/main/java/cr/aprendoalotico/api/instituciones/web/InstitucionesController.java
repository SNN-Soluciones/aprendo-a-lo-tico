package cr.aprendoalotico.api.instituciones.web;

import cr.aprendoalotico.api.comun.web.Pagina;
import cr.aprendoalotico.api.comun.web.Respuesta;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import cr.aprendoalotico.api.instituciones.Miembro;
import cr.aprendoalotico.api.instituciones.ServicioInstituciones;
import cr.aprendoalotico.api.instituciones.web.Formularios.Datos;
import cr.aprendoalotico.api.instituciones.web.Formularios.Hogar;
import cr.aprendoalotico.api.instituciones.web.Respuestas.InstitucionVista;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Mis instituciones, sus datos y sus miembros (B23); y crear un hogar. */
@RestController
class InstitucionesController {

    private final ServicioInstituciones instituciones;

    InstitucionesController(ServicioInstituciones instituciones) {
        this.instituciones = instituciones;
    }

    @PostMapping("/api/v1/hogares")
    ResponseEntity<Respuesta<InstitucionVista>> crearHogar(@AuthenticationPrincipal UsuarioActual yo, @Valid @RequestBody Hogar h) {
        return ResponseEntity.status(HttpStatus.CREATED).body(Respuesta.ok(InstitucionVista.de(instituciones.crearHogar(yo, h.nombre()))));
    }

    @GetMapping("/api/v1/instituciones")
    Respuesta<List<InstitucionVista>> mias(@AuthenticationPrincipal UsuarioActual yo, @RequestParam(defaultValue = "1") @Min(1) @Max(Pagina.PAGINA_MAXIMA) int pagina,
            @RequestParam(defaultValue = Pagina.TAMANO_COMUN) @Min(1) @Max(Pagina.TAMANO_MAXIMO) int tamano) {
        var p = new Pagina(pagina, tamano);
        var leida = instituciones.mias(yo, p);
        return p.respuesta(new Pagina.Leida<>(leida.elementos().stream().map(InstitucionVista::de).toList(), leida.total()));
    }

    @GetMapping("/api/v1/instituciones/{id}")
    Respuesta<InstitucionVista> ver(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id) {
        return Respuesta.ok(InstitucionVista.de(instituciones.ver(yo, id)));
    }

    @PutMapping("/api/v1/instituciones/{id}")
    Respuesta<InstitucionVista> cambiar(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id, @Valid @RequestBody Datos d) {
        return Respuesta.ok(InstitucionVista.de(instituciones.cambiar(yo, id, d.datos())));
    }

    @GetMapping("/api/v1/instituciones/{id}/miembros")
    Respuesta<List<Miembro>> miembros(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id,
            @RequestParam(defaultValue = "1") @Min(1) @Max(Pagina.PAGINA_MAXIMA) int pagina,
            @RequestParam(defaultValue = Pagina.TAMANO_COMUN) @Min(1) @Max(Pagina.TAMANO_MAXIMO) int tamano) {
        var p = new Pagina(pagina, tamano);
        return p.respuesta(instituciones.miembros(yo, id, p));
    }

    @DeleteMapping("/api/v1/instituciones/{id}/miembros/{usuario}")
    Respuesta<Void> retirar(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id, @PathVariable UUID usuario) {
        instituciones.retirar(yo, id, usuario);
        return Respuesta.ok(null);
    }
}
