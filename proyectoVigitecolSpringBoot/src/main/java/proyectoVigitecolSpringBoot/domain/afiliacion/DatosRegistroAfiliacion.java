package proyectoVigitecolSpringBoot.domain.afiliacion;

import java.time.LocalDate;

public record DatosRegistroAfiliacion(
        TipoAfiliacion tipoAfiliacion,
        String nombreEntidad,
        LocalDate fechaAfiliacion
) {
}
