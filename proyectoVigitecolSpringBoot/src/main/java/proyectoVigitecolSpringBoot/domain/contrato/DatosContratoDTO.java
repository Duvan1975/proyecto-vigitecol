package proyectoVigitecolSpringBoot.domain.contrato;

import java.time.LocalDate;

public record DatosContratoDTO(
        int numeroContrato,
        LocalDate fechaIngreso,
        boolean alertaPeriodoPrueba
) {
    public DatosContratoDTO(Contrato contrato) {
        this(
                contrato.getNumeroContrato(),
                contrato.getFechaIngreso(),
                contrato.getNumeroContrato() == 1 &&
                        !contrato.getFechaIngreso().isAfter(LocalDate.now().minusDays(45)) &&
                        !contrato.getFechaIngreso().isBefore(LocalDate.now().minusDays(60))
        );
    }
}