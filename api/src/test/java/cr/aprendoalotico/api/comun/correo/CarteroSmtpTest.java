package cr.aprendoalotico.api.comun.correo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

class CarteroSmtpTest {

    private final JavaMailSender smtp = mock(JavaMailSender.class);

    @Test
    @DisplayName("Arma un correo en texto plano UTF-8 con el remitente configurado y lo manda")
    void arma() throws Exception {
        // Arrange
        when(smtp.createMimeMessage()).thenAnswer(i -> new JavaMailSenderImpl().createMimeMessage());
        var cartero = new CarteroSmtp(smtp, new PropiedadesCorreo("Aprendo a lo Tico <no-responder@snnsoluciones.com>"));
        // Act
        cartero.enviar(new Mensaje("maria@escuela.cr", "Confirmá tu correo", "¡Hola! Abrí el enlace."));
        // Assert
        var enviado = ArgumentCaptor.forClass(MimeMessage.class);
        verify(smtp).send(enviado.capture());
        MimeMessage m = enviado.getValue();
        // Los encabezados MIME se escriben al mandar; el SMTP de verdad llama a esto
        m.saveChanges();
        assertThat(m.getFrom()[0].toString()).contains("no-responder@snnsoluciones.com");
        assertThat(m.getAllRecipients()).extracting(Object::toString).containsExactly("maria@escuela.cr");
        assertThat(m.getSubject()).isEqualTo("Confirmá tu correo");
        assertThat(m.getContent()).isEqualTo("¡Hola! Abrí el enlace.");
        assertThat(m.getContentType()).contains("text/plain").containsIgnoringCase("utf-8");
    }

    @Test
    @DisplayName("El remitente es obligatorio y tiene que ser una dirección")
    void remitente() {
        assertThatThrownBy(() -> new PropiedadesCorreo(" ")).hasMessageContaining("CORREO_REMITENTE");
        assertThatThrownBy(() -> new PropiedadesCorreo("no es correo")).hasMessageContaining("no es una dirección");
    }

    @Test
    @DisplayName("Si no se puede armar el correo, avisa con el asunto (nunca con la dirección)")
    void noSePuedeArmar() {
        MimeMessage roto = mock(MimeMessage.class, i -> {
            throw new jakarta.mail.MessagingException("roto");
        });
        when(smtp.createMimeMessage()).thenReturn(roto);
        var cartero = new CarteroSmtp(smtp, new PropiedadesCorreo("no-responder@snnsoluciones.com"));
        assertThatThrownBy(() -> cartero.enviar(new Mensaje("maria@escuela.cr", "Asunto", "Texto")))
                .hasMessageContaining("Asunto").hasMessageNotContaining("maria");
        verify(smtp, org.mockito.Mockito.never()).send(any(MimeMessage.class));
    }
}
