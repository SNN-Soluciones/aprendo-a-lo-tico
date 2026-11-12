package cr.aprendoalotico.api.identidad;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class LimpiezaDeIdentidadIT extends PruebaDeIdentidad {

    @Autowired
    LimpiezaDeIdentidad limpieza;

    private void envejecer(String tabla, String columna, String intervalo, String dondeCorreo, String correo) {
        jdbc.sql("update public." + tabla + " t set " + columna + " = now() - interval '" + intervalo + "' from public.usuarios u "
                + "where u.id = t.usuario_id and u.correo = ? " + dondeCorreo).param(1, correo).update();
    }

    @Test
    @DisplayName("Borra lo que ya no sirve (sesiones cerradas o abandonadas hace más de 30 días, enlaces vencidos) y deja lo vigente")
    void borraSoloLoViejo() throws Exception {
        // Arrange
        String correo = cuentaNueva();
        Cookie vigente = entrar(correo, CLAVE);
        entrar(correo, CLAVE);
        entrar(correo, CLAVE);
        jdbc.sql("""
                update public.sesiones set cerrada_en = now() - interval '31 days'
                where id = (select s.id from public.sesiones s join public.usuarios u on u.id = s.usuario_id
                            where u.correo = ? and s.token_hash <> sha256(convert_to(?, 'UTF8')) order by s.creada_en limit 1)""")
                .param(1, correo).param(2, vigente.getValue()).update();
        jdbc.sql("""
                update public.sesiones set vista_en = now() - interval '40 days'
                where id = (select s.id from public.sesiones s join public.usuarios u on u.id = s.usuario_id
                            where u.correo = ? and s.cerrada_en is null and s.token_hash <> sha256(convert_to(?, 'UTF8')) limit 1)""")
                .param(1, correo).param(2, vigente.getValue()).update();
        String pendiente = Navegador.correoNuevo();
        pedirCuenta(pendiente, Navegador.ipNueva());
        jdbc.sql("update public.registros_pendientes set expira_en = now() - interval '2 days' where correo = ?").param(1, pendiente).update();
        mvc.perform(Navegador.desde(Navegador.ipNueva(), org.springframework.http.HttpMethod.POST, "/api/v1/clave/recuperar",
                java.util.Map.of("correo", correo)));
        envejecer("recuperaciones", "expira_en", "2 days", "", correo);
        // Act
        limpieza.limpiar();
        // Assert
        assertThat(filas("select count(*) from public.sesiones s join public.usuarios u on u.id = s.usuario_id where u.correo = ?", correo))
                .isOne();
        assertThat(filas("select count(*) from public.sesiones where token_hash = sha256(convert_to(?, 'UTF8'))", vigente.getValue())).isOne();
        assertThat(filas("select count(*) from public.registros_pendientes where correo = ?", pendiente)).isZero();
        assertThat(filas("select count(*) from public.recuperaciones r join public.usuarios u on u.id = r.usuario_id where u.correo = ?", correo))
                .isZero();
    }
}
