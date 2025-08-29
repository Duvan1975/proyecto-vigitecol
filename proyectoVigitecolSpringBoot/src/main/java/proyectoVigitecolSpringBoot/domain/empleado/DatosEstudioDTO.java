package proyectoVigitecolSpringBoot.domain.empleado;

import jakarta.validation.constraints.NotNull;
import proyectoVigitecolSpringBoot.domain.estudio.Estudio;

import java.time.LocalDate;

public record DatosEstudioDTO(
        String tipoEstudio,
        String nombreEstudio,
        LocalDate fechaEstudio
) {
    public DatosEstudioDTO(Estudio estudio) {
        this(
                estudio.getTipoEstudio().toString(),
                estudio.getNombreEstudio(),
                estudio.getFechaEstudio()
        );
    }
}
