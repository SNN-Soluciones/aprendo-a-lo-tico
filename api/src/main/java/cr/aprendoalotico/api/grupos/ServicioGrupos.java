package cr.aprendoalotico.api.grupos;

import cr.aprendoalotico.api.comun.Codigos;
import cr.aprendoalotico.api.comun.web.ErrorDeNegocio;
import cr.aprendoalotico.api.comun.web.Pagina;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import cr.aprendoalotico.api.instituciones.api.Acceso;
import cr.aprendoalotico.api.instituciones.api.Accesos;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Los grupos, su código de clase y sus docentes (DISENO.md, B23 y B24). Un grupo lo ven sus docentes y quien administra
 * la institución; lo cambian su titular y quien administra. Lo que no le toca ver da 404.
 */
@Service
public class ServicioGrupos {

    /** Seis caracteres sin 0/O/1/I: unos mil millones de códigos, para dictarlos y copiarlos en una tarjeta. */
    static final int LARGO_DEL_CODIGO = 6;
    private static final ZoneId COSTA_RICA = ZoneId.of("America/Costa_Rica");
    /** Si el código que salió ya lo tiene otro grupo, se prueba con otro (con mil millones, casi nunca hace falta). */
    private static final int INTENTOS_DE_CODIGO = 5;

    private final Grupos grupos;
    private final DocentesDeGrupo docentes;
    private final AniosLectivos anios;
    private final Accesos accesos;
    private final LimitesDeGrupos limites;
    private final EventosDeGrupos eventos;
    private final TransactionTemplate transaccion;
    private final Clock reloj;

    ServicioGrupos(Grupos grupos, DocentesDeGrupo docentes, AniosLectivos anios, Accesos accesos, LimitesDeGrupos limites,
            EventosDeGrupos eventos, PlatformTransactionManager transacciones, Clock reloj) {
        this.grupos = grupos;
        this.docentes = docentes;
        this.anios = anios;
        this.accesos = accesos;
        this.limites = limites;
        this.eventos = eventos;
        this.transaccion = new TransactionTemplate(transacciones);
        this.reloj = reloj;
    }

    /** Un grupo con sus docentes, como lo ve alguien: su papel ahí (null si no da clases) y si lo puede cambiar. */
    public record Detalle(Grupo grupo, List<Docente> docentes, Papel miPapel, boolean puedoCambiar) {

        public Detalle {
            docentes = List.copyOf(docentes);
        }
    }

    /** Lo que alguien ve de un grupo: lo ve si da clases ahí o administra; lo cambia si es su titular o administra. */
    private record Visto(Grupo grupo, Acceso acceso, Optional<Papel> papel) {

        boolean puedeVer() {
            return acceso.administra() || papel.isPresent();
        }

        boolean puedeCambiar() {
            return acceso.administra() || papel.filter(p -> p == Papel.TITULAR).isPresent();
        }
    }

    /** Crea el grupo (y su año lectivo si es el primero de ese año): quien lo crea queda de titular. */
    public Detalle crear(UsuarioActual yo, UUID institucion, int anio, int grado, String seccion) {
        exigirAnioCercano(anio, reloj);
        Acceso acceso = accesos.de(yo.id(), institucion).orElseThrow(ServicioGrupos::institucionNoEncontrada);
        if (!acceso.ensena()) {
            throw ErrorDeNegocio.sinPermiso();
        }
        limites.crearPorCuenta.gastar(yo.id().toString());
        UUID id = transaccion.execute(estado -> {
            // Con la institución trabada: si lo sacan de ahí mientras tanto, no queda de titular de nada
            accesos.deTrabando(yo.id(), institucion).filter(Acceso::ensena).orElseThrow(ServicioGrupos::institucionNoEncontrada);
            Instant ahora = reloj.instant();
            UUID anioLectivo = anios.asegurar(institucion, anio);
            UUID nuevo = conCodigoNuevo(() -> crearSiSePuede(anioLectivo, grado, seccion, ahora));
            docentes.poner(nuevo, yo.id(), Papel.TITULAR, null, ahora);
            // Quien lo crea queda de titular (va a ver a sus estudiantes): se audita aquí, o no se crea
            eventos.registrarODeshacer(yo, "CREAR", "GRUPO", nuevo, institucion,
                    Map.of("anio", anio, "grado", grado, "titular", yo.id().toString()));
            return nuevo;
        });
        return ver(yo, id);
    }

    private Optional<UUID> crearSiSePuede(UUID anioLectivo, int grado, String seccion, Instant ahora) {
        try {
            return grupos.crear(anioLectivo, grado, seccion, Codigos.nuevo(LARGO_DEL_CODIGO), ahora);
        } catch (DuplicateKeyException e) {
            throw grupoRepetido();
        }
    }

