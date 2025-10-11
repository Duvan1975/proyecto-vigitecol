package proyectoVigitecolSpringBoot.domain.password;

import jakarta.validation.constraints.NotBlank;

public record SolicitudTokenDTO(
        @NotBlank
        String admin
) {
}
