package proyectoVigitecolSpringBoot.domain.empleado;

import proyectoVigitecolSpringBoot.domain.contrato.DatosContratoDTO;

import java.util.List;

public record DatosEmpleadoConPeriodoDePrueba(
        Long id,
        String nombres,
        String apellidos,
        String numeroDocumento,
        String telefono,
        String cargo,
        List<DatosContratoDTO> contratoPeriodoDePrueba
) {
    public DatosEmpleadoConPeriodoDePrueba(Empleado empleado) {
        this(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getTelefono(),
                empleado.getCargo(),
                empleado.getContratos().stream()
                        .map(DatosContratoDTO::new)
                        .toList()
        );
    }
}
