package proyectoVigitecolSpringBoot.domain.estudio;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DatosRegistroEstudio(
        TipoEstudio tipoEstudio,
        String nombreEstudio,
        @NotNull(message = "La fecha del estudio es obligatoria")
        LocalDate fechaEstudio
) {
}
