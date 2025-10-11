package proyectoVigitecolSpringBoot.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.experienciaLaboral.*;

import java.util.List;

@RestController
@RequestMapping("/experienciasLaborales")
@CrossOrigin(origins = "http://localhost:3000")
public class ExperienciaLaboralController {
    @Autowired
    private ExperienciaLaboralService experienciaLaboralService;

    @PostMapping("/{empleadoId}")
    public ResponseEntity<?> registrarExperienciaLaboral(
            @PathVariable Long empleadoId,
            @RequestBody List<DatosRegistroExperienciaLaboral> listaDatos) {
        experienciaLaboralService.resgistrarExperienciaLaboral(empleadoId, listaDatos);
        return ResponseEntity.ok(listaDatos);
    }

    @GetMapping
    public ResponseEntity<Page<DatosListadoExperienciaLaboral>> listadoExperienciasLaborales(
            @PageableDefault(size = 10) Pageable paginacion) {

        Page<DatosListadoExperienciaLaboral> experienciasLaborales = experienciaLaboralService.listarExperienciasLaborales(paginacion)
                .map(DatosListadoExperienciaLaboral::new);

        return ResponseEntity.ok(experienciasLaborales);
    }

    @GetMapping("/por-empleado/{empleadoId}")
    public ResponseEntity<List<DatosListadoExperienciaLaboral>> obtenerExperienciaLaboralPorEmpleado(
            @PathVariable Long empleadoId) {
        var experienciaLaboral = experienciaLaboralService.obtenerExperienciaLaboralPorEmpleadoActivo(empleadoId);
        return ResponseEntity.ok(experienciaLaboral);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DatosRespuestaExperienciaLaboral> actualizarExperienciaLaboral(
            @RequestBody @Valid DatosActualizarExperienciaLaboral datos) {

        DatosRespuestaExperienciaLaboral respuesta = experienciaLaboralService.actualizarExperienciaLaboral(datos);

        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarExperienciaLaboral(@PathVariable Long id) {
        experienciaLaboralService.eliminarExperienciaLaboral(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content
    }
}
