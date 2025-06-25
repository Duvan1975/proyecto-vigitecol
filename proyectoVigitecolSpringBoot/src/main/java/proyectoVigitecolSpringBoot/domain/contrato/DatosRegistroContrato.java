package proyectoVigitecolSpringBoot.domain.contrato;

import java.time.LocalDate;

public record DatosRegistroContrato(
        int numeroContrato,
        LocalDate fechaIngreso,
        LocalDate fechaRetiro,
        LocalDate fechaRenuncia,
        LocalDate fechaOtroSi,
        String omiso,
        LocalDate vacacionesDesde,
        LocalDate vacacionesHasta,
        Long empleadoId
) {
}
