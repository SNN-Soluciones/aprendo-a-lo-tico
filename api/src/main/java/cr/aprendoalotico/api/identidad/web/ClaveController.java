package cr.aprendoalotico.api.identidad.web;

import cr.aprendoalotico.api.comun.web.IpDelCliente;
import cr.aprendoalotico.api.comun.web.Respuesta;
import cr.aprendoalotico.api.identidad.ServicioClaves;
import cr.aprendoalotico.api.identidad.web.Formularios.ClaveNueva;
import cr.aprendoalotico.api.identidad.web.Formularios.Correo;
import cr.aprendoalotico.api.identidad.web.Respuestas.Aviso;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Olvidé mi clave: pedir el enlace y poner la nueva. */
@RestController
@RequestMapping("/api/v1/clave")
class ClaveController {

    private final ServicioClaves claves;
    private final IpDelCliente ip;

    ClaveController(ServicioClaves claves, IpDelCliente ip) {
        this.claves = claves;
        this.ip = ip;
    }

    /** Siempre 202 con el mismo aviso, tenga o no cuenta ese correo. */
    @PostMapping("/recuperar")
    ResponseEntity<Respuesta<Aviso>> recuperar(@Valid @RequestBody Correo c, HttpServletRequest pedido) {
        claves.pedirRecuperacion(c.correo(), ip.paraLimites(pedido));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(Respuesta.ok(new Aviso(
                "Si ese correo tiene cuenta, te llegará un enlace para poner una clave nueva. Vale por 30 minutos.")));
    }

    @PostMapping("/nueva")
    Respuesta<Aviso> nueva(@Valid @RequestBody ClaveNueva c, HttpServletRequest pedido) {
        claves.ponerClaveNueva(c.token(), c.clave(), ip.paraLimites(pedido));
        return Respuesta.ok(new Aviso("Listo: ya podés entrar con tu clave nueva. Cerramos las sesiones que estaban abiertas."));
    }
}
