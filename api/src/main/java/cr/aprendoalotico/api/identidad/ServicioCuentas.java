package cr.aprendoalotico.api.identidad;

import cr.aprendoalotico.api.comun.correo.Correos;
import cr.aprendoalotico.api.comun.correo.Mensaje;
import cr.aprendoalotico.api.comun.tareas.SegundoPlano;
import cr.aprendoalotico.api.comun.web.ErrorDeNegocio;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Pedir una cuenta y crearla desde el enlace del correo (DISENO.md, B18). Pedirla es dar solo el correo; el nombre y
 * la clave se escriben al abrir el enlace. Así, quien pide una cuenta con el correo de otra persona no logra nada:
 * a ella le llega un enlace, y si lo abre, la clave la pone ella.
 */
@Service
public class ServicioCuentas {

    static final Duration VIGENCIA_DEL_ENLACE = Duration.ofHours(24);

    private final Usuarios usuarios;
    private final RegistrosPendientes pendientes;
    private final Claves claves;
    private final LimitesDeIdentidad limites;
    private final Correos correos;
    private final CorreosDeIdentidad textos;
    private final EventosDeIdentidad eventos;
    private final SegundoPlano segundoPlano;
    private final TransactionTemplate transaccion;
    private final Clock reloj;

    ServicioCuentas(Usuarios usuarios, RegistrosPendientes pendientes, Claves claves, LimitesDeIdentidad limites, Correos correos,
            CorreosDeIdentidad textos, EventosDeIdentidad eventos, SegundoPlano segundoPlano, PlatformTransactionManager transacciones,
            Clock reloj) {
        this.usuarios = usuarios;
        this.pendientes = pendientes;
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
     * Pide una cuenta. Lo que depende de si el correo ya tiene una (mandar el enlace o «ya tenés cuenta») se hace en
     * segundo plano: la respuesta es la misma y tarda lo mismo, así nadie averigua qué correos tienen cuenta.
     */
    public void pedir(String correo, String ip) {
        limites.registrosPorIp.gastar(ip);
        String direccion = Direcciones.normalizar(correo);
        segundoPlano.ejecutar("pedir cuenta", () -> prepararCuenta(direccion));
    }

    void prepararCuenta(String direccion) {
        if (!limites.correosDeRegistro.intentar(direccion)) {
            return;
        }
        if (usuarios.porCorreo(direccion).isPresent()) {
            correos.programar(textos.yaTenesCuenta(direccion));
            return;
        }
        String token = Tokens.nuevo();
        // El mensaje se arma antes de guardar nada: si la dirección no le sirve al SMTP, no queda una fila suelta
        Mensaje enlace = textos.confirmar(direccion, token);
        Instant ahora = reloj.instant();
        pendientes.crear(direccion, Tokens.hash(token), ahora, ahora.plus(VIGENCIA_DEL_ENLACE));
        correos.programar(enlace);
    }

    /**
     * Crea la cuenta con el enlace del correo, con el nombre y la clave que escribe quien lo abrió. Se borran los
     * demás pedidos de ese correo.
     */
    public void confirmar(String token, String nombre, String clave, String ip) {
        limites.enlacesPorIp.gastar(ip);
        if (!Tokens.tieneFormato(token)) {
            throw enlaceInvalido();
        }
        byte[] hashDelToken = Tokens.hash(token);
        // Antes del Argon2 (lo caro), que el enlace exista
        String correo = pendientes.correoDeVigente(hashDelToken, reloj.instant()).orElseThrow(ServicioCuentas::enlaceInvalido);
        claves.exigirQueNoSeaDebil(clave, correo);
        String hash = claves.hash(clave);
        UUID creada;
        try {
            creada = transaccion.execute(estado -> {
                pendientes.trabar(correo);
                Instant ahora = reloj.instant();
                // Ya con el correo trabado: otro enlace del mismo correo pudo haber creado la cuenta mientras tanto
                if (pendientes.correoDeVigente(hashDelToken, ahora).isEmpty()) {
                    return null;
                }
                pendientes.borrarDe(correo);
                return usuarios.porCorreo(correo).isPresent() ? null : usuarios.crear(correo, nombre, hash, ahora);
            });
        } catch (DuplicateKeyException e) {
            creada = null;
        }
        if (creada == null) {
            throw enlaceInvalido();
        }
        eventos.deLaPersona(creada, "CUENTA_CREADA", "USUARIO", creada);
    }

    static ErrorDeNegocio enlaceInvalido() {
        return new ErrorDeNegocio(HttpStatus.BAD_REQUEST, "ENLACE_INVALIDO",
                "Este enlace ya no sirve: puede que haya vencido o que ya lo hayás usado. Si ya creaste tu cuenta, entrá con tu correo y tu clave.");
    }
}
