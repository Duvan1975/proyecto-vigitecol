package proyectoVigitecolSpringBoot.domain.otroDocumento;

import java.time.LocalDate;

public record DatosRegistroOtroDocumento(
        TipoOtroDocumento tipoOtroDocumento,
        String descripcionDocumento,
        LocalDate fechaRegistro
) {
}
