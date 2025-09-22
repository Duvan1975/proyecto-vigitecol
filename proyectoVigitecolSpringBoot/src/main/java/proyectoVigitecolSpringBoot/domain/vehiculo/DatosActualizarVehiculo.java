package proyectoVigitecolSpringBoot.domain.vehiculo;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DatosActualizarVehiculo(
        @NotNull
        Long id,
        TipoVehiculo tipoVehiculo,
        LocalDate tecnomecanico,
        LocalDate soat,
        LocalDate licencia,
        String placa
) {
}
