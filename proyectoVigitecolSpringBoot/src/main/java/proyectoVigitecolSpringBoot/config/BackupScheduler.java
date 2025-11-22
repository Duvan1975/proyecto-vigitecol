package proyectoVigitecolSpringBoot.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import proyectoVigitecolSpringBoot.domain.historial.HistorialAccion;
import proyectoVigitecolSpringBoot.domain.historial.HistorialRepository;
import proyectoVigitecolSpringBoot.domain.usuarios.UsuarioService;

import java.io.File;
import java.io.FileInputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class BackupScheduler {

    @Autowired
    private HistorialRepository historialRepository;

    @Autowired
    private UsuarioService usuarioService;

    private final String mysqldumpPath = "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe";

    private final String host = "mysql-14d288cf-ballexplorer1975-fb53.d.aivencloud.com";
    private final String port = "20771";
    private final String user = "avnadmin";
    private final String password = System.getenv("AIVEN_DB_PASSWORD");
    private final String database = "vigitecol_db";

    // 🔥 Cada mes, día 1, a las 02:00 AM
    @Scheduled(cron = "0 0 * * * *")
    public void generarBackupAutomatico() {
        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String backupFile = "backup_auto_" + timestamp + ".sql";

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

            System.out.println("[BACKUP AUTOMÁTICO] Generado: " + backupFile);

            historialRepository.save(new HistorialAccion(
                    "SISTEMA",
                    "BACKUP_AUTOMATICO",
                    "Se generó un respaldo automático del sistema"
            ));

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}