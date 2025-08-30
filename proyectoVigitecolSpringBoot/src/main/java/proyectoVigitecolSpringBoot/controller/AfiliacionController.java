package proyectoVigitecolSpringBoot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.afiliacion.Afiliacion;
import proyectoVigitecolSpringBoot.domain.afiliacion.AfiliacionService;
import proyectoVigitecolSpringBoot.domain.afiliacion.DatosListadoAfiliacion;
import proyectoVigitecolSpringBoot.domain.afiliacion.DatosRegistroAfiliacion;

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
        return ResponseEntity.ok("Afiliación Registrada con Éxito");
    }

    /*@GetMapping
    public List<Afiliacion> listadoAfiliaciones() {
        return afiliacionService.listarAfiliaciones();
    }*/

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
}
