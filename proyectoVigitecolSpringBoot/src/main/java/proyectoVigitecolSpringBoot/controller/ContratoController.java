package proyectoVigitecolSpringBoot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.contrato.Contrato;
import proyectoVigitecolSpringBoot.domain.contrato.ContratoService;
import proyectoVigitecolSpringBoot.domain.contrato.DatosListadoContrato;
import proyectoVigitecolSpringBoot.domain.contrato.DatosRegistroContrato;

import java.util.List;

@RestController
@RequestMapping("/contratos")
@CrossOrigin(origins = "http://localhost:3000")
public class ContratoController {

    @Autowired
    private ContratoService contratoService;

    @PostMapping("/{empleadoId}")
    public ResponseEntity<?> registrarContrato(@PathVariable Long empleadoId,
                                               @RequestBody DatosRegistroContrato datos) {
        contratoService.registrarContrato(empleadoId, datos);
        return ResponseEntity.ok("Contrato Reistrado con éxito");
    }
    //Método para listar todos los contratos
    @GetMapping
    public List<Contrato> listadoContratos() {
        return contratoService.listarContratos();
    }
    @GetMapping("/por-empleado/{empleadoId}")
    public ResponseEntity<List<DatosListadoContrato>> obtenerContratosPorEmpleado(
            @PathVariable Long empleadoId) {
        var contratos = contratoService.obtenerContratosPorEmpleado(empleadoId);
        return ResponseEntity.ok(contratos);
    }
}
