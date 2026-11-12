package cr.aprendoalotico.api.identidad;

import cr.aprendoalotico.api.comun.correo.Correos;
import cr.aprendoalotico.api.comun.correo.Mensaje;
import cr.aprendoalotico.api.comun.limites.Limite.Ficha;
import cr.aprendoalotico.api.comun.tareas.SegundoPlano;
import cr.aprendoalotico.api.comun.web.ErrorDeNegocio;
import cr.aprendoalotico.api.identidad.Usuarios.Usuario;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Recuperar la clave por correo y cambiarla con la sesión abierta (DISENO.md, sección 4). Cada cambio cierra las demás
 * sesiones, invalida los enlaces de recuperación que hubiera y avisa al correo: si no fue la persona, se entera.
 * Los cambios de una misma cuenta se turnan (se traba la fila de la cuenta), así dos a la vez no se trancan.
 */
@Service
public class ServicioClaves {

    static final Duration VIGENCIA_DEL_ENLACE = Duration.ofMinutes(30);

    private final Usuarios usuarios;
    private final Recuperaciones recuperaciones;
    private final Sesiones sesiones;
    private final Claves claves;
    private final LimitesDeIdentidad limites;
    private final Correos correos;
    private final CorreosDeIdentidad textos;
    private final EventosDeIdentidad eventos;
    private final SegundoPlano segundoPlano;
    private final TransactionTemplate transaccion;
    private final Clock reloj;

    ServicioClaves(Usuarios usuarios, Recuperaciones recuperaciones, Sesiones sesiones, Claves claves, LimitesDeIdentidad limites,
            Correos correos, CorreosDeIdentidad textos, EventosDeIdentidad eventos, SegundoPlano segundoPlano,
            PlatformTransactionManager transacciones, Clock reloj) {
        this.usuarios = usuarios;
        this.recuperaciones = recuperaciones;
        this.sesiones = sesiones;
        this.claves = claves;
        this.limites = limites;
        this.correos = correos;
        this.textos = textos;
        this.eventos = eventos;
        this.segundoPlano = segundoPlano;
        this.transaccion = new TransactionTemplate(transacciones);
        this.reloj = reloj;
    }

    /**
     * Manda el enlace si el correo tiene cuenta. Todo lo que depende de eso va en segundo plano: la respuesta es la
     * misma y tarda lo mismo tenga o no cuenta (y a un correo sin cuenta no se le manda nada).
     */
    public void pedirRecuperacion(String correo, String ip) {
        limites.recuperacionesPorIp.gastar(ip);
        String direccion = Direcciones.normalizar(correo);
        segundoPlano.ejecutar("pedir recuperación", () -> prepararRecuperacion(direccion));
    }

    void prepararRecuperacion(String direccion) {
        usuarios.porCorreo(direccion).ifPresent(u -> {
            if (!limites.correosDeRecuperacion.intentar(direccion)) {
                return;
            }
            String token = Tokens.nuevo();
            Mensaje enlace = textos.recuperar(direccion, token);
            Instant ahora = reloj.instant();
            recuperaciones.crear(u.id(), Tokens.hash(token), ahora, ahora.plus(VIGENCIA_DEL_ENLACE));
            correos.programar(enlace);
            eventos.sobreLaCuenta(u.id(), "RECUPERACION_PEDIDA");
        });
    }

    /** Pone la clave nueva con el enlace del correo: un solo uso, y se cierran todas las sesiones. */
    public void ponerClaveNueva(String token, String clave, String ip) {
        limites.enlacesPorIp.gastar(ip);
        if (!Tokens.tieneFormato(token)) {
            throw ServicioCuentas.enlaceInvalido();
        }
        byte[] hashDelToken = Tokens.hash(token);
        // Antes del Argon2 (lo caro), que el enlace exista
        UUID dueno = recuperaciones.cuentaDeVigente(hashDelToken, reloj.instant()).orElseThrow(ServicioCuentas::enlaceInvalido);
        Usuario cuenta = usuarios.porId(dueno).orElseThrow(ServicioCuentas::enlaceInvalido);
        claves.exigirQueNoSeaDebil(clave, cuenta.correo());
        String hash = claves.hash(clave);
        boolean cambio = Boolean.TRUE.equals(transaccion.execute(estado -> {
            usuarios.trabar(dueno);
            Instant ahora = reloj.instant();
            // Ya con la cuenta trabada: el enlace pudo haberse usado (u otro de la misma cuenta) mientras tanto
            if (recuperaciones.cuentaDeVigente(hashDelToken, ahora).isEmpty()) {
                return false;
            }
            usuarios.cambiarClave(dueno, hash, ahora);
            recuperaciones.usarTodas(dueno, ahora);
            sesiones.cerrarTodas(dueno, ahora);
            return true;
        }));
        if (!cambio) {
            throw ServicioCuentas.enlaceInvalido();
        }
        eventos.deLaPersona(dueno, "CLAVE_RECUPERADA", "USUARIO", dueno);
        correos.programar(textos.claveCambiada(cuenta.correo()));
    }

    /**
     * Cambia la clave con la sesión abierta: pide la actual, cierra las demás sesiones y le cambia el token a esta
     * (devuelve el nuevo, para la cookie).
     */
    public String cambiar(UsuarioActual yo, String actual, String nueva) {
        Ficha fallo = limites.fallosDeCambioPorCuenta.gastar(yo.id().toString());
        limites.cambiosPorCuenta.gastar(yo.id().toString());
        Usuario cuenta = usuarios.porId(yo.id()).orElseThrow(ServicioClaves::sinSesion);
        if (!claves.coincide(actual, cuenta.claveHash())) {
            eventos.sobreLaCuenta(cuenta.id(), "CAMBIO_DE_CLAVE_FALLIDO");
            throw claveIncorrecta();
        }
        fallo.devolver();
        claves.exigirQueNoSeaDebil(nueva, cuenta.correo());
        String hash = claves.hash(nueva);
        String token = Tokens.nuevo();
        // Lo que se comprobó sin trabar pudo cambiar mientras se calculaban los hashes: se vuelve a mirar con la cuenta
        // trabada, y si algo no cuadra se deshace todo (la excepción revierte la transacción)
        transaccion.executeWithoutResult(estado -> {
            if (!usuarios.trabar(cuenta.id()).filter(cuenta.claveHash()::equals).isPresent()) {
                // La recuperaron mientras tanto: la «actual» ya no es esa, y no se pisa la recuperada
                throw claveIncorrecta();
            }
            if (!sesiones.cambiarToken(yo.sesion(), Tokens.hash(token))) {
                // Cerraron esta sesión mientras tanto: quien la usaba ya no puede cambiar nada
                throw sinSesion();
            }
            Instant ahora = reloj.instant();
            usuarios.cambiarClave(cuenta.id(), hash, ahora);
            recuperaciones.usarTodas(cuenta.id(), ahora);
            sesiones.cerrarOtras(cuenta.id(), yo.sesion(), ahora);
        });
        eventos.deLaPersona(cuenta.id(), "CLAVE_CAMBIADA", "USUARIO", cuenta.id());
        correos.programar(textos.claveCambiada(cuenta.correo()));
        return token;
    }

    private static ErrorDeNegocio sinSesion() {
        return new ErrorDeNegocio(HttpStatus.UNAUTHORIZED, "NO_AUTENTICADO", "Tenés que entrar con tu cuenta.");
    }

    private static ErrorDeNegocio claveIncorrecta() {
        return new ErrorDeNegocio(HttpStatus.BAD_REQUEST, "CLAVE_INCORRECTA", "La clave actual no es esa.");
    }
}
