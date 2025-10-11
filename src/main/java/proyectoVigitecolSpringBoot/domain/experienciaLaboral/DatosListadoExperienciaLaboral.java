package proyectoVigitecolSpringBoot.domain.experienciaLaboral;

public record DatosListadoExperienciaLaboral(
        Long experienciaLaboralId,
        String descripcionExperiencia,
        String nombreEmpleado,
        String apellidoEmpleado,
        String documentoEmpleado
) {
    public DatosListadoExperienciaLaboral(ExperienciaLaboral experienciaLaboral) {
        this(
                experienciaLaboral.getExperienciaLaboralId(),
                experienciaLaboral.getDescripcionExperiencia(),
                experienciaLaboral.getEmpleado().getNombres(),
                experienciaLaboral.getEmpleado().getApellidos(),
                experienciaLaboral.getEmpleado().getNumeroDocumento()
                );
    }
}
