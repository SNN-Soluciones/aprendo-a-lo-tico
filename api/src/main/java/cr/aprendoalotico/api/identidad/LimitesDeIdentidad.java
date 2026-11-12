package cr.aprendoalotico.api.identidad;

import cr.aprendoalotico.api.comun.limites.Limite;
import cr.aprendoalotico.api.comun.limites.Limite.Tramo;
import java.time.Clock;
import java.time.Duration;
import org.springframework.stereotype.Component;

/**
 * Los límites de intentos de identidad (DISENO.md, sección 4: «Intentos»). Dos clases:
 *
 * <ul>
 *   <li><b>Fallidos</b>: frenan a quien prueba claves. El más estricto es por IP y correo juntos: quien conoce el
 *       correo de una maestra no la deja sin entrar desde su propia IP. Uno más holgado por correo frena a quien
 *       prueba desde muchas IP.</li>
 *   <li><b>Todos</b>: frenan a quien hace trabajar al servidor con la clave correcta (cada entrada cuesta un Argon2 y
 *       una sesión). Holgados: una escuela entera sale a internet con una sola IP.</li>
 * </ul>
 */
@Component
class LimitesDeIdentidad {

    final Limite fallosPorIpYCorreo;
    final Limite fallosPorCorreo;
    final Limite fallosPorIp;
    final Limite entradasPorCuenta;
    final Limite entradasPorIp;
    final Limite registrosPorIp;
    final Limite recuperacionesPorIp;
    /** Abrir un enlace (confirmar, clave nueva): los tokens no se adivinan, pero cada intento cuesta una consulta. */
    final Limite enlacesPorIp;
    /** Cambiar la clave con sesión: los fallidos (no probar la actual a mano) y todos (cada uno son dos Argon2 y un correo). */
    final Limite fallosDeCambioPorCuenta;
    final Limite cambiosPorCuenta;
    /** Correos a una misma dirección, por tipo: los que pasan no se mandan, en silencio. */
    final Limite correosDeRegistro;
    final Limite correosDeRecuperacion;

    LimitesDeIdentidad(Clock reloj) {
        fallosPorIpYCorreo = Limite.de(reloj, new Tramo(5, Duration.ofMinutes(1)), new Tramo(10, Duration.ofHours(1)));
        fallosPorCorreo = Limite.de(reloj, new Tramo(50, Duration.ofHours(1)));
        fallosPorIp = Limite.de(reloj, new Tramo(30, Duration.ofMinutes(1)), new Tramo(200, Duration.ofHours(1)));
        entradasPorCuenta = Limite.de(reloj, new Tramo(30, Duration.ofHours(1)));
        entradasPorIp = Limite.de(reloj, new Tramo(600, Duration.ofHours(1)));
        registrosPorIp = Limite.de(reloj, new Tramo(60, Duration.ofHours(1)));
        recuperacionesPorIp = Limite.de(reloj, new Tramo(20, Duration.ofHours(1)));
        enlacesPorIp = Limite.de(reloj, new Tramo(60, Duration.ofHours(1)));
        fallosDeCambioPorCuenta = Limite.de(reloj, new Tramo(5, Duration.ofMinutes(15)));
        cambiosPorCuenta = Limite.de(reloj, new Tramo(5, Duration.ofHours(1)));
        correosDeRegistro = Limite.de(reloj, new Tramo(3, Duration.ofHours(1)));
        correosDeRecuperacion = Limite.de(reloj, new Tramo(3, Duration.ofHours(1)));
    }

    /** La clave del límite por IP y correo juntos. */
    static String ipYCorreo(String ip, String correo) {
        return ip + "|" + correo;
    }
}
