package proyectoVigitecolSpringBoot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import proyectoVigitecolSpringBoot.domain.foto.FotoService;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;
import proyectoVigitecolSpringBoot.domain.empleado.EmpleadoRepository;

import java.io.IOException;

@RestController
@RequestMapping("/fotos")
public class FotoController {

    @Autowired
    private FotoService fotoService;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @PostMapping("/subir/{idEmpleado}")
    public ResponseEntity<?> subirFoto(@PathVariable Long idEmpleado, @RequestParam("archivo") MultipartFile archivo) {
        try {
            Empleado empleado = empleadoRepository.findById(idEmpleado)
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

            String ruta = fotoService.guardarFoto(idEmpleado, archivo);
            empleado.setFoto(ruta);
            empleadoRepository.save(empleado);

            return ResponseEntity.ok("Foto guardada correctamente: " + ruta);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error al guardar foto: " + e.getMessage());
        }
    }
}
