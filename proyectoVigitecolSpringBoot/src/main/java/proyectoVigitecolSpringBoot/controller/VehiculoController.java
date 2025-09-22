package proyectoVigitecolSpringBoot.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.vehiculo.*;

import java.util.List;

@RestController
@RequestMapping("/vehiculos")
@CrossOrigin(origins = "http://localhost:3000")
public class VehiculoController {

    @Autowired
    private VehiculoService vehiculoService;

    @PostMapping("/{empleadoId}")
    public ResponseEntity<?> registrarVehiculo(
            @PathVariable Long empleadoId,
            @RequestBody List<DatosRegistroVehiculo> listaDatos) {
        vehiculoService.registrarVehiculo(empleadoId, listaDatos);
        return ResponseEntity.ok(listaDatos);
    }

    @GetMapping
    public ResponseEntity<Page<DatosListadoVehiculo>> listadoVehiculos(
            @PageableDefault(size = 10) Pageable paginacion) {

        Page<DatosListadoVehiculo> estudios = vehiculoService.listarVehiculos(paginacion)
                .map(DatosListadoVehiculo::new);

        return ResponseEntity.ok(estudios);
    }

    @GetMapping("/por-empleado/{empleadoId}")
    public ResponseEntity<List<DatosListadoVehiculo>> obtenerVehiculosPorEmpleado(
            @PathVariable Long empleadoId) {
        var vehiculos = vehiculoService.obtenerVehiculosPorEmpleadoActivo(empleadoId);
        return ResponseEntity.ok(vehiculos);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DatosRespuestaVehiculo> actualizarVehiculo(
            @RequestBody @Valid DatosActualizarVehiculo datos) {

        DatosRespuestaVehiculo respuesta = vehiculoService.actualizarVehiculo(datos);

        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarVehiculo(@PathVariable Long id) {
        vehiculoService.eliminarVehiculo(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content
    }
}