    /** Todos los de la institución (quien administra) o solo aquellos en los que da clases. */
    public Pagina.Leida<Grupo> deInstitucion(UsuarioActual yo, UUID institucion, Integer anio, Pagina pagina) {
        Acceso acceso = accesos.de(yo.id(), institucion).orElseThrow(ServicioGrupos::institucionNoEncontrada);
        return grupos.deInstitucion(institucion, anio, acceso.administra() ? null : yo.id(), pagina);
    }

    /** Aquellos en los que da clases, de todas sus instituciones. */
    public Pagina.Leida<Grupo> mios(UsuarioActual yo, Pagina pagina) {
        return grupos.delDocente(yo.id(), pagina);
    }

    public Detalle ver(UsuarioActual yo, UUID id) {
        Visto visto = visto(yo, id);
        return new Detalle(visto.grupo(), docentes.de(id), visto.papel().orElse(null), visto.puedeCambiar());
    }

    public Detalle cambiar(UsuarioActual yo, UUID id, int grado, String seccion) {
        Visto visto = paraCambiar(yo, id);
        conPermisoTrabado(yo, visto, () -> {
            try {
                grupos.cambiar(id, grado, seccion);
            } catch (DuplicateKeyException e) {
                throw grupoRepetido();
            }
        });
        eventos.registrar(yo, "CAMBIAR", "GRUPO", id, visto.grupo().institucion(), Map.of("grado", grado));
        return ver(yo, id);
    }

    /** Un código de clase nuevo: el anterior deja de servir en el acto (por si se filtró). */
    public Detalle nuevoCodigo(UsuarioActual yo, UUID id) {
        Visto visto = paraCambiar(yo, id);
        limites.codigosPorGrupo.gastar(id.toString());
        // Cada intento en su propia transacción: si otro grupo toma el mismo código en el mismo instante, la clave única
        // rechaza este, y en esa transacción ya no se puede probar otro
        conCodigoNuevo(() -> codigoNuevoSiSePuede(yo, visto));
        eventos.registrar(yo, "CAMBIAR_CODIGO", "GRUPO", id, visto.grupo().institucion(), null);
        return ver(yo, id);
    }

    /**
     * Pone a alguien de la institución a dar clases en el grupo (o le cambia el papel). Una titular nueva reemplaza a la
     * anterior. Con la institución y el grupo trabados: nadie lo saca de la institución mientras tanto, y dos cambios del
     * mismo grupo se turnan.
     */
    public Detalle ponerDocente(UsuarioActual yo, UUID id, UUID usuario, Papel papel, String materia) {
        if ((papel == Papel.MATERIA) == (materia == null)) {
            throw new ErrorDeNegocio(HttpStatus.BAD_REQUEST, "MATERIA_INVALIDA",
                    papel == Papel.MATERIA ? "Decí qué materia da." : "La titular no lleva materia.");
        }
        Visto visto = paraCambiar(yo, id);
        UUID institucion = visto.grupo().institucion();
        transaccion.executeWithoutResult(estado -> {
            // Ya trabados, quien pide se vuelve a mirar: si mientras tanto la sacaron (de la institución o del grupo), no pone a nadie
            Acceso mio = accesos.deTrabando(yo.id(), institucion).orElseThrow(ServicioGrupos::grupoNoEncontrado);
            grupos.trabar(id);
            if (!new Visto(visto.grupo(), mio, docentes.papel(id, yo.id())).puedeCambiar()) {
                throw ErrorDeNegocio.sinPermiso();
            }
            accesos.deTrabando(usuario, institucion).filter(Acceso::ensena).orElseThrow(() -> new ErrorDeNegocio(HttpStatus.BAD_REQUEST,
                    "NO_DA_CLASES_AQUI", "Esa persona no da clases en esta institución."));
            docentes.poner(id, usuario, papel, materia, reloj.instant());
            eventos.registrarODeshacer(yo, "PONER_DOCENTE", "GRUPO", id, institucion,
                    Map.of("usuario", usuario.toString(), "papel", papel.name()));
        });
        // Sin «ver»: si la titular le pasó el grupo a otra, ya no es del grupo, y el cambio salió bien igual
        Optional<Papel> mio = docentes.papel(id, yo.id());
        boolean puedo = visto.acceso().administra() || mio.filter(p -> p == Papel.TITULAR).isPresent();
        return new Detalle(visto.grupo(), docentes.de(id), mio.orElse(null), puedo);
    }

