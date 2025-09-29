package proyectoVigitecolSpringBoot.domain.otroDocumento;

import java.time.LocalDate;

public record DatosRespuestaDocumento(
        Long documentoId,
        tipoOtroDocumento tipoOtroDocumento,
        String descripcionDocumento,
        LocalDate fechaRegistro
) {
}
