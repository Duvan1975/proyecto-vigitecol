package proyectoVigitecolSpringBoot.domain.empleado;

import java.util.List;

public record DatosEmpleadoConFamiliaresMenoresDe12(
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
    public DatosEmpleadoConFamiliaresMenoresDe12(Empleado empleado, int edadMax) {
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
                (int) empleado.getFamiliares().stream()
                        .filter(f -> f.getEdadFamiliar() <= edadMax)
                        .count(),
                empleado.getFamiliares().stream()
                        .filter(f -> f.getEdadFamiliar() <= edadMax)
                        .map(DatosFamiliarDTO::new)
                        .toList()
        );
    }
    public DatosEmpleadoConFamiliaresMenoresDe12(Empleado empleado) {
        this(empleado, 12);
    }
}
