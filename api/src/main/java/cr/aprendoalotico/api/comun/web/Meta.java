package cr.aprendoalotico.api.comun.web;

/** La página de una lista: cuántos hay en total, qué página es y de qué tamaño. */
public record Meta(long total, int pagina, int tamano) {
}
