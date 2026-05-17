package proyectoVigitecolSpringBoot.domain.contrato;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public record DatosContratoPorVencerDTO(

        int numeroContrato,
        LocalDate fechaIngreso,
        LocalDate fechaRetiro,
        long diasRestantes
) {
    public DatosContratoPorVencerDTO(Contrato contrato) {
        this(
                contrato.getNumeroContrato(),
                contrato.getFechaIngreso(),
                contrato.getFechaRetiro(),
                calcularDiasRestantes(contrato.getFechaRetiro())
        );
    }
    private static long calcularDiasRestantes(LocalDate fechaRetiro) {

        if (fechaRetiro == null) {
            return 0;
        }

        return ChronoUnit.DAYS.between(
                LocalDate.now(),
                fechaRetiro
        );
    }
}
