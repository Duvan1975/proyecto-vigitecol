package proyectoVigitecolSpringBoot.domain.vehiculo;

import java.time.LocalDate;

public record DatosRespuestaVehiculo(
        Long vehiculoId,
        TipoVehiculo tipoVehiculo,
        LocalDate tecnomecanica,
        LocalDate soat,
        LocalDate licencia,
        String placa
) {
}
