package proyectoVigitecolSpringBoot.domain.otroDocumento;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DatosActualizarDocumento(
        @NotNull
        Long id,
        TipoOtroDocumento tipoOtroDocumento,
        String descripcionDocumento,
        LocalDate fechaRegistro
) {
}
