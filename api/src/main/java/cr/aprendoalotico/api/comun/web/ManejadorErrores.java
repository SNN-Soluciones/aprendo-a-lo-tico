package cr.aprendoalotico.api.comun.web;

import jakarta.validation.ConstraintViolationException;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/**
 * Convierte cualquier error en el sobre de siempre, con un código estable y el id del pedido.
 * Al cliente nunca le llegan trazas, SQL ni mensajes internos; al log, tampoco los mensajes (pueden traer datos personales).
 */
@RestControllerAdvice
public class ManejadorErrores {

    private static final Logger LOG = LoggerFactory.getLogger(ManejadorErrores.class);
    private static final String SIN_MENSAJE = "no es válido";

    /** Los «no autenticado» y «no tenés permiso» los responde Spring Security (401/403 con su sobre), no esto. */
    @ExceptionHandler({ AccessDeniedException.class, AuthenticationException.class })
    void seguridad(RuntimeException e) {
        throw e;
    }

    @ExceptionHandler(ErrorDeNegocio.class)
    ResponseEntity<Respuesta<Void>> negocio(ErrorDeNegocio e) {
        return responder(e.estado(), HttpHeaders.EMPTY, e.codigo(), e.getMessage(), null);
    }

    /** Un límite de intentos: 429 con Retry-After (los segundos que faltan). */
    @ExceptionHandler(DemasiadosIntentos.class)
    ResponseEntity<Respuesta<Void>> demasiadosIntentos(DemasiadosIntentos e) {
        var cabeceras = new HttpHeaders();
        cabeceras.set(HttpHeaders.RETRY_AFTER, Long.toString(e.segundos()));
        return responder(e.estado(), cabeceras, e.codigo(), e.getMessage(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Respuesta<Void>> validacion(MethodArgumentNotValidException e) {
        Map<String, String> campos = new LinkedHashMap<>();
        for (FieldError f : e.getBindingResult().getFieldErrors()) {
            campos.putIfAbsent(f.getField(), f.getDefaultMessage() == null ? SIN_MENSAJE : f.getDefaultMessage());
        }
        return invalido(campos);
    }

    /** Reglas en parámetros sueltos del controlador (@RequestParam @Min(1) int pagina). */
    @ExceptionHandler(HandlerMethodValidationException.class)
    ResponseEntity<Respuesta<Void>> validacionDeParametros(HandlerMethodValidationException e) {
        Map<String, String> campos = new LinkedHashMap<>();
        e.getParameterValidationResults().forEach(r -> {
            String nombre = r.getMethodParameter().getParameterName();
            r.getResolvableErrors().forEach(err -> campos.putIfAbsent(nombre == null ? "parametro" : nombre,
                    err.getDefaultMessage() == null ? SIN_MENSAJE : err.getDefaultMessage()));
        });
        return invalido(campos);
    }

    /** Reglas validadas en un servicio (@Validated). */
    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<Respuesta<Void>> restricciones(ConstraintViolationException e) {
        Map<String, String> campos = new LinkedHashMap<>();
        e.getConstraintViolations().forEach(v -> {
            String ruta = v.getPropertyPath().toString();
            campos.putIfAbsent(ruta.substring(ruta.lastIndexOf('.') + 1), v.getMessage());
        });
        return invalido(campos);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<Respuesta<Void>> cuerpoIlegible(HttpMessageNotReadableException e) {
        for (Throwable c = e; c != null; c = c.getCause() == c ? null : c.getCause()) {
            if (c instanceof CuerpoDemasiadoGrande) {
                return responder(HttpStatus.CONTENT_TOO_LARGE, HttpHeaders.EMPTY, "DEMASIADO_GRANDE",
                        CodigosHttp.mensaje(HttpStatus.CONTENT_TOO_LARGE), null);
            }
        }
        return responder(HttpStatus.BAD_REQUEST, HttpHeaders.EMPTY, "CUERPO_INVALIDO", "Lo que se mandó no tiene el formato esperado.", null);
    }

    @ExceptionHandler({ MissingServletRequestParameterException.class, MethodArgumentTypeMismatchException.class,
        MissingRequestHeaderException.class })
    ResponseEntity<Respuesta<Void>> parametro(Exception e) {
        return responder(HttpStatus.BAD_REQUEST, HttpHeaders.EMPTY, "PARAMETRO_INVALIDO",
                "Falta un dato en la dirección o no tiene el formato esperado.", null);
    }

    /**
     * Todo lo demás. Los errores web de Spring (404, 405, 415, ResponseStatusException…) traen su estado y sus
     * cabeceras (Allow, Accept): se respetan. El resto es un 500 genérico, que sí se loguea.
     */
    @ExceptionHandler(Exception.class)
    ResponseEntity<Respuesta<Void>> general(Exception e) {
        HttpStatusCode estado = e instanceof ErrorResponse er ? er.getStatusCode() : HttpStatus.INTERNAL_SERVER_ERROR;
        HttpHeaders cabeceras = e instanceof ErrorResponse er ? er.getHeaders() : HttpHeaders.EMPTY;
        if (estado.is5xxServerError()) {
            LOG.error("Error inesperado {}{} en el pedido {}", e.getClass().getName(), sqlState(e), IdDePedido.actual(), sinMensajes(e));
        }
        return responder(estado, cabeceras, CodigosHttp.codigo(estado), CodigosHttp.mensaje(estado), null);
    }

    /**
     * La misma traza, pero cada excepción solo con el nombre de su clase: los mensajes pueden traer correos, nombres
     * o claves (por ejemplo, el detalle de una violación de unicidad de PostgreSQL). DISENO.md, B13.
     */
    public static Throwable sinMensajes(Throwable t) {
        return sinMensajes(t, 0);
    }

    private static Throwable sinMensajes(Throwable t, int profundidad) {
        Throwable causa = t.getCause() == null || t.getCause() == t || profundidad >= 10 ? null : sinMensajes(t.getCause(), profundidad + 1);
        var rastro = new Rastro(t.getClass().getName(), causa);
        rastro.setStackTrace(t.getStackTrace());
        return rastro;
    }

    /** Una excepción solo para el log: lleva el nombre de la original como mensaje. */
    private static final class Rastro extends RuntimeException {
        Rastro(String clase, Throwable causa) {
            super(clase, causa, false, true);
        }
    }

    /** El código SQLSTATE de un error de base (dice qué pasó sin datos): « (SQLSTATE 23505)». */
    private static String sqlState(Exception e) {
        if (e instanceof DataAccessException dae && dae.getMostSpecificCause() instanceof SQLException sql && sql.getSQLState() != null) {
            return " (SQLSTATE " + sql.getSQLState() + ")";
        }
        return "";
    }

    private static ResponseEntity<Respuesta<Void>> invalido(Map<String, String> campos) {
        return responder(HttpStatus.BAD_REQUEST, HttpHeaders.EMPTY, "VALIDACION", "Revisá los datos marcados.", campos);
    }

    private static ResponseEntity<Respuesta<Void>> responder(HttpStatusCode estado, HttpHeaders cabeceras, String codigo, String mensaje,
            Map<String, String> campos) {
        return ResponseEntity.status(estado).headers(cabeceras)
                .body(Respuesta.falla(new ErrorApi(codigo, mensaje, campos, IdDePedido.actual())));
    }
}
