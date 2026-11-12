package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.comun.limites.Limite;
import cr.aprendoalotico.api.comun.limites.Limite.Gasto;
import cr.aprendoalotico.api.comun.web.ErrorDeNegocio;
import cr.aprendoalotico.api.comun.web.Pagina;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import cr.aprendoalotico.api.instituciones.Invitaciones.Usada;
import cr.aprendoalotico.api.instituciones.api.Rol;
import cr.aprendoalotico.api.instituciones.api.TipoDeInstitucion;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Los códigos para unirse (DISENO.md, B22). Los saca quien administra la institución, o el equipo para pasarle una
 * escuela a su dirección; quien lo recibe lo escribe y queda con ese rol. El código sale una sola vez: se guarda su hash.
 * Dar y usar un código cambia quién puede qué: se hace con la institución trabada y queda auditado en la transacción.
 */
@Service
public class ServicioInvitaciones {

    private static final Logger LOG = LoggerFactory.getLogger(ServicioInvitaciones.class);

    static final Duration VIGENCIA = Duration.ofDays(7);
    /** El que administra (dirección, encargado) vence antes: quien lo vea primero en el WhatsApp queda administrando. */
    static final Duration VIGENCIA_PARA_ADMINISTRAR = Duration.ofDays(2);

    private final Invitaciones invitaciones;
    private final Instituciones instituciones;
    private final Membresias membresias;
    private final ServicioInstituciones servicio;
    private final LimitesDeInstituciones limites;
    private final EventosDeInstituciones eventos;
    private final TransactionTemplate transaccion;
    private final Clock reloj;

    ServicioInvitaciones(Invitaciones invitaciones, Instituciones instituciones, Membresias membresias, ServicioInstituciones servicio,
            LimitesDeInstituciones limites, EventosDeInstituciones eventos, PlatformTransactionManager transacciones, Clock reloj) {
        this.invitaciones = invitaciones;
        this.instituciones = instituciones;
        this.membresias = membresias;
        this.servicio = servicio;
        this.limites = limites;
        this.eventos = eventos;
        this.transaccion = new TransactionTemplate(transacciones);
        this.reloj = reloj;
    }

    /** Un código recién sacado: es la única vez que se ve. */
    public record CodigoNuevo(UUID id, String codigo, Rol rol, Instant expiraEn) {

        @Override
        public String toString() {
            return "CodigoNuevo[id=" + id + ", rol=" + rol + "]";
        }
    }

    /** Lo saca quien administra la institución (se vuelve a mirar con la institución trabada). */
    public CodigoNuevo crear(UsuarioActual yo, UUID institucion, Rol rol) {
        TipoDeInstitucion tipo = servicio.administrada(yo, institucion).tipo();
        return crearEn(yo, institucion, tipo, rol, () -> servicio.administrada(yo, institucion));
    }

    /** Lo saca el equipo para una escuela (B21): así le pasa la escuela a su dirección. */
    public CodigoNuevo crearComoAdmin(UsuarioActual yo, UUID escuela, Rol rol) {
        ServicioInstituciones.exigirAdmin(yo);
        return crearEn(yo, escuela, servicio.escuela(escuela).tipo(), rol, () -> { });
    }

    /**
     * Con la institución trabada: quien lo saca se vuelve a mirar (si lo sacaron mientras tanto, no saca nada; y si lo
     * sacan después, su código se revoca con él) y el tope de pendientes no se pasa con dos a la vez.
     */
    private CodigoNuevo crearEn(UsuarioActual yo, UUID institucion, TipoDeInstitucion tipo, Rol rol, Runnable volverAMirar) {
        if (!tipo.roles().contains(rol)) {
            throw new ErrorDeNegocio(HttpStatus.BAD_REQUEST, "ROL_INVALIDO", "Ese rol no existe en una institución así.");
        }
        limites.invitacionesPorInstitucion.gastar(institucion.toString());
        String codigo = CodigosDeInvitacion.nuevo();
        return transaccion.execute(estado -> {
            instituciones.trabar(institucion);
            volverAMirar.run();
            Instant ahora = reloj.instant();
            if (invitaciones.contarPendientes(institucion, ahora) >= LimitesDeInstituciones.PENDIENTES_MAXIMAS) {
                throw new ErrorDeNegocio(HttpStatus.CONFLICT, "DEMASIADAS_INVITACIONES",
                        "Hay demasiados códigos sin usar: revocá los que ya no hacen falta.");
            }
            Instant expira = ahora.plus(rol == tipo.administra() ? VIGENCIA_PARA_ADMINISTRAR : VIGENCIA);
            UUID id = invitaciones.crear(institucion, rol, CodigosDeInvitacion.hash(codigo).orElseThrow(), yo.id(), ahora, expira);
            eventos.registrarODeshacer(yo, "CREAR", "INVITACION", id, institucion, Map.of("rol", rol.name()));
            return new CodigoNuevo(id, codigo, rol, expira);
        });
    }

