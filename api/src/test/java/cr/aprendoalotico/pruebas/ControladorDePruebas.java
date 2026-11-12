package cr.aprendoalotico.pruebas;

import cr.aprendoalotico.api.comun.web.ErrorDeNegocio;
import cr.aprendoalotico.api.comun.web.Respuesta;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Solo para pruebas (fuera del paquete que escanea la aplicación: se trae con @Import). Dispara cada tipo de error
 * para comprobar que, pasando por todo el cableado real, sale el sobre con el estado y el código correctos.
 */
@RestController
@RequestMapping("/api/v1/pruebas")
public class ControladorDePruebas {

    public record Registro(@NotBlank String nombre, @Email String correo) {
    }

    @GetMapping("/prohibido")
    void prohibido() {
        throw new AccessDeniedException("no es tu grupo");
    }

    @GetMapping("/numero")
    int numero(@RequestParam @Min(1) int n) {
        return n;
    }

    @PostMapping(path = "/json", consumes = MediaType.APPLICATION_JSON_VALUE)
    String json(@RequestBody Map<String, Object> cuerpo) {
        return "ok";
    }

    @GetMapping("/estado-http")
    void estadoHttp() {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/cabecera")
    String cabecera(@RequestHeader("X-Algo") String algo) {
        return algo;
    }

    @PostMapping("/registro")
    Respuesta<Registro> registro(@Valid @RequestBody Registro registro) {
        return Respuesta.ok(registro);
    }

    @GetMapping("/duplicado")
    void duplicado() {
        throw new DataIntegrityViolationException(
                "duplicate key value violates unique constraint \"usuarios_correo_key\" Detail: Key (correo)=(maria@example.com) already exists.",
                new IllegalStateException("Key (correo)=(maria@example.com)"));
    }

    @GetMapping("/negocio")
    void negocio() {
        throw new ErrorDeNegocio(HttpStatus.CONFLICT, "GRUPO_REPETIDO", "Ya hay un grupo 2-3 este año.");
    }
}
