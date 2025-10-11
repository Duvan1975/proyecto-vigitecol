package proyectoVigitecolSpringBoot.domain.familia;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Arrays;
import java.util.List;

public interface FamiliarRepository extends JpaRepository<Familiar, Long> {


    @Query("""
            SELECT f FROM Familiar f
            JOIN f.empleado e
            JOIN e.contratos c
            WHERE e.id = :empleadoId
            AND c.numeroContrato = (
                SELECT MAX(c2.numeroContrato)
                FROM Contrato c2
                WHERE c2.empleado.id = e.id
            )
            AND c.continua = true
            """)
    List<Familiar> findFamiliaresByEmpleadoActivo(Long empleadoId);

    List<Familiar> findByEmpleadoId(Long id);
}
