package cr.aprendoalotico.api.comun.web;

/**
 * El sobre de todas las respuestas (DISENO.md, B8): siempre los mismos cuatro campos.
 *
 * @param success true si salió bien
 * @param data    lo pedido (null si hubo error)
 * @param error   qué salió mal (null si salió bien)
 * @param meta    datos de la página en las listas (null si no es una lista)
 */
public record Respuesta<T>(boolean success, T data, ErrorApi error, Meta meta) {

    public static <T> Respuesta<T> ok(T data) {
        return new Respuesta<>(true, data, null, null);
    }

    public static Respuesta<Void> falla(ErrorApi error) {
        return new Respuesta<>(false, null, error, null);
    }
}
