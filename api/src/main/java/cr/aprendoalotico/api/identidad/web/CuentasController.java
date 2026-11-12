package cr.aprendoalotico.api.identidad.web;

import cr.aprendoalotico.api.comun.web.IpDelCliente;
import cr.aprendoalotico.api.comun.web.Respuesta;
import cr.aprendoalotico.api.identidad.ServicioCuentas;
import cr.aprendoalotico.api.identidad.web.Formularios.Confirmacion;
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

/** Pedir una cuenta (solo el correo) y crearla con el enlace que llega (nombre y clave): DISENO.md, B18. */
@RestController
@RequestMapping("/api/v1/cuentas")
class CuentasController {

    private final ServicioCuentas cuentas;
    private final IpDelCliente ip;

    CuentasController(ServicioCuentas cuentas, IpDelCliente ip) {
        this.cuentas = cuentas;
        this.ip = ip;
    }

    /** Siempre 202 con el mismo aviso, tenga o no cuenta ese correo. */
    @PostMapping
    ResponseEntity<Respuesta<Aviso>> pedir(@Valid @RequestBody Correo c, HttpServletRequest pedido) {
        cuentas.pedir(c.correo(), ip.paraLimites(pedido));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(Respuesta.ok(new Aviso(
                "Revisá tu correo: te mandamos un enlace para crear la cuenta. Si no llega en unos minutos, mirá en «no deseado».")));
    }

    @PostMapping("/confirmar")
    ResponseEntity<Respuesta<Aviso>> confirmar(@Valid @RequestBody Confirmacion c, HttpServletRequest pedido) {
        cuentas.confirmar(c.token(), c.nombre(), c.clave(), ip.paraLimites(pedido));
        return ResponseEntity.status(HttpStatus.CREATED).body(Respuesta.ok(new Aviso("¡Listo! Tu cuenta quedó creada: ya podés entrar.")));
    }
}
