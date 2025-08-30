package proyectoVigitecolSpringBoot.domain.empleado;

import proyectoVigitecolSpringBoot.domain.afiliacion.Afiliacion;
import proyectoVigitecolSpringBoot.domain.afiliacion.TipoAfiliacion;

import java.time.LocalDate;

public record DatosAfiliacionDTO(
        String tipoAfiliacion,
        String nombreEntidad,
        LocalDate fechaAfiliacion
) {
    public DatosAfiliacionDTO(Afiliacion afiliacion) {
        this(
                afiliacion.getTipoAfiliacion().toString(),
                afiliacion.getNombreEntidad(),
                afiliacion.getFechaAfiliacion()
        );
    }
}
