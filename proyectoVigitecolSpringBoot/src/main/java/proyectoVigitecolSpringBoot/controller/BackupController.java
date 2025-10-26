package proyectoVigitecolSpringBoot.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.*;

@RestController
@RequestMapping("/backup")
public class BackupController {

    @Value("${spring.datasource.username}")
    private String dbUser;

    @Value("${AIVEN_DB_PASSWORD}")
    private String dbPassword;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> downloadBackup() {
        try {
            // Extraer nombre de la base de datos desde la URL
            String dbName = dbUrl.substring(dbUrl.lastIndexOf("/") + 1, dbUrl.indexOf("?"));

            // Archivo temporal donde guardaremos el backup
            File backupFile = File.createTempFile("backup_vigitecol_", ".sql");

            // Comando mysqldump
            String command = String.format(
                    "mysqldump -u%s -p%s -h%s --port=%s %s",
                    dbUser,
                    dbPassword,
                    extractHost(dbUrl),
                    extractPort(dbUrl),
                    dbName
            );

            // Ejecutar el comando
            ProcessBuilder pb = new ProcessBuilder("bash", "-c", command);
            pb.redirectOutput(backupFile);
            Process process = pb.start();
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException("Error al ejecutar mysqldump. Código: " + exitCode);
            }

            InputStreamResource resource = new InputStreamResource(new FileInputStream(backupFile));

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=backup_vigitecol.sql")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(null);
        }
    }

    private String extractHost(String url) {
        // Ejemplo: jdbc:mysql://mysql-xxxxxx.aivencloud.com:20771/dbname
        String hostPort = url.substring(url.indexOf("//") + 2, url.lastIndexOf("/"));
        return hostPort.split(":")[0];
    }

    private String extractPort(String url) {
        String hostPort = url.substring(url.indexOf("//") + 2, url.lastIndexOf("/"));
        return hostPort.split(":")[1];
    }
}
