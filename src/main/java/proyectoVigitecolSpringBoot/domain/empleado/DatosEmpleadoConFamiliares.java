package proyectoVigitecolSpringBoot.domain.empleado;

import java.util.List;

public record DatosEmpleadoConFamiliares(
        Long id,
        String nombres,
        String apellidos,
        String numeroDocumento,
        int edad,
        EstadoCivil estadoCivil,
        Genero genero,
        String telefono,
        String correo,
        String cargo,
        int numeroDeFamiliares,
        List<DatosFamiliarDTO> familiares
) {
    public DatosEmpleadoConFamiliares(Empleado empleado) {
        this(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getEdad(),
                empleado.getEstadoCivil(),
                empleado.getGenero(),
                empleado.getTelefono(),
                empleado.getCorreo(),
                empleado.getCargo(),
                empleado.getFamiliares().size(), //Cuenta número de hijos/hijastros
                empleado.getFamiliares().stream()
                        .map(DatosFamiliarDTO::new)
                        .toList()
        );
    }
}
