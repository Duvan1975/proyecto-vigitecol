package proyectoVigitecolSpringBoot.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.empleado.DatosListadoEmpleado;
import proyectoVigitecolSpringBoot.empleado.DatosRegistroEmpleado;
import proyectoVigitecolSpringBoot.empleado.Empleado;
import proyectoVigitecolSpringBoot.empleado.EmpleadoService;

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
    public void registrarEmpleado(@RequestBody @Valid DatosRegistroEmpleado datos) {
        System.out.println(datos);
        empleadoService.registrarEmpleado(datos);
    }
    @GetMapping
    public List<DatosListadoEmpleado> listadoEmpleados() {
        return empleadoService.listarEmpleados();
    }
}