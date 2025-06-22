package proyectoVigitecolSpringBoot.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import proyectoVigitecolSpringBoot.empleado.DatosRegistroEmpleado;
import proyectoVigitecolSpringBoot.empleado.EmpleadoService;

@RestController
@RequestMapping("/empleados")
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
}