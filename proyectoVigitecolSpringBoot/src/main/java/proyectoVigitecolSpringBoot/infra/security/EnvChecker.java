package proyectoVigitecolSpringBoot.infra.security;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class EnvChecker {

    @PostConstruct
    public void checkEnvVars() {
        System.out.println("=== ENVIRONMENT VARIABLES ===");
        System.out.println("DATABASE_PASSWORD: " +
                (System.getenv("DATABASE_PASSWORD") != null ? "✅ SET" : "❌ NOT SET"));
        System.out.println("EMAIL_PASSWORD: " +
                (System.getenv("EMAIL_PASSWORD") != null ? "✅ SET" : "❌ NOT SET"));
        System.out.println("AIVEN_DB_PASSWORD: " +
                (System.getenv("AIVEN_DB_PASSWORD") != null ? "✅ SET" : "❌ NOT SET"));
        System.out.println("SENDGRID_API_KEY: " +
                (System.getenv("SENDGRID_API_KEY") != null ? "✅ SET" : "❌ NOT SET"));
    }
}
