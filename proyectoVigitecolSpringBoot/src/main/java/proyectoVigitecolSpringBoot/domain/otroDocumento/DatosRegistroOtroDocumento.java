package proyectoVigitecolSpringBoot.domain.otroDocumento;

import java.time.LocalDate;

public record DatosRegistroOtroDocumento(
        TipoDocumento tipoDocumento,
        String descripcionDocumento,
        LocalDate fechaRegistro
) {
}
