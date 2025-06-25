package proyectoVigitecolSpringBoot.domain.contrato;

import java.time.LocalDate;

public record DatosListadoContrato(
        Long contratoId,
        int numeroContrato,
        LocalDate fechaIngreso,
        LocalDate fechaRetiro,
        LocalDate fechaRenuncia,
        LocalDate fechaOtroSi,
        String omiso,
        LocalDate vacacionesDesde,
        LocalDate vacacionesHasta
) {
    public DatosListadoContrato(Contrato contrato) {
        this(
                contrato.getContratoId(),
                contrato.getNumeroContrato(),
                contrato.getFechaIngreso(),
                contrato.getFechaRetiro(),
                contrato.getFechaRenuncia(),
                contrato.getFechaOtroSi(),
                contrato.getOmiso(),
                contrato.getVacacionesDesde(),
                contrato.getVacacionesHasta()
        );
    }
}
