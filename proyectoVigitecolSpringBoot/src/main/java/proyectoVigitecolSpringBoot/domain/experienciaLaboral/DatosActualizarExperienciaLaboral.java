package proyectoVigitecolSpringBoot.domain.experienciaLaboral;

import jakarta.validation.constraints.NotNull;

public record DatosActualizarExperienciaLaboral(
        @NotNull
        Long id,
        String descripcionExperiencia
) {
}
