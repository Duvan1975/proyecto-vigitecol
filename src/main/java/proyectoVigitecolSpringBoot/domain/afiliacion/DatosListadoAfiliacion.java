package proyectoVigitecolSpringBoot.domain.afiliacion;

import java.time.LocalDate;

public record DatosListadoAfiliacion(
        Long afiliacionId,
        TipoAfiliacion tipoAfiliacion,
        String nombreEntidad,
        LocalDate fechaAfiliacion,
        String nombreEmpleado,
        String apellidoEmpleado,
        String documentoEmpleado
) {
    public DatosListadoAfiliacion(Afiliacion afiliacion) {
        this(
                afiliacion.getAfiliacionId(),
                afiliacion.getTipoAfiliacion(),
                afiliacion.getNombreEntidad(),
                afiliacion.getFechaAfiliacion(),
                afiliacion.getEmpleado().getNombres(),
                afiliacion.getEmpleado().getApellidos(),
                afiliacion.getEmpleado().getNumeroDocumento()
        );
    }
}
