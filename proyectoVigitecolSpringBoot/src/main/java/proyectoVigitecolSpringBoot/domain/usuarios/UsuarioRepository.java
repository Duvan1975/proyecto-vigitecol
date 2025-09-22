package proyectoVigitecolSpringBoot.domain.usuarios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    UserDetails findByAdmin(String username);

    @Query("SELECT u FROM Usuario u WHERE u.admin = :admin")
    Usuario findUsuarioByAdmin(@Param("admin") String admin);
}