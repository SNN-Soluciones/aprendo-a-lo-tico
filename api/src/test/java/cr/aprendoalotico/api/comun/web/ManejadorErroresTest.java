package cr.aprendoalotico.api.comun.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.lang.reflect.Method;
import java.util.Map;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.mock.http.MockHttpInputMessage;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

class ManejadorErroresTest {

    private final ManejadorErrores manejador = new ManejadorErrores();

    @BeforeEach
    void conIdDePedido() {
        MDC.put(IdDePedido.CLAVE_MDC, "pedido-1");
    }

    @AfterEach
    void limpiar() {
        MDC.clear();
    }

    @Test
    @DisplayName("Un error de negocio sale con su estado, su código y el id del pedido")
    void errorDeNegocio() {
        var r = manejador.negocio(new ErrorDeNegocio(HttpStatus.CONFLICT, "GRUPO_REPETIDO", "Ya hay un grupo 2-3 este año."));
        assertThat(r.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(r.getBody().success()).isFalse();
        assertThat(r.getBody().data()).isNull();
        assertThat(r.getBody().error()).isEqualTo(new ErrorApi("GRUPO_REPETIDO", "Ya hay un grupo 2-3 este año.", null, "pedido-1"));
    }

    @Test
    @DisplayName("Un error de negocio no arma traza: es esperado y sale caro en cada pedido")
    void errorDeNegocioSinTraza() {
        assertThat(new ErrorDeNegocio(HttpStatus.CONFLICT, "X", "x").getStackTrace()).isEmpty();
    }

    @Test
    @DisplayName("Validación: cada campo con su mensaje, en orden; un error sin mensaje recibe uno genérico")
    void validacion() throws Exception {
        // Arrange
        var resultado = new BeanPropertyBindingResult(new Object(), "registro");
        resultado.reject("global");
        resultado.addError(new FieldError("registro", "correo", "no es un correo válido"));
        resultado.addError(new FieldError("registro", "clave", "muy corta"));
        resultado.addError(new FieldError("registro", "clave", "otro problema de la clave"));
        resultado.addError(new FieldError("registro", "grado", null, false, new String[] { "X" }, null, null));
        Method metodo = getClass().getDeclaredMethod("validacion");
        var ex = new MethodArgumentNotValidException(new MethodParameter(metodo, -1), resultado);
        // Act
        var r = manejador.validacion(ex);
        // Assert
        assertThat(r.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(r.getBody().error().codigo()).isEqualTo("VALIDACION");
        assertThat(r.getBody().error().campos()).containsExactly(
                Map.entry("correo", "no es un correo válido"), Map.entry("clave", "muy corta"), Map.entry("grado", "no es válido"));
    }

    @Test
    @DisplayName("Un cuerpo que no es JSON válido no cuenta detalles del parser")
    void cuerpoIlegible() {
        var ex = new HttpMessageNotReadableException("Unexpected token at line 3 (secreto interno)", new MockHttpInputMessage(new byte[0]));
        var r = manejador.cuerpoIlegible(ex);
        assertThat(r.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(r.getBody().error().codigo()).isEqualTo("CUERPO_INVALIDO");
        assertThat(r.getBody().error().mensaje()).doesNotContain("secreto");
    }

    @Test
    @DisplayName("Un parámetro que falta o no tiene formato es 400 PARAMETRO_INVALIDO")
    void parametro() {
        var r = manejador.parametro(new MissingServletRequestParameterException("pagina", "int"));
        assertThat(r.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(r.getBody().error().codigo()).isEqualTo("PARAMETRO_INVALIDO");
    }

    @Test
    @DisplayName("Los errores web de Spring conservan su estado y sus cabeceras (404, 405 con Allow, 409…)")
    void erroresWebDeSpring() {
        var noHay = manejador.general(new NoResourceFoundException(HttpMethod.GET, "/api/v1/nada", "api/v1/nada"));
        assertThat(noHay.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(noHay.getBody().error().codigo()).isEqualTo("NO_ENCONTRADO");

        var metodo = manejador.general(new HttpRequestMethodNotSupportedException("PATCH", java.util.List.of("GET")));
        assertThat(metodo.getStatusCode()).isEqualTo(HttpStatus.METHOD_NOT_ALLOWED);
        assertThat(metodo.getHeaders().getAllow()).contains(HttpMethod.GET);
        assertThat(metodo.getBody().error().codigo()).isEqualTo("METODO_NO_PERMITIDO");

        var conflicto = manejador.general(new ResponseStatusException(HttpStatus.CONFLICT));
        assertThat(conflicto.getBody().error().codigo()).isEqualTo("CONFLICTO");
    }

    @Test
    @DisplayName("Los «no tenés permiso» se devuelven a Spring Security para que responda 401/403")
    void seguridadSeRelanza() {
        var ex = new AccessDeniedException("no");
        assertThatThrownBy(() -> manejador.seguridad(ex)).isSameAs(ex);
    }

    @Test
    @DisplayName("Un error inesperado es 500 genérico: ni el mensaje ni la traza salen al cliente")
    void inesperado() {
        var r = manejador.general(new IllegalStateException("password=hunter2 en la conexión"));
        assertThat(r.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(r.getBody().error().codigo()).isEqualTo("ERROR_INTERNO");
        assertThat(r.getBody().error().mensaje()).doesNotContain("hunter2");
        assertThat(r.getBody().error().pedido()).isEqualTo("pedido-1");
    }

    record Grupo(@jakarta.validation.constraints.NotBlank String seccion) {
    }

    @Test
    @DisplayName("Una regla validada en un servicio (@Validated) es 400 VALIDACION con el campo")
    void restriccionesDeServicio() {
        // Arrange
        try (var fabrica = jakarta.validation.Validation.buildDefaultValidatorFactory()) {
            var violaciones = fabrica.getValidator().validate(new Grupo(" "));
            // Act
            var r = manejador.restricciones(new jakarta.validation.ConstraintViolationException(violaciones));
            // Assert
            assertThat(r.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(r.getBody().error().codigo()).isEqualTo("VALIDACION");
            assertThat(r.getBody().error().campos()).containsKey("seccion");
        }
    }

    @Test
    @DisplayName("Un error de base deja en el log su SQLSTATE (qué pasó) sin el mensaje (con qué datos)")
    @org.junit.jupiter.api.extension.ExtendWith(org.springframework.boot.test.system.OutputCaptureExtension.class)
    void sqlStateEnElLog(org.springframework.boot.test.system.CapturedOutput salida) {
        var ex = new org.springframework.dao.DataIntegrityViolationException("Key (correo)=(maria@example.com)",
                new java.sql.SQLException("Key (correo)=(maria@example.com) already exists", "23505"));
        var r = manejador.general(ex);
        assertThat(r.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(salida.getAll()).contains("SQLSTATE 23505").doesNotContain("maria@example.com");
    }

    @Test
    @DisplayName("Para el log, la traza va sin mensajes (pueden traer correos o claves) pero con las clases y las causas")
    void trazaSinMensajes() {
        // Arrange
        var original = new IllegalStateException("correo maria@example.com", new IllegalArgumentException("clave hunter2"));
        // Act
        Throwable limpio = ManejadorErrores.sinMensajes(original);
        // Assert
        assertThat(limpio.getMessage()).isEqualTo("java.lang.IllegalStateException");
        assertThat(limpio.getStackTrace()).isEqualTo(original.getStackTrace());
        assertThat(limpio.getCause().getMessage()).isEqualTo("java.lang.IllegalArgumentException");
        assertThat(limpio.getCause().getCause()).isNull();
    }
}
