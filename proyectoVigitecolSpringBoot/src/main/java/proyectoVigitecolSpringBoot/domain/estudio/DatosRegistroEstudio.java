package proyectoVigitecolSpringBoot.domain.estudio;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DatosRegistroEstudio(
        TipoEstudio tipoEstudio,
        String nombreEstudio,
        LocalDate fechaEstudio
) {
}
