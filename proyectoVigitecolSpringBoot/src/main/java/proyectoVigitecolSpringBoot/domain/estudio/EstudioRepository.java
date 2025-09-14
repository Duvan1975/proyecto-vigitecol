package proyectoVigitecolSpringBoot.domain.estudio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Arrays;
import java.util.List;

public interface EstudioRepository extends JpaRepository<Estudio, Long> {

    @Query("""
            SELECT e1 FROM Estudio e1
            JOIN e1.empleado e
            JOIN e.contratos c
            WHERE e.id = :empleadoId
            AND c.numeroContrato = (
                SELECT MAX(c2.numeroContrato)
                FROM Contrato c2
                WHERE c2.empleado.id = e.id
            )
            AND c.continua = true
            """)
    List<Estudio> findEstudiosByEmpleadoActivo(Long empleadoId);

    List<Estudio> findByEmpleadoId(Long id);
}
