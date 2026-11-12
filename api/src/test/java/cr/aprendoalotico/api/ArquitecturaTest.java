package cr.aprendoalotico.api;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noFields;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noMethods;
import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

/** Las reglas de la sección 2 de DISENO.md: si una se rompe, la build falla. */
@AnalyzeClasses(packages = "cr.aprendoalotico.api", importOptions = ImportOption.DoNotIncludeTests.class)
class ArquitecturaTest {

    private static final Pattern MODULO = Pattern.compile("cr\\.aprendoalotico\\.api\\.([a-z]+)(\\..*)?");

    /** Un módulo solo usa de otro lo que está en su paquete «api». «comun» lo puede usar cualquiera. */
    private static final ArchCondition<JavaClass> USAR_OTROS_MODULOS_SOLO_POR_SU_API =
            new ArchCondition<>("usar otros módulos solo por su paquete api") {
                @Override
                public void check(JavaClass clase, ConditionEvents eventos) {
                    String propio = moduloDe(clase.getPackageName());
                    clase.getDirectDependenciesFromSelf().forEach(dep -> {
                        String destino = dep.getTargetClass().getPackageName();
                        String otro = moduloDe(destino);
                        boolean ajeno = otro != null && !otro.equals(propio) && !otro.equals("comun");
                        String suApi = "cr.aprendoalotico.api." + otro + ".api";
                        if (ajeno && !destino.equals(suApi) && !destino.startsWith(suApi + ".")) {
                            eventos.add(SimpleConditionEvent.violated(dep, dep.getDescription()));
                        }
                    });
                }
            };

    private static String moduloDe(String paquete) {
        Matcher m = MODULO.matcher(paquete);
        return m.matches() ? m.group(1) : null;
    }

    @ArchTest
    static final ArchRule modulosSoloPorSuApi = classes().that().resideInAPackage("cr.aprendoalotico.api.(*)..")
            .should(USAR_OTROS_MODULOS_SOLO_POR_SU_API);

    @ArchTest
    static final ArchRule sinCiclosEntreModulos = slices().matching("cr.aprendoalotico.api.(*)..").should().beFreeOfCycles();

    @ArchTest
    static final ArchRule comunNoDependeDeNingunModulo = noClasses().that().resideInAPackage("cr.aprendoalotico.api.comun..")
            .should().dependOnClassesThat().resideOutsideOfPackages("cr.aprendoalotico.api.comun..", "java..", "javax..",
                    "jakarta..", "org.springframework..", "org.slf4j..", "tools.jackson..", "com.fasterxml..", "org.apache..",
                    "io.github.bucket4j..", "com.github.benmanes.caffeine..");

    @ArchTest
    static final ArchRule sinInyeccionPorCampo = noFields().should().beAnnotatedWith(Autowired.class)
            .orShould().beAnnotatedWith("jakarta.inject.Inject").orShould().beAnnotatedWith("jakarta.annotation.Resource")
            .because("todo se inyecta por constructor: se puede probar sin Spring y nada queda a medias");

    @ArchTest
    static final ArchRule sinInyeccionPorSetter = noMethods().should().beAnnotatedWith(Autowired.class)
            .because("todo se inyecta por constructor");

    @ArchTest
    static final ArchRule controladoresEnWeb = classes().that().areAnnotatedWith(RestController.class)
            .should().resideInAPackage("..web..");

    @ArchTest
    static final ArchRule controladoresSinAccesoDirectoALaBase = noClasses().that().resideInAPackage("..web..")
            .should().dependOnClassesThat().areAssignableTo(JdbcClient.class)
            .orShould().dependOnClassesThat().areAssignableTo(org.springframework.jdbc.core.JdbcTemplate.class)
            .orShould().dependOnClassesThat().areAssignableTo(org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate.class)
            .orShould().dependOnClassesThat().areAssignableTo(javax.sql.DataSource.class)
            .orShould().dependOnClassesThat().areAssignableTo(jakarta.persistence.EntityManager.class)
            .orShould().dependOnClassesThat().areAssignableTo(org.springframework.data.repository.Repository.class)
            .because("los controladores hablan con servicios, no con la base");

    // Dos reglas simples y no una con andShould: en noClasses(), andShould solo falla si se cumplen las dos condiciones
    @ArchTest
    static final ArchRule clasesDeWebSinTransacciones = noClasses().that().resideInAPackage("..web..")
            .should().beAnnotatedWith(Transactional.class).orShould().beAnnotatedWith("jakarta.transaction.Transactional")
            .because("las transacciones las abren los servicios, no los controladores");

    @ArchTest
    static final ArchRule metodosDeWebSinTransacciones = noMethods().that().areDeclaredInClassesThat().resideInAPackage("..web..")
            .should().beAnnotatedWith(Transactional.class).orShould().beAnnotatedWith("jakarta.transaction.Transactional")
            .because("las transacciones las abren los servicios, no los controladores");

    @ArchTest
    static final ArchRule entidadesNoSalenDeSuModulo = noClasses().that().areAnnotatedWith("jakarta.persistence.Entity")
            .should().resideInAnyPackage("cr.aprendoalotico.api.*.api..", "..web..")
            .allowEmptyShould(true)
            .because("las entidades son internas de su módulo: afuera viajan DTO (DISENO.md, sección 2)");

    @ArchTest
    static final ArchRule soloJavaTime = noClasses().should().dependOnClassesThat()
            .haveFullyQualifiedName("java.util.Date").orShould().dependOnClassesThat().haveFullyQualifiedName("java.sql.Timestamp")
            .because("las fechas van con java.time (Instant, LocalDate)");
}
