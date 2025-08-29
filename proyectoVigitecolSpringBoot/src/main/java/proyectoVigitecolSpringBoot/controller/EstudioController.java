package proyectoVigitecolSpringBoot.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.estudio.*;

import java.util.List;

@RestController
@RequestMapping("/estudios")
@CrossOrigin(origins = "http://localhost:3000")
public class EstudioController {

    @Autowired
    private EstudioService estudioService;

    @PostMapping("/{empleadoId}")
    public ResponseEntity<?> registrarEstudio(
            @PathVariable Long empleadoId,
            @RequestBody List<@Valid DatosRegistroEstudio> listaDatos) {
        estudioService.resgistrarEstudio(empleadoId, listaDatos);
        return ResponseEntity.ok(listaDatos);
    }

    @GetMapping
    public ResponseEntity<Page<DatosListadoEstudio>> listadoEstudios(
            @PageableDefault(size = 10) Pageable paginacion) {

        Page<DatosListadoEstudio> estudios = estudioService.listarEstudios(paginacion)
                .map(DatosListadoEstudio::new);

        return ResponseEntity.ok(estudios);
    }

    @GetMapping("/por-empleado/{empleadoId}")
    public ResponseEntity<List<DatosListadoEstudio>> obtenerEstudiosPorEmpleado(
            @PathVariable Long empleadoId) {
        var estudios = estudioService.obtenerEstudiosPorEmpleadoActivo(empleadoId);
        return ResponseEntity.ok(estudios);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DatosRespuestaEstudio> actualizarEstudio(
            @RequestBody @Valid DatosActualizarEstudio datos) {

        DatosRespuestaEstudio respuesta = estudioService.actualizarEstudio(datos);

        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEstudio(@PathVariable Long id) {
        estudioService.eliminarEstudio(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content
    }
}