    /** Saca a un docente del grupo (titular o quien administra); cualquiera puede salirse. */
    public void quitarDocente(UsuarioActual yo, UUID id, UUID usuario) {
        Visto visto = visto(yo, id);
        if (!yo.id().equals(usuario) && !visto.puedeCambiar()) {
            throw ErrorDeNegocio.sinPermiso();
        }
        UUID institucion = visto.grupo().institucion();
        transaccion.executeWithoutResult(estado -> {
            Acceso mio = accesos.deTrabando(yo.id(), institucion).orElseThrow(ServicioGrupos::grupoNoEncontrado);
            grupos.trabar(id);
            if (!yo.id().equals(usuario) && !new Visto(visto.grupo(), mio, docentes.papel(id, yo.id())).puedeCambiar()) {
                throw ErrorDeNegocio.sinPermiso();
            }
            if (!docentes.quitar(id, usuario)) {
                throw ErrorDeNegocio.noEncontrado("Esa persona no da clases en este grupo.");
            }
            eventos.registrarODeshacer(yo, "QUITAR_DOCENTE", "GRUPO", id, institucion, Map.of("usuario", usuario.toString()));
        });
    }

    /**
     * El año de un grupo o de un año lectivo, cerca del de hoy (en Costa Rica): el pasado, este o el que viene. Así nadie
     * llena la base de años lejanos, y en noviembre ya se arma el curso siguiente.
     */
    static void exigirAnioCercano(int anio, Clock reloj) {
        int hoy = LocalDate.ofInstant(reloj.instant(), COSTA_RICA).getYear();
        if (anio < hoy - 1 || anio > hoy + 1) {
            throw new ErrorDeNegocio(HttpStatus.BAD_REQUEST, "ANIO_INVALIDO", "El año tiene que ser el pasado, este o el que viene.");
        }
    }

    /**
     * Hace el cambio con la institución (compartido) y el grupo trabados, después de volver a mirar que quien lo pide
     * todavía lo puede cambiar: si mientras tanto la sacaron, no cambia nada.
     */
    private void conPermisoTrabado(UsuarioActual yo, Visto visto, Runnable cambio) {
        conPermisoTrabado(yo, visto, () -> {
            cambio.run();
            return true;
        });
    }

    private <T> T conPermisoTrabado(UsuarioActual yo, Visto visto, Supplier<T> cambio) {
        UUID id = visto.grupo().id();
        return transaccion.execute(estado -> {
            Acceso mio = accesos.deTrabando(yo.id(), visto.grupo().institucion()).orElseThrow(ServicioGrupos::grupoNoEncontrado);
            grupos.trabar(id);
            if (!new Visto(visto.grupo(), mio, docentes.papel(id, yo.id())).puedeCambiar()) {
                throw ErrorDeNegocio.sinPermiso();
            }
            return cambio.get();
        });
    }

    /** Un intento de código nuevo, en su propia transacción. Vacío si ya lo tenía otro grupo (se prueba con otro). */
    private Optional<UUID> codigoNuevoSiSePuede(UsuarioActual yo, Visto visto) {
        UUID id = visto.grupo().id();
        try {
            return conPermisoTrabado(yo, visto, () -> grupos.cambiarCodigo(id, Codigos.nuevo(LARGO_DEL_CODIGO))) ? Optional.of(id) : Optional.empty();
        } catch (DuplicateKeyException e) {
            return Optional.empty();
        }
    }

    /** El grupo, si lo ve; 404 si no existe, es de otra institución o no le toca verlo. */
    private Visto visto(UsuarioActual yo, UUID id) {
        Grupo grupo = grupos.porId(id).orElseThrow(ServicioGrupos::grupoNoEncontrado);
        Acceso acceso = accesos.de(yo.id(), grupo.institucion()).orElseThrow(ServicioGrupos::grupoNoEncontrado);
        Visto visto = new Visto(grupo, acceso, docentes.papel(id, yo.id()));
        if (!visto.puedeVer()) {
            throw grupoNoEncontrado();
        }
        return visto;
    }

    private Visto paraCambiar(UsuarioActual yo, UUID id) {
        Visto visto = visto(yo, id);
        if (!visto.puedeCambiar()) {
            throw ErrorDeNegocio.sinPermiso();
        }
        return visto;
    }

    private static UUID conCodigoNuevo(Supplier<Optional<UUID>> intento) {
        for (int i = 0; i < INTENTOS_DE_CODIGO; i++) {
            Optional<UUID> hecho = intento.get();
            if (hecho.isPresent()) {
                return hecho.get();
            }
        }
        throw new IllegalStateException("No salió un código de clase libre en " + INTENTOS_DE_CODIGO + " intentos");
    }

    static ErrorDeNegocio institucionNoEncontrada() {
        return ErrorDeNegocio.noEncontrado("No encontramos esa escuela u hogar.");
    }

    private static ErrorDeNegocio grupoNoEncontrado() {
        return ErrorDeNegocio.noEncontrado("No encontramos ese grupo.");
    }

    private static ErrorDeNegocio grupoRepetido() {
        return new ErrorDeNegocio(HttpStatus.CONFLICT, "GRUPO_REPETIDO", "Ya hay un grupo de ese grado y sección ese año.");
    }
}
