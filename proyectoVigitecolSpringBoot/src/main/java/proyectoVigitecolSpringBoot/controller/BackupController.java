package proyectoVigitecolSpringBoot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.historial.HistorialAccion;
import proyectoVigitecolSpringBoot.domain.historial.HistorialRepository;
import proyectoVigitecolSpringBoot.domain.usuarios.UsuarioService;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/backup")
public class BackupController {

    @Value("${app.mysqldump.path}")
    private String mysqldumpPath;

    private final UsuarioService usuarioService;
    private final HistorialRepository historialRepository;

    @Autowired
    public BackupController(UsuarioService usuarioService, HistorialRepository historialRepository) {
        this.usuarioService = usuarioService;
        this.historialRepository = historialRepository;
    }

    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> downloadBackup() {
        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String backupFile = "backup_" + timestamp + ".sql";

            String host = "mysql-14d288cf-ballexplorer1975-fb53.d.aivencloud.com";
            String port = "20771";
            String user = "avnadmin";
            String password = System.getenv("AIVEN_DB_PASSWORD");
            String database = "vigitecol_db";

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

            // 🔹 Registrar acción en historial
            String actor = usuarioService.obtenerUsuarioActual();
            historialRepository.save(new HistorialAccion(
                    actor,
                    "BACKUP_SISTEMA",
                    "El usuario ADMIN realizó un respaldo completo del sistema"
            ));

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
