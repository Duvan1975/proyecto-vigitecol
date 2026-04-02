package proyectoVigitecolSpringBoot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;
import proyectoVigitecolSpringBoot.domain.empleado.EmpleadoRepository;
import proyectoVigitecolSpringBoot.domain.foto.FotoService;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
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

    @Value("${app.upload.dir}")
    private String uploadDir;

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
    /*@GetMapping("/{nombreArchivo}")
    public ResponseEntity<Resource> obtenerFoto(@PathVariable String nombreArchivo) throws MalformedURLException {
        Path ruta = Paths.get("uploads/fotos").resolve(nombreArchivo).toAbsolutePath();
        Resource recurso = new UrlResource(ruta.toUri());

        if (!recurso.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(recurso);
    }*/
    @GetMapping("/{nombreArchivo}")
    public ResponseEntity<Resource> obtenerFoto(@PathVariable String nombreArchivo) throws MalformedURLException {

        Path ruta = Paths.get(uploadDir).resolve(nombreArchivo).toAbsolutePath();
        Resource recurso = new UrlResource(ruta.toUri());

        if (!recurso.exists()) {
            return ResponseEntity.notFound().build();
        }

        String tipo = "image/jpeg"; // default

        try {
            tipo = Files.probeContentType(ruta);
        } catch (IOException e) {
            System.out.println("No se pudo determinar el tipo de archivo");
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(tipo))
                .body(recurso);
    }
}
