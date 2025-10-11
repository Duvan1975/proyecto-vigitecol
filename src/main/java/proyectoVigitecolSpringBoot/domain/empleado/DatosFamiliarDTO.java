package proyectoVigitecolSpringBoot.domain.empleado;

import proyectoVigitecolSpringBoot.domain.familia.Familiar;

public record DatosFamiliarDTO(
        String tipoFamiliar,
        String nombreFamiliar,
        int edadFamiliar
) {
    public DatosFamiliarDTO(Familiar familiar) {
        this(
                familiar.getTipoFamiliar().toString(),
                familiar.getNombreFamiliar(),
                familiar.getEdadFamiliar()
        );
    }
}
