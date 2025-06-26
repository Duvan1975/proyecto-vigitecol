package proyectoVigitecolSpringBoot.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.empleado.*;

@RestController
@RequestMapping("/empleados")
@CrossOrigin(origins = "http://localhost:3000")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @PostMapping
    public void registrarEmpleado(@RequestBody @Valid DatosRegistroEmpleado datos) {
        System.out.println(datos);
        empleadoService.registrarEmpleado(datos);
    }
    @GetMapping("/activos")
    public Page<DatosListadoEmpleado> listadoEmpleadosActivos(
            @PageableDefault(size = 20)Pageable paginacion) {
        return empleadoService.listarEmpleadosActivos(paginacion);
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
}