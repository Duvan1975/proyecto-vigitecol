package proyectoVigitecolSpringBoot.domain.experienciaLaboral;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Arrays;
import java.util.List;

public interface ExperienciaLaboralRepository extends JpaRepository<ExperienciaLaboral, Long> {

    @Query("""
            SELECT ex FROM ExperienciaLaboral ex
            JOIN ex.empleado e
            JOIN e.contratos c
            WHERE e.id = :empleadoId
            AND c.numeroContrato = (
                SELECT MAX(c2.numeroContrato)
                FROM Contrato c2
                WHERE c2.empleado.id = e.id
            )
            AND c.continua = true
            """)
    List<ExperienciaLaboral> findExperienciaLaboralByEmpleadoActivo(Long empleadoId);

    List<ExperienciaLaboral> findByEmpleadoId(Long id);
}
