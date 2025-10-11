package proyectoVigitecolSpringBoot.domain.vehiculo;

import java.time.LocalDate;

public record DatosListadoVehiculo(
        Long vehiculoId,
        TipoVehiculo tipoVehiculo,
        LocalDate tecnomecanico,
        LocalDate soat,
        LocalDate licencia,
        String placa,
        String nombreEmpleado,
        String apellidoEmpleado,
        String documentoEmpleado
) {
    public DatosListadoVehiculo(Vehiculo vehiculo) {
        this(
                vehiculo.getVehiculoId(),
                vehiculo.getTipoVehiculo(),
                vehiculo.getTecnomecanico(),
                vehiculo.getSoat(),
                vehiculo.getLicencia(),
                vehiculo.getPlaca(),
                vehiculo.getEmpleado().getNombres(),
                vehiculo.getEmpleado().getApellidos(),
                vehiculo.getEmpleado().getNumeroDocumento()
        );
    }
}
