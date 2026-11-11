package cr.aprendoalotico.pruebas.arquitectura.web;

import org.springframework.transaction.annotation.Transactional;

/** Clases de un paquete «web» armadas para probar las reglas de arquitectura (fuera de la aplicación: no se escanean). */
public final class ControladoresDePrueba {

    private ControladoresDePrueba() {
    }

    public static class SinTransacciones {
        public String ver() {
            return "ok";
        }
    }

    @Transactional
    public static class ClaseTransaccional {
        public String ver() {
            return "ok";
        }
    }

    public static class ConMetodoTransaccional {
        @Transactional
        public String guardar() {
            return "ok";
        }
    }
}
