package proyectoVigitecolSpringBoot.infra.security;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private String admin;  // correo/usuario asociado

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    // Constructores
    public PasswordResetToken() {}

    public PasswordResetToken(String token, String admin, LocalDateTime expiryDate) {
        this.token = token;
        this.admin = admin;
        this.expiryDate = expiryDate;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public String getAdmin() {
        return admin;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setAdmin(String admin) {
        this.admin = admin;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }
}
