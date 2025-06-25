package proyectoVigitecolSpringBoot.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.empleado.*;

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
    @GetMapping
    public Page<DatosListadoEmpleado> listadoEmpleados(
            @PageableDefault(size = 20, sort = "apellidos")Pageable paginacion) {
        return empleadoService.listarEmpleados(paginacion);
    }
    @PutMapping
    public void actualizarEmpleado(@RequestBody @Valid DatosActualizarEmpleado datos) {
        empleadoService.actualizarEmpleado(datos);
    }
    @DeleteMapping("/{id}")
    public void eliminarEmpleado(@PathVariable Long id) {
        empleadoService.eliminarEmpleado(id);
    }
}