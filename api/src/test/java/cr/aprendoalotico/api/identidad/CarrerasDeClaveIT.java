package cr.aprendoalotico.api.identidad;

import static cr.aprendoalotico.api.identidad.Navegador.desde;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cr.aprendoalotico.api.comun.correo.Correos;
import cr.aprendoalotico.api.comun.tareas.SegundoPlano;
import cr.aprendoalotico.api.comun.web.ErrorDeNegocio;
import cr.aprendoalotico.api.identidad.api.UsuarioActual;
import java.time.Clock;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Lo que pasa si otro pedido cambia la cuenta mientras uno comprueba la clave (el Argon2 tarda, y se calcula sin la
 * cuenta trabada). Las claves de estas pruebas dejan pasar al otro pedido justo después de comprobar: el orden es
 * siempre el mismo, sin hilos ni esperas. Una más, con dos transacciones a la vez de verdad, prueba que la cuenta
 * trabada las turna (sin el «for update», esa falla).
 */
class CarrerasDeClaveIT extends PruebaDeIdentidad {

    static final String RECUPERADA = "la clave que puso al recuperar";
    static final String OTRA = "la que quería poner con la sesión";

    @Autowired
    Usuarios usuarios;
    @Autowired
    Sesiones sesiones;
    @Autowired
    Recuperaciones recuperaciones;
    @Autowired
    LimitesDeIdentidad limites;
    @Autowired
    EventosDeIdentidad eventos;
    @Autowired
    Correos correos;
    @Autowired
    CorreosDeIdentidad textos;
    @Autowired
    SegundoPlano segundoPlano;
    @Autowired
    PlatformTransactionManager transacciones;
    @Autowired
    Clock reloj;
    @Autowired
    ServicioClaves clavesDeVerdad;
    @Autowired
    ServicioSesiones sesionesDeVerdad;
    @Autowired
    Claves clavesDeLaApp;

    private ClavesConInterrupcion claves;
    private ServicioSesiones entradas;
    private ServicioClaves cambios;

    /** Las claves de verdad, pero justo después de comprobar una corre lo que haría otro pedido (una sola vez). */
    static final class ClavesConInterrupcion extends Claves {

        private final AtomicReference<Runnable> mientrasTanto = new AtomicReference<>();

        void alComprobar(Runnable otroPedido) {
            mientrasTanto.set(otroPedido);
        }

        @Override
        boolean coincide(String clave, String hash) {
            boolean coincide = super.coincide(clave, hash);
            Runnable otro = mientrasTanto.getAndSet(null);
            if (otro != null) {
                otro.run();
            }
            return coincide;
        }
    }

    @BeforeEach
    void armar() {
        claves = new ClavesConInterrupcion();
        entradas = new ServicioSesiones(usuarios, sesiones, claves, limites, eventos, segundoPlano, transacciones, reloj);
        cambios = new ServicioClaves(usuarios, recuperaciones, sesiones, claves, limites, correos, textos, eventos, segundoPlano,
                transacciones, reloj);
    }

    /** Lo que hace la persona desde el enlace del correo, de punta a punta. */
    private void recuperar(String correo, String nueva) {
        String ip = Navegador.ipNueva();
        clavesDeVerdad.pedirRecuperacion(correo, ip);
        clavesDeVerdad.ponerClaveNueva(buzon.tokenPara(correo), nueva, ip);
    }

    private UsuarioActual yo(String correo) throws Exception {
        return sesionesDeVerdad.reconocer(entrar(correo, CLAVE).getValue()).orElseThrow();
    }

    private void noEntraCon(String correo, String clave) throws Exception {
        mvc.perform(desde(Navegador.ipNueva(), HttpMethod.POST, "/api/v1/sesion", Map.of("correo", correo, "clave", clave)))
                .andExpect(status().isUnauthorized());
    }

    private int abiertas(String correo) {
        return filas("select count(*) from public.sesiones s join public.usuarios u on u.id = s.usuario_id "
                + "where u.correo = ? and s.cerrada_en is null", correo);
    }

    @Test
    @DisplayName("Si recuperan la clave mientras alguien entra con la vieja, esa sesión no se abre (la recuperación cerró todas)")
    void entrarMientrasLaRecuperan() throws Exception {
        String correo = cuentaNueva();
        claves.alComprobar(() -> recuperar(correo, RECUPERADA));

        assertThatThrownBy(() -> entradas.entrar(correo, CLAVE, Navegador.ipNueva(), "Firefox"))
                .isInstanceOfSatisfying(ErrorDeNegocio.class, e -> assertThat(e.codigo()).isEqualTo("CREDENCIALES_INVALIDAS"));
        assertThat(abiertas(correo)).isZero();
        entrar(correo, RECUPERADA);
    }

