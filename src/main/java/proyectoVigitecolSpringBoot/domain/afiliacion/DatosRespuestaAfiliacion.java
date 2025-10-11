package proyectoVigitecolSpringBoot.domain.afiliacion;

import java.time.LocalDate;

public record DatosRespuestaAfiliacion(
        Long afiliacionId,
        TipoAfiliacion tipoAfiliacion,
        String nombreEntidad,
        LocalDate fechaAfiliacion
) {
}
