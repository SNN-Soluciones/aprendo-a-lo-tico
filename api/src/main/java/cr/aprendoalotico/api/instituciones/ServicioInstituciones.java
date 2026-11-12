package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.comun.web.ErrorDeNegocio;
import cr.aprendoalotico.api.comun.web.Pagina;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import cr.aprendoalotico.api.instituciones.api.Acceso;
import cr.aprendoalotico.api.instituciones.api.MiembroRetirado;
import cr.aprendoalotico.api.instituciones.api.Rol;
import cr.aprendoalotico.api.instituciones.api.TipoDeInstitucion;
import java.time.Clock;
import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Escuelas, hogares y sus miembros (DISENO.md, B21 y B23). Las escuelas las crea el equipo (admins de plataforma), que no
 * por eso es miembro; un hogar lo crea cualquiera y queda de encargado. Lo de una institución de la que no es miembro le
 * da 404.
 */
@Service
public class ServicioInstituciones {

    private final Instituciones instituciones;
    private final Membresias membresias;
    private final Invitaciones invitaciones;
    private final LimitesDeInstituciones limites;
    private final EventosDeInstituciones eventos;
    private final ApplicationEventPublisher publicador;
    private final TransactionTemplate transaccion;
    private final Clock reloj;

    ServicioInstituciones(Instituciones instituciones, Membresias membresias, Invitaciones invitaciones, LimitesDeInstituciones limites,
            EventosDeInstituciones eventos, ApplicationEventPublisher publicador, PlatformTransactionManager transacciones, Clock reloj) {
        this.instituciones = instituciones;
        this.membresias = membresias;
        this.invitaciones = invitaciones;
        this.limites = limites;
        this.eventos = eventos;
        this.publicador = publicador;
        this.transaccion = new TransactionTemplate(transacciones);
        this.reloj = reloj;
    }

    // ----- El equipo (B21)

    public InstitucionConRoles crearEscuela(UsuarioActual yo, DatosDeInstitucion datos) {
        exigirAdmin(yo);
        UUID id;
        try {
            id = instituciones.crear(TipoDeInstitucion.ESCUELA, datos, reloj.instant());
        } catch (DuplicateKeyException e) {
            throw escuelaRepetida();
        }
        eventos.registrar(yo, "CREAR", "INSTITUCION", id, id, Map.of("tipo", TipoDeInstitucion.ESCUELA.name()));
        return new InstitucionConRoles(instituciones.porId(id).orElseThrow(), Set.of());
    }

    public Pagina.Leida<Institucion> escuelas(UsuarioActual yo, Pagina pagina) {
        exigirAdmin(yo);
        return instituciones.escuelas(pagina);
    }

    public InstitucionConRoles cambiarEscuela(UsuarioActual yo, UUID id, DatosDeInstitucion datos) {
        exigirAdmin(yo);
        escuela(id);
        try {
            instituciones.cambiar(id, datos, true);
        } catch (DuplicateKeyException e) {
            throw escuelaRepetida();
        }
        eventos.registrar(yo, "CAMBIAR", "INSTITUCION", id, id, null);
        return new InstitucionConRoles(instituciones.porId(id).orElseThrow(), Set.of());
    }

    /** Una escuela, para el equipo: un hogar no es asunto suyo (404, como cualquier cosa que no existe). */
    Institucion escuela(UUID id) {
        return instituciones.porId(id).filter(i -> i.tipo() == TipoDeInstitucion.ESCUELA).orElseThrow(ServicioInstituciones::noEncontrada);
    }

    // ----- Los miembros

    public InstitucionConRoles crearHogar(UsuarioActual yo, String nombre) {
        limites.hogaresPorCuenta.gastar(yo.id().toString());
        if (membresias.hogaresDe(yo.id()) >= LimitesDeInstituciones.HOGARES_MAXIMOS) {
            throw new ErrorDeNegocio(HttpStatus.CONFLICT, "DEMASIADOS_HOGARES", "Ya tenés demasiados hogares: usá uno de los que tenés.");
        }
        UUID id = transaccion.execute(estado -> {
            Instant ahora = reloj.instant();
            UUID nuevo = instituciones.crear(TipoDeInstitucion.HOGAR, DatosDeInstitucion.deUnHogar(nombre), ahora);
            membresias.agregar(yo.id(), nuevo, Rol.ENCARGADO, ahora);
            return nuevo;
        });
        eventos.registrar(yo, "CREAR", "INSTITUCION", id, id, Map.of("tipo", TipoDeInstitucion.HOGAR.name()));
        return new InstitucionConRoles(instituciones.porId(id).orElseThrow(), Set.of(Rol.ENCARGADO));
    }

