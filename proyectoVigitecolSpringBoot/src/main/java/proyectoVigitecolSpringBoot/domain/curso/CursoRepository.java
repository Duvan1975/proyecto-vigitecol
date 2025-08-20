package proyectoVigitecolSpringBoot.domain.curso;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CursoRepository extends JpaRepository<Curso, Long> {

    @Query("""
            SELECT c1 FROM Curso c1
            JOIN c1.empleado e
            JOIN e.contratos c
            WHERE e.id = :empleadoId
            AND c.numeroContrato = (
                SELECT MAX(c2.numeroContrato)
                FROM Contrato c2
                WHERE c2.empleado.id = e.id
            )
            AND c.continua = true
            """)
    List<Curso> findCursosByEmpleadoActivo(Long empleadoId);
}
