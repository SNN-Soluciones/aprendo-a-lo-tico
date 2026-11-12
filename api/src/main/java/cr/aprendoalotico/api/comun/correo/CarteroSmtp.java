package cr.aprendoalotico.api.comun.correo;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import org.springframework.mail.MailPreparationException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

/** Manda por SMTP (Resend en producción, Mailpit en la compu), en UTF-8 y en texto plano. */
class CarteroSmtp implements Cartero {

    private final JavaMailSender smtp;
    private final String remitente;

    CarteroSmtp(JavaMailSender smtp, PropiedadesCorreo propiedades) {
        this.smtp = smtp;
        this.remitente = propiedades.remitente();
    }

    @Override
    public void enviar(Mensaje mensaje) {
        MimeMessage correo = smtp.createMimeMessage();
        try {
            var armado = new MimeMessageHelper(correo, false, StandardCharsets.UTF_8.name());
            armado.setFrom(remitente);
            armado.setTo(mensaje.para());
            armado.setSubject(mensaje.asunto());
            armado.setText(mensaje.texto(), false);
        } catch (MessagingException e) {
            throw new MailPreparationException("No se pudo armar el correo «" + mensaje.asunto() + "»", e);
        }
        smtp.send(correo);
    }
}
