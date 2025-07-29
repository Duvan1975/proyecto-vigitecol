package proyectoVigitecolSpringBoot.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.contrato.*;

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
    @GetMapping
    public ResponseEntity<Page<DatosListadoContrato>> listadoContratos(
            @PageableDefault(size = 10) Pageable paginacion) {
        return contratoService.listarContratos(paginacion);
    }

    @GetMapping("/por-empleado/{empleadoId}")
    public ResponseEntity<List<DatosListadoContrato>> obtenerContratosPorEmpleado(
            @PathVariable Long empleadoId) {
        var contratos = contratoService.obtenerContratosPorEmpleado(empleadoId);
        return ResponseEntity.ok(contratos);
    }
    @PutMapping
    @Transactional
    public ResponseEntity<DatosRespuestaContrato> actualizarContrato(@RequestBody @Valid DatosActualizarContrato datos) {
        DatosRespuestaContrato respuesta = contratoService.actualizarContrato(datos);
        return ResponseEntity.ok(respuesta);
    }
    @GetMapping("/ultimo-contrato/{empleadoId}")
    public ResponseEntity<DatosListadoContrato> obtenerUltimoContratoPorEmpleado(@PathVariable Long empleadoId) {
        var contrato = contratoService.obtenerUltimoContratoPorEmpleado(empleadoId);
        return ResponseEntity.ok(contrato);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarContrato(@PathVariable Long id) {
        contratoService.eliminarContrato(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content
    }
}
