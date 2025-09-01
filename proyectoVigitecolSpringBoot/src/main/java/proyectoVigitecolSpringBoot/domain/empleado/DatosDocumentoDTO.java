package proyectoVigitecolSpringBoot.domain.empleado;

import proyectoVigitecolSpringBoot.domain.otroDocumento.OtroDocumento;

import java.time.LocalDate;

public record DatosDocumentoDTO(
        String tipoDocumento,
        String descripcionDocumento,
        LocalDate fechaRegistro
) {
    public DatosDocumentoDTO(OtroDocumento otroDocumento) {
        this(
                otroDocumento.getTipoDocumento().toString(),
                otroDocumento.getDescripcionDocumento(),
                otroDocumento.getFechaRegistro()
        );
    }
}