    @Test
    @DisplayName("Si recuperan la clave mientras se cambia con la sesión, gana la recuperada: la «actual» ya no era esa")
    void cambiarMientrasLaRecuperan() throws Exception {
        String correo = cuentaNueva();
        UsuarioActual yo = yo(correo);
        claves.alComprobar(() -> recuperar(correo, RECUPERADA));

        assertThatThrownBy(() -> cambios.cambiar(yo, CLAVE, OTRA))
                .isInstanceOfSatisfying(ErrorDeNegocio.class, e -> assertThat(e.codigo()).isEqualTo("CLAVE_INCORRECTA"));
        noEntraCon(correo, OTRA);
        entrar(correo, RECUPERADA);
    }

    @Test
    @DisplayName("Si cierran la sesión mientras se cambia la clave con ella, la clave no cambia")
    void cambiarConUnaSesionQueCierran() throws Exception {
        String correo = cuentaNueva();
        UsuarioActual yo = yo(correo);
        claves.alComprobar(() -> sesionesDeVerdad.salir(yo));

        assertThatThrownBy(() -> cambios.cambiar(yo, CLAVE, OTRA))
                .isInstanceOfSatisfying(ErrorDeNegocio.class, e -> assertThat(e.codigo()).isEqualTo("NO_AUTENTICADO"));
        noEntraCon(correo, OTRA);
        entrar(correo, CLAVE);
    }

    @Test
    @DisplayName("Con dos transacciones a la vez: entrar espera a que termine la recuperación que tiene trabada la cuenta, y no abre la sesión")
    void entrarEsperaALaRecuperacion() throws Exception {
        String correo = cuentaNueva();
        UUID cuenta = usuarios.porCorreo(correo).orElseThrow().id();
        String recuperada = clavesDeLaApp.hash(RECUPERADA);
        var trabada = new CountDownLatch(1);
        try (ExecutorService otro = Executors.newSingleThreadExecutor()) {
            // Lo mismo que hace ponerClaveNueva, pero sin confirmar hasta que el «entrar» esté esperando la cuenta
            Future<?> recuperacion = otro.submit(() -> new TransactionTemplate(transacciones).executeWithoutResult(estado -> {
                usuarios.trabar(cuenta);
                Instant ahora = reloj.instant();
                usuarios.cambiarClave(cuenta, recuperada, ahora);
                sesiones.cerrarTodas(cuenta, ahora);
                trabada.countDown();
                esperarAQueAlguienEspere();
            }));
            assertThat(trabada.await(10, TimeUnit.SECONDS)).isTrue();

            // Lee la clave vieja (la nueva no está confirmada), la comprueba y se queda esperando la cuenta
            assertThatThrownBy(() -> sesionesDeVerdad.entrar(correo, CLAVE, Navegador.ipNueva(), "Firefox"))
                    .isInstanceOfSatisfying(ErrorDeNegocio.class, e -> assertThat(e.codigo()).isEqualTo("CREDENCIALES_INVALIDAS"));
            recuperacion.get(10, TimeUnit.SECONDS);
        }
        assertThat(abiertas(correo)).isZero();
        entrar(correo, RECUPERADA);
    }

    /** Hasta que otra transacción quede esperando un candado (como mucho 10 s): pg_locks muestra las esperas en el acto. */
    private void esperarAQueAlguienEspere() {
        long hasta = System.nanoTime() + TimeUnit.SECONDS.toNanos(10);
        while (jdbc.sql("select count(*) from pg_locks where not granted").query(Integer.class).single() == 0) {
            if (System.nanoTime() > hasta) {
                throw new AssertionError("Nadie llegó a esperar la cuenta trabada");
            }
            Thread.onSpinWait();
        }
    }

    @Test
    @DisplayName("Sin nadie en el medio, entrar y cambiar la clave funcionan igual que siempre")
    void sinCarreras() throws Exception {
        String correo = cuentaNueva();
        UsuarioActual yo = entradas.entrar(correo, CLAVE, Navegador.ipNueva(), "Firefox").usuario();
        String token = cambios.cambiar(yo, CLAVE, OTRA);

        assertThat(sesionesDeVerdad.reconocer(token)).isPresent();
        entrar(correo, OTRA);
    }
}
