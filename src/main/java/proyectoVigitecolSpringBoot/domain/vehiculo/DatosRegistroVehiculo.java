package proyectoVigitecolSpringBoot.domain.vehiculo;

import java.time.LocalDate;

public record DatosRegistroVehiculo(
        TipoVehiculo tipoVehiculo,
        LocalDate tecnomecanico,
        LocalDate soat,
        LocalDate licencia,
        String placa
) {
}
