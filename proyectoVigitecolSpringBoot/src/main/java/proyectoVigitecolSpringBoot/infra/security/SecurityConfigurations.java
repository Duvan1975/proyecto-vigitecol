package proyectoVigitecolSpringBoot.infra.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

import java.util.List;

@Configuration

@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfiguration = new CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(List.of(
                            "http://localhost:3000",
                            "http://localhost:8081",
                            "https://proyecto-vigitecol-dsa7.vercel.app",
                            "https://proyecto-vigitecol-dsa7-ocljwnv39-duvans-projects-4d9c2e8d.vercel.app",
                            "https://jodie-biobibliographic-tidally.ngrok-free.dev",
                            "http://192.168.20.142:8081",
                            "http://192.168.1.6:8081",
                            "http://192.168.1.3:8081",
                            "http://192.168.1.6:3000",
                            "https://proyecto-vigitecol-1.onrender.com",
                            "https://proyecto-vigitecol-dsa7-git-",
                            "http://192.168.1.3:3000",
                            "http://192.168.20.142:3000"

                    ));
                    corsConfiguration.setAllowedMethods(List.of(
                            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(List.of("*"));
                    corsConfiguration.setAllowCredentials(true);
                    return corsConfiguration;
                }))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos
                        .requestMatchers("/login").permitAll()
                        .requestMatchers("/test/public").permitAll()
                        .requestMatchers("/test-mail").permitAll()
                        .requestMatchers(HttpMethod.POST, "/password-reset/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/password-reset/**").permitAll()

                        // ==================== EMPLEADOS ====================
                        // LECTURA - Todos los autenticados
                        .requestMatchers(HttpMethod.GET, "/empleados").authenticated()
                        .requestMatchers(HttpMethod.GET, "/empleados/{id}").authenticated()
                        .requestMatchers(HttpMethod.GET, "/empleados/buscar").authenticated()

                        // ESCRITURA - Solo RRHH
                        .requestMatchers(HttpMethod.POST, "/empleados").hasAuthority("ROLE_RRHH")
                        .requestMatchers(HttpMethod.PUT, "/empleados/**").hasAuthority("ROLE_RRHH")
                        .requestMatchers(HttpMethod.PUT, "/empleados/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/empleados/**").hasAuthority("ROLE_RRHH")

                        // ==================== CONTRATOS ====================
                        .requestMatchers(HttpMethod.POST, "/contratos").hasAuthority("ROLE_RRHH")
                        .requestMatchers(HttpMethod.PUT, "/contratos/**").hasAuthority("ROLE_RRHH")
                        .requestMatchers(HttpMethod.DELETE, "/contratos/**").hasAuthority("ROLE_RRHH")
                        // LECTURA - ADMIN y RRHH
                        .requestMatchers(HttpMethod.GET, "/contratos").hasAnyAuthority("ROLE_ADMIN", "ROLE_RRHH")
                        .requestMatchers(HttpMethod.GET, "/contratos/{id}").hasAnyAuthority("ROLE_ADMIN", "ROLE_RRHH")

                        // ESCRITURA - Solo RRHH
                        .requestMatchers(HttpMethod.POST, "/contratos").hasAuthority("ROLE_RRHH")
                        .requestMatchers(HttpMethod.PUT, "/contratos/**").hasAuthority("ROLE_RRHH")

                        // ==================== USUARIOS ====================
                        // Solo ADMIN puede gestionar usuarios
                        .requestMatchers(HttpMethod.GET, "/usuarios").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/usuarios").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/usuarios/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/usuarios/**").hasAuthority("ROLE_ADMIN")

                        // ==================== REPORTES ====================
                        .requestMatchers(HttpMethod.GET, "/reportes/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_RRHH")

                        .requestMatchers(HttpMethod.GET, "/backup/download").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/historial").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/historial/todo").hasRole("ADMIN")

                        // ==================== FOTOS ====================
                        //.requestMatchers(HttpMethod.POST, "/fotos").hasAnyAuthority("ROLE_ADMIN", "ROLE_RRHH")
                        .requestMatchers(HttpMethod.POST, "/fotos/subir/**").hasRole("RRHH")


                        //.requestMatchers(HttpMethod.POST, "/empleados/subir/**").hasAuthority("ROLE_RRHH")




                        // Endpoints de prueba
                        .requestMatchers("/test/admin").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/test/rrhh").hasAnyAuthority("ROLE_ADMIN", "ROLE_RRHH")
                        .requestMatchers("/test/user").hasAnyAuthority("ROLE_ADMIN", "ROLE_RRHH", "ROLE_USER")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }


}
