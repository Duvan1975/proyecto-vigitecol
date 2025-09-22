package proyectoVigitecolSpringBoot.infra.security;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.usuarios.Usuario;
import proyectoVigitecolSpringBoot.domain.usuarios.UsuarioRepository;
import proyectoVigitecolSpringBoot.infra.email.MailService;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final PasswordResetTokenRepository tokenRepository;

    public PasswordResetService(UsuarioRepository usuarioRepository,
                                PasswordEncoder passwordEncoder,
                                MailService mailService,
                                PasswordResetTokenRepository tokenRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
        this.tokenRepository = tokenRepository;
    }

    public String generarToken(String admin) {
        Usuario usuario = (Usuario) usuarioRepository.findByAdmin(admin);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken resetToken = new PasswordResetToken(token, usuario.getAdmin(), expiry);
        tokenRepository.save(resetToken);

        try {
            mailService.sendPasswordResetEmail(usuario.getAdmin(), token);
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo de recuperación: " + e.getMessage(), e);
        }

        return token;
    }

    public void resetPassword(String token, String nuevaClave) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido o no encontrado"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Token expirado");
        }

        Usuario usuario = (Usuario) usuarioRepository.findByAdmin(resetToken.getAdmin());
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        usuario.setClave(passwordEncoder.encode(nuevaClave));
        usuarioRepository.save(usuario);

        tokenRepository.delete(resetToken); // borrar token usado
    }
    public boolean validarToken(String token) {
        return tokenRepository.findByToken(token)
                .filter(t -> t.getExpiryDate().isAfter(LocalDateTime.now()))
                .isPresent();
    }

}