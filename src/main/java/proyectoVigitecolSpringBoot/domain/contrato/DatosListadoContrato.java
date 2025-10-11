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
        boolean continua,
        LocalDate vacacionesDesde,
        LocalDate vacacionesHasta,
        String nombreEmpleado,
        String apellidoEmpleado,
        String documentoEmpleado
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
                contrato.getContinua(),
                contrato.getVacacionesDesde(),
                contrato.getVacacionesHasta(),
                contrato.getEmpleado().getNombres(),
                contrato.getEmpleado().getApellidos(),
                contrato.getEmpleado().getNumeroDocumento()
        );
    }
}
