package proyectoVigitecolSpringBoot.domain.usuarios;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.historial.HistorialAccion;
import proyectoVigitecolSpringBoot.domain.historial.HistorialRepository;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private HistorialRepository historialRepository;

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
        Usuario nuevo = usuarioRepository.save(usuario);

        String actor = obtenerUsuarioActual();
        historialRepository.save(new HistorialAccion(
                actor,
                "CREAR_USUARIO",
                "Creó el usuario con correo: " + nuevo.getAdmin()
        ));
        return nuevo;
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

        Usuario actualizado = usuarioRepository.save(usuarioExistente);

        // Guardar en historial (mínimo cambio)
        String actor = obtenerUsuarioActual(); // método helper abajo
        historialRepository.save(new HistorialAccion(actor, "EDITAR_USUARIO", "Actualizó el usuario con correo: " + actualizado.getAdmin()));

        return actualizado;

    }

    public void cambiarEstado(Long id, boolean estado) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setEstado(estado);
        Usuario actualizado = usuarioRepository.save(usuario);

        String actor = obtenerUsuarioActual();
        historialRepository.save(new HistorialAccion(
                actor,
                "CAMBIAR_ESTADO_USUARIO",
                "Cambió estado del usuario " + actualizado.getAdmin() + " a: " + (estado ? "ACTIVO" : "INACTIVO")
        ));
    }

    public long count() {
        return usuarioRepository.count();
    }

    public void save(Usuario admin) {
    }
    public String obtenerUsuarioActual() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            System.out.println("🔍 Usuario autenticado en contexto: " + principal);
            if (principal instanceof Usuario u) {
                return u.getNombreUsuario() != null && !u.getNombreUsuario().isBlank()
                        ? u.getNombreUsuario()
                        : u.getAdmin();
            }
        } catch (Exception e) {
            System.out.println("⚠️ Error obteniendo usuario actual: " + e.getMessage());
        }
        return "Sistema/Desconocido";
    }

}