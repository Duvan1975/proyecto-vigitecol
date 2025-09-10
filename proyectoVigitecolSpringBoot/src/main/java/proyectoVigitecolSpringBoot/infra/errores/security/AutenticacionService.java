package proyectoVigitecolSpringBoot.infra.errores.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.usuarios.Rol;
import proyectoVigitecolSpringBoot.domain.usuarios.Usuario;
import proyectoVigitecolSpringBoot.domain.usuarios.UsuarioRepository;

@Service
public class AutenticacionService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void crearUsuariosPrueba() {
        // Solo crear si no existen
        if (usuarioRepository.findByAdmin("admin@test.com") == null) {
            var admin = new Usuario();
            admin.setAdmin("admin@test.com");
            admin.setClave(passwordEncoder.encode("123456"));
            admin.setRol(Rol.ADMIN);
            usuarioRepository.save(admin);
        }

        if (usuarioRepository.findByAdmin("rrhh@test.com") == null) {
            var rrhh = new Usuario();
            rrhh.setAdmin("rrhh@test.com");
            rrhh.setClave(passwordEncoder.encode("123456"));
            rrhh.setRol(Rol.RRHH);
            usuarioRepository.save(rrhh);
        }

        if (usuarioRepository.findByAdmin("user@test.com") == null) {
            var user = new Usuario();
            user.setAdmin("user@test.com");
            user.setClave(passwordEncoder.encode("123456"));
            user.setRol(Rol.USER);
            usuarioRepository.save(user);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByAdmin(username);
    }
}