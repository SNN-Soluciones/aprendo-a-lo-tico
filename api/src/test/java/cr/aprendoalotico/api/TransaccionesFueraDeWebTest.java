package cr.aprendoalotico.api;

import static org.assertj.core.api.Assertions.assertThat;

import com.tngtech.archunit.core.importer.ClassFileImporter;
import cr.aprendoalotico.pruebas.arquitectura.web.ControladoresDePrueba;
import java.util.stream.Stream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/** Una regla de ArchUnit mal escrita pasa siempre: esta se prueba contra clases armadas para romperla. */
class TransaccionesFueraDeWebTest {

    private static boolean rompeLaRegla(Class<?> clase) {
        var clases = new ClassFileImporter().importClasses(clase);
        return Stream.of(ArquitecturaTest.clasesDeWebSinTransacciones, ArquitecturaTest.metodosDeWebSinTransacciones)
                .anyMatch(regla -> regla.evaluate(clases).hasViolation());
    }

    @Test
    @DisplayName("Un controlador con un método @Transactional rompe la regla")
    void metodoTransaccional() {
        assertThat(rompeLaRegla(ControladoresDePrueba.ConMetodoTransaccional.class)).isTrue();
    }

    @Test
    @DisplayName("Un controlador @Transactional entero rompe la regla")
    void claseTransaccional() {
        assertThat(rompeLaRegla(ControladoresDePrueba.ClaseTransaccional.class)).isTrue();
    }

    @Test
    @DisplayName("Un controlador sin transacciones cumple la regla")
    void sinTransacciones() {
        assertThat(rompeLaRegla(ControladoresDePrueba.SinTransacciones.class)).isFalse();
    }
}
