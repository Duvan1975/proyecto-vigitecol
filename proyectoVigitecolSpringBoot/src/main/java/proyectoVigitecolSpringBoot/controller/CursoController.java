package proyectoVigitecolSpringBoot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.curso.Curso;
import proyectoVigitecolSpringBoot.domain.curso.CursoService;
import proyectoVigitecolSpringBoot.domain.curso.DatosListadoCurso;
import proyectoVigitecolSpringBoot.domain.curso.DatosRegistroCurso;

import java.util.List;

@RestController
@RequestMapping("/cursos")
@CrossOrigin(origins = "http://localhost:3000")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @PostMapping("/{empleadoId}")
    public ResponseEntity<?> registrarCurso(@PathVariable Long empleadoId,
                                               @RequestBody List<DatosRegistroCurso> listaDatos) {
        cursoService.resgistrarCurso(empleadoId, listaDatos);
        return ResponseEntity.ok("Curso Registrado con Éxito");
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
}
