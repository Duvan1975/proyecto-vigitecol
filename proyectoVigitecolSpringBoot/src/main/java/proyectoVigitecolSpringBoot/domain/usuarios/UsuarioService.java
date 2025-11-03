package proyectoVigitecolSpringBoot.domain.usuarios;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Usuario crearUsuario(Usuario usuario) {
        // Verificar si el usuario ya existe
        if (usuarioRepository.findByAdmin(usuario.getAdmin()) != null) {
            throw new RuntimeException("El usuario ya existe");
        }

        // Encriptar la contraseña
        usuario.setClave(passwordEncoder.encode(usuario.getClave()));
        return usuarioRepository.save(usuario);
    }

    @Transactional
    // En UsuarioService.java
    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        // Validar que el email no esté en uso por otro usuario
        if (!usuarioExistente.getAdmin().equals(usuarioActualizado.getAdmin())) {
            UserDetails usuarioConMismoEmail = usuarioRepository.findByAdmin(usuarioActualizado.getAdmin());
            if (usuarioConMismoEmail != null) {
                throw new RuntimeException("El email ya está en uso por otro usuario");
            }
        }

        // Actualizar solo los campos permitidos
        usuarioExistente.setAdmin(usuarioActualizado.getAdmin());
        usuarioExistente.setRol(usuarioActualizado.getRol());
        usuarioExistente.setEstado(usuarioActualizado.isEstado());
        usuarioExistente.setNombreUsuario(usuarioActualizado.getNombreUsuario());

        // Solo actualizar la contraseña si se proporciona una nueva
        if (usuarioActualizado.getClave() != null && !usuarioActualizado.getClave().isEmpty()) {
            usuarioExistente.setClave(passwordEncoder.encode(usuarioActualizado.getClave()));
        }

        return usuarioRepository.save(usuarioExistente);
    }

    public void cambiarEstado(Long id, boolean estado) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setEstado(estado);
        usuarioRepository.save(usuario);
    }

    public long count() {
        return usuarioRepository.count();
    }

    public void save(Usuario admin) {
    }
}