package cr.aprendoalotico.api.grupos.web;

import cr.aprendoalotico.api.comun.web.Pagina;
import cr.aprendoalotico.api.comun.web.Respuesta;
import cr.aprendoalotico.api.grupos.Grupo;
import cr.aprendoalotico.api.grupos.Papel;
import cr.aprendoalotico.api.grupos.ServicioGrupos;
import cr.aprendoalotico.api.grupos.web.Formularios.CambioDeGrupo;
import cr.aprendoalotico.api.grupos.web.Formularios.DocenteDelGrupo;
import cr.aprendoalotico.api.grupos.web.Formularios.NuevoGrupo;
import cr.aprendoalotico.api.grupos.web.Respuestas.GrupoVista;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
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

/** Los grupos de una institución y los míos, con su código de clase y sus docentes (B23, B24). */
@RestController
class GruposController {

    private final ServicioGrupos grupos;

    GruposController(ServicioGrupos grupos) {
        this.grupos = grupos;
    }

    @PostMapping("/api/v1/instituciones/{institucion}/grupos")
    ResponseEntity<Respuesta<GrupoVista>> crear(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID institucion,
            @Valid @RequestBody NuevoGrupo n) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Respuesta.ok(GrupoVista.de(grupos.crear(yo, institucion, n.anio(), n.grado(), n.seccion()))));
    }

    @GetMapping("/api/v1/instituciones/{institucion}/grupos")
    Respuesta<List<Grupo>> deInstitucion(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID institucion,
            @RequestParam(required = false) @Min(2020) @Max(2100) Integer anio, @RequestParam(defaultValue = "1") @Min(1) @Max(Pagina.PAGINA_MAXIMA) int pagina,
            @RequestParam(defaultValue = Pagina.TAMANO_COMUN) @Min(1) @Max(Pagina.TAMANO_MAXIMO) int tamano) {
        var p = new Pagina(pagina, tamano);
        return p.respuesta(grupos.deInstitucion(yo, institucion, anio, p));
    }

    @GetMapping("/api/v1/grupos")
    Respuesta<List<Grupo>> mios(@AuthenticationPrincipal UsuarioActual yo, @RequestParam(defaultValue = "1") @Min(1) @Max(Pagina.PAGINA_MAXIMA) int pagina,
            @RequestParam(defaultValue = Pagina.TAMANO_COMUN) @Min(1) @Max(Pagina.TAMANO_MAXIMO) int tamano) {
        var p = new Pagina(pagina, tamano);
        return p.respuesta(grupos.mios(yo, p));
    }

    @GetMapping("/api/v1/grupos/{id}")
    Respuesta<GrupoVista> ver(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id) {
        return Respuesta.ok(GrupoVista.de(grupos.ver(yo, id)));
    }

    @PutMapping("/api/v1/grupos/{id}")
    Respuesta<GrupoVista> cambiar(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id, @Valid @RequestBody CambioDeGrupo c) {
        return Respuesta.ok(GrupoVista.de(grupos.cambiar(yo, id, c.grado(), c.seccion())));
    }

    @PostMapping("/api/v1/grupos/{id}/codigo")
    Respuesta<GrupoVista> nuevoCodigo(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id) {
        return Respuesta.ok(GrupoVista.de(grupos.nuevoCodigo(yo, id)));
    }

    @PutMapping("/api/v1/grupos/{id}/docentes/{usuario}")
    Respuesta<GrupoVista> ponerDocente(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id, @PathVariable UUID usuario,
            @Valid @RequestBody DocenteDelGrupo d) {
        return Respuesta.ok(GrupoVista.de(grupos.ponerDocente(yo, id, usuario, Papel.valueOf(d.papel()), d.materia())));
    }

    @DeleteMapping("/api/v1/grupos/{id}/docentes/{usuario}")
    Respuesta<Void> quitarDocente(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID id, @PathVariable UUID usuario) {
        grupos.quitarDocente(yo, id, usuario);
        return Respuesta.ok(null);
    }
}
