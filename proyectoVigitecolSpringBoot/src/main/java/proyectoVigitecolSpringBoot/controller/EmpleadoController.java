package proyectoVigitecolSpringBoot.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import proyectoVigitecolSpringBoot.domain.empleado.*;

import java.util.List;

@RestController
@RequestMapping("/empleados")
@CrossOrigin(origins = "http://localhost:3000")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @PostMapping
    public ResponseEntity<DatosRespuestaEmpleado> registrarEmpleado(
            @RequestBody @Valid DatosRegistroEmpleado datos,
            UriComponentsBuilder uriComponentsBuilder) {
        return empleadoService.registrarEmpleado(datos, uriComponentsBuilder);
    }
    @GetMapping("/activos")
    public ResponseEntity<Page<DatosListadoEmpleado>> listadoEmpleadosActivos(
            @PageableDefault(size = 10, sort = "empleado.apellidos")Pageable paginacion) {
        return empleadoService.listarEmpleadosActivos(paginacion);
    }
    @GetMapping("/inactivos")
    public ResponseEntity<Page<DatosListadoEmpleado>> listadoEmpleadosInactivos(
            @PageableDefault(size = 10, sort = "empleado.apellidos")Pageable paginacion) {
        return empleadoService.listarEmpleadosInactivos(paginacion);
    }
    @PutMapping
    public ResponseEntity<DatosRespuestaEmpleado> actualizarEmpleado(
            @RequestBody @Valid DatosActualizarEmpleado datos) {
        return empleadoService.actualizarEmpleado(datos);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEmpleado(@PathVariable Long id) {
       return empleadoService.eliminarEmpleado(id);
    }
    @GetMapping("/obteneractivos/{id}")
    public ResponseEntity<DatosActualizarEmpleado> obtenerDatosEmpleado(@PathVariable Long id) {
        return empleadoService.obtenerDatosEmpleadoActivo(id);
    }
    @GetMapping("/obtenerinactivos/{id}")
    public ResponseEntity<DatosActualizarEmpleado> obtenerEmpleadoInactivo(@PathVariable Long id) {
        return empleadoService.obtenerDatosEmpleadoInactivo(id);
    }
    @GetMapping("/buscar/activos")
    public ResponseEntity<List<DatosActualizarEmpleado>> buscarActivosPorNombre(@RequestParam String filtro) {
        return empleadoService.buscarEmpleadosActivosPorNombre(filtro);
    }
    @GetMapping("/buscar/activos/documento")
    public ResponseEntity<List<DatosActualizarEmpleado>> buscarActivosPorDocumento(@RequestParam String numeroDocumento) {
        return empleadoService.buscarEmpleadoActivoPorNumeroDocumento(numeroDocumento);
    }
    @GetMapping("/buscar/inactivos")
    public ResponseEntity<List<DatosActualizarEmpleado>> buscarInactivosPorNombre(@RequestParam String filtro) {
        return empleadoService.buscarEmpleadosInactivosPorNombre(filtro);
    }
    @GetMapping("/buscar/inactivos/documento")
    public ResponseEntity<List<DatosActualizarEmpleado>> buscarInactivosPorDocumento(@RequestParam String numeroDocumento) {
        return empleadoService.buscarEmpleadoInactivoPorNumeroDocumento(numeroDocumento);
    }

}