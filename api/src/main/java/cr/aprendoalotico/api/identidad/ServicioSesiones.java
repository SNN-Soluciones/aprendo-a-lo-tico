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
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

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
    private final TransactionTemplate transaccion;
    private final Clock reloj;

    ServicioSesiones(Usuarios usuarios, Sesiones sesiones, Claves claves, LimitesDeIdentidad limites, EventosDeIdentidad eventos,
            SegundoPlano segundoPlano, PlatformTransactionManager transacciones, Clock reloj) {
        this.usuarios = usuarios;
        this.sesiones = sesiones;
        this.claves = claves;
        this.limites = limites;
        this.eventos = eventos;
        this.segundoPlano = segundoPlano;
        this.transaccion = new TransactionTemplate(transacciones);
        this.reloj = reloj;
    }

    /**
     * Entra con correo y clave. El error es el mismo si el correo no tiene cuenta o si la clave no es esa, y tarda lo
     * mismo (también la auditoría del fallo va en segundo plano). Los límites (LimitesDeIdentidad): por IP cuentan
     * todas las entradas; por cuenta, solo las buenas (con claves equivocadas nadie gasta las de la titular), y los
     * de fallidos se gastan antes de comprobar y se devuelven si la clave era esa. Se gastan antes a propósito: si
     * solo frenaran las equivocadas, con el balde vacío la buena entraría y la mala no, y se podría seguir probando.
     */
    public Entrada entrar(String correo, String clave, String ip, String agente) {
        String direccion = Direcciones.normalizar(correo);
        // Antes del Argon2: si la cuenta ya entró demasiadas veces, ni se calcula
        limites.entradasPorCuenta.exigirQueQuede(direccion);
        limites.entradasPorIp.gastar(ip);
        String ipYCorreo = LimitesDeIdentidad.ipYCorreo(ip, direccion);
        Ficha fallo = limites.entradasBuenas.conoce(ipYCorreo)
                // Desde donde esta cuenta ya entró bien, solo el estricto: nadie la frena desde otras IP ni desde la suya (B11)
                ? limites.fallosPorIpYCorreo.gastar(ipYCorreo)
                : Limite.gastarEnTodos(new Gasto(limites.fallosPorIpYCorreo, ipYCorreo), new Gasto(limites.fallosPorCorreo, direccion),
                        new Gasto(limites.fallosPorIp, ip));
        Optional<Usuario> cuenta = usuarios.porCorreo(direccion);
        boolean coincide = cuenta.isPresent() ? claves.coincide(clave, cuenta.get().claveHash()) : claves.gastarTiempo(clave);
        if (!coincide) {
            cuenta.ifPresent(u -> segundoPlano.ejecutar("auditar entrada fallida", () -> eventos.sobreLaCuenta(u.id(), "ENTRAR_FALLIDO")));
            throw credencialesInvalidas();
        }
        fallo.devolver();
        Ficha entrada = limites.entradasPorCuenta.gastar(direccion);
        Usuario u = cuenta.get();
        String token = Tokens.nuevo();
        UUID sesion;
        try {
            sesion = abrir(u, hashRenovado(u, clave), Tokens.hash(token), cortar(agente));
        } catch (RuntimeException e) {
            entrada.devolver();
            throw e;
        }
        limites.entradasBuenas.anotar(ipYCorreo);
        eventos.deLaPersona(u.id(), "ENTRAR", "SESION", sesion);
        return new Entrada(token, new UsuarioActual(u.id(), sesion, u.correo(), u.nombre(), u.admin()));
    }

    /**
     * Abre la sesión con la cuenta trabada, si la clave sigue siendo la que se comprobó: una recuperación que la cambió
     * mientras tanto cerró todas las sesiones, y esta (con la clave vieja) no puede quedar abierta.
     */
    private UUID abrir(Usuario u, String renovado, byte[] hashDelToken, String agente) {
        return transaccion.execute(estado -> {
            if (!usuarios.trabar(u.id()).filter(u.claveHash()::equals).isPresent()) {
                throw credencialesInvalidas();
            }
            if (renovado != null) {
                usuarios.renovarHash(u.id(), u.claveHash(), renovado);
            }
            Instant ahora = reloj.instant();
            UUID id = sesiones.crear(u.id(), hashDelToken, ahora, ahora.plus(DURACION), agente);
            sesiones.cerrarLasMasViejas(u.id(), ABIERTAS_MAXIMAS, ahora);
            return id;
        });
    }

    /**
     * Si la clave se guardó con parámetros viejos, ahora que la tenemos se recalcula (fuera de la transacción: es lo
     * caro). Si no se puede, null y entra igual.
     */
    private String hashRenovado(Usuario u, String clave) {
        if (!claves.conviene(u.claveHash())) {
            return null;
        }
        try {
            return claves.hash(clave);
        } catch (RuntimeException e) {
            LOG.warn("No se pudo renovar el hash de una clave ({}); se reintenta la próxima vez", e.getClass().getName());
            return null;
        }
    }

    private static ErrorDeNegocio credencialesInvalidas() {
        return new ErrorDeNegocio(HttpStatus.UNAUTHORIZED, "CREDENCIALES_INVALIDAS", "El correo o la clave no coinciden.");
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
            return new UsuarioActual(v.usuario(), v.sesion(), v.correo(), v.nombre(), v.admin());
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
