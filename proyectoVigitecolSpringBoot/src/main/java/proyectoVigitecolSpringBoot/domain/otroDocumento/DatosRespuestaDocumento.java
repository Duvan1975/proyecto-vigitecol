package proyectoVigitecolSpringBoot.domain.otroDocumento;

import java.time.LocalDate;

public record DatosRespuestaDocumento(
        Long documentoId,
        TipoOtroDocumento tipoOtroDocumento,
        String descripcionDocumento,
        LocalDate fechaRegistro
) {
}
