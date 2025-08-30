package proyectoVigitecolSpringBoot.domain.empleado;

import java.util.List;

public record DatosEmpleadoConAfiliaciones(
        Long id,
        String nombres,
        String apellidos,
        String numeroDocumento,
        String telefono,
        String cargo,
        int numeroDeAfiliaciones,
        List<DatosAfiliacionDTO> afiliaciones
) {
    public DatosEmpleadoConAfiliaciones(Empleado empleado) {
        this(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getTelefono(),
                empleado.getCargo(),
                empleado.getAfiliaciones().size(),
                empleado.getAfiliaciones().stream()
                        .map(DatosAfiliacionDTO::new)
                        .toList()
        );
    }
}
