package proyectoVigitecolSpringBoot.domain.password;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordDTO(
        @NotBlank String token,
        @NotBlank String nuevaClave
) {
}
