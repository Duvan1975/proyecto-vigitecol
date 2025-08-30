package proyectoVigitecolSpringBoot.domain.empleado;

import proyectoVigitecolSpringBoot.domain.experienciaLaboral.ExperienciaLaboral;

public record DatosExperienciaLaboralDTO(
        String descripcionExperiencia
) {
    public DatosExperienciaLaboralDTO(ExperienciaLaboral experienciaLaboral) {
        this(
                experienciaLaboral.getDescripcionExperiencia()
        );
    }
}
