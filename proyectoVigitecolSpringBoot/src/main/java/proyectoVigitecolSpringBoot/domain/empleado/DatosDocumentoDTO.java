package proyectoVigitecolSpringBoot.domain.empleado;

import proyectoVigitecolSpringBoot.domain.otroDocumento.OtroDocumento;

import java.time.LocalDate;

public record DatosDocumentoDTO(
        String tipoOtroDocumento,
        String descripcionDocumento,
        LocalDate fechaRegistro
) {
    public DatosDocumentoDTO(OtroDocumento otroDocumento) {
        this(
                otroDocumento.getTipoOtroDocumento().toString(),
                otroDocumento.getDescripcionDocumento(),
                otroDocumento.getFechaRegistro()
        );
    }
}
