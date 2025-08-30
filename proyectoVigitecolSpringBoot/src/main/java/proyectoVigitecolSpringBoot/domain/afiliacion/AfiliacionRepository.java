package proyectoVigitecolSpringBoot.domain.afiliacion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AfiliacionRepository extends JpaRepository<Afiliacion, Long> {

    @Query("""
            SELECT af FROM Afiliacion af
            JOIN af.empleado e
            JOIN e.contratos c
            WHERE e.id = :empleadoId
            AND c.numeroContrato = (
                SELECT MAX(c2.numeroContrato)
                FROM Contrato c2
                WHERE c2.empleado.id = e.id
            )
            AND c.continua = true
            """)
    List<Afiliacion> findAfiliacionByEmpleadoActivo(Long empleadoId);
}
