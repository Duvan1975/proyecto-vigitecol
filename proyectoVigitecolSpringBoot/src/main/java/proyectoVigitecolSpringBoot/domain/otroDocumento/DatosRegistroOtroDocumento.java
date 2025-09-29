package proyectoVigitecolSpringBoot.domain.otroDocumento;

import java.time.LocalDate;

public record DatosRegistroOtroDocumento(
        tipoOtroDocumento tipoOtroDocumento,
        String descripcionDocumento,
        LocalDate fechaRegistro
) {
}
