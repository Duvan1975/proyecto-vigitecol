package proyectoVigitecolSpringBoot;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import proyectoVigitecolSpringBoot.domain.usuarios.UsuarioRepository;

@SpringBootTest
public class TestRecuperacion {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void testFindUsuario() {
        // Prueba con un usuario que SABES que existe en tu BD
        var usuario = usuarioRepository.findByAdmin("admin@test.com");
        System.out.println("Usuario encontrado: " + usuario);

        if (usuario != null) {
            System.out.println("Username: " + usuario.getUsername());
            System.out.println("Clase: " + usuario.getClass().getName());
        }
    }
}