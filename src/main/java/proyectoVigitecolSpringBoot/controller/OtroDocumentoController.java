package proyectoVigitecolSpringBoot.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.otroDocumento.*;

import java.util.List;

@RestController
@RequestMapping("/documentos")
@CrossOrigin(origins = "http://localhost:3000")
public class OtroDocumentoController {

    @Autowired
    private OtroDocumentoService otroDocumentoService;

    @PostMapping("/{empleadoId}")
    public ResponseEntity<?> registrarOtroDocumento(
            @PathVariable Long empleadoId,
            @RequestBody List<DatosRegistroOtroDocumento> listaDatos) {
        otroDocumentoService.registrarOtroDocumento(empleadoId, listaDatos);
        return ResponseEntity.ok(listaDatos);
    }

    @GetMapping
    public ResponseEntity<Page<DatosListadoOtroDocumento>> listadoDocumentos(
            @PageableDefault(size = 10) Pageable paginacion) {

        Page<DatosListadoOtroDocumento> documentos = otroDocumentoService.listarDocumentos(paginacion)
                .map(DatosListadoOtroDocumento::new);

        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/por-empleado/{empleadoId}")
    public ResponseEntity<List<DatosListadoOtroDocumento>> obtenerDocumentosPorEmpleado(
            @PathVariable Long empleadoId) {
        var documentos = otroDocumentoService.obtenerDocumentosPorEmpleadoActivo(empleadoId);
        return ResponseEntity.ok(documentos);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DatosRespuestaDocumento> actualizarDocumento(
            @RequestBody @Valid DatosActualizarDocumento datos) {

        DatosRespuestaDocumento respuesta = otroDocumentoService.actualizarDocumento(datos);

        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarDocumento(@PathVariable Long id) {
        otroDocumentoService.eliminarDocumento(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content
    }
}
