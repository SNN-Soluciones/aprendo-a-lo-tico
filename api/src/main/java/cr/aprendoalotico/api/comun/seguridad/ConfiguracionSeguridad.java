package cr.aprendoalotico.api.comun.seguridad;

import cr.aprendoalotico.api.comun.PropiedadesApp;
import jakarta.servlet.DispatcherType;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.HeaderWriterFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

/**
 * Seguridad por defecto (DISENO.md, sección 4): todo pide sesión salvo lo que algún módulo abre a propósito
 * (ContribucionDeSeguridad), los cambios solo desde el sitio, cabeceras de seguridad en todo, y los 401/403 con el
 * sobre de siempre.
 */
@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
public class ConfiguracionSeguridad {

    /** La salud de la plataforma: GET y HEAD, sin sesión (no dice nada más que «arriba» o «abajo»). */
    static List<RequestMatcher> saludPublica() {
        var m = PathPatternRequestMatcher.withDefaults();
        return List.of(m.matcher(HttpMethod.GET, "/actuator/health/**"), m.matcher(HttpMethod.HEAD, "/actuator/health/**"));
    }

    @Bean
    SecurityFilterChain cadenaDeSeguridad(HttpSecurity http, PropiedadesApp app, ObjectProvider<ContribucionDeSeguridad> modulos)
            throws Exception {
        List<ContribucionDeSeguridad> contribuciones = modulos.orderedStream().toList();
        List<RequestMatcher> publicas = new ArrayList<>(saludPublica());
        contribuciones.forEach(c -> publicas.addAll(c.publicas()));

        http
                // CSRF: cookies SameSite=Strict (cuando haya sesiones) + OrigenFiltro, sin tokens en cada formulario
                .csrf(csrf -> csrf.disable())
                .addFilterAfter(new OrigenFiltro(app.origenes()), HeaderWriterFilter.class)
                // Las sesiones son nuestras (opacas, en la base): nada de HttpSession, login por formulario ni Basic
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .requestCache(r -> r.disable())
                .httpBasic(b -> b.disable())
                .formLogin(f -> f.disable())
                .logout(l -> l.disable())
                .authorizeHttpRequests(a -> a
                        // La página de error interna sí; un GET directo a /error, no
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        .requestMatchers(publicas.toArray(RequestMatcher[]::new)).permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((pedido, respuesta, ex) -> EscritorDeErrores.escribir(respuesta,
                                HttpStatus.UNAUTHORIZED, "NO_AUTENTICADO", "Tenés que entrar con tu cuenta."))
                        .accessDeniedHandler((pedido, respuesta, ex) -> EscritorDeErrores.escribir(respuesta,
                                HttpStatus.FORBIDDEN, "PROHIBIDO", "No tenés permiso para esto.")))
                .headers(h -> h
                        .contentTypeOptions(Customizer.withDefaults())
                        .frameOptions(f -> f.deny())
                        .referrerPolicy(r -> r.policy(ReferrerPolicy.SAME_ORIGIN))
                        .contentSecurityPolicy(c -> c.policyDirectives(CabecerasDeSeguridad.CSP))
                        // includeSubDomains: todo aprendoalotico.cr va por HTTPS (App Platform no sirve otra cosa)
                        .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31_536_000))
                        .cacheControl(Customizer.withDefaults()));
        for (ContribucionDeSeguridad c : contribuciones) {
            c.configurar(http);
        }
        return http.build();
    }
}
