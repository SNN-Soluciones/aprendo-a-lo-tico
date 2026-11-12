package cr.aprendoalotico.api.identidad.web;

import cr.aprendoalotico.api.comun.web.Respuesta;
import cr.aprendoalotico.api.identidad.CookieDeSesion;
import cr.aprendoalotico.api.identidad.ServicioClaves;
import cr.aprendoalotico.api.identidad.ServicioSesiones;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import cr.aprendoalotico.api.identidad.web.Formularios.CambioDeClave;
import cr.aprendoalotico.api.identidad.web.Respuestas.Aviso;
import cr.aprendoalotico.api.identidad.web.Respuestas.Yo;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** La persona con sesión: quién es y cambiar su clave. Todo esto pide sesión. */
@RestController
@RequestMapping("/api/v1/yo")
class YoController {

    private final ServicioClaves claves;

    YoController(ServicioClaves claves) {
        this.claves = claves;
    }

    @GetMapping
    Respuesta<Yo> yo(@AuthenticationPrincipal UsuarioActual yo) {
        return Respuesta.ok(Yo.de(yo));
    }

    /** Cambia la clave: esta sesión sigue con un token nuevo (la cookie se reemplaza) y las demás se cierran. */
    @PutMapping("/clave")
    ResponseEntity<Respuesta<Aviso>> cambiarClave(@AuthenticationPrincipal UsuarioActual yo, @Valid @RequestBody CambioDeClave c) {
        String token = claves.cambiar(yo, c.actual(), c.nueva());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, CookieDeSesion.con(token, ServicioSesiones.DURACION).toString())
                .body(Respuesta.ok(new Aviso("Listo: tu clave cambió y cerramos tus sesiones en otros aparatos.")));
    }
}
