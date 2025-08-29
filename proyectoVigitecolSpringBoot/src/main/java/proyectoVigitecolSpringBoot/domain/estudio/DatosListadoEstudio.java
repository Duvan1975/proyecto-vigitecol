package proyectoVigitecolSpringBoot.domain.estudio;

import java.time.LocalDate;

public record DatosListadoEstudio(
        Long estudioId,
        TipoEstudio tipoEstudio,
        String nombreEstudio,
        LocalDate fechaEstudio,
        String nombreEmpleado,
        String apellidoEmpleado,
        String documentoEmpleado
) {
    public DatosListadoEstudio(Estudio estudio) {
        this(
                estudio.getEstudioId(),
                estudio.getTipoEstudio(),
                estudio.getNombreEstudio(),
                estudio.getFechaEstudio(),
                estudio.getEmpleado().getNombres(),
                estudio.getEmpleado().getApellidos(),
                estudio.getEmpleado().getNumeroDocumento()
        );
    }
}
