package proyectoVigitecolSpringBoot.domain.foto;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FotoService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    public String guardarFoto(Long empleadoId, MultipartFile archivo) throws IOException {
        if (archivo.isEmpty()) {
            throw new IOException("El archivo está vacío");
        }

        // Validar tipo de archivo
        String tipo = archivo.getContentType();
        if (tipo == null || !tipo.startsWith("image/")) {
            throw new IOException("Solo se permiten archivos de imagen");
        }

        // Crear carpeta si no existe
        Path carpeta = Paths.get(uploadDir);
        if (!Files.exists(carpeta)) {
            Files.createDirectories(carpeta);
        }

        // Nombre único de archivo
        String nombreArchivo = "empleado_" + empleadoId + "_" + System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
        Path destino = carpeta.resolve(nombreArchivo);

        // Guardar archivo
        Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

        // Retornar ruta relativa
        //return destino.toString();
        return nombreArchivo;
    }
}