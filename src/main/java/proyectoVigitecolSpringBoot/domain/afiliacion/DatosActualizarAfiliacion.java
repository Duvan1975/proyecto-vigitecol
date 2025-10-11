package proyectoVigitecolSpringBoot.domain.afiliacion;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DatosActualizarAfiliacion(
        @NotNull
        Long id,
        TipoAfiliacion tipoAfiliacion,
        String nombreEntidad,
        LocalDate fechaAfiliacion
) {
}
