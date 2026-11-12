package cr.aprendoalotico.api.estado.web;

import cr.aprendoalotico.api.comun.web.ErrorApi;
import cr.aprendoalotico.api.comun.web.IdDePedido;
import cr.aprendoalotico.api.comun.web.Respuesta;
import cr.aprendoalotico.api.estado.Estado;
import cr.aprendoalotico.api.estado.ServicioEstado;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** GET /api/v1/estado: público. Con la base caída responde 503, para que el monitoreo lo note. */
@RestController
@RequestMapping("/api/v1/estado")
class EstadoController {

    private final ServicioEstado servicio;

    EstadoController(ServicioEstado servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    ResponseEntity<Respuesta<Estado>> estado() {
        Estado estado = servicio.estado();
        if (estado.baseResponde()) {
            return ResponseEntity.ok(Respuesta.ok(estado));
        }
        var error = new ErrorApi("BASE_SIN_CONEXION", "La base de datos no responde.", null, IdDePedido.actual());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new Respuesta<>(false, estado, error, null));
    }
}