    public Pagina.Leida<InstitucionConRoles> mias(UsuarioActual yo, Pagina pagina) {
        return instituciones.delUsuario(yo.id(), pagina);
    }

    public InstitucionConRoles ver(UsuarioActual yo, UUID id) {
        Acceso acceso = acceso(yo, id);
        return new InstitucionConRoles(instituciones.porId(id).orElseThrow(ServicioInstituciones::noEncontrada), acceso.roles());
    }

    /** Cambia los datos (quien administra). El código MEP no: ese lo cambia el equipo. Un hogar solo tiene nombre. */
    public InstitucionConRoles cambiar(UsuarioActual yo, UUID id, DatosDeInstitucion datos) {
        Acceso acceso = administrada(yo, id);
        DatosDeInstitucion aGuardar = acceso.tipo() == TipoDeInstitucion.HOGAR ? DatosDeInstitucion.deUnHogar(datos.nombre()) : datos;
        instituciones.cambiar(id, aGuardar, false);
        eventos.registrar(yo, "CAMBIAR", "INSTITUCION", id, id, null);
        return new InstitucionConRoles(instituciones.porId(id).orElseThrow(), acceso.roles());
    }

    /** Los miembros con sus roles. El correo solo lo ve quien administra (para distinguir a dos con el mismo nombre). */
    public Pagina.Leida<Miembro> miembros(UsuarioActual yo, UUID id, Pagina pagina) {
        Acceso acceso = acceso(yo, id);
        Pagina.Leida<Miembro> leida = membresias.miembros(id, pagina);
        if (acceso.administra()) {
            return leida;
        }
        return new Pagina.Leida<>(leida.elementos().stream().map(Miembro::sinCorreo).toList(), leida.total());
    }

    /**
     * Saca a alguien (quien administra) o se sale (cualquiera). Con la institución trabada, así dos a la vez no dejan
     * sin administración (al último que administra no se le puede sacar) y quien pide se vuelve a mirar ya trabada: si lo
     * sacaron mientras tanto, no saca a nadie. Lo saca también de sus grupos ahí (MiembroRetirado), sus códigos
     * pendientes dejan de servir, y queda auditado en la misma transacción.
     */
    public void retirar(UsuarioActual yo, UUID id, UUID usuario) {
        exigirQuePuedaRetirar(acceso(yo, id), yo, usuario);
        transaccion.executeWithoutResult(estado -> {
            instituciones.trabar(id);
            exigirQuePuedaRetirar(acceso(yo, id), yo, usuario);
            Acceso suyo = membresias.acceso(usuario, id).orElseThrow(() -> ErrorDeNegocio.noEncontrado("Esa persona no es miembro de aquí."));
            if (suyo.administra() && membresias.conRol(id, suyo.tipo().administra()) <= 1) {
                throw new ErrorDeNegocio(HttpStatus.CONFLICT, "ULTIMO_ADMINISTRADOR",
                        "Es la única persona que administra: antes tiene que haber otra.");
            }
            Instant ahora = reloj.instant();
            membresias.retirar(usuario, id, ahora);
            invitaciones.revocarLasDe(usuario, id, ahora);
            publicador.publishEvent(new MiembroRetirado(usuario, id));
            eventos.registrarODeshacer(yo, "RETIRAR", "USUARIO", usuario, id, null);
        });
    }

    private static void exigirQuePuedaRetirar(Acceso mio, UsuarioActual yo, UUID usuario) {
        if (!yo.id().equals(usuario) && !mio.administra()) {
            throw ErrorDeNegocio.sinPermiso();
        }
    }

    /** Lo que puede en esa institución; 404 si no es miembro. */
    Acceso acceso(UsuarioActual yo, UUID id) {
        return membresias.acceso(yo.id(), id).orElseThrow(ServicioInstituciones::noEncontrada);
    }

    /** Lo que puede, si administra; 403 si es miembro pero no administra. */
    Acceso administrada(UsuarioActual yo, UUID id) {
        Acceso acceso = acceso(yo, id);
        if (!acceso.administra()) {
            throw ErrorDeNegocio.sinPermiso();
        }
        return acceso;
    }

    static void exigirAdmin(UsuarioActual yo) {
        if (!yo.admin()) {
            throw ErrorDeNegocio.sinPermiso();
        }
    }

    static ErrorDeNegocio noEncontrada() {
        return ErrorDeNegocio.noEncontrado("No encontramos esa escuela u hogar.");
    }

    private static ErrorDeNegocio escuelaRepetida() {
        return new ErrorDeNegocio(HttpStatus.CONFLICT, "ESCUELA_REPETIDA", "Ya hay una escuela con ese código del MEP.");
    }
}
