package proyectoVigitecolSpringBoot.domain.empleado;

import java.util.List;

public record DatosEmpleadoConEstudios(
        Long id,
        String nombres,
        String apellidos,
        String numeroDocumento,
        String telefono,
        String cargo,
        int numeroDeEstudios,
        List<DatosEstudioDTO> estudios
) {
    public DatosEmpleadoConEstudios(Empleado empleado) {
        this(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getTelefono(),
                empleado.getCargo(),
                empleado.getEstudios().size(),
                empleado.getEstudios().stream()
                        .map(DatosEstudioDTO::new)
                        .toList()
        );
    }
}
