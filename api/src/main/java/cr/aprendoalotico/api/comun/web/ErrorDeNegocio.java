package cr.aprendoalotico.api.comun.web;

import org.springframework.http.HttpStatus;

/**
 * Un error esperado («ya hay un grupo 2-3 este año», «no es tu grupo»): sale tal cual al cliente con su código.
 * Los servicios lo lanzan; el ManejadorErrores lo convierte en respuesta. El mensaje lo lee la persona: nunca
 * debe revelar si existe algo que no le corresponde ver (por ejemplo, si un correo tiene cuenta).
 */
public class ErrorDeNegocio extends RuntimeException {

    private final HttpStatus estado;
    private final String codigo;

    public ErrorDeNegocio(HttpStatus estado, String codigo, String mensaje) {
        // Sin traza: es un caso esperado, y armarla en cada pedido cuesta
        super(mensaje, null, false, false);
        this.estado = estado;
        this.codigo = codigo;
    }

    /** 404: no existe o no le toca verlo (B23: lo de otra institución no dice que existe). */
    public static ErrorDeNegocio noEncontrado(String mensaje) {
        return new ErrorDeNegocio(HttpStatus.NOT_FOUND, "NO_ENCONTRADO", mensaje);
    }

    /** 403: lo ve, pero eso no lo puede hacer. */
    public static ErrorDeNegocio sinPermiso() {
        return new ErrorDeNegocio(HttpStatus.FORBIDDEN, "SIN_PERMISO", "No tenés permiso para hacer eso.");
    }

    public HttpStatus estado() {
        return estado;
    }

    public String codigo() {
        return codigo;
    }
}
