package proyectoVigitecolSpringBoot.infra.errores.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import proyectoVigitecolSpringBoot.domain.usuarios.UsuarioRepository;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("El filtro ya ESTÁ siendo llamado");
        //Obtener el token del header
        var authHeader = request.getHeader("Authorization");

        if (authHeader != null) {
            var token = authHeader.replace("Bearer ", "");
            var subject = tokenService.getSubject(token);

            if (subject != null) {
                //token válido
                var usuario = usuarioRepository.findByAdmin(subject);
                var authentication = new UsernamePasswordAuthenticationToken(
                        usuario, null, usuario.getAuthorities());//Forzamos el inicio de sesión
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }else {
                throw new RuntimeException("El token enviado NO es válido");
            }
        }
        filterChain.doFilter(request, response);
    }
}
