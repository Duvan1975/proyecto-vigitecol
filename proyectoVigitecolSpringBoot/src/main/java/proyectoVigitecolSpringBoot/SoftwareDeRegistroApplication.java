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
				// Crear usuario admin inicial si no existe
				if (usuarioService.count() == 0) {
					Usuario admin = new Usuario();
					admin.setAdmin("admin@vigitecol.com");
					admin.setClave(passwordEncoder.encode("admin123"));
					admin.setRol(Rol.ADMIN);
					admin.setEstado(true);
					usuarioService.save(admin);

					System.out.println("Usuario admin creado: admin@vigitecol.com / admin123");
				}
			};
		}
	}