package cr.aprendoalotico.api.identidad.web;

import cr.aprendoalotico.api.comun.web.IpDelCliente;
import cr.aprendoalotico.api.comun.web.Respuesta;
import cr.aprendoalotico.api.identidad.CookieDeSesion;
import cr.aprendoalotico.api.identidad.ServicioSesiones;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import cr.aprendoalotico.api.identidad.web.Formularios.Entrada;
import cr.aprendoalotico.api.identidad.web.Respuestas.Yo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** Entrar y salir. La sesión viaja solo en la cookie: el token nunca va en el cuerpo de la respuesta. */
@RestController
class SesionController {

    private final ServicioSesiones sesiones;
    private final IpDelCliente ip;

    SesionController(ServicioSesiones sesiones, IpDelCliente ip) {
        this.sesiones = sesiones;
        this.ip = ip;
    }

    @PostMapping("/api/v1/sesion")
    ResponseEntity<Respuesta<Yo>> entrar(@Valid @RequestBody Entrada e, HttpServletRequest pedido) {
        var entrada = sesiones.entrar(e.correo(), e.clave(), ip.paraLimites(pedido), pedido.getHeader(HttpHeaders.USER_AGENT));
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, CookieDeSesion.con(entrada.token(), ServicioSesiones.DURACION).toString())
                .body(Respuesta.ok(Yo.de(entrada.usuario())));
    }

    /** Sale de esta sesión. Sin sesión también responde bien: la cookie se borra igual. */
    @DeleteMapping("/api/v1/sesion")
    ResponseEntity<Respuesta<Void>> salir(@AuthenticationPrincipal UsuarioActual yo) {
        if (yo != null) {
            sesiones.salir(yo);
        }
        return sinCookie();
    }

    @DeleteMapping("/api/v1/sesiones")
    ResponseEntity<Respuesta<Void>> salirDeTodosLados(@AuthenticationPrincipal UsuarioActual yo) {
        sesiones.salirDeTodosLados(yo);
        return sinCookie();
    }

    private static ResponseEntity<Respuesta<Void>> sinCookie() {
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, CookieDeSesion.borrada().toString()).body(Respuesta.ok(null));
    }
}
