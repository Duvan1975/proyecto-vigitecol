package proyectoVigitecolSpringBoot.controller;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.usuarios.Usuario;
import proyectoVigitecolSpringBoot.domain.usuarios.UsuarioService;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Solo ADMIN puede ver todos los usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    // Solo ADMIN puede crear usuarios
    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.crearUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    // Solo ADMIN puede actualizar usuarios
    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        try {
            Usuario usuarioActualizado = usuarioService.actualizarUsuario(id, usuario);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /*@PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.actualizarUsuario(id, usuario));
    }*/

    // Solo ADMIN puede desactivar usuarios (no eliminar)
    /*@PatchMapping("/{id}/estado")
    public ResponseEntity<Void> cambiarEstado(@PathVariable Long id, @RequestParam boolean estado) {
        usuarioService.cambiarEstado(id, estado);
        return ResponseEntity.ok().build();
    }*/

    // En UsuarioController.java
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Void> cambiarEstado(@PathVariable Long id, @RequestParam boolean estado) {
        try {
            usuarioService.cambiarEstado(id, estado);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
