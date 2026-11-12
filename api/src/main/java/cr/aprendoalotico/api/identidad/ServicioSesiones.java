package cr.aprendoalotico.api.identidad;

import cr.aprendoalotico.api.comun.limites.Limite;
import cr.aprendoalotico.api.comun.limites.Limite.Ficha;
import cr.aprendoalotico.api.comun.limites.Limite.Gasto;
import cr.aprendoalotico.api.comun.tareas.SegundoPlano;
import cr.aprendoalotico.api.comun.web.ErrorDeNegocio;
import cr.aprendoalotico.api.identidad.Usuarios.Usuario;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/**
 * Entrar, reconocer la sesión de cada pedido y salir (DISENO.md, B4 y sección 4). La sesión es un token al azar en
 * una cookie; en la base, solo su hash. Vale 30 días como máximo y se cierra sola tras 7 sin uso.
 */
@Service
public class ServicioSesiones {

    private static final Logger LOG = LoggerFactory.getLogger(ServicioSesiones.class);

    public static final Duration DURACION = Duration.ofDays(30);
    static final Duration SIN_USO = Duration.ofDays(7);
    /** Cada cuánto se anota que la sesión se usó: una escritura por pedido sería mucho para tan poca precisión. */
    static final Duration ANOTAR_USO_CADA = Duration.ofMinutes(5);
    static final int AGENTE_MAXIMO = 200;
    /** Sesiones abiertas por cuenta como mucho: al pasarse se cierran las más viejas (nadie llena la tabla entrando en bucle). */
    static final int ABIERTAS_MAXIMAS = 20;

    /** Lo que devuelve entrar: el token para la cookie (sale una sola vez) y quién entró. */
    public record Entrada(String token, UsuarioActual usuario) {

        @Override
        public String toString() {
            return "Entrada[" + usuario + "]";
        }
    }

    private final Usuarios usuarios;
    private final Sesiones sesiones;
    private final Claves claves;
    private final LimitesDeIdentidad limites;
    private final EventosDeIdentidad eventos;
    private final SegundoPlano segundoPlano;
    private final Clock reloj;

    ServicioSesiones(Usuarios usuarios, Sesiones sesiones, Claves claves, LimitesDeIdentidad limites, EventosDeIdentidad eventos,
            SegundoPlano segundoPlano, Clock reloj) {
        this.usuarios = usuarios;
        this.sesiones = sesiones;
        this.claves = claves;
        this.limites = limites;
        this.eventos = eventos;
        this.segundoPlano = segundoPlano;
        this.reloj = reloj;
    }

    /**
     * Entra con correo y clave. El error es el mismo si el correo no tiene cuenta o si la clave no es esa, y tarda lo
     * mismo (también la auditoría del fallo va en segundo plano). Los límites (LimitesDeIdentidad): todas las
     * entradas cuentan para los holgados; solo las fallidas, para los estrictos.
     */
    public Entrada entrar(String correo, String clave, String ip, String agente) {
        String direccion = Direcciones.normalizar(correo);
        Limite.gastarEnTodos(new Gasto(limites.entradasPorIp, ip), new Gasto(limites.entradasPorCuenta, direccion));
        Ficha fallo = Limite.gastarEnTodos(new Gasto(limites.fallosPorIpYCorreo, LimitesDeIdentidad.ipYCorreo(ip, direccion)),
                new Gasto(limites.fallosPorCorreo, direccion), new Gasto(limites.fallosPorIp, ip));
        Optional<Usuario> cuenta = usuarios.porCorreo(direccion);
        boolean coincide = cuenta.isPresent() ? claves.coincide(clave, cuenta.get().claveHash()) : claves.gastarTiempo(clave);
        if (!coincide) {
            cuenta.ifPresent(u -> segundoPlano.ejecutar("auditar entrada fallida", () -> eventos.sobreLaCuenta(u.id(), "ENTRAR_FALLIDO")));
            throw new ErrorDeNegocio(HttpStatus.UNAUTHORIZED, "CREDENCIALES_INVALIDAS", "El correo o la clave no coinciden.");
        }
        fallo.devolver();
        Usuario u = cuenta.get();
        renovarHashSiConviene(u, clave);
        String token = Tokens.nuevo();
        Instant ahora = reloj.instant();
        UUID sesion = sesiones.crear(u.id(), Tokens.hash(token), ahora, ahora.plus(DURACION), cortar(agente));
        sesiones.cerrarLasMasViejas(u.id(), ABIERTAS_MAXIMAS, ahora);
        eventos.deLaPersona(u.id(), "ENTRAR", "SESION", sesion);
        return new Entrada(token, new UsuarioActual(u.id(), sesion, u.correo(), u.nombre()));
    }

    /** Si la clave se guardó con parámetros viejos, ahora que la tenemos se recalcula. Si no se puede, entra igual. */
    private void renovarHashSiConviene(Usuario u, String clave) {
        if (!claves.conviene(u.claveHash())) {
            return;
        }
        try {
            usuarios.renovarHash(u.id(), u.claveHash(), claves.hash(clave));
        } catch (RuntimeException e) {
            LOG.warn("No se pudo renovar el hash de una clave ({}); se reintenta la próxima vez", e.getClass().getName());
        }
    }

    /** La persona de esa cookie, si la sesión sigue valiendo. Lo llama el filtro en cada pedido. */
    public Optional<UsuarioActual> reconocer(String token) {
        if (!Tokens.tieneFormato(token)) {
            return Optional.empty();
        }
        Instant ahora = reloj.instant();
        return sesiones.valida(Tokens.hash(token), ahora, ahora.minus(SIN_USO)).map(v -> {
            if (v.vistaEn().toInstant().isBefore(ahora.minus(ANOTAR_USO_CADA))) {
                sesiones.marcarVista(v.sesion(), ahora);
            }
            return new UsuarioActual(v.usuario(), v.sesion(), v.correo(), v.nombre());
        });
    }

    public void salir(UsuarioActual yo) {
        sesiones.cerrar(yo.sesion(), reloj.instant());
        eventos.deLaPersona(yo.id(), "SALIR", "SESION", yo.sesion());
    }

    /** Cierra todas sus sesiones, también esta (un celular perdido, una compu prestada). */
    public void salirDeTodosLados(UsuarioActual yo) {
        sesiones.cerrarTodas(yo.id(), reloj.instant());
        eventos.deLaPersona(yo.id(), "SESIONES_CERRADAS", "USUARIO", yo.id());
    }

    static String cortar(String agente) {
        if (agente == null || agente.isBlank()) {
            return null;
        }
        return agente.length() <= AGENTE_MAXIMO ? agente : agente.substring(0, AGENTE_MAXIMO);
    }
}
