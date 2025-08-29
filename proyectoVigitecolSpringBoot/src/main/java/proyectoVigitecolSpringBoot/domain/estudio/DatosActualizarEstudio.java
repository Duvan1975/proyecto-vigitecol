package proyectoVigitecolSpringBoot.domain.estudio;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DatosActualizarEstudio(
        @NotNull
        Long id,
        TipoEstudio tipoEstudio,
        String nombreEstudio,
        LocalDate fechaEstudio
) {
}
