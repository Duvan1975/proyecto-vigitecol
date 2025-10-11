package proyectoVigitecolSpringBoot.controller;

import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import proyectoVigitecolSpringBoot.infra.email.MailService;

@Profile("prod")
@RestController
public class TestMailController {

    private final MailService mailService;

    public TestMailController(MailService mailService) {
        this.mailService = mailService;
    }

    @GetMapping("/test-mail")
    public ResponseEntity<?> sendTestMail() {
        try {
            mailService.sendPasswordResetEmail(
                    "ballexplorer1975@gmail.com",
                    "TEST-TOKEN-123456"
            );
            return ResponseEntity.ok("Correo de prueba enviado correctamente.");
        } catch (Exception e) {
            // Ahora sí capturamos el error real
            return ResponseEntity.internalServerError()
                    .body("Error al enviar correo: " + e.getMessage());
        }
    }
}
