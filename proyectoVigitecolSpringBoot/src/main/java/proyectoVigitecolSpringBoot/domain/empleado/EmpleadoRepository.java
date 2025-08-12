package proyectoVigitecolSpringBoot.domain.empleado;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    boolean existsByCorreo(@Email(
            message = "Debe ser un correo electrónico válido") String correo);

    boolean existsByNumeroDocumento(@NotBlank @Pattern(
            regexp = "\\d{7,15}",message = "Debe contener solo números entre 7 y 15 digitos") String s);

    @Query("""
                SELECT e
                FROM Empleado e
                WHERE e.id NOT IN (
                    SELECT DISTINCT c.empleado.id
                    FROM Contrato c
                )
                ORDER BY e.apellidos ASC
            """)
    Page<Empleado> findEmpleadosSinContrato(Pageable pageable);

    @Query("""
        SELECT e FROM Empleado e
        JOIN Contrato c ON c.empleado = e AND c.numeroContrato = (
            SELECT MAX(c2.numeroContrato) 
            FROM Contrato c2 
            WHERE c2.empleado = e
        ) AND c.continua = true
        WHERE SIZE(e.familiares) > 0
    """)
    Page<Empleado> findEmpleadosConFamiliares(Pageable pageable);
}