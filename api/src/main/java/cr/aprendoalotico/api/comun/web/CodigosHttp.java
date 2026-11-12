package cr.aprendoalotico.api.comun.web;

import org.springframework.http.HttpStatusCode;

/** El código estable y el mensaje en español para cada estado HTTP genérico (los que no traen un código propio). */
final class CodigosHttp {

    private CodigosHttp() {
    }

    static String codigo(HttpStatusCode estado) {
        return switch (estado.value()) {
            case 400 -> "SOLICITUD_INVALIDA";
            case 401 -> "NO_AUTENTICADO";
            case 403 -> "PROHIBIDO";
            case 404 -> "NO_ENCONTRADO";
            case 405 -> "METODO_NO_PERMITIDO";
            case 406 -> "NO_ACEPTABLE";
            case 409 -> "CONFLICTO";
            case 413 -> "DEMASIADO_GRANDE";
            case 415 -> "TIPO_NO_SOPORTADO";
            case 429 -> "DEMASIADOS_INTENTOS";
            case 503 -> "NO_DISPONIBLE";
            default -> estado.is5xxServerError() ? "ERROR_INTERNO" : "SOLICITUD_INVALIDA";
        };
    }

    static String mensaje(HttpStatusCode estado) {
        return switch (estado.value()) {
            case 401 -> "Tenés que entrar con tu cuenta.";
            case 403 -> "No tenés permiso para esto.";
            case 404 -> "Eso no existe.";
            case 405 -> "Esa acción no se puede hacer aquí.";
            case 409 -> "Eso choca con algo que ya existe.";
            case 413 -> "Lo que se mandó es demasiado grande.";
            case 415 -> "Lo que se mandó no tiene el formato esperado.";
            case 429 -> "Demasiados intentos. Esperá un momento y probá de nuevo.";
            case 503 -> "El servicio no está disponible en este momento.";
            default -> estado.is5xxServerError()
                    ? "Algo salió mal de nuestro lado. Si se repite, avisanos con el número de pedido."
                    : "El pedido no es válido.";
        };
    }
}
