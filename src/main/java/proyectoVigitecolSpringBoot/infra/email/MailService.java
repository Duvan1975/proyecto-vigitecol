package proyectoVigitecolSpringBoot.infra.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${app.mail.from:no-reply@vigitecol.com}")
    private String from;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String to, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        log.info("Preparando correo de recuperación -> to: {}, resetLink: {}", to, resetLink);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");

            String html = "<p>Hola,</p>"
                    + "<p>Recibimos una solicitud para restablecer tu contraseña.</p>"
                    + "<p><a href=\"" + resetLink + "\" "
                    + "style=\"display:inline-block;padding:10px 15px;background:#007bff;"
                    + "color:white;text-decoration:none;border-radius:5px;\">"
                    + "Haz click aquí para restablecer tu contraseña</a></p>"
                    + "<p>Este enlace expirará en 15 minutos.</p>"
                    + "<p>Si no solicitaste esto, puedes ignorar este mensaje.</p>";

            helper.setText(html, true);
            helper.setTo(to);
            helper.setSubject("Recuperación de contraseña - Vigitecol");
            helper.setFrom(from);

            mailSender.send(message);
            log.info("Correo enviado correctamente a {}", to);

        } catch (Exception e) {
            log.error("Error al enviar correo a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar correo: " + e.getMessage(), e);
        }
    }
}
