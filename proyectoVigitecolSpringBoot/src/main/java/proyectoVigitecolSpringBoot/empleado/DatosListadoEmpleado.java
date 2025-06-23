package proyectoVigitecolSpringBoot.empleado;

public record DatosListadoEmpleado(
        String nombres,
        String apellidos,
        String numeroDocumento,
        int edad,
        EstadoCivil estadoCivil,
        Genero genero,
        String cargo
) {
    public DatosListadoEmpleado(Empleado empleado) {
        this(
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getEdad(),
                empleado.getEstadoCivil(),
                empleado.getGenero(),
                empleado.getCargo()
        );
    }
}