    public Pagina.Leida<InvitacionPendiente> pendientes(UsuarioActual yo, UUID institucion, Pagina pagina) {
        servicio.administrada(yo, institucion);
        return invitaciones.pendientes(institucion, reloj.instant(), pagina);
    }

    public void revocar(UsuarioActual yo, UUID institucion, UUID invitacion) {
        servicio.administrada(yo, institucion);
        transaccion.executeWithoutResult(estado -> {
            instituciones.trabar(institucion);
            servicio.administrada(yo, institucion);
            if (!invitaciones.revocar(invitacion, institucion, reloj.instant())) {
                throw ErrorDeNegocio.noEncontrado("Ese código ya no está pendiente.");
            }
            eventos.registrarODeshacer(yo, "REVOCAR", "INVITACION", invitacion, institucion, null);
        });
    }

    /**
     * Usa un código y devuelve la institución a la que entró. Si ya tenía ese rol ahí, 409 y el código sigue sirviendo
     * (para dárselo a quien era). Se usa, se da el rol y se audita en la misma transacción, con la institución trabada
     * primero (compartido), en el mismo orden que «retirar»: si no, uno trabaría el código y esperaría la institución, y el
     * otro al revés.
     */
    public InstitucionConRoles aceptar(UsuarioActual yo, String codigo, String ip) {
        Limite.gastarEnTodos(new Gasto(limites.aceptarPorCuenta, yo.id().toString()), new Gasto(limites.aceptarPorIp, ip));
        byte[] hash = CodigosDeInvitacion.hash(codigo).orElseThrow(() -> invalida(yo));
        Usada usada = transaccion.execute(estado -> {
            instituciones.trabarCompartido(invitaciones.institucionDe(hash).orElseThrow(() -> invalida(yo)));
            Instant ahora = reloj.instant();
            Usada u = invitaciones.usar(hash, yo.id(), ahora).orElseThrow(() -> invalida(yo));
            // Un rol que no existe en esa institución (por un cambio de reglas o una fila puesta a mano) no se da
            boolean rolValido = instituciones.porId(u.institucion()).filter(i -> i.tipo().roles().contains(u.rol())).isPresent();
            if (!rolValido) {
                throw invalida(yo);
            }
            try {
                membresias.agregar(yo.id(), u.institucion(), u.rol(), ahora);
            } catch (DuplicateKeyException e) {
                // La excepción revierte la transacción: el código no queda usado
                throw new ErrorDeNegocio(HttpStatus.CONFLICT, "YA_TIENE_ESE_ROL", "Ya sos parte de esa institución con ese rol.");
            }
            eventos.registrarODeshacer(yo, "ACEPTAR", "INVITACION", u.id(), u.institucion(), Map.of("rol", u.rol().name()));
            return u;
        });
        return servicio.ver(yo, usada.institucion());
    }

    /** El mismo error para todo lo que no sirve (B22); en el log, la cuenta, para ver quién prueba códigos en bucle. */
    private static ErrorDeNegocio invalida(UsuarioActual yo) {
        LOG.info("Código de invitación que no sirve, de la cuenta {}", yo.id());
        return new ErrorDeNegocio(HttpStatus.BAD_REQUEST, "INVITACION_INVALIDA",
                "Ese código no sirve: puede que esté mal escrito, que ya se haya usado o que haya vencido. Pedí otro.");
    }
}
