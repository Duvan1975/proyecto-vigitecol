package proyectoVigitecolSpringBoot.domain.empleado;

public record DatosRespuestaEmpleado(
        Long id,
        String nombres,
        String apellidos,
        String numeroDocumento,
        int edad,
        EstadoCivil estadoCivil,
        String telefono,
        String correo,
        String cargo
) {
}
