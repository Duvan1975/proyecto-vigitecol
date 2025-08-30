package proyectoVigitecolSpringBoot.domain.empleado;

import java.util.List;

public record DatosEmpleadoConExperienciaLaboral(
        Long id,
        String nombres,
        String apellidos,
        String numeroDocumento,
        String telefono,
        String cargo,
        int numeroDeExperiencia,
        List<DatosExperienciaLaboralDTO> experienciaLaboral
) {
    public DatosEmpleadoConExperienciaLaboral(Empleado empleado) {
        this(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getTelefono(),
                empleado.getCargo(),
                empleado.getExperienciaLaboral().size(),
                empleado.getExperienciaLaboral().stream()
                        .map(DatosExperienciaLaboralDTO::new)
                        .toList()
        );
    }
}
