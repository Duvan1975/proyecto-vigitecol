package proyectoVigitecolSpringBoot.domain.empleado;

public record DatosEmpleadoConFamiliares(
        Long id,
        String nombres,
        String apellidos,
        String numeroDocumento,
        int edad,
        EstadoCivil estadoCivil,
        String telefono,
        String correo,
        String cargo,
        int numeroDeFamiliares
) {
    public DatosEmpleadoConFamiliares(Empleado empleado) {
        this(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getEdad(),
                empleado.getEstadoCivil(),
                empleado.getTelefono(),
                empleado.getCorreo(),
                empleado.getCargo(),
                empleado.getFamiliares().size() //Cuenta número de hijos/hijastros
        );
    }
}
