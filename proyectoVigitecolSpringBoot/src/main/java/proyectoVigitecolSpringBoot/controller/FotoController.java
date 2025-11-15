package proyectoVigitecolSpringBoot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import proyectoVigitecolSpringBoot.domain.foto.FotoService;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;
import proyectoVigitecolSpringBoot.domain.empleado.EmpleadoRepository;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/fotos")
@CrossOrigin(origins = {"http://localhost:3000", "https://proyecto-vigitecol-dsa7.vercel.app"})
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
    @GetMapping("/{nombreArchivo}")
    public ResponseEntity<Resource> obtenerFoto(@PathVariable String nombreArchivo) throws MalformedURLException {
        Path ruta = Paths.get("uploads/fotos").resolve(nombreArchivo).toAbsolutePath();
        Resource recurso = new UrlResource(ruta.toUri());

        if (!recurso.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(recurso);
    }
}
