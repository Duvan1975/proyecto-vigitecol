package proyectoVigitecolSpringBoot.domain.contrato;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DatosActualizarContrato(
        @NotNull
        Long id,
        int numeroContrato,
        LocalDate fechaIngreso,
        LocalDate fechaRetiro,
        LocalDate fechaRenuncia,
        LocalDate fechaOtroSi,
        String omiso,
        boolean continua,
        LocalDate vacacionesDesde,
        LocalDate vacacionesHasta
) {
}
