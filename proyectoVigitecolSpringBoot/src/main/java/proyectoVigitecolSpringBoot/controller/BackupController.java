package proyectoVigitecolSpringBoot.controller;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/backup")
public class BackupController {

    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> downloadBackup() {
        try {
            // Nombre del archivo con fecha
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String backupFile = "backup_" + timestamp + ".sql";

            // Ruta completa del mysqldump en Windows
            String mysqldumpPath = "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe";

            // Parámetros de conexión
            String user = "root"; // o el usuario que tengas
            String password = "TU_PASSWORD";
            String database = "vigitecol_db";

            // Comando para exportar la base de datos
            ProcessBuilder pb = new ProcessBuilder(
                    mysqldumpPath,
                    "-u", user,
                    "-p" + password,
                    "--databases", database
            );

            // Redirigir salida al archivo .sql
            pb.redirectOutput(new File(backupFile));
            Process process = pb.start();
            process.waitFor();

            // Leer archivo y enviarlo como descarga
            File file = new File(backupFile);
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getName())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(file.length())
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
