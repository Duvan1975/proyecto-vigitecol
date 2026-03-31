package proyectoVigitecolSpringBoot;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;
import proyectoVigitecolSpringBoot.domain.usuarios.Rol;
import proyectoVigitecolSpringBoot.domain.usuarios.Usuario;
import proyectoVigitecolSpringBoot.domain.usuarios.UsuarioService;

@SpringBootApplication
@EnableScheduling
public class SoftwareDeRegistroApplication {

	public static void main(String[] args) {

		SpringApplication.run(SoftwareDeRegistroApplication.class, args);
	}

		@Bean
		CommandLineRunner init(UsuarioService usuarioService, PasswordEncoder passwordEncoder) {
			return args -> {
				// Crear usuario admin inicial si no existe la clave es admin123
				if (usuarioService.count() == 0) {
					Usuario admin = new Usuario();
					admin.setAdmin("admin@vigitecol.com");
					admin.setClave(passwordEncoder.encode("$2a$12$BG4stzHRXEKJF/prBOS9h.fqoB.rp7/X7dr0eXLAWyjUPjhT/E12m"));
					admin.setRol(Rol.ADMIN);
					admin.setEstado(true);
					usuarioService.save(admin);

					System.out.println("Usuario admin creado: admin@vigitecol.com / admin123");
				}
			};
		}
	}
