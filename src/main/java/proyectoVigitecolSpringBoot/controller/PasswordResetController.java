package proyectoVigitecolSpringBoot.controller;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.dto.PasswordResetConfirmDTO;
import proyectoVigitecolSpringBoot.domain.dto.PasswordResetRequestDTO;
import proyectoVigitecolSpringBoot.infra.security.PasswordResetService;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/password-reset")
public class PasswordResetController {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetController.class);
    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/request")
    public ResponseEntity<?> requestReset(@Validated @RequestBody PasswordResetRequestDTO request) {
        try {
            passwordResetService.generarToken(request.getAdmin());
        } catch (Exception e) {
            log.warn("Error en solicitud de recuperación para '{}': {}", request.getAdmin(), e.getMessage());
        }
        return ResponseEntity.ok().body(
                java.util.Map.of("message", "Si el usuario existe, se ha enviado un correo con instrucciones")
        );
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        boolean valido = passwordResetService.validarToken(token);
        if (valido) return ResponseEntity.ok(Map.of("message","Token válido"));
        return ResponseEntity.badRequest().body(Map.of("error","Token inválido o expirado"));
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmReset(@Validated @RequestBody PasswordResetConfirmDTO request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNuevaClave());
            return ResponseEntity.ok().body(java.util.Map.of("message", "Contraseña actualizada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    /*@Component
    public class EnvCheck {

        @Value("${spring.mail.password:NOT_FOUND}")
        private String sendGridKey;

        @PostConstruct
        public void verifyKey() {
            if ("NOT_FOUND".equals(sendGridKey)) {
                System.out.println("⚠️ Variable SENDGRID_API_KEY NO detectada por Spring Boot");
            } else {
                System.out.println("✅ Variable SENDGRID_API_KEY detectada correctamente");
                System.out.println("Inicio de clave: " + sendGridKey.substring(0, 10) + "*********");
            }
        }
    }*/
}
