package proyectoVigitecolSpringBoot.domain.vehiculo;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.empleado.EmpleadoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class VehiculoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private VehiculoRepository vehiculoRepository;

    public void registrarVehiculo(Long empleadoId, List<DatosRegistroVehiculo> listaDatos) {
        var empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado NO encontrado"));
        List<Vehiculo> vehiculos = listaDatos.stream()
                .map(datos -> new Vehiculo(datos, empleado))
                .toList();
        vehiculoRepository.saveAll(vehiculos);
    }

    public Page<Vehiculo> listarVehiculos(Pageable paginacion) {
        return vehiculoRepository.findAll(paginacion);
    }

    public List<DatosListadoVehiculo> obtenerVehiculosPorEmpleadoActivo(Long empleadoId) {
        var vehiculos = vehiculoRepository.findVehiculoByEmpleadoActivo(empleadoId);

        if (vehiculos.isEmpty()) {
            throw new RuntimeException("Empleado no encontrado, sin contrato activo o sin vehículos registrados");
        }
        return vehiculos.stream()
                .map(DatosListadoVehiculo::new)
                .toList();
    }

    @Transactional
    public DatosRespuestaVehiculo actualizarVehiculo(DatosActualizarVehiculo datos) {
        Optional<Vehiculo> optionalVehiculo = vehiculoRepository.findById(datos.id());

        if (optionalVehiculo.isEmpty()) {
            throw new EntityNotFoundException("Vehículo no encontrado con ID: " + datos.id());
        }
        Vehiculo vehiculo = optionalVehiculo.get();
        vehiculo.actualizarDatos(datos);

        return new DatosRespuestaVehiculo(
                vehiculo.getVehiculoId(),
                vehiculo.getTipoVehiculo(),
                vehiculo.getTecnomecanico(),
                vehiculo.getSoat(),
                vehiculo.getLicencia(),
                vehiculo.getPlaca()
        );
    }

    public void eliminarVehiculo(Long id) {
        if (!vehiculoRepository.existsById(id)) {
            throw new EntityNotFoundException("Vehículo no encontrado con ID: " + id);
        }
        vehiculoRepository.deleteById(id); // Devuelve 204 No Content
    }
}
