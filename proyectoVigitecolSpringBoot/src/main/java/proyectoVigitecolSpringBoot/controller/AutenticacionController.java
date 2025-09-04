package proyectoVigitecolSpringBoot.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.usuarios.DatosAutenticacionUsuario;
import proyectoVigitecolSpringBoot.domain.usuarios.Usuario;
import proyectoVigitecolSpringBoot.infra.errores.security.TokenService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/login")
public class AutenticacionController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity autenticarUsuario(@RequestBody @Valid DatosAutenticacionUsuario datosAutenticacionUsuario) {
        Authentication authToken = new UsernamePasswordAuthenticationToken(
                datosAutenticacionUsuario.admin(),
                datosAutenticacionUsuario.clave()
        );

        var usuarioAutenticado = authenticationManager.authenticate(authToken);
        var usuario = (Usuario) usuarioAutenticado.getPrincipal();

        // Verificar si el usuario está activo
        if (!usuario.isEnabled()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Cuenta desactivada. Contacte al administrador.");
        }

        var JWTtoken = tokenService.generarToken(usuario);

        // Devolver más información en la respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("token", JWTtoken);
        response.put("rol", usuario.getRol().name());
        response.put("estado", usuario.isEnabled());
        response.put("admin", usuario.getAdmin());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/verificar")
    public ResponseEntity<?> verificarToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                // Verificar si el token es válido
                String username = tokenService.getSubject(token);

                if (username != null) {
                    return ResponseEntity.ok().body("Token válido");
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido");
        }
    }
}