package proyectoVigitecolSpringBoot.empleado;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    boolean existsByCorreo(@Email(message = "Debe ser un correo electrónico válido") String correo);

    boolean existsByNumeroDocumento(@NotBlank @Pattern(regexp = "\\d{7,15}",message = "Debe contener solo números entre 7 y 15 digitos") String s);
}