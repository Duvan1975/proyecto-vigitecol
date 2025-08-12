package proyectoVigitecolSpringBoot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.familia.DatosListadoFamiliar;
import proyectoVigitecolSpringBoot.domain.familia.DatosRegistroFamiliar;
import proyectoVigitecolSpringBoot.domain.familia.FamiliarService;

import java.util.List;

@RestController
@RequestMapping("/familiares")
@CrossOrigin(origins = "http://localhost:3000")
public class FamiliarController {

    @Autowired
    private FamiliarService familiarService;

    @PostMapping("/{empleadoId}")
    public ResponseEntity<?> registrarFamiliar(@PathVariable Long empleadoId,
                                               @RequestBody List<DatosRegistroFamiliar> listaDatos) {
        familiarService.registrarFamiliar(empleadoId, listaDatos);
        return ResponseEntity.ok("Familiar Registrado con Éxito");
    }

    @GetMapping
    public ResponseEntity<Page<DatosListadoFamiliar>> listadoFamiliares(
            @PageableDefault(size = 10) Pageable paginacion) {

        Page<DatosListadoFamiliar> familiares = familiarService.listarFamiliares(paginacion)
                .map(DatosListadoFamiliar::new);

        return ResponseEntity.ok(familiares);
    }

    @GetMapping("/por-empleado/{empleadoId}")
    public ResponseEntity<List<DatosListadoFamiliar>> obtenerFamiliaresPorEmpleado(@PathVariable Long empleadoId) {
        var familiares = familiarService.obtenerFamiliaresPorEmpleadoActivo(empleadoId);
        return ResponseEntity.ok(familiares);
    }
}
