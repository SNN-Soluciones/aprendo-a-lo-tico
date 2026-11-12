package cr.aprendoalotico.api.grupos.web;

import cr.aprendoalotico.api.comun.web.Respuesta;
import cr.aprendoalotico.api.grupos.AnioLectivo;
import cr.aprendoalotico.api.grupos.ServicioAnios;
import cr.aprendoalotico.api.grupos.web.Formularios.Fechas;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Los años lectivos de una institución (B24). Uno por año: la lista no se pagina. */
@RestController
@RequestMapping("/api/v1/instituciones/{institucion}/anios")
class AniosController {

    private final ServicioAnios anios;

    AniosController(ServicioAnios anios) {
        this.anios = anios;
    }

    @GetMapping
    Respuesta<List<AnioLectivo>> de(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID institucion) {
        return Respuesta.ok(anios.de(yo, institucion));
    }

    @PutMapping("/{anio}")
    Respuesta<AnioLectivo> poner(@AuthenticationPrincipal UsuarioActual yo, @PathVariable UUID institucion,
            @PathVariable @Min(2020) @Max(2100) int anio, @Valid @RequestBody Fechas f) {
        return Respuesta.ok(anios.poner(yo, institucion, anio, f.desde(), f.hasta()));
    }
}
