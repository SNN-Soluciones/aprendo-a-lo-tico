package cr.aprendoalotico.api.comun.web;

import cr.aprendoalotico.api.comun.seguridad.CabecerasDeSeguridad;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.webmvc.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * La página de error del servidor (/error), que se usa cuando algo falla antes de llegar a un controlador: el firewall
 * de Spring Security rechaza una ruta rara, un método inventado, etc. Sale con el mismo sobre que todo lo demás,
 * con el id del pedido y las cabeceras de seguridad. Nunca repite la ruta pedida.
 */
@RestController
class ControladorDeErrores implements ErrorController {

    @RequestMapping("${server.error.path:/error}")
    ResponseEntity<Respuesta<Void>> error(HttpServletRequest pedido, HttpServletResponse respuesta) {
        HttpStatus estado = pedido.getAttribute(RequestDispatcher.ERROR_STATUS_CODE) instanceof Integer codigo
                && HttpStatus.resolve(codigo) != null ? HttpStatus.resolve(codigo) : HttpStatus.INTERNAL_SERVER_ERROR;
        String id = pedido.getAttribute(IdDePedido.ATRIBUTO) instanceof String s ? s : IdDePedido.actual();
        CabecerasDeSeguridad.ponerSiFaltan(respuesta);
        return ResponseEntity.status(estado)
                .body(Respuesta.falla(new ErrorApi(CodigosHttp.codigo(estado), CodigosHttp.mensaje(estado), null, id)));
    }
}
