package proyectoVigitecolSpringBoot.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.curso.*;

import java.util.List;

@RestController
@RequestMapping("/cursos")
@CrossOrigin(origins = "http://localhost:3000")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @PostMapping("/{empleadoId}")
    public ResponseEntity<?> registrarCurso(
            @PathVariable Long empleadoId,
            @RequestBody List<@Valid DatosRegistroCurso> listaDatos) {
        cursoService.resgistrarCurso(empleadoId, listaDatos);
        return ResponseEntity.ok(listaDatos);
    }

    @GetMapping
    public ResponseEntity<Page<DatosListadoCurso>> listadoCursos(
            @PageableDefault(size = 10) Pageable paginacion) {

        Page<DatosListadoCurso> cursos = cursoService.listarCursos(paginacion)
                .map(DatosListadoCurso::new);

        return ResponseEntity.ok(cursos);
    }

    @GetMapping("/por-empleado/{empleadoId}")
    public ResponseEntity<List<DatosListadoCurso>> obtenerCursosPorEmpleado(
            @PathVariable Long empleadoId) {
        var cursos = cursoService.obtenerCursosPorEmpleadoActivo(empleadoId);
        return ResponseEntity.ok(cursos);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DatosRespuestaCurso> actualizarCurso(
            @RequestBody @Valid DatosActualizarCurso datos) {

        DatosRespuestaCurso respuesta = cursoService.actualizarCurso(datos);

        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCurso(@PathVariable Long id) {
        cursoService.eliminarCurso(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content
    }
}
