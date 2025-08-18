package proyectoVigitecolSpringBoot.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.familia.*;

import java.util.List;

@RestController
@RequestMapping("/familiares")
@CrossOrigin(origins = "http://localhost:3000")
public class FamiliarController {

    @Autowired
    private FamiliarService familiarService;

    @PostMapping("/{empleadoId}")
    public ResponseEntity<List<DatosRegistroFamiliar>> registrarFamiliar(
            @PathVariable Long empleadoId,
            @RequestBody List<DatosRegistroFamiliar> listaDatos) {

        familiarService.registrarFamiliar(empleadoId, listaDatos);
        return ResponseEntity.ok(listaDatos);
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

    @PutMapping
    @Transactional
    public ResponseEntity<DatosRespuestaFamiliar> actualizarFamiliar(
            @RequestBody @Valid DatosActualizarFamiliar datos) {
        DatosRespuestaFamiliar respuesta = familiarService.actualizarFamiliar(datos);
        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarFamiliar(@PathVariable Long id) {
        familiarService.eliminarFamiliar(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content
    }
}
