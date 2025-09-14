package proyectoVigitecolSpringBoot.domain.contrato;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public record DatosContratoDTO(
        int numeroContrato,
        LocalDate fechaIngreso,
        boolean alertaPeriodoPrueba,
        long diasRestantesPeriodoPrueba
) {
    public DatosContratoDTO(Contrato contrato) {
        this(
                contrato.getNumeroContrato(),
                contrato.getFechaIngreso(),
                contrato.getNumeroContrato() == 1 &&
                        !contrato.getFechaIngreso().isAfter(LocalDate.now().minusDays(45)) &&
                        !contrato.getFechaIngreso().isBefore(LocalDate.now().minusDays(59)),
                calcularDiasRestantes(contrato.getFechaIngreso())
        );
    }

    private static long calcularDiasRestantes(LocalDate fechaIngreso) {
        long diasTranscurridos = ChronoUnit.DAYS.between(fechaIngreso, LocalDate.now());
        long diasRestantes = 59 - diasTranscurridos;
        return Math.max(diasRestantes, 0); // nunca devolver negativo
    }
}
