package proyectoVigitecolSpringBoot.domain.otroDocumento;

import java.time.LocalDate;

public record DatosListadoOtroDocumento(
        Long documentoId,
        tipoOtroDocumento tipoOtroDocumento,
        String descripcionDocumento,
        LocalDate fechaRegistro,
        String nombreEmpleado,
        String apellidoEmpleado,
        String documentoEmpleado
) {
    public DatosListadoOtroDocumento(OtroDocumento otroDocumento) {
        this(
                otroDocumento.getDocumentoId(),
                otroDocumento.getTipoOtroDocumento(),
                otroDocumento.getDescripcionDocumento(),
                otroDocumento.getFechaRegistro(),
                otroDocumento.getEmpleado().getNombres(),
                otroDocumento.getEmpleado().getApellidos(),
                otroDocumento.getEmpleado().getNumeroDocumento()
        );
    }
}
