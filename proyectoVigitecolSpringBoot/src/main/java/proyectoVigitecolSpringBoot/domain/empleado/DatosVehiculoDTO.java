package proyectoVigitecolSpringBoot.domain.empleado;

import proyectoVigitecolSpringBoot.domain.vehiculo.Vehiculo;

import java.time.LocalDate;

public record DatosVehiculoDTO(
        String tipoVehiculo,
        LocalDate tecnomecanico,
        LocalDate soat,
        LocalDate licencia,
        String placa
) {
    public DatosVehiculoDTO(Vehiculo vehiculo) {
        this(
                vehiculo.getTipoVehiculo().toString(),
                vehiculo.getTecnomecanico(),
                vehiculo.getSoat(),
                vehiculo.getLicencia(),
                vehiculo.getPlaca()
        );
    }
}
