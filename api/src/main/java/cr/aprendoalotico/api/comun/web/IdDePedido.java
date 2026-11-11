package cr.aprendoalotico.api.comun.web;

import org.slf4j.MDC;

/**
 * El id de cada pedido: lo genera siempre el servidor y va en la cabecera X-Id-Pedido, en los logs (MDC), en los
 * errores y en la auditoría. Si el cliente manda el suyo, queda aparte en los logs (para cruzarlo con el portal),
 * pero nunca lo reemplaza: así nadie puede reusar un id ajeno para ensuciar el rastreo.
 */
public final class IdDePedido {

    public static final String CABECERA = "X-Id-Pedido";
    public static final String CLAVE_MDC = "pedido";
    public static final String CLAVE_MDC_CLIENTE = "pedido_cliente";
    /** Atributo del pedido: la página de error corre después de que se limpió el MDC. */
    public static final String ATRIBUTO = IdDePedido.class.getName();

    private IdDePedido() {
    }

    /** El id del pedido en curso, o null fuera de un pedido (tareas programadas, pruebas). */
    public static String actual() {
        return MDC.get(CLAVE_MDC);
    }
}
