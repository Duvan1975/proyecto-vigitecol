package proyectoVigitecolSpringBoot.domain.empleado;

import proyectoVigitecolSpringBoot.domain.contrato.DatosContratoPorVencerDTO;

import java.util.List;

public record DatosEmpleadoContratoPorVencer(

        Long id,
        String nombres,
        String apellidos,
        String numeroDocumento,
        String telefono,
        String cargo,
        List<DatosContratoPorVencerDTO> contratosPorVencer
) {
    public DatosEmpleadoContratoPorVencer(
            Empleado empleado, List<DatosContratoPorVencerDTO> contratosPorVencer) {

        this(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getTelefono(),
                empleado.getCargo(),
                contratosPorVencer
        );
    }
}
