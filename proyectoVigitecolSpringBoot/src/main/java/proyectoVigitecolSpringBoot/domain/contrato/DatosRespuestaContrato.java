package proyectoVigitecolSpringBoot.domain.contrato;

import java.time.LocalDate;

public record DatosRespuestaContrato(
        Long contratoId,
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
