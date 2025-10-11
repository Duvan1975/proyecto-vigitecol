package proyectoVigitecolSpringBoot.domain.otroDocumento;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Arrays;
import java.util.List;

public interface OtroDocumentoRepository extends JpaRepository<OtroDocumento, Long> {

    @Query("""
            SELECT d FROM OtroDocumento d
            JOIN d.empleado e
            JOIN e.contratos c
            WHERE e.id = :empleadoId
            AND c.numeroContrato = (
                SELECT MAX(c2.numeroContrato)
                FROM Contrato c2
                WHERE c2.empleado.id = e.id
            )
            AND c.continua = true
            """)
    List<OtroDocumento> findDocumentosByEmpleadoActivo(Long empleadoId);

    List<OtroDocumento> findByEmpleadoId(Long id);
}
