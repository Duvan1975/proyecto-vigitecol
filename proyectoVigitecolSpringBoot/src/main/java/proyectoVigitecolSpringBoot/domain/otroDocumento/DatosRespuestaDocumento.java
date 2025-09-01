package proyectoVigitecolSpringBoot.domain.otroDocumento;

import java.time.LocalDate;

public record DatosRespuestaDocumento(
        Long documentoId,
        TipoDocumento tipoDocumento,
        String descripcionDocumento,
        LocalDate fechaRegistro
) {
}
