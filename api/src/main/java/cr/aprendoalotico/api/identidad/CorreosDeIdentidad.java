package cr.aprendoalotico.api.identidad;

import cr.aprendoalotico.api.comun.PropiedadesApp;
import cr.aprendoalotico.api.comun.correo.Mensaje;
import org.springframework.stereotype.Component;

/**
 * Los textos de los correos de identidad (DISENO.md, B7): en texto plano y sin nada que haya escrito otra persona
 * (ni el nombre: quien se registra con el correo de otro no puede mandarle su propio texto desde nuestro dominio).
 * Los enlaces llevan el token después de «#»: el navegador no lo manda a ningún servidor.
 */
@Component
class CorreosDeIdentidad {

    private static final String FIRMA = "\n\n— Aprendo a lo Tico\n";

    private final String sitio;

    CorreosDeIdentidad(PropiedadesApp app) {
        this.sitio = app.sitioUrl();
    }

    Mensaje confirmar(String para, String token) {
        return new Mensaje(para, "Creá tu cuenta en Aprendo a lo Tico", """
                ¡Hola!

                Para crear tu cuenta en Aprendo a lo Tico, abrí este enlace y escribí tu nombre y una clave:

                %s

                El enlace vale por 24 horas. Si no pediste una cuenta, ignorá este correo: sin abrir el enlace no se crea \
                ninguna.""".formatted(sitio + "/portal/confirmar#t=" + token) + FIRMA);
    }

    Mensaje yaTenesCuenta(String para) {
        return new Mensaje(para, "Ya tenés una cuenta en Aprendo a lo Tico", """
                ¡Hola!

                Alguien (quizás vos) pidió una cuenta en Aprendo a lo Tico con este correo, pero ya tenés una.

                Si fuiste vos, entrá con tu clave en %s
                Si no te acordás de la clave, pedí una nueva en %s

                Si no fuiste vos, ignorá este correo: tu cuenta sigue igual.""".formatted(sitio + "/portal/entrar", recuperar()) + FIRMA);
    }

    Mensaje recuperar(String para, String token) {
        return new Mensaje(para, "Tu clave nueva de Aprendo a lo Tico", """
                ¡Hola!

                Para poner una clave nueva, abrí este enlace:

                %s

                El enlace vale por 30 minutos y sirve una sola vez. Si no lo pediste vos, ignorá este correo: tu clave \
                sigue igual.""".formatted(sitio + "/portal/clave-nueva#t=" + token) + FIRMA);
    }

    Mensaje claveCambiada(String para) {
        return new Mensaje(para, "Cambió la clave de tu cuenta en Aprendo a lo Tico", """
                ¡Hola!

                La clave de tu cuenta en Aprendo a lo Tico acaba de cambiar, y cerramos las sesiones que estaban \
                abiertas en otros aparatos.

                Si fuiste vos, no tenés que hacer nada. Si no, pedí una clave nueva ya mismo en %s \
                y escribinos (los datos están en %s).""".formatted(recuperar(), sitio + "/acerca.html") + FIRMA);
    }

    private String recuperar() {
        return sitio + "/portal/recuperar";
    }
}
