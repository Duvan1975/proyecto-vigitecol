package proyectoVigitecolSpringBoot.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.empleado.DatosRegistroEmpleado;
import proyectoVigitecolSpringBoot.empleado.Empleado;
import proyectoVigitecolSpringBoot.empleado.EmpleadoRepository;
import proyectoVigitecolSpringBoot.empleado.EmpleadoService;

import java.util.List;

@RestController
@RequestMapping("/empleados")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    @Autowired
    EmpleadoRepository empleadoRepository;

    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @PostMapping
    public void registrarEmpleado(@RequestBody @Valid DatosRegistroEmpleado datos) {
        System.out.println(datos);
        empleadoService.registrarEmpleado(datos);
    }
    @GetMapping
    public List<Empleado> listadoEmpleados() {
        return empleadoRepository.findAll();
    }
}