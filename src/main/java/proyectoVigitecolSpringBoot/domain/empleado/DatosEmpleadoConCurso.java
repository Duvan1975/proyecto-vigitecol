package proyectoVigitecolSpringBoot.domain.empleado;

import java.util.List;

public record DatosEmpleadoConCurso(
        Long id,
        String nombres,
        String apellidos,
        String numeroDocumento,
        String telefono,
        String cargo,
        int numeroDeCursos,
        List<DatosCursoDTO> cursosVigentes
) {
    public DatosEmpleadoConCurso(Empleado empleado) {
        this(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getTelefono(),
                empleado.getCargo(),
                empleado.getCursos().size(),
                empleado.getCursos().stream()
                        .map(DatosCursoDTO::new)
                        .toList()
        );
    }
}
