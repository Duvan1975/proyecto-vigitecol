package proyectoVigitecolSpringBoot.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.afiliacion.*;

import java.util.List;

@RestController
@RequestMapping("/afiliaciones")
@CrossOrigin(origins = "http://localhost:3000")
public class AfiliacionController {

    @Autowired
    private AfiliacionService afiliacionService;

    @PostMapping("/{empleadoId}")
    public ResponseEntity<?> registrarAfiliacion(
            @PathVariable Long empleadoId,
            @RequestBody List<DatosRegistroAfiliacion> listaDatos) {
        afiliacionService.registrarAfiliacion(empleadoId, listaDatos);
        return ResponseEntity.ok(listaDatos);
    }

    @GetMapping
    public ResponseEntity<Page<DatosListadoAfiliacion>> listadoAfiliaciones(
            @PageableDefault(size = 10) Pageable paginacion) {

        Page<DatosListadoAfiliacion> afiliaciones = afiliacionService.listarAfiliaciones(paginacion)
                .map(DatosListadoAfiliacion::new);

        return ResponseEntity.ok(afiliaciones);
    }

    @GetMapping("/por-empleado/{empleadoId}")
    public ResponseEntity<List<DatosListadoAfiliacion>> obtenerAfiliacionesPorEmpleado(
            @PathVariable Long empleadoId) {
        var afiliaciones = afiliacionService.obtenerAfiliacionesPorEmpleadoActivo(empleadoId);
        return ResponseEntity.ok(afiliaciones);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DatosRespuestaAfiliacion> actualizarAfiliacion(
            @RequestBody @Valid DatosActualizarAfiliacion datos) {
        DatosRespuestaAfiliacion respuesta = afiliacionService.actualizarAfiliacion(datos);

        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAfiliacion(@PathVariable Long id) {
        afiliacionService.eliminarAfiliacion(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content
    }
}
