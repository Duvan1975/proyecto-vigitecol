package proyectoVigitecolSpringBoot.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class PasswordResetRequestDTO {
    @NotBlank(message = "El campo admin no puede estar vacío")
    @Email(message = "Debe ser un correo válido")
    private String admin;

    // Getter y Setter
    public String getAdmin() {
        return admin;
    }

    public void setAdmin(String admin) {
        this.admin = admin;
    }
}
