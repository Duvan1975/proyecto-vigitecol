package proyectoVigitecolSpringBoot.domain.familia;

import jakarta.validation.constraints.NotNull;

public record DatosActualizarFamiliar(
        @NotNull
        Long id,
        TipoFamiliar tipoFamiliar,
        String nombreFamiliar,
        int edadFamiliar
) {
}
