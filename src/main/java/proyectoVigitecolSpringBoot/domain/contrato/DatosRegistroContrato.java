package proyectoVigitecolSpringBoot.domain.contrato;

import java.time.LocalDate;

public record DatosRegistroContrato(
        int numeroContrato,
        LocalDate fechaIngreso,
        LocalDate fechaRetiro,
        LocalDate fechaRenuncia,
        LocalDate fechaOtroSi,
        String omiso,
        boolean continua,
        LocalDate vacacionesDesde,
        LocalDate vacacionesHasta,
        Long empleadoId
) {
}
