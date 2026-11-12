package cr.aprendoalotico.api.comun.web;

import java.util.List;

/**
 * Qué página de una lista se pide (DISENO.md, sección 5): de la 1 a la {@value #PAGINA_MAXIMA}, de 1 a
 * {@value #TAMANO_MAXIMO} elementos. Los controladores la arman con {@code ?pagina=&tamano=} ya validados.
 */
public record Pagina(int pagina, int tamano) {

    public static final int TAMANO_MAXIMO = 100;
    /** Más allá, el OFFSET recorre millones de filas para nada: nadie mira la página diez mil. */
    public static final int PAGINA_MAXIMA = 10_000;
    public static final String TAMANO_COMUN = "20";

    public Pagina {
        if (pagina < 1 || pagina > PAGINA_MAXIMA || tamano < 1 || tamano > TAMANO_MAXIMO) {
            throw new IllegalArgumentException("Página " + pagina + " de " + tamano + " fuera de rango");
        }
    }

    /** Cuántos se saltan (el OFFSET). */
    public long desde() {
        return (long) (pagina - 1) * tamano;
    }

    /** Una página ya leída: sus elementos y cuántos hay en total. */
    public record Leida<T>(List<T> elementos, long total) {

        public Leida {
            elementos = List.copyOf(elementos);
        }
    }

    public <T> Respuesta<List<T>> respuesta(Leida<T> leida) {
        return new Respuesta<>(true, leida.elementos(), null, new Meta(leida.total(), pagina, tamano));
    }
}
