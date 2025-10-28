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
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String backupFile = "backup_" + timestamp + ".sql";

            // Ruta del mysqldump en Windows
            String mysqldumpPath = "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe";

            // Parámetros de conexión AIVEN
            String host = "mysql-14d288cf-ballexplorer1975-fb53.d.aivencloud.com";
            String port = "20771";
            String user = "avnadmin";
            String password = System.getenv("AIVEN_DB_PASSWORD");
            String database = "vigitecol_db";

            // Comando completo (AIVEN requiere SSL)
            ProcessBuilder pb = new ProcessBuilder(
                    mysqldumpPath,
                    "-h", host,
                    "-P", port,
                    "-u", user,
                    "-p" + password,
                    "--ssl-mode=REQUIRED",
                    "--databases", database
            );

            pb.redirectOutput(new File(backupFile));
            Process process = pb.start();
            process.waitFor();

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
