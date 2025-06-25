package proyectoVigitecolSpringBoot.empleado;

public record DatosListadoEmpleado(
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
    public DatosListadoEmpleado(Empleado empleado) {
        this(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getEdad(),
                empleado.getEstadoCivil(),
                empleado.getTelefono(),
                empleado.getCorreo(),
                empleado.getCargo()
        );
    }
}
