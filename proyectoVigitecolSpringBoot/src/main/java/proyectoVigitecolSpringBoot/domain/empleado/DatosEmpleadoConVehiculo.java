package proyectoVigitecolSpringBoot.domain.empleado;

import java.util.List;

public record DatosEmpleadoConVehiculo(
        Long id,
        String nombres,
        String apellidos,
        String numeroDocumento,
        String telefono,
        String cargo,
        int numeroDeVehiculos,
        List<DatosVehiculoDTO> vehiculos
) {
    public DatosEmpleadoConVehiculo(Empleado empleado) {
        this(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getTelefono(),
                empleado.getCargo(),
                empleado.getVehiculos().size(),
                empleado.getVehiculos().stream()
                        .map(DatosVehiculoDTO::new)
                        .toList()
        );
    }
}
