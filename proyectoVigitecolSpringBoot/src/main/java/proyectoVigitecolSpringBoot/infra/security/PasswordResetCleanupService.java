package proyectoVigitecolSpringBoot.infra.security;

import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PasswordResetCleanupService {

    private final PasswordResetTokenRepository tokenRepository;

    public PasswordResetCleanupService(PasswordResetTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // Ejecuta cada hora (3600000 ms)
    @Transactional
    @Scheduled(fixedRate = 3600000)
    public void limpiarTokensExpirados() {
        LocalDateTime ahora = LocalDateTime.now();
        tokenRepository.deleteByExpiryDateBefore(ahora);
        System.out.println("Tokens expirados eliminados a las: " + ahora);
    }
}
