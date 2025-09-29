package proyectoVigitecolSpringBoot.domain.otroDocumento;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DatosActualizarDocumento(
        @NotNull
        Long id,
        tipoOtroDocumento tipoOtroDocumento,
        String descripcionDocumento,
        LocalDate fechaRegistro
) {
}
